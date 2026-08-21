'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, Eye, BookOpen, Calendar, MessageSquare, Star, TrendingUp,
  Award, Send, Settings, Info, BarChart2, Check, Clock,
  FileText, ChevronLeft, ChevronRight, Share2, ChevronDown,
  AlertTriangle, Lightbulb, ArrowRight, X, Bell, Download,
  Sparkles, Phone, Mail, ExternalLink, Flag, BookMarked, Plus
} from 'lucide-react'
import { FadeUp, FadeInWhenVisible, StaggerList, StaggerItem, fadeUp } from '@/components/ui/motion'

type Tab = 'overview' | 'grades' | 'attendance' | 'messages'

const STUDENT_INFO = {
  name: 'Emma Wilson',
  grade: '10th Grade',
  class: 'AP Biology',
  avatar: 'EW',
  gpa: '3.8',
  attendanceRate: '96%',
  missingAssignments: 2,
  upcomingTests: 3,
  advisor: 'Mr. Hernandez',
  homeroom: 'Room 214',
  id: '#20240892',
}

const RECENT_GRADES = [
  { assignment: 'Lab Report: Photosynthesis', subject: 'AP Biology', score: 92, maxScore: 100, date: 'Jul 25', grade: 'A', trend: 'up' },
  { assignment: 'Essay: The Great Gatsby', subject: '10th English', score: 88, maxScore: 100, date: 'Jul 22', grade: 'B+', trend: 'up' },
  { assignment: 'Ch. 5 Quiz', subject: 'Algebra II', score: 45, maxScore: 50, date: 'Jul 20', grade: 'A', trend: 'same' },
  { assignment: 'Midterm Exam', subject: 'AP Biology', score: 178, maxScore: 200, date: 'Jul 18', grade: 'B+', trend: 'down' },
  { assignment: 'Group Presentation', subject: '10th English', score: 95, maxScore: 100, date: 'Jul 15', grade: 'A', trend: 'up' },
]

const SUBJECT_GRADES = [
  { subject: 'AP Biology', letter: 'A-', percentage: 91, color: '#10b981', classAvg: 84, trend: [85, 86, 88, 90, 91] },
  { subject: '10th English', letter: 'B+', percentage: 87, color: '#6366f1', classAvg: 81, trend: [82, 84, 85, 86, 87] },
  { subject: 'Algebra II', letter: 'A', percentage: 94, color: '#22d3ee', classAvg: 79, trend: [90, 92, 93, 93, 94] },
  { subject: 'World History', letter: 'B', percentage: 83, color: '#f59e0b', classAvg: 80, trend: [80, 80, 82, 82, 83] },
  { subject: 'PE', letter: 'A', percentage: 97, color: '#8b5cf6', classAvg: 91, trend: [95, 95, 96, 97, 97] },
  { subject: 'Art Studio', letter: 'A-', percentage: 92, color: '#f43f5e', classAvg: 88, trend: [88, 90, 91, 91, 92] },
]

const ATTENDANCE_DAYS: Record<number, 'present' | 'absent' | 'late' | 'excused'> = {
  1: 'present', 2: 'present', 3: 'present', 4: 'late', 5: 'present',
  7: 'present', 8: 'present', 9: 'absent', 10: 'present', 11: 'present', 12: 'present',
  14: 'present', 15: 'present', 16: 'present', 17: 'excused', 18: 'present', 19: 'present',
  21: 'present', 22: 'present', 23: 'present', 24: 'present', 25: 'present', 26: 'present',
  28: 'present', 29: 'present', 30: 'present', 31: 'present',
}

const ATTENDANCE_COLORS: Record<string, string> = {
  present: '#10b981',
  absent: '#ef4444',
  late: '#f59e0b',
  excused: '#22d3ee',
}

interface Message {
  id: string
  from: string
  role: string
  avatar: string
  content: string
  time: string
  isTeacher: boolean
}

const MESSAGES: Message[] = [
  {
    id: '1',
    from: 'Mrs. Johnson',
    role: 'Teacher',
    avatar: 'MJ',
    content: 'Emma did a fantastic job on her lab report this week. Her analysis of the photosynthesis experiment was thorough and well-organized. She is showing great improvement in her scientific writing.',
    time: 'Jul 25, 3:45 PM',
    isTeacher: true,
  },
  {
    id: '2',
    from: 'Sarah Wilson',
    role: 'Parent',
    avatar: 'SW',
    content: 'Thank you for the update! We have been encouraging her to put more effort into her lab reports. Is there anything we can do at home to support her further in Biology?',
    time: 'Jul 25, 6:12 PM',
    isTeacher: false,
  },
  {
    id: '3',
    from: 'Mrs. Johnson',
    role: 'Teacher',
    avatar: 'MJ',
    content: 'I would recommend reviewing the study guide for the upcoming Chapter 8 test. Emma could also benefit from the online practice simulations I shared with the class. The test is scheduled for next Friday.',
    time: 'Jul 26, 9:30 AM',
    isTeacher: true,
  },
]

const UPCOMING_EVENTS = [
  { date: 'Aug 3', label: 'Chapter 8 Test – AP Biology', type: 'test', color: '#ef4444' },
  { date: 'Aug 5', label: 'English Essay Due', type: 'assignment', color: '#f59e0b' },
  { date: 'Aug 8', label: 'Parent-Teacher Conferences', type: 'event', color: '#6366f1' },
  { date: 'Aug 12', label: 'Algebra II Unit Test', type: 'test', color: '#ef4444' },
]

const MISSING_WORK = [
  { title: 'World History: Ch. 6 Reflection', due: 'Jul 28 (3 days ago)', subject: 'World History', color: '#f59e0b' },
  { title: 'Art Studio: Sketchbook Entry #4', due: 'Jul 30 (1 day ago)', subject: 'Art Studio', color: '#f43f5e' },
]

const AI_ALERTS = [
  {
    icon: AlertTriangle,
    color: '#f59e0b',
    bg: '#f59e0b18',
    title: '2 Missing Assignments',
    body: 'Emma has 2 overdue assignments in World History and Art Studio. These may affect her grade if not submitted soon.',
    action: 'View Assignments',
  },
  {
    icon: TrendingUp,
    color: '#10b981',
    bg: '#10b98118',
    title: 'AP Biology Trending Up',
    body: 'Emma\'s AP Biology grade has improved by 7 points over the last 5 weeks. Consistent lab report quality is the driver.',
    action: 'See Grade Trend',
  },
  {
    icon: Lightbulb,
    color: '#6366f1',
    bg: '#6366f118',
    title: 'Chapter 8 Test in 3 Days',
    body: 'Emma has an AP Biology test on Aug 3. Her teacher recommends reviewing the Chapter 8 study guide and practice simulations.',
    action: 'Study Resources',
  },
]

const GPA_TREND = [3.4, 3.5, 3.6, 3.6, 3.7, 3.7, 3.8, 3.8]
const GPA_LABELS = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8']

function getGradeColor(grade: string): string {
  if (grade.startsWith('A')) return '#10b981'
  if (grade.startsWith('B')) return '#22d3ee'
  if (grade.startsWith('C')) return '#f59e0b'
  if (grade.startsWith('D')) return '#f97316'
  return '#ef4444'
}

/* ─────────────────────────────────────────────────────────
   COMPONENT
   ───────────────────────────────────────────────────────── */

export default function ParentPortalPage() {
  const [tab, setTab] = useState<Tab>('overview')
  const [aiOpen, setAiOpen] = useState(true)
  const [shareOpen, setShareOpen] = useState(false)
  const [meetingOpen, setMeetingOpen] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [messages, setMessages] = useState<Message[]>(MESSAGES)
  const [toastMsg, setToastMsg] = useState('')
  const [copiedLink, setCopiedLink] = useState(false)
  const [attendMonth, setAttendMonth] = useState(6) // 0-indexed, 6 = July
  const [attendYear, setAttendYear] = useState(2026)

  const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December']

  function prevAttendMonth() {
    if (attendMonth === 0) { setAttendMonth(11); setAttendYear(y => y - 1) }
    else setAttendMonth(m => m - 1)
  }
  function nextAttendMonth() {
    if (attendMonth === 11) { setAttendMonth(0); setAttendYear(y => y + 1) }
    else setAttendMonth(m => m + 1)
  }

  const daysInMonth = new Date(attendYear, attendMonth + 1, 0).getDate()
  const startDayOfWeek = new Date(attendYear, attendMonth, 1).getDay()
  const calendarRows: (number | null)[][] = []
  let currentRow: (number | null)[] = Array(startDayOfWeek).fill(null)
  for (let d = 1; d <= daysInMonth; d++) {
    currentRow.push(d)
    if (currentRow.length === 7) { calendarRows.push(currentRow); currentRow = [] }
  }
  if (currentRow.length > 0) {
    while (currentRow.length < 7) currentRow.push(null)
    calendarRows.push(currentRow)
  }

  const showToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 2500)
  }

  const handleSendReply = () => {
    if (!replyText.trim()) return
    const newMsg: Message = {
      id: Date.now().toString(),
      from: 'Sarah Wilson',
      role: 'Parent',
      avatar: 'SW',
      content: replyText,
      time: 'Just now',
      isTeacher: false,
    }
    setMessages(prev => [...prev, newMsg])
    setReplyText('')
    showToast('Message sent!')
  }

  const handleCopyLink = () => {
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* ── TOAST ─── */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white shadow-xl"
            style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' }}
            initial={{ opacity: 0, y: -16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.95 }}
          >
            <Check className="w-4 h-4" />
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HEADER ─── */}
      <FadeUp>
        <div className="hero-mesh rounded-3xl p-6 border border-white/[0.06]">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)' }}>
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-black text-white tracking-tight">Parent Portal</h1>
                  <span className="text-[10px] bg-violet-500/20 text-violet-400 px-2 py-0.5 rounded-full font-bold border border-violet-500/20">Family View</span>
                </div>
                <p className="text-sm text-surface-400">Preview and customize what families see</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <motion.button className="btn-secondary text-xs px-3 py-1.5" whileHover={{ scale: 1.03 }} onClick={() => setMeetingOpen(true)}>
                <Calendar className="w-3.5 h-3.5" /> Schedule Meeting
              </motion.button>
              <motion.button className="btn-secondary text-xs px-3 py-1.5" whileHover={{ scale: 1.03 }} onClick={() => showToast('Portal customized!')}>
                <Settings className="w-3.5 h-3.5" /> Customize
              </motion.button>
              <motion.button className="btn-gradient text-xs" whileHover={{ scale: 1.03 }} onClick={() => setShareOpen(true)}>
                <Share2 className="w-3.5 h-3.5" /> Share Link
              </motion.button>
            </div>
          </div>
          <div className="border-t border-white/[0.06] pt-4 flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold">GPA</span>
              <span className="text-xs font-bold text-white">{STUDENT_INFO.gpa}</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold">Attendance</span>
              <span className="text-xs font-bold text-success-400">{STUDENT_INFO.attendanceRate}</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold">Missing</span>
              <span className="text-xs font-bold text-danger-400">{STUDENT_INFO.missingAssignments}</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold">Upcoming Tests</span>
              <span className="text-xs font-bold text-warning-400">{STUDENT_INFO.upcomingTests}</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold">Messages</span>
              <span className="text-xs font-bold text-violet-400">{messages.length}</span>
            </div>
          </div>
        </div>
      </FadeUp>

      {/* ── PREVIEW BANNER ─── */}
      <FadeUp delay={0.04}>
        <div className="glass-card p-4 flex items-start gap-3">
          <div className="w-7 h-7 rounded-lg bg-electric-400/15 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Eye className="w-3.5 h-3.5 text-electric-400" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-white">Teacher Preview Mode</h4>
            <p className="text-xs text-surface-400 mt-0.5">
              This is exactly what parents and guardians will see. Toggle sections on/off below and share the portal link with families.
            </p>
          </div>
          <button className="btn-secondary text-xs px-3 py-1.5 flex-shrink-0" onClick={() => showToast('Report card downloaded')}>
            <Download className="w-3.5 h-3.5" /> Report Card
          </button>
        </div>
      </FadeUp>

      {/* ── AI INSIGHTS ─── */}
      <FadeUp delay={0.07}>
        <div className="glass-card overflow-hidden">
          <button
            className="w-full flex items-center justify-between p-4 text-left"
            onClick={() => setAiOpen(v => !v)}
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-violet-500/15">
                <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              </div>
              <span className="text-sm font-bold text-white">AI Parent Insights</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 font-medium">1 alert</span>
            </div>
            <motion.div animate={{ rotate: aiOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="w-4 h-4 text-surface-400" />
            </motion.div>
          </button>
          <AnimatePresence initial={false}>
            {aiOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.28, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                  {AI_ALERTS.map((alert, i) => (
                    <motion.div
                      key={alert.title}
                      className="rounded-xl p-4"
                      style={{ background: alert.bg, border: `1px solid ${alert.color}25` }}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07 }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <alert.icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: alert.color }} />
                        <span className="text-xs font-bold text-white">{alert.title}</span>
                      </div>
                      <p className="text-[11px] text-surface-400 leading-relaxed mb-3">{alert.body}</p>
                      <button className="text-[11px] font-semibold flex items-center gap-1" style={{ color: alert.color }}>
                        {alert.action} <ArrowRight className="w-3 h-3" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </FadeUp>

      {/* ── STUDENT CARD + STATS ─── */}
      <FadeUp delay={0.1}>
        <div className="glass-card p-5">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-black text-white" style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}>
                {STUDENT_INFO.avatar}
              </div>
              <div>
                <h3 className="text-base font-black text-white">{STUDENT_INFO.name}</h3>
                <p className="text-xs text-surface-400">{STUDENT_INFO.grade} · {STUDENT_INFO.class}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[10px] text-surface-500">Advisor: {STUDENT_INFO.advisor}</span>
                  <span className="text-[10px] text-surface-500">{STUDENT_INFO.homeroom}</span>
                  <span className="text-[10px] text-surface-500">ID: {STUDENT_INFO.id}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <motion.button className="btn-secondary text-xs px-3 py-1.5" whileTap={{ scale: 0.97 }} onClick={() => showToast('Opening email to teacher…')}>
                <Mail className="w-3.5 h-3.5" /> Email Teacher
              </motion.button>
              <motion.button className="btn-secondary text-xs px-3 py-1.5" whileTap={{ scale: 0.97 }} onClick={() => showToast('School phone: (555) 867-5309')}>
                <Phone className="w-3.5 h-3.5" /> Call School
              </motion.button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'GPA', value: STUDENT_INFO.gpa, icon: Award, color: '#10b981', sub: 'Cumulative' },
              { label: 'Attendance', value: STUDENT_INFO.attendanceRate, icon: Calendar, color: '#6366f1', sub: 'This semester' },
              { label: 'Missing Work', value: STUDENT_INFO.missingAssignments.toString(), icon: FileText, color: '#f59e0b', sub: 'Needs attention' },
              { label: 'Upcoming Tests', value: STUDENT_INFO.upcomingTests.toString(), icon: BookOpen, color: '#22d3ee', sub: 'Next 2 weeks' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="rounded-xl p-3"
                style={{ background: stat.color + '08', border: `1px solid ${stat.color}15` }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 + i * 0.05 }}
                whileHover={{ y: -2 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ backgroundColor: stat.color + '18' }}>
                    <stat.icon className="w-3 h-3" style={{ color: stat.color }} />
                  </div>
                  <span className="text-[10px] text-surface-500">{stat.label}</span>
                </div>
                <p className="text-xl font-black text-white">{stat.value}</p>
                <p className="text-[10px] mt-0.5" style={{ color: stat.color }}>{stat.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </FadeUp>

      {/* ── TABS ─── */}
      <FadeUp delay={0.14}>
        <div className="flex items-center gap-1 bg-white/[0.05] rounded-full p-1 w-fit overflow-x-auto">
          {([
            { key: 'overview' as const, label: 'Overview', icon: Star },
            { key: 'grades' as const, label: 'Grades', icon: BarChart2 },
            { key: 'attendance' as const, label: 'Attendance', icon: Calendar },
            { key: 'messages' as const, label: 'Messages', icon: MessageSquare, badge: 3 },
          ]).map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`relative flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                tab === t.key ? 'bg-white/[0.08] text-white' : 'text-surface-400 hover:text-surface-200'
              }`}
            >
              <t.icon className="w-3.5 h-3.5" />
              {t.label}
              {t.badge && tab !== t.key && (
                <span className="w-4 h-4 rounded-full bg-violet-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </FadeUp>

      {/* ── TAB CONTENT ─── */}
      <AnimatePresence mode="wait">
        {/* OVERVIEW */}
        {tab === 'overview' && (
          <motion.div key="overview" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }} className="space-y-5">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
              {/* Recent Grades */}
              <div className="xl:col-span-2 glass-card overflow-hidden">
                <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-violet-400" />
                    Recent Grades
                  </h4>
                  <button className="text-[11px] text-violet-400 flex items-center gap-1">
                    View All <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
                <div className="divide-y divide-white/[0.04]">
                  {RECENT_GRADES.map((g, i) => (
                    <motion.div
                      key={g.assignment}
                      className="px-5 py-3.5 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm font-semibold text-white truncate">{g.assignment}</h5>
                        <p className="text-xs text-surface-500">{g.subject} · {g.date}</p>
                      </div>
                      <div className="flex items-center gap-3 ml-4">
                        <span className="text-xs text-surface-400">{g.score}/{g.maxScore}</span>
                        <span
                          className="text-xs font-bold px-2.5 py-1 rounded-lg"
                          style={{ color: getGradeColor(g.grade), backgroundColor: getGradeColor(g.grade) + '18' }}
                        >
                          {g.grade}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Right sidebar: Missing + Events */}
              <div className="space-y-4">
                {/* Missing Work */}
                <div className="glass-card p-4">
                  <h4 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
                    <Flag className="w-3.5 h-3.5 text-amber-400" />
                    Missing Work
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400">{MISSING_WORK.length}</span>
                  </h4>
                  <div className="space-y-2">
                    {MISSING_WORK.map(work => (
                      <div key={work.title} className="rounded-xl p-3" style={{ background: work.color + '08', border: `1px solid ${work.color}20` }}>
                        <p className="text-xs font-semibold text-white">{work.title}</p>
                        <p className="text-[10px] mt-0.5" style={{ color: work.color }}>Due: {work.due}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upcoming Events */}
                <div className="glass-card p-4">
                  <h4 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
                    <Bell className="w-3.5 h-3.5 text-blue-400" />
                    Upcoming
                  </h4>
                  <div className="space-y-2.5">
                    {UPCOMING_EVENTS.map(ev => (
                      <div key={ev.label} className="flex items-start gap-2.5">
                        <div className="flex-shrink-0 w-10 text-center">
                          <span className="text-[9px] font-bold" style={{ color: ev.color }}>{ev.date}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-medium text-surface-200 leading-tight">{ev.label}</p>
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full mt-0.5 inline-block capitalize" style={{ backgroundColor: ev.color + '18', color: ev.color }}>
                            {ev.type}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* GPA Trend */}
            <div className="glass-card p-5">
              <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                GPA Trend — This Semester
              </h4>
              {(() => {
                const W = 320, H = 100, PX = 20, PY = 12
                const minV = 3.2, maxV = 4.0
                const sx = (i: number) => PX + (i / (GPA_TREND.length - 1)) * (W - PX * 2)
                const sy = (v: number) => PY + ((maxV - v) / (maxV - minV)) * (H - PY * 2)
                const pts = GPA_TREND.map((v, i) => ({ x: sx(i), y: sy(v) }))
                let linePath = `M ${pts[0].x} ${pts[0].y}`
                for (let i = 1; i < pts.length; i++) {
                  const cpx = (pts[i].x + pts[i - 1].x) / 2
                  linePath += ` C ${cpx} ${pts[i - 1].y} ${cpx} ${pts[i].y} ${pts[i].x} ${pts[i].y}`
                }
                const areaPath = linePath + ` L ${pts[pts.length - 1].x} ${H} L ${pts[0].x} ${H} Z`
                return (
                  <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: H }}>
                    <defs>
                      <linearGradient id="gpa-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {[3.4, 3.6, 3.8, 4.0].map(g => (
                      <line key={g} x1={PX} y1={sy(g)} x2={W - PX} y2={sy(g)} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                    ))}
                    <path d={areaPath} fill="url(#gpa-grad)" />
                    <motion.path d={linePath} fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.9, ease: 'easeOut' }} />
                    {pts.map((pt, i) => (
                      <g key={i}>
                        <circle cx={pt.x} cy={pt.y} r={3.5} fill="#8b5cf6" />
                        <text x={pt.x} y={pt.y - 7} textAnchor="middle" fill="#a78bfa" fontSize="8.5" fontWeight="700">{GPA_TREND[i]}</text>
                        <text x={pt.x} y={H - 1} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="8">{GPA_LABELS[i]}</text>
                      </g>
                    ))}
                  </svg>
                )
              })()}
              <div className="flex justify-between mt-2">
                <span className="text-[10px] text-surface-500">Started at 3.4 this year</span>
                <span className="text-[10px] text-emerald-400 font-semibold">+0.4 GPA points ↑</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* GRADES */}
        {tab === 'grades' && (
          <motion.div key="grades" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }} className="space-y-4">
            <div className="glass-card overflow-hidden">
              <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-violet-400" />
                  Grades by Subject
                </h4>
                <span className="text-[10px] text-surface-500">vs. Class Average</span>
              </div>
              <div className="divide-y divide-white/[0.04]">
                {SUBJECT_GRADES.map((sg, i) => (
                  <motion.div
                    key={sg.subject}
                    className="px-5 py-4 hover:bg-white/[0.02] transition-colors"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: sg.color + '20' }}>
                          <BookOpen className="w-4 h-4" style={{ color: sg.color }} />
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-white">{sg.subject}</span>
                          <span className="text-[10px] text-surface-500 ml-2">Class avg: {sg.classAvg}%</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {(() => {
                          const n = sg.trend.length
                          const W = n * 5 - 1, H = 24
                          const pts = sg.trend.map((v, ti) => ({ x: ti * 5, y: H - (v / 100) * H }))
                          let d = `M ${pts[0].x} ${pts[0].y}`
                          for (let k = 1; k < pts.length; k++) {
                            const cpx = (pts[k].x + pts[k - 1].x) / 2
                            d += ` C ${cpx} ${pts[k - 1].y} ${cpx} ${pts[k].y} ${pts[k].x} ${pts[k].y}`
                          }
                          return (
                            <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="overflow-visible">
                              <motion.path d={d} fill="none" stroke={sg.color} strokeWidth={1.5} strokeLinecap="round"
                                opacity={0.8} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                                transition={{ duration: 0.8, ease: 'easeOut', delay: i * 0.05 }}
                              />
                              <circle cx={pts[n - 1].x} cy={pts[n - 1].y} r={2} fill={sg.color} />
                            </svg>
                          )
                        })()}
                        <span className="text-xs text-surface-400">{sg.percentage}%</span>
                        <span className="text-sm font-bold px-2.5 py-1 rounded-lg" style={{ color: sg.color, backgroundColor: sg.color + '18' }}>
                          {sg.letter}
                        </span>
                      </div>
                    </div>
                    {(() => {
                      const W = 300, bwClass = (sg.classAvg / 100) * W, bwStudent = (sg.percentage / 100) * W
                      return (
                        <svg viewBox={`0 0 ${W} 10`} className="w-full overflow-visible">
                          <defs>
                            <linearGradient id={`pp-sg-${i}`} x1="0" y1="0" x2="1" y2="0">
                              <stop offset="0%" stopColor={sg.color} stopOpacity={0.9} />
                              <stop offset="100%" stopColor={sg.color} stopOpacity={0.6} />
                            </linearGradient>
                          </defs>
                          <rect x={0} y={2} width={W} height={6} rx={3} fill="rgba(255,255,255,0.04)" />
                          <motion.rect x={0} y={2} height={6} rx={3} fill={sg.color} fillOpacity={0.25}
                            initial={{ width: 0 }} animate={{ width: bwClass }}
                            transition={{ delay: 0.3 + i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                          />
                          <motion.rect x={0} y={2} height={6} rx={3} fill={`url(#pp-sg-${i})`}
                            initial={{ width: 0 }} animate={{ width: bwStudent }}
                            transition={{ delay: 0.35 + i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                          />
                        </svg>
                      )
                    })()}
                    <div className="flex justify-between mt-1">
                      <span className="text-[9px] text-surface-600">Class avg {sg.classAvg}%</span>
                      <span className="text-[9px] font-semibold" style={{ color: sg.color }}>Emma: {sg.percentage}% (+{sg.percentage - sg.classAvg})</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ATTENDANCE */}
        {tab === 'attendance' && (
          <motion.div key="attendance" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }} className="space-y-4">
            <div className="glass-card overflow-hidden">
              <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-violet-400" />
                  {MONTH_NAMES[attendMonth]} {attendYear}
                </h4>
                <div className="flex items-center gap-2">
                  <button onClick={prevAttendMonth} className="p-1.5 rounded-lg hover:bg-white/[0.06] text-surface-400 hover:text-white transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button onClick={nextAttendMonth} className="p-1.5 rounded-lg hover:bg-white/[0.06] text-surface-400 hover:text-white transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                    <div key={d} className="text-center text-[10px] font-semibold text-surface-500 uppercase tracking-wider py-2">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {calendarRows.flat().map((day, i) => {
                    const status = day ? ATTENDANCE_DAYS[day] : undefined
                    const color = status ? ATTENDANCE_COLORS[status] : undefined
                    return (
                      <motion.div
                        key={i}
                        className={`aspect-square flex items-center justify-center rounded-lg text-xs font-medium ${day ? 'hover:bg-white/[0.04]' : ''}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.008 }}
                      >
                        {day && (
                          <div className="relative flex flex-col items-center justify-center w-full h-full">
                            <span className={`text-xs ${status ? 'text-white font-semibold' : 'text-surface-500'}`}>{day}</span>
                            {color && <div className="absolute bottom-0.5 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />}
                          </div>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              </div>
              <div className="px-5 pb-4 flex flex-wrap items-center gap-4">
                {Object.entries(ATTENDANCE_COLORS).map(([status, color]) => (
                  <div key={status} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-[10px] text-surface-400 capitalize">{status}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Days Present', value: '24', color: '#10b981', sub: '96% rate' },
                { label: 'Days Absent', value: '1', color: '#ef4444', sub: 'Unexcused' },
                { label: 'Days Late', value: '1', color: '#f59e0b', sub: 'Tardy' },
                { label: 'Days Excused', value: '1', color: '#22d3ee', sub: 'Documented' },
              ].map((s, i) => (
                <motion.div key={s.label} className="glass-card p-4 text-center" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.06 }}>
                  <div className="text-2xl font-black" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-xs text-surface-300 font-semibold mt-1">{s.label}</div>
                  <div className="text-[10px] text-surface-500">{s.sub}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* MESSAGES */}
        {tab === 'messages' && (
          <motion.div key="messages" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
            <div className="glass-card overflow-hidden">
              <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-violet-400" />
                  Messages
                </h4>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-surface-500">{messages.length} messages</span>
                  <button className="btn-secondary text-xs px-3 py-1.5" onClick={() => showToast('New message thread started')}>
                    <Plus className="w-3.5 h-3.5" /> New Thread
                  </button>
                </div>
              </div>
              <div className="p-5 space-y-4 max-h-[420px] overflow-y-auto">
                {messages.map((msg, i) => (
                  <motion.div
                    key={msg.id}
                    className={`flex gap-3 ${msg.isTeacher ? '' : 'flex-row-reverse'}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${msg.isTeacher ? 'bg-violet-500/20 text-violet-300' : 'bg-emerald-400/20 text-emerald-300'}`}>
                      {msg.avatar}
                    </div>
                    <div className={`flex-1 max-w-[78%] ${msg.isTeacher ? '' : 'text-right'}`}>
                      <div className={`flex items-center gap-2 mb-1 ${msg.isTeacher ? '' : 'justify-end'}`}>
                        <span className="text-xs font-semibold text-white">{msg.from}</span>
                        <span className="text-[10px] text-surface-500">{msg.role}</span>
                      </div>
                      <div className={`inline-block text-sm text-surface-200 px-4 py-3 rounded-2xl ${msg.isTeacher ? 'bg-white/[0.04] rounded-tl-sm' : 'bg-violet-500/10 rounded-tr-sm'}`}>
                        {msg.content}
                      </div>
                      <div className={`text-[10px] text-surface-500 mt-1 ${msg.isTeacher ? '' : 'text-right'}`}>{msg.time}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="px-5 pb-5 border-t border-white/[0.06] pt-4">
                <div className="flex items-center gap-2">
                  <input
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSendReply()}
                    type="text"
                    placeholder="Type a message as parent…"
                    className="flex-1 px-4 py-2.5 text-xs rounded-full bg-white/[0.04] border border-white/[0.08] text-surface-200 placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                  />
                  <motion.button
                    className="w-9 h-9 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 hover:bg-violet-500/30 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleSendReply}
                  >
                    <Send className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── SHARE MODAL ─── */}
      <AnimatePresence>
        {shareOpen && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShareOpen(false)} />
            <motion.div
              className="relative glass-card p-6 w-full max-w-sm"
              initial={{ scale: 0.93, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.93, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-bold text-white">Share Parent Portal</h3>
                <button onClick={() => setShareOpen(false)} className="p-1.5 rounded-lg hover:bg-white/[0.08] transition-colors">
                  <X className="w-4 h-4 text-surface-400" />
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] text-surface-500 block mb-1.5">Portal link for Emma Wilson</label>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-[11px] text-surface-400 truncate">
                      https://taleeko.ai/portal/ew92abc...
                    </div>
                    <motion.button
                      className="px-3 py-2 rounded-lg text-xs font-semibold transition-colors"
                      style={{ backgroundColor: copiedLink ? '#10b98120' : 'rgba(139,92,246,0.15)', color: copiedLink ? '#10b981' : '#a78bfa' }}
                      onClick={handleCopyLink}
                      whileTap={{ scale: 0.95 }}
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5" /> : <span>Copy</span>}
                    </motion.button>
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    { label: 'Send via Email', icon: Mail, desc: 'Email portal link to parent on file' },
                    { label: 'Send via Text', icon: Phone, desc: 'SMS the link to guardian phone' },
                    { label: 'School Portal', icon: ExternalLink, desc: 'Post to district parent portal' },
                  ].map(opt => (
                    <motion.button
                      key={opt.label}
                      className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.07] transition-colors text-left"
                      whileHover={{ x: 2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => { showToast(`Sent via: ${opt.label}`); setShareOpen(false) }}
                    >
                      <div className="w-7 h-7 rounded-lg bg-violet-500/15 flex items-center justify-center flex-shrink-0">
                        <opt.icon className="w-3.5 h-3.5 text-violet-400" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white">{opt.label}</p>
                        <p className="text-[10px] text-surface-500">{opt.desc}</p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── SCHEDULE MEETING MODAL ─── */}
      <AnimatePresence>
        {meetingOpen && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMeetingOpen(false)} />
            <motion.div
              className="relative glass-card p-6 w-full max-w-sm"
              initial={{ scale: 0.93, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.93, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-bold text-white">Schedule Parent Meeting</h3>
                <button onClick={() => setMeetingOpen(false)} className="p-1.5 rounded-lg hover:bg-white/[0.08] transition-colors">
                  <X className="w-4 h-4 text-surface-400" />
                </button>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Student', placeholder: 'Emma Wilson', type: 'text' },
                  { label: 'Parent / Guardian', placeholder: 'Sarah Wilson', type: 'text' },
                  { label: 'Preferred Date', placeholder: '', type: 'date' },
                  { label: 'Topic / Purpose', placeholder: 'e.g. Missing assignments review', type: 'text' },
                ].map(field => (
                  <div key={field.label}>
                    <label className="text-[10px] text-surface-500 block mb-1">{field.label}</label>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white placeholder-surface-600 focus:outline-none focus:border-violet-500/40"
                    />
                  </div>
                ))}
                <div>
                  <label className="text-[10px] text-surface-500 block mb-1">Meeting Format</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['In-Person', 'Video Call', 'Phone'].map(format => (
                      <button key={format} className="py-2 rounded-lg text-xs font-medium bg-white/[0.04] hover:bg-violet-500/15 hover:text-violet-400 text-surface-400 transition-colors border border-white/[0.06]">
                        {format}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <motion.button
                className="w-full btn-gradient text-xs mt-5"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => { showToast('Meeting request sent to parent!'); setMeetingOpen(false) }}
              >
                <Check className="w-3.5 h-3.5" /> Send Meeting Request
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
