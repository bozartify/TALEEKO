'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ClipboardList, Plus, Sparkles, Search, Filter, Calendar, Clock,
  CheckCircle2, AlertTriangle, Users, Download, ChevronDown,
  BookOpen, FileText, Zap, BarChart2, Eye, Edit3, Copy, Trash2,
  TrendingUp, Star, Brain
} from 'lucide-react'
import { FadeUp, FadeInWhenVisible } from '@/components/ui/motion'

type AssignType = 'all' | 'quiz' | 'essay' | 'lab' | 'project' | 'homework'
type StatusFilter = 'all' | 'active' | 'upcoming' | 'past'

interface Assignment {
  id: string
  title: string
  type: 'quiz' | 'essay' | 'lab' | 'project' | 'homework'
  class: string
  dueDate: string
  dueLabel: string
  status: 'active' | 'upcoming' | 'past'
  submitted: number
  total: number
  avgScore: number | null
  points: number
  color: string
  ai: boolean
}

const assignments: Assignment[] = [
  { id: '1', title: 'Lab Report: Photosynthesis', type: 'lab', class: 'AP Biology', dueDate: '2026-08-02', dueLabel: 'Today', status: 'active', submitted: 22, total: 28, avgScore: null, points: 75, color: '#8b5cf6', ai: true },
  { id: '2', title: 'Essay: The Great Gatsby Ch. 5', type: 'essay', class: '10th English', dueDate: '2026-08-03', dueLabel: 'Tomorrow', status: 'upcoming', submitted: 0, total: 24, avgScore: null, points: 100, color: '#f43f5e', ai: true },
  { id: '3', title: 'Ch. 5 Quiz: Cell Division', type: 'quiz', class: 'AP Biology', dueDate: '2026-08-05', dueLabel: 'In 4 days', status: 'upcoming', submitted: 0, total: 28, avgScore: null, points: 50, color: '#f97316', ai: true },
  { id: '4', title: 'Algebra Chapter 6 Homework', type: 'homework', class: 'Algebra II', dueDate: '2026-07-28', dueLabel: 'Jul 28', status: 'past', submitted: 25, total: 25, avgScore: 87, points: 20, color: '#14b8a6', ai: false },
  { id: '5', title: 'Midterm Exam', type: 'quiz', class: 'AP Biology', dueDate: '2026-07-18', dueLabel: 'Jul 18', status: 'past', submitted: 28, total: 28, avgScore: 83, points: 200, color: '#6366f1', ai: false },
  { id: '6', title: 'Group Presentation: American Revolution', type: 'project', class: '8th History', dueDate: '2026-07-25', dueLabel: 'Jul 25', status: 'past', submitted: 22, total: 24, avgScore: 91, points: 100, color: '#f59e0b', ai: true },
  { id: '7', title: 'Shakespeare Scene Analysis', type: 'essay', class: '10th English', dueDate: '2026-08-10', dueLabel: 'Aug 10', status: 'upcoming', submitted: 0, total: 24, avgScore: null, points: 75, color: '#ec4899', ai: true },
  { id: '8', title: 'Science Fair Research Proposal', type: 'project', class: 'AP Biology', dueDate: '2026-08-15', dueLabel: 'Aug 15', status: 'upcoming', submitted: 0, total: 28, avgScore: null, points: 50, color: '#0891b2', ai: false },
]

const typeConfig = {
  quiz:     { label: 'Quiz',     icon: ClipboardList, color: '#f97316', bg: 'bg-warning-500/15 text-warning-400' },
  essay:    { label: 'Essay',    icon: FileText,      color: '#f43f5e', bg: 'bg-danger-500/15 text-danger-400' },
  lab:      { label: 'Lab',      icon: BookOpen,      color: '#8b5cf6', bg: 'bg-accent-500/15 text-accent-400' },
  project:  { label: 'Project',  icon: Star,          color: '#f59e0b', bg: 'bg-warning-500/15 text-warning-400' },
  homework: { label: 'HW',       icon: Zap,           color: '#14b8a6', bg: 'bg-success-500/15 text-success-400' },
}

export default function AssignmentsPage() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<AssignType>('all')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = assignments.filter(a => {
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.class.toLowerCase().includes(search.toLowerCase())
    const matchType = typeFilter === 'all' || a.type === typeFilter
    const matchStatus = statusFilter === 'all' || a.status === statusFilter
    return matchSearch && matchType && matchStatus
  })

  const active = assignments.filter(a => a.status === 'active').length
  const upcoming = assignments.filter(a => a.status === 'upcoming').length
  const totalSubmitted = assignments.reduce((acc, a) => acc + a.submitted, 0)
  const completedWithScore = assignments.filter(a => a.avgScore !== null)
  const overallAvg = completedWithScore.length
    ? Math.round(completedWithScore.reduce((acc, a) => acc + (a.avgScore ?? 0), 0) / completedWithScore.length)
    : 0

  return (
    <div className="space-y-6">
      <FadeUp>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
              whileHover={{ rotate: 8, scale: 1.08 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <ClipboardList className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h2 className="text-xl font-black text-white">Assignments</h2>
              <p className="text-xs text-surface-400">{assignments.length} total · {active} active · {upcoming} upcoming</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.button className="btn-gradient text-xs" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Sparkles className="w-3.5 h-3.5" /> AI Create
            </motion.button>
            <button className="btn-secondary text-xs px-3 py-1.5">
              <Calendar className="w-3.5 h-3.5" /> Schedule
            </button>
            <button className="btn-secondary text-xs px-3 py-1.5">
              <Plus className="w-3.5 h-3.5" /> New
            </button>
          </div>
        </div>
      </FadeUp>

      {/* Stat Cards */}
      <FadeUp delay={0.05}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Total', value: assignments.length, icon: ClipboardList, color: '#6366f1', sub: 'this semester' },
            { label: 'Active', value: active, icon: Clock, color: '#f97316', sub: 'in progress' },
            { label: 'Submitted', value: totalSubmitted, icon: CheckCircle2, color: '#10b981', sub: 'across all classes' },
            { label: 'Class Avg', value: `${overallAvg}%`, icon: BarChart2, color: '#22d3ee', sub: 'graded work' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="glass-card p-4"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
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

      {/* AI reminder */}
      <FadeUp delay={0.08}>
        <div className="glass-card p-4 border border-warning-500/20">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)' }}>
              <AlertTriangle className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-white">Submission Alert</span>
                <span className="text-[10px] bg-warning-400/15 text-warning-400 px-1.5 py-0.5 rounded-md font-bold">6 missing</span>
              </div>
              <p className="text-xs text-surface-400">"Lab Report: Photosynthesis" is due today — 6 students haven't submitted yet. Consider sending an automated reminder to their parents.</p>
              <div className="flex items-center gap-2 mt-2">
                <button className="text-xs text-warning-400 hover:text-warning-300 font-semibold transition-colors">Send Reminder</button>
                <span className="text-surface-600">·</span>
                <button className="text-xs text-surface-500 hover:text-surface-300 transition-colors">View Students</button>
              </div>
            </div>
          </div>
        </div>
      </FadeUp>

      {/* Filters */}
      <FadeUp delay={0.1}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-surface-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search assignments..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 text-xs rounded-full bg-white/[0.04] border border-white/[0.08] text-surface-200 placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-accent-500/40 w-full"
            />
          </div>
          <div className="flex items-center gap-1 flex-wrap">
            {(['all', 'active', 'upcoming', 'past'] as const).map(f => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all capitalize ${statusFilter === f ? 'bg-white/[0.08] text-white' : 'text-surface-400 hover:text-surface-200 hover:bg-white/[0.04]'}`}
              >
                {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 flex-wrap">
            {(['all', 'quiz', 'essay', 'lab', 'project', 'homework'] as const).map(f => (
              <button
                key={f}
                onClick={() => setTypeFilter(f)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all capitalize ${typeFilter === f ? 'bg-white/[0.08] text-white' : 'text-surface-400 hover:text-surface-200 hover:bg-white/[0.04]'}`}
              >
                {f === 'all' ? 'All Types' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </FadeUp>

      {/* Assignment list */}
      <div className="space-y-3">
        {filtered.map((assignment, i) => {
          const type = typeConfig[assignment.type]
          const isExpanded = expandedId === assignment.id
          const submittedPct = Math.round((assignment.submitted / assignment.total) * 100)
          return (
            <motion.div
              key={assignment.id}
              className="glass-card overflow-hidden"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 + i * 0.04 }}
            >
              <button
                className="w-full flex items-center gap-4 p-5 text-left"
                onClick={() => setExpandedId(isExpanded ? null : assignment.id)}
              >
                <div className="w-1 h-10 rounded-full flex-shrink-0" style={{ backgroundColor: assignment.color }} />

                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: assignment.color + '18' }}>
                  <type.icon className="w-4 h-4" style={{ color: assignment.color }} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-sm font-bold text-white truncate">{assignment.title}</span>
                    {assignment.ai && <span className="text-[9px] bg-accent-500/15 text-accent-400 px-1.5 py-0.5 rounded font-bold flex-shrink-0">AI</span>}
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold flex-shrink-0 ${type.bg}`}>{type.label}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-surface-500">
                    <span>{assignment.class}</span>
                    <span className="flex items-center gap-0.5"><Calendar className="w-2.5 h-2.5" />{assignment.dueLabel}</span>
                    <span className="flex items-center gap-0.5"><Users className="w-2.5 h-2.5" />{assignment.submitted}/{assignment.total} submitted</span>
                  </div>
                </div>

                <div className="w-24 flex-shrink-0">
                  <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden mb-1">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: submittedPct === 100 ? '#10b981' : assignment.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${submittedPct}%` }}
                      transition={{ delay: 0.2, duration: 0.6 }}
                    />
                  </div>
                  {assignment.avgScore !== null ? (
                    <p className="text-[10px] text-right font-bold" style={{ color: assignment.avgScore >= 80 ? '#10b981' : '#f59e0b' }}>Avg: {assignment.avgScore}%</p>
                  ) : (
                    <p className="text-[10px] text-right text-surface-500">{submittedPct}% in</p>
                  )}
                </div>

                <div className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                  assignment.status === 'active' ? 'bg-warning-500/15 text-warning-400' :
                  assignment.status === 'upcoming' ? 'bg-accent-500/15 text-accent-400' :
                  'bg-success-500/15 text-success-400'
                }`}>
                  {assignment.status === 'active' ? 'Due Today' : assignment.status === 'upcoming' ? 'Upcoming' : 'Complete'}
                </div>

                <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                  <ChevronDown className="w-4 h-4 text-surface-500" />
                </motion.div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 border-t border-white/[0.06]">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 mb-4">
                        {[
                          { label: 'Points', value: assignment.points, color: assignment.color },
                          { label: 'Submitted', value: `${assignment.submitted}/${assignment.total}`, color: '#10b981' },
                          { label: 'Due', value: assignment.dueLabel, color: '#f59e0b' },
                          { label: 'Avg Score', value: assignment.avgScore ? `${assignment.avgScore}%` : '—', color: '#22d3ee' },
                        ].map(stat => (
                          <div key={stat.label} className="p-2.5 rounded-xl bg-white/[0.03] text-center">
                            <p className="text-sm font-black" style={{ color: stat.color }}>{stat.value}</p>
                            <p className="text-[9px] text-surface-500">{stat.label}</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="btn-secondary text-xs px-3 py-1.5"><Eye className="w-3 h-3" /> View Submissions</button>
                        <button className="btn-secondary text-xs px-3 py-1.5"><Edit3 className="w-3 h-3" /> Edit</button>
                        <button className="btn-secondary text-xs px-3 py-1.5"><Copy className="w-3 h-3" /> Duplicate</button>
                        <button className="btn-secondary text-xs px-3 py-1.5"><BarChart2 className="w-3 h-3" /> Results</button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
