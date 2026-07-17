'use client'
import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Sparkles, Search, Globe, Check, ChevronDown } from 'lucide-react'

const titles: Record<string, string> = {
  '/dashboard':  'Dashboard',
  '/magic-chat': 'Magic Chat',
  '/agents':     'Agent Swarm',
  '/classroom':  'My Classroom',
  '/courses':    'Courses',
  '/workspace':  'Workspace',
  '/analytics':  'Analytics',
  '/settings':   'Settings',
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
    <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 flex-shrink-0">
      <h1 className="text-lg font-bold text-slate-900">{title}</h1>
      <div className="flex items-center gap-3">
        <div className="relative hidden sm:block">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-9 pr-4 py-2 text-xs rounded-full border border-slate-200 bg-slate-50 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent w-44 transition-all"
          />
        </div>

        {/* Language switcher */}
        <div className="relative">
          <button
            onClick={() => setOpen(o => !o)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-slate-200 bg-white text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">{lang.flag} {lang.label}</span>
            <span className="sm:hidden">{lang.flag}</span>
            <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>
          {open && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl border border-slate-100 shadow-card-hover z-40 py-2 max-h-72 overflow-y-auto">
                {LANGUAGES.map(l => (
                  <button
                    key={l.code}
                    onClick={() => { setLang(l); setOpen(false) }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-brand-50 transition-colors"
                  >
                    <span className="text-sm">{l.flag}</span>
                    <span className="flex-1 text-left">{l.label}</span>
                    {l.code === lang.code && <Check className="w-3.5 h-3.5 text-brand-600" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <Link href="/magic-chat" className="btn-primary text-xs px-4 py-2">
          <Sparkles className="w-3.5 h-3.5" />
          Magic Chat
        </Link>
      </div>
    </header>
  )
}
