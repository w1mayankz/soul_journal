'use client';

import { useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { TopNavbar } from '../../components/top-navbar';
import { 
  DollarSquareIcon, 
  PlusSignIcon,
  FilterIcon,
  Menu05Icon, 
  ArrowUp02Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  PercentIcon,
  ViewOffSlashIcon
} from 'hugeicons-react';

export default function TradesPage() {
  const [displayView, setDisplayView] = useState('Money View');

  return (
    <div className="relative min-h-screen bg-black pb-24 font-sans text-white">
      
      {/* INJECTS ONLY PNL BUTTON */}
      <TopNavbar>
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

      {/* TRADE LOG CARD */}
      <section className="mt-6 px-4">
        <div className="rounded-2xl border border-neutral-800/60 bg-[#090909] p-4">
          
          {/* Card Header & Controls */}
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h2 className="text-[18px] font-medium tracking-tight">Trade Log</h2>
              <p className="mt-0.5 text-[14px] font-semibold text-neutral-400">Select a trade to view its details</p>
            </div>
            <div className="flex gap-3 text-white">
              <button className="hover:text-white transition-colors active:scale-95 outline-none">
                <Menu05Icon size={18} />
              </button>
              <button className="hover:text-white transition-colors active:scale-95 outline-none">
                <FilterIcon size={18} />
              </button>
            </div>
          </div>

          {/* Table Header (Pill) */}
          <div className="mb-2 grid grid-cols-[1.5fr_1fr_1fr] rounded-xl bg-[#141414] px-4 py-2.5">
            <span className="text-[15px] font-medium text-neutral-600">Entry date</span>
            <span className="text-center text-[15px] font-medium text-neutral-600">Symbol</span>
            <span className="text-right text-[15px] font-medium text-neutral-600">P&L</span>
          </div>

          {/* Dummy Trade Row 1 */}
          <button className="flex w-full grid grid-cols-[1.5fr_1fr_1fr] items-center px-4 py-3 hover:bg-[#141414] transition-colors rounded-xl outline-none group text-left">
            <span className="text-[15px] font-semibold text-neutral-300">
              09/09/2026 15:53
            </span>
            <span className="text-center text-[15px] font-medium text-white">
              NAS100
            </span>
            <div className="flex justify-end">
              <div className="flex items-center gap-1 rounded-md bg-[#009C00]/15 px-2 py-1 text-[15px] font-medium text-[#009C00]">
                {displayView !== 'Hide P&L' && <ArrowUp02Icon size={12} />}
                {displayView === 'Hide P&L' ? '***' : displayView === 'Percentage View' ? '1.7%' : '$861'}
              </div>
            </div>
          </button>

          {/* Pagination Controls */}
          <div className="mt-6 mb-1 flex items-center justify-center gap-6">
            <button className="text-neutral-500 hover:text-white transition-colors active:scale-95 outline-none">
              <ArrowLeft01Icon size={18} />
            </button>
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#141414] text-[13px] font-medium text-white">
              1
            </div>
            <button className="text-neutral-500 hover:text-white transition-colors active:scale-95 outline-none">
              <ArrowRight01Icon size={18} />
            </button>
          </div>

        </div>
      </section>

      {/* FLOATING ACTION BUTTON */}
      <button 
        className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#009C00]/15 backdrop-blur-xl border border-[#009C00]/30 text-[#009C00] shadow-lg shadow-[#009C00]/10 active:scale-95 transition-all z-50 outline-none"
        aria-label="Log new trade"
      >
        <PlusSignIcon size={28} />
      </button>

    </div>
  );
}
