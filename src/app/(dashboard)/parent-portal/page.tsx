'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, Eye, BookOpen, Calendar, MessageSquare, Star, TrendingUp,
  Award, Send, Link, Settings, Info, BarChart2, Check, Clock,
  FileText, ChevronLeft, ChevronRight, Share2
} from 'lucide-react'
import { FadeUp, FadeInWhenVisible, StaggerList, StaggerItem, fadeUp } from '@/components/ui/motion'

type Tab = 'overview' | 'grades' | 'attendance' | 'messages'

const studentInfo = {
  name: 'Emma Wilson',
  grade: '10th Grade',
  class: 'AP Biology',
  avatar: 'EW',
  gpa: '3.8',
  attendanceRate: '96%',
  missingAssignments: 2,
  upcomingTests: 3,
}

const recentGrades = [
  { assignment: 'Lab Report: Photosynthesis', subject: 'AP Biology', score: 92, maxScore: 100, date: 'Jul 25', grade: 'A' },
  { assignment: 'Essay: The Great Gatsby', subject: '10th English', score: 88, maxScore: 100, date: 'Jul 22', grade: 'B+' },
  { assignment: 'Ch. 5 Quiz', subject: 'Algebra II', score: 45, maxScore: 50, date: 'Jul 20', grade: 'A' },
  { assignment: 'Midterm Exam', subject: 'AP Biology', score: 178, maxScore: 200, date: 'Jul 18', grade: 'B+' },
  { assignment: 'Group Presentation', subject: '10th English', score: 95, maxScore: 100, date: 'Jul 15', grade: 'A' },
]

const subjectGrades = [
  { subject: 'AP Biology', letter: 'A-', percentage: 91, color: '#86b06a' },
  { subject: '10th English', letter: 'B+', percentage: 87, color: '#dd9a33' },
  { subject: 'Algebra II', letter: 'A', percentage: 94, color: '#829c6e' },
  { subject: 'World History', letter: 'B', percentage: 83, color: '#e6b34d' },
  { subject: 'PE', letter: 'A', percentage: 97, color: '#b0623f' },
  { subject: 'Art Studio', letter: 'A-', percentage: 92, color: '#d97b63' },
]

const attendanceDays: Record<number, 'present' | 'absent' | 'late' | 'excused'> = {
  1: 'present', 2: 'present', 3: 'present', 4: 'late', 5: 'present',
  7: 'present', 8: 'present', 9: 'absent', 10: 'present', 11: 'present', 12: 'present',
  14: 'present', 15: 'present', 16: 'present', 17: 'excused', 18: 'present', 19: 'present',
  21: 'present', 22: 'present', 23: 'present', 24: 'present', 25: 'present', 26: 'present',
  28: 'present', 29: 'present', 30: 'present', 31: 'present',
}

const attendanceColors: Record<string, string> = {
  present: '#86b06a',
  absent: '#c25a44',
  late: '#e6b34d',
  excused: '#829c6e',
}

const messages = [
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

function getGradeColor(grade: string): string {
  if (grade.startsWith('A')) return '#86b06a'
  if (grade.startsWith('B')) return '#829c6e'
  if (grade.startsWith('C')) return '#e6b34d'
  if (grade.startsWith('D')) return '#c67954'
  return '#c25a44'
}

export default function ParentPortalPage() {
  const [tab, setTab] = useState<Tab>('overview')

  const daysInMonth = 31
  const startDayOfWeek = 1

  const calendarRows: (number | null)[][] = []
  let currentRow: (number | null)[] = Array(startDayOfWeek).fill(null)
  for (let d = 1; d <= daysInMonth; d++) {
    currentRow.push(d)
    if (currentRow.length === 7) {
      calendarRows.push(currentRow)
      currentRow = []
    }
  }
  if (currentRow.length > 0) {
    while (currentRow.length < 7) currentRow.push(null)
    calendarRows.push(currentRow)
  }

  return (
    <div className="space-y-6">
      <FadeUp>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #b0623f, #914d30)' }}
              whileHover={{ rotate: 8, scale: 1.08 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <Users className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h2 className="text-xl font-black text-white">Parent Portal</h2>
              <p className="text-xs text-surface-400">Preview what parents see</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-secondary text-xs px-3 py-1.5">
              <Settings className="w-3.5 h-3.5" /> Customize View
            </button>
            <motion.button
              className="btn-primary text-xs"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Share2 className="w-3.5 h-3.5" />
              Share Link
            </motion.button>
          </div>
        </div>
      </FadeUp>

      <FadeUp delay={0.05}>
        <div className="glass-card p-4 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-electric-400/15 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Eye className="w-4 h-4 text-electric-400" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Preview Mode</h4>
            <p className="text-xs text-surface-400 mt-0.5">
              This is a preview of what parents and guardians will see when they access the portal. Customize the visible sections and share the link with families.
            </p>
          </div>
        </div>
      </FadeUp>

      <FadeUp delay={0.08}>
        <div className="flex items-center gap-1 bg-white/[0.06] rounded-full p-1 w-fit">
          {([
            { key: 'overview' as const, label: 'Student Overview', icon: Star },
            { key: 'grades' as const, label: 'Grades', icon: BarChart2 },
            { key: 'attendance' as const, label: 'Attendance', icon: Calendar },
            { key: 'messages' as const, label: 'Messages', icon: MessageSquare },
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
      </FadeUp>

      <AnimatePresence mode="wait">
        {tab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            <div className="glass-card p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-accent-500/20 flex items-center justify-center text-xl font-black text-accent-300">
                  {studentInfo.avatar}
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">{studentInfo.name}</h3>
                  <p className="text-sm text-surface-400">{studentInfo.grade} · {studentInfo.class}</p>
                </div>
              </div>
            </div>

            <StaggerList className="grid grid-cols-2 lg:grid-cols-4 gap-4" delay={0.08}>
              {[
                { label: 'GPA', value: studentInfo.gpa, icon: Award, color: 'bg-success-400/15 text-success-400', delta: 'Cumulative' },
                { label: 'Attendance', value: studentInfo.attendanceRate, icon: Calendar, color: 'bg-accent-500/15 text-accent-400', delta: 'This semester' },
                { label: 'Missing Work', value: studentInfo.missingAssignments.toString(), icon: FileText, color: 'bg-warning-400/15 text-warning-400', delta: 'Due this week' },
                { label: 'Upcoming Tests', value: studentInfo.upcomingTests.toString(), icon: BookOpen, color: 'bg-electric-400/15 text-electric-400', delta: 'Next 2 weeks' },
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

            <div className="glass-card overflow-hidden">
              <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-accent-400" />
                  Recent Grades
                </h4>
              </div>
              <div className="divide-y divide-white/[0.04]">
                {recentGrades.map((g, i) => (
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
                        style={{
                          color: getGradeColor(g.grade),
                          backgroundColor: getGradeColor(g.grade) + '18',
                        }}
                      >
                        {g.grade}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {tab === 'grades' && (
          <motion.div
            key="grades"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            <div className="glass-card overflow-hidden">
              <div className="px-5 py-4 border-b border-white/[0.06]">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-accent-400" />
                  Grades by Subject
                </h4>
              </div>
              <div className="divide-y divide-white/[0.04]">
                {subjectGrades.map((sg, i) => (
                  <motion.div
                    key={sg.subject}
                    className="px-5 py-4 hover:bg-white/[0.02] transition-colors"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: sg.color + '20' }}
                        >
                          <BookOpen className="w-4 h-4" style={{ color: sg.color }} />
                        </div>
                        <span className="text-sm font-semibold text-white">{sg.subject}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-surface-400">{sg.percentage}%</span>
                        <span
                          className="text-sm font-bold px-2.5 py-1 rounded-lg"
                          style={{
                            color: sg.color,
                            backgroundColor: sg.color + '18',
                          }}
                        >
                          {sg.letter}
                        </span>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-white/[0.04] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: sg.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${sg.percentage}%` }}
                        transition={{ delay: 0.3 + i * 0.08, duration: 0.6 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {tab === 'attendance' && (
          <motion.div
            key="attendance"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            <div className="glass-card overflow-hidden">
              <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-accent-400" />
                  July 2026
                </h4>
                <div className="flex items-center gap-2">
                  <button className="p-1.5 rounded-lg hover:bg-white/[0.06] text-surface-400 hover:text-white transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 rounded-lg hover:bg-white/[0.06] text-surface-400 hover:text-white transition-colors">
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
                    const status = day ? attendanceDays[day] : undefined
                    const color = status ? attendanceColors[status] : undefined
                    return (
                      <motion.div
                        key={i}
                        className={`aspect-square flex items-center justify-center rounded-lg text-xs font-medium transition-colors ${
                          day ? 'hover:bg-white/[0.04]' : ''
                        }`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.01 }}
                      >
                        {day && (
                          <div className="relative flex items-center justify-center w-full h-full">
                            <span className={`text-xs ${status ? 'text-white' : 'text-surface-500'}`}>{day}</span>
                            {color && (
                              <div
                                className="absolute bottom-1 w-1.5 h-1.5 rounded-full"
                                style={{ backgroundColor: color }}
                              />
                            )}
                          </div>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              </div>
              <div className="px-5 pb-4">
                <div className="flex flex-wrap items-center gap-4">
                  {Object.entries(attendanceColors).map(([status, color]) => (
                    <div key={status} className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                      <span className="text-[10px] text-surface-400 capitalize">{status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Days Present', value: '24', color: '#86b06a' },
                { label: 'Days Absent', value: '1', color: '#c25a44' },
                { label: 'Days Late', value: '1', color: '#e6b34d' },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  className="glass-card p-4 text-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.06 }}
                >
                  <div className="text-xl font-black" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-xs text-surface-400 mt-1">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {tab === 'messages' && (
          <motion.div
            key="messages"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            <div className="glass-card overflow-hidden">
              <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-accent-400" />
                  Messages
                </h4>
                <span className="text-xs text-surface-500">3 messages</span>
              </div>
              <div className="p-5 space-y-4">
                {messages.map((msg, i) => (
                  <motion.div
                    key={msg.id}
                    className={`flex gap-3 ${msg.isTeacher ? '' : 'flex-row-reverse'}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                        msg.isTeacher
                          ? 'bg-accent-500/20 text-accent-300'
                          : 'bg-success-400/20 text-success-300'
                      }`}
                    >
                      {msg.avatar}
                    </div>
                    <div className={`flex-1 max-w-[80%] ${msg.isTeacher ? '' : 'text-right'}`}>
                      <div className={`flex items-center gap-2 mb-1 ${msg.isTeacher ? '' : 'justify-end'}`}>
                        <span className="text-xs font-semibold text-white">{msg.from}</span>
                        <span className="text-[10px] text-surface-500">{msg.role}</span>
                      </div>
                      <div
                        className={`inline-block text-sm text-surface-200 px-4 py-3 rounded-2xl ${
                          msg.isTeacher
                            ? 'bg-white/[0.04] rounded-tl-sm'
                            : 'bg-accent-500/10 rounded-tr-sm'
                        }`}
                      >
                        {msg.content}
                      </div>
                      <div className={`text-[10px] text-surface-500 mt-1 ${msg.isTeacher ? '' : 'text-right'}`}>
                        {msg.time}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="px-5 pb-4">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2.5 text-xs rounded-full bg-white/[0.04] border border-white/[0.08] text-surface-200 placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-accent-500/40"
                  />
                  <motion.button
                    className="w-9 h-9 rounded-full bg-accent-500/20 flex items-center justify-center text-accent-400 hover:bg-accent-500/30 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Send className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <FadeInWhenVisible delay={0.15}>
        <div className="flex items-center gap-3 justify-end">
          <motion.button
            className="btn-primary text-xs"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Share2 className="w-3.5 h-3.5" />
            Share Link
          </motion.button>
          <button className="btn-secondary text-xs px-3 py-1.5">
            <Settings className="w-3.5 h-3.5" /> Customize View
          </button>
        </div>
      </FadeInWhenVisible>
    </div>
  )
}
