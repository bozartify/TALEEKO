'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  BookOpen, ClipboardList, FileText, Zap, BarChart2, Sparkles,
  ChevronRight, Users, Clock, TrendingUp, Calendar, Target,
  Bot, Shield, MessageSquare, PenTool, ArrowUpRight, Activity,
  Star, Flame
} from 'lucide-react'
import { FadeUp, StaggerList, StaggerItem, fadeUp, FadeInWhenVisible } from '@/components/ui/motion'

const stats = [
  { label: 'Lessons Created',   value: '24',   delta: '+3 this week',       icon: BookOpen,      gradient: 'from-accent-500/20 to-accent-600/5', iconColor: 'text-accent-400', trend: '+14%' },
  { label: 'Quizzes Generated', value: '18',   delta: '+5 this week',       icon: ClipboardList, gradient: 'from-warning-400/20 to-warning-500/5', iconColor: 'text-warning-400', trend: '+22%' },
  { label: 'Students Reached',  value: '142',  delta: 'Across 4 classes',   icon: Users,         gradient: 'from-success-400/20 to-success-500/5', iconColor: 'text-success-400', trend: '+3%' },
  { label: 'Hours Saved',       value: '31h',  delta: 'This month',         icon: Clock,         gradient: 'from-electric-400/20 to-electric-500/5', iconColor: 'text-electric-400', trend: '+8h' },
]

const quickTools = [
  { href: '/magic-chat?mode=lesson',    icon: BookOpen,      label: 'Lesson Plan',   desc: 'Create a full lesson',     gradient: 'from-accent-500/20 to-accent-600/5', iconColor: 'text-accent-400' },
  { href: '/magic-chat?mode=quiz',      icon: ClipboardList, label: 'Quiz',          desc: 'Generate an assessment',   gradient: 'from-warning-400/20 to-warning-500/5', iconColor: 'text-warning-400' },
  { href: '/magic-chat?mode=worksheet', icon: FileText,      label: 'Worksheet',     desc: 'Build practice materials', gradient: 'from-success-400/20 to-success-500/5', iconColor: 'text-success-400' },
  { href: '/magic-chat?mode=activity',  icon: Zap,           label: 'Activity',      desc: 'Design a class activity',  gradient: 'from-electric-400/20 to-electric-500/5', iconColor: 'text-electric-400' },
  { href: '/analytics',                 icon: BarChart2,     label: 'Analytics',     desc: 'Review lesson insights',   gradient: 'from-neon-400/20 to-neon-500/5', iconColor: 'text-neon-400' },
  { href: '/magic-chat',                icon: Sparkles,      label: 'Magic Chat',    desc: 'Open AI co-teacher',       gradient: 'from-danger-400/20 to-danger-500/5', iconColor: 'text-danger-400' },
]

const recentLessons = [
  { title: 'Introduction to Photosynthesis', subject: 'Biology', grade: '7th',  status: 'published' as const, date: 'Today' },
  { title: 'The American Revolution',        subject: 'History', grade: '8th',  status: 'draft' as const,     date: 'Yesterday' },
  { title: 'Quadratic Equations',            subject: 'Math',    grade: '9th',  status: 'published' as const, date: '2 days ago' },
  { title: 'Shakespeare: Romeo & Juliet',    subject: 'English', grade: '10th', status: 'draft' as const,     date: '3 days ago' },
]

const agentActivity = [
  { agent: 'Curriculum Architect', task: 'Mapping biology unit to NGSS', status: 'running' as const, progress: 72 },
  { agent: 'Assessment Engine',    task: 'Generating differentiated quiz', status: 'running' as const, progress: 45 },
  { agent: 'Grading Assistant',    task: 'Batch-graded 28 essays',       status: 'awaiting' as const, progress: 100 },
]

const upcomingDeadlines = [
  { title: 'Science Fair Projects', class: '7th Science', date: 'In 5 days', urgent: true },
  { title: 'History Essay Review',  class: '8th History', date: 'Tomorrow',  urgent: true },
  { title: 'Math Quiz Chapter 7',   class: '9th Math',    date: 'Next Mon',  urgent: false },
]

const recentGenerations = [
  { type: 'Lesson Plan', title: 'Photosynthesis Deep Dive', time: '2 min ago', icon: BookOpen, color: 'text-accent-400' },
  { type: 'Quiz', title: '10-Q American Revolution', time: '18 min ago', icon: ClipboardList, color: 'text-warning-400' },
  { type: 'Worksheet', title: 'Quadratic Practice Set', time: '1 hr ago', icon: FileText, color: 'text-success-400' },
  { type: 'Activity', title: 'Shakespeare Scene Analysis', time: '3 hrs ago', icon: Zap, color: 'text-electric-400' },
]

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return { text: 'Good morning', emoji: '☀️' }
  if (h < 17) return { text: 'Good afternoon', emoji: '🌤️' }
  return { text: 'Good evening', emoji: '🌙' }
}

const weeklyActivity = [
  { day: 'Mon', value: 4 }, { day: 'Tue', value: 7 },
  { day: 'Wed', value: 3 }, { day: 'Thu', value: 9 },
  { day: 'Fri', value: 6 }, { day: 'Sat', value: 2 },
  { day: 'Sun', value: 1 },
]

export default function DashboardPage() {
  const maxActivity = Math.max(...weeklyActivity.map(d => d.value))
  const greeting = getGreeting()

  return (
    <div className="space-y-6">
      {/* Welcome hero */}
      <FadeUp>
        <div className="glass-card p-6 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-accent-500/[0.06] rounded-full blur-[80px]" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-electric-400/[0.04] rounded-full blur-[60px]" />
          </div>
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-black text-white">{greeting.text}, Alex!</h2>
                <motion.span
                  className="text-2xl"
                  animate={{ rotate: [0, 15, -5, 10, 0] }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                >
                  {greeting.emoji}
                </motion.span>
              </div>
              <p className="text-surface-400 text-sm">You have 3 lessons to review, 2 quizzes ready to assign, and 1 agent awaiting approval.</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-warning-400 bg-warning-400/10 px-2.5 py-1 rounded-full">
                  <Flame className="w-3 h-3" /> 12-day streak
                </span>
                <span className="flex items-center gap-1.5 text-xs font-medium text-surface-400">
                  <Star className="w-3 h-3 text-warning-400 fill-warning-400" /> Pro Plan
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link href="/agents" className="btn-secondary flex-shrink-0 text-xs">
                  <Bot className="w-4 h-4" />
                  Agent Swarm
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link href="/magic-chat" className="btn-gradient flex-shrink-0">
                  <Sparkles className="w-4 h-4" />
                  Magic Chat
                </Link>
              </motion.div>
            </div>
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
                <span className="flex items-center gap-0.5 text-xs font-bold text-success-400">
                  <ArrowUpRight className="w-3 h-3" />
                  {s.trend}
                </span>
              </div>
              <div className="text-2xl font-black text-white">{s.value}</div>
              <div className="text-xs font-semibold text-surface-300 mt-0.5">{s.label}</div>
              <div className="text-xs text-surface-500 mt-1">{s.delta}</div>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerList>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Tools + Lessons */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Tools Grid */}
          <FadeUp delay={0.2}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white">Quick Actions</h3>
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
                    transition={{ delay: 0.25 + i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ y: -3, transition: { duration: 0.18 } }}
                  >
                    <Link href={tool.href} className="glass-card group block p-4 h-full transition-all duration-300 hover:border-accent-500/20">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 bg-gradient-to-br ${tool.gradient}`}>
                        <tool.icon className={`w-4 h-4 ${tool.iconColor}`} />
                      </div>
                      <p className="text-sm font-bold text-white">{tool.label}</p>
                      <p className="text-xs text-surface-500 mt-0.5">{tool.desc}</p>
                      <ChevronRight className="w-3.5 h-3.5 text-accent-400 mt-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </FadeUp>

          {/* Recent Lessons */}
          <FadeUp delay={0.35}>
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
                    transition={{ delay: 0.4 + i * 0.06, duration: 0.35 }}
                  >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-accent-500/10">
                      <BookOpen className="w-4 h-4 text-accent-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-surface-100 truncate">{lesson.title}</p>
                      <p className="text-xs text-surface-500">{lesson.subject} · Grade {lesson.grade} · {lesson.date}</p>
                    </div>
                    <span className={`badge ${
                      lesson.status === 'published'
                        ? 'bg-success-400/15 text-success-400'
                        : 'bg-white/[0.06] text-surface-400'
                    }`}>
                      {lesson.status}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Weekly activity spark */}
          <FadeUp delay={0.25}>
            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white">This Week</h3>
                <span className="flex items-center gap-1 text-xs font-bold text-success-400">
                  <TrendingUp className="w-3 h-3" /> Active
                </span>
              </div>
              <div className="flex items-end gap-1.5 h-20">
                {weeklyActivity.map((d, i) => (
                  <motion.div
                    key={d.day}
                    className="flex-1 flex flex-col items-center gap-1"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: 0.3 + i * 0.05, duration: 0.5 }}
                    style={{ transformOrigin: 'bottom' }}
                  >
                    <motion.div
                      className="w-full rounded-md"
                      style={{
                        height: `${Math.max((d.value / maxActivity) * 56, 4)}px`,
                        background: d.value >= 6
                          ? 'linear-gradient(180deg, #6366f1, #4f46e5)'
                          : 'rgba(255,255,255,0.06)',
                      }}
                    />
                    <span className="text-[10px] text-surface-500">{d.day}</span>
                  </motion.div>
                ))}
              </div>
              <p className="text-xs text-surface-500 mt-2 text-center">32 materials created this week</p>
            </div>
          </FadeUp>

          {/* Agent activity */}
          <FadeUp delay={0.3}>
            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Bot className="w-4 h-4 text-accent-400" /> Agent Activity
                </h3>
                <Link href="/agents" className="text-xs text-accent-400 font-semibold hover:text-accent-300">
                  View all
                </Link>
              </div>
              <div className="space-y-3">
                {agentActivity.map((a, i) => (
                  <motion.div
                    key={a.agent}
                    className="space-y-1.5"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + i * 0.06 }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-surface-200">{a.agent}</span>
                      <span className={`flex items-center gap-1 text-[10px] font-medium ${
                        a.status === 'running' ? 'text-success-400' : 'text-warning-400'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          a.status === 'running' ? 'bg-success-400 animate-pulse' : 'bg-warning-400'
                        }`} />
                        {a.status === 'running' ? 'Running' : 'Awaiting'}
                      </span>
                    </div>
                    <p className="text-[10px] text-surface-500">{a.task}</p>
                    <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-accent-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${a.progress}%` }}
                        transition={{ delay: 0.4 + i * 0.06, duration: 0.6 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </FadeUp>

          {/* Upcoming deadlines */}
          <FadeUp delay={0.35}>
            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-accent-400" /> Upcoming
                </h3>
              </div>
              <div className="space-y-2.5">
                {upcomingDeadlines.map((d, i) => (
                  <motion.div
                    key={d.title}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.06 }}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      d.urgent ? 'bg-danger-400/15' : 'bg-white/[0.06]'
                    }`}>
                      {d.urgent ? (
                        <Flame className="w-3.5 h-3.5 text-danger-400" />
                      ) : (
                        <Calendar className="w-3.5 h-3.5 text-surface-500" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-surface-100 truncate">{d.title}</p>
                      <p className="text-[10px] text-surface-500">{d.class} · {d.date}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </FadeUp>

          {/* Recent AI Generations */}
          <FadeUp delay={0.38}>
            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-accent-400" /> Recent Generations
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
          </FadeUp>

          {/* Quick navigation */}
          <FadeUp delay={0.42}>
            <div className="glass-card p-5 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-500/[0.06] via-transparent to-neon-400/[0.04] pointer-events-none" />
              <div className="relative">
                <h3 className="text-sm font-bold text-white mb-3">Explore</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { href: '/rubrics',       icon: PenTool,       label: 'Rubrics' },
                    { href: '/standards',     icon: Shield,        label: 'Standards' },
                    { href: '/communication', icon: MessageSquare, label: 'Messages' },
                    { href: '/classroom',     icon: Users,         label: 'Classroom' },
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
          </FadeUp>
        </div>
      </div>
    </div>
  )
}
