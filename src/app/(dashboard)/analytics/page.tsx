'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrendingUp, BookOpen, Users, Clock, BarChart2, Star, Target, Zap,
  ArrowUpRight, ArrowDownRight, Calendar, Filter, Download, Brain,
  MessageSquare, FileText, Activity, Globe, Flame, Award, Eye,
  CheckCircle2, CheckCircle, Lightbulb, Trophy, Crown, Medal, Sparkles,
  GraduationCap, PieChart, ArrowUp, ArrowDown, ChevronRight
} from 'lucide-react'
import { FadeUp, StaggerList, StaggerItem, fadeUp, FadeInWhenVisible } from '@/components/ui/motion'

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

type TimeRange = 'week' | 'month' | 'quarter' | 'year'

const timeRanges: { key: TimeRange; label: string }[] = [
  { key: 'week', label: 'This Week' },
  { key: 'month', label: 'This Month' },
  { key: 'quarter', label: 'This Quarter' },
  { key: 'year', label: 'This Year' },
]

/* 8-week class performance data (avg score per week) */
const classPerformanceWeeks = [
  { week: 'Wk 1', science: 72, english: 78, math: 65, history: 80 },
  { week: 'Wk 2', science: 75, english: 76, math: 68, history: 82 },
  { week: 'Wk 3', science: 79, english: 80, math: 71, history: 79 },
  { week: 'Wk 4', science: 78, english: 83, math: 74, history: 84 },
  { week: 'Wk 5', science: 83, english: 85, math: 77, history: 86 },
  { week: 'Wk 6', science: 85, english: 84, math: 80, history: 83 },
  { week: 'Wk 7', science: 88, english: 87, math: 82, history: 88 },
  { week: 'Wk 8', science: 87, english: 90, math: 85, history: 91 },
]

function buildLinePath(pts: {x:number,y:number}[], close = false, baseY = 0): string {
  if (pts.length < 2) return ''
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`
  for (let i = 1; i < pts.length; i++) {
    const cpx = ((pts[i].x + pts[i-1].x) / 2).toFixed(1)
    d += ` C ${cpx} ${pts[i-1].y.toFixed(1)} ${cpx} ${pts[i].y.toFixed(1)} ${pts[i].x.toFixed(1)} ${pts[i].y.toFixed(1)}`
  }
  if (close) d += ` L ${pts[pts.length-1].x.toFixed(1)} ${baseY} L ${pts[0].x.toFixed(1)} ${baseY} Z`
  return d
}

const classLines = [
  { key: 'science' as const, label: '7th Science',  color: '#8b5cf6', gid: 'sci' },
  { key: 'english' as const, label: '10th English',  color: '#f43f5e', gid: 'eng' },
  { key: 'math'    as const, label: 'Algebra II',   color: '#14b8a6', gid: 'mth' },
  { key: 'history' as const, label: '8th History',  color: '#f97316', gid: 'his' },
]

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

/* Teaching Activity Heatmap - 7 days x 4 weeks */
const activityHeatmap = [
  [3, 4, 2, 5, 3, 1, 0],
  [2, 5, 4, 3, 5, 2, 0],
  [4, 3, 5, 4, 2, 0, 1],
  [1, 4, 3, 5, 4, 1, 0],
]
const heatmapWeekLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4']
const heatmapDayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const engagementByClass = [
  { name: '7th Science', engagement: 94, completion: 88, color: '#8b5cf6' },
  { name: '8th History', engagement: 87, completion: 82, color: '#f97316' },
  { name: '9th Math',    engagement: 91, completion: 79, color: '#14b8a6' },
  { name: '10th English',engagement: 78, completion: 85, color: '#f43f5e' },
]

const aiInsights = [
  {
    icon: TrendingUp,
    title: 'Engagement Surge',
    text: 'Student engagement up 12% this week, driven by interactive Biology labs.',
    positive: true,
    color: '#10b981',
    bgColor: 'bg-success-400/10',
    borderColor: 'border-success-400/20',
  },
  {
    icon: Award,
    title: 'Quiz Improvement',
    text: 'Quiz scores improving in Biology -- average score up from 72% to 84% over the last 3 weeks.',
    positive: true,
    color: '#8b5cf6',
    bgColor: 'bg-accent-400/10',
    borderColor: 'border-accent-400/20',
  },
  {
    icon: Lightbulb,
    title: 'Recommendation',
    text: 'Consider more group activities in History. Classes with collaboration see 23% higher retention.',
    positive: false,
    color: '#f59e0b',
    bgColor: 'bg-warning-400/10',
    borderColor: 'border-warning-400/20',
  },
]

const topStudents = [
  { rank: 1, name: 'Emily Chen',      score: 98, trend: 'up',   avatar: 'EC', color: '#f59e0b' },
  { rank: 2, name: 'Marcus Johnson',  score: 95, trend: 'up',   avatar: 'MJ', color: '#c0c0c0' },
  { rank: 3, name: 'Sofia Rodriguez', score: 93, trend: 'up',   avatar: 'SR', color: '#cd7f32' },
  { rank: 4, name: 'Aiden Park',      score: 91, trend: 'down', avatar: 'AP', color: '#8b5cf6' },
  { rank: 5, name: 'Priya Sharma',    score: 89, trend: 'up',   avatar: 'PS', color: '#14b8a6' },
]

const contentPerformance = [
  { title: 'Photosynthesis Lab Guide',    type: 'Lesson',    views: 342, completion: 94, avgScore: 87, color: '#8b5cf6' },
  { title: 'American Revolution Quiz',    type: 'Quiz',      views: 289, completion: 88, avgScore: 82, color: '#f97316' },
  { title: 'Quadratic Equations Sheet',   type: 'Worksheet', views: 256, completion: 76, avgScore: 79, color: '#14b8a6' },
  { title: 'Shakespeare Scene Analysis',  type: 'Activity',  views: 198, completion: 82, avgScore: 85, color: '#f43f5e' },
  { title: 'Cell Division Diagram',       type: 'Lesson',    views: 176, completion: 71, avgScore: 74, color: '#6d28d9' },
]

const goals = [
  { label: 'Materials Created', current: 24, target: 30, icon: BookOpen, color: '#8b5cf6', gradient: 'from-accent-500 to-accent-600' },
  { label: 'Students Reached',  current: 142, target: 150, icon: Users, color: '#10b981', gradient: 'from-success-400 to-success-500' },
  { label: 'Hours Saved',       current: 31, target: 40, icon: Clock, color: '#f59e0b', gradient: 'from-warning-400 to-warning-500' },
]

const languageUsage = [
  { lang: 'English',   pct: 45, flag: '\u{1F1FA}\u{1F1F8}' },
  { lang: 'Espanol',   pct: 22, flag: '\u{1F1EA}\u{1F1F8}' },
  { lang: 'Francais',  pct: 12, flag: '\u{1F1EB}\u{1F1F7}' },
  { lang: 'Other',     pct: 21, flag: '\u{1F30D}' },
]

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function AnalyticsPage() {
  const [range, setRange] = useState<TimeRange>('month')
  const [toastMsg, setToastMsg] = useState('')
  function showToast(msg: string) { setToastMsg(msg); setTimeout(() => setToastMsg(''), 2500) }
  const maxLessons = Math.max(...weekData.map(d => d.lessons))
  const maxMonthly = Math.max(...monthlyTrend.map(d => d.value))

  return (
    <div className="space-y-6">

      {/* ---- Hero Header ---- */}
      <FadeUp>
        <div className="hero-mesh rounded-3xl p-6 border border-white/[0.06]">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg,#6366f1,#4f46e5)' }}>
                <BarChart2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-black text-white tracking-tight">Analytics</h1>
                  <motion.div
                    className="flex items-center gap-1 text-[10px] font-bold text-success-400 bg-success-400/10 px-2 py-0.5 rounded-full border border-success-400/20"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                  >
                    <TrendingUp className="w-2.5 h-2.5" /> Live
                  </motion.div>
                </div>
                <p className="text-sm text-surface-400">Track AI-powered teaching productivity and student outcomes.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <motion.button className="btn-secondary text-xs px-3 py-1.5" whileHover={{ scale: 1.03 }} onClick={() => showToast('Analytics report exported!')}>
                <Download className="w-3.5 h-3.5" /> Export Report
              </motion.button>
              <motion.button className="btn-gradient text-xs" whileHover={{ scale: 1.03 }} onClick={() => showToast('AI insights refreshed!')}>
                <Sparkles className="w-3.5 h-3.5" /> AI Insights
              </motion.button>
            </div>
          </div>
          <div className="border-t border-white/[0.06] pt-4 flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold">Period</span>
              <span className="text-xs font-bold text-white capitalize">{range}</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold">Students</span>
              <span className="text-xs font-bold text-white">28</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold">Avg Score</span>
              <span className="text-xs font-bold text-success-400">87%</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold">Engagement</span>
              <span className="text-xs font-bold text-accent-300">94%</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold">AI Assists</span>
              <span className="text-xs font-bold text-white">156</span>
            </div>
          </div>
        </div>
      </FadeUp>

      {/* ---- Date range selector tabs ---- */}
      <FadeUp delay={0.05}>
        <div className="flex items-center gap-1.5 p-1 bg-white/[0.04] rounded-2xl border border-white/[0.06] w-fit">
          {timeRanges.map(r => (
            <motion.button
              key={r.key}
              onClick={() => setRange(r.key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all relative ${
                range === r.key
                  ? 'text-white'
                  : 'text-surface-400 hover:text-surface-200'
              }`}
              whileHover={{ scale: range === r.key ? 1 : 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              {range === r.key && (
                <motion.div
                  className="absolute inset-0 bg-accent-600 rounded-xl shadow-glow-sm"
                  layoutId="activeTab"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{r.label}</span>
            </motion.button>
          ))}
        </div>
      </FadeUp>

      {/* ---- Summary stats ---- */}
      <StaggerList className="grid grid-cols-2 lg:grid-cols-4 gap-4" delay={0.08}>
        {[
          { label: 'Materials Created', value: '67',   icon: BookOpen,   color: 'bg-accent-400/15 text-accent-400',     gradient: 'from-accent-500/20 to-accent-600/5', delta: '+12', up: true },
          { label: 'AI Interactions',   value: '143',  icon: Brain,      color: 'bg-electric-400/15 text-electric-400', gradient: 'from-electric-400/20 to-electric-500/5', delta: '+28', up: true },
          { label: 'Students Reached',  value: '142',  icon: Users,      color: 'bg-success-400/15 text-success-400',   gradient: 'from-success-400/20 to-success-500/5', delta: '+5', up: true },
          { label: 'Hours Saved',       value: '31h',  icon: Clock,      color: 'bg-warning-400/15 text-warning-400',   gradient: 'from-warning-400/20 to-warning-500/5', delta: '+8h', up: true },
        ].map(s => (
          <StaggerItem key={s.label} variants={fadeUp}>
            <motion.div
              className="glass-card p-5 h-full relative overflow-hidden"
              whileHover={{ y: -3, boxShadow: '0 8px 30px rgba(139,92,246,0.12)', transition: { duration: 0.2 } }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${s.gradient} pointer-events-none`} />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className={`icon-bubble ${s.color}`}><s.icon className="w-5 h-5" /></div>
                  <span className={`flex items-center gap-0.5 text-xs font-bold ${s.up ? 'text-success-400' : 'text-danger-400'}`}>
                    {s.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {s.delta}
                  </span>
                </div>
                <motion.div
                  className="text-2xl font-black text-white"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  {s.value}
                </motion.div>
                <div className="text-xs font-semibold text-surface-200 mt-0.5">{s.label}</div>
              </div>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerList>

      {/* ---- AI Insights ---- */}
      <FadeUp delay={0.15}>
        <div className="glass-card p-5 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-accent-500/[0.05] rounded-full blur-[60px]" />
          </div>
          <div className="relative">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)' }}>
                <Brain className="w-4.5 h-4.5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">AI Insights</h3>
                <p className="text-xs text-surface-500">Auto-generated from your data</p>
              </div>
              <motion.div
                className="ml-auto flex items-center gap-1 text-[10px] font-bold text-accent-400 bg-accent-400/10 px-2 py-0.5 rounded-full"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-2.5 h-2.5" /> AI-Powered
              </motion.div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {aiInsights.map((insight, i) => (
                <motion.div
                  key={i}
                  className={`p-4 rounded-2xl border ${insight.bgColor} ${insight.borderColor} relative overflow-hidden`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -2, scale: 1.01, transition: { duration: 0.2 } }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${insight.color}20` }}
                    >
                      <insight.icon className="w-4 h-4" style={{ color: insight.color }} />
                    </div>
                    <span className="text-xs font-bold text-white">{insight.title}</span>
                  </div>
                  <p className="text-xs text-surface-300 leading-relaxed">{insight.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </FadeUp>

      {/* ---- Charts row: Weekly + Growth ---- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FadeUp delay={0.2}>
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white">Weekly Activity</h3>
              <span className="text-xs text-surface-500 flex items-center gap-1"><Calendar className="w-3 h-3" /> This week</span>
            </div>
            {(() => {
              const W = 500, H = 132, N = weekData.length
              const slotW = W / N
              const barW = slotW * 0.65
              const baseY = H - 14
              const chartH = baseY - 14
              return (
                <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 160 }}>
                  <defs>
                    <linearGradient id="an-week-bar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.95} />
                      <stop offset="100%" stopColor="#6d28d9" stopOpacity={0.7} />
                    </linearGradient>
                  </defs>
                  {weekData.map((d, i) => {
                    const x = i * slotW + (slotW - barW) / 2
                    const bh = d.lessons > 0 ? Math.max((d.lessons / maxLessons) * chartH, 6) : 3
                    return (
                      <g key={d.day}>
                        <rect x={x} y={14} width={barW} height={chartH} rx={5} fill="rgba(255,255,255,0.035)" />
                        {d.lessons > 0 && (
                          <motion.rect x={x} width={barW} rx={5} fill="url(#an-week-bar)"
                            initial={{ y: baseY, height: 0 }}
                            animate={{ y: baseY - bh, height: bh }}
                            transition={{ delay: 0.3 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                          />
                        )}
                        {d.lessons > 0 && (
                          <text x={x + barW / 2} y={baseY - bh - 3} textAnchor="middle" fill="#a78bfa" fontSize={11} fontFamily="inherit" fontWeight="bold">{d.lessons}</text>
                        )}
                        <text x={x + barW / 2} y={H - 1} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize={10} fontFamily="inherit">{d.day}</text>
                      </g>
                    )
                  })}
                </svg>
              )
            })()}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.06]">
              <span className="text-xs text-surface-500">Total: 16 lessons</span>
              <span className="text-xs font-bold text-success-400 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" /> 23% vs last week
              </span>
            </div>
          </div>
        </FadeUp>

        <FadeUp delay={0.25}>
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white">Growth Trend</h3>
              <span className="flex items-center gap-1 text-xs font-bold text-success-400">
                <TrendingUp className="w-3 h-3" /> +458%
              </span>
            </div>
            {(() => {
              const W = 500, H = 132, N = monthlyTrend.length
              const slotW = W / N
              const barW = slotW * 0.6
              const baseY = H - 14
              const chartH = baseY - 14
              return (
                <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 160 }}>
                  <defs>
                    <linearGradient id="an-growth-bar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.95} />
                      <stop offset="100%" stopColor="#059669" stopOpacity={0.7} />
                    </linearGradient>
                  </defs>
                  {monthlyTrend.map((d, i) => {
                    const x = i * slotW + (slotW - barW) / 2
                    const bh = Math.max((d.value / maxMonthly) * chartH, 4)
                    return (
                      <g key={d.month}>
                        <rect x={x} y={14} width={barW} height={chartH} rx={5} fill="rgba(255,255,255,0.035)" />
                        <motion.rect x={x} width={barW} rx={5} fill="url(#an-growth-bar)"
                          initial={{ y: baseY, height: 0 }}
                          animate={{ y: baseY - bh, height: bh }}
                          transition={{ delay: 0.4 + i * 0.07, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        />
                        <text x={x + barW / 2} y={baseY - bh - 3} textAnchor="middle" fill="#34d399" fontSize={11} fontFamily="inherit" fontWeight="bold">{d.value}</text>
                        <text x={x + barW / 2} y={H - 1} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize={10} fontFamily="inherit">{d.month}</text>
                      </g>
                    )
                  })}
                </svg>
              )
            })()}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.06]">
              <span className="text-xs text-surface-500">6-month overview</span>
              <span className="text-xs font-bold text-success-400 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Accelerating
              </span>
            </div>
          </div>
        </FadeUp>
      </div>

      {/* ---- Class Performance Trend (SVG line chart) ---- */}
      <FadeUp delay={0.28}>
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-accent-400" /> Class Performance Trend
              </h3>
              <p className="text-xs text-surface-500 mt-0.5">8-week average score per class</p>
            </div>
            <div className="flex items-center gap-4">
              {classLines.map(cl => (
                <div key={cl.key} className="flex items-center gap-1.5">
                  <div className="w-6 h-0.5 rounded-full" style={{ background: cl.color }} />
                  <span className="text-[10px] text-surface-400">{cl.label}</span>
                </div>
              ))}
            </div>
          </div>
          {(() => {
            const W = 600, H = 160, PX = 32, PY = 16
            const minV = 60, maxV = 100
            const toX = (i: number) => PX + (i / (classPerformanceWeeks.length - 1)) * (W - PX * 2)
            const toY = (v: number) => PY + ((maxV - v) / (maxV - minV)) * (H - PY * 2)
            const gridVals = [70, 80, 90, 100]
            return (
              <div className="relative w-full" style={{ height: 180 }}>
                <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="none">
                  <defs>
                    {classLines.map(cl => (
                      <linearGradient key={cl.gid} id={`ag-${cl.gid}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={cl.color} stopOpacity="0.25"/>
                        <stop offset="100%" stopColor={cl.color} stopOpacity="0.01"/>
                      </linearGradient>
                    ))}
                  </defs>
                  {/* grid lines */}
                  {gridVals.map(v => (
                    <line key={v} x1={PX} y1={toY(v)} x2={W - PX} y2={toY(v)}
                      stroke="rgba(255,255,255,0.05)" strokeWidth="1"
                      strokeDasharray={v === 100 ? '0' : '4 4'}/>
                  ))}
                  {/* x-axis tick lines */}
                  {classPerformanceWeeks.map((_, i) => (
                    <line key={i} x1={toX(i)} y1={PY} x2={toX(i)} y2={H - PY}
                      stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
                  ))}
                  {/* area fills */}
                  {classLines.map(cl => {
                    const pts = classPerformanceWeeks.map((d, i) => ({ x: toX(i), y: toY(d[cl.key]) }))
                    return <path key={`a-${cl.key}`} d={buildLinePath(pts, true, H - PY)} fill={`url(#ag-${cl.gid})`}/>
                  })}
                  {/* lines */}
                  {classLines.map(cl => {
                    const pts = classPerformanceWeeks.map((d, i) => ({ x: toX(i), y: toY(d[cl.key]) }))
                    return <path key={`l-${cl.key}`} d={buildLinePath(pts)} fill="none" stroke={cl.color} strokeWidth="2" strokeLinecap="round"/>
                  })}
                  {/* dots on last point */}
                  {classLines.map(cl => {
                    const last = classPerformanceWeeks[classPerformanceWeeks.length - 1]
                    return (
                      <g key={`d-${cl.key}`}>
                        <circle cx={toX(classPerformanceWeeks.length-1)} cy={toY(last[cl.key])} r="5" fill={cl.color} fillOpacity="0.2"/>
                        <circle cx={toX(classPerformanceWeeks.length-1)} cy={toY(last[cl.key])} r="3" fill={cl.color}/>
                      </g>
                    )
                  })}
                  {/* y-axis labels */}
                  {gridVals.map(v => (
                    <text key={`yl-${v}`} x={PX - 6} y={toY(v) + 4} textAnchor="end"
                      fontSize="9" fill="rgba(255,255,255,0.3)">{v}</text>
                  ))}
                  {/* x-axis labels */}
                  {classPerformanceWeeks.map((d, i) => (
                    <text key={`xl-${i}`} x={toX(i)} y={H - 2} textAnchor="middle"
                      fontSize="9" fill="rgba(255,255,255,0.3)">{d.week}</text>
                  ))}
                </svg>
              </div>
            )
          })()}
          <div className="mt-3 grid grid-cols-4 gap-3 pt-3 border-t border-white/[0.06]">
            {classLines.map(cl => {
              const last = classPerformanceWeeks[classPerformanceWeeks.length - 1][cl.key]
              const first = classPerformanceWeeks[0][cl.key]
              const delta = last - first
              return (
                <div key={cl.key} className="text-center">
                  <p className="text-lg font-black text-white">{last}%</p>
                  <p className="text-[10px] text-surface-500">{cl.label}</p>
                  <p className="text-[10px] font-bold text-success-400">+{delta}pts</p>
                </div>
              )
            })}
          </div>
        </div>
      </FadeUp>

      {/* ---- Top Performing Students + Goal Tracker ---- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Students */}
        <FadeUp delay={0.3}>
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-warning-400" /> Top Performing Students
              </h3>
              <span className="text-xs text-surface-500">This month</span>
            </div>
            <div className="space-y-2">
              {topStudents.map((student, i) => (
                <motion.div
                  key={student.name}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors cursor-pointer"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ x: 2, transition: { duration: 0.15 } }}
                >
                  {/* Rank */}
                  <div className="w-6 flex-shrink-0 text-center">
                    {student.rank === 1 ? (
                      <Crown className="w-4 h-4 text-warning-400 mx-auto" />
                    ) : student.rank === 2 ? (
                      <Medal className="w-4 h-4 text-surface-300 mx-auto" />
                    ) : student.rank === 3 ? (
                      <Medal className="w-4 h-4 mx-auto" style={{ color: '#cd7f32' }} />
                    ) : (
                      <span className="text-xs font-bold text-surface-500">#{student.rank}</span>
                    )}
                  </div>
                  {/* Avatar */}
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${student.color}, ${student.color}99)` }}
                  >
                    {student.avatar}
                  </div>
                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-surface-100 truncate">{student.name}</p>
                  </div>
                  {/* Score */}
                  <div className="text-right flex items-center gap-2">
                    <span className="text-sm font-black text-white">{student.score}%</span>
                    {student.trend === 'up' ? (
                      <ArrowUp className="w-3.5 h-3.5 text-success-400" />
                    ) : (
                      <ArrowDown className="w-3.5 h-3.5 text-danger-400" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </FadeUp>

        {/* Goal Tracker */}
        <FadeUp delay={0.35}>
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Target className="w-4 h-4 text-accent-400" /> Goal Tracker
              </h3>
              <span className="text-xs text-surface-500">Monthly targets</span>
            </div>
            <div className="space-y-5">
              {goals.map((goal, i) => {
                const pct = Math.round((goal.current / goal.target) * 100)
                return (
                  <motion.div
                    key={goal.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 + i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${goal.color}20` }}
                        >
                          <goal.icon className="w-4 h-4" style={{ color: goal.color }} />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-surface-200">{goal.label}</p>
                          <p className="text-[10px] text-surface-500">{goal.current} / {goal.target}</p>
                        </div>
                      </div>
                      <motion.span
                        className="text-sm font-black"
                        style={{ color: goal.color }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 + i * 0.1 }}
                      >
                        {pct}%
                      </motion.span>
                    </div>
                    <div className="h-2.5 bg-white/[0.06] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full relative"
                        style={{
                          background: `linear-gradient(90deg, ${goal.color}, ${goal.color}cc)`,
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ delay: 0.5 + i * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <motion.div
                          className="absolute inset-0 rounded-full"
                          style={{
                            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
                          }}
                          animate={{ x: ['-100%', '200%'] }}
                          transition={{ duration: 2, delay: 1 + i * 0.2, repeat: Infinity, repeatDelay: 3 }}
                        />
                      </motion.div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
            <motion.div
              className="mt-5 p-3 rounded-xl bg-accent-500/[0.08] border border-accent-500/[0.15]"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent-400 flex-shrink-0" />
                <p className="text-xs text-surface-300">
                  <span className="font-bold text-accent-400">On track!</span> You are on pace to hit all 3 goals by month end.
                </p>
              </div>
            </motion.div>
          </div>
        </FadeUp>
      </div>

      {/* ---- Content Performance ---- */}
      <FadeUp delay={0.4}>
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <PieChart className="w-4 h-4 text-accent-400" /> Content Performance
            </h3>
            <button onClick={() => showToast('Opening content performance report…')} className="text-xs text-accent-400 font-semibold hover:text-accent-300 flex items-center gap-1">
              View all <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px]">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left text-[10px] font-bold text-surface-500 uppercase tracking-wider pb-3 pr-4">Material</th>
                  <th className="text-left text-[10px] font-bold text-surface-500 uppercase tracking-wider pb-3 pr-4">Type</th>
                  <th className="text-right text-[10px] font-bold text-surface-500 uppercase tracking-wider pb-3 pr-4">Views</th>
                  <th className="text-left text-[10px] font-bold text-surface-500 uppercase tracking-wider pb-3 pr-4 w-32">Completion</th>
                  <th className="text-right text-[10px] font-bold text-surface-500 uppercase tracking-wider pb-3">Avg Score</th>
                </tr>
              </thead>
              <tbody>
                {contentPerformance.map((item, i) => (
                  <motion.tr
                    key={item.title}
                    className="border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors cursor-pointer"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.06, duration: 0.4 }}
                  >
                    <td className="py-3 pr-4">
                      <span className="text-xs font-semibold text-surface-100">{item.title}</span>
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: `${item.color}20`, color: item.color }}
                      >
                        {item.type}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-right">
                      <span className="text-xs font-semibold text-surface-300 flex items-center justify-end gap-1">
                        <Eye className="w-3 h-3 text-surface-500" /> {item.views}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        {(() => {
                          const W = 100, H = 6
                          const bw = (item.completion / 100) * W
                          const gid = `an-comp-${i}`
                          return (
                            <svg viewBox={`0 0 ${W} ${H}`} className="flex-1 overflow-visible" style={{ minWidth: 60 }}>
                              <defs>
                                <linearGradient id={gid} x1="0" x2="1" y1="0" y2="0">
                                  <stop offset="0%" stopColor={item.color} />
                                  <stop offset="100%" stopColor={item.color + '99'} />
                                </linearGradient>
                              </defs>
                              <rect x={0} y={0} width={W} height={H} rx={3} fill="rgba(255,255,255,0.06)" />
                              <motion.rect
                                x={0} y={0} height={H} rx={3}
                                fill={`url(#${gid})`}
                                initial={{ width: 0 }}
                                animate={{ width: bw }}
                                transition={{ delay: 0.6 + i * 0.06, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                              />
                            </svg>
                          )
                        })()}
                        <span className="text-[10px] font-bold text-surface-400 w-8 text-right">{item.completion}%</span>
                      </div>
                    </td>
                    <td className="py-3 text-right">
                      <span className="text-xs font-bold text-white">{item.avgScore}%</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </FadeUp>

      {/* ---- Heatmap + Tool Usage ---- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Teaching Activity Heatmap */}
        <FadeUp delay={0.45}>
          <div className="glass-card p-5 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-warning-400" /> Teaching Activity Heatmap
              </h3>
              <div className="flex items-center gap-1 text-xs text-surface-500">
                <Activity className="w-3 h-3" /> Last 4 weeks
              </div>
            </div>
            <div className="overflow-x-auto">
              <div className="min-w-[320px]">
                <div className="grid gap-1.5" style={{ gridTemplateColumns: `56px repeat(7, 1fr)` }}>
                  {/* Day headers */}
                  <div />
                  {heatmapDayLabels.map(d => (
                    <div key={d} className="text-center text-[10px] font-semibold text-surface-500 pb-1">{d}</div>
                  ))}
                  {/* Rows */}
                  {activityHeatmap.map((row, ri) => (
                    <div key={ri} className="contents">
                      <div className="text-[10px] font-semibold text-surface-500 flex items-center">{heatmapWeekLabels[ri]}</div>
                      {row.map((val, ci) => (
                        <motion.div
                          key={ci}
                          className="aspect-square rounded-lg cursor-pointer relative group"
                          initial={{ opacity: 0, scale: 0.3 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.55 + (ri * 7 + ci) * 0.025, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          whileHover={{ scale: 1.15, transition: { duration: 0.15 } }}
                          style={{
                            backgroundColor: val === 0 ? 'rgba(255,255,255,0.04)' :
                              val === 1 ? '#c4b5fd' :
                              val === 2 ? '#a78bfa' :
                              val === 3 ? '#8b5cf6' :
                              val === 4 ? '#7c3aed' : '#6d28d9',
                          }}
                          title={`${heatmapDayLabels[ci]} ${heatmapWeekLabels[ri]}: ${val} activities`}
                        >
                          <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-surface-900 border border-white/[0.1] text-[9px] text-surface-300 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                            {val} activities
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-[10px] text-surface-500">28 active days this month</span>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-surface-500">Less</span>
                    {[0, 1, 2, 3, 4, 5].map(v => (
                      <div
                        key={v}
                        className="w-3 h-3 rounded-sm"
                        style={{
                          backgroundColor: v === 0 ? 'rgba(255,255,255,0.04)' :
                            v === 1 ? '#c4b5fd' :
                            v === 2 ? '#a78bfa' :
                            v === 3 ? '#8b5cf6' :
                            v === 4 ? '#7c3aed' : '#6d28d9',
                        }}
                      />
                    ))}
                    <span className="text-[10px] text-surface-500">More</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeUp>

        {/* Tool Usage */}
        <FadeUp delay={0.5}>
          <div className="glass-card p-5">
            <h3 className="text-sm font-bold text-white mb-4">Tool Usage</h3>
            {(() => {
              const sorted = [...topTools].sort((a, b) => b.uses - a.uses)
              const W = 340, LW = 116, CW = 32, GAP = 7, ROW = 22
              const BAR_MAX = W - LW - CW - 6
              const H = sorted.length * (ROW + GAP) - GAP
              return (
                <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible">
                  <defs>
                    {sorted.map((t, i) => (
                      <linearGradient key={i} id={`an-tool-${i}`} x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor={t.color} stopOpacity={0.9} />
                        <stop offset="100%" stopColor={t.color} stopOpacity={0.5} />
                      </linearGradient>
                    ))}
                  </defs>
                  {sorted.map((t, i) => {
                    const bw = (t.pct / 100) * BAR_MAX
                    const y = i * (ROW + GAP)
                    return (
                      <g key={t.name}>
                        <circle cx={6} cy={y + 11} r={5} fill={t.color} fillOpacity={0.2} />
                        <circle cx={6} cy={y + 11} r={2.5} fill={t.color} />
                        <text x={16} y={y + 15} fill="rgba(255,255,255,0.55)" fontSize={10} fontFamily="inherit">{t.name}</text>
                        <rect x={LW} y={y + 5} width={BAR_MAX} height={12} rx={3} fill="rgba(255,255,255,0.04)" />
                        <motion.rect x={LW} y={y + 5} height={12} rx={3} fill={`url(#an-tool-${i})`}
                          initial={{ width: 0 }} animate={{ width: bw }}
                          transition={{ delay: 0.65 + i * 0.06, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        />
                        <text x={LW + BAR_MAX + 5} y={y + 15} fill={t.color} fontSize={10} fontFamily="inherit" fontWeight="bold">{t.uses}x</text>
                      </g>
                    )
                  })}
                </svg>
              )
            })()}
          </div>
        </FadeUp>
      </div>

      {/* ---- Engagement by Class + Language Distribution ---- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FadeUp delay={0.55}>
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-accent-400" /> Engagement by Class
              </h3>
            </div>
            {(() => {
              const W = 340, LW = 82, CW = 36, BROW = 11, BGAP = 5, LBL_H = 14, OUTER_GAP = 10
              const BAR_MAX = W - LW - CW - 6
              const ITEM_H = LBL_H + BROW + BGAP + BROW
              const H = engagementByClass.length * (ITEM_H + OUTER_GAP) - OUTER_GAP
              return (
                <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible">
                  <defs>
                    {engagementByClass.map((cls, i) => (
                      <linearGradient key={i} id={`an-ebc-${i}`} x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor={cls.color} stopOpacity={0.9} />
                        <stop offset="100%" stopColor={cls.color} stopOpacity={0.5} />
                      </linearGradient>
                    ))}
                  </defs>
                  {engagementByClass.map((cls, i) => {
                    const baseY = i * (ITEM_H + OUTER_GAP)
                    const bwEng = (cls.engagement / 100) * BAR_MAX
                    const bwCmp = (cls.completion / 100) * BAR_MAX
                    return (
                      <g key={cls.name}>
                        <text x={0} y={baseY + LBL_H - 3} fill="rgba(255,255,255,0.65)" fontSize={10} fontFamily="inherit" fontWeight="bold">{cls.name}</text>
                        <text x={LW + BAR_MAX + 5} y={baseY + LBL_H - 3} fill={cls.color} fontSize={10} fontFamily="inherit" fontWeight="bold">{cls.engagement}%</text>
                        <rect x={LW} y={baseY + LBL_H} width={BAR_MAX} height={BROW} rx={3} fill="rgba(255,255,255,0.04)" />
                        <motion.rect x={LW} y={baseY + LBL_H} height={BROW} rx={3} fill={`url(#an-ebc-${i})`}
                          initial={{ width: 0 }} animate={{ width: bwEng }}
                          transition={{ delay: 0.7 + i * 0.08, duration: 0.7 }}
                        />
                        <rect x={LW} y={baseY + LBL_H + BROW + BGAP} width={BAR_MAX} height={BROW} rx={3} fill="rgba(255,255,255,0.04)" />
                        <motion.rect x={LW} y={baseY + LBL_H + BROW + BGAP} height={BROW} rx={3} fill={cls.color} fillOpacity={0.35}
                          initial={{ width: 0 }} animate={{ width: bwCmp }}
                          transition={{ delay: 0.75 + i * 0.08, duration: 0.7 }}
                        />
                        <text x={LW + BAR_MAX + 5} y={baseY + LBL_H + BROW + BGAP + BROW - 1} fill="rgba(255,255,255,0.35)" fontSize={9} fontFamily="inherit">{cls.completion}%</text>
                      </g>
                    )
                  })}
                  <text x={LW} y={H + 10} fill="rgba(255,255,255,0.3)" fontSize={9} fontFamily="inherit">↑ Eng · Completion ↓</text>
                </svg>
              )
            })()}
          </div>
        </FadeUp>

        <FadeUp delay={0.6}>
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white">Content by Language</h3>
              <Globe className="w-4 h-4 text-surface-500" />
            </div>
            {(() => {
              const W = 320, LW = 78, CW = 32, GAP = 7, ROW = 22
              const BAR_MAX = W - LW - CW - 6
              const H = languageUsage.length * (ROW + GAP) - GAP
              return (
                <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible">
                  <defs>
                    <linearGradient id="an-lang-bar" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0.5} />
                    </linearGradient>
                  </defs>
                  {languageUsage.map((l, i) => {
                    const bw = (l.pct / 100) * BAR_MAX
                    const y = i * (ROW + GAP)
                    return (
                      <g key={l.lang}>
                        <text x={0} y={y + 15} fontSize={13} fontFamily="inherit">{l.flag}</text>
                        <text x={20} y={y + 15} fill="rgba(255,255,255,0.55)" fontSize={10} fontFamily="inherit">{l.lang}</text>
                        <rect x={LW} y={y + 4} width={BAR_MAX} height={12} rx={3} fill="rgba(255,255,255,0.04)" />
                        <motion.rect x={LW} y={y + 4} height={12} rx={3} fill="url(#an-lang-bar)"
                          initial={{ width: 0 }} animate={{ width: bw }}
                          transition={{ delay: 0.75 + i * 0.06, duration: 0.6 }}
                        />
                        <text x={LW + BAR_MAX + 5} y={y + 15} fill="rgba(255,255,255,0.6)" fontSize={10} fontFamily="inherit" fontWeight="bold">{l.pct}%</text>
                      </g>
                    )
                  })}
                </svg>
              )
            })()}
          </div>
        </FadeUp>
      </div>

      <AnimatePresence>
        {toastMsg && (
          <motion.div
            className="fixed top-5 right-5 z-[100] flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl text-sm font-semibold text-white border border-white/[0.08]"
            style={{ background: 'linear-gradient(135deg,#0a0f1a,#111827)' }}
            initial={{ opacity: 0, y: -12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
            exit={{ opacity: 0, y: -12, scale: 0.95 }}
          >
            <CheckCircle className="w-4 h-4 text-accent-400 flex-shrink-0" />
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
