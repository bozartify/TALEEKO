'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, BookOpen, ChevronRight, Plus, Mail, MoreHorizontal,
  Search, Filter, Download, Award, TrendingUp, TrendingDown,
  AlertTriangle, Star, Target, Clock, MessageSquare, BarChart2,
  UserPlus, ChevronDown, X, Send, Bell, Sparkles, Brain, Eye,
  Check, Flame, Activity, Calendar, FileText, Megaphone
} from 'lucide-react'
import { FadeUp, StaggerList, StaggerItem, fadeUp, FadeInWhenVisible } from '@/components/ui/motion'

interface ClassRecord {
  name: string
  students: number
  lessons: number
  color: string
  subject: string
  period: string
  avgScore: number
  trend: 'up' | 'down'
  pending: number
  room: string
  nextClass: string
  completion: number
}

interface StudentRecord {
  name: string
  grade: string
  class: string
  avg: number
  status: 'active' | 'needs-attention'
  streak: number
  lastActive: string
  awards: number
  attendance: number
  iep: boolean
  ell: boolean
}

interface Announcement {
  id: string
  title: string
  body: string
  class: string
  date: string
  urgent: boolean
  sent: boolean
  views?: number
}

interface ActivityItem {
  name: string
  action: string
  time: string
  color: string
}

const classes: ClassRecord[] = [
  { name: '7th Grade Science', students: 28, lessons: 12, color: '#8b5cf6', subject: 'Biology & Earth Science', period: '1st Period', avgScore: 88, trend: 'up', pending: 3, room: 'Rm 204', nextClass: 'Today, 8:30 AM', completion: 78 },
  { name: '8th Grade History', students: 31, lessons: 9,  color: '#f97316', subject: 'American History',        period: '3rd Period', avgScore: 82, trend: 'up', pending: 5, room: 'Rm 118', nextClass: 'Today, 10:15 AM', completion: 65 },
  { name: '9th Grade Math',    students: 25, lessons: 15, color: '#14b8a6', subject: 'Algebra I',              period: '5th Period', avgScore: 79, trend: 'down', pending: 2, room: 'Rm 307', nextClass: 'Today, 12:00 PM', completion: 82 },
  { name: '10th Grade English',students: 29, lessons: 8,  color: '#f43f5e', subject: 'Literature & Writing',   period: '7th Period', avgScore: 85, trend: 'up', pending: 4, room: 'Rm 215', nextClass: 'Today, 1:45 PM', completion: 71 },
]

const students: StudentRecord[] = [
  { name: 'Emma Rodriguez',  grade: '7th', class: 'Science', avg: 92, status: 'active',          streak: 15, lastActive: '2h ago',   awards: 3, attendance: 97, iep: false, ell: false },
  { name: 'James Kim',       grade: '8th', class: 'History', avg: 87, status: 'active',          streak: 8,  lastActive: '1h ago',   awards: 2, attendance: 94, iep: false, ell: false },
  { name: 'Aisha Thompson',  grade: '9th', class: 'Math',    avg: 95, status: 'active',          streak: 22, lastActive: '30m ago',  awards: 5, attendance: 99, iep: false, ell: false },
  { name: 'Liam Chen',       grade: '10th',class: 'English', avg: 78, status: 'needs-attention', streak: 3,  lastActive: '2d ago',   awards: 1, attendance: 88, iep: false, ell: true  },
  { name: 'Sofia Patel',     grade: '7th', class: 'Science', avg: 88, status: 'active',          streak: 11, lastActive: '3h ago',   awards: 2, attendance: 95, iep: false, ell: false },
  { name: 'Noah Williams',   grade: '8th', class: 'History', avg: 71, status: 'needs-attention', streak: 1,  lastActive: '5d ago',   awards: 0, attendance: 82, iep: true,  ell: false },
  { name: 'Olivia Martinez', grade: '9th', class: 'Math',    avg: 91, status: 'active',          streak: 14, lastActive: '1h ago',   awards: 4, attendance: 96, iep: false, ell: false },
  { name: 'Ethan Johnson',   grade: '7th', class: 'Science', avg: 84, status: 'active',          streak: 7,  lastActive: '4h ago',   awards: 1, attendance: 93, iep: false, ell: false },
  { name: 'Ava Lee',         grade: '10th',class: 'English', avg: 93, status: 'active',          streak: 19, lastActive: '45m ago',  awards: 3, attendance: 98, iep: false, ell: false },
  { name: 'Mason Brown',     grade: '8th', class: 'History', avg: 76, status: 'needs-attention', streak: 2,  lastActive: '3d ago',   awards: 1, attendance: 85, iep: false, ell: false },
]

const announcements: Announcement[] = [
  { id: '1', title: 'Science Fair Projects Due', body: 'All science fair projects must be submitted digitally via the portal by Friday at 5:00 PM. Projects received after this deadline will not be accepted.', class: '7th Science', date: 'In 5 days', urgent: true, sent: true, views: 24 },
  { id: '2', title: 'History Essay Peer Review', body: 'We will be conducting in-class peer reviews of your Revolutionary War essays. Please bring two printed copies of your essay to class tomorrow.', class: '8th History', date: 'Tomorrow', urgent: true, sent: true, views: 28 },
  { id: '3', title: 'Math Quiz Chapter 7', body: 'Chapter 7 quiz on systems of equations will be held next Monday. Study the practice problems from pages 183–192. A review sheet will be posted tonight.', class: '9th Math', date: 'Next Monday', urgent: false, sent: true, views: 22 },
  { id: '4', title: 'Book Report Presentations', body: 'Students will present their book reports in class starting in two weeks. Presentations should be 5-7 minutes with a visual aid. Sign up for your slot via the class portal.', class: '10th English', date: 'In 2 weeks', urgent: false, sent: false, views: 0 },
]

const recentActivity: ActivityItem[] = [
  { name: 'Aisha Thompson', action: 'submitted Algebra HW', time: '12 min ago', color: '#14b8a6' },
  { name: 'Emma Rodriguez', action: 'completed Lab Report', time: '1h ago', color: '#8b5cf6' },
  { name: 'Ava Lee', action: 'scored 96 on quiz', time: '2h ago', color: '#f43f5e' },
  { name: 'Noah Williams', action: 'missed 3rd assignment', time: '3h ago', color: '#f59e0b' },
  { name: 'Olivia Martinez', action: 'joined group project', time: '4h ago', color: '#10b981' },
]

type Tab = 'classes' | 'students' | 'announcements'

export default function ClassroomPage() {
  const [tab, setTab] = useState<Tab>('classes')
  const [search, setSearch] = useState('')
  const [selectedClass, setSelectedClass] = useState<string | null>(null)
  const [expandedClass, setExpandedClass] = useState<string | null>(null)
  const [announcementModal, setAnnouncementModal] = useState(false)
  const [aiPanelOpen, setAiPanelOpen] = useState(true)
  const [composeAnn, setComposeAnn] = useState({ title: '', body: '', class: 'All Classes', urgent: false })

  const filteredStudents = students.filter(s =>
    (!search || s.name.toLowerCase().includes(search.toLowerCase())) &&
    (!selectedClass || s.class === selectedClass)
  )

  const totalStudents = classes.reduce((sum, c) => sum + c.students, 0)
  const avgScore = Math.round(classes.reduce((sum, c) => sum + c.avgScore, 0) / classes.length)
  const needsAttention = students.filter(s => s.status === 'needs-attention').length
  const totalPending = classes.reduce((sum, c) => sum + c.pending, 0)

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <StaggerList className="grid grid-cols-2 lg:grid-cols-4 gap-4" delay={0.08}>
        {[
          { label: 'Total Students', value: totalStudents.toString(), icon: Users, color: 'bg-accent-500/15 text-accent-400', delta: '+3 this week' },
          { label: 'Active Classes',  value: classes.length.toString(), icon: BookOpen, color: 'bg-success-400/15 text-success-400', delta: 'All running' },
          { label: 'Average Score',   value: `${avgScore}%`, icon: Target, color: 'bg-electric-400/15 text-electric-400', delta: '+2.1% this month' },
          { label: 'Pending Items', value: totalPending.toString(), icon: AlertTriangle, color: 'bg-warning-400/15 text-warning-400', delta: 'Needs review' },
        ].map(s => (
          <StaggerItem key={s.label} variants={fadeUp}>
            <motion.div
              className="stat-card h-full"
              whileHover={{ y: -3, boxShadow: '0 8px 30px rgba(139,92,246,0.12)', transition: { duration: 0.2 } }}
            >
              <div className={`icon-bubble ${s.color} mb-3`}><s.icon className="w-5 h-5" /></div>
              <div className="text-2xl font-black text-white">{s.value}</div>
              <div className="text-xs font-semibold text-surface-200 mt-0.5">{s.label}</div>
              <div className="text-xs text-success-400 mt-1">{s.delta}</div>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerList>

      {/* AI Classroom Pulse */}
      <FadeUp delay={0.1}>
        <div className="glass-card overflow-hidden border border-accent-500/15">
          <button
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors"
            onClick={() => setAiPanelOpen(o => !o)}
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#6366f1,#a78bfa)' }}>
                <Brain className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-bold text-white">AI Classroom Pulse</span>
              <span className="text-[10px] bg-warning-500/15 text-warning-400 px-1.5 py-0.5 rounded-md font-bold">3 alerts</span>
            </div>
            <motion.div animate={{ rotate: aiPanelOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="w-4 h-4 text-surface-400" />
            </motion.div>
          </button>
          <AnimatePresence>
            {aiPanelOpen && (
              <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                <div className="px-5 pb-4 border-t border-white/[0.06] pt-4 space-y-3">
                  {[
                    { color: '#ef4444', title: 'At-Risk Students', desc: 'Noah Williams (History) and Liam Chen (English) are showing declining performance. Parent contact recommended within 48 hours.', cta: 'Send Alert' },
                    { color: '#f59e0b', title: 'Engagement Dip in 9th Math', desc: 'Engagement metrics for 9th Grade Math dropped 14% this week. Consider adding an interactive activity to Thursday\'s lesson.', cta: 'AI Suggestion' },
                    { color: '#6366f1', title: 'Assignment Gap Detected', desc: '3 students in 8th History have not submitted the Revolutionary War essay. Automated reminder can be sent in one click.', cta: 'Send Reminder' },
                  ].map((alert, i) => (
                    <div key={alert.title} className="flex items-start gap-3 p-3.5 rounded-2xl" style={{ backgroundColor: alert.color + '08', border: `1px solid ${alert.color}25` }}>
                      <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: alert.color }} />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-bold text-white block mb-0.5">{alert.title}</span>
                        <p className="text-[10px] text-surface-400 leading-relaxed">{alert.desc}</p>
                      </div>
                      <button className="text-[10px] font-bold flex-shrink-0 flex items-center gap-1 mt-0.5" style={{ color: alert.color }}>
                        {alert.cta} <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </FadeUp>

      {/* Tabs + actions */}
      <FadeUp delay={0.15}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-1 bg-white/[0.06] rounded-full p-1">
            {([
              { key: 'classes' as const, label: 'Classes', icon: BookOpen },
              { key: 'students' as const, label: 'Students', icon: Users },
              { key: 'announcements' as const, label: 'Announcements', icon: Megaphone },
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
              className="btn-gradient text-xs"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => tab === 'announcements' && setAnnouncementModal(true)}
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
          <motion.div key="classes" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Class cards */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {classes.map((cls, i) => (
                    <motion.div
                      key={cls.name}
                      className="glass-card overflow-hidden cursor-pointer group"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 + i * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      whileHover={{ y: -3, transition: { duration: 0.18 } }}
                      onClick={() => setExpandedClass(prev => prev === cls.name ? null : cls.name)}
                    >
                      <div className="h-2" style={{ backgroundColor: cls.color }} />
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-bold text-white group-hover:text-accent-400 transition-colors">{cls.name}</h4>
                            <p className="text-xs text-surface-400 mt-0.5">{cls.subject}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {cls.pending > 0 && (
                              <span className="text-[9px] bg-warning-400/15 text-warning-400 px-1.5 py-0.5 rounded-full font-bold">{cls.pending} pending</span>
                            )}
                            <button className="text-surface-500 hover:text-surface-200"><MoreHorizontal className="w-4 h-4" /></button>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 mb-3 text-xs text-surface-500">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{cls.nextClass}</span>
                          <span>{cls.room}</span>
                          <span>{cls.period}</span>
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
                        <div className="space-y-2">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] text-surface-500">Class Average</span>
                              <div className="flex items-center gap-1">
                                <span className="text-xs font-bold text-surface-200">{cls.avgScore}%</span>
                                {cls.trend === 'up' ? <TrendingUp className="w-3 h-3 text-success-400" /> : <TrendingDown className="w-3 h-3 text-danger-400" />}
                              </div>
                            </div>
                            <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                              <motion.div
                                className="h-full rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${cls.avgScore}%` }}
                                transition={{ delay: 0.3 + i * 0.08, duration: 0.6 }}
                                style={{ backgroundColor: cls.color }}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] text-surface-500">Curriculum Completion</span>
                              <span className="text-xs font-bold text-surface-200">{cls.completion}%</span>
                            </div>
                            <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                              <motion.div
                                className="h-full rounded-full bg-gradient-to-r from-white/20 to-white/10"
                                initial={{ width: 0 }}
                                animate={{ width: `${cls.completion}%` }}
                                transition={{ delay: 0.4 + i * 0.08, duration: 0.6 }}
                              />
                            </div>
                          </div>
                        </div>
                        <AnimatePresence>
                          {expandedClass === cls.name && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center gap-2 flex-wrap">
                                <Link href="/courses" className="btn-outline text-xs px-3 py-1.5" onClick={e => e.stopPropagation()}>View Roster</Link>
                                <button className="btn-secondary text-xs px-3 py-1.5" onClick={e => e.stopPropagation()}>
                                  <Sparkles className="w-3 h-3" /> AI Plan
                                </button>
                                <button className="btn-secondary text-xs px-3 py-1.5" onClick={e => e.stopPropagation()}>
                                  <Mail className="w-3 h-3" /> Message
                                </button>
                                <button className="btn-secondary text-xs px-3 py-1.5" onClick={e => e.stopPropagation()}>
                                  <BarChart2 className="w-3 h-3" /> Analytics
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Right sidebar: Activity + quick stats */}
              <div className="space-y-4">
                <FadeInWhenVisible delay={0.1}>
                  <div className="glass-card p-5">
                    <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-accent-400" /> Live Activity
                    </h4>
                    <div className="space-y-3">
                      {recentActivity.map((act, i) => (
                        <motion.div
                          key={`${act.name}-${i}`}
                          className="flex items-start gap-2.5"
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 + i * 0.07 }}
                        >
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0" style={{ background: `linear-gradient(135deg,${act.color},${act.color}99)` }}>
                            {act.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-white truncate">{act.name}</p>
                            <p className="text-[10px] text-surface-500">{act.action} · {act.time}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </FadeInWhenVisible>

                <FadeInWhenVisible delay={0.15}>
                  <div className="glass-card p-5">
                    <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-neon-400" /> Today&apos;s Schedule
                    </h4>
                    <div className="space-y-2.5">
                      {classes.map((cls, i) => (
                        <div key={cls.name} className="flex items-center gap-3">
                          <div className="w-1.5 h-8 rounded-full flex-shrink-0" style={{ backgroundColor: cls.color }} />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-white truncate">{cls.name}</p>
                            <p className="text-[10px] text-surface-500">{cls.nextClass.replace('Today, ', '')}</p>
                          </div>
                          <span className="text-[9px] bg-white/[0.06] text-surface-400 px-1.5 py-0.5 rounded-full">{cls.room}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </FadeInWhenVisible>

                <FadeInWhenVisible delay={0.2}>
                  <div className="glass-card p-5">
                    <h4 className="text-sm font-bold text-white mb-3">Quick Actions</h4>
                    <div className="space-y-2">
                      {[
                        { label: 'Send Class Update', icon: Bell, color: '#6366f1' },
                        { label: 'Generate AI Lesson', icon: Sparkles, color: '#8b5cf6' },
                        { label: 'Export Grades', icon: Download, color: '#14b8a6' },
                        { label: 'View Analytics', icon: BarChart2, color: '#f97316' },
                      ].map((action, i) => (
                        <motion.button
                          key={action.label}
                          className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.04] text-left transition-colors group"
                          whileHover={{ x: 2 }}
                        >
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: action.color + '18' }}>
                            <action.icon className="w-3.5 h-3.5" style={{ color: action.color }} />
                          </div>
                          <span className="text-xs text-surface-300 group-hover:text-white transition-colors">{action.label}</span>
                          <ChevronRight className="w-3 h-3 text-surface-600 ml-auto group-hover:text-accent-400 transition-colors" />
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </FadeInWhenVisible>
              </div>
            </div>
          </motion.div>
        )}

        {/* Students tab */}
        {tab === 'students' && (
          <motion.div key="students" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
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
              <div className="flex gap-1 flex-wrap">
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
              <span className="text-xs text-surface-500 ml-auto">{filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      <th className="text-left text-xs font-semibold text-surface-400 px-5 py-3">Student</th>
                      <th className="text-left text-xs font-semibold text-surface-400 px-5 py-3 hidden md:table-cell">Class</th>
                      <th className="text-left text-xs font-semibold text-surface-400 px-5 py-3">Avg Score</th>
                      <th className="text-left text-xs font-semibold text-surface-400 px-5 py-3 hidden sm:table-cell">Attend.</th>
                      <th className="text-left text-xs font-semibold text-surface-400 px-5 py-3 hidden lg:table-cell">Streak</th>
                      <th className="text-left text-xs font-semibold text-surface-400 px-5 py-3 hidden lg:table-cell">Awards</th>
                      <th className="text-left text-xs font-semibold text-surface-400 px-5 py-3">Status</th>
                      <th className="text-right text-xs font-semibold text-surface-400 px-5 py-3">Actions</th>
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
                              <div className="flex items-center gap-1.5">
                                <span className="text-sm font-semibold text-white">{s.name}</span>
                                {s.iep && <span className="text-[9px] bg-neon-500/15 text-neon-400 px-1 py-0.5 rounded font-bold">IEP</span>}
                                {s.ell && <span className="text-[9px] bg-electric-500/15 text-electric-400 px-1 py-0.5 rounded font-bold">ELL</span>}
                              </div>
                              <p className="text-xs text-surface-500">{s.grade} Grade</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3 hidden md:table-cell text-sm text-surface-400">{s.class}</td>
                        <td className="px-5 py-3">
                          <span className={`text-sm font-bold ${s.avg >= 90 ? 'text-success-400' : s.avg >= 80 ? 'text-accent-400' : s.avg >= 70 ? 'text-warning-400' : 'text-danger-400'}`}>{s.avg}%</span>
                        </td>
                        <td className="px-5 py-3 hidden sm:table-cell">
                          <span className={`text-sm font-semibold ${s.attendance >= 95 ? 'text-success-400' : s.attendance >= 90 ? 'text-surface-200' : 'text-warning-400'}`}>{s.attendance}%</span>
                        </td>
                        <td className="px-5 py-3 hidden lg:table-cell">
                          <span className="flex items-center gap-1 text-sm text-surface-200">
                            <Flame className="w-3.5 h-3.5 text-warning-400" /> {s.streak}d
                          </span>
                        </td>
                        <td className="px-5 py-3 hidden lg:table-cell">
                          <span className="flex items-center gap-1 text-sm">
                            <Award className="w-3.5 h-3.5 text-warning-400" />
                            <span className="font-semibold text-surface-200">{s.awards}</span>
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <span className={`badge ${s.status === 'active' ? 'bg-success-400/15 text-success-400' : 'bg-warning-400/15 text-warning-400'}`}>
                            {s.status === 'active' ? 'On track' : 'Needs help'}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button className="p-1.5 rounded-lg hover:bg-white/[0.06] text-surface-500 hover:text-white transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                            <button className="p-1.5 rounded-lg hover:bg-white/[0.06] text-surface-500 hover:text-white transition-colors"><Mail className="w-3.5 h-3.5" /></button>
                          </div>
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
          <motion.div key="announcements" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-3">
                {announcements.map((a, i) => (
                  <motion.div
                    key={a.id}
                    className="glass-card p-5"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    whileHover={{ x: 2 }}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${a.urgent ? 'bg-danger-400/15' : 'bg-accent-500/15'}`}>
                        {a.urgent ? <AlertTriangle className="w-5 h-5 text-danger-400" /> : <Megaphone className="w-5 h-5 text-accent-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <h4 className="text-sm font-bold text-white">{a.title}</h4>
                          {a.urgent && <span className="badge bg-danger-400/15 text-danger-400 flex-shrink-0">Urgent</span>}
                          {a.sent ? (
                            <span className="badge bg-success-400/15 text-success-400 flex-shrink-0"><Check className="w-2.5 h-2.5" /> Sent</span>
                          ) : (
                            <span className="badge bg-surface-500/15 text-surface-400 flex-shrink-0">Draft</span>
                          )}
                        </div>
                        <p className="text-[10px] text-surface-400 mb-2">{a.class} · Due {a.date}</p>
                        <p className="text-xs text-surface-400 leading-relaxed line-clamp-2">{a.body}</p>
                        {a.views !== undefined && a.views > 0 && (
                          <p className="text-[10px] text-surface-500 mt-2 flex items-center gap-1"><Eye className="w-3 h-3" />{a.views} views</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/[0.06]">
                      <button className="btn-secondary text-xs px-3 py-1.5"><Eye className="w-3 h-3" /> Preview</button>
                      {!a.sent && (
                        <button className="btn-gradient text-xs px-3 py-1.5"><Send className="w-3 h-3" /> Send Now</button>
                      )}
                      <button className="btn-secondary text-xs px-3 py-1.5"><FileText className="w-3 h-3" /> Edit</button>
                      <button className="ml-auto btn-secondary text-xs px-3 py-1.5 text-danger-400 hover:bg-danger-400/10">
                        <X className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Right: Templates + Tips */}
              <div className="space-y-4">
                <FadeInWhenVisible delay={0.1}>
                  <div className="glass-card p-5">
                    <h4 className="text-sm font-bold text-white mb-3">Quick Templates</h4>
                    <div className="space-y-2">
                      {[
                        { label: 'Assignment Reminder', color: '#6366f1', icon: Bell },
                        { label: 'Test Announcement', color: '#f59e0b', icon: AlertTriangle },
                        { label: 'Class Update', color: '#14b8a6', icon: Megaphone },
                        { label: 'Positive Feedback', color: '#10b981', icon: Star },
                        { label: 'Parent Newsletter', color: '#8b5cf6', icon: Mail },
                      ].map((tmpl, i) => (
                        <motion.button
                          key={tmpl.label}
                          className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-white/[0.04] text-left transition-colors group"
                          initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.05 }}
                        >
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: tmpl.color + '18' }}>
                            <tmpl.icon className="w-3.5 h-3.5" style={{ color: tmpl.color }} />
                          </div>
                          <span className="text-xs text-surface-300 group-hover:text-white transition-colors">{tmpl.label}</span>
                          <Plus className="w-3 h-3 text-surface-600 ml-auto group-hover:text-accent-400 transition-colors" />
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </FadeInWhenVisible>

                <FadeInWhenVisible delay={0.15}>
                  <div className="glass-card p-5">
                    <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                      <Brain className="w-4 h-4 text-accent-400" /> AI-Draft with Me
                    </h4>
                    <p className="text-xs text-surface-400 mb-3 leading-relaxed">Describe your announcement and AI will write a polished, grade-appropriate message in seconds.</p>
                    <textarea
                      rows={3}
                      placeholder="e.g. Remind students about the science fair deadline on Friday..."
                      className="w-full text-xs bg-white/[0.04] border border-white/[0.08] text-surface-200 placeholder:text-surface-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent-500 resize-none"
                    />
                    <motion.button className="btn-gradient text-xs w-full mt-3" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Sparkles className="w-3.5 h-3.5" /> Draft with AI
                    </motion.button>
                  </div>
                </FadeInWhenVisible>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Announcement Modal */}
      <AnimatePresence>
        {announcementModal && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setAnnouncementModal(false)} />
            <motion.div className="relative glass-card p-6 w-full max-w-lg z-10" initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-bold text-white">New Announcement</h3>
                <button onClick={() => setAnnouncementModal(false)} className="text-surface-400 hover:text-white p-1"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-surface-300 mb-1.5">Title</label>
                  <input
                    type="text"
                    placeholder="Announcement title..."
                    value={composeAnn.title}
                    onChange={e => setComposeAnn(a => ({ ...a, title: e.target.value }))}
                    className="w-full bg-white/[0.04] border border-white/[0.08] text-surface-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-surface-300 mb-1.5">Message</label>
                  <textarea
                    rows={4}
                    placeholder="Write your announcement..."
                    value={composeAnn.body}
                    onChange={e => setComposeAnn(a => ({ ...a, body: e.target.value }))}
                    className="w-full bg-white/[0.04] border border-white/[0.08] text-surface-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-surface-300 mb-1.5">Send To</label>
                    <select
                      value={composeAnn.class}
                      onChange={e => setComposeAnn(a => ({ ...a, class: e.target.value }))}
                      className="w-full bg-white/[0.04] border border-white/[0.08] text-surface-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                    >
                      {['All Classes', '7th Grade Science', '8th Grade History', '9th Grade Math', '10th Grade English'].map(c => (
                        <option key={c} value={c} className="bg-surface-900">{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-surface-300 mb-1.5">Schedule</label>
                    <input type="datetime-local" className="w-full bg-white/[0.04] border border-white/[0.08] text-surface-200 rounded-xl px-3 py-2 text-xs focus:outline-none" />
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={composeAnn.urgent}
                    onChange={e => setComposeAnn(a => ({ ...a, urgent: e.target.checked }))}
                    className="w-3.5 h-3.5 accent-danger-400 rounded"
                  />
                  <span className="text-xs text-surface-300">Mark as Urgent</span>
                </label>
              </div>
              <div className="flex items-center gap-3 mt-6">
                <button className="btn-secondary text-xs flex-1">Save Draft</button>
                <motion.button className="btn-gradient text-xs flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setAnnouncementModal(false)}>
                  <Send className="w-3.5 h-3.5" /> Send Now
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
