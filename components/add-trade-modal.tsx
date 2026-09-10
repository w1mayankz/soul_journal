'use client';

import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Popover from '@radix-ui/react-popover';
import * as Tabs from '@radix-ui/react-tabs';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { PlusSignIcon, Cancel01Icon, ArrowDown01Icon, Calendar01Icon, Search01Icon } from 'hugeicons-react';
import { useTrades } from '../context/trades-context';

const SYMBOLS = ["NQ1!", "MNQ1!", "ES1!", "MES1!", "GC1!", "MGC1!", "YM1!", "MYM1!", "NAS100", "US30"];

export function AddTradeModal() {
  const { addTrade } = useTrades();
  const [isOpen, setIsOpen] = useState(false);
  
  // Form State
  const [symbol, setSymbol] = useState('');
  const [symbolSearch, setSymbolSearch] = useState('');
  const [symbolOpen, setSymbolOpen] = useState(false);
  
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState("09:30");
  const [dateOpen, setDateOpen] = useState(false);
  
  const [side, setSide] = useState('buy');
  const [pnl, setPnl] = useState('');
  const [pnlError, setPnlError] = useState(false);

  // R/R State
  const [rrInput, setRrInput] = useState('1:1');
  const [rrSplit, setRrSplit] = useState(50); // Represents % of red (Risk)

  const handlePnlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/[^0-9.,-]/.test(val)) setPnlError(true);
    else setPnlError(false);
    setPnl(val);
  };

  // Handles manual typing in the R/R text field (e.g., "1:50")
  const handleRrInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setRrInput(val);

    const parts = val.split(':');
    if (parts.length === 2) {
      const risk = parseFloat(parts[0]);
      const reward = parseFloat(parts[1]);
      if (!isNaN(risk) && !isNaN(reward) && risk >= 0 && reward >= 0 && (risk > 0 || reward > 0)) {
        const split = (risk / (risk + reward)) * 100;
        setRrSplit(split);
      }
    }
  };

  // Handles sliding the physical range bar
  const handleRrSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const split = parseFloat(e.target.value);
    setRrSplit(split);

    if (Math.abs(split - 50) < 0.5) {
      setRrInput('1:1');
    } else if (split < 50) {
      const reward = (100 - split) / split;
      setRrInput(`1:${reward.toFixed(1).replace(/\.0$/, '')}`);
    } else {
      const risk = split / (100 - split);
      setRrInput(`${risk.toFixed(1).replace(/\.0$/, '')}:1`);
    }
  };

  const handleSave = () => {
    if (pnlError || !symbol || !date || !pnl) return;
    const parsedPnl = parseFloat(pnl.replace(/,/g, ''));
    if (isNaN(parsedPnl)) return;

    addTrade({
      id: Date.now(),
      date: `${format(date, 'yyyy/MM/dd')} ${time}`,
      symbol,
      side,
      pnl: parsedPnl
    });
    
    setPnl('');
    setSymbol('');
    setRrInput('1:1');
    setRrSplit(50);
    setIsOpen(false);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button 
          className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#001A00] backdrop-blur-xl text-[#009C00] active:scale-95 transition-all z-30 outline-none"
          aria-label="Log new trade"
        >
          <PlusSignIcon size={28} />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-[70] flex max-h-[90vh] w-[95vw] max-w-lg translate-x-[-50%] translate-y-[-50%] flex-col rounded-2xl border border-neutral-800 bg-[#0A0A0A] p-5 shadow-2xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
          
          <div className="flex items-start justify-between mb-6">
            <div>
              <Dialog.Title className="text-[18px] font-medium text-white">Add Trade</Dialog.Title>
              <Dialog.Description className="mt-1 text-[14px] text-neutral-500">Enter the details of your trade.</Dialog.Description>
            </div>
            <Dialog.Close className="text-neutral-500 hover:text-white transition-colors outline-none">
              <Cancel01Icon size={20} />
            </Dialog.Close>
          </div>

          <div className="flex-1 overflow-y-auto pr-1 scrollbar-hide space-y-5 pb-4">
            
            {/* SYMBOL FIELD */}
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-medium text-white">Symbol *</label>
              <Popover.Root open={symbolOpen} onOpenChange={setSymbolOpen}>
                <Popover.Trigger className="flex w-full items-center justify-between rounded-xl bg-[#141414] px-4 py-3.5 text-[15px] font-medium text-white outline-none active:scale-[0.99] transition-transform">
                  {symbol || <span className="text-neutral-600">Select symbol...</span>}
                  <ArrowDown01Icon size={18} className="text-neutral-500" />
                </Popover.Trigger>
                <Popover.Content align="start" className="z-[80] w-[calc(95vw-40px)] max-w-[440px] rounded-xl border border-neutral-800 bg-[#0A0A0A] p-0 shadow-2xl animate-in fade-in-80 zoom-in-95">
                  <div className="flex items-center border-b border-neutral-800 px-3 py-2">
                    <Search01Icon size={16} className="text-neutral-500 mr-2" />
                    <input type="text" placeholder="Search symbols..." className="flex-1 bg-transparent py-1.5 text-[14px] text-white outline-none placeholder:text-neutral-600" value={symbolSearch} onChange={(e) => setSymbolSearch(e.target.value)} />
                  </div>
                  <div className="max-h-[200px] overflow-y-auto p-1">
                    {filteredSymbols.map(s => (
                      <button key={s} onClick={() => { setSymbol(s); setSymbolOpen(false); }} className="w-full rounded-lg px-3 py-2.5 text-left text-[14px] font-medium text-neutral-300 hover:bg-[#1A1A1A] hover:text-white outline-none">{s}</button>
                    ))}
                  </div>
                </Popover.Content>
              </Popover.Root>
            </div>

            {/* ENTRY DATE FIELD */}
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-medium text-white">Entry date *</label>
              <Popover.Root open={dateOpen} onOpenChange={setDateOpen}>
                <Popover.Trigger className="flex w-full items-center justify-between rounded-xl bg-[#141414] px-4 py-3.5 text-[15px] font-medium text-white outline-none active:scale-[0.99] transition-transform">
                  {date ? `${format(date, 'yyyy/MM/dd')} ${time}` : <span className="text-neutral-600">Pick a date</span>}
                  <Calendar01Icon size={18} className="text-neutral-500" />
                </Popover.Trigger>
                <Popover.Content align="start" className="z-[80] rounded-xl border border-neutral-800 bg-[#0A0A0A] p-3 shadow-2xl animate-in fade-in-80 zoom-in-95">
                  <DayPicker
                    mode="single" selected={date} onSelect={setDate} showOutsideDays={true}
                    classNames={{
                      months: "flex flex-col", caption: "flex justify-center pt-1 relative items-center mb-4", caption_label: "text-[14px] font-medium text-white", nav: "space-x-1 flex items-center", nav_button: "h-7 w-7 bg-transparent p-0 text-neutral-400 hover:text-white transition-colors", nav_button_previous: "absolute left-1", nav_button_next: "absolute right-1", table: "w-full border-collapse", head_row: "flex", head_cell: "text-neutral-500 rounded-md w-9 font-medium text-[12px]", row: "flex w-full mt-1", cell: "h-9 w-9 text-center p-0 relative focus-within:relative focus-within:z-20 rounded-md", day: "h-9 w-9 p-0 text-[14px] font-medium text-white hover:bg-[#1A1A1A] rounded-md transition-colors outline-none", day_selected: "bg-[#009C00] !text-white hover:bg-[#009C00] hover:text-white", day_today: "bg-[#1A1A1A] text-white", day_outside: "text-neutral-600 opacity-50", day_disabled: "text-neutral-600 opacity-50", day_hidden: "invisible",
                    }}
                  />
                  <div className="mt-3 border-t border-neutral-800 pt-3">
                    <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full rounded-lg bg-[#141414] px-3 py-2 text-[14px] font-medium text-white outline-none" />
                  </div>
                </Popover.Content>
              </Popover.Root>
            </div>

            {/* SIDE TABS */}
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-medium text-white">Side *</label>
              <Tabs.Root defaultValue={side} onValueChange={setSide}>
                <Tabs.List className="flex w-[160px] gap-1 rounded-xl bg-[#141414] p-1">
                  <Tabs.Trigger value="buy" className="flex-1 rounded-lg py-2 text-[13px] font-semibold text-neutral-500 transition-all data-[state=active]:bg-[#262626] data-[state=active]:text-white outline-none">Buy ↑</Tabs.Trigger>
                  <Tabs.Trigger value="sell" className="flex-1 rounded-lg py-2 text-[13px] font-semibold text-neutral-500 transition-all data-[state=active]:bg-[#262626] data-[state=active]:text-white outline-none">Sell ↓</Tabs.Trigger>
                </Tabs.List>
              </Tabs.Root>
            </div>

            {/* P&L FIELD */}
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-medium text-white">P&L *</label>
              <div className={`flex items-center rounded-xl bg-[#141414] px-4 border transition-colors ${pnlError ? 'border-[#F44336]' : 'border-transparent focus-within:border-neutral-700'}`}>
                <span className="text-neutral-500 mr-2 font-medium">$</span>
                <input type="text" value={pnl} onChange={handlePnlChange} placeholder="Enter your P&L" className="flex-1 bg-transparent py-3.5 text-[15px] font-medium text-white outline-none placeholder:text-neutral-600" />
              </div>
              {pnlError && <p className="text-[12px] font-medium text-[#F44336]">Invalid characters</p>}
            </div>

            {/* CUSTOM RISK/REWARD SLIDER */}
            <div className="flex flex-col gap-2 pt-2">
              <label className="text-[14px] font-medium text-white">Risk/Reward ratio</label>
              <div className="flex items-center gap-3">
                <input 
                  type="text" 
                  value={rrInput}
                  onChange={handleRrInputChange}
                  className="w-[60px] h-9 rounded-xl bg-[#141414] text-center text-[13px] font-medium text-white outline-none border border-transparent focus:border-neutral-700 transition-colors"
                />
                
                {/* The Custom Visual Track */}
                <div className="relative flex-1 h-[22px] rounded-md overflow-hidden bg-[#1A1A1A]">
                  <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: `linear-gradient(to right, #F44336 ${rrSplit}%, #009C00 ${rrSplit}%)` }}
                  />
                  {/* Visual gap separating red and green */}
                  <div 
                    className="absolute top-0 bottom-0 w-[4px] bg-[#0A0A0A] pointer-events-none -ml-[2px]"
                    style={{ left: `${rrSplit}%` }}
                  />
                  {/* Invisible native slider capturing gestures */}
                  <input
                    type="range"
                    min="3.7"  // ~ 1:26
                    max="96.3" // ~ 26:1
                    step="0.1"
                    value={Math.max(3.7, Math.min(96.3, rrSplit))}
                    onChange={handleRrSliderChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>

                {/* Reset Cross */}
                {rrInput !== '1:1' && (
                  <button onClick={() => { setRrInput('1:1'); setRrSplit(50); }} className="text-neutral-500 hover:text-white transition-colors outline-none">
                    <Cancel01Icon size={18} />
                  </button>
                )}
              </div>
            </div>

          </div>

          <div className="mt-2 flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
            <Dialog.Close className="rounded-xl px-5 py-2.5 text-[14px] font-semibold text-neutral-400 hover:text-white transition-colors outline-none bg-[#141414] hover:bg-[#1A1A1A]">
              Cancel
            </Dialog.Close>
            <button onClick={handleSave} className="rounded-xl bg-white px-5 py-2.5 text-[14px] font-semibold text-black active:scale-95 transition-transform outline-none">
              Save
            </button>
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
