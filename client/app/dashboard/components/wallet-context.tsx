import React, { createContext, useContext } from 'react';

export type WalletType = {
  id: string;
  userId: string;
  balance: number;
  currency: string;
};

type WalletContextType = {
  wallet: WalletType | null;
  reloadWallet: () => Promise<void>;
};

export const WalletContext = createContext<WalletContextType>({
  wallet: null,
  reloadWallet: async () => {},
});

export const useWallet = () => useContext(WalletContext);
