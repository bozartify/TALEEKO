'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar, ChevronLeft, ChevronRight, Plus, Clock, Users,
  BookOpen, ClipboardList, Sparkles, Target, Bell, Video,
  MapPin, Star, Zap
} from 'lucide-react'
import { FadeUp } from '@/components/ui/motion'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

interface CalEvent {
  day: number
  title: string
  type: 'lesson' | 'quiz' | 'meeting' | 'deadline' | 'event'
  time?: string
  class?: string
  color: string
}

const events: CalEvent[] = [
  { day: 3,  title: 'Photosynthesis Lab',    type: 'lesson',   time: '9:00 AM',  class: '7th Science', color: '#b0623f' },
  { day: 3,  title: 'Math Quiz Ch.6',        type: 'quiz',     time: '1:00 PM',  class: '9th Math',    color: '#f97316' },
  { day: 5,  title: 'American Revolution',   type: 'lesson',   time: '10:00 AM', class: '8th History', color: '#14b8a6' },
  { day: 7,  title: 'Parent Conferences',    type: 'meeting',  time: '3:00 PM',  color: '#f43f5e' },
  { day: 10, title: 'Essay Due',             type: 'deadline', class: '10th English', color: '#ef4444' },
  { day: 12, title: 'NGSS Review Session',   type: 'lesson',   time: '11:00 AM', class: '7th Science', color: '#b0623f' },
  { day: 14, title: 'Science Fair Prep',     type: 'event',    time: '2:00 PM',  class: '7th Science', color: '#dd9a33' },
  { day: 15, title: 'Quiz: Quadratics',      type: 'quiz',     time: '9:00 AM',  class: '9th Math',    color: '#f97316' },
  { day: 17, title: 'Staff Meeting',         type: 'meeting',  time: '4:00 PM',  color: '#0891b2' },
  { day: 18, title: 'Lab Report Due',        type: 'deadline', class: '7th Science', color: '#ef4444' },
  { day: 20, title: 'Romeo & Juliet Act 3',  type: 'lesson',   time: '10:00 AM', class: '10th English', color: '#f43f5e' },
  { day: 22, title: 'Department Review',     type: 'meeting',  time: '3:30 PM',  color: '#0891b2' },
  { day: 24, title: 'Ecosystem Unit Test',   type: 'quiz',     time: '9:00 AM',  class: '7th Science', color: '#f97316' },
  { day: 25, title: 'Science Fair',          type: 'event',    time: 'All Day',  class: 'All Classes', color: '#b0623f' },
  { day: 28, title: 'Progress Reports Due',  type: 'deadline', color: '#ef4444' },
]

const eventTypeConfig = {
  lesson:   { icon: BookOpen,      label: 'Lesson',   bg: 'bg-accent-500/15' },
  quiz:     { icon: ClipboardList, label: 'Quiz',     bg: 'bg-warning-500/15' },
  meeting:  { icon: Video,         label: 'Meeting',  bg: 'bg-electric-500/15' },
  deadline: { icon: Target,        label: 'Deadline', bg: 'bg-danger-500/15' },
  event:    { icon: Star,          label: 'Event',    bg: 'bg-neon-500/15' },
}

type ViewMode = 'month' | 'week' | 'agenda'

export default function CalendarPage() {
  const [month] = useState(9) // October (0-indexed)
  const [year] = useState(2026)
  const [view, setView] = useState<ViewMode>('month')
  const [selectedDay, setSelectedDay] = useState<number | null>(null)

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = 18

  const calDays: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const dayEvents = selectedDay ? events.filter(e => e.day === selectedDay) : []
  const todayEvents = events.filter(e => e.day === today)

  return (
    <div className="space-y-6">
      {/* Header */}
      <FadeUp>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#b0623f,#6d28d9)' }}
              whileHover={{ rotate: 8, scale: 1.08 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <Calendar className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h2 className="text-xl font-black text-white">Teaching Calendar</h2>
              <p className="text-xs text-surface-400">Plan your lessons, quizzes, and events</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-white/[0.06] rounded-full p-0.5">
              {(['month', 'week', 'agenda'] as const).map(v => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all capitalize ${
                    view === v ? 'bg-white/[0.08] text-white' : 'text-surface-400 hover:text-surface-200 hover:bg-white/[0.04]'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
            <motion.button
              className="btn-primary text-xs"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Plus className="w-3.5 h-3.5" /> Add Event
            </motion.button>
          </div>
        </div>
      </FadeUp>

      {/* Month navigation */}
      <FadeUp delay={0.1}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-lg hover:bg-white/[0.04] text-surface-500"><ChevronLeft className="w-4 h-4" /></button>
            <h3 className="text-lg font-black text-white">{MONTHS[month]} {year}</h3>
            <button className="p-2 rounded-lg hover:bg-white/[0.04] text-surface-500"><ChevronRight className="w-4 h-4" /></button>
          </div>
          <div className="flex items-center gap-3 text-xs">
            {Object.entries(eventTypeConfig).map(([key, cfg]) => (
              <span key={key} className="flex items-center gap-1 text-surface-400">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: key === 'lesson' ? '#b0623f' : key === 'quiz' ? '#f97316' : key === 'meeting' ? '#0ea5e9' : key === 'deadline' ? '#ef4444' : '#dd9a33' }} />
                {cfg.label}
              </span>
            ))}
          </div>
        </div>
      </FadeUp>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar grid */}
        <FadeUp delay={0.15}>
          <div className="lg:col-span-3 glass-card overflow-hidden">
            {view === 'month' && (
              <>
                <div className="grid grid-cols-7 border-b border-white/[0.06]">
                  {DAYS.map(d => (
                    <div key={d} className="text-center text-xs font-semibold text-surface-500 py-3">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7">
                  {calDays.map((day, i) => {
                    const dayEvts = day ? events.filter(e => e.day === day) : []
                    const isToday = day === today
                    const isSelected = day === selectedDay
                    return (
                      <motion.div
                        key={i}
                        className={`min-h-[90px] p-1.5 border-b border-r border-white/[0.06] cursor-pointer transition-colors ${
                          isSelected ? 'bg-accent-500/15' : 'hover:bg-white/[0.04]'
                        } ${!day ? 'bg-white/[0.02]' : ''}`}
                        onClick={() => day && setSelectedDay(day === selectedDay ? null : day)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.02 * i }}
                      >
                        {day && (
                          <>
                            <span className={`text-xs font-semibold inline-flex items-center justify-center w-6 h-6 rounded-full ${
                              isToday ? 'bg-accent-500 text-white' : 'text-surface-200'
                            }`}>
                              {day}
                            </span>
                            <div className="space-y-0.5 mt-0.5">
                              {dayEvts.slice(0, 2).map((evt, ei) => (
                                <div
                                  key={ei}
                                  className="text-[10px] font-medium px-1.5 py-0.5 rounded truncate"
                                  style={{ backgroundColor: evt.color + '18', color: evt.color }}
                                >
                                  {evt.title}
                                </div>
                              ))}
                              {dayEvts.length > 2 && (
                                <span className="text-[10px] text-surface-500 pl-1">+{dayEvts.length - 2} more</span>
                              )}
                            </div>
                          </>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              </>
            )}

            {view === 'agenda' && (
              <div className="p-4 space-y-3">
                {events.sort((a, b) => a.day - b.day).map((evt, i) => {
                  const cfg = eventTypeConfig[evt.type]
                  return (
                    <motion.div
                      key={i}
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/[0.04] transition-colors"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      <div className="text-center w-12 flex-shrink-0">
                        <p className="text-lg font-black text-white">{evt.day}</p>
                        <p className="text-[10px] text-surface-500">{MONTHS[month].slice(0, 3)}</p>
                      </div>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
                        <cfg.icon className="w-4 h-4" style={{ color: evt.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white">{evt.title}</p>
                        <p className="text-xs text-surface-500">{evt.time ?? 'All Day'}{evt.class ? ` · ${evt.class}` : ''}</p>
                      </div>
                      <span className="badge text-[10px]" style={{ backgroundColor: evt.color + '18', color: evt.color }}>
                        {cfg.label}
                      </span>
                    </motion.div>
                  )
                })}
              </div>
            )}

            {view === 'week' && (
              <div className="p-4">
                <div className="grid grid-cols-7 gap-3">
                  {Array.from({ length: 7 }, (_, i) => {
                    const day = today - new Date(year, month, today).getDay() + i
                    const dayEvts = events.filter(e => e.day === day)
                    return (
                      <motion.div
                        key={i}
                        className={`p-3 rounded-xl border transition-all ${
                          day === today ? 'border-accent-500/30 bg-accent-500/15' : 'border-white/[0.06]'
                        }`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <div className="text-center mb-2">
                          <p className="text-[10px] text-surface-500">{DAYS[i]}</p>
                          <p className={`text-lg font-black ${day === today ? 'text-accent-400' : 'text-white'}`}>
                            {day > 0 && day <= daysInMonth ? day : ''}
                          </p>
                        </div>
                        <div className="space-y-1">
                          {dayEvts.map((evt, ei) => (
                            <div
                              key={ei}
                              className="text-[10px] font-medium p-1.5 rounded-lg"
                              style={{ backgroundColor: evt.color + '18', color: evt.color }}
                            >
                              <p className="truncate">{evt.title}</p>
                              {evt.time && <p className="opacity-70">{evt.time}</p>}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </FadeUp>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Selected day detail or today */}
          <FadeUp delay={0.2}>
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedDay ?? 'today'}
                className="glass-card p-5"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                <h3 className="text-sm font-bold text-white mb-3">
                  {selectedDay ? `${MONTHS[month]} ${selectedDay}` : "Today's Schedule"}
                </h3>
                {(selectedDay ? dayEvents : todayEvents).length > 0 ? (
                  <div className="space-y-3">
                    {(selectedDay ? dayEvents : todayEvents).map((evt, i) => {
                      const cfg = eventTypeConfig[evt.type]
                      return (
                        <motion.div
                          key={i}
                          className="flex items-start gap-3 p-3 bg-white/[0.03] rounded-xl"
                          initial={{ opacity: 0, x: -4 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
                            <cfg.icon className="w-4 h-4" style={{ color: evt.color }} />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">{evt.title}</p>
                            <p className="text-[10px] text-surface-500">{evt.time ?? 'All Day'}{evt.class ? ` · ${evt.class}` : ''}</p>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Calendar className="w-8 h-8 text-surface-500 mx-auto mb-2" />
                    <p className="text-xs text-surface-500">No events scheduled</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </FadeUp>

          {/* AI suggestions */}
          <FadeUp delay={0.3}>
            <div className="bg-gradient-to-br from-accent-500/10 to-neon-500/10 rounded-2xl border border-white/[0.06] p-5">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-accent-400" />
                <h3 className="text-sm font-bold text-white">AI Suggestions</h3>
              </div>
              <div className="space-y-2">
                {[
                  'Schedule review session before Oct 24 test',
                  'Gap detected: No 8th History lesson next week',
                  'Consider moving essay deadline — conflicts with Science Fair',
                ].map((s, i) => (
                  <motion.div
                    key={i}
                    className="flex items-start gap-2 p-2.5 bg-white/[0.06] rounded-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.35 + i * 0.07 }}
                  >
                    <Zap className="w-3 h-3 text-accent-400 flex-shrink-0 mt-0.5" />
                    <p className="text-[11px] text-surface-300">{s}</p>
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
