'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { usePathname } from 'next/navigation';
import { Menu01Icon } from 'hugeicons-react';
import { AppSidebar } from './app-sidebar';

export function TopNavbar({ children, title }: { children?: React.ReactNode, title?: string }) {
  const pathname = usePathname();
  
  // Uses the passed title (e.g., "Notebook > Daily Journal") if it exists, 
  // otherwise defaults back to reading the URL pathname.
  let pageTitle = title || 'Dashboard';
  
  if (!title) {
    if (pathname === '/trades') pageTitle = 'Trades';
    else if (pathname === '/calendar') pageTitle = 'Calendar';
    else if (pathname === '/analytics') pageTitle = 'Analytics';
    else if (pathname === '/strategies') pageTitle = 'Strategies';
    else if (pathname === '/accounts') pageTitle = 'Accounts';
    else if (pathname === '/notebook') pageTitle = 'Notebook';
  }

  return (
    <>
    <header className="fixed left-0 right-0 top-0 z-50 flex h-14 items-center justify-between bg-black px-4 pt-2">
      <div className="flex items-center gap-1">
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <button className="flex h-12 w-12 items-center justify-center text-neutral-300 hover:text-white transition-colors active:scale-95 outline-none">
              <Menu01Icon size={24} />
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
            <Dialog.Content className="fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col bg-black outline-none transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left shadow-2xl border-r border-neutral-800/60">
              <AppSidebar />
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
        <span className="text-[15px] font-medium tracking-tight">{pageTitle}</span>
      </div>
      
      {/* Injects page-specific buttons (dropdowns, selectors) here */}
      <div className="flex items-center gap-3 pr-1">
        {children}
      </div>
    </header>
    <div className="h-14 w-full"></div>
   </>
  );
}
