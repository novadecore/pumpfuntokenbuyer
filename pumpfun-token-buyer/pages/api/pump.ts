/**
 * 
 * @param tokenAddress 
 * @param privateKey 
 */

import { bs58 } from '@coral-xyz/anchor/dist/cjs/utils/bytes';
import { Connection,Keypair,VersionedTransaction } from '@solana/web3.js';

const RPC_ENDPOINT = process.env.RPC_ENDPOINT || 'https://api.mainnet-beta.solana.com';

const PUMP_FUN_API_ENDPOINT = process.env.PUMP_FUN_API_ENDPOINT || 'https://pumpportal.fun';

const connection = new Connection(RPC_ENDPOINT, 'confirmed');

interface BuyPumpTokenParams {
    publicKey: string;
    action: 'buy' | 'sell';
    mint: string;
    denominatedInSol: 'true' | 'false';
    amount: number;
    slippage: number;
    priorityFee: number;
    pool: 'pump' | 'raydium' | 'launchlab' | 'raydium-cpmm' | 'bonk' | 'auto';
}

/**
 * 
 * @param caTokeAddress token ca 的地址
 * @param privateKey 钱包地址
 * @param publicKey 钱包地址
 */
export async function buyPumpToken(caTokeAddress: string, privateKey: string, publicKey: string, amount: number) {
    const body: BuyPumpTokenParams = {
        publicKey: publicKey,
        action: 'buy',
        mint: caTokeAddress,
        denominatedInSol: 'false',
        amount: amount,
        slippage: 0.5,
        priorityFee: 0.00001,
        pool: 'auto'
    }

    try{
        const response = await fetch(`${PUMP_FUN_API_ENDPOINT}/api/trade-local`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (response.status === 200) {
            const buffer = await response.arrayBuffer();
            const serializedTx = new Uint8Array(buffer);
            const tx = VersionedTransaction.deserialize(serializedTx);
            const signerKeypair = Keypair.fromSecretKey(bs58.decode(privateKey));
            tx.sign([signerKeypair]);
            const signature = await connection.sendTransaction(tx);
            console.log(`✅ 成功发送交易: https://solscan.io/tx/${signature}`);
        }else{
            console.error(`❌ 发送交易失败: ${response.statusText}`);
        }

    }catch(error) {
        console.error('⛔ 发送交易出错:', error);
    }
}