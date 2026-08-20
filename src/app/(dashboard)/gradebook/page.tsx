'use client'
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen, ChevronDown, Download, Filter, Plus, Search,
  TrendingUp, TrendingDown, Minus, Sparkles,
  AlertTriangle, Brain, Users, Award, BarChart2, CheckCircle,
  ChevronRight, FileText, Eye, X, Star, Flag, Clock,
  ChevronLeft, Info, Edit3, Percent, Save,
  MessageSquare, Bell, ArrowUp, ArrowDown, Target,
  PieChart, List, Grid, SortAsc, Layers
} from 'lucide-react'
import { FadeUp, FadeInWhenVisible } from '@/components/ui/motion'

type GradeView = 'grid' | 'list' | 'analysis'
type SortKey = 'name' | 'overall' | 'trend'

interface Assignment {
  id: string
  name: string
  type: 'Essay' | 'Quiz' | 'Lab' | 'Exam' | 'Project' | 'Homework'
  maxScore: number
  weight: number
  dueDate: string
  category: string
}

interface StudentRecord {
  id: string
  name: string
  avatar: string
  scores: (number | null)[]
  trend: 'up' | 'down' | 'flat'
  notes: string
  iep: boolean
  missingCount: number
}

const classes = ['All Classes', 'AP Biology', '10th English', 'Algebra II', 'World History']

const categories = [
  { name: 'Tests & Exams', weight: 40, color: '#ef4444' },
  { name: 'Labs & Projects', weight: 30, color: '#6366f1' },
  { name: 'Quizzes', weight: 20, color: '#f97316' },
  { name: 'Homework', weight: 10, color: '#22d3ee' },
]

const assignments: Assignment[] = [
  { id: '1', name: 'Essay: The Great Gatsby', type: 'Essay', maxScore: 100, weight: 20, dueDate: 'Jul 10', category: 'Labs & Projects' },
  { id: '2', name: 'Ch. 5 Quiz', type: 'Quiz', maxScore: 50, weight: 10, dueDate: 'Jul 8', category: 'Quizzes' },
  { id: '3', name: 'Lab Report: Photosynthesis', type: 'Lab', maxScore: 75, weight: 15, dueDate: 'Jul 5', category: 'Labs & Projects' },
  { id: '4', name: 'Midterm Exam', type: 'Exam', maxScore: 200, weight: 30, dueDate: 'Jun 28', category: 'Tests & Exams' },
  { id: '5', name: 'Group Presentation', type: 'Project', maxScore: 100, weight: 15, dueDate: 'Jun 25', category: 'Labs & Projects' },
  { id: '6', name: 'Homework Ch.4', type: 'Homework', maxScore: 20, weight: 10, dueDate: 'Jun 20', category: 'Homework' },
]

const students: StudentRecord[] = [
  { id: '1', name: 'Emma Wilson', avatar: 'EW', scores: [92, 45, 68, 178, 88, 19], trend: 'up', notes: '', iep: false, missingCount: 0 },
  { id: '2', name: 'Liam Chen', avatar: 'LC', scores: [88, 48, 72, 185, 95, 20], trend: 'up', notes: '', iep: false, missingCount: 0 },
  { id: '3', name: 'Sofia Rodriguez', avatar: 'SR', scores: [78, 38, 60, 145, 82, 16], trend: 'down', notes: 'Parent conference scheduled for Aug 5.', iep: true, missingCount: 1 },
  { id: '4', name: 'Noah Thompson', avatar: 'NT', scores: [95, 50, 74, 192, 91, 20], trend: 'up', notes: '', iep: false, missingCount: 0 },
  { id: '5', name: 'Ava Patel', avatar: 'AP', scores: [85, 42, 65, 168, 87, 18], trend: 'flat', notes: '', iep: false, missingCount: 0 },
  { id: '6', name: 'Mason Kim', avatar: 'MK', scores: [72, 35, 55, 130, 76, 14], trend: 'down', notes: 'Struggling with lab reports. Needs extra support.', iep: true, missingCount: 2 },
  { id: '7', name: 'Isabella Jones', avatar: 'IJ', scores: [90, 47, 70, 180, 93, 19], trend: 'up', notes: '', iep: false, missingCount: 0 },
  { id: '8', name: 'Ethan Davis', avatar: 'ED', scores: [82, 40, 62, 155, 80, 17], trend: 'flat', notes: '', iep: false, missingCount: 0 },
]

const aiInsights = [
  { id: '1', type: 'warning', icon: AlertTriangle, color: '#f59e0b', title: '2 students at risk of failing', desc: 'Sofia Rodriguez (71%) and Mason Kim (68%) are below the 75% threshold. Consider early intervention before the next assessment cycle.', action: 'View Intervention Plan' },
  { id: '2', type: 'info', icon: BarChart2, color: '#6366f1', title: 'Midterm had lowest class average (87.6%)', desc: 'Most points were lost on questions 15–22 (organic chemistry). A targeted 20-min review session could recover 3–5% for struggling students.', action: 'Generate Review Lesson' },
  { id: '3', type: 'success', icon: Award, color: '#10b981', title: 'Top performers showing consistent growth', desc: 'Noah Thompson and Emma Wilson have improved on each of the last 4 assignments. Recommend enrichment materials to keep engagement high.', action: 'View Enrichment Ideas' },
]

const gradeScale = [
  { letter: 'A+', min: 97, color: '#10b981' },
  { letter: 'A',  min: 93, color: '#10b981' },
  { letter: 'A-', min: 90, color: '#10b981' },
  { letter: 'B+', min: 87, color: '#22d3ee' },
  { letter: 'B',  min: 83, color: '#22d3ee' },
  { letter: 'B-', min: 80, color: '#22d3ee' },
  { letter: 'C+', min: 77, color: '#f59e0b' },
  { letter: 'C',  min: 73, color: '#f59e0b' },
  { letter: 'C-', min: 70, color: '#f59e0b' },
  { letter: 'D',  min: 60, color: '#f97316' },
  { letter: 'F',  min: 0,  color: '#ef4444' },
]

const assignmentTypeColors: Record<string, string> = {
  Essay: '#8b5cf6', Quiz: '#f97316', Lab: '#14b8a6',
  Exam: '#ef4444', Project: '#6366f1', Homework: '#22d3ee',
}

function getLetterGrade(pct: number): { letter: string; color: string } {
  const entry = gradeScale.find(g => pct >= g.min)
  return entry ?? { letter: 'F', color: '#ef4444' }
}

function getOverallPct(scores: (number | null)[]): number {
  let totalWeighted = 0
  let totalWeight = 0
  scores.forEach((score, i) => {
    if (score !== null) {
      totalWeighted += (score / assignments[i].maxScore) * assignments[i].weight
      totalWeight += assignments[i].weight
    }
  })
  return totalWeight > 0 ? (totalWeighted / totalWeight) * 100 : 0
}

export default function GradebookPage() {
  const [selectedClass, setSelectedClass] = useState('All Classes')
  const [search, setSearch] = useState('')
  const [showInsights, setShowInsights] = useState(true)
  const [editingCell, setEditingCell] = useState<string | null>(null)
  const [gradeView, setGradeView] = useState<GradeView>('grid')
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortAsc, setSortAsc] = useState(true)
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null)
  const [showWeightPanel, setShowWeightPanel] = useState(false)
  const [curveAmount, setCurveAmount] = useState(0)
  const [localScores, setLocalScores] = useState<Record<string, (number | null)[]>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('taleeko_gradebook_scores')
        if (saved) return JSON.parse(saved)
      } catch {}
    }
    return Object.fromEntries(students.map(s => [s.id, s.scores]))
  })
  const [toastMsg, setToastMsg] = useState('')
  function showToast(msg: string) { setToastMsg(msg); setTimeout(() => setToastMsg(''), 2500) }

  const filteredStudents = useMemo(() => {
    let list = students.filter(s =>
      s.name.toLowerCase().includes(search.toLowerCase())
    )
    list = [...list].sort((a, b) => {
      if (sortKey === 'name') return sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      if (sortKey === 'overall') {
        const da = getOverallPct(localScores[a.id])
        const db = getOverallPct(localScores[b.id])
        return sortAsc ? da - db : db - da
      }
      if (sortKey === 'trend') {
        const order = { up: 2, flat: 1, down: 0 }
        return sortAsc ? order[a.trend] - order[b.trend] : order[b.trend] - order[a.trend]
      }
      return 0
    })
    return list
  }, [search, sortKey, sortAsc, localScores])

  const classAvg = Math.round(
    students.reduce((acc, s) => acc + getOverallPct(localScores[s.id]), 0) / students.length
  )

  const atRisk = students.filter(s => getOverallPct(localScores[s.id]) < 75).length
  const passing = students.filter(s => getOverallPct(localScores[s.id]) >= 70).length
  const missing = students.reduce((acc, s) => acc + s.missingCount, 0)
  const iepCount = students.filter(s => s.iep).length

  const gradeDist = gradeScale.slice(0, -1).map(g => {
    const count = students.filter(s => {
      const pct = getOverallPct(localScores[s.id])
      const next = gradeScale[gradeScale.indexOf(g) + 1]
      return pct >= g.min && (!next || pct < next.min + (g.min - next.min))
    }).length
    return { ...g, count }
  })

  const aCount = students.filter(s => getOverallPct(localScores[s.id]) >= 90).length
  const bCount = students.filter(s => { const p = getOverallPct(localScores[s.id]); return p >= 80 && p < 90 }).length
  const cCount = students.filter(s => { const p = getOverallPct(localScores[s.id]); return p >= 70 && p < 80 }).length
  const dCount = students.filter(s => { const p = getOverallPct(localScores[s.id]); return p >= 60 && p < 70 }).length
  const fCount = students.filter(s => getOverallPct(localScores[s.id]) < 60).length

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortAsc(!sortAsc)
    else { setSortKey(key); setSortAsc(true) }
  }

  function updateScore(studentId: string, assignIdx: number, value: number) {
    setLocalScores(prev => {
      const next = { ...prev, [studentId]: [...prev[studentId]] }
      next[studentId][assignIdx] = value
      try { localStorage.setItem('taleeko_gradebook_scores', JSON.stringify(next)) } catch {}
      return next
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <FadeUp>
        <div className="hero-mesh rounded-3xl p-6 border border-white/[0.06]">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)' }}>
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-black text-white tracking-tight">Gradebook</h1>
                  <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-bold border border-amber-500/20">AI-Powered</span>
                </div>
                <p className="text-sm text-surface-400">{students.length} students · {assignments.length} assignments · Class avg {classAvg}%</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-end">
              <div className="flex items-center gap-1 bg-white/[0.06] rounded-full p-0.5">
                {([['grid', Grid], ['list', List], ['analysis', PieChart]] as [GradeView, typeof Grid][]).map(([v, Icon]) => (
                  <button
                    key={v}
                    onClick={() => setGradeView(v)}
                    className={`p-1.5 rounded-full transition-all ${gradeView === v ? 'bg-white/[0.1] text-white' : 'text-surface-500 hover:text-surface-300'}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </button>
                ))}
              </div>
              <button onClick={() => setShowWeightPanel(!showWeightPanel)} className="btn-secondary text-xs px-3 py-1.5">
                <Percent className="w-3.5 h-3.5" /> Weights
              </button>
              <motion.button className="btn-gradient text-xs" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => showToast('AI analysis complete!')}>
                <Sparkles className="w-3.5 h-3.5" /> AI Analysis
              </motion.button>
              <button className="btn-secondary text-xs px-3 py-1.5" onClick={() => showToast('Gradebook exported!')}>
                <Download className="w-3.5 h-3.5" /> Export
              </button>
              <button className="btn-secondary text-xs px-3 py-1.5" onClick={() => showToast('New assignment added!')}>
                <Plus className="w-3.5 h-3.5" /> Assignment
              </button>
            </div>
          </div>
          <div className="border-t border-white/[0.06] pt-4 flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold">Students</span>
              <span className="text-xs font-bold text-white">{students.length}</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold">Class Avg</span>
              <span className="text-xs font-bold text-success-400">{classAvg}%</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold">At Risk</span>
              <span className="text-xs font-bold text-danger-400">{atRisk}</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold">Passing</span>
              <span className="text-xs font-bold text-white">{passing}</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold">Missing</span>
              <span className="text-xs font-bold text-warning-400">{missing}</span>
            </div>
          </div>
        </div>
      </FadeUp>

      {/* Stats */}
      <FadeUp delay={0.04}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Students', value: students.length.toString(), sub: `${iepCount} IEP/504`, icon: Users, color: '#6366f1' },
            { label: 'Class Average', value: `${classAvg}%`, sub: getLetterGrade(classAvg).letter + ' grade', icon: BarChart2, color: '#14b8a6' },
            { label: 'Missing Work', value: missing.toString(), sub: `items across ${students.filter(s => s.missingCount > 0).length} students`, icon: AlertTriangle, color: '#ef4444' },
            { label: 'Passing Rate', value: `${Math.round((passing / students.length) * 100)}%`, sub: `${passing} of ${students.length} students`, icon: CheckCircle, color: '#10b981' },
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

      {/* Grade Distribution Ring Chart */}
      <FadeUp delay={0.07}>
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <PieChart className="w-4 h-4 text-accent-400" /> Grade Distribution
            </h3>
            <span className="text-xs text-surface-500">Current class average: <span className="text-white font-bold">{classAvg}%</span></span>
          </div>
          <div className="flex items-center gap-8 flex-wrap">
            {/* Ring chart */}
            {(() => {
              const getAvg = (scores: (number | null)[]) => {
                const ns = scores.filter((x): x is number => x !== null)
                return ns.length ? Math.round(ns.reduce((a, b) => a + b, 0) / ns.length) : 0
              }
              const gradeGroups = [
                { label: 'A (90–100)', color: '#10b981', count: filteredStudents.filter(s => getAvg(s.scores) >= 90).length },
                { label: 'B (80–89)',  color: '#6366f1', count: filteredStudents.filter(s => { const a = getAvg(s.scores); return a >= 80 && a < 90 }).length },
                { label: 'C (70–79)',  color: '#f97316', count: filteredStudents.filter(s => { const a = getAvg(s.scores); return a >= 70 && a < 80 }).length },
                { label: 'D (60–69)',  color: '#f59e0b', count: filteredStudents.filter(s => { const a = getAvg(s.scores); return a >= 60 && a < 70 }).length },
                { label: 'F (<60)',    color: '#f43f5e', count: filteredStudents.filter(s => getAvg(s.scores) < 60).length },
              ]
              const total = gradeGroups.reduce((a, g) => a + g.count, 0) || 1
              const R = 44, CX = 56, CY = 56, STROKE = 14
              const CIRC = 2 * Math.PI * R
              let offset = 0
              const slices = gradeGroups.map(g => {
                const pct = g.count / total
                const dash = pct * CIRC
                const slice = { ...g, pct, dash, offset }
                offset += dash
                return slice
              })
              return (
                <div className="flex items-center gap-6 flex-wrap">
                  <div className="relative flex-shrink-0" style={{ width: 112, height: 112 }}>
                    <svg width="112" height="112" viewBox="0 0 112 112">
                      <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={STROKE}/>
                      {slices.map((s, i) => (
                        <motion.circle
                          key={i}
                          cx={CX} cy={CY} r={R}
                          fill="none"
                          stroke={s.color}
                          strokeWidth={STROKE}
                          strokeDasharray={`${s.dash} ${CIRC - s.dash}`}
                          strokeDashoffset={CIRC * 0.25 - s.offset}
                          strokeLinecap="round"
                          initial={{ strokeDasharray: `0 ${CIRC}` }}
                          animate={{ strokeDasharray: `${s.dash} ${CIRC - s.dash}` }}
                          transition={{ delay: 0.2 + i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        />
                      ))}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-xl font-black text-white">{classAvg}%</span>
                      <span className="text-[9px] text-surface-500">avg</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-2 flex-1 min-w-[180px]">
                    {slices.map((s, i) => (
                      <motion.div
                        key={i}
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.07 }}
                      >
                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: s.color }}/>
                        <span className="text-[11px] text-surface-400 flex-1">{s.label}</span>
                        <span className="text-xs font-bold text-white w-4 text-right">{s.count}</span>
                        {(() => {
                          const W = 96, H = 6
                          const bw = (s.count / total) * W
                          const gid = `gb-dist-${i}`
                          return (
                            <svg viewBox={`0 0 ${W} ${H}`} width={96} height={6} className="overflow-visible">
                              <defs>
                                <linearGradient id={gid} x1="0" x2="1" y1="0" y2="0">
                                  <stop offset="0%" stopColor={s.color} />
                                  <stop offset="100%" stopColor={s.color + '80'} />
                                </linearGradient>
                              </defs>
                              <rect x={0} y={0} width={W} height={H} rx={3} fill="rgba(255,255,255,0.06)" />
                              <motion.rect
                                x={0} y={0} height={H} rx={3}
                                fill={`url(#${gid})`}
                                initial={{ width: 0 }}
                                animate={{ width: bw }}
                                transition={{ delay: 0.35 + i * 0.07, duration: 0.5 }}
                              />
                            </svg>
                          )
                        })()}
                        <span className="text-[10px] text-surface-500 w-8 text-right">{Math.round(s.pct * 100)}%</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )
            })()}
          </div>
        </div>
      </FadeUp>

      {/* Category Weight Panel */}
      <AnimatePresence>
        {showWeightPanel && (
          <motion.div
            className="glass-card p-5 border border-accent-500/20"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-accent-400" /> Category Weighting
              </h3>
              <button onClick={() => setShowWeightPanel(false)} className="text-surface-500 hover:text-surface-300">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {categories.map((cat, i) => (
                <div key={cat.name} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="text-xs text-surface-300">{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {(() => {
                      const W = 120, H = 10, bw = (cat.weight / 100) * W
                      return (
                        <svg viewBox={`0 0 ${W} ${H}`} className="flex-1 overflow-visible">
                          <defs>
                            <linearGradient id={`gb-cat-${i}`} x1="0" y1="0" x2="1" y2="0">
                              <stop offset="0%" stopColor={cat.color} stopOpacity={0.9} />
                              <stop offset="100%" stopColor={cat.color} stopOpacity={0.55} />
                            </linearGradient>
                          </defs>
                          <rect x={0} y={2} width={W} height={6} rx={3} fill="rgba(255,255,255,0.05)" />
                          <motion.rect x={0} y={2} height={6} rx={3} fill={`url(#gb-cat-${i})`}
                            initial={{ width: 0 }} animate={{ width: bw }}
                            transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                          />
                        </svg>
                      )
                    })()}
                    <span className="text-xs font-black text-white w-10 text-right">{cat.weight}%</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {assignments.filter(a => a.category === cat.name).map(a => (
                      <span key={a.id} className="text-[9px] px-1.5 py-0.5 rounded-md" style={{ backgroundColor: cat.color + '18', color: cat.color }}>
                        {a.type}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-surface-400">Grade Curve:</span>
                <input
                  type="range"
                  min={-5}
                  max={10}
                  value={curveAmount}
                  onChange={e => setCurveAmount(Number(e.target.value))}
                  className="w-24 accent-accent-500"
                />
                <span className={`text-xs font-bold ${curveAmount > 0 ? 'text-success-400' : curveAmount < 0 ? 'text-danger-400' : 'text-surface-400'}`}>
                  {curveAmount > 0 ? '+' : ''}{curveAmount}%
                </span>
              </div>
              <button className="btn-gradient text-xs ml-auto"><Save className="w-3 h-3" /> Save Changes</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Insights */}
      <FadeUp delay={0.07}>
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#6366f1,#a78bfa)' }}>
                <Brain className="w-3.5 h-3.5 text-white" />
              </div>
              <h3 className="text-sm font-bold text-white">AI Grade Insights</h3>
              <span className="text-[10px] bg-accent-500/15 text-accent-400 px-2 py-0.5 rounded-full font-bold">{aiInsights.length} alerts</span>
            </div>
            <button
              onClick={() => setShowInsights(!showInsights)}
              className="text-xs text-surface-500 hover:text-surface-300 transition-colors"
            >
              {showInsights ? 'Collapse' : 'Expand'}
            </button>
          </div>
          <AnimatePresence>
            {showInsights && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {aiInsights.map((insight, i) => (
                    <motion.div
                      key={insight.id}
                      className="p-4 rounded-xl border"
                      style={{ backgroundColor: insight.color + '0c', borderColor: insight.color + '30' }}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07 }}
                      whileHover={{ y: -2 }}
                    >
                      <div className="flex items-start gap-2.5 mb-2">
                        <insight.icon className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: insight.color }} />
                        <p className="text-xs font-bold text-white leading-tight">{insight.title}</p>
                      </div>
                      <p className="text-[11px] text-surface-400 mb-3 leading-relaxed">{insight.desc}</p>
                      <motion.button
                        className="text-[10px] font-semibold flex items-center gap-1"
                        style={{ color: insight.color }}
                        whileHover={{ x: 2 }}
                      >
                        {insight.action} <ChevronRight className="w-2.5 h-2.5" />
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </FadeUp>

      {/* Filters + Search */}
      <FadeUp delay={0.1}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-surface-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search students..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 text-xs rounded-full bg-white/[0.04] border border-white/[0.08] text-surface-200 placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-accent-500/40 w-52"
              />
            </div>
            <div className="flex items-center gap-1 flex-wrap">
              {classes.map(c => (
                <button
                  key={c}
                  onClick={() => setSelectedClass(c)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedClass === c ? 'bg-white/[0.08] text-white' : 'text-surface-400 hover:text-surface-200'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-surface-500">
            <span>Sort:</span>
            {(['name', 'overall', 'trend'] as SortKey[]).map(k => (
              <button
                key={k}
                onClick={() => toggleSort(k)}
                className={`px-2 py-1 rounded-lg transition-colors capitalize flex items-center gap-1 ${
                  sortKey === k ? 'bg-white/[0.08] text-white' : 'hover:text-surface-300'
                }`}
              >
                {k}
                {sortKey === k && (sortAsc ? <ArrowUp className="w-2.5 h-2.5" /> : <ArrowDown className="w-2.5 h-2.5" />)}
              </button>
            ))}
          </div>
        </div>
      </FadeUp>

      <AnimatePresence mode="wait">
        {gradeView === 'grid' && (
          <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <FadeUp delay={0.12}>
              <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1000px]">
                    <thead>
                      <tr className="border-b border-white/[0.06]">
                        <th className="text-left text-xs font-semibold text-surface-300 px-4 py-3 sticky left-0 bg-surface-900/80 backdrop-blur-sm z-10 w-52">
                          <button onClick={() => toggleSort('name')} className="flex items-center gap-1 hover:text-white transition-colors">
                            Student {sortKey === 'name' && (sortAsc ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}
                          </button>
                        </th>
                        {assignments.map(a => (
                          <th key={a.id} className="text-center text-xs font-semibold text-surface-300 px-3 py-3 min-w-[100px]">
                            <div className="flex flex-col items-center gap-0.5">
                              <span
                                className="text-[10px] px-1.5 py-0.5 rounded font-semibold"
                                style={{ backgroundColor: assignmentTypeColors[a.type] + '20', color: assignmentTypeColors[a.type] }}
                              >
                                {a.type}
                              </span>
                              <span className="truncate max-w-[90px] text-white">{a.name}</span>
                              <span className="text-[9px] text-surface-500">/{a.maxScore} · {a.dueDate}</span>
                            </div>
                          </th>
                        ))}
                        <th className="text-center text-xs font-semibold text-surface-300 px-4 py-3">
                          <button onClick={() => toggleSort('overall')} className="flex items-center gap-1 hover:text-white">
                            Overall {sortKey === 'overall' && (sortAsc ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}
                          </button>
                        </th>
                        <th className="text-center text-xs font-semibold text-surface-300 px-3 py-3">
                          <button onClick={() => toggleSort('trend')} className="flex items-center gap-1 hover:text-white">
                            Trend
                          </button>
                        </th>
                        <th className="text-center text-xs font-semibold text-surface-300 px-3 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((student, si) => {
                        const scores = localScores[student.id]
                        const overall = getOverallPct(scores) + curveAmount
                        const { letter, color } = getLetterGrade(Math.min(100, overall))
                        const isAtRisk = overall < 75
                        return (
                          <motion.tr
                            key={student.id}
                            className={`border-b border-white/[0.04] transition-colors hover:bg-white/[0.02] ${isAtRisk ? 'bg-danger-500/[0.03]' : ''}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: si * 0.03 }}
                          >
                            <td className="px-4 py-3 sticky left-0 bg-surface-900/60 backdrop-blur-sm z-10">
                              <div className="flex items-center gap-2.5">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 ${
                                  isAtRisk ? 'bg-danger-500/25 text-danger-300' : 'bg-accent-500/20 text-accent-300'
                                }`}>
                                  {student.avatar}
                                </div>
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-semibold text-white">{student.name}</span>
                                    {student.iep && <span className="text-[9px] bg-electric-400/20 text-electric-400 px-1 py-0.5 rounded font-bold">IEP</span>}
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    {isAtRisk && <span className="text-[9px] bg-danger-500/15 text-danger-400 px-1 py-0.5 rounded font-bold">At Risk</span>}
                                    {student.missingCount > 0 && <span className="text-[9px] bg-warning-500/15 text-warning-400 px-1 py-0.5 rounded font-bold">{student.missingCount} missing</span>}
                                  </div>
                                </div>
                              </div>
                            </td>
                            {scores.map((score, ai) => {
                              const cellKey = `${student.id}-${ai}`
                              const pct = score !== null ? (score / assignments[ai].maxScore) * 100 : 0
                              const { color: sc } = getLetterGrade(pct)
                              return (
                                <td key={ai} className="text-center px-3 py-3">
                                  {editingCell === cellKey ? (
                                    <input
                                      type="number"
                                      defaultValue={score ?? ''}
                                      autoFocus
                                      min={0}
                                      max={assignments[ai].maxScore}
                                      onBlur={e => { updateScore(student.id, ai, Number(e.target.value)); setEditingCell(null) }}
                                      onKeyDown={e => { if (e.key === 'Enter') { updateScore(student.id, ai, Number((e.target as HTMLInputElement).value)); setEditingCell(null) } }}
                                      className="w-14 text-center text-xs bg-white/[0.08] border border-accent-500/40 rounded px-1 py-0.5 text-white focus:outline-none"
                                    />
                                  ) : (
                                    <button
                                      onClick={() => setEditingCell(cellKey)}
                                      className="text-xs font-bold hover:scale-110 transition-transform"
                                      style={{ color: score !== null ? sc : '#6b7280' }}
                                    >
                                      {score !== null ? score : <span className="text-[10px] text-surface-600">—</span>}
                                    </button>
                                  )}
                                </td>
                              )
                            })}
                            <td className="text-center px-4 py-3">
                              <span
                                className="text-sm font-black px-2.5 py-1 rounded-lg"
                                style={{ color, backgroundColor: color + '1a' }}
                              >
                                {Math.round(Math.min(100, overall))}% {letter}
                              </span>
                            </td>
                            <td className="text-center px-3 py-3">
                              {student.trend === 'up' && <TrendingUp className="w-4 h-4 text-success-400 mx-auto" />}
                              {student.trend === 'down' && <TrendingDown className="w-4 h-4 text-danger-400 mx-auto" />}
                              {student.trend === 'flat' && <Minus className="w-4 h-4 text-surface-500 mx-auto" />}
                            </td>
                            <td className="text-center px-3 py-3">
                              <button
                                onClick={() => setSelectedStudent(student)}
                                className="p-1.5 rounded-lg hover:bg-white/[0.08] text-surface-500 hover:text-white transition-colors"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </motion.tr>
                        )
                      })}
                      {filteredStudents.length === 0 && (
                        <tr>
                          <td colSpan={99} className="text-center py-12 text-surface-500 text-sm">
                            <div className="flex flex-col items-center gap-2">
                              <span className="text-3xl">🔍</span>
                              <span className="font-semibold text-surface-300">No students match your search</span>
                              <span className="text-xs">Try a different name or clear the search</span>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="px-4 py-2.5 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-[10px] text-surface-500">Click any score to edit inline · Enter to confirm</span>
                  <div className="flex items-center gap-3">
                    <button className="text-[10px] text-surface-400 hover:text-surface-200 flex items-center gap-1 transition-colors">
                      <FileText className="w-3 h-3" /> Export PDF
                    </button>
                    <button className="text-[10px] text-surface-400 hover:text-surface-200 flex items-center gap-1 transition-colors">
                      <Download className="w-3 h-3" /> Export CSV
                    </button>
                  </div>
                </div>
              </div>
            </FadeUp>
          </motion.div>
        )}

        {gradeView === 'list' && (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
            {filteredStudents.map((student, si) => {
              const scores = localScores[student.id]
              const overall = Math.min(100, getOverallPct(scores) + curveAmount)
              const { letter, color } = getLetterGrade(overall)
              const isAtRisk = overall < 75
              return (
                <motion.div
                  key={student.id}
                  className="glass-card p-4 flex items-center gap-4"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: si * 0.04 }}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${
                    isAtRisk ? 'bg-danger-500/20 text-danger-300' : 'bg-accent-500/20 text-accent-300'
                  }`}>
                    {student.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-white">{student.name}</span>
                      {student.iep && <span className="text-[9px] bg-electric-400/15 text-electric-400 px-1.5 py-0.5 rounded font-bold">IEP</span>}
                      {isAtRisk && <span className="text-[9px] bg-danger-500/15 text-danger-400 px-1.5 py-0.5 rounded font-bold">At Risk</span>}
                      {student.missingCount > 0 && <span className="text-[9px] bg-warning-500/15 text-warning-400 px-1.5 py-0.5 rounded font-bold">{student.missingCount} missing</span>}
                    </div>
                    {(() => {
                      const W = 192, H = 6
                      const bw = (overall / 100) * W
                      const gid = `gb-stu-${student.name.replace(/\s/g, '')}`
                      return (
                        <svg viewBox={`0 0 ${W} ${H}`} width={192} height={6} className="overflow-visible">
                          <defs>
                            <linearGradient id={gid} x1="0" x2="1" y1="0" y2="0">
                              <stop offset="0%" stopColor={color} />
                              <stop offset="100%" stopColor={color + '80'} />
                            </linearGradient>
                          </defs>
                          <rect x={0} y={0} width={W} height={H} rx={3} fill="rgba(255,255,255,0.06)" />
                          <motion.rect
                            x={0} y={0} height={H} rx={3}
                            fill={`url(#${gid})`}
                            initial={{ width: 0 }}
                            animate={{ width: bw }}
                            transition={{ duration: 0.5 }}
                          />
                        </svg>
                      )
                    })()}
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    {student.trend === 'up' && <TrendingUp className="w-4 h-4 text-success-400" />}
                    {student.trend === 'down' && <TrendingDown className="w-4 h-4 text-danger-400" />}
                    {student.trend === 'flat' && <Minus className="w-4 h-4 text-surface-500" />}
                    <span className="text-lg font-black px-3 py-1 rounded-lg" style={{ color, backgroundColor: color + '1a' }}>
                      {Math.round(overall)}% {letter}
                    </span>
                    <button onClick={() => setSelectedStudent(student)} className="btn-secondary text-xs px-2 py-1">
                      <Eye className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        )}

        {gradeView === 'analysis' && (
          <motion.div key="analysis" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <FadeInWhenVisible>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Grade distribution */}
                <div className="glass-card p-5">
                  <h4 className="text-xs font-bold text-surface-300 mb-4 flex items-center gap-2"><BarChart2 className="w-3.5 h-3.5" /> Grade Distribution</h4>
                  <div className="space-y-2.5">
                    {(() => {
                      const grades = [
                        { letter: 'A (90-100%)', count: aCount, color: '#10b981' },
                        { letter: 'B (80-89%)',  count: bCount, color: '#22d3ee' },
                        { letter: 'C (70-79%)',  count: cCount, color: '#f59e0b' },
                        { letter: 'D (60-69%)',  count: dCount, color: '#f97316' },
                        { letter: 'F (<60%)',    count: fCount, color: '#ef4444' },
                      ]
                      const total = students.length
                      const W = 340, LW = 80, CW = 18, GAP = 6, ROW = 20
                      const BAR_MAX = W - LW - CW - 6
                      const H = grades.length * (ROW + GAP) - GAP
                      return (
                        <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible">
                          <defs>
                            {grades.map((g, i) => (
                              <linearGradient key={i} id={`gb-grade-${i}`} x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor={g.color} stopOpacity={0.9} />
                                <stop offset="100%" stopColor={g.color} stopOpacity={0.45} />
                              </linearGradient>
                            ))}
                          </defs>
                          {grades.map((g, i) => {
                            const bw = total > 0 ? (g.count / total) * BAR_MAX : 0
                            const y = i * (ROW + GAP)
                            return (
                              <g key={g.letter}>
                                <text x={0} y={y + 14} fill={g.color} fontSize={10} fontFamily="inherit" fontWeight="bold">{g.letter}</text>
                                <rect x={LW} y={y + 4} width={BAR_MAX} height={12} rx={3} fill="rgba(255,255,255,0.04)" />
                                <motion.rect x={LW} y={y + 4} height={12} rx={3} fill={`url(#gb-grade-${i})`}
                                  initial={{ width: 0 }} animate={{ width: bw }}
                                  transition={{ delay: 0.2 + i * 0.1, duration: 0.5, ease: 'easeOut' }}
                                />
                                <text x={LW + BAR_MAX + 5} y={y + 14} fill="rgba(255,255,255,0.9)" fontSize={11} fontFamily="inherit" fontWeight="bold">{g.count}</text>
                              </g>
                            )
                          })}
                        </svg>
                      )
                    })()}
                  </div>
                </div>

                {/* Assignment averages */}
                <div className="glass-card p-5">
                  <h4 className="text-xs font-bold text-surface-300 mb-4 flex items-center gap-2"><Target className="w-3.5 h-3.5" /> Assignment Averages</h4>
                  {(() => {
                    const rows = assignments.map((a, ai) => {
                      const avg = students.reduce((acc, s) => {
                        const sc = localScores[s.id][ai]
                        return acc + (sc !== null ? sc : 0)
                      }, 0) / students.length
                      const pct = (avg / a.maxScore) * 100
                      const { color } = getLetterGrade(pct)
                      return { name: a.name, pct, color }
                    })
                    const W = 300, LW = 110, CW = 32, GAP = 5, ROW = 14, BAR_MAX = W - LW - CW - 6
                    const H = rows.length * (ROW + GAP) - GAP
                    return (
                      <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible">
                        <defs>
                          {rows.map((r, ri) => (
                            <linearGradient key={ri} id={`gb-avg-${ri}`} x1="0" y1="0" x2="1" y2="0">
                              <stop offset="0%" stopColor={r.color} stopOpacity={0.9} />
                              <stop offset="100%" stopColor={r.color} stopOpacity={0.5} />
                            </linearGradient>
                          ))}
                        </defs>
                        {rows.map((r, ri) => {
                          const bw = (r.pct / 100) * BAR_MAX
                          const y = ri * (ROW + GAP)
                          return (
                            <g key={r.name}>
                              <text x={0} y={y + 11} fill="rgba(255,255,255,0.5)" fontSize={9} fontFamily="inherit">
                                {r.name.length > 14 ? r.name.slice(0, 13) + '…' : r.name}
                              </text>
                              <rect x={LW} y={y + 2} width={BAR_MAX} height={10} rx={3} fill="rgba(255,255,255,0.04)" />
                              <motion.rect x={LW} y={y + 2} height={10} rx={3} fill={`url(#gb-avg-${ri})`}
                                initial={{ width: 0 }} animate={{ width: bw }}
                                transition={{ delay: 0.2 + ri * 0.1, duration: 0.5, ease: 'easeOut' }}
                              />
                              <text x={LW + BAR_MAX + 5} y={y + 11} fill={r.color} fontSize={9} fontFamily="inherit" fontWeight="bold">{Math.round(r.pct)}%</text>
                            </g>
                          )
                        })}
                      </svg>
                    )
                  })()}
                </div>

                {/* Quick stats + missing work */}
                <div className="space-y-3">
                  <div className="glass-card p-5">
                    <h4 className="text-xs font-bold text-surface-300 mb-3 flex items-center gap-2"><Info className="w-3.5 h-3.5" /> Quick Stats</h4>
                    <div className="space-y-2">
                      {[
                        { label: 'Highest Score', value: `${Math.round(Math.max(...students.map(s => getOverallPct(localScores[s.id]))))}%`, color: '#10b981' },
                        { label: 'Lowest Score', value: `${Math.round(Math.min(...students.map(s => getOverallPct(localScores[s.id]))))}%`, color: '#ef4444' },
                        { label: 'Median', value: `${classAvg}%`, color: '#ffffff' },
                        { label: 'Standard Dev', value: '8.2%', color: '#6366f1' },
                        { label: 'Missing Items', value: `${missing}`, color: '#f59e0b' },
                        { label: 'At-Risk', value: `${atRisk} students`, color: '#ef4444' },
                      ].map(s => (
                        <div key={s.label} className="flex items-center justify-between">
                          <span className="text-xs text-surface-400">{s.label}</span>
                          <span className="text-xs font-bold" style={{ color: s.color }}>{s.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="glass-card p-5">
                    <h4 className="text-xs font-bold text-surface-300 mb-3 flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> Missing Work</h4>
                    {students.filter(s => s.missingCount > 0).map(s => (
                      <div key={s.id} className="flex items-center justify-between py-1.5 border-b border-white/[0.04] last:border-0">
                        <span className="text-xs text-surface-300">{s.name}</span>
                        <span className="text-[10px] bg-warning-500/15 text-warning-400 px-1.5 py-0.5 rounded font-bold">{s.missingCount} item{s.missingCount > 1 ? 's' : ''}</span>
                      </div>
                    ))}
                    {missing === 0 && <p className="text-xs text-surface-500">All work submitted</p>}
                  </div>
                </div>
              </div>
            </FadeInWhenVisible>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Student Detail Panel */}
      <AnimatePresence>
        {selectedStudent && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedStudent(null)} />
            <motion.div
              className="relative glass-card p-6 w-full max-w-lg z-10 max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
            >
              <button onClick={() => setSelectedStudent(null)} className="absolute top-4 right-4 text-surface-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-accent-500/20 flex items-center justify-center text-sm font-black text-accent-300">
                  {selectedStudent.avatar}
                </div>
                <div>
                  <h3 className="text-base font-black text-white">{selectedStudent.name}</h3>
                  <div className="flex items-center gap-2">
                    {selectedStudent.iep && <span className="text-[9px] bg-electric-400/15 text-electric-400 px-1.5 py-0.5 rounded font-bold">IEP/504</span>}
                    <span className="text-xs text-surface-500">
                      {Math.round(getOverallPct(localScores[selectedStudent.id]) + curveAmount)}% ·{' '}
                      {getLetterGrade(Math.round(getOverallPct(localScores[selectedStudent.id]) + curveAmount)).letter}
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-3 mb-4">
                {assignments.map((a, i) => {
                  const score = localScores[selectedStudent.id][i]
                  const pct = score !== null ? (score / a.maxScore) * 100 : 0
                  const { color } = getLetterGrade(pct)
                  return (
                    <div key={a.id}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-surface-300">{a.name}</span>
                        <span className="text-xs font-bold" style={{ color }}>
                          {score !== null ? `${score}/${a.maxScore}` : 'Missing'}
                        </span>
                      </div>
                      <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
                        <motion.div className="h-full rounded-full" style={{ backgroundColor: color, width: `${pct}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
              {selectedStudent.notes && (
                <div className="p-3 bg-white/[0.04] rounded-xl border border-white/[0.06] mb-4">
                  <p className="text-[10px] text-surface-500 mb-1">Teacher Notes</p>
                  <p className="text-xs text-surface-300">{selectedStudent.notes}</p>
                </div>
              )}
              <div className="flex gap-2">
                <button className="btn-gradient text-xs flex-1"><MessageSquare className="w-3 h-3" /> Message</button>
                <button className="btn-secondary text-xs flex-1"><Bell className="w-3 h-3" /> Set Alert</button>
                <button className="btn-secondary text-xs flex-1"><FileText className="w-3 h-3" /> Report</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toastMsg && (
          <motion.div
            className="fixed top-5 right-5 z-[100] flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl text-sm font-semibold text-white border border-white/[0.08]"
            style={{ background: 'linear-gradient(135deg,#0a0f1a,#111827)' }}
            initial={{ opacity: 0, y: -12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
            exit={{ opacity: 0, y: -12, scale: 0.95 }}
          >
            <CheckCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
