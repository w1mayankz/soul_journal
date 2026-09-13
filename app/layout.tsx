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
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="bg-black text-white font-sans antialiased selection:bg-green-500/30">
        <TradesProvider>
          <main className="min-h-screen w-full max-w-full overflow-x-hidden">
            {children}
          </main>
          {/* Mounts the interactive modal and global FAB */}
          <AddTradeModal />
        </TradesProvider>

        {/* PWA Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
