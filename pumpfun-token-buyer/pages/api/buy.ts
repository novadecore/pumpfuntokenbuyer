// 文件路径：/pages/api/buy.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { Connection, Keypair, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { AnchorProvider, BN, Program, setProvider, Wallet } from '@coral-xyz/anchor';
import {
  getAssociatedTokenAddressSync,
  createAssociatedTokenAccountInstruction,
  getAccount,
} from '@solana/spl-token';
import bs58 from 'bs58';
import pumpFunIdl from '../../../idl/pump_fun_idl.json';

const PROGRAM_ID = new PublicKey('4pmpfUnbqu6eHxKJ1LZcKFFpcuUgKVy7EKm2zLGD8Nfe'); // pump.fun 主合约

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: '仅支持 POST 请求' });

  const { mint, solAmount, privateKey } = req.body;
  if (!mint || !solAmount || !privateKey) return res.status(400).json({ error: '参数不完整' });

  try {
    const keypair = Keypair.fromSecretKey(bs58.decode(privateKey));
    const connection = new Connection('https://api.mainnet-beta.solana.com');

    const wallet = new Wallet(keypair);
    const provider = new AnchorProvider(connection, wallet, {});
    setProvider(provider);

    const program = new Program(pumpFunIdl as any, PROGRAM_ID, provider);

    const user = wallet.publicKey;
    const tokenMint = new PublicKey(mint);
    const quoteMint = new PublicKey('So11111111111111111111111111111111111111112'); // Wrapped SOL

    const [tokenManager] = PublicKey.findProgramAddressSync([
      Buffer.from('token_manager'),
      tokenMint.toBuffer(),
    ], program.programId);

    const [quoteVault] = PublicKey.findProgramAddressSync([
      Buffer.from('quote_vault'),
      tokenManager.toBuffer(),
    ], program.programId);

    const userQuoteAta = getAssociatedTokenAddressSync(quoteMint, user);
    const userTargetAta = getAssociatedTokenAddressSync(tokenMint, user);

    const instructions = [];

    try {
      await getAccount(connection, userQuoteAta);
    } catch {
      instructions.push(
        createAssociatedTokenAccountInstruction(keypair.publicKey, userQuoteAta, user, quoteMint)
      );
    }

    try {
      await getAccount(connection, userTargetAta);
    } catch {
      instructions.push(
        createAssociatedTokenAccountInstruction(keypair.publicKey, userTargetAta, user, tokenMint)
      );
    }

    const methodIx = await program.methods.buy(
      new BN(solAmount * 1e9),
      new BN(0),
    ).accounts({
      user,
      tokenMint,
      tokenManager,
      quoteMint,
      quoteVault,
      userQuoteAta,
      userTargetAta,
      systemProgram: SystemProgram.programId,
    }).instruction();

    const tx = new Transaction().add(...instructions, methodIx);
    tx.feePayer = keypair.publicKey;
    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

    const signature = await connection.sendTransaction(tx, [keypair]);
    return res.status(200).json({ txSig: signature });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || '交易失败' });
  }
}
