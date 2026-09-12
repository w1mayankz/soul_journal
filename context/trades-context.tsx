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

// NOTEBOOK TYPES
export type Folder = {
  id: string;
  name: string;
  icon: string;
  color: string;
  isSystem: boolean;
};

export type Note = {
  id: string;
  folderId: string;
  title: string;
  body: string;
  createdAt: string;
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

  // NOTEBOOK STATE
  folders: Folder[];
  addFolder: (folder: Folder) => void;
  updateFolder: (folder: Folder) => void;
  deleteFolder: (id: string) => void;
  
  notes: Note[];
  addNote: (note: Note) => void;
  updateNote: (note: Note) => void;
  deleteNote: (id: string) => void;
} | null>(null);

const DEFAULT_SYSTEM_FOLDERS: Folder[] = [
  { id: 'all-notes', name: 'All Notes', icon: 'Folder01Icon', color: '#A3A3A3', isSystem: true },
  { id: 'daily-journal', name: 'Daily Journal', icon: 'Folder01Icon', color: '#A3A3A3', isSystem: true }
];

export function TradesProvider({ children }: { children: ReactNode }) {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [activeAccountId, setActiveAccountId] = useState<number | null>(null);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  
  // NOTEBOOK STATE
  const [folders, setFolders] = useState<Folder[]>(DEFAULT_SYSTEM_FOLDERS);
  const [notes, setNotes] = useState<Note[]>([]);

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

  const updateAccount = (updatedAccount: Account) => setAccounts(prev => prev.map(acc => acc.id === updatedAccount.id ? updatedAccount : acc));
  const deleteAccount = (id: number) => {
    setAccounts(prev => prev.filter(acc => acc.id !== id));
    if (activeAccountId === id) setActiveAccountId(null);
  };
  const toggleArchiveAccount = (id: number) => {
    setAccounts(prev => prev.map(acc => acc.id === id ? { ...acc, isArchived: !acc.isArchived } : acc));
    if (activeAccountId === id) setActiveAccountId(null);
  };
  const toggleStarAccount = (id: number) => setAccounts(prev => prev.map(acc => acc.id === id ? { ...acc, isStarred: !acc.isStarred } : acc));

  const addStrategy = (strategy: Strategy) => setStrategies(prev => [...prev, strategy]);
  const updateStrategy = (updatedStrategy: Strategy) => setStrategies(prev => prev.map(s => s.id === updatedStrategy.id ? updatedStrategy : s));
  const deleteStrategy = (id: number) => setStrategies(prev => prev.filter(s => s.id !== id));

  // NOTEBOOK FUNCTIONS
  const addFolder = (folder: Folder) => setFolders(prev => [...prev, folder]);
  const updateFolder = (updated: Folder) => setFolders(prev => prev.map(f => f.id === updated.id ? updated : f));
  const deleteFolder = (id: string) => setFolders(prev => prev.filter(f => f.id !== id));

  const addNote = (note: Note) => setNotes(prev => [...prev, note]);
  const updateNote = (updated: Note) => setNotes(prev => prev.map(n => n.id === updated.id ? updated : n));
  const deleteNote = (id: string) => setNotes(prev => prev.filter(n => n.id !== id));

  return (
    <TradesContext.Provider value={{ 
      trades, addTrade, accounts, addAccount, updateAccount, deleteAccount,
      toggleArchiveAccount, toggleStarAccount, activeAccountId, setActiveAccount,
      strategies, addStrategy, updateStrategy, deleteStrategy,
      folders, addFolder, updateFolder, deleteFolder,
      notes, addNote, updateNote, deleteNote
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
