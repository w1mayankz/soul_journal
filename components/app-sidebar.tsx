'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  DashboardSquare01Icon,
  Calendar05Icon, 
  ListChecksIcon, 
  Analytics01Icon, 
  BriefcaseBusinessIcon,
  ArrowLeftDoubleIcon, 
  UserMultipleIcon,
  ArrowDown01Icon,
  MoreHorizontalIcon,
  PencilEdit01Icon
} from 'hugeicons-react';
import { useTrades } from '../context/trades-context';

export function AppSidebar() {
  const pathname = usePathname();
  
  const { accounts, activeAccountId } = useTrades();
  
  // Pulls the Active account instead of starred
  const activeAccount = accounts.find(a => a.id === activeAccountId);
  
  // Dynamic display values
  const displayName = activeAccount ? activeAccount.name : 'All Accounts';
  const displayBalance = activeAccount ? `$${activeAccount.currentBalance.toLocaleString()}` : '$0';

  return (
    <div className="flex h-full w-full flex-col bg-[#000000] text-neutral-300">

     {/* STICKY HEADER */}
      <div className="flex flex-col gap-4 bg-[#000000] p-4 pb-2">
        <div className="flex items-center gap-3 px-1">
          <img src="/assets/logo.png" alt="Logo" className="h-7 w-7 rounded-md object-cover bg-neutral-800" />
          <span className="text-[15px] font-medium tracking-tight text-white">ChudTrader</span>
          <span className="ml-auto text-[12px] font-semibold text-neutral-500">Free</span>
        </div>

        <Link 
          href="/accounts" 
          className="flex w-full items-center justify-between rounded-xl border border-neutral-800/50 bg-[#0A0A0A] p-2.5 outline-none transition-colors hover:bg-[#141414] active:scale-[0.98]"
        >
          <div className="flex items-center gap-3">
            {/* Pulsing dot is now permanently visible */}
            <div className="relative flex h-2 w-2 ml-1">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#009C00] opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#009C00]"></span>
            </div>
            
            <div className="flex flex-col items-start">
              <span className="text-[15px] font-medium leading-none text-white">{displayName}</span>
              <span className="mt-1.5 text-[12px] font-semibold leading-none text-neutral-500">{displayBalance}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-neutral-500">
            <PencilEdit01Icon size={16} />
            <ArrowDown01Icon size={18} />
          </div>
        </Link>
      </div>

      {/* SCROLLABLE BODY */}
      <div className="flex-1 overflow-y-auto px-4 py-2 scrollbar-hide">
        <div className="mb-6">
          <p className="mb-2 px-2 text-[12px] font-semibold text-neutral-500">Journaling</p>
          <nav className="flex flex-col gap-1">
            <Link href="/" className={`flex items-center gap-3 rounded-lg px-3 py-2.5 font-medium transition-colors ${pathname === '/' ? 'bg-[#141414] text-[15px] text-white' : 'text-[16px] text-white hover:bg-[#141414]'}`}>
              <DashboardSquare01Icon size={18} className={pathname === '/' ? 'text-neutral-300' : ''} /> Dashboard
            </Link>
            <Link href="/calendar" className={`flex items-center gap-3 rounded-lg px-3 py-2.5 font-medium transition-colors ${pathname === '/calendar' ? 'bg-[#141414] text-[15px] text-white' : 'text-[16px] text-white hover:bg-[#141414] hover:text-white'}`}>
              <Calendar05Icon size={18} className={pathname === '/calendar' ? 'text-neutral-300' : ''} /> Calendar
            </Link>
            <Link href="/trades" className={`flex items-center gap-3 rounded-lg px-3 py-2.5 font-medium transition-colors ${pathname === '/trades' ? 'bg-[#141414] text-[15px] text-white' : 'text-[16px] text-white hover:bg-[#141414]'}`}>
              <ListChecksIcon size={18} className={pathname === '/trades' ? 'text-neutral-300' : ''} /> Trades
            </Link>
            <Link href="/analytics" className={`flex items-center gap-3 rounded-lg px-3 py-2.5 font-medium transition-colors ${pathname === '/analytics' ? 'bg-[#141414] text-[15px] text-white' : 'text-[16px] text-white hover:bg-[#141414] hover:text-white'}`}>
              <Analytics01Icon size={18} className={pathname === '/analytics' ? 'text-neutral-300' : ''} /> Analytics
            </Link>
            <Link href="/strategies" className={`flex items-center gap-3 rounded-lg px-3 py-2.5 font-medium transition-colors ${pathname === '/strategies' ? 'bg-[#141414] text-[15px] text-white' : 'text-[16px] text-white hover:bg-[#141414] hover:text-white'}`}>
              <BriefcaseBusinessIcon size={18} className={pathname === '/strategies' ? 'text-neutral-300' : ''} /> Strategies
            </Link>
          </nav>
        </div>

        <div className="mb-6">
          <p className="mb-2 px-2 text-[12px] font-medium text-neutral-500">Backtesting</p>
          <nav className="flex flex-col gap-1">
            <a href="#" className="flex items-center justify-between rounded-lg px-3 py-2.5 text-[16px] font-medium text-white hover:bg-[#141414] hover:text-white">
              <div className="flex items-center gap-3">
                <ArrowLeftDoubleIcon size={18} /> Backtesting
              </div>
              <span className="rounded-lg bg-neutral-900 px-2 py-0.5 text-[10px] text-neutral-500">Soon</span>
            </a>
          </nav>
        </div>

        <div className="mb-6">
          <p className="mb-2 px-2 text-[12px] font-medium text-neutral-500">Social</p>
          <nav className="flex flex-col gap-1">
            <a href="#" className="flex items-center justify-between rounded-lg px-3 py-2.5 text-[16px] font-medium text-white hover:bg-[#141414] hover:text-white">
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
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1A1A1A] text-[16px] font-medium text-white">
            C
          </div>
          <div className="flex flex-col items-start text-left">
            <span className="text-[16px] font-medium leading-none text-white">siz</span>
            <span className="mt-1.5 text-[12px] leading-none font-semibold text-neutral-500 truncate w-32">stupidmoneyconcepts...</span>
          </div>
          <MoreHorizontalIcon size={20} className="ml-auto text-white" />
        </button>
      </div>
      
    </div>
  );
}
