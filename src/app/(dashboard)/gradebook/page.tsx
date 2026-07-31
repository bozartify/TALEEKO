'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen, ChevronDown, Download, Filter, Plus, Search,
  TrendingUp, TrendingDown, Minus, ArrowUpDown, Sparkles,
  FileSpreadsheet, MoreHorizontal, Edit3, Trash2
} from 'lucide-react'
import { FadeUp, FadeInWhenVisible } from '@/components/ui/motion'

const classes = ['All Classes', 'AP Biology', '10th English', 'Algebra II', 'World History']

const assignments = [
  { id: '1', name: 'Essay: The Great Gatsby', type: 'Essay', maxScore: 100, weight: 20, dueDate: 'Jul 10' },
  { id: '2', name: 'Ch. 5 Quiz', type: 'Quiz', maxScore: 50, weight: 10, dueDate: 'Jul 8' },
  { id: '3', name: 'Lab Report: Photosynthesis', type: 'Lab', maxScore: 75, weight: 15, dueDate: 'Jul 5' },
  { id: '4', name: 'Midterm Exam', type: 'Exam', maxScore: 200, weight: 30, dueDate: 'Jun 28' },
  { id: '5', name: 'Group Presentation', type: 'Project', maxScore: 100, weight: 15, dueDate: 'Jun 25' },
  { id: '6', name: 'Homework Ch.4', type: 'Homework', maxScore: 20, weight: 10, dueDate: 'Jun 20' },
]

const students = [
  { id: '1', name: 'Emma Wilson', avatar: 'EW', scores: [92, 45, 68, 178, 88, 19], trend: 'up' },
  { id: '2', name: 'Liam Chen', avatar: 'LC', scores: [88, 48, 72, 185, 95, 20], trend: 'up' },
  { id: '3', name: 'Sofia Rodriguez', avatar: 'SR', scores: [78, 38, 60, 145, 82, 16], trend: 'down' },
  { id: '4', name: 'Noah Thompson', avatar: 'NT', scores: [95, 50, 74, 192, 91, 20], trend: 'up' },
  { id: '5', name: 'Ava Patel', avatar: 'AP', scores: [85, 42, 65, 168, 87, 18], trend: 'flat' },
  { id: '6', name: 'Mason Kim', avatar: 'MK', scores: [72, 35, 55, 130, 76, 14], trend: 'down' },
  { id: '7', name: 'Isabella Jones', avatar: 'IJ', scores: [90, 47, 70, 180, 93, 19], trend: 'up' },
  { id: '8', name: 'Ethan Davis', avatar: 'ED', scores: [82, 40, 62, 155, 80, 17], trend: 'flat' },
]

function getGrade(score: number, max: number): { letter: string; color: string } {
  const pct = (score / max) * 100
  if (pct >= 90) return { letter: 'A', color: '#10b981' }
  if (pct >= 80) return { letter: 'B', color: '#829c6e' }
  if (pct >= 70) return { letter: 'C', color: '#f59e0b' }
  if (pct >= 60) return { letter: 'D', color: '#f97316' }
  return { letter: 'F', color: '#ef4444' }
}

function getOverallPct(scores: number[]): number {
  const totalWeighted = scores.reduce((acc, score, i) => {
    const pct = score / assignments[i].maxScore
    return acc + pct * assignments[i].weight
  }, 0)
  const totalWeight = assignments.reduce((acc, a) => acc + a.weight, 0)
  return (totalWeighted / totalWeight) * 100
}

export default function GradebookPage() {
  const [selectedClass, setSelectedClass] = useState('All Classes')
  const [search, setSearch] = useState('')

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  )

  const classAvg = Math.round(
    students.reduce((acc, s) => acc + getOverallPct(s.scores), 0) / students.length
  )

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
              <BookOpen className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h2 className="text-xl font-black text-white">Gradebook</h2>
              <p className="text-xs text-surface-400">{students.length} students · {assignments.length} assignments · Class avg: {classAvg}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.button className="btn-gradient text-xs" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Sparkles className="w-3.5 h-3.5" />
              AI Grade Analysis
            </motion.button>
            <button className="btn-secondary text-xs px-3 py-1.5">
              <Download className="w-3.5 h-3.5" /> Export
            </button>
            <button className="btn-secondary text-xs px-3 py-1.5">
              <Plus className="w-3.5 h-3.5" /> Assignment
            </button>
          </div>
        </div>
      </FadeUp>

      <FadeUp delay={0.05}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-surface-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search students..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 text-xs rounded-full bg-white/[0.04] border border-white/[0.08] text-surface-200 placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-accent-500/40 w-52"
            />
          </div>
          <div className="flex items-center gap-2">
            {classes.map(c => (
              <button
                key={c}
                onClick={() => setSelectedClass(c)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedClass === c
                    ? 'bg-white/[0.08] text-white'
                    : 'text-surface-400 hover:text-surface-200 hover:bg-white/[0.04]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </FadeUp>

      <FadeUp delay={0.1}>
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left text-xs font-semibold text-surface-300 px-4 py-3 sticky left-0 bg-surface-900/80 backdrop-blur-sm z-10 w-48">Student</th>
                  {assignments.map(a => (
                    <th key={a.id} className="text-center text-xs font-semibold text-surface-300 px-3 py-3 min-w-[90px]">
                      <div className="flex flex-col items-center gap-0.5">
                        <span className="truncate max-w-[80px]">{a.name}</span>
                        <span className="text-[9px] text-surface-500 font-normal">/{a.maxScore}</span>
                      </div>
                    </th>
                  ))}
                  <th className="text-center text-xs font-semibold text-surface-300 px-4 py-3">Overall</th>
                  <th className="text-center text-xs font-semibold text-surface-300 px-3 py-3">Trend</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student, si) => {
                  const overall = getOverallPct(student.scores)
                  const { letter, color } = getGrade(overall, 100)
                  return (
                    <motion.tr
                      key={student.id}
                      className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: si * 0.03 }}
                    >
                      <td className="px-4 py-3 sticky left-0 bg-surface-900/60 backdrop-blur-sm z-10">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-accent-500/20 flex items-center justify-center text-[10px] font-bold text-accent-300">
                            {student.avatar}
                          </div>
                          <span className="text-sm font-medium text-white">{student.name}</span>
                        </div>
                      </td>
                      {student.scores.map((score, ai) => {
                        const { color: sc } = getGrade(score, assignments[ai].maxScore)
                        return (
                          <td key={ai} className="text-center px-3 py-3">
                            <span className="text-xs font-medium" style={{ color: sc }}>{score}</span>
                          </td>
                        )
                      })}
                      <td className="text-center px-4 py-3">
                        <span className="text-sm font-bold px-2 py-0.5 rounded" style={{ color, backgroundColor: color + '18' }}>
                          {Math.round(overall)}% {letter}
                        </span>
                      </td>
                      <td className="text-center px-3 py-3">
                        {student.trend === 'up' && <TrendingUp className="w-4 h-4 text-success-400 mx-auto" />}
                        {student.trend === 'down' && <TrendingDown className="w-4 h-4 text-danger-400 mx-auto" />}
                        {student.trend === 'flat' && <Minus className="w-4 h-4 text-surface-500 mx-auto" />}
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </FadeUp>

      <FadeInWhenVisible delay={0.15}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-card p-5">
            <h4 className="text-xs font-semibold text-surface-400 mb-3">Grade Distribution</h4>
            <div className="space-y-2">
              {['A', 'B', 'C', 'D', 'F'].map((grade, i) => {
                const counts = [3, 2, 1, 1, 1]
                const colors = ['#10b981', '#829c6e', '#f59e0b', '#f97316', '#ef4444']
                const pct = (counts[i] / students.length) * 100
                return (
                  <div key={grade} className="flex items-center gap-2">
                    <span className="text-xs font-bold w-4" style={{ color: colors[i] }}>{grade}</span>
                    <div className="flex-1 h-2 bg-white/[0.04] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: colors[i] }}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }}
                      />
                    </div>
                    <span className="text-[10px] text-surface-500 w-6 text-right">{counts[i]}</span>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="glass-card p-5">
            <h4 className="text-xs font-semibold text-surface-400 mb-3">Assignment Averages</h4>
            <div className="space-y-2">
              {assignments.slice(0, 5).map((a, i) => {
                const avg = Math.round(students.reduce((acc, s) => acc + s.scores[i], 0) / students.length)
                const pct = (avg / a.maxScore) * 100
                const { color } = getGrade(avg, a.maxScore)
                return (
                  <div key={a.id} className="flex items-center gap-2">
                    <span className="text-[10px] text-surface-400 w-20 truncate">{a.name}</span>
                    <div className="flex-1 h-2 bg-white/[0.04] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }}
                      />
                    </div>
                    <span className="text-[10px] font-medium" style={{ color }}>{Math.round(pct)}%</span>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="glass-card p-5">
            <h4 className="text-xs font-semibold text-surface-400 mb-3">Quick Stats</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-surface-400">Highest Score</span>
                <span className="text-sm font-bold text-success-400">96%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-surface-400">Lowest Score</span>
                <span className="text-sm font-bold text-danger-400">65%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-surface-400">Class Average</span>
                <span className="text-sm font-bold text-white">{classAvg}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-surface-400">Missing Work</span>
                <span className="text-sm font-bold text-warning-400">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-surface-400">At-Risk Students</span>
                <span className="text-sm font-bold text-danger-400">2</span>
              </div>
            </div>
          </div>
        </div>
      </FadeInWhenVisible>
    </div>
  )
}
