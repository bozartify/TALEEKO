'use client'
import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Sparkles, Search, Globe, Check, ChevronDown, Bell } from 'lucide-react'

const titles: Record<string, string> = {
  '/dashboard':      'Dashboard',
  '/magic-chat':     'Magic Chat',
  '/agents':         'Agent Swarm',
  '/classroom':      'My Classroom',
  '/courses':        'Courses',
  '/workspace':      'Workspace',
  '/rubrics':        'Rubric Builder',
  '/standards':      'Standards Library',
  '/communication':  'Communication',
  '/calendar':       'Calendar',
  '/portfolio':      'Student Portfolios',
  '/analytics':      'Analytics',
  '/settings':       'Settings',
}

const LANGUAGES = [
  { code: 'en', label: 'English',    flag: '🇺🇸' },
  { code: 'es', label: 'Español',    flag: '🇪🇸' },
  { code: 'fr', label: 'Français',   flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch',    flag: '🇩🇪' },
  { code: 'pt', label: 'Português',  flag: '🇧🇷' },
  { code: 'ar', label: 'العربية',    flag: '🇸🇦' },
  { code: 'zh', label: '中文',        flag: '🇨🇳' },
  { code: 'hi', label: 'हिन्दी',      flag: '🇮🇳' },
  { code: 'sw', label: 'Kiswahili',  flag: '🇰🇪' },
  { code: 'ja', label: '日本語',      flag: '🇯🇵' },
]

export default function Header() {
  const pathname = usePathname()
  const title = Object.entries(titles).find(([key]) => pathname.startsWith(key))?.[1] ?? 'TeachWeaver'

  const [lang, setLang] = useState(LANGUAGES[0])
  const [open, setOpen] = useState(false)

  return (
    <header className="h-16 flex items-center justify-between px-6 flex-shrink-0 border-b border-white/[0.06] bg-surface-950/50 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-bold text-surface-100">{title}</h1>
        <div className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded-lg bg-accent-500/10 border border-accent-500/20">
          <div className="w-1.5 h-1.5 rounded-full bg-success-400 animate-pulse" />
          <span className="text-[10px] font-medium text-accent-300">AI Active</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative hidden sm:block">
          <Search className="w-4 h-4 text-surface-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-9 pr-4 py-2 text-xs rounded-xl bg-white/[0.04] border border-white/[0.08] text-surface-200 placeholder:text-surface-500 focus:outline-none focus:border-accent-500/40 focus:ring-1 focus:ring-accent-500/20 w-48 transition-all"
          />
        </div>

        {/* Notifications */}
        <button className="relative w-9 h-9 rounded-xl flex items-center justify-center text-surface-400 hover:text-surface-200 hover:bg-white/[0.04] transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent-500 ring-2 ring-surface-950" />
        </button>

        {/* Language switcher */}
        <div className="relative">
          <button
            onClick={() => setOpen(o => !o)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/[0.08] bg-white/[0.03] text-xs font-medium text-surface-300 hover:bg-white/[0.06] hover:border-white/[0.12] transition-all"
          >
            <Globe className="w-3.5 h-3.5 text-surface-500" />
            <span className="hidden sm:inline">{lang.flag} {lang.label}</span>
            <span className="sm:hidden">{lang.flag}</span>
            <ChevronDown className={`w-3 h-3 text-surface-500 transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>
          {open && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
              <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-white/[0.08] shadow-elevation-3 z-40 py-2 max-h-72 overflow-y-auto bg-surface-800/95 backdrop-blur-xl">
                {LANGUAGES.map(l => (
                  <button
                    key={l.code}
                    onClick={() => { setLang(l); setOpen(false) }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-surface-300 hover:bg-white/[0.06] hover:text-white transition-colors"
                  >
                    <span className="text-sm">{l.flag}</span>
                    <span className="flex-1 text-left">{l.label}</span>
                    {l.code === lang.code && <Check className="w-3.5 h-3.5 text-accent-400" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Magic Chat CTA */}
        <Link href="/magic-chat" className="btn-primary text-xs px-4 py-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Magic Chat</span>
        </Link>
      </div>
    </header>
  )
}
