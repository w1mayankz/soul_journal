'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export type Trade = { 
  id: number; 
  date: string; 
  symbol: string; 
  side: string; 
  pnl: number 
};

const TradesContext = createContext<{
  trades: Trade[];
  addTrade: (trade: Trade) => void;
} | null>(null);

export function TradesProvider({ children }: { children: ReactNode }) {
  // Initialized completely empty—no dummy data
  const [trades, setTrades] = useState<Trade[]>([]);

  const addTrade = (trade: Trade) => {
    setTrades(prev => [trade, ...prev]);
  };

  return (
    <TradesContext.Provider value={{ trades, addTrade }}>
      {children}
    </TradesContext.Provider>
  );
}

export const useTrades = () => {
  const ctx = useContext(TradesContext);
  if (!ctx) throw new Error("useTrades must be used within TradesProvider");
  return ctx;
};
