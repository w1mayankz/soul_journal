'use client';

import { 
  GridIcon, 
  Calendar01Icon, 
  Task01Icon, 
  Chart01Icon, 
  Briefcase01Icon, 
  ArrowLeftDoubleIcon, 
  UserMultipleIcon,
  ArrowDown01Icon,
  MoreHorizontalIcon,
  PencilEdit01Icon
} from 'hugeicons-react';

export function AppSidebar() {
  return (
    <div className="flex h-full w-full flex-col bg-[#000000] text-neutral-300">
      
      {/* STICKY HEADER */}
      <div className="flex flex-col gap-4 bg-[#000000] p-4 pb-2">
        <div className="flex items-center gap-3 px-1">
          <img src="/assets/logo.png" alt="Logo" className="h-7 w-7 rounded-md object-cover bg-neutral-800" />
          <span className="text-[15px] font-semibold tracking-tight text-white">ChudTrader</span>
          <span className="ml-auto text-[11px] font-medium text-neutral-500">Free</span>
        </div>

        <button className="flex w-full items-center justify-between rounded-xl border border-neutral-800/50 bg-[#0A0A0A] p-2.5 outline-none transition-colors hover:bg-[#141414] active:scale-[0.98]">
          <div className="flex items-center gap-3">
            <div className="relative flex h-2 w-2 ml-1">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[14px] font-medium leading-none text-white">SK9 Model</span>
              <span className="mt-1.5 text-[12px] leading-none text-neutral-500">$50,640</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-neutral-500">
            <PencilEdit01Icon size={16} />
            <ArrowDown01Icon size={18} />
          </div>
        </button>
      </div>

      {/* SCROLLABLE BODY */}
      <div className="flex-1 overflow-y-auto px-4 py-2 scrollbar-hide">
        <div className="mb-6">
          <p className="mb-2 px-2 text-[11px] font-medium text-neutral-500">Journaling</p>
          <nav className="flex flex-col gap-1">
            <a href="#" className="flex items-center gap-3 rounded-lg bg-[#141414] px-3 py-2.5 text-[14px] font-medium text-white">
              <GridIcon size={18} className="text-neutral-300" /> Dashboard
            </a>
            <a href="#" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] font-medium text-neutral-400 hover:bg-[#141414] hover:text-white">
              <Calendar01Icon size={18} /> Calendar
            </a>
            <a href="#" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] font-medium text-neutral-400 hover:bg-[#141414] hover:text-white">
              <Task01Icon size={18} /> Trades
            </a>
            <a href="#" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] font-medium text-neutral-400 hover:bg-[#141414] hover:text-white">
              <Chart01Icon size={18} /> Analytics
            </a>
            <a href="#" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] font-medium text-neutral-400 hover:bg-[#141414] hover:text-white">
              <Briefcase01Icon size={18} /> Strategies
            </a>
          </nav>
        </div>

        <div className="mb-6">
          <p className="mb-2 px-2 text-[11px] font-medium text-neutral-500">Backtesting</p>
          <nav className="flex flex-col gap-1">
            <a href="#" className="flex items-center justify-between rounded-lg px-3 py-2.5 text-[14px] font-medium text-neutral-400 hover:bg-[#141414] hover:text-white">
              <div className="flex items-center gap-3">
                <ArrowLeftDoubleIcon size={18} /> Backtesting
              </div>
              <span className="rounded-full bg-neutral-900 px-2 py-0.5 text-[10px] text-neutral-500">Soon</span>
            </a>
          </nav>
        </div>

        <div className="mb-6">
          <p className="mb-2 px-2 text-[11px] font-medium text-neutral-500">Social</p>
          <nav className="flex flex-col gap-1">
            <a href="#" className="flex items-center justify-between rounded-lg px-3 py-2.5 text-[14px] font-medium text-neutral-400 hover:bg-[#141414] hover:text-white">
              <div className="flex items-center gap-3">
                <UserMultipleIcon size={18} /> Communities
              </div>
              <span className="rounded-full bg-neutral-900 px-2 py-0.5 text-[10px] text-neutral-500">Soon</span>
            </a>
          </nav>
        </div>
      </div>

      {/* STICKY FOOTER */}
      <div className="bg-[#000000] p-4 pt-2">
        <button className="flex w-full items-center gap-3 rounded-xl p-2 transition-colors hover:bg-[#141414] outline-none">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1A1A1A] text-[15px] font-semibold text-white">
            C
          </div>
          <div className="flex flex-col items-start text-left">
            <span className="text-[14px] font-medium leading-none text-white">cow</span>
            <span className="mt-1.5 text-[12px] leading-none text-neutral-500 truncate w-32">stupidmoneyconcepts...</span>
          </div>
          <MoreHorizontalIcon size={18} className="ml-auto text-neutral-500" />
        </button>
      </div>
      
    </div>
  );
}
