'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, Shuffle, Sparkles, Save, Download, CheckCircle,
  Grid, List, Plus, Star, AlertTriangle, Brain, Zap,
  ChevronRight, LayoutGrid, ChevronDown, X, Printer,
  FileText, Copy, Eye, Layers, BarChart2, TrendingUp, Share2
} from 'lucide-react'
import { FadeUp, FadeInWhenVisible } from '@/components/ui/motion'

interface Seat {
  id: string
  row: number
  col: number
  studentId: string | null
}

interface Student {
  id: string
  name: string
  initials: string
  color: string
  status: 'excelling' | 'on-track' | 'needs-support'
  notes?: string
  separateFrom?: string[]
  nearTeacher?: boolean
  iep?: boolean
  ell?: boolean
  reading?: number
  math?: number
}

interface Arrangement {
  id: string
  name: string
  date: string
  period?: string
  seats: Seat[]
}

type LayoutOption = '3x4' | '4x4' | '5x3' | 'groups'

const INITIAL_STUDENTS: Student[] = [
  { id: 'st1',  name: 'Emma Davis',     initials: 'ED', color: '#8b5cf6', status: 'excelling',     notes: 'Peer leader — great tutor',  reading: 94, math: 88 },
  { id: 'st2',  name: 'Noah Williams',  initials: 'NW', color: '#f97316', status: 'needs-support', notes: 'ELL — front row preferred',   ell: true, nearTeacher: true, reading: 62, math: 71 },
  { id: 'st3',  name: 'Sophia Chen',    initials: 'SC', color: '#10b981', status: 'on-track',      notes: 'Quiet — back is fine',        reading: 79, math: 83 },
  { id: 'st4',  name: 'Liam Rodriguez', initials: 'LR', color: '#22d3ee', status: 'on-track',      iep: true, notes: 'IEP: needs aisle seat', nearTeacher: true, reading: 74, math: 76 },
  { id: 'st5',  name: 'Ava Patel',      initials: 'AP', color: '#ec4899', status: 'excelling',     notes: 'Strong across all subjects',  reading: 91, math: 95 },
  { id: 'st6',  name: 'James Thompson', initials: 'JT', color: '#f59e0b', status: 'needs-support', notes: 'Separate from Marcus',         separateFrom: ['st9'], reading: 58, math: 64 },
  { id: 'st7',  name: 'Olivia Kim',     initials: 'OK', color: '#6366f1', status: 'excelling',     notes: 'Loves collaborative work',    reading: 96, math: 89 },
  { id: 'st8',  name: 'Ethan Brown',    initials: 'EB', color: '#14b8a6', status: 'on-track',      notes: 'Works well independently',    reading: 77, math: 80 },
  { id: 'st9',  name: 'Marcus Lee',     initials: 'ML', color: '#ef4444', status: 'needs-support', notes: 'Separate from James',         separateFrom: ['st6'], reading: 61, math: 59 },
  { id: 'st10', name: 'Zara Johnson',   initials: 'ZJ', color: '#a855f7', status: 'on-track',      notes: 'Strong reader',               reading: 85, math: 72 },
  { id: 'st11', name: 'Ryan Patel',     initials: 'RP', color: '#0ea5e9', status: 'on-track',      notes: 'Math focused',                reading: 71, math: 90 },
  { id: 'st12', name: 'Mia Torres',     initials: 'MT', color: '#10b981', status: 'excelling',     notes: 'High achiever, helps peers',  reading: 93, math: 91 },
]

const statusConfig = {
  excelling:       { bg: 'bg-success-400/15',  border: 'border-success-400/30',  ring: '#10b981', label: 'Excelling' },
  'on-track':      { bg: 'bg-accent-400/15',   border: 'border-accent-400/30',   ring: '#6366f1', label: 'On Track' },
  'needs-support': { bg: 'bg-warning-400/15',  border: 'border-warning-400/30',  ring: '#f59e0b', label: 'Needs Support' },
}

const AI_ALERTS = [
  { icon: AlertTriangle, color: '#f59e0b', title: 'Behavior Conflict',   text: 'James & Marcus are in adjacent columns — AI recommends moving one to row 3' },
  { icon: Brain,         color: '#6366f1', title: 'Accommodation Alert', text: 'Noah (ELL) and Liam (IEP) are not yet in front-row seats near the teacher' },
  { icon: Star,          color: '#10b981', title: 'Peer Tutoring',       text: 'Ava & Olivia (excelling) are well-placed near struggling peers for collaboration' },
]

const ARRANGE_STRATEGIES = [
  { id: 'peer-tutor', label: 'Peer Tutoring',       icon: Users,         color: '#10b981', desc: 'Pair excelling students with struggling peers for maximum support' },
  { id: 'assessment', label: 'Assessment Mode',     icon: Eye,           color: '#6366f1', desc: 'Maximize spacing and separate known collaboration pairs' },
  { id: 'group-work', label: 'Group Work Pods',     icon: Layers,        color: '#22d3ee', desc: 'Arrange in mixed-ability pods of 4 students each' },
  { id: 'ell-iep',    label: 'ELL / IEP Support',   icon: Star,          color: '#ec4899', desc: 'Move all ELL and IEP students to front-row near teacher' },
  { id: 'behavior',   label: 'Behavior Management', icon: AlertTriangle, color: '#f59e0b', desc: 'Enforce separation rules and move flagged pairs to opposite sides' },
]

const ARRANGEMENT_TREND = [3, 2, 4, 3, 5, 3, 4, 5]
const TREND_LABELS = ['Jun 3', 'Jun 10', 'Jun 17', 'Jun 24', 'Jul 1', 'Jul 8', 'Jul 15', 'Jul 22']
const PERIODS = ['Period 1', 'Period 2', 'Period 3', 'Period 4', 'Period 5', 'Period 6']

function generateSeats(rows: number, cols: number, source: Student[]): Seat[] {
  const seats: Seat[] = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const idx = r * cols + c
      seats.push({ id: `seat-${r}-${c}`, row: r, col: c, studentId: idx < source.length ? source[idx].id : null })
    }
  }
  return seats
}

export default function SeatingChartPage() {
  const students = INITIAL_STUDENTS
  const [rows, setRows]             = useState(3)
  const [cols, setCols]             = useState(4)
  const [seats, setSeats]           = useState<Seat[]>(() => generateSeats(3, 4, INITIAL_STUDENTS))
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null)
  const [saved, setSaved]           = useState(false)
  const [layout, setLayout]         = useState<LayoutOption>('3x4')
  const [view, setView]             = useState<'grid' | 'list'>('grid')
  const [aiOpen, setAiOpen]         = useState(false)
  const [period, setPeriod]         = useState('Period 2')
  const [arrangeOpen, setArrangeOpen] = useState(false)
  const [exportOpen, setExportOpen]   = useState(false)
  const [saveOpen, setSaveOpen]       = useState(false)
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null)
  const [heatmap, setHeatmap]       = useState(false)
  const [saveName, setSaveName]     = useState('')
  const [toastMsg, setToastMsg]     = useState('')
  const [detailStudent, setDetailStudent] = useState<Student | null>(null)
  const [arrangements, setArrangements] = useState<Arrangement[]>([
    { id: 'arr1', name: 'Collaborative Groups', date: 'Jul 25', period: 'Period 2', seats: [] },
    { id: 'arr2', name: 'Assessment Day',        date: 'Jul 18', period: 'Period 4', seats: [] },
    { id: 'arr3', name: 'Lab Day Layout',        date: 'Jul 10', period: 'Period 1', seats: [] },
  ])

  const unassigned = students.filter(s => !seats.some(seat => seat.studentId === s.id))

  function showToast(msg: string) {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 2500)
  }

  function shuffleSeats() {
    const shuffled = [...students].sort(() => Math.random() - 0.5)
    setSeats(prev => prev.map((seat, i) => ({ ...seat, studentId: shuffled[i]?.id ?? null })))
    showToast('Seats shuffled randomly')
  }

  function handleSave() {
    setSaved(true)
    showToast('Seating chart saved')
    setTimeout(() => setSaved(false), 2000)
  }

  function getStudentById(id: string | null): Student | null {
    if (!id) return null
    return students.find(s => s.id === id) ?? null
  }

  function handleSeatClick(seatId: string) {
    if (selectedSeat === null) {
      setSelectedSeat(seatId)
      const st = getStudentById(seats.find(s => s.id === seatId)?.studentId ?? null)
      if (st) setDetailStudent(st)
    } else if (selectedSeat === seatId) {
      setSelectedSeat(null)
    } else {
      setSeats(prev => {
        const a = prev.find(s => s.id === selectedSeat)!
        const b = prev.find(s => s.id === seatId)!
        return prev.map(s => {
          if (s.id === selectedSeat) return { ...s, studentId: b.studentId }
          if (s.id === seatId)       return { ...s, studentId: a.studentId }
          return s
        })
      })
      setSelectedSeat(null)
      showToast('Seats swapped')
    }
  }

  function applyLayout(opt: LayoutOption) {
    setLayout(opt)
    let r = 3, c = 4
    if (opt === '4x4')   { r = 4; c = 4 }
    if (opt === '5x3')   { r = 5; c = 3 }
    setRows(r); setCols(c)
    setSeats(generateSeats(r, c, students))
    setSelectedSeat(null)
  }

  function handleAIArrange() {
    if (!selectedStrategy) return
    const arranged = [...students].sort(() => Math.random() - 0.5)
    setSeats(prev => prev.map((seat, i) => ({ ...seat, studentId: arranged[i]?.id ?? null })))
    setArrangeOpen(false)
    showToast(`Applied: ${ARRANGE_STRATEGIES.find(s => s.id === selectedStrategy)?.label}`)
    setSelectedStrategy(null)
  }

  function handleSaveTemplate() {
    if (!saveName.trim()) return
    const newArr: Arrangement = {
      id: `arr-new-${arrangements.length}`,
      name: saveName.trim(),
      date: 'Aug 1',
      period,
      seats: [...seats],
    }
    setArrangements(prev => [newArr, ...prev])
    setSaveOpen(false)
    setSaveName('')
    showToast(`"${newArr.name}" saved`)
  }

  function handleLoadArrangement(arr: Arrangement) {
    if (arr.seats.length) {
      setSeats(arr.seats)
    } else {
      const shuffled = [...students].sort(() => Math.random() - 0.5)
      setSeats(prev => prev.map((seat, i) => ({ ...seat, studentId: shuffled[i]?.id ?? null })))
    }
    if (arr.period) setPeriod(arr.period)
    showToast(`Loaded: ${arr.name}`)
  }

  function detectConflicts() {
    const conflicts: { a: Student; b: Student }[] = []
    seats.forEach(seatA => {
      if (!seatA.studentId) return
      const studentA = getStudentById(seatA.studentId)
      if (!studentA?.separateFrom) return
      studentA.separateFrom.forEach(targetId => {
        const seatB = seats.find(s => s.studentId === targetId)
        if (!seatB) return
        const adjacent = Math.abs(seatA.row - seatB.row) <= 1 && Math.abs(seatA.col - seatB.col) <= 1
        if (adjacent) {
          const studentB = getStudentById(targetId)
          if (studentB && !conflicts.find(c =>
            (c.a.id === studentA.id && c.b.id === studentB.id) ||
            (c.a.id === studentB.id && c.b.id === studentA.id)
          )) {
            conflicts.push({ a: studentA, b: studentB })
          }
        }
      })
    })
    return conflicts
  }

  const conflicts = detectConflicts()

  function getHeatmapColor(row: number) {
    const pct = row / Math.max(rows - 1, 1)
    if (pct < 0.34) return 'rgba(239,68,68,0.14)'
    if (pct < 0.67) return 'rgba(245,158,11,0.10)'
    return 'rgba(34,211,238,0.07)'
  }

  const groupPods = [
    seats.filter((_, i) => i % 3 === 0),
    seats.filter((_, i) => i % 3 === 1),
    seats.filter((_, i) => i % 3 === 2),
  ]

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <FadeUp>
        <div className="hero-mesh rounded-3xl p-6 border border-white/[0.06]">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg,#22d3ee,#0891b2)' }}>
                <LayoutGrid className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-black text-white tracking-tight">Seating Chart</h1>
                  <span className="text-[10px] bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full font-bold border border-cyan-500/20">AI-Powered</span>
                </div>
                <p className="text-sm text-surface-400">Drag-and-drop seating with AI arrangement strategies and accommodation alerts</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
              <motion.button className="btn-gradient text-xs" onClick={() => setArrangeOpen(true)} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Sparkles className="w-3.5 h-3.5" /> AI Arrange
              </motion.button>
              <button className="btn-secondary text-xs px-3 py-1.5" onClick={shuffleSeats}>
                <Shuffle className="w-3.5 h-3.5" /> Shuffle
              </button>
              <button className="btn-secondary text-xs px-3 py-1.5" onClick={handleSave}>
                {saved ? <CheckCircle className="w-3.5 h-3.5 text-success-400" /> : <Save className="w-3.5 h-3.5" />}
                {saved ? 'Saved!' : 'Save'}
              </button>
              <button className="btn-secondary text-xs px-3 py-1.5" onClick={() => setSaveOpen(true)}>
                <FileText className="w-3.5 h-3.5" /> Template
              </button>
              <button className="btn-secondary text-xs px-3 py-1.5" onClick={() => setExportOpen(true)}>
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="border-t border-white/[0.06] pt-4 flex items-center gap-6 flex-wrap">
            {[
              { label: 'Students', value: `${students.length}` },
              { label: 'Grid', value: `${rows}×${cols}` },
              { label: 'Period', value: period },
              { label: 'Unassigned', value: `${unassigned.length}` },
              { label: 'Arrangements', value: `${arrangements.length}` },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-2">
                <span className="text-lg font-black text-white">{s.value}</span>
                <span className="text-xs text-surface-500">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </FadeUp>

      {/* ── Period Selector ── */}
      <FadeUp delay={0.02}>
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06] w-fit overflow-x-auto">
          {PERIODS.map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                period === p
                  ? 'bg-white/[0.1] text-white shadow-[0_0_12px_rgba(99,102,241,0.15)]'
                  : 'text-surface-400 hover:text-surface-200'
              }`}
            >
              {p.replace('Period ', 'P')}
            </button>
          ))}
        </div>
      </FadeUp>

      {/* ── AI Insights Panel ── */}
      <FadeUp delay={0.03}>
        <div className="glass-card overflow-hidden">
          <button
            className="w-full flex items-center justify-between p-4"
            onClick={() => setAiOpen(o => !o)}
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-accent-500/15 flex items-center justify-center">
                <Brain className="w-3.5 h-3.5 text-accent-400" />
              </div>
              <span className="text-xs font-bold text-white">AI Seating Insights</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent-500/15 text-accent-400 font-semibold">
                {AI_ALERTS.length} tips
              </span>
              {conflicts.length > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-500/15 text-red-400 font-semibold">
                  {conflicts.length} conflict{conflicts.length > 1 ? 's' : ''}
                </span>
              )}
            </div>
            <motion.div animate={{ rotate: aiOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="w-4 h-4 text-surface-500" />
            </motion.div>
          </button>
          <AnimatePresence initial={false}>
            {aiOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                  {AI_ALERTS.map((alert, i) => {
                    const Icon = alert.icon
                    return (
                      <motion.div
                        key={i}
                        className="flex gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:border-white/[0.09] transition-all cursor-pointer"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        whileHover={{ x: 2 }}
                      >
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: alert.color + '20' }}>
                          <Icon className="w-3.5 h-3.5" style={{ color: alert.color }} />
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-white mb-0.5">{alert.title}</p>
                          <p className="text-[10px] text-surface-400 leading-relaxed">{alert.text}</p>
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

      {/* ── Stats ── */}
      <FadeUp delay={0.05}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Total Students', value: students.length,                                           icon: Users,         color: '#6366f1' },
            { label: 'Seated',         value: seats.filter(s => s.studentId).length,                     icon: CheckCircle,   color: '#10b981' },
            { label: 'Need Attention', value: students.filter(s => s.status === 'needs-support').length, icon: AlertTriangle, color: '#f59e0b' },
            { label: 'IEP / ELL',      value: students.filter(s => s.iep || s.ell).length,              icon: Star,          color: '#ec4899' },
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
            </motion.div>
          ))}
        </div>
      </FadeUp>

      {/* ── Main 2-col layout ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-6">

        {/* Left column */}
        <div className="space-y-4">

          {/* Controls bar */}
          <FadeUp delay={0.07}>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                {([
                  { key: '3x4',   label: '3×4' },
                  { key: '4x4',   label: '4×4' },
                  { key: '5x3',   label: '5×3' },
                  { key: 'groups', label: 'Groups' },
                ] as const).map(opt => (
                  <button
                    key={opt.key}
                    onClick={() => applyLayout(opt.key)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      layout === opt.key ? 'bg-white/[0.1] text-white' : 'text-surface-400 hover:text-surface-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setHeatmap(h => !h)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  heatmap
                    ? 'bg-accent-500/15 border-accent-500/30 text-accent-300'
                    : 'border-white/[0.08] text-surface-400 hover:text-surface-200'
                }`}
              >
                <TrendingUp className="w-3 h-3" />
                Heatmap
              </button>

              {selectedSeat && (
                <motion.div
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-accent-500/15 border border-accent-500/30"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Zap className="w-3.5 h-3.5 text-accent-400" />
                  <span className="text-xs font-semibold text-accent-300">
                    {getStudentById(seats.find(s => s.id === selectedSeat)?.studentId ?? null)?.name ?? 'Empty seat'} selected
                  </span>
                  <button onClick={() => setSelectedSeat(null)} className="text-accent-400 hover:text-white text-sm leading-none">×</button>
                </motion.div>
              )}

              {layout !== 'groups' && (
                <div className="ml-auto flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                  <button
                    onClick={() => setView('grid')}
                    className={`p-1.5 rounded-lg transition-all ${view === 'grid' ? 'bg-white/[0.1] text-white' : 'text-surface-500 hover:text-surface-300'}`}
                  >
                    <Grid className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setView('list')}
                    className={`p-1.5 rounded-lg transition-all ${view === 'list' ? 'bg-white/[0.1] text-white' : 'text-surface-500 hover:text-surface-300'}`}
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </FadeUp>

          {/* Classroom */}
          <FadeUp delay={0.09}>
            <div className="glass-card p-6">
              <div className="flex justify-center mb-6">
                <div className="px-8 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-semibold text-surface-400">
                  ← Teacher&apos;s Desk →
                </div>
              </div>

              {layout === 'groups' ? (
                <div className="grid grid-cols-3 gap-4">
                  {groupPods.map((pod, gi) => {
                    const names  = ['Group A', 'Group B', 'Group C']
                    const colors = ['#6366f1', '#10b981', '#22d3ee']
                    return (
                      <div
                        key={gi}
                        className="rounded-xl border p-3"
                        style={{ borderColor: colors[gi] + '30', backgroundColor: colors[gi] + '08' }}
                      >
                        <p className="text-[10px] font-bold mb-2" style={{ color: colors[gi] }}>{names[gi]}</p>
                        <div className="grid grid-cols-2 gap-2">
                          {pod.map(seat => {
                            const student = getStudentById(seat.studentId)
                            if (!student) return (
                              <div key={seat.id} className="aspect-square rounded-lg border border-white/[0.05] flex items-center justify-center">
                                <Plus className="w-3 h-3 text-surface-600" />
                              </div>
                            )
                            return (
                              <motion.button
                                key={seat.id}
                                className="aspect-square rounded-lg flex flex-col items-center justify-center gap-1 p-1 border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] transition-all"
                                onClick={() => setDetailStudent(prev => prev?.id === student.id ? null : student)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <div
                                  className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[9px] font-bold"
                                  style={{ background: `linear-gradient(135deg, ${student.color}, ${student.color}99)` }}
                                >
                                  {student.initials}
                                </div>
                                <p className="text-[8px] font-bold text-white truncate w-full px-0.5 text-center">{student.name.split(' ')[0]}</p>
                              </motion.button>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : view === 'grid' ? (
                <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
                  {Array.from({ length: rows }, (_, r) =>
                    Array.from({ length: cols }, (_, c) => {
                      const seat = seats.find(s => s.row === r && s.col === c)
                      if (!seat) return null
                      const student    = getStudentById(seat.studentId)
                      const st         = student ? statusConfig[student.status] : null
                      const isSelected = selectedSeat === seat.id
                      const isTarget   = selectedSeat !== null && selectedSeat !== seat.id
                      const hasConflict = student ? conflicts.some(cf => cf.a.id === student.id || cf.b.id === student.id) : false

                      return (
                        <motion.button
                          key={seat.id}
                          className={`relative aspect-square rounded-2xl border-2 flex flex-col items-center justify-center gap-1 cursor-pointer p-2 transition-colors ${
                            isSelected
                              ? 'border-accent-500 bg-accent-500/20 shadow-[0_0_20px_rgba(99,102,241,0.3)]'
                              : hasConflict && !heatmap
                              ? 'border-red-500/40 bg-red-500/[0.08]'
                              : student
                              ? `${st?.border} ${st?.bg}`
                              : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1]'
                          }`}
                          style={heatmap ? { backgroundColor: getHeatmapColor(r), borderColor: 'rgba(255,255,255,0.1)' } : undefined}
                          onClick={() => { handleSeatClick(seat.id); if (student) setDetailStudent(student) }}
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.96 }}
                          animate={isTarget ? { scale: [1, 1.02, 1] } : {}}
                          transition={{ duration: 0.5, repeat: isTarget ? Infinity : 0 }}
                        >
                          {student ? (
                            <>
                              <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                                style={{ background: `linear-gradient(135deg, ${student.color}, ${student.color}99)` }}
                              >
                                {student.initials}
                              </div>
                              <p className="text-[9px] font-bold text-white text-center leading-tight truncate w-full px-0.5">
                                {student.name.split(' ')[0]}
                              </p>
                              <div className="flex items-center gap-0.5">
                                {student.iep && <span className="text-[7px] px-1 py-0.5 rounded bg-purple-500/30 text-purple-300 font-bold">IEP</span>}
                                {student.ell && <span className="text-[7px] px-1 py-0.5 rounded bg-cyan-500/30 text-cyan-300 font-bold">ELL</span>}
                                {hasConflict && <span className="text-[7px] px-1 py-0.5 rounded bg-red-500/30 text-red-300 font-bold">!</span>}
                              </div>
                            </>
                          ) : (
                            <div className="flex flex-col items-center gap-1 opacity-25">
                              <Plus className="w-4 h-4 text-surface-400" />
                              <span className="text-[9px] text-surface-500">Empty</span>
                            </div>
                          )}
                          <span className="absolute top-1 left-1 text-[8px] text-surface-600 font-mono">{r + 1}{String.fromCharCode(65 + c)}</span>
                        </motion.button>
                      )
                    })
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  {seats.filter(s => s.studentId).sort((a, b) => a.row - b.row || a.col - b.col).map((seat, i) => {
                    const student = getStudentById(seat.studentId)
                    if (!student) return null
                    const st = statusConfig[student.status]
                    const hasConflict = conflicts.some(cf => cf.a.id === student.id || cf.b.id === student.id)
                    return (
                      <motion.div
                        key={seat.id}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer ${
                          hasConflict ? 'border-red-500/30 bg-red-500/[0.04]' : `${st.border} ${st.bg}`
                        }`}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        onClick={() => setDetailStudent(prev => prev?.id === student.id ? null : student)}
                        whileHover={{ x: 2 }}
                      >
                        <span className="text-[10px] text-surface-600 font-mono w-6 flex-shrink-0">{seat.row + 1}{String.fromCharCode(65 + seat.col)}</span>
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0" style={{ background: `linear-gradient(135deg, ${student.color}, ${student.color}99)` }}>
                          {student.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-white">{student.name}</span>
                            {student.iep && <span className="text-[8px] px-1 py-0.5 rounded bg-purple-500/20 text-purple-400 font-bold">IEP</span>}
                            {student.ell && <span className="text-[8px] px-1 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-bold">ELL</span>}
                            {hasConflict && <span className="text-[8px] px-1 py-0.5 rounded bg-red-500/20 text-red-400 font-bold">Conflict</span>}
                          </div>
                          {student.notes && <p className="text-[10px] text-surface-500">{student.notes}</p>}
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-[10px] text-surface-500">Reading <span className="text-white font-semibold">{student.reading}%</span></p>
                          <p className="text-[10px] text-surface-500">Math <span className="text-white font-semibold">{student.math}%</span></p>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0" style={{ color: st.ring, backgroundColor: st.ring + '15' }}>{st.label}</span>
                      </motion.div>
                    )
                  })}
                </div>
              )}

              {/* Legend */}
              <div className="flex items-center gap-4 mt-5 pt-4 border-t border-white/[0.06] flex-wrap">
                {Object.entries(statusConfig).map(([key, val]) => (
                  <div key={key} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: val.ring }} />
                    <span className="text-[10px] text-surface-400">{val.label}</span>
                  </div>
                ))}
                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-400 font-bold">IEP</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-400 font-bold">ELL</span>
                  {heatmap && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-surface-500">Proximity:</span>
                      <div className="w-14 h-2 rounded" style={{ background: 'linear-gradient(to right, rgba(239,68,68,0.5), rgba(245,158,11,0.4), rgba(34,211,238,0.3))' }} />
                      <span className="text-[9px] text-surface-600">far</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </FadeUp>

          {/* Conflict Alert */}
          <AnimatePresence>
            {conflicts.length > 0 && (
              <motion.div
                className="glass-card p-4 border border-red-500/20"
                style={{ backgroundColor: 'rgba(239,68,68,0.03)' }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span className="text-xs font-bold text-white">Seating Conflicts Detected</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-500/15 text-red-400 font-semibold">{conflicts.length}</span>
                </div>
                <div className="space-y-2">
                  {conflicts.map((cf, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.03]">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[8px] font-bold flex-shrink-0" style={{ background: `linear-gradient(135deg, ${cf.a.color}, ${cf.a.color}99)` }}>{cf.a.initials}</div>
                      <span className="text-[10px] text-red-400 font-bold">×</span>
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[8px] font-bold flex-shrink-0" style={{ background: `linear-gradient(135deg, ${cf.b.color}, ${cf.b.color}99)` }}>{cf.b.initials}</div>
                      <span className="text-[11px] text-surface-300 flex-1">{cf.a.name} & {cf.b.name} are adjacent — flagged for separation</span>
                      <button
                        className="text-[10px] text-accent-400 hover:text-accent-300 transition-colors flex-shrink-0"
                        onClick={() => { shuffleSeats() }}
                      >
                        Auto-fix
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">

          {/* Student Detail Panel */}
          <AnimatePresence mode="wait">
            {detailStudent && (
              <motion.div
                key={detailStudent.id}
                className="glass-card p-4"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold text-white">Student Profile</p>
                  <button onClick={() => setDetailStudent(null)} className="text-surface-500 hover:text-surface-300 transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${detailStudent.color}, ${detailStudent.color}99)` }}
                  >
                    {detailStudent.initials}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{detailStudent.name}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium" style={{ color: statusConfig[detailStudent.status].ring, backgroundColor: statusConfig[detailStudent.status].ring + '15' }}>
                        {statusConfig[detailStudent.status].label}
                      </span>
                      {detailStudent.iep && <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 font-bold">IEP</span>}
                      {detailStudent.ell && <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-bold">ELL</span>}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {[
                    { label: 'Reading', value: detailStudent.reading ?? 0, color: '#6366f1' },
                    { label: 'Math',    value: detailStudent.math    ?? 0, color: '#10b981' },
                  ].map(metric => (
                    <div key={metric.label} className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                      <p className="text-[10px] text-surface-500 mb-1.5">{metric.label}</p>
                      <div className="flex items-center gap-1.5">
                        <div className="flex-1 h-1.5 rounded-full bg-white/[0.08]">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: metric.color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${metric.value}%` }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-white">{metric.value}%</span>
                      </div>
                    </div>
                  ))}
                </div>
                {detailStudent.notes && (
                  <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                    <p className="text-[10px] text-surface-500 mb-1">Notes</p>
                    <p className="text-[11px] text-surface-300 leading-relaxed">{detailStudent.notes}</p>
                  </div>
                )}
                {detailStudent.nearTeacher && (
                  <div className="mt-2 flex items-center gap-1.5 p-2 rounded-lg bg-cyan-500/[0.08] border border-cyan-500/20">
                    <Star className="w-3 h-3 text-cyan-400" />
                    <span className="text-[10px] text-cyan-400">Should be near teacher</span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Unassigned */}
          {unassigned.length > 0 && (
            <FadeInWhenVisible delay={0.1}>
              <div className="glass-card p-4">
                <p className="text-xs font-bold text-surface-300 mb-3">Unassigned ({unassigned.length})</p>
                <div className="space-y-2">
                  {unassigned.map(s => (
                    <div key={s.id} className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.03]">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold" style={{ background: `linear-gradient(135deg, ${s.color}, ${s.color}99)` }}>
                        {s.initials}
                      </div>
                      <span className="text-xs text-white flex-1">{s.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeInWhenVisible>
          )}

          {/* Student Roster */}
          <FadeInWhenVisible delay={0.12}>
            <div className="glass-card p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-surface-300">Student Roster</p>
                <span className="text-[10px] text-surface-500">{students.length}</span>
              </div>
              <div className="space-y-1 max-h-[280px] overflow-y-auto">
                {students.map((s, i) => {
                  const st = statusConfig[s.status]
                  const seat = seats.find(seat => seat.studentId === s.id)
                  const isDetail = detailStudent?.id === s.id
                  return (
                    <motion.button
                      key={s.id}
                      className={`w-full flex items-center gap-2 p-2 rounded-lg text-left transition-colors ${
                        isDetail ? 'bg-white/[0.06]' : 'hover:bg-white/[0.03]'
                      }`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      onClick={() => setDetailStudent(isDetail ? null : s)}
                    >
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0" style={{ background: `linear-gradient(135deg, ${s.color}, ${s.color}99)` }}>
                        {s.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-semibold text-white truncate">{s.name}</p>
                        {seat && <p className="text-[9px] text-surface-600">{seat.row + 1}{String.fromCharCode(65 + seat.col)}</p>}
                      </div>
                      <div className="flex items-center gap-0.5">
                        {s.iep && <div className="w-2.5 h-2.5 rounded-full bg-purple-500/40" title="IEP" />}
                        {s.ell && <div className="w-2.5 h-2.5 rounded-full bg-cyan-500/40" title="ELL" />}
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: st.ring + '70' }} title={st.label} />
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </div>
          </FadeInWhenVisible>

          {/* Arrangement Trend */}
          <FadeInWhenVisible delay={0.16}>
            <div className="glass-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <BarChart2 className="w-3.5 h-3.5 text-accent-400" />
                <p className="text-xs font-bold text-surface-300">Arrangement Changes</p>
                <span className="text-[10px] text-surface-600 ml-auto">8 weeks</span>
              </div>
              <div className="flex items-end gap-1.5 h-14">
                {ARRANGEMENT_TREND.map((val, i) => {
                  const pct = (val / Math.max(...ARRANGEMENT_TREND)) * 100
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <motion.div
                        className="w-full rounded-t-sm"
                        style={{ backgroundColor: '#6366f180' }}
                        initial={{ height: 0 }}
                        animate={{ height: `${pct}%` }}
                        transition={{ duration: 0.5, delay: i * 0.05, ease: 'easeOut' }}
                      />
                      <span className="text-[7px] text-surface-600">{TREND_LABELS[i].split(' ')[1]}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </FadeInWhenVisible>

          {/* Saved Arrangements */}
          <FadeInWhenVisible delay={0.2}>
            <div className="glass-card p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-surface-300">Saved Arrangements</p>
                <button
                  onClick={() => setSaveOpen(true)}
                  className="text-[10px] text-accent-400 hover:text-accent-300 flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  New
                </button>
              </div>
              <div className="space-y-1.5">
                {arrangements.map(arr => (
                  <motion.div
                    key={arr.id}
                    className="flex items-center justify-between py-2 border-b border-white/[0.05] last:border-0"
                    whileHover={{ x: 1 }}
                  >
                    <div className="flex items-center gap-2">
                      <LayoutGrid className="w-3 h-3 text-surface-500" />
                      <div>
                        <p className="text-[11px] text-surface-300">{arr.name}</p>
                        <p className="text-[9px] text-surface-600">{arr.period} · {arr.date}</p>
                      </div>
                    </div>
                    <button
                      className="text-[10px] text-accent-400 hover:text-accent-300 transition-colors"
                      onClick={() => handleLoadArrangement(arr)}
                    >
                      Load
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </FadeInWhenVisible>

          {/* Quick Actions */}
          <FadeInWhenVisible delay={0.24}>
            <div className="glass-card p-4">
              <p className="text-xs font-bold text-surface-300 mb-3">Quick Actions</p>
              <div className="space-y-1.5">
                {[
                  { label: 'AI arrange by performance',   icon: Sparkles,      color: '#6366f1', fn: () => setArrangeOpen(true) },
                  { label: 'Group ELL students together', icon: Users,         color: '#22d3ee', fn: () => showToast('ELL grouping applied') },
                  { label: 'Resolve behavior conflicts',  icon: AlertTriangle, color: '#f59e0b', fn: () => { shuffleSeats() } },
                  { label: 'Print seating chart',         icon: Printer,       color: '#10b981', fn: () => setExportOpen(true) },
                  { label: 'Share with substitute',       icon: Share2,        color: '#8b5cf6', fn: () => showToast('Share link copied!') },
                ].map(action => (
                  <motion.button
                    key={action.label}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] text-surface-300 hover:text-white hover:bg-white/[0.04] transition-all"
                    whileHover={{ x: 2 }}
                    onClick={action.fn}
                  >
                    <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0" style={{ backgroundColor: action.color + '18' }}>
                      <action.icon className="w-3 h-3" style={{ color: action.color }} />
                    </div>
                    {action.label}
                    <ChevronRight className="w-3 h-3 ml-auto text-surface-600" />
                  </motion.button>
                ))}
              </div>
            </div>
          </FadeInWhenVisible>
        </div>
      </div>

      {/* ── AI Arrange Modal ── */}
      <AnimatePresence>
        {arrangeOpen && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setArrangeOpen(false)}
          >
            <motion.div
              className="glass-card w-full max-w-lg p-6"
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-accent-500/15 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-accent-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">AI Seating Arrangement</h3>
                    <p className="text-[10px] text-surface-500">Choose a strategy to auto-optimize seats</p>
                  </div>
                </div>
                <button onClick={() => setArrangeOpen(false)} className="text-surface-500 hover:text-surface-300">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2 mb-5">
                {ARRANGE_STRATEGIES.map(s => {
                  const Icon = s.icon
                  const isSelected = selectedStrategy === s.id
                  return (
                    <motion.button
                      key={s.id}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-accent-500/50 bg-accent-500/10'
                          : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1]'
                      }`}
                      onClick={() => setSelectedStrategy(isSelected ? null : s.id)}
                      whileHover={{ x: 2 }}
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: s.color + '18' }}>
                        <Icon className="w-4 h-4" style={{ color: s.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white">{s.label}</p>
                        <p className="text-[10px] text-surface-500 leading-relaxed">{s.desc}</p>
                      </div>
                      {isSelected && <CheckCircle className="w-4 h-4 text-accent-400 flex-shrink-0" />}
                    </motion.button>
                  )
                })}
              </div>
              <div className="flex gap-2">
                <button className="btn-secondary text-xs flex-1" onClick={() => setArrangeOpen(false)}>Cancel</button>
                <motion.button
                  className="btn-gradient text-xs flex-1"
                  onClick={handleAIArrange}
                  style={{ opacity: selectedStrategy ? 1 : 0.4 }}
                  whileHover={{ scale: selectedStrategy ? 1.02 : 1 }}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Apply Arrangement
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Export Modal ── */}
      <AnimatePresence>
        {exportOpen && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setExportOpen(false)}
          >
            <motion.div
              className="glass-card w-full max-w-sm p-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-black text-white">Export Seating Chart</h3>
                <button onClick={() => setExportOpen(false)} className="text-surface-500 hover:text-surface-300">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2">
                {[
                  { label: 'Print Layout (PDF)', icon: Printer,  color: '#6366f1', desc: 'Full-color printable PDF' },
                  { label: 'PNG Image',          icon: Download, color: '#10b981', desc: 'High-resolution image' },
                  { label: 'CSV Roster',         icon: FileText, color: '#22d3ee', desc: 'Student → seat assignment list' },
                  { label: 'Copy to Clipboard',  icon: Copy,     color: '#f59e0b', desc: 'Plain text, paste anywhere' },
                ].map(opt => (
                  <motion.button
                    key={opt.label}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1] text-left transition-all"
                    whileHover={{ x: 2 }}
                    onClick={() => { setExportOpen(false); showToast(`Exported as ${opt.label}`) }}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: opt.color + '18' }}>
                      <opt.icon className="w-4 h-4" style={{ color: opt.color }} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{opt.label}</p>
                      <p className="text-[10px] text-surface-500">{opt.desc}</p>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-surface-600 ml-auto" />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Save Template Modal ── */}
      <AnimatePresence>
        {saveOpen && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSaveOpen(false)}
          >
            <motion.div
              className="glass-card w-full max-w-sm p-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-black text-white">Save as Template</h3>
                <button onClick={() => setSaveOpen(false)} className="text-surface-500 hover:text-surface-300">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3 mb-5">
                <div>
                  <label className="text-[11px] text-surface-400 mb-1.5 block">Template Name</label>
                  <input
                    value={saveName}
                    onChange={e => setSaveName(e.target.value)}
                    placeholder="e.g. Assessment Day Layout"
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-xs placeholder:text-surface-600 focus:outline-none focus:border-accent-500/50"
                    onKeyDown={e => e.key === 'Enter' && handleSaveTemplate()}
                  />
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                  <LayoutGrid className="w-3.5 h-3.5 text-surface-500" />
                  <span className="text-[11px] text-surface-400">{layout.toUpperCase()} · {period} · {seats.filter(s => s.studentId).length} seated</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="btn-secondary text-xs flex-1" onClick={() => setSaveOpen(false)}>Cancel</button>
                <motion.button
                  className="btn-gradient text-xs flex-1"
                  onClick={handleSaveTemplate}
                  style={{ opacity: saveName.trim() ? 1 : 0.4 }}
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Template
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Toast ── */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            className="fixed top-4 right-4 z-[60] px-4 py-2.5 rounded-xl bg-surface-800 border border-white/[0.1] shadow-2xl flex items-center gap-2"
            initial={{ opacity: 0, y: -12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.95 }}
          >
            <CheckCircle className="w-3.5 h-3.5 text-success-400 flex-shrink-0" />
            <span className="text-xs text-white font-medium">{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
