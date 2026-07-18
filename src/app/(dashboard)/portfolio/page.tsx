'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GraduationCap, Award, TrendingUp, Star, BookOpen, Target,
  ChevronRight, Download, Share2, Filter, Search, BarChart2,
  Clock, Flame, Trophy, Medal, Zap, Heart, Brain, Users,
  FileText, CheckCircle2
} from 'lucide-react'
import { FadeUp, StaggerList, StaggerItem, fadeUp, FadeInWhenVisible } from '@/components/ui/motion'

const students = [
  {
    id: '1', name: 'Emma Rodriguez', grade: '7th', class: 'Science',
    avg: 92, trend: 'up' as const, streak: 15, awards: 3,
    avatar: 'ER', color: '#8b5cf6',
    skills: [
      { name: 'Scientific Method', level: 95 },
      { name: 'Lab Safety', level: 90 },
      { name: 'Data Analysis', level: 88 },
      { name: 'Critical Thinking', level: 92 },
      { name: 'Written Communication', level: 85 },
    ],
    achievements: ['Lab Report Excellence', 'Science Fair Finalist', 'Perfect Attendance'],
    recentWork: [
      { title: 'Photosynthesis Lab Report', score: 95, date: 'Oct 12' },
      { title: 'Ecosystem Quiz', score: 88, date: 'Oct 8' },
      { title: 'Cell Structure Worksheet', score: 92, date: 'Oct 3' },
    ],
    growth: [65, 72, 78, 82, 85, 88, 90, 92],
  },
  {
    id: '2', name: 'James Kim', grade: '8th', class: 'History',
    avg: 87, trend: 'up' as const, streak: 8, awards: 2,
    avatar: 'JK', color: '#f97316',
    skills: [
      { name: 'Historical Analysis', level: 90 },
      { name: 'Essay Writing', level: 85 },
      { name: 'Source Evaluation', level: 82 },
      { name: 'Argumentation', level: 88 },
      { name: 'Research Skills', level: 80 },
    ],
    achievements: ['Essay Contest Winner', 'History Buff Badge'],
    recentWork: [
      { title: 'American Revolution Essay', score: 90, date: 'Oct 10' },
      { title: 'Primary Source Analysis', score: 85, date: 'Oct 5' },
      { title: 'Chapter 6 Quiz', score: 82, date: 'Oct 1' },
    ],
    growth: [70, 73, 75, 78, 80, 83, 85, 87],
  },
  {
    id: '3', name: 'Aisha Thompson', grade: '9th', class: 'Math',
    avg: 95, trend: 'up' as const, streak: 22, awards: 5,
    avatar: 'AT', color: '#14b8a6',
    skills: [
      { name: 'Problem Solving', level: 98 },
      { name: 'Algebraic Thinking', level: 95 },
      { name: 'Geometric Reasoning', level: 92 },
      { name: 'Mathematical Communication', level: 90 },
      { name: 'Computational Fluency', level: 96 },
    ],
    achievements: ['Math Olympiad Gold', 'Perfect Score Streak', 'Peer Tutor', 'Problem of the Week Champion', 'Honor Roll'],
    recentWork: [
      { title: 'Quadratic Equations Test', score: 98, date: 'Oct 14' },
      { title: 'Systems of Equations HW', score: 95, date: 'Oct 9' },
      { title: 'Linear Functions Quiz', score: 92, date: 'Oct 4' },
    ],
    growth: [80, 83, 86, 88, 90, 92, 94, 95],
  },
]

const overallStats = [
  { label: 'Total Students', value: '113', icon: Users, color: 'bg-brand-100 text-brand-600' },
  { label: 'Avg Performance', value: '84%', icon: Target, color: 'bg-emerald-100 text-emerald-600' },
  { label: 'Growth Rate', value: '+12%', icon: TrendingUp, color: 'bg-sky-100 text-sky-600' },
  { label: 'Awards Given', value: '47', icon: Trophy, color: 'bg-amber-100 text-amber-600' },
]

export default function PortfolioPage() {
  const [selectedStudent, setSelectedStudent] = useState(students[0])
  const [search, setSearch] = useState('')

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <FadeUp>
        <div className="hero-mesh rounded-3xl p-6 border border-slate-100">
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
                <h2 className="text-xl font-black text-slate-900">Student Portfolios</h2>
                <p className="text-xs text-slate-500">Track growth, skills, and achievements for every student</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="btn-secondary text-xs px-3 py-1.5">
                <Download className="w-3 h-3" /> Export
              </button>
              <button className="btn-secondary text-xs px-3 py-1.5">
                <Share2 className="w-3 h-3" /> Share
              </button>
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
              <div className="text-xl font-black text-slate-900">{s.value}</div>
              <div className="text-xs text-slate-500">{s.label}</div>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerList>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Student list */}
        <FadeUp delay={0.15}>
          <div className="lg:col-span-1">
            <div className="relative mb-3">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search students..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 text-xs rounded-full border border-slate-200 bg-white text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 w-full"
              />
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
              {filtered.map((s, i) => (
                <motion.button
                  key={s.id}
                  className={`w-full flex items-center gap-3 p-4 text-left hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 ${
                    selectedStudent.id === s.id ? 'bg-brand-50' : ''
                  }`}
                  onClick={() => setSelectedStudent(s)}
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
                    <p className="text-sm font-semibold text-slate-900 truncate">{s.name}</p>
                    <p className="text-xs text-slate-400">{s.grade} · {s.class}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-bold ${
                      s.avg >= 90 ? 'text-emerald-600' : s.avg >= 80 ? 'text-brand-600' : 'text-amber-600'
                    }`}>{s.avg}%</span>
                    <div className="flex items-center gap-0.5 justify-end">
                      <TrendingUp className="w-2.5 h-2.5 text-emerald-500" />
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </FadeUp>

        {/* Portfolio detail */}
        <FadeUp delay={0.2}>
          <div className="lg:col-span-3 space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedStudent.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="space-y-4"
              >
                {/* Student header */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-5">
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-lg font-black"
                      style={{ background: `linear-gradient(135deg,${selectedStudent.color},${selectedStudent.color}cc)` }}
                    >
                      {selectedStudent.avatar}
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900">{selectedStudent.name}</h3>
                      <p className="text-sm text-slate-500">{selectedStudent.grade} Grade · {selectedStudent.class}</p>
                    </div>
                    <div className="ml-auto flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-black text-brand-600">{selectedStudent.avg}%</p>
                        <p className="text-[10px] text-slate-400">Average</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-black text-amber-500 flex items-center gap-1">
                          <Flame className="w-5 h-5" />{selectedStudent.streak}
                        </p>
                        <p className="text-[10px] text-slate-400">Day Streak</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-black text-emerald-600">{selectedStudent.awards}</p>
                        <p className="text-[10px] text-slate-400">Awards</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Skills */}
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-5">
                    <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Brain className="w-4 h-4 text-brand-500" /> Skills Assessment
                    </h4>
                    <div className="space-y-3">
                      {selectedStudent.skills.map((skill, i) => (
                        <motion.div
                          key={skill.name}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-slate-700">{skill.name}</span>
                            <span className="text-xs font-bold" style={{ color: selectedStudent.color }}>{skill.level}%</span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${skill.level}%` }}
                              transition={{ delay: 0.2 + i * 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                              style={{ backgroundColor: selectedStudent.color }}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Growth chart */}
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-5">
                    <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-500" /> Growth Over Time
                    </h4>
                    <div className="flex items-end gap-2 h-32">
                      {selectedStudent.growth.map((val, i) => (
                        <motion.div
                          key={i}
                          className="flex-1 flex flex-col items-center gap-1"
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: 1 }}
                          transition={{ delay: 0.2 + i * 0.05, duration: 0.5 }}
                          style={{ transformOrigin: 'bottom' }}
                        >
                          <span className="text-[10px] font-bold" style={{ color: selectedStudent.color }}>{val}</span>
                          <motion.div
                            className="w-full rounded-t-md"
                            style={{
                              height: `${(val / 100) * 90}px`,
                              background: `linear-gradient(180deg, ${selectedStudent.color}, ${selectedStudent.color}88)`,
                            }}
                          />
                          <span className="text-[10px] text-slate-400">W{i + 1}</span>
                        </motion.div>
                      ))}
                    </div>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      <TrendingUp className="w-3 h-3 text-emerald-500" />
                      <span className="text-xs font-bold text-emerald-600">
                        +{selectedStudent.growth[selectedStudent.growth.length - 1] - selectedStudent.growth[0]}% improvement
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Achievements */}
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-5">
                    <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-amber-500" /> Achievements
                    </h4>
                    <div className="space-y-2">
                      {selectedStudent.achievements.map((ach, i) => (
                        <motion.div
                          key={ach}
                          className="flex items-center gap-3 p-2.5 bg-amber-50 rounded-xl"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.1 + i * 0.06 }}
                        >
                          <Medal className="w-4 h-4 text-amber-500 flex-shrink-0" />
                          <span className="text-xs font-semibold text-amber-800">{ach}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Recent work */}
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-5">
                    <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-brand-500" /> Recent Work
                    </h4>
                    <div className="space-y-2">
                      {selectedStudent.recentWork.map((work, i) => (
                        <motion.div
                          key={work.title}
                          className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl"
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.06 }}
                        >
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                            <div>
                              <p className="text-xs font-semibold text-slate-900">{work.title}</p>
                              <p className="text-[10px] text-slate-400">{work.date}</p>
                            </div>
                          </div>
                          <span className={`text-sm font-bold ${
                            work.score >= 90 ? 'text-emerald-600' : work.score >= 80 ? 'text-brand-600' : 'text-amber-600'
                          }`}>{work.score}%</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </FadeUp>
      </div>
    </div>
  )
}
