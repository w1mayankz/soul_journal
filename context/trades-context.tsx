'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export type Trade = { 
  id: number; 
  accountId?: number; 
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
  updateAccount: (account: Account) => void;
  toggleStarAccount: (id: number) => void;
  activeAccountId: number | null;
  setActiveAccount: (id: number) => void;
} | null>(null);

export function TradesProvider({ children }: { children: ReactNode }) {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [activeAccountId, setActiveAccountId] = useState<number | null>(null);

  const addTrade = (trade: Trade) => {
    if (!activeAccountId) return; 
    const tradeWithAccount = { ...trade, accountId: activeAccountId };
    setTrades(prev => [tradeWithAccount, ...prev]);

    setAccounts(prev => prev.map(acc => 
      acc.id === activeAccountId 
        ? { ...acc, currentBalance: acc.currentBalance + trade.pnl } 
        : acc
    ));
  };

  const addAccount = (account: Account) => {
    setAccounts(prev => {
      if (prev.length === 0) setActiveAccountId(account.id);
      return [...prev, account];
    });
  };

  const updateAccount = (updatedAccount: Account) => {
    setAccounts(prev => prev.map(acc => acc.id === updatedAccount.id ? updatedAccount : acc));
  };

  const toggleStarAccount = (id: number) => {
    setAccounts(prev => prev.map(acc => 
      acc.id === id ? { ...acc, isStarred: !acc.isStarred } : acc
    ));
  };

  return (
    <TradesContext.Provider value={{ 
      trades, 
      addTrade, 
      accounts, 
      addAccount, 
      updateAccount,
      toggleStarAccount, 
      activeAccountId, 
      setActiveAccount: setActiveAccountId 
    }}>
      {children}
    </TradesContext.Provider>
  );
}

export const useTrades = () => {
  const ctx = useContext(TradesContext);
  if (!ctx) throw new Error("useTrades must be used within TradesProvider");
  return ctx;
};
