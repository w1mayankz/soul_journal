'use client';

import { useState, useEffect } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { FilterIcon } from 'hugeicons-react';
import { parseISO, differenceInMinutes, format } from 'date-fns';

const Star = ({ filled }: { filled: boolean }) => (
  <svg 
    width="14" height="14" viewBox="0 0 24 24" 
    fill={filled ? "currentColor" : "none"} 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={filled ? "text-white" : "text-neutral-600"}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

type FFEvent = {
  title: string;
  country: string;
  date: string;
  impact: string;
};

type ParsedEvent = {
  id: string;
  title: string;
  dateObj: Date;
  importance: number;
};

export function HighImpactNews() {
  const [events, setEvents] = useState<ParsedEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [minImportance, setMinImportance] = useState<number>(1);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function fetchNews() {
      try {
        // Call our own Next.js API Route safely!
        const res = await fetch('/api/news', { cache: 'no-store' });

        if (!res || !res.ok) throw new Error(`HTTP Error: ${res?.status || 'Network failure'}`);
        
        const data = await res.json();

        const parsed = data
          .filter((item: FFEvent) => item.country.trim().toUpperCase() === 'USD')
          .map((item: FFEvent, index: number) => {
            let importance = 1; 
            if (item.impact === 'High' || item.impact === 'Holiday') importance = 3;
            else if (item.impact === 'Medium') importance = 2;

            return {
              id: `${item.title}-${index}`,
              title: item.title,
              dateObj: parseISO(item.date),
              importance
            };
          })
          // REMOVED 'isToday' filter. Now just checks if time hasn't passed yet.
          .filter((item: ParsedEvent) => item.dateObj.getTime() > new Date().getTime())
          .sort((a: ParsedEvent, b: ParsedEvent) => a.dateObj.getTime() - b.dateObj.getTime());

        setEvents(parsed);
      } catch (error: any) {
        setErrorMsg(error.message || "Failed to parse data");
      } finally {
        setIsLoading(false);
      }
    }

    fetchNews();
  }, []);

  const filteredEvents = events.filter(e => e.importance >= minImportance);
  const isFilterActive = minImportance > 1;

  return (
    <div className="flex flex-col rounded-2xl border border-neutral-800/60 bg-[#090909] p-3">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex flex-col">
          <span className="text-[16px] font-medium tracking-tight text-white">High Impact News</span>
          <span className="text-[15px] font-semibold text-neutral-600">Upcoming news events of today</span>
        </div>
        
        <DropdownMenu.Root>
          <DropdownMenu.Trigger className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-[#141414] transition-colors outline-none active:scale-95 text-white">
            <FilterIcon size={18} fill={isFilterActive ? "currentColor" : "none"} />
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content 
              align="end"
              className="z-50 min-w-[180px] rounded-xl border border-neutral-800 bg-[#0A0A0A]/95 backdrop-blur-xl p-2 shadow-2xl animate-in fade-in-80 zoom-in-95 data-[side=bottom]:slide-in-from-top-2"
            >
              <span className="text-[14px] font-semibold text-white mb-1 block">Minimum Importance</span>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3].map(rating => (
                  <button 
                    key={rating}
                    onClick={() => setMinImportance(rating)}
                    className="p-1 hover:scale-110 transition-transform outline-none"
                  >
                    <Star filled={rating <= minImportance} />
                  </button>
                ))}
              </div>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>

      <div className="flex flex-col gap-2">
        {isLoading ? (
          <>
            <div className="h-[52px] w-full animate-pulse rounded-xl border border-neutral-800/40 bg-[#0A0A0A]"></div>
            <div className="h-[52px] w-full animate-pulse rounded-xl border border-neutral-800/40 bg-[#0A0A0A]"></div>
          </>
        ) : errorMsg ? (
          <div className="flex min-h-[120px] flex-col items-center justify-center px-4 text-center">
            <span className="text-[13px] font-bold text-red-500">Error Loading News</span>
            <span className="text-[12px] font-medium text-neutral-600 mt-1">{errorMsg}</span>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="flex min-h-[120px] items-center justify-center px-4 text-center">
            <span className="text-[16px] font-medium text-neutral-600">
              There is no high impact news today, enjoy your trading.
            </span>
          </div>
        ) : (
          // Slicing to 4 just to keep the card from getting too long since we removed the "today" limit
          filteredEvents.slice(0, 4).map(event => {
            const minsUntil = differenceInMinutes(event.dateObj, now);
            const hours = Math.floor(minsUntil / 60);
            const mins = minsUntil % 60;
            
            // If it's more than a day out, show days instead of just hours
            const days = Math.floor(hours / 24);
            const remHours = hours % 24;
            let timeString = '';
            if (days > 0) timeString = `${days}d ${remHours}h`;
            else if (hours > 0) timeString = `${hours}h ${mins}m`;
            else timeString = `${mins}m`;

            return (
              <div key={event.id} className="flex items-center justify-between rounded-xl border border-neutral-800/60 bg-[#090909] p-3 px-4">
                <div className="flex items-center gap-3">
                  {/* FIXED: Added shrink-0 right below here */}
                  <div className="h-4 w-6 shrink-0 overflow-hidden rounded-[2px]">
                    <img src="/assets/usa.jpg" alt="USA Flag" className="h-full w-full object-cover" />
                  </div>
                  <span className="text-[15px] font-medium text-white tracking-tight">{event.title}</span>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="text-[13px] font-medium text-white whitespace-nowrap">{timeString}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-neutral-400 mr-1">{format(event.dateObj, 'HH:mm')}</span>
                    <div className="flex items-center gap-0.5">
                      <Star filled={event.importance >= 1} />
                      <Star filled={event.importance >= 2} />
                      <Star filled={event.importance >= 3} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
