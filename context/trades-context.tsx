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
  // Pre-loaded with your two initial trades
  const [trades, setTrades] = useState<Trade[]>([
    { id: 1, date: '2026/09/09 15:53', symbol: 'NAS100', side: 'buy', pnl: 861 },
    { id: 2, date: '2026/09/03 09:53', symbol: 'NQ1!', side: 'buy', pnl: 640 }
  ]);

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
