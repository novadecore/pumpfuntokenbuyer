import { create } from 'zustand';

import {PumpWalletInfo} from '../types/wallet';
import { persist } from 'zustand/middleware';


interface WalletStore {
    wallets: Record<string,PumpWalletInfo>;
    addWallet: (wallet: PumpWalletInfo) => void;
    removeWallet: (publicKey: string) => void;
    clearWallets: () => void;
    toggleWalletChecked: (publicKey: string, checked: boolean) => void;
    getSelectWallets: () => PumpWalletInfo[];
}

export const useWalletStore = create<WalletStore>()(
  persist(
    (set,get) => ({
      wallets: {},
      addWallet: (wallet) => {
        const current = get().wallets;
        set({
          wallets: {
            ...current,
            [wallet.walletPublicKey]: wallet,
          },
        });
      },

      removeWallet: (publicKey) => {
        const current = { ...get().wallets };
        delete current[publicKey];
        set({ wallets: current });
      },

      clearWallets: () => {
        set({ wallets: {} });
      },

      getSelectWallets: () => {
        return Object.values(get().wallets).filter(wallet => wallet.checked);
      },

      toggleWalletChecked: (publicKey, checked) => {
        const current = get().wallets;
        const target = current[publicKey];
        if (target) {
          set({
            wallets: {
              ...current,
              [publicKey]: {
                ...target,
                checked,
              },
            },
          });
        }
      },
    }),
    {
      name: 'wallet-storage',
    }
  )
);
