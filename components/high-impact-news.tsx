'use client';

import { useState, useEffect } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { FilterIcon } from 'hugeicons-react';
import { parseISO, differenceInMinutes, format, isToday } from 'date-fns';

// SVG Star to guarantee perfect filled/hollow rendering without Pro icon libraries
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
  const [minImportance, setMinImportance] = useState<number>(1);
  const [now, setNow] = useState(new Date());

  // Update current time every minute for the countdowns
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function fetchNews() {
      try {
        // Free proxy endpoint for Forex Factory JSON data
        const res = await fetch('https://nfs.faireconomy.media/ff_calendar_thisweek.json');
        const data: FFEvent[] = await res.json();

        const parsed = data
          .filter(item => item.country === 'USD')
          .map((item, index) => {
            let importance = 1; // Low
            if (item.impact === 'High' || item.impact === 'Holiday') importance = 3;
            else if (item.impact === 'Medium') importance = 2;

            return {
              id: `${item.title}-${index}`,
              title: item.title,
              dateObj: parseISO(item.date),
              importance
            };
          })
          // Filter for today's upcoming events only
          .filter(item => isToday(item.dateObj) && item.dateObj.getTime() > new Date().getTime())
          .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());

        setEvents(parsed);
      } catch (error) {
        console.error("Failed to fetch news", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchNews();
  }, []);

  const filteredEvents = events.filter(e => e.importance >= minImportance);
  const isFilterActive = minImportance > 1;

  return (
    <div className="flex flex-col rounded-2xl border border-neutral-800/60 bg-[#090909] p-4 shadow-sm">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex flex-col">
          <span className="text-[16px] font-semibold tracking-tight text-white">High Impact News</span>
          <span className="text-[13px] font-medium text-neutral-500">Today's upcoming high impact news</span>
        </div>
        
        <DropdownMenu.Root>
          <DropdownMenu.Trigger className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-[#141414] transition-colors outline-none active:scale-95 text-white">
            <FilterIcon size={18} fill={isFilterActive ? "currentColor" : "none"} />
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content 
              align="end"
              className="z-50 min-w-[180px] rounded-xl border border-neutral-800 bg-[#0A0A0A]/95 backdrop-blur-xl p-3 shadow-2xl animate-in fade-in-80 zoom-in-95 data-[side=bottom]:slide-in-from-top-2"
            >
              <span className="text-[13px] font-semibold text-neutral-400 mb-2 block">Minimum Importance</span>
              <div className="flex items-center gap-2">
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
          // SKELETON LOADER
          <>
            <div className="h-[52px] w-full animate-pulse rounded-xl border border-neutral-800/40 bg-[#0A0A0A]"></div>
            <div className="h-[52px] w-full animate-pulse rounded-xl border border-neutral-800/40 bg-[#0A0A0A]"></div>
          </>
                ) : filteredEvents.length === 0 ? (
          <div className="flex min-h-[120px] items-center justify-center px-4 text-center">
            <span className="text-[16px] font-medium text-neutral-600">
              There is no high impact news today, enjoy your trading.
            </span>
          </div>
        ) : (
          filteredEvents.map(event => {
            const minsUntil = differenceInMinutes(event.dateObj, now);
            const hours = Math.floor(minsUntil / 60);
            const mins = minsUntil % 60;
            const timeString = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

            return (
              <div key={event.id} className="flex items-center justify-between rounded-xl border border-neutral-800/60 bg-[#090909] p-3 px-4">
                <div className="flex items-center gap-3">
                  <div className="h-4 w-6 overflow-hidden rounded-[2px]">
                    <img src="/usa.jpg" alt="USA" className="h-full w-full object-cover" />
                  </div>
                  <span className="text-[14px] font-semibold text-white tracking-tight">{event.title}</span>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="text-[13px] font-medium text-white">{timeString}</span>
                  <div className="flex items-center gap-2 rounded-full bg-[#141414] px-2.5 py-1">
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
