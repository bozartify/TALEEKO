'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  GraduationCap, LayoutDashboard, Sparkles, Users, BookOpen,
  BarChart2, Settings, FolderOpen, Lightbulb
} from 'lucide-react'
import { cn, getInitials } from '@/lib/utils'

const navItems = [
  { href: '/dashboard',   icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/magic-chat',  icon: Sparkles,         label: 'Magic Chat', badge: 'AI' },
  { href: '/classroom',   icon: Users,            label: 'Classroom' },
  { href: '/courses',     icon: FolderOpen,       label: 'Courses' },
  { href: '/workspace',   icon: Lightbulb,        label: 'Workspace' },
  { href: '/analytics',   icon: BarChart2,        label: 'Analytics' },
]

const teacher = { name: 'Alex Johnson', email: 'demo@teachweaver.ai' }

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-slate-100">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)' }}
          >
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <span className="text-base font-bold text-slate-900">TeachWeaver</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="text-xs font-semibold text-slate-400 px-3 mb-2 uppercase tracking-wider">Menu</p>
        {navItems.map(({ href, icon: Icon, label, badge }) => {
          const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link key={href} href={href} className={cn('sidebar-item', isActive && 'active')}>
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1">{label}</span>
              {badge && (
                <span className="badge bg-brand-100 text-brand-700">{badge}</span>
              )}
            </Link>
          )
        })}

        {/* Quick start */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="bg-brand-50 rounded-2xl p-4">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center mb-3"
              style={{ background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)' }}
            >
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <p className="text-xs font-bold text-slate-900 mb-1">Try Magic Chat</p>
            <p className="text-xs text-slate-500 mb-3">Generate any teaching material in seconds</p>
            <Link href="/magic-chat" className="btn-primary text-xs px-3 py-1.5 w-full justify-center">
              Open Chat
            </Link>
          </div>
        </div>
      </nav>

      {/* Settings + Avatar */}
      <div className="px-3 py-4 border-t border-slate-100 space-y-1">
        <Link href="/settings" className={cn('sidebar-item', pathname === '/settings' && 'active')}>
          <Settings className="w-4 h-4" />
          Settings
        </Link>
        <div className="flex items-center gap-3 px-3 py-2 mt-1">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)' }}
          >
            {getInitials(teacher.name)}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-900 truncate">{teacher.name}</p>
            <p className="text-xs text-slate-400 truncate">{teacher.email}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
