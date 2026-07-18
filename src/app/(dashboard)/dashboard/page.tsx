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
  { label: 'Lessons Created',   value: '24',   delta: '+3 this week',       icon: BookOpen,      color: 'bg-brand-100 text-brand-600',   trend: '+14%' },
  { label: 'Quizzes Generated', value: '18',   delta: '+5 this week',       icon: ClipboardList, color: 'bg-orange-100 text-orange-600',  trend: '+22%' },
  { label: 'Students Reached',  value: '142',  delta: 'Across 4 classes',   icon: Users,         color: 'bg-emerald-100 text-emerald-600', trend: '+3%' },
  { label: 'Hours Saved',       value: '31h',  delta: 'This month',         icon: Clock,         color: 'bg-sky-100 text-sky-600',        trend: '+8h' },
]

const quickTools = [
  { href: '/magic-chat?mode=lesson',    icon: BookOpen,      label: 'Lesson Plan',   desc: 'Create a full lesson',     color: 'bg-brand-100 text-brand-600' },
  { href: '/magic-chat?mode=quiz',      icon: ClipboardList, label: 'Quiz',          desc: 'Generate an assessment',   color: 'bg-orange-100 text-orange-600' },
  { href: '/magic-chat?mode=worksheet', icon: FileText,      label: 'Worksheet',     desc: 'Build practice materials', color: 'bg-emerald-100 text-emerald-600' },
  { href: '/magic-chat?mode=activity',  icon: Zap,           label: 'Activity',      desc: 'Design a class activity',  color: 'bg-amber-100 text-amber-600' },
  { href: '/analytics',                 icon: BarChart2,     label: 'Analytics',     desc: 'Review lesson insights',   color: 'bg-sky-100 text-sky-600' },
  { href: '/magic-chat',                icon: Sparkles,      label: 'Magic Chat',    desc: 'Open AI co-teacher',       color: 'bg-rose-100 text-rose-600' },
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

const weeklyActivity = [
  { day: 'Mon', value: 4 }, { day: 'Tue', value: 7 },
  { day: 'Wed', value: 3 }, { day: 'Thu', value: 9 },
  { day: 'Fri', value: 6 }, { day: 'Sat', value: 2 },
  { day: 'Sun', value: 1 },
]

export default function DashboardPage() {
  const maxActivity = Math.max(...weeklyActivity.map(d => d.value))

  return (
    <div className="space-y-6">
      {/* Welcome hero */}
      <FadeUp>
        <div className="hero-mesh rounded-3xl p-6 border border-slate-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-black text-slate-900">Good morning, Alex!</h2>
                <motion.span
                  className="text-2xl"
                  animate={{ rotate: [0, 15, -5, 10, 0] }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                >
                  ☀️
                </motion.span>
              </div>
              <p className="text-slate-500 text-sm">You have 3 lessons to review, 2 quizzes ready to assign, and 1 agent awaiting approval.</p>
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
              className="stat-card h-full"
              whileHover={{ y: -3, boxShadow: '0 8px 30px rgba(139,92,246,0.12)', transition: { duration: 0.2 } }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`icon-bubble ${s.color}`}>
                  <s.icon className="w-5 h-5" />
                </div>
                <span className="flex items-center gap-0.5 text-xs font-bold text-emerald-600">
                  <ArrowUpRight className="w-3 h-3" />
                  {s.trend}
                </span>
              </div>
              <div className="text-2xl font-black text-slate-900">{s.value}</div>
              <div className="text-xs font-semibold text-slate-700 mt-0.5">{s.label}</div>
              <div className="text-xs text-slate-400 mt-1">{s.delta}</div>
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
                <h3 className="text-base font-bold text-slate-900">Quick Actions</h3>
                <Link href="/workspace" className="text-xs text-brand-600 font-semibold hover:text-brand-700 flex items-center gap-1">
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
                    <Link href={tool.href} className="tool-card group block h-full">
                      <div className={`icon-bubble ${tool.color} mb-3`}>
                        <tool.icon className="w-4 h-4" />
                      </div>
                      <p className="text-sm font-bold text-slate-900">{tool.label}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{tool.desc}</p>
                      <ChevronRight className="w-3.5 h-3.5 text-brand-400 mt-3 opacity-0 group-hover:opacity-100 transition-opacity" />
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
                <h3 className="text-base font-bold text-slate-900">Recent Lessons</h3>
                <Link href="/courses" className="text-xs text-brand-600 font-semibold hover:text-brand-700 flex items-center gap-1">
                  View all <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
                {recentLessons.map((lesson, i) => (
                  <motion.div
                    key={lesson.title}
                    className={`flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors cursor-pointer ${i < recentLessons.length - 1 ? 'border-b border-slate-100' : ''}`}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.06, duration: 0.35 }}
                  >
                    <div className="icon-bubble bg-brand-50 text-brand-500 w-9 h-9">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{lesson.title}</p>
                      <p className="text-xs text-slate-400">{lesson.subject} · Grade {lesson.grade} · {lesson.date}</p>
                    </div>
                    <span className={`badge ${
                      lesson.status === 'published'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-500'
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
            <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900">This Week</h3>
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
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
                        background: d.value >= 6 ? 'linear-gradient(180deg,#8b5cf6,#6d28d9)' : '#e2e8f0',
                      }}
                    />
                    <span className="text-[10px] text-slate-400">{d.day}</span>
                  </motion.div>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-2 text-center">32 materials created this week</p>
            </div>
          </FadeUp>

          {/* Agent activity */}
          <FadeUp delay={0.3}>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Bot className="w-4 h-4 text-brand-500" /> Agent Activity
                </h3>
                <Link href="/agents" className="text-xs text-brand-600 font-semibold hover:text-brand-700">
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
                      <span className="text-xs font-semibold text-slate-700">{a.agent}</span>
                      <span className={`flex items-center gap-1 text-[10px] font-medium ${
                        a.status === 'running' ? 'text-emerald-600' : 'text-amber-600'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          a.status === 'running' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                        }`} />
                        {a.status === 'running' ? 'Running' : 'Awaiting'}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400">{a.task}</p>
                    <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-brand-500"
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
            <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-brand-500" /> Upcoming
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
                      d.urgent ? 'bg-red-100' : 'bg-slate-100'
                    }`}>
                      {d.urgent ? (
                        <Flame className="w-3.5 h-3.5 text-red-500" />
                      ) : (
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-900 truncate">{d.title}</p>
                      <p className="text-[10px] text-slate-400">{d.class} · {d.date}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </FadeUp>

          {/* Quick navigation */}
          <FadeUp delay={0.4}>
            <div className="bg-gradient-to-br from-brand-50 to-purple-50 rounded-2xl border border-brand-100 p-5">
              <h3 className="text-sm font-bold text-slate-900 mb-3">Explore</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { href: '/rubrics',       icon: PenTool,        label: 'Rubrics' },
                  { href: '/standards',     icon: Shield,         label: 'Standards' },
                  { href: '/communication', icon: MessageSquare,  label: 'Messages' },
                  { href: '/classroom',     icon: Users,          label: 'Classroom' },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.45 + i * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      className="flex items-center gap-2 p-2.5 bg-white/70 rounded-xl text-xs font-semibold text-slate-700 hover:bg-white hover:shadow-sm transition-all"
                    >
                      <item.icon className="w-3.5 h-3.5 text-brand-500" />
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </div>
  )
}
