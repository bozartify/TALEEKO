'use client'

import { ThemeProvider } from '@/context/theme-context'
import { ToastProvider } from '@/context/toast-context'
import CommandPalette from '@/components/ui/command-palette'

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ToastProvider>
        {children}
        <CommandPalette />
      </ToastProvider>
    </ThemeProvider>
  )
}
