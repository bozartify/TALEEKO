'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GraduationCap, Award, TrendingUp, Star, BookOpen, Target,
  ChevronRight, Download, Share2, Filter, Search, BarChart2,
  Clock, Flame, Trophy, Medal, Zap, Heart, Brain, Users,
  FileText, CheckCircle2, CheckCircle, Plus, X, MessageSquare, Eye,
  Sparkles, ChevronDown, Calendar, Mail, MoreHorizontal,
  PenTool, Lightbulb, ArrowUpRight, Printer, Send, Check
} from 'lucide-react'
import { FadeUp, StaggerList, StaggerItem, fadeUp, FadeInWhenVisible } from '@/components/ui/motion'

type PortfolioTab = 'overview' | 'skills' | 'growth' | 'achievements'

interface StudentData {
  id: string
  name: string
  grade: string
  class: string
  avg: number
  trend: 'up' | 'down' | 'flat'
  streak: number
  awards: number
  avatar: string
  color: string
  email: string
  iep: boolean
  ell: boolean
  attendance: number
  skills: { name: string; level: number; category: string }[]
  achievements: { title: string; date: string; icon: string }[]
  recentWork: { title: string; score: number; date: string; type: string }[]
  growth: number[]
  notes: string
  strengths: string[]
  areasToImprove: string[]
  goals: { text: string; done: boolean }[]
}

const students: StudentData[] = [
  {
    id: '1', name: 'Emma Rodriguez', grade: '7th', class: 'Science',
    avg: 92, trend: 'up', streak: 15, awards: 3, avatar: 'ER', color: '#8b5cf6',
    email: 'emma.r@student.edu', iep: false, ell: false, attendance: 97,
    skills: [
      { name: 'Scientific Method', level: 95, category: 'Science' },
      { name: 'Lab Safety', level: 90, category: 'Science' },
      { name: 'Data Analysis', level: 88, category: 'Math' },
      { name: 'Critical Thinking', level: 92, category: 'Core' },
      { name: 'Written Communication', level: 85, category: 'Language' },
      { name: 'Collaboration', level: 91, category: 'Core' },
    ],
    achievements: [
      { title: 'Lab Report Excellence', date: 'Oct 12', icon: '🏆' },
      { title: 'Science Fair Finalist', date: 'Sep 28', icon: '🥈' },
      { title: 'Perfect Attendance', date: 'Sep 1', icon: '⭐' },
    ],
    recentWork: [
      { title: 'Photosynthesis Lab Report', score: 95, date: 'Oct 12', type: 'Lab' },
      { title: 'Ecosystem Quiz', score: 88, date: 'Oct 8', type: 'Quiz' },
      { title: 'Cell Structure Worksheet', score: 92, date: 'Oct 3', type: 'Worksheet' },
      { title: 'Chapter 4 Test', score: 90, date: 'Sep 25', type: 'Test' },
    ],
    growth: [65, 72, 78, 82, 85, 88, 90, 92],
    notes: 'Excellent analytical skills. Science Olympiad candidate. Demonstrates strong curiosity and leadership in lab settings.',
    strengths: ['Scientific reasoning', 'Lab work', 'Peer collaboration'],
    areasToImprove: ['Math computations', 'Reading speed'],
    goals: [
      { text: 'Complete Science Olympiad registration', done: true },
      { text: 'Improve written lab reports to 95+', done: false },
      { text: 'Help tutor a struggling classmate', done: false },
    ],
  },
  {
    id: '2', name: 'James Kim', grade: '8th', class: 'History',
    avg: 87, trend: 'up', streak: 8, awards: 2, avatar: 'JK', color: '#f97316',
    email: 'james.k@student.edu', iep: false, ell: false, attendance: 94,
    skills: [
      { name: 'Historical Analysis', level: 90, category: 'History' },
      { name: 'Essay Writing', level: 85, category: 'Language' },
      { name: 'Source Evaluation', level: 82, category: 'Core' },
      { name: 'Argumentation', level: 88, category: 'Language' },
      { name: 'Research Skills', level: 80, category: 'Core' },
      { name: 'Public Speaking', level: 75, category: 'Language' },
    ],
    achievements: [
      { title: 'Essay Contest Winner', date: 'Oct 5', icon: '🥇' },
      { title: 'History Buff Badge', date: 'Sep 15', icon: '📚' },
    ],
    recentWork: [
      { title: 'American Revolution Essay', score: 90, date: 'Oct 10', type: 'Essay' },
      { title: 'Primary Source Analysis', score: 85, date: 'Oct 5', type: 'Analysis' },
      { title: 'Chapter 6 Quiz', score: 82, date: 'Oct 1', type: 'Quiz' },
      { title: 'Timeline Project', score: 88, date: 'Sep 20', type: 'Project' },
    ],
    growth: [70, 73, 75, 78, 80, 83, 85, 87],
    notes: 'Strong writer with great historical intuition. Could benefit from more structured outlining before essays. Participates actively.',
    strengths: ['Essay writing', 'Historical context', 'Class participation'],
    areasToImprove: ['Essay outlining', 'Public speaking confidence'],
    goals: [
      { text: 'Submit essay for district contest', done: true },
      { text: 'Complete 3 primary source analysis tasks', done: false },
      { text: 'Present one oral history report', done: false },
    ],
  },
  {
    id: '3', name: 'Aisha Thompson', grade: '9th', class: 'Math',
    avg: 95, trend: 'up', streak: 22, awards: 5, avatar: 'AT', color: '#14b8a6',
    email: 'aisha.t@student.edu', iep: false, ell: false, attendance: 99,
    skills: [
      { name: 'Problem Solving', level: 98, category: 'Math' },
      { name: 'Algebraic Thinking', level: 95, category: 'Math' },
      { name: 'Geometric Reasoning', level: 92, category: 'Math' },
      { name: 'Mathematical Communication', level: 90, category: 'Language' },
      { name: 'Computational Fluency', level: 96, category: 'Math' },
      { name: 'Peer Tutoring', level: 88, category: 'Core' },
    ],
    achievements: [
      { title: 'Math Olympiad Gold', date: 'Oct 1', icon: '🥇' },
      { title: 'Perfect Score Streak', date: 'Sep 28', icon: '🔥' },
      { title: 'Peer Tutor Badge', date: 'Sep 15', icon: '🤝' },
      { title: 'Problem of the Week Champ', date: 'Sep 8', icon: '⭐' },
      { title: 'Honor Roll Fall 2026', date: 'Sep 1', icon: '🏅' },
    ],
    recentWork: [
      { title: 'Quadratic Equations Test', score: 98, date: 'Oct 14', type: 'Test' },
      { title: 'Systems of Equations HW', score: 95, date: 'Oct 9', type: 'HW' },
      { title: 'Linear Functions Quiz', score: 92, date: 'Oct 4', type: 'Quiz' },
      { title: 'Graphing Project', score: 100, date: 'Sep 30', type: 'Project' },
    ],
    growth: [80, 83, 86, 88, 90, 92, 94, 95],
    notes: 'Top performer with exceptional mathematical intuition. Ready for honors acceleration. Acts as natural peer tutor — leverage this.',
    strengths: ['Advanced problem solving', 'Speed and accuracy', 'Helping peers'],
    areasToImprove: ['Written explanations of work', 'Exploring non-math electives'],
    goals: [
      { text: 'Complete Honors Math acceleration module', done: false },
      { text: 'Tutor 2 struggling students per week', done: true },
      { text: 'Participate in State Math Olympiad', done: false },
    ],
  },
  {
    id: '4', name: 'Noah Williams', grade: '8th', class: 'History',
    avg: 71, trend: 'down', streak: 1, awards: 0, avatar: 'NW', color: '#f59e0b',
    email: 'noah.w@student.edu', iep: true, ell: false, attendance: 82,
    skills: [
      { name: 'Historical Analysis', level: 68, category: 'History' },
      { name: 'Essay Writing', level: 60, category: 'Language' },
      { name: 'Source Evaluation', level: 70, category: 'Core' },
      { name: 'Argumentation', level: 65, category: 'Language' },
      { name: 'Research Skills', level: 72, category: 'Core' },
      { name: 'Organization', level: 55, category: 'Core' },
    ],
    achievements: [],
    recentWork: [
      { title: 'Revolution Essay Draft', score: 68, date: 'Oct 10', type: 'Essay' },
      { title: 'Source Analysis', score: 72, date: 'Oct 5', type: 'Analysis' },
      { title: 'Chapter 6 Quiz', score: 70, date: 'Oct 1', type: 'Quiz' },
      { title: 'Timeline Project', score: 75, date: 'Sep 20', type: 'Project' },
    ],
    growth: [62, 65, 68, 66, 70, 69, 72, 71],
    notes: 'IEP student requiring organizational scaffolding. Missing 3 assignments this month. Parent contact initiated on Oct 12.',
    strengths: ['Verbal discussion', 'Creative ideas in class'],
    areasToImprove: ['Assignment completion', 'Essay structure', 'Attendance'],
    goals: [
      { text: 'Submit all missing assignments by Oct 20', done: false },
      { text: 'Meet with counselor for IEP review', done: true },
      { text: 'Attend all classes this week', done: false },
    ],
  },
]

const overallStats = [
  { label: 'Total Students', value: '113', icon: Users, color: 'bg-accent-500/15 text-accent-400' },
  { label: 'Avg Performance', value: '84%', icon: Target, color: 'bg-success-500/15 text-success-400' },
  { label: 'Growth Rate', value: '+12%', icon: TrendingUp, color: 'bg-electric-500/15 text-electric-400' },
  { label: 'Awards Given', value: '47', icon: Trophy, color: 'bg-warning-500/15 text-warning-400' },
]

export default function PortfolioPage() {
  const [selectedStudent, setSelectedStudent] = useState(students[0])
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<PortfolioTab>('overview')
  const [shareModal, setShareModal] = useState(false)
  const [addGoalOpen, setAddGoalOpen] = useState(false)
  const [newGoal, setNewGoal] = useState('')
  const [goalsDone, setGoalsDone] = useState<Record<string, boolean>>({})
  const [noteOpen, setNoteOpen] = useState(false)
  const [toastMsg, setToastMsg] = useState('')

  function showToast(msg: string) {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 2500)
  }

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.class.toLowerCase().includes(search.toLowerCase())
  )

  const getGoalDone = (studentId: string, i: number) => {
    const key = `${studentId}-${i}`
    return key in goalsDone ? goalsDone[key] : selectedStudent.goals[i].done
  }
  const toggleGoal = (studentId: string, i: number) => {
    const key = `${studentId}-${i}`
    setGoalsDone(prev => ({ ...prev, [key]: !getGoalDone(studentId, i) }))
  }

  const avgGrowth = selectedStudent.growth[selectedStudent.growth.length - 1] - selectedStudent.growth[0]
  const skillAvg = Math.round(selectedStudent.skills.reduce((a, s) => a + s.level, 0) / selectedStudent.skills.length)

  return (
    <div className="space-y-6">
      {/* Header */}
      <FadeUp>
        <div className="hero-mesh rounded-3xl p-6 border border-white/[0.06]">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)' }}
                whileHover={{ rotate: 8, scale: 1.08 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <GraduationCap className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <h2 className="text-xl font-black text-white">Student Portfolios</h2>
                <p className="text-xs text-surface-400">Track growth, skills, achievements, and goals for every student</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="btn-secondary text-xs px-3 py-1.5" onClick={() => showToast('Portfolio exported as PDF')}><Download className="w-3 h-3" /> Export PDF</button>
              <button onClick={() => setShareModal(true)} className="btn-secondary text-xs px-3 py-1.5"><Share2 className="w-3 h-3" /> Share</button>
              <motion.button className="btn-gradient text-xs" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => showToast('AI summary generated for all students')}>
                <Sparkles className="w-3.5 h-3.5" /> AI Summary
              </motion.button>
            </div>
          </div>
        </div>
      </FadeUp>

      {/* Stats */}
      <StaggerList className="grid grid-cols-2 lg:grid-cols-4 gap-4" delay={0.08}>
        {overallStats.map(s => (
          <StaggerItem key={s.label} variants={fadeUp}>
            <motion.div className="stat-card h-full" whileHover={{ y: -2 }}>
              <div className={`icon-bubble ${s.color} mb-2`}><s.icon className="w-4 h-4" /></div>
              <div className="text-xl font-black text-white">{s.value}</div>
              <div className="text-xs text-surface-400">{s.label}</div>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerList>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Student list */}
        <FadeUp delay={0.12}>
          <div className="lg:col-span-1">
            <div className="relative mb-3">
              <Search className="w-3.5 h-3.5 text-surface-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search students..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 text-xs rounded-full border border-white/[0.06] bg-white/[0.06] text-surface-200 placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-accent-500 w-full"
              />
            </div>
            <div className="glass-card overflow-hidden">
              {filtered.map((s, i) => (
                <motion.button
                  key={s.id}
                  className={`w-full flex items-center gap-3 p-4 text-left hover:bg-white/[0.04] transition-colors border-b border-white/[0.06] last:border-0 ${
                    selectedStudent.id === s.id ? 'bg-accent-500/10 border-l-2 border-l-accent-500' : ''
                  }`}
                  onClick={() => { setSelectedStudent(s); setActiveTab('overview') }}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ background: `linear-gradient(135deg,${s.color},${s.color}cc)` }}
                  >
                    {s.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-semibold text-white truncate">{s.name}</p>
                      {s.iep && <span className="text-[9px] bg-neon-500/15 text-neon-400 px-1 py-0.5 rounded font-bold flex-shrink-0">IEP</span>}
                    </div>
                    <p className="text-xs text-surface-500">{s.grade} · {s.class}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className={`text-sm font-bold ${s.avg >= 90 ? 'text-success-400' : s.avg >= 80 ? 'text-accent-400' : s.avg >= 70 ? 'text-warning-400' : 'text-danger-400'}`}>
                      {s.avg}%
                    </span>
                    {s.trend === 'up' && <TrendingUp className="w-3 h-3 text-success-400 ml-auto mt-0.5" />}
                    {s.trend === 'down' && <TrendingUp className="w-3 h-3 text-danger-400 ml-auto mt-0.5 rotate-180" />}
                  </div>
                </motion.button>
              ))}
              {filtered.length === 0 && (
                <div className="p-8 text-center">
                  <p className="text-xs text-surface-500">No students match</p>
                  <button onClick={() => setSearch('')} className="mt-2 text-xs text-accent-400">Clear search</button>
                </div>
              )}
            </div>
          </div>
        </FadeUp>

        {/* Portfolio detail */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedStudent.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="space-y-4"
            >
              {/* Student header card */}
              <div className="glass-card p-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-black flex-shrink-0"
                    style={{ background: `linear-gradient(135deg,${selectedStudent.color},${selectedStudent.color}cc)` }}
                  >
                    {selectedStudent.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-black text-white">{selectedStudent.name}</h3>
                      {selectedStudent.iep && <span className="text-[9px] bg-neon-500/15 text-neon-400 px-1.5 py-0.5 rounded font-bold">IEP</span>}
                      {selectedStudent.ell && <span className="text-[9px] bg-electric-500/15 text-electric-400 px-1.5 py-0.5 rounded font-bold">ELL</span>}
                    </div>
                    <p className="text-sm text-surface-400">{selectedStudent.grade} Grade · {selectedStudent.class} · {selectedStudent.email}</p>
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-surface-500">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{selectedStudent.attendance}% attendance</span>
                      <span className="flex items-center gap-1"><Flame className="w-3 h-3 text-warning-400" />{selectedStudent.streak}d streak</span>
                      <span className="flex items-center gap-1"><Trophy className="w-3 h-3 text-warning-400" />{selectedStudent.awards} awards</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 flex-shrink-0">
                    <div className="text-center">
                      <p className="text-2xl font-black" style={{ color: selectedStudent.color }}>{selectedStudent.avg}%</p>
                      <p className="text-[10px] text-surface-500">Average</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-black text-success-400">+{avgGrowth}%</p>
                      <p className="text-[10px] text-surface-500">Growth</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-black text-electric-400">{skillAvg}%</p>
                      <p className="text-[10px] text-surface-500">Skill Avg</p>
                    </div>
                  </div>
                </div>
                {/* Action buttons */}
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/[0.06] flex-wrap">
                  <button onClick={() => setNoteOpen(o => !o)} className="btn-secondary text-xs px-3 py-1.5"><PenTool className="w-3 h-3" /> Add Note</button>
                  <button className="btn-secondary text-xs px-3 py-1.5" onClick={() => showToast(`Message sent to ${selectedStudent.name.split(' ')[0]}'s parent`)}><Mail className="w-3 h-3" /> Message Parent</button>
                  <button className="btn-secondary text-xs px-3 py-1.5" onClick={() => showToast(`Opening analytics for ${selectedStudent.name}`)}><BarChart2 className="w-3 h-3" /> Analytics</button>
                  <button className="btn-secondary text-xs px-3 py-1.5" onClick={() => showToast(`Printing portfolio for ${selectedStudent.name}`)}><Printer className="w-3 h-3" /> Print</button>
                  <button className="btn-gradient text-xs px-3 py-1.5 ml-auto" onClick={() => showToast(`AI insights generated for ${selectedStudent.name}`)}><Sparkles className="w-3 h-3" /> AI Insights</button>
                </div>
                <AnimatePresence>
                  {noteOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="mt-3 pt-3 border-t border-white/[0.06]">
                        <p className="text-xs text-surface-500 mb-2 italic">Current note: &ldquo;{selectedStudent.notes}&rdquo;</p>
                        <textarea rows={2} placeholder="Add a new note..." className="w-full text-xs bg-white/[0.04] border border-white/[0.08] text-surface-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent-500 resize-none" />
                        <div className="flex gap-2 mt-2">
                          <button className="btn-secondary text-xs px-3 py-1.5" onClick={() => setNoteOpen(false)}>Cancel</button>
                          <button className="btn-gradient text-xs px-3 py-1.5" onClick={() => { showToast('Note saved successfully'); setNoteOpen(false) }}><Check className="w-3 h-3" /> Save Note</button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Inner tab switcher */}
              <div className="flex items-center gap-1 bg-white/[0.04] rounded-full p-1 w-fit">
                {([
                  { key: 'overview' as const, label: 'Overview', icon: Eye },
                  { key: 'skills' as const, label: 'Skills', icon: Brain },
                  { key: 'growth' as const, label: 'Growth', icon: TrendingUp },
                  { key: 'achievements' as const, label: 'Achievements', icon: Trophy },
                ]).map(t => (
                  <button
                    key={t.key}
                    onClick={() => setActiveTab(t.key)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold transition-all ${
                      activeTab === t.key ? 'bg-white/[0.08] text-white' : 'text-surface-400 hover:text-surface-200'
                    }`}
                  >
                    <t.icon className="w-3 h-3" /> {t.label}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {/* OVERVIEW */}
                {activeTab === 'overview' && (
                  <motion.div key="overview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Recent Work */}
                      <div className="glass-card p-5">
                        <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2"><FileText className="w-4 h-4 text-accent-400" /> Recent Work</h4>
                        <div className="space-y-2">
                          {selectedStudent.recentWork.map((work, i) => (
                            <motion.div key={work.title} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                              <CheckCircle2 className="w-4 h-4 text-success-400 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-white truncate">{work.title}</p>
                                <p className="text-[10px] text-surface-500">{work.type} · {work.date}</p>
                              </div>
                              <span className={`text-sm font-bold flex-shrink-0 ${work.score >= 90 ? 'text-success-400' : work.score >= 80 ? 'text-accent-400' : 'text-warning-400'}`}>
                                {work.score}%
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Strengths & Areas to Improve */}
                      <div className="glass-card p-5">
                        <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2"><Lightbulb className="w-4 h-4 text-warning-400" /> Strengths & Growth Areas</h4>
                        <div className="mb-4">
                          <p className="text-[10px] font-bold text-success-400 uppercase tracking-wide mb-2">Strengths</p>
                          <div className="space-y-1.5">
                            {selectedStudent.strengths.map((s, i) => (
                              <motion.div key={s} className="flex items-center gap-2" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                                <div className="w-1.5 h-1.5 rounded-full bg-success-400 flex-shrink-0" />
                                <span className="text-xs text-surface-300">{s}</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-warning-400 uppercase tracking-wide mb-2">Areas to Improve</p>
                          <div className="space-y-1.5">
                            {selectedStudent.areasToImprove.map((a, i) => (
                              <motion.div key={a} className="flex items-center gap-2" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                                <div className="w-1.5 h-1.5 rounded-full bg-warning-400 flex-shrink-0" />
                                <span className="text-xs text-surface-300">{a}</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Goals */}
                    <div className="glass-card p-5">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-bold text-white flex items-center gap-2"><Target className="w-4 h-4 text-accent-400" /> Learning Goals</h4>
                        <button onClick={() => setAddGoalOpen(o => !o)} className="text-xs text-accent-400 hover:text-accent-300 flex items-center gap-1">
                          <Plus className="w-3 h-3" /> Add Goal
                        </button>
                      </div>
                      <AnimatePresence>
                        {addGoalOpen && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-3">
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="Enter a new goal..."
                                value={newGoal}
                                onChange={e => setNewGoal(e.target.value)}
                                className="flex-1 text-xs bg-white/[0.04] border border-white/[0.08] text-surface-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-500"
                              />
                              <button className="btn-gradient text-xs px-3" onClick={() => { setNewGoal(''); setAddGoalOpen(false) }}>Add</button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <div className="space-y-2.5">
                        {selectedStudent.goals.map((goal, i) => (
                          <motion.div key={goal.text} className="flex items-center gap-3" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                            <button
                              onClick={() => toggleGoal(selectedStudent.id, i)}
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${getGoalDone(selectedStudent.id, i) ? 'bg-success-400 border-success-400' : 'border-white/[0.20] hover:border-success-400'}`}
                            >
                              {getGoalDone(selectedStudent.id, i) && <Check className="w-3 h-3 text-white" />}
                            </button>
                            <span className={`text-xs transition-all ${getGoalDone(selectedStudent.id, i) ? 'line-through text-surface-600' : 'text-surface-200'}`}>{goal.text}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Teacher Note */}
                    <div className="glass-card p-5 border border-accent-500/15">
                      <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2"><MessageSquare className="w-4 h-4 text-accent-400" /> Teacher Notes</h4>
                      <p className="text-xs text-surface-400 italic leading-relaxed">&ldquo;{selectedStudent.notes}&rdquo;</p>
                    </div>
                  </motion.div>
                )}

                {/* SKILLS */}
                {activeTab === 'skills' && (
                  <motion.div key="skills" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="glass-card p-5">
                        <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><Brain className="w-4 h-4 text-accent-400" /> Skills Assessment</h4>
                        <div className="space-y-4">
                          {selectedStudent.skills.map((skill, i) => (
                            <motion.div key={skill.name} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                              <div className="flex items-center justify-between mb-1.5">
                                <div>
                                  <span className="text-xs font-semibold text-surface-200">{skill.name}</span>
                                  <span className="ml-2 text-[9px] px-1.5 py-0.5 rounded-full bg-white/[0.06] text-surface-500">{skill.category}</span>
                                </div>
                                <span className="text-xs font-bold" style={{ color: selectedStudent.color }}>{skill.level}%</span>
                              </div>
                              <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                                <motion.div
                                  className="h-full rounded-full"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${skill.level}%` }}
                                  transition={{ delay: 0.2 + i * 0.07, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                  style={{ backgroundColor: selectedStudent.color }}
                                />
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                      <div className="glass-card p-5">
                        <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><BarChart2 className="w-4 h-4 text-success-400" /> Skills Summary</h4>
                        <div className="space-y-3">
                          {['Math', 'Science', 'Language', 'Core', 'History'].map(cat => {
                            const catSkills = selectedStudent.skills.filter(s => s.category === cat)
                            if (catSkills.length === 0) return null
                            const catAvg = Math.round(catSkills.reduce((a, s) => a + s.level, 0) / catSkills.length)
                            const catColor = { Math: '#14b8a6', Science: '#8b5cf6', Language: '#f97316', Core: '#6366f1', History: '#f43f5e' }[cat] ?? '#6366f1'
                            return (
                              <div key={cat}>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs text-surface-400">{cat}</span>
                                  <span className="text-xs font-bold" style={{ color: catColor }}>{catAvg}%</span>
                                </div>
                                <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                                  <motion.div
                                    className="h-full rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${catAvg}%` }}
                                    transition={{ duration: 0.6, ease: 'easeOut' }}
                                    style={{ backgroundColor: catColor }}
                                  />
                                </div>
                              </div>
                            )
                          })}
                        </div>
                        <div className="mt-5 pt-4 border-t border-white/[0.06]">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-surface-400">Overall Skill Average</span>
                            <span className="text-lg font-black" style={{ color: selectedStudent.color }}>{skillAvg}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* GROWTH */}
                {activeTab === 'growth' && (
                  <motion.div key="growth" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="space-y-4">
                    <div className="glass-card p-5">
                      <div className="flex items-center justify-between mb-5">
                        <h4 className="text-sm font-bold text-white flex items-center gap-2"><TrendingUp className="w-4 h-4 text-success-400" /> Growth Over Time (8 Weeks)</h4>
                        <div className="flex items-center gap-1 text-success-400 text-xs font-bold">
                          <ArrowUpRight className="w-3.5 h-3.5" /> +{avgGrowth}% improvement
                        </div>
                      </div>
                      <div className="flex items-end gap-2 h-40 mb-2">
                        {selectedStudent.growth.map((val, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center gap-1" style={{ transformOrigin: 'bottom' }}>
                            <span className="text-[10px] font-bold" style={{ color: selectedStudent.color }}>{val}</span>
                            <motion.div
                              className="w-full rounded-t-lg"
                              style={{ background: `linear-gradient(180deg, ${selectedStudent.color}, ${selectedStudent.color}88)` }}
                              initial={{ height: 0 }}
                              animate={{ height: `${(val / 100) * 130}px` }}
                              transition={{ delay: 0.15 + i * 0.07, duration: 0.5, ease: 'easeOut' }}
                            />
                            <span className="text-[9px] text-surface-500">W{i + 1}</span>
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/[0.06]">
                        <div className="text-center">
                          <p className="text-sm font-black text-surface-400">{selectedStudent.growth[0]}%</p>
                          <p className="text-[10px] text-surface-500">Week 1</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-black" style={{ color: selectedStudent.color }}>{selectedStudent.growth[selectedStudent.growth.length - 1]}%</p>
                          <p className="text-[10px] text-surface-500">Current</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-black text-success-400">+{avgGrowth}%</p>
                          <p className="text-[10px] text-surface-500">Total Growth</p>
                        </div>
                      </div>
                    </div>
                    <div className="glass-card p-5">
                      <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2"><Sparkles className="w-4 h-4 text-accent-400" /> AI Growth Prediction</h4>
                      <p className="text-xs text-surface-400 leading-relaxed mb-3">
                        Based on current trajectory (+{avgGrowth}% over 8 weeks), {selectedStudent.name.split(' ')[0]} is projected to reach{' '}
                        <span className="font-bold" style={{ color: selectedStudent.color }}>
                          {Math.min(100, selectedStudent.avg + Math.round(avgGrowth * 0.5))}%
                        </span>{' '}
                        by semester end if current pace is maintained.
                      </p>
                      <div className="flex items-center gap-2">
                        <button className="btn-gradient text-xs px-3 py-1.5" onClick={() => showToast(`Acceleration plan created for ${selectedStudent.name}`)}><Zap className="w-3 h-3" /> Accelerate Plan</button>
                        <button className="btn-secondary text-xs px-3 py-1.5" onClick={() => showToast('Growth report exported')}><Download className="w-3 h-3" /> Export Report</button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ACHIEVEMENTS */}
                {activeTab === 'achievements' && (
                  <motion.div key="achievements" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="space-y-4">
                    <div className="glass-card p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-bold text-white flex items-center gap-2"><Trophy className="w-4 h-4 text-warning-400" /> Earned Achievements</h4>
                        <button className="btn-gradient text-xs px-3 py-1.5" onClick={() => showToast(`Badge awarded to ${selectedStudent.name}`)}><Plus className="w-3 h-3" /> Award Badge</button>
                      </div>
                      {selectedStudent.achievements.length === 0 ? (
                        <div className="text-center py-8">
                          <Trophy className="w-8 h-8 text-surface-600 mx-auto mb-3" />
                          <p className="text-sm font-semibold text-surface-400">No achievements yet</p>
                          <p className="text-xs text-surface-500 mt-1">Award the first badge to motivate {selectedStudent.name.split(' ')[0]}</p>
                          <button className="mt-3 btn-gradient text-xs px-3 py-1.5" onClick={() => showToast(`First badge awarded to ${selectedStudent.name}`)}><Plus className="w-3 h-3" /> Award First Badge</button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {selectedStudent.achievements.map((ach, i) => (
                            <motion.div
                              key={ach.title}
                              className="flex items-center gap-3 p-4 rounded-2xl bg-warning-500/10 border border-warning-500/20"
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.1 + i * 0.07 }}
                              whileHover={{ scale: 1.02 }}
                            >
                              <span className="text-2xl flex-shrink-0">{ach.icon}</span>
                              <div>
                                <p className="text-xs font-bold text-warning-300">{ach.title}</p>
                                <p className="text-[10px] text-surface-500 mt-0.5"><Calendar className="w-2.5 h-2.5 inline mr-0.5" />{ach.date}</p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                    {/* Available badges */}
                    <div className="glass-card p-5">
                      <h4 className="text-sm font-bold text-white mb-3">Available Badges</h4>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                        {[
                          { icon: '🌟', label: 'Star Student' },
                          { icon: '📈', label: 'Most Improved' },
                          { icon: '🤝', label: 'Team Player' },
                          { icon: '💡', label: 'Creative Thinker' },
                          { icon: '🎯', label: '100% Goal' },
                          { icon: '📚', label: 'Bookworm' },
                          { icon: '🔬', label: 'Lab Expert' },
                          { icon: '✍️', label: 'Top Writer' },
                        ].map(b => (
                          <motion.button
                            key={b.label}
                            className="glass-card p-3 text-center hover:border-warning-400/30 transition-all group"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => showToast(`"${b.label}" badge awarded to ${selectedStudent.name}`)}
                          >
                            <span className="text-2xl block mb-1">{b.icon}</span>
                            <p className="text-[9px] text-surface-400 group-hover:text-white transition-colors">{b.label}</p>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Share Modal */}
      <AnimatePresence>
        {shareModal && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShareModal(false)} />
            <motion.div className="relative glass-card p-6 w-full max-w-sm z-10" initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white">Share Portfolio</h3>
                <button onClick={() => setShareModal(false)} className="text-surface-400 hover:text-white p-1"><X className="w-4 h-4" /></button>
              </div>
              <p className="text-xs text-surface-400 mb-4">Share {selectedStudent.name}&apos;s portfolio with parents or administrators</p>
              <div className="space-y-2 mb-4">
                {[
                  { label: 'Email to parent', icon: Mail, color: '#6366f1', toast: `Portfolio emailed to ${selectedStudent.name.split(' ')[0]}'s parent` },
                  { label: 'Generate shareable link', icon: Share2, color: '#14b8a6', toast: 'Shareable link copied to clipboard' },
                  { label: 'Export as PDF', icon: Download, color: '#f97316', toast: 'Portfolio exported as PDF' },
                ].map(o => (
                  <button key={o.label} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.04] transition-colors" onClick={() => { showToast(o.toast); setShareModal(false) }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: o.color + '18' }}>
                      <o.icon className="w-4 h-4" style={{ color: o.color }} />
                    </div>
                    <span className="text-sm text-surface-200">{o.label}</span>
                  </button>
                ))}
              </div>
              <motion.button className="btn-gradient text-xs w-full" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => { showToast(`Portfolio for ${selectedStudent.name} shared`); setShareModal(false) }}>
                <Send className="w-3.5 h-3.5" /> Share Now
              </motion.button>
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
