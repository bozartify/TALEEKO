'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrendingUp, BookOpen, Users, Clock, BarChart2, Star, Target, Zap,
  ArrowUpRight, ArrowDownRight, Calendar, Filter, Download, Brain,
  MessageSquare, FileText, Activity, Globe, Flame
} from 'lucide-react'
import { FadeUp, StaggerList, StaggerItem, fadeUp } from '@/components/ui/motion'

const weekData = [
  { day: 'Mon', lessons: 2, minutes: 45 },
  { day: 'Tue', lessons: 4, minutes: 60 },
  { day: 'Wed', lessons: 1, minutes: 30 },
  { day: 'Thu', lessons: 5, minutes: 75 },
  { day: 'Fri', lessons: 3, minutes: 50 },
  { day: 'Sat', lessons: 1, minutes: 20 },
  { day: 'Sun', lessons: 0, minutes: 0 },
]

const monthlyTrend = [
  { month: 'Jan', value: 12 }, { month: 'Feb', value: 19 },
  { month: 'Mar', value: 28 }, { month: 'Apr', value: 35 },
  { month: 'May', value: 42 }, { month: 'Jun', value: 67 },
]

const topTools = [
  { name: 'Lesson Plans',   uses: 24, pct: 85, color: '#8b5cf6', icon: BookOpen },
  { name: 'Quiz Generator', uses: 18, pct: 65, color: '#f97316', icon: FileText },
  { name: 'Worksheets',     uses: 12, pct: 43, color: '#14b8a6', icon: FileText },
  { name: 'Magic Chat',     uses: 31, pct: 100, color: '#6d28d9', icon: MessageSquare },
  { name: 'Activities',     uses: 8,  pct: 29, color: '#f59e0b', icon: Zap },
  { name: 'AI Analysis',    uses: 5,  pct: 18, color: '#f43f5e', icon: Brain },
]

const heatmapData = [
  [0,0,1,2,3,1,0], [1,2,3,4,5,2,0], [0,1,2,3,4,1,0],
  [2,3,4,5,3,0,0], [1,2,5,4,2,1,0],
]
const heatmapHours = ['8am','10am','12pm','2pm','4pm']
const heatmapDays = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']

const engagementByClass = [
  { name: '7th Science', engagement: 94, completion: 88, color: '#8b5cf6' },
  { name: '8th History', engagement: 87, completion: 82, color: '#f97316' },
  { name: '9th Math',    engagement: 91, completion: 79, color: '#14b8a6' },
  { name: '10th English',engagement: 78, completion: 85, color: '#f43f5e' },
]

const aiInsights = [
  { icon: TrendingUp, text: 'Material creation up 35% vs last month', positive: true },
  { icon: Star,       text: 'Student engagement peaked on Thursday', positive: true },
  { icon: Target,     text: '7th Grade Science has highest completion rate', positive: true },
  { icon: Activity,   text: '10th English engagement dropped — consider interactive activities', positive: false },
]

const languageUsage = [
  { lang: 'English',   pct: 45, flag: '🇺🇸' },
  { lang: 'Español',   pct: 22, flag: '🇪🇸' },
  { lang: 'Français',  pct: 12, flag: '🇫🇷' },
  { lang: 'العربية',   pct: 8,  flag: '🇸🇦' },
  { lang: 'Português', pct: 7,  flag: '🇧🇷' },
  { lang: 'Other',     pct: 6,  flag: '🌍' },
]

type TimeRange = '7d' | '30d' | '90d'

export default function AnalyticsPage() {
  const [range, setRange] = useState<TimeRange>('30d')
  const maxLessons = Math.max(...weekData.map(d => d.lessons))
  const maxMonthly = Math.max(...monthlyTrend.map(d => d.value))

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <FadeUp>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">Track your AI-powered teaching productivity</p>
          </div>
          <div className="flex items-center gap-2">
            {(['7d', '30d', '90d'] as const).map(r => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  range === r
                    ? 'bg-brand-600 text-white shadow-glow-sm'
                    : 'bg-white border border-slate-200 text-slate-500 hover:border-brand-300'
                }`}
              >
                {r === '7d' ? '7 Days' : r === '30d' ? '30 Days' : '90 Days'}
              </button>
            ))}
            <button className="btn-secondary text-xs px-3 py-1.5 ml-1">
              <Download className="w-3 h-3" /> Export
            </button>
          </div>
        </div>
      </FadeUp>

      {/* Summary stats */}
      <StaggerList className="grid grid-cols-2 lg:grid-cols-4 gap-4" delay={0.08}>
        {[
          { label: 'Materials Created', value: '67',   icon: BookOpen,   color: 'bg-brand-100 text-brand-600',   delta: '+12', up: true },
          { label: 'AI Interactions',   value: '143',  icon: Brain,      color: 'bg-sky-100 text-sky-600',       delta: '+28', up: true },
          { label: 'Students Reached',  value: '142',  icon: Users,      color: 'bg-emerald-100 text-emerald-600', delta: '+5', up: true },
          { label: 'Hours Saved',       value: '31h',  icon: Clock,      color: 'bg-amber-100 text-amber-600',   delta: '+8h', up: true },
        ].map(s => (
          <StaggerItem key={s.label} variants={fadeUp}>
            <motion.div
              className="stat-card h-full"
              whileHover={{ y: -3, boxShadow: '0 8px 30px rgba(139,92,246,0.12)', transition: { duration: 0.2 } }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`icon-bubble ${s.color}`}><s.icon className="w-5 h-5" /></div>
                <span className={`flex items-center gap-0.5 text-xs font-bold ${s.up ? 'text-emerald-600' : 'text-red-500'}`}>
                  {s.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {s.delta}
                </span>
              </div>
              <div className="text-2xl font-black text-slate-900">{s.value}</div>
              <div className="text-xs font-semibold text-slate-700 mt-0.5">{s.label}</div>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerList>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly bar chart */}
        <FadeUp delay={0.15}>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">Weekly Activity</h3>
              <span className="text-xs text-slate-400 flex items-center gap-1"><Calendar className="w-3 h-3" /> This week</span>
            </div>
            <div className="flex items-end gap-2 h-36">
              {weekData.map((d, i) => (
                <motion.div
                  key={d.day}
                  className="flex-1 flex flex-col items-center gap-1"
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  transition={{ delay: 0.3 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformOrigin: 'bottom' }}
                >
                  <span className="text-xs font-bold text-brand-600">{d.lessons || ''}</span>
                  <motion.div
                    className="w-full rounded-t-lg"
                    style={{
                      height: `${Math.max((d.lessons / maxLessons) * 100, 4)}px`,
                      background: d.lessons > 0 ? 'linear-gradient(180deg,#8b5cf6,#6d28d9)' : '#e2e8f0',
                    }}
                    whileHover={{ filter: 'brightness(1.1)', transition: { duration: 0.15 } }}
                  />
                  <span className="text-xs text-slate-400">{d.day}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </FadeUp>

        {/* Monthly trend */}
        <FadeUp delay={0.2}>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">Growth Trend</h3>
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                <TrendingUp className="w-3 h-3" /> +458%
              </span>
            </div>
            <div className="flex items-end gap-2 h-36">
              {monthlyTrend.map((d, i) => (
                <motion.div
                  key={d.month}
                  className="flex-1 flex flex-col items-center gap-1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + i * 0.07, duration: 0.45 }}
                >
                  <span className="text-xs font-bold text-emerald-600">{d.value}</span>
                  <motion.div
                    className="w-full rounded-t-lg"
                    initial={{ height: 0 }}
                    animate={{ height: `${(d.value / maxMonthly) * 100}px` }}
                    transition={{ delay: 0.4 + i * 0.07, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    style={{ background: 'linear-gradient(180deg,#10b981,#059669)' }}
                  />
                  <span className="text-xs text-slate-400">{d.month}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </FadeUp>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tool usage */}
        <FadeUp delay={0.25}>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-5 lg:col-span-1">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Tool Usage</h3>
            <div className="space-y-3">
              {topTools.sort((a, b) => b.uses - a.uses).map((tool, i) => (
                <motion.div
                  key={tool.name}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.06 }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                      <tool.icon className="w-3 h-3" style={{ color: tool.color }} />
                      {tool.name}
                    </span>
                    <span className="text-xs font-bold" style={{ color: tool.color }}>{tool.uses}x</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${tool.pct}%` }}
                      transition={{ delay: 0.4 + i * 0.06, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                      style={{ backgroundColor: tool.color }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </FadeUp>

        {/* Usage heatmap */}
        <FadeUp delay={0.3}>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-5 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">Usage Heatmap</h3>
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <Flame className="w-3 h-3" /> Peak: Thu 2pm
              </div>
            </div>
            <div className="overflow-x-auto">
              <div className="min-w-[320px]">
                <div className="grid gap-1" style={{ gridTemplateColumns: `60px repeat(7, 1fr)` }}>
                  <div />
                  {heatmapDays.map(d => (
                    <div key={d} className="text-center text-xs text-slate-400 pb-1">{d}</div>
                  ))}
                  {heatmapData.map((row, ri) => (
                    <div key={ri} className="contents">
                      <div className="text-xs text-slate-400 flex items-center">{heatmapHours[ri]}</div>
                      {row.map((val, ci) => (
                        <motion.div
                          key={ci}
                          className="aspect-square rounded-md"
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.4 + (ri * 7 + ci) * 0.02, duration: 0.3 }}
                          style={{
                            backgroundColor: val === 0 ? '#f1f5f9' :
                              val === 1 ? '#c4b5fd' :
                              val === 2 ? '#a78bfa' :
                              val === 3 ? '#8b5cf6' :
                              val === 4 ? '#7c3aed' : '#6d28d9',
                          }}
                          title={`${heatmapDays[ci]} ${heatmapHours[ri]}: ${val} sessions`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-end gap-1 mt-2">
                  <span className="text-xs text-slate-400">Less</span>
                  {[0,1,2,3,4,5].map(v => (
                    <div
                      key={v}
                      className="w-3 h-3 rounded-sm"
                      style={{
                        backgroundColor: v === 0 ? '#f1f5f9' :
                          v === 1 ? '#c4b5fd' :
                          v === 2 ? '#a78bfa' :
                          v === 3 ? '#8b5cf6' :
                          v === 4 ? '#7c3aed' : '#6d28d9',
                      }}
                    />
                  ))}
                  <span className="text-xs text-slate-400">More</span>
                </div>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Class engagement */}
        <FadeUp delay={0.35}>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Engagement by Class</h3>
            <div className="space-y-4">
              {engagementByClass.map((cls, i) => (
                <motion.div
                  key={cls.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 + i * 0.08 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700">{cls.name}</span>
                    <span className="text-xs font-bold" style={{ color: cls.color }}>{cls.engagement}%</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${cls.engagement}%` }}
                          transition={{ delay: 0.5 + i * 0.08, duration: 0.7 }}
                          style={{ backgroundColor: cls.color }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-400">Engagement</span>
                    </div>
                    <div className="flex-1">
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full opacity-60"
                          initial={{ width: 0 }}
                          animate={{ width: `${cls.completion}%` }}
                          transition={{ delay: 0.55 + i * 0.08, duration: 0.7 }}
                          style={{ backgroundColor: cls.color }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-400">Completion</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </FadeUp>

        {/* Language distribution */}
        <FadeUp delay={0.4}>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">Content by Language</h3>
              <Globe className="w-4 h-4 text-slate-400" />
            </div>
            <div className="space-y-3">
              {languageUsage.map((l, i) => (
                <motion.div
                  key={l.lang}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.06 }}
                >
                  <span className="text-sm w-6 text-center">{l.flag}</span>
                  <span className="text-xs font-medium text-slate-700 w-20">{l.lang}</span>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-brand-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${l.pct}%` }}
                      transition={{ delay: 0.55 + i * 0.06, duration: 0.6 }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-500 w-8 text-right">{l.pct}%</span>
                </motion.div>
              ))}
            </div>
          </div>
        </FadeUp>
      </div>

      {/* AI Insights */}
      <FadeUp delay={0.45}>
        <div className="bg-gradient-to-r from-brand-50 to-purple-50 rounded-2xl border border-brand-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)' }}>
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">AI Insights</h3>
              <p className="text-xs text-slate-500">Auto-generated recommendations</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {aiInsights.map((insight, i) => (
              <motion.div
                key={i}
                className={`flex items-start gap-3 p-3 rounded-xl ${
                  insight.positive ? 'bg-white/70' : 'bg-amber-50/70 border border-amber-100'
                }`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 + i * 0.07 }}
                whileHover={{ scale: 1.01, transition: { duration: 0.15 } }}
              >
                <div className={`icon-bubble w-7 h-7 rounded-lg flex-shrink-0 ${
                  insight.positive ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                }`}>
                  <insight.icon className="w-3.5 h-3.5" />
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">{insight.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </FadeUp>
    </div>
  )
}
