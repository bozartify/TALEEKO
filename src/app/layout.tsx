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
  description: 'AI-powered lesson plans, quizzes, worksheets, and activities generated in minutes. Built for K-12 and higher-ed educators.',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'TeachWeaver – AI Teaching Platform',
    description: 'AI-powered lesson plans, quizzes, worksheets, and activities generated in minutes.',
    siteName: 'TeachWeaver',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TeachWeaver – AI Teaching Platform',
    description: 'AI-powered lesson plans, quizzes, worksheets, and activities generated in minutes.',
  },
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
