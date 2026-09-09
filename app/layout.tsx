import { Inter_Tight } from 'next/font/google';
import './globals.css';
import { TradesProvider } from '../context/trades-context';
import { AddTradeModal } from '../components/add-trade-modal';

const interTight = Inter_Tight({ 
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter-tight',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${interTight.variable} dark`}>
      <body className="bg-black text-white font-sans antialiased selection:bg-green-500/30">
        <TradesProvider>
          <main className="min-h-screen w-full max-w-full overflow-x-hidden">
            {children}
          </main>
          {/* Mounts the interactive modal and global FAB */}
          <AddTradeModal />
        </TradesProvider>
      </body>
    </html>
  );
}
