'use client';

import { useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { TopNavbar } from '../../components/top-navbar';
import { 
  DollarSquareIcon, 
  PercentIcon, 
  ViewOffSlashIcon,
  Search01Icon,
  FilterIcon,
  Folder01Icon,
  Menu05Icon,
  ArrowRight01Icon,
  PlusSignIcon
} from 'hugeicons-react';

const SYSTEM_FOLDERS = [
  { id: 'all-notes', name: 'All Notes' },
  { id: 'daily-journal', name: 'Daily Journal' }
];

export default function NotebookPage() {
  const [displayView, setDisplayView] = useState('Money View');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Later we can add custom folders to this list, but for now it's just the system folders
  const [folders, setFolders] = useState(SYSTEM_FOLDERS);

  const filteredFolders = folders.filter(folder => 
    folder.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              <DropdownMenu.Item onClick={() => setDisplayView('Money View')} className="flex items-center justify-between rounded-lg px-3 py-2.5 outline-none cursor-pointer">
                Money View <DollarSquareIcon size={18} className="text-neutral-400" />
              </DropdownMenu.Item>
              <DropdownMenu.Item onClick={() => setDisplayView('Percentage View')} className="flex items-center justify-between rounded-lg px-3 py-2.5 outline-none cursor-pointer">
                Percentage View <PercentIcon size={18} className="text-neutral-400" />
              </DropdownMenu.Item>
              <DropdownMenu.Item onClick={() => setDisplayView('Hide P&L')} className="flex items-center justify-between rounded-lg px-3 py-2.5 outline-none cursor-pointer">
                Hide P&L <ViewOffSlashIcon size={18} className="text-neutral-400" />
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </TopNavbar>

      <section className="mt-6 px-4 flex flex-col gap-5">
        
        {/* SEARCH BAR & FILTER */}
        <div className="flex items-center gap-3">
          <div className="flex flex-1 items-center gap-2 rounded-xl bg-[#141414] px-4 py-3">
            <Search01Icon size={18} className="text-neutral-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search folders" 
              className="w-full bg-transparent text-[15px] font-medium text-white outline-none placeholder:text-neutral-500"
            />
          </div>
          <button className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-xl bg-[#141414] text-neutral-400 outline-none">
            <FilterIcon size={20} />
          </button>
        </div>

        {/* FOLDERS CONTAINER */}
        <div className="flex flex-col gap-4">
          {filteredFolders.length === 0 ? (
            <div className="flex min-h-[100px] items-center justify-center rounded-2xl border border-neutral-800/60 bg-[#090909]">
              <span className="text-[14px] font-medium text-neutral-500">No folders found</span>
            </div>
          ) : (
            <div className="flex flex-col rounded-2xl border border-neutral-800/60 bg-[#090909]">
              {filteredFolders.map((folder, index) => (
                <div key={folder.id} className="flex flex-col">
                  
                  {/* FOLDER CARD */}
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <Folder01Icon size={22} className="text-neutral-400" />
                      <span className="text-[16px] font-semibold tracking-tight text-white">{folder.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1A1A1A] text-neutral-400 outline-none">
                        <Menu05Icon size={18} />
                      </button>
                      <ArrowRight01Icon size={18} className="text-neutral-500" />
                    </div>
                  </div>

                  {/* DIVIDER (hidden on the last item) */}
                  {index < filteredFolders.length - 1 && (
                    <div className="h-px w-full bg-neutral-800/60" />
                  )}
                  
                </div>
              ))}
            </div>
          )}

          {/* ADD NEW FOLDER BUTTON */}
          <button 
            className="flex w-full flex-col items-center justify-center gap-1 rounded-2xl border border-neutral-800/60 bg-[#090909] py-8 text-neutral-400 outline-none"
          >
            <PlusSignIcon size={24} />
            <span className="text-[15px] font-medium">Add New Folder</span>
          </button>
        </div>

      </section>
    </div>
  );
}
