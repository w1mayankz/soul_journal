'use client';

import { useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { TopNavbar } from '../../components/top-navbar';
import { AddAccountModal } from '../../components/add-account-modal'; // <--- Import it here
import { 
  DollarSquareIcon, 
  PercentIcon,
  ViewOffSlashIcon,
  ArrowDown01Icon,
  RefreshIcon,
  PlusSignIcon
} from 'hugeicons-react';

export default function AccountsPage() {
  const [displayView, setDisplayView] = useState('Money View');

  return (
    <div className="relative min-h-screen bg-black pb-24 font-sans text-white">
      
      {/* NAVBAR WITH PNL DROPDOWN */}
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

      {/* FILTER CONTROLS */}
      <div className="mt-4 flex items-center justify-between px-4">
        
        {/* All Accounts Dropdown */}
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

        {/* Sync Button */}
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
            {displayView === 'Hide P&L' ? '******' : '$0'}
          </p>
          <p className="mt-1 text-[13px] font-medium text-neutral-500">
            Total trading capital across all accounts.
          </p>
        </div>
      </section>

      {/* EMPTY ACCOUNTS AREA */}
      <section className="mt-4 px-4">
        {/* WE WRAPPED THE BUTTON IN THE MODAL COMPONENT */}
        <AddAccountModal>
          <button className="flex min-h-[160px] w-full flex-col items-center justify-center gap-2 rounded-2xl border border-neutral-800/60 bg-[#090909] transition-colors hover:bg-[#141414] active:scale-[0.99] outline-none shadow-sm">
            <PlusSignIcon size={24} className="text-neutral-500" />
            <span className="text-[14px] font-medium text-neutral-500">Add Account</span>
          </button>
        </AddAccountModal>
      </section>

    </div>
  );
}
