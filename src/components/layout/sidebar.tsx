'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  GraduationCap, LayoutDashboard, Sparkles, Users, BookOpen,
  BarChart2, Settings, FolderOpen, Lightbulb, Bot, PenTool,
  Shield, MessageSquare, Calendar, HelpCircle, FileText, Bell,
  Library, Layout, Plug, Key
} from 'lucide-react'
import { cn, getInitials } from '@/lib/utils'

const navItems = [
  { href: '/dashboard',  icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/magic-chat', icon: Sparkles,        label: 'Magic Chat', badge: 'AI' },
  { href: '/agents',     icon: Bot,             label: 'Agent Swarm', badge: 'NEW' },
  { href: '/classroom',  icon: Users,           label: 'Classroom' },
  { href: '/courses',    icon: FolderOpen,       label: 'Courses' },
  { href: '/workspace',  icon: Lightbulb,       label: 'Workspace' },
  { href: '/rubrics',    icon: PenTool,         label: 'Rubrics' },
  { href: '/standards',  icon: Shield,          label: 'Standards' },
  { href: '/communication', icon: MessageSquare, label: 'Communication' },
  { href: '/calendar',   icon: Calendar,        label: 'Calendar' },
  { href: '/portfolio',  icon: GraduationCap,   label: 'Portfolios' },
  { href: '/gradebook',  icon: BookOpen,        label: 'Gradebook' },
  { href: '/analytics',  icon: BarChart2,       label: 'Analytics' },
  { href: '/library',    icon: Library,         label: 'Content Library' },
  { href: '/templates',  icon: Layout,          label: 'Templates' },
  { href: '/reports',    icon: FileText,        label: 'Reports' },
  { href: '/integrations', icon: Plug,          label: 'Integrations' },
  { href: '/api-keys',   icon: Key,             label: 'API Keys' },
  { href: '/notifications', icon: Bell,         label: 'Notifications' },
  { href: '/settings',   icon: Settings,        label: 'Settings' },
  { href: '/help',       icon: HelpCircle,      label: 'Help' },
]

const teacher = { name: 'Alex Johnson', email: 'demo@teachweaver.ai' }

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/[0.06]">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <motion.div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #6366f1, #a78bfa)' }}
            whileHover={{ scale: 1.08, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <GraduationCap className="w-[18px] h-[18px] text-white" />
          </motion.div>
          <div className="flex flex-col">
            <span className="text-[15px] font-bold text-white tracking-tight">TeachWeaver</span>
            <span className="text-[10px] text-surface-500 font-medium tracking-wider uppercase">AI Platform</span>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-semibold text-surface-500 px-3 mb-3 uppercase tracking-[0.12em]">Menu</p>
        {navItems.map(({ href, icon: Icon, label, badge }) => {
          const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link key={href} href={href} className="relative block">
              <motion.div
                className={cn('sidebar-item', isActive && 'active')}
                whileHover={{ x: 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              >
                <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                <span className="flex-1">{label}</span>
                {badge && (
                  <span className={cn(
                    'text-[10px] font-bold px-1.5 py-0.5 rounded-md',
                    badge === 'AI'
                      ? 'bg-accent-500/20 text-accent-300'
                      : 'bg-electric-400/15 text-electric-400'
                  )}>
                    {badge}
                  </span>
                )}
              </motion.div>
            </Link>
          )
        })}

        {/* Quick start CTA */}
        <div className="mt-5 pt-5 border-t border-white/[0.06]">
          <div className="relative rounded-2xl p-4 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent-600/20 via-neon-500/10 to-electric-400/10 rounded-2xl" />
            <div className="absolute inset-0 border border-accent-500/20 rounded-2xl" />
            <div className="relative">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                style={{ background: 'linear-gradient(135deg, #6366f1, #a78bfa)' }}
              >
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <p className="text-[13px] font-bold text-white mb-1">Try Magic Chat</p>
              <p className="text-[11px] text-surface-400 mb-3 leading-relaxed">Generate any teaching material in seconds</p>
              <Link href="/magic-chat" className="btn-primary text-xs px-3 py-2 w-full justify-center">
                Open Chat
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Settings + Avatar */}
      <div className="px-3 py-4 border-t border-white/[0.06] space-y-1">
        <Link href="/settings" className="relative block">
          <motion.div
            className={cn('sidebar-item', pathname === '/settings' && 'active')}
            whileHover={{ x: 2 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            <Settings className="w-[18px] h-[18px]" />
            Settings
          </motion.div>
        </Link>
        <div className="flex items-center gap-3 px-3 py-2.5 mt-1">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0 ring-2 ring-white/[0.06]"
            style={{ background: 'linear-gradient(135deg, #6366f1, #a78bfa)' }}
          >
            {getInitials(teacher.name)}
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-surface-100 truncate">{teacher.name}</p>
            <p className="text-[11px] text-surface-500 truncate">{teacher.email}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
