'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield, Users, FileText, CheckCircle2, TrendingUp,
  ChevronDown, Check, Clock, Plus, Calendar, Download,
  Sparkles, CheckSquare, AlertTriangle, Search, Mail,
  X, Eye, BarChart2, Target, Edit, CheckCircle
} from 'lucide-react'
import { FadeUp, FadeInWhenVisible, StaggerList, StaggerItem, fadeUp } from '@/components/ui/motion'

type PlanType = 'IEP' | '504'
type DocStatus = 'complete' | 'incomplete' | 'overdue'
type FilterType = 'all' | 'IEP' | '504' | 'overdue'

interface AccommodationItem {
  label: string
  implemented: boolean
}

interface Student {
  name: string
  planType: PlanType
  grade: string
  disabilityCategory: string
  reviewDate: string
  accommodations: AccommodationItem[]
  docStatus: DocStatus
  meetingDate: string
  parentEmail: string
}

const students: Student[] = [
  {
    name: 'Marcus Johnson',
    planType: 'IEP',
    grade: '7th',
    disabilityCategory: 'Specific Learning Disability',
    reviewDate: 'Sep 15, 2026',
    accommodations: [
      { label: 'Extended time (1.5x)', implemented: true },
      { label: 'Preferential seating', implemented: true },
      { label: 'Audio text-to-speech', implemented: true },
      { label: 'Modified assignments', implemented: false },
      { label: 'Frequent breaks', implemented: true },
      { label: 'Visual schedules', implemented: true },
    ],
    docStatus: 'complete',
    meetingDate: 'Aug 12, 2026',
    parentEmail: 'mjohnson.parent@email.com',
  },
  {
    name: 'Sofia Reyes',
    planType: '504',
    grade: '9th',
    disabilityCategory: 'ADHD',
    reviewDate: 'Oct 3, 2026',
    accommodations: [
      { label: 'Preferential seating', implemented: true },
      { label: 'Frequent breaks', implemented: true },
      { label: 'Extended time (1.5x)', implemented: true },
      { label: 'Reduced homework load', implemented: false },
      { label: 'Visual schedules', implemented: true },
    ],
    docStatus: 'complete',
    meetingDate: 'Sep 5, 2026',
    parentEmail: 'sreyes.parent@email.com',
  },
  {
    name: 'Ethan Park',
    planType: 'IEP',
    grade: '8th',
    disabilityCategory: 'Autism Spectrum',
    reviewDate: 'Aug 22, 2026',
    accommodations: [
      { label: 'Visual schedules', implemented: true },
      { label: 'Preferential seating', implemented: true },
      { label: 'Behavioral intervention plan', implemented: true },
      { label: 'Frequent breaks', implemented: true },
      { label: 'Modified assignments', implemented: true },
      { label: 'Audio text-to-speech', implemented: false },
    ],
    docStatus: 'incomplete',
    meetingDate: 'Aug 8, 2026',
    parentEmail: 'epark.parent@email.com',
  },
  {
    name: 'Ava Thompson',
    planType: '504',
    grade: '10th',
    disabilityCategory: 'Anxiety Disorder',
    reviewDate: 'Nov 10, 2026',
    accommodations: [
      { label: 'Extended time (1.5x)', implemented: true },
      { label: 'Preferential seating', implemented: true },
      { label: 'Frequent breaks', implemented: true },
      { label: 'Reduced homework load', implemented: true },
    ],
    docStatus: 'complete',
    meetingDate: 'Oct 20, 2026',
    parentEmail: 'athompson.parent@email.com',
  },
  {
    name: 'Jaylen Carter',
    planType: 'IEP',
    grade: '7th',
    disabilityCategory: 'Speech/Language Impairment',
    reviewDate: 'Aug 5, 2026',
    accommodations: [
      { label: 'Audio text-to-speech', implemented: true },
      { label: 'Extended time (1.5x)', implemented: true },
      { label: 'Modified assignments', implemented: false },
      { label: 'Visual schedules', implemented: true },
      { label: 'Preferential seating', implemented: true },
    ],
    docStatus: 'overdue',
    meetingDate: 'Aug 1, 2026',
    parentEmail: 'jcarter.parent@email.com',
  },
  {
    name: 'Lily Nguyen',
    planType: 'IEP',
    grade: '6th',
    disabilityCategory: 'Emotional Disturbance',
    reviewDate: 'Sep 28, 2026',
    accommodations: [
      { label: 'Behavioral intervention plan', implemented: true },
      { label: 'Frequent breaks', implemented: true },
      { label: 'Preferential seating', implemented: true },
      { label: 'Reduced homework load', implemented: false },
      { label: 'Visual schedules', implemented: true },
      { label: 'Modified assignments', implemented: true },
    ],
    docStatus: 'complete',
    meetingDate: 'Sep 15, 2026',
    parentEmail: 'lnguyen.parent@email.com',
  },
]

const docStatusConfig: Record<DocStatus, { label: string; colorClass: string; bgClass: string }> = {
  complete:   { label: 'Complete',   colorClass: 'text-success-400', bgClass: 'bg-success-400/15' },
  incomplete: { label: 'Incomplete', colorClass: 'text-warning-400', bgClass: 'bg-warning-400/15' },
  overdue:    { label: 'Overdue',    colorClass: 'text-danger-400',  bgClass: 'bg-danger-400/15' },
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('')
}

const complianceTrend = [74, 78, 81, 84, 87, 88, 90, 92]
const complianceTrendLabels = ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Wk 5', 'Wk 6', 'Wk 7', 'Now']

export default function AccommodationsPage() {
  const [studentList, setStudentList] = useState(students)
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null)
  const [search, setSearch]                   = useState('')
  const [filter, setFilter]                   = useState<FilterType>('all')
  const [aiOpen, setAiOpen]                   = useState(true)
  const [noteModal, setNoteModal]             = useState<Student | null>(null)
  const [noteText, setNoteText]               = useState('')
  const [notes, setNotes]                     = useState<Record<string, string>>({})
  const [meetingModal, setMeetingModal]       = useState<Student | null>(null)
  const [addModal, setAddModal]               = useState(false)
  const [newAcc, setNewAcc]                   = useState({ student: '', label: '' })
  const [accStates, setAccStates]             = useState<Record<string, boolean>>({})
  const [toastMsg, setToastMsg]               = useState('')

  function showToast(msg: string) {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 2500)
  }

  const iepCount    = studentList.filter(s => s.planType === 'IEP').length
  const fiveCount   = studentList.filter(s => s.planType === '504').length
  const totalAcc    = studentList.reduce((sum, s) => sum + s.accommodations.length, 0)
  const implementedCount = studentList.reduce(
    (sum, s) => sum + s.accommodations.filter(a => {
      const key = `${s.name}::${a.label}`
      return key in accStates ? accStates[key] : a.implemented
    }).length, 0
  )
  const complianceRate = Math.round((implementedCount / totalAcc) * 100)
  const overdueStudents = studentList.filter(s => s.docStatus === 'overdue')

  const filteredStudents = studentList.filter(s => {
    if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false
    if (filter === 'IEP' && s.planType !== 'IEP') return false
    if (filter === '504' && s.planType !== '504') return false
    if (filter === 'overdue' && s.docStatus !== 'overdue') return false
    return true
  })

  function toggleImplemented(studentName: string, accLabel: string) {
    const key = `${studentName}::${accLabel}`
    setAccStates(prev => ({ ...prev, [key]: !(prev[key] ?? studentList.find(s => s.name === studentName)?.accommodations.find(a => a.label === accLabel)?.implemented ?? false) }))
  }

  function getAccImplemented(studentName: string, acc: AccommodationItem) {
    const key = `${studentName}::${acc.label}`
    return key in accStates ? accStates[key] : acc.implemented
  }

  return (
    <div className="space-y-6">
      {/* Hero header */}
      <FadeUp>
        <div className="hero-mesh rounded-3xl p-6 border border-white/[0.06]">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg,#6366f1,#a78bfa)' }}>
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-black text-white tracking-tight">IEP / 504 Accommodations</h1>
                  <span className="text-[10px] bg-accent-500/20 text-accent-400 px-2 py-0.5 rounded-full font-bold border border-accent-500/20">Compliance</span>
                </div>
                <p className="text-sm text-surface-400">Track, implement and document student accommodation plans</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="btn-secondary text-xs px-3 py-1.5" onClick={() => showToast('Records exported to CSV')}>
                <Download className="w-3.5 h-3.5" /> Export Records
              </button>
              <motion.button className="btn-gradient text-xs" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setAddModal(true)}>
                <Plus className="w-3.5 h-3.5" /> Add Accommodation
              </motion.button>
            </div>
          </div>
          <div className="border-t border-white/[0.06] pt-4 flex items-center gap-6 flex-wrap">
            {[
              { label: 'IEP Students', value: iepCount.toString(), color: '#a78bfa' },
              { label: '504 Plans', value: fiveCount.toString(), color: '#38bdf8' },
              { label: 'Total Accommodations', value: totalAcc.toString(), color: '#34d399' },
              { label: 'Implemented', value: implementedCount.toString(), color: '#4ade80' },
              { label: 'Compliance', value: `${complianceRate}%`, color: complianceRate >= 90 ? '#34d399' : '#fbbf24' },
            ].map(p => (
              <div key={p.label} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                <span className="text-xs text-surface-400">{p.label}</span>
                <span className="text-xs font-bold text-white">{p.value}</span>
              </div>
            ))}
          </div>
        </div>
      </FadeUp>

      {/* Stats */}
      <StaggerList className="grid grid-cols-2 lg:grid-cols-4 gap-4" delay={0.06}>
        {[
          { label: 'IEP Students',          value: iepCount.toString(),        icon: Users,        color: 'bg-accent-500/15 text-accent-400',    delta: `${studentList.filter(s=>s.planType==='IEP'&&s.docStatus==='complete').length} docs complete` },
          { label: '504 Plans',             value: fiveCount.toString(),        icon: FileText,     color: 'bg-electric-400/15 text-electric-400', delta: `${studentList.filter(s=>s.planType==='504'&&s.docStatus==='complete').length} docs complete` },
          { label: 'Active Accommodations', value: totalAcc.toString(),         icon: CheckCircle2, color: 'bg-success-400/15 text-success-400',   delta: `${implementedCount} implemented` },
          { label: 'Compliance Rate',       value: `${complianceRate}%`,        icon: TrendingUp,   color: complianceRate >= 90 ? 'bg-success-400/15 text-success-400' : 'bg-warning-400/15 text-warning-400', delta: complianceRate >= 90 ? '✓ On Target' : '↓ Below 90% Goal' },
        ].map(s => (
          <StaggerItem key={s.label} variants={fadeUp}>
            <motion.div
              className="stat-card h-full"
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
            >
              <div className={`icon-bubble ${s.color} mb-3`}><s.icon className="w-5 h-5" /></div>
              <div className="text-2xl font-black text-white">{s.value}</div>
              <div className="text-xs font-semibold text-surface-200 mt-0.5">{s.label}</div>
              <div className="text-xs text-surface-500 mt-1">{s.delta}</div>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerList>

      {/* AI Insights */}
      <FadeUp delay={0.1}>
        <div className="glass-card overflow-hidden">
          <button
            className="w-full flex items-center justify-between px-5 py-4"
            onClick={() => setAiOpen(p => !p)}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent-400" />
              <span className="text-sm font-semibold text-white">AI Accommodation Insights</span>
              {overdueStudents.length > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-danger-400/20 text-danger-400">
                  {overdueStudents.length} overdue
                </span>
              )}
            </div>
            <motion.div animate={{ rotate: aiOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="w-4 h-4 text-surface-400" />
            </motion.div>
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
                <div className="px-5 pb-5 pt-4 space-y-2 border-t border-white/[0.06]">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-danger-400/[0.08] border border-danger-400/15">
                    <AlertTriangle className="w-4 h-4 text-danger-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-danger-300">Overdue Documentation — Jaylen Carter</p>
                      <p className="text-[11px] text-surface-400 mt-0.5">Jaylen Carter's IEP documentation review date (Aug 5, 2026) has passed. Overdue documentation may create compliance risk. Update records immediately and schedule a case conference.</p>
                    </div>
                    <button onClick={() => { showToast('Meeting scheduled for Jaylen Carter'); setMeetingModal(studentList.find(s => s.name === 'Jaylen Carter') ?? null) }} className="text-[10px] font-semibold text-danger-400 hover:text-danger-300 whitespace-nowrap">Schedule →</button>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-warning-400/[0.08] border border-warning-400/15">
                    <Clock className="w-4 h-4 text-warning-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-warning-300">Pending Accommodations — 4 Unimplemented</p>
                      <p className="text-[11px] text-surface-400 mt-0.5">4 accommodations across 4 students are marked "Pending." Marcus Johnson's Modified Assignments and Jaylen Carter's Modified Assignments need follow-up this week.</p>
                    </div>
                    <button className="text-[10px] font-semibold text-warning-400 hover:text-warning-300 whitespace-nowrap" onClick={() => showToast('Opening pending accommodations review')}>Review →</button>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-success-400/[0.08] border border-success-400/15">
                    <TrendingUp className="w-4 h-4 text-success-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-success-300">Compliance Trending Up — {complianceRate}%</p>
                      <p className="text-[11px] text-surface-400 mt-0.5">Your accommodation compliance rate has improved 18 points since Week 1. You're close to the 95% target — implementing the 4 pending accommodations will get you there.</p>
                    </div>
                    <button className="text-[10px] font-semibold text-success-400 hover:text-success-300 whitespace-nowrap" onClick={() => showToast('All pending accommodations marked as implemented')}>Mark Done →</button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </FadeUp>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Student List */}
        <div className="xl:col-span-3 space-y-4">

          {/* Search + Filter */}
          <FadeUp delay={0.12}>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative flex-1 min-w-[180px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-surface-500" />
                <input
                  type="text"
                  placeholder="Search students…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white/[0.04] border border-white/[0.08] text-surface-200 placeholder:text-surface-600 focus:outline-none focus:border-accent-500/40"
                />
              </div>
              <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                {(['all', 'IEP', '504', 'overdue'] as FilterType[]).map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                      filter === f
                        ? f === 'overdue' ? 'bg-danger-400/20 text-danger-300' : 'bg-white/[0.08] text-white'
                        : 'text-surface-400 hover:text-surface-200'
                    }`}
                  >
                    {f === 'overdue' ? '⚠ Overdue' : f}
                  </button>
                ))}
              </div>
              <span className="text-xs text-surface-500">{filteredStudents.length} students</span>
            </div>
          </FadeUp>

          {/* Student Cards */}
          <FadeUp delay={0.14}>
            <div className="space-y-3">
              {filteredStudents.map((student, si) => {
                const isExpanded = expandedStudent === student.name
                const implementedAcc = student.accommodations.filter(a => getAccImplemented(student.name, a)).length
                const dsc = docStatusConfig[student.docStatus]
                return (
                  <motion.div
                    key={student.name}
                    className={`glass-card overflow-hidden ${student.docStatus === 'overdue' ? 'border border-danger-400/15' : ''}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + si * 0.05 }}
                  >
                    <button
                      onClick={() => setExpandedStudent(prev => prev === student.name ? null : student.name)}
                      className="w-full flex items-center gap-4 p-5 text-left hover:bg-white/[0.02] transition-colors"
                    >
                      <div className={`w-10 h-10 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0 ${
                        student.docStatus === 'overdue' ? 'bg-danger-400/20 text-danger-300' : 'bg-accent-500/15 text-accent-400'
                      }`}>
                        {getInitials(student.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-white">{student.name}</h4>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            student.planType === 'IEP' ? 'bg-accent-500/20 text-accent-400' : 'bg-electric-400/15 text-electric-400'
                          }`}>
                            {student.planType}
                          </span>
                          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${dsc.bgClass} ${dsc.colorClass}`}>
                            {dsc.label}
                          </span>
                        </div>
                        <p className="text-xs text-surface-400 mt-0.5">
                          {student.grade} Grade · {student.disabilityCategory} · Review: {student.reviewDate}
                        </p>
                      </div>
                      <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
                        <span className="text-xs text-surface-500">{implementedAcc}/{student.accommodations.length}</span>
                        {(() => {
                          const pct = (implementedAcc / student.accommodations.length) * 100
                          const color = implementedAcc === student.accommodations.length ? '#10b981' : '#f59e0b'
                          const bw = (pct / 100) * 80
                          return (
                            <svg viewBox="0 0 80 8" className="w-20 overflow-visible">
                              <defs>
                                <linearGradient id={`acc-${si}`} x1="0" y1="0" x2="1" y2="0">
                                  <stop offset="0%" stopColor={color} stopOpacity={0.9} />
                                  <stop offset="100%" stopColor={color} stopOpacity={0.6} />
                                </linearGradient>
                              </defs>
                              <rect x={0} y={1} width={80} height={6} rx={3} fill="rgba(255,255,255,0.05)" />
                              <motion.rect x={0} y={1} height={6} rx={3} fill={`url(#acc-${si})`}
                                initial={{ width: 0 }} animate={{ width: bw }}
                                transition={{ delay: 0.3 + si * 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                              />
                            </svg>
                          )
                        })()}
                      </div>
                      <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <ChevronDown className="w-4 h-4 text-surface-500" />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 pt-2 border-t border-white/[0.06]">
                            {/* Action Row */}
                            <div className="flex items-center gap-2 mb-4 flex-wrap">
                              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] text-xs text-surface-300 hover:bg-white/[0.08] hover:text-white transition-all" onClick={() => showToast(`Viewing ${student.planType} plan for ${student.name}`)}>
                                <Eye className="w-3.5 h-3.5" /> View Plan
                              </button>
                              <button
                                onClick={() => { setNoteModal(student); setNoteText(notes[student.name] ?? '') }}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] text-xs text-surface-300 hover:bg-white/[0.08] hover:text-white transition-all"
                              >
                                <Edit className="w-3.5 h-3.5" /> Log Note
                              </button>
                              <button
                                onClick={() => setMeetingModal(student)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] text-xs text-surface-300 hover:bg-white/[0.08] hover:text-white transition-all"
                              >
                                <Calendar className="w-3.5 h-3.5" /> Schedule Meeting
                              </button>
                              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] text-xs text-surface-300 hover:bg-white/[0.08] hover:text-white transition-all" onClick={() => showToast(`Notification sent to ${student.parentEmail}`)}>
                                <Mail className="w-3.5 h-3.5" /> Notify Parent
                              </button>
                            </div>

                            {notes[student.name] && (
                              <div className="mb-3 px-3 py-2 rounded-xl bg-accent-500/[0.08] border border-accent-500/15 text-xs text-surface-300">
                                <span className="font-semibold text-accent-300 mr-1">Note:</span>
                                {notes[student.name]}
                              </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {student.accommodations.map((acc, ai) => {
                                const isImpl = getAccImplemented(student.name, acc)
                                return (
                                  <motion.button
                                    key={acc.label}
                                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                                      isImpl
                                        ? 'bg-success-400/[0.06] border-success-400/15'
                                        : 'bg-warning-400/[0.06] border-warning-400/15'
                                    }`}
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: ai * 0.04 }}
                                    onClick={() => toggleImplemented(student.name, acc.label)}
                                  >
                                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                      isImpl ? 'bg-success-400/20' : 'bg-warning-400/20'
                                    }`}>
                                      {isImpl
                                        ? <Check className="w-3.5 h-3.5 text-success-400" />
                                        : <Clock className="w-3.5 h-3.5 text-warning-400" />}
                                    </div>
                                    <span className="text-xs font-medium text-surface-200 flex-1">{acc.label}</span>
                                    <span className={`text-[10px] font-semibold ${isImpl ? 'text-success-400' : 'text-warning-400'}`}>
                                      {isImpl ? 'Active' : 'Pending'}
                                    </span>
                                  </motion.button>
                                )
                              })}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </div>
          </FadeUp>
        </div>

        {/* Right Sidebar */}
        <div className="xl:col-span-1 space-y-4">

          {/* Compliance Trend */}
          <FadeInWhenVisible delay={0.1}>
            <div className="glass-card p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-semibold text-surface-300 flex items-center gap-1.5">
                  <BarChart2 className="w-3.5 h-3.5 text-accent-400" />
                  Compliance Trend
                </h4>
                <span className="text-[10px] font-semibold text-success-400">↑ +18pts</span>
              </div>
              {(() => {
                const W = 240, H = 72, PX = 10, PY = 8
                const minV = 70, maxV = 100
                const sx = (i: number) => PX + (i / (complianceTrend.length - 1)) * (W - PX * 2)
                const sy = (v: number) => PY + ((maxV - v) / (maxV - minV)) * (H - PY * 2)
                const pts = complianceTrend.map((v, i) => ({ x: sx(i), y: sy(v) }))
                let lp = `M ${pts[0].x} ${pts[0].y}`
                for (let i = 1; i < pts.length; i++) {
                  const cpx = (pts[i].x + pts[i - 1].x) / 2
                  lp += ` C ${cpx} ${pts[i - 1].y} ${cpx} ${pts[i].y} ${pts[i].x} ${pts[i].y}`
                }
                const ap = lp + ` L ${pts[pts.length - 1].x} ${H} L ${pts[0].x} ${H} Z`
                return (
                  <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: H }}>
                    <defs>
                      <linearGradient id="acc-comp-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {[75, 85, 95].map(g => (
                      <line key={g} x1={PX} y1={sy(g)} x2={W - PX} y2={sy(g)} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                    ))}
                    <path d={ap} fill="url(#acc-comp-grad)" />
                    <motion.path d={lp} fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.8, ease: 'easeOut' }} />
                    {pts.map((pt, i) => (
                      <g key={i}>
                        <circle cx={pt.x} cy={pt.y} r={i === pts.length - 1 ? 3.5 : 2} fill="#10b981" />
                        <text x={pt.x} y={H - 1} textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize="7">{complianceTrendLabels[i]}</text>
                      </g>
                    ))}
                    <text x={pts[pts.length - 1].x} y={pts[pts.length - 1].y - 7} textAnchor="middle" fill="#10b981" fontSize="9" fontWeight="700">{complianceTrend[complianceTrend.length - 1]}%</text>
                  </svg>
                )
              })()}
            </div>
          </FadeInWhenVisible>

          {/* Upcoming Reviews */}
          <FadeInWhenVisible delay={0.14}>
            <div className="glass-card p-4">
              <h4 className="text-xs font-semibold text-surface-300 flex items-center gap-1.5 mb-3">
                <Calendar className="w-3.5 h-3.5 text-accent-400" />
                Upcoming Reviews
              </h4>
              <div className="space-y-2">
                {students
                  .slice()
                  .sort((a, b) => new Date(a.reviewDate).getTime() - new Date(b.reviewDate).getTime())
                  .slice(0, 5)
                  .map(s => (
                    <div key={s.name} className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-accent-500/15 flex items-center justify-center text-[8px] font-bold text-accent-400 flex-shrink-0">
                        {getInitials(s.name)}
                      </div>
                      <span className="text-[11px] text-surface-300 flex-1 truncate">{s.name.split(' ')[0]}</span>
                      <span className="text-[10px] text-surface-500 flex-shrink-0">{s.reviewDate}</span>
                    </div>
                  ))}
              </div>
            </div>
          </FadeInWhenVisible>

          {/* Documentation Status */}
          <FadeInWhenVisible delay={0.18}>
            <div className="glass-card p-4">
              <h4 className="text-xs font-semibold text-surface-300 flex items-center gap-1.5 mb-3">
                <FileText className="w-3.5 h-3.5" />
                Documentation
              </h4>
              <div className="space-y-2">
                {studentList.map(s => {
                  const dsc = docStatusConfig[s.docStatus]
                  return (
                    <div key={s.name} className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-accent-500/15 flex items-center justify-center text-[8px] font-bold text-accent-400 flex-shrink-0">
                        {getInitials(s.name)}
                      </div>
                      <span className="text-[11px] text-surface-300 flex-1 truncate">{s.name.split(' ')[0]}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${dsc.bgClass} ${dsc.colorClass}`}>
                        {dsc.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </FadeInWhenVisible>

          {/* Quick Actions */}
          <FadeInWhenVisible delay={0.22}>
            <div className="glass-card p-4">
              <h4 className="text-xs font-semibold text-surface-300 mb-3 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-accent-400" />
                Quick Actions
              </h4>
              <div className="space-y-1.5">
                {[
                  { label: 'Generate Progress Report', icon: Sparkles, gradient: true,  toast: 'Progress report generated for all students' },
                  { label: 'Schedule IEP Meeting',     icon: Calendar,  gradient: false, toast: 'IEP meeting scheduler opened' },
                  { label: 'Add Accommodation',        icon: Plus,      gradient: false, toast: '' },
                  { label: 'Export All Records',       icon: Download,  gradient: false, toast: 'All accommodation records exported' },
                ].map(action => (
                  <motion.button
                    key={action.label}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      action.gradient
                        ? 'bg-gradient-to-r from-accent-600 to-accent-500 text-white hover:from-accent-500 hover:to-accent-400'
                        : 'bg-white/[0.04] text-surface-300 hover:bg-white/[0.08] hover:text-white'
                    }`}
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => action.label === 'Add Accommodation' ? setAddModal(true) : showToast(action.toast)}
                  >
                    <action.icon className="w-3.5 h-3.5 flex-shrink-0" />
                    {action.label}
                  </motion.button>
                ))}
              </div>
            </div>
          </FadeInWhenVisible>
        </div>
      </div>

      {/* Log Note Modal */}
      <AnimatePresence>
        {noteModal && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setNoteModal(null)} />
            <motion.div className="relative glass-card p-6 w-full max-w-md z-10" initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white">Log Note — {noteModal.name}</h3>
                <button onClick={() => setNoteModal(null)} className="text-surface-500 hover:text-white transition-colors"><X className="w-4 h-4" /></button>
              </div>
              <textarea
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
                rows={4}
                placeholder="Observation, progress note, or action item…"
                className="w-full px-3 py-2 text-xs rounded-xl bg-white/[0.04] border border-white/[0.08] text-surface-200 placeholder:text-surface-600 focus:outline-none focus:border-accent-500/40 resize-none mb-4"
              />
              <div className="flex justify-end gap-2">
                <button onClick={() => setNoteModal(null)} className="btn-secondary text-xs px-4 py-2">Cancel</button>
                <button onClick={() => { setNotes(prev => ({ ...prev, [noteModal.name]: noteText })); showToast(`Note saved for ${noteModal.name}`); setNoteModal(null) }} className="btn-gradient text-xs px-4 py-2">Save Note</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Schedule Meeting Modal */}
      <AnimatePresence>
        {meetingModal && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMeetingModal(null)} />
            <motion.div className="relative glass-card p-6 w-full max-w-md z-10" initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-accent-400" />
                  Schedule Meeting — {meetingModal.name}
                </h3>
                <button onClick={() => setMeetingModal(null)} className="text-surface-500 hover:text-white transition-colors"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-surface-500 block mb-1">Meeting Type</label>
                    <select className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-white/[0.04] border border-white/[0.08] text-surface-200 focus:outline-none focus:border-accent-500/40">
                      <option>Annual Review</option>
                      <option>Re-evaluation</option>
                      <option>IEP Team Meeting</option>
                      <option>Eligibility Meeting</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-surface-500 block mb-1">Plan Type</label>
                    <div className="px-2.5 py-1.5 text-xs rounded-xl bg-white/[0.04] border border-white/[0.08] text-surface-300">
                      {meetingModal.planType} — {meetingModal.disabilityCategory}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-surface-500 block mb-1">Date</label>
                    <input type="date" className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-white/[0.04] border border-white/[0.08] text-surface-200 focus:outline-none focus:border-accent-500/40" />
                  </div>
                  <div>
                    <label className="text-[11px] text-surface-500 block mb-1">Time</label>
                    <input type="time" defaultValue="09:00" className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-white/[0.04] border border-white/[0.08] text-surface-200 focus:outline-none focus:border-accent-500/40" />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] text-surface-500 block mb-1">Notify (email)</label>
                  <input type="email" defaultValue={meetingModal.parentEmail} className="w-full px-3 py-2 text-xs rounded-xl bg-white/[0.04] border border-white/[0.08] text-surface-200 focus:outline-none focus:border-accent-500/40" />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button onClick={() => setMeetingModal(null)} className="btn-secondary text-xs px-4 py-2">Cancel</button>
                <button onClick={() => { showToast(`Meeting scheduled for ${meetingModal.name} — parent notified`); setMeetingModal(null) }} className="btn-gradient text-xs px-4 py-2">
                  <Calendar className="w-3.5 h-3.5" /> Schedule & Notify
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Accommodation Modal */}
      <AnimatePresence>
        {addModal && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setAddModal(false)} />
            <motion.div className="relative glass-card p-6 w-full max-w-sm z-10" initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white">Add Accommodation</h3>
                <button onClick={() => setAddModal(false)} className="text-surface-500 hover:text-white transition-colors"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] text-surface-500 block mb-1">Student</label>
                  <select value={newAcc.student} onChange={e => setNewAcc(p => ({ ...p, student: e.target.value }))} className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-white/[0.04] border border-white/[0.08] text-surface-200 focus:outline-none focus:border-accent-500/40">
                    <option value="">Select student…</option>
                    {studentList.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-surface-500 block mb-1">Accommodation</label>
                  <input type="text" value={newAcc.label} onChange={e => setNewAcc(p => ({ ...p, label: e.target.value }))} placeholder="e.g. Extended time (2x)" className="w-full px-3 py-2 text-xs rounded-xl bg-white/[0.04] border border-white/[0.08] text-surface-200 placeholder:text-surface-600 focus:outline-none focus:border-accent-500/40" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-surface-500 block">Common Accommodations</label>
                  {['Extended time (1.5x)', 'Preferential seating', 'Reduced homework load', 'Calculator access', 'Word bank on tests'].map(opt => (
                    <button key={opt} onClick={() => setNewAcc(p => ({ ...p, label: opt }))} className="w-full text-left px-2.5 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] text-xs text-surface-300 transition-all">
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button onClick={() => setAddModal(false)} className="btn-secondary text-xs px-4 py-2">Cancel</button>
                <button onClick={() => {
                  setStudentList(prev => prev.map(s =>
                    s.name === newAcc.student
                      ? { ...s, accommodations: [...s.accommodations, { label: newAcc.label, implemented: false }] }
                      : s
                  ))
                  showToast(`Accommodation added for ${newAcc.student}`)
                  setNewAcc({ student: '', label: '' })
                  setAddModal(false)
                }} className="btn-gradient text-xs px-4 py-2" disabled={!newAcc.student || !newAcc.label}>
                  Add Accommodation
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
            className="fixed top-5 right-5 z-[100] flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl"
            style={{ background: 'linear-gradient(135deg,#0a0f1a,#111827)', border: '1px solid rgba(255,255,255,0.08)' }}
            initial={{ opacity: 0, y: -16, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 400, damping: 28 } }}
            exit={{ opacity: 0, y: -10, scale: 0.94 }}
          >
            <CheckCircle className="w-4 h-4 text-success-400 flex-shrink-0" />
            <span className="text-xs font-semibold text-white">{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
