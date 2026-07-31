'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, Shuffle, Sparkles, Save, Download, CheckCircle,
  RotateCcw, Grid, List, Plus, Star, AlertTriangle, Brain,
  Edit3, Zap, ChevronRight, LayoutGrid
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
}

const students: Student[] = [
  { id: 'st1', name: 'Emma Davis',     initials: 'ED', color: '#8b5cf6', status: 'excelling', notes: 'Peer leader' },
  { id: 'st2', name: 'Noah Williams',  initials: 'NW', color: '#f97316', status: 'needs-support', notes: 'ELL - front row preferred', ell: true, nearTeacher: true },
  { id: 'st3', name: 'Sophia Chen',    initials: 'SC', color: '#10b981', status: 'on-track', notes: 'Quiet — back is fine' },
  { id: 'st4', name: 'Liam Rodriguez', initials: 'LR', color: '#22d3ee', status: 'on-track', iep: true, notes: 'IEP: needs aisle seat', nearTeacher: true },
  { id: 'st5', name: 'Ava Patel',      initials: 'AP', color: '#ec4899', status: 'excelling', notes: 'Good peer tutor' },
  { id: 'st6', name: 'James Thompson', initials: 'JT', color: '#f59e0b', status: 'needs-support', notes: 'Separate from Marcus', separateFrom: ['st9'] },
  { id: 'st7', name: 'Olivia Kim',     initials: 'OK', color: '#6366f1', status: 'excelling' },
  { id: 'st8', name: 'Ethan Brown',    initials: 'EB', color: '#14b8a6', status: 'on-track' },
  { id: 'st9', name: 'Marcus Lee',     initials: 'ML', color: '#ef4444', status: 'needs-support', notes: 'Separate from James', separateFrom: ['st6'] },
  { id: 'st10', name: 'Zara Johnson',  initials: 'ZJ', color: '#a855f7', status: 'on-track' },
  { id: 'st11', name: 'Ryan Patel',    initials: 'RP', color: '#0ea5e9', status: 'on-track' },
  { id: 'st12', name: 'Mia Torres',    initials: 'MT', color: '#10b981', status: 'excelling', notes: 'High achiever' },
]

const generateSeats = (rows: number, cols: number): Seat[] => {
  const seats: Seat[] = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const idx = r * cols + c
      seats.push({
        id: `seat-${r}-${c}`,
        row: r,
        col: c,
        studentId: idx < students.length ? students[idx].id : null,
      })
    }
  }
  return seats
}

const statusConfig = {
  excelling:       { bg: 'bg-success-400/15',  border: 'border-success-400/30',  ring: '#10b981', label: 'Excelling' },
  'on-track':      { bg: 'bg-accent-400/15',   border: 'border-accent-400/30',   ring: '#6366f1', label: 'On Track' },
  'needs-support': { bg: 'bg-warning-400/15',  border: 'border-warning-400/30',  ring: '#f59e0b', label: 'Needs Support' },
}

type LayoutOption = '4x4' | '3x4' | '5x3' | 'groups'

export default function SeatingChartPage() {
  const [rows, setRows] = useState(3)
  const [cols, setCols] = useState(4)
  const [seats, setSeats] = useState<Seat[]>(() => generateSeats(3, 4))
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null)
  const [dragging, setDragging] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [layout, setLayout] = useState<LayoutOption>('3x4')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [showAiSuggestions, setShowAiSuggestions] = useState(true)

  const unassigned = students.filter(s => !seats.some(seat => seat.studentId === s.id))

  function shuffleSeats() {
    const shuffled = [...students].sort(() => Math.random() - 0.5)
    setSeats(prev => prev.map((seat, i) => ({
      ...seat,
      studentId: shuffled[i]?.id ?? null,
    })))
  }

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function getStudentById(id: string | null) {
    if (!id) return null
    return students.find(s => s.id === id) ?? null
  }

  function handleSeatClick(seatId: string) {
    if (selectedSeat === null) {
      setSelectedSeat(seatId)
    } else if (selectedSeat === seatId) {
      setSelectedSeat(null)
    } else {
      // Swap students between seats
      setSeats(prev => {
        const a = prev.find(s => s.id === selectedSeat)!
        const b = prev.find(s => s.id === seatId)!
        return prev.map(s => {
          if (s.id === selectedSeat) return { ...s, studentId: b.studentId }
          if (s.id === seatId) return { ...s, studentId: a.studentId }
          return s
        })
      })
      setSelectedSeat(null)
    }
  }

  function applyLayout(opt: LayoutOption) {
    setLayout(opt)
    let r = 3, c = 4
    if (opt === '4x4') { r = 4; c = 4 }
    else if (opt === '3x4') { r = 3; c = 4 }
    else if (opt === '5x3') { r = 5; c = 3 }
    setRows(r)
    setCols(c)
    setSeats(generateSeats(r, c))
  }

  const aiSuggestions = [
    { type: 'warning', icon: AlertTriangle, color: '#f59e0b', text: 'James & Marcus are flagged to be separated — consider swapping one to row 3' },
    { type: 'info', icon: Brain, color: '#6366f1', text: 'Noah (ELL) and Liam (IEP) are not in front-row seats — AI recommends moving them forward' },
    { type: 'tip', icon: Star, color: '#10b981', text: 'Ava and Olivia (excelling) are well-placed near struggling peers for peer tutoring' },
  ]

  return (
    <div className="space-y-6">
      <FadeUp>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #22d3ee, #0891b2)' }}
              whileHover={{ rotate: 8, scale: 1.08 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <LayoutGrid className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h2 className="text-xl font-black text-white">Seating Chart</h2>
              <p className="text-xs text-surface-400">{students.length} students · {rows}×{cols} grid · Click seats to swap</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.button className="btn-gradient text-xs" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Sparkles className="w-3.5 h-3.5" />
              AI Arrange
            </motion.button>
            <button className="btn-secondary text-xs px-3 py-1.5" onClick={shuffleSeats}>
              <Shuffle className="w-3.5 h-3.5" />
              Shuffle
            </button>
            <button className="btn-secondary text-xs px-3 py-1.5" onClick={handleSave}>
              {saved ? <CheckCircle className="w-3.5 h-3.5 text-success-400" /> : <Save className="w-3.5 h-3.5" />}
              {saved ? 'Saved!' : 'Save'}
            </button>
            <button className="btn-secondary text-xs px-3 py-1.5">
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </FadeUp>

      {/* Stats */}
      <FadeUp delay={0.04}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Total Students', value: students.length, icon: Users, color: '#6366f1' },
            { label: 'Seated', value: seats.filter(s => s.studentId).length, icon: CheckCircle, color: '#10b981' },
            { label: 'Need Attention', value: students.filter(s => s.status === 'needs-support').length, icon: AlertTriangle, color: '#f59e0b' },
            { label: 'IEP/ELL', value: students.filter(s => s.iep || s.ell).length, icon: Star, color: '#ec4899' },
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

      {/* AI Suggestions Banner */}
      <AnimatePresence>
        {showAiSuggestions && (
          <motion.div
            className="glass-card p-4"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-accent-500/15">
                  <Brain className="w-3.5 h-3.5 text-accent-400" />
                </div>
                <span className="text-xs font-bold text-white">AI Seating Suggestions</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent-500/15 text-accent-400">{aiSuggestions.length} tips</span>
              </div>
              <button
                onClick={() => setShowAiSuggestions(false)}
                className="text-[11px] text-surface-500 hover:text-surface-300 transition-colors"
              >
                Dismiss
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {aiSuggestions.map((s, i) => {
                const Icon = s.icon
                return (
                  <motion.div
                    key={i}
                    className="flex gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:border-white/[0.1] transition-all cursor-pointer"
                    whileHover={{ x: 2 }}
                  >
                    <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: s.color + '20' }}>
                      <Icon className="w-3 h-3" style={{ color: s.color }} />
                    </div>
                    <p className="text-[11px] text-surface-300 leading-relaxed">{s.text}</p>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_260px] gap-6">
        <div className="space-y-4">
          {/* Layout Selector + Controls */}
          <FadeUp delay={0.07}>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                {([
                  { key: '3x4', label: '3×4' },
                  { key: '4x4', label: '4×4' },
                  { key: '5x3', label: '5×3' },
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

              {selectedSeat && (
                <motion.div
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-accent-500/15 border border-accent-500/30"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Zap className="w-3.5 h-3.5 text-accent-400" />
                  <span className="text-xs font-semibold text-accent-300">
                    {getStudentById(seats.find(s => s.id === selectedSeat)?.studentId ?? null)?.name ?? 'Empty seat'} selected — click another seat to swap
                  </span>
                  <button onClick={() => setSelectedSeat(null)} className="text-accent-400 hover:text-white transition-colors text-xs">×</button>
                </motion.div>
              )}

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
            </div>
          </FadeUp>

          {/* Classroom Grid */}
          <FadeUp delay={0.09}>
            <div className="glass-card p-6">
              {/* Teacher's desk */}
              <div className="flex justify-center mb-6">
                <div className="px-6 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-semibold text-surface-400">
                  ← Teacher's Desk →
                </div>
              </div>

              {view === 'grid' ? (
                <div
                  className="grid gap-3"
                  style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
                >
                  {Array.from({ length: rows }, (_, r) =>
                    Array.from({ length: cols }, (_, c) => {
                      const seat = seats.find(s => s.row === r && s.col === c)
                      if (!seat) return null
                      const student = getStudentById(seat.studentId)
                      const st = student ? statusConfig[student.status] : null
                      const isSelected = selectedSeat === seat.id
                      const isSwapTarget = selectedSeat !== null && selectedSeat !== seat.id

                      return (
                        <motion.button
                          key={seat.id}
                          className={`relative aspect-square rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer p-2 ${
                            isSelected
                              ? 'border-accent-500 bg-accent-500/20 shadow-[0_0_20px_rgba(99,102,241,0.3)]'
                              : student
                              ? `${st?.border} ${st?.bg} hover:opacity-90`
                              : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1] hover:bg-white/[0.04]'
                          }`}
                          onClick={() => handleSeatClick(seat.id)}
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.96 }}
                          animate={isSwapTarget ? { scale: [1, 1.02, 1] } : {}}
                          transition={{ duration: 0.5, repeat: isSwapTarget ? Infinity : 0 }}
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
                              </div>
                            </>
                          ) : (
                            <div className="flex flex-col items-center gap-1 opacity-30">
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
                    return (
                      <motion.div
                        key={seat.id}
                        className={`flex items-center gap-3 p-3 rounded-xl border ${st.border} ${st.bg}`}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                      >
                        <span className="text-[10px] text-surface-600 font-mono w-6">{seat.row + 1}{String.fromCharCode(65 + seat.col)}</span>
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0" style={{ background: `linear-gradient(135deg, ${student.color}, ${student.color}99)` }}>
                          {student.initials}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-white">{student.name}</span>
                            {student.iep && <span className="text-[8px] px-1 py-0.5 rounded bg-purple-500/20 text-purple-400 font-bold">IEP</span>}
                            {student.ell && <span className="text-[8px] px-1 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-bold">ELL</span>}
                          </div>
                          {student.notes && <p className="text-[10px] text-surface-500">{student.notes}</p>}
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${st.border} ${st.bg}`} style={{ color: st.ring }}>{st.label}</span>
                      </motion.div>
                    )
                  })}
                </div>
              )}

              {/* Legend */}
              <div className="flex items-center gap-4 mt-5 pt-4 border-t border-white/[0.06]">
                {Object.entries(statusConfig).map(([key, val]) => (
                  <div key={key} className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: val.ring }} />
                    <span className="text-[10px] text-surface-400">{val.label}</span>
                  </div>
                ))}
                <div className="flex items-center gap-1.5 ml-auto">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-400 font-bold">IEP</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-400 font-bold">ELL</span>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* Unassigned students */}
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

          {/* Student roster */}
          <FadeInWhenVisible delay={0.12}>
            <div className="glass-card p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-surface-300">Student Roster</p>
                <span className="text-[10px] text-surface-500">{students.length}</span>
              </div>
              <div className="space-y-1.5 max-h-[300px] overflow-y-auto">
                {students.map((s, i) => {
                  const st = statusConfig[s.status]
                  const seat = seats.find(seat => seat.studentId === s.id)
                  return (
                    <motion.div
                      key={s.id}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/[0.03] transition-colors"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0" style={{ background: `linear-gradient(135deg, ${s.color}, ${s.color}99)` }}>
                        {s.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-semibold text-white truncate">{s.name}</p>
                        {seat && <p className="text-[9px] text-surface-600">{seat.row + 1}{String.fromCharCode(65 + seat.col)}</p>}
                      </div>
                      <div className="flex items-center gap-0.5">
                        {s.iep && <div className="w-3 h-3 rounded-full bg-purple-500/30" title="IEP" />}
                        {s.ell && <div className="w-3 h-3 rounded-full bg-cyan-500/30" title="ELL" />}
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: st.ring + '60' }} title={st.label} />
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </FadeInWhenVisible>

          {/* Quick Actions */}
          <FadeInWhenVisible delay={0.18}>
            <div className="glass-card p-4">
              <p className="text-xs font-bold text-surface-300 mb-3">Quick Actions</p>
              <div className="space-y-2">
                {[
                  { label: 'Auto-arrange by performance', icon: BarChart2, color: '#6366f1' },
                  { label: 'Group ELL students together', icon: Users, color: '#22d3ee' },
                  { label: 'Separate behavior flags', icon: AlertTriangle, color: '#f59e0b' },
                  { label: 'Print seating chart', icon: Download, color: '#10b981' },
                  { label: 'Save as template', icon: Save, color: '#8b5cf6' },
                ].map(action => (
                  <motion.button
                    key={action.label}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] text-surface-300 hover:text-white hover:bg-white/[0.04] transition-all"
                    whileHover={{ x: 2 }}
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

          {/* Saved Arrangements */}
          <FadeInWhenVisible delay={0.22}>
            <div className="glass-card p-4">
              <p className="text-xs font-bold text-surface-300 mb-3">Saved Arrangements</p>
              <div className="space-y-2">
                {[
                  { name: 'Collaborative Groups', date: 'Jul 25' },
                  { name: 'Assessment Day', date: 'Jul 18' },
                  { name: 'Lab Day Layout', date: 'Jul 10' },
                ].map((arr, i) => (
                  <div key={arr.name} className="flex items-center justify-between py-2 border-b border-white/[0.05] last:border-0">
                    <div className="flex items-center gap-2">
                      <LayoutGrid className="w-3.5 h-3.5 text-surface-500" />
                      <span className="text-[11px] text-surface-300">{arr.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-surface-600">{arr.date}</span>
                      <button className="text-[10px] text-accent-400 hover:text-accent-300">Load</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeInWhenVisible>
        </div>
      </div>
    </div>
  )
}

// Missing import
function BarChart2({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
    </svg>
  )
}
