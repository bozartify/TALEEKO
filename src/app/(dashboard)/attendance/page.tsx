'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckSquare, Check, X, Clock, Circle, ChevronLeft, ChevronRight,
  Download, TrendingUp, BarChart2, Sparkles, ChevronDown,
  Bell, Mail, AlertTriangle, FileText, Search,
  CalendarDays, Target, Award, CheckCircle
} from 'lucide-react'
import { FadeUp, FadeInWhenVisible } from '@/components/ui/motion'

type Status = 'present' | 'absent' | 'late' | 'excused'

const statusCycle: Status[] = ['present', 'absent', 'late', 'excused']

const statusConfig: Record<Status, { icon: typeof Check; label: string; colorClass: string; bgClass: string; hex: string }> = {
  present: { icon: Check,   label: 'Present', colorClass: 'text-success-400', bgClass: 'bg-success-400/15', hex: '#10b981' },
  absent:  { icon: X,      label: 'Absent',  colorClass: 'text-danger-400',  bgClass: 'bg-danger-400/15',  hex: '#ef4444' },
  late:    { icon: Clock,  label: 'Late',    colorClass: 'text-warning-400', bgClass: 'bg-warning-400/15', hex: '#f59e0b' },
  excused: { icon: Circle, label: 'Excused', colorClass: 'text-electric-400',bgClass: 'bg-electric-400/15',hex: '#22d3ee' },
}

const classes = ['AP Biology', '10th English', 'Algebra II']
const periods = ['1st Period', '2nd Period', '3rd Period', '4th Period']

interface StudentRecord {
  name: string
  parentEmail: string
  iep?: boolean
  ell?: boolean
  absences30d: number
}

const STUDENTS: StudentRecord[] = [
  { name: 'Emma Wilson',     parentEmail: 'ewilson.parent@email.com', absences30d: 1 },
  { name: 'Liam Chen',       parentEmail: 'lchen.parent@email.com',   absences30d: 4, iep: true },
  { name: 'Sofia Rodriguez', parentEmail: 'srod.parent@email.com',    absences30d: 2, ell: true },
  { name: 'Noah Thompson',   parentEmail: 'nthom.parent@email.com',   absences30d: 6 },
  { name: 'Ava Patel',       parentEmail: 'apatel.parent@email.com',  absences30d: 1 },
  { name: 'Mason Kim',       parentEmail: 'mkim.parent@email.com',    absences30d: 3 },
  { name: 'Isabella Jones',  parentEmail: 'ijones.parent@email.com',  absences30d: 0 },
  { name: 'Ethan Davis',     parentEmail: 'edavis.parent@email.com',  absences30d: 1 },
]

const studentNames = STUDENTS.map(s => s.name)
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
const weeklyTrendData = [96, 93, 91, 88, 90, 87, 89, 92]
const weeklyTrendLabels = ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Wk 5', 'Wk 6', 'Wk 7', 'Now']

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('')
}

function generateInitialData(): Record<string, Record<string, Status>> {
  const data: Record<string, Record<string, Status>> = {}
  const presets: Status[][] = [
    ['present', 'present', 'present', 'late',    'present'],
    ['present', 'absent',  'present', 'absent',  'present'],
    ['present', 'present', 'excused', 'present', 'present'],
    ['late',    'present', 'absent',  'present', 'present'],
    ['present', 'present', 'present', 'present', 'absent'],
    ['present', 'late',    'present', 'present', 'present'],
    ['present', 'present', 'present', 'present', 'present'],
    ['excused', 'present', 'present', 'present', 'present'],
  ]
  studentNames.forEach((name, si) => {
    data[name] = {}
    days.forEach((day, di) => { data[name][day] = presets[si][di] })
  })
  return data
}

function getWeekDates(offset: number) {
  const now = new Date()
  const monday = new Date(now)
  monday.setDate(now.getDate() - now.getDay() + 1 + offset * 7)
  return days.map((day, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return {
      day,
      date: d.getDate(),
      month: d.toLocaleString('default', { month: 'short' }),
    }
  })
}

export default function AttendancePage() {
  const [selectedClass, setSelectedClass] = useState(classes[0])
  const [selectedPeriod, setSelectedPeriod] = useState(periods[0])
  const [weekOffset, setWeekOffset] = useState(0)
  const [attendance, setAttendance] = useState<Record<string, Record<string, Status>>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('taleeko_attendance_data')
        if (saved) return JSON.parse(saved)
      } catch {}
    }
    return generateInitialData()
  })
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [aiOpen, setAiOpen] = useState(true)
  const [notifyModal, setNotifyModal] = useState<StudentRecord | null>(null)
  const [exportOpen, setExportOpen] = useState(false)
  const [noteModal, setNoteModal] = useState<StudentRecord | null>(null)
  const [noteText, setNoteText] = useState('')
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [searchQuery, setSearchQuery] = useState('')
  const [filterAtRisk, setFilterAtRisk] = useState(false)
  const [notifyMsg, setNotifyMsg] = useState('')
  const [toastMsg, setToastMsg] = useState('')
  function showToast(msg: string) { setToastMsg(msg); setTimeout(() => setToastMsg(''), 2500) }

  const weekDates = getWeekDates(weekOffset)

  const toggleStatus = (student: string, day: string) => {
    setAttendance(prev => {
      const current = prev[student][day]
      const idx = statusCycle.indexOf(current)
      const next = statusCycle[(idx + 1) % statusCycle.length]
      const updated = { ...prev, [student]: { ...prev[student], [day]: next } }
      try { localStorage.setItem('taleeko_attendance_data', JSON.stringify(updated)) } catch {}
      return updated
    })
  }

  const toggleSelect = (name: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(name) ? next.delete(name) : next.add(name)
      return next
    })
  }

  const toggleSelectAll = () => {
    setSelected(prev =>
      prev.size === studentNames.length ? new Set() : new Set(studentNames)
    )
  }

  const applyBulkStatus = (status: Status) => {
    setAttendance(prev => {
      const next = { ...prev }
      selected.forEach(name => {
        next[name] = { ...next[name] }
        days.forEach(day => { next[name][day] = status })
      })
      return next
    })
    setSelected(new Set())
  }

  const markAllPresent = () => {
    setAttendance(prev => {
      const next = { ...prev }
      studentNames.forEach(name => {
        next[name] = { ...next[name] }
        days.forEach(day => { next[name][day] = 'present' })
      })
      return next
    })
  }

  const getStudentRate = (student: string) => {
    const statuses = Object.values(attendance[student])
    const pCount = statuses.filter(s => s === 'present' || s === 'late').length
    return Math.round((pCount / statuses.length) * 100)
  }

  const allStatuses = studentNames.flatMap(name => Object.values(attendance[name]))
  const presentCount  = allStatuses.filter(s => s === 'present').length
  const absentCount   = allStatuses.filter(s => s === 'absent').length
  const lateCount     = allStatuses.filter(s => s === 'late').length
  const excusedCount  = allStatuses.filter(s => s === 'excused').length
  const attendanceRate = Math.round(((presentCount + lateCount) / allStatuses.length) * 100)

  const atRiskStudents = STUDENTS.filter(s => s.absences30d >= 3)
  const perfectStudents = STUDENTS.filter(s => s.absences30d === 0)

  const filteredStudents = STUDENTS.filter(s => {
    if (searchQuery && !s.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    if (filterAtRisk && s.absences30d < 3) return false
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <FadeUp>
        <div className="hero-mesh rounded-3xl p-6 border border-white/[0.06]">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg,#10b981,#059669)' }}>
                <CheckSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-black text-white tracking-tight">Attendance Tracker</h1>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold border border-emerald-500/20">AI-Powered</span>
                </div>
                <p className="text-sm text-surface-400">{STUDENTS.length} students · {selectedClass} · {selectedPeriod} · Week of {weekDates[0].month} {weekDates[0].date}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button className="btn-secondary text-xs px-3 py-1.5" onClick={() => setExportOpen(true)}>
                <Download className="w-3.5 h-3.5" /> Export
              </button>
              <motion.button className="btn-gradient text-xs" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => { markAllPresent(); showToast('All students marked present!') }}>
                <Check className="w-3.5 h-3.5" /> Mark All Present
              </motion.button>
            </div>
          </div>
          <div className="border-t border-white/[0.06] pt-4 flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold">Students</span>
              <span className="text-xs font-bold text-white">{STUDENTS.length}</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold">Rate</span>
              <span className="text-xs font-bold text-success-400">{attendanceRate}%</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold">Present</span>
              <span className="text-xs font-bold text-white">{presentCount}</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold">Absent</span>
              <span className="text-xs font-bold text-danger-400">{absentCount}</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold">At Risk</span>
              <span className="text-xs font-bold text-warning-400">{atRiskStudents.length}</span>
            </div>
          </div>
        </div>
      </FadeUp>

      {/* Class + Period Selectors */}
      <FadeUp delay={0.04}>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            {classes.map(c => (
              <button
                key={c}
                onClick={() => setSelectedClass(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedClass === c ? 'bg-white/[0.08] text-white' : 'text-surface-400 hover:text-surface-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            {periods.map(p => (
              <button
                key={p}
                onClick={() => setSelectedPeriod(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedPeriod === p ? 'bg-white/[0.08] text-white' : 'text-surface-400 hover:text-surface-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </FadeUp>

      {/* AI Insights Panel */}
      <FadeUp delay={0.06}>
        <div className="glass-card overflow-hidden">
          <button
            className="w-full flex items-center justify-between px-5 py-4"
            onClick={() => setAiOpen(p => !p)}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent-400" />
              <span className="text-sm font-semibold text-white">AI Attendance Insights</span>
              {atRiskStudents.length > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-danger-400/20 text-danger-400">
                  {atRiskStudents.length} at risk
                </span>
              )}
            </div>
            <ChevronDown className={`w-4 h-4 text-surface-400 transition-transform ${aiOpen ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {aiOpen && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-5 space-y-2 border-t border-white/[0.06] pt-4">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-danger-400/[0.08] border border-danger-400/15">
                    <AlertTriangle className="w-4 h-4 text-danger-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-danger-300">Chronic Absenteeism Alert</p>
                      <p className="text-[11px] text-surface-400 mt-0.5">
                        Liam Chen (4 absences) and Noah Thompson (6 absences) exceed the 3-absence threshold for the 30-day period. Immediate parent outreach is recommended.
                      </p>
                    </div>
                    <button
                      onClick={() => setNotifyModal(STUDENTS.find(s => s.name === 'Noah Thompson') ?? null)}
                      className="text-[10px] font-semibold text-danger-400 hover:text-danger-300 flex-shrink-0 whitespace-nowrap"
                    >
                      Notify →
                    </button>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-warning-400/[0.08] border border-warning-400/15">
                    <TrendingUp className="w-4 h-4 text-warning-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-warning-300">Declining Weekly Trend</p>
                      <p className="text-[11px] text-surface-400 mt-0.5">
                        Class attendance has dipped from 96% (Week 1) to {attendanceRate}% this week — a 4-point decline. Monday and Wednesday show the highest absence rates.
                      </p>
                    </div>
                    <button className="text-[10px] font-semibold text-warning-400 hover:text-warning-300 flex-shrink-0">View →</button>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-accent-400/[0.08] border border-accent-400/15">
                    <Award className="w-4 h-4 text-accent-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-accent-300">Perfect Attendance — Recognize Isabella Jones</p>
                      <p className="text-[11px] text-surface-400 mt-0.5">
                        Isabella Jones has 0 absences this month. A public recognition can motivate peers and create a positive attendance culture.
                      </p>
                    </div>
                    <button className="text-[10px] font-semibold text-accent-400 hover:text-accent-300 flex-shrink-0">Award →</button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </FadeUp>

      {/* Stat Cards */}
      <FadeUp delay={0.08}>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            { label: 'Present',      value: presentCount,  color: '#10b981', icon: Check,       sub: `${Math.round((presentCount / allStatuses.length) * 100)}% of records` },
            { label: 'Absent',       value: absentCount,   color: '#ef4444', icon: X,           sub: `${Math.round((absentCount / allStatuses.length) * 100)}% of records` },
            { label: 'Late',         value: lateCount,     color: '#f59e0b', icon: Clock,       sub: `${Math.round((lateCount / allStatuses.length) * 100)}% of records` },
            { label: 'Excused',      value: excusedCount,  color: '#22d3ee', icon: Circle,      sub: `${Math.round((excusedCount / allStatuses.length) * 100)}% of records` },
            { label: 'Weekly Rate',  value: `${attendanceRate}%`, color: '#8b5cf6', icon: TrendingUp, sub: attendanceRate >= 90 ? '✓ On Target' : '↓ Below 90% Goal' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="glass-card p-4"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.06 }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: stat.color + '22' }}>
                  <stat.icon className="w-3.5 h-3.5" style={{ color: stat.color }} />
                </div>
                <span className="text-xs font-medium text-surface-400">{stat.label}</span>
              </div>
              <div className="text-2xl font-black text-white">{stat.value}</div>
              <div className="text-[10px] text-surface-500 mt-0.5">{stat.sub}</div>
            </motion.div>
          ))}
        </div>
      </FadeUp>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Left: Table Area */}
        <div className="xl:col-span-3 space-y-4">

          {/* Week Navigation */}
          <FadeUp delay={0.1}>
            <div className="glass-card p-4">
              <div className="flex items-center justify-between mb-3">
                <motion.button
                  className="p-2 rounded-lg hover:bg-white/[0.06] text-surface-400 hover:text-white transition-colors"
                  whileHover={{ x: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setWeekOffset(prev => prev - 1)}
                >
                  <ChevronLeft className="w-4 h-4" />
                </motion.button>
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-3.5 h-3.5 text-surface-500" />
                  <span className="text-sm font-semibold text-white">
                    {weekDates[0].month} {weekDates[0].date} – {weekDates[4].month} {weekDates[4].date}
                  </span>
                  {weekOffset === 0 && (
                    <span className="text-[10px] bg-accent-500/20 text-accent-300 px-2 py-0.5 rounded-full font-semibold">
                      Current Week
                    </span>
                  )}
                </div>
                <motion.button
                  className="p-2 rounded-lg hover:bg-white/[0.06] text-surface-400 hover:text-white transition-colors"
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setWeekOffset(prev => prev + 1)}
                >
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {weekDates.map((wd, i) => {
                  const isToday = i === new Date().getDay() - 1 && weekOffset === 0
                  return (
                    <motion.div
                      key={wd.day}
                      className={`text-center py-2.5 rounded-xl transition-colors ${
                        isToday ? 'bg-accent-500/15 border border-accent-500/20' : 'bg-white/[0.02]'
                      }`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <div className="text-[10px] text-surface-500 uppercase tracking-wider">{wd.day}</div>
                      <div className={`text-sm font-bold ${isToday ? 'text-accent-300' : 'text-white'}`}>{wd.date}</div>
                      <div className="text-[9px] text-surface-600">{wd.month}</div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </FadeUp>

          {/* Search + Filter */}
          <FadeUp delay={0.12}>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-surface-500" />
                <input
                  type="text"
                  placeholder="Search students…"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white/[0.04] border border-white/[0.08] text-surface-200 placeholder:text-surface-600 focus:outline-none focus:border-accent-500/40"
                />
              </div>
              <button
                onClick={() => setFilterAtRisk(p => !p)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
                  filterAtRisk
                    ? 'bg-danger-400/15 border-danger-400/30 text-danger-300'
                    : 'border-white/[0.08] text-surface-400 hover:text-surface-200'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                At Risk Only
              </button>
            </div>
          </FadeUp>

          {/* Bulk Action Bar */}
          <AnimatePresence>
            {selected.size > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="glass-card p-3 border border-accent-500/20 flex items-center gap-3 flex-wrap"
              >
                <span className="text-xs font-semibold text-accent-300">{selected.size} selected</span>
                <div className="flex items-center gap-2 flex-wrap">
                  {(['present', 'absent', 'late', 'excused'] as Status[]).map(s => (
                    <button
                      key={s}
                      onClick={() => applyBulkStatus(s)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${statusConfig[s].bgClass} ${statusConfig[s].colorClass}`}
                    >
                      Mark {statusConfig[s].label}
                    </button>
                  ))}
                  <button className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-white/[0.05] text-surface-300 hover:bg-white/[0.08]">
                    <Bell className="w-3 h-3" /> Notify Parents
                  </button>
                </div>
                <button onClick={() => setSelected(new Set())} className="ml-auto text-surface-500 hover:text-surface-300">
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Attendance Table */}
          <FadeUp delay={0.14}>
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px]">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      <th className="px-4 py-3 sticky left-0 bg-surface-900/80 backdrop-blur-sm z-10 w-8">
                        <input
                          type="checkbox"
                          checked={selected.size === studentNames.length && studentNames.length > 0}
                          onChange={toggleSelectAll}
                          className="w-3.5 h-3.5 accent-accent-500 cursor-pointer"
                        />
                      </th>
                      <th className="text-left text-xs font-semibold text-surface-300 px-3 py-3 sticky left-8 bg-surface-900/80 backdrop-blur-sm z-10 w-44">
                        Student
                      </th>
                      {weekDates.map(wd => (
                        <th key={wd.day} className="text-center text-xs font-semibold text-surface-300 px-3 py-3 min-w-[68px]">
                          <div>{wd.day}</div>
                          <div className="text-[10px] font-normal text-surface-600">{wd.date}</div>
                        </th>
                      ))}
                      <th className="text-center text-xs font-semibold text-surface-300 px-3 py-3">Rate</th>
                      <th className="text-center text-xs font-semibold text-surface-300 px-3 py-3 whitespace-nowrap">30d Abs</th>
                      <th className="text-right text-xs font-semibold text-surface-300 px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student, si) => {
                      const rate = getStudentRate(student.name)
                      const isSelected = selected.has(student.name)
                      const isAtRisk = student.absences30d >= 3
                      return (
                        <motion.tr
                          key={student.name}
                          className={`border-b border-white/[0.04] transition-colors ${
                            isSelected
                              ? 'bg-accent-500/[0.05]'
                              : isAtRisk
                              ? 'bg-danger-400/[0.03] hover:bg-danger-400/[0.06]'
                              : 'hover:bg-white/[0.02]'
                          }`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: si * 0.03 }}
                        >
                          <td className="px-4 py-3 sticky left-0 z-10 bg-transparent">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelect(student.name)}
                              className="w-3.5 h-3.5 accent-accent-500 cursor-pointer"
                            />
                          </td>
                          <td className="px-3 py-3 sticky left-8 bg-surface-900/60 backdrop-blur-sm z-10">
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                                  isAtRisk ? 'bg-danger-400/20 text-danger-300' : 'bg-accent-500/20 text-accent-300'
                                }`}
                              >
                                {getInitials(student.name)}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="text-xs font-medium text-white">{student.name}</span>
                                  {student.iep && (
                                    <span className="text-[9px] px-1 py-0.5 rounded bg-accent-500/20 text-accent-300 font-semibold">IEP</span>
                                  )}
                                  {student.ell && (
                                    <span className="text-[9px] px-1 py-0.5 rounded bg-electric-400/20 text-electric-400 font-semibold">ELL</span>
                                  )}
                                </div>
                                {notes[student.name] && (
                                  <div className="text-[10px] text-surface-500 truncate max-w-[120px] mt-0.5">
                                    {notes[student.name]}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          {days.map(day => {
                            const status = attendance[student.name][day]
                            const config = statusConfig[status]
                            const Icon = config.icon
                            return (
                              <td key={day} className="text-center px-3 py-3">
                                <motion.button
                                  className={`w-9 h-9 rounded-xl ${config.bgClass} flex items-center justify-center mx-auto`}
                                  onClick={() => toggleStatus(student.name, day)}
                                  whileHover={{ scale: 1.15 }}
                                  whileTap={{ scale: 0.88 }}
                                  title={config.label}
                                >
                                  <Icon className={`w-4 h-4 ${config.colorClass}`} />
                                </motion.button>
                              </td>
                            )
                          })}
                          <td className="text-center px-3 py-3">
                            <div className="flex flex-col items-center gap-1">
                              <span className={`text-sm font-bold ${
                                rate >= 90 ? 'text-success-400' : rate >= 80 ? 'text-warning-400' : 'text-danger-400'
                              }`}>
                                {rate}%
                              </span>
                              {(() => {
                                const W = 48, H = 4
                                const bw = (rate / 100) * W
                                const color = rate >= 90 ? '#10b981' : rate >= 80 ? '#f59e0b' : '#ef4444'
                                const gid = `att-rate-${si}`
                                return (
                                  <svg viewBox={`0 0 ${W} ${H}`} width={48} height={4} className="overflow-visible">
                                    <defs>
                                      <linearGradient id={gid} x1="0" x2="1" y1="0" y2="0">
                                        <stop offset="0%" stopColor={color} />
                                        <stop offset="100%" stopColor={color + '99'} />
                                      </linearGradient>
                                    </defs>
                                    <rect x={0} y={0} width={W} height={H} rx={2} fill="rgba(255,255,255,0.08)" />
                                    <motion.rect
                                      x={0} y={0} height={H} rx={2}
                                      fill={`url(#${gid})`}
                                      initial={{ width: 0 }}
                                      animate={{ width: bw }}
                                      transition={{ duration: 0.8, delay: si * 0.05 }}
                                    />
                                  </svg>
                                )
                              })()}
                            </div>
                          </td>
                          <td className="text-center px-3 py-3">
                            <span className={`text-xs font-bold ${
                              student.absences30d >= 4 ? 'text-danger-400' :
                              student.absences30d >= 2 ? 'text-warning-400' : 'text-surface-400'
                            }`}>
                              {student.absences30d}
                            </span>
                          </td>
                          <td className="text-right px-4 py-3">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => { setNoteModal(student); setNoteText(notes[student.name] ?? '') }}
                                className="w-7 h-7 rounded-lg flex items-center justify-center text-surface-500 hover:text-surface-200 hover:bg-white/[0.06] transition-all"
                                title="Add Note"
                              >
                                <FileText className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  setNotifyModal(student)
                                  setNotifyMsg(`Dear Parent/Guardian,\n\nI wanted to reach out regarding ${student.name}'s recent attendance. They have recorded ${student.absences30d} absence(s) in the past 30 days.\n\nPlease feel free to contact me with any questions.\n\nBest regards,\nMs. Johnson`)
                                }}
                                className="w-7 h-7 rounded-lg flex items-center justify-center text-surface-500 hover:text-surface-200 hover:bg-white/[0.06] transition-all"
                                title="Notify Parent"
                              >
                                <Mail className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </FadeUp>

          {/* Legend */}
          <FadeInWhenVisible delay={0.15}>
            <div className="glass-card p-4">
              <div className="flex flex-wrap items-center gap-4">
                {statusCycle.map(status => {
                  const config = statusConfig[status]
                  const Icon = config.icon
                  return (
                    <div key={status} className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg ${config.bgClass} flex items-center justify-center`}>
                        <Icon className={`w-3.5 h-3.5 ${config.colorClass}`} />
                      </div>
                      <span className="text-xs text-surface-300 capitalize">{config.label}</span>
                    </div>
                  )
                })}
                <span className="text-[10px] text-surface-500 ml-auto">Click any cell to cycle statuses</span>
              </div>
            </div>
          </FadeInWhenVisible>
        </div>

        {/* Right Sidebar */}
        <div className="xl:col-span-1 space-y-4">

          {/* 8-Week Trend */}
          <FadeInWhenVisible delay={0.1}>
            <div className="glass-card p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-semibold text-surface-300 flex items-center gap-1.5">
                  <BarChart2 className="w-3.5 h-3.5 text-accent-400" />
                  8-Week Trend
                </h4>
                <span className={`text-[10px] font-semibold ${attendanceRate >= 90 ? 'text-success-400' : 'text-warning-400'}`}>
                  {attendanceRate >= 90 ? '▲' : '▼'} {attendanceRate}%
                </span>
              </div>
              {(() => {
                const W = 220, H = 80, PX = 8, PY = 10
                const minV = 84, maxV = 100
                const pts = weeklyTrendData.map((v, i) => ({
                  x: PX + (i / (weeklyTrendData.length - 1)) * (W - PX * 2),
                  y: PY + (H - PY * 2) * (1 - (v - minV) / (maxV - minV)),
                }))
                let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`
                for (let i = 1; i < pts.length; i++) {
                  const cpx = ((pts[i].x + pts[i-1].x) / 2).toFixed(1)
                  d += ` C ${cpx} ${pts[i-1].y.toFixed(1)} ${cpx} ${pts[i].y.toFixed(1)} ${pts[i].x.toFixed(1)} ${pts[i].y.toFixed(1)}`
                }
                const area = d + ` L ${pts[pts.length-1].x.toFixed(1)} ${H} L ${pts[0].x.toFixed(1)} ${H} Z`
                const lastColor = weeklyTrendData[weeklyTrendData.length-1] >= 90 ? '#10b981' : '#f59e0b'
                return (
                  <div>
                    <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="overflow-visible" style={{ maxHeight: 88 }}>
                      <defs>
                        <linearGradient id="at-area" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={lastColor} stopOpacity="0.3" />
                          <stop offset="100%" stopColor={lastColor} stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      {[86, 90, 94, 98].map(v => (
                        <line key={v}
                          x1={PX} y1={PY + (H - PY * 2) * (1 - (v - minV) / (maxV - minV))}
                          x2={W - PX} y2={PY + (H - PY * 2) * (1 - (v - minV) / (maxV - minV))}
                          stroke="rgba(255,255,255,0.05)" strokeWidth="1"
                        />
                      ))}
                      <path d={area} fill="url(#at-area)" />
                      <path d={d} fill="none" stroke={lastColor} strokeWidth="1.5" strokeLinecap="round" />
                      {pts.map((p, i) => (
                        <g key={i}>
                          <circle cx={p.x} cy={p.y} r={i === pts.length - 1 ? 3.5 : 2} fill={lastColor} />
                          <text x={p.x} y={H - 1} textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.3)">{weeklyTrendLabels[i].replace('Wk ', '')}</text>
                        </g>
                      ))}
                    </svg>
                    <div className="flex justify-between text-[9px] text-surface-600 border-t border-white/[0.04] pt-1 mt-0.5">
                      <span>Wk 1</span><span>84–100% range</span><span>Now</span>
                    </div>
                  </div>
                )
              })()}
            </div>
          </FadeInWhenVisible>

          {/* Needs Attention */}
          <FadeInWhenVisible delay={0.15}>
            <div className="glass-card p-4">
              <h4 className="text-xs font-semibold text-surface-300 flex items-center gap-1.5 mb-3">
                <AlertTriangle className="w-3.5 h-3.5 text-danger-400" />
                Needs Attention
              </h4>
              {atRiskStudents.length === 0 ? (
                <p className="text-xs text-surface-500 text-center py-2">All students on track ✓</p>
              ) : (
                <div className="space-y-2">
                  {atRiskStudents.map(s => {
                    const rate = getStudentRate(s.name)
                    return (
                      <div key={s.name} className="flex items-center gap-2 py-1">
                        <div className="w-6 h-6 rounded-full bg-danger-400/15 flex items-center justify-center text-[9px] font-bold text-danger-400 flex-shrink-0">
                          {getInitials(s.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium text-surface-200 truncate">{s.name}</div>
                          <div className="text-[10px] text-danger-400">{rate}% rate · {s.absences30d} abs/30d</div>
                        </div>
                        <button
                          onClick={() => {
                            setNotifyModal(s)
                            setNotifyMsg(`Dear Parent/Guardian,\n\nI wanted to reach out regarding ${s.name}'s recent attendance.`)
                          }}
                          className="w-6 h-6 rounded-lg flex items-center justify-center text-surface-500 hover:text-white hover:bg-white/[0.06] transition-all"
                        >
                          <Mail className="w-3 h-3" />
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </FadeInWhenVisible>

          {/* Monthly Overview */}
          <FadeInWhenVisible delay={0.2}>
            <div className="glass-card p-4">
              <h4 className="text-xs font-semibold text-surface-300 flex items-center gap-1.5 mb-3">
                <Target className="w-3.5 h-3.5 text-accent-400" />
                Monthly Overview
              </h4>
              {(() => {
                const classRateColor = attendanceRate >= 90 ? '#10b981' : '#f59e0b'
                const items = [
                  { label: 'Class Rate',     value: `${attendanceRate}%`,              color: classRateColor, pct: attendanceRate },
                  { label: 'Perfect (0 ab)', value: `${perfectStudents.length} stu`,   color: '#8b5cf6',     pct: (perfectStudents.length / STUDENTS.length) * 100 },
                  { label: 'At Risk (3+ ab)',value: `${atRiskStudents.length} stu`,    color: '#ef4444',     pct: (atRiskStudents.length / STUDENTS.length) * 100 },
                ]
                const W = 300, LW = 88, CW = 52, GAP = 8, ROW = 22
                const BAR_MAX = W - LW - CW - 6
                const H = items.length * (ROW + GAP) - GAP
                return (
                  <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible">
                    <defs>
                      {items.map((item, i) => (
                        <linearGradient key={i} id={`att-mo-${i}`} x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor={item.color} stopOpacity={0.9} />
                          <stop offset="100%" stopColor={item.color} stopOpacity={0.45} />
                        </linearGradient>
                      ))}
                    </defs>
                    {items.map((item, i) => {
                      const bw = (item.pct / 100) * BAR_MAX
                      const y = i * (ROW + GAP)
                      return (
                        <g key={item.label}>
                          <text x={0} y={y + 14} fill="rgba(255,255,255,0.5)" fontSize={10} fontFamily="inherit">{item.label}</text>
                          <rect x={LW} y={y + 5} width={BAR_MAX} height={12} rx={3} fill="rgba(255,255,255,0.04)" />
                          <motion.rect x={LW} y={y + 5} height={12} rx={3} fill={`url(#att-mo-${i})`}
                            initial={{ width: 0 }} animate={{ width: bw }}
                            transition={{ delay: 0.3 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
                          />
                          <text x={LW + BAR_MAX + 5} y={y + 14} fill={item.color} fontSize={10} fontFamily="inherit" fontWeight="bold">{item.value}</text>
                        </g>
                      )
                    })}
                  </svg>
                )
              })()}
            </div>
          </FadeInWhenVisible>

          {/* Quick Export */}
          <FadeInWhenVisible delay={0.25}>
            <div className="glass-card p-4">
              <h4 className="text-xs font-semibold text-surface-300 mb-3 flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5" />
                Quick Export
              </h4>
              <div className="space-y-1.5">
                {['Weekly PDF Report', 'Monthly CSV', 'At-Risk Summary', 'Parent Contact List'].map(label => (
                  <button
                    key={label}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] text-xs text-surface-300 hover:text-white transition-all"
                  >
                    {label}
                    <ChevronRight className="w-3 h-3 text-surface-600" />
                  </button>
                ))}
              </div>
            </div>
          </FadeInWhenVisible>
        </div>
      </div>

      {/* Note Modal */}
      <AnimatePresence>
        {noteModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setNoteModal(null)} />
            <motion.div
              className="relative glass-card p-6 w-full max-w-md z-10"
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white">Note — {noteModal.name}</h3>
                <button onClick={() => setNoteModal(null)} className="text-surface-500 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <textarea
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
                rows={4}
                placeholder="Attendance note, context, or follow-up action…"
                className="w-full px-3 py-2 text-xs rounded-xl bg-white/[0.04] border border-white/[0.08] text-surface-200 placeholder:text-surface-600 focus:outline-none focus:border-accent-500/40 resize-none mb-4"
              />
              <div className="flex justify-end gap-2">
                <button onClick={() => setNoteModal(null)} className="btn-secondary text-xs px-4 py-2">Cancel</button>
                <button
                  onClick={() => {
                    setNotes(prev => ({ ...prev, [noteModal.name]: noteText }))
                    setNoteModal(null)
                  }}
                  className="btn-gradient text-xs px-4 py-2"
                >
                  Save Note
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notify Parent Modal */}
      <AnimatePresence>
        {notifyModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setNotifyModal(null)} />
            <motion.div
              className="relative glass-card p-6 w-full max-w-lg z-10"
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Bell className="w-4 h-4 text-accent-400" />
                  Notify Parent — {notifyModal.name}
                </h3>
                <button onClick={() => setNotifyModal(null)} className="text-surface-500 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] text-surface-500 block mb-1">To</label>
                  <input
                    type="email"
                    defaultValue={notifyModal.parentEmail}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white/[0.04] border border-white/[0.08] text-surface-200 focus:outline-none focus:border-accent-500/40"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-surface-500 block mb-1">Subject</label>
                  <input
                    type="text"
                    defaultValue={`Attendance Update — ${notifyModal.name}`}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white/[0.04] border border-white/[0.08] text-surface-200 focus:outline-none focus:border-accent-500/40"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-surface-500 block mb-1">Message</label>
                  <textarea
                    rows={5}
                    value={notifyMsg}
                    onChange={e => setNotifyMsg(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white/[0.04] border border-white/[0.08] text-surface-200 focus:outline-none focus:border-accent-500/40 resize-none"
                  />
                </div>
                <button className="flex items-center gap-1.5 text-[11px] text-accent-400 hover:text-accent-300 transition-colors">
                  <Sparkles className="w-3.5 h-3.5" />
                  AI-Draft Message
                </button>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button onClick={() => setNotifyModal(null)} className="btn-secondary text-xs px-4 py-2">Cancel</button>
                <button onClick={() => setNotifyModal(null)} className="btn-gradient text-xs px-4 py-2">
                  <Mail className="w-3.5 h-3.5" /> Send
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Export Modal */}
      <AnimatePresence>
        {exportOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setExportOpen(false)} />
            <motion.div
              className="relative glass-card p-6 w-full max-w-sm z-10"
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white">Export Attendance</h3>
                <button onClick={() => setExportOpen(false)} className="text-surface-500 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2">
                {[
                  { label: 'Weekly PDF Report',      desc: 'Formatted for printing',       emoji: '📄' },
                  { label: 'Monthly CSV Data',        desc: 'For spreadsheet analysis',      emoji: '📊' },
                  { label: 'At-Risk Student Report',  desc: 'Students with 3+ absences',    emoji: '⚠️' },
                  { label: 'Parent Contact List',     desc: 'CSV with parent email list',    emoji: '📧' },
                ].map(opt => (
                  <button
                    key={opt.label}
                    onClick={() => setExportOpen(false)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] transition-all text-left"
                  >
                    <span className="text-xl">{opt.emoji}</span>
                    <div>
                      <div className="text-xs font-medium text-surface-200">{opt.label}</div>
                      <div className="text-[10px] text-surface-500">{opt.desc}</div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-surface-600 ml-auto" />
                  </button>
                ))}
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
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
