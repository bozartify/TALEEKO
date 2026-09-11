'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, LayoutDashboard, BookOpen, CheckSquare, Users, BarChart2,
  Settings, Sparkles, FileText, Calendar, Library, Key, Bell, HelpCircle,
  Gamepad2, Newspaper, Type, Brain, Activity, GitBranch, LayoutGrid,
  TrendingUp, Target, MessageCircle, FlaskConical, Pencil, Layers,
  ClipboardList, BookMarked, Map, PenTool, MessageSquare, Award,
  FolderOpen, Layout, Plug, Shield, Bot
} from 'lucide-react'

const COMMANDS = [
  { label: 'Dashboard',           href: '/dashboard',          icon: LayoutDashboard, cat: 'Pages' },
  { label: 'Magic Chat',          href: '/magic-chat',         icon: Sparkles,        cat: 'AI Tools', badge: 'AI' },
  { label: 'Agent Swarm',         href: '/agents',             icon: Bot,             cat: 'AI Tools', badge: 'AI' },
  { label: 'Lesson Planner',      href: '/lesson-planner',     icon: BookOpen,        cat: 'AI Tools', badge: 'AI' },
  { label: 'Quiz Builder',        href: '/quiz-builder',       icon: CheckSquare,     cat: 'AI Tools', badge: 'AI' },
  { label: 'Standards Unpacker',  href: '/standards-unpacker', icon: Layers,          cat: 'AI Tools', badge: 'AI' },
  { label: 'Discussion Prompts',  href: '/discussion-prompts', icon: MessageCircle,   cat: 'AI Tools', badge: 'AI' },
  { label: '5E Lesson Builder',   href: '/5e-lesson',          icon: FlaskConical,    cat: 'AI Tools', badge: 'AI' },
  { label: 'Writing Prompts',     href: '/writing-prompts',    icon: Pencil,          cat: 'AI Tools', badge: 'AI' },
  { label: 'Word Wall',           href: '/word-wall',          icon: BookMarked,      cat: 'AI Tools', badge: 'AI' },
  { label: 'Text Leveler',        href: '/text-leveler',       icon: Type,            cat: 'AI Tools', badge: 'AI' },
  { label: 'Newsletter',          href: '/newsletter',         icon: Newspaper,       cat: 'AI Tools', badge: 'AI' },
  { label: 'Game Builder',        href: '/game-builder',       icon: Gamepad2,        cat: 'AI Tools', badge: 'AI' },
  { label: 'Feedback Writer',     href: '/feedback-writer',    icon: MessageSquare,   cat: 'AI Tools', badge: 'AI' },
  { label: 'Differentiation',     href: '/differentiation',    icon: Brain,           cat: 'AI Tools', badge: 'AI' },
  { label: 'Sub Plans',           href: '/sub-plans',          icon: ClipboardList,   cat: 'AI Tools', badge: 'AI' },
  { label: 'Exit Tickets',        href: '/exit-tickets',       icon: Target,          cat: 'AI Tools', badge: 'AI' },
  { label: 'Unit Planner',        href: '/unit-planner',       icon: LayoutGrid,      cat: 'AI Tools', badge: 'AI' },
  { label: 'Learning Paths',      href: '/learning-paths',     icon: GitBranch,       cat: 'AI Tools', badge: 'AI' },
  { label: 'IEP Goals',           href: '/iep-goals',          icon: Target,          cat: 'AI Tools', badge: 'AI' },
  { label: "Bloom's Taxonomy",    href: '/blooms-taxonomy',    icon: Layers,          cat: 'AI Tools', badge: 'AI' },
  { label: 'Students',            href: '/students',           icon: Users,           cat: 'Classroom' },
  { label: 'Classroom',           href: '/classroom',          icon: Users,           cat: 'Classroom' },
  { label: 'Assignments',         href: '/assignments',        icon: CheckSquare,     cat: 'Classroom' },
  { label: 'Gradebook',           href: '/gradebook',          icon: BookOpen,        cat: 'Classroom' },
  { label: 'Attendance',          href: '/attendance',         icon: CheckSquare,     cat: 'Classroom' },
  { label: 'Seating Chart',       href: '/seating-chart',      icon: Layout,          cat: 'Classroom' },
  { label: 'Student Groups',      href: '/groups',             icon: Users,           cat: 'Classroom' },
  { label: 'IEP / 504 Plans',     href: '/accommodations',     icon: Shield,          cat: 'Classroom' },
  { label: 'Progress Monitor',    href: '/progress-monitor',   icon: TrendingUp,      cat: 'Classroom' },
  { label: 'Parent Portal',       href: '/parent-portal',      icon: Users,           cat: 'Classroom' },
  { label: 'Analytics',           href: '/analytics',          icon: BarChart2,       cat: 'Data' },
  { label: 'Reports',             href: '/reports',            icon: FileText,        cat: 'Data' },
  { label: 'Report Cards',        href: '/report-cards',       icon: FileText,        cat: 'Data', badge: 'AI' },
  { label: 'Content Library',     href: '/library',            icon: Library,         cat: 'Resources' },
  { label: 'Templates',           href: '/templates',          icon: Layout,          cat: 'Resources' },
  { label: 'Rubrics',             href: '/rubrics',            icon: PenTool,         cat: 'Resources' },
  { label: 'Standards',           href: '/standards',          icon: Shield,          cat: 'Resources' },
  { label: 'Courses',             href: '/courses',            icon: FolderOpen,      cat: 'Resources' },
  { label: 'Curriculum',          href: '/curriculum',         icon: Map,             cat: 'Resources' },
  { label: 'Scope & Sequence',    href: '/scope-sequence',     icon: GitBranch,       cat: 'Resources' },
  { label: 'Portfolios',          href: '/portfolio',          icon: Users,           cat: 'Resources' },
  { label: 'PD Courses',          href: '/professional-dev',   icon: Award,           cat: 'Resources' },
  { label: 'Communication',       href: '/communication',      icon: MessageSquare,   cat: 'Admin' },
  { label: 'Calendar',            href: '/calendar',           icon: Calendar,        cat: 'Admin' },
  { label: 'Workspace',           href: '/workspace',          icon: Sparkles,        cat: 'Admin' },
  { label: 'Assessment Center',   href: '/assessment-center',  icon: CheckSquare,     cat: 'Admin' },
  { label: 'Interventions',       href: '/intervention-tracker', icon: Activity,      cat: 'Admin' },
  { label: 'Integrations',        href: '/integrations',       icon: Plug,            cat: 'Admin' },
  { label: 'API Keys',            href: '/api-keys',           icon: Key,             cat: 'Admin' },
  { label: 'Notifications',       href: '/notifications',      icon: Bell,            cat: 'Admin' },
  { label: 'Settings',            href: '/settings',           icon: Settings,        cat: 'Admin' },
  { label: 'Help',                href: '/help',               icon: HelpCircle,      cat: 'Admin' },
]

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = query.trim()
    ? COMMANDS.filter(c => c.label.toLowerCase().includes(query.toLowerCase()) || c.cat.toLowerCase().includes(query.toLowerCase()))
    : COMMANDS.slice(0, 8)

  const navigate = useCallback((href: string) => {
    router.push(href)
    setOpen(false)
    setQuery('')
    setSelected(0)
  }, [router])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(o => !o)
      }
      if (e.key === 'Escape') {
        setOpen(false)
        setQuery('')
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50)
      setSelected(0)
    }
  }, [open])

  useEffect(() => { setSelected(0) }, [query])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, filtered.length - 1)) }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)) }
    if (e.key === 'Enter' && filtered[selected]) navigate(filtered[selected].href)
  }

  const grouped = filtered.reduce<Record<string, typeof COMMANDS>>((acc, cmd) => {
    if (!acc[cmd.cat]) acc[cmd.cat] = []
    acc[cmd.cat].push(cmd)
    return acc
  }, {})

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => { setOpen(false); setQuery('') }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -8 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="fixed top-[15vh] left-1/2 -translate-x-1/2 z-50 w-full max-w-xl"
            >
              <div className="glass-card rounded-2xl shadow-elevation-4 border border-white/[0.12] overflow-hidden">
                {/* Input */}
                <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.06]">
                  <Search className="w-4 h-4 text-surface-500 flex-shrink-0" />
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search pages, tools, settings..."
                    className="flex-1 bg-transparent text-sm text-surface-100 placeholder:text-surface-500 outline-none"
                  />
                  <kbd className="text-[10px] text-surface-600 bg-surface-800 border border-white/[0.06] rounded px-1.5 py-0.5 font-mono">ESC</kbd>
                </div>

                {/* Results */}
                <div className="max-h-80 overflow-y-auto py-2">
                  {filtered.length === 0 ? (
                    <p className="text-sm text-surface-500 text-center py-8">No results for &ldquo;{query}&rdquo;</p>
                  ) : (
                    Object.entries(grouped).map(([cat, cmds]) => {
                      let globalIdx = filtered.indexOf(cmds[0])
                      return (
                        <div key={cat}>
                          {query.trim() === '' && (
                            <p className="text-[10px] font-semibold text-surface-600 uppercase tracking-widest px-4 pt-2 pb-1">{cat}</p>
                          )}
                          {cmds.map(cmd => {
                            const idx = filtered.indexOf(cmd)
                            const isActive = idx === selected
                            return (
                              <button
                                key={cmd.href}
                                onClick={() => navigate(cmd.href)}
                                onMouseEnter={() => setSelected(idx)}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${isActive ? 'bg-accent-500/10' : 'hover:bg-white/[0.04]'}`}
                              >
                                <cmd.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-accent-400' : 'text-surface-500'}`} />
                                <span className={`text-sm flex-1 ${isActive ? 'text-white' : 'text-surface-300'}`}>{cmd.label}</span>
                                {cmd.badge && (
                                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-accent-500/20 text-accent-300">{cmd.badge}</span>
                                )}
                                {isActive && (
                                  <kbd className="text-[10px] text-surface-600 bg-surface-800 border border-white/[0.06] rounded px-1.5 py-0.5 font-mono">↵</kbd>
                                )}
                              </button>
                            )
                          })}
                        </div>
                      )
                    })
                  )}
                </div>

                {/* Footer */}
                <div className="border-t border-white/[0.06] px-4 py-2 flex items-center gap-4 text-[10px] text-surface-600">
                  <span><kbd className="font-mono">↑↓</kbd> navigate</span>
                  <span><kbd className="font-mono">↵</kbd> open</span>
                  <span><kbd className="font-mono">ESC</kbd> close</span>
                  <span className="ml-auto">⌘K to reopen</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
