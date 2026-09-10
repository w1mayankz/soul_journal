'use client';

import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Popover from '@radix-ui/react-popover';
import * as Tabs from '@radix-ui/react-tabs';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { 
  PlusSignIcon, 
  Cancel01Icon, 
  ArrowDown01Icon, 
  ArrowRight01Icon,
  Calendar01Icon, 
  Search01Icon,
  CloudUploadIcon 
} from 'hugeicons-react';
import { useTrades } from '../context/trades-context';

const SYMBOLS = ["NQ1!", "MNQ1!", "ES1!", "MES1!", "GC1!", "MGC1!", "YM1!", "MYM1!", "NAS100", "US30"];
const STRATEGIES = ["None", "Silver Bullet", "London Killzone", "New York Reversal", "Opening Gap"];

export function AddTradeModal() {
  const { addTrade, activeAccountId } = useTrades();
  const [isOpen, setIsOpen] = useState(false);
  
  // Basic Form State
  const [symbol, setSymbol] = useState('');
  const [symbolSearch, setSymbolSearch] = useState('');
  const [symbolOpen, setSymbolOpen] = useState(false);
  
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState("09:30");
  const [dateOpen, setDateOpen] = useState(false);
  
  const [side, setSide] = useState('buy');
  const [pnl, setPnl] = useState('');
  const [pnlError, setPnlError] = useState(false);

  // Risk/Reward State
  const [risk, setRisk] = useState(1);
  const [reward, setReward] = useState(1);
  const [rrInput, setRrInput] = useState('1:1');

  // Rating State
  const [rating, setRating] = useState<number | null>(null);

  // Advanced Options State
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [exitDate, setExitDate] = useState<Date | undefined>(undefined);
  const [exitTime, setExitTime] = useState("16:00");
  const [exitDateOpen, setExitDateOpen] = useState(false);
  
  const [takeProfit, setTakeProfit] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [entryPrice, setEntryPrice] = useState('');
  const [exitPrice, setExitPrice] = useState('');
  const [lotSize, setLotSize] = useState('');
  const [commission, setCommission] = useState('');
  const [swap, setSwap] = useState('');

  // Strategy State
  const [strategy, setStrategy] = useState('None');
  const [strategyOpen, setStrategyOpen] = useState(false);

  // COMPLETELY RESETS ALL FIELDS
  const resetForm = () => {
    setSymbol('');
    setSymbolSearch('');
    setDate(new Date());
    setTime("09:30");
    setSide('buy');
    setPnl('');
    setPnlError(false);
    
    setRisk(1);
    setReward(1);
    setRrInput('1:1');
    setRating(null);
    
    setIsAdvancedOpen(false);
    setExitDate(undefined);
    setExitTime("16:00");
    setTakeProfit('');
    setStopLoss('');
    setEntryPrice('');
    setExitPrice('');
    setLotSize('');
    setCommission('');
    setSwap('');
    
    setStrategy('None');
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setTimeout(resetForm, 300); // Wipes data after close animation
    }
  };

  const filteredSymbols = SYMBOLS.filter(s => s.toLowerCase().includes(symbolSearch.toLowerCase()));

  const handlePnlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/[^0-9.,-]/.test(val)) setPnlError(true);
    else setPnlError(false);
    setPnl(val);
  };

  const handleRrInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setRrInput(val);
    const parts = val.split(':');
    if (parts.length === 2) {
      const r1 = parseFloat(parts[0]);
      const r2 = parseFloat(parts[1]);
      if (!isNaN(r1) && !isNaN(r2) && r1 > 0 && r2 > 0) {
        setRisk(r1);
        setReward(r2);
      }
    }
  };

  const handleRrSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const p = parseFloat(e.target.value) / 100;
    
    if (Math.abs(p - 0.5) < 0.01) {
      setRisk(1);
      setReward(1);
      setRrInput('1:1');
      return;
    }
    
    let newRisk = 1, newReward = 1;
    if (p < 0.5) {
      newReward = parseFloat(((1 / p) - 1).toFixed(1));
    } else {
      newRisk = parseFloat((p / (1 - p)).toFixed(1));
    }
    
    setRisk(newRisk);
    setReward(newReward);
    setRrInput(`${newRisk}:${newReward}`);
  };

  const handleSave = () => {
    if (pnlError || !symbol || !date || !pnl || !activeAccountId) return;
    
    const parsedPnl = parseFloat(pnl.replace(/,/g, ''));
    if (isNaN(parsedPnl)) return;

    addTrade({
      id: Date.now(),
      accountId: activeAccountId,
      date: `${format(date, 'yyyy/MM/dd')} ${time}`,
      symbol,
      side,
      pnl: parsedPnl
    });
    
    setIsOpen(false);
    setTimeout(resetForm, 300); 
  };

  // RR Slider math
  const redPercent = (risk / (risk + reward)) * 100;
  const greenPercent = (reward / (risk + reward)) * 100;
  const isDefaultRr = risk === 1 && reward === 1;

  // Rating Slider math
  const ratingPercent = rating !== null ? (rating / 10) * 100 : 0;

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
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
        <Dialog.Content className="fixed left-[50%] top-[50%] z-[70] flex max-h-[90vh] w-[95vw] max-w-lg translate-x-[-50%] translate-y-[-50%] flex-col rounded-2xl border border-neutral-800 bg-[#090909] p-3 outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
          
          <div className="flex items-start justify-between mb-6">
            <div>
              <Dialog.Title className="text-[18px] font-medium text-white">Add Trade</Dialog.Title>
              <Dialog.Description className="mt-0.5 text-[15px] text-neutral-400 font-semibold">Enter the details of your trade.</Dialog.Description>
            </div>
            <Dialog.Close className="text-white hover:text-white transition-colors outline-none">
              <Cancel01Icon size={22} />
            </Dialog.Close>
          </div>

          <div className="flex-1 overflow-y-auto pr-1.5 scrollbar-hide space-y-5 pb-4">
            
            {/* SYMBOL */}
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-semibold text-white">Symbol *</label>
              <Popover.Root open={symbolOpen} onOpenChange={setSymbolOpen}>
                <Popover.Trigger className="flex w-full items-center justify-between rounded-xl bg-[#141414] px-3 py-2.5 text-[15px] font-medium text-white outline-none active:scale-[0.99] transition-transform">
                  {symbol || <span className="text-neutral-400">Select Symbol</span>}
                  <ArrowDown01Icon size={20} className="text-neutral-400" />
                </Popover.Trigger>
                <Popover.Content align="start" className="z-[80] w-[calc(95vw-40px)] max-w-[440px] rounded-xl border border-neutral-800 bg-neutral-500 p-0 shadow-2xl animate-in fade-in-80 zoom-in-95">
                  <div className="flex items-center border-b border-neutral-800 px-3 py-2">
                    <Search01Icon size={16} className="text-neutral-500 mr-2" />
                    <input 
                      type="text" 
                      placeholder="Search Symbols" 
                      className="flex-1 bg-transparent py-1.5 text-[14px] text-white outline-none placeholder:text-neutral-600"
                      value={symbolSearch}
                      onChange={(e) => setSymbolSearch(e.target.value)}
                    />
                  </div>
                  <div className="max-h-[200px] overflow-y-auto p-1">
                    {filteredSymbols.map(s => (
                      <button 
                        key={s} 
                        onClick={() => { setSymbol(s); setSymbolOpen(false); }}
                        className="w-full rounded-lg px-3 py-2.5 text-left text-[14px] font-semibold text-white hover:bg-[#1A1A1A] hover:text-white outline-none"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </Popover.Content>
              </Popover.Root>
              <span className="text-[14px] font-semibold text-neutral-600 px-1">Can't find a symbol? <span className="text-white underline underline-offset-2 cursor-pointer">Create it</span></span>
            </div>

            {/* DATE */}
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-semibold text-white">Entry date *</label>
              <Popover.Root open={dateOpen} onOpenChange={setDateOpen}>
                <Popover.Trigger className="flex w-full items-center justify-between rounded-xl bg-[#141414] px-3 py-2.5 text-[15px] font-medium text-white outline-none active:scale-[0.99] transition-transform">
                  {date ? `${format(date, 'yyyy/MM/dd')} ${time}` : <span className="text-neutral-600">Pick a date</span>}
                  <Calendar01Icon size={20} className="text-white" />
                </Popover.Trigger>
                <Popover.Content align="start" className="z-[80] rounded-xl border border-neutral-800 bg-[#0A0A0A] p-3 animate-in fade-in-80 zoom-in-95">
                  <DayPicker
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    showOutsideDays={true}
                    classNames={{
                      months: "flex flex-col",
                      caption: "flex justify-center pt-1 relative items-center mb-4",
                      caption_label: "text-[14px] font-medium text-white",
                      nav: "space-x-1 flex items-center",
                      nav_button: "h-7 w-7 bg-transparent p-0 text-neutral-400 hover:text-white transition-colors",
                      nav_button_previous: "absolute left-1",
                      nav_button_next: "absolute right-1",
                      table: "w-full border-collapse",
                      head_row: "flex",
                      head_cell: "text-neutral-500 rounded-md w-9 font-medium text-[12px]",
                      row: "flex w-full mt-1",
                      cell: "h-9 w-9 text-center p-0 relative focus-within:relative focus-within:z-20 rounded-md",
                      day: "h-9 w-9 p-0 text-[14px] font-medium text-white hover:bg-[#1A1A1A] rounded-md transition-colors outline-none",
                      day_selected: "bg-green-500 !text-black hover:bg-green-500 hover:text-black",
                      day_today: "bg-[#1A1A1A] text-white",
                      day_outside: "text-neutral-600 opacity-50",
                      day_disabled: "text-neutral-600 opacity-50",
                      day_hidden: "invisible",
                    }}
                  />
                  <div className="mt-3 border-t border-neutral-800 pt-3">
                    <input 
                      type="time" 
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full rounded-lg bg-[#141414] px-3 py-2 text-[14px] font-medium text-white outline-none"
                    />
                  </div>
                </Popover.Content>
              </Popover.Root>
            </div>

            {/* SIDE */}
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-semibold text-white">Side *</label>
              <Tabs.Root value={side} onValueChange={setSide}>
                <Tabs.List className="flex w-[160px] gap-1 rounded-xl p-1">
                  <Tabs.Trigger value="buy" className="flex-1 rounded-lg py-2 text-[14px] font-semibold text-neutral-500 transition-all data-[state=active]:bg-[#262626] data-[state=active]:text-white outline-none">
                    Buy ↑
                  </Tabs.Trigger>
                  <Tabs.Trigger value="sell" className="flex-1 rounded-lg py-2 text-[14px] font-semibold text-neutral-500 transition-all data-[state=active]:bg-[#262626] data-[state=active]:text-white outline-none">
                    Sell ↓
                  </Tabs.Trigger>
                </Tabs.List>
              </Tabs.Root>
            </div>

            {/* P&L */}
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-semibold text-white">P&L *</label>
              <div className={`flex items-center rounded-xl bg-[#141414] px-4 border transition-colors ${pnlError ? 'border-[#F44336]' : 'border-transparent focus-within:border-neutral-700'}`}>
                <span className="text-neutral-500 mr-2 font-medium">$</span>
                <input 
                  type="text" 
                  value={pnl}
                  onChange={handlePnlChange}
                  placeholder="Enter your P&L" 
                  className="flex-1 bg-transparent py-3.5 text-[15px] font-medium text-white outline-none placeholder:text-neutral-600"
                />
              </div>
            </div>

            {/* RISK/REWARD SLIDER BLOCK */}
            <div className="flex flex-col gap-2 pt-1">
              <label className="text-[14px] font-semibold text-white">Risk/Reward ratio</label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={rrInput}
                  onChange={handleRrInputChange}
                  className="w-16 rounded-xl bg-[#141414] py-2 px-2 text-center text-[13px] font-medium text-white outline-none focus:ring-1 focus:ring-neutral-700 transition-shadow"
                />
                
                <div className="relative flex h-3.5 flex-1 items-center gap-[2px]">
                  <div className="h-full rounded-l-full bg-[#F44336]" style={{ width: `${redPercent}%` }}></div>
                  <div className="h-full rounded-r-full bg-[#009C00]" style={{ width: `${greenPercent}%` }}></div>

                  <input
                    type="range"
                    min="3.7"
                    max="96.3"
                    step="0.1"
                    value={redPercent}
                    onChange={handleRrSliderChange}
                    className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
                  />
                </div>
                
                <div className="w-5 flex justify-center">
                  {!isDefaultRr && (
                    <button
                      onClick={() => { setRisk(1); setReward(1); setRrInput('1:1'); }}
                      className="text-neutral-500 hover:text-white outline-none transition-colors"
                    >
                      <Cancel01Icon size={18} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* RATING SLIDER BLOCK */}
            <div className="flex flex-col gap-2 pt-1">
              <label className="text-[14px] font-semibold text-white">Rating</label>
              <div className="flex items-center gap-3">
                <span className="w-6 text-[13px] font-medium text-neutral-400">
                  {rating !== null ? rating.toFixed(1) : '-'}
                </span>
                
                <div className="relative flex h-3.5 flex-1 items-center rounded-full bg-[#1A1A1A]">
                  <div 
                    className="h-full rounded-full bg-[#009C00] transition-all duration-75" 
                    style={{ width: `${ratingPercent}%` }}
                  ></div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.1"
                    value={rating || 0}
                    onChange={(e) => setRating(parseFloat(e.target.value))}
                    className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
                  />
                </div>
                
                <div className="w-5 flex justify-center">
                  {rating !== null && (
                    <button
                      onClick={() => setRating(null)}
                      className="text-neutral-500 hover:text-white outline-none transition-colors"
                    >
                      <Cancel01Icon size={18} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* ADVANCED OPTIONS TOGGLE */}
            <button 
              onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
              className="flex items-center gap-2 text-[14px] font-semibold text-white outline-none transition-colors mt-2"
            >
              <ArrowRight01Icon size={18} className={`transition-transform duration-200 ${isAdvancedOpen ? 'rotate-90 text-white' : 'text-neutral-400'}`} /> 
              Advanced options
            </button>

            {/* ADVANCED OPTIONS CONTENT */}
            {isAdvancedOpen && (
              <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-top-2 duration-200 pt-2 pb-2">
                
                {/* Exit Date */}
                <div className="flex flex-col gap-2">
                  <label className="text-[14px] font-semibold text-white">Exit date</label>
                  <Popover.Root open={exitDateOpen} onOpenChange={setExitDateOpen}>
                    <Popover.Trigger className="flex w-full items-center justify-between rounded-xl bg-[#141414] px-4 py-3.5 text-[15px] font-medium text-white outline-none active:scale-[0.99] transition-transform">
                      {exitDate ? `${format(exitDate, 'yyyy/MM/dd')} ${exitTime}` : <span className="text-neutral-600">Enter trade exit date</span>}
                      <Calendar01Icon size={18} className="text-neutral-500" />
                    </Popover.Trigger>
                    <Popover.Content align="start" className="z-[80] rounded-xl border border-neutral-800 bg-[#0A0A0A] p-3 shadow-2xl">
                      <DayPicker
                        mode="single"
                        selected={exitDate}
                        onSelect={setExitDate}
                        showOutsideDays={true}
                        classNames={{
                          months: "flex flex-col",
                          caption: "flex justify-center pt-1 relative items-center mb-4",
                          caption_label: "text-[14px] font-medium text-white",
                          nav: "space-x-1 flex items-center",
                          nav_button: "h-7 w-7 bg-transparent p-0 text-neutral-400 hover:text-white",
                          nav_button_previous: "absolute left-1",
                          nav_button_next: "absolute right-1",
                          table: "w-full border-collapse",
                          head_row: "flex",
                          head_cell: "text-neutral-500 rounded-md w-9 font-medium text-[12px]",
                          row: "flex w-full mt-1",
                          cell: "h-9 w-9 text-center p-0 relative focus-within:relative focus-within:z-20 rounded-md",
                          day: "h-9 w-9 p-0 text-[14px] font-medium text-white hover:bg-[#1A1A1A] rounded-md transition-colors outline-none",
                          day_selected: "bg-green-500 !text-black hover:bg-green-500 hover:text-black",
                          day_today: "bg-[#1A1A1A] text-white",
                          day_outside: "text-neutral-600 opacity-50",
                        }}
                      />
                      <div className="mt-3 border-t border-neutral-800 pt-3">
                        <input 
                          type="time" 
                          value={exitTime}
                          onChange={(e) => setExitTime(e.target.value)}
                          className="w-full rounded-lg bg-[#141414] px-3 py-2 text-[14px] font-medium text-white outline-none"
                        />
                      </div>
                    </Popover.Content>
                  </Popover.Root>
                </div>

                {/* Number Inputs */}
                {[
                  { label: 'Take profit', val: takeProfit, setter: setTakeProfit, ph: 'Enter take profit price', currency: true },
                  { label: 'Stop loss', val: stopLoss, setter: setStopLoss, ph: 'Enter stop loss price', currency: true },
                  { label: 'Entry price', val: entryPrice, setter: setEntryPrice, ph: 'Enter entry price', currency: false },
                  { label: 'Exit price', val: exitPrice, setter: setExitPrice, ph: 'Enter exit price', currency: false },
                  { label: 'Lot size', val: lotSize, setter: setLotSize, ph: 'Enter lot size', currency: false },
                  { label: 'Commission', val: commission, setter: setCommission, ph: 'Enter trade commission', currency: true },
                  { label: 'Swap', val: swap, setter: setSwap, ph: 'Enter trade swap', currency: true },
                ].map((field, idx) => (
                  <div key={idx} className="flex flex-col gap-2">
                    <label className="text-[14px] font-medium text-white">{field.label}</label>
                    <div className="flex items-center rounded-xl bg-[#141414] px-4 border border-transparent focus-within:border-neutral-700 transition-colors">
                      {field.currency && <span className="text-neutral-500 mr-2 font-medium">$</span>}
                      <input 
                        type="text" 
                        value={field.val}
                        onChange={(e) => field.setter(e.target.value)}
                        placeholder={field.ph} 
                        className="flex-1 bg-transparent py-3.5 text-[15px] font-medium text-white outline-none placeholder:text-neutral-600"
                      />
                    </div>
                  </div>
                ))}

              </div>
            )}

            {/* SCREENSHOTS BOX */}
            <div className="mt-4 flex flex-col rounded-xl border border-neutral-800/60 bg-[#0F0F0F] p-4 min-h-[220px]">
              <h4 className="text-[16px] font-medium text-white mb-auto">Screenshots</h4>
              <div className="flex flex-col items-center justify-center pb-6 gap-2">
                <CloudUploadIcon size={34} className="text-neutral-500 mb-1" />
                <p className="text-[15px] font-medium text-white tracking-tight">Upload Screenshot</p>
                <p className="text-[12px] font-medium text-neutral-500 text-center">Drop here, paste with Ctrl+V or click</p>
              </div>
            </div>

            {/* STRATEGY DROPDOWN */}
            <div className="flex flex-col gap-2 mt-2">
              <label className="text-[14px] font-semibold text-white">Strategy</label>
              <Popover.Root open={strategyOpen} onOpenChange={setStrategyOpen}>
                <Popover.Trigger className="flex w-full items-center justify-between rounded-xl bg-[#141414] px-4 py-3.5 text-[15px] font-medium text-white outline-none active:scale-[0.99] transition-transform">
                  {strategy}
                  <ArrowDown01Icon size={18} className="text-neutral-500" />
                </Popover.Trigger>
                <Popover.Content align="start" className="z-[80] w-[calc(95vw-40px)] max-w-[440px] rounded-xl border border-neutral-800 bg-[#0A0A0A] p-1 shadow-2xl animate-in fade-in-80 zoom-in-95">
                  {STRATEGIES.map(s => (
                    <button 
                      key={s} 
                      onClick={() => { setStrategy(s); setStrategyOpen(false); }}
                      className="w-full rounded-lg px-3 py-2.5 text-left text-[14px] font-medium text-neutral-300 hover:bg-[#1A1A1A] hover:text-white outline-none"
                    >
                      {s}
                    </button>
                  ))}
                </Popover.Content>
              </Popover.Root>
              <p className="text-[12px] text-neutral-500 font-medium px-1">Select a strategy to set confluences.</p>
            </div>

          </div>

          <div className="mt-2 flex items-center justify-end gap-3 pt-4 border-t border-neutral-800/60">
            <Dialog.Close className="rounded-xl px-5 py-2.5 text-[14px] font-semibold text-neutral-400 hover:text-white transition-colors outline-none bg-[#141414] hover:bg-[#1A1A1A]">
              Cancel
            </Dialog.Close>
            <button 
              onClick={handleSave}
              className="rounded-xl bg-white px-5 py-2.5 text-[14px] font-semibold text-black active:scale-95 transition-transform outline-none"
            >
              Save
            </button>
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
