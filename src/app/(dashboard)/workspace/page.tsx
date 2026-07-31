'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen, ClipboardList, FileText, Zap, BarChart2, Sparkles,
  ChevronRight, Wand2, Layers, PenTool, MessageSquare, Search,
  Star, TrendingUp, Lightbulb, GraduationCap, Globe, Palette,
  Shield, HeartPulse, Music, Calculator, Microscope, BookMarked,
  Languages, Presentation, Users, Brain, Bot
} from 'lucide-react'
import { FadeUp, FadeInWhenVisible } from '@/components/ui/motion'

const toolCategories = [
  {
    title: 'Content Creation',
    description: 'Generate teaching materials in seconds',
    tools: [
      { href: '/magic-chat?mode=lesson',    icon: BookOpen,       label: 'Lesson Plan Generator',  desc: 'Full lesson plans with objectives, activities, and assessments', color: '#b0623f', uses: 24, favorite: true },
      { href: '/magic-chat?mode=quiz',      icon: ClipboardList,  label: 'Quiz & Assessment',      desc: 'Generate quizzes with multiple question types and auto answer keys', color: '#f97316', uses: 18, favorite: true },
      { href: '/magic-chat?mode=worksheet', icon: FileText,       label: 'Student Worksheet',      desc: 'Build targeted practice sheets and exercises for any topic', color: '#14b8a6', uses: 12, favorite: false },
      { href: '/magic-chat?mode=activity',  icon: Zap,            label: 'Classroom Activity',     desc: 'Design engaging individual, partner, or group activities', color: '#f59e0b', uses: 8, favorite: false },
      { href: '/magic-chat',                icon: Presentation,   label: 'Slide Deck Creator',     desc: 'Auto-generate presentation outlines with speaker notes', color: '#ec4899', uses: 5, favorite: false },
      { href: '/magic-chat',                icon: BookMarked,     label: 'Study Guide Builder',    desc: 'Create comprehensive study guides from any topic', color: '#6b8557', uses: 3, favorite: false },
    ]
  },
  {
    title: 'Analysis & Insights',
    description: 'Understand and improve your teaching',
    tools: [
      { href: '/magic-chat',  icon: BarChart2,     label: 'Lesson Analyzer',     desc: 'Get AI feedback and improvement suggestions on any lesson', color: '#0ea5e9', uses: 5, favorite: false },
      { href: '/analytics',   icon: TrendingUp,    label: 'Usage Analytics',     desc: 'Track your teaching productivity and material performance', color: '#f43f5e', uses: 9, favorite: true },
      { href: '/magic-chat',  icon: Shield,        label: 'Standards Checker',   desc: 'Verify alignment with Common Core, NGSS, and state standards', color: '#b0623f', uses: 4, favorite: false },
      { href: '/magic-chat',  icon: HeartPulse,    label: 'Engagement Predictor',desc: 'AI predicts student engagement levels for your materials', color: '#10b981', uses: 2, favorite: false },
    ]
  },
  {
    title: 'AI Assistants',
    description: 'Your always-on AI co-teachers',
    tools: [
      { href: '/magic-chat', icon: Sparkles,       label: 'Magic Chat',          desc: 'Your always-on AI co-teacher for any question or request', color: '#6d28d9', uses: 31, favorite: true },
      { href: '/magic-chat', icon: MessageSquare,  label: 'Feedback Writer',     desc: 'Generate personalized student feedback and report comments', color: '#dd9a33', uses: 7, favorite: false },
      { href: '/magic-chat', icon: Wand2,          label: 'Content Rewriter',    desc: 'Adapt any material for different reading levels or needs', color: '#14b8a6', uses: 6, favorite: false },
      { href: '/magic-chat', icon: PenTool,        label: 'Rubric Builder',      desc: 'Create detailed assessment rubrics for any assignment type', color: '#0891b2', uses: 4, favorite: false },
      { href: '/magic-chat', icon: Languages,      label: 'Multi-Language Gen',  desc: 'Generate materials in 10+ languages with cultural context', color: '#f97316', uses: 3, favorite: false },
      { href: '/agents',     icon: Bot,            label: 'Agent Swarm',         desc: 'Deploy autonomous AI agents for curriculum planning at scale', color: '#b0623f', uses: 1, favorite: false },
    ]
  },
  {
    title: 'Subject-Specific Tools',
    description: 'Specialized for each discipline',
    tools: [
      { href: '/magic-chat', icon: Calculator,    label: 'Math Problem Gen',    desc: 'Generate step-by-step math problems with worked solutions', color: '#f59e0b', uses: 4, favorite: false },
      { href: '/magic-chat', icon: Microscope,    label: 'Science Lab Builder', desc: 'Create virtual lab experiments and investigation guides', color: '#10b981', uses: 3, favorite: false },
      { href: '/magic-chat', icon: Globe,         label: 'History Timeline',    desc: 'Build interactive timelines and primary source activities', color: '#f97316', uses: 2, favorite: false },
      { href: '/magic-chat', icon: BookOpen,      label: 'Reading Companion',   desc: 'Generate comprehension guides and vocabulary builders', color: '#b0623f', uses: 5, favorite: false },
      { href: '/magic-chat', icon: Music,         label: 'Arts & Creative',     desc: 'Generate creative writing prompts and art project guides', color: '#ec4899', uses: 1, favorite: false },
      { href: '/magic-chat', icon: GraduationCap, label: 'College Prep',        desc: 'SAT/ACT prep materials and college application helpers', color: '#dd9a33', uses: 2, favorite: false },
    ]
  },
]

type SortMode = 'category' | 'popular' | 'favorites'

export default function WorkspacePage() {
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortMode>('category')

  const allTools = toolCategories.flatMap(c => c.tools)
  const filtered = search
    ? allTools.filter(t => t.label.toLowerCase().includes(search.toLowerCase()) || t.desc.toLowerCase().includes(search.toLowerCase()))
    : null

  const sortedCategories = sort === 'popular'
    ? [{ title: 'Most Popular', description: 'Sorted by usage', tools: [...allTools].sort((a, b) => b.uses - a.uses) }]
    : sort === 'favorites'
    ? [{ title: 'Favorites', description: 'Your starred tools', tools: allTools.filter(t => t.favorite) }, ...toolCategories.map(c => ({ ...c, tools: c.tools.filter(t => !t.favorite) }))]
    : toolCategories

  return (
    <div className="space-y-6">
      {/* Hero */}
      <FadeUp>
        <div className="hero-mesh rounded-3xl p-6 border border-white/[0.06]">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg,#b0623f,#6d28d9)' }}
                whileHover={{ rotate: 10, scale: 1.08 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <Layers className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <h2 className="text-xl font-black text-white">AI Workspace</h2>
                <p className="text-xs text-surface-400">{allTools.length} tools across {toolCategories.length} categories</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-surface-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search tools..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 text-xs rounded-full bg-white/[0.04] border border-white/[0.08] text-surface-200 placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500/40 w-48 transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </FadeUp>

      {/* Sort tabs */}
      <FadeUp delay={0.1}>
        <div className="flex items-center gap-2">
          {([
            { key: 'category' as const, label: 'By Category', icon: Layers },
            { key: 'popular' as const,  label: 'Most Popular', icon: TrendingUp },
            { key: 'favorites' as const, label: 'Favorites', icon: Star },
          ]).map(s => (
            <button
              key={s.key}
              onClick={() => setSort(s.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                sort === s.key
                  ? 'bg-white/[0.08] text-white'
                  : 'text-surface-400 hover:text-surface-200 hover:bg-white/[0.04]'
              }`}
            >
              <s.icon className="w-3 h-3" />
              {s.label}
            </button>
          ))}
        </div>
      </FadeUp>

      {/* Search results */}
      {filtered !== null ? (
        <FadeUp>
          <div>
            <p className="text-sm text-surface-400 mb-4">{filtered.length} result{filtered.length !== 1 ? 's' : ''} for &ldquo;{search}&rdquo;</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filtered.map((tool, i) => (
                <ToolCard key={tool.label} tool={tool} index={i} />
              ))}
            </div>
          </div>
        </FadeUp>
      ) : (
        /* Tool categories */
        sortedCategories.map((cat, ci) => (
          <FadeInWhenVisible key={cat.title} delay={ci * 0.08}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-white">{cat.title}</h3>
                  <p className="text-xs text-surface-400">{cat.description}</p>
                </div>
                <span className="text-xs text-surface-500">{cat.tools.length} tools</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {cat.tools.map((tool, i) => (
                  <ToolCard key={tool.label} tool={tool} index={i} />
                ))}
              </div>
            </div>
          </FadeInWhenVisible>
        ))
      )}
    </div>
  )
}

function ToolCard({ tool, index }: { tool: { href: string; icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>; label: string; desc: string; color: string; uses: number; favorite: boolean }; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 + index * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3, transition: { duration: 0.18 } }}
    >
      <Link href={tool.href} className="tool-card group flex items-start gap-4 h-full">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: tool.color + '18' }}
        >
          <tool.icon className="w-5 h-5" style={{ color: tool.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-white text-sm truncate">{tool.label}</h4>
            {tool.favorite && <Star className="w-3 h-3 text-amber-400 fill-amber-400 flex-shrink-0" />}
          </div>
          <p className="text-xs text-surface-400 mt-0.5 leading-relaxed line-clamp-2">{tool.desc}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] text-surface-500">{tool.uses} uses</span>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-surface-500 group-hover:text-accent-400 flex-shrink-0 mt-0.5 transition-colors" />
      </Link>
    </motion.div>
  )
}
