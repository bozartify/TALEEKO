'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sparkles, Search } from 'lucide-react'

const titles: Record<string, string> = {
  '/dashboard':  'Dashboard',
  '/magic-chat': 'Magic Chat',
  '/classroom':  'My Classroom',
  '/courses':    'Courses',
  '/workspace':  'Workspace',
  '/analytics':  'Analytics',
  '/settings':   'Settings',
}

export default function Header() {
  const pathname = usePathname()
  const title = Object.entries(titles).find(([key]) => pathname.startsWith(key))?.[1] ?? 'TeachWeaver'

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
        <Link href="/magic-chat" className="btn-primary text-xs px-4 py-2">
          <Sparkles className="w-3.5 h-3.5" />
          Magic Chat
        </Link>
      </div>
    </header>
  )
}
