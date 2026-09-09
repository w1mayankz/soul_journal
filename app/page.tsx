'use client';

import { useState } from 'react';
import { 
  Menu01Icon, 
  DollarSquareIcon, 
  PlusSignIcon,
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
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { subDays, subHours, subMonths, subYears, format } from 'date-fns';

// Dynamic data generation anchored to Sept 9, 2026
const generateChartData = (timeframe: string) => {
  const baseDate = new Date(2026, 8, 9); // Month is 0-indexed (8 = September)
  const data = [];
  
  if (timeframe === 'Day') {
    for (let i = 24; i >= 0; i--) {
      data.push({
        time: format(subHours(baseDate, i), 'ha'),
        value: 50000 + (Math.random() * 1000)
      });
    }
  } else if (timeframe === 'Week') {
    for (let i = 7; i >= 0; i--) {
      data.push({
        time: format(subDays(baseDate, i), 'MMM dd'),
        value: 50000 + (Math.random() * 2000)
      });
    }
  } else if (timeframe === 'Month') {
    for (let i = 30; i >= 0; i--) {
      data.push({
        time: format(subDays(baseDate, i), 'MMM dd'),
        value: 48000 + (Math.random() * 5000)
      });
    }
  } else if (timeframe === 'Year') {
    for (let i = 12; i >= 0; i--) {
      data.push({
        time: format(subMonths(baseDate, i), 'MMM yyyy'),
        value: 40000 + (Math.random() * 15000)
      });
    }
  } else {
    for (let i = 5; i >= 0; i--) {
      data.push({
        time: format(subYears(baseDate, i), 'yyyy'),
        value: 20000 + (Math.random() * 40000)
      });
    }
  }
  
  // Force a specific spike for visual accuracy to the reference screenshot
  data[data.length - 2].value = 50640;
  data[data.length - 1].value = 50640;
  return data;
};

export default function Dashboard() {
  const [timeframe, setTimeframe] = useState('Week');
  const [displayView, setDisplayView] = useState('Money View');
  
  const chartData = generateChartData(timeframe);

  return (
    <div className="relative min-h-screen bg-black pb-24 font-sans text-white">
      
      {/* TOP NAVBAR */}
      <header className="flex h-14 items-center justify-between px-4 pt-2">
        <div className="flex items-center gap-1">
          <button className="flex h-12 w-12 items-center justify-center text-neutral-300 hover:text-white transition-colors active:scale-95">
            <Menu01Icon size={24} />
          </button>
          <span className="text-[17px] font-medium tracking-tight">Dashboard</span>
        </div>
        
        <div className="flex items-center gap-3 pr-1">
          {/* TIMEFRAME DROPDOWN (SHADCN RADIX) */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger className="flex h-10 items-center gap-1.5 rounded-xl bg-[#141414] px-3 text-[14px] font-medium text-neutral-300 hover:bg-[#222] transition-colors active:scale-95 outline-none">
              {timeframe}
              <ArrowDown01Icon size={16} className="text-neutral-500" />
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

          {/* VIEW TOGGLE DROPDOWN (SHADCN RADIX) */}
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
        </div>
      </header>

      {/* HEADER SECTION */}
      <section className="mt-6 px-5">
        <h1 className="text-[26px] font-medium tracking-tight">
          Welcome back, User
        </h1>
        <p className="mt-[2px] text-base font-medium text-neutral-400 tracking-tight">
          Wed 09 Sep, 2026
        </p>
      </section>

      {/* MAIN CHART CARD */}
      <section className="mt-[2px] px-5">
        <div className="rounded-2xl border border-neutral-800/60 bg-[#0A0A0A] p-5 shadow-sm">
          
          <div className="flex items-start justify-between">
            <div>
              <p className="mt-[2px] text-base font-medium tracking-tight text-neutral-400">
                Account Balance
              </p>
              <h2 className="mt-[2px] text-[26px] font-medium tracking-tight">
                {displayView === 'Hide P&L' ? '******' : '$50,640'}
              </h2>
              <p className="mt-[2px] text-base font-medium tracking-tight text-neutral-500">
                Last {timeframe === 'Day' ? '24 Hours' : timeframe === 'Week' ? '7 Days' : timeframe === 'Month' ? '30 Days' : timeframe}
              </p>
            </div>
            {displayView !== 'Hide P&L' && (
              <div className="flex items-center rounded-md bg-green-500/10 px-2 py-1 text-base font-medium tracking-tight text-green-500">
                +$640
              </div>
            )}
          </div>

          {/* RECHARTS AREA CHART */}
          <div className="mt-6 h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22C55E" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
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
                <Tooltip 
                  contentStyle={{ backgroundColor: '#141414', borderColor: '#262626', borderRadius: '8px', color: '#fff', fontSize: '13px' }}
                  itemStyle={{ color: '#22C55E' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#22C55E" 
                  strokeWidth={2}
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* FLOATING ACTION BUTTON */}
      <button 
        className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-xl bg-green-500/15 backdrop-blur-xl border border-green-500/25 text-green-500 shadow-lg shadow-green-500/10 active:scale-95 transition-all z-50"
        aria-label="Log new trade"
      >
        <PlusSignIcon size={28} />
      </button>
      
    </div>
  );
}
