'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckSquare, Check, X, Clock, Circle, ChevronLeft, ChevronRight,
  Download, TrendingUp, Users, BarChart2
} from 'lucide-react'
import { FadeUp, FadeInWhenVisible } from '@/components/ui/motion'

type Status = 'present' | 'absent' | 'late' | 'excused'

const statusCycle: Status[] = ['present', 'absent', 'late', 'excused']

const statusConfig: Record<Status, { icon: typeof Check; label: string; colorClass: string; bgClass: string; hex: string }> = {
  present: { icon: Check, label: 'P', colorClass: 'text-success-400', bgClass: 'bg-success-400/15', hex: '#10b981' },
  absent:  { icon: X, label: 'A', colorClass: 'text-danger-400', bgClass: 'bg-danger-400/15', hex: '#ef4444' },
  late:    { icon: Clock, label: 'L', colorClass: 'text-warning-400', bgClass: 'bg-warning-400/15', hex: '#f59e0b' },
  excused: { icon: Circle, label: 'E', colorClass: 'text-electric-400', bgClass: 'bg-electric-400/15', hex: '#829c6e' },
}

const classes = ['AP Biology', '10th English', 'Algebra II']

const studentNames = [
  'Emma Wilson', 'Liam Chen', 'Sofia Rodriguez', 'Noah Thompson',
  'Ava Patel', 'Mason Kim', 'Isabella Jones', 'Ethan Davis',
]

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('')
}

function generateInitialData(): Record<string, Record<string, Status>> {
  const data: Record<string, Record<string, Status>> = {}
  const presets: Status[][] = [
    ['present', 'present', 'present', 'late', 'present'],
    ['present', 'absent', 'present', 'present', 'present'],
    ['present', 'present', 'excused', 'present', 'present'],
    ['late', 'present', 'present', 'present', 'present'],
    ['present', 'present', 'present', 'present', 'absent'],
    ['present', 'late', 'present', 'present', 'present'],
    ['present', 'present', 'present', 'present', 'present'],
    ['excused', 'present', 'present', 'present', 'present'],
  ]
  studentNames.forEach((name, si) => {
    data[name] = {}
    days.forEach((day, di) => {
      data[name][day] = presets[si][di]
    })
  })
  return data
}

function getWeekDates(offset: number) {
  const now = new Date()
  const monday = new Date(now)
  monday.setDate(now.getDate() - now.getDay() + 1 + offset * 7)
  return days.map((day, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return {
      day,
      date: d.getDate(),
      month: d.toLocaleString('default', { month: 'short' }),
      full: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    }
  })
}

export default function AttendancePage() {
  const [selectedClass, setSelectedClass] = useState(classes[0])
  const [weekOffset, setWeekOffset] = useState(0)
  const [attendance, setAttendance] = useState(generateInitialData)

  const weekDates = getWeekDates(weekOffset)

  const toggleStatus = (student: string, day: string) => {
    setAttendance(prev => {
      const current = prev[student][day]
      const idx = statusCycle.indexOf(current)
      const next = statusCycle[(idx + 1) % statusCycle.length]
      return {
        ...prev,
        [student]: { ...prev[student], [day]: next },
      }
    })
  }

  const markAllPresent = () => {
    setAttendance(prev => {
      const next = { ...prev }
      studentNames.forEach(name => {
        next[name] = { ...next[name] }
        days.forEach(day => {
          next[name][day] = 'present'
        })
      })
      return next
    })
  }

  const getStudentRate = (student: string) => {
    const statuses = Object.values(attendance[student])
    const presentCount = statuses.filter(s => s === 'present' || s === 'late').length
    return Math.round((presentCount / statuses.length) * 100)
  }

  const allStatuses = studentNames.flatMap(name => Object.values(attendance[name]))
  const presentCount = allStatuses.filter(s => s === 'present').length
  const absentCount = allStatuses.filter(s => s === 'absent').length
  const lateCount = allStatuses.filter(s => s === 'late').length
  const excusedCount = allStatuses.filter(s => s === 'excused').length
  const attendanceRate = Math.round(((presentCount + lateCount) / allStatuses.length) * 100)

  return (
    <div className="space-y-6">
      <FadeUp>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
              whileHover={{ rotate: 8, scale: 1.08 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <CheckSquare className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h2 className="text-xl font-black text-white">Attendance Tracker</h2>
              <p className="text-xs text-surface-400">{studentNames.length} students · {selectedClass} · Week of {weekDates[0].month} {weekDates[0].date}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              className="btn-primary text-xs"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={markAllPresent}
            >
              <Check className="w-3.5 h-3.5" />
              Mark All Present
            </motion.button>
            <button className="btn-secondary text-xs px-3 py-1.5">
              <Download className="w-3.5 h-3.5" /> Export
            </button>
          </div>
        </div>
      </FadeUp>

      <FadeUp delay={0.05}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
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

      <FadeUp delay={0.08}>
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-1">
            <motion.button
              className="p-2 rounded-lg hover:bg-white/[0.06] text-surface-400 hover:text-white transition-colors"
              whileHover={{ x: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setWeekOffset(prev => prev - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </motion.button>
            <span className="text-sm font-semibold text-white">
              {weekDates[0].month} {weekDates[0].date} - {weekDates[4].month} {weekDates[4].date}
            </span>
            <motion.button
              className="p-2 rounded-lg hover:bg-white/[0.06] text-surface-400 hover:text-white transition-colors"
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setWeekOffset(prev => prev + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {weekDates.map((wd, i) => (
              <motion.div
                key={wd.day}
                className={`text-center py-2 rounded-lg transition-colors ${
                  i === new Date().getDay() - 1 && weekOffset === 0
                    ? 'bg-accent-500/15 border border-accent-500/20'
                    : 'bg-white/[0.02]'
                }`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <div className="text-[10px] text-surface-500 uppercase tracking-wider">{wd.day}</div>
                <div className="text-sm font-bold text-white">{wd.date}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </FadeUp>

      <FadeUp delay={0.12}>
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left text-xs font-semibold text-surface-300 px-4 py-3 sticky left-0 bg-surface-900/80 backdrop-blur-sm z-10 w-48">Student</th>
                  {days.map(day => (
                    <th key={day} className="text-center text-xs font-semibold text-surface-300 px-3 py-3 min-w-[80px]">{day}</th>
                  ))}
                  <th className="text-center text-xs font-semibold text-surface-300 px-4 py-3">Rate</th>
                </tr>
              </thead>
              <tbody>
                {studentNames.map((student, si) => {
                  const rate = getStudentRate(student)
                  return (
                    <motion.tr
                      key={student}
                      className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: si * 0.03 }}
                    >
                      <td className="px-4 py-3 sticky left-0 bg-surface-900/60 backdrop-blur-sm z-10">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-accent-500/20 flex items-center justify-center text-[10px] font-bold text-accent-300">
                            {getInitials(student)}
                          </div>
                          <span className="text-sm font-medium text-white">{student}</span>
                        </div>
                      </td>
                      {days.map(day => {
                        const status = attendance[student][day]
                        const config = statusConfig[status]
                        const Icon = config.icon
                        return (
                          <td key={day} className="text-center px-3 py-3">
                            <motion.button
                              className={`w-9 h-9 rounded-lg ${config.bgClass} flex items-center justify-center mx-auto transition-colors`}
                              onClick={() => toggleStatus(student, day)}
                              whileHover={{ scale: 1.15 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Icon className={`w-4 h-4 ${config.colorClass}`} />
                            </motion.button>
                          </td>
                        )
                      })}
                      <td className="text-center px-4 py-3">
                        <span className={`text-sm font-bold ${
                          rate >= 90 ? 'text-success-400' :
                          rate >= 80 ? 'text-warning-400' : 'text-danger-400'
                        }`}>
                          {rate}%
                        </span>
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
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: 'Present', value: presentCount, color: '#10b981', icon: Check },
            { label: 'Absent', value: absentCount, color: '#ef4444', icon: X },
            { label: 'Late', value: lateCount, color: '#f59e0b', icon: Clock },
            { label: 'Excused', value: excusedCount, color: '#829c6e', icon: Circle },
            { label: 'Attendance Rate', value: `${attendanceRate}%`, color: '#b0623f', icon: TrendingUp },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="glass-card p-4"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.06 }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: stat.color + '20' }}
                >
                  <stat.icon className="w-3.5 h-3.5" style={{ color: stat.color }} />
                </div>
                <span className="text-xs font-medium text-surface-400">{stat.label}</span>
              </div>
              <div className="text-xl font-black text-white">{stat.value}</div>
            </motion.div>
          ))}
        </div>
      </FadeInWhenVisible>

      <FadeInWhenVisible delay={0.2}>
        <div className="glass-card p-5">
          <h4 className="text-xs font-semibold text-surface-400 mb-3 flex items-center gap-2">
            <BarChart2 className="w-3.5 h-3.5" /> Legend
          </h4>
          <div className="flex flex-wrap items-center gap-4">
            {statusCycle.map(status => {
              const config = statusConfig[status]
              const Icon = config.icon
              return (
                <div key={status} className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-lg ${config.bgClass} flex items-center justify-center`}>
                    <Icon className={`w-3.5 h-3.5 ${config.colorClass}`} />
                  </div>
                  <span className="text-xs text-surface-300 capitalize">{status}</span>
                </div>
              )
            })}
            <span className="text-[10px] text-surface-500 ml-2">Click any cell to cycle through statuses</span>
          </div>
        </div>
      </FadeInWhenVisible>
    </div>
  )
}
