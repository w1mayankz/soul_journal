'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export type Trade = { 
  id: number; 
  accountId?: number; 
  date: string; 
  symbol: string; 
  side: string; 
  pnl: number;
  strategy?: string;
};

export type Account = {
  id: number;
  name: string;
  initialBalance: number;
  currentBalance: number;
  accountType: string;
  breakeven: string;
  isStarred: boolean;
  isArchived?: boolean;
};

export type Strategy = {
  id: number;
  name: string;
  description: string;
  confluences: { id: number; value: string }[];
};

const TradesContext = createContext<{
  trades: Trade[];
  addTrade: (trade: Trade) => void;
  accounts: Account[];
  addAccount: (account: Account) => void;
  updateAccount: (account: Account) => void;
  deleteAccount: (id: number) => void;
  toggleArchiveAccount: (id: number) => void;
  toggleStarAccount: (id: number) => void;
  activeAccountId: number | null;
  setActiveAccount: (id: number) => void;
  
  strategies: Strategy[];
  addStrategy: (strategy: Strategy) => void;
  updateStrategy: (strategy: Strategy) => void;
  deleteStrategy: (id: number) => void;
} | null>(null);

export function TradesProvider({ children }: { children: ReactNode }) {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [activeAccountId, setActiveAccountId] = useState<number | null>(null);
  const [strategies, setStrategies] = useState<Strategy[]>([]);

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
      return [...prev, { ...account, isArchived: false }];
    });
  };

  const updateAccount = (updatedAccount: Account) => {
    setAccounts(prev => prev.map(acc => acc.id === updatedAccount.id ? updatedAccount : acc));
  };

  const deleteAccount = (id: number) => {
    setAccounts(prev => prev.filter(acc => acc.id !== id));
    if (activeAccountId === id) setActiveAccountId(null);
  };

  const toggleArchiveAccount = (id: number) => {
    setAccounts(prev => prev.map(acc => 
      acc.id === id ? { ...acc, isArchived: !acc.isArchived } : acc
    ));
    if (activeAccountId === id) setActiveAccountId(null);
  };

  const toggleStarAccount = (id: number) => {
    setAccounts(prev => prev.map(acc => 
      acc.id === id ? { ...acc, isStarred: !acc.isStarred } : acc
    ));
  };

  const addStrategy = (strategy: Strategy) => {
    setStrategies(prev => [...prev, strategy]);
  };

  // ADDED: Update Strategy
  const updateStrategy = (updatedStrategy: Strategy) => {
    setStrategies(prev => prev.map(s => s.id === updatedStrategy.id ? updatedStrategy : s));
  };

  // ADDED: Delete Strategy
  const deleteStrategy = (id: number) => {
    setStrategies(prev => prev.filter(s => s.id !== id));
  };

  return (
    <TradesContext.Provider value={{ 
      trades, 
      addTrade, 
      accounts, 
      addAccount, 
      updateAccount,
      deleteAccount,
      toggleArchiveAccount,
      toggleStarAccount, 
      activeAccountId, 
      setActiveAccount: setActiveAccountId,
      strategies,
      addStrategy,
      updateStrategy,
      deleteStrategy
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
