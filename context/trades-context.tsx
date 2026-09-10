'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export type Trade = { 
  id: number; 
  accountId?: number; // Added to link trades to specific accounts later
  date: string; 
  symbol: string; 
  side: string; 
  pnl: number 
};

export type Account = {
  id: number;
  name: string;
  initialBalance: number;
  currentBalance: number;
  accountType: string;
  breakeven: string;
  isStarred: boolean;
};

const TradesContext = createContext<{
  trades: Trade[];
  addTrade: (trade: Trade) => void;
  accounts: Account[];
  addAccount: (account: Account) => void;
  toggleStarAccount: (id: number) => void;
} | null>(null);

export function TradesProvider({ children }: { children: ReactNode }) {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);

  const addTrade = (trade: Trade) => {
    setTrades(prev => [trade, ...prev]);
  };

  const addAccount = (account: Account) => {
    setAccounts(prev => {
      // If this is the first account, auto-star it
      if (prev.length === 0) account.isStarred = true;
      return [...prev, account];
    });
  };

  const toggleStarAccount = (id: number) => {
    setAccounts(prev => prev.map(acc => ({
      ...acc,
      isStarred: acc.id === id // Unstars all others, stars the selected one
    })));
  };

  return (
    <TradesContext.Provider value={{ trades, addTrade, accounts, addAccount, toggleStarAccount }}>
      {children}
    </TradesContext.Provider>
  );
}

export const useTrades = () => {
  const ctx = useContext(TradesContext);
  if (!ctx) throw new Error("useTrades must be used within TradesProvider");
  return ctx;
};
