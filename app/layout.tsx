import { Inter_Tight } from 'next/font/google'
import './globals.css'

const interTight = Inter_Tight({ 
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter-tight',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${interTight.variable} dark`}>
      <body className="bg-black text-white font-sans antialiased selection:bg-green-500/30">
        {children}
      </body>
    </html>
  )
}
