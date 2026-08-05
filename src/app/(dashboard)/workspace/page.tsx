'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen, ClipboardList, FileText, Zap, BarChart2, Sparkles,
  ChevronRight, Wand2, Layers, PenTool, MessageSquare, Search,
  Star, TrendingUp, Lightbulb, GraduationCap, Globe, Palette,
  Shield, HeartPulse, Music, Calculator, Microscope, BookMarked,
  Languages, Presentation, Users, Brain, Bot, Clock, Plus,
  ThumbsUp, ThumbsDown, X, Check, ArrowRight, Flame, Target,
  Award, RefreshCw, Eye, Download, ChevronDown, CheckCircle,
  BookmarkCheck, Folder, FolderPlus, Trash2, Share2
} from 'lucide-react'
import { FadeUp, FadeInWhenVisible } from '@/components/ui/motion'

interface Tool {
  href: string
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
  label: string
  desc: string
  color: string
  uses: number
  favorite: boolean
  badge?: string
  rating?: number
}

interface ToolCategory {
  title: string
  description: string
  tools: Tool[]
}

const toolCategories: ToolCategory[] = [
  {
    title: 'Content Creation',
    description: 'Generate teaching materials in seconds',
    tools: [
      { href: '/magic-chat?mode=lesson',    icon: BookOpen,       label: 'Lesson Plan Generator',  desc: 'Full lesson plans with objectives, activities, and assessments', color: '#8b5cf6', uses: 24, favorite: true, badge: 'Popular', rating: 4.9 },
      { href: '/magic-chat?mode=quiz',      icon: ClipboardList,  label: 'Quiz & Assessment',      desc: 'Generate quizzes with multiple question types and auto answer keys', color: '#f97316', uses: 18, favorite: true, badge: 'Popular', rating: 4.8 },
      { href: '/magic-chat?mode=worksheet', icon: FileText,       label: 'Student Worksheet',      desc: 'Build targeted practice sheets and exercises for any topic', color: '#14b8a6', uses: 12, favorite: false, rating: 4.6 },
      { href: '/magic-chat?mode=activity',  icon: Zap,            label: 'Classroom Activity',     desc: 'Design engaging individual, partner, or group activities', color: '#f59e0b', uses: 8, favorite: false, rating: 4.5 },
      { href: '/magic-chat',                icon: Presentation,   label: 'Slide Deck Creator',     desc: 'Auto-generate presentation outlines with speaker notes', color: '#ec4899', uses: 5, favorite: false, badge: 'New', rating: 4.3 },
      { href: '/magic-chat',                icon: BookMarked,     label: 'Study Guide Builder',    desc: 'Create comprehensive study guides from any topic or unit', color: '#06b6d4', uses: 3, favorite: false, rating: 4.4 },
    ]
  },
  {
    title: 'Analysis & Insights',
    description: 'Understand and improve your teaching',
    tools: [
      { href: '/magic-chat',  icon: BarChart2,     label: 'Lesson Analyzer',        desc: 'Get AI feedback and improvement suggestions on any lesson', color: '#0ea5e9', uses: 5, favorite: false, rating: 4.7 },
      { href: '/analytics',   icon: TrendingUp,    label: 'Usage Analytics',         desc: 'Track your teaching productivity and material performance', color: '#f43f5e', uses: 9, favorite: true, rating: 4.5 },
      { href: '/magic-chat',  icon: Shield,        label: 'Standards Checker',       desc: 'Verify alignment with Common Core, NGSS, and state standards', color: '#8b5cf6', uses: 4, favorite: false, badge: 'Beta', rating: 4.2 },
      { href: '/magic-chat',  icon: HeartPulse,    label: 'Engagement Predictor',    desc: 'AI predicts student engagement levels for your materials', color: '#10b981', uses: 2, favorite: false, badge: 'Beta', rating: 4.0 },
    ]
  },
  {
    title: 'AI Assistants',
    description: 'Your always-on AI co-teachers',
    tools: [
      { href: '/magic-chat', icon: Sparkles,       label: 'Magic Chat',              desc: 'Your always-on AI co-teacher for any question or request', color: '#6d28d9', uses: 31, favorite: true, badge: 'Popular', rating: 4.9 },
      { href: '/magic-chat', icon: MessageSquare,  label: 'Feedback Writer',         desc: 'Generate personalized student feedback and report comments', color: '#6366f1', uses: 7, favorite: false, rating: 4.6 },
      { href: '/magic-chat', icon: Wand2,          label: 'Content Rewriter',        desc: 'Adapt any material for different reading levels or needs', color: '#14b8a6', uses: 6, favorite: false, rating: 4.5 },
      { href: '/magic-chat', icon: PenTool,        label: 'Rubric Builder',          desc: 'Create detailed assessment rubrics for any assignment type', color: '#0891b2', uses: 4, favorite: false, rating: 4.7 },
      { href: '/magic-chat', icon: Languages,      label: 'Multi-Language Gen',      desc: 'Generate materials in 10+ languages with cultural context', color: '#f97316', uses: 3, favorite: false, rating: 4.3 },
      { href: '/agents',     icon: Bot,            label: 'Agent Swarm',             desc: 'Deploy autonomous AI agents for curriculum planning at scale', color: '#8b5cf6', uses: 1, favorite: false, badge: 'Pro', rating: 4.8 },
    ]
  },
  {
    title: 'Subject-Specific Tools',
    description: 'Specialized for each discipline',
    tools: [
      { href: '/magic-chat', icon: Calculator,    label: 'Math Problem Gen',         desc: 'Generate step-by-step math problems with worked solutions', color: '#f59e0b', uses: 4, favorite: false, rating: 4.6 },
      { href: '/magic-chat', icon: Microscope,    label: 'Science Lab Builder',      desc: 'Create virtual lab experiments and investigation guides', color: '#10b981', uses: 3, favorite: false, rating: 4.5 },
      { href: '/magic-chat', icon: Globe,         label: 'History Timeline',         desc: 'Build interactive timelines and primary source activities', color: '#f97316', uses: 2, favorite: false, rating: 4.4 },
      { href: '/magic-chat', icon: BookOpen,      label: 'Reading Companion',        desc: 'Generate comprehension guides and vocabulary builders', color: '#8b5cf6', uses: 5, favorite: false, rating: 4.5 },
      { href: '/magic-chat', icon: Music,         label: 'Arts & Creative',          desc: 'Generate creative writing prompts and art project guides', color: '#ec4899', uses: 1, favorite: false, rating: 4.2 },
      { href: '/magic-chat', icon: GraduationCap, label: 'College Prep',             desc: 'SAT/ACT prep materials and college application helpers', color: '#6366f1', uses: 2, favorite: false, rating: 4.3 },
    ]
  },
]

const recentlyUsed: { label: string; icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>; color: string; time: string }[] = [
  { label: 'Lesson Plan Generator', icon: BookOpen,    color: '#8b5cf6', time: '2 hours ago' },
  { label: 'Quiz & Assessment',     icon: ClipboardList, color: '#f97316', time: '5 hours ago' },
  { label: 'Magic Chat',            icon: Sparkles,    color: '#6d28d9', time: 'Yesterday' },
  { label: 'Rubric Builder',        icon: PenTool,     color: '#0891b2', time: 'Yesterday' },
  { label: 'Student Worksheet',     icon: FileText,    color: '#14b8a6', time: '2 days ago' },
  { label: 'Feedback Writer',       icon: MessageSquare, color: '#6366f1', time: '2 days ago' },
]

const recentCreations = [
  { title: 'Ch.6 Photosynthesis Quiz',     tool: 'Quiz & Assessment',     date: 'Jul 30', type: 'Quiz',      color: '#f97316' },
  { title: 'Lab Safety Lesson Plan',        tool: 'Lesson Plan Generator', date: 'Jul 29', type: 'Lesson',    color: '#8b5cf6' },
  { title: 'Cell Structure Worksheet',      tool: 'Student Worksheet',     date: 'Jul 28', type: 'Worksheet', color: '#14b8a6' },
  { title: 'Algebra Unit Rubric',           tool: 'Rubric Builder',        date: 'Jul 27', type: 'Rubric',    color: '#0891b2' },
  { title: 'Climate Change Activity',       tool: 'Classroom Activity',    date: 'Jul 25', type: 'Activity',  color: '#f59e0b' },
  { title: 'Emma D. Progress Report',       tool: 'Feedback Writer',       date: 'Jul 24', type: 'Report',    color: '#6366f1' },
  { title: 'Mitosis Exit Ticket',           tool: 'Quiz & Assessment',     date: 'Jul 23', type: 'Quiz',      color: '#f97316' },
  { title: 'Differentiation: Group 2',      tool: 'Content Rewriter',      date: 'Jul 22', type: 'Adapted',   color: '#10b981' },
]

const aiSuggested = [
  { label: 'Exit Ticket for Thursday',    desc: 'Based on your upcoming photosynthesis lesson',   icon: Target,     color: '#6366f1', tool: 'Quiz & Assessment' },
  { label: 'IEP Accommodation Guide',     desc: 'Sofia Rodriguez needs differentiated materials', icon: Users,      color: '#10b981', tool: 'Content Rewriter' },
  { label: 'Standards Alignment Check',   desc: 'NGSS gap detected in current unit plan',         icon: Shield,     color: '#f59e0b', tool: 'Standards Checker' },
  { label: 'Sub Plan for Friday',         desc: 'You have a PD day scheduled — prep now',         icon: BookMarked, color: '#ec4899', tool: 'Lesson Plan Generator' },
]

const ACHIEVEMENTS = [
  { label: '7-Day Streak',  icon: Flame,  color: '#f97316', desc: 'Used AI tools 7 days in a row', unlocked: true  },
  { label: 'Content Pro',   icon: Award,  color: '#8b5cf6', desc: 'Created 25+ materials',          unlocked: true  },
  { label: 'Top Educator',  icon: Star,   color: '#f59e0b', desc: 'Achieved 4.8+ tool rating avg',  unlocked: true  },
  { label: 'Agent Master',  icon: Bot,    color: '#22d3ee', desc: 'Used Agent Swarm 5+ times',       unlocked: false },
]

const STREAK_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const STREAK_ACTIVE = [true, true, true, true, true, false, false]

interface Collection {
  id: string
  name: string
  tools: string[]
  color: string
}

const INITIAL_COLLECTIONS: Collection[] = [
  { id: 'c1', name: 'Science Unit Toolkit',  tools: ['Lesson Plan Generator', 'Quiz & Assessment', 'Science Lab Builder'], color: '#10b981' },
  { id: 'c2', name: 'Daily Essentials',      tools: ['Magic Chat', 'Feedback Writer', 'Exit Ticket'],                     color: '#6366f1' },
  { id: 'c3', name: 'Assessment Suite',      tools: ['Rubric Builder', 'Quiz & Assessment', 'Usage Analytics'],            color: '#f97316' },
]

type SortMode = 'category' | 'popular' | 'favorites'

export default function WorkspacePage() {
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortMode>('category')
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    const favs = new Set<string>()
    toolCategories.flatMap(c => c.tools).filter(t => t.favorite).forEach(t => favs.add(t.label))
    return favs
  })
  const [feedbackId, setFeedbackId] = useState<string | null>(null)
  const [aiOpen, setAiOpen] = useState(true)
  const [toastMsg, setToastMsg] = useState('')
  const [collections, setCollections] = useState<Collection[]>(INITIAL_COLLECTIONS)
  const [newColName, setNewColName] = useState('')
  const [collectionOpen, setCollectionOpen] = useState(false)
  const [deleteColId, setDeleteColId] = useState<string | null>(null)

  const allTools = toolCategories.flatMap(c => c.tools)
  const totalUses = allTools.reduce((a, t) => a + t.uses, 0)

  const showToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 2500)
  }

  const toggleFavorite = (label: string) => {
    setFavorites(prev => {
      const next = new Set(prev)
      if (next.has(label)) {
        next.delete(label)
        showToast(`Removed ${label} from favorites`)
      } else {
        next.add(label)
        showToast(`Added ${label} to favorites`)
      }
      return next
    })
  }

  const handleCreateCollection = () => {
    if (!newColName.trim()) return
    const colors = ['#8b5cf6', '#14b8a6', '#ec4899', '#22d3ee', '#f59e0b']
    const col: Collection = {
      id: `c${Date.now()}`,
      name: newColName.trim(),
      tools: [],
      color: colors[collections.length % colors.length],
    }
    setCollections(prev => [col, ...prev])
    setNewColName('')
    setCollectionOpen(false)
    showToast(`Collection "${col.name}" created`)
  }

  const handleDeleteCollection = (id: string) => {
    const col = collections.find(c => c.id === id)
    setCollections(prev => prev.filter(c => c.id !== id))
    setDeleteColId(null)
    if (col) showToast(`Deleted "${col.name}"`)
  }

  const filtered = search
    ? allTools.filter(t => t.label.toLowerCase().includes(search.toLowerCase()) || t.desc.toLowerCase().includes(search.toLowerCase()))
    : null

  const sortedCategories = sort === 'popular'
    ? [{ title: 'Most Popular', description: 'Sorted by usage', tools: [...allTools].sort((a, b) => b.uses - a.uses) }]
    : sort === 'favorites'
    ? [{ title: 'Favorites', description: 'Your starred tools', tools: allTools.filter(t => favorites.has(t.label)) }]
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
                style={{ background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)' }}
                whileHover={{ rotate: 10, scale: 1.08 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <Layers className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <h2 className="text-xl font-black text-white">AI Workspace</h2>
                <p className="text-xs text-surface-400">{allTools.length} tools across {toolCategories.length} categories · {totalUses} total uses this semester</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-surface-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search all tools..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 text-xs rounded-full bg-white/[0.04] border border-white/[0.08] text-surface-200 placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500/40 w-48 transition-all"
                />
                {search && (
                  <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-500 hover:text-surface-300">
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
              <motion.button className="btn-gradient text-xs" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Sparkles className="w-3.5 h-3.5" /> AI Suggest
              </motion.button>
            </div>
          </div>
        </div>
      </FadeUp>

      {/* Stat cards */}
      <FadeUp delay={0.03}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Total Tools', value: allTools.length, icon: Layers, color: '#8b5cf6', sub: 'In workspace' },
            { label: 'Total Uses', value: totalUses, icon: TrendingUp, color: '#10b981', sub: 'This semester' },
            { label: 'Favorites', value: favorites.size, icon: Star, color: '#f59e0b', sub: 'Starred tools' },
            { label: 'Creations', value: '32', icon: FileText, color: '#ec4899', sub: 'This month' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="glass-card p-4"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -2 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: stat.color + '18' }}>
                  <stat.icon className="w-3.5 h-3.5" style={{ color: stat.color }} />
                </div>
                <span className="text-xs text-surface-400">{stat.label}</span>
              </div>
              <p className="text-xl font-black text-white">{stat.value}</p>
              <p className="text-[10px] text-surface-500 mt-0.5">{stat.sub}</p>
            </motion.div>
          ))}
        </div>
      </FadeUp>

      {/* Productivity Streak & Achievements */}
      <FadeUp delay={0.05}>
        <div className="glass-card p-5">
          <div className="flex flex-col lg:flex-row gap-5">
            {/* Streak tracker */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#f97316,#ef4444)' }}>
                  <Flame className="w-3.5 h-3.5 text-white" />
                </div>
                <div>
                  <span className="text-sm font-bold text-white">7-Day Streak</span>
                  <span className="text-[10px] text-surface-500 ml-2">Keep it going!</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 mb-3">
                {STREAK_DAYS.map((day, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <motion.div
                      className="w-full h-8 rounded-lg flex items-center justify-center"
                      style={{
                        background: STREAK_ACTIVE[i]
                          ? 'linear-gradient(135deg,#f97316,#ef4444)'
                          : 'rgba(255,255,255,0.04)',
                        border: STREAK_ACTIVE[i] ? 'none' : '1px solid rgba(255,255,255,0.06)',
                      }}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.05 + i * 0.04 }}
                    >
                      {STREAK_ACTIVE[i]
                        ? <Flame className="w-3.5 h-3.5 text-white" />
                        : <span className="w-1.5 h-1.5 rounded-full bg-surface-600 block" />
                      }
                    </motion.div>
                    <span className={`text-[9px] font-semibold ${STREAK_ACTIVE[i] ? 'text-orange-400' : 'text-surface-600'}`}>{day}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between text-[10px] text-surface-500">
                <span>Weekly goal: 5/5 days</span>
                <span className="text-success-400 font-semibold">Goal reached!</span>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg,#10b981,#34d399)' }}
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
                />
              </div>
            </div>

            {/* Divider */}
            <div className="hidden lg:block w-px bg-white/[0.06]" />

            {/* Achievements */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)' }}>
                  <Award className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-sm font-bold text-white">Achievements</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 font-semibold ml-1">3 / 4 unlocked</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {ACHIEVEMENTS.map((ach, i) => (
                  <motion.div
                    key={ach.label}
                    className="flex flex-col items-center gap-1.5 p-2 rounded-xl text-center"
                    style={{
                      background: ach.unlocked ? ach.color + '10' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${ach.unlocked ? ach.color + '30' : 'rgba(255,255,255,0.06)'}`,
                      opacity: ach.unlocked ? 1 : 0.45,
                    }}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: ach.unlocked ? 1 : 0.45 }}
                    transition={{ delay: 0.1 + i * 0.06 }}
                    title={ach.desc}
                  >
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: ach.color + '20' }}>
                      <ach.icon className="w-3.5 h-3.5" style={{ color: ach.unlocked ? ach.color : '#6b7280' }} />
                    </div>
                    <span className="text-[9px] font-semibold leading-tight" style={{ color: ach.unlocked ? '#e2e8f0' : '#6b7280' }}>{ach.label}</span>
                    {!ach.unlocked && <span className="text-[8px] text-surface-600">Locked</span>}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </FadeUp>

      {/* AI Suggestions for You — collapsible */}
      <FadeUp delay={0.06}>
        <div className="glass-card border border-accent-500/15 overflow-hidden">
          <button
            className="w-full flex items-center justify-between p-5 hover:bg-white/[0.02] transition-colors"
            onClick={() => setAiOpen(o => !o)}
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#6366f1,#a78bfa)' }}>
                <Brain className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-bold text-white">AI-Suggested for You</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent-500/15 text-accent-400 font-semibold">{aiSuggested.length} new</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="text-xs text-surface-500 hover:text-surface-300 flex items-center gap-1"
                onClick={e => { e.stopPropagation(); showToast('AI suggestions refreshed') }}
              >
                <RefreshCw className="w-3 h-3" /> Refresh
              </button>
              <motion.div animate={{ rotate: aiOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                <ChevronDown className="w-4 h-4 text-surface-500" />
              </motion.div>
            </div>
          </button>
          <AnimatePresence initial={false}>
            {aiOpen && (
              <motion.div
                key="ai-panel"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="px-5 pb-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {aiSuggested.map((s, i) => (
                    <motion.div
                      key={s.label}
                      className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] transition-all cursor-pointer group"
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 + i * 0.07 }}
                      whileHover={{ y: -2 }}
                    >
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: s.color + '18' }}>
                        <s.icon className="w-4 h-4" style={{ color: s.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white group-hover:text-accent-300 transition-colors">{s.label}</p>
                        <p className="text-[10px] text-surface-500 mt-0.5">{s.desc}</p>
                        <span className="text-[9px] mt-1.5 inline-block px-1.5 py-0.5 rounded-full bg-white/[0.06] text-surface-400">{s.tool}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </FadeUp>

      {/* Recently Used */}
      <FadeUp delay={0.07}>
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white">Recently Used</h3>
            <button className="text-xs text-surface-500 hover:text-surface-300">View History</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {recentlyUsed.map((tool, i) => (
              <motion.div
                key={tool.label}
                className="glass-card p-3 cursor-pointer group"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.07 + i * 0.04 }}
                whileHover={{ y: -2 }}
              >
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: tool.color + '18' }}>
                    <tool.icon className="w-4 h-4" style={{ color: tool.color }} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-white leading-tight group-hover:text-accent-300 transition-colors">{tool.label}</p>
                    <p className="text-[9px] text-surface-600 flex items-center justify-center gap-0.5 mt-0.5"><Clock className="w-2.5 h-2.5" />{tool.time}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </FadeUp>

      {/* Quick Create */}
      <FadeUp delay={0.08}>
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white">Quick Create</h3>
            <span className="text-[10px] text-surface-500">AI generates in under 30 seconds</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Lesson Plan', icon: BookOpen, color: '#8b5cf6', href: '/magic-chat?mode=lesson' },
              { label: 'Quiz', icon: ClipboardList, color: '#f97316', href: '/magic-chat?mode=quiz' },
              { label: 'Worksheet', icon: FileText, color: '#14b8a6', href: '/magic-chat?mode=worksheet' },
              { label: 'Activity', icon: Zap, color: '#f59e0b', href: '/magic-chat?mode=activity' },
              { label: 'Rubric', icon: PenTool, color: '#0891b2', href: '/rubrics' },
              { label: 'Ask AI', icon: Sparkles, color: '#6d28d9', href: '/magic-chat' },
              { label: 'Exit Ticket', icon: Check, color: '#10b981', href: '/exit-tickets' },
              { label: 'Slide Deck', icon: Presentation, color: '#ec4899', href: '/magic-chat' },
            ].map((item) => (
              <Link key={item.label} href={item.href}>
                <motion.div
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.07] transition-all cursor-pointer"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <item.icon className="w-3.5 h-3.5" style={{ color: item.color }} />
                  <span className="text-xs font-semibold text-surface-200">{item.label}</span>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </FadeUp>

      {/* Sort tabs */}
      <FadeUp delay={0.1}>
        <div className="flex items-center gap-2">
          {([
            { key: 'category' as const, label: 'By Category', icon: Layers },
            { key: 'popular' as const,  label: 'Most Popular', icon: TrendingUp },
            { key: 'favorites' as const, label: `Favorites (${favorites.size})`, icon: Star },
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
            {filtered.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <Search className="w-8 h-8 text-surface-600 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-surface-300 mb-1">No tools found</h4>
                <p className="text-xs text-surface-500">Try a different search term or browse by category</p>
                <button onClick={() => setSearch('')} className="mt-4 btn-secondary text-xs px-4 py-2">Clear Search</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filtered.map((tool, i) => (
                  <ToolCard key={tool.label} tool={tool} index={i} isFavorited={favorites.has(tool.label)} onToggleFav={toggleFavorite} feedbackId={feedbackId} onFeedback={setFeedbackId} />
                ))}
              </div>
            )}
          </div>
        </FadeUp>
      ) : (
        sortedCategories.map((cat, ci) => (
          cat.tools.length > 0 && (
            <FadeInWhenVisible key={cat.title} delay={ci * 0.08}>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-white">{cat.title}</h3>
                    <p className="text-xs text-surface-400">{cat.description}</p>
                  </div>
                  <span className="text-xs text-surface-500">{cat.tools.length} tool{cat.tools.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {cat.tools.map((tool, i) => (
                    <ToolCard key={tool.label} tool={tool} index={i} isFavorited={favorites.has(tool.label)} onToggleFav={toggleFavorite} feedbackId={feedbackId} onFeedback={setFeedbackId} />
                  ))}
                </div>
              </div>
            </FadeInWhenVisible>
          )
        ))
      )}

      {/* Recent Creations */}
      <FadeInWhenVisible delay={0.1}>
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white">Recent Creations</h3>
            <button className="text-xs text-accent-400 hover:text-accent-300">View Library →</button>
          </div>
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="text-left text-xs font-semibold text-surface-300 px-5 py-3">Title</th>
                    <th className="text-left text-xs font-semibold text-surface-300 px-5 py-3 hidden sm:table-cell">Tool</th>
                    <th className="text-left text-xs font-semibold text-surface-300 px-5 py-3">Date</th>
                    <th className="text-right text-xs font-semibold text-surface-300 px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentCreations.map((item, i) => (
                    <motion.tr
                      key={item.title}
                      className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.05 }}
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-1.5 h-6 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                          <div>
                            <span className="text-sm font-medium text-white block">{item.title}</span>
                            <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold" style={{ color: item.color, backgroundColor: item.color + '15' }}>{item.type}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 hidden sm:table-cell">
                        <span className="text-xs text-surface-400">{item.tool}</span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-xs text-surface-500">{item.date}</span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button className="p-1.5 rounded-lg hover:bg-white/[0.06] text-surface-500 hover:text-white transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                          <button className="p-1.5 rounded-lg hover:bg-white/[0.06] text-surface-500 hover:text-white transition-colors"><Download className="w-3.5 h-3.5" /></button>
                          <button
                            className="p-1.5 rounded-lg hover:bg-white/[0.06] text-surface-500 hover:text-white transition-colors"
                            onClick={() => showToast(`Shared "${item.title}"`)}
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </FadeInWhenVisible>

      {/* Collections */}
      <FadeInWhenVisible delay={0.12}>
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">My Collections</h3>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/[0.06] text-surface-400">{collections.length}</span>
            </div>
            <motion.button
              className="flex items-center gap-1.5 text-xs font-semibold text-accent-400 hover:text-accent-300 transition-colors"
              onClick={() => setCollectionOpen(o => !o)}
              whileHover={{ scale: 1.03 }}
            >
              <FolderPlus className="w-3.5 h-3.5" /> New Collection
            </motion.button>
          </div>

          {/* New collection form */}
          <AnimatePresence>
            {collectionOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden mb-3"
              >
                <div className="glass-card p-4 border border-accent-500/20">
                  <p className="text-xs font-semibold text-white mb-3">Create New Collection</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Collection name..."
                      value={newColName}
                      onChange={e => setNewColName(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleCreateCollection()}
                      className="flex-1 px-3 py-2 text-xs rounded-xl bg-white/[0.04] border border-white/[0.08] text-surface-200 placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-accent-500"
                    />
                    <motion.button
                      className="btn-gradient text-xs px-4"
                      onClick={handleCreateCollection}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Plus className="w-3.5 h-3.5" /> Create
                    </motion.button>
                    <button
                      className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-surface-500 hover:text-surface-300 transition-colors"
                      onClick={() => setCollectionOpen(false)}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {collections.map((col, i) => (
              <motion.div
                key={col.id}
                className="glass-card p-4 group relative"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + i * 0.06 }}
                whileHover={{ y: -2 }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: col.color + '18' }}>
                    <Folder className="w-4.5 h-4.5" style={{ color: col.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate group-hover:text-accent-300 transition-colors">{col.name}</p>
                    <p className="text-[10px] text-surface-500">{col.tools.length} tool{col.tools.length !== 1 ? 's' : ''}</p>
                  </div>
                  <button
                    className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-danger-400/15 text-surface-500 hover:text-danger-400 transition-all"
                    onClick={() => setDeleteColId(col.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {col.tools.length > 0
                    ? col.tools.slice(0, 3).map(t => (
                        <span key={t} className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/[0.06] text-surface-400">{t}</span>
                      ))
                    : <span className="text-[10px] text-surface-600 italic">No tools yet — drag tools here</span>
                  }
                  {col.tools.length > 3 && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/[0.06] text-surface-500">+{col.tools.length - 3}</span>
                  )}
                </div>
                <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center gap-1">
                  <button className="flex-1 text-[10px] font-semibold text-surface-400 hover:text-white transition-colors py-1 rounded-lg hover:bg-white/[0.04]">Open</button>
                  <button className="flex-1 text-[10px] font-semibold text-surface-400 hover:text-white transition-colors py-1 rounded-lg hover:bg-white/[0.04]">Share</button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Delete collection confirm */}
          <AnimatePresence>
            {deleteColId && (
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setDeleteColId(null)}
              >
                <motion.div
                  className="glass-card p-6 max-w-sm w-full mx-4"
                  initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                  onClick={e => e.stopPropagation()}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-danger-400/15 mb-4">
                    <Trash2 className="w-5 h-5 text-danger-400" />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">Delete Collection?</h4>
                  <p className="text-xs text-surface-400 mb-5">
                    &ldquo;{collections.find(c => c.id === deleteColId)?.name}&rdquo; will be permanently deleted. Tools inside won&apos;t be affected.
                  </p>
                  <div className="flex gap-2">
                    <button className="flex-1 btn-secondary text-xs py-2" onClick={() => setDeleteColId(null)}>Cancel</button>
                    <button
                      className="flex-1 text-xs font-semibold py-2 rounded-xl bg-danger-400/20 text-danger-400 hover:bg-danger-400/30 transition-colors"
                      onClick={() => handleDeleteCollection(deleteColId)}
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </FadeInWhenVisible>

      {/* Weekly Usage Summary */}
      <FadeInWhenVisible delay={0.15}>
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">This Week&apos;s Activity</h3>
              <p className="text-xs text-surface-500">32 materials created · 12.4 hours saved</p>
            </div>
            <div className="flex items-center gap-1 text-success-400 text-xs font-semibold">
              <TrendingUp className="w-3 h-3" /> +18% vs last week
            </div>
          </div>
          <div className="flex items-end gap-1.5 h-16 mb-3">
            {[4, 7, 5, 8, 6, 2, 0].map((val, i) => {
              const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
              const isToday = i === 4
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <motion.div
                    className="w-full rounded-md"
                    style={{
                      height: `${Math.max(val * 7, 3)}px`,
                      background: isToday ? 'linear-gradient(to top, #6366f1, #a78bfa)' : 'rgba(255,255,255,0.08)',
                    }}
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(val * 7, 3)}px` }}
                    transition={{ delay: 0.2 + i * 0.05, duration: 0.4, ease: 'easeOut' }}
                  />
                  <span className={`text-[9px] ${isToday ? 'text-accent-400 font-bold' : 'text-surface-600'}`}>{days[i]}</span>
                </div>
              )
            })}
          </div>
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/[0.06]">
            {[
              { label: 'Most Used', value: 'Magic Chat', color: '#6d28d9' },
              { label: 'Top Category', value: 'Content Creation', color: '#8b5cf6' },
              { label: 'Time Saved', value: '12.4 hrs', color: '#10b981' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <p className="text-xs font-bold" style={{ color: stat.color }}>{stat.value}</p>
                <p className="text-[10px] text-surface-500 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </FadeInWhenVisible>

      {/* Toast */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            className="fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl shadow-xl text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg,#1e1b4b,#312e81)', border: '1px solid rgba(99,102,241,0.3)' }}
            initial={{ opacity: 0, y: -16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.95 }}
            transition={{ duration: 0.25 }}
          >
            <CheckCircle className="w-4 h-4 text-accent-400" />
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ToolCard({
  tool, index, isFavorited, onToggleFav, feedbackId, onFeedback
}: {
  tool: Tool
  index: number
  isFavorited: boolean
  onToggleFav: (label: string) => void
  feedbackId: string | null
  onFeedback: (id: string | null) => void
}) {
  const badgeColors: Record<string, string> = {
    Popular: 'bg-accent-500/15 text-accent-400',
    New: 'bg-success-500/15 text-success-400',
    Beta: 'bg-warning-500/15 text-warning-400',
    Pro: 'bg-neon-500/15 text-neon-400',
  }

  return (
    <motion.div
      className="glass-card p-4 group relative"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 + index * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3, transition: { duration: 0.18 } }}
    >
      {tool.badge && (
        <span className={`absolute top-3 right-3 text-[9px] px-1.5 py-0.5 rounded-full font-bold ${badgeColors[tool.badge] ?? 'bg-white/[0.08] text-surface-400'}`}>
          {tool.badge}
        </span>
      )}
      <Link href={tool.href} className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: tool.color + '18' }}>
          <tool.icon className="w-5 h-5" style={{ color: tool.color }} />
        </div>
        <div className="flex-1 min-w-0 pr-6">
          <h4 className="font-bold text-white text-sm group-hover:text-accent-300 transition-colors">{tool.label}</h4>
          <p className="text-xs text-surface-400 mt-0.5 leading-relaxed line-clamp-2">{tool.desc}</p>
        </div>
      </Link>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[10px] text-surface-500">
          <span>{tool.uses} uses</span>
          {tool.rating && (
            <span className="flex items-center gap-0.5 text-warning-400">
              <Star className="w-2.5 h-2.5 fill-warning-400" />
              {tool.rating}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <AnimatePresence>
            {feedbackId === tool.label && (
              <motion.div className="flex items-center gap-1" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
                <button className="p-1 rounded-lg hover:bg-success-500/15 text-surface-500 hover:text-success-400 transition-colors" onClick={() => onFeedback(null)}>
                  <ThumbsUp className="w-3 h-3" />
                </button>
                <button className="p-1 rounded-lg hover:bg-danger-400/15 text-surface-500 hover:text-danger-400 transition-colors" onClick={() => onFeedback(null)}>
                  <ThumbsDown className="w-3 h-3" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            className="p-1.5 rounded-lg hover:bg-white/[0.06] text-surface-500 hover:text-surface-300 transition-colors"
            onClick={() => onFeedback(feedbackId === tool.label ? null : tool.label)}
          >
            <MessageSquare className="w-3 h-3" />
          </button>
          <button
            className={`p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors ${isFavorited ? 'text-amber-400' : 'text-surface-500 hover:text-amber-400'}`}
            onClick={() => onToggleFav(tool.label)}
          >
            <Star className={`w-3 h-3 ${isFavorited ? 'fill-amber-400' : ''}`} />
          </button>
          <Link href={tool.href}>
            <div className="p-1.5 rounded-lg hover:bg-white/[0.06] text-surface-500 hover:text-accent-400 transition-colors">
              <ChevronRight className="w-3 h-3" />
            </div>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
