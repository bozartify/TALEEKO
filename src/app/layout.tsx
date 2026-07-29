import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import AppProviders from '@/providers/app-providers'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'TeachWeaver – AI Teaching Platform',
  description: 'AI-powered tools for modern educators',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${mono.variable} font-sans`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
