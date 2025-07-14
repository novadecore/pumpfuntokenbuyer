'use client';

import React, { useState } from 'react';
import styles from '../../../styles/trade.module.scss';
import { Button, Input, Segmented, Select, Checkbox } from 'antd';

interface WalletRowInfo {
  privateKey: string;
  checked: boolean;
}

export default function WalletTradePage() {

    const [wallets, setWallets] = useState<WalletRowInfo[]>(
        [
            { privateKey: '', checked: false },
            { privateKey: '', checked: false },
            { privateKey: '', checked: false },
            { privateKey: '', checked: false },
            { privateKey: '', checked: false },
        ]
    );

    const [tradeAction,setTradeAction] = useState('buy');

    const addWallet = () => {
        setWallets([...wallets, { privateKey: '', checked: false }]);
    }

    const [coin, setCoin] = useState('BNB');

    const [tradeNum, setTradeNum] = useState('');

    const [tokenAddress, setTokenAddress] = useState('');
    
    return (
        <div className={styles.tradePage}>
            <div className={styles.walletContainer}>
                <div className={styles.walletTitle}>
                    Four.Meme 批量内盘买币工具
                </div>
                {
                    wallets.map((wallet, index) => (
                        <div key={index} className={styles.walletRow}>
                            <Checkbox
                                checked={wallet.checked}
                                onChange={(e) => {
                                    const newWallets = [...wallets];
                                    newWallets[index].checked = e.target.checked;
                                    setWallets(newWallets);
                                }}
                                className={styles.walletCheckbox}
                            >
                            </Checkbox>
                            <Input
                                placeholder="请输入钱包私钥"
                                value={wallet.privateKey}
                                onChange={(e) => {
                                    const newWallets = [...wallets];
                                    newWallets[index].privateKey = e.target.value;
                                    setWallets(newWallets);
                                }}
                                className={styles.walletInput}
                            />
                        </div>
                    ))
                }
                <div>
                    <Button type="primary" onClick={addWallet} className={styles.addWalletButton}>
                        添加钱包
                    </Button>
                </div>
            </div>
            <div className={styles.tradeContainer}>
                <Segmented
                        value={tradeAction}
                        onChange={setTradeAction}
                        options={['buy', 'sell']}
                    />
                <div className={styles.inputRow}>
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
            </div>
        </div>
    );
}