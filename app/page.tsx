'use client';

import { useState } from 'react';
import { TopNavbar } from '../components/top-navbar';
import { 
  DollarSquareIcon, 
  Calendar01Icon,
  Calendar02Icon,
  Calendar03Icon,
  Calendar04Icon,
  Appointment01Icon,
  PercentIcon,
  ViewOffSlashIcon,
  ArrowDown01Icon
} from 'hugeicons-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { subDays, subHours, subMonths, subYears, format } from 'date-fns';
import { useTrades } from '../context/trades-context';

export default function Dashboard() {
  const [timeframe, setTimeframe] = useState('Week');
  const [displayView, setDisplayView] = useState('Money View');
  
  const { trades, accounts, activeAccountId } = useTrades();
  
  // Find the globally active account
  const activeAccount = accounts.find(a => a.id === activeAccountId);
  
  // Dynamic Starting Balance based on the specific account selected
  const startingBalance = activeAccount ? activeAccount.initialBalance : 0;
  
  // Filter trades to ONLY calculate PnL for the active account
  const accountTrades = trades.filter(t => t.accountId === activeAccountId);
  const totalRealPnl = accountTrades.reduce((sum, trade) => sum + trade.pnl, 0);
  const totalTradesCount = accountTrades.length;
  
  // Current real live balance
  const realBalance = activeAccount ? activeAccount.currentBalance : 0;

  // --- STATS LOGIC: TOTAL TRADES ---
  const winningTrades = accountTrades.filter(t => t.pnl > 0).length;
  const losingTrades = accountTrades.filter(t => t.pnl < 0).length;
  const breakevenTrades = accountTrades.filter(t => t.pnl === 0).length;

  const tradeBreakdown = [
    { label: 'Winning', count: winningTrades },
    { label: 'Breakeven', count: breakevenTrades },
    { label: 'Losing', count: losingTrades },
  ];

  // --- STATS LOGIC: MOST TRADED ASSETS ---
  const assetCounts = accountTrades.reduce((acc, trade) => {
    acc[trade.symbol] = (acc[trade.symbol] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedAssets = Object.entries(assetCounts).sort((a, b) => b[1] - a[1]);
  const topAssets = sortedAssets.slice(0, 3);
  const topAssetSymbol = topAssets.length > 0 ? topAssets[0][0] : '-';

  const assetRows = [0, 1, 2].map(index => {
    if (topAssets[index]) {
      const [symbol, count] = topAssets[index];
      return { symbol, count, width: totalTradesCount > 0 ? (count / totalTradesCount) * 100 : 0 };
    }
    return { symbol: '-', count: 0, width: 0 };
  });

  const buildEquityCurve = () => {
    const baseDate = new Date();
    const data = [];
    
    // Calculates timeline data strictly using filtered trades and dynamic initial balance
    const getBalanceAtDate = (dateLimit: Date) => {
      const pnl = accountTrades
        .filter(t => new Date(t.date).getTime() <= dateLimit.getTime())
        .reduce((sum, t) => sum + t.pnl, 0);
      return startingBalance + pnl;
    };

    if (timeframe === 'Day') {
      for (let i = 24; i >= 0; i--) {
        const d = subHours(baseDate, i);
        data.push({ time: format(d, 'ha'), value: getBalanceAtDate(d) });
      }
    } else if (timeframe === 'Week') {
      for (let i = 7; i >= 0; i--) {
        const d = subDays(baseDate, i);
        data.push({ time: format(d, 'MMM dd'), value: getBalanceAtDate(d) });
      }
    } else if (timeframe === 'Month') {
      for (let i = 30; i >= 0; i--) {
        const d = subDays(baseDate, i);
        data.push({ time: format(d, 'MMM dd'), value: getBalanceAtDate(d) });
      }
    } else if (timeframe === 'Year') {
      for (let i = 12; i >= 0; i--) {
        const d = subMonths(baseDate, i);
        data.push({ time: format(d, 'MMM yyyy'), value: getBalanceAtDate(d) });
      }
    } else {
      for (let i = 5; i >= 0; i--) {
        const d = subYears(baseDate, i);
        data.push({ time: format(d, 'yyyy'), value: getBalanceAtDate(d) });
      }
    }
    
    // Ensure the final data point perfectly matches current live balance
    data[data.length - 1].value = realBalance;
    
    return data;
  };

  const chartData = buildEquityCurve();

  return (
    <div className="relative min-h-screen bg-black pb-24 font-sans text-white">

      <TopNavbar>
        {/* TIMEFRAME DROPDOWN (ONLY ON DASHBOARD) */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger className="flex h-10 items-center gap-1.5 rounded-xl bg-[#141414] px-3 text-[14px] font-medium text-neutral-300 hover:bg-[#222] transition-colors active:scale-95 outline-none">
            {timeframe}
            <ArrowDown01Icon size={16} className="text-white" />
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content 
              align="end"
              className="z-50 min-w-[160px] overflow-hidden rounded-xl border border-neutral-800 bg-[#0A0A0A]/90 backdrop-blur-xl p-1 shadow-2xl text-white text-[15px] animate-in fade-in-80 zoom-in-95 data-[side=bottom]:slide-in-from-top-2"
            >
              <DropdownMenu.Item onClick={() => setTimeframe('Day')} className="flex items-center gap-2 rounded-lg px-3 py-2.5 outline-none hover:bg-[#1A1A1A] cursor-pointer">
                <Calendar01Icon size={18} className="text-neutral-400" /> Day
              </DropdownMenu.Item>
              <DropdownMenu.Item onClick={() => setTimeframe('Week')} className="flex items-center gap-2 rounded-lg px-3 py-2.5 outline-none hover:bg-[#1A1A1A] cursor-pointer">
                <Calendar03Icon size={18} className="text-neutral-400" /> Week
              </DropdownMenu.Item>
              <DropdownMenu.Item onClick={() => setTimeframe('Month')} className="flex items-center gap-2 rounded-lg px-3 py-2.5 outline-none hover:bg-[#1A1A1A] cursor-pointer">
                <Calendar02Icon size={18} className="text-neutral-400" /> Month
              </DropdownMenu.Item>
              <DropdownMenu.Item onClick={() => setTimeframe('Year')} className="flex items-center gap-2 rounded-lg px-3 py-2.5 outline-none hover:bg-[#1A1A1A] cursor-pointer">
                <Calendar04Icon size={18} className="text-neutral-400" /> Year
              </DropdownMenu.Item>
              <DropdownMenu.Item onClick={() => setTimeframe('All Time')} className="flex items-center gap-2 rounded-lg px-3 py-2.5 outline-none hover:bg-[#1A1A1A] cursor-pointer">
                <Appointment01Icon size={18} className="text-neutral-400" /> All Time
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        {/* PNL VIEW TOGGLE DROPDOWN */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#141414] text-neutral-300 hover:bg-[#222] transition-colors active:scale-95 outline-none">
            <DollarSquareIcon size={22} />
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content 
              align="end"
              className="z-50 min-w-[200px] overflow-hidden rounded-xl border border-neutral-800 bg-[#0A0A0A]/90 backdrop-blur-xl p-1 shadow-2xl text-white text-[15px] animate-in fade-in-80 zoom-in-95 data-[side=bottom]:slide-in-from-top-2"
            >
              <DropdownMenu.Item onClick={() => setDisplayView('Money View')} className="flex items-center justify-between rounded-lg px-3 py-2.5 outline-none hover:bg-[#1A1A1A] cursor-pointer">
                Money View <DollarSquareIcon size={18} className="text-neutral-400" />
              </DropdownMenu.Item>
              <DropdownMenu.Item onClick={() => setDisplayView('Percentage View')} className="flex items-center justify-between rounded-lg px-3 py-2.5 outline-none hover:bg-[#1A1A1A] cursor-pointer">
                Percentage View <PercentIcon size={18} className="text-neutral-400" />
              </DropdownMenu.Item>
              <DropdownMenu.Item onClick={() => setDisplayView('Hide P&L')} className="flex items-center justify-between rounded-lg px-3 py-2.5 outline-none hover:bg-[#1A1A1A] cursor-pointer">
                Hide P&L <ViewOffSlashIcon size={18} className="text-neutral-400" />
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </TopNavbar>      

      {/* HEADER SECTION */}
      <section className="mt-6 px-5">
        <h1 className="text-[26px] font-medium tracking-tight">
          Welcome back, cow
        </h1>
        <p className="mt-[1px] text-[15px] font-semibold text-neutral-600 tracking-tight leading-none">
          {format(new Date(), 'EEE dd MMM, yyyy')}
        </p>
      </section>

      {/* MAIN CHART CARD */}
      <section className="mt-4 px-5">
        <div className="rounded-2xl border border-neutral-800/60 bg-[#0A0A0A] pt-3 pr-3 pl-3 pb-1 overflow-hidden">
          
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[15px] font-semibold tracking-tight text-neutral-600">
                Account Balance
              </p>
              <h2 className="mt-[1px] text-[26px] font-medium tracking-tight">
                {displayView === 'Hide P&L' ? '******' : `$${realBalance.toLocaleString()}`}
              </h2>
              <p className="mt-[1px] text-[15px] font-semibold tracking-tight text-neutral-600">
                Last {timeframe === 'Day' ? '24 Hours' : timeframe === 'Week' ? '7 Days' : timeframe === 'Month' ? '30 Days' : timeframe}
              </p>
            </div>
            {displayView !== 'Hide P&L' && totalRealPnl !== 0 && (
              <div className={`flex items-center rounded-md px-2 py-1 text-base font-medium tracking-tight ${totalRealPnl > 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                {totalRealPnl > 0 ? '+' : '-'}${Math.abs(totalRealPnl).toLocaleString()}
              </div>
            )}
          </div>

          {/* RECHARTS AREA CHART */}
          <div className="mt-6 h-[180px] -mx-5">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#009C00" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#009C00" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="time" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#737373', fontSize: 11 }}
                  minTickGap={35} 
                  dy={10}
                />
                <YAxis 
                  domain={['dataMin - 100', 'dataMax + 100']} 
                  hide 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#141414', borderColor: '#262626', borderRadius: '8px', color: '#fff', fontSize: '13px' }}
                  itemStyle={{ color: '#009C00' }}
                  formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Balance']}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#009C00" 
                  strokeWidth={2}
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* METRICS CARDS ROW */}
      <section className="mt-3 px-5">
        <div className="grid grid-cols-2 gap-3">
          
          {/* MOST TRADED ASSETS */}
          <div className="flex flex-col rounded-2xl border border-neutral-800/60 bg-[#090909] pt-3 pr-3 pl-3 pb-5">
            <span className="text-[15px] font-semibold text-neutral-600 tracking-tight">Most Traded Assets</span>
            <span className="mt-0.5 text-[26px] font-medium tracking-tight text-white">{topAssetSymbol}</span>
            
            <div className="mt-4 flex flex-col gap-3">
              {assetRows.map((row, idx) => (
                <div key={idx} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-[14px] font-medium">
                    <span className="text-neutral-400">{row.symbol}</span>
                    <span className="text-white">{row.count > 0 ? row.count : '-'}</span>
                  </div>
                  <div className="h-[2px] w-full rounded-full bg-[#1F1F1F] overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-white transition-all duration-500" 
                      style={{ width: `${row.width}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TOTAL TRADES */}
          <div className="flex flex-col rounded-2xl border border-neutral-800/60 bg-[#090909] pt-3 pr-3 pl-3 pb-5">
            <span className="text-[15px] font-semibold tracking-tight text-neutral-600">Total Trades</span>
            <span className="mt-0.5 text-[26px] font-medium tracking-tight text-white">{totalTradesCount}</span>
            
            <div className="mt-4 flex flex-col gap-3">
              {tradeBreakdown.map((row, idx) => {
                const width = totalTradesCount > 0 ? (row.count / totalTradesCount) * 100 : 0;
                return (
                  <div key={idx} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-[14px] font-medium">
                      <span className="text-neutral-400">{row.label}</span>
                      <span className="text-white">{row.count > 0 ? row.count : '-'}</span>
                    </div>
                    <div className="h-[2px] w-full rounded-full bg-[#1F1F1F] overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-white transition-all duration-500" 
                        style={{ width: `${width}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>
      
    </div>
  );
}
