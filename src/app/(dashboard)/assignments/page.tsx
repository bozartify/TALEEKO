'use client'
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ClipboardList, Plus, Sparkles, Search, Filter, Calendar, Clock,
  CheckCircle2, AlertTriangle, Users, Download, ChevronDown,
  BookOpen, FileText, Zap, BarChart2, Eye, Edit3, Copy, Trash2,
  TrendingUp, Star, Brain, X, Check, MessageSquare, Bell,
  ArrowRight, Target, Percent, GripVertical, ChevronRight,
  Award, BookMarked, Flag, Lock, Layers, PenTool, RefreshCw
} from 'lucide-react'
import { FadeUp, FadeInWhenVisible } from '@/components/ui/motion'

type AssignType = 'all' | 'quiz' | 'essay' | 'lab' | 'project' | 'homework'
type StatusFilter = 'all' | 'active' | 'upcoming' | 'past'
type AssignView = 'list' | 'create'

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

const assignments: Assignment[] = [
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
    instructions: 'Analyze the symbolism of the green light in Chapter 5. Cite at least 3 textual examples and connect to Fitzgerald\'s broader themes.',
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
  quiz:     { label: 'Quiz',     icon: ClipboardList, color: '#f97316', bg: 'bg-warning-500/15 text-warning-400' },
  essay:    { label: 'Essay',    icon: FileText,      color: '#f43f5e', bg: 'bg-danger-500/15 text-danger-400' },
  lab:      { label: 'Lab',      icon: BookOpen,      color: '#8b5cf6', bg: 'bg-accent-500/15 text-accent-400' },
  project:  { label: 'Project',  icon: Award,         color: '#f59e0b', bg: 'bg-warning-500/15 text-warning-400' },
  homework: { label: 'HW',       icon: BookMarked,    color: '#14b8a6', bg: 'bg-success-500/15 text-success-400' },
}

const aiSuggestions = [
  { title: 'Differentiate Lab Report', desc: 'Generate 3 reading-level variants of the lab instructions for struggling readers.', color: '#8b5cf6' },
  { title: 'Make-up Policy Alert', desc: '6 students haven\'t submitted the Photosynthesis Lab. Consider auto-sending a reminder today.', color: '#f59e0b' },
  { title: 'Similar Assignment Found', desc: 'Shakespeare Scene Analysis is similar to last year\'s Character Analysis — import rubric?', color: '#14b8a6' },
]

export default function AssignmentsPage() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<AssignType>('all')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [view, setView] = useState<AssignView>('list')
  const [showRubric, setShowRubric] = useState<string | null>(null)
  const [classFilter, setClassFilter] = useState('all')
  const [showAI, setShowAI] = useState(true)

  const filtered = useMemo(() => assignments.filter(a => {
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.class.toLowerCase().includes(search.toLowerCase())
    const matchType = typeFilter === 'all' || a.type === typeFilter
    const matchStatus = statusFilter === 'all' || a.status === statusFilter
    const matchClass = classFilter === 'all' || a.class === classFilter
    return matchSearch && matchType && matchStatus && matchClass
  }), [search, typeFilter, statusFilter, classFilter])

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
  const classes = ['all', ...Array.from(new Set(assignments.map(a => a.class)))]

  const selectedRubric = showRubric ? assignments.find(a => a.id === showRubric) : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <FadeUp>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
              whileHover={{ rotate: 8, scale: 1.08 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <ClipboardList className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h2 className="text-xl font-black text-white">Assignments</h2>
              <p className="text-xs text-surface-400">{assignments.length} total · {active} active · {upcoming} upcoming · {aiCount} AI-generated</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <motion.button className="btn-gradient text-xs" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Sparkles className="w-3.5 h-3.5" /> AI Create
            </motion.button>
            <button className="btn-secondary text-xs px-3 py-1.5"><Calendar className="w-3.5 h-3.5" /> Schedule</button>
            <button className="btn-secondary text-xs px-3 py-1.5"><Download className="w-3.5 h-3.5" /> Export</button>
            <button className="btn-secondary text-xs px-3 py-1.5"><Plus className="w-3.5 h-3.5" /> New</button>
          </div>
        </div>
      </FadeUp>

      {/* Stat cards */}
      <FadeUp delay={0.05}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Total Assignments', value: assignments.length.toString(), sub: `${aiCount} AI-generated`, icon: ClipboardList, color: '#6366f1' },
            { label: 'Active Now', value: active.toString(), sub: `${missingTotal} missing submissions`, icon: Clock, color: '#f97316' },
            { label: 'Submission Rate', value: `${Math.round((totalSubmitted / totalSlots) * 100)}%`, sub: `${totalSubmitted}/${totalSlots} submitted`, icon: CheckCircle2, color: '#10b981' },
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

      {/* AI Insights */}
      <AnimatePresence>
        {showAI && (
          <motion.div
            className="glass-card p-5 border border-accent-500/15"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#6366f1,#a78bfa)' }}>
                  <Brain className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-sm font-bold text-white">AI Assignment Insights</span>
                <span className="text-[10px] bg-accent-500/15 text-accent-400 px-1.5 py-0.5 rounded-full font-bold">{aiSuggestions.length}</span>
              </div>
              <button onClick={() => setShowAI(false)} className="text-surface-500 hover:text-surface-300"><X className="w-3.5 h-3.5" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {aiSuggestions.map((s, i) => (
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
                  <button className="text-[10px] font-semibold mt-2 flex items-center gap-1" style={{ color: s.color }}>
                    Take Action <ArrowRight className="w-2.5 h-2.5" />
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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

      {/* Assignment results count */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-surface-500">{filtered.length} assignment{filtered.length !== 1 ? 's' : ''} shown</span>
        <button className="btn-secondary text-xs px-3 py-1.5"><Filter className="w-3 h-3" /> Advanced Filter</button>
      </div>

      {/* Assignment list */}
      <div className="space-y-3">
        <AnimatePresence>
          {filtered.map((assignment, i) => {
            const type = typeConfig[assignment.type]
            const isExpanded = expandedId === assignment.id
            const submittedPct = Math.round((assignment.submitted / assignment.total) * 100)
            const missingCount = assignment.total - assignment.submitted
            return (
              <motion.div
                key={assignment.id}
                className="glass-card overflow-hidden"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ delay: 0.05 + i * 0.04 }}
              >
                <button
                  className="w-full flex items-center gap-4 p-5 text-left hover:bg-white/[0.02] transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : assignment.id)}
                >
                  <div className="w-1.5 h-12 rounded-full flex-shrink-0" style={{ backgroundColor: assignment.color }} />

                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: assignment.color + '18' }}>
                    <type.icon className="w-4.5 h-4.5" style={{ color: assignment.color }} />
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

                  <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="w-4 h-4 text-surface-500 flex-shrink-0" />
                  </motion.div>
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
                      <div className="px-5 pb-5 border-t border-white/[0.06]">
                        {/* Instructions */}
                        <div className="mt-4 mb-4 p-3 bg-white/[0.03] rounded-xl border border-white/[0.06]">
                          <p className="text-[10px] text-surface-500 mb-1 font-semibold uppercase tracking-wider">Instructions</p>
                          <p className="text-xs text-surface-300 leading-relaxed">{assignment.instructions}</p>
                        </div>

                        {/* Stats grid */}
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

                        {/* Rubric preview */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-[10px] text-surface-500 font-semibold uppercase tracking-wider">Rubric Preview</p>
                            <button
                              onClick={() => setShowRubric(assignment.id)}
                              className="text-[10px] text-accent-400 hover:text-accent-300 font-semibold"
                            >
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

                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <motion.button className="btn-gradient text-xs" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Eye className="w-3 h-3" /> View Submissions
                          </motion.button>
                          <button className="btn-secondary text-xs px-3 py-1.5"><Edit3 className="w-3 h-3" /> Edit</button>
                          <button className="btn-secondary text-xs px-3 py-1.5"><Copy className="w-3 h-3" /> Duplicate</button>
                          <button className="btn-secondary text-xs px-3 py-1.5"><BarChart2 className="w-3 h-3" /> Analytics</button>
                          <button className="btn-secondary text-xs px-3 py-1.5"><MessageSquare className="w-3 h-3" /> Feedback</button>
                          {assignment.status === 'active' && (
                            <button className="btn-secondary text-xs px-3 py-1.5"><Bell className="w-3 h-3" /> Remind</button>
                          )}
                          <button className="btn-secondary text-xs px-3 py-1.5 text-danger-400 hover:bg-danger-400/10 ml-auto">
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
            <button className="btn-secondary text-xs mt-3" onClick={() => { setSearch(''); setTypeFilter('all'); setStatusFilter('all'); setClassFilter('all') }}>
              Clear All Filters
            </button>
          </motion.div>
        )}
      </div>

      {/* Rubric Modal */}
      <AnimatePresence>
        {showRubric && selectedRubric && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowRubric(null)} />
            <motion.div
              className="relative glass-card p-6 w-full max-w-lg z-10 max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.95, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 16 }}
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
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
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
                <button className="btn-gradient text-xs flex-1"><Sparkles className="w-3 h-3" /> AI Improve</button>
                <button className="btn-secondary text-xs flex-1"><Download className="w-3 h-3" /> Export</button>
                <button className="btn-secondary text-xs flex-1"><Edit3 className="w-3 h-3" /> Edit</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
