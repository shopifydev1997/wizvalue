import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CoinTransaction {
  id: string;
  date: string;
  amount: number;
  type: 'earned' | 'redeemed';
  description: string;
  orderAmount?: number;
}

interface CoinWalletContextType {
  coins: number;
  transactions: CoinTransaction[];
  addCoins: (amount: number, description: string, orderAmount?: number) => void;
  redeemCoins: (amount: number, description: string) => boolean;
  calculateCoinsForAmount: (amount: number) => number;
  claimDailyBonus: () => { success: boolean; message: string };
  lastClaimDate: string | null;
}

const STORAGE_KEY_COINS = 'wiz_device_coins_pocket_v3';
const STORAGE_KEY_HISTORY = 'wiz_device_coins_history_v3';
const STORAGE_KEY_DAILY_CLAIM = 'wiz_device_coin_daily_claim_v3';

const CoinWalletContext = createContext<CoinWalletContextType | undefined>(undefined);

export const CoinWalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [coins, setCoins] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COINS);
      if (saved !== null) {
        const val = parseInt(saved, 10);
        if (!isNaN(val)) return Math.max(0, val);
      }
    } catch {
      // fallback
    }
    return 0; // 1st time user on this device sees 0 Coins in their pocket
  });

  const [transactions, setTransactions] = useState<CoinTransaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // fallback
    }
    return []; // Fresh transaction ledger for new users
  });

  const [lastClaimDate, setLastClaimDate] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_DAILY_CLAIM);
    } catch {
      return null;
    }
  });

  // Calculate: Rs. 50 = 2 Coins
  const calculateCoinsForAmount = (amount: number): number => {
    if (!amount || amount <= 0) return 0;
    // Every Rs. 50 earns 2 Coins
    return Math.floor(amount / 50) * 2;
  };

  const addCoins = (amount: number, description: string, orderAmount?: number) => {
    if (amount <= 0) return;
    const newBalance = coins + amount;
    const newTx: CoinTransaction = {
      id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      date: new Date().toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      amount,
      type: 'earned',
      description,
      orderAmount
    };

    setCoins(newBalance);
    const updatedTx = [newTx, ...transactions];
    setTransactions(updatedTx);

    try {
      localStorage.setItem(STORAGE_KEY_COINS, newBalance.toString());
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updatedTx));
    } catch {
      // ignore
    }
  };

  const redeemCoins = (amount: number, description: string): boolean => {
    if (amount <= 0 || amount > coins) return false;
    const newBalance = coins - amount;
    const newTx: CoinTransaction = {
      id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      date: new Date().toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      amount,
      type: 'redeemed',
      description
    };

    setCoins(newBalance);
    const updatedTx = [newTx, ...transactions];
    setTransactions(updatedTx);

    try {
      localStorage.setItem(STORAGE_KEY_COINS, newBalance.toString());
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updatedTx));
    } catch {
      // ignore
    }
    return true;
  };

  const claimDailyBonus = (): { success: boolean; message: string } => {
    const today = new Date().toISOString().split('T')[0];
    if (lastClaimDate === today) {
      return { success: false, message: 'You have already claimed your daily coins for today! Come back tomorrow.' };
    }

    addCoins(5, 'Daily Check-in Reward (+5 Coins)');
    setLastClaimDate(today);
    try {
      localStorage.setItem(STORAGE_KEY_DAILY_CLAIM, today);
    } catch {
      // ignore
    }
    return { success: true, message: 'Awesome! 5 WiZ Coins added to your wallet.' };
  };

  return (
    <CoinWalletContext.Provider
      value={{
        coins,
        transactions,
        addCoins,
        redeemCoins,
        calculateCoinsForAmount,
        claimDailyBonus,
        lastClaimDate
      }}
    >
      {children}
    </CoinWalletContext.Provider>
  );
};

export const useCoinWallet = (): CoinWalletContextType => {
  const context = useContext(CoinWalletContext);
  if (!context) {
    throw new Error('useCoinWallet must be used within a CoinWalletProvider');
  }
  return context;
};
