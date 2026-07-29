'use client'
import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft, BookOpen, Plus, Clock, ChevronRight, Sparkles,
  Users, Calendar, Target, Edit3, BarChart2, GripVertical
} from 'lucide-react'
import { FadeUp } from '@/components/ui/motion'

const courseInfo = {
  title: '7th Grade Biology',
  subject: 'Science',
  grade: 'Grade 7',
  term: 'Fall 2026',
  students: 28,
  description: 'A comprehensive biology course covering cellular biology, genetics, evolution, ecology, and human body systems. Aligned to NGSS standards with hands-on labs and AI-powered differentiation.',
  standards: ['MS-LS1-1', 'MS-LS1-2', 'MS-LS1-3', 'MS-LS3-1', 'MS-LS4-1'],
  schedule: [
    { day: 'Mon/Wed/Fri', time: '9:00 - 9:50 AM', room: 'Room 204' },
    { day: 'Tue/Thu', time: '10:15 - 11:05 AM', room: 'Lab 3B' },
  ],
}

const lessons = [
  { id: '1', title: 'Introduction to Cells', duration: 45, status: 'published' as const, materials: 3, type: 'Lecture + Lab' },
  { id: '2', title: 'Cell Structure and Organelles', duration: 50, status: 'published' as const, materials: 4, type: 'Interactive' },
  { id: '3', title: 'Photosynthesis', duration: 60, status: 'published' as const, materials: 5, type: 'Lab' },
  { id: '4', title: 'Cellular Respiration', duration: 55, status: 'draft' as const, materials: 2, type: 'Lecture' },
  { id: '5', title: 'DNA and Genetics', duration: 60, status: 'draft' as const, materials: 1, type: 'Lecture + Activity' },
  { id: '6', title: 'Ecosystems and Food Webs', duration: 45, status: 'draft' as const, materials: 0, type: 'Project' },
]

const recentStudents = [
  { name: 'Emma Davis', grade: 'A', trend: 'up' },
  { name: 'Liam Chen', grade: 'B+', trend: 'up' },
  { name: 'Sofia Rodriguez', grade: 'A-', trend: 'stable' },
  { name: 'Noah Williams', grade: 'B', trend: 'down' },
]

export default function CourseDetailPage({ params }: { params: { courseId: string } }) {
  const publishedCount = lessons.filter(l => l.status === 'published').length
  const progressPct = Math.round((publishedCount / lessons.length) * 100)

  return (
    <div className="space-y-6">
      <FadeUp>
        <div className="flex items-center gap-3">
          <Link href="/courses" className="text-surface-500 hover:text-surface-300 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex-1">
            <h2 className="text-xl font-black text-white">{courseInfo.title}</h2>
            <p className="text-xs text-surface-400">{courseInfo.subject} · {courseInfo.grade} · {lessons.length} lessons</p>
          </div>
          <button className="btn-secondary text-xs"><Edit3 className="w-3.5 h-3.5" /> Edit</button>
          <Link href="/magic-chat?mode=lesson" className="btn-gradient text-xs">
            <Sparkles className="w-4 h-4" /> Generate Lesson
          </Link>
        </div>
      </FadeUp>

      <FadeUp delay={0.05}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Students', value: courseInfo.students, icon: Users, color: '#6366f1' },
            { label: 'Lessons', value: lessons.length, icon: BookOpen, color: '#14b8a6' },
            { label: 'Standards', value: courseInfo.standards.length, icon: Target, color: '#f97316' },
            { label: 'Published', value: `${progressPct}%`, icon: BarChart2, color: '#10b981' },
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
            </motion.div>
          ))}
        </div>
      </FadeUp>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <FadeUp delay={0.08} className="lg:col-span-2">
          <div className="glass-card p-5">
            <h3 className="text-sm font-bold text-white mb-2">About This Course</h3>
            <p className="text-sm text-surface-400 leading-relaxed mb-4">{courseInfo.description}</p>
            <div className="flex flex-wrap gap-1.5">
              {courseInfo.standards.map(s => (
                <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-accent-500/15 text-accent-400 font-medium">{s}</span>
              ))}
            </div>
          </div>
        </FadeUp>

        <FadeUp delay={0.1}>
          <div className="glass-card p-5">
            <h3 className="text-sm font-bold text-white mb-3">Schedule</h3>
            <div className="space-y-3">
              {courseInfo.schedule.map(s => (
                <div key={s.day} className="flex items-center gap-3 p-3 bg-white/[0.03] rounded-xl">
                  <Calendar className="w-4 h-4 text-accent-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-white">{s.day}</p>
                    <p className="text-[11px] text-surface-500">{s.time} · {s.room}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeUp>
      </div>

      <FadeUp delay={0.12}>
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-white">Course Progress</span>
            <span className="text-sm text-accent-400 font-bold">{progressPct}% published</span>
          </div>
          <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)' }}
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ delay: 0.3, duration: 0.6 }}
            />
          </div>
          <div className="flex gap-4 mt-3 text-xs text-surface-400">
            <span className="text-success-400 font-medium">{publishedCount} published</span>
            <span>{lessons.length - publishedCount} drafts</span>
          </div>
        </div>
      </FadeUp>

      <FadeUp delay={0.14}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-white">Lessons</h3>
          <button className="btn-secondary text-xs"><Plus className="w-3.5 h-3.5" /> Add Lesson</button>
        </div>
        <div className="glass-card overflow-hidden">
          {lessons.map((lesson, i) => (
            <Link
              key={lesson.id}
              href={`/courses/${params.courseId}/lessons/${lesson.id}`}
              className={`flex items-center gap-4 px-5 py-4 hover:bg-white/[0.04] transition-colors group ${
                i < lessons.length - 1 ? 'border-b border-white/[0.06]' : ''
              }`}
            >
              <GripVertical className="w-3.5 h-3.5 text-surface-600 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              <div className="w-7 h-7 rounded-lg bg-accent-500/15 text-accent-400 text-xs font-bold flex items-center justify-center flex-shrink-0">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate group-hover:text-accent-400 transition-colors">{lesson.title}</p>
                <div className="flex items-center gap-3 mt-0.5 text-xs text-surface-500">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{lesson.duration} min</span>
                  <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{lesson.materials} materials</span>
                  <span>{lesson.type}</span>
                </div>
              </div>
              <span className={`badge ${
                lesson.status === 'published' ? 'bg-success-400/15 text-success-400' : 'bg-white/[0.06] text-surface-400'
              }`}>{lesson.status}</span>
              <ChevronRight className="w-4 h-4 text-surface-500 group-hover:text-accent-400 transition-colors" />
            </Link>
          ))}
        </div>
      </FadeUp>

      <FadeUp delay={0.16}>
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white">Top Students</h3>
            <Link href="/classroom" className="text-xs text-accent-400 font-semibold hover:text-accent-300">View All</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {recentStudents.map((s, i) => (
              <motion.div
                key={s.name}
                className="p-3 bg-white/[0.03] rounded-xl text-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + i * 0.05 }}
              >
                <div
                  className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #a78bfa)' }}
                >
                  {s.name.split(' ').map(n => n[0]).join('')}
                </div>
                <p className="text-xs font-semibold text-white truncate">{s.name}</p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <span className="text-sm font-black text-accent-400">{s.grade}</span>
                  <span className={`text-[10px] ${s.trend === 'up' ? 'text-success-400' : s.trend === 'down' ? 'text-danger-400' : 'text-surface-500'}`}>
                    {s.trend === 'up' ? '↑' : s.trend === 'down' ? '↓' : '→'}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </FadeUp>
    </div>
  )
}
