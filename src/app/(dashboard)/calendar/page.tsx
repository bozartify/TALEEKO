'use client'
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar, ChevronLeft, ChevronRight, Plus, Clock, Users,
  BookOpen, ClipboardList, Sparkles, Target, Bell, Video,
  MapPin, Star, Zap, X, Check, Filter, Download,
  AlertTriangle, Brain, Flag, Edit3, Trash2,
  RefreshCw, ChevronDown, BookMarked, Eye, CheckCircle
} from 'lucide-react'
import { FadeUp, FadeInWhenVisible } from '@/components/ui/motion'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

type EventType = 'lesson' | 'quiz' | 'meeting' | 'deadline' | 'event' | 'personal'
type ViewMode = 'month' | 'week' | 'agenda'

interface CalEvent {
  id: string
  day: number
  title: string
  type: EventType
  time?: string
  class?: string
  color: string
  priority?: 'high' | 'medium' | 'low'
  location?: string
  recurring?: boolean
  reminder?: boolean
  desc?: string
}

const events: CalEvent[] = [
  { id: 'e1',  day: 2,  title: 'Lesson Prep: Genetics',    type: 'personal',  time: '7:00 AM',  color: '#6b7280', priority: 'medium', desc: 'Prepare materials for Unit 2 lessons' },
  { id: 'e2',  day: 3,  title: 'Photosynthesis Lab',       type: 'lesson',    time: '9:00 AM',  class: 'AP Biology', color: '#8b5cf6', priority: 'high', location: 'Lab 102' },
  { id: 'e3',  day: 3,  title: 'Math Quiz Ch.6',           type: 'quiz',      time: '1:00 PM',  class: '9th Math', color: '#f97316', priority: 'high' },
  { id: 'e4',  day: 5,  title: 'American Revolution',      type: 'lesson',    time: '10:00 AM', class: '8th History', color: '#14b8a6', priority: 'medium' },
  { id: 'e5',  day: 7,  title: 'Parent Conferences',       type: 'meeting',   time: '3:00 PM',  color: '#f43f5e', priority: 'high', location: 'Room 214', reminder: true },
  { id: 'e6',  day: 9,  title: 'Dept. Curriculum Review',  type: 'meeting',   time: '11:00 AM', color: '#0891b2', location: 'Conference Room A' },
  { id: 'e7',  day: 10, title: 'Essay Due',                type: 'deadline',  class: '10th English', color: '#ef4444', priority: 'high', reminder: true },
  { id: 'e8',  day: 12, title: 'NGSS Review Session',      type: 'lesson',    time: '11:00 AM', class: 'AP Biology', color: '#8b5cf6', recurring: true },
  { id: 'e9',  day: 14, title: 'Science Fair Prep',        type: 'event',     time: '2:00 PM',  class: 'AP Biology', color: '#6366f1', location: 'Gym' },
  { id: 'e10', day: 15, title: 'Quiz: Quadratics',         type: 'quiz',      time: '9:00 AM',  class: '9th Math', color: '#f97316', priority: 'high' },
  { id: 'e11', day: 17, title: 'Staff Meeting',            type: 'meeting',   time: '4:00 PM',  color: '#0891b2', recurring: true },
  { id: 'e12', day: 18, title: 'Lab Report Due',           type: 'deadline',  class: 'AP Biology', color: '#ef4444', reminder: true },
  { id: 'e13', day: 19, title: 'Office Hours',             type: 'personal',  time: '3:00 PM',  color: '#6b7280', recurring: true },
  { id: 'e14', day: 20, title: 'Romeo & Juliet Act 3',     type: 'lesson',    time: '10:00 AM', class: '10th English', color: '#f43f5e', priority: 'medium' },
  { id: 'e15', day: 22, title: 'Department Review',        type: 'meeting',   time: '3:30 PM',  color: '#0891b2', location: 'Principal\'s Office' },
  { id: 'e16', day: 24, title: 'Ecosystem Unit Test',      type: 'quiz',      time: '9:00 AM',  class: 'AP Biology', color: '#f97316', priority: 'high', reminder: true },
  { id: 'e17', day: 25, title: 'Science Fair',             type: 'event',     time: 'All Day',  class: 'All Classes', color: '#8b5cf6', priority: 'high', location: 'Gymnasium' },
  { id: 'e18', day: 26, title: 'Grades Due',               type: 'deadline',  color: '#ef4444', priority: 'high', reminder: true },
  { id: 'e19', day: 28, title: 'Progress Reports Due',     type: 'deadline',  color: '#ef4444', priority: 'high' },
  { id: 'e20', day: 30, title: 'PD Day: AI in Education',  type: 'event',     time: '8:00 AM',  color: '#6366f1', priority: 'medium', location: 'Auditorium' },
]

const eventTypeConfig: Record<EventType, { label: string; icon: typeof BookOpen; dotColor: string }> = {
  lesson:   { icon: BookOpen,      label: 'Lesson',   dotColor: '#8b5cf6' },
  quiz:     { icon: ClipboardList, label: 'Quiz',     dotColor: '#f97316' },
  meeting:  { icon: Video,         label: 'Meeting',  dotColor: '#0891b2' },
  deadline: { icon: Target,        label: 'Deadline', dotColor: '#ef4444' },
  event:    { icon: Star,          label: 'Event',    dotColor: '#6366f1' },
  personal: { icon: BookMarked,    label: 'Personal', dotColor: '#6b7280' },
}

const classList = ['All Classes', 'AP Biology', '10th English', '9th Math', '8th History']

const weekHours = ['8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM']

const aiSuggestions = [
  { icon: AlertTriangle, color: '#f59e0b', text: 'Essay and Lab Report deadlines are 2 days apart — students may be overwhelmed. Consider shifting Lab Report to Oct 14.', toast: 'Lab Report deadline shifted to Oct 14' },
  { icon: Zap, color: '#6366f1', text: 'No review session scheduled before Oct 24 Ecosystem Test. Add a 30-min review on Oct 22.', toast: 'Review session added for Oct 22' },
  { icon: Brain, color: '#10b981', text: 'Oct 19 has no lesson events. Ideal day to run a differentiation activity or student work session.', toast: 'Differentiation activity scheduled for Oct 19' },
]

export default function CalendarPage() {
  const [month, setMonth] = useState(9)
  const [year, setYear] = useState(2026)
  const [view, setView] = useState<ViewMode>('month')
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [classFilter, setClassFilter] = useState('All Classes')
  const [typeFilter, setTypeFilter] = useState<EventType | 'all'>('all')
  const [showNewEvent, setShowNewEvent] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null)
  const [weekOffset, setWeekOffset] = useState(0)
  const [toastMsg, setToastMsg] = useState('')

  function showToast(msg: string) {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 2500)
  }

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = 18

  const calDays: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const filteredEvents = useMemo(() => events.filter(e => {
    const matchClass = classFilter === 'All Classes' || !e.class || e.class === classFilter || e.class === 'All Classes'
    const matchType = typeFilter === 'all' || e.type === typeFilter
    return matchClass && matchType
  }), [classFilter, typeFilter])

  const dayEvents = selectedDay ? filteredEvents.filter(e => e.day === selectedDay) : []
  const todayEvents = filteredEvents.filter(e => e.day === today)
  const upcomingEvents = filteredEvents.filter(e => e.day >= today).slice(0, 5)
  const highPriorityCount = filteredEvents.filter(e => e.priority === 'high' && e.day >= today).length
  const deadlineCount = filteredEvents.filter(e => e.type === 'deadline' && e.day >= today).length
  const meetingCount = filteredEvents.filter(e => e.type === 'meeting' && e.day >= today).length

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }

  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  const weekStart = today - new Date(year, month, today).getDay() + weekOffset * 7
  const weekDays = Array.from({ length: 7 }, (_, i) => weekStart + i)

  return (
    <div className="space-y-6">
      {/* Hero header */}
      <FadeUp>
        <div className="hero-mesh rounded-3xl p-6 border border-white/[0.06]">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)' }}>
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-black text-white tracking-tight">Teaching Calendar</h1>
                  <span className="text-[10px] bg-accent-500/20 text-accent-400 px-2 py-0.5 rounded-full font-bold border border-accent-500/20">AI-Powered</span>
                </div>
                <p className="text-sm text-surface-400">{filteredEvents.length} events this month · {highPriorityCount} high priority · {deadlineCount} upcoming deadlines</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1 bg-white/[0.06] rounded-full p-0.5">
                {(['month', 'week', 'agenda'] as const).map(v => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all capitalize ${
                      view === v ? 'bg-white/[0.08] text-white' : 'text-surface-400 hover:text-surface-200'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
              <motion.button className="btn-gradient text-xs" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setShowNewEvent(true)}>
                <Plus className="w-3.5 h-3.5" /> Add Event
              </motion.button>
              <button className="btn-secondary text-xs px-3 py-1.5" onClick={() => showToast('Calendar exported to PDF')}>
                <Download className="w-3.5 h-3.5" /> Export
              </button>
            </div>
          </div>
          <div className="border-t border-white/[0.06] pt-4 flex items-center gap-6 flex-wrap">
            {[
              { label: 'Total Events', value: filteredEvents.length.toString(), color: '#a78bfa' },
              { label: 'High Priority', value: highPriorityCount.toString(), color: '#f87171' },
              { label: 'Deadlines', value: deadlineCount.toString(), color: '#fb923c' },
              { label: 'Meetings', value: meetingCount.toString(), color: '#34d399' },
              { label: 'Today', value: todayEvents.length.toString(), color: '#38bdf8' },
            ].map(p => (
              <div key={p.label} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                <span className="text-xs text-surface-400">{p.label}</span>
                <span className="text-xs font-bold text-white">{p.value}</span>
              </div>
            ))}
          </div>
        </div>
      </FadeUp>

      {/* Quick stats */}
      <FadeUp delay={0.04}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'This Month', value: filteredEvents.length.toString(), sub: 'total events', icon: Calendar, color: '#8b5cf6' },
            { label: 'High Priority', value: highPriorityCount.toString(), sub: 'need attention', icon: Flag, color: '#ef4444' },
            { label: 'Deadlines', value: deadlineCount.toString(), sub: 'coming up', icon: Target, color: '#f97316' },
            { label: 'Meetings', value: meetingCount.toString(), sub: 'remaining', icon: Video, color: '#14b8a6' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="glass-card p-4"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -2 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: stat.color + '20' }}>
                  <stat.icon className="w-3.5 h-3.5" style={{ color: stat.color }} />
                </div>
                <span className="text-xs text-surface-400">{stat.label}</span>
              </div>
              <p className="text-2xl font-black text-white">{stat.value}</p>
              <p className="text-[10px] text-surface-500 mt-0.5">{stat.sub}</p>
            </motion.div>
          ))}
        </div>
      </FadeUp>

      {/* Events by Type Chart */}
      <FadeUp delay={0.05}>
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-accent-400" /> Events by Type
            </h3>
            <span className="text-[10px] text-surface-500">{filteredEvents.length} total events</span>
          </div>
          {(() => {
            const types = Object.entries(eventTypeConfig) as [EventType, (typeof eventTypeConfig)[EventType]][]
            const counts = types.map(([t]) => ({ type: t, count: filteredEvents.filter(e => e.type === t).length, ...eventTypeConfig[t] }))
            const maxCount = Math.max(...counts.map(c => c.count), 1)
            const W = 560, ROW = 18, GAP = 5, LABEL_W = 70, COUNT_W = 24
            const BAR_MAX = W - LABEL_W - COUNT_W - 8
            const H = counts.length * (ROW + GAP) + 4
            return (
              <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: H }}>
                <defs>
                  {counts.map(c => (
                    <linearGradient key={c.type} id={`cal-bar-${c.type}`} x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor={c.dotColor} stopOpacity="0.85" />
                      <stop offset="100%" stopColor={c.dotColor} stopOpacity="0.4" />
                    </linearGradient>
                  ))}
                </defs>
                {counts.map((c, i) => {
                  const y = i * (ROW + GAP)
                  const bw = (c.count / maxCount) * BAR_MAX
                  return (
                    <g key={c.type}>
                      <text x={0} y={y + ROW - 4} fill="rgba(255,255,255,0.5)" fontSize="10">{c.label}</text>
                      <rect x={LABEL_W} y={y + 2} width={BAR_MAX} height={ROW - 4} rx="3" fill="rgba(255,255,255,0.04)" />
                      <motion.rect x={LABEL_W} y={y + 2} width={bw} height={ROW - 4} rx="3" fill={`url(#cal-bar-${c.type})`}
                        initial={{ width: 0 }} animate={{ width: bw }} transition={{ delay: 0.08 + i * 0.07, duration: 0.55, ease: 'easeOut' }} />
                      <text x={W} y={y + ROW - 4} textAnchor="end" fill={c.dotColor} fontSize="10" fontWeight="700">{c.count}</text>
                    </g>
                  )
                })}
              </svg>
            )
          })()}
        </div>
      </FadeUp>

      {/* Filters */}
      <FadeUp delay={0.06}>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1 flex-wrap">
            {classList.map(c => (
              <button
                key={c}
                onClick={() => setClassFilter(c)}
                className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                  classFilter === c ? 'bg-white/[0.08] text-white font-semibold' : 'text-surface-400 hover:text-surface-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="h-4 w-px bg-white/[0.08]" />
          <div className="flex items-center gap-1">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-2 py-1 rounded-full text-[10px] transition-all ${typeFilter === 'all' ? 'bg-white/[0.08] text-white' : 'text-surface-500'}`}
            >
              All
            </button>
            {(Object.entries(eventTypeConfig) as [EventType, typeof eventTypeConfig[EventType]][]).map(([type, cfg]) => (
              <button
                key={type}
                onClick={() => setTypeFilter(typeFilter === type ? 'all' : type)}
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] transition-all ${
                  typeFilter === type ? 'bg-white/[0.08] text-white' : 'text-surface-500 hover:text-surface-300'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cfg.dotColor }} />
                {cfg.label}
              </button>
            ))}
          </div>
        </div>
      </FadeUp>

      {/* AI Suggestions */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            className="glass-card p-4 border border-accent-500/15"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent-400" />
                <span className="text-sm font-bold text-white">AI Schedule Insights</span>
                <span className="text-[10px] bg-accent-500/15 text-accent-400 px-1.5 py-0.5 rounded-full font-bold">{aiSuggestions.length}</span>
              </div>
              <button onClick={() => setShowSuggestions(false)} className="text-surface-500 hover:text-surface-300">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-2">
              {aiSuggestions.map((s, i) => (
                <motion.div
                  key={i}
                  className="flex items-start gap-2.5 p-3 bg-white/[0.03] rounded-xl border border-white/[0.06] hover:border-white/[0.12] transition-colors"
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <s.icon className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: s.color }} />
                  <p className="text-xs text-surface-300 leading-relaxed">{s.text}</p>
                  <button className="flex-shrink-0 text-[10px] text-accent-400 hover:text-accent-300 font-semibold" onClick={() => showToast(s.toast)}>Fix →</button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <FadeUp delay={0.08}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {view === 'week' ? (
              <>
                <button onClick={() => setWeekOffset(o => o - 1)} className="p-2 rounded-lg hover:bg-white/[0.06] text-surface-400 hover:text-white transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <h3 className="text-lg font-black text-white">
                  Week of {MONTHS[month].slice(0, 3)} {weekStart > 0 ? weekStart : 1}
                </h3>
                <button onClick={() => setWeekOffset(o => o + 1)} className="p-2 rounded-lg hover:bg-white/[0.06] text-surface-400 hover:text-white transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-white/[0.06] text-surface-400 hover:text-white transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <h3 className="text-lg font-black text-white">{MONTHS[month]} {year}</h3>
                <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-white/[0.06] text-surface-400 hover:text-white transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
          <div className="flex items-center gap-3 text-[10px] flex-wrap">
            {Object.entries(eventTypeConfig).map(([key, cfg]) => (
              <span key={key} className="flex items-center gap-1.5 text-surface-400">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.dotColor }} />
                {cfg.label}
              </span>
            ))}
          </div>
        </div>
      </FadeUp>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main calendar area */}
        <FadeUp delay={0.12}>
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {/* MONTH VIEW */}
              {view === 'month' && (
                <motion.div
                  key="month"
                  className="glass-card overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="grid grid-cols-7 border-b border-white/[0.06]">
                    {DAYS.map(d => (
                      <div key={d} className="text-center text-xs font-semibold text-surface-500 py-3">{d}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7">
                    {calDays.map((day, i) => {
                      const dayEvts = day ? filteredEvents.filter(e => e.day === day) : []
                      const isToday = day === today
                      const isSelected = day === selectedDay
                      const hasHighPriority = dayEvts.some(e => e.priority === 'high')
                      return (
                        <motion.div
                          key={i}
                          className={`min-h-[100px] p-1.5 border-b border-r border-white/[0.04] cursor-pointer transition-colors ${
                            isSelected ? 'bg-accent-500/[0.12]' :
                            isToday ? 'bg-accent-500/[0.06]' :
                            'hover:bg-white/[0.03]'
                          } ${!day ? 'bg-black/[0.15]' : ''}`}
                          onClick={() => day && setSelectedDay(day === selectedDay ? null : day)}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.01 * i }}
                        >
                          {day && (
                            <>
                              <div className="flex items-center justify-between mb-0.5">
                                <span className={`text-xs font-bold inline-flex items-center justify-center w-6 h-6 rounded-full ${
                                  isToday ? 'bg-accent-500 text-white' : 'text-surface-200'
                                }`}>
                                  {day}
                                </span>
                                {hasHighPriority && (
                                  <div className="w-1.5 h-1.5 rounded-full bg-danger-400" />
                                )}
                              </div>
                              <div className="space-y-0.5">
                                {dayEvts.slice(0, 3).map((evt, ei) => (
                                  <div
                                    key={ei}
                                    className="text-[9px] font-medium px-1.5 py-0.5 rounded truncate leading-tight"
                                    style={{ backgroundColor: evt.color + '20', color: evt.color }}
                                  >
                                    {evt.time ? `${evt.time.split(':')[0]}${evt.time.includes('AM') ? 'a' : 'p'} ` : ''}{evt.title}
                                  </div>
                                ))}
                                {dayEvts.length > 3 && (
                                  <span className="text-[9px] text-surface-500 pl-1">+{dayEvts.length - 3} more</span>
                                )}
                              </div>
                            </>
                          )}
                        </motion.div>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              {/* WEEK VIEW */}
              {view === 'week' && (
                <motion.div
                  key="week"
                  className="glass-card overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Day headers */}
                  <div className="grid grid-cols-8 border-b border-white/[0.06]">
                    <div className="py-3 px-2 text-[10px] text-surface-600">Time</div>
                    {weekDays.map((day, i) => {
                      const isToday = day === today
                      return (
                        <div key={i} className={`py-3 text-center border-l border-white/[0.04] ${isToday ? 'bg-accent-500/[0.08]' : ''}`}>
                          <p className="text-[10px] text-surface-500">{DAYS[i]}</p>
                          <p className={`text-sm font-black ${isToday ? 'text-accent-400' : 'text-white'} ${day < 1 || day > daysInMonth ? 'text-surface-600' : ''}`}>
                            {day > 0 && day <= daysInMonth ? day : ''}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                  {/* Time rows */}
                  {weekHours.map((hour, hi) => (
                    <div key={hour} className="grid grid-cols-8 border-b border-white/[0.04]">
                      <div className="py-3 px-2 text-[9px] text-surface-600">{hour}</div>
                      {weekDays.map((day, di) => {
                        const dayEvts = filteredEvents.filter(e => {
                          if (e.day !== day) return false
                          if (!e.time) return hi === 0
                          const h = parseInt(e.time.split(':')[0])
                          const isPM = e.time.includes('PM') && h !== 12
                          const hour24 = isPM ? h + 12 : h
                          return hour24 === 8 + hi
                        })
                        return (
                          <div key={di} className={`py-1 px-0.5 border-l border-white/[0.04] min-h-[48px] ${day === today ? 'bg-accent-500/[0.04]' : ''}`}>
                            {dayEvts.map((evt, ei) => (
                              <div
                                key={ei}
                                className="text-[9px] font-medium px-1.5 py-1 rounded mb-0.5 cursor-pointer hover:opacity-80 transition-opacity"
                                style={{ backgroundColor: evt.color + '25', color: evt.color, borderLeft: `2px solid ${evt.color}` }}
                              >
                                <p className="truncate font-bold">{evt.title}</p>
                                {evt.class && <p className="opacity-70 truncate">{evt.class}</p>}
                              </div>
                            ))}
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </motion.div>
              )}

              {/* AGENDA VIEW */}
              {view === 'agenda' && (
                <motion.div
                  key="agenda"
                  className="glass-card overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="p-1">
                    {filteredEvents.sort((a, b) => a.day - b.day).map((evt, i) => {
                      const cfg = eventTypeConfig[evt.type]
                      const isExpanded = expandedEvent === evt.id
                      return (
                        <motion.div
                          key={evt.id}
                          className={`border-b border-white/[0.04] last:border-0 cursor-pointer ${isExpanded ? 'bg-white/[0.03]' : 'hover:bg-white/[0.02]'} transition-colors`}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.02 }}
                        >
                          <div
                            className="flex items-center gap-4 p-3.5"
                            onClick={() => setExpandedEvent(isExpanded ? null : evt.id)}
                          >
                            <div className="text-center w-12 flex-shrink-0">
                              <p className="text-lg font-black text-white">{evt.day}</p>
                              <p className="text-[9px] text-surface-500">{MONTHS[month].slice(0, 3)}</p>
                            </div>
                            <div
                              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: evt.color + '20' }}
                            >
                              <cfg.icon className="w-4 h-4" style={{ color: evt.color }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-semibold text-white truncate">{evt.title}</p>
                                {evt.priority === 'high' && <Flag className="w-3 h-3 text-danger-400 flex-shrink-0" />}
                                {evt.recurring && <RefreshCw className="w-3 h-3 text-surface-500 flex-shrink-0" />}
                                {evt.reminder && <Bell className="w-3 h-3 text-warning-400 flex-shrink-0" />}
                              </div>
                              <p className="text-xs text-surface-500">
                                {evt.time ?? 'All Day'}
                                {evt.class ? ` · ${evt.class}` : ''}
                                {evt.location ? ` · ${evt.location}` : ''}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: evt.color + '18', color: evt.color }}>
                                {cfg.label}
                              </span>
                              <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                                <ChevronDown className="w-3.5 h-3.5 text-surface-500" />
                              </motion.div>
                            </div>
                          </div>
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="px-4 pb-4 pt-1 border-t border-white/[0.06]">
                                  {evt.desc && <p className="text-xs text-surface-400 mb-3">{evt.desc}</p>}
                                  <div className="flex items-center gap-2">
                                    <button className="btn-secondary text-[10px] px-2 py-1" onClick={() => showToast(`Editing "${evt.title}"`)}><Edit3 className="w-2.5 h-2.5" /> Edit</button>
                                    <button className="btn-secondary text-[10px] px-2 py-1" onClick={() => showToast(`Reminder set for "${evt.title}"`)}><Bell className="w-2.5 h-2.5" /> Remind</button>
                                    <button className="btn-secondary text-[10px] px-2 py-1 text-danger-400 hover:bg-danger-400/10" onClick={() => showToast(`"${evt.title}" deleted`)}><Trash2 className="w-2.5 h-2.5" /> Delete</button>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </FadeUp>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* Selected/Today events */}
          <FadeUp delay={0.18}>
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedDay ?? 'today'}
                className="glass-card p-5"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                <h3 className="text-sm font-bold text-white mb-3">
                  {selectedDay ? `${MONTHS[month]} ${selectedDay}` : "Today · Oct 18"}
                </h3>
                {(selectedDay ? dayEvents : todayEvents).length > 0 ? (
                  <div className="space-y-2.5">
                    {(selectedDay ? dayEvents : todayEvents).map((evt, i) => {
                      const cfg = eventTypeConfig[evt.type]
                      return (
                        <motion.div
                          key={i}
                          className="flex items-start gap-3 p-3 bg-white/[0.03] rounded-xl border border-white/[0.06] hover:border-white/[0.12] transition-colors"
                          initial={{ opacity: 0, x: -4 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.06 }}
                        >
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: evt.color + '20' }}>
                            <cfg.icon className="w-4 h-4" style={{ color: evt.color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1">
                              <p className="text-xs font-bold text-white truncate">{evt.title}</p>
                              {evt.priority === 'high' && <Flag className="w-2.5 h-2.5 text-danger-400 flex-shrink-0" />}
                            </div>
                            <p className="text-[10px] text-surface-500">
                              {evt.time ?? 'All Day'}{evt.class ? ` · ${evt.class}` : ''}
                            </p>
                            {evt.location && (
                              <p className="text-[9px] text-surface-600 flex items-center gap-1 mt-0.5">
                                <MapPin className="w-2.5 h-2.5" />{evt.location}
                              </p>
                            )}
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Calendar className="w-8 h-8 text-surface-600 mx-auto mb-2" />
                    <p className="text-xs text-surface-500">No events scheduled</p>
                    <button
                      className="btn-secondary text-xs mt-2 px-3 py-1"
                      onClick={() => setShowNewEvent(true)}
                    >
                      <Plus className="w-3 h-3" /> Add Event
                    </button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </FadeUp>

          {/* Upcoming events */}
          <FadeInWhenVisible delay={0.05}>
            <div className="glass-card p-5">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-surface-400" /> Upcoming
              </h3>
              <div className="space-y-2">
                {upcomingEvents.map((evt, i) => {
                  const cfg = eventTypeConfig[evt.type]
                  return (
                    <motion.div
                      key={evt.id}
                      className="flex items-center gap-2.5 py-1.5 border-b border-white/[0.04] last:border-0 cursor-pointer hover:opacity-80 transition-opacity"
                      initial={{ opacity: 0, x: 6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <div className="w-1.5 h-8 rounded-full flex-shrink-0" style={{ backgroundColor: evt.color }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-semibold text-white truncate">{evt.title}</p>
                        <p className="text-[9px] text-surface-500">Oct {evt.day}{evt.time ? ` · ${evt.time}` : ''}</p>
                      </div>
                      {evt.priority === 'high' && <Flag className="w-3 h-3 text-danger-400 flex-shrink-0" />}
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </FadeInWhenVisible>

          {/* Quick add */}
          <FadeInWhenVisible delay={0.1}>
            <div className="glass-card p-4">
              <h4 className="text-xs font-bold text-surface-300 mb-3">Quick Add</h4>
              <div className="space-y-1.5">
                {[
                  { label: 'Add Lesson', type: 'lesson', color: '#8b5cf6', toast: 'New lesson added to calendar' },
                  { label: 'Add Quiz/Test', type: 'quiz', color: '#f97316', toast: 'New quiz event added to calendar' },
                  { label: 'Add Deadline', type: 'deadline', color: '#ef4444', toast: 'New deadline added to calendar' },
                  { label: 'Add Meeting', type: 'meeting', color: '#0891b2', toast: 'New meeting added to calendar' },
                ].map(item => (
                  <button
                    key={item.type}
                    onClick={() => setShowNewEvent(true)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/[0.06] transition-colors text-left"
                  >
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-surface-400 hover:text-surface-200">{item.label}</span>
                    <Plus className="w-3 h-3 text-surface-600 ml-auto" />
                  </button>
                ))}
              </div>
            </div>
          </FadeInWhenVisible>
        </div>
      </div>

      {/* New Event Modal */}
      <AnimatePresence>
        {showNewEvent && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowNewEvent(false)} />
            <motion.div
              className="relative glass-card p-6 w-full max-w-md z-10"
              initial={{ scale: 0.95, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 16 }}
            >
              <button onClick={() => setShowNewEvent(false)} className="absolute top-4 right-4 text-surface-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
              <h3 className="text-base font-black text-white mb-4">Add Calendar Event</h3>
              <div className="space-y-3">
                <input placeholder="Event title" className="w-full px-3 py-2 text-sm bg-white/[0.06] border border-white/[0.08] rounded-xl text-white placeholder:text-surface-500 focus:outline-none focus:border-accent-500/50" />
                <div className="grid grid-cols-2 gap-3">
                  <select className="px-3 py-2 text-xs bg-white/[0.06] border border-white/[0.08] rounded-xl text-surface-300 focus:outline-none focus:border-accent-500/50">
                    {Object.entries(eventTypeConfig).map(([type, cfg]) => (
                      <option key={type} value={type}>{cfg.label}</option>
                    ))}
                  </select>
                  <select className="px-3 py-2 text-xs bg-white/[0.06] border border-white/[0.08] rounded-xl text-surface-300 focus:outline-none focus:border-accent-500/50">
                    {classList.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input type="date" className="px-3 py-2 text-xs bg-white/[0.06] border border-white/[0.08] rounded-xl text-surface-300 focus:outline-none focus:border-accent-500/50" />
                  <input type="time" className="px-3 py-2 text-xs bg-white/[0.06] border border-white/[0.08] rounded-xl text-surface-300 focus:outline-none focus:border-accent-500/50" />
                </div>
                <input placeholder="Location (optional)" className="w-full px-3 py-2 text-xs bg-white/[0.06] border border-white/[0.08] rounded-xl text-white placeholder:text-surface-500 focus:outline-none focus:border-accent-500/50" />
                <textarea placeholder="Description (optional)" rows={2} className="w-full px-3 py-2 text-xs bg-white/[0.06] border border-white/[0.08] rounded-xl text-white placeholder:text-surface-500 focus:outline-none focus:border-accent-500/50 resize-none" />
                <div className="flex items-center gap-3 pt-1">
                  <label className="flex items-center gap-2 text-xs text-surface-400 cursor-pointer">
                    <input type="checkbox" className="accent-accent-500" /> Set Reminder
                  </label>
                  <label className="flex items-center gap-2 text-xs text-surface-400 cursor-pointer">
                    <input type="checkbox" className="accent-accent-500" /> Recurring
                  </label>
                </div>
                <div className="flex gap-2 pt-1">
                  <motion.button
                    className="btn-gradient text-xs flex-1"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { showToast('Event added to calendar'); setShowNewEvent(false) }}
                  >
                    <Check className="w-3.5 h-3.5" /> Add Event
                  </motion.button>
                  <button className="btn-secondary text-xs px-4" onClick={() => setShowNewEvent(false)}>Cancel</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            className="fixed top-5 right-5 z-[100] flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl"
            style={{ background: 'linear-gradient(135deg,#0a0f1a,#111827)', border: '1px solid rgba(255,255,255,0.08)' }}
            initial={{ opacity: 0, y: -16, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 400, damping: 28 } }}
            exit={{ opacity: 0, y: -10, scale: 0.94 }}
          >
            <CheckCircle className="w-4 h-4 text-success-400 flex-shrink-0" />
            <span className="text-xs font-semibold text-white">{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
