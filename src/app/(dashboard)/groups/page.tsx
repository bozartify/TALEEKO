'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, Plus, Sparkles, Edit3, UserPlus, Shuffle, ChevronDown,
  Target, BookOpen, Star, Zap, Brain, TrendingUp, MessageSquare,
  CheckCircle, BarChart2, ArrowRight, Layers, Clock, Filter,
  Trophy, AlertTriangle, ChevronRight, X, MoreHorizontal,
  Download, Archive, Search, Trash2, ChevronUp
} from 'lucide-react'
import { FadeUp, FadeInWhenVisible } from '@/components/ui/motion'

type GroupType = 'Lab' | 'Reading' | 'Support' | 'Project' | 'Discussion'

interface Group {
  id: string
  name: string
  color: string
  type: GroupType
  students: Student[]
  purpose: string
  lastActive: string
  nextMeeting?: string
  avgPerformance: number
  trend: 'up' | 'down' | 'stable'
  completedTasks: number
  totalTasks: number
}

interface Student {
  name: string
  initials: string
  avg: number
  status: 'excelling' | 'on-track' | 'at-risk'
}

const INITIAL_GROUPS: Group[] = [
  {
    id: '1',
    name: 'Lab Partners A',
    color: '#6366f1',
    type: 'Lab',
    purpose: 'Photosynthesis lab investigations — collaborative data collection',
    lastActive: '2 hours ago',
    nextMeeting: 'Today 2:00 PM',
    avgPerformance: 88,
    trend: 'up',
    completedTasks: 4,
    totalTasks: 5,
    students: [
      { name: 'Emma Davis', initials: 'ED', avg: 94, status: 'excelling' },
      { name: 'Liam Chen', initials: 'LC', avg: 87, status: 'on-track' },
      { name: 'Ava Patel', initials: 'AP', avg: 91, status: 'excelling' },
      { name: 'James Brown', initials: 'JB', avg: 79, status: 'on-track' },
    ],
  },
  {
    id: '2',
    name: 'Reading Circle — Advanced',
    color: '#10b981',
    type: 'Reading',
    purpose: 'Advanced comprehension and literary analysis',
    lastActive: 'Yesterday',
    nextMeeting: 'Thu 1:30 PM',
    avgPerformance: 92,
    trend: 'up',
    completedTasks: 6,
    totalTasks: 6,
    students: [
      { name: 'Emma Davis', initials: 'ED', avg: 94, status: 'excelling' },
      { name: 'Sofia Rodriguez', initials: 'SR', avg: 96, status: 'excelling' },
      { name: 'Ethan Kim', initials: 'EK', avg: 88, status: 'on-track' },
    ],
  },
  {
    id: '3',
    name: 'Math Support Group',
    color: '#f97316',
    type: 'Support',
    purpose: 'Extra practice with algebraic concepts and problem-solving',
    lastActive: '3 days ago',
    nextMeeting: 'Tomorrow 3:15 PM',
    avgPerformance: 63,
    trend: 'up',
    completedTasks: 2,
    totalTasks: 6,
    students: [
      { name: 'Noah Williams', initials: 'NW', avg: 68, status: 'at-risk' },
      { name: 'Mia Thompson', initials: 'MT', avg: 59, status: 'at-risk' },
      { name: 'Ava Patel', initials: 'AP', avg: 63, status: 'at-risk' },
    ],
  },
  {
    id: '4',
    name: 'History Debate Team',
    color: '#ec4899',
    type: 'Discussion',
    purpose: 'American Revolution debate preparation and argumentation',
    lastActive: '1 day ago',
    nextMeeting: 'Fri 11:00 AM',
    avgPerformance: 84,
    trend: 'stable',
    completedTasks: 3,
    totalTasks: 4,
    students: [
      { name: 'Liam Chen', initials: 'LC', avg: 87, status: 'on-track' },
      { name: 'James Brown', initials: 'JB', avg: 79, status: 'on-track' },
      { name: 'Sofia Rodriguez', initials: 'SR', avg: 96, status: 'excelling' },
      { name: 'Ethan Kim', initials: 'EK', avg: 88, status: 'on-track' },
    ],
  },
  {
    id: '5',
    name: 'ELL Support Circle',
    color: '#22d3ee',
    type: 'Support',
    purpose: 'Language scaffolding, vocabulary building, and comprehension',
    lastActive: 'Today',
    nextMeeting: 'Today 12:30 PM',
    avgPerformance: 71,
    trend: 'up',
    completedTasks: 3,
    totalTasks: 5,
    students: [
      { name: 'Noah Williams', initials: 'NW', avg: 68, status: 'at-risk' },
      { name: 'Mia Thompson', initials: 'MT', avg: 74, status: 'on-track' },
    ],
  },
  {
    id: '6',
    name: 'Science Fair Team',
    color: '#8b5cf6',
    type: 'Project',
    purpose: 'Ecosystem impact research project for district science fair',
    lastActive: '4 hours ago',
    nextMeeting: 'Wed 3:00 PM',
    avgPerformance: 89,
    trend: 'up',
    completedTasks: 5,
    totalTasks: 8,
    students: [
      { name: 'Emma Davis', initials: 'ED', avg: 94, status: 'excelling' },
      { name: 'Ava Patel', initials: 'AP', avg: 91, status: 'excelling' },
      { name: 'Ethan Kim', initials: 'EK', avg: 88, status: 'on-track' },
      { name: 'James Brown', initials: 'JB', avg: 79, status: 'on-track' },
      { name: 'Liam Chen', initials: 'LC', avg: 87, status: 'on-track' },
    ],
  },
]

const typeConfig: Record<GroupType, { label: string; bg: string; text: string; icon: React.ElementType; color: string }> = {
  Lab:        { label: 'Lab',        bg: 'bg-accent-500/15',   text: 'text-accent-400',  icon: Zap,           color: '#6366f1' },
  Reading:    { label: 'Reading',    bg: 'bg-success-400/15',  text: 'text-success-400', icon: BookOpen,      color: '#10b981' },
  Support:    { label: 'Support',    bg: 'bg-warning-400/15',  text: 'text-warning-400', icon: Target,        color: '#f59e0b' },
  Project:    { label: 'Project',    bg: 'bg-neon-400/15',     text: 'text-neon-400',    icon: Star,          color: '#22d3ee' },
  Discussion: { label: 'Discussion', bg: 'bg-electric-400/15', text: 'text-electric-400',icon: MessageSquare, color: '#22d3ee' },
}

const statusConfig = {
  excelling:  { bg: 'bg-success-400/15',  text: 'text-success-400',  label: 'Excelling' },
  'on-track': { bg: 'bg-accent-400/15',   text: 'text-accent-400',   label: 'On Track' },
  'at-risk':  { bg: 'bg-danger-400/15',   text: 'text-danger-400',   label: 'At Risk' },
}

const AI_INSIGHTS = [
  {
    color: '#f59e0b',
    icon: AlertTriangle,
    title: 'Math Support Group needs attention',
    desc: '3 students missed last 2 sessions. Consider individual check-ins before next meeting.',
    action: 'View Group',
  },
  {
    color: '#10b981',
    icon: TrendingUp,
    title: 'Science Fair Team trending up',
    desc: 'Average performance increased +7 points this month. Group synergy is strong.',
    action: 'See Progress',
  },
  {
    color: '#6366f1',
    icon: Brain,
    title: 'Optimal regrouping suggestion',
    desc: "Based on recent assessment data, Emma and Noah pairing could boost Noah's engagement.",
    action: 'Review Suggestion',
  },
]

const PERF_TREND = [78, 80, 79, 82, 81, 84, 83, 81]
const TREND_LABELS = ['Jun 17', 'Jun 24', 'Jul 1', 'Jul 8', 'Jul 15', 'Jul 22', 'Jul 29', 'Aug 5']
const TYPE_COLORS: Record<GroupType, string> = { Lab: '#6366f1', Reading: '#10b981', Support: '#f97316', Project: '#8b5cf6', Discussion: '#ec4899' }
const NEW_COLORS = ['#6366f1', '#10b981', '#f97316', '#ec4899', '#8b5cf6', '#22d3ee', '#f59e0b']

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('taleeko_groups')
        if (saved) return JSON.parse(saved)
      } catch {}
    }
    return INITIAL_GROUPS
  })
  const [expandedGroup, setExpandedGroup] = useState<string | null>('1')
  const [filter, setFilter] = useState<'all' | GroupType>('all')
  const [search, setSearch] = useState('')
  const [aiOpen, setAiOpen] = useState(true)
  const [actionMenu, setActionMenu] = useState<string | null>(null)
  const [toastMsg, setToastMsg] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [newType, setNewType] = useState<GroupType>('Lab')
  const [newColor, setNewColor] = useState(NEW_COLORS[0])
  const [deleteTarget, setDeleteTarget] = useState<Group | null>(null)

  const totalStudents = new Set(groups.flatMap(g => g.students.map(s => s.name))).size
  const atRiskGroups = groups.filter(g => g.avgPerformance < 70).length
  const activeToday = groups.filter(g => ['Today', '2 hours ago', '4 hours ago'].includes(g.lastActive)).length

  const showToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 2500)
  }

  const handleCreateGroup = () => {
    if (!newName.trim()) return
    const g: Group = {
      id: `g${Date.now()}`,
      name: newName.trim(),
      color: newColor,
      type: newType,
      purpose: 'New group — add a description',
      lastActive: 'Just now',
      avgPerformance: 0,
      trend: 'stable',
      completedTasks: 0,
      totalTasks: 0,
      students: [],
    }
    setGroups(prev => {
      const next = [g, ...prev]
      try { localStorage.setItem('taleeko_groups', JSON.stringify(next)) } catch {}
      return next
    })
    setNewName('')
    setCreateOpen(false)
    showToast(`Created "${g.name}"`)
  }

  const handleDelete = (group: Group) => {
    setGroups(prev => {
      const next = prev.filter(g => g.id !== group.id)
      try { localStorage.setItem('taleeko_groups', JSON.stringify(next)) } catch {}
      return next
    })
    setDeleteTarget(null)
    showToast(`Deleted "${group.name}"`)
  }

  const filtered = groups.filter(g => {
    const matchType = filter === 'all' || g.type === filter
    const matchSearch = !search || g.name.toLowerCase().includes(search.toLowerCase()) || g.purpose.toLowerCase().includes(search.toLowerCase())
    return matchType && matchSearch
  })

  return (
    <div className="space-y-6">
      {/* Hero */}
      <FadeUp>
        <div className="hero-mesh rounded-3xl p-6 border border-white/[0.06]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <motion.div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                whileHover={{ rotate: 8, scale: 1.08 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <Users className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <h2 className="text-xl font-black text-white">Student Groups</h2>
                <p className="text-xs text-surface-400">{groups.length} groups · {totalStudents} unique students enrolled</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                className="btn-gradient text-xs"
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => showToast('AI Smart Grouping is analyzing your class data…')}
              >
                <Sparkles className="w-3.5 h-3.5" /> AI Smart Group
              </motion.button>
              <button
                className="btn-secondary text-xs px-3 py-1.5"
                onClick={() => showToast('Groups shuffled randomly')}
              >
                <Shuffle className="w-3.5 h-3.5" /> Random
              </button>
              <motion.button
                className="btn-secondary text-xs px-3 py-1.5"
                onClick={() => setCreateOpen(true)}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              >
                <Plus className="w-3.5 h-3.5" /> New Group
              </motion.button>
            </div>
          </div>
        </div>
      </FadeUp>

      {/* Stats */}
      <FadeUp delay={0.04}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Total Groups', value: groups.length, icon: Layers, color: '#6366f1', sub: 'Across all classes' },
            { label: 'Active Today', value: activeToday, icon: CheckCircle, color: '#10b981', sub: 'Meeting or working' },
            { label: 'Need Attention', value: atRiskGroups, icon: AlertTriangle, color: '#f97316', sub: 'Below 70% avg' },
            { label: 'Avg Performance', value: `${Math.round(groups.reduce((a, g) => a + g.avgPerformance, 0) / Math.max(groups.length, 1))}%`, icon: BarChart2, color: '#8b5cf6', sub: 'Across all groups' },
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

      {/* Group Performance Chart */}
      <FadeUp delay={0.06}>
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Group Performance Comparison</h3>
              <p className="text-[10px] text-surface-500 mt-0.5">Average scores across all groups</p>
            </div>
          </div>
          {(() => {
            const W = 560, H = 100, PX = 24, PY = 10
            const barW = Math.min(48, (W - PX * 2 - (groups.length - 1) * 10) / groups.length)
            const gapW = groups.length > 1 ? (W - PX * 2 - barW * groups.length) / (groups.length - 1) : 0
            const maxV = 100
            return (
              <svg viewBox={`0 0 ${W} ${H + 28}`} width="100%" className="overflow-visible" style={{ maxHeight: 148 }}>
                {[60, 70, 80, 90, 100].map(v => {
                  const y = PY + (H - PY * 2) * (1 - v / maxV)
                  return (
                    <g key={v}>
                      <line x1={PX} y1={y} x2={W - PX} y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                      <text x={PX - 4} y={y + 3.5} textAnchor="end" fontSize="8" fill="rgba(255,255,255,0.3)">{v}%</text>
                    </g>
                  )
                })}
                {groups.map((g, i) => {
                  const x = PX + i * (barW + gapW)
                  const barH = ((g.avgPerformance - 55) / (maxV - 55)) * (H - PY * 2)
                  const y = PY + (H - PY * 2) - barH
                  const shortName = g.name.length > 12 ? g.name.slice(0, 12) + '…' : g.name
                  return (
                    <g key={g.id}>
                      <defs>
                        <linearGradient id={`gbar-${g.id}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={g.color} stopOpacity="0.9" />
                          <stop offset="100%" stopColor={g.color} stopOpacity="0.4" />
                        </linearGradient>
                      </defs>
                      <motion.rect
                        x={x} y={y} width={barW} height={barH}
                        fill={`url(#gbar-${g.id})`} rx="5"
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
                        style={{ transformOrigin: `${x + barW / 2}px ${H - PY}px` }}
                      />
                      <text x={x + barW / 2} y={y - 4} textAnchor="middle" fontSize="9" fill={g.color} fontWeight="800">{g.avgPerformance}%</text>
                      <text x={x + barW / 2} y={H + 14} textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.45)">{shortName}</text>
                      <text x={x + barW / 2} y={H + 23} textAnchor="middle" fontSize="7.5" fill="rgba(255,255,255,0.25)">{g.students.length} students</text>
                    </g>
                  )
                })}
              </svg>
            )
          })()}
        </div>
      </FadeUp>

      {/* AI Insights — collapsible */}
      <FadeUp delay={0.07}>
        <div className="glass-card border border-accent-500/15 overflow-hidden">
          <button
            className="w-full flex items-center justify-between p-5 hover:bg-white/[0.02] transition-colors"
            onClick={() => setAiOpen(o => !o)}
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#8b5cf618' }}>
                <Brain className="w-3.5 h-3.5 text-neon-400" />
              </div>
              <span className="text-sm font-bold text-white">AI Group Insights</span>
              <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-neon-400/15 text-neon-400 font-medium">{AI_INSIGHTS.length} insights</span>
            </div>
            <motion.div animate={{ rotate: aiOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
              <ChevronDown className="w-4 h-4 text-surface-500" />
            </motion.div>
          </button>
          <AnimatePresence initial={false}>
            {aiOpen && (
              <motion.div
                key="ai-insights"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="px-5 pb-5 grid grid-cols-1 md:grid-cols-3 gap-3">
                  {AI_INSIGHTS.map((insight, i) => {
                    const Icon = insight.icon
                    return (
                      <motion.div
                        key={i}
                        className="flex gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.1] transition-all group cursor-pointer"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 + i * 0.06 }}
                        whileHover={{ y: -1 }}
                      >
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: insight.color + '20' }}>
                          <Icon className="w-4 h-4" style={{ color: insight.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-white leading-tight mb-1">{insight.title}</p>
                          <p className="text-[11px] text-surface-400 leading-relaxed">{insight.desc}</p>
                          <button
                            className="mt-2 text-[11px] font-medium flex items-center gap-1 group-hover:gap-1.5 transition-all"
                            style={{ color: insight.color }}
                            onClick={() => showToast(insight.action)}
                          >
                            {insight.action} <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </FadeUp>

      {/* Filter + Search */}
      <FadeUp delay={0.1}>
        <div className="flex items-center gap-2 flex-wrap">
          {(['all', 'Lab', 'Reading', 'Support', 'Project', 'Discussion'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                filter === f
                  ? 'bg-white/[0.08] text-white border border-white/[0.12]'
                  : 'text-surface-400 hover:text-surface-200 hover:bg-white/[0.04]'
              }`}
            >
              {f === 'all' ? 'All Groups' : f}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <Search className="w-3 h-3 text-surface-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search groups..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-full bg-white/[0.04] border border-white/[0.08] text-surface-200 placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-accent-500 w-36 transition-all"
              />
            </div>
            <button className="flex items-center gap-1.5 text-xs text-surface-400 hover:text-surface-200 transition-colors">
              <Filter className="w-3.5 h-3.5" /> Sort
            </button>
          </div>
        </div>
      </FadeUp>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((group, i) => {
          const isExpanded = expandedGroup === group.id
          const typeStyle = typeConfig[group.type]
          const TypeIcon = typeStyle.icon
          const progressPct = group.totalTasks > 0 ? Math.round((group.completedTasks / group.totalTasks) * 100) : 0
          const menuOpen = actionMenu === group.id

          return (
            <motion.div
              key={group.id}
              className="glass-card overflow-hidden relative"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 + i * 0.05 }}
            >
              <div className="h-0.5" style={{ backgroundColor: group.color }} />

              <button
                className="w-full p-5 text-left"
                onClick={() => setExpandedGroup(isExpanded ? null : group.id)}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-white">{group.name}</h4>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${typeStyle.bg} ${typeStyle.text}`}>
                        <TypeIcon className="w-2.5 h-2.5" />
                        {typeStyle.label}
                      </span>
                    </div>
                    <p className="text-xs text-surface-500 mt-0.5 leading-relaxed truncate">{group.purpose}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <div className="relative">
                      <button
                        className="p-1.5 rounded-lg hover:bg-white/[0.06] text-surface-500 hover:text-white transition-colors"
                        onClick={e => { e.stopPropagation(); setActionMenu(menuOpen ? null : group.id) }}
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      <AnimatePresence>
                        {menuOpen && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setActionMenu(null)} />
                            <motion.div
                              className="absolute right-0 top-8 z-20 w-44 glass-card py-1 shadow-2xl border border-white/[0.08]"
                              initial={{ opacity: 0, scale: 0.92, y: -4 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.92, y: -4 }}
                              transition={{ duration: 0.15 }}
                            >
                              {[
                                { label: 'Edit Group', icon: Edit3, color: '#6366f1' },
                                { label: 'Add Student', icon: UserPlus, color: '#10b981' },
                                { label: 'Message All', icon: MessageSquare, color: '#f59e0b' },
                                { label: 'Export Roster', icon: Download, color: '#22d3ee' },
                                { label: 'Archive', icon: Archive, color: '#8b5cf6' },
                                { label: 'Delete', icon: Trash2, color: '#ef4444' },
                              ].map(item => (
                                <button
                                  key={item.label}
                                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs text-surface-300 hover:text-white hover:bg-white/[0.05] transition-colors text-left ${item.label === 'Delete' ? 'text-danger-400 hover:text-danger-300 border-t border-white/[0.06] mt-1 pt-2' : ''}`}
                                  onClick={e => {
                                    e.stopPropagation()
                                    setActionMenu(null)
                                    if (item.label === 'Delete') { setDeleteTarget(group) }
                                    else showToast(`${item.label}: ${group.name}`)
                                  }}
                                >
                                  <item.icon className="w-3.5 h-3.5" style={{ color: item.color }} />
                                  {item.label}
                                </button>
                              ))}
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>
                    <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                      <ChevronDown className="w-4 h-4 text-surface-500" />
                    </motion.div>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <div className="flex -space-x-1.5">
                    {group.students.slice(0, 5).map((s, si) => (
                      <div
                        key={s.name}
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[8px] font-bold ring-2 ring-surface-900"
                        style={{ background: `linear-gradient(135deg, ${group.color}, ${group.color}99)`, zIndex: 5 - si }}
                        title={s.name}
                      >
                        {s.initials}
                      </div>
                    ))}
                    {group.students.length > 5 && (
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-surface-400 text-[8px] font-bold bg-white/[0.06] ring-2 ring-surface-900">
                        +{group.students.length - 5}
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-surface-500">{group.students.length} members</span>
                  <div className="ml-auto flex items-center gap-1">
                    <Clock className="w-3 h-3 text-surface-600" />
                    <span className="text-[11px] text-surface-500">{group.lastActive}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-surface-500">Tasks {group.completedTasks}/{group.totalTasks}</span>
                      <span className="text-[10px] font-semibold" style={{ color: group.color }}>{progressPct}%</span>
                    </div>
                    {(() => {
                      const W = 300, H = 6
                      const bw = (progressPct / 100) * W
                      const gid = `grp-prog-${i}`
                      return (
                        <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible">
                          <defs>
                            <linearGradient id={gid} x1="0" x2="1" y1="0" y2="0">
                              <stop offset="0%" stopColor={group.color} />
                              <stop offset="100%" stopColor={group.color + '80'} />
                            </linearGradient>
                          </defs>
                          <rect x={0} y={0} width={W} height={H} rx={3} fill="rgba(255,255,255,0.06)" />
                          <motion.rect
                            x={0} y={0} height={H} rx={3}
                            fill={`url(#${gid})`}
                            initial={{ width: 0 }}
                            animate={{ width: bw }}
                            transition={{ delay: 0.2 + i * 0.04, duration: 0.5 }}
                          />
                        </svg>
                      )
                    })()}
                  </div>
                  <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/[0.04] flex-shrink-0">
                    <span className="text-xs font-black text-white">{group.avgPerformance}%</span>
                    <span className="text-[10px] text-surface-500">avg</span>
                    {group.trend === 'up' && <TrendingUp className="w-3 h-3 text-success-400 ml-0.5" />}
                    {group.trend === 'down' && <TrendingUp className="w-3 h-3 text-danger-400 ml-0.5 rotate-180" />}
                  </div>
                </div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 border-t border-white/[0.05]">
                      <div className="pt-4 space-y-2">
                        {group.students.map((student, si) => {
                          const st = statusConfig[student.status]
                          return (
                            <motion.div
                              key={student.name}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.03] transition-colors"
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: si * 0.04 }}
                            >
                              <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                                style={{ background: `linear-gradient(135deg, ${group.color}, ${group.color}99)` }}
                              >
                                {student.initials}
                              </div>
                              <span className="text-sm text-white flex-1">{student.name}</span>
                              <span className="text-xs font-bold text-white">{student.avg}%</span>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${st.bg} ${st.text}`}>{st.label}</span>
                            </motion.div>
                          )
                        })}
                        {group.students.length === 0 && (
                          <p className="text-xs text-surface-600 text-center py-4">No students yet — add students above</p>
                        )}
                      </div>

                      {group.nextMeeting && (
                        <div className="flex items-center gap-2 mt-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                          <Clock className="w-3.5 h-3.5 text-surface-500" />
                          <span className="text-xs text-surface-400">Next:</span>
                          <span className="text-xs font-semibold text-white">{group.nextMeeting}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/[0.05]">
                        <button className="btn-secondary text-xs px-3 py-1.5" onClick={() => showToast('Add student dialog')}>
                          <UserPlus className="w-3 h-3" /> Add Student
                        </button>
                        <button className="btn-secondary text-xs px-3 py-1.5" onClick={() => showToast('Edit group dialog')}>
                          <Edit3 className="w-3 h-3" /> Edit Group
                        </button>
                        <button className="btn-secondary text-xs px-3 py-1.5" onClick={() => showToast('Message sent to group')}>
                          <MessageSquare className="w-3 h-3" /> Message
                        </button>
                        <button className="btn-secondary text-xs px-3 py-1.5 ml-auto" onClick={() => showToast('Opening analytics')}>
                          <BarChart2 className="w-3 h-3" /> Analytics
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
        {filtered.length === 0 && (
          <div className="lg:col-span-2 glass-card p-12 text-center">
            <Users className="w-8 h-8 text-surface-600 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-surface-300 mb-1">No groups found</h4>
            <p className="text-xs text-surface-500">Try adjusting the filter or search term</p>
          </div>
        )}
      </div>

      {/* Bottom Panels */}
      <FadeInWhenVisible delay={0.2}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Performance Trend */}
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-success-400/15">
                <TrendingUp className="w-3.5 h-3.5 text-success-400" />
              </div>
              <div>
                <span className="text-sm font-bold text-white block">Class Avg Trend</span>
                <span className="text-[10px] text-surface-500">8 weeks</span>
              </div>
            </div>
            {(() => {
              const vals = PERF_TREND
              const W = 300, H = 68, mn = Math.min(...vals), mx = Math.max(...vals)
              const pts = vals.map((v, i) => ({
                x: (i / (vals.length - 1)) * W,
                y: H - ((v - mn) / (mx - mn + 1)) * H * 0.78 - 6
              }))
              let line = `M ${pts[0].x} ${pts[0].y}`
              for (let k = 1; k < pts.length; k++) {
                const cpx = (pts[k].x + pts[k - 1].x) / 2
                line += ` C ${cpx} ${pts[k - 1].y} ${cpx} ${pts[k].y} ${pts[k].x} ${pts[k].y}`
              }
              const area = line + ` L ${W} ${H} L 0 ${H} Z`
              return (
                <svg viewBox={`0 0 ${W} ${H}`} className="w-full mb-2" style={{ height: 68 }}>
                  <defs>
                    <linearGradient id="gr-trend-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <path d={area} fill="url(#gr-trend-grad)" />
                  <motion.path d={line} fill="none" stroke="#10b981" strokeWidth={2}
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ duration: 0.9, ease: 'easeOut' }}
                  />
                  {pts.map((pt, i) => (
                    <circle key={i} cx={pt.x} cy={pt.y} r={i === pts.length - 1 ? 4 : 2.5}
                      fill={i === pts.length - 1 ? '#34d399' : '#10b981'}
                    />
                  ))}
                </svg>
              )
            })()}
            <div className="flex items-center justify-between text-[10px] text-surface-600">
              <span>{TREND_LABELS[0]}</span><span>{TREND_LABELS[TREND_LABELS.length - 1]}</span>
            </div>
            <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between">
              <span className="text-xs text-surface-400">8-week avg</span>
              <span className="text-xs font-bold text-success-400">+{PERF_TREND[PERF_TREND.length - 1] - PERF_TREND[0]}% ↑</span>
            </div>
          </div>

          {/* Top Groups */}
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-warning-400/15">
                <Trophy className="w-3.5 h-3.5 text-warning-400" />
              </div>
              <span className="text-sm font-bold text-white">Top Groups</span>
            </div>
            <div className="space-y-2.5">
              {[...groups].sort((a, b) => b.avgPerformance - a.avgPerformance).slice(0, 4).map((g, i) => (
                <div key={g.id} className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-surface-600 w-4">#{i + 1}</span>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: g.color + '25' }}>
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: g.color }} />
                  </div>
                  <span className="text-xs text-surface-300 flex-1 truncate">{g.name}</span>
                  <span className="text-xs font-bold text-white">{g.avgPerformance}%</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-white/[0.06] space-y-2">
              {(['Lab', 'Reading', 'Support', 'Project', 'Discussion'] as GroupType[]).map(type => {
                const count = groups.filter(g => g.type === type).length
                const pct = Math.round((count / Math.max(groups.length, 1)) * 100)
                return (
                  <div key={type}>
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[10px] text-surface-400">{type}</span>
                      <span className="text-[10px] font-semibold text-white">{count}</span>
                    </div>
                    {(() => {
                      const W = 200, H = 4
                      const bw = (pct / 100) * W
                      const gid = `grp-type-${type.replace(/\s/g, '')}`
                      return (
                        <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible">
                          <defs>
                            <linearGradient id={gid} x1="0" x2="1" y1="0" y2="0">
                              <stop offset="0%" stopColor={TYPE_COLORS[type]} />
                              <stop offset="100%" stopColor={TYPE_COLORS[type] + '80'} />
                            </linearGradient>
                          </defs>
                          <rect x={0} y={0} width={W} height={H} rx={2} fill="rgba(255,255,255,0.06)" />
                          <motion.rect
                            x={0} y={0} height={H} rx={2}
                            fill={`url(#${gid})`}
                            initial={{ width: 0 }}
                            animate={{ width: bw }}
                            transition={{ delay: 0.3, duration: 0.4 }}
                          />
                        </svg>
                      )
                    })()}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-neon-400/15">
                <Zap className="w-3.5 h-3.5 text-neon-400" />
              </div>
              <span className="text-sm font-bold text-white">Quick Actions</span>
            </div>
            <div className="space-y-2">
              {[
                { label: 'Auto-balance by performance', icon: BarChart2, color: '#6366f1' },
                { label: 'Create activity for all groups', icon: BookOpen, color: '#10b981' },
                { label: 'Send group progress report', icon: TrendingUp, color: '#f97316' },
                { label: 'Shuffle all groups randomly', icon: Shuffle, color: '#8b5cf6' },
                { label: 'Export group roster (CSV)', icon: Download, color: '#22d3ee' },
              ].map(action => (
                <motion.button
                  key={action.label}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-surface-300 hover:text-white hover:bg-white/[0.04] transition-all"
                  whileHover={{ x: 2 }}
                  onClick={() => showToast(action.label)}
                >
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: action.color + '15' }}>
                    <action.icon className="w-3 h-3" style={{ color: action.color }} />
                  </div>
                  {action.label}
                  <ChevronRight className="w-3 h-3 ml-auto text-surface-600" />
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </FadeInWhenVisible>

      {/* Create Group Modal */}
      <AnimatePresence>
        {createOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setCreateOpen(false)}
          >
            <motion.div
              className="glass-card p-6 max-w-sm w-full mx-4"
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="text-sm font-bold text-white">New Group</h4>
                </div>
                <button className="p-1.5 rounded-lg hover:bg-white/[0.06] text-surface-500 hover:text-white transition-colors" onClick={() => setCreateOpen(false)}>
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-surface-300 mb-1.5 block">Group Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Lab Partners B"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleCreateGroup()}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white/[0.04] border border-white/[0.08] text-surface-200 placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-accent-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-surface-300 mb-1.5 block">Group Type</label>
                  <div className="flex flex-wrap gap-1.5">
                    {(['Lab', 'Reading', 'Support', 'Project', 'Discussion'] as GroupType[]).map(t => (
                      <button
                        key={t}
                        onClick={() => setNewType(t)}
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                          newType === t ? `${typeConfig[t].bg} ${typeConfig[t].text} ring-1 ring-current` : 'bg-white/[0.04] text-surface-400 hover:text-surface-200'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-surface-300 mb-1.5 block">Color</label>
                  <div className="flex items-center gap-2">
                    {NEW_COLORS.map(c => (
                      <button
                        key={c}
                        onClick={() => setNewColor(c)}
                        className="w-6 h-6 rounded-full transition-transform hover:scale-110"
                        style={{
                          backgroundColor: c,
                          outline: newColor === c ? '2px solid white' : '2px solid transparent',
                          outlineOffset: '2px',
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <button className="flex-1 btn-secondary text-xs py-2" onClick={() => setCreateOpen(false)}>Cancel</button>
                <motion.button
                  className="flex-1 btn-gradient text-xs py-2"
                  onClick={handleCreateGroup}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                >
                  <Plus className="w-3.5 h-3.5" /> Create Group
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setDeleteTarget(null)}
          >
            <motion.div
              className="glass-card p-6 max-w-sm w-full mx-4"
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-danger-400/15 mb-4">
                <Trash2 className="w-5 h-5 text-danger-400" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1">Delete Group?</h4>
              <p className="text-xs text-surface-400 mb-5">
                &ldquo;{deleteTarget.name}&rdquo; and all its settings will be permanently deleted. Students remain in your roster.
              </p>
              <div className="flex gap-2">
                <button className="flex-1 btn-secondary text-xs py-2" onClick={() => setDeleteTarget(null)}>Cancel</button>
                <button
                  className="flex-1 text-xs font-semibold py-2 rounded-xl bg-danger-400/20 text-danger-400 hover:bg-danger-400/30 transition-colors"
                  onClick={() => handleDelete(deleteTarget)}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
