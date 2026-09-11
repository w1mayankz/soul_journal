'use client';

import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { TopNavbar } from '../../components/top-navbar';
import { 
  PlusSignIcon, 
  Cancel01Icon,
  Delete02Icon 
} from 'hugeicons-react';

type Confluence = {
  id: number;
  value: string;
};

export default function StrategiesPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [confluences, setConfluences] = useState<Confluence[]>([]);

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
    // Save functionality to be implemented later
    console.log({ name, description, confluences });
    setIsOpen(false);
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setConfluences([]);
  };

  return (
    <div className="relative min-h-screen bg-black pb-24 font-sans text-white">
      <TopNavbar />

      <section className="mt-6 px-4">
        {/* EMPTY STATE TRIGGER */}
        <button 
          onClick={() => setIsOpen(true)}
          className="flex w-full flex-col items-center justify-center gap-1 rounded-2xl border border-neutral-800/60 bg-[#090909] py-8 text-neutral-400 transition-colors hover:bg-[#0F0F0F] active:scale-[0.99] outline-none"
        >
          <PlusSignIcon size={24} />
          <span className="text-[15px] font-medium">Create Strategy</span>
        </button>
      </section>

      <Dialog.Root 
        open={isOpen} 
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) resetForm();
        }}
      >
        {/* FLOATING ACTION BUTTON */}
        <Dialog.Trigger asChild>
          <button 
            className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#001A00] backdrop-blur-xl text-[#009C00] active:scale-95 transition-all z-30 outline-none"
            aria-label="Create new strategy"
          >
            <PlusSignIcon size={28} />
          </button>
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content className="fixed left-[50%] top-[50%] z-[70] flex max-h-[90vh] w-[95vw] max-w-lg translate-x-[-50%] translate-y-[-50%] flex-col rounded-2xl border border-neutral-800 bg-[#090909] p-3 outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
            
            {/* MODAL HEADER */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <Dialog.Title className="text-[18px] font-medium text-white">Create Strategy</Dialog.Title>
                <Dialog.Description className="mt-0.5 text-[15px] text-neutral-400 font-semibold">
                  Define your trading strategy and its confluences.
                </Dialog.Description>
              </div>
              <Dialog.Close className="text-white hover:text-white transition-colors outline-none">
                <Cancel01Icon size={22} />
              </Dialog.Close>
            </div>

            {/* SCROLLABLE FORM CONTENT */}
            <div className="flex-1 overflow-y-auto pr-1.5 scrollbar-hide space-y-5 pb-4">
              
              {/* NAME */}
              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-semibold text-white">Name *</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter strategy name" 
                  className="w-full rounded-xl bg-[#1F1F1F] px-3 py-2.5 text-[14px] font-medium text-white outline-none placeholder:text-neutral-400 border border-transparent focus-within:border-neutral-700 transition-colors"
                />
              </div>

              {/* DESCRIPTION */}
              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-semibold text-white">Description</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter strategy description" 
                  className="w-full min-h-[100px] resize-none rounded-xl bg-[#1F1F1F] px-3 py-2.5 text-[14px] font-medium text-white outline-none placeholder:text-neutral-400 border border-transparent focus-within:border-neutral-700 transition-colors"
                />
              </div>

              {/* CONFLUENCES */}
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
                        className="flex-1 rounded-xl bg-[#1F1F1F] px-3 py-2.5 text-[14px] font-medium text-white outline-none placeholder:text-neutral-400 border border-transparent focus-within:border-neutral-700 transition-colors"
                      />
                      <button 
                        onClick={() => handleRemoveConfluence(confluence.id)}
                        className="flex h-[42px] w-[42px] items-center justify-center rounded-xl bg-[#141414] text-neutral-400 transition-colors hover:bg-[#1A1A1A] hover:text-[#F44336] outline-none"
                        aria-label="Delete confluence"
                      >
                        <Delete02Icon size={18} />
                      </button>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={handleAddConfluence}
                  className="mt-1 w-full rounded-xl bg-[#141414] py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-[#1A1A1A] outline-none"
                >
                  Add Confluence
                </button>
              </div>

            </div>

            {/* MODAL FOOTER */}
            <div className="mt-2 flex items-center justify-end gap-3 pt-4 border-t border-neutral-800/60">
              <Dialog.Close className="rounded-xl px-5 py-2.5 text-[14px] font-medium text-neutral-400 hover:text-white transition-colors outline-none bg-[#141414] hover:bg-[#1A1A1A]">
                Cancel
              </Dialog.Close>
              <button 
                onClick={handleSave}
                className="rounded-xl bg-white px-5 py-2.5 text-[14px] font-medium text-black active:scale-95 transition-transform outline-none"
              >
                Save
              </button>
            </div>

          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
