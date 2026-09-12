'use client';

import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Popover from '@radix-ui/react-popover';
import { 
  Cancel01Icon, 
  PencilEdit01Icon, 
  ArrowRight01Icon, 
  ArrowLeft01Icon, 
  ArrowDown01Icon,
  InformationCircleIcon
} from 'hugeicons-react';
import { useTrades } from '../context/trades-context';

const BREAKEVEN_OPTIONS = ['None', '0.01%', '0.02%', '0.03%', '0.04%', '0.05%', '0.1%', '0.5%', 'Custom'];
const ACCOUNT_TYPES = ['Personal Funds', 'Live Funded', 'Challenge Phase 1', 'Challenge Phase 2', 'Demo'];

export function AddAccountModal({ children }: { children: React.ReactNode }) {
  const { addAccount } = useTrades();
  
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [initialBalance, setInitialBalance] = useState('');
  const [currentBalance, setCurrentBalance] = useState('');
  const [breakeven, setBreakeven] = useState('0.1%');
  const [customBreakeven, setCustomBreakeven] = useState('');
  const [breakevenOpen, setBreakevenOpen] = useState(false);
  const [accountType, setAccountType] = useState('');
  const [accountTypeOpen, setAccountTypeOpen] = useState(false);

  // COMPLETELY RESETS ALL FIELDS
  const resetForm = () => {
    setStep(1);
    setIsAdvancedOpen(false);
    setName('');
    setInitialBalance('');
    setCurrentBalance('');
    setBreakeven('0.1%');
    setCustomBreakeven('');
    setAccountType('');
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setTimeout(resetForm, 300); // Waits for the close animation before wiping data
    }
  };

  const handleSaveAccount = () => {
    if (!name || !initialBalance) return; 

    const parsedInitial = parseFloat(initialBalance.replace(/,/g, ''));
    const parsedCurrent = currentBalance ? parseFloat(currentBalance.replace(/,/g, '')) : parsedInitial;

    if (isNaN(parsedInitial)) return;

    addAccount({
      id: Date.now(),
      name,
      initialBalance: parsedInitial,
      currentBalance: parsedCurrent,
      accountType,
      breakeven: breakeven === 'Custom' ? customBreakeven : breakeven,
      isStarred: false,
      isArchived: false
    });

    setIsOpen(false);
    setTimeout(resetForm, 300); // Wipes data after successful save
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>
        {children}
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-[70] flex max-h-[90vh] w-[95vw] max-w-lg translate-x-[-50%] translate-y-[-50%] flex-col rounded-2xl border border-neutral-800 bg-[#090909] p-3 outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
          
          {/* HEADER */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <Dialog.Title className="text-[18px] font-medium text-white">Add Account</Dialog.Title>
              <Dialog.Description className="mt-0.5 text-[15px] text-neutral-400 font-semibold">
                Connect, add or import your account
              </Dialog.Description>
            </div>
            <Dialog.Close className="text-white hover:text-white transition-colors outline-none">
              <Cancel01Icon size={22} />
            </Dialog.Close>
          </div>

          <div className="flex-1 overflow-y-auto pr-1.5 scrollbar-hide pb-4">
            
            {/* STEP 1: ACCOUNT TYPE SELECTION */}
            {step === 1 && (
              <div className="flex flex-col items-center animate-in fade-in slide-in-from-right-4 duration-300 py-4">
                <span className="mb-4 rounded-md bg-[#1F1F1F] px-2.5 py-1 text-[12px] font-semibold text-neutral-400">1/3</span>
                <h2 className="mb-2 text-[20px] font-semibold tracking-tight text-white">Select the Account Type</h2>
                <p className="mb-8 text-center text-[14px] font-medium text-neutral-500">
                  Select if you want to add your trades manually or<br />import them from your trading account
                </p>

                <button 
                  onClick={() => setStep(2)} 
                  className="group flex w-full flex-col items-center rounded-xl border border-neutral-800/60 bg-[#0F0F0F] p-6 transition-colors hover:bg-[#141414] active:scale-[0.98] outline-none"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#1F1F1F] transition-colors group-hover:bg-[#222]">
                    <PencilEdit01Icon size={18} className="text-white" />
                  </div>
                  <h3 className="mb-2 text-[17px] font-semibold text-white">Manual Account</h3>
                  <p className="mb-5 text-center text-[13px] font-medium leading-relaxed text-neutral-500 px-4">
                    Create a manual account and <span className="underline decoration-neutral-600 underline-offset-4">add your trades manually</span>. Analytics will be automatically generated
                  </p>
                  <ArrowRight01Icon size={20} className="text-neutral-400 transition-transform group-hover:translate-x-1 group-hover:text-white" />
                </button>
              </div>
            )}

            {/* STEP 2: MANUAL ACCOUNT DETAILS */}
            {step === 2 && (
              <div className="flex flex-col animate-in fade-in slide-in-from-right-4 duration-300">
                <button 
                  onClick={() => setStep(1)} 
                  className="mb-5 flex w-fit items-center gap-2 rounded-xl bg-[#141414] px-3 py-1.5 text-[13px] font-medium text-neutral-400 transition-colors hover:bg-[#1A1A1A] hover:text-white active:scale-95 outline-none"
                >
                  <ArrowLeft01Icon size={16} /> Back
                </button>

                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-semibold text-white">Name *</label>
                    <input 
                      type="text" 
                      value={name} 
                      onChange={e => setName(e.target.value)} 
                      placeholder="Enter account name" 
                      className="w-full rounded-xl bg-[#1F1F1F] px-3 py-2.5 text-[14px] font-medium text-white outline-none placeholder:text-neutral-400 border border-transparent focus-within:border-neutral-700 transition-colors" 
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-1.5 text-[14px] font-semibold text-white">
                      Initial Balance * <InformationCircleIcon size={16} className="text-neutral-400" />
                    </label>
                    <input 
                      type="text" 
                      value={initialBalance} 
                      onChange={e => setInitialBalance(e.target.value)} 
                      placeholder="Enter initial balance" 
                      className="w-full rounded-xl bg-[#1F1F1F] px-3 py-2.5 text-[14px] font-medium text-white outline-none placeholder:text-neutral-400 border border-transparent focus-within:border-neutral-700 transition-colors" 
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-semibold text-white">Current Balance</label>
                    <input 
                      type="text" 
                      value={currentBalance} 
                      onChange={e => setCurrentBalance(e.target.value)} 
                      placeholder="Enter current balance" 
                      className="w-full rounded-xl bg-[#1F1F1F] px-3 py-2.5 text-[14px] font-medium text-white outline-none placeholder:text-neutral-400 border border-transparent focus-within:border-neutral-700 transition-colors" 
                    />
                  </div>

                  <div className="mt-2">
                    <button 
                      onClick={() => setIsAdvancedOpen(!isAdvancedOpen)} 
                      className="flex items-center gap-2 text-[14px] font-semibold text-white outline-none transition-colors"
                    >
                      <ArrowRight01Icon size={18} className={`transition-transform duration-200 ${isAdvancedOpen ? 'rotate-90 text-white' : 'text-neutral-400'}`} /> 
                      Advanced options
                    </button>
                  </div>

                  {isAdvancedOpen && (
                    <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-top-2 duration-200 pt-2">
                      <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-1.5 text-[14px] font-semibold text-white">
                          Breakeven Level <InformationCircleIcon size={16} className="text-neutral-400" />
                        </label>
                        <Popover.Root open={breakevenOpen} onOpenChange={setBreakevenOpen}>
                          <Popover.Trigger className="flex w-full items-center justify-between rounded-xl bg-[#1F1F1F] px-3 py-2.5 text-[14px] font-medium text-white outline-none active:scale-[0.99] transition-transform">
                            {breakeven}
                            <ArrowDown01Icon size={18} className="text-neutral-400" />
                          </Popover.Trigger>
                          <Popover.Content align="start" className="z-[80] w-[calc(95vw-40px)] max-w-[440px] rounded-xl border border-neutral-800 bg-[#0A0A0A] p-1 shadow-2xl animate-in fade-in-80 zoom-in-95">
                            {BREAKEVEN_OPTIONS.map(val => (
                              <button 
                                key={val} 
                                onClick={() => { setBreakeven(val); setBreakevenOpen(false); }} 
                                className="w-full rounded-lg px-3 py-2.5 text-left text-[14px] font-medium text-neutral-300 hover:bg-[#1A1A1A] hover:text-white outline-none"
                              >
                                {val}
                              </button>
                            ))}
                          </Popover.Content>
                        </Popover.Root>
                        {breakeven === 'Custom' && (
                          <div className="flex items-center rounded-xl bg-[#1F1F1F] px-3 py-2.5 border border-transparent focus-within:border-neutral-700 transition-colors mt-2 animate-in fade-in slide-in-from-top-2">
                            <input 
                              type="text" 
                              value={customBreakeven} 
                              onChange={(e) => setCustomBreakeven(e.target.value)} 
                              placeholder="0.1" 
                              className="flex-1 bg-transparent text-[14px] font-medium text-white outline-none placeholder:text-neutral-400" 
                            />
                            <span className="text-[15px] font-medium text-neutral-400 ml-2">%</span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-[14px] font-semibold text-white">Account Type</label>
                        <Popover.Root open={accountTypeOpen} onOpenChange={setAccountTypeOpen}>
                          <Popover.Trigger className="flex w-full items-center justify-between rounded-xl bg-[#1F1F1F] px-3 py-2.5 text-[14px] font-medium text-white outline-none active:scale-[0.99] transition-transform">
                            {accountType || <span className="text-neutral-400">Select account type</span>}
                            <ArrowDown01Icon size={18} className="text-neutral-400" />
                          </Popover.Trigger>
                          <Popover.Content align="start" className="z-[80] w-[calc(95vw-40px)] max-w-[440px] rounded-xl border border-neutral-800 bg-[#0A0A0A] p-1 shadow-2xl animate-in fade-in-80 zoom-in-95">
                            {ACCOUNT_TYPES.map(val => (
                              <button 
                                key={val} 
                                onClick={() => { setAccountType(val); setAccountTypeOpen(false); }} 
                                className="w-full rounded-lg px-3 py-2.5 text-left text-[14px] font-medium text-neutral-300 hover:bg-[#1A1A1A] hover:text-white outline-none"
                              >
                                {val}
                              </button>
                            ))}
                          </Popover.Content>
                        </Popover.Root>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-neutral-800/60">
                  <Dialog.Close className="rounded-xl px-5 py-2.5 text-[14px] font-medium text-neutral-400 hover:text-white transition-colors outline-none bg-[#141414] hover:bg-[#1A1A1A]">
                    Cancel
                  </Dialog.Close>
                  <button 
                    onClick={handleSaveAccount} 
                    className="rounded-xl bg-white px-5 py-2.5 text-[14px] font-medium text-black active:scale-95 transition-transform outline-none"
                  >
                    Add Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
