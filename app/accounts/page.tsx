'use client';

import { useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Dialog from '@radix-ui/react-dialog';
import { TopNavbar } from '../../components/top-navbar';
import { AddAccountModal } from '../../components/add-account-modal';
import { EditAccountModal } from '../../components/edit-account-modal';
import { useTrades, Account } from '../../context/trades-context';
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
  const [accountFilter, setAccountFilter] = useState('All Accounts');
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Modals state
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [accountToDelete, setAccountToDelete] = useState<Account | null>(null);
  const [accountToArchive, setAccountToArchive] = useState<Account | null>(null);
  
  const { 
    accounts, 
    trades, 
    toggleStarAccount, 
    toggleArchiveAccount,
    deleteAccount,
    activeAccountId, 
    setActiveAccount 
  } = useTrades();
  
  // Portfolio calculations (always strictly based on non-archived accounts)
  const activeAccounts = accounts.filter(acc => !acc.isArchived);
  const totalPortfolioValue = activeAccounts.reduce((sum, acc) => sum + acc.currentBalance, 0);
  const totalInitialValue = activeAccounts.reduce((sum, acc) => sum + acc.initialBalance, 0);
  const totalPortfolioPnl = totalPortfolioValue - totalInitialValue;

  // Filter accounts based on dropdown selection
  const displayedAccounts = accounts.filter(acc => {
    if (accountFilter === 'Archived') return acc.isArchived;
    if (accountFilter === 'Starred') return !acc.isArchived && acc.isStarred;
    return !acc.isArchived;
  });

  const handleSync = () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 3000);
  };

  const confirmDelete = () => {
    if (accountToDelete) deleteAccount(accountToDelete.id);
    setAccountToDelete(null);
  };

  const confirmArchive = () => {
    if (accountToArchive) toggleArchiveAccount(accountToArchive.id);
    setAccountToArchive(null);
  };

  return (
    <div className="relative min-h-screen bg-black pb-24 font-sans text-white">
      <TopNavbar>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#141414] text-neutral-300 hover:bg-[#222] transition-colors active:scale-95 outline-none">
            <DollarSquareIcon size={22} />
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content align="end" className="z-50 min-w-[200px] overflow-hidden rounded-xl border border-neutral-800 bg-[#0A0A0A]/90 backdrop-blur-xl p-1 shadow-2xl text-white text-[15px] animate-in fade-in-80 zoom-in-95 data-[side=bottom]:slide-in-from-top-2">
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

      {/* FILTER AND SYNC */}
      <div className="mt-4 flex items-center justify-between px-4">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger className="flex h-10 items-center gap-2 rounded-xl bg-[#141414] px-3.5 text-[14px] font-medium text-white outline-none transition-colors hover:bg-[#1A1A1A] active:scale-95">
            {accountFilter}
            <ArrowDown01Icon size={16} className="text-neutral-400" />
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content align="start" className="z-50 min-w-[160px] overflow-hidden rounded-xl border border-neutral-800 bg-[#0A0A0A]/90 backdrop-blur-xl p-1 shadow-2xl text-white text-[14px] animate-in fade-in-80 zoom-in-95 data-[side=bottom]:slide-in-from-top-2">
              {['All Accounts', 'Starred', 'Archived'].map(filter => (
                <DropdownMenu.Item key={filter} onClick={() => setAccountFilter(filter)} className="flex items-center rounded-lg px-3 py-2.5 outline-none hover:bg-[#1A1A1A] cursor-pointer text-white">
                  {filter}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
        <button onClick={handleSync} className="flex h-10 items-center gap-2 rounded-xl bg-[#141414] px-3.5 text-[14px] font-medium text-white outline-none transition-colors hover:bg-[#1A1A1A] active:scale-95">
          <RefreshIcon size={16} className={`text-white transition-transform ${isSyncing ? 'animate-spin' : ''}`} />
          Sync all
        </button>
      </div>

      {/* PORTFOLIO VALUE CARD */}
      <section className="mt-4 px-4">
        <div className="rounded-2xl border border-neutral-800/60 bg-[#090909] p-4 shadow-sm">
          <h3 className="text-[15px] font-medium text-white tracking-tight">Total Portfolio Value</h3>
          <div className="mt-1 flex items-center gap-3">
            <p className="text-[28px] font-medium tracking-tight text-white">
              {displayView === 'Hide P&L' ? '******' : `$${totalPortfolioValue.toLocaleString()}`}
            </p>
            {displayView !== 'Hide P&L' && totalPortfolioPnl !== 0 && (
              <span className={`rounded-md px-2 py-0.5 text-[12px] font-semibold ${totalPortfolioPnl > 0 ? 'bg-[#009C00]/15 text-[#009C00]' : 'bg-[#F44336]/15 text-[#F44336]'}`}>
                {totalPortfolioPnl > 0 ? '+' : '-'}${Math.abs(totalPortfolioPnl).toLocaleString()}
              </span>
            )}
          </div>
          <p className="mt-1 text-[13px] font-medium text-neutral-500">Total trading capital across all accounts.</p>
        </div>
      </section>

      {/* DYNAMIC ACCOUNTS AREA */}
      <section className="mt-4 px-4 flex flex-col gap-3">
        {displayedAccounts.map(acc => {
          const tradesCount = trades.filter(t => t.accountId === acc.id).length;
          const hasTag = acc.accountType && acc.accountType !== 'None';
          const isOrangeTag = ['Live Funded', 'Demo'].includes(acc.accountType);
          const isActive = acc.id === activeAccountId;
          const accountPnl = acc.currentBalance - acc.initialBalance;

          return (
            <div 
              key={acc.id} 
              onClick={() => setActiveAccount(acc.id)}
              className={`flex justify-between rounded-2xl border ${isActive && !acc.isArchived ? 'border-[#009C00] shadow-[0_0_15px_rgba(0,156,0,0.05)]' : 'border-neutral-800/60'} bg-[#090909] p-4 pr-3 shadow-sm cursor-pointer transition-all`}
            >
              <div className="flex flex-col flex-1">
                <div className="flex items-center gap-2.5">
                  <div className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#009C00] opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#009C00]"></span>
                  </div>
                  <h4 className="text-[15px] font-medium text-white tracking-tight">{acc.name}</h4>
                </div>
                
                <div className="mt-1.5 flex items-center gap-3">
                  <p className="text-[28px] font-medium tracking-tight text-white">
                    {displayView === 'Hide P&L' ? '******' : `$${acc.currentBalance.toLocaleString()}`}
                  </p>
                  {displayView !== 'Hide P&L' && accountPnl !== 0 && (
                    <span className={`rounded-md px-2 py-0.5 text-[12px] font-semibold ${accountPnl > 0 ? 'bg-[#009C00]/15 text-[#009C00]' : 'bg-[#F44336]/15 text-[#F44336]'}`}>
                      {accountPnl > 0 ? '+' : '-'}${Math.abs(accountPnl).toLocaleString()}
                    </span>
                  )}
                </div>
                
                <p className="mt-1.5 text-[13px] font-medium text-neutral-500">Manual</p>
                <p className="mt-[2px] text-[13px] font-medium text-neutral-500">
                  {tradesCount === 0 ? 'No trades yet' : `${tradesCount} trade${tradesCount > 1 ? 's' : ''}`}
                </p>
                
                <div className="mt-4 flex items-end justify-between pr-4">
                  <div className="flex flex-col">
                    <span className="text-[13px] font-medium text-white">Initial Balance</span>
                    <span className="text-[13px] font-medium text-neutral-500">${acc.initialBalance.toLocaleString()}</span>
                  </div>
                  {hasTag && (
                    <div className="flex items-center gap-1.5 rounded-lg border border-neutral-800/60 bg-[#141414] px-2.5 py-1">
                      <span className={`h-1.5 w-1.5 rounded-full ${isOrangeTag ? 'bg-[#F59E0B]' : 'bg-[#009C00]'}`}></span>
                      <span className="text-[12px] font-medium text-neutral-300">{acc.accountType}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col items-center self-stretch rounded-xl bg-[#141414] p-1.5 ml-2 z-10 border border-neutral-800/60 shadow-sm">
                <div className="flex flex-col gap-1.5">
                  <button onClick={(e) => { e.stopPropagation(); toggleStarAccount(acc.id); }} className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1A1A1A] hover:bg-[#262626] transition-colors outline-none">
                    <StarIcon size={16} className={acc.isStarred ? "text-orange-500 fill-orange-500" : "text-neutral-400"} />
                  </button>
                  <button onClick={(e) => e.stopPropagation()} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-[#1A1A1A] transition-colors outline-none">
                    <Download01Icon size={16} className="text-neutral-400" />
                  </button>
                </div>
                
                <div className="mt-auto" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                      <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1A1A1A] hover:bg-[#262626] transition-colors outline-none">
                        <Menu01Icon size={16} className="text-neutral-400" />
                      </button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Portal>
                      <DropdownMenu.Content align="end" className="z-50 min-w-[200px] overflow-hidden rounded-xl border border-neutral-800 bg-[#0A0A0A]/90 backdrop-blur-xl p-1 shadow-2xl text-white text-[14px] animate-in fade-in-80 zoom-in-95">
                        
                        {/* Section 1 */}
                        <DropdownMenu.Item className="flex items-center rounded-lg px-3 py-2.5 outline-none bg-[#1A1A1A] cursor-pointer text-white font-medium">
                          Import trades
                        </DropdownMenu.Item>
                        <DropdownMenu.Item onClick={() => setEditingAccount(acc)} className="flex items-center rounded-lg px-3 py-2.5 outline-none hover:bg-[#1A1A1A] cursor-pointer text-neutral-300 hover:text-white">
                          Edit account
                        </DropdownMenu.Item>
                        
                        <DropdownMenu.Separator className="my-1 h-px bg-neutral-800/60 -mx-1" />
                        
                        {/* Section 2 */}
                        <DropdownMenu.Item className="flex items-center rounded-lg px-3 py-2.5 outline-none hover:bg-[#1A1A1A] cursor-pointer text-neutral-300 hover:text-white">
                          Balance adjustments
                        </DropdownMenu.Item>
                        <DropdownMenu.Item className="flex items-center rounded-lg px-3 py-2.5 outline-none hover:bg-[#1A1A1A] cursor-pointer text-neutral-300 hover:text-white">
                          Fee settings
                        </DropdownMenu.Item>
                        
                        <DropdownMenu.Separator className="my-1 h-px bg-neutral-800/60 -mx-1" />
                        
                        {/* Section 3 */}
                        <DropdownMenu.Item onClick={() => setAccountToArchive(acc)} className="flex items-center rounded-lg px-3 py-2.5 outline-none hover:bg-[#1A1A1A] cursor-pointer text-neutral-300 hover:text-white">
                          {acc.isArchived ? 'Unarchive account' : 'Archive account'}
                        </DropdownMenu.Item>
                        <DropdownMenu.Item onClick={() => setAccountToDelete(acc)} className="flex items-center rounded-lg px-3 py-2.5 outline-none hover:bg-[#F44336]/15 text-[#F44336] cursor-pointer font-medium mt-0.5">
                          Delete account
                        </DropdownMenu.Item>
                        
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Root>
                </div>
              </div>
            </div>
          );
        })}
        
        {/* ADD ACCOUNT BUTTON */}
        <AddAccountModal>
          <button className="flex min-h-[140px] w-full flex-col items-center justify-center gap-2 rounded-2xl border border-neutral-800/60 bg-[#090909] transition-colors hover:bg-[#141414] active:scale-[0.99] outline-none shadow-sm">
            <PlusSignIcon size={24} className="text-neutral-500" />
            <span className="text-[14px] font-medium text-neutral-500">Add Account</span>
          </button>
        </AddAccountModal>
      </section>

      <EditAccountModal account={editingAccount} onClose={() => setEditingAccount(null)} />

      {/* DELETE CONFIRMATION DIALOG */}
      <Dialog.Root open={!!accountToDelete} onOpenChange={(open) => !open && setAccountToDelete(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content className="fixed left-[50%] top-[50%] z-[90] flex w-[90vw] max-w-sm translate-x-[-50%] translate-y-[-50%] flex-col rounded-2xl border border-neutral-800 bg-[#0A0A0A] p-5 shadow-2xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
            <Dialog.Title className="text-[18px] font-medium text-white">Delete Account</Dialog.Title>
            <Dialog.Description className="mt-2 text-[14px] leading-relaxed text-neutral-400">
              Are you sure you want to permanently delete <strong className="text-white">{accountToDelete?.name}</strong>? All associated trades and history will be permanently removed. This cannot be undone.
            </Dialog.Description>
            <div className="mt-6 flex items-center justify-end gap-3">
              <Dialog.Close className="rounded-xl px-4 py-2.5 text-[14px] font-semibold text-neutral-300 hover:bg-[#1A1A1A] transition-colors outline-none">
                Cancel
              </Dialog.Close>
              <button onClick={confirmDelete} className="rounded-xl bg-[#F44336] px-4 py-2.5 text-[14px] font-semibold text-white active:scale-95 transition-transform outline-none">
                Delete Account
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* ARCHIVE CONFIRMATION DIALOG */}
      <Dialog.Root open={!!accountToArchive} onOpenChange={(open) => !open && setAccountToArchive(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content className="fixed left-[50%] top-[50%] z-[90] flex w-[90vw] max-w-sm translate-x-[-50%] translate-y-[-50%] flex-col rounded-2xl border border-neutral-800 bg-[#0A0A0A] p-5 shadow-2xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
            <Dialog.Title className="text-[18px] font-medium text-white">{accountToArchive?.isArchived ? 'Unarchive' : 'Archive'} Account</Dialog.Title>
            <Dialog.Description className="mt-2 text-[14px] leading-relaxed text-neutral-400">
              Are you sure you want to {accountToArchive?.isArchived ? 'restore' : 'archive'} <strong className="text-white">{accountToArchive?.name}</strong>? {accountToArchive?.isArchived ? 'It will be visible in your main accounts list again.' : 'It will be hidden from the main list but can be restored at any time.'}
            </Dialog.Description>
            <div className="mt-6 flex items-center justify-end gap-3">
              <Dialog.Close className="rounded-xl px-4 py-2.5 text-[14px] font-semibold text-neutral-300 hover:bg-[#1A1A1A] transition-colors outline-none">
                Cancel
              </Dialog.Close>
              <button onClick={confirmArchive} className="rounded-xl bg-white px-4 py-2.5 text-[14px] font-semibold text-black active:scale-95 transition-transform outline-none">
                {accountToArchive?.isArchived ? 'Unarchive' : 'Archive'} Account
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

    </div>
  );
}
