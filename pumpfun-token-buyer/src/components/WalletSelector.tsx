import React, { useState } from 'react';
import styles from '../../styles/trade.module.scss';
import { Button, Input, Segmented, Select, Checkbox, message, Modal } from 'antd';
import { AntDesignOutlined } from '@ant-design/icons';
import { useWalletStore } from '../store/walletstore';
import { buyTokenBySol ,generatePumpWallet} from '../api/pump';
import { PumpWalletInfo } from '../types/wallet';

export default function WalletSelector() {

    const [open, setOpen] = useState(false);
    
    const [confirmLoading, setConfirmLoading] = useState(false);

    const [modalText, setModalText] = useState('Content of the modal');

    const [newWallet, setNewWallet] = useState<PumpWalletInfo | undefined>(undefined);

    const wallets = useWalletStore((state) => state.wallets);
    const removeWallet = useWalletStore((state) => state.removeWallet);
    const clearWallets = useWalletStore((state) => state.clearWallets);
    const walletArray = Object.values(wallets);
    const toggleChecked = useWalletStore((s) => s.toggleWalletChecked);

    const createNewWallet = async () => {
        let walletInfo = await generatePumpWallet();
        setNewWallet(walletInfo);
        setModalText(`钱包生成成功！API Key: ${walletInfo.apiKey}, 私钥: ${walletInfo.privateKey}`);
        walletInfo.checked = false;
        useWalletStore.getState().addWallet(walletInfo);
        setOpen(true);
    }

    const handleModalOk = () => {
        setOpen(false);
        setConfirmLoading(true);
        setTimeout(() => {
            setOpen(false);
            setConfirmLoading(false);
        }, 2000);
        //下载钱包信息到txt
        const blob = new Blob([JSON.stringify(newWallet)], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pump_wallet_info_${newWallet?.walletPublicKey}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setNewWallet(undefined);
    };

    return (
        <div className={styles.walletContainer}>
            <Modal
                title="生成钱包"
                open={open}
                onOk={handleModalOk}
                confirmLoading={confirmLoading}
            >
                <p>{modalText}</p>
            </Modal>
            <div className={styles.walletTitle}>
                Four.Meme 批量内盘买币工具
            </div>
            {
                walletArray.map((wallet) => (

                    <div key={wallet.walletPublicKey} className={styles.walletRow}>
                        <Checkbox
                            className={styles.walletCheckbox}
                            checked={wallet.checked}
                            onChange={(e) => toggleChecked(wallet.walletPublicKey, e.target.checked)}
                        >
                        </Checkbox>
                        <Input
                            placeholder="请输入钱包私钥"
                            value={wallet.walletPublicKey}
                            className={styles.walletInput}
                        />
                    </div>

                ))
            }
            <div>
                <Button type="primary" icon={<AntDesignOutlined />} onClick={createNewWallet} className={styles.addWalletButton}>
                    生成钱包 {walletArray.length}
                </Button>
            </div>
        </div>
    );
}