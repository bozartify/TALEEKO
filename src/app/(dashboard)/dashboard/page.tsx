'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  BookOpen, ClipboardList, FileText, Zap, BarChart2, Sparkles,
  ChevronRight, Users, Clock
} from 'lucide-react'
import { FadeUp, StaggerList, StaggerItem, fadeUp } from '@/components/ui/motion'

const stats = [
  { label: 'Lessons Created',   value: '24',   delta: '+3 this week',       icon: BookOpen,      color: 'bg-brand-100 text-brand-600' },
  { label: 'Quizzes Generated', value: '18',   delta: '+5 this week',       icon: ClipboardList, color: 'bg-orange-100 text-orange-600' },
  { label: 'Students Reached',  value: '142',  delta: 'Across 4 classes',   icon: Users,         color: 'bg-emerald-100 text-emerald-600' },
  { label: 'Hours Saved',       value: '31h',  delta: 'This month',         icon: Clock,         color: 'bg-sky-100 text-sky-600' },
]

const tools = [
  { href: '/magic-chat?mode=lesson',    icon: BookOpen,      label: 'Lesson Plan',   desc: 'Create a full lesson',     color: 'bg-brand-100 text-brand-600' },
  { href: '/magic-chat?mode=quiz',      icon: ClipboardList, label: 'Quiz',          desc: 'Generate an assessment',   color: 'bg-orange-100 text-orange-600' },
  { href: '/magic-chat?mode=worksheet', icon: FileText,      label: 'Worksheet',     desc: 'Build practice materials', color: 'bg-emerald-100 text-emerald-600' },
  { href: '/magic-chat?mode=activity',  icon: Zap,           label: 'Activity',      desc: 'Design a class activity',  color: 'bg-amber-100 text-amber-600' },
  { href: '/analytics',                 icon: BarChart2,     label: 'Analytics',     desc: 'Review lesson insights',   color: 'bg-sky-100 text-sky-600' },
  { href: '/magic-chat',                icon: Sparkles,      label: 'Magic Chat',    desc: 'Open AI co-teacher',       color: 'bg-rose-100 text-rose-600' },
]

const recentLessons = [
  { title: 'Introduction to Photosynthesis', subject: 'Biology', grade: '7th',  status: 'published', date: 'Today' },
  { title: 'The American Revolution',        subject: 'History', grade: '8th',  status: 'draft',     date: 'Yesterday' },
  { title: 'Quadratic Equations',            subject: 'Math',    grade: '9th',  status: 'published', date: '2 days ago' },
  { title: 'Shakespeare: Romeo & Juliet',    subject: 'English', grade: '10th', status: 'draft',     date: '3 days ago' },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome hero */}
      <FadeUp>
        <div className="hero-mesh rounded-3xl p-6 border border-slate-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-1">Good morning, Alex! ☀️</h2>
              <p className="text-slate-500 text-sm">You have 3 lessons to review and 2 quizzes ready to assign.</p>
            </div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link href="/magic-chat" className="btn-gradient flex-shrink-0">
                <Sparkles className="w-4 h-4" />
                Open Magic Chat
              </Link>
            </motion.div>
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
              <div className={`icon-bubble ${s.color} mb-3`}>
                <s.icon className="w-5 h-5" />
              </div>
              <div className="text-2xl font-black text-slate-900">{s.value}</div>
              <div className="text-xs font-semibold text-slate-700 mt-0.5">{s.label}</div>
              <div className="text-xs text-slate-400 mt-1">{s.delta}</div>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerList>

      {/* AI Tools Grid */}
      <FadeUp delay={0.2}>
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900">AI Tools</h3>
            <Link href="/workspace" className="text-xs text-brand-600 font-semibold hover:text-brand-700 flex items-center gap-1">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {tools.map((tool, i) => (
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
                whileHover={{ backgroundColor: '#f8fafc' }}
              >
                <div className="icon-bubble bg-brand-50 text-brand-500">
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
  )
}
