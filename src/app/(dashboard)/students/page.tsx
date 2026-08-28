'use client'
import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, Search, Plus, Filter, Download, TrendingUp, TrendingDown, Minus,
  Flame, Award, BookOpen, AlertTriangle, ChevronRight, Mail, Phone,
  Brain, Star, Eye, MoreHorizontal, UserPlus, BarChart2, Target, Clock,
  X, Check, MessageSquare, Sparkles, ChevronDown, Send, FileText,
  Activity, Shield, Zap, ArrowUpRight, Layers, RefreshCw, CheckCircle,
  Flag, Trash2, Copy, GraduationCap, HeartPulse, TrendingUp as Trend
} from 'lucide-react'
import { FadeUp, FadeInWhenVisible } from '@/components/ui/motion'

type Status = 'active' | 'needs-attention' | 'at-risk' | 'excelling'
type FilterStatus = 'all' | 'active' | 'needs-attention' | 'at-risk' | 'excelling'
type SortKey = 'name' | 'avg' | 'attendance' | 'streak'

interface Student {
  id: string
  name: string
  avatar: string
  grade: string
  classes: string[]
  avg: number
  attendance: number
  streak: number
  awards: number
  trend: 'up' | 'down' | 'flat'
  status: Status
  lastActive: string
  color: string
  email: string
  iep: boolean
  ell: boolean
  notes: string
  missing: number
  parentEmail: string
}

const INITIAL_STUDENTS: Student[] = [
  { id: '1', name: 'Emma Wilson',     avatar: 'EW', grade: '10th', classes: ['AP Biology', '10th English'], avg: 92, attendance: 97, streak: 15, awards: 3, trend: 'up',   status: 'excelling',       lastActive: '2h ago',  color: '#8b5cf6', email: 'emma.w@student.edu',     iep: false, ell: false, notes: 'Excellent analytical skills. Science Olympiad candidate.', missing: 0, parentEmail: 'mrs.wilson@parent.edu' },
  { id: '2', name: 'Liam Chen',       avatar: 'LC', grade: '10th', classes: ['AP Biology', 'Algebra II'],   avg: 88, attendance: 94, streak: 8,  awards: 2, trend: 'up',   status: 'active',          lastActive: '1h ago',  color: '#6366f1', email: 'liam.c@student.edu',     iep: false, ell: false, notes: 'Strong math skills. Participates well in class discussions.', missing: 0, parentEmail: 'mr.chen@parent.edu' },
  { id: '3', name: 'Sofia Rodriguez', avatar: 'SR', grade: '10th', classes: ['AP Biology', '10th English'], avg: 74, attendance: 91, streak: 3,  awards: 1, trend: 'down', status: 'needs-attention', lastActive: '3d ago',  color: '#f97316', email: 'sofia.r@student.edu',    iep: false, ell: true,  notes: 'ELL student. Improving in reading but struggling with lab reports.', missing: 2, parentEmail: 'mom.rodriguez@parent.edu' },
  { id: '4', name: 'Noah Thompson',   avatar: 'NT', grade: '10th', classes: ['AP Biology', 'Algebra II'],   avg: 95, attendance: 99, streak: 22, awards: 5, trend: 'up',   status: 'excelling',       lastActive: '30m ago', color: '#10b981', email: 'noah.t@student.edu',     iep: false, ell: false, notes: 'Top performer. Excels in all areas. Peer tutor candidate.', missing: 0, parentEmail: 'dr.thompson@parent.edu' },
  { id: '5', name: 'Ava Patel',       avatar: 'AP', grade: '10th', classes: ['AP Biology', 'Algebra II'],   avg: 85, attendance: 95, streak: 11, awards: 2, trend: 'flat', status: 'active',          lastActive: '3h ago',  color: '#14b8a6', email: 'ava.p@student.edu',      iep: false, ell: false, notes: 'Consistent performer. Could benefit from additional challenge.', missing: 0, parentEmail: 'mr.patel@parent.edu' },
  { id: '6', name: 'Mason Kim',       avatar: 'MK', grade: '10th', classes: ['AP Biology'],                 avg: 63, attendance: 82, streak: 1,  awards: 0, trend: 'down', status: 'at-risk',         lastActive: '5d ago',  color: '#ef4444', email: 'mason.k@student.edu',    iep: true,  ell: false, notes: 'IEP student. Missing 3 assignments. Parent contact recommended.', missing: 3, parentEmail: 'mrs.kim@parent.edu' },
  { id: '7', name: 'Isabella Jones',  avatar: 'IJ', grade: '10th', classes: ['AP Biology', '10th English'], avg: 90, attendance: 96, streak: 19, awards: 3, trend: 'up',   status: 'excelling',       lastActive: '1h ago',  color: '#f43f5e', email: 'isabella.j@student.edu', iep: false, ell: false, notes: 'Strong writing skills. Art elective enrichment program.', missing: 0, parentEmail: 'ms.jones@parent.edu' },
  { id: '8', name: 'Ethan Davis',     avatar: 'ED', grade: '10th', classes: ['AP Biology'],                 avg: 80, attendance: 93, streak: 7,  awards: 1, trend: 'flat', status: 'active',          lastActive: '4h ago',  color: '#22d3ee', email: 'ethan.d@student.edu',    iep: false, ell: false, notes: 'Solid understanding. Participates but could push further.', missing: 1, parentEmail: 'mr.davis@parent.edu' },
]

const ENGAGE_WEEKS = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8']
const ENGAGE_VALS  = [72, 75, 73, 78, 76, 81, 83, 85]

const statusConfig: Record<Status, { label: string; bg: string; text: string; dotColor: string }> = {
  active:            { label: 'Active',          bg: 'bg-success-500/15', text: 'text-success-400', dotColor: '#10b981' },
  excelling:         { label: 'Excelling',       bg: 'bg-accent-500/15',  text: 'text-accent-400',  dotColor: '#6366f1' },
  'needs-attention': { label: 'Needs Attention', bg: 'bg-warning-500/15', text: 'text-warning-400', dotColor: '#f59e0b' },
  'at-risk':         { label: 'At Risk',         bg: 'bg-danger-500/15',  text: 'text-danger-400',  dotColor: '#ef4444' },
}

const filterLabels: Record<FilterStatus, string> = {
  all: 'All', active: 'Active', excelling: 'Excelling',
  'needs-attention': 'Needs Attn.', 'at-risk': 'At Risk',
}

export default function StudentsPage() {
  const [students, setStudents]             = useState<Student[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('taleeko_students')
        if (saved) return JSON.parse(saved)
      } catch {}
    }
    return INITIAL_STUDENTS
  })
  const [search, setSearch]                 = useState('')
  const [filterStatus, setFilterStatus]     = useState<FilterStatus>('all')
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [sortKey, setSortKey]               = useState<SortKey>('avg')
  const [messageModal, setMessageModal]     = useState<Student | null>(null)
  const [addStudentModal, setAddStudentModal] = useState(false)
  const [aiInsightOpen, setAiInsightOpen]   = useState(true)
  const [groupOpen, setGroupOpen]           = useState(false)
  const [actionMenu, setActionMenu]         = useState<string | null>(null)
  const [toastMsg, setToastMsg]             = useState('')
  const [deleteTarget, setDeleteTarget]     = useState<Student | null>(null)

  // Add student form state
  const [newName, setNewName]       = useState('')
  const [newEmail, setNewEmail]     = useState('')
  const [newParent, setNewParent]   = useState('')
  const [newGrade, setNewGrade]     = useState('10th')
  const [newClass, setNewClass]     = useState('AP Biology')
  const [newIEP, setNewIEP]         = useState(false)
  const [newELL, setNewELL]         = useState(false)

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 2500)
  }, [])

  const filtered = students
    .filter(s => {
      const matchesSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = filterStatus === 'all' || s.status === filterStatus
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      if (sortKey === 'name') return a.name.localeCompare(b.name)
      if (sortKey === 'attendance') return b.attendance - a.attendance
      if (sortKey === 'streak') return b.streak - a.streak
      return b.avg - a.avg
    })

  const excelling    = students.filter(s => s.status === 'excelling').length
  const atRisk       = students.filter(s => s.status === 'at-risk').length
  const needsAttn    = students.filter(s => s.status === 'needs-attention').length
  const avgScore     = Math.round(students.reduce((acc, s) => acc + s.avg, 0) / students.length)
  const avgAttend    = Math.round(students.reduce((acc, s) => acc + s.attendance, 0) / students.length)
  const totalMissing = students.reduce((acc, s) => acc + s.missing, 0)

  function handleAddStudent() {
    if (!newName.trim()) return
    const initials = newName.trim().split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2)
    const colors = ['#6366f1','#10b981','#f97316','#14b8a6','#8b5cf6','#f43f5e','#22d3ee']
    const newS: Student = {
      id: Date.now().toString(),
      name: newName.trim(),
      avatar: initials,
      grade: newGrade,
      classes: [newClass],
      avg: 0,
      attendance: 100,
      streak: 0,
      awards: 0,
      trend: 'flat',
      status: 'active',
      lastActive: 'just now',
      color: colors[students.length % colors.length],
      email: newEmail.trim() || `${initials.toLowerCase()}@student.edu`,
      iep: newIEP,
      ell: newELL,
      notes: '',
      missing: 0,
      parentEmail: newParent.trim() || 'parent@example.com',
    }
    setStudents(prev => {
      const next = [newS, ...prev]
      try { localStorage.setItem('taleeko_students', JSON.stringify(next)) } catch {}
      return next
    })
    setAddStudentModal(false)
    setNewName(''); setNewEmail(''); setNewParent('')
    setNewIEP(false); setNewELL(false)
    showToast(`${newS.name} added to roster`)
  }

  function handleRemoveStudent(s: Student) {
    setStudents(prev => {
      const next = prev.filter(st => st.id !== s.id)
      try { localStorage.setItem('taleeko_students', JSON.stringify(next)) } catch {}
      return next
    })
    setDeleteTarget(null)
    setActionMenu(null)
    showToast(`${s.name} removed from roster`)
  }

  return (
    <div className="space-y-6">
      {/* Hero mesh header */}
      <FadeUp>
        <div className="hero-mesh rounded-3xl p-6 border border-white/[0.06]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <motion.div
                className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                whileHover={{ rotate: 8, scale: 1.08 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <Users className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-black text-white">Student Roster</h2>
                  <span className="text-[10px] bg-accent-500/20 text-accent-300 px-2 py-0.5 rounded-full font-bold border border-accent-500/20">AP Biology</span>
                </div>
                <p className="text-sm text-surface-400">{students.length} students &nbsp;·&nbsp; {avgAttend}% avg attendance &nbsp;·&nbsp; {avgScore}% class avg</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <motion.button
                className="btn-gradient text-xs"
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => { setAiInsightOpen(true); showToast('AI insights refreshed') }}
              >
                <Brain className="w-3.5 h-3.5" /> AI Insights
              </motion.button>
              <button
                onClick={() => { setGroupOpen(o => !o); showToast(groupOpen ? 'Group builder closed' : 'Group builder opened') }}
                className="btn-secondary text-xs px-3 py-1.5"
              >
                <Layers className="w-3.5 h-3.5" /> Group
              </button>
              <button className="btn-secondary text-xs px-3 py-1.5" onClick={() => showToast('Roster exported to CSV')}>
                <Download className="w-3.5 h-3.5" /> Export
              </button>
              <button onClick={() => setAddStudentModal(true)} className="btn-secondary text-xs px-3 py-1.5">
                <UserPlus className="w-3.5 h-3.5" /> Add Student
              </button>
            </div>
          </div>

          {/* Quick stat row */}
          <div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/[0.06] flex-wrap">
            {[
              { label: 'Excelling', value: excelling, color: '#10b981' },
              { label: 'At Risk', value: atRisk, color: '#ef4444' },
              { label: 'Needs Attention', value: needsAttn, color: '#f59e0b' },
              { label: 'Missing Work', value: totalMissing, color: '#f97316' },
              { label: 'IEP', value: students.filter(s => s.iep).length, color: '#a855f7' },
              { label: 'ELL', value: students.filter(s => s.ell).length, color: '#22d3ee' },
            ].map(pill => (
              <div key={pill.label} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: pill.color }} />
                <span className="text-xs text-surface-400">{pill.label}</span>
                <span className="text-xs font-black" style={{ color: pill.color }}>{pill.value}</span>
              </div>
            ))}
          </div>
        </div>
      </FadeUp>

      {/* Stat Cards */}
      <FadeUp delay={0.05}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Total Students', value: students.length,      icon: Users,         color: '#6366f1', sub: 'enrolled this term' },
            { label: 'Class Average',  value: `${avgScore}%`,       icon: BarChart2,     color: '#14b8a6', sub: 'weighted GPA avg' },
            { label: 'Excelling',      value: excelling,            icon: Star,          color: '#10b981', sub: `${Math.round((excelling / students.length) * 100)}% of class` },
            { label: 'Needs Action',   value: atRisk + needsAttn,   icon: AlertTriangle, color: '#ef4444', sub: `${totalMissing} missing assignments` },
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

      {/* AI Insight Panel */}
      <FadeUp delay={0.07}>
        <div className="glass-card overflow-hidden border border-accent-500/15">
          <button
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors"
            onClick={() => setAiInsightOpen(o => !o)}
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#6366f1,#a78bfa)' }}>
                <Brain className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-bold text-white">AI Student Insights</span>
              <span className="text-[10px] bg-warning-500/15 text-warning-400 px-1.5 py-0.5 rounded-md font-bold">3 alerts</span>
            </div>
            <motion.div animate={{ rotate: aiInsightOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="w-4 h-4 text-surface-400" />
            </motion.div>
          </button>
          <AnimatePresence>
            {aiInsightOpen && (
              <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                <div className="px-5 pb-4 border-t border-white/[0.06] pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                    {[
                      { color: '#ef4444', icon: AlertTriangle, title: 'Mason Kim – Immediate Action', desc: 'Missing 3 assignments + 82% attendance. IEP flag active. Parent contact within 24h recommended.', cta: 'Contact Parent' },
                      { color: '#f59e0b', icon: BookOpen,      title: 'Sofia Rodriguez – ELL Support', desc: 'Lab report scores declining. Suggest differentiated materials and ELL resource packet for next unit.', cta: 'Generate Resources' },
                      { color: '#10b981', icon: ArrowUpRight,  title: 'Noah Thompson – Accelerate', desc: 'Consistently 95%+ across all work. Honors acceleration or peer tutor role recommended immediately.', cta: 'Create Action Plan' },
                    ].map((insight) => (
                      <div key={insight.title} className="p-3.5 rounded-2xl border" style={{ borderColor: insight.color + '30', backgroundColor: insight.color + '08' }}>
                        <div className="flex items-center gap-1.5 mb-2">
                          <insight.icon className="w-3 h-3" style={{ color: insight.color }} />
                          <p className="text-xs font-bold text-white">{insight.title}</p>
                        </div>
                        <p className="text-[10px] text-surface-400 leading-relaxed mb-2">{insight.desc}</p>
                        <button
                          className="text-[10px] font-semibold px-2 py-1 rounded-lg"
                          style={{ backgroundColor: insight.color + '20', color: insight.color }}
                          onClick={() => showToast(`${insight.cta} — generating now...`)}
                        >
                          {insight.cta} →
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="text-xs text-accent-400 hover:text-accent-300 font-semibold" onClick={() => showToast('Full action plan generated')}>View Full Action Plan</button>
                    <span className="text-surface-600">·</span>
                    <button className="text-xs text-surface-500 hover:text-surface-300" onClick={() => setAiInsightOpen(false)}>Dismiss</button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </FadeUp>

      {/* Group builder (collapsible) */}
      <AnimatePresence>
        {groupOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
            <div className="glass-card p-5 border border-neon-400/15">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-neon-400" /> AI Group Builder
                </h4>
                <button onClick={() => setGroupOpen(false)} className="text-surface-400 hover:text-white p-1"><X className="w-4 h-4" /></button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                {[
                  { label: 'Mixed Ability',   desc: 'Pair high with low performers for peer support', color: '#6366f1', groups: [['Emma', 'Mason'], ['Noah', 'Sofia'], ['Isabella', 'Ethan'], ['Ava', 'Liam']] },
                  { label: 'Similar Level',   desc: 'Group students by current performance tier',     color: '#10b981', groups: [['Noah', 'Emma', 'Isabella'], ['Ava', 'Liam', 'Ethan'], ['Sofia', 'Mason']] },
                  { label: 'Interest-Based',  desc: 'AI assigns based on project preferences',        color: '#f97316', groups: [['Emma', 'Noah'], ['Liam', 'Isabella'], ['Ava', 'Sofia', 'Ethan', 'Mason']] },
                ].map((g, i) => (
                  <motion.button
                    key={g.label}
                    className="glass-card p-4 text-left hover:border-white/[0.16] transition-all group"
                    whileHover={{ y: -2 }}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    onClick={() => showToast(`${g.label} grouping selected`)}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: g.color }} />
                      <span className="text-xs font-bold text-white">{g.label}</span>
                    </div>
                    <p className="text-[10px] text-surface-500 mb-3">{g.desc}</p>
                    <div className="space-y-1.5">
                      {g.groups.map((grp, gi) => (
                        <div key={gi} className="flex items-center gap-1 flex-wrap">
                          <span className="text-[9px] text-surface-600 w-4">G{gi + 1}</span>
                          {grp.map(name => (
                            <span key={name} className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/[0.06] text-surface-400">{name}</span>
                          ))}
                        </div>
                      ))}
                    </div>
                  </motion.button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <motion.button className="btn-gradient text-xs" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => showToast('Groups applied to roster')}>
                  <Sparkles className="w-3.5 h-3.5" /> Apply Groups
                </motion.button>
                <button className="btn-secondary text-xs px-3 py-1.5" onClick={() => showToast('Group list exported')}><Download className="w-3.5 h-3.5" /> Export List</button>
                <button className="btn-secondary text-xs px-3 py-1.5" onClick={() => showToast('Regenerating groups...')}><RefreshCw className="w-3.5 h-3.5" /> Regenerate</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student list */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search + filters */}
          <FadeUp delay={0.1}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-surface-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 text-xs rounded-full bg-white/[0.04] border border-white/[0.08] text-surface-200 placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-accent-500/40 w-full"
                />
                {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-500 hover:text-surface-300"><X className="w-3 h-3" /></button>}
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {(['all', 'excelling', 'active', 'needs-attention', 'at-risk'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setFilterStatus(f)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${filterStatus === f ? 'bg-white/[0.08] text-white' : 'text-surface-400 hover:text-surface-200 hover:bg-white/[0.04]'}`}
                  >
                    {filterLabels[f]}
                  </button>
                ))}
              </div>
            </div>
          </FadeUp>

          {/* Sort + count */}
          <FadeUp delay={0.11}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-surface-500">Sort by:</span>
                {(['avg', 'attendance', 'streak', 'name'] as const).map(k => (
                  <button
                    key={k}
                    onClick={() => setSortKey(k)}
                    className={`text-xs px-2 py-1 rounded-lg transition-all ${sortKey === k ? 'bg-white/[0.08] text-white' : 'text-surface-500 hover:text-surface-300'}`}
                  >
                    {k === 'avg' ? 'Score' : k.charAt(0).toUpperCase() + k.slice(1)}
                  </button>
                ))}
              </div>
              <span className="text-xs text-surface-500">{filtered.length} of {students.length}</span>
            </div>
          </FadeUp>

          {/* Student cards */}
          <div className="space-y-2">
            {filtered.map((student, i) => {
              const status = statusConfig[student.status]
              const isSelected = selectedStudent?.id === student.id
              const menuOpen = actionMenu === student.id
              return (
                <motion.div
                  key={student.id}
                  className={`glass-card p-4 cursor-pointer transition-all relative ${isSelected ? 'border-accent-500/30 shadow-[0_0_20px_rgba(99,102,241,0.08)]' : ''}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 + i * 0.04 }}
                  whileHover={{ y: -1 }}
                  onClick={() => setSelectedStudent(isSelected ? null : student)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                      style={{ background: `linear-gradient(135deg, ${student.color}, ${student.color}99)` }}
                    >
                      {student.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <span className="text-sm font-bold text-white">{student.name}</span>
                        {student.iep     && <span className="text-[9px] bg-purple-500/15 text-purple-400 px-1.5 py-0.5 rounded font-bold">IEP</span>}
                        {student.ell     && <span className="text-[9px] bg-electric-500/15 text-electric-400 px-1.5 py-0.5 rounded font-bold">ELL</span>}
                        {student.missing > 0 && <span className="text-[9px] bg-danger-400/15 text-danger-400 px-1.5 py-0.5 rounded font-bold">{student.missing} missing</span>}
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-surface-500">
                        <span>{student.grade} Grade</span>
                        <span>{student.classes[0]}</span>
                        <span className="flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" />{student.lastActive}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-center hidden sm:block">
                        <p className={`text-sm font-bold ${student.avg >= 90 ? 'text-success-400' : student.avg >= 80 ? 'text-accent-400' : student.avg >= 70 ? 'text-warning-400' : 'text-danger-400'}`}>{student.avg}%</p>
                        <p className="text-[9px] text-surface-500">Avg</p>
                      </div>
                      <div className="text-center hidden sm:block">
                        <p className={`text-sm font-bold ${student.attendance >= 95 ? 'text-success-400' : student.attendance >= 90 ? 'text-surface-200' : 'text-warning-400'}`}>{student.attendance}%</p>
                        <p className="text-[9px] text-surface-500">Attend.</p>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {student.trend === 'up'   && <TrendingUp   className="w-4 h-4 text-success-400" />}
                        {student.trend === 'down' && <TrendingDown  className="w-4 h-4 text-danger-400" />}
                        {student.trend === 'flat' && <Minus         className="w-4 h-4 text-surface-500" />}
                      </div>
                      <div className="flex items-center gap-0.5 text-warning-400">
                        <Flame className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold">{student.streak}</span>
                      </div>
                      <span className={`badge ${status.bg} ${status.text} hidden md:flex`}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: status.dotColor }} />
                        {status.label}
                      </span>
                      {/* Action menu */}
                      <div className="relative" onClick={e => e.stopPropagation()}>
                        <button
                          className="p-1.5 rounded-lg hover:bg-white/[0.08] text-surface-500 hover:text-white transition-colors"
                          onClick={() => setActionMenu(menuOpen ? null : student.id)}
                        >
                          <MoreHorizontal className="w-3.5 h-3.5" />
                        </button>
                        <AnimatePresence>
                          {menuOpen && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setActionMenu(null)} />
                              <motion.div
                                className="absolute right-0 top-8 z-20 glass-card py-1.5 w-44 shadow-xl border border-white/[0.1]"
                                initial={{ opacity: 0, scale: 0.9, y: -4 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: -4 }}
                                transition={{ duration: 0.15 }}
                              >
                                {[
                                  { icon: Eye,          label: 'View Portfolio',   action: () => { showToast(`Opening ${student.name}'s portfolio`); setActionMenu(null) } },
                                  { icon: Mail,         label: 'Message Parent',   action: () => { setMessageModal(student); setActionMenu(null) } },
                                  { icon: Sparkles,     label: 'AI Action Plan',   action: () => { showToast(`AI action plan for ${student.name}`); setActionMenu(null) } },
                                  { icon: BarChart2,    label: 'View Analytics',   action: () => { showToast(`${student.name} analytics opened`); setActionMenu(null) } },
                                  { icon: Flag,         label: 'Flag for Review',  action: () => { showToast(`${student.name} flagged for review`); setActionMenu(null) } },
                                ].map(item => (
                                  <button
                                    key={item.label}
                                    onClick={item.action}
                                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-surface-300 hover:bg-white/[0.06] hover:text-white transition-colors text-left"
                                  >
                                    <item.icon className="w-3.5 h-3.5 flex-shrink-0" />
                                    {item.label}
                                  </button>
                                ))}
                                <div className="h-px bg-white/[0.06] my-1" />
                                <button
                                  onClick={() => { setDeleteTarget(student); setActionMenu(null) }}
                                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-danger-400 hover:bg-danger-400/10 transition-colors text-left"
                                >
                                  <Trash2 className="w-3.5 h-3.5 flex-shrink-0" />
                                  Remove Student
                                </button>
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>

                  {/* Expanded detail */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 pt-4 border-t border-white/[0.06]">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                            {[
                              { label: 'GPA Avg',    value: `${student.avg}%`,        color: student.color },
                              { label: 'Attendance', value: `${student.attendance}%`,  color: '#10b981' },
                              { label: 'Streak',     value: `${student.streak}d`,      color: '#f59e0b' },
                              { label: 'Awards',     value: student.awards.toString(), color: '#8b5cf6' },
                            ].map(stat => (
                              <div key={stat.label} className="p-2.5 rounded-xl bg-white/[0.03] text-center">
                                <p className="text-sm font-black" style={{ color: stat.color }}>{stat.value}</p>
                                <p className="text-[9px] text-surface-500">{stat.label}</p>
                              </div>
                            ))}
                          </div>
                          <div className="mb-3 p-2.5 bg-white/[0.03] rounded-xl">
                            <p className="text-[10px] text-surface-500 mb-1.5">Performance Trend (8 weeks)</p>
                            {(() => {
                              const ptsData = [70, 74, 76, 78, 79, 80, 81, student.avg]
                              const W = 200, H = 32, mn = 65, mx = 100
                              const pts = ptsData.map((v, i) => ({
                                x: (i / (ptsData.length - 1)) * W,
                                y: H - ((v - mn) / (mx - mn)) * H * 0.82 - 3
                              }))
                              let line = `M ${pts[0].x} ${pts[0].y}`
                              for (let i = 1; i < pts.length; i++) {
                                const cpx = (pts[i].x + pts[i - 1].x) / 2
                                line += ` C ${cpx} ${pts[i - 1].y} ${cpx} ${pts[i].y} ${pts[i].x} ${pts[i].y}`
                              }
                              const area = line + ` L ${W} ${H} L 0 ${H} Z`
                              return (
                                <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 32 }}>
                                  <defs>
                                    <linearGradient id={`sp-${student.id}`} x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="0%" stopColor={student.color} stopOpacity={0.3} />
                                      <stop offset="100%" stopColor={student.color} stopOpacity={0} />
                                    </linearGradient>
                                  </defs>
                                  <path d={area} fill={`url(#sp-${student.id})`} />
                                  <motion.path d={line} fill="none" stroke={student.color} strokeWidth={1.5}
                                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                                    transition={{ duration: 0.8, ease: 'easeOut' }}
                                  />
                                  <circle cx={pts[7].x} cy={pts[7].y} r={2.5} fill={student.color} />
                                </svg>
                              )
                            })()}
                          </div>
                          <p className="text-xs text-surface-400 mb-3 p-2.5 bg-white/[0.03] rounded-xl italic">&ldquo;{student.notes}&rdquo;</p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <button className="btn-secondary text-xs px-3 py-1.5" onClick={e => { e.stopPropagation(); showToast(`${student.name}'s portfolio opened`) }}><Eye className="w-3 h-3" /> Portfolio</button>
                            <button onClick={e => { e.stopPropagation(); setMessageModal(student) }} className="btn-secondary text-xs px-3 py-1.5"><Mail className="w-3 h-3" /> Message Parent</button>
                            <button className="btn-secondary text-xs px-3 py-1.5" onClick={e => { e.stopPropagation(); showToast(`${student.name} analytics opened`) }}><BarChart2 className="w-3 h-3" /> Analytics</button>
                            <button className="btn-gradient text-xs px-3 py-1.5 ml-auto" onClick={e => { e.stopPropagation(); showToast(`AI Action Plan for ${student.name} generated`) }}><Sparkles className="w-3 h-3" /> AI Action Plan</button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}

            {filtered.length === 0 && (
              <div className="glass-card p-12 text-center">
                <Search className="w-8 h-8 text-surface-600 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-surface-300 mb-1">No students match</h4>
                <p className="text-xs text-surface-500">Try a different search or filter</p>
                <div className="flex gap-2 justify-center mt-4">
                  <button onClick={() => setSearch('')} className="btn-secondary text-xs px-3 py-1.5">Clear Search</button>
                  <button onClick={() => setFilterStatus('all')} className="btn-secondary text-xs px-3 py-1.5">Clear Filter</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <FadeInWhenVisible delay={0.15}>
            <div className="glass-card p-5">
              <h4 className="text-sm font-bold text-white mb-4">Performance Distribution</h4>
              {(() => {
                const tiers = [
                  { range: 'A (90–100%)', count: students.filter(s => s.avg >= 90).length, color: '#10b981' },
                  { range: 'B (80–89%)',  count: students.filter(s => s.avg >= 80 && s.avg < 90).length, color: '#22d3ee' },
                  { range: 'C (70–79%)',  count: students.filter(s => s.avg >= 70 && s.avg < 80).length, color: '#f59e0b' },
                  { range: 'D/F (<70%)', count: students.filter(s => s.avg < 70).length, color: '#ef4444' },
                ]
                const R = 42, CX = 52, CY = 52, SW = 14
                const CIRC = 2 * Math.PI * R
                const total = tiers.reduce((a, t) => a + t.count, 0) || 1
                let offset = 0
                const segs = tiers.map(t => {
                  const dash = (t.count / total) * CIRC
                  const s = { ...t, dash, offset }
                  offset += dash
                  return s
                })
                return (
                  <div className="flex items-center gap-4">
                    <svg viewBox="0 0 104 104" className="w-24 h-24 flex-shrink-0">
                      <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={SW} />
                      {segs.map(s => (
                        <motion.circle key={s.range} cx={CX} cy={CY} r={R} fill="none" stroke={s.color} strokeWidth={SW}
                          strokeDasharray={`${s.dash.toFixed(2)} ${(CIRC - s.dash).toFixed(2)}`}
                          strokeDashoffset={(-s.offset + CIRC / 4).toFixed(2)}
                          strokeLinecap="butt"
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }} />
                      ))}
                      <text x={CX} y={CY - 4} textAnchor="middle" fill="white" fontSize="12" fontWeight="700">{students.length}</text>
                      <text x={CX} y={CY + 9} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="7.5">students</text>
                    </svg>
                    <div className="space-y-2 flex-1">
                      {tiers.map(t => (
                        <div key={t.range} className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: t.color }} />
                            <span className="text-[11px] text-surface-400">{t.range}</span>
                          </div>
                          <span className="text-[11px] font-bold" style={{ color: t.color }}>{t.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })()}
            </div>
          </FadeInWhenVisible>

          <FadeInWhenVisible delay={0.18}>
            <div className="glass-card p-5">
              <h4 className="text-sm font-bold text-white mb-3">Support Needs</h4>
              <div className="space-y-2">
                {[
                  { label: 'IEP Students',    value: students.filter(s => s.iep).length,             color: '#a855f7' },
                  { label: 'ELL Students',    value: students.filter(s => s.ell).length,             color: '#22d3ee' },
                  { label: 'Missing Work',    value: students.reduce((a, s) => a + s.missing, 0),    color: '#f59e0b' },
                  { label: 'Low Attendance',  value: students.filter(s => s.attendance < 90).length, color: '#ef4444' },
                  { label: 'At Risk Total',   value: students.filter(s => s.status === 'at-risk').length, color: '#f43f5e' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-white/[0.04] last:border-0">
                    <span className="text-xs text-surface-400">{item.label}</span>
                    <span className="text-sm font-bold" style={{ color: item.color }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeInWhenVisible>

          <FadeInWhenVisible delay={0.2}>
            <div className="glass-card p-5">
              <h4 className="text-sm font-bold text-white mb-3">Top Performers</h4>
              <div className="space-y-2.5">
                {[...students].sort((a, b) => b.avg - a.avg).slice(0, 5).map((s, i) => (
                  <div key={s.id} className="flex items-center gap-2.5">
                    <span className="text-xs font-black text-surface-600 w-4">#{i + 1}</span>
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0"
                      style={{ background: `linear-gradient(135deg, ${s.color}, ${s.color}99)` }}
                    >
                      {s.avatar}
                    </div>
                    <span className="text-xs text-surface-300 flex-1 truncate">{s.name}</span>
                    <span className="text-xs font-bold text-success-400">{s.avg}%</span>
                    {s.trend === 'up' && <ArrowUpRight className="w-3 h-3 text-success-400 flex-shrink-0" />}
                  </div>
                ))}
              </div>
            </div>
          </FadeInWhenVisible>

          <FadeInWhenVisible delay={0.22}>
            <div className="glass-card p-5">
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4 text-electric-400" /> Class Health Score
              </h4>
              <div className="flex items-center gap-4 mb-3">
                <div className="relative w-16 h-16 flex-shrink-0">
                  <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                    <motion.circle
                      cx="32" cy="32" r="26" fill="none"
                      stroke="#10b981" strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 26}`}
                      initial={{ strokeDashoffset: 2 * Math.PI * 26 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 26 * (1 - 0.78) }}
                      transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-black text-white">78</span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-success-400 mb-1">Good</p>
                  <p className="text-[10px] text-surface-400 leading-relaxed">3 students need intervention to bring the class score above 85.</p>
                </div>
              </div>
              {(() => {
                const metrics = [
                  { label: 'Academic',   val: 84, color: '#6366f1' },
                  { label: 'Attendance', val: 93, color: '#10b981' },
                  { label: 'Engagement', val: 71, color: '#f59e0b' },
                ]
                const W = 300, LW = 74, CW = 28, GAP = 5, ROW = 12, BAR_MAX = W - LW - CW - 6
                const H = metrics.length * (ROW + GAP) - GAP
                return (
                  <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible">
                    <defs>
                      {metrics.map((m, i) => (
                        <linearGradient key={i} id={`st-metric-${i}`} x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor={m.color} stopOpacity={0.9} />
                          <stop offset="100%" stopColor={m.color} stopOpacity={0.55} />
                        </linearGradient>
                      ))}
                    </defs>
                    {metrics.map((m, i) => {
                      const bw = (m.val / 100) * BAR_MAX
                      const y = i * (ROW + GAP)
                      return (
                        <g key={m.label}>
                          <text x={0} y={y + 9} fill="rgba(255,255,255,0.45)" fontSize={9} fontFamily="inherit">{m.label}</text>
                          <rect x={LW} y={y} width={BAR_MAX} height={ROW} rx={3} fill="rgba(255,255,255,0.04)" />
                          <motion.rect x={LW} y={y} height={ROW} rx={3} fill={`url(#st-metric-${i})`}
                            initial={{ width: 0 }} animate={{ width: bw }}
                            transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                          />
                          <text x={LW + BAR_MAX + 4} y={y + 9} fill={m.color} fontSize={9} fontFamily="inherit" fontWeight="bold">{m.val}%</text>
                        </g>
                      )
                    })}
                  </svg>
                )
              })()}
            </div>
          </FadeInWhenVisible>
        </div>
      </div>

      {/* Bottom analytics */}
      <FadeInWhenVisible delay={0.25}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Engagement trend 8-week */}
          <div className="glass-card p-5 md:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-pink-400" /> Engagement Trend
              </h4>
              <span className="text-[10px] text-success-400 font-bold flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +13% 8 weeks</span>
            </div>
            <div className="flex items-end gap-2 h-24">
              {ENGAGE_VALS.map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <motion.div
                    className="w-full rounded-t-lg"
                    style={{ background: i === ENGAGE_VALS.length - 1 ? 'linear-gradient(to top, #ec4899, #f43f5e)' : 'rgba(255,255,255,0.08)' }}
                    initial={{ height: 0 }}
                    animate={{ height: `${(v / 100) * 96}px` }}
                    transition={{ delay: i * 0.07, duration: 0.5, ease: 'easeOut' }}
                  />
                  <span className="text-[9px] text-surface-600">{ENGAGE_WEEKS[i]}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.06]">
              <p className="text-[10px] text-surface-500">Class engagement is trending upward — highest in 2 months.</p>
              <button className="text-[10px] text-accent-400 font-semibold hover:text-accent-300" onClick={() => showToast('Detailed engagement report generated')}>Full Report →</button>
            </div>
          </div>

          {/* Quick actions */}
          <div className="glass-card p-5">
            <h4 className="text-sm font-bold text-white mb-3">Quick Actions</h4>
            <div className="space-y-2">
              {[
                { icon: Mail,        label: 'Message All Parents',    color: '#6366f1', action: () => showToast('Bulk parent message drafted') },
                { icon: FileText,    label: 'Generate Progress Report', color: '#10b981', action: () => showToast('Progress reports generating...') },
                { icon: Sparkles,    label: 'AI Intervention Plan',   color: '#f59e0b', action: () => showToast('AI intervention plan created') },
                { icon: Download,    label: 'Export Full Roster',      color: '#22d3ee', action: () => showToast('Roster exported to CSV') },
                { icon: GraduationCap, label: 'Assign Peer Tutors',  color: '#a855f7', action: () => showToast('Peer tutor assignments saved') },
              ].map(item => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.05] transition-colors text-left group"
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: item.color + '18' }}>
                    <item.icon className="w-3.5 h-3.5" style={{ color: item.color }} />
                  </div>
                  <span className="text-xs text-surface-300 group-hover:text-white transition-colors">{item.label}</span>
                  <ChevronRight className="w-3 h-3 text-surface-600 ml-auto group-hover:text-surface-400 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </FadeInWhenVisible>

      {/* Message Parent Modal */}
      <AnimatePresence>
        {messageModal && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMessageModal(null)} />
            <motion.div className="relative glass-card p-6 w-full max-w-md z-10" initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-bold text-white">Message Parent</h3>
                <button onClick={() => setMessageModal(null)} className="text-surface-400 hover:text-white p-1"><X className="w-4 h-4" /></button>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/[0.03] rounded-xl mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: `linear-gradient(135deg,${messageModal.color},${messageModal.color}99)` }}>
                  {messageModal.avatar}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{messageModal.name}</p>
                  <p className="text-xs text-surface-400">Parent: {messageModal.parentEmail}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-surface-300 mb-1.5">Subject</label>
                  <input type="text" defaultValue={`Update on ${messageModal.name}`} className="w-full bg-white/[0.04] border border-white/[0.08] text-surface-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-surface-300">Message</label>
                    <button className="text-[10px] text-accent-400 flex items-center gap-1" onClick={() => showToast('AI draft generated')}><Sparkles className="w-3 h-3" /> AI Draft</button>
                  </div>
                  <textarea rows={4} defaultValue={`Dear Parent,\n\nI wanted to share a brief update on ${messageModal.name}'s progress in class...\n\nBest regards,`} className="w-full bg-white/[0.04] border border-white/[0.08] text-surface-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 resize-none" />
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button className="btn-secondary text-xs flex-1" onClick={() => showToast('Message scheduled for tomorrow 8am')}>Schedule Send</button>
                <motion.button
                  className="btn-gradient text-xs flex-1"
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => { showToast(`Message sent to ${messageModal.name}'s parent`); setMessageModal(null) }}
                >
                  <Send className="w-3.5 h-3.5" /> Send Now
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Student Modal */}
      <AnimatePresence>
        {addStudentModal && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setAddStudentModal(false)} />
            <motion.div className="relative glass-card p-6 w-full max-w-md z-10" initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-bold text-white flex items-center gap-2"><UserPlus className="w-4 h-4 text-accent-400" /> Add Student</h3>
                <button onClick={() => setAddStudentModal(false)} className="text-surface-400 hover:text-white p-1"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-surface-300 mb-1.5">Full Name *</label>
                  <input type="text" placeholder="e.g. Jane Smith" value={newName} onChange={e => setNewName(e.target.value)} className="w-full bg-white/[0.04] border border-white/[0.08] text-surface-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-surface-300 mb-1.5">Student Email</label>
                  <input type="email" placeholder="jane.s@student.edu" value={newEmail} onChange={e => setNewEmail(e.target.value)} className="w-full bg-white/[0.04] border border-white/[0.08] text-surface-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-surface-300 mb-1.5">Parent Email</label>
                  <input type="email" placeholder="parent@example.com" value={newParent} onChange={e => setNewParent(e.target.value)} className="w-full bg-white/[0.04] border border-white/[0.08] text-surface-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-surface-300 mb-1.5">Grade</label>
                    <select value={newGrade} onChange={e => setNewGrade(e.target.value)} className="w-full bg-white/[0.04] border border-white/[0.08] text-surface-200 rounded-xl px-3 py-2 text-xs focus:outline-none">
                      {['7th', '8th', '9th', '10th', '11th', '12th'].map(g => <option key={g} className="bg-surface-900">{g}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-surface-300 mb-1.5">Class</label>
                    <select value={newClass} onChange={e => setNewClass(e.target.value)} className="w-full bg-white/[0.04] border border-white/[0.08] text-surface-200 rounded-xl px-3 py-2 text-xs focus:outline-none">
                      {['AP Biology', 'Algebra II', '10th English', '8th History'].map(c => <option key={c} className="bg-surface-900">{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={newIEP} onChange={e => setNewIEP(e.target.checked)} className="w-3.5 h-3.5 accent-accent-500 rounded" />
                    <span className="text-xs text-surface-300">IEP</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={newELL} onChange={e => setNewELL(e.target.checked)} className="w-3.5 h-3.5 accent-accent-500 rounded" />
                    <span className="text-xs text-surface-300">ELL</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button className="btn-secondary text-xs flex-1" onClick={() => setAddStudentModal(false)}>Cancel</button>
                <motion.button
                  className="btn-gradient text-xs flex-1"
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={handleAddStudent}
                  disabled={!newName.trim()}
                  style={{ opacity: newName.trim() ? 1 : 0.5 }}
                >
                  <UserPlus className="w-3.5 h-3.5" /> Add Student
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirm modal */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
            <motion.div className="relative glass-card p-6 w-full max-w-sm z-10" initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-danger-400/15 flex items-center justify-center flex-shrink-0">
                  <Trash2 className="w-5 h-5 text-danger-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Remove Student</h3>
                  <p className="text-xs text-surface-400">This action cannot be undone.</p>
                </div>
              </div>
              <p className="text-xs text-surface-300 mb-5">
                Remove <span className="font-bold text-white">{deleteTarget.name}</span> from the roster? All associated data will be archived.
              </p>
              <div className="flex gap-3">
                <button className="btn-secondary text-xs flex-1" onClick={() => setDeleteTarget(null)}>Cancel</button>
                <motion.button
                  className="text-xs flex-1 px-4 py-2 rounded-xl font-semibold bg-danger-400/15 text-danger-400 hover:bg-danger-400/25 transition-colors"
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => handleRemoveStudent(deleteTarget)}
                >
                  <Trash2 className="w-3.5 h-3.5 inline mr-1.5" />Remove
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            className="fixed top-5 right-5 z-[100] flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border border-white/[0.12]"
            style={{ background: 'linear-gradient(135deg, #0a0f1a, #111827)' }}
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          >
            <div className="w-6 h-6 rounded-full bg-accent-500/20 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-3.5 h-3.5 text-accent-400" />
            </div>
            <span className="text-xs font-semibold text-white max-w-[220px]">{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
