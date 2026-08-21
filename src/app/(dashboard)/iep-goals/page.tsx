'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Target, Shield, Download, Plus, CheckCircle,
  AlertTriangle, TrendingUp, Clock, BookOpen,
  Activity, Brain, X, ArrowUpRight, FileText,
  Users, ChevronRight, Calculator, Mic,
} from 'lucide-react'
import { FadeUp, FadeInWhenVisible, StaggerList, StaggerItem, fadeUp } from '@/components/ui/motion'

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */

type GoalArea =
  | 'Reading Fluency'
  | 'Math Computation'
  | 'Written Expression'
  | 'Social-Emotional'
  | 'Speech-Language'
  | 'Behavior'

type GoalStatus = 'On Track' | 'At Risk' | 'Met'

interface Student {
  id: string
  name: string
  initials: string
  avatarColor: string
  grade: string
}

interface IEPGoal {
  id: string
  studentId: string
  area: GoalArea
  goalText: string
  baseline: number
  current: number
  target: number
  lastUpdated: string
  status: GoalStatus
}

interface ProgressEntry {
  studentId: string
  goalId: string
  date: string
  value: number
  note: string
  area: GoalArea
  studentName: string
}

/* ─────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────── */

const AREA_CONFIG: Record<GoalArea, { color: string; icon: React.ElementType }> = {
  'Reading Fluency':    { color: '#6366f1', icon: BookOpen },
  'Math Computation':   { color: '#22d3ee', icon: Calculator },
  'Written Expression': { color: '#a78bfa', icon: FileText },
  'Social-Emotional':   { color: '#10b981', icon: Brain },
  'Speech-Language':    { color: '#f59e0b', icon: Mic },
  'Behavior':           { color: '#ef4444', icon: Activity },
}

const STATUS_CONFIG: Record<GoalStatus, { color: string; bg: string; icon: React.ElementType }> = {
  'On Track': { color: '#10b981', bg: 'rgba(16,185,129,0.12)',  icon: TrendingUp },
  'At Risk':  { color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   icon: AlertTriangle },
  'Met':      { color: '#22d3ee', bg: 'rgba(34,211,238,0.12)',  icon: CheckCircle },
}

const GOAL_AREAS: GoalArea[] = [
  'Reading Fluency',
  'Math Computation',
  'Written Expression',
  'Social-Emotional',
  'Speech-Language',
  'Behavior',
]

/* ─────────────────────────────────────────────
   DATA — STUDENTS
───────────────────────────────────────────── */

const STUDENTS: Student[] = [
  { id: 's1', name: 'Emma Rodriguez', initials: 'ER', avatarColor: '#6366f1', grade: '3rd' },
  { id: 's2', name: 'Noah Williams',  initials: 'NW', avatarColor: '#22d3ee', grade: '4th' },
  { id: 's3', name: 'Sophia Chen',    initials: 'SC', avatarColor: '#a78bfa', grade: '2nd' },
  { id: 's4', name: 'Liam Rodriguez', initials: 'LR', avatarColor: '#f59e0b', grade: '5th' },
  { id: 's5', name: 'Ava Patel',      initials: 'AP', avatarColor: '#10b981', grade: '3rd' },
]

/* ─────────────────────────────────────────────
   DATA — GOALS
───────────────────────────────────────────── */

const INITIAL_GOALS: IEPGoal[] = [
  // Emma Rodriguez (s1)
  {
    id: 'g1', studentId: 's1', area: 'Reading Fluency',
    goalText: 'By June 2026, Emma will read a 3rd-grade passage at 90 words per minute with 95% accuracy, as measured by weekly oral reading fluency probes.',
    baseline: 42, current: 71, target: 90, lastUpdated: 'Aug 14, 2026', status: 'On Track',
  },
  {
    id: 'g2', studentId: 's1', area: 'Written Expression',
    goalText: 'By June 2026, Emma will produce a 5-sentence paragraph with correct capitalization and end punctuation in 4 of 5 opportunities, as measured monthly.',
    baseline: 30, current: 55, target: 80, lastUpdated: 'Aug 10, 2026', status: 'On Track',
  },
  {
    id: 'g3', studentId: 's1', area: 'Social-Emotional',
    goalText: 'By June 2026, Emma will independently identify and use two self-regulation strategies when experiencing frustration in 4 of 5 observed opportunities weekly.',
    baseline: 20, current: 35, target: 80, lastUpdated: 'Aug 7, 2026', status: 'At Risk',
  },
  // Noah Williams (s2)
  {
    id: 'g4', studentId: 's2', area: 'Math Computation',
    goalText: 'By June 2026, Noah will solve two-digit multiplication problems with 80% accuracy on 3 consecutive weekly probes without manipulatives.',
    baseline: 35, current: 75, target: 80, lastUpdated: 'Aug 15, 2026', status: 'On Track',
  },
  {
    id: 'g5', studentId: 's2', area: 'Speech-Language',
    goalText: 'By June 2026, Noah will produce /r/ sounds in all word positions with 80% accuracy during structured conversation, as measured bi-weekly by the SLP.',
    baseline: 40, current: 65, target: 80, lastUpdated: 'Aug 12, 2026', status: 'On Track',
  },
  {
    id: 'g6', studentId: 's2', area: 'Behavior',
    goalText: 'By June 2026, Noah will remain on-task for 15-minute independent work periods without redirection in 4 of 5 daily observations.',
    baseline: 25, current: 20, target: 80, lastUpdated: 'Aug 8, 2026', status: 'At Risk',
  },
  // Sophia Chen (s3)
  {
    id: 'g7', studentId: 's3', area: 'Reading Fluency',
    goalText: 'By June 2026, Sophia will read a 2nd-grade passage at 80 WCPM with 98% accuracy in 3 consecutive probes, up from 31 WCPM at baseline.',
    baseline: 31, current: 80, target: 80, lastUpdated: 'Aug 16, 2026', status: 'Met',
  },
  {
    id: 'g8', studentId: 's3', area: 'Math Computation',
    goalText: 'By June 2026, Sophia will complete single-digit addition and subtraction facts within 10 seconds with 90% accuracy on timed fluency assessments.',
    baseline: 50, current: 68, target: 90, lastUpdated: 'Aug 13, 2026', status: 'On Track',
  },
  // Liam Rodriguez (s4)
  {
    id: 'g9', studentId: 's4', area: 'Speech-Language',
    goalText: 'By June 2026, Liam will produce grammatically correct 4–6 word sentences using present progressive tense with 75% accuracy in structured language tasks.',
    baseline: 30, current: 55, target: 75, lastUpdated: 'Aug 11, 2026', status: 'On Track',
  },
  {
    id: 'g10', studentId: 's4', area: 'Social-Emotional',
    goalText: 'By June 2026, Liam will initiate appropriate peer interactions during unstructured time in 3 of 5 observed opportunities, as measured by weekly teacher log.',
    baseline: 15, current: 12, target: 60, lastUpdated: 'Aug 5, 2026', status: 'At Risk',
  },
  {
    id: 'g11', studentId: 's4', area: 'Written Expression',
    goalText: 'By June 2026, Liam will write a 3-sentence opinion response with a clear topic sentence and at least one supporting detail in 4 of 5 monthly writing samples.',
    baseline: 20, current: 45, target: 80, lastUpdated: 'Aug 9, 2026', status: 'On Track',
  },
  // Ava Patel (s5)
  {
    id: 'g12', studentId: 's5', area: 'Reading Fluency',
    goalText: 'By June 2026, Ava will read 3rd-grade decodable text at 85 WCPM with 96% accuracy, as measured on bi-weekly oral reading fluency probes.',
    baseline: 48, current: 82, target: 85, lastUpdated: 'Aug 16, 2026', status: 'On Track',
  },
]

/* ─────────────────────────────────────────────
   DATA — PROGRESS LOG
───────────────────────────────────────────── */

const PROGRESS_LOG: ProgressEntry[] = [
  { studentId: 's3', goalId: 'g7',  date: 'Aug 16', value: 80, area: 'Reading Fluency',  studentName: 'Sophia Chen',    note: 'Annual goal MET — 80 WCPM with 98% accuracy. Celebrating a major milestone with the team.' },
  { studentId: 's5', goalId: 'g12', date: 'Aug 16', value: 82, area: 'Reading Fluency',  studentName: 'Ava Patel',      note: 'Bi-weekly fluency probe — 82 WCPM. Just 3 points from the 85-WCPM annual target.' },
  { studentId: 's2', goalId: 'g4',  date: 'Aug 15', value: 75, area: 'Math Computation', studentName: 'Noah Williams',  note: 'Two-digit multiplication probe — 75% accuracy. Within 5 points of the 80% annual target.' },
  { studentId: 's1', goalId: 'g1',  date: 'Aug 14', value: 71, area: 'Reading Fluency',  studentName: 'Emma Rodriguez', note: 'Oral reading fluency probe — 71 WCPM. Steady gains; trajectory on track for annual goal.' },
  { studentId: 's3', goalId: 'g8',  date: 'Aug 13', value: 68, area: 'Math Computation', studentName: 'Sophia Chen',    note: 'Timed math facts fluency: 68% accuracy within time limit. Consistent improvement month over month.' },
  { studentId: 's4', goalId: 'g10', date: 'Aug 5',  value: 12, area: 'Social-Emotional', studentName: 'Liam Rodriguez', note: 'Peer interaction log review — slight regression noted. Team meeting scheduled with school counselor.' },
]

/* ─────────────────────────────────────────────
   PAGE COMPONENT
───────────────────────────────────────────── */

export default function IepGoalsPage() {
  const [selectedStudentId, setSelectedStudentId] = useState<string>('s1')
  const [goals, setGoals]                         = useState<IEPGoal[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('taleeko_iep_goals')
        if (saved) return JSON.parse(saved)
      } catch {}
    }
    return INITIAL_GOALS
  })
  const [showModal, setShowModal]                 = useState(false)
  const [toastMsg, setToastMsg]                   = useState('')

  // Modal form state
  const [newGoalArea, setNewGoalArea]   = useState<GoalArea>('Reading Fluency')
  const [newGoalText, setNewGoalText]   = useState('')
  const [newBaseline, setNewBaseline]   = useState('')
  const [newTarget, setNewTarget]       = useState('')

  const selectedStudent = STUDENTS.find(s => s.id === selectedStudentId)!
  const studentGoals    = goals.filter(g => g.studentId === selectedStudentId)

  const activeGoals   = goals.length
  const onTrackGoals  = goals.filter(g => g.status === 'On Track').length
  const atRiskGoals   = goals.filter(g => g.status === 'At Risk').length
  const reviewDue     = goals.filter(g => g.status === 'Met').length

  function showToast(msg: string) {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 2600)
  }

  function handleAddGoal(e: React.FormEvent) {
    e.preventDefault()
    if (!newGoalText.trim()) return
    const baselineNum = parseInt(newBaseline) || 0
    const targetNum   = parseInt(newTarget)   || 80
    const newGoal: IEPGoal = {
      id:          `g${Date.now()}`,
      studentId:   selectedStudentId,
      area:        newGoalArea,
      goalText:    newGoalText,
      baseline:    baselineNum,
      current:     baselineNum,
      target:      targetNum,
      lastUpdated: 'Aug 19, 2026',
      status:      'On Track',
    }
    setGoals(prev => {
      const next = [...prev, newGoal]
      try { localStorage.setItem('taleeko_iep_goals', JSON.stringify(next)) } catch {}
      return next
    })
    setShowModal(false)
    setNewGoalText('')
    setNewBaseline('')
    setNewTarget('')
    setNewGoalArea('Reading Fluency')
    showToast(`New goal added for ${selectedStudent.name}!`)
  }

  function handleQuickUpdate(goalId: string) {
    setGoals(prev => {
      const next = prev.map(g => {
        if (g.id !== goalId) return g
        const newCurrent = Math.min(g.current + 5, 100)
        let newStatus: GoalStatus = g.status
        if (newCurrent >= g.target) {
          newStatus = 'Met'
        } else if (g.status === 'At Risk' && newCurrent > g.baseline + 10) {
          newStatus = 'On Track'
        }
        return { ...g, current: newCurrent, status: newStatus, lastUpdated: 'Aug 19, 2026' }
      })
      try { localStorage.setItem('taleeko_iep_goals', JSON.stringify(next)) } catch {}
      return next
    })
    showToast('Progress updated +5%')
  }

  return (
    <div className="space-y-6">

      {/* ══════════════════════════════════
          HERO HEADER
      ══════════════════════════════════ */}
      <FadeUp>
        <div className="hero-mesh rounded-3xl p-6 relative overflow-hidden">
          {/* Ambient glows */}
          <div
            className="absolute -top-20 -right-20 w-72 h-72 rounded-full pointer-events-none opacity-30"
            style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.18), transparent 70%)' }}
          />
          <div
            className="absolute -bottom-10 left-1/4 w-52 h-52 rounded-full pointer-events-none opacity-20"
            style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.12), transparent 70%)' }}
          />

          <div className="relative flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
            {/* Title */}
            <div className="flex items-start gap-4">
              <div className="relative flex-shrink-0">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg,#6366f1,#4f46e5)' }}
                >
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg,#22d3ee,#0891b2)' }}
                >
                  <Shield className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h1 className="text-2xl font-black text-white tracking-tight">IEP Goals Tracker</h1>
                  <span className="text-[10px] bg-electric-400/15 text-electric-400 px-2 py-0.5 rounded-full font-bold border border-electric-400/20">
                    IDEA Compliant
                  </span>
                </div>
                <p className="text-sm text-surface-400">
                  Annual goals · Progress monitoring · Compliance tracking · Special education documentation
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
              <motion.button
                className="btn-secondary text-xs px-4 py-2"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => showToast('IEP compliance report exported!')}
              >
                <Download className="w-3.5 h-3.5" /> Export Report
              </motion.button>
              <motion.button
                className="btn-gradient text-xs px-4 py-2"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowModal(true)}
              >
                <Plus className="w-3.5 h-3.5" /> Add Goal
              </motion.button>
            </div>
          </div>

          {/* Stat tiles */}
          <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-3">
            {([
              { label: 'Active Goals', value: activeGoals,  sub: 'across all students',        color: '#6366f1', icon: Target },
              { label: 'On Track',     value: onTrackGoals, sub: 'within expected trajectory',  color: '#10b981', icon: TrendingUp },
              { label: 'At Risk',      value: atRiskGoals,  sub: 'need immediate attention',    color: '#ef4444', icon: AlertTriangle },
              { label: 'Review Due',   value: reviewDue,    sub: 'annual goal met — celebrate', color: '#22d3ee', icon: CheckCircle },
            ] as const).map((stat, i) => (
              <motion.div
                key={stat.label}
                className="rounded-2xl p-4 relative overflow-hidden"
                style={{ background: stat.color + '12', border: `1px solid ${stat.color}25` }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: stat.color + '20' }}
                  >
                    <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-40" style={{ color: stat.color }} />
                </div>
                <p className="text-2xl font-black text-white tabular-nums">{stat.value}</p>
                <p className="text-[10px] text-surface-400 mt-0.5 font-medium">{stat.label}</p>
                <p className="text-[9px] text-surface-500 mt-0.5">{stat.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </FadeUp>

      {/* ══════════════════════════════════
          MAIN 2-COLUMN LAYOUT
      ══════════════════════════════════ */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* ───── LEFT: selector + goals ───── */}
        <div className="xl:col-span-2 space-y-5">

          {/* Student selector */}
          <FadeUp delay={0.08}>
            <div className="glass-card p-4">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-4 h-4 text-surface-400" />
                <h2 className="text-xs font-bold text-surface-300 uppercase tracking-wider">Select Student</h2>
                <span className="text-[10px] text-surface-500 ml-1">
                  {STUDENTS.length} students with active IEPs
                </span>
              </div>

              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {STUDENTS.map((student) => {
                  const isSelected       = selectedStudentId === student.id
                  const studentGoalCount = goals.filter(g => g.studentId === student.id).length
                  const hasAtRisk        = goals.some(g => g.studentId === student.id && g.status === 'At Risk')
                  return (
                    <motion.button
                      key={student.id}
                      onClick={() => setSelectedStudentId(student.id)}
                      className="flex flex-col items-center gap-2 p-3 rounded-2xl transition-colors duration-200 flex-shrink-0"
                      style={isSelected ? {
                        background:  student.avatarColor + '18',
                        border:      `1px solid ${student.avatarColor}40`,
                        boxShadow:   `0 0 16px ${student.avatarColor}20`,
                      } : {
                        background: 'rgba(255,255,255,0.03)',
                        border:     '1px solid rgba(255,255,255,0.07)',
                      }}
                      whileHover={{ y: -2, scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <div className="relative">
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black text-white"
                          style={{ background: `linear-gradient(135deg, ${student.avatarColor}, ${student.avatarColor}88)` }}
                        >
                          {student.initials}
                        </div>
                        {hasAtRisk && (
                          <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-danger-500 border-2 border-surface-900" />
                        )}
                        {isSelected && (
                          <motion.div
                            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 rounded-full"
                            style={{ background: student.avatarColor }}
                            layoutId="studentIndicator"
                          />
                        )}
                      </div>
                      <div className="text-center">
                        <p className={`text-[11px] font-semibold whitespace-nowrap ${isSelected ? 'text-white' : 'text-surface-400'}`}>
                          {student.name.split(' ')[0]}
                        </p>
                        <p className="text-[9px] text-surface-600">
                          {student.grade} · {studentGoalCount} goals
                        </p>
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </div>
          </FadeUp>

          {/* Goals list */}
          <FadeUp delay={0.13}>
            <div className="glass-card overflow-hidden">
              {/* Card header */}
              <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black text-white flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${selectedStudent.avatarColor}, ${selectedStudent.avatarColor}80)` }}
                  >
                    {selectedStudent.initials}
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white">{selectedStudent.name}</h2>
                    <p className="text-[10px] text-surface-500">
                      Grade {selectedStudent.grade} · {studentGoals.length} annual goals · IEP active
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {(['On Track', 'At Risk', 'Met'] as GoalStatus[]).map(s => {
                    const count = studentGoals.filter(g => g.status === s).length
                    if (count === 0) return null
                    const c = STATUS_CONFIG[s]
                    return (
                      <span
                        key={s}
                        className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: c.bg, color: c.color }}
                      >
                        {count} {s}
                      </span>
                    )
                  })}
                </div>
              </div>

              {/* Goal rows */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedStudentId}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                >
                  {studentGoals.length === 0 ? (
                    <div className="py-16 text-center">
                      <Target className="w-8 h-8 text-surface-600 mx-auto mb-3" />
                      <p className="text-sm text-surface-500 mb-1">No IEP goals yet</p>
                      <p className="text-xs text-surface-600 mb-4">Add the first goal for {selectedStudent.name}</p>
                      <button className="btn-primary text-xs" onClick={() => setShowModal(true)}>
                        <Plus className="w-3.5 h-3.5" /> Add First Goal
                      </button>
                    </div>
                  ) : (
                    <StaggerList className="divide-y divide-white/[0.04]" delay={0.06}>
                      {studentGoals.map((goal) => {
                        const areaConf   = AREA_CONFIG[goal.area]
                        const statusConf = STATUS_CONFIG[goal.status]
                        const range      = goal.target - goal.baseline
                        const progressPct = range > 0
                          ? Math.min(100, Math.round(((goal.current - goal.baseline) / range) * 100))
                          : 100
                        const StatusIcon = statusConf.icon
                        const AreaIcon   = areaConf.icon
                        return (
                          <StaggerItem
                            key={goal.id}
                            variants={fadeUp}
                            className="p-5 hover:bg-white/[0.02] transition-colors"
                          >
                            <div className="flex flex-col gap-3.5">
                              {/* Top: area badge + status + date */}
                              <div className="flex items-start justify-between gap-3 flex-wrap">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span
                                    className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full flex-shrink-0"
                                    style={{
                                      backgroundColor: areaConf.color + '18',
                                      color:           areaConf.color,
                                      border:          `1px solid ${areaConf.color}30`,
                                    }}
                                  >
                                    <AreaIcon className="w-3 h-3" />
                                    {goal.area}
                                  </span>
                                  <span
                                    className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full"
                                    style={{ backgroundColor: statusConf.bg, color: statusConf.color }}
                                  >
                                    <StatusIcon className="w-2.5 h-2.5" />
                                    {goal.status}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 flex-shrink-0">
                                  <Clock className="w-3 h-3 text-surface-500" />
                                  <span className="text-[9px] text-surface-500">{goal.lastUpdated}</span>
                                </div>
                              </div>

                              {/* Goal text */}
                              <p className="text-[12px] text-surface-200 leading-relaxed">{goal.goalText}</p>

                              {/* Progress metrics */}
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-[10px] flex-wrap gap-1">
                                  <div className="flex items-center gap-4">
                                    <div>
                                      <span className="text-surface-500">Baseline </span>
                                      <span className="text-surface-300 font-bold tabular-nums">{goal.baseline}%</span>
                                    </div>
                                    <div>
                                      <span className="text-surface-500">Current </span>
                                      <span className="font-bold tabular-nums" style={{ color: areaConf.color }}>
                                        {goal.current}%
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-surface-500">Target </span>
                                      <span className="text-surface-300 font-bold tabular-nums">{goal.target}%</span>
                                    </div>
                                  </div>
                                  <span className="font-bold tabular-nums" style={{ color: areaConf.color }}>
                                    {progressPct}% toward goal
                                  </span>
                                </div>

                                {/* Animated progress bar */}
                                <div className="relative h-2 rounded-full overflow-hidden bg-white/[0.06]">
                                  <motion.div
                                    className="absolute left-0 top-0 h-full rounded-full"
                                    style={{
                                      background: `linear-gradient(90deg, ${areaConf.color}, ${areaConf.color}70)`,
                                    }}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progressPct}%` }}
                                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                  />
                                </div>
                              </div>

                              {/* Quick update */}
                              <div className="flex justify-end">
                                <motion.button
                                  className="text-[10px] font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
                                  style={{
                                    backgroundColor: areaConf.color + '15',
                                    color:           areaConf.color,
                                    border:          `1px solid ${areaConf.color}25`,
                                  }}
                                  whileHover={{ scale: 1.03 }}
                                  whileTap={{ scale: 0.97 }}
                                  onClick={() => handleQuickUpdate(goal.id)}
                                  disabled={goal.current >= 100}
                                >
                                  <TrendingUp className="w-3 h-3" />
                                  Quick Update +5%
                                </motion.button>
                              </div>
                            </div>
                          </StaggerItem>
                        )
                      })}
                    </StaggerList>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Card footer */}
              {studentGoals.length > 0 && (
                <div className="px-5 py-3 border-t border-white/[0.05] flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-[10px] text-surface-600">
                    IEP goals reviewed annually or when significant changes occur
                  </span>
                  <motion.button
                    className="text-[10px] text-accent-400 font-semibold hover:text-accent-300 flex items-center gap-0.5 transition-colors"
                    whileHover={{ x: 1 }}
                    onClick={() => setShowModal(true)}
                  >
                    <Plus className="w-3 h-3" /> Add Goal <ChevronRight className="w-2.5 h-2.5" />
                  </motion.button>
                </div>
              )}
            </div>
          </FadeUp>
        </div>

        {/* ───── RIGHT: progress log ───── */}
        <div className="space-y-4">
          <FadeInWhenVisible delay={0.1}>
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-5">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg,#a78bfa,#7c3aed)' }}
                >
                  <FileText className="w-3.5 h-3.5 text-white" />
                </div>
                <h3 className="text-sm font-bold text-white">Progress Log</h3>
                <span className="text-[10px] text-surface-500 ml-auto">Recent entries</span>
              </div>

              {/* Timeline */}
              <div className="relative">
                <div className="absolute left-[9px] top-2 bottom-2 w-px bg-white/[0.06]" />
                <div className="space-y-5">
                  {PROGRESS_LOG.map((entry, ei) => {
                    const areaConf = AREA_CONFIG[entry.area]
                    const isMet    = entry.note.toLowerCase().includes('met')
                    const dotColor = isMet ? '#22d3ee' : areaConf.color
                    return (
                      <motion.div
                        key={ei}
                        className="relative flex gap-3"
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 + ei * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      >
                        {/* Timeline dot */}
                        <div
                          className="relative z-10 w-[18px] h-[18px] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{
                            background: dotColor + '20',
                            border:     `1.5px solid ${dotColor}50`,
                          }}
                        >
                          <div
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: dotColor }}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                            <span className="text-[11px] font-bold text-surface-200">
                              {entry.studentName.split(' ')[0]}
                            </span>
                            <span
                              className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
                              style={{ backgroundColor: areaConf.color + '18', color: areaConf.color }}
                            >
                              {entry.area}
                            </span>
                            <span className="text-[9px] text-surface-600 ml-auto">{entry.date}</span>
                          </div>
                          <p className="text-[10px] text-surface-400 leading-relaxed">{entry.note}</p>
                          <div className="mt-1.5 flex items-center gap-1">
                            <span className="text-[9px] text-surface-500">Score </span>
                            <span
                              className="text-[10px] font-black tabular-nums"
                              style={{ color: dotColor }}
                            >
                              {entry.value}%
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-white/[0.05] flex items-center justify-between">
                <p className="text-[9px] text-surface-600">Entries logged by intervention team members</p>
                <motion.button
                  className="text-[9px] text-accent-400 font-semibold hover:text-accent-300 flex items-center gap-0.5 transition-colors"
                  whileHover={{ x: 1 }}
                  onClick={() => showToast('Full progress archive opened!')}
                >
                  View all <ChevronRight className="w-2.5 h-2.5" />
                </motion.button>
              </div>
            </div>
          </FadeInWhenVisible>

          {/* Area breakdown mini-card */}
          <FadeInWhenVisible delay={0.18}>
            <div className="glass-card p-5">
              <h3 className="text-[11px] font-bold text-surface-300 uppercase tracking-wider mb-4">
                Goal Area Distribution
              </h3>
              <div className="space-y-3">
                {GOAL_AREAS.map((area) => {
                  const count     = goals.filter(g => g.area === area).length
                  const pct       = goals.length > 0 ? Math.round((count / goals.length) * 100) : 0
                  const areaConf  = AREA_CONFIG[area]
                  const AreaIcon  = areaConf.icon
                  if (count === 0) return null
                  return (
                    <div key={area}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <AreaIcon className="w-3 h-3" style={{ color: areaConf.color }} />
                          <span className="text-[10px] text-surface-300">{area}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] text-surface-500">{count} goals</span>
                          <span className="text-[10px] font-bold tabular-nums" style={{ color: areaConf.color }}>
                            {pct}%
                          </span>
                        </div>
                      </div>
                      <div className="relative h-1.5 rounded-full overflow-hidden bg-white/[0.06]">
                        <motion.div
                          className="absolute left-0 top-0 h-full rounded-full"
                          style={{ background: areaConf.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ delay: 0.5, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </FadeInWhenVisible>
        </div>
      </div>

      {/* ══════════════════════════════════
          ADD GOAL MODAL
      ══════════════════════════════════ */}
      <AnimatePresence>
        {showModal && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
            />
            {/* Modal */}
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 380, damping: 28 } }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
            >
              <div className="glass-card w-full max-w-lg overflow-hidden">
                {/* Modal header */}
                <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg,#6366f1,#4f46e5)' }}
                    >
                      <Plus className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-white">Add IEP Goal</h2>
                      <p className="text-[10px] text-surface-500">
                        For {selectedStudent.name} · Grade {selectedStudent.grade}
                      </p>
                    </div>
                  </div>
                  <motion.button
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-surface-400 hover:text-white hover:bg-white/[0.08] transition-colors"
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => setShowModal(false)}
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>

                {/* Modal form */}
                <form onSubmit={handleAddGoal} className="p-6 space-y-4">
                  {/* Student (pre-filled, read-only) */}
                  <div>
                    <label className="block text-[11px] font-semibold text-surface-300 uppercase tracking-wide mb-1.5">
                      Student
                    </label>
                    <div
                      className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
                    >
                      <div
                        className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black text-white flex-shrink-0"
                        style={{ background: `linear-gradient(135deg, ${selectedStudent.avatarColor}, ${selectedStudent.avatarColor}80)` }}
                      >
                        {selectedStudent.initials}
                      </div>
                      <span className="text-sm text-surface-200">{selectedStudent.name}</span>
                      <span className="text-[10px] text-surface-500 ml-auto">Grade {selectedStudent.grade}</span>
                    </div>
                  </div>

                  {/* Goal area */}
                  <div>
                    <label className="block text-[11px] font-semibold text-surface-300 uppercase tracking-wide mb-1.5">
                      Goal Area
                    </label>
                    <select
                      value={newGoalArea}
                      onChange={e => setNewGoalArea(e.target.value as GoalArea)}
                      className="input-base text-sm appearance-none"
                    >
                      {GOAL_AREAS.map(area => (
                        <option key={area} value={area}>{area}</option>
                      ))}
                    </select>
                  </div>

                  {/* Goal text */}
                  <div>
                    <label className="block text-[11px] font-semibold text-surface-300 uppercase tracking-wide mb-1.5">
                      Measurable Annual Goal
                    </label>
                    <textarea
                      value={newGoalText}
                      onChange={e => setNewGoalText(e.target.value)}
                      rows={4}
                      placeholder="By June 2026, [student] will [observable behavior] with [accuracy/criteria] as measured by [method]..."
                      className="input-base text-sm resize-none"
                      required
                    />
                  </div>

                  {/* Baseline + Target */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-surface-300 uppercase tracking-wide mb-1.5">
                        Baseline %
                      </label>
                      <input
                        type="number"
                        value={newBaseline}
                        onChange={e => setNewBaseline(e.target.value)}
                        placeholder="e.g. 35"
                        min={0}
                        max={100}
                        className="input-base text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-surface-300 uppercase tracking-wide mb-1.5">
                        Target %
                      </label>
                      <input
                        type="number"
                        value={newTarget}
                        onChange={e => setNewTarget(e.target.value)}
                        placeholder="e.g. 80"
                        min={0}
                        max={100}
                        className="input-base text-sm"
                        required
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-1">
                    <button type="button" className="btn-secondary flex-1" onClick={() => setShowModal(false)}>
                      Cancel
                    </button>
                    <motion.button
                      type="submit"
                      className="btn-gradient flex-1"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Target className="w-3.5 h-3.5" /> Add Goal
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════
          TOAST
      ══════════════════════════════════ */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            className="fixed top-5 right-5 z-[100] flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl text-sm font-semibold text-white border border-white/[0.08]"
            style={{ background: 'linear-gradient(135deg,#0a0f1a,#111827)' }}
            initial={{ opacity: 0, y: -12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
            exit={{ opacity: 0, y: -12, scale: 0.95 }}
          >
            <CheckCircle className="w-4 h-4 text-accent-400 flex-shrink-0" />
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
