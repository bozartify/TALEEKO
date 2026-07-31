'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Award, BookOpen, Clock, Star, Play, Check, Lock,
  TrendingUp, Target, Users, ChevronRight, Sparkles
} from 'lucide-react'
import { FadeUp, FadeInWhenVisible } from '@/components/ui/motion'

const courses = [
  {
    id: '1', title: 'AI in the Classroom: A Teacher\'s Guide', category: 'AI & Technology',
    duration: '4 hours', modules: 8, enrolled: 2400, rating: 4.9,
    progress: 75, color: '#dd9a33', status: 'in-progress' as const,
    instructor: 'Dr. Maria Santos',
  },
  {
    id: '2', title: 'Differentiated Instruction Mastery', category: 'Pedagogy',
    duration: '6 hours', modules: 12, enrolled: 1800, rating: 4.8,
    progress: 100, color: '#10b981', status: 'completed' as const,
    instructor: 'Prof. James Walker',
  },
  {
    id: '3', title: 'Data-Driven Decision Making', category: 'Assessment',
    duration: '3 hours', modules: 6, enrolled: 950, rating: 4.7,
    progress: 30, color: '#f97316', status: 'in-progress' as const,
    instructor: 'Dr. Lisa Chang',
  },
  {
    id: '4', title: 'Social-Emotional Learning Integration', category: 'SEL',
    duration: '5 hours', modules: 10, enrolled: 3200, rating: 4.9,
    progress: 0, color: '#ec4899', status: 'not-started' as const,
    instructor: 'Dr. Amir Hassan',
  },
  {
    id: '5', title: 'Project-Based Learning Design', category: 'Pedagogy',
    duration: '4 hours', modules: 8, enrolled: 1500, rating: 4.6,
    progress: 0, color: '#829c6e', status: 'not-started' as const,
    instructor: 'Sarah Kim, M.Ed.',
  },
  {
    id: '6', title: 'Inclusive Classroom Strategies', category: 'Special Education',
    duration: '5 hours', modules: 10, enrolled: 2100, rating: 4.8,
    progress: 0, color: '#b0623f', status: 'not-started' as const,
    instructor: 'Dr. Rachel Moore',
  },
]

const achievements = [
  { title: 'AI Pioneer', desc: 'Completed AI in the Classroom', icon: '🤖', earned: true },
  { title: 'Differentiation Expert', desc: 'Mastered DI strategies', icon: '🎯', earned: true },
  { title: 'Data Whiz', desc: 'Complete data-driven course', icon: '📊', earned: false },
  { title: 'SEL Champion', desc: 'Complete SEL integration', icon: '💚', earned: false },
  { title: 'PBL Designer', desc: 'Complete PBL course', icon: '🏗️', earned: false },
  { title: 'Master Educator', desc: 'Complete all courses', icon: '🏆', earned: false },
]

export default function ProfessionalDevPage() {
  const [filter, setFilter] = useState<'all' | 'in-progress' | 'completed' | 'not-started'>('all')

  const filtered = filter === 'all' ? courses : courses.filter(c => c.status === filter)
  const totalHours = courses.filter(c => c.status === 'completed').reduce((acc, c) => acc + parseInt(c.duration), 0)
  const completedCount = courses.filter(c => c.status === 'completed').length

  return (
    <div className="space-y-6">
      <FadeUp>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
              whileHover={{ rotate: 8, scale: 1.08 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <Award className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h2 className="text-xl font-black text-white">Professional Development</h2>
              <p className="text-xs text-surface-400">{courses.length} courses · {totalHours} hours completed · {completedCount} certifications</p>
            </div>
          </div>
          <motion.button className="btn-gradient text-xs" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Sparkles className="w-3.5 h-3.5" /> AI Recommendations
          </motion.button>
        </div>
      </FadeUp>

      <FadeUp delay={0.05}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Courses Completed', value: completedCount, icon: Check, color: '#10b981' },
            { label: 'Hours Logged', value: totalHours, icon: Clock, color: '#dd9a33' },
            { label: 'Certificates', value: completedCount, icon: Award, color: '#f59e0b' },
            { label: 'Current Streak', value: '12 days', icon: TrendingUp, color: '#ec4899' },
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

      <FadeUp delay={0.08}>
        <div className="glass-card p-5">
          <h3 className="text-sm font-bold text-white mb-3">Achievements</h3>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {achievements.map((a, i) => (
              <motion.div
                key={a.title}
                className={`flex-shrink-0 w-24 text-center p-3 rounded-xl border transition-all ${
                  a.earned ? 'bg-white/[0.04] border-white/[0.08]' : 'bg-white/[0.02] border-white/[0.04] opacity-50'
                }`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: a.earned ? 1 : 0.5, scale: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <span className="text-2xl block mb-1">{a.icon}</span>
                <p className="text-[10px] font-bold text-white truncate">{a.title}</p>
                {a.earned && <Check className="w-3 h-3 text-success-400 mx-auto mt-1" />}
                {!a.earned && <Lock className="w-3 h-3 text-surface-600 mx-auto mt-1" />}
              </motion.div>
            ))}
          </div>
        </div>
      </FadeUp>

      <FadeUp delay={0.1}>
        <div className="flex items-center gap-2">
          {(['all', 'in-progress', 'completed', 'not-started'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                filter === f ? 'bg-white/[0.08] text-white' : 'text-surface-400 hover:text-surface-200 hover:bg-white/[0.04]'
              }`}
            >
              {f === 'all' ? 'All Courses' : f === 'in-progress' ? 'In Progress' : f === 'completed' ? 'Completed' : 'Not Started'}
            </button>
          ))}
        </div>
      </FadeUp>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((course, i) => (
          <motion.div
            key={course.id}
            className="glass-card overflow-hidden group cursor-pointer"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 + i * 0.05 }}
            whileHover={{ y: -3, transition: { duration: 0.18 } }}
          >
            <div className="h-1.5" style={{ backgroundColor: course.color }} />
            <div className="p-5">
              <div className="flex items-start justify-between mb-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: course.color + '18', color: course.color }}>
                  {course.category}
                </span>
                <div className="flex items-center gap-0.5">
                  <Star className="w-3 h-3 text-warning-400 fill-warning-400" />
                  <span className="text-xs text-surface-300">{course.rating}</span>
                </div>
              </div>
              <h4 className="text-sm font-bold text-white mb-1 group-hover:text-accent-400 transition-colors">{course.title}</h4>
              <p className="text-xs text-surface-500 mb-3">by {course.instructor}</p>
              <div className="flex items-center gap-3 text-xs text-surface-400 mb-3">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{course.duration}</span>
                <span>{course.modules} modules</span>
                <span className="flex items-center gap-1"><Users className="w-3 h-3" />{course.enrolled.toLocaleString()}</span>
              </div>
              {course.progress > 0 && (
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-surface-500">Progress</span>
                    <span className="text-[10px] text-surface-400">{course.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: course.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${course.progress}%` }}
                      transition={{ delay: 0.3, duration: 0.6 }}
                    />
                  </div>
                </div>
              )}
              <button className={`w-full text-xs font-semibold py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                course.status === 'completed' ? 'bg-success-500/15 text-success-400' :
                course.status === 'in-progress' ? 'btn-primary' : 'btn-secondary'
              }`}>
                {course.status === 'completed' ? <><Check className="w-3.5 h-3.5" /> Completed</> :
                 course.status === 'in-progress' ? <><Play className="w-3.5 h-3.5" /> Continue</> :
                 <><Play className="w-3.5 h-3.5" /> Start Course</>}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
