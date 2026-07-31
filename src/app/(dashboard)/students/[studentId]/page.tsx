'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FadeUp, StaggerList, StaggerItem } from '@/components/ui/motion'
import Link from 'next/link'
import {
  ChevronLeft, Mail, Phone, Users, BookOpen, BarChart2, Award,
  AlertTriangle, TrendingUp, TrendingDown, Minus, Flame, Star,
  Check, X, Clock, Edit, Brain, Shield, Globe, Heart, Calendar,
  FileText, MessageSquare, Plus, Download, Sparkles, Target,
  CheckCircle, XCircle
} from 'lucide-react'

interface Assignment {
  name: string; type: string; score: number | null; max: number
  submitted: boolean; date: string; feedback: string
}

interface Note {
  date: string; author: string; text: string; type: 'academic' | 'behavior' | 'parent' | 'intervention'
}

interface Intervention {
  type: string; startDate: string; status: 'active' | 'completed'; progress: number; goal: string
}

const student = {
  id: '1',
  name: 'Emma Wilson',
  avatar: 'EW',
  grade: '10th',
  dob: 'March 14, 2009',
  color: '#8b5cf6',
  email: 'emma.w@student.edu',
  parentEmail: 'parent.wilson@email.com',
  parentPhone: '(555) 247-8910',
  classes: [
    { name: 'AP Biology', period: 'Period 2', teacher: 'Ms. Johnson', avg: 94, grade: 'A', color: '#8b5cf6' },
    { name: '10th English', period: 'Period 4', teacher: 'Mr. Anderson', avg: 91, grade: 'A-', color: '#f43f5e' },
    { name: 'Algebra II', period: 'Period 6', teacher: 'Ms. Chen', avg: 89, grade: 'B+', color: '#14b8a6' },
    { name: 'World History', period: 'Period 1', teacher: 'Mr. Roberts', avg: 87, grade: 'B+', color: '#f97316' },
  ],
  gpa: 3.92,
  attendance: 97,
  streak: 15,
  awards: 3,
  trend: 'up' as const,
  status: 'excelling' as const,
  lastActive: '2 hours ago',
  iep: false,
  ell: false,
  section504: false,
  gifted: true,
  counselor: 'Dr. Martinez',
  locker: 'A-247',
  photo: null,
}

const assignments: Assignment[] = [
  { name: 'Lab Report: Photosynthesis', type: 'Lab', score: 71, max: 75, submitted: true, date: 'Jul 28', feedback: 'Excellent data analysis! Hypothesis section was precise and conclusions well-supported.' },
  { name: 'Ch. 5 Quiz: Cell Division',  type: 'Quiz', score: 48, max: 50, submitted: true, date: 'Jul 22', feedback: 'Strong performance. Review cytokinesis for the unit test.' },
  { name: 'Essay: The Great Gatsby',     type: 'Essay', score: 92, max: 100, submitted: true, date: 'Jul 18', feedback: 'Sophisticated analysis of Fitzgerald\'s symbolism. Compelling thesis.' },
  { name: 'Midterm Exam',               type: 'Exam',  score: 178, max: 200, submitted: true, date: 'Jul 10', feedback: 'Top score in class. Strong across all domains.' },
  { name: 'Science Fair Proposal',      type: 'Project', score: null, max: 50, submitted: false, date: 'Aug 15', feedback: '' },
  { name: 'Algebra Ch. 6 Problem Set',  type: 'HW', score: 19, max: 20, submitted: true, date: 'Jul 25', feedback: '' },
]

const notes: Note[] = [
  { date: 'Jul 29', author: 'Ms. Johnson', text: 'Emma showed exceptional insight during today\'s genetics discussion. Recommended for Science Olympiad team. Will contact parent to discuss.', type: 'academic' },
  { date: 'Jul 20', author: 'Ms. Johnson', text: 'Spoke with Ms. Wilson (parent) regarding Science Olympiad opportunity. Parent is supportive and excited. Emma will trial the team next week.', type: 'parent' },
  { date: 'Jul 15', author: 'Dr. Martinez (Counselor)', text: 'Emma mentioned feeling some stress about AP load. Reviewed strategies and discussed optional study hall. Monitoring closely.', type: 'academic' },
  { date: 'Jun 30', author: 'Mr. Anderson', text: 'Emma\'s writing is consistently above grade level. She would benefit from independent reading enrichment. Suggested she join the Literary Magazine.', type: 'academic' },
]

const monthlyScores = [
  { month: 'Mar', avg: 87 }, { month: 'Apr', avg: 89 }, { month: 'May', avg: 90 },
  { month: 'Jun', avg: 91 }, { month: 'Jul', avg: 92 }, { month: 'Aug', avg: 94 },
]

const attendanceByMonth = [
  { month: 'Mar', present: 20, total: 21 },
  { month: 'Apr', present: 19, total: 20 },
  { month: 'May', present: 21, total: 22 },
  { month: 'Jun', present: 17, total: 18 },
  { month: 'Jul', present: 20, total: 20 },
]

const noteTypeConfig = {
  academic:     { label: 'Academic',     bg: 'bg-accent-500/10',  text: 'text-accent-400' },
  behavior:     { label: 'Behavior',     bg: 'bg-warning-500/10', text: 'text-warning-400' },
  parent:       { label: 'Parent',       bg: 'bg-success-500/10', text: 'text-success-400' },
  intervention: { label: 'Intervention', bg: 'bg-danger-500/10',  text: 'text-danger-400' },
}

type ActiveTab = 'overview' | 'assignments' | 'notes' | 'contact'

const maxScore = Math.max(...monthlyScores.map(m => m.avg))
const minScore = 75

export default function StudentProfilePage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview')
  const [addingNote, setAddingNote] = useState(false)
  const [newNote, setNewNote] = useState('')

  const completedAssignments = assignments.filter(a => a.submitted)
  const avgPct = Math.round(
    completedAssignments.filter(a => a.score !== null).reduce((sum, a) => sum + (a.score! / a.max) * 100, 0) /
    completedAssignments.filter(a => a.score !== null).length
  )

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      {/* Back + Header */}
      <FadeUp>
        <div className="flex items-start gap-4">
          <Link href="/students" className="flex items-center gap-1.5 text-xs text-surface-400 hover:text-surface-200 transition-colors mt-1">
            <ChevronLeft className="w-4 h-4" />
            All Students
          </Link>
        </div>

        <div className="flex items-start gap-5 mt-4 flex-wrap">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold ring-4 ring-white/[0.06]"
              style={{ background: `linear-gradient(135deg, ${student.color}, ${student.color}99)` }}
            >
              {student.avatar}
            </div>
            <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-success-500 ring-2 ring-surface-900 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap mb-1">
              <h1 className="text-2xl font-bold text-surface-100">{student.name}</h1>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-accent-500/15 text-accent-300">Excelling</span>
              {student.gifted && <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-warning-500/10 text-warning-400">Gifted</span>}
            </div>
            <div className="flex items-center gap-3 text-xs text-surface-400 flex-wrap">
              <span>{student.grade} Grade</span>
              <span>·</span>
              <span>GPA: <span className="text-white font-semibold">{student.gpa}</span></span>
              <span>·</span>
              <span>{student.classes.length} classes</span>
              <span>·</span>
              <span>Counselor: {student.counselor}</span>
              <span>·</span>
              <span>Locker {student.locker}</span>
            </div>
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <a href={`mailto:${student.email}`} className="btn-secondary text-xs px-3 py-1.5">
                <Mail className="w-3.5 h-3.5" /> Email Student
              </a>
              <a href={`mailto:${student.parentEmail}`} className="btn-secondary text-xs px-3 py-1.5">
                <Users className="w-3.5 h-3.5" /> Email Parent
              </a>
              <button className="btn-gradient text-xs px-3 py-1.5">
                <Sparkles className="w-3.5 h-3.5" /> AI Profile Summary
              </button>
              <button className="btn-secondary text-xs px-3 py-1.5">
                <Download className="w-3.5 h-3.5" /> Export Report
              </button>
            </div>
          </div>
        </div>
      </FadeUp>

      {/* Stat Cards */}
      <FadeUp delay={0.06}>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: 'Overall Avg', value: `${avgPct}%`, icon: BarChart2, color: '#6366f1', sub: 'all classes' },
            { label: 'Attendance',  value: `${student.attendance}%`, icon: CheckCircle, color: '#10b981', sub: '97 of 100 days' },
            { label: 'GPA',        value: student.gpa, icon: Star, color: '#f59e0b', sub: '10th grade' },
            { label: 'Streak',     value: `${student.streak}d`, icon: Flame, color: '#f97316', sub: 'consecutive days' },
            { label: 'Awards',     value: student.awards, icon: Award, color: '#ec4899', sub: 'this semester' },
          ].map(s => (
            <div key={s.label} className="glass-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <s.icon className="w-4 h-4" style={{ color: s.color }} />
                <span className="text-[11px] text-surface-500">{s.label}</span>
              </div>
              <div className="text-xl font-bold text-white">{s.value}</div>
              <div className="text-[11px] text-surface-600 mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>
      </FadeUp>

      {/* Tabs */}
      <FadeUp delay={0.08}>
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06] w-fit">
          {(['overview', 'assignments', 'notes', 'contact'] as ActiveTab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${activeTab === tab ? 'bg-accent-500/20 text-accent-300' : 'text-surface-400 hover:text-surface-200'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </FadeUp>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div key="overview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Grade Trend */}
              <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-surface-200">Grade Trend</h3>
                  <div className="flex items-center gap-1 text-xs text-success-400">
                    <TrendingUp className="w-3.5 h-3.5" />
                    +7% this semester
                  </div>
                </div>
                <div className="flex items-end gap-2 h-28">
                  {monthlyScores.map((m, i) => {
                    const h = ((m.avg - minScore) / (100 - minScore)) * 100
                    return (
                      <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-[10px] text-surface-400 font-medium">{m.avg}%</span>
                        <motion.div
                          className="w-full rounded-t-lg"
                          style={{ background: i === monthlyScores.length - 1 ? student.color : student.color + '60', height: `${h}%`, minHeight: 8 }}
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%`, minHeight: 8 }}
                          transition={{ delay: i * 0.08, duration: 0.5 }}
                        />
                        <span className="text-[10px] text-surface-600">{m.month}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Classes Breakdown */}
              <div className="glass-card p-5">
                <h3 className="text-sm font-semibold text-surface-200 mb-4">Classes</h3>
                <div className="space-y-2.5">
                  {student.classes.map(cls => (
                    <div key={cls.name} className="flex items-center gap-3">
                      <div className="w-1.5 h-10 rounded-full flex-shrink-0" style={{ background: cls.color }} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-xs font-medium text-surface-200">{cls.name}</span>
                          <span className="text-xs font-bold" style={{ color: cls.avg >= 90 ? '#10b981' : cls.avg >= 80 ? '#f59e0b' : '#ef4444' }}>{cls.grade} ({cls.avg}%)</span>
                        </div>
                        <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ background: cls.color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${cls.avg}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                        <span className="text-[10px] text-surface-600">{cls.period} · {cls.teacher}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Attendance */}
            <div className="glass-card p-5">
              <h3 className="text-sm font-semibold text-surface-200 mb-4">Monthly Attendance</h3>
              <div className="flex items-end gap-4">
                {attendanceByMonth.map((m, i) => {
                  const pct = Math.round((m.present / m.total) * 100)
                  return (
                    <div key={m.month} className="flex-1 text-center">
                      <div className="text-xs font-bold text-surface-200 mb-1">{pct}%</div>
                      <div className="h-16 bg-white/[0.06] rounded-lg overflow-hidden flex flex-col-reverse">
                        <motion.div
                          className="rounded-lg"
                          style={{ background: pct >= 95 ? '#10b981' : pct >= 85 ? '#f59e0b' : '#ef4444', height: `${pct}%` }}
                          initial={{ height: 0 }}
                          animate={{ height: `${pct}%` }}
                          transition={{ delay: i * 0.06, duration: 0.4 }}
                        />
                      </div>
                      <div className="text-[10px] text-surface-500 mt-1">{m.month}</div>
                      <div className="text-[10px] text-surface-600">{m.present}/{m.total}</div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* AI Insight */}
            <div className="glass-card p-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-600/5 to-transparent" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-4 h-4 text-accent-400" />
                  <span className="text-sm font-semibold text-surface-200">AI Student Insights</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent-500/15 text-accent-400 font-bold">NEW</span>
                </div>
                <ul className="space-y-1.5">
                  {[
                    { text: 'Emma consistently scores above class average and shows upward trend across all subjects (+7% this semester).', color: '#10b981' },
                    { text: 'AP Biology lab reports are her strongest performance area — consider recommending advanced biology elective next year.', color: '#6366f1' },
                    { text: 'No behavioral or attendance concerns. Recommended for Academic Excellence Award consideration.', color: '#f59e0b' },
                  ].map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-surface-400">
                      <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: tip.color }} />
                      {tip.text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'assignments' && (
          <motion.div key="assignments" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="glass-card overflow-hidden">
              <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
                <h3 className="text-sm font-semibold text-surface-200">Recent Assignments</h3>
                <span className="text-xs text-surface-500">{completedAssignments.length}/{assignments.length} submitted</span>
              </div>
              <div className="divide-y divide-white/[0.04]">
                {assignments.map(a => {
                  const pct = a.score !== null ? Math.round((a.score / a.max) * 100) : null
                  return (
                    <div key={a.name} className="px-4 py-3 flex items-start gap-3">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${a.submitted ? 'bg-success-500/15' : 'bg-surface-700/50'}`}>
                        {a.submitted ? <Check className="w-3.5 h-3.5 text-success-400" /> : <Clock className="w-3.5 h-3.5 text-surface-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium text-surface-200">{a.name}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.05] text-surface-500 border border-white/[0.06]">{a.type}</span>
                        </div>
                        {a.feedback && (
                          <p className="text-xs text-surface-500 mt-0.5 italic line-clamp-1">&ldquo;{a.feedback}&rdquo;</p>
                        )}
                        <p className="text-[11px] text-surface-600 mt-0.5">Due {a.date}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        {pct !== null ? (
                          <>
                            <div className="text-sm font-bold" style={{ color: pct >= 90 ? '#10b981' : pct >= 70 ? '#f59e0b' : '#ef4444' }}>
                              {a.score}/{a.max}
                            </div>
                            <div className="text-[11px] text-surface-500">{pct}%</div>
                          </>
                        ) : (
                          <div className="text-xs text-surface-500">{a.submitted ? 'Not graded' : 'Pending'}</div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'notes' && (
          <motion.div key="notes" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-surface-300">{notes.length} Notes</h3>
              <button onClick={() => setAddingNote(true)} className="btn-secondary text-xs px-3 py-1.5">
                <Plus className="w-3.5 h-3.5" /> Add Note
              </button>
            </div>

            {addingNote && (
              <div className="glass-card p-4 border-accent-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-surface-200">New Note</span>
                  <button onClick={() => setAddingNote(false)} className="text-surface-500 hover:text-surface-300">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <textarea
                  value={newNote}
                  onChange={e => setNewNote(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-white/[0.04] border border-white/[0.08] text-surface-200 focus:outline-none focus:border-accent-500/40 resize-none"
                  placeholder="Add a note about this student…"
                />
                <div className="flex items-center gap-2">
                  <button onClick={() => setAddingNote(false)} className="btn-gradient text-xs px-3 py-1.5">Save Note</button>
                  <button onClick={() => setAddingNote(false)} className="btn-secondary text-xs px-3 py-1.5">Cancel</button>
                </div>
              </div>
            )}

            {notes.map((note, i) => {
              const ntc = noteTypeConfig[note.type]
              return (
                <motion.div key={i} className="glass-card p-4" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ntc.bg} ${ntc.text}`}>{ntc.label}</span>
                      <span className="text-[11px] text-surface-400 font-medium">{note.author}</span>
                    </div>
                    <span className="text-[11px] text-surface-600 flex-shrink-0">{note.date}</span>
                  </div>
                  <p className="text-sm text-surface-300 leading-relaxed">{note.text}</p>
                </motion.div>
              )
            })}
          </motion.div>
        )}

        {activeTab === 'contact' && (
          <motion.div key="contact" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="glass-card p-5 space-y-4">
                <h3 className="text-sm font-semibold text-surface-200">Student Contact</h3>
                {[
                  { icon: Mail,  label: 'School Email', value: student.email },
                  { icon: BookOpen, label: 'Grade',    value: `${student.grade} Grade` },
                  { icon: Calendar, label: 'DOB',      value: student.dob },
                ].map(c => (
                  <div key={c.label} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-accent-500/10 flex items-center justify-center flex-shrink-0">
                      <c.icon className="w-4 h-4 text-accent-400" />
                    </div>
                    <div>
                      <p className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold">{c.label}</p>
                      <p className="text-xs text-surface-200">{c.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="glass-card p-5 space-y-4">
                <h3 className="text-sm font-semibold text-surface-200">Guardian / Parent</h3>
                {[
                  { icon: Mail,  label: 'Parent Email', value: student.parentEmail },
                  { icon: Phone, label: 'Parent Phone', value: student.parentPhone },
                  { icon: Users, label: 'Counselor',    value: student.counselor },
                ].map(c => (
                  <div key={c.label} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-success-500/10 flex items-center justify-center flex-shrink-0">
                      <c.icon className="w-4 h-4 text-success-400" />
                    </div>
                    <div>
                      <p className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold">{c.label}</p>
                      <p className="text-xs text-surface-200">{c.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="glass-card p-5 md:col-span-2">
                <h3 className="text-sm font-semibold text-surface-200 mb-4">Special Services & Programs</h3>
                <div className="flex flex-wrap gap-3">
                  {[
                    { label: 'IEP',    active: student.iep,     color: '#ef4444' },
                    { label: '504',    active: student.section504, color: '#f59e0b' },
                    { label: 'ELL',    active: student.ell,     color: '#22d3ee' },
                    { label: 'Gifted', active: student.gifted,  color: '#8b5cf6' },
                  ].map(s => (
                    <div key={s.label} className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${s.active ? 'border-transparent' : 'border-white/[0.06] opacity-40'}`}
                         style={s.active ? { background: s.color + '15', borderColor: s.color + '30' } : {}}>
                      {s.active ? <Check className="w-3.5 h-3.5" style={{ color: s.color }} /> : <X className="w-3.5 h-3.5 text-surface-500" />}
                      <span className="text-xs font-semibold" style={s.active ? { color: s.color } : { color: '#6b7280' }}>{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
