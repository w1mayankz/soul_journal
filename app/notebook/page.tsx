'use client';

import { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import * as Dialog from '@radix-ui/react-dialog';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { TopNavbar } from '../../components/top-navbar';
import { 
  TableOfContents, 
  CaseSensitive, 
  Type, 
  Link as LinkIcon, 
  ArrowDownFromLine 
} from 'lucide-react';
import { 
  DollarSquareIcon, 
  PercentIcon, 
  ViewOffSlashIcon,
  Search01Icon,
  FilterIcon,
  Menu01Icon,
  Menu05Icon,
  ArrowRight01Icon,
  ArrowLeft01Icon,
  PlusSignIcon,
  Cancel01Icon,
  PencilEdit01Icon,
  Delete02Icon,
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
import { useTrades, Folder, Note } from '../../context/trades-context';

const ICONS = ['Folder01Icon', 'StarIcon', 'Book01Icon', 'Bookmark01Icon', 'Flag01Icon', 'File01Icon', 'Calendar01Icon', 'UserIcon', 'Home01Icon', 'Image01Icon'];
const COLORS = ['#A3A3A3', '#F44336', '#009C00', '#2196F3', '#FFEB3B', '#9C27B0', '#FF9800', '#E91E63', '#00BCD4', '#FFFFFF'];

const renderIcon = (iconName: string, color: string, size = 22) => {
  const IconMap: Record<string, React.ElementType> = {
    Folder01Icon, StarIcon, Book01Icon, Bookmark01Icon, Flag01Icon, File01Icon, Calendar01Icon, UserIcon, Home01Icon, Image01Icon
  };
  const IconComp = IconMap[iconName] || Folder01Icon;
  return <IconComp size={size} color={color} />;
};

export default function NotebookPage() {
  const { folders, addFolder, updateFolder, deleteFolder, notes, addNote, deleteNote, updateNote } = useTrades();
  
  const [displayView, setDisplayView] = useState('Money View');
  
  // Navigation State
  const [activeView, setActiveView] = useState<'folders' | 'notes' | 'editor'>('folders');
  const [slideDir, setSlideDir] = useState<'forward' | 'backward'>('forward');

  // Selection State
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [activeNote, setActiveNote] = useState<Note | null>(null); // Null if creating new

  // Editor State
  const [noteTitle, setNoteTitle] = useState('');
  const [noteBody, setNoteBody] = useState('');
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  // Search State
  const [folderSearchQuery, setFolderSearchQuery] = useState('');
  const [noteSearchQuery, setNoteSearchQuery] = useState('');

  // Modal State
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);
  const [deletingFolder, setDeletingFolder] = useState<Folder | null>(null);
  const [deletingNote, setDeletingNote] = useState<Note | null>(null);

  // Split Folders
  const filteredSystem = folders.filter(f => f.isSystem && f.name.toLowerCase().includes(folderSearchQuery.toLowerCase()));
  const filteredCustom = folders.filter(f => !f.isSystem && f.name.toLowerCase().includes(folderSearchQuery.toLowerCase()));
  const currentFolderNotes = notes.filter(n => n.folderId === selectedFolder?.id && n.title.toLowerCase().includes(noteSearchQuery.toLowerCase()));

  // Auto-resize textareas
  const handleInputResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  // View Navigation
  const navigateForward = (view: 'notes' | 'editor') => {
    setSlideDir('forward');
    setActiveView(view);
  };

  const navigateBackward = (view: 'folders' | 'notes') => {
    setSlideDir('backward');
    setActiveView(view);
  };

  const handleOpenFolder = (folder: Folder) => {
    setSelectedFolder(folder);
    setNoteSearchQuery('');
    navigateForward('notes');
  };

  const handleNewNote = () => {
    setActiveNote(null);
    setNoteTitle('');
    setNoteBody('');
    navigateForward('editor');
  };

  const handleOpenNote = (note: Note) => {
    setActiveNote(note);
    setNoteTitle(note.title);
    setNoteBody(note.body);
    navigateForward('editor');
  };

  const handleSaveEditor = () => {
    if (!selectedFolder || (!noteTitle.trim() && !noteBody.trim())) {
      navigateBackward('notes');
      return;
    }
    
    if (activeNote) {
      updateNote({ ...activeNote, title: noteTitle.trim() || 'Untitled', body: noteBody });
    } else {
      addNote({
        id: Date.now().toString(),
        folderId: selectedFolder.id,
        title: noteTitle.trim() || 'Untitled',
        body: noteBody,
        createdAt: new Date().toISOString()
      });
    }
    navigateBackward('notes');
  };

  // Breadcrumbs
  let navTitle = 'Notebook';
  if (activeView === 'notes' && selectedFolder) navTitle = `Notebook > ${selectedFolder.name}`;
  if (activeView === 'editor' && selectedFolder) navTitle = `Notebook > ${selectedFolder.name} > ${noteTitle || 'Untitled'}`;

  // Slide Animation Class
  const slideAnim = `animate-in fade-in duration-300 ${slideDir === 'forward' ? 'slide-in-from-right-4' : 'slide-in-from-left-4'}`;

  return (
    <div className="relative min-h-screen bg-black font-sans text-white overflow-x-hidden">
      
      {/* TOP NAVBAR is static, transitions do not affect it */}
      <TopNavbar title={navTitle}>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#141414] text-neutral-300 outline-none">
            <DollarSquareIcon size={22} />
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content align="end" className="z-50 min-w-[200px] overflow-hidden rounded-xl border border-neutral-800 bg-[#0A0A0A]/95 backdrop-blur-xl p-1 shadow-2xl animate-in fade-in-80 zoom-in-95">
              <DropdownMenu.Item onClick={() => setDisplayView('Money View')} className="flex items-center justify-between rounded-lg px-3 py-2.5 outline-none bg-[#1A1A1A] mb-1">
                Money View <DollarSquareIcon size={18} className="text-neutral-400" />
              </DropdownMenu.Item>
              <DropdownMenu.Item onClick={() => setDisplayView('Percentage View')} className="flex items-center justify-between rounded-lg px-3 py-2.5 outline-none mb-1 text-white">
                Percentage View <PercentIcon size={18} className="text-neutral-400" />
              </DropdownMenu.Item>
              <DropdownMenu.Item onClick={() => setDisplayView('Hide P&L')} className="flex items-center justify-between rounded-lg px-3 py-2.5 outline-none text-white">
                Hide P&L <ViewOffSlashIcon size={18} className="text-neutral-400" />
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </TopNavbar>

      <div className="pb-24">
        {/* ==========================================
            FOLDERS VIEW
            ========================================== */}
        {activeView === 'folders' && (
          <section className={`mt-6 px-4 flex flex-col gap-5 ${slideAnim}`}>
            <div className="flex items-center gap-3">
              <div className="flex flex-1 items-center gap-2 rounded-xl bg-[#141414] px-4 py-3">
                <Search01Icon size={18} className="text-neutral-400" />
                <input 
                  type="text" 
                  value={folderSearchQuery}
                  onChange={(e) => setFolderSearchQuery(e.target.value)}
                  placeholder="Search folders" 
                  className="w-full bg-transparent text-[15px] font-medium text-white outline-none placeholder:text-neutral-500"
                />
              </div>
              <button className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-xl bg-[#141414] text-neutral-400 outline-none">
                <Menu05Icon size={20} />
              </button>
              <button className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-xl bg-[#141414] text-neutral-400 outline-none">
                <FilterIcon size={20} />
              </button>
            </div>

            {filteredSystem.length > 0 && (
              <div className="flex flex-col rounded-2xl border border-neutral-800/60 bg-[#090909]">
                {filteredSystem.map((folder, index) => (
                  <div key={folder.id} className="flex flex-col">
                    <div onClick={() => handleOpenFolder(folder)} className="flex items-center justify-between p-4 cursor-pointer">
                      <div className="flex items-center gap-3">
                        {renderIcon(folder.icon, folder.color)}
                        <span className="text-[16px] font-semibold tracking-tight text-white">{folder.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button onClick={(e) => { e.stopPropagation(); setEditingFolder(folder); }} className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#141414] text-neutral-400 outline-none">
                          <PencilEdit01Icon size={16} />
                        </button>
                        <ArrowRight01Icon size={18} className="text-neutral-500" />
                      </div>
                    </div>
                    {index < filteredSystem.length - 1 && <div className="h-px w-full bg-neutral-800/60" />}
                  </div>
                ))}
              </div>
            )}

            {filteredCustom.length > 0 && (
              <div className="flex flex-col rounded-2xl border border-neutral-800/60 bg-[#090909]">
                {filteredCustom.map((folder, index) => (
                  <div key={folder.id} className="flex flex-col">
                    <div onClick={() => handleOpenFolder(folder)} className="flex items-center justify-between p-4 cursor-pointer">
                      <div className="flex items-center gap-3">
                        {renderIcon(folder.icon, folder.color)}
                        <span className="text-[16px] font-semibold tracking-tight text-white">{folder.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <DropdownMenu.Root>
                          <DropdownMenu.Trigger onClick={(e) => e.stopPropagation()} className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#141414] text-neutral-400 outline-none">
                            <Menu01Icon size={18} />
                          </DropdownMenu.Trigger>
                          <DropdownMenu.Portal>
                            <DropdownMenu.Content align="end" className="z-50 min-w-[180px] overflow-hidden rounded-xl border border-neutral-800 bg-[#0A0A0A]/95 backdrop-blur-xl p-1 shadow-2xl animate-in fade-in-80 zoom-in-95">
                              <DropdownMenu.Item onClick={(e) => { e.stopPropagation(); setEditingFolder(folder); }} className="flex items-center justify-between rounded-lg px-3 py-2.5 text-[14px] font-medium text-white outline-none bg-[#1A1A1A] mb-1">
                                Edit folder
                              </DropdownMenu.Item>
                              <DropdownMenu.Separator className="h-px w-full bg-neutral-800/60 my-1" />
                              <DropdownMenu.Item onClick={(e) => { e.stopPropagation(); setDeletingFolder(folder); }} className="flex items-center justify-between rounded-lg px-3 py-2.5 text-[14px] font-medium text-[#F44336] outline-none">
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

            <button onClick={() => setIsCreateFolderOpen(true)} className="flex w-full flex-col items-center justify-center gap-1 rounded-2xl border border-neutral-800/60 bg-[#090909] py-8 text-neutral-400 outline-none mt-2">
              <PlusSignIcon size={24} />
              <span className="text-[15px] font-medium">Add New Folder</span>
            </button>
          </section>
        )}

        {/* ==========================================
            NOTES VIEW (INSIDE A FOLDER)
            ========================================== */}
        {activeView === 'notes' && selectedFolder && (
          <section className={`mt-6 px-4 flex flex-col gap-5 ${slideAnim}`}>
            
            <div className="flex items-center gap-3">
              <button onClick={() => navigateBackward('folders')} className="flex items-center justify-center text-white outline-none">
                <ArrowLeft01Icon size={24} />
              </button>
              <h2 className="text-[20px] font-medium text-white tracking-tight">{selectedFolder.name}</h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex flex-1 items-center gap-2 rounded-xl bg-[#141414] px-4 py-3">
                <Search01Icon size={18} className="text-neutral-400" />
                <input 
                  type="text" 
                  value={noteSearchQuery}
                  onChange={(e) => setNoteSearchQuery(e.target.value)}
                  placeholder="Search notes" 
                  className="w-full bg-transparent text-[15px] font-medium text-white outline-none placeholder:text-neutral-500"
                />
              </div>
              <button className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-xl bg-[#141414] text-neutral-400 outline-none">
                <Menu05Icon size={20} />
              </button>
              <button className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-xl bg-[#141414] text-neutral-400 outline-none">
                <FilterIcon size={20} />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {currentFolderNotes.length > 0 && (
                <div className="flex flex-col rounded-2xl border border-neutral-800/60 bg-[#090909]">
                  {currentFolderNotes.map((note, index) => (
                    <div key={note.id} className="flex flex-col">
                      <div onClick={() => handleOpenNote(note)} className="flex items-center justify-between p-4 cursor-pointer">
                        <div className="flex-1 flex flex-wrap items-center gap-x-3 gap-y-1 pr-4 min-w-0">
                          <span className="text-[16px] font-semibold tracking-tight text-white break-words max-w-full">
                            {note.title}
                          </span>
                          <span className="text-[13px] font-medium text-neutral-500 whitespace-nowrap">
                            {format(new Date(note.createdAt), 'd MMM yyyy')}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <button onClick={(e) => { e.stopPropagation(); setDeletingNote(note); }} className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#141414] text-[#F44336] outline-none">
                            <Delete02Icon size={18} />
                          </button>
                          <ArrowRight01Icon size={18} className="text-neutral-500" />
                        </div>
                      </div>
                      {index < currentFolderNotes.length - 1 && <div className="h-px w-full bg-neutral-800/60" />}
                    </div>
                  ))}
                </div>
              )}

              <button onClick={handleNewNote} className="flex w-full flex-col items-center justify-center gap-1 rounded-2xl border border-neutral-800/60 bg-[#090909] py-8 text-neutral-400 outline-none">
                <PlusSignIcon size={24} />
                <span className="text-[15px] font-medium">Add New Note</span>
              </button>
            </div>
          </section>
        )}

        {/* ==========================================
            NOTE EDITOR VIEW
            ========================================== */}
        {activeView === 'editor' && (
          <section className={`px-4 pt-4 flex flex-col h-full ${slideAnim}`}>
            
            {/* EDITOR HEADER */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <button onClick={handleSaveEditor} className="text-white outline-none">
                  <ArrowLeft01Icon size={24} />
                </button>
                <button className="flex items-center gap-1 rounded-lg bg-[#141414] px-3 py-1.5 text-[13px] font-medium text-white outline-none">
                  Add Tag
                </button>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-1 rounded-lg bg-[#141414] px-3 py-1.5 text-[13px] font-medium text-white outline-none">
                  Template
                </button>
                <button className="text-white outline-none">
                  <Menu01Icon size={24} />
                </button>
              </div>
            </div>

            {/* EDITOR TYPING AREA */}
            <div className="flex flex-col flex-1 pb-16">
              <textarea
                value={noteTitle}
                onChange={(e) => { setNoteTitle(e.target.value); handleInputResize(e); }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    bodyRef.current?.focus();
                  }
                }}
                onFocus={() => setIsKeyboardVisible(true)}
                onBlur={() => setIsKeyboardVisible(false)}
                placeholder="Heading"
                className="w-full resize-none overflow-hidden bg-transparent text-[28px] font-bold text-white outline-none placeholder:text-neutral-600 mb-2"
                rows={1}
              />
              <textarea
                ref={bodyRef}
                value={noteBody}
                onChange={(e) => { setNoteBody(e.target.value); handleInputResize(e); }}
                onFocus={() => setIsKeyboardVisible(true)}
                onBlur={() => setIsKeyboardVisible(false)}
                placeholder="Type something..."
                className="w-full flex-1 resize-none bg-transparent text-[16px] leading-relaxed text-white outline-none placeholder:text-neutral-600 min-h-[300px]"
              />
            </div>
          </section>
        )}
      </div>

      {/* LUCIDE KEYBOARD TOOLBAR */}
      {activeView === 'editor' && isKeyboardVisible && (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between border-t border-neutral-800 bg-[#141414] px-5 py-3 animate-in slide-in-from-bottom-2 fade-in duration-200">
          <TableOfContents size={22} className="text-white" />
          <CaseSensitive size={22} className="text-white" />
          <Type size={22} className="text-white" />
          <LinkIcon size={22} className="text-white" />
          
          {/* onPointerDown ensures the blur fires instantly on mobile before losing focus */}
          <button onPointerDown={(e) => { e.preventDefault(); document.activeElement?.blur(); }} className="outline-none">
            <ArrowDownFromLine size={22} className="text-white" />
          </button>
        </div>
      )}

      {/* --- MODALS --- */}
      <FolderModal 
        isOpen={isCreateFolderOpen || !!editingFolder}
        onClose={() => { setIsCreateFolderOpen(false); setEditingFolder(null); }}
        folder={editingFolder}
        onSave={(folder) => editingFolder ? handleUpdateFolder(folder) : addFolder(folder)}
      />
      <DeleteFolderModal 
        folder={deletingFolder} 
        onClose={() => setDeletingFolder(null)} 
        onConfirm={confirmDeleteFolder} 
      />
      <DeleteNoteModal 
        note={deletingNote}
        onClose={() => setDeletingNote(null)}
        onConfirm={confirmDeleteNote}
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
      setName(folder.name); setIcon(folder.icon); setColor(folder.color);
    } else {
      setName(''); setIcon('Folder01Icon'); setColor('#A3A3A3');
    }
  }, [folder, isOpen]);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({ id: folder ? folder.id : Date.now().toString(), name: name.trim(), icon, color, isSystem: folder ? folder.isSystem : false });
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-[70] flex max-h-[90vh] w-[95vw] max-w-lg translate-x-[-50%] translate-y-[-50%] flex-col rounded-2xl border border-neutral-800 bg-[#090909] p-3 outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
          <div className="flex items-start justify-between mb-6">
            <div>
              <Dialog.Title className="text-[18px] font-medium text-white">{folder ? 'Edit Folder' : 'Create Folder'}</Dialog.Title>
              <Dialog.Description className="mt-0.5 text-[15px] text-neutral-400 font-semibold">{folder ? 'Update folder details.' : 'Define your new folder.'}</Dialog.Description>
            </div>
            <Dialog.Close className="text-white outline-none"><Cancel01Icon size={22} /></Dialog.Close>
          </div>
          <div className="flex-1 overflow-y-auto pr-1.5 scrollbar-hide space-y-6 pb-4">
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-semibold text-white">Folder name *</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter folder name" className="w-full rounded-xl bg-[#1F1F1F] px-3 py-2.5 text-[14px] font-medium text-white outline-none placeholder:text-neutral-400 border border-transparent" />
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-[14px] font-semibold text-white">Folder Icon</label>
              <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                {ICONS.map(i => (
                  <button key={i} onClick={() => setIcon(i)} className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#141414] border ${icon === i ? 'border-white' : 'border-transparent'} outline-none`}>
                    {renderIcon(i, icon === i ? color : '#A3A3A3', 20)}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-[14px] font-semibold text-white">Icon Color</label>
              <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 px-1">
                {COLORS.map(c => (
                  <button key={c} onClick={() => setColor(c)} className={`h-8 w-8 shrink-0 rounded-full border-[3px] ${color === c ? 'border-white scale-110' : 'border-[#141414]'} outline-none`} style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-end gap-3 pt-4 border-t border-neutral-800/60">
            <Dialog.Close className="rounded-xl px-5 py-2.5 text-[14px] font-medium text-neutral-400 bg-[#141414] outline-none">Cancel</Dialog.Close>
            <button onClick={handleSave} className="rounded-xl bg-white px-5 py-2.5 text-[14px] font-medium text-black outline-none">{folder ? 'Save Changes' : 'Create'}</button>
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
            <Dialog.Close className="rounded-xl bg-[#141414] px-5 py-2.5 text-[14px] font-medium text-neutral-400 outline-none">Cancel</Dialog.Close>
            <button onClick={onConfirm} className="rounded-xl bg-[#F44336] px-5 py-2.5 text-[14px] font-medium text-white outline-none">Delete</button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function DeleteNoteModal({ note, onClose, onConfirm }: { note: Note | null, onClose: () => void, onConfirm: () => void }) {
  return (
    <Dialog.Root open={!!note} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-[70] flex w-[90vw] max-w-sm translate-x-[-50%] translate-y-[-50%] flex-col rounded-2xl border border-neutral-800 bg-[#090909] p-5 outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
          <Dialog.Title className="text-[18px] font-semibold text-white mb-2">Delete Note</Dialog.Title>
          <Dialog.Description className="text-[14px] font-medium text-neutral-400 mb-6 leading-relaxed">
            Are you sure you want to delete <span className="text-white">"{note?.title}"</span>? This action cannot be undone.
          </Dialog.Description>
          <div className="flex items-center justify-end gap-3">
            <Dialog.Close className="rounded-xl bg-[#141414] px-5 py-2.5 text-[14px] font-medium text-neutral-400 outline-none">Cancel</Dialog.Close>
            <button onClick={onConfirm} className="rounded-xl bg-[#F44336] px-5 py-2.5 text-[14px] font-medium text-white outline-none">Delete</button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
