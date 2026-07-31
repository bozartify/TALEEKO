'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, Search, Plus, Filter, Download, TrendingUp, TrendingDown, Minus,
  Flame, Award, BookOpen, AlertTriangle, ChevronRight, Mail, Phone,
  Brain, Star, Eye, MoreHorizontal, UserPlus, BarChart2, Target, Clock
} from 'lucide-react'
import { FadeUp, FadeInWhenVisible } from '@/components/ui/motion'

type Status = 'active' | 'needs-attention' | 'at-risk' | 'excelling'
type Filter2 = 'all' | 'active' | 'needs-attention' | 'at-risk' | 'excelling'

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
}

const students: Student[] = [
  { id: '1', name: 'Emma Wilson',    avatar: 'EW', grade: '10th', classes: ['AP Biology', '10th English'], avg: 92, attendance: 97, streak: 15, awards: 3, trend: 'up',   status: 'excelling',       lastActive: '2h ago',  color: '#8b5cf6', email: 'emma.w@student.edu',    iep: false, ell: false, notes: 'Excellent analytical skills. Science Olympiad candidate.' },
  { id: '2', name: 'Liam Chen',      avatar: 'LC', grade: '10th', classes: ['AP Biology', 'Algebra II'],   avg: 88, attendance: 94, streak: 8,  awards: 2, trend: 'up',   status: 'active',          lastActive: '1h ago',  color: '#6366f1', email: 'liam.c@student.edu',    iep: false, ell: false, notes: 'Strong math skills. Participates well in class discussions.' },
  { id: '3', name: 'Sofia Rodriguez',avatar: 'SR', grade: '10th', classes: ['AP Biology', '10th English'], avg: 74, attendance: 91, streak: 3,  awards: 1, trend: 'down', status: 'needs-attention', lastActive: '3d ago',  color: '#f97316', email: 'sofia.r@student.edu',   iep: false, ell: true,  notes: 'ELL student. Improving in reading but struggling with lab reports.' },
  { id: '4', name: 'Noah Thompson',  avatar: 'NT', grade: '10th', classes: ['AP Biology', 'Algebra II'],   avg: 95, attendance: 99, streak: 22, awards: 5, trend: 'up',   status: 'excelling',       lastActive: '30m ago', color: '#10b981', email: 'noah.t@student.edu',    iep: false, ell: false, notes: 'Top performer. Excels in all areas. Peer tutor candidate.' },
  { id: '5', name: 'Ava Patel',      avatar: 'AP', grade: '10th', classes: ['AP Biology', 'Algebra II'],   avg: 85, attendance: 95, streak: 11, awards: 2, trend: 'flat', status: 'active',          lastActive: '3h ago',  color: '#14b8a6', email: 'ava.p@student.edu',     iep: false, ell: false, notes: 'Consistent performer. Could benefit from additional challenge.' },
  { id: '6', name: 'Mason Kim',      avatar: 'MK', grade: '10th', classes: ['AP Biology'],                 avg: 63, attendance: 82, streak: 1,  awards: 0, trend: 'down', status: 'at-risk',         lastActive: '5d ago',  color: '#ef4444', email: 'mason.k@student.edu',   iep: true,  ell: false, notes: 'IEP student. Missing 3 assignments. Parent contact recommended.' },
  { id: '7', name: 'Isabella Jones', avatar: 'IJ', grade: '10th', classes: ['AP Biology', '10th English'], avg: 90, attendance: 96, streak: 19, awards: 3, trend: 'up',   status: 'excelling',       lastActive: '1h ago',  color: '#f43f5e', email: 'isabella.j@student.edu', iep: false, ell: false, notes: 'Strong writing skills. Art elective enrichment program.' },
  { id: '8', name: 'Ethan Davis',    avatar: 'ED', grade: '10th', classes: ['AP Biology'],                 avg: 80, attendance: 93, streak: 7,  awards: 1, trend: 'flat', status: 'active',          lastActive: '4h ago',  color: '#22d3ee', email: 'ethan.d@student.edu',   iep: false, ell: false, notes: 'Solid understanding. Participates but could push further.' },
]

const statusConfig: Record<Status, { label: string; bg: string; text: string; dotColor: string }> = {
  active:           { label: 'Active',           bg: 'bg-success-500/15',  text: 'text-success-400',  dotColor: '#10b981' },
  excelling:        { label: 'Excelling',        bg: 'bg-accent-500/15',   text: 'text-accent-400',   dotColor: '#6366f1' },
  'needs-attention':{ label: 'Needs Attention',  bg: 'bg-warning-500/15',  text: 'text-warning-400',  dotColor: '#f59e0b' },
  'at-risk':        { label: 'At Risk',          bg: 'bg-danger-500/15',   text: 'text-danger-400',   dotColor: '#ef4444' },
}

export default function StudentsPage() {
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<Filter2>('all')
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)

  const filtered = students.filter(s => {
    const matchesSearch = !search || s.name.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = filterStatus === 'all' || s.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const excelling = students.filter(s => s.status === 'excelling').length
  const atRisk = students.filter(s => s.status === 'at-risk').length
  const needsAttn = students.filter(s => s.status === 'needs-attention').length
  const avgScore = Math.round(students.reduce((acc, s) => acc + s.avg, 0) / students.length)

  return (
    <div className="space-y-6">
      <FadeUp>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
              whileHover={{ rotate: 8, scale: 1.08 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <Users className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h2 className="text-xl font-black text-white">Student Roster</h2>
              <p className="text-xs text-surface-400">{students.length} students · AP Biology class</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.button className="btn-gradient text-xs" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Brain className="w-3.5 h-3.5" /> AI Insights
            </motion.button>
            <button className="btn-secondary text-xs px-3 py-1.5">
              <Download className="w-3.5 h-3.5" /> Export
            </button>
            <button className="btn-secondary text-xs px-3 py-1.5">
              <UserPlus className="w-3.5 h-3.5" /> Add Student
            </button>
          </div>
        </div>
      </FadeUp>

      {/* Stat Cards */}
      <FadeUp delay={0.05}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Total Students', value: students.length, icon: Users,         color: '#6366f1', sub: 'enrolled' },
            { label: 'Class Average',  value: `${avgScore}%`,  icon: BarChart2,     color: '#14b8a6', sub: 'weighted avg' },
            { label: 'Excelling',      value: excelling,       icon: Star,          color: '#10b981', sub: `${Math.round((excelling/students.length)*100)}% of class` },
            { label: 'At Risk',        value: atRisk + needsAttn, icon: AlertTriangle, color: '#ef4444', sub: 'need support' },
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
              <p className="text-[10px] text-surface-500 mt-0.5">{stat.sub}</p>
            </motion.div>
          ))}
        </div>
      </FadeUp>

      {/* AI Insight */}
      <FadeUp delay={0.08}>
        <div className="glass-card p-4 border border-accent-500/20">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg,#6366f1,#a78bfa)' }}>
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-white">AI Student Insight</span>
                <span className="text-[10px] bg-accent-500/15 text-accent-400 px-1.5 py-0.5 rounded-md font-bold">3 alerts</span>
              </div>
              <p className="text-xs text-surface-400">Mason Kim has missed 3 assignments and has an 82% attendance rate — below the 90% threshold. Sofia Rodriguez needs ELL support for lab reports. Noah Thompson is a strong peer tutor candidate.</p>
              <div className="flex items-center gap-2 mt-2">
                <button className="text-xs text-accent-400 hover:text-accent-300 font-semibold transition-colors">View Action Plan</button>
                <span className="text-surface-600">·</span>
                <button className="text-xs text-surface-500 hover:text-surface-300 transition-colors">Dismiss</button>
              </div>
            </div>
          </div>
        </div>
      </FadeUp>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student list */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search + filter */}
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
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {(['all', 'excelling', 'active', 'needs-attention', 'at-risk'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setFilterStatus(f)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all capitalize ${
                      filterStatus === f ? 'bg-white/[0.08] text-white' : 'text-surface-400 hover:text-surface-200 hover:bg-white/[0.04]'
                    }`}
                  >
                    {f === 'all' ? 'All' : f === 'needs-attention' ? 'Needs Attn.' : f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </FadeUp>

          {/* Student cards */}
          <div className="space-y-2">
            {filtered.map((student, i) => {
              const status = statusConfig[student.status]
              const isSelected = selectedStudent?.id === student.id
              return (
                <motion.div
                  key={student.id}
                  className={`glass-card p-4 cursor-pointer transition-all ${isSelected ? 'border-accent-500/30' : ''}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 + i * 0.04 }}
                  onClick={() => setSelectedStudent(isSelected ? null : student)}
                  whileHover={{ y: -2 }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                      style={{ background: `linear-gradient(135deg, ${student.color}, ${student.color}99)` }}
                    >
                      {student.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-bold text-white">{student.name}</span>
                        {student.iep && <span className="text-[9px] bg-neon-500/15 text-neon-400 px-1.5 py-0.5 rounded font-bold">IEP</span>}
                        {student.ell && <span className="text-[9px] bg-electric-500/15 text-electric-400 px-1.5 py-0.5 rounded font-bold">ELL</span>}
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ml-auto ${status.bg} ${status.text}`}>{status.label}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-surface-500">
                        <span>{student.grade} Grade</span>
                        <span>{student.classes[0]}</span>
                        <span className="flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" />{student.lastActive}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <div className="text-center hidden sm:block">
                        <p className="text-sm font-bold text-white">{student.avg}%</p>
                        <p className="text-[9px] text-surface-500">Avg</p>
                      </div>
                      <div className="text-center hidden sm:block">
                        <p className="text-sm font-bold text-white">{student.attendance}%</p>
                        <p className="text-[9px] text-surface-500">Attend.</p>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {student.trend === 'up' && <TrendingUp className="w-4 h-4 text-success-400" />}
                        {student.trend === 'down' && <TrendingDown className="w-4 h-4 text-danger-400" />}
                        {student.trend === 'flat' && <Minus className="w-4 h-4 text-surface-500" />}
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(Math.min(student.streak > 0 ? 1 : 0, 1))].map((_, si) => (
                          <div key={si} className="flex items-center gap-0.5 text-warning-400">
                            <Flame className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-bold">{student.streak}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

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
                              { label: 'GPA Avg', value: `${student.avg}%`, color: student.color },
                              { label: 'Attendance', value: `${student.attendance}%`, color: '#10b981' },
                              { label: 'Streak', value: `${student.streak}d`, color: '#f59e0b' },
                              { label: 'Awards', value: student.awards.toString(), color: '#8b5cf6' },
                            ].map(stat => (
                              <div key={stat.label} className="p-2.5 rounded-xl bg-white/[0.03] text-center">
                                <p className="text-sm font-black" style={{ color: stat.color }}>{stat.value}</p>
                                <p className="text-[9px] text-surface-500">{stat.label}</p>
                              </div>
                            ))}
                          </div>
                          <p className="text-xs text-surface-400 mb-3 p-2.5 bg-white/[0.03] rounded-xl italic">"{student.notes}"</p>
                          <div className="flex items-center gap-2">
                            <button className="btn-secondary text-xs px-3 py-1.5"><Eye className="w-3 h-3" /> Portfolio</button>
                            <button className="btn-secondary text-xs px-3 py-1.5"><Mail className="w-3 h-3" /> Message Parent</button>
                            <button className="btn-secondary text-xs px-3 py-1.5"><BarChart2 className="w-3 h-3" /> Analytics</button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Right column: Class stats */}
        <div className="space-y-4">
          <FadeInWhenVisible delay={0.15}>
            <div className="glass-card p-5">
              <h4 className="text-sm font-bold text-white mb-4">Performance Distribution</h4>
              <div className="space-y-2.5">
                {[
                  { range: 'A (90-100%)', count: students.filter(s => s.avg >= 90).length, color: '#10b981' },
                  { range: 'B (80-89%)', count: students.filter(s => s.avg >= 80 && s.avg < 90).length, color: '#22d3ee' },
                  { range: 'C (70-79%)', count: students.filter(s => s.avg >= 70 && s.avg < 80).length, color: '#f59e0b' },
                  { range: 'D/F (<70%)', count: students.filter(s => s.avg < 70).length, color: '#ef4444' },
                ].map((tier, i) => (
                  <div key={tier.range}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-surface-400">{tier.range}</span>
                      <span className="text-xs font-bold" style={{ color: tier.color }}>{tier.count}</span>
                    </div>
                    <div className="h-2 bg-white/[0.04] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: tier.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(tier.count / students.length) * 100}%` }}
                        transition={{ delay: 0.3 + i * 0.08, duration: 0.6 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeInWhenVisible>

          <FadeInWhenVisible delay={0.2}>
            <div className="glass-card p-5">
              <h4 className="text-sm font-bold text-white mb-3">Support Needs</h4>
              <div className="space-y-2">
                {[
                  { label: 'IEP Students', value: students.filter(s => s.iep).length, color: '#a855f7' },
                  { label: 'ELL Students', value: students.filter(s => s.ell).length, color: '#22d3ee' },
                  { label: 'Missing Work', value: 3, color: '#f59e0b' },
                  { label: 'Low Attendance', value: students.filter(s => s.attendance < 90).length, color: '#ef4444' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-white/[0.04] last:border-0">
                    <span className="text-xs text-surface-400">{item.label}</span>
                    <span className="text-sm font-bold" style={{ color: item.color }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeInWhenVisible>

          <FadeInWhenVisible delay={0.25}>
            <div className="glass-card p-5">
              <h4 className="text-sm font-bold text-white mb-3">Top Performers</h4>
              <div className="space-y-2">
                {students
                  .sort((a, b) => b.avg - a.avg)
                  .slice(0, 4)
                  .map((s, i) => (
                    <div key={s.id} className="flex items-center gap-2">
                      <span className="text-xs font-black text-surface-600 w-4">#{i + 1}</span>
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0"
                        style={{ background: `linear-gradient(135deg, ${s.color}, ${s.color}99)` }}
                      >
                        {s.avatar}
                      </div>
                      <span className="text-xs text-surface-300 flex-1 truncate">{s.name}</span>
                      <span className="text-xs font-bold text-success-400">{s.avg}%</span>
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
