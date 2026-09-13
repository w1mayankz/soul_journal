'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { usePathname } from 'next/navigation';
import { Menu01Icon } from 'hugeicons-react';
import { AppSidebar } from './app-sidebar';

export function TopNavbar({ children, title }: { children?: React.ReactNode, title?: string }) {
  const pathname = usePathname();
  
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
      
      {/* Left Side (Menu + Breadcrumb) - flex-1 and min-w-0 forces truncation to work */}
      <div className="flex flex-1 min-w-0 items-center gap-2 pr-4">
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <button className="flex h-12 w-12 shrink-0 items-center justify-center text-neutral-300 outline-none">
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
        
        {/* Truncate ensures long text gets ... */}
        <span className="text-[15px] font-medium tracking-tight truncate w-full">{pageTitle}</span>
      </div>
      
      {/* Right Side Buttons */}
      <div className="flex shrink-0 items-center gap-3 pr-1">
        {children}
      </div>
    </header>
    <div className="h-14 w-full"></div>
   </>
  );
}
