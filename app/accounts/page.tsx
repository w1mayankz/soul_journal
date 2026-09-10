'use client';

import { useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { TopNavbar } from '../../components/top-navbar';
import { AddAccountModal } from '../../components/add-account-modal';
import { useTrades } from '../../context/trades-context';
import { 
  DollarSquareIcon, 
  PercentIcon,
  ViewOffSlashIcon,
  ArrowDown01Icon,
  RefreshIcon,
  PlusSignIcon,
  StarIcon,
  Download01Icon,
  Menu01Icon
} from 'hugeicons-react';

export default function AccountsPage() {
  const [displayView, setDisplayView] = useState('Money View');
  
  const { accounts, trades, toggleStarAccount } = useTrades();
  
  // Dynamically sum up the balance of all accounts
  const totalPortfolioValue = accounts.reduce((sum, acc) => sum + acc.currentBalance, 0);

  return (
    <div className="relative min-h-screen bg-black pb-24 font-sans text-white">
      
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

      <div className="mt-4 flex items-center justify-between px-4">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger className="flex h-10 items-center gap-2 rounded-xl bg-[#141414] px-3.5 text-[14px] font-medium text-white outline-none transition-colors hover:bg-[#1A1A1A] active:scale-95">
            All Accounts
            <ArrowDown01Icon size={16} className="text-neutral-400" />
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content 
              align="start"
              className="z-50 min-w-[160px] overflow-hidden rounded-xl border border-neutral-800 bg-[#0A0A0A]/90 backdrop-blur-xl p-1 shadow-2xl text-white text-[14px] animate-in fade-in-80 zoom-in-95 data-[side=bottom]:slide-in-from-top-2"
            >
              <DropdownMenu.Item className="flex items-center rounded-lg px-3 py-2.5 outline-none hover:bg-[#1A1A1A] cursor-pointer text-white">
                All Accounts
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
        <button className="flex h-10 items-center gap-2 rounded-xl bg-[#141414] px-3.5 text-[14px] font-medium text-white outline-none transition-colors hover:bg-[#1A1A1A] active:scale-95">
          <RefreshIcon size={16} className="text-white" />
          Sync all
        </button>
      </div>

      {/* TOTAL PORTFOLIO VALUE CARD */}
      <section className="mt-4 px-4">
        <div className="rounded-2xl border border-neutral-800/60 bg-[#090909] p-4 shadow-sm">
          <h3 className="text-[15px] font-medium text-white tracking-tight">Total Portfolio Value</h3>
          <p className="mt-1 text-[28px] font-medium tracking-tight text-white">
            {displayView === 'Hide P&L' ? '******' : `$${totalPortfolioValue.toLocaleString()}`}
          </p>
          <p className="mt-1 text-[13px] font-medium text-neutral-500">
            Total trading capital across all accounts.
          </p>
        </div>
      </section>

      {/* DYNAMIC ACCOUNTS AREA */}
      <section className="mt-4 px-4 flex flex-col gap-3">
        {accounts.length === 0 ? (
          <AddAccountModal>
            <button className="flex min-h-[160px] w-full flex-col items-center justify-center gap-2 rounded-2xl border border-neutral-800/60 bg-[#090909] transition-colors hover:bg-[#141414] active:scale-[0.99] outline-none shadow-sm">
              <PlusSignIcon size={24} className="text-neutral-500" />
              <span className="text-[14px] font-medium text-neutral-500">Add Account</span>
            </button>
          </AddAccountModal>
        ) : (
          <>
            {accounts.map(acc => {
              // Connects to actual trades to get real count
              const tradesCount = trades.filter(t => t.accountId === acc.id).length;
              const hasTag = acc.accountType && acc.accountType !== 'None';
              const isOrangeTag = ['Live Funded', 'Demo'].includes(acc.accountType);

              return (
                <div key={acc.id} className="flex justify-between rounded-2xl border border-neutral-800/60 bg-[#090909] p-4 shadow-sm">
                  <div className="flex flex-col flex-1">
                    <div className="flex items-center gap-2.5">
                      {/* Name pulsing dot is ALWAYS green */}
                      <div className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#009C00] opacity-75"></span>
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-[#009C00]"></span>
                      </div>
                      <h4 className="text-[15px] font-medium text-white tracking-tight">{acc.name}</h4>
                    </div>
                    
                    <p className="mt-1.5 text-[28px] font-medium tracking-tight text-white">
                      {displayView === 'Hide P&L' ? '******' : `$${acc.currentBalance.toLocaleString()}`}
                    </p>
                    
                    <p className="mt-1.5 text-[13px] font-medium text-neutral-500">Manual</p>
                    <p className="mt-[2px] text-[13px] font-medium text-neutral-500">
                      {tradesCount === 0 ? 'No trades yet' : `${tradesCount} trade${tradesCount > 1 ? 's' : ''}`}
                    </p>
                    
                    <div className="mt-4 flex items-end justify-between pr-4">
                      <div className="flex flex-col">
                        <span className="text-[13px] font-medium text-white">Initial Balance</span>
                        <span className="text-[13px] font-medium text-neutral-500">${acc.initialBalance.toLocaleString()}</span>
                      </div>
                      
                      {/* Dynamic Tag rendering logic */}
                      {hasTag && (
                        <div className="flex items-center gap-1.5 rounded-lg border border-neutral-800/60 bg-[#141414] px-2.5 py-1">
                          <span className={`h-1.5 w-1.5 rounded-full ${isOrangeTag ? 'bg-[#F59E0B]' : 'bg-[#009C00]'}`}></span>
                          <span className="text-[12px] font-medium text-neutral-300">{acc.accountType}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Right side control column */}
                  <div className="flex flex-col items-center justify-between rounded-xl border border-neutral-800/60 bg-[#141414] overflow-hidden ml-3">
                    <button onClick={() => toggleStarAccount(acc.id)} className="p-2.5 hover:bg-[#1A1A1A] transition-colors border-b border-neutral-800/60 outline-none">
                      <StarIcon size={18} className={acc.isStarred ? "text-orange-500 fill-orange-500" : "text-neutral-400"} />
                    </button>
                    <button className="p-2.5 hover:bg-[#1A1A1A] transition-colors border-b border-neutral-800/60 outline-none">
                      <Download01Icon size={18} className="text-neutral-400" />
                    </button>
                    <button className="p-2.5 hover:bg-[#1A1A1A] transition-colors outline-none">
                      <Menu01Icon size={18} className="text-neutral-400" />
                    </button>
                  </div>
                </div>
              );
            })}
            
            <AddAccountModal>
              <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-800/60 bg-transparent py-4 transition-colors hover:bg-[#141414] active:scale-[0.99] outline-none">
                <PlusSignIcon size={18} className="text-neutral-500" />
                <span className="text-[14px] font-medium text-neutral-500">Add another account</span>
              </button>
            </AddAccountModal>
          </>
        )}
      </section>
    </div>
  );
}
