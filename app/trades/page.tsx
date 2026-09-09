'use client';

import * as Dialog from '@radix-ui/react-dialog';
// Use ../../ to step out of trades and app folders to find components
import { AppSidebar } from '../../components/app-sidebar'; 
import { 
  Menu01Icon, 
  DollarSquareIcon, 
  PlusSignIcon,
  FilterIcon,
  Menu05Icon, 
  ArrowUp02Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon
} from 'hugeicons-react';

export default function TradesPage() {
  return (
    <div className="relative min-h-screen bg-black pb-24 font-sans text-white">
      
      {/* TOP NAVBAR (Temporary copy until we extract it) */}
      <header className="flex h-14 items-center justify-between px-4 pt-2">
        <div className="flex items-center gap-1">
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <button className="flex h-12 w-12 items-center justify-center text-neutral-300 hover:text-white transition-colors active:scale-95 outline-none">
                <Menu01Icon size={24} />
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
              <Dialog.Content className="fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col bg-black outline-none transition ease-in-out data-[state=closed]:duration-200 data-[state=open]:duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left shadow-2xl border-r border-neutral-800/60">
                <AppSidebar />
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
          <span className="text-[17px] font-medium tracking-tight">Trades</span>
        </div>
        
        <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#141414] text-neutral-300 hover:bg-[#222] transition-colors active:scale-95 outline-none pr-1">
          <DollarSquareIcon size={22} />
        </button>
      </header>

      {/* TRADE LOG CARD */}
      <section className="mt-6 px-4">
        <div className="rounded-2xl border border-neutral-800/60 bg-[#0A0A0A] p-4 shadow-sm">
          
          {/* Card Header & Controls */}
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h2 className="text-[17px] font-medium tracking-tight">Trade Log</h2>
              <p className="mt-0.5 text-[13px] text-neutral-500">Select a trade to view its details</p>
            </div>
            <div className="flex gap-3 text-neutral-400">
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
            <span className="text-[12px] font-medium text-neutral-400">Entry date</span>
            <span className="text-center text-[12px] font-medium text-neutral-400">Symbol</span>
            <span className="text-right text-[12px] font-medium text-neutral-400">P&L</span>
          </div>

          {/* Dummy Trade Row 1 */}
          <button className="flex w-full grid grid-cols-[1.5fr_1fr_1fr] items-center px-4 py-3 hover:bg-[#141414] transition-colors rounded-xl outline-none group text-left">
            <span className="text-[13px] font-medium text-neutral-300 group-hover:text-white transition-colors">
              09/09/2026 15:53
            </span>
            <span className="text-center text-[13px] font-medium text-white">
              NAS100
            </span>
            <div className="flex justify-end">
              <div className="flex items-center gap-1 rounded-md bg-[#009C00]/15 px-2 py-1 text-[12px] font-medium text-[#009C00]">
                <ArrowUp02Icon size={12} />
                $861
              </div>
            </div>
          </button>

          {/* Dummy Trade Row 2 (Single line format) */}
          <button className="flex w-full grid grid-cols-[1.5fr_1fr_1fr] items-center px-4 py-3 hover:bg-[#141414] transition-colors rounded-xl outline-none group text-left">
            <span className="text-[13px] font-medium text-neutral-300 group-hover:text-white transition-colors">
              03/09/2026 09:53
            </span>
            <span className="text-center text-[13px] font-medium text-white">
              NQ1!
            </span>
            <div className="flex justify-end">
              <div className="flex items-center gap-1 rounded-md bg-[#009C00]/15 px-2 py-1 text-[12px] font-medium text-[#009C00]">
                <ArrowUp02Icon size={12} />
                $640
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
        className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#009C00]/15 backdrop-blur-xl border border-[#009C00]/30 text-[#009C00] shadow-lg shadow-[#009C00]/10 active:scale-95 transition-all z-50 outline-none"
        aria-label="Log new trade"
      >
        <PlusSignIcon size={28} />
      </button>

    </div>
  );
}
