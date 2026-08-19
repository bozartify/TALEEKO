'use client'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import {
  BookOpen, ClipboardList, FileText, Zap, BarChart2, Sparkles,
  ChevronRight, Users, Clock, TrendingUp, Calendar, Target,
  Bot, Shield, MessageSquare, PenTool, ArrowUpRight, Activity,
  Star, Flame, Brain, CheckCircle, AlertTriangle, Bell,
  FlaskConical, Pencil, BookMarked, Newspaper, Gamepad2, Layers,
  MessageCircle, Trophy, GraduationCap, Plus, Play, Eye
} from 'lucide-react'
import { FadeUp, StaggerList, StaggerItem, fadeUp, FadeInWhenVisible } from '@/components/ui/motion'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return { text: 'Good morning', emoji: '☀️' }
  if (h < 17) return { text: 'Good afternoon', emoji: '🌤️' }
  return { text: 'Good evening', emoji: '🌙' }
}

const stats = [
  { label: 'Lessons Created',   value: '24',  delta: '+3 this week',     icon: BookOpen,      gradient: 'from-accent-500/20 to-accent-600/5',   iconColor: 'text-accent-400',   trend: '+14%', trendUp: true,  sparkColor: '#8b5cf6', spark: [4,6,5,8,7,9,11,10,13,12,14,16,18,21,24] },
  { label: 'Quizzes Generated', value: '18',  delta: '+5 this week',     icon: ClipboardList, gradient: 'from-warning-400/20 to-warning-500/5', iconColor: 'text-warning-400',  trend: '+22%', trendUp: true,  sparkColor: '#f97316', spark: [2,3,4,5,5,7,8,9,11,12,13,15,16,17,18] },
  { label: 'Students Reached',  value: '142', delta: 'Across 4 classes', icon: Users,         gradient: 'from-success-400/20 to-success-500/5', iconColor: 'text-success-400',  trend: '+3%',  trendUp: true,  sparkColor: '#10b981', spark: [120,125,128,132,130,135,136,138,139,140,140,141,142,142,142] },
  { label: 'Hours Saved',       value: '31h', delta: 'This month',       icon: Clock,         gradient: 'from-electric-400/20 to-electric-500/5', iconColor: 'text-electric-400', trend: '+8h', trendUp: true,  sparkColor: '#22d3ee', spark: [8,10,12,15,16,18,20,22,23,24,26,27,28,30,31] },
]

function Sparkline({ data, color }: { data: number[], color: string }) {
  const W = 80, H = 28
  const min = Math.min(...data), max = Math.max(...data)
  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * W,
    y: H - ((v - min) / ((max - min) || 1)) * H * 0.85 - H * 0.08,
  }))
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`
  for (let i = 1; i < pts.length; i++) {
    const cpx = ((pts[i].x + pts[i-1].x) / 2).toFixed(1)
    d += ` C ${cpx} ${pts[i-1].y.toFixed(1)} ${cpx} ${pts[i].y.toFixed(1)} ${pts[i].x.toFixed(1)} ${pts[i].y.toFixed(1)}`
  }
  const area = d + ` L ${pts[pts.length-1].x.toFixed(1)} ${H} L 0 ${H} Z`
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="overflow-visible">
      <defs>
        <linearGradient id={`sg-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#sg-${color.replace('#','')})`}/>
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx={pts[pts.length-1].x} cy={pts[pts.length-1].y} r="2.5" fill={color}/>
    </svg>
  )
}

interface ClassCard {
  name: string
  subject: string
  period: string
  students: number
  avg: number
  trend: 'up' | 'down'
  color: string
  nextLesson: string
  pending: number
}
const classes: ClassCard[] = [
  { name: 'AP Biology',      subject: 'Life Sciences',          period: '2nd Period', students: 28, avg: 88, trend: 'up',   color: '#8b5cf6', nextLesson: 'Photosynthesis Lab',      pending: 6 },
  { name: '10th English',    subject: 'Literature & Writing',   period: '4th Period', students: 24, avg: 85, trend: 'up',   color: '#f43f5e', nextLesson: 'Great Gatsby Ch.5',       pending: 0 },
  { name: 'Algebra II',      subject: 'Mathematics',            period: '6th Period', students: 25, avg: 82, trend: 'down', color: '#14b8a6', nextLesson: 'Quadratic Functions',     pending: 2 },
  { name: '8th History',     subject: 'American History',       period: '7th Period', students: 31, avg: 79, trend: 'up',   color: '#f97316', nextLesson: 'American Revolution',     pending: 0 },
]

const aiAlerts = [
  { type: 'warning', title: '6 students haven\'t submitted Lab Report', desc: 'Due today — consider sending a parent reminder', action: 'Send Reminder', color: '#f59e0b', bg: 'bg-warning-500/10', border: 'border-warning-500/20' },
  { type: 'info',    title: 'Unit 2 is 3 days behind pacing schedule',  desc: 'AP Biology — Genetics unit compression recommended', action: 'Adjust Pacing', color: '#6366f1', bg: 'bg-accent-500/10', border: 'border-accent-500/20' },
  { type: 'success', title: 'Aisha Thompson reached 22-day streak!',    desc: '9th Math — Highest streak in your classes',          action: 'Celebrate',    color: '#10b981', bg: 'bg-success-500/10', border: 'border-success-500/20' },
]

const quickTools = [
  { href: '/lesson-planner',     icon: BookOpen,      label: 'Lesson Plan',    desc: 'Full AI lesson with objectives', gradient: 'from-accent-500/20 to-accent-600/5',     iconColor: 'text-accent-400' },
  { href: '/quiz-builder',       icon: ClipboardList, label: 'Quiz Builder',   desc: 'Multi-type AI assessments',      gradient: 'from-warning-400/20 to-warning-500/5',   iconColor: 'text-warning-400' },
  { href: '/5e-lesson',          icon: FlaskConical,  label: '5E Lesson',      desc: 'Inquiry-based science lesson',   gradient: 'from-teal-500/20 to-teal-600/5',          iconColor: 'text-teal-400' },
  { href: '/writing-prompts',    icon: Pencil,        label: 'Writing Prompts',desc: '7 modes — scaffolded prompts',   gradient: 'from-pink-500/20 to-pink-600/5',          iconColor: 'text-pink-400' },
  { href: '/exit-tickets',       icon: Target,        label: 'Exit Tickets',   desc: 'Check for understanding fast',   gradient: 'from-success-400/20 to-success-500/5',   iconColor: 'text-success-400' },
  { href: '/magic-chat',         icon: Sparkles,      label: 'Magic Chat',     desc: 'Your AI co-teacher, always on',  gradient: 'from-danger-400/20 to-danger-500/5',     iconColor: 'text-danger-400' },
]

interface RecentLesson {
  title: string
  subject: string
  grade: string
  status: 'published' | 'draft'
  date: string
  color: string
}
const recentLessons: RecentLesson[] = [
  { title: 'Introduction to Photosynthesis', subject: 'Biology', grade: '7th',  status: 'published', date: 'Today',      color: '#8b5cf6' },
  { title: 'The American Revolution',        subject: 'History', grade: '8th',  status: 'draft',     date: 'Yesterday', color: '#f97316' },
  { title: 'Quadratic Equations Unit 3',     subject: 'Math',    grade: '9th',  status: 'published', date: '2 days ago', color: '#14b8a6' },
  { title: 'Shakespeare: Romeo & Juliet',    subject: 'English', grade: '10th', status: 'draft',     date: '3 days ago', color: '#f43f5e' },
  { title: 'Cell Division & Meiosis',        subject: 'Biology', grade: '7th',  status: 'published', date: '4 days ago', color: '#8b5cf6' },
]

const agentActivity = [
  { agent: 'Curriculum Architect', task: 'Mapping biology unit to NGSS MS-LS1-6', status: 'running' as const, progress: 72, color: '#6366f1' },
  { agent: 'Assessment Engine',    task: 'Generating differentiated quiz variants (3 tiers)', status: 'running' as const, progress: 45, color: '#f97316' },
  { agent: 'Grading Assistant',    task: 'Batch-graded 28 essays — needs human sign-off', status: 'awaiting' as const, progress: 100, color: '#14b8a6' },
]

const upcomingDeadlines = [
  { title: 'Lab Report: Photosynthesis', class: 'AP Biology',   date: 'Today',       urgent: true,  submitted: 22, total: 28 },
  { title: 'Essay: Great Gatsby Ch. 5', class: '10th English', date: 'Tomorrow',    urgent: true,  submitted: 0,  total: 24 },
  { title: 'Math Quiz Chapter 7',       class: 'Algebra II',   date: 'Next Mon',    urgent: false, submitted: 0,  total: 25 },
  { title: 'Science Fair Proposal',     class: 'AP Biology',   date: 'Aug 15',      urgent: false, submitted: 0,  total: 28 },
]

const recentGenerations = [
  { type: 'Lesson Plan',  title: 'Photosynthesis Deep Dive',    time: '2 min ago',  icon: BookOpen,      color: 'text-accent-400' },
  { type: 'Quiz',         title: '10-Q American Revolution',    time: '18 min ago', icon: ClipboardList, color: 'text-warning-400' },
  { type: 'Worksheet',    title: 'Quadratic Practice Set',      time: '1 hr ago',   icon: FileText,      color: 'text-success-400' },
  { type: 'Exit Ticket',  title: 'Photosynthesis Check',        time: '2 hrs ago',  icon: Target,        color: 'text-teal-400' },
  { type: 'Writing',      title: 'Persuasive Essay Prompt',     time: '3 hrs ago',  icon: Pencil,        color: 'text-pink-400' },
]

const weeklyActivity = [
  { day: 'Mon', value: 4 }, { day: 'Tue', value: 7 },
  { day: 'Wed', value: 3 }, { day: 'Thu', value: 9 },
  { day: 'Fri', value: 6 }, { day: 'Sat', value: 2 },
  { day: 'Sun', value: 1 },
]

const achievements = [
  { icon: Trophy,       label: '50 Lessons Created',  color: '#f59e0b', earned: true },
  { icon: Flame,        label: '12-Day Streak',        color: '#f97316', earned: true },
  { icon: Star,         label: 'Power User',           color: '#8b5cf6', earned: true },
  { icon: Brain,        label: 'AI Explorer',          color: '#6366f1', earned: false },
  { icon: GraduationCap, label: 'Class Champion',     color: '#10b981', earned: false },
]

type DashTab = 'overview' | 'classes' | 'alerts'

export default function DashboardPage() {
  const maxActivity = Math.max(...weeklyActivity.map(d => d.value))
  const greeting = getGreeting()
  const [activeTab, setActiveTab] = useState<DashTab>('overview')
  const [toastMsg, setToastMsg] = useState('')
  const [userName] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('taleeko_firstName') || 'Alex'
    }
    return 'Alex'
  })

  function showToast(msg: string) {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 2500)
  }

  return (
    <div className="space-y-6">
      {/* Welcome hero */}
      <FadeUp>
        <div className="hero-mesh rounded-3xl p-6 border border-white/[0.06] relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-black text-white">{greeting.text}, {userName}!</h2>
                <motion.span
                  className="text-2xl"
                  animate={{ rotate: [0, 15, -5, 10, 0] }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                >
                  {greeting.emoji}
                </motion.span>
              </div>
              <p className="text-surface-400 text-sm mb-3">
                You have <span className="text-warning-400 font-semibold">3 lessons to review</span>, <span className="text-accent-400 font-semibold">2 quizzes</span> ready to assign, and <span className="text-success-400 font-semibold">1 agent</span> awaiting your approval.
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-warning-400 bg-warning-400/10 px-2.5 py-1 rounded-full border border-warning-400/20">
                  <Flame className="w-3 h-3" /> 12-day streak
                </span>
                <span className="flex items-center gap-1.5 text-xs font-medium text-accent-300 bg-accent-500/10 px-2.5 py-1 rounded-full border border-accent-500/20">
                  <Star className="w-3 h-3 fill-accent-400" /> Pro Plan
                </span>
                <span className="flex items-center gap-1.5 text-xs text-success-400 bg-success-500/10 px-2.5 py-1 rounded-full border border-success-500/20">
                  <CheckCircle className="w-3 h-3" /> All classes on track
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
              <Link href="/agents" className="btn-secondary flex-shrink-0 text-xs">
                <Bot className="w-4 h-4" />
                Agent Swarm
              </Link>
              <Link href="/magic-chat" className="btn-gradient flex-shrink-0">
                <Sparkles className="w-4 h-4" />
                Magic Chat
              </Link>
            </div>
          </div>

          {/* Achievements row */}
          <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center gap-3 flex-wrap">
            <span className="text-[10px] font-semibold text-surface-500 uppercase tracking-wider mr-1">Achievements</span>
            {achievements.map((ach, i) => (
              <motion.div
                key={ach.label}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold ${
                  ach.earned
                    ? 'border-opacity-20 bg-opacity-10'
                    : 'border-white/[0.06] text-surface-600 grayscale'
                }`}
                style={ach.earned ? { borderColor: ach.color + '30', backgroundColor: ach.color + '10', color: ach.color } : {}}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + i * 0.08 }}
              >
                <ach.icon className="w-3 h-3" />
                {ach.label}
              </motion.div>
            ))}
          </div>
        </div>
      </FadeUp>

      {/* Stats */}
      <StaggerList className="grid grid-cols-2 lg:grid-cols-4 gap-4" delay={0.08}>
        {stats.map((s) => (
          <StaggerItem key={s.label} variants={fadeUp}>
            <motion.div
              className="glass-card p-5 h-full"
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${s.gradient}`}>
                  <s.icon className={`w-5 h-5 ${s.iconColor}`} />
                </div>
                <span className={`flex items-center gap-0.5 text-xs font-bold ${s.trendUp ? 'text-success-400' : 'text-danger-400'}`}>
                  <ArrowUpRight className="w-3 h-3" />
                  {s.trend}
                </span>
              </div>
              <div className="text-2xl font-black text-white">{s.value}</div>
              <div className="text-xs font-semibold text-surface-300 mt-0.5">{s.label}</div>
              <div className="mt-2 mb-1">
                <Sparkline data={s.spark} color={s.sparkColor} />
              </div>
              <div className="text-xs text-surface-500">{s.delta}</div>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerList>

      {/* Tabs */}
      <FadeUp delay={0.15}>
        <div className="flex items-center gap-1 bg-white/[0.03] rounded-xl border border-white/[0.06] p-1 w-fit">
          {([
            { key: 'overview' as const, label: 'Overview', icon: Activity },
            { key: 'classes'  as const, label: 'My Classes', icon: Users },
            { key: 'alerts'   as const, label: `AI Alerts`, icon: Bell, count: 3 },
          ]).map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-accent-500/20 text-accent-300 border border-accent-500/30'
                  : 'text-surface-400 hover:text-surface-200 hover:bg-white/[0.04]'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
              {tab.count && (
                <span className="w-4 h-4 rounded-full bg-warning-400 text-black text-[9px] font-black flex items-center justify-center">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </FadeUp>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Quick Tools */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-white">Quick Create</h3>
                    <Link href="/workspace" className="text-xs text-accent-400 font-semibold hover:text-accent-300 flex items-center gap-1">
                      All 28 tools <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {quickTools.map((tool, i) => (
                      <motion.div
                        key={tool.label}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 + i * 0.07 }}
                        whileHover={{ y: -3, transition: { duration: 0.18 } }}
                      >
                        <Link href={tool.href} className="glass-card group block p-4 h-full transition-all duration-300 hover:border-accent-500/20">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 bg-gradient-to-br ${tool.gradient}`}>
                            <tool.icon className={`w-4 h-4 ${tool.iconColor}`} />
                          </div>
                          <p className="text-sm font-bold text-white">{tool.label}</p>
                          <p className="text-xs text-surface-500 mt-0.5 leading-relaxed">{tool.desc}</p>
                          <ChevronRight className="w-3.5 h-3.5 text-accent-400 mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Recent Lessons */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-white">Recent Lessons</h3>
                    <Link href="/courses" className="text-xs text-accent-400 font-semibold hover:text-accent-300 flex items-center gap-1">
                      View all <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                  <div className="glass-card overflow-hidden">
                    {recentLessons.map((lesson, i) => (
                      <motion.div
                        key={lesson.title}
                        className={`flex items-center gap-4 px-5 py-4 hover:bg-white/[0.03] transition-colors cursor-pointer ${i < recentLessons.length - 1 ? 'border-b border-white/[0.06]' : ''}`}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + i * 0.05 }}
                      >
                        <div className="w-1 h-8 rounded-full flex-shrink-0" style={{ backgroundColor: lesson.color }} />
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: lesson.color + '18' }}>
                          <BookOpen className="w-4 h-4" style={{ color: lesson.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-surface-100 truncate">{lesson.title}</p>
                          <p className="text-xs text-surface-500">{lesson.subject} · Grade {lesson.grade} · {lesson.date}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className={`badge text-[10px] ${
                            lesson.status === 'published' ? 'bg-success-400/15 text-success-400' : 'bg-white/[0.06] text-surface-400'
                          }`}>
                            {lesson.status}
                          </span>
                          <button className="p-1.5 rounded-lg text-surface-500 hover:text-surface-200 hover:bg-white/[0.06] transition-colors" onClick={() => showToast(`Opening "${lesson.title}"`)}>
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Upcoming Deadlines */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-accent-400" />
                      Upcoming Deadlines
                    </h3>
                    <Link href="/assignments" className="text-xs text-accent-400 font-semibold hover:text-accent-300 flex items-center gap-1">
                      View all <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                  <div className="space-y-2">
                    {upcomingDeadlines.map((d, i) => {
                      const submittedPct = d.total > 0 ? Math.round((d.submitted / d.total) * 100) : 0
                      return (
                        <motion.div
                          key={d.title}
                          className={`glass-card px-4 py-3 flex items-center gap-4 ${d.urgent ? 'border-warning-500/20' : ''}`}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 + i * 0.06 }}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            d.urgent ? 'bg-warning-400/15' : 'bg-white/[0.06]'
                          }`}>
                            {d.urgent ? <Flame className="w-4 h-4 text-warning-400" /> : <Calendar className="w-4 h-4 text-surface-500" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-surface-100 truncate">{d.title}</p>
                              {d.urgent && <span className="badge bg-warning-400/15 text-warning-400 text-[9px] flex-shrink-0">Urgent</span>}
                            </div>
                            <p className="text-[10px] text-surface-500">{d.class} · Due {d.date}</p>
                          </div>
                          {d.total > 0 && (
                            <div className="flex-shrink-0 w-24 text-right">
                              <p className="text-[10px] text-surface-500 mb-1">{d.submitted}/{d.total} submitted</p>
                              {(() => {
                                const W = 96, H = 6
                                const bw = (submittedPct / 100) * W
                                return (
                                  <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible">
                                    <defs>
                                      <linearGradient id={`db-sub-${i}`} x1="0" x2="1" y1="0" y2="0">
                                        <stop offset="0%" stopColor="#6366f1" />
                                        <stop offset="100%" stopColor="#818cf8" />
                                      </linearGradient>
                                    </defs>
                                    <rect x={0} y={0} width={W} height={H} rx={3} fill="rgba(255,255,255,0.06)" />
                                    <motion.rect
                                      x={0} y={0} height={H} rx={3}
                                      fill={`url(#db-sub-${i})`}
                                      initial={{ width: 0 }}
                                      animate={{ width: bw }}
                                      transition={{ delay: 0.2, duration: 0.6 }}
                                    />
                                  </svg>
                                )
                              })()}
                            </div>
                          )}
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Right column */}
              <div className="space-y-5">
                {/* Weekly activity bar chart */}
                <div className="glass-card p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-white">This Week</h3>
                    <span className="flex items-center gap-1 text-xs font-bold text-success-400">
                      <TrendingUp className="w-3 h-3" /> +18%
                    </span>
                  </div>
                  {(() => {
                    const W = 400, H = 80, N = weeklyActivity.length
                    const slotW = W / N
                    const barW = slotW * 0.6
                    const baseY = H - 14
                    const chartH = baseY - 2
                    return (
                      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 80 }}>
                        <defs>
                          <linearGradient id="db-week-today" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#6366f1" stopOpacity={0.95} />
                            <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.7} />
                          </linearGradient>
                        </defs>
                        {weeklyActivity.map((d, i) => {
                          const isToday = d.day === 'Thu'
                          const x = i * slotW + (slotW - barW) / 2
                          const bh = d.value > 0 ? Math.max((d.value / maxActivity) * chartH, 5) : 3
                          return (
                            <g key={d.day}>
                              <rect x={x} y={2} width={barW} height={chartH} rx={4} fill="rgba(255,255,255,0.035)" />
                              {d.value > 0 && (
                                <motion.rect x={x} width={barW} rx={4}
                                  fill={isToday ? 'url(#db-week-today)' : d.value >= 6 ? 'rgba(99,102,241,0.35)' : 'rgba(255,255,255,0.08)'}
                                  initial={{ y: baseY, height: 0 }}
                                  animate={{ y: baseY - bh, height: bh }}
                                  transition={{ delay: 0.3 + i * 0.05, duration: 0.5 }}
                                />
                              )}
                              <text x={x + barW / 2} y={H - 1} textAnchor="middle" fontSize={10} fontFamily="inherit"
                                fill={isToday ? '#818cf8' : 'rgba(255,255,255,0.3)'}
                                fontWeight={isToday ? 'bold' : 'normal'}
                              >{d.day}</text>
                            </g>
                          )
                        })}
                      </svg>
                    )
                  })()}
                  <p className="text-xs text-surface-500 mt-2 text-center">32 materials created this week</p>
                </div>

                {/* Agent activity */}
                <div className="glass-card p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <Bot className="w-4 h-4 text-accent-400" />
                      Agent Swarm
                    </h3>
                    <Link href="/agents" className="text-xs text-accent-400 font-semibold hover:text-accent-300">
                      View all
                    </Link>
                  </div>
                  <div className="space-y-4">
                    {agentActivity.map((a, i) => (
                      <motion.div
                        key={a.agent}
                        className="space-y-1.5"
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.35 + i * 0.08 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              a.status === 'running' ? 'bg-success-400 animate-pulse' : 'bg-warning-400'
                            }`} />
                            <span className="text-xs font-semibold text-surface-200">{a.agent}</span>
                          </div>
                          <span className={`text-[10px] font-medium ${
                            a.status === 'running' ? 'text-success-400' : 'text-warning-400'
                          }`}>
                            {a.status === 'running' ? 'Running' : 'Awaiting'}
                          </span>
                        </div>
                        <p className="text-[10px] text-surface-500 pl-3">{a.task}</p>
                        {(() => {
                          const W = 300, H = 4
                          const bw = (a.progress / 100) * W
                          const gid = `db-ag-${i}`
                          return (
                            <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible">
                              <defs>
                                <linearGradient id={gid} x1="0" x2="1" y1="0" y2="0">
                                  <stop offset="0%" stopColor={a.color} />
                                  <stop offset="100%" stopColor={a.color + '80'} />
                                </linearGradient>
                              </defs>
                              <rect x={0} y={0} width={W} height={H} rx={2} fill="rgba(255,255,255,0.06)" />
                              <motion.rect
                                x={0} y={0} height={H} rx={2}
                                fill={`url(#${gid})`}
                                initial={{ width: 0 }}
                                animate={{ width: bw }}
                                transition={{ delay: 0.4 + i * 0.06, duration: 0.6 }}
                              />
                            </svg>
                          )
                        })()}
                      </motion.div>
                    ))}
                    {agentActivity.filter(a => a.status === 'awaiting').length > 0 && (
                      <Link href="/agents" className="flex items-center gap-2 mt-1 text-xs text-warning-400 font-semibold hover:text-warning-300 transition-colors">
                        <Bell className="w-3.5 h-3.5" />
                        1 item needs your approval
                      </Link>
                    )}
                  </div>
                </div>

                {/* Recent AI Generations */}
                <div className="glass-card p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-accent-400" />
                      Recent AI Creations
                    </h3>
                    <Link href="/library" className="text-xs text-accent-400 font-semibold hover:text-accent-300">
                      Library
                    </Link>
                  </div>
                  <div className="space-y-2.5">
                    {recentGenerations.map((g, i) => (
                      <motion.div
                        key={g.title}
                        className="flex items-center gap-3 group cursor-pointer"
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.42 + i * 0.05 }}
                        whileHover={{ x: 2 }}
                      >
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/[0.06] flex-shrink-0">
                          <g.icon className={`w-3.5 h-3.5 ${g.color}`} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-surface-200 truncate group-hover:text-white transition-colors">{g.title}</p>
                          <p className="text-[10px] text-surface-500">{g.type} · {g.time}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Quick navigation */}
                <div className="glass-card p-5 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent-500/[0.05] via-transparent to-neon-400/[0.03] pointer-events-none" />
                  <div className="relative">
                    <h3 className="text-sm font-bold text-white mb-3">Explore Tools</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { href: '/rubrics',        icon: PenTool,       label: 'Rubrics' },
                        { href: '/standards',      icon: Shield,        label: 'Standards' },
                        { href: '/communication',  icon: MessageSquare, label: 'Messages' },
                        { href: '/classroom',      icon: Users,         label: 'Classroom' },
                        { href: '/gradebook',      icon: BarChart2,     label: 'Gradebook' },
                        { href: '/analytics',      icon: Activity,      label: 'Analytics' },
                      ].map((item, i) => (
                        <motion.div
                          key={item.label}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.47 + i * 0.05 }}
                        >
                          <Link
                            href={item.href}
                            className="flex items-center gap-2 p-2.5 bg-white/[0.04] rounded-xl text-xs font-semibold text-surface-300 hover:bg-white/[0.08] hover:text-white transition-all border border-white/[0.04] hover:border-white/[0.08]"
                          >
                            <item.icon className="w-3.5 h-3.5 text-accent-400" />
                            {item.label}
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'classes' && (
          <motion.div
            key="classes"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {classes.map((cls, i) => (
                <motion.div
                  key={cls.name}
                  className="glass-card overflow-hidden"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -2 }}
                >
                  <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${cls.color}, ${cls.color}88)` }} />
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <h4 className="text-base font-black text-white">{cls.name}</h4>
                          {cls.pending > 0 && (
                            <span className="w-5 h-5 rounded-full bg-warning-400 text-black text-[10px] font-black flex items-center justify-center">
                              {cls.pending}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-surface-500">{cls.subject} · {cls.period}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-sm font-black ${cls.avg >= 85 ? 'text-success-400' : cls.avg >= 75 ? 'text-warning-400' : 'text-danger-400'}`}>{cls.avg}%</span>
                        {cls.trend === 'up' ? <TrendingUp className="w-3.5 h-3.5 text-success-400" /> : <TrendingUp className="w-3.5 h-3.5 text-danger-400 rotate-180" />}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-3 text-xs">
                      <span className="flex items-center gap-1 text-surface-400">
                        <Users className="w-3 h-3" /> {cls.students} students
                      </span>
                      <span className="flex items-center gap-1 text-surface-400">
                        <BookOpen className="w-3 h-3" /> Next: {cls.nextLesson}
                      </span>
                    </div>

                    {(() => {
                      const W = 500, H = 6
                      const bw = (cls.avg / 100) * W
                      const gid = `db-cls-${i}`
                      return (
                        <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible mb-4">
                          <defs>
                            <linearGradient id={gid} x1="0" x2="1" y1="0" y2="0">
                              <stop offset="0%" stopColor={cls.color} />
                              <stop offset="100%" stopColor={cls.color + '80'} />
                            </linearGradient>
                          </defs>
                          <rect x={0} y={0} width={W} height={H} rx={3} fill="rgba(255,255,255,0.06)" />
                          <motion.rect
                            x={0} y={0} height={H} rx={3}
                            fill={`url(#${gid})`}
                            initial={{ width: 0 }}
                            animate={{ width: bw }}
                            transition={{ delay: 0.3 + i * 0.1, duration: 0.8 }}
                          />
                        </svg>
                      )
                    })()}

                    <div className="flex items-center gap-2">
                      <Link href="/lesson-planner" className="btn-primary text-xs px-3 py-1.5 flex-1 justify-center">
                        <Plus className="w-3 h-3" />
                        New Lesson
                      </Link>
                      <Link href="/classroom" className="btn-secondary text-xs px-3 py-1.5">
                        <Eye className="w-3 h-3" />
                        View
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'alerts' && (
          <motion.div
            key="alerts"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {aiAlerts.map((alert, i) => (
              <motion.div
                key={alert.title}
                className={`glass-card p-5 border ${alert.border}`}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className={`flex items-start gap-4`}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: alert.color + '18' }}>
                    <Brain className="w-5 h-5" style={{ color: alert.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-white mb-1">{alert.title}</h4>
                    <p className="text-xs text-surface-400 mb-3">{alert.desc}</p>
                    <div className="flex items-center gap-3">
                      <button className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all" style={{ backgroundColor: alert.color + '20', color: alert.color }} onClick={() => showToast(`${alert.action} — done`)}>
                        {alert.action}
                      </button>
                      <button className="text-xs text-surface-500 hover:text-surface-300 transition-colors" onClick={() => showToast('Alert dismissed')}>Dismiss</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
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
