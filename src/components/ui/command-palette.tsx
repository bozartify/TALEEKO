'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, LayoutDashboard, Sparkles, Users, BookOpen, BarChart2,
  FolderOpen, Bot, PenTool, Shield, MessageSquare, Calendar,
  Settings, FileText, Lightbulb, ArrowRight, Command
} from 'lucide-react'

const commands = [
  { id: 'dashboard',      label: 'Dashboard',        icon: LayoutDashboard, href: '/dashboard', category: 'Navigation' },
  { id: 'magic-chat',     label: 'Magic Chat',       icon: Sparkles,        href: '/magic-chat', category: 'Navigation' },
  { id: 'agents',         label: 'Agent Swarm',      icon: Bot,             href: '/agents', category: 'Navigation' },
  { id: 'classroom',      label: 'Classroom',        icon: Users,           href: '/classroom', category: 'Navigation' },
  { id: 'courses',        label: 'Courses',          icon: FolderOpen,      href: '/courses', category: 'Navigation' },
  { id: 'workspace',      label: 'AI Workspace',     icon: Lightbulb,       href: '/workspace', category: 'Navigation' },
  { id: 'rubrics',        label: 'Rubrics',          icon: PenTool,         href: '/rubrics', category: 'Navigation' },
  { id: 'standards',      label: 'Standards',        icon: Shield,          href: '/standards', category: 'Navigation' },
  { id: 'calendar',       label: 'Calendar',         icon: Calendar,        href: '/calendar', category: 'Navigation' },
  { id: 'analytics',      label: 'Analytics',        icon: BarChart2,       href: '/analytics', category: 'Navigation' },
  { id: 'reports',        label: 'Reports',          icon: FileText,        href: '/reports', category: 'Navigation' },
  { id: 'settings',       label: 'Settings',         icon: Settings,        href: '/settings', category: 'Navigation' },
  { id: 'gen-lesson',     label: 'Generate Lesson Plan', icon: BookOpen,    href: '/magic-chat?mode=lesson', category: 'AI Tools' },
  { id: 'gen-quiz',       label: 'Generate Quiz',    icon: PenTool,         href: '/magic-chat?mode=quiz', category: 'AI Tools' },
  { id: 'gen-worksheet',  label: 'Generate Worksheet', icon: FileText,      href: '/magic-chat?mode=worksheet', category: 'AI Tools' },
  { id: 'gen-activity',   label: 'Generate Activity', icon: Sparkles,       href: '/magic-chat?mode=activity', category: 'AI Tools' },
  { id: 'communication',  label: 'Communication',    icon: MessageSquare,   href: '/communication', category: 'Navigation' },
]

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const filtered = query
    ? commands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()))
    : commands

  const grouped = filtered.reduce((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = []
    acc[cmd.category].push(cmd)
    return acc
  }, {} as Record<string, typeof commands>)

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(prev => !prev)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  useEffect(() => {
    if (open) {
      setQuery('')
      setSelected(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  function handleSelect(href: string) {
    setOpen(false)
    router.push(href)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelected(prev => Math.min(prev + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelected(prev => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter' && filtered[selected]) {
      handleSelect(filtered[selected].href)
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.div
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-xl z-50 px-4"
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          >
            <div className="glass-card overflow-hidden shadow-2xl">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06]">
                <Search className="w-4 h-4 text-surface-400" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={e => { setQuery(e.target.value); setSelected(0) }}
                  onKeyDown={handleKeyDown}
                  placeholder="Search commands, pages, AI tools..."
                  className="flex-1 bg-transparent text-sm text-white placeholder:text-surface-500 outline-none"
                />
                <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-surface-500 bg-white/[0.04] border border-white/[0.08] rounded">ESC</kbd>
              </div>
              <div className="max-h-80 overflow-y-auto py-2">
                {Object.entries(grouped).map(([cat, items]) => (
                  <div key={cat}>
                    <p className="text-[10px] font-semibold text-surface-500 uppercase tracking-wider px-4 py-1.5">{cat}</p>
                    {items.map(cmd => {
                      const idx = filtered.indexOf(cmd)
                      return (
                        <button
                          key={cmd.id}
                          onClick={() => handleSelect(cmd.href)}
                          onMouseEnter={() => setSelected(idx)}
                          className={`w-full flex items-center gap-3 px-4 py-2 text-left transition-colors ${
                            idx === selected ? 'bg-accent-500/10 text-white' : 'text-surface-300 hover:bg-white/[0.03]'
                          }`}
                        >
                          <cmd.icon className="w-4 h-4 flex-shrink-0" style={{ color: idx === selected ? '#e8ad4b' : undefined }} />
                          <span className="text-sm flex-1">{cmd.label}</span>
                          {idx === selected && <ArrowRight className="w-3 h-3 text-accent-400" />}
                        </button>
                      )
                    })}
                  </div>
                ))}
                {filtered.length === 0 && (
                  <p className="text-sm text-surface-500 text-center py-8">No results found</p>
                )}
              </div>
              <div className="px-4 py-2 border-t border-white/[0.06] flex items-center gap-4 text-[10px] text-surface-500">
                <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 bg-white/[0.04] border border-white/[0.08] rounded">↑↓</kbd> Navigate</span>
                <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 bg-white/[0.04] border border-white/[0.08] rounded">↵</kbd> Select</span>
                <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 bg-white/[0.04] border border-white/[0.08] rounded">Esc</kbd> Close</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
