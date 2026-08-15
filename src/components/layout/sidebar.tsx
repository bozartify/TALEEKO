'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GraduationCap, LayoutDashboard, Sparkles, Users, BookOpen,
  BarChart2, Settings, FolderOpen, Lightbulb, Bot, PenTool,
  Shield, MessageSquare, Calendar, HelpCircle, FileText, Bell,
  Library, Layout, Plug, Key, Menu, X, Map, CheckSquare, Award,
  Brain, BookMarked, ClipboardList, Target, Type, Newspaper, Gamepad2,
  Layers, MessageCircle, FlaskConical, Pencil, ListChecks, Activity, GitBranch
} from 'lucide-react'
import { cn, getInitials } from '@/lib/utils'

const navItems = [
  { href: '/dashboard',  icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/magic-chat', icon: Sparkles,        label: 'Magic Chat', badge: 'AI' },
  { href: '/agents',     icon: Bot,             label: 'Agent Swarm', badge: 'NEW' },
  { href: '/classroom',  icon: Users,           label: 'Classroom' },
  { href: '/students',   icon: Users,           label: 'Students' },
  { href: '/assignments', icon: CheckSquare,    label: 'Assignments' },
  { href: '/courses',    icon: FolderOpen,       label: 'Courses' },
  { href: '/lesson-planner', icon: BookOpen,     label: 'Lesson Planner', badge: 'AI' },
  { href: '/quiz-builder',   icon: CheckSquare,  label: 'Quiz Builder',   badge: 'AI' },
  { href: '/word-wall',     icon: BookMarked,   label: 'Word Wall',       badge: 'AI' },
  { href: '/exit-tickets',  icon: Target,       label: 'Exit Tickets',    badge: 'AI' },
  { href: '/sub-plans',     icon: ClipboardList, label: 'Sub Plans',      badge: 'AI' },
  { href: '/text-leveler',  icon: Type,          label: 'Text Leveler',   badge: 'AI' },
  { href: '/newsletter',    icon: Newspaper,     label: 'Newsletter',     badge: 'AI' },
  { href: '/game-builder',  icon: Gamepad2,      label: 'Game Builder',   badge: 'AI' },
  { href: '/standards-unpacker', icon: Layers,  label: 'Standards Unpacker', badge: 'AI' },
  { href: '/discussion-prompts', icon: MessageCircle, label: 'Discussion Prompts', badge: 'AI' },
  { href: '/5e-lesson',   icon: FlaskConical,  label: '5E Lesson Builder', badge: 'AI' },
  { href: '/writing-prompts', icon: Pencil,    label: 'Writing Prompts',   badge: 'AI' },
  { href: '/workspace',  icon: Lightbulb,       label: 'Workspace' },
  { href: '/rubrics',    icon: PenTool,         label: 'Rubrics' },
  { href: '/standards',  icon: Shield,          label: 'Standards' },
  { href: '/feedback-writer', icon: MessageSquare, label: 'Feedback Writer', badge: 'AI' },
  { href: '/communication', icon: MessageSquare, label: 'Communication' },
  { href: '/calendar',   icon: Calendar,        label: 'Calendar' },
  { href: '/portfolio',  icon: GraduationCap,   label: 'Portfolios' },
  { href: '/gradebook',  icon: BookOpen,        label: 'Gradebook' },
  { href: '/groups',       icon: Users,           label: 'Student Groups' },
  { href: '/seating-chart', icon: Layout,         label: 'Seating Chart' },
  { href: '/attendance',  icon: CheckSquare,     label: 'Attendance' },
  { href: '/curriculum',  icon: Map,            label: 'Curriculum' },
  { href: '/scope-sequence', icon: GitBranch,   label: 'Scope & Sequence' },
  { href: '/blooms-taxonomy', icon: Layers,     label: "Bloom's Taxonomy", badge: 'AI' },
  { href: '/assessment-center', icon: ListChecks, label: 'Assessment Center' },
  { href: '/intervention-tracker', icon: Activity, label: 'Interventions' },
  { href: '/analytics',  icon: BarChart2,       label: 'Analytics' },
  { href: '/library',    icon: Library,         label: 'Content Library' },
  { href: '/templates',  icon: Layout,          label: 'Templates' },
  { href: '/reports',    icon: FileText,        label: 'Reports' },
  { href: '/report-cards', icon: FileText,     label: 'Report Cards', badge: 'AI' },
  { href: '/differentiation', icon: Brain,    label: 'Differentiation', badge: 'AI' },
  { href: '/accommodations', icon: Shield,    label: 'IEP/504' },
  { href: '/professional-dev', icon: Award,     label: 'PD Courses' },
  { href: '/parent-portal', icon: Users,       label: 'Parent Portal' },
  { href: '/integrations', icon: Plug,          label: 'Integrations' },
  { href: '/api-keys',   icon: Key,             label: 'API Keys' },
  { href: '/notifications', icon: Bell,         label: 'Notifications' },
  { href: '/settings',   icon: Settings,        label: 'Settings' },
  { href: '/help',       icon: HelpCircle,      label: 'Help' },
]

const teacher = { name: 'Alex Johnson', email: 'demo@teachweaver.ai' }

function SidebarContent({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <>
      <div className="px-5 py-5 border-b border-white/[0.06]">
        <Link href="/dashboard" className="flex items-center gap-2.5" onClick={onNavigate}>
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

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-semibold text-surface-500 px-3 mb-3 uppercase tracking-[0.12em]">Menu</p>
        {navItems.map(({ href, icon: Icon, label, badge }) => {
          const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link key={href} href={href} className="relative block" onClick={onNavigate}>
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
              <Link href="/magic-chat" className="btn-primary text-xs px-3 py-2 w-full justify-center" onClick={onNavigate}>
                Open Chat
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="px-3 py-4 border-t border-white/[0.06] space-y-1">
        <Link href="/settings" className="relative block" onClick={onNavigate}>
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
    </>
  )
}

export default function Sidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <aside className="sidebar hidden lg:flex">
        <SidebarContent pathname={pathname} />
      </aside>

      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden w-10 h-10 rounded-xl flex items-center justify-center bg-surface-800/80 backdrop-blur-xl border border-white/[0.08] text-surface-300 hover:text-white hover:bg-surface-700/80 transition-all"
      >
        <Menu className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
            />

            <motion.aside
              className="fixed left-0 top-0 h-full w-[280px] z-50 flex flex-col lg:hidden"
              style={{
                background: 'rgba(16, 18, 28, 0.95)',
                backdropFilter: 'blur(24px) saturate(1.3)',
                borderRight: '1px solid rgba(255, 255, 255, 0.06)',
              }}
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-lg flex items-center justify-center text-surface-400 hover:text-white hover:bg-white/[0.06] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <SidebarContent pathname={pathname} onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
