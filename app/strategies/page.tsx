'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import * as Dialog from '@radix-ui/react-dialog';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { TopNavbar } from '../../components/top-navbar';
import { 
  PlusSignIcon, 
  Cancel01Icon,
  Delete02Icon,
  DollarSquareIcon, 
  PercentIcon, 
  ViewOffSlashIcon,
  Menu05Icon,
  ArrowLeft01Icon,
  PencilEdit01Icon,
  CloudUploadIcon,
  ArrowRight01Icon
} from 'hugeicons-react';
import { useTrades, Strategy } from '../../context/trades-context';

type Confluence = {
  id: number;
  value: string;
};

export default function StrategiesPage() {
  const { trades, strategies, addStrategy, deleteStrategy } = useTrades();
  
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [confluences, setConfluences] = useState<Confluence[]>([]);
  const [displayView, setDisplayView] = useState('Money View');

  // Modal & View States
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);
  const [editingStrategy, setEditingStrategy] = useState<Strategy | null>(null);
  const [deletingStrategy, setDeletingStrategy] = useState<Strategy | null>(null);

  const handleAddConfluence = () => {
    setConfluences([...confluences, { id: Date.now(), value: '' }]);
  };

  const handleUpdateConfluence = (id: number, value: string) => {
    setConfluences(confluences.map(c => (c.id === id ? { ...c, value } : c)));
  };

  const handleRemoveConfluence = (id: number) => {
    setConfluences(confluences.filter(c => c.id !== id));
  };

  const handleSave = () => {
    if (!name.trim()) return;
    
    addStrategy({
      id: Date.now(),
      name: name.trim(),
      description: description.trim(),
      confluences: confluences.filter(c => c.value.trim() !== '')
    });
    
    setIsOpen(false);
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setConfluences([]);
  };

  const confirmDelete = () => {
    if (deletingStrategy) {
      deleteStrategy(deletingStrategy.id);
      if (selectedStrategy?.id === deletingStrategy.id) {
        setSelectedStrategy(null);
      }
    }
    setDeletingStrategy(null);
  };

  // --- STRATEGY DETAILS VIEW ---
  if (selectedStrategy) {
    const strategyTrades = trades.filter(t => t.strategy === selectedStrategy.name);
    // Slice the first 4 since addTrade prepends newest trades to the beginning
    const recentTrades = strategyTrades.slice(0, 4);

    return (
      <div className="relative min-h-screen bg-black pb-24 font-sans text-white">
        <TopNavbar>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#141414] text-neutral-300">
            <DollarSquareIcon size={22} />
          </div>
        </TopNavbar>

        {/* SUBHEADER */}
        <div className="mt-6 flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setSelectedStrategy(null)} className="text-white outline-none">
              <ArrowLeft01Icon size={24} />
            </button>
            <span className="text-[22px] font-semibold tracking-tight text-white">{selectedStrategy.name}</span>
            <button onClick={() => setEditingStrategy(selectedStrategy)} className="text-white outline-none">
              <PencilEdit01Icon size={20} />
            </button>
          </div>
          <button onClick={() => setDeletingStrategy(selectedStrategy)} className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F44336] text-white outline-none">
            <Delete02Icon size={18} />
          </button>
        </div>

        {/* STRATEGY DETAILS CARD */}
        <section className="mt-6 px-4">
          <div className="flex flex-col rounded-2xl border border-neutral-800/60 bg-[#090909] p-5">
            <h3 className="text-[16px] font-medium text-white mb-4">Strategy Details</h3>
            
            <div className="flex flex-col gap-1 mb-6">
              <span className="text-[13px] font-medium text-neutral-500">Description</span>
              <span className="text-[15px] font-medium text-white mt-1">
                {selectedStrategy.description ? selectedStrategy.description : "No Description"}
              </span>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-[13px] font-medium text-neutral-500 mb-1">Confluences</span>
              {selectedStrategy.confluences.length === 0 ? (
                <span className="text-[14px] font-medium text-white">This strategy does not have any confluences</span>
              ) : (
                selectedStrategy.confluences.map(c => (
                  <div key={c.id} className="flex items-center gap-3">
                    <div className="h-[18px] w-[18px] rounded-full border-[1.5px] border-neutral-600" />
                    <span className="text-[14px] font-medium text-white">{c.value}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* IDEAL ENTRY CARD */}
        <section className="mt-4 px-4">
          <div className="flex flex-col rounded-2xl border border-neutral-800/60 bg-[#090909] p-4">
            <h3 className="text-[16px] font-medium text-white mb-4">Ideal Entry</h3>
            <div className="flex flex-col items-center justify-center rounded-xl border border-neutral-800/60 bg-[#0F0F0F] py-8 gap-2">
              <CloudUploadIcon size={34} className="text-neutral-500 mb-1" />
              <p className="text-[15px] font-medium text-white tracking-tight">Upload Screenshot</p>
              <p className="text-[12px] font-medium text-neutral-500 text-center">Drop here, paste with Ctrl+V or click</p>
            </div>
          </div>
        </section>

        {/* RECENT TRADES FILTERED BY THIS STRATEGY */}
        <section className="mt-4 px-4">
          <div className="flex flex-col rounded-2xl border border-neutral-800/60 bg-[#090909] p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex flex-col">
                <span className="text-[16px] font-medium tracking-tight text-white">Recent Trades</span>
                <span className="text-[14px] font-semibold text-neutral-500">Last 4 registered trades</span>
              </div>
              <Link 
                href="/trades" 
                className="flex items-center gap-1.5 rounded-lg bg-[#141414] px-3 py-1.5 text-[13px] font-medium text-white outline-none"
              >
                See all <ArrowRight01Icon size={14} />
              </Link>
            </div>

            {recentTrades.length === 0 ? (
              <div className="flex min-h-[120px] items-center justify-center">
                <span className="text-[14px] text-center font-medium text-neutral-600 px-4">
                  You don't have any trades yet. Register a trade to get started.
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {recentTrades.map(trade => {
                  const isWin = trade.pnl > 0;
                  const isLoss = trade.pnl < 0;
                  const pnlColor = isWin ? 'text-[#009C00]' : isLoss ? 'text-[#F44336]' : 'text-neutral-400';
                  const pnlSymbol = isWin ? '▴' : isLoss ? '▾' : '';
                  const sideSymbol = trade.side.toLowerCase() === 'buy' ? '↑' : '↓';
                  const sideColor = trade.side.toLowerCase() === 'buy' ? 'text-[#009C00]' : 'text-[#F44336]';

                  return (
                    <div key={trade.id} className="flex flex-col rounded-xl border border-neutral-800/60 bg-[#0F0F0F] p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[16px] font-medium text-white tracking-tight">{trade.symbol}</span>
                        <span className={`text-[16px] font-medium tracking-tight ${pnlColor}`}>
                          {pnlSymbol} ${Math.abs(trade.pnl).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 2})}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-[15px] font-medium text-white capitalize">
                          {trade.side} <span className={sideColor}>{sideSymbol}</span>
                        </span>
                        <span className="text-[15px] font-semibold text-neutral-500">
                          {format(new Date(trade.date), 'EEE dd/MM')}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <EditStrategyModal strategy={editingStrategy} onClose={() => setEditingStrategy(null)} />
        <DeleteStrategyModal strategy={deletingStrategy} onClose={() => setDeletingStrategy(null)} onConfirm={confirmDelete} />
      </div>
    );
  }

  // --- MAIN STRATEGIES LIST VIEW ---
  return (
    <div className="relative min-h-screen bg-black pb-24 font-sans text-white">
      
      <TopNavbar>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#141414] text-neutral-300 outline-none">
            <DollarSquareIcon size={22} />
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content 
              align="end"
              className="z-50 min-w-[200px] overflow-hidden rounded-xl border border-neutral-800 bg-[#0A0A0A]/90 backdrop-blur-xl p-1 shadow-2xl text-white text-[15px] animate-in fade-in-80 zoom-in-95"
            >
              <DropdownMenu.Item onClick={() => setDisplayView('Money View')} className="flex items-center justify-between rounded-lg px-3 py-2.5 outline-none">
                Money View <DollarSquareIcon size={18} className="text-neutral-400" />
              </DropdownMenu.Item>
              <DropdownMenu.Item onClick={() => setDisplayView('Percentage View')} className="flex items-center justify-between rounded-lg px-3 py-2.5 outline-none">
                Percentage View <PercentIcon size={18} className="text-neutral-400" />
              </DropdownMenu.Item>
              <DropdownMenu.Item onClick={() => setDisplayView('Hide P&L')} className="flex items-center justify-between rounded-lg px-3 py-2.5 outline-none">
                Hide P&L <ViewOffSlashIcon size={18} className="text-neutral-400" />
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </TopNavbar>

      <section className="mt-6 px-4 flex flex-col gap-4">
        {(strategies || []).map((strategy) => {
          const strategyTrades = trades.filter(t => t.strategy === strategy.name);
          const totalTrades = strategyTrades.length;
          const wins = strategyTrades.filter(t => t.pnl > 0).length;
          const winrate = totalTrades > 0 ? `${Math.round((wins / totalTrades) * 100)}%` : '-';
          const totalPnl = strategyTrades.reduce((sum, t) => sum + t.pnl, 0);

          const isWin = totalPnl > 0;
          const isLoss = totalPnl < 0;
          
          const pnlColorClass = isWin 
            ? 'text-[#009C00] bg-[#009C00]/15' 
            : isLoss 
              ? 'text-[#F44336] bg-[#F44336]/15' 
              : 'text-neutral-400 bg-[#1A1A1A]';
              
          const pnlSymbol = isWin ? '▴ ' : isLoss ? '▾ ' : '';

          return (
            <div 
              key={strategy.id} 
              onClick={() => setSelectedStrategy(strategy)}
              className="flex flex-col rounded-2xl border border-neutral-800/60 bg-[#090909] p-4 shadow-sm"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <span className="text-[17px] font-semibold tracking-tight text-white">{strategy.name}</span>
                  <div className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-[13px] font-semibold ${pnlColorClass}`}>
                    {pnlSymbol}${Math.abs(totalPnl).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 2})}
                  </div>
                </div>
                
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger 
                    onClick={(e) => e.stopPropagation()} 
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#141414] text-neutral-400 outline-none"
                  >
                    <Menu05Icon size={18} />
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.Content 
                      align="end"
                      className="z-50 min-w-[180px] overflow-hidden rounded-xl border border-neutral-800 bg-[#0A0A0A]/95 backdrop-blur-xl py-1 shadow-2xl animate-in fade-in-80 zoom-in-95"
                    >
                      <DropdownMenu.Item 
                        onClick={(e) => { e.stopPropagation(); setEditingStrategy(strategy); }}
                        className="flex items-center justify-between px-4 py-3 text-[14px] font-medium text-white outline-none bg-[#1A1A1A]"
                      >
                        Edit strategy
                      </DropdownMenu.Item>
                      <DropdownMenu.Separator className="h-px w-full bg-neutral-800/60 my-1" />
                      <DropdownMenu.Item 
                        onClick={(e) => { e.stopPropagation(); setDeletingStrategy(strategy); }}
                        className="flex items-center justify-between px-4 py-3 text-[14px] font-medium text-[#F44336] outline-none"
                      >
                        Delete strategy
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>

              </div>
              <div className="flex items-center gap-8">
                <div className="flex flex-col gap-1 w-24">
                  <span className="text-[13px] font-medium text-neutral-500">Trade Winrate</span>
                  <span className="text-[14px] font-semibold text-white">{winrate}</span>
                </div>
                <div className="flex flex-col gap-1 w-24">
                  <span className="text-[13px] font-medium text-neutral-500">Total Trades</span>
                  <span className="text-[14px] font-semibold text-white">{totalTrades}</span>
                </div>
              </div>
            </div>
          );
        })}

        <button 
          onClick={() => setIsOpen(true)}
          className="flex w-full flex-col items-center justify-center gap-1 rounded-2xl border border-neutral-800/60 bg-[#090909] py-8 text-neutral-400 outline-none"
        >
          <PlusSignIcon size={24} />
          <span className="text-[15px] font-medium">Create Strategy</span>
        </button>
      </section>

      <Dialog.Root 
        open={isOpen} 
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) setTimeout(resetForm, 300);
        }}
      >
        <Dialog.Trigger asChild>
          <button 
            className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#001A00] backdrop-blur-xl text-[#009C00] z-30 outline-none"
            aria-label="Create new strategy"
          >
            <PlusSignIcon size={28} />
          </button>
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content className="fixed left-[50%] top-[50%] z-[70] flex max-h-[90vh] w-[95vw] max-w-lg translate-x-[-50%] translate-y-[-50%] flex-col rounded-2xl border border-neutral-800 bg-[#090909] p-3 outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
            
            <div className="flex items-start justify-between mb-6">
              <div>
                <Dialog.Title className="text-[18px] font-medium text-white">Create Strategy</Dialog.Title>
                <Dialog.Description className="mt-0.5 text-[15px] text-neutral-400 font-semibold">
                  Define your trading strategy and its confluences.
                </Dialog.Description>
              </div>
              <Dialog.Close className="text-white outline-none">
                <Cancel01Icon size={22} />
              </Dialog.Close>
            </div>

            <div className="flex-1 overflow-y-auto pr-1.5 scrollbar-hide space-y-5 pb-4">
              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-semibold text-white">Name *</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter strategy name" 
                  className="w-full rounded-xl bg-[#1F1F1F] px-3 py-2.5 text-[14px] font-medium text-white outline-none placeholder:text-neutral-400 border border-transparent"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-semibold text-white">Description</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter strategy description" 
                  className="w-full min-h-[100px] resize-none rounded-xl bg-[#1F1F1F] px-3 py-2.5 text-[14px] font-medium text-white outline-none placeholder:text-neutral-400 border border-transparent"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-semibold text-white">Confluences</label>
                <div className="flex flex-col gap-2">
                  {confluences.map((confluence) => (
                    <div key={confluence.id} className="flex items-center gap-2">
                      <input 
                        type="text" 
                        value={confluence.value}
                        onChange={(e) => handleUpdateConfluence(confluence.id, e.target.value)}
                        placeholder="Enter confluence name" 
                        className="flex-1 rounded-xl bg-[#1F1F1F] px-3 py-2.5 text-[14px] font-medium text-white outline-none placeholder:text-neutral-400 border border-transparent"
                      />
                      <button 
                        onClick={() => handleRemoveConfluence(confluence.id)}
                        className="flex h-[42px] w-[42px] items-center justify-center rounded-xl bg-[#141414] text-[#F44336] outline-none"
                      >
                        <Delete02Icon size={18} />
                      </button>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={handleAddConfluence}
                  className="mt-1 w-full rounded-xl bg-[#141414] py-2.5 text-[14px] font-medium text-white outline-none"
                >
                  Add Confluence
                </button>
              </div>
            </div>

            <div className="mt-2 flex items-center justify-end gap-3 pt-4 border-t border-neutral-800/60">
              <Dialog.Close className="rounded-xl px-5 py-2.5 text-[14px] font-medium text-neutral-400 bg-[#141414] outline-none">
                Cancel
              </Dialog.Close>
              <button 
                onClick={handleSave}
                className="rounded-xl bg-white px-5 py-2.5 text-[14px] font-medium text-black outline-none"
              >
                Save
              </button>
            </div>

          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <EditStrategyModal strategy={editingStrategy} onClose={() => setEditingStrategy(null)} />
      <DeleteStrategyModal strategy={deletingStrategy} onClose={() => setDeletingStrategy(null)} onConfirm={confirmDelete} />
    </div>
  );
}

// --- SUBCOMPONENTS ---

function EditStrategyModal({ strategy, onClose }: { strategy: Strategy | null, onClose: () => void }) {
  const { updateStrategy } = useTrades();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [confluences, setConfluences] = useState<Confluence[]>([]);

  useEffect(() => {
    if (strategy) {
      setName(strategy.name);
      setDescription(strategy.description);
      setConfluences(strategy.confluences);
    }
  }, [strategy]);

  const handleUpdateConfluence = (id: number, value: string) => {
    setConfluences(confluences.map(c => (c.id === id ? { ...c, value } : c)));
  };

  const handleRemoveConfluence = (id: number) => {
    setConfluences(confluences.filter(c => c.id !== id));
  };

  const handleAddConfluence = () => {
    setConfluences([...confluences, { id: Date.now(), value: '' }]);
  };

  const handleSave = () => {
    if (!strategy || !name.trim()) return;
    
    updateStrategy({
      ...strategy,
      name: name.trim(),
      description: description.trim(),
      confluences: confluences.filter(c => c.value.trim() !== '')
    });
    
    onClose();
  };

  return (
    <Dialog.Root open={!!strategy} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-[70] flex max-h-[90vh] w-[95vw] max-w-lg translate-x-[-50%] translate-y-[-50%] flex-col rounded-2xl border border-neutral-800 bg-[#090909] p-3 outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
          
          <div className="flex items-start justify-between mb-6">
            <div>
              <Dialog.Title className="text-[18px] font-medium text-white">Edit Strategy</Dialog.Title>
              <Dialog.Description className="mt-0.5 text-[15px] text-neutral-400 font-semibold">
                Update your trading strategy details.
              </Dialog.Description>
            </div>
            <Dialog.Close className="text-white outline-none">
              <Cancel01Icon size={22} />
            </Dialog.Close>
          </div>

          <div className="flex-1 overflow-y-auto pr-1.5 scrollbar-hide space-y-5 pb-4">
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-semibold text-white">Name *</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter strategy name" 
                className="w-full rounded-xl bg-[#1F1F1F] px-3 py-2.5 text-[14px] font-medium text-white outline-none placeholder:text-neutral-400 border border-transparent"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-semibold text-white">Description</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter strategy description" 
                className="w-full min-h-[100px] resize-none rounded-xl bg-[#1F1F1F] px-3 py-2.5 text-[14px] font-medium text-white outline-none placeholder:text-neutral-400 border border-transparent"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-semibold text-white">Confluences</label>
              <div className="flex flex-col gap-2">
                {confluences.map((confluence) => (
                  <div key={confluence.id} className="flex items-center gap-2">
                    <input 
                      type="text" 
                      value={confluence.value}
                      onChange={(e) => handleUpdateConfluence(confluence.id, e.target.value)}
                      placeholder="Enter confluence name" 
                      className="flex-1 rounded-xl bg-[#1F1F1F] px-3 py-2.5 text-[14px] font-medium text-white outline-none placeholder:text-neutral-400 border border-transparent"
                    />
                    <button 
                      onClick={() => handleRemoveConfluence(confluence.id)}
                      className="flex h-[42px] w-[42px] items-center justify-center rounded-xl bg-[#141414] text-[#F44336] outline-none"
                    >
                      <Delete02Icon size={18} />
                    </button>
                  </div>
                ))}
              </div>
              <button 
                onClick={handleAddConfluence}
                className="mt-1 w-full rounded-xl bg-[#141414] py-2.5 text-[14px] font-medium text-white outline-none"
              >
                Add Confluence
              </button>
            </div>
          </div>

          <div className="mt-2 flex items-center justify-end gap-3 pt-4 border-t border-neutral-800/60">
            <Dialog.Close className="rounded-xl px-5 py-2.5 text-[14px] font-medium text-neutral-400 bg-[#141414] outline-none">
              Cancel
            </Dialog.Close>
            <button 
              onClick={handleSave}
              className="rounded-xl bg-white px-5 py-2.5 text-[14px] font-medium text-black outline-none"
            >
              Save Changes
            </button>
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function DeleteStrategyModal({ strategy, onClose, onConfirm }: { strategy: Strategy | null, onClose: () => void, onConfirm: () => void }) {
  return (
    <Dialog.Root open={!!strategy} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-[70] flex w-[90vw] max-w-sm translate-x-[-50%] translate-y-[-50%] flex-col rounded-2xl border border-neutral-800 bg-[#090909] p-5 outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
          
          <Dialog.Title className="text-[18px] font-semibold text-white mb-2">Delete Strategy</Dialog.Title>
          <Dialog.Description className="text-[14px] font-medium text-neutral-400 mb-6 leading-relaxed">
            Are you sure you want to delete <span className="text-white">"{strategy?.name}"</span>? This action cannot be undone.
          </Dialog.Description>
          
          <div className="flex items-center justify-end gap-3">
            <Dialog.Close className="rounded-xl bg-[#141414] px-5 py-2.5 text-[14px] font-medium text-neutral-400 outline-none">
              Cancel
            </Dialog.Close>
            <button 
              onClick={onConfirm} 
              className="rounded-xl bg-[#F44336] px-5 py-2.5 text-[14px] font-medium text-white outline-none"
            >
              Delete
            </button>
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
