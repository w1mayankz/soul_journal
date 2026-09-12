'use client';

import { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { TopNavbar } from '../../components/top-navbar';
import { 
  DollarSquareIcon, 
  PercentIcon, 
  ViewOffSlashIcon,
  Search01Icon,
  FilterIcon,
  Menu01Icon,
  ArrowRight01Icon,
  PlusSignIcon,
  Cancel01Icon,
  // Selectable Icons (Guaranteed Free/Old Version)
  Folder01Icon,
  StarIcon,
  Book01Icon,
  Bookmark01Icon,
  Flag01Icon,
  File01Icon,
  Calendar01Icon,
  UserIcon,
  Home01Icon,
  Image01Icon
} from 'hugeicons-react';

// --- CONSTANTS ---

const ICONS = [
  'Folder01Icon', 'StarIcon', 'Book01Icon', 'Bookmark01Icon', 
  'Flag01Icon', 'File01Icon', 'Calendar01Icon', 'UserIcon', 
  'Home01Icon', 'Image01Icon'
];

const COLORS = [
  '#A3A3A3', // Default Grey
  '#F44336', // Red
  '#009C00', // Green
  '#2196F3', // Blue
  '#FFEB3B', // Yellow
  '#9C27B0', // Purple
  '#FF9800', // Orange
  '#E91E63', // Pink
  '#00BCD4', // Cyan
  '#FFFFFF'  // White
];

type Folder = {
  id: string;
  name: string;
  icon: string;
  color: string;
  isSystem: boolean;
};

const DEFAULT_SYSTEM_FOLDERS: Folder[] = [
  { id: 'all-notes', name: 'All Notes', icon: 'Folder01Icon', color: '#A3A3A3', isSystem: true },
  { id: 'daily-journal', name: 'Daily Journal', icon: 'Folder01Icon', color: '#A3A3A3', isSystem: true }
];

// Dynamic icon renderer
const renderIcon = (iconName: string, color: string, size = 22) => {
  const IconMap: Record<string, React.ElementType> = {
    Folder01Icon, StarIcon, Book01Icon, Bookmark01Icon, 
    Flag01Icon, File01Icon, Calendar01Icon, UserIcon, 
    Home01Icon, Image01Icon
  };
  const IconComp = IconMap[iconName] || Folder01Icon;
  return <IconComp size={size} color={color} />;
};

// --- MAIN PAGE ---

export default function NotebookPage() {
  const [displayView, setDisplayView] = useState('Money View');
  const [searchQuery, setSearchQuery] = useState('');
  
  // States for folders
  const [systemFolders, setSystemFolders] = useState<Folder[]>(DEFAULT_SYSTEM_FOLDERS);
  const [customFolders, setCustomFolders] = useState<Folder[]>([]);

  // Modal States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);
  const [deletingFolder, setDeletingFolder] = useState<Folder | null>(null);

  // Search Filters
  const filteredSystem = systemFolders.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredCustom = customFolders.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // Handlers
  const handleCreateFolder = (newFolder: Folder) => {
    setCustomFolders([...customFolders, newFolder]);
  };

  const handleUpdateFolder = (updated: Folder) => {
    if (updated.isSystem) {
      setSystemFolders(systemFolders.map(f => f.id === updated.id ? updated : f));
    } else {
      setCustomFolders(customFolders.map(f => f.id === updated.id ? updated : f));
    }
  };

  const confirmDelete = () => {
    if (deletingFolder) {
      setCustomFolders(customFolders.filter(f => f.id !== deletingFolder.id));
    }
    setDeletingFolder(null);
  };

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
              <DropdownMenu.Item onClick={() => setDisplayView('Money View')} className="flex items-center justify-between rounded-lg px-3 py-2.5 outline-none bg-[#1A1A1A]">
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

        {/* SYSTEM FOLDERS CONTAINER */}
        {filteredSystem.length > 0 && (
          <div className="flex flex-col rounded-2xl border border-neutral-800/60 bg-[#090909]">
            {filteredSystem.map((folder, index) => (
              <div key={folder.id} className="flex flex-col">
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    {renderIcon(folder.icon, folder.color)}
                    <span className="text-[16px] font-semibold tracking-tight text-white">{folder.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger 
                        onClick={(e) => e.stopPropagation()} 
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1A1A1A] text-neutral-400 outline-none"
                      >
                        <Menu01Icon size={18} />
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Portal>
                        <DropdownMenu.Content 
                          align="end"
                          className="z-50 min-w-[180px] overflow-hidden rounded-xl border border-neutral-800 bg-[#0A0A0A]/95 backdrop-blur-xl py-1 shadow-2xl animate-in fade-in-80 zoom-in-95"
                        >
                          <DropdownMenu.Item 
                            onClick={(e) => { e.stopPropagation(); setEditingFolder(folder); }}
                            className="flex items-center justify-between px-4 py-3 text-[14px] font-medium text-white outline-none bg-[#1A1A1A]"
                          >
                            Edit folder
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>

                    <ArrowRight01Icon size={18} className="text-neutral-500" />
                  </div>
                </div>
                {index < filteredSystem.length - 1 && <div className="h-px w-full bg-neutral-800/60" />}
              </div>
            ))}
          </div>
        )}

        {/* CUSTOM FOLDERS CONTAINER */}
        {filteredCustom.length > 0 && (
          <div className="flex flex-col rounded-2xl border border-neutral-800/60 bg-[#090909]">
            {filteredCustom.map((folder, index) => (
              <div key={folder.id} className="flex flex-col">
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    {renderIcon(folder.icon, folder.color)}
                    <span className="text-[16px] font-semibold tracking-tight text-white">{folder.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger 
                        onClick={(e) => e.stopPropagation()} 
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1A1A1A] text-neutral-400 outline-none"
                      >
                        <Menu01Icon size={18} />
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Portal>
                        <DropdownMenu.Content 
                          align="end"
                          className="z-50 min-w-[180px] overflow-hidden rounded-xl border border-neutral-800 bg-[#0A0A0A]/95 backdrop-blur-xl py-1 shadow-2xl animate-in fade-in-80 zoom-in-95"
                        >
                          <DropdownMenu.Item 
                            onClick={(e) => { e.stopPropagation(); setEditingFolder(folder); }}
                            className="flex items-center justify-between px-4 py-3 text-[14px] font-medium text-white outline-none bg-[#1A1A1A]"
                          >
                            Edit folder
                          </DropdownMenu.Item>
                          <DropdownMenu.Separator className="h-px w-full bg-neutral-800/60 my-1" />
                          <DropdownMenu.Item 
                            onClick={(e) => { e.stopPropagation(); setDeletingFolder(folder); }}
                            className="flex items-center justify-between px-4 py-3 text-[14px] font-medium text-[#F44336] outline-none"
                          >
                            Delete folder
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>

                    <ArrowRight01Icon size={18} className="text-neutral-500" />
                  </div>
                </div>
                {index < filteredCustom.length - 1 && <div className="h-px w-full bg-neutral-800/60" />}
              </div>
            ))}
          </div>
        )}

        {/* ADD NEW FOLDER BUTTON */}
        <button 
          onClick={() => setIsCreateOpen(true)}
          className="flex w-full flex-col items-center justify-center gap-1 rounded-2xl border border-neutral-800/60 bg-[#090909] py-8 text-neutral-400 outline-none mt-2"
        >
          <PlusSignIcon size={24} />
          <span className="text-[15px] font-medium">Add New Folder</span>
        </button>

      </section>

      {/* CREATE / EDIT MODAL */}
      <FolderModal 
        isOpen={isCreateOpen || !!editingFolder}
        onClose={() => { setIsCreateOpen(false); setEditingFolder(null); }}
        folder={editingFolder}
        onSave={(folder) => editingFolder ? handleUpdateFolder(folder) : handleCreateFolder(folder)}
      />

      {/* DELETE FOLDER POPUP */}
      <DeleteFolderModal 
        folder={deletingFolder} 
        onClose={() => setDeletingFolder(null)} 
        onConfirm={confirmDelete} 
      />

    </div>
  );
}

// --- SUBCOMPONENTS ---

function FolderModal({ isOpen, onClose, folder, onSave }: { isOpen: boolean, onClose: () => void, folder: Folder | null, onSave: (f: Folder) => void }) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('Folder01Icon');
  const [color, setColor] = useState('#A3A3A3');

  useEffect(() => {
    if (folder) {
      setName(folder.name);
      setIcon(folder.icon);
      setColor(folder.color);
    } else {
      setName('');
      setIcon('Folder01Icon');
      setColor('#A3A3A3');
    }
  }, [folder, isOpen]);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      id: folder ? folder.id : Date.now().toString(),
      name: name.trim(),
      icon,
      color,
      isSystem: folder ? folder.isSystem : false
    });
    onClose();
  };

  const handleRestoreDefaults = () => {
    setIcon('Folder01Icon');
    setColor('#A3A3A3');
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-[70] flex max-h-[90vh] w-[95vw] max-w-lg translate-x-[-50%] translate-y-[-50%] flex-col rounded-2xl border border-neutral-800 bg-[#090909] p-3 outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
          
          <div className="flex items-start justify-between mb-6">
            <div>
              <Dialog.Title className="text-[18px] font-medium text-white">{folder ? 'Edit Folder' : 'Create Folder'}</Dialog.Title>
              <Dialog.Description className="mt-0.5 text-[15px] text-neutral-400 font-semibold">
                {folder ? 'Update folder details and appearance.' : 'Define your new folder.'}
              </Dialog.Description>
            </div>
            <Dialog.Close className="text-white outline-none">
              <Cancel01Icon size={22} />
            </Dialog.Close>
          </div>

          <div className="flex-1 overflow-y-auto pr-1.5 scrollbar-hide space-y-6 pb-4">
            
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-semibold text-white">Folder name *</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter folder name" 
                className="w-full rounded-xl bg-[#1F1F1F] px-3 py-2.5 text-[14px] font-medium text-white outline-none placeholder:text-neutral-400 border border-transparent"
              />
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-[14px] font-semibold text-white">Folder Icon</label>
              <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                {ICONS.map(i => (
                  <button 
                    key={i} 
                    onClick={() => setIcon(i)}
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#141414] border ${icon === i ? 'border-white' : 'border-transparent'} outline-none`}
                  >
                    {renderIcon(i, icon === i ? color : '#A3A3A3', 20)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-[14px] font-semibold text-white">Icon Color</label>
              <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 px-1">
                {COLORS.map(c => (
                  <button 
                    key={c}
                    onClick={() => setColor(c)}
                    className={`h-8 w-8 shrink-0 rounded-full border-[3px] ${color === c ? 'border-white scale-110' : 'border-[#141414]'} outline-none`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <button 
              onClick={handleRestoreDefaults}
              className="text-[13px] font-semibold text-neutral-400 outline-none underline underline-offset-4"
            >
              Restore Defaults
            </button>

          </div>

          <div className="mt-2 flex items-center justify-end gap-3 pt-4 border-t border-neutral-800/60">
            <Dialog.Close className="rounded-xl px-5 py-2.5 text-[14px] font-medium text-neutral-400 bg-[#141414] outline-none">
              Cancel
            </Dialog.Close>
            <button 
              onClick={handleSave}
              className="rounded-xl bg-white px-5 py-2.5 text-[14px] font-medium text-black outline-none"
            >
              {folder ? 'Save Changes' : 'Create'}
            </button>
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function DeleteFolderModal({ folder, onClose, onConfirm }: { folder: Folder | null, onClose: () => void, onConfirm: () => void }) {
  return (
    <Dialog.Root open={!!folder} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-[70] flex w-[90vw] max-w-sm translate-x-[-50%] translate-y-[-50%] flex-col rounded-2xl border border-neutral-800 bg-[#090909] p-5 outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
          
          <Dialog.Title className="text-[18px] font-semibold text-white mb-2">Delete Folder</Dialog.Title>
          <Dialog.Description className="text-[14px] font-medium text-neutral-400 mb-6 leading-relaxed">
            Are you sure you want to delete <span className="text-white">"{folder?.name}"</span>? This action cannot be undone.
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
