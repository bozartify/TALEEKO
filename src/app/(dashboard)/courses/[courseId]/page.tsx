'use client'
import Link from 'next/link'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, BookOpen, Plus, Clock, ChevronRight, Sparkles,
  Users, Calendar, Target, Edit3, BarChart2, GripVertical,
  ChevronDown, Brain, TrendingUp, AlertTriangle, CheckCircle,
  FileText, Zap, Star, Award, Layers, Flag, Bell, MessageSquare
} from 'lucide-react'
import { FadeUp, FadeInWhenVisible } from '@/components/ui/motion'

const courseInfo = {
  title: '7th Grade Biology',
  subject: 'Science',
  grade: 'Grade 7',
  term: 'Fall 2026',
  students: 28,
  avgGrade: 84,
  nextClass: 'Today · 9:00 AM · Room 204',
  description: 'A comprehensive biology course covering cellular biology, genetics, evolution, ecology, and human body systems. Aligned to NGSS standards with hands-on labs and AI-powered differentiation.',
  standards: ['MS-LS1-1', 'MS-LS1-2', 'MS-LS1-3', 'MS-LS3-1', 'MS-LS4-1'],
  schedule: [
    { day: 'Mon/Wed/Fri', time: '9:00–9:50 AM', room: 'Room 204' },
    { day: 'Tue/Thu', time: '10:15–11:05 AM', room: 'Lab 3B' },
  ],
}

interface Lesson {
  id: string
  title: string
  duration: number
  status: 'published' | 'draft'
  materials: number
  type: string
  ai?: boolean
}

interface Unit {
  id: string
  title: string
  color: string
  weeks: string
  completedLessons: number
  lessons: Lesson[]
}

const units: Unit[] = [
  {
    id: 'u1',
    title: 'Unit 1: Cell Biology',
    color: '#6366f1',
    weeks: 'Weeks 1–4',
    completedLessons: 3,
    lessons: [
      { id: '1', title: 'Introduction to Cells', duration: 45, status: 'published', materials: 3, type: 'Lecture + Lab', ai: true },
      { id: '2', title: 'Cell Structure and Organelles', duration: 50, status: 'published', materials: 4, type: 'Interactive', ai: true },
      { id: '3', title: 'Photosynthesis', duration: 60, status: 'published', materials: 5, type: 'Lab' },
      { id: '4', title: 'Cellular Respiration', duration: 55, status: 'draft', materials: 2, type: 'Lecture' },
    ],
  },
  {
    id: 'u2',
    title: 'Unit 2: Genetics & Heredity',
    color: '#10b981',
    weeks: 'Weeks 5–8',
    completedLessons: 1,
    lessons: [
      { id: '5', title: 'DNA and Genetics', duration: 60, status: 'published', materials: 3, type: 'Lecture + Activity', ai: true },
      { id: '6', title: 'Punnett Squares', duration: 50, status: 'draft', materials: 1, type: 'Practice' },
      { id: '7', title: 'Traits and Inheritance', duration: 55, status: 'draft', materials: 0, type: 'Lab' },
    ],
  },
  {
    id: 'u3',
    title: 'Unit 3: Evolution',
    color: '#f97316',
    weeks: 'Weeks 9–11',
    completedLessons: 0,
    lessons: [
      { id: '8', title: 'Natural Selection', duration: 50, status: 'draft', materials: 0, type: 'Discussion' },
      { id: '9', title: 'Adaptation & Speciation', duration: 55, status: 'draft', materials: 0, type: 'Lecture + Lab' },
    ],
  },
  {
    id: 'u4',
    title: 'Unit 4: Ecosystems',
    color: '#14b8a6',
    weeks: 'Weeks 12–15',
    completedLessons: 0,
    lessons: [
      { id: '10', title: 'Ecosystems and Food Webs', duration: 45, status: 'draft', materials: 0, type: 'Project' },
      { id: '11', title: 'Biomes of the World', duration: 50, status: 'draft', materials: 0, type: 'Lecture' },
      { id: '12', title: 'Human Impact on Ecosystems', duration: 60, status: 'draft', materials: 0, type: 'Research Project' },
    ],
  },
]

const upcomingDeadlines = [
  { title: 'Cell Structure Quiz', type: 'Quiz', dueDate: 'Tomorrow', color: '#f97316', urgent: true },
  { title: 'Photosynthesis Lab Report', type: 'Assignment', dueDate: 'Aug 5', color: '#6366f1', urgent: false },
  { title: 'Unit 1 Test', type: 'Assessment', dueDate: 'Aug 10', color: '#ec4899', urgent: false },
]

const topStudents: { name: string; initials: string; avg: number; trend: 'up' | 'down' | 'stable'; color: string }[] = [
  { name: 'Emma Davis', initials: 'ED', avg: 96, trend: 'up', color: '#8b5cf6' },
  { name: 'Sofia Rodriguez', initials: 'SR', avg: 94, trend: 'up', color: '#10b981' },
  { name: 'Ethan Kim', initials: 'EK', avg: 91, trend: 'stable', color: '#f97316' },
  { name: 'Liam Chen', initials: 'LC', avg: 88, trend: 'up', color: '#6366f1' },
]

const aiInsights = [
  { icon: AlertTriangle, color: '#f59e0b', title: '4 students struggling with cellular respiration', action: 'Plan intervention' },
  { icon: TrendingUp, color: '#10b981', title: 'Class avg up 6% since Unit 1 started', action: 'View analytics' },
  { icon: Brain, color: '#6366f1', title: 'AI lesson for genetics ready to generate', action: 'Generate now' },
]

export default function CourseDetailPage({ params }: { params: { courseId: string } }) {
  const [expandedUnit, setExpandedUnit] = useState<string | null>('u1')
  const [toastMsg, setToastMsg] = useState('')
  function showToast(msg: string) { setToastMsg(msg); setTimeout(() => setToastMsg(''), 2500) }
  const allLessons = units.flatMap(u => u.lessons)
  const publishedCount = allLessons.filter(l => l.status === 'published').length
  const progressPct = Math.round((publishedCount / allLessons.length) * 100)
  const totalLessons = allLessons.length

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
            <CheckCircle className="w-4 h-4 text-indigo-400 flex-shrink-0" />
            <span className="text-sm font-medium text-white">{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <FadeUp>
        <div className="hero-mesh rounded-3xl p-6 border border-white/[0.06]">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <Link href="/courses" className="w-8 h-8 rounded-lg flex items-center justify-center text-surface-500 hover:text-surface-300 hover:bg-white/[0.04] transition-all mt-1">
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-black text-white">{courseInfo.title}</h1>
                  <span className="text-xs font-bold bg-accent-500/20 text-accent-300 px-2.5 py-0.5 rounded-full">{courseInfo.term}</span>
                </div>
                <p className="text-sm text-surface-400 mt-1">{courseInfo.subject} · {courseInfo.grade} · {totalLessons} lessons · {units.length} units</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => showToast('Course updated!')} className="btn-secondary text-xs px-3 py-1.5">
                <Edit3 className="w-3.5 h-3.5" />
                Edit
              </button>
              <button onClick={() => showToast('Announcement sent!')} className="btn-secondary text-xs px-3 py-1.5">
                <Bell className="w-3.5 h-3.5" />
                Announce
              </button>
              <Link href="/magic-chat?mode=lesson" className="btn-gradient text-xs">
                <Sparkles className="w-3.5 h-3.5" />
                AI Generate
              </Link>
            </div>
          </div>
          <div className="border-t border-white/[0.06] pt-4 mt-4 flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-surface-400">Students</span>
              <span className="text-xs font-bold text-white">{courseInfo.students}</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-surface-400">Class Avg</span>
              <span className="text-xs font-bold text-success-400">{courseInfo.avgGrade}%</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-surface-400">Units</span>
              <span className="text-xs font-bold text-accent-300">{units.length}</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-surface-400">Published</span>
              <span className="text-xs font-bold text-indigo-400">{progressPct}%</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-surface-400">Next Class</span>
              <span className="text-xs font-bold text-electric-400">{courseInfo.nextClass}</span>
            </div>
          </div>
        </div>
      </FadeUp>

      {/* Stat Cards */}
      <FadeUp delay={0.04}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Students', value: courseInfo.students, icon: Users, color: '#6366f1', sub: courseInfo.nextClass },
            { label: 'Class Avg', value: `${courseInfo.avgGrade}%`, icon: BarChart2, color: '#10b981', sub: '+4% this month' },
            { label: 'Units', value: units.length, icon: Layers, color: '#f97316', sub: `${units.filter(u => u.completedLessons === u.lessons.length).length} complete` },
            { label: 'Published', value: `${progressPct}%`, icon: CheckCircle, color: '#14b8a6', sub: `${publishedCount}/${totalLessons} lessons` },
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
              <p className="text-[10px] text-surface-500 mt-0.5 truncate">{stat.sub}</p>
            </motion.div>
          ))}
        </div>
      </FadeUp>

      {/* AI Insights */}
      <FadeUp delay={0.07}>
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#8b5cf618' }}>
              <Brain className="w-3.5 h-3.5 text-neon-400" />
            </div>
            <span className="text-sm font-bold text-white">AI Course Insights</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {aiInsights.map((ins, i) => {
              const Icon = ins.icon
              return (
                <motion.div
                  key={i}
                  className="flex gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.1] transition-all cursor-pointer group"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.05 }}
                  whileHover={{ y: -1 }}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: ins.color + '20' }}>
                    <Icon className="w-4 h-4" style={{ color: ins.color }} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white leading-snug">{ins.title}</p>
                    <button className="mt-1.5 text-[11px] font-medium flex items-center gap-1" style={{ color: ins.color }}>
                      {ins.action} <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </FadeUp>

      {/* Main content grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6">
        <div className="space-y-5">
          {/* Progress bar */}
          <FadeUp delay={0.1}>
            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-sm font-bold text-white">Course Progress</span>
                  <p className="text-xs text-surface-500 mt-0.5">{publishedCount} of {totalLessons} lessons published</p>
                </div>
                <span className="text-2xl font-black text-accent-400">{progressPct}%</span>
              </div>
              {(() => {
                const bw = (progressPct / 100) * 500
                return (
                  <svg viewBox="0 0 500 14" className="w-full overflow-visible mb-3">
                    <defs>
                      <linearGradient id="cid-prog" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity={0.95} />
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.85} />
                      </linearGradient>
                    </defs>
                    <rect x={0} y={2} width={500} height={10} rx={5} fill="rgba(255,255,255,0.05)" />
                    <motion.rect x={0} y={2} height={10} rx={5} fill="url(#cid-prog)"
                      initial={{ width: 0 }} animate={{ width: bw }}
                      transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </svg>
                )
              })()}
              <div className="flex gap-3">
                {units.map((u, ui) => {
                  const upct = Math.round((u.completedLessons / u.lessons.length) * 100)
                  return (
                    <div key={u.id} className="flex-1">
                      <div className="text-[10px] text-surface-500 mb-1 truncate">{u.title.replace('Unit ', 'U')}</div>
                      {(() => {
                        const bw = (upct / 100) * 60
                        return (
                          <svg viewBox="0 0 60 6" className="w-full overflow-visible">
                            <defs>
                              <linearGradient id={`cid-u-${ui}`} x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor={u.color} stopOpacity={0.9} />
                                <stop offset="100%" stopColor={u.color} stopOpacity={0.55} />
                              </linearGradient>
                            </defs>
                            <rect x={0} y={0} width={60} height={6} rx={3} fill="rgba(255,255,255,0.05)" />
                            <motion.rect x={0} y={0} height={6} rx={3} fill={`url(#cid-u-${ui})`}
                              initial={{ width: 0 }} animate={{ width: bw }}
                              transition={{ delay: 0.4, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            />
                          </svg>
                        )
                      })()}
                    </div>
                  )
                })}
              </div>
            </div>
          </FadeUp>

          {/* Units + Lessons */}
          <FadeUp delay={0.12}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white">Units & Lessons</h3>
              <div className="flex items-center gap-2">
                <button className="btn-secondary text-xs px-3 py-1.5">
                  <Plus className="w-3.5 h-3.5" />
                  Add Unit
                </button>
                <button className="btn-secondary text-xs px-3 py-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  AI Sequence
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {units.map((unit, ui) => {
                const isExpanded = expandedUnit === unit.id
                const unitProgress = Math.round((unit.completedLessons / unit.lessons.length) * 100)

                return (
                  <motion.div
                    key={unit.id}
                    className="glass-card overflow-hidden"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.14 + ui * 0.05 }}
                  >
                    <button
                      className="w-full px-5 py-4 flex items-center gap-3 text-left"
                      onClick={() => setExpandedUnit(isExpanded ? null : unit.id)}
                    >
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-xs font-bold" style={{ background: `linear-gradient(135deg, ${unit.color}, ${unit.color}bb)` }}>
                        {ui + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{unit.title}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.06] text-surface-500">{unit.weeks}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1.5">
                          <div className="flex-1 max-w-[120px] h-1 bg-white/[0.06] rounded-full overflow-hidden">
                            <motion.div className="h-full rounded-full" style={{ backgroundColor: unit.color, width: `${unitProgress}%` }} />
                          </div>
                          <span className="text-[10px] text-surface-500">{unit.completedLessons}/{unit.lessons.length} lessons</span>
                        </div>
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
                          transition={{ duration: 0.22 }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-white/[0.05]">
                            {unit.lessons.map((lesson, li) => (
                              <Link
                                key={lesson.id}
                                href={`/courses/${params.courseId}/lessons/${lesson.id}`}
                                className={`flex items-center gap-3 px-5 py-3.5 hover:bg-white/[0.03] transition-colors group ${
                                  li < unit.lessons.length - 1 ? 'border-b border-white/[0.04]' : ''
                                }`}
                              >
                                <GripVertical className="w-3.5 h-3.5 text-surface-700 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                                <div
                                  className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                                  style={{ backgroundColor: unit.color + '20', color: unit.color }}
                                >
                                  {li + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-white group-hover:text-accent-400 transition-colors truncate">{lesson.title}</span>
                                    {lesson.ai && <Sparkles className="w-3 h-3 text-accent-400 flex-shrink-0" />}
                                  </div>
                                  <div className="flex items-center gap-2.5 mt-0.5 text-[11px] text-surface-500">
                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{lesson.duration}m</span>
                                    <span className="flex items-center gap-1"><FileText className="w-3 h-3" />{lesson.materials}</span>
                                    <span>{lesson.type}</span>
                                  </div>
                                </div>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                                  lesson.status === 'published'
                                    ? 'bg-success-400/15 text-success-400'
                                    : 'bg-white/[0.06] text-surface-500'
                                }`}>
                                  {lesson.status}
                                </span>
                                <ChevronRight className="w-3.5 h-3.5 text-surface-600 group-hover:text-accent-400 transition-colors flex-shrink-0" />
                              </Link>
                            ))}
                            <div className="px-5 py-3 border-t border-white/[0.04] flex items-center gap-2">
                              <button className="flex items-center gap-1.5 text-[11px] text-accent-400 hover:text-accent-300 transition-colors">
                                <Plus className="w-3 h-3" /> Add Lesson
                              </button>
                              <button className="flex items-center gap-1.5 text-[11px] text-neon-400 hover:text-neon-300 transition-colors ml-3">
                                <Sparkles className="w-3 h-3" /> Generate with AI
                              </button>
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
        <div className="space-y-4">
          {/* Next Class */}
          <FadeInWhenVisible delay={0.08}>
            <div className="glass-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-success-400 animate-pulse" />
                <span className="text-xs font-bold text-success-400">NEXT CLASS</span>
              </div>
              <p className="text-sm font-bold text-white">{courseInfo.nextClass}</p>
              <p className="text-xs text-surface-500 mt-1">Cell Structure · 28 students</p>
              <div className="flex gap-2 mt-3">
                <button className="btn-gradient text-xs flex-1 justify-center">
                  <Zap className="w-3 h-3" />
                  Start Class
                </button>
                <button className="btn-secondary text-xs px-3">
                  <MessageSquare className="w-3 h-3" />
                </button>
              </div>
            </div>
          </FadeInWhenVisible>

          {/* Upcoming Deadlines */}
          <FadeInWhenVisible delay={0.12}>
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-warning-400/15">
                  <Flag className="w-3.5 h-3.5 text-warning-400" />
                </div>
                <span className="text-sm font-bold text-white">Upcoming</span>
              </div>
              <div className="space-y-3">
                {upcomingDeadlines.map((d, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]"
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.05 }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-0.5" style={{ backgroundColor: d.color }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{d.title}</p>
                      <p className="text-[10px] text-surface-500">{d.type}</p>
                    </div>
                    <span className={`text-[10px] font-bold flex-shrink-0 ${d.urgent ? 'text-warning-400' : 'text-surface-500'}`}>
                      {d.dueDate}
                    </span>
                  </motion.div>
                ))}
                <button className="w-full text-[11px] text-accent-400 hover:text-accent-300 py-1 transition-colors flex items-center justify-center gap-1">
                  <Plus className="w-3 h-3" /> Add deadline
                </button>
              </div>
            </div>
          </FadeInWhenVisible>

          {/* Top Students */}
          <FadeInWhenVisible delay={0.16}>
            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-warning-400/15">
                    <Award className="w-3.5 h-3.5 text-warning-400" />
                  </div>
                  <span className="text-sm font-bold text-white">Top Students</span>
                </div>
                <Link href="/students" className="text-[11px] text-accent-400 hover:text-accent-300">All →</Link>
              </div>
              <div className="space-y-2.5">
                {topStudents.map((s, i) => (
                  <motion.div
                    key={s.name}
                    className="flex items-center gap-2.5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 + i * 0.05 }}
                  >
                    <span className="text-[10px] font-black text-surface-600 w-4">#{i + 1}</span>
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                      style={{ background: `linear-gradient(135deg, ${s.color}, ${s.color}99)` }}
                    >
                      {s.initials}
                    </div>
                    <span className="text-xs text-surface-300 flex-1 truncate">{s.name}</span>
                    <span className="text-xs font-bold text-white">{s.avg}%</span>
                    <span className={`text-xs ${s.trend === 'up' ? 'text-success-400' : s.trend === 'down' ? 'text-danger-400' : 'text-surface-500'}`}>
                      {s.trend === 'up' ? '↑' : s.trend === 'down' ? '↓' : '→'}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </FadeInWhenVisible>

          {/* Course Info */}
          <FadeInWhenVisible delay={0.2}>
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-teal-400/15">
                  <Target className="w-3.5 h-3.5 text-teal-400" />
                </div>
                <span className="text-sm font-bold text-white">Standards</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {courseInfo.standards.map(s => (
                  <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-accent-500/15 text-accent-400 font-medium">{s}</span>
                ))}
              </div>
              <div className="space-y-2 pt-3 border-t border-white/[0.06]">
                {courseInfo.schedule.map(s => (
                  <div key={s.day} className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-surface-500" />
                    <div>
                      <span className="text-xs text-surface-300">{s.day}</span>
                      <span className="text-[10px] text-surface-500 ml-1.5">{s.time} · {s.room}</span>
                    </div>
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
