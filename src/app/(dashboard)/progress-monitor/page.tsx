'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrendingUp, Activity, Download, Plus, X, ChevronRight,
  ArrowUp, ArrowDown, Minus, User, BookOpen, Calendar, Award,
  Filter, CheckCircle2, AlertTriangle, Star
} from 'lucide-react'
import { FadeUp, FadeInWhenVisible, StaggerList, StaggerItem, fadeUp } from '@/components/ui/motion'

/* ─────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────── */
interface Student {
  id: number
  name: string
  initials: string
  grade: number
  trend: 'up' | 'down' | 'flat'
  status: 'Excelling' | 'On Track' | 'At Risk'
  subject: string
  attendance: number
  assignments: number
  growth: number
  sparkline: number[]
  weeklyGrades: number[]
  subjects: { name: string; score: number }[]
  recentAssessments: { name: string; score: number; date: string }[]
}

type SubjectFilter = 'All' | 'Biology' | 'Math' | 'English' | 'History'
type StatusFilter  = 'All' | 'Excelling' | 'On Track' | 'At Risk'

/* ─────────────────────────────────────────────────────────────
   Data
───────────────────────────────────────────────────────────── */
const weekLabels = ['Wk1', 'Wk2', 'Wk3', 'Wk4', 'Wk5', 'Wk6', 'Wk7', 'Wk8']
const classAvgScores = [74, 76, 78, 80, 81, 83, 82, 84]

const STUDENTS: Student[] = [
  {
    id: 1, name: 'Emma Rodriguez', initials: 'ER', grade: 94, trend: 'up',
    status: 'Excelling', subject: 'Biology', attendance: 98, assignments: 100, growth: 6.2,
    sparkline: [88, 90, 89, 92, 93, 94],
    weeklyGrades: [82, 85, 87, 89, 91, 92, 93, 94],
    subjects: [{ name: 'Biology', score: 96 }, { name: 'Math', score: 91 }, { name: 'English', score: 94 }, { name: 'History', score: 88 }],
    recentAssessments: [
      { name: 'Cell Biology Quiz', score: 97, date: 'Aug 15' },
      { name: 'Genetics Test', score: 93, date: 'Aug 10' },
      { name: 'Lab Report #4', score: 96, date: 'Aug 5' },
    ],
  },
  {
    id: 2, name: 'Noah Williams', initials: 'NW', grade: 88, trend: 'up',
    status: 'Excelling', subject: 'Math', attendance: 95, assignments: 96, growth: 4.8,
    sparkline: [82, 83, 85, 86, 87, 88],
    weeklyGrades: [76, 79, 81, 83, 85, 86, 87, 88],
    subjects: [{ name: 'Biology', score: 84 }, { name: 'Math', score: 92 }, { name: 'English', score: 86 }, { name: 'History', score: 89 }],
    recentAssessments: [
      { name: 'Algebra II Midterm', score: 91, date: 'Aug 14' },
      { name: 'Functions Quiz', score: 89, date: 'Aug 9' },
      { name: 'Problem Set 7', score: 88, date: 'Aug 3' },
    ],
  },
  {
    id: 3, name: 'Sophia Chen', initials: 'SC', grade: 92, trend: 'up',
    status: 'Excelling', subject: 'English', attendance: 100, assignments: 100, growth: 5.5,
    sparkline: [85, 87, 88, 90, 91, 92],
    weeklyGrades: [80, 82, 85, 87, 88, 90, 91, 92],
    subjects: [{ name: 'Biology', score: 89 }, { name: 'Math', score: 88 }, { name: 'English', score: 97 }, { name: 'History', score: 90 }],
    recentAssessments: [
      { name: 'Literary Analysis', score: 96, date: 'Aug 16' },
      { name: 'Poetry Essay', score: 94, date: 'Aug 11' },
      { name: 'Reading Comp', score: 92, date: 'Aug 6' },
    ],
  },
  {
    id: 4, name: 'Liam Rodriguez', initials: 'LR', grade: 79, trend: 'up',
    status: 'On Track', subject: 'History', attendance: 92, assignments: 88, growth: 3.1,
    sparkline: [74, 75, 76, 77, 78, 79],
    weeklyGrades: [70, 72, 73, 75, 76, 77, 78, 79],
    subjects: [{ name: 'Biology', score: 76 }, { name: 'Math', score: 74 }, { name: 'English', score: 82 }, { name: 'History', score: 83 }],
    recentAssessments: [
      { name: 'Civil War Quiz', score: 81, date: 'Aug 13' },
      { name: 'Document Analysis', score: 79, date: 'Aug 8' },
      { name: 'Chapter 12 Test', score: 77, date: 'Aug 2' },
    ],
  },
  {
    id: 5, name: 'Ava Patel', initials: 'AP', grade: 85, trend: 'flat',
    status: 'On Track', subject: 'Biology', attendance: 96, assignments: 92, growth: 1.8,
    sparkline: [83, 84, 85, 84, 85, 85],
    weeklyGrades: [78, 80, 81, 82, 84, 84, 85, 85],
    subjects: [{ name: 'Biology', score: 88 }, { name: 'Math', score: 83 }, { name: 'English', score: 85 }, { name: 'History', score: 84 }],
    recentAssessments: [
      { name: 'Ecosystems Quiz', score: 87, date: 'Aug 15' },
      { name: 'Bio Lab #5', score: 85, date: 'Aug 10' },
      { name: 'Chapter 9 Test', score: 84, date: 'Aug 4' },
    ],
  },
  {
    id: 6, name: 'James Thompson', initials: 'JT', grade: 63, trend: 'down',
    status: 'At Risk', subject: 'Math', attendance: 78, assignments: 71, growth: -2.3,
    sparkline: [68, 67, 66, 65, 64, 63],
    weeklyGrades: [68, 67, 66, 65, 65, 64, 64, 63],
    subjects: [{ name: 'Biology', score: 65 }, { name: 'Math', score: 58 }, { name: 'English', score: 68 }, { name: 'History', score: 62 }],
    recentAssessments: [
      { name: 'Algebra II Midterm', score: 61, date: 'Aug 14' },
      { name: 'Functions Quiz', score: 64, date: 'Aug 9' },
      { name: 'Problem Set 7', score: 66, date: 'Aug 3' },
    ],
  },
  {
    id: 7, name: 'Mia Garcia', initials: 'MG', grade: 82, trend: 'up',
    status: 'On Track', subject: 'English', attendance: 94, assignments: 90, growth: 2.9,
    sparkline: [77, 78, 79, 80, 81, 82],
    weeklyGrades: [73, 75, 77, 78, 79, 80, 81, 82],
    subjects: [{ name: 'Biology', score: 80 }, { name: 'Math', score: 79 }, { name: 'English', score: 87 }, { name: 'History', score: 83 }],
    recentAssessments: [
      { name: 'Literary Analysis', score: 85, date: 'Aug 16' },
      { name: 'Grammar Test', score: 83, date: 'Aug 11' },
      { name: 'Short Story', score: 82, date: 'Aug 5' },
    ],
  },
  {
    id: 8, name: 'Ethan Park', initials: 'EP', grade: 71, trend: 'down',
    status: 'At Risk', subject: 'History', attendance: 85, assignments: 80, growth: -1.1,
    sparkline: [74, 73, 73, 72, 71, 71],
    weeklyGrades: [75, 74, 73, 73, 72, 72, 71, 71],
    subjects: [{ name: 'Biology', score: 70 }, { name: 'Math', score: 68 }, { name: 'English', score: 74 }, { name: 'History', score: 72 }],
    recentAssessments: [
      { name: 'Civil War Quiz', score: 72, date: 'Aug 13' },
      { name: 'Document Analysis', score: 70, date: 'Aug 8' },
      { name: 'Chapter 12 Test', score: 73, date: 'Aug 2' },
    ],
  },
]

/* ─────────────────────────────────────────────────────────────
   Bar Chart (animated from bottom)
───────────────────────────────────────────────────────────── */
const CHART_W = 600
const CHART_H = 180
const CHART_PAD_L = 36
const CHART_PAD_B = 28
const CHART_PAD_T = 12
const CHART_PAD_R = 12
const PLOT_W = CHART_W - CHART_PAD_L - CHART_PAD_R
const PLOT_H = CHART_H - CHART_PAD_T - CHART_PAD_B

function valueToY(v: number): number {
  const min = 60, max = 100
  return CHART_PAD_T + PLOT_H - ((v - min) / (max - min)) * PLOT_H
}

function ClassBarChart() {
  const barCount = classAvgScores.length
  const groupW = PLOT_W / barCount
  const barW = Math.max(groupW * 0.55, 8)

  return (
    <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} className="w-full h-auto">
      {/* Y-axis grid lines */}
      {[60, 70, 80, 90, 100].map(v => {
        const y = valueToY(v)
        return (
          <g key={v}>
            <line x1={CHART_PAD_L} y1={y} x2={CHART_W - CHART_PAD_R} y2={y}
              stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
            <text x={CHART_PAD_L - 6} y={y + 4} fontSize={9} fill="rgba(255,255,255,0.3)"
              textAnchor="end">{v}</text>
          </g>
        )
      })}

      {/* Bars */}
      {classAvgScores.map((score, i) => {
        const x = CHART_PAD_L + i * groupW + (groupW - barW) / 2
        const baseY = CHART_PAD_T + PLOT_H
        const bh = ((score - 60) / (100 - 60)) * PLOT_H

        return (
          <g key={i}>
            {/* Bar background */}
            <rect x={x} y={CHART_PAD_T} width={barW} height={PLOT_H}
              rx={4} fill="rgba(255,255,255,0.03)" />
            {/* Animated bar */}
            <motion.rect
              x={x} width={barW} rx={4}
              fill={score >= 85 ? '#6366f1' : score >= 75 ? '#22d3ee' : '#f59e0b'}
              fillOpacity={0.85}
              initial={{ y: baseY, height: 0 }}
              animate={{ y: baseY - bh, height: bh }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            />
            {/* Score label on top */}
            <motion.text
              x={x + barW / 2} fontSize={9} fill="rgba(255,255,255,0.6)"
              textAnchor="middle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.08 + 0.6 }}
            >
              <animate
                attributeName="y"
                from={String(baseY - 4)}
                to={String(baseY - bh - 5)}
                dur="0.7s"
                begin={`${i * 0.08}s`}
                fill="freeze"
              />
              {score}
            </motion.text>
            {/* Week label */}
            <text x={x + barW / 2} y={CHART_H - 6} fontSize={9}
              fill="rgba(255,255,255,0.4)" textAnchor="middle">
              {weekLabels[i]}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

/* ─────────────────────────────────────────────────────────────
   Sparkline
───────────────────────────────────────────────────────────── */
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const w = 60, h = 24, pad = 2
  const min = Math.min(...data), max = Math.max(...data)
  const range = max - min || 1
  const pts = data.map((v, i) => ({
    x: pad + (i / (data.length - 1)) * (w - pad * 2),
    y: h - pad - ((v - min) / range) * (h - pad * 2),
  }))
  let d = `M ${pts[0].x} ${pts[0].y}`
  for (let i = 1; i < pts.length; i++) {
    const cpx = (pts[i].x + pts[i - 1].x) / 2
    d += ` C ${cpx} ${pts[i - 1].y} ${cpx} ${pts[i].y} ${pts[i].x} ${pts[i].y}`
  }
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <path d={d} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <circle cx={pts[pts.length - 1].x} cy={pts[pts.length - 1].y} r={2} fill={color} />
    </svg>
  )
}

/* ─────────────────────────────────────────────────────────────
   Grade Trend Line (drawer)
───────────────────────────────────────────────────────────── */
function GradeTrendChart({ data }: { data: number[] }) {
  const w = 320, h = 100, padL = 28, padB = 20, padT = 8, padR = 8
  const plotW = w - padL - padR
  const plotH = h - padT - padB
  const min = 60, max = 100
  const pts = data.map((v, i) => ({
    x: padL + (i / (data.length - 1)) * plotW,
    y: padT + plotH - ((v - min) / (max - min)) * plotH,
  }))
  let line = `M ${pts[0].x} ${pts[0].y}`
  for (let i = 1; i < pts.length; i++) {
    const cpx = (pts[i].x + pts[i - 1].x) / 2
    line += ` C ${cpx} ${pts[i - 1].y} ${cpx} ${pts[i].y} ${pts[i].x} ${pts[i].y}`
  }
  const area = line + ` L ${pts[pts.length - 1].x} ${padT + plotH} L ${pts[0].x} ${padT + plotH} Z`

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto">
      <defs>
        <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6366f1" stopOpacity={0.25} />
          <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
        </linearGradient>
      </defs>
      {[70, 80, 90].map(v => {
        const y = padT + plotH - ((v - min) / (max - min)) * plotH
        return (
          <g key={v}>
            <line x1={padL} y1={y} x2={w - padR} y2={y}
              stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
            <text x={padL - 4} y={y + 4} fontSize={8} fill="rgba(255,255,255,0.3)" textAnchor="end">{v}</text>
          </g>
        )
      })}
      <path d={area} fill="url(#trendGrad)" />
      <path d={line} fill="none" stroke="#6366f1" strokeWidth={2} strokeLinecap="round" />
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={3} fill="#6366f1"
          stroke="rgba(24,28,42,1)" strokeWidth={1.5} />
      ))}
      {weekLabels.map((lbl, i) => (
        <text key={i} x={pts[i].x} y={h - 4} fontSize={7.5}
          fill="rgba(255,255,255,0.35)" textAnchor="middle">{lbl}</text>
      ))}
    </svg>
  )
}

/* ─────────────────────────────────────────────────────────────
   Subject Bar Chart (drawer)
───────────────────────────────────────────────────────────── */
function SubjectBarChart({ subjects }: { subjects: { name: string; score: number }[] }) {
  const w = 320, h = 110, padL = 54, padB = 12, padT = 8, padR = 16
  const plotW = w - padL - padR
  const barH = 14
  const gap = (h - padT - padB - subjects.length * barH) / (subjects.length - 1 || 1)
  const colors = ['#6366f1', '#22d3ee', '#10b981', '#f59e0b']

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto">
      {subjects.map((s, i) => {
        const y = padT + i * (barH + gap)
        const bw = (s.score / 100) * plotW
        const baseX = padL
        return (
          <g key={s.name}>
            <text x={baseX - 4} y={y + barH / 2 + 4} fontSize={9}
              fill="rgba(255,255,255,0.5)" textAnchor="end">{s.name}</text>
            <rect x={baseX} y={y} width={plotW} height={barH} rx={4}
              fill="rgba(255,255,255,0.05)" />
            <motion.rect
              x={baseX} y={y} height={barH} rx={4}
              fill={colors[i % colors.length]} fillOpacity={0.8}
              initial={{ width: 0 }}
              animate={{ width: bw }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            />
            <text x={baseX + bw + 4} y={y + barH / 2 + 4} fontSize={9}
              fill="rgba(255,255,255,0.7)">{s.score}%</text>
          </g>
        )
      })}
    </svg>
  )
}

/* ─────────────────────────────────────────────────────────────
   Status Badge
───────────────────────────────────────────────────────────── */
function StatusBadge({ status }: { status: Student['status'] }) {
  const map: Record<Student['status'], { bg: string; text: string; dot: string }> = {
    Excelling: { bg: 'rgba(16,185,129,0.12)', text: '#10b981', dot: '#10b981' },
    'On Track': { bg: 'rgba(34,211,238,0.10)', text: '#22d3ee', dot: '#22d3ee' },
    'At Risk':  { bg: 'rgba(239,68,68,0.12)',  text: '#ef4444', dot: '#ef4444' },
  }
  const s = map[status]
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={{ background: s.bg, color: s.text }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.dot }} />
      {status}
    </span>
  )
}

/* ─────────────────────────────────────────────────────────────
   Trend Icon
───────────────────────────────────────────────────────────── */
function TrendIcon({ trend }: { trend: Student['trend'] }) {
  if (trend === 'up')   return <ArrowUp size={14} className="text-emerald-400" />
  if (trend === 'down') return <ArrowDown size={14} className="text-red-400" />
  return <Minus size={14} className="text-surface-400" />
}

/* ─────────────────────────────────────────────────────────────
   Student Detail Drawer
───────────────────────────────────────────────────────────── */
function StudentDrawer({ student, onClose }: { student: Student; onClose: () => void }) {
  const miniStats = [
    { label: 'Overall Grade', value: `${student.grade}%`, icon: Star,   color: '#6366f1' },
    { label: 'Assignments',   value: `${student.assignments}%`, icon: BookOpen, color: '#22d3ee' },
    { label: 'Attendance',    value: `${student.attendance}%`, icon: Calendar, color: '#10b981' },
    { label: 'Growth',        value: `${student.growth > 0 ? '+' : ''}${student.growth}%`, icon: TrendingUp, color: student.growth >= 0 ? '#10b981' : '#ef4444' },
  ]

  return (
    <motion.div
      className="fixed inset-0 z-50 flex justify-end"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0"
        style={{ background: 'rgba(0,0,0,0.5)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      {/* Drawer panel */}
      <motion.div
        className="relative w-full max-w-md h-full overflow-y-auto flex flex-col"
        style={{
          background: 'rgba(18, 20, 32, 0.97)',
          borderLeft: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(24px)',
        }}
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg"
              style={{ background: 'linear-gradient(135deg, #6366f1, #a78bfa)' }}>
              {student.initials}
            </div>
            <div>
              <h2 className="text-surface-100 font-semibold text-base">{student.name}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-surface-400 text-xs">{student.subject}</span>
                <StatusBadge status={student.status} />
              </div>
            </div>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-surface-400 hover:text-white transition-colors"
            style={{ background: 'rgba(255,255,255,0.05)' }}>
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Mini stat cards */}
          <div className="grid grid-cols-2 gap-3">
            {miniStats.map((s) => {
              const Icon = s.icon
              return (
                <div key={s.label} className="glass-card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon size={14} style={{ color: s.color }} />
                    <span className="text-surface-400 text-xs">{s.label}</span>
                  </div>
                  <p className="text-surface-100 text-xl font-bold">{s.value}</p>
                </div>
              )
            })}
          </div>

          {/* Grade trend */}
          <div className="glass-card p-4">
            <h3 className="text-surface-200 text-sm font-semibold mb-3">Grade Trend (8 Weeks)</h3>
            <GradeTrendChart data={student.weeklyGrades} />
          </div>

          {/* Subject breakdown */}
          <div className="glass-card p-4">
            <h3 className="text-surface-200 text-sm font-semibold mb-3">Subject Breakdown</h3>
            <SubjectBarChart subjects={student.subjects} />
          </div>

          {/* Recent assessments */}
          <div className="glass-card p-4">
            <h3 className="text-surface-200 text-sm font-semibold mb-3">Recent Assessments</h3>
            <div className="space-y-2">
              {student.recentAssessments.map((a, i) => {
                const color = a.score >= 90 ? '#10b981' : a.score >= 75 ? '#22d3ee' : '#f59e0b'
                return (
                  <div key={i} className="flex items-center justify-between py-2"
                    style={{ borderBottom: i < student.recentAssessments.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                    <div>
                      <p className="text-surface-200 text-sm">{a.name}</p>
                      <p className="text-surface-500 text-xs">{a.date}</p>
                    </div>
                    <span className="text-sm font-bold" style={{ color }}>{a.score}%</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────────
   Page
───────────────────────────────────────────────────────────── */
export default function ProgressMonitorPage() {
  const [subjectFilter, setSubjectFilter] = useState<SubjectFilter>('All')
  const [statusFilter,  setStatusFilter]  = useState<StatusFilter>('All')
  const [gradeMin,      setGradeMin]      = useState(0)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [toastMsg, setToastMsg] = useState('')
  const showToast = (msg: string) => { setToastMsg(msg); setTimeout(() => setToastMsg(''), 2500) }

  const subjects: SubjectFilter[] = ['All', 'Biology', 'Math', 'English', 'History']
  const statuses: StatusFilter[]  = ['All', 'Excelling', 'On Track', 'At Risk']

  const filtered = STUDENTS.filter(s => {
    if (subjectFilter !== 'All' && s.subject !== subjectFilter) return false
    if (statusFilter  !== 'All' && s.status  !== statusFilter)  return false
    if (s.grade < gradeMin) return false
    return true
  })

  const statCards = [
    {
      label: 'Class Average',
      value: '81%',
      sub: '+2.4% from last month',
      icon: TrendingUp,
      color: '#6366f1',
      bg: 'rgba(99,102,241,0.10)',
    },
    {
      label: 'Students on Track',
      value: '18/24',
      sub: '75% of class performing well',
      icon: CheckCircle2,
      color: '#10b981',
      bg: 'rgba(16,185,129,0.10)',
    },
    {
      label: 'Growth Rate',
      value: '+4.2%',
      sub: 'Avg improvement this quarter',
      icon: Activity,
      color: '#22d3ee',
      bg: 'rgba(34,211,238,0.10)',
    },
    {
      label: 'Assessment Completion',
      value: '96%',
      sub: '2 students missing submissions',
      icon: Award,
      color: '#f59e0b',
      bg: 'rgba(245,158,11,0.10)',
    },
  ]

  return (
    <div className="min-h-screen bg-surface-950 text-surface-200">
      {toastMsg && (
        <div className="fixed top-4 right-4 z-50 px-4 py-2.5 rounded-xl bg-surface-800 border border-white/[0.1] shadow-2xl text-sm font-semibold text-white">
          {toastMsg}
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* ── Hero header ─────────────────────────────────────────── */}
        <FadeUp>
          <div className="hero-mesh rounded-2xl p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(34,211,238,0.1))', border: '1px solid rgba(99,102,241,0.2)' }}>
                  <TrendingUp size={26} style={{ color: '#6366f1' }} />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-surface-50">
                    Progress Monitor
                  </h1>
                  <p className="text-surface-400 text-sm mt-1">
                    Track student performance, trends, and growth across all subjects
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => showToast('Progress report exported!')} className="btn-secondary">
                  <Download size={15} />
                  Export Report
                </button>
                <button onClick={() => showToast('New assessment form opened!')} className="btn-gradient">
                  <Plus size={15} />
                  Add Assessment
                </button>
              </div>
            </div>
          </div>
        </FadeUp>

        {/* ── Stat cards ──────────────────────────────────────────── */}
        <StaggerList className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card, i) => {
            const Icon = card.icon
            return (
              <StaggerItem key={card.label} variants={fadeUp}>
                <div className="stat-card">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: card.bg }}>
                      <Icon size={18} style={{ color: card.color }} />
                    </div>
                    <ChevronRight size={14} className="text-surface-600 mt-1" />
                  </div>
                  <p className="text-2xl font-bold text-surface-50 mb-1">{card.value}</p>
                  <p className="text-xs text-surface-400 font-medium mb-0.5">{card.label}</p>
                  <p className="text-xs text-surface-500">{card.sub}</p>
                </div>
              </StaggerItem>
            )
          })}
        </StaggerList>

        {/* ── Class progress chart ─────────────────────────────────── */}
        <FadeInWhenVisible>
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-surface-100 font-semibold text-lg">Class Progress Chart</h2>
                <p className="text-surface-500 text-xs mt-0.5">Weekly average assessment scores — 8 weeks</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-xs text-surface-400">
                  <span className="w-3 h-3 rounded-sm" style={{ background: '#6366f1' }} /> ≥85
                </span>
                <span className="flex items-center gap-1.5 text-xs text-surface-400">
                  <span className="w-3 h-3 rounded-sm" style={{ background: '#22d3ee' }} /> 75–84
                </span>
                <span className="flex items-center gap-1.5 text-xs text-surface-400">
                  <span className="w-3 h-3 rounded-sm" style={{ background: '#f59e0b' }} /> &lt;75
                </span>
              </div>
            </div>
            <ClassBarChart />
          </div>
        </FadeInWhenVisible>

        {/* ── Filters ──────────────────────────────────────────────── */}
        <FadeInWhenVisible delay={0.05}>
          <div className="glass-card p-4">
            <div className="flex flex-wrap items-center gap-4">
              {/* Subject pills */}
              <div className="flex items-center gap-2">
                <Filter size={14} className="text-surface-500" />
                <span className="text-surface-400 text-xs font-medium">Subject:</span>
                <div className="flex gap-1.5 flex-wrap">
                  {subjects.map(s => (
                    <button
                      key={s}
                      onClick={() => setSubjectFilter(s)}
                      className="px-3 py-1 rounded-full text-xs font-medium transition-all duration-200"
                      style={subjectFilter === s
                        ? { background: 'rgba(99,102,241,0.2)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.3)' }
                        : { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.07)' }
                      }
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status pills */}
              <div className="flex items-center gap-2">
                <span className="text-surface-400 text-xs font-medium">Status:</span>
                <div className="flex gap-1.5 flex-wrap">
                  {statuses.map(s => (
                    <button
                      key={s}
                      onClick={() => setStatusFilter(s)}
                      className="px-3 py-1 rounded-full text-xs font-medium transition-all duration-200"
                      style={statusFilter === s
                        ? { background: 'rgba(99,102,241,0.2)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.3)' }
                        : { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.07)' }
                      }
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grade range */}
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-surface-400 text-xs font-medium">Min Grade:</span>
                <select
                  value={gradeMin}
                  onChange={e => setGradeMin(Number(e.target.value))}
                  className="text-xs rounded-lg px-2 py-1.5 text-surface-200 outline-none"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  {[0, 60, 70, 80, 90].map(v => (
                    <option key={v} value={v} style={{ background: '#181c2a' }}>
                      {v === 0 ? 'Any' : `${v}%+`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </FadeInWhenVisible>

        {/* ── Student progress table ───────────────────────────────── */}
        <FadeInWhenVisible delay={0.08}>
          <div className="glass-card overflow-hidden">
            <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center justify-between">
                <h2 className="text-surface-100 font-semibold text-lg">Student Progress</h2>
                <span className="text-surface-400 text-xs">{filtered.length} student{filtered.length !== 1 ? 's' : ''}</span>
              </div>
            </div>

            {/* Table header */}
            <div className="hidden lg:grid px-6 py-2.5 text-xs font-medium text-surface-500 uppercase tracking-wide"
              style={{
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                gridTemplateColumns: '2fr 80px 40px 120px 100px 70px 100px',
                gap: '16px',
              }}>
              <span>Student</span>
              <span>Grade</span>
              <span>Trend</span>
              <span>Progress</span>
              <span>Status</span>
              <span>Trend</span>
              <span>Actions</span>
            </div>

            <AnimatePresence mode="popLayout">
              {filtered.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="px-6 py-12 text-center"
                >
                  <User size={32} className="text-surface-600 mx-auto mb-3" />
                  <p className="text-surface-400 text-sm">No students match the current filters.</p>
                </motion.div>
              ) : (
                filtered.map((student, idx) => {
                  const gradeColor =
                    student.grade >= 90 ? '#10b981'
                    : student.grade >= 80 ? '#22d3ee'
                    : student.grade >= 70 ? '#f59e0b'
                    : '#ef4444'
                  const sparkColor =
                    student.trend === 'up' ? '#10b981'
                    : student.trend === 'down' ? '#ef4444'
                    : '#6366f1'

                  return (
                    <motion.div
                      key={student.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ delay: idx * 0.04, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="px-6 py-4 hover:bg-white/[0.02] transition-colors"
                      style={{ borderBottom: idx < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                    >
                      {/* Mobile layout */}
                      <div className="flex items-start gap-4 lg:hidden">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                          style={{ background: 'linear-gradient(135deg, #6366f1, #a78bfa)' }}>
                          {student.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-surface-100 font-medium text-sm truncate">{student.name}</p>
                            <span className="font-bold text-sm ml-2" style={{ color: gradeColor }}>{student.grade}%</span>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <StatusBadge status={student.status} />
                            <span className="text-surface-500 text-xs">{student.subject}</span>
                          </div>
                          <div className="mt-2 flex items-center gap-3">
                            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                              <motion.div
                                className="h-full rounded-full"
                                style={{ background: gradeColor }}
                                initial={{ width: 0 }}
                                animate={{ width: `${student.grade}%` }}
                                transition={{ duration: 0.6, delay: idx * 0.05, ease: [0.22, 1, 0.36, 1] }}
                              />
                            </div>
                            <button
                              onClick={() => setSelectedStudent(student)}
                              className="btn-secondary text-xs px-3 py-1.5"
                              style={{ borderRadius: '10px' }}
                            >
                              Details
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Desktop grid layout */}
                      <div className="hidden lg:grid items-center"
                        style={{
                          gridTemplateColumns: '2fr 80px 40px 120px 100px 70px 100px',
                          gap: '16px',
                        }}>
                        {/* Avatar + name */}
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                            style={{ background: 'linear-gradient(135deg, #6366f1, #a78bfa)' }}>
                            {student.initials}
                          </div>
                          <div className="min-w-0">
                            <p className="text-surface-100 font-medium text-sm truncate">{student.name}</p>
                            <p className="text-surface-500 text-xs">{student.subject}</p>
                          </div>
                        </div>

                        {/* Grade */}
                        <span className="font-bold text-sm" style={{ color: gradeColor }}>{student.grade}%</span>

                        {/* Trend arrow */}
                        <div className="flex items-center">
                          <TrendIcon trend={student.trend} />
                        </div>

                        {/* Progress bar */}
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                          <motion.div
                            className="h-full rounded-full"
                            style={{ background: gradeColor }}
                            initial={{ width: 0 }}
                            animate={{ width: `${student.grade}%` }}
                            transition={{ duration: 0.6, delay: idx * 0.05 + 0.2, ease: [0.22, 1, 0.36, 1] }}
                          />
                        </div>

                        {/* Status badge */}
                        <div>
                          <StatusBadge status={student.status} />
                        </div>

                        {/* Sparkline */}
                        <Sparkline data={student.sparkline} color={sparkColor} />

                        {/* Action */}
                        <button
                          onClick={() => setSelectedStudent(student)}
                          className="btn-secondary text-xs whitespace-nowrap"
                          style={{ padding: '6px 12px', borderRadius: '10px' }}
                        >
                          View Details
                        </button>
                      </div>
                    </motion.div>
                  )
                })
              )}
            </AnimatePresence>
          </div>
        </FadeInWhenVisible>

        {/* ── Quick summary footer ─────────────────────────────────── */}
        <FadeInWhenVisible delay={0.1}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Excelling Students', count: STUDENTS.filter(s => s.status === 'Excelling').length, color: '#10b981', icon: Star },
              { label: 'On Track', count: STUDENTS.filter(s => s.status === 'On Track').length, color: '#22d3ee', icon: CheckCircle2 },
              { label: 'Needs Attention', count: STUDENTS.filter(s => s.status === 'At Risk').length, color: '#ef4444', icon: AlertTriangle },
            ].map(item => {
              const Icon = item.icon
              return (
                <div key={item.label} className="glass-card p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${item.color}18` }}>
                    <Icon size={18} style={{ color: item.color }} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-surface-50">{item.count}</p>
                    <p className="text-xs text-surface-400">{item.label}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </FadeInWhenVisible>

      </div>

      {/* ── Student detail drawer ────────────────────────────────── */}
      <AnimatePresence>
        {selectedStudent && (
          <StudentDrawer
            student={selectedStudent}
            onClose={() => setSelectedStudent(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
