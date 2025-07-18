/**
 * 
 * @param tokenAddress 
 * @param privateKey 
 */

import bs58 from 'bs58';
import { Connection,Keypair,VersionedTransaction } from '@solana/web3.js';
import { PumpWalletInfo } from '../types/wallet';

const RPC_ENDPOINT = process.env.RPC_ENDPOINT || 'https://api.mainnet-beta.solana.com';

const PUMP_FUN_API_ENDPOINT = process.env.PUMP_FUN_API_ENDPOINT || 'https://pumpportal.fun';

const connection = new Connection(RPC_ENDPOINT, 'confirmed');

interface BuyPumpTokenParams {
    action: 'buy' | 'sell';
    mint: string;
    denominatedInSol: 'true' | 'false';
    amount: string;
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
export async function buyTokenBySol(caTokeAddress: string, privateKey: string, amount: number, apiKey: string) {

    const publicKey = Keypair.fromSecretKey(bs58.decode(privateKey)).publicKey.toBase58();

    const body: BuyPumpTokenParams = {
        action: 'buy',
        mint: caTokeAddress,
        denominatedInSol: 'true',
        amount: amount.toString(),
        slippage: 0.5,
        priorityFee: 0.00001,
        pool: 'auto'
    }

    try{

        console.log('发送交易请求', body);

        const response = await fetch(`${PUMP_FUN_API_ENDPOINT}/api/trade?api-key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (response.status === 200) {
            //打印响应内容
            const data = await response.json();
            console.log('交易响应:', data);
            //
        }else{
            console.error(`❌ 发送交易失败: ${response.statusText}`);
        }

    }catch(error) {
        console.error('⛔ 发送交易出错:', error);
    }
}

//sell卖出
export async function sellTokenBySol(caTokeAddress: string, publicKey: string, amount: number, apiKey: string) {

    const body: BuyPumpTokenParams = {
        action: 'sell',
        mint: caTokeAddress,
        denominatedInSol: 'false',
        amount: amount.toString() + "%",
        slippage: 10,
        priorityFee: 0.001,
        pool: 'auto'
    }

    try {
        const response = await fetch(`${PUMP_FUN_API_ENDPOINT}/api/trade?api-key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (response.status === 200) {
            const data = await response.json();
            console.log('交易响应:', data);
        } else {
            console.error(`❌ 发送交易失败: ${response.statusText}`);
        }
    } catch (error) {
        console.error('⛔ 发送交易出错:', error);
    }
}

//生成pump钱包
export async function generatePumpWallet() : Promise<PumpWalletInfo> {
    const response = await fetch(`${PUMP_FUN_API_ENDPOINT}/api/create-wallet`, {
        method: 'GET'
    });

    if (response.status === 200) {
        const data = await response.json();
        //将data转换为PumpWalletInfo类型
        const walletInfo: PumpWalletInfo = {
            apiKey: data.apiKey,
            privateKey: data.privateKey,
            walletPublicKey: data.walletPublicKey,
            checked: false,
        };
        return walletInfo;
    } else {
        throw new Error(`Failed to generate wallet: ${response.statusText}`);
    }
}

