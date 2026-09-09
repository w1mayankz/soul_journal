import { Menu01Icon, DollarSquareIcon, PlusSignIcon } from 'hugeicons-react'

export default function Dashboard() {
  return (
    <div className="relative min-h-screen bg-black pb-24">
      
      {/* TOP NAVBAR: 56px height, 48px touch targets */}
      <header className="flex h-14 items-center justify-between px-4 pt-2">
        <div className="flex items-center gap-1">
          <button className="flex h-12 w-12 items-center justify-center text-neutral-300 hover:text-white transition-colors active:scale-95">
            <Menu01Icon size={24} />
          </button>
          <span className="text-[17px] font-medium tracking-tight text-white">Dashboard</span>
        </div>
        
        <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#141414] text-neutral-300 hover:bg-[#222] transition-colors active:scale-95">
          <DollarSquareIcon size={22} />
        </button>
      </header>

      {/* HEADER SECTION */}
      <section className="mt-6 px-5">
        <h1 className="text-[26px] font-medium tracking-tight text-white">
          Welcome back, User
        </h1>
        <p className="mt-1 text-[14px] font-normal text-neutral-400 tracking-tight">
          Tue 08 Sep, 2026
        </p>
      </section>

      {/* FLOATING ACTION BUTTON */}
      <button 
        className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-green-500/20 backdrop-blur-xl border border-green-500/30 text-green-500 shadow-lg shadow-green-500/10 active:scale-95 transition-all z-50"
        aria-label="Log new trade"
      >
        <PlusSignIcon size={28} />
      </button>
      
    </div>
  )
}
