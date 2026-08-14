'use client'
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ClipboardList, Plus, Sparkles, Search, Filter, Calendar, Clock,
  CheckCircle2, AlertTriangle, Users, Download, ChevronDown,
  BookOpen, FileText, Zap, BarChart2, Eye, Edit3, Copy, Trash2,
  TrendingUp, Star, Brain, X, Check, MessageSquare, Bell,
  ArrowRight, Target, Percent, ChevronRight, CheckCircle,
  Award, BookMarked, Flag, Lock, Layers, PenTool, RefreshCw,
  MoreHorizontal, Archive, Share2
} from 'lucide-react'
import { FadeUp, FadeInWhenVisible } from '@/components/ui/motion'

type AssignType = 'all' | 'quiz' | 'essay' | 'lab' | 'project' | 'homework'
type StatusFilter = 'all' | 'active' | 'upcoming' | 'past'

interface RubricCriterion {
  label: string
  pts: number
  desc: string
}

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
  instructions: string
  rubric: RubricCriterion[]
  tags: string[]
}

const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: '1', title: 'Lab Report: Photosynthesis', type: 'lab', class: 'AP Biology',
    dueDate: '2026-08-02', dueLabel: 'Today', status: 'active', submitted: 22, total: 28,
    avgScore: null, points: 75, color: '#8b5cf6', ai: true,
    instructions: 'Write a formal lab report documenting your photosynthesis experiment. Include hypothesis, materials, methods, data analysis, and conclusion.',
    rubric: [
      { label: 'Hypothesis & Background', pts: 15, desc: 'Clear, testable hypothesis with scientific reasoning' },
      { label: 'Methods & Materials', pts: 15, desc: 'Detailed, reproducible procedure with all materials listed' },
      { label: 'Data & Analysis', pts: 25, desc: 'Complete data table, graphs, and quantitative analysis' },
      { label: 'Conclusion & Discussion', pts: 15, desc: 'Connects results to hypothesis, discusses sources of error' },
      { label: 'Format & Citation', pts: 5, desc: 'APA format, no grammatical errors, proper citations' },
    ],
    tags: ['Biology', 'Lab', 'NGSS', 'Writing'],
  },
  {
    id: '2', title: 'Essay: The Great Gatsby Ch. 5', type: 'essay', class: '10th English',
    dueDate: '2026-08-03', dueLabel: 'Tomorrow', status: 'upcoming', submitted: 0, total: 24,
    avgScore: null, points: 100, color: '#f43f5e', ai: true,
    instructions: "Analyze the symbolism of the green light in Chapter 5. Cite at least 3 textual examples and connect to Fitzgerald's broader themes.",
    rubric: [
      { label: 'Thesis & Argument', pts: 25, desc: 'Clear, arguable thesis with logical structure' },
      { label: 'Textual Evidence', pts: 30, desc: 'At least 3 embedded quotes with analysis' },
      { label: 'Literary Analysis', pts: 25, desc: 'Connects symbol to theme with insight' },
      { label: 'Writing Mechanics', pts: 20, desc: 'Grammar, syntax, and paragraph structure' },
    ],
    tags: ['English', 'Literature', 'CCSS', 'Analysis'],
  },
  {
    id: '3', title: 'Ch. 5 Quiz: Cell Division', type: 'quiz', class: 'AP Biology',
    dueDate: '2026-08-05', dueLabel: 'In 4 days', status: 'upcoming', submitted: 0, total: 28,
    avgScore: null, points: 50, color: '#f97316', ai: true,
    instructions: '25 multiple choice questions on mitosis, meiosis, and the cell cycle. Open for 45 minutes.',
    rubric: [
      { label: 'Conceptual Knowledge', pts: 30, desc: 'Understanding of mitosis and meiosis stages' },
      { label: 'Application', pts: 20, desc: 'Apply cell cycle knowledge to scenarios' },
    ],
    tags: ['Biology', 'Quiz', 'Cell Cycle', 'NGSS'],
  },
  {
    id: '4', title: 'Algebra Chapter 6 Homework', type: 'homework', class: 'Algebra II',
    dueDate: '2026-07-28', dueLabel: 'Jul 28', status: 'past', submitted: 25, total: 25,
    avgScore: 87, points: 20, color: '#14b8a6', ai: false,
    instructions: 'Complete problems 1-20 from Chapter 6. Show all work. Check answers with the back of the book.',
    rubric: [
      { label: 'Completion', pts: 10, desc: 'All 20 problems attempted' },
      { label: 'Accuracy', pts: 10, desc: 'Correct answers with work shown' },
    ],
    tags: ['Math', 'Algebra', 'Homework'],
  },
  {
    id: '5', title: 'Midterm Exam', type: 'quiz', class: 'AP Biology',
    dueDate: '2026-07-18', dueLabel: 'Jul 18', status: 'past', submitted: 28, total: 28,
    avgScore: 83, points: 200, color: '#6366f1', ai: false,
    instructions: '80-question exam covering Units 1-2. 90 minutes. Calculator allowed.',
    rubric: [
      { label: 'Multiple Choice (60 pts)', pts: 60, desc: '1.5 pts each × 40 questions' },
      { label: 'Free Response (140 pts)', pts: 140, desc: '4 essay questions, 35 pts each' },
    ],
    tags: ['Biology', 'Exam', 'Summative'],
  },
  {
    id: '6', title: 'Group Presentation: American Revolution', type: 'project', class: '8th History',
    dueDate: '2026-07-25', dueLabel: 'Jul 25', status: 'past', submitted: 22, total: 24,
    avgScore: 91, points: 100, color: '#f59e0b', ai: true,
    instructions: 'Create a 10-minute presentation on an assigned Revolutionary War battle or figure. Include primary sources.',
    rubric: [
      { label: 'Research & Content', pts: 35, desc: 'Accurate, well-researched information with primary sources' },
      { label: 'Presentation Skills', pts: 25, desc: 'Clear delivery, eye contact, pacing' },
      { label: 'Visual Design', pts: 20, desc: 'Professional slides, maps, or visual aids' },
      { label: 'Teamwork', pts: 20, desc: 'Equal participation from all group members' },
    ],
    tags: ['History', 'Presentation', 'Group Work', 'Research'],
  },
  {
    id: '7', title: 'Shakespeare Scene Analysis', type: 'essay', class: '10th English',
    dueDate: '2026-08-10', dueLabel: 'Aug 10', status: 'upcoming', submitted: 0, total: 24,
    avgScore: null, points: 75, color: '#ec4899', ai: true,
    instructions: 'Select one scene from Romeo & Juliet Acts 1-3 and analyze how Shakespeare uses language to develop character.',
    rubric: [
      { label: 'Scene Selection & Rationale', pts: 15, desc: 'Strong justification for scene chosen' },
      { label: 'Language Analysis', pts: 35, desc: 'Specific analysis of diction, imagery, tone' },
      { label: 'Character Development', pts: 15, desc: 'Connects language to character growth/arc' },
      { label: 'Writing Quality', pts: 10, desc: 'Clear, error-free, academic prose' },
    ],
    tags: ['English', 'Shakespeare', 'Analysis', 'CCSS'],
  },
  {
    id: '8', title: 'Science Fair Research Proposal', type: 'project', class: 'AP Biology',
    dueDate: '2026-08-15', dueLabel: 'Aug 15', status: 'upcoming', submitted: 0, total: 28,
    avgScore: null, points: 50, color: '#0891b2', ai: false,
    instructions: 'Submit a 1-page research proposal for the October Science Fair. Include research question, hypothesis, materials, and safety considerations.',
    rubric: [
      { label: 'Research Question', pts: 15, desc: 'Specific, testable, and scientifically interesting' },
      { label: 'Hypothesis', pts: 10, desc: 'If-then format with scientific reasoning' },
      { label: 'Methods & Safety', pts: 15, desc: 'Feasible with proper safety protocol' },
      { label: 'Format & Clarity', pts: 10, desc: 'Well-organized, one page, no major errors' },
    ],
    tags: ['Biology', 'Research', 'Science Fair', 'Writing'],
  },
]

const typeConfig = {
  quiz:     { label: 'Quiz',    icon: ClipboardList, color: '#f97316', bg: 'bg-warning-500/15 text-warning-400' },
  essay:    { label: 'Essay',   icon: FileText,      color: '#f43f5e', bg: 'bg-danger-500/15 text-danger-400' },
  lab:      { label: 'Lab',     icon: BookOpen,      color: '#8b5cf6', bg: 'bg-accent-500/15 text-accent-400' },
  project:  { label: 'Project', icon: Award,         color: '#f59e0b', bg: 'bg-warning-500/15 text-warning-400' },
  homework: { label: 'HW',      icon: BookMarked,    color: '#14b8a6', bg: 'bg-success-500/15 text-success-400' },
}

const AI_SUGGESTIONS = [
  { title: 'Differentiate Lab Report', desc: 'Generate 3 reading-level variants of the lab instructions for struggling readers.', color: '#8b5cf6' },
  { title: 'Make-up Policy Alert', desc: "6 students haven't submitted the Photosynthesis Lab. Consider auto-sending a reminder today.", color: '#f59e0b' },
  { title: 'Similar Assignment Found', desc: 'Shakespeare Scene Analysis is similar to last year\'s Character Analysis — import rubric?', color: '#14b8a6' },
]

const SCORE_TREND = [78, 81, 80, 85, 83, 87, 89, 88]
const TREND_LABELS = ['Jun 17', 'Jun 24', 'Jul 1', 'Jul 8', 'Jul 15', 'Jul 22', 'Jul 29', 'Aug 5']

const TYPE_COLORS: Record<string, string> = {
  quiz: '#f97316', essay: '#f43f5e', lab: '#8b5cf6', project: '#f59e0b', homework: '#14b8a6',
}

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>(INITIAL_ASSIGNMENTS)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<AssignType>('all')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [showRubric, setShowRubric] = useState<string | null>(null)
  const [classFilter, setClassFilter] = useState('all')
  const [aiOpen, setAiOpen] = useState(true)
  const [actionMenu, setActionMenu] = useState<string | null>(null)
  const [toastMsg, setToastMsg] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Assignment | null>(null)
  const [newTitle, setNewTitle] = useState('')
  const [newType, setNewType] = useState<'quiz' | 'essay' | 'lab' | 'project' | 'homework'>('quiz')
  const [newClass, setNewClass] = useState('AP Biology')
  const [newPoints, setNewPoints] = useState('50')

  const classes = ['all', ...Array.from(new Set(assignments.map(a => a.class)))]

  const showToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 2500)
  }

  const filtered = useMemo(() => assignments.filter(a => {
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.class.toLowerCase().includes(search.toLowerCase())
    const matchType = typeFilter === 'all' || a.type === typeFilter
    const matchStatus = statusFilter === 'all' || a.status === statusFilter
    const matchClass = classFilter === 'all' || a.class === classFilter
    return matchSearch && matchType && matchStatus && matchClass
  }), [assignments, search, typeFilter, statusFilter, classFilter])

  const active = assignments.filter(a => a.status === 'active').length
  const upcoming = assignments.filter(a => a.status === 'upcoming').length
  const totalSubmitted = assignments.reduce((acc, a) => acc + a.submitted, 0)
  const totalSlots = assignments.reduce((acc, a) => acc + a.total, 0)
  const completedWithScore = assignments.filter(a => a.avgScore !== null)
  const overallAvg = completedWithScore.length
    ? Math.round(completedWithScore.reduce((acc, a) => acc + (a.avgScore ?? 0), 0) / completedWithScore.length)
    : 0
  const aiCount = assignments.filter(a => a.ai).length
  const missingTotal = assignments.filter(a => a.status === 'active').reduce((acc, a) => acc + (a.total - a.submitted), 0)

  const selectedRubric = showRubric ? assignments.find(a => a.id === showRubric) : null

  const handleCreateAssignment = () => {
    if (!newTitle.trim()) return
    const colors = ['#6366f1', '#10b981', '#f97316', '#ec4899', '#8b5cf6']
    const a: Assignment = {
      id: `a${Date.now()}`,
      title: newTitle.trim(),
      type: newType,
      class: newClass,
      dueDate: '',
      dueLabel: 'TBD',
      status: 'upcoming',
      submitted: 0,
      total: 0,
      avgScore: null,
      points: parseInt(newPoints) || 50,
      color: colors[Math.floor(Math.random() * colors.length)],
      ai: false,
      instructions: '',
      rubric: [],
      tags: [],
    }
    setAssignments(prev => [a, ...prev])
    setNewTitle('')
    setCreateOpen(false)
    showToast(`Created "${a.title}"`)
  }

  const handleDelete = (a: Assignment) => {
    setAssignments(prev => prev.filter(x => x.id !== a.id))
    setDeleteTarget(null)
    showToast(`Deleted "${a.title}"`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <FadeUp>
        <div className="hero-mesh rounded-3xl p-6 border border-white/[0.06]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <motion.div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
                whileHover={{ rotate: 8, scale: 1.08 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <ClipboardList className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <h2 className="text-xl font-black text-white">Assignments</h2>
                <p className="text-xs text-surface-400">{assignments.length} total · {active} active · {upcoming} upcoming · {aiCount} AI-generated</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <motion.button
                className="btn-gradient text-xs"
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => showToast('AI Create launched')}
              >
                <Sparkles className="w-3.5 h-3.5" /> AI Create
              </motion.button>
              <button className="btn-secondary text-xs px-3 py-1.5" onClick={() => showToast('Schedule view opened')}><Calendar className="w-3.5 h-3.5" /> Schedule</button>
              <button className="btn-secondary text-xs px-3 py-1.5" onClick={() => showToast('Exporting assignments…')}><Download className="w-3.5 h-3.5" /> Export</button>
              <motion.button
                className="btn-secondary text-xs px-3 py-1.5"
                onClick={() => setCreateOpen(true)}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              >
                <Plus className="w-3.5 h-3.5" /> New
              </motion.button>
            </div>
          </div>
        </div>
      </FadeUp>

      {/* Stat cards */}
      <FadeUp delay={0.05}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Total Assignments', value: assignments.length.toString(), sub: `${aiCount} AI-generated`, icon: ClipboardList, color: '#6366f1' },
            { label: 'Active Now', value: active.toString(), sub: `${missingTotal} missing submissions`, icon: Clock, color: '#f97316' },
            { label: 'Submission Rate', value: `${totalSlots > 0 ? Math.round((totalSubmitted / totalSlots) * 100) : 0}%`, sub: `${totalSubmitted}/${totalSlots} submitted`, icon: CheckCircle2, color: '#10b981' },
            { label: 'Class Average', value: `${overallAvg}%`, sub: 'graded assignments', icon: BarChart2, color: '#22d3ee' },
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
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: stat.color + '20' }}>
                  <stat.icon className="w-3.5 h-3.5" style={{ color: stat.color }} />
                </div>
                <span className="text-xs text-surface-400">{stat.label}</span>
              </div>
              <p className="text-2xl font-black text-white">{stat.value}</p>
              <p className="text-[10px] text-surface-500 mt-0.5">{stat.sub}</p>
            </motion.div>
          ))}
        </div>
      </FadeUp>

      {/* Submission Rate Chart */}
      <FadeUp delay={0.06}>
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Submission Progress</h3>
              <p className="text-[10px] text-surface-500 mt-0.5">Active & recent assignments</p>
            </div>
            <span className="text-xs text-accent-400 font-semibold">
              {Math.round(INITIAL_ASSIGNMENTS.filter(a => a.status !== 'upcoming').reduce((acc, a) => acc + (a.submitted / (a.total || 1)), 0) / Math.max(INITIAL_ASSIGNMENTS.filter(a => a.status !== 'upcoming').length, 1) * 100)}% avg submission rate
            </span>
          </div>
          {(() => {
            const items = INITIAL_ASSIGNMENTS.filter(a => a.status !== 'upcoming').slice(0, 6)
            const W = 560, H = 120, PX = 28, PY = 12
            const barW = 56, gap = (W - PX * 2 - barW * items.length) / Math.max(items.length - 1, 1)
            return (
              <svg viewBox={`0 0 ${W} ${H + 28}`} width="100%" className="overflow-visible" style={{ maxHeight: 170 }}>
                {[25, 50, 75, 100].map(v => {
                  const y = PY + (H - PY * 2) * (1 - v / 100)
                  return (
                    <g key={v}>
                      <line x1={PX} y1={y} x2={W - PX} y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                      <text x={PX - 4} y={y + 3.5} textAnchor="end" fontSize="8" fill="rgba(255,255,255,0.3)">{v}%</text>
                    </g>
                  )
                })}
                {items.map((a, i) => {
                  const pct = Math.round((a.submitted / (a.total || 1)) * 100)
                  const color = pct >= 80 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444'
                  const x = PX + i * (barW + gap)
                  const barH = (pct / 100) * (H - PY * 2)
                  const y = PY + (H - PY * 2) - barH
                  const shortTitle = a.title.length > 10 ? a.title.slice(0, 10) + '…' : a.title
                  return (
                    <g key={a.id}>
                      <motion.rect
                        x={x} y={y} width={barW} height={barH}
                        rx="5"
                        style={{ fill: color + '40' }}
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 + i * 0.07 }}
                        className="origin-bottom"
                      />
                      <motion.rect
                        x={x} y={y} width={barW} height={5}
                        rx="2"
                        fill={color}
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 + i * 0.07 }}
                      />
                      <text x={x + barW / 2} y={y - 5} textAnchor="middle" fontSize="9" fill={color} fontWeight="700">{pct}%</text>
                      <text x={x + barW / 2} y={H + 14} textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.4)">{shortTitle}</text>
                      <text x={x + barW / 2} y={H + 23} textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.25)">{a.submitted}/{a.total}</text>
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
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#6366f1,#a78bfa)' }}>
                <Brain className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-bold text-white">AI Assignment Insights</span>
              <span className="text-[10px] bg-accent-500/15 text-accent-400 px-1.5 py-0.5 rounded-full font-bold">{AI_SUGGESTIONS.length}</span>
            </div>
            <motion.div animate={{ rotate: aiOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
              <ChevronDown className="w-4 h-4 text-surface-500" />
            </motion.div>
          </button>
          <AnimatePresence initial={false}>
            {aiOpen && (
              <motion.div
                key="ai"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="px-5 pb-5 grid grid-cols-1 md:grid-cols-3 gap-3">
                  {AI_SUGGESTIONS.map((s, i) => (
                    <motion.div
                      key={s.title}
                      className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] transition-colors cursor-pointer"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07 }}
                      whileHover={{ x: 2 }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full mb-2" style={{ backgroundColor: s.color }} />
                      <p className="text-xs font-bold text-white mb-1">{s.title}</p>
                      <p className="text-[10px] text-surface-400 leading-relaxed">{s.desc}</p>
                      <button
                        className="text-[10px] font-semibold mt-2 flex items-center gap-1"
                        style={{ color: s.color }}
                        onClick={() => showToast(`Taking action: ${s.title}`)}
                      >
                        Take Action <ArrowRight className="w-2.5 h-2.5" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </FadeUp>

      {/* Filters */}
      <FadeUp delay={0.1}>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-xs">
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
              {(['all', 'active', 'upcoming', 'past'] as StatusFilter[]).map(f => (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all capitalize ${
                    statusFilter === f ? 'bg-white/[0.08] text-white' : 'text-surface-400 hover:text-surface-200'
                  }`}
                >
                  {f === 'all' ? 'All Status' : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {(['all', 'quiz', 'essay', 'lab', 'project', 'homework'] as AssignType[]).map(f => (
              <button
                key={f}
                onClick={() => setTypeFilter(f)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  typeFilter === f ? 'bg-white/[0.08] text-white' : 'text-surface-400 hover:text-surface-200'
                }`}
              >
                {f !== 'all' && <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: typeConfig[f].color }} />}
                {f === 'all' ? 'All Types' : typeConfig[f].label}
              </button>
            ))}
            <div className="h-4 w-px bg-white/[0.08]" />
            {classes.map(c => (
              <button
                key={c}
                onClick={() => setClassFilter(c)}
                className={`px-2.5 py-1 rounded-full text-[10px] transition-all ${
                  classFilter === c ? 'bg-white/[0.08] text-white' : 'text-surface-500 hover:text-surface-300'
                }`}
              >
                {c === 'all' ? 'All Classes' : c}
              </button>
            ))}
          </div>
        </div>
      </FadeUp>

      <div className="flex items-center justify-between">
        <span className="text-xs text-surface-500">{filtered.length} assignment{filtered.length !== 1 ? 's' : ''} shown</span>
        <button className="btn-secondary text-xs px-3 py-1.5" onClick={() => showToast('Advanced filter opened')}>
          <Filter className="w-3 h-3" /> Advanced Filter
        </button>
      </div>

      {/* Assignment list */}
      <div className="space-y-3">
        <AnimatePresence>
          {filtered.map((assignment, i) => {
            const type = typeConfig[assignment.type]
            const isExpanded = expandedId === assignment.id
            const submittedPct = assignment.total > 0 ? Math.round((assignment.submitted / assignment.total) * 100) : 0
            const missingCount = assignment.total - assignment.submitted
            const menuOpen = actionMenu === assignment.id

            return (
              <motion.div
                key={assignment.id}
                className="glass-card overflow-visible"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ delay: 0.05 + i * 0.04 }}
              >
                <div
                  className="flex items-center gap-4 p-5 cursor-pointer hover:bg-white/[0.02] transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : assignment.id)}
                >
                  <div className="w-1.5 h-12 rounded-full flex-shrink-0" style={{ backgroundColor: assignment.color }} />
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: assignment.color + '18' }}>
                    <type.icon className="w-5 h-5" style={{ color: assignment.color }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-sm font-black text-white truncate">{assignment.title}</span>
                      {assignment.ai && (
                        <span className="text-[9px] bg-accent-500/15 text-accent-400 px-1.5 py-0.5 rounded font-bold flex-shrink-0">AI</span>
                      )}
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold flex-shrink-0 ${type.bg}`}>{type.label}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-surface-500 flex-wrap">
                      <span>{assignment.class}</span>
                      <span className="flex items-center gap-0.5"><Calendar className="w-2.5 h-2.5" />{assignment.dueLabel}</span>
                      <span className="flex items-center gap-0.5"><Users className="w-2.5 h-2.5" />{assignment.submitted}/{assignment.total} submitted</span>
                      <span className="flex items-center gap-0.5"><Target className="w-2.5 h-2.5" />{assignment.points} pts</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {assignment.tags.map(tag => (
                        <span key={tag} className="text-[9px] px-1.5 py-0.5 bg-white/[0.04] text-surface-500 rounded">{tag}</span>
                      ))}
                    </div>
                  </div>

                  <div className="w-28 flex-shrink-0">
                    <div className="flex items-center justify-between mb-1 text-[10px]">
                      <span className="text-surface-500">{submittedPct}% in</span>
                      {missingCount > 0 && assignment.status === 'active' && (
                        <span className="text-warning-400 font-bold">{missingCount} missing</span>
                      )}
                    </div>
                    <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: submittedPct === 100 ? '#10b981' : assignment.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${submittedPct}%` }}
                        transition={{ delay: 0.2 + i * 0.03, duration: 0.6 }}
                      />
                    </div>
                    {assignment.avgScore !== null && (
                      <p className="text-[10px] text-right font-bold mt-1" style={{ color: assignment.avgScore >= 80 ? '#10b981' : '#f59e0b' }}>
                        Avg: {assignment.avgScore}%
                      </p>
                    )}
                  </div>

                  <div className={`text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0 ${
                    assignment.status === 'active' ? 'bg-warning-500/15 text-warning-400' :
                    assignment.status === 'upcoming' ? 'bg-accent-500/15 text-accent-400' :
                    'bg-success-500/15 text-success-400'
                  }`}>
                    {assignment.status === 'active' ? 'Active' : assignment.status === 'upcoming' ? 'Upcoming' : 'Complete'}
                  </div>

                  {/* Action menu */}
                  <div className="relative flex-shrink-0" onClick={e => e.stopPropagation()}>
                    <button
                      className="p-1.5 rounded-lg hover:bg-white/[0.06] text-surface-500 hover:text-white transition-colors"
                      onClick={() => setActionMenu(menuOpen ? null : assignment.id)}
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
                              { label: 'View Submissions', icon: Eye, color: '#6366f1' },
                              { label: 'Edit Assignment', icon: Edit3, color: '#10b981' },
                              { label: 'Duplicate', icon: Copy, color: '#f59e0b' },
                              { label: 'Share', icon: Share2, color: '#22d3ee' },
                              { label: 'Export', icon: Download, color: '#8b5cf6' },
                              { label: 'Archive', icon: Archive, color: '#6b7280' },
                              { label: 'Delete', icon: Trash2, color: '#ef4444' },
                            ].map(item => (
                              <button
                                key={item.label}
                                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs text-surface-300 hover:text-white hover:bg-white/[0.05] transition-colors text-left ${item.label === 'Delete' ? 'text-danger-400 hover:text-danger-300 border-t border-white/[0.06] mt-1 pt-2' : ''}`}
                                onClick={() => {
                                  setActionMenu(null)
                                  if (item.label === 'Delete') setDeleteTarget(assignment)
                                  else showToast(`${item.label}: ${assignment.title}`)
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

                  <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0">
                    <ChevronDown className="w-4 h-4 text-surface-500" />
                  </motion.div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 border-t border-white/[0.06]">
                        <div className="mt-4 mb-4 p-3 bg-white/[0.03] rounded-xl border border-white/[0.06]">
                          <p className="text-[10px] text-surface-500 mb-1 font-semibold uppercase tracking-wider">Instructions</p>
                          <p className="text-xs text-surface-300 leading-relaxed">
                            {assignment.instructions || 'No instructions added yet.'}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                          {[
                            { label: 'Points', value: assignment.points.toString(), color: assignment.color },
                            { label: 'Submitted', value: `${assignment.submitted}/${assignment.total}`, color: '#10b981' },
                            { label: 'Due Date', value: assignment.dueLabel, color: '#f59e0b' },
                            { label: 'Avg Score', value: assignment.avgScore ? `${assignment.avgScore}%` : '—', color: '#22d3ee' },
                          ].map(stat => (
                            <div key={stat.label} className="p-3 rounded-xl bg-white/[0.03] text-center border border-white/[0.04]">
                              <p className="text-base font-black" style={{ color: stat.color }}>{stat.value}</p>
                              <p className="text-[10px] text-surface-500 mt-0.5">{stat.label}</p>
                            </div>
                          ))}
                        </div>

                        {assignment.rubric.length > 0 && (
                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-[10px] text-surface-500 font-semibold uppercase tracking-wider">Rubric Preview</p>
                              <button onClick={() => setShowRubric(assignment.id)} className="text-[10px] text-accent-400 hover:text-accent-300 font-semibold">
                                View Full Rubric →
                              </button>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {assignment.rubric.map(r => (
                                <span key={r.label} className="text-[10px] px-2 py-1 bg-white/[0.04] text-surface-300 rounded-lg border border-white/[0.06]">
                                  {r.label} <span className="text-surface-500">({r.pts}pts)</span>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-2 flex-wrap">
                          <motion.button className="btn-gradient text-xs" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => showToast('Opening submissions')}>
                            <Eye className="w-3 h-3" /> View Submissions
                          </motion.button>
                          <button className="btn-secondary text-xs px-3 py-1.5" onClick={() => showToast('Editing assignment')}><Edit3 className="w-3 h-3" /> Edit</button>
                          <button className="btn-secondary text-xs px-3 py-1.5" onClick={() => showToast('Assignment duplicated')}><Copy className="w-3 h-3" /> Duplicate</button>
                          <button className="btn-secondary text-xs px-3 py-1.5" onClick={() => showToast('Opening analytics')}><BarChart2 className="w-3 h-3" /> Analytics</button>
                          <button className="btn-secondary text-xs px-3 py-1.5" onClick={() => showToast('Opening feedback tools')}><MessageSquare className="w-3 h-3" /> Feedback</button>
                          {assignment.status === 'active' && (
                            <button className="btn-secondary text-xs px-3 py-1.5" onClick={() => showToast('Reminder sent to missing students')}><Bell className="w-3 h-3" /> Remind</button>
                          )}
                          <button
                            className="btn-secondary text-xs px-3 py-1.5 text-danger-400 hover:bg-danger-400/10 ml-auto"
                            onClick={() => setDeleteTarget(assignment)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {filtered.length === 0 && (
          <motion.div className="glass-card p-10 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ClipboardList className="w-8 h-8 text-surface-600 mx-auto mb-3" />
            <p className="text-sm font-semibold text-surface-300">No assignments match your filters</p>
            <button
              className="btn-secondary text-xs mt-3"
              onClick={() => { setSearch(''); setTypeFilter('all'); setStatusFilter('all'); setClassFilter('all') }}
            >
              Clear All Filters
            </button>
          </motion.div>
        )}
      </div>

      {/* Bottom Analytics Panel */}
      <FadeInWhenVisible delay={0.15}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Score Trend */}
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-success-400/15">
                <TrendingUp className="w-3.5 h-3.5 text-success-400" />
              </div>
              <div>
                <span className="text-sm font-bold text-white block">Score Trend</span>
                <span className="text-[10px] text-surface-500">8-week class average</span>
              </div>
            </div>
            <div className="flex items-end gap-1 h-16 mb-2">
              {SCORE_TREND.map((val, i) => {
                const isLast = i === SCORE_TREND.length - 1
                const min = Math.min(...SCORE_TREND)
                const max = Math.max(...SCORE_TREND)
                const pct = ((val - min) / (max - min + 0.1)) * 100
                return (
                  <div key={i} className="flex-1" title={`${TREND_LABELS[i]}: ${val}%`}>
                    <motion.div
                      className="w-full rounded-sm"
                      style={{
                        height: `${Math.max(pct * 0.56 + 12, 8)}px`,
                        background: isLast ? 'linear-gradient(to top,#6366f1,#a78bfa)' : 'rgba(255,255,255,0.1)',
                      }}
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max(pct * 0.56 + 12, 8)}px` }}
                      transition={{ delay: 0.25 + i * 0.04, duration: 0.4 }}
                    />
                  </div>
                )
              })}
            </div>
            <div className="flex items-center justify-between text-[10px] text-surface-600 mb-3">
              <span>{TREND_LABELS[0]}</span><span>{TREND_LABELS[TREND_LABELS.length - 1]}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-surface-400">Current avg</span>
              <span className="text-xs font-bold text-accent-400">{SCORE_TREND[SCORE_TREND.length - 1]}%</span>
            </div>
          </div>

          {/* Type Breakdown */}
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-accent-500/15">
                <Layers className="w-3.5 h-3.5 text-accent-400" />
              </div>
              <span className="text-sm font-bold text-white">Assignment Types</span>
            </div>
            <div className="space-y-3">
              {(['quiz', 'essay', 'lab', 'project', 'homework'] as const).map(t => {
                const count = assignments.filter(a => a.type === t).length
                const pct = Math.round((count / Math.max(assignments.length, 1)) * 100)
                return (
                  <div key={t}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: TYPE_COLORS[t] }} />
                        <span className="text-xs text-surface-300 capitalize">{typeConfig[t].label}</span>
                      </div>
                      <span className="text-xs font-bold text-white">{count}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: TYPE_COLORS[t] }}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-warning-400/15">
                <Calendar className="w-3.5 h-3.5 text-warning-400" />
              </div>
              <span className="text-sm font-bold text-white">Upcoming Deadlines</span>
            </div>
            <div className="space-y-2.5">
              {assignments
                .filter(a => a.status !== 'past')
                .slice(0, 5)
                .map((a) => (
                  <div key={a.id} className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: a.color }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{a.title}</p>
                      <p className="text-[10px] text-surface-500">{a.class}</p>
                    </div>
                    <span className={`text-[10px] font-bold flex-shrink-0 ${a.status === 'active' ? 'text-warning-400' : 'text-accent-400'}`}>{a.dueLabel}</span>
                  </div>
                ))}
            </div>
            <div className="mt-4 pt-3 border-t border-white/[0.06]">
              <button className="w-full text-xs font-semibold text-accent-400 hover:text-accent-300 transition-colors text-center" onClick={() => showToast('Opening full calendar view')}>
                View Full Calendar →
              </button>
            </div>
          </div>
        </div>
      </FadeInWhenVisible>

      {/* Rubric Modal */}
      <AnimatePresence>
        {showRubric && selectedRubric && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowRubric(null)} />
            <motion.div
              className="relative glass-card p-6 w-full max-w-lg z-10 max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 16 }}
            >
              <button onClick={() => setShowRubric(null)} className="absolute top-4 right-4 text-surface-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ backgroundColor: selectedRubric.color + '20' }}>
                  <span className="text-[10px] font-black" style={{ color: selectedRubric.color }}>R</span>
                </div>
                <h3 className="text-base font-black text-white">Rubric</h3>
              </div>
              <p className="text-xs text-surface-400 mb-4">{selectedRubric.title} · {selectedRubric.points} total points</p>
              <div className="space-y-3">
                {selectedRubric.rubric.map((r, i) => (
                  <motion.div
                    key={r.label}
                    className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]"
                    initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white">{r.label}</span>
                      <span className="text-xs font-black" style={{ color: selectedRubric.color }}>{r.pts} pts</span>
                    </div>
                    <p className="text-[11px] text-surface-400 leading-relaxed">{r.desc}</p>
                  </motion.div>
                ))}
              </div>
              <div className="flex gap-2 mt-4">
                <button className="btn-gradient text-xs flex-1" onClick={() => showToast('AI improving rubric…')}><Sparkles className="w-3 h-3" /> AI Improve</button>
                <button className="btn-secondary text-xs flex-1" onClick={() => showToast('Exporting rubric')}><Download className="w-3 h-3" /> Export</button>
                <button className="btn-secondary text-xs flex-1" onClick={() => showToast('Editing rubric')}><Edit3 className="w-3 h-3" /> Edit</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Assignment Modal */}
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
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)' }}>
                    <ClipboardList className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="text-sm font-bold text-white">New Assignment</h4>
                </div>
                <button className="p-1.5 rounded-lg hover:bg-white/[0.06] text-surface-500 hover:text-white" onClick={() => setCreateOpen(false)}>
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-surface-300 mb-1.5 block">Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Ch. 7 Quiz"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleCreateAssignment()}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white/[0.04] border border-white/[0.08] text-surface-200 placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-accent-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-surface-300 mb-1.5 block">Type</label>
                  <div className="flex flex-wrap gap-1.5">
                    {(['quiz', 'essay', 'lab', 'project', 'homework'] as const).map(t => (
                      <button
                        key={t}
                        onClick={() => setNewType(t)}
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                          newType === t ? 'ring-1 ring-current' : 'opacity-60 hover:opacity-80'
                        } ${typeConfig[t].bg}`}
                      >
                        {typeConfig[t].label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-surface-300 mb-1.5 block">Class</label>
                    <select
                      value={newClass}
                      onChange={e => setNewClass(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white/[0.04] border border-white/[0.08] text-surface-200 focus:outline-none focus:ring-2 focus:ring-accent-500"
                    >
                      {Array.from(new Set(assignments.map(a => a.class))).map(c => (
                        <option key={c} value={c} className="bg-surface-900">{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-surface-300 mb-1.5 block">Points</label>
                    <input
                      type="number"
                      value={newPoints}
                      onChange={e => setNewPoints(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white/[0.04] border border-white/[0.08] text-surface-200 focus:outline-none focus:ring-2 focus:ring-accent-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <button className="flex-1 btn-secondary text-xs py-2" onClick={() => setCreateOpen(false)}>Cancel</button>
                <motion.button
                  className="flex-1 btn-gradient text-xs py-2"
                  onClick={handleCreateAssignment}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                >
                  <Plus className="w-3.5 h-3.5" /> Create
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
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
              <h4 className="text-sm font-bold text-white mb-1">Delete Assignment?</h4>
              <p className="text-xs text-surface-400 mb-5">
                &ldquo;{deleteTarget.title}&rdquo; will be permanently deleted along with all submission records.
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
