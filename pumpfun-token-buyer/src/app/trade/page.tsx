'use client';

import React, { useState } from 'react';
import styles from '../../../styles/trade.module.scss';
import { Button, Input, Segmented, Select, Checkbox, message, Modal } from 'antd';
import { AntDesignOutlined } from '@ant-design/icons';
import { buyTokenBySol ,generatePumpWallet,sellTokenBySol} from '../../api/pump';
import { PumpWalletInfo } from '../../types/wallet';
import { useWalletStore } from '../../store/walletstore';
import WalletSelector from '../../components/WalletSelector';


interface WalletRowInfo {
  privateKey: string;
  checked: boolean;
}

//定义一个钱包的信息结构体

export default function WalletTradePage() {

    const [messageApi, contextHolder] = message.useMessage();

    const [tradeAction,setTradeAction] = useState('buy');

    const [coin, setCoin] = useState('BNB');

    const [tradeNum, setTradeNum] = useState('');

    const [tokenAddress, setTokenAddress] = useState('');

    const [newWallet, setNewWallet] = useState<PumpWalletInfo | undefined>(undefined);

    const wallets = useWalletStore((state) => state.wallets);
    const selectedWallets = useWalletStore((state) => state.getSelectWallets);

    const handleTrade = async () => {
        // 这里可以添加交易逻辑
        const tradeWallets = selectedWallets();

        console.log('选中的钱包', tradeWallets);

        if (tradeWallets.length === 0) {
            messageApi.open({
                type: 'error',
                content: '请至少选择一个钱包并输入私钥',
            });
            return;
        }

        if (!tokenAddress.trim()) {
            messageApi.open({
                type: 'error',
                content: '请输入代币地址（mint）',
            });
            return;
        }

        if(coin === 'BNB' || coin === 'ETH') {
            messageApi.open({
                type: 'error',
                content: 'BNB和ETH暂不支持买入',
            });
            return;
        }

        if (!tradeNum || isNaN(Number(tradeNum)) || Number(tradeNum) <= 0) {
            messageApi.open({
                type: 'error',
                content: '请输入有效的交易数量',
            });
            return;
        }

        tradeWallets.forEach(async wallet => {
            if (tradeAction === 'buy') {
                console.log('执行交易', {
                    wallets: wallet.walletPublicKey,
                    action: tradeAction,
                    coin,
                    tradeNum,
                    tokenAddress,
                });
                await buyTokenBySol(tokenAddress, wallet.privateKey, Number(tradeNum), wallet.apiKey);
            }else if (tradeAction === 'sell') {
                console.log('执行卖出交易', {
                    wallets: wallet.walletPublicKey,
                    action: tradeAction,
                    coin,
                    tradeNum,
                    tokenAddress,
                });
                await sellTokenBySol(tokenAddress, wallet.walletPublicKey, 100, wallet.apiKey);
            }
        });
    }
    
    return (
        <div className={styles.tradePage}>
            {contextHolder}
            <WalletSelector/>
            <div className={styles.tradeContainer}>
                <Segmented
                        value={tradeAction}
                        onChange={setTradeAction}
                        options={['buy', 'sell']}
                    />
                <div className={styles.inputRow} style={{ marginLeft: '1rem' }}>
                    <Input
                        placeholder="请输入代币地址（mint）"
                        value={tokenAddress}
                        onChange={(e) => setTokenAddress(e.target.value)}
                    />
                </div>

                <div className={styles.inputRow}>
                    <Select
                        placeholder="选择交易币种"
                        value={coin}
                        onChange={(value) => setCoin(value)}
                        options={[
                            { label: 'BNB', value: 'BNB' },
                            { label: 'ETH', value: 'ETH' },
                            { label: 'SOL', value: 'SOL' },
                        ]}
                    />
                </div>

                <div className={styles.inputRow}>
                    <Input
                        placeholder="请输入交易数量"
                        value={tradeNum}
                        onChange={(e) => setTradeNum(e.target.value)}
                        type="number"
                    />
                </div>
                <div className={styles.inputRow}>
                    <Button type="primary" size="large" icon={<AntDesignOutlined />} onClick={handleTrade}>
                        执行买入
                    </Button>
                </div>
            </div>
        </div>
    );
}