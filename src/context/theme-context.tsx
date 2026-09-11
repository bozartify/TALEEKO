'use client'

import { createContext, useContext, useEffect, useCallback } from 'react'
import { useLocalStorage } from '@/hooks/use-local-storage'

type Theme = 'dark' | 'light'

interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeValue] = useLocalStorage<Theme>('theme', 'dark')

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('dark', 'light')
    root.classList.add(theme)
  }, [theme])

  const setTheme = useCallback((t: Theme) => setThemeValue(t), [setThemeValue])

  const toggleTheme = useCallback(() => {
    setThemeValue((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }, [setThemeValue])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}
