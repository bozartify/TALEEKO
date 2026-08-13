'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User, BookOpen, Award, Calendar, TrendingUp, Star, Clock,
  FileText, MessageSquare, Plus, ChevronRight, BarChart2,
  Target, Check, Sparkles, ArrowLeft, Edit3, CheckCircle
} from 'lucide-react'
import { FadeUp, FadeInWhenVisible, StaggerList, StaggerItem, fadeUp } from '@/components/ui/motion'

const student = {
  id: 'stu_001',
  name: 'Emma Rodriguez',
  grade: '7th',
  className: 'AP Biology',
  period: '1st Period',
  email: 'emma.rodriguez@school.edu',
  avatar: null,
  gpa: 3.87,
  attendance: 96,
  assignmentsCompleted: 42,
  streakDays: 15,
  enrolledAt: 'Sep 2025',
}

const recentActivity = [
  { id: 1, text: 'Scored 95% on Cell Division Quiz', date: '2 hours ago', color: 'bg-success-400', icon: Check },
  { id: 2, text: 'Submitted Photosynthesis Lab Report', date: '1 day ago', color: 'bg-accent-500', icon: FileText },
  { id: 3, text: 'Earned "Top Performer" badge', date: '2 days ago', color: 'bg-warning-400', icon: Award },
  { id: 4, text: 'Completed DNA Replication Reading', date: '3 days ago', color: 'bg-electric-400', icon: BookOpen },
  { id: 5, text: 'Participated in group discussion', date: '4 days ago', color: 'bg-cyan-400', icon: MessageSquare },
]

const skills = [
  { name: 'Critical Thinking', value: 88, color: 'bg-accent-500' },
  { name: 'Communication', value: 76, color: 'bg-electric-400' },
  { name: 'Collaboration', value: 92, color: 'bg-success-400' },
  { name: 'Creativity', value: 81, color: 'bg-warning-400' },
  { name: 'Problem Solving', value: 85, color: 'bg-cyan-400' },
]

const grades = [
  { assignment: 'Cell Division Quiz', score: 95, letter: 'A', date: 'Jul 25, 2026', type: 'Quiz' },
  { assignment: 'Photosynthesis Lab Report', score: 88, letter: 'B+', date: 'Jul 22, 2026', type: 'Lab' },
  { assignment: 'Genetics Homework Ch. 5', score: 92, letter: 'A-', date: 'Jul 18, 2026', type: 'Homework' },
  { assignment: 'Ecosystem Essay', score: 97, letter: 'A+', date: 'Jul 14, 2026', type: 'Essay' },
  { assignment: 'Mitosis Diagram', score: 78, letter: 'C+', date: 'Jul 10, 2026', type: 'Project' },
  { assignment: 'Biology Midterm', score: 84, letter: 'B', date: 'Jul 5, 2026', type: 'Exam' },
  { assignment: 'Plant Cell Model', score: 91, letter: 'A-', date: 'Jun 30, 2026', type: 'Project' },
  { assignment: 'Ecology Field Notes', score: 73, letter: 'C', date: 'Jun 25, 2026', type: 'Lab' },
]

const portfolioItems = [
  { id: 1, title: 'Ecosystem Diorama', type: 'Project', date: 'Jul 14, 2026', feedback: 'Excellent representation of biodiversity. The food web connections were particularly well illustrated.' },
  { id: 2, title: 'Persuasive Essay: GMOs', type: 'Essay', date: 'Jul 8, 2026', feedback: 'Strong argument structure with well-cited sources. Consider expanding the counterargument section.' },
  { id: 3, title: 'Cell Division Presentation', type: 'Presentation', date: 'Jun 28, 2026', feedback: 'Clear visuals and confident delivery. The mitosis vs meiosis comparison was very effective.' },
  { id: 4, title: 'Water Quality Research', type: 'Project', date: 'Jun 20, 2026', feedback: 'Thorough data collection and analysis. The graphs effectively communicate your findings.' },
  { id: 5, title: 'Genetics Case Study', type: 'Essay', date: 'Jun 12, 2026', feedback: 'Thoughtful analysis of inheritance patterns. The Punnett square work was accurate and well-explained.' },
  { id: 6, title: 'Lab Safety Protocol Video', type: 'Presentation', date: 'Jun 5, 2026', feedback: 'Creative approach to demonstrating safety procedures. Great teamwork and clear narration.' },
]

const teacherNotes = [
  { id: 1, date: 'Jul 26, 2026', content: 'Emma showed excellent leadership during the group lab activity. She helped two struggling students understand the microscope procedure.' },
  { id: 2, date: 'Jul 19, 2026', content: 'Meeting with parent regarding advanced placement options. Emma is a strong candidate for AP Biology next year.' },
  { id: 3, date: 'Jul 12, 2026', content: 'Noticed Emma seems less engaged this week. Will check in privately to see if everything is okay.' },
  { id: 4, date: 'Jul 1, 2026', content: 'Outstanding performance on the midterm. Emma scored the highest in the class and demonstrated deep conceptual understanding.' },
]

type Tab = 'overview' | 'grades' | 'portfolio' | 'notes'

function getGradeColor(letter: string) {
  if (letter.startsWith('A')) return 'bg-success-400/15 text-success-400'
  if (letter.startsWith('B')) return 'bg-cyan-400/15 text-cyan-400'
  if (letter.startsWith('C')) return 'bg-warning-400/15 text-warning-400'
  if (letter.startsWith('D')) return 'bg-orange-400/15 text-orange-400'
  return 'bg-red-400/15 text-red-400'
}

function getTypeBadgeColor(type: string) {
  switch (type) {
    case 'Project': return 'bg-accent-500/15 text-accent-400'
    case 'Essay': return 'bg-electric-400/15 text-electric-400'
    case 'Presentation': return 'bg-warning-400/15 text-warning-400'
    default: return 'bg-surface-400/15 text-surface-400'
  }
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('')
}

export default function StudentDetailPage() {
  const [tab, setTab] = useState<Tab>('overview')
  const [noteText, setNoteText] = useState('')
  const [toastMsg, setToastMsg] = useState('')
  function showToast(msg: string) { setToastMsg(msg); setTimeout(() => setToastMsg(''), 2500) }

  return (
    <div className="space-y-6">
      {/* Toast */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: -16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="fixed top-5 right-5 z-[100] flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border border-white/[0.08]"
            style={{ background: 'linear-gradient(135deg,#0a0f1a,#111827)' }}
          >
            <CheckCircle className="w-4 h-4 text-accent-400 flex-shrink-0" />
            <span className="text-sm font-medium text-white">{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <FadeUp>
        <Link
          href="/classroom"
          className="inline-flex items-center gap-1.5 text-sm text-surface-400 hover:text-accent-400 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Classroom
        </Link>
      </FadeUp>

      <FadeUp delay={0.05}>
        <div className="hero-mesh rounded-3xl p-6 border border-white/[0.06]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <motion.div
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-500 to-electric-400 flex items-center justify-center text-white text-xl font-black flex-shrink-0"
              whileHover={{ rotate: 4, scale: 1.06 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              {getInitials(student.name)}
            </motion.div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-2xl font-black text-white">{student.name}</h1>
                <span className="text-xs font-bold bg-accent-500/20 text-accent-300 px-2.5 py-0.5 rounded-full">Student</span>
              </div>
              <div className="flex flex-wrap items-center gap-3 mt-1.5">
                <span className="text-sm text-surface-400">{student.grade} Grade</span>
                <span className="w-1 h-1 rounded-full bg-surface-600" />
                <span className="text-sm text-surface-400">{student.className}</span>
                <span className="w-1 h-1 rounded-full bg-surface-600" />
                <span className="text-sm text-surface-400">{student.period}</span>
                <span className="w-1 h-1 rounded-full bg-surface-600" />
                <span className="text-sm text-surface-500">Since {student.enrolledAt}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => showToast('Message sent!')} className="btn-secondary text-xs px-3 py-1.5">
                <MessageSquare className="w-3.5 h-3.5" /> Message
              </button>
              <motion.button
                className="btn-primary text-xs"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => showToast('Profile updated!')}
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit Profile
              </motion.button>
            </div>
          </div>
          <div className="border-t border-white/[0.06] pt-4 mt-4 flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-surface-400">GPA</span>
              <span className="text-xs font-bold text-success-400">{student.gpa}</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-surface-400">Attendance</span>
              <span className="text-xs font-bold text-accent-300">{student.attendance}%</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-surface-400">Completed</span>
              <span className="text-xs font-bold text-white">{student.assignmentsCompleted}</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-surface-400">Streak</span>
              <span className="text-xs font-bold text-warning-400">{student.streakDays} days</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-surface-400">Email</span>
              <span className="text-xs font-bold text-electric-400 truncate max-w-[140px]">{student.email}</span>
            </div>
          </div>
        </div>
      </FadeUp>

      <FadeUp delay={0.1}>
        <div className="flex items-center gap-1 bg-white/[0.06] rounded-full p-1 w-fit">
          {([
            { key: 'overview' as const, label: 'Overview', icon: BarChart2 },
            { key: 'grades' as const, label: 'Grades', icon: Award },
            { key: 'portfolio' as const, label: 'Portfolio', icon: FileText },
            { key: 'notes' as const, label: 'Notes', icon: MessageSquare },
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
            <StaggerList className="grid grid-cols-2 lg:grid-cols-4 gap-4" delay={0.08}>
              {[
                { label: 'Overall GPA', value: student.gpa.toFixed(2), icon: TrendingUp, color: 'bg-accent-500/15 text-accent-400' },
                { label: 'Attendance', value: `${student.attendance}%`, icon: Calendar, color: 'bg-success-400/15 text-success-400' },
                { label: 'Assignments Done', value: student.assignmentsCompleted.toString(), icon: Check, color: 'bg-electric-400/15 text-electric-400' },
                { label: 'Streak Days', value: `${student.streakDays}d`, icon: Star, color: 'bg-warning-400/15 text-warning-400' },
              ].map(s => (
                <StaggerItem key={s.label} variants={fadeUp}>
                  <motion.div
                    className="stat-card h-full"
                    whileHover={{ y: -3, boxShadow: '0 8px 30px rgba(139,92,246,0.12)', transition: { duration: 0.2 } }}
                  >
                    <div className={`icon-bubble ${s.color} mb-3`}><s.icon className="w-5 h-5" /></div>
                    <div className="text-2xl font-black text-white">{s.value}</div>
                    <div className="text-xs font-semibold text-surface-200 mt-0.5">{s.label}</div>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerList>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FadeInWhenVisible>
                <div className="glass-card p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-4 h-4 text-accent-400" />
                    <h3 className="text-sm font-bold text-white">Recent Activity</h3>
                  </div>
                  <div className="space-y-0">
                    {recentActivity.map((activity, i) => (
                      <motion.div
                        key={activity.id}
                        className="flex items-start gap-3 py-3 border-b border-white/[0.06] last:border-0"
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + i * 0.06 }}
                      >
                        <div className="flex flex-col items-center mt-0.5">
                          <div className={`w-8 h-8 rounded-lg ${activity.color}/15 flex items-center justify-center`}>
                            <activity.icon className={`w-4 h-4 ${activity.color.replace('bg-', 'text-')}`} />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-surface-200">{activity.text}</p>
                          <p className="text-xs text-surface-500 mt-0.5">{activity.date}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </FadeInWhenVisible>

              <FadeInWhenVisible delay={0.1}>
                <div className="glass-card p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="w-4 h-4 text-electric-400" />
                    <h3 className="text-sm font-bold text-white">Skills Progress</h3>
                  </div>
                  <div className="space-y-4">
                    {skills.map((skill, i) => (
                      <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 + i * 0.07 }}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-semibold text-surface-200">{skill.name}</span>
                          <span className="text-xs font-bold text-white">{skill.value}%</span>
                        </div>
                        <div className="w-full h-2 bg-white/[0.06] rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${skill.color}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${skill.value}%` }}
                            transition={{ delay: 0.3 + i * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </FadeInWhenVisible>
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
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      <th className="text-left text-xs font-semibold text-surface-400 px-5 py-3">Assignment</th>
                      <th className="text-left text-xs font-semibold text-surface-400 px-5 py-3">Type</th>
                      <th className="text-left text-xs font-semibold text-surface-400 px-5 py-3">Score</th>
                      <th className="text-left text-xs font-semibold text-surface-400 px-5 py-3">Grade</th>
                      <th className="text-left text-xs font-semibold text-surface-400 px-5 py-3">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grades.map((g, i) => (
                      <motion.tr
                        key={g.assignment}
                        className="hover:bg-white/[0.04] transition-colors border-b border-white/[0.06] last:border-0"
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04, duration: 0.3 }}
                      >
                        <td className="px-5 py-3">
                          <span className="text-sm font-semibold text-white">{g.assignment}</span>
                        </td>
                        <td className="px-5 py-3">
                          <span className="text-xs text-surface-400">{g.type}</span>
                        </td>
                        <td className="px-5 py-3">
                          <span className={`text-sm font-bold ${
                            g.score >= 90 ? 'text-success-400' :
                            g.score >= 80 ? 'text-cyan-400' :
                            g.score >= 70 ? 'text-warning-400' : 'text-orange-400'
                          }`}>{g.score}%</span>
                        </td>
                        <td className="px-5 py-3">
                          <span className={`badge ${getGradeColor(g.letter)}`}>{g.letter}</span>
                        </td>
                        <td className="px-5 py-3">
                          <span className="text-xs text-surface-500">{g.date}</span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {tab === 'portfolio' && (
          <motion.div
            key="portfolio"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {portfolioItems.map((item, i) => (
                <motion.div
                  key={item.id}
                  className="glass-card p-5 cursor-pointer group"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -3, transition: { duration: 0.18 } }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-sm font-bold text-white group-hover:text-accent-400 transition-colors">{item.title}</h4>
                    <ChevronRight className="w-4 h-4 text-surface-500 group-hover:text-accent-400 transition-colors" />
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`badge ${getTypeBadgeColor(item.type)}`}>{item.type}</span>
                    <span className="text-xs text-surface-500">{item.date}</span>
                  </div>
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                    <Sparkles className="w-3.5 h-3.5 text-accent-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-surface-400 leading-relaxed line-clamp-3">{item.feedback}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {tab === 'notes' && (
          <motion.div
            key="notes"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <Plus className="w-4 h-4 text-accent-400" />
                <h3 className="text-sm font-bold text-white">Add Note</h3>
              </div>
              <textarea
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
                placeholder="Write a note about this student..."
                rows={3}
                className="w-full px-4 py-3 text-sm rounded-xl border border-white/[0.06] bg-white/[0.03] text-surface-200 placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-accent-500 resize-none transition-all"
              />
              <div className="flex justify-end mt-3">
                <motion.button
                  className="btn-primary text-xs"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Plus className="w-3.5 h-3.5" /> Save Note
                </motion.button>
              </div>
            </div>

            <div className="space-y-3">
              {teacherNotes.map((note, i) => (
                <motion.div
                  key={note.id}
                  className="glass-card p-5"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  whileHover={{ x: 3 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-3.5 h-3.5 text-surface-500" />
                    <span className="text-xs font-semibold text-surface-400">{note.date}</span>
                  </div>
                  <p className="text-sm text-surface-200 leading-relaxed">{note.content}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
