'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, BookOpen, ChevronRight, Plus, Mail, MoreHorizontal,
  Search, Filter, Download, Award, TrendingUp, TrendingDown,
  AlertTriangle, Star, Target, Clock, MessageSquare, BarChart2,
  UserPlus, ChevronDown, X
} from 'lucide-react'
import { FadeUp, StaggerList, StaggerItem, fadeUp, FadeInWhenVisible } from '@/components/ui/motion'

const classes = [
  { name: '7th Grade Science', students: 28, lessons: 12, color: '#8b5cf6', subject: 'Biology & Earth Science', period: '1st Period', avgScore: 88, trend: 'up' as const },
  { name: '8th Grade History', students: 31, lessons: 9,  color: '#f97316', subject: 'American History',        period: '3rd Period', avgScore: 82, trend: 'up' as const },
  { name: '9th Grade Math',    students: 25, lessons: 15, color: '#14b8a6', subject: 'Algebra I',              period: '5th Period', avgScore: 79, trend: 'down' as const },
  { name: '10th Grade English',students: 29, lessons: 8,  color: '#f43f5e', subject: 'Literature & Writing',   period: '7th Period', avgScore: 85, trend: 'up' as const },
]

const students = [
  { name: 'Emma Rodriguez',  grade: '7th', class: 'Science', avg: 92, status: 'active' as const,          streak: 15, lastActive: '2h ago',   awards: 3 },
  { name: 'James Kim',       grade: '8th', class: 'History', avg: 87, status: 'active' as const,          streak: 8,  lastActive: '1h ago',   awards: 2 },
  { name: 'Aisha Thompson',  grade: '9th', class: 'Math',    avg: 95, status: 'active' as const,          streak: 22, lastActive: '30m ago',  awards: 5 },
  { name: 'Liam Chen',       grade: '10th',class: 'English', avg: 78, status: 'needs-attention' as const, streak: 3,  lastActive: '2d ago',   awards: 1 },
  { name: 'Sofia Patel',     grade: '7th', class: 'Science', avg: 88, status: 'active' as const,          streak: 11, lastActive: '3h ago',   awards: 2 },
  { name: 'Noah Williams',   grade: '8th', class: 'History', avg: 71, status: 'needs-attention' as const, streak: 1,  lastActive: '5d ago',   awards: 0 },
  { name: 'Olivia Martinez', grade: '9th', class: 'Math',    avg: 91, status: 'active' as const,          streak: 14, lastActive: '1h ago',   awards: 4 },
  { name: 'Ethan Johnson',   grade: '7th', class: 'Science', avg: 84, status: 'active' as const,          streak: 7,  lastActive: '4h ago',   awards: 1 },
  { name: 'Ava Lee',         grade: '10th',class: 'English', avg: 93, status: 'active' as const,          streak: 19, lastActive: '45m ago',  awards: 3 },
  { name: 'Mason Brown',     grade: '8th', class: 'History', avg: 76, status: 'needs-attention' as const, streak: 2,  lastActive: '3d ago',   awards: 1 },
]

const announcements = [
  { title: 'Science Fair Projects Due', class: '7th Science', date: 'In 5 days', urgent: true },
  { title: 'History Essay Peer Review', class: '8th History', date: 'Tomorrow', urgent: true },
  { title: 'Math Quiz Chapter 7',       class: '9th Math',    date: 'Next Monday', urgent: false },
  { title: 'Book Report Presentations', class: '10th English',date: 'In 2 weeks', urgent: false },
]

type Tab = 'classes' | 'students' | 'announcements'

export default function ClassroomPage() {
  const [tab, setTab] = useState<Tab>('classes')
  const [search, setSearch] = useState('')
  const [selectedClass, setSelectedClass] = useState<string | null>(null)

  const filteredStudents = students.filter(s =>
    (!search || s.name.toLowerCase().includes(search.toLowerCase())) &&
    (!selectedClass || s.class === selectedClass)
  )

  const totalStudents = classes.reduce((sum, c) => sum + c.students, 0)
  const avgScore = Math.round(classes.reduce((sum, c) => sum + c.avgScore, 0) / classes.length)
  const needsAttention = students.filter(s => s.status === 'needs-attention').length

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <StaggerList className="grid grid-cols-2 lg:grid-cols-4 gap-4" delay={0.08}>
        {[
          { label: 'Total Students', value: totalStudents.toString(), icon: Users, color: 'bg-accent-500/15 text-accent-400', delta: '+3 this week' },
          { label: 'Active Classes',  value: classes.length.toString(), icon: BookOpen, color: 'bg-success-400/15 text-success-400', delta: 'All active' },
          { label: 'Average Score',   value: `${avgScore}%`, icon: Target, color: 'bg-electric-400/15 text-electric-400', delta: '+2.1% vs last month' },
          { label: 'Needs Attention', value: needsAttention.toString(), icon: AlertTriangle, color: 'bg-warning-400/15 text-warning-400', delta: 'Review recommended' },
        ].map(s => (
          <StaggerItem key={s.label} variants={fadeUp}>
            <motion.div
              className="stat-card h-full"
              whileHover={{ y: -3, boxShadow: '0 8px 30px rgba(139,92,246,0.12)', transition: { duration: 0.2 } }}
            >
              <div className={`icon-bubble ${s.color} mb-3`}><s.icon className="w-5 h-5" /></div>
              <div className="text-2xl font-black text-white">{s.value}</div>
              <div className="text-xs font-semibold text-surface-200 mt-0.5">{s.label}</div>
              <div className="text-xs text-surface-500 mt-1">{s.delta}</div>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerList>

      {/* Tabs + actions */}
      <FadeUp delay={0.15}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-1 bg-white/[0.06] rounded-full p-1">
            {([
              { key: 'classes' as const, label: 'Classes', icon: BookOpen },
              { key: 'students' as const, label: 'Students', icon: Users },
              { key: 'announcements' as const, label: 'Announcements', icon: MessageSquare },
            ]).map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  tab === t.key ? 'bg-white/[0.08] text-white' : 'text-surface-400 hover:text-surface-200 hover:bg-white/[0.04]'
                }`}
              >
                <t.icon className="w-3.5 h-3.5" />
                {t.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-secondary text-xs px-3 py-1.5">
              <Download className="w-3 h-3" /> Export
            </button>
            <motion.button
              className="btn-primary text-xs"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Plus className="w-3.5 h-3.5" />
              {tab === 'classes' ? 'Add Class' : tab === 'students' ? 'Add Student' : 'New Announcement'}
            </motion.button>
          </div>
        </div>
      </FadeUp>

      <AnimatePresence mode="wait">
        {/* Classes tab */}
        {tab === 'classes' && (
          <motion.div
            key="classes"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {classes.map((cls, i) => (
                <motion.div
                  key={cls.name}
                  className="glass-card overflow-hidden cursor-pointer group"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -3, transition: { duration: 0.18 } }}
                >
                  <div className="h-2" style={{ backgroundColor: cls.color }} />
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-bold text-white group-hover:text-accent-400 transition-colors">{cls.name}</h4>
                        <p className="text-xs text-surface-400 mt-0.5">{cls.subject} · {cls.period}</p>
                      </div>
                      <button className="text-surface-500 hover:text-surface-200"><MoreHorizontal className="w-4 h-4" /></button>
                    </div>
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-1.5 text-sm">
                        <Users className="w-3.5 h-3.5 text-surface-500" />
                        <span className="font-semibold text-white">{cls.students}</span>
                        <span className="text-surface-500 text-xs">students</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm">
                        <BookOpen className="w-3.5 h-3.5 text-surface-500" />
                        <span className="font-semibold text-white">{cls.lessons}</span>
                        <span className="text-surface-500 text-xs">lessons</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-1 mb-1">
                            <span className="text-xs font-bold text-surface-200">Avg: {cls.avgScore}%</span>
                            {cls.trend === 'up' ? (
                              <TrendingUp className="w-3 h-3 text-success-400" />
                            ) : (
                              <TrendingDown className="w-3 h-3 text-danger-400" />
                            )}
                          </div>
                          <div className="w-24 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                            <motion.div
                              className="h-full rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${cls.avgScore}%` }}
                              transition={{ delay: 0.3 + i * 0.08, duration: 0.6 }}
                              style={{ backgroundColor: cls.color }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link href="/courses" className="btn-outline text-xs px-3 py-1.5">View</Link>
                        <button className="text-surface-500 hover:text-accent-400 p-1.5 rounded-lg hover:bg-white/[0.04] transition-colors">
                          <Mail className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Students tab */}
        {tab === 'students' && (
          <motion.div
            key="students"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="relative flex-1 max-w-xs">
                <Search className="w-3.5 h-3.5 text-surface-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 text-xs rounded-full border border-white/[0.06] bg-white/[0.03] text-surface-200 placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-accent-500 w-full transition-all"
                />
              </div>
              <div className="flex gap-1">
                {[null, 'Science', 'History', 'Math', 'English'].map(c => (
                  <button
                    key={c ?? 'all'}
                    onClick={() => setSelectedClass(c)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      selectedClass === c ? 'bg-accent-500 text-white' : 'bg-white/[0.06] text-surface-400 hover:bg-white/[0.08]'
                    }`}
                  >
                    {c ?? 'All'}
                  </button>
                ))}
              </div>
            </div>
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      <th className="text-left text-xs font-semibold text-surface-400 px-5 py-3">Student</th>
                      <th className="text-left text-xs font-semibold text-surface-400 px-5 py-3">Class</th>
                      <th className="text-left text-xs font-semibold text-surface-400 px-5 py-3">Avg Score</th>
                      <th className="text-left text-xs font-semibold text-surface-400 px-5 py-3">Streak</th>
                      <th className="text-left text-xs font-semibold text-surface-400 px-5 py-3">Awards</th>
                      <th className="text-left text-xs font-semibold text-surface-400 px-5 py-3">Last Active</th>
                      <th className="text-left text-xs font-semibold text-surface-400 px-5 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((s, i) => (
                      <motion.tr
                        key={s.name}
                        className="hover:bg-white/[0.04] transition-colors border-b border-white/[0.06] last:border-0"
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04, duration: 0.3 }}
                      >
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-accent-500/15 text-accent-400 text-xs font-bold flex items-center justify-center flex-shrink-0">
                              {s.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <span className="text-sm font-semibold text-white">{s.name}</span>
                              <p className="text-xs text-surface-500">{s.grade} Grade</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-sm text-surface-400">{s.class}</td>
                        <td className="px-5 py-3">
                          <span className={`text-sm font-bold ${
                            s.avg >= 90 ? 'text-success-400' :
                            s.avg >= 80 ? 'text-accent-400' :
                            s.avg >= 70 ? 'text-warning-400' : 'text-danger-400'
                          }`}>{s.avg}%</span>
                        </td>
                        <td className="px-5 py-3">
                          <span className="flex items-center gap-1 text-sm">
                            🔥 <span className="font-semibold text-surface-200">{s.streak}d</span>
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <span className="flex items-center gap-1 text-sm">
                            <Award className="w-3.5 h-3.5 text-warning-400" />
                            <span className="font-semibold text-surface-200">{s.awards}</span>
                          </span>
                        </td>
                        <td className="px-5 py-3 text-xs text-surface-500">{s.lastActive}</td>
                        <td className="px-5 py-3">
                          <span className={`badge ${
                            s.status === 'active' ? 'bg-success-400/15 text-success-400' : 'bg-warning-400/15 text-warning-400'
                          }`}>
                            {s.status === 'active' ? 'On track' : 'Needs attention'}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Announcements tab */}
        {tab === 'announcements' && (
          <motion.div
            key="announcements"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            <div className="space-y-3">
              {announcements.map((a, i) => (
                <motion.div
                  key={a.title}
                  className="glass-card p-5 flex items-center gap-4 transition-shadow"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  whileHover={{ x: 3 }}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    a.urgent ? 'bg-danger-400/15' : 'bg-accent-500/15'
                  }`}>
                    {a.urgent ? (
                      <AlertTriangle className="w-5 h-5 text-danger-400" />
                    ) : (
                      <MessageSquare className="w-5 h-5 text-accent-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-white">{a.title}</h4>
                    <p className="text-xs text-surface-400">{a.class} · {a.date}</p>
                  </div>
                  {a.urgent && <span className="badge bg-danger-400/15 text-danger-400">Urgent</span>}
                  <ChevronRight className="w-4 h-4 text-surface-500" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
