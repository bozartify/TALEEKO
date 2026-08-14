'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText, Download, Sparkles, Calendar, Users, BarChart2,
  TrendingUp, BookOpen, ClipboardList, Filter, ChevronDown,
  FileSpreadsheet, File, Loader2, Check, ArrowRight, Clock, Star,
  Plus, X, Mail, Share2, Send, RefreshCw, Eye, Lock, Globe,
  ChevronRight, Bell, Settings, Zap, Brain, Target, Layers,
  AlertTriangle, PieChart, Activity, CheckCircle
} from 'lucide-react'
import { FadeUp, FadeInWhenVisible } from '@/components/ui/motion'

type ReportId = 'progress' | 'class' | 'curriculum' | 'engagement' | 'assessment' | 'ai-usage'
type ReportTab = 'generate' | 'scheduled' | 'history'
type FormatOption = 'pdf' | 'xlsx' | 'csv' | 'html'

interface ReportType {
  id: ReportId
  title: string
  desc: string
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
  color: string
  fields: { label: string; type: 'select' | 'daterange' | 'checkbox'; options?: string[] }[]
  time: string
  popular?: boolean
}

interface ScheduledReport {
  id: string
  title: string
  type: string
  frequency: 'weekly' | 'monthly' | 'daily'
  nextRun: string
  recipients: number
  format: FormatOption
  active: boolean
}

interface RecentReport {
  id: string
  title: string
  type: string
  date: string
  format: FormatOption
  size: string
  sharedWith?: number
  views: number
}

const reportTypes: ReportType[] = [
  {
    id: 'progress',
    title: 'Student Progress Report',
    desc: 'Comprehensive individual student performance across all assessments',
    icon: TrendingUp,
    color: '#6366f1',
    time: '~45s',
    popular: true,
    fields: [
      { label: 'Student', type: 'select', options: ['All Students', 'Emma Wilson', 'Liam Chen', 'Sofia Rodriguez', 'Noah Thompson'] },
      { label: 'Date Range', type: 'daterange' },
      { label: 'Include Grades', type: 'checkbox' },
      { label: 'Include Attendance', type: 'checkbox' },
      { label: 'Include Comments', type: 'checkbox' },
    ],
  },
  {
    id: 'class',
    title: 'Class Performance Summary',
    desc: 'Aggregate class data with distribution charts and AI insights',
    icon: Users,
    color: '#8b5cf6',
    time: '~30s',
    popular: true,
    fields: [
      { label: 'Class', type: 'select', options: ['All Classes', '7th Science', '8th History', '9th Math', '10th English'] },
      { label: 'Subject', type: 'select', options: ['All Subjects', 'Science', 'Math', 'English', 'History'] },
      { label: 'Assessment Type', type: 'select', options: ['All Types', 'Quiz', 'Test', 'Project', 'Homework'] },
    ],
  },
  {
    id: 'curriculum',
    title: 'Curriculum Coverage Report',
    desc: 'Standards alignment and coverage gaps analysis by framework',
    icon: BookOpen,
    color: '#14b8a6',
    time: '~60s',
    fields: [
      { label: 'Course', type: 'select', options: ['All Courses', 'AP Biology', 'Algebra I', 'Literature', 'US History'] },
      { label: 'Standards Framework', type: 'select', options: ['NGSS', 'CCSS', 'AP Curriculum', 'State Standards'] },
      { label: 'Time Period', type: 'select', options: ['This Semester', 'Last Semester', 'Full Year', 'Custom Range'] },
    ],
  },
  {
    id: 'engagement',
    title: 'Engagement Analytics',
    desc: 'AI-analyzed engagement patterns and intervention recommendations',
    icon: BarChart2,
    color: '#f97316',
    time: '~50s',
    fields: [
      { label: 'Class', type: 'select', options: ['All Classes', '7th Science', '8th History', '9th Math'] },
      { label: 'Metric Type', type: 'select', options: ['Participation', 'Submission Rate', 'Score Trends', 'All Metrics'] },
      { label: 'Comparison Period', type: 'select', options: ['vs Last Month', 'vs Last Semester', 'vs Class Avg'] },
    ],
  },
  {
    id: 'assessment',
    title: 'Assessment Results',
    desc: 'Detailed quiz and test results with item analysis and class comparison',
    icon: ClipboardList,
    color: '#ec4899',
    time: '~25s',
    fields: [
      { label: 'Assessment', type: 'select', options: ['All Assessments', 'Mid-term Exam', 'Lab Quiz', 'Unit Test 4', 'Final Project'] },
      { label: 'Include Statistics', type: 'checkbox' },
      { label: 'Include Item Analysis', type: 'checkbox' },
      { label: 'Include Student Breakdown', type: 'checkbox' },
    ],
  },
  {
    id: 'ai-usage',
    title: 'AI Usage Report',
    desc: 'Track AI tool usage, generation counts, time saved, and ROI',
    icon: Sparkles,
    color: '#22d3ee',
    time: '~20s',
    fields: [
      { label: 'Date Range', type: 'daterange' },
      { label: 'Tool Category', type: 'select', options: ['All Tools', 'Content Creation', 'Analysis', 'Assistants', 'Subject-Specific'] },
      { label: 'Include Cost Analysis', type: 'checkbox' },
      { label: 'Include Time Saved', type: 'checkbox' },
    ],
  },
]

const scheduledReports: ScheduledReport[] = [
  { id: '1', title: 'Weekly Class Summary', type: 'Class Performance', frequency: 'weekly', nextRun: 'Aug 4, 2026', recipients: 3, format: 'pdf', active: true },
  { id: '2', title: 'Monthly Progress Report', type: 'Student Progress', frequency: 'monthly', nextRun: 'Aug 31, 2026', recipients: 28, format: 'pdf', active: true },
  { id: '3', title: 'Engagement Analytics Digest', type: 'Engagement', frequency: 'weekly', nextRun: 'Aug 4, 2026', recipients: 1, format: 'xlsx', active: false },
]

const recentReports: RecentReport[] = [
  { id: '1', title: '10th Grade Progress - Q3', type: 'Student Progress', date: 'Jul 15, 2026', format: 'pdf', size: '2.4 MB', sharedWith: 3, views: 12 },
  { id: '2', title: 'AP Biology Class Summary', type: 'Class Performance', date: 'Jul 12, 2026', format: 'xlsx', size: '1.1 MB', sharedWith: 1, views: 5 },
  { id: '3', title: 'Standards Coverage - NGSS', type: 'Curriculum Coverage', date: 'Jul 8, 2026', format: 'pdf', size: '3.8 MB', views: 7 },
  { id: '4', title: 'Weekly Engagement Report', type: 'Engagement', date: 'Jul 7, 2026', format: 'pdf', size: '890 KB', sharedWith: 2, views: 4 },
  { id: '5', title: 'Mid-term Assessment Analysis', type: 'Assessment Results', date: 'Jul 1, 2026', format: 'xlsx', size: '1.5 MB', views: 9 },
  { id: '6', title: 'AI Tools Usage - June', type: 'AI Usage', date: 'Jun 30, 2026', format: 'pdf', size: '650 KB', views: 3 },
]

const aiInsights = [
  { color: '#6366f1', title: 'Engagement Drop Detected', desc: '9th Grade Math shows 14% lower engagement this month — generate a targeted engagement report to identify root causes.', cta: 'Generate Report' },
  { color: '#10b981', title: 'Standards Gap Opportunity', desc: 'NGSS alignment is at 72% — a curriculum coverage report would surface 5 high-impact standards to close before semester end.', cta: 'Run Analysis' },
  { color: '#f59e0b', title: 'Progress Reports Due', desc: '4 students are flagged for at-risk status. Parent communication reports are recommended before the Aug 15 deadline.', cta: 'Create Reports' },
]

const monthlyActivity = [
  { month: 'Feb', progress: 3, class: 2, assessment: 1, other: 1, total: 7 },
  { month: 'Mar', progress: 4, class: 3, assessment: 2, other: 2, total: 11 },
  { month: 'Apr', progress: 3, class: 2, assessment: 3, other: 1, total: 9 },
  { month: 'May', progress: 5, class: 4, assessment: 2, other: 2, total: 13 },
  { month: 'Jun', progress: 6, class: 3, assessment: 3, other: 2, total: 14 },
  { month: 'Jul', progress: 5, class: 3, assessment: 2, other: 2, total: 12 },
]

const formatLabels: Record<FormatOption, { label: string; color: string; bg: string }> = {
  pdf:  { label: 'PDF',  color: 'text-danger-400',  bg: 'bg-danger-400/15' },
  xlsx: { label: 'XLSX', color: 'text-success-400', bg: 'bg-success-400/15' },
  csv:  { label: 'CSV',  color: 'text-electric-400', bg: 'bg-electric-400/15' },
  html: { label: 'HTML', color: 'text-accent-400',  bg: 'bg-accent-400/15' },
}

const freqConfig = { daily: { color: 'text-electric-400', bg: 'bg-electric-400/15' }, weekly: { color: 'text-accent-400', bg: 'bg-accent-400/15' }, monthly: { color: 'text-neon-400', bg: 'bg-neon-400/15' } } as const

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<ReportId | null>(null)
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [activeTab, setActiveTab] = useState<ReportTab>('generate')
  const [selectedFormat, setSelectedFormat] = useState<FormatOption>('pdf')
  const [insightsOpen, setInsightsOpen] = useState(true)
  const [scheduleModal, setScheduleModal] = useState(false)
  const [shareModal, setShareModal] = useState<string | null>(null)
  const [scheduledList, setScheduledList] = useState(scheduledReports)
  const [toastMsg, setToastMsg] = useState('')
  function showToast(msg: string) {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 2500)
  }

  function handleGenerate() {
    setGenerating(true)
    setGenerated(false)
    setTimeout(() => { setGenerating(false); setGenerated(true) }, 3000)
  }

  function toggleScheduled(id: string) {
    setScheduledList(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s))
  }

  const selected = reportTypes.find(r => r.id === selectedReport)

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <FadeUp>
        <div className="hero-mesh rounded-3xl p-6 border border-white/[0.06]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <motion.div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}
                whileHover={{ rotate: 8, scale: 1.08 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <FileText className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <h2 className="text-xl font-black text-white">Reports & Analytics</h2>
                <p className="text-xs text-surface-400">AI-generated reports · PDF · XLSX · CSV · Schedule & Share</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setScheduleModal(true)} className="btn-secondary text-xs px-3 py-1.5">
                <Bell className="w-3.5 h-3.5" /> Schedule
              </button>
              <button className="btn-secondary text-xs px-3 py-1.5" onClick={() => showToast('Report preferences saved')}>
                <Settings className="w-3.5 h-3.5" /> Preferences
              </button>
              <motion.button
                className="btn-gradient text-xs"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => { setActiveTab('generate'); setSelectedReport(null) }}
              >
                <Plus className="w-3.5 h-3.5" /> New Report
              </motion.button>
            </div>
          </div>
        </div>
      </FadeUp>

      {/* Stat Cards */}
      <FadeUp delay={0.05}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Reports Generated', value: '24', icon: FileText, color: '#6366f1', sub: 'This semester', delta: '+6 vs last' },
            { label: 'Scheduled Reports', value: '3', icon: Bell, color: '#14b8a6', sub: 'Auto-run active', delta: '2 active' },
            { label: 'Avg Time Saved', value: '4.2h', icon: Clock, color: '#f97316', sub: 'Per report', delta: 'vs manual' },
            { label: 'Shared Reports', value: '18', icon: Share2, color: '#10b981', sub: 'With stakeholders', delta: '3 this week' },
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
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: stat.color + '18' }}>
                  <stat.icon className="w-3.5 h-3.5" style={{ color: stat.color }} />
                </div>
                <span className="text-xs text-surface-400">{stat.label}</span>
              </div>
              <p className="text-xl font-black text-white">{stat.value}</p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-[10px] text-surface-500">{stat.sub}</p>
                <span className="text-[10px] text-success-400 font-semibold">{stat.delta}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </FadeUp>

      {/* Monthly Activity Chart */}
      <FadeUp delay={0.06}>
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Report Generation Activity</h3>
              <p className="text-[10px] text-surface-500 mt-0.5">Last 6 months · by report type</p>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-surface-500">
              {[
                { label: 'Progress', color: '#6366f1' },
                { label: 'Class', color: '#8b5cf6' },
                { label: 'Assessment', color: '#ec4899' },
                { label: 'Other', color: '#22d3ee' },
              ].map(l => (
                <span key={l.label} className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: l.color }} />
                  {l.label}
                </span>
              ))}
            </div>
          </div>
          {(() => {
            const W = 560, H = 130, PX = 32, PY = 12, maxTotal = 16
            const barW = 36, gap = (W - PX * 2 - barW * monthlyActivity.length) / (monthlyActivity.length - 1)
            const scaleY = (v: number) => PY + (H - PY * 2) * (1 - v / maxTotal)
            const colors = { progress: '#6366f1', class: '#8b5cf6', assessment: '#ec4899', other: '#22d3ee' }
            return (
              <svg viewBox={`0 0 ${W} ${H + 24}`} width="100%" className="overflow-visible" style={{ maxHeight: 160 }}>
                <defs>
                  {Object.entries(colors).map(([k, c]) => (
                    <linearGradient key={k} id={`rg-${k}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={c} stopOpacity="0.9" />
                      <stop offset="100%" stopColor={c} stopOpacity="0.5" />
                    </linearGradient>
                  ))}
                </defs>
                {/* Grid lines */}
                {[0, 4, 8, 12, 16].map(v => (
                  <g key={v}>
                    <line x1={PX} y1={scaleY(v)} x2={W - PX} y2={scaleY(v)} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                    <text x={PX - 4} y={scaleY(v) + 3.5} textAnchor="end" fontSize="8" fill="rgba(255,255,255,0.3)">{v}</text>
                  </g>
                ))}
                {/* Stacked bars */}
                {monthlyActivity.map((d, i) => {
                  const x = PX + i * (barW + gap)
                  const segs = [
                    { key: 'other',      val: d.other,      color: colors.other },
                    { key: 'assessment', val: d.assessment,  color: colors.assessment },
                    { key: 'class',      val: d.class,       color: colors.class },
                    { key: 'progress',   val: d.progress,    color: colors.progress },
                  ]
                  let accum = 0
                  return (
                    <g key={d.month}>
                      {segs.map(seg => {
                        const segH = (seg.val / maxTotal) * (H - PY * 2)
                        const y = scaleY(accum + seg.val)
                        accum += seg.val
                        return (
                          <motion.rect
                            key={seg.key}
                            x={x} y={y} width={barW} height={segH}
                            fill={`url(#rg-${seg.key})`}
                            rx="2"
                            initial={{ scaleY: 0, originY: 1 }}
                            animate={{ scaleY: 1 }}
                            transition={{ duration: 0.5, delay: 0.1 + i * 0.07, ease: 'easeOut' }}
                            style={{ transformOrigin: `${x + barW / 2}px ${H - PY}px` }}
                          />
                        )
                      })}
                      <text x={x + barW / 2} y={H + 14} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.4)">{d.month}</text>
                      <text x={x + barW / 2} y={scaleY(d.total) - 4} textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.6)" fontWeight="700">{d.total}</text>
                    </g>
                  )
                })}
              </svg>
            )
          })()}
        </div>
      </FadeUp>

      {/* AI Insights Panel */}
      <FadeUp delay={0.07}>
        <div className="glass-card overflow-hidden border border-accent-500/15">
          <button
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors"
            onClick={() => setInsightsOpen(o => !o)}
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#6366f1,#a78bfa)' }}>
                <Brain className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-bold text-white">AI Report Insights</span>
              <span className="text-[10px] bg-accent-500/15 text-accent-400 px-1.5 py-0.5 rounded-md font-bold">{aiInsights.length} suggestions</span>
            </div>
            <motion.div animate={{ rotate: insightsOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="w-4 h-4 text-surface-400" />
            </motion.div>
          </button>
          <AnimatePresence>
            {insightsOpen && (
              <motion.div
                initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-4 grid grid-cols-1 md:grid-cols-3 gap-3 border-t border-white/[0.06] pt-4">
                  {aiInsights.map((ins, i) => (
                    <motion.div
                      key={ins.title}
                      className="p-4 rounded-2xl border"
                      style={{ borderColor: ins.color + '30', backgroundColor: ins.color + '08' }}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full mb-2" style={{ backgroundColor: ins.color }} />
                      <h4 className="text-xs font-bold text-white mb-1">{ins.title}</h4>
                      <p className="text-[10px] text-surface-400 leading-relaxed mb-3">{ins.desc}</p>
                      <button className="text-[10px] font-bold flex items-center gap-1" style={{ color: ins.color }}>
                        {ins.cta} <ArrowRight className="w-3 h-3" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </FadeUp>

      {/* Tabs */}
      <FadeUp delay={0.09}>
        <div className="flex items-center gap-1 bg-white/[0.04] rounded-full p-1 w-fit">
          {([
            { key: 'generate' as const, label: 'Generate', icon: Sparkles },
            { key: 'scheduled' as const, label: 'Scheduled', icon: Bell },
            { key: 'history' as const, label: 'History', icon: Clock },
          ]).map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                activeTab === t.key ? 'bg-white/[0.08] text-white' : 'text-surface-400 hover:text-surface-200'
              }`}
            >
              <t.icon className="w-3 h-3" /> {t.label}
            </button>
          ))}
        </div>
      </FadeUp>

      <AnimatePresence mode="wait">
        {/* GENERATE TAB */}
        {activeTab === 'generate' && (
          <motion.div key="generate" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.22 }} className="space-y-6">
            {/* Generating overlay */}
            <AnimatePresence>
              {generating && (
                <motion.div className="glass-card p-8 text-center" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                  <motion.div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  >
                    <Sparkles className="w-6 h-6 text-white" />
                  </motion.div>
                  <h3 className="text-lg font-black text-white mb-1">AI is generating your report...</h3>
                  <p className="text-sm text-surface-400 mb-4">Analyzing data, applying formatting, and writing insights</p>
                  <motion.div className="w-48 h-1.5 bg-accent-500/15 rounded-full mx-auto overflow-hidden">
                    <motion.div className="h-full bg-accent-500 rounded-full" initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 3, ease: 'linear' }} />
                  </motion.div>
                  <div className="flex items-center justify-center gap-6 mt-5 text-[10px] text-surface-500">
                    {['Fetching student data', 'Running AI analysis', 'Formatting report'].map((step, i) => (
                      <motion.span key={step} className="flex items-center gap-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 1 }}>
                        <Loader2 className="w-3 h-3 animate-spin" /> {step}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Generated success */}
            <AnimatePresence>
              {generated && !generating && (
                <motion.div className="glass-card p-5 border-success-500/20" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 rounded-xl bg-success-500/20 flex items-center justify-center">
                        <Check className="w-5 h-5 text-success-400" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">Report Generated Successfully</h4>
                        <p className="text-xs text-surface-400">
                          {selected?.title || 'Your report'} · 3.2 MB · Ready to download or share
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <button className="btn-secondary text-xs px-3 py-1.5" onClick={() => showToast('Opening report preview…')}><Eye className="w-3.5 h-3.5" /> Preview</button>
                      <button className="btn-secondary text-xs px-3 py-1.5" onClick={() => showToast('Downloading PDF…')}><File className="w-3.5 h-3.5" /> PDF</button>
                      <button className="btn-secondary text-xs px-3 py-1.5" onClick={() => showToast('Downloading XLSX…')}><FileSpreadsheet className="w-3.5 h-3.5" /> XLSX</button>
                      <button className="btn-gradient text-xs px-3 py-1.5" onClick={() => showToast('Report emailed successfully!')}><Mail className="w-3.5 h-3.5" /> Email</button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!generating && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Report type picker */}
                <div className="lg:col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-white">Choose Report Type</h3>
                    <span className="text-xs text-surface-500">{reportTypes.length} types available</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {reportTypes.map((report, i) => (
                      <motion.button
                        key={report.id}
                        className={`glass-card p-5 text-left transition-all relative ${
                          selectedReport === report.id ? 'border-accent-500/30 shadow-[0_0_20px_rgba(99,102,241,0.10)]' : ''
                        }`}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        whileHover={{ y: -2 }}
                        onClick={() => setSelectedReport(prev => prev === report.id ? null : report.id)}
                      >
                        {report.popular && (
                          <span className="absolute top-3 right-3 text-[9px] bg-accent-500/20 text-accent-400 px-1.5 py-0.5 rounded-full font-bold">Popular</span>
                        )}
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: report.color + '18' }}>
                            <report.icon className="w-4.5 h-4.5" style={{ color: report.color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-white">{report.title}</h4>
                            <p className="text-xs text-surface-400 mt-0.5 leading-relaxed">{report.desc}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-surface-500">
                          <Zap className="w-3 h-3" /> Generates in {report.time}
                        </div>
                        <AnimatePresence>
                          {selectedReport === report.id && (
                            <motion.div
                              className="mt-3 pt-3 border-t border-white/[0.06]"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                            >
                              <div className="space-y-2 mb-3">
                                {report.fields.map(f => (
                                  <div key={f.label}>
                                    {f.type === 'checkbox' ? (
                                      <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" defaultChecked className="w-3 h-3 accent-accent-500 rounded" />
                                        <span className="text-[10px] text-surface-400">{f.label}</span>
                                      </label>
                                    ) : f.type === 'select' && f.options ? (
                                      <div>
                                        <span className="text-[10px] text-surface-500 block mb-0.5">{f.label}</span>
                                        <select className="w-full text-[10px] bg-white/[0.06] border border-white/[0.08] text-surface-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-accent-500">
                                          {f.options.map(o => <option key={o} value={o} className="bg-surface-900">{o}</option>)}
                                        </select>
                                      </div>
                                    ) : (
                                      <div>
                                        <span className="text-[10px] text-surface-500 block mb-0.5">{f.label}</span>
                                        <div className="flex gap-1">
                                          <input type="date" className="flex-1 text-[10px] bg-white/[0.06] border border-white/[0.08] text-surface-200 rounded-lg px-2 py-1 focus:outline-none" />
                                          <span className="text-surface-600 self-center">–</span>
                                          <input type="date" className="flex-1 text-[10px] bg-white/[0.06] border border-white/[0.08] text-surface-200 rounded-lg px-2 py-1 focus:outline-none" />
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                              <motion.button
                                className="btn-gradient text-xs w-full"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={e => { e.stopPropagation(); handleGenerate() }}
                              >
                                <Sparkles className="w-3.5 h-3.5" /> Generate with AI
                              </motion.button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Right: Format + Quick actions */}
                <div className="space-y-4">
                  <FadeInWhenVisible delay={0.1}>
                    <div className="glass-card p-5">
                      <h4 className="text-sm font-bold text-white mb-3">Export Format</h4>
                      <div className="space-y-2">
                        {(['pdf', 'xlsx', 'csv', 'html'] as const).map(fmt => (
                          <button
                            key={fmt}
                            onClick={() => setSelectedFormat(fmt)}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all text-left ${
                              selectedFormat === fmt
                                ? 'border-accent-500/40 bg-accent-500/10'
                                : 'border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.03]'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {fmt === 'pdf' ? <File className="w-3.5 h-3.5 text-danger-400" /> : fmt === 'xlsx' ? <FileSpreadsheet className="w-3.5 h-3.5 text-success-400" /> : fmt === 'csv' ? <FileText className="w-3.5 h-3.5 text-electric-400" /> : <Globe className="w-3.5 h-3.5 text-accent-400" />}
                              <div>
                                <p className="text-xs font-semibold text-white">{fmt.toUpperCase()}</p>
                                <p className="text-[10px] text-surface-500">
                                  {fmt === 'pdf' ? 'Print-ready, formatted' : fmt === 'xlsx' ? 'Editable spreadsheet' : fmt === 'csv' ? 'Raw data export' : 'Web-shareable'}
                                </p>
                              </div>
                            </div>
                            {selectedFormat === fmt && <Check className="w-3.5 h-3.5 text-accent-400" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  </FadeInWhenVisible>

                  <FadeInWhenVisible delay={0.15}>
                    <div className="glass-card p-5">
                      <h4 className="text-sm font-bold text-white mb-3">Quick Picks</h4>
                      <div className="space-y-2">
                        {[
                          { label: 'End-of-Week Summary', icon: TrendingUp, color: '#6366f1' },
                          { label: 'At-Risk Student List', icon: AlertTriangle, color: '#ef4444' },
                          { label: 'Standards Progress', icon: Target, color: '#14b8a6' },
                          { label: 'AI Tools ROI', icon: Sparkles, color: '#22d3ee' },
                        ].map((q, i) => (
                          <motion.button
                            key={q.label}
                            className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.04] text-left transition-colors group"
                            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.05 }}
                          >
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: q.color + '18' }}>
                              <q.icon className="w-3.5 h-3.5" style={{ color: q.color }} />
                            </div>
                            <span className="text-xs text-surface-300 group-hover:text-white transition-colors flex-1">{q.label}</span>
                            <ChevronRight className="w-3 h-3 text-surface-600 group-hover:text-accent-400 transition-colors" />
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </FadeInWhenVisible>

                  <FadeInWhenVisible delay={0.2}>
                    <div className="glass-card p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-electric-400/15 flex items-center justify-center">
                          <Activity className="w-4 h-4 text-electric-400" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white">API Rate Limit</h4>
                          <p className="text-[10px] text-surface-500">3 reports remaining today</p>
                        </div>
                      </div>
                      <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-electric-400 to-accent-400"
                          initial={{ width: 0 }}
                          animate={{ width: '70%' }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                        />
                      </div>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-[10px] text-surface-500">7 of 10 used</span>
                        <button className="text-[10px] text-accent-400 font-semibold hover:text-accent-300">Upgrade Plan</button>
                      </div>
                    </div>
                  </FadeInWhenVisible>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* SCHEDULED TAB */}
        {activeTab === 'scheduled' && (
          <motion.div key="scheduled" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.22 }} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Scheduled Reports</h3>
              <motion.button className="btn-gradient text-xs" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setScheduleModal(true)}>
                <Plus className="w-3.5 h-3.5" /> New Schedule
              </motion.button>
            </div>
            {scheduledList.map((sched, i) => (
              <motion.div
                key={sched.id}
                className={`glass-card p-5 border transition-all ${sched.active ? 'border-white/[0.08]' : 'border-white/[0.04] opacity-60'}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: sched.active ? 1 : 0.6, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-accent-500/15 flex items-center justify-center flex-shrink-0">
                      <Bell className="w-4.5 h-4.5 text-accent-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="text-sm font-bold text-white">{sched.title}</h4>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${freqConfig[sched.frequency].bg} ${freqConfig[sched.frequency].color}`}>
                          {sched.frequency.charAt(0).toUpperCase() + sched.frequency.slice(1)}
                        </span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${formatLabels[sched.format].bg} ${formatLabels[sched.format].color}`}>
                          {formatLabels[sched.format].label}
                        </span>
                      </div>
                      <p className="text-xs text-surface-400">{sched.type}</p>
                      <div className="flex items-center gap-3 mt-2 text-[10px] text-surface-500">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Next: {sched.nextRun}</span>
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {sched.recipients} recipient{sched.recipients !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button className="text-surface-500 hover:text-surface-200 p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors">
                      <Settings className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => toggleScheduled(sched.id)}
                      className={`relative w-8 h-4.5 rounded-full transition-all ${sched.active ? 'bg-accent-500' : 'bg-white/[0.12]'}`}
                    >
                      <motion.div
                        className="absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white shadow-sm"
                        animate={{ left: sched.active ? '14px' : '2px' }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
            {/* Schedule templates */}
            <div>
              <h4 className="text-sm font-semibold text-surface-300 mb-3">Recommended Templates</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { label: 'Weekly Parent Update', freq: 'weekly', recipients: 'All Parents', color: '#6366f1' },
                  { label: 'Monthly Admin Summary', freq: 'monthly', recipients: 'Principal', color: '#14b8a6' },
                  { label: 'Daily At-Risk Alert', freq: 'daily', recipients: 'Counselor', color: '#f59e0b' },
                ].map((tmpl, i) => (
                  <motion.button
                    key={tmpl.label}
                    className="glass-card p-4 text-left hover:border-white/[0.12] transition-all"
                    whileHover={{ y: -2 }}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.07 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: tmpl.color }} />
                      <span className="text-xs font-bold text-white">{tmpl.label}</span>
                    </div>
                    <p className="text-[10px] text-surface-500 capitalize">{tmpl.freq} · {tmpl.recipients}</p>
                    <button className="mt-3 text-[10px] font-bold flex items-center gap-1" style={{ color: tmpl.color }} onClick={() => showToast(`"${tmpl.label}" schedule created`)}>
                      Use Template <Plus className="w-3 h-3" />
                    </button>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* HISTORY TAB */}
        {activeTab === 'history' && (
          <motion.div key="history" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.22 }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white">Report History</h3>
              <div className="flex items-center gap-2">
                <button className="btn-secondary text-xs px-3 py-1.5"><Filter className="w-3.5 h-3.5" /> Filter</button>
                <button className="btn-secondary text-xs px-3 py-1.5"><Download className="w-3.5 h-3.5" /> Export All</button>
              </div>
            </div>
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      <th className="text-left text-xs font-semibold text-surface-300 px-5 py-3">Report</th>
                      <th className="text-left text-xs font-semibold text-surface-300 px-5 py-3 hidden md:table-cell">Type</th>
                      <th className="text-left text-xs font-semibold text-surface-300 px-5 py-3">Date</th>
                      <th className="text-left text-xs font-semibold text-surface-300 px-5 py-3 hidden sm:table-cell">Format</th>
                      <th className="text-left text-xs font-semibold text-surface-300 px-5 py-3 hidden lg:table-cell">Views</th>
                      <th className="text-right text-xs font-semibold text-surface-300 px-5 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentReports.map((report, i) => (
                      <motion.tr
                        key={report.id}
                        className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.05 + i * 0.05 }}
                      >
                        <td className="px-5 py-3">
                          <div>
                            <span className="text-sm font-semibold text-white block">{report.title}</span>
                            <span className="text-[10px] text-surface-500">{report.size}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3 hidden md:table-cell">
                          <span className="text-xs text-surface-400">{report.type}</span>
                        </td>
                        <td className="px-5 py-3">
                          <span className="text-xs text-surface-500">{report.date}</span>
                        </td>
                        <td className="px-5 py-3 hidden sm:table-cell">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${formatLabels[report.format].bg} ${formatLabels[report.format].color}`}>
                            {formatLabels[report.format].label}
                          </span>
                        </td>
                        <td className="px-5 py-3 hidden lg:table-cell">
                          <span className="flex items-center gap-1 text-xs text-surface-500">
                            <Eye className="w-3 h-3" /> {report.views}
                            {report.sharedWith && <span className="ml-2 flex items-center gap-1"><Share2 className="w-3 h-3" />{report.sharedWith}</span>}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button className="p-1.5 rounded-lg hover:bg-white/[0.06] text-surface-400 hover:text-white transition-colors" onClick={() => setShareModal(report.id)}>
                              <Share2 className="w-3.5 h-3.5" />
                            </button>
                            <button className="p-1.5 rounded-lg hover:bg-white/[0.06] text-surface-400 hover:text-white transition-colors" onClick={() => showToast(`Downloading "${report.title}"…`)}>
                              <Download className="w-3.5 h-3.5" />
                            </button>
                            <button className="p-1.5 rounded-lg hover:bg-danger-400/10 text-surface-400 hover:text-danger-400 transition-colors" onClick={() => showToast(`"${report.title}" deleted`)}>
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* API Docs CTA */}
      <FadeInWhenVisible delay={0.25}>
        <div className="glass-card p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-electric-400/20 to-electric-500/5 flex items-center justify-center">
                <Layers className="w-5 h-5 text-electric-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Automate with the Reports API</h3>
                <p className="text-xs text-surface-400">Trigger report generation via API — integrate with your SIS or LMS.</p>
              </div>
            </div>
            <motion.button
              className="btn-secondary text-xs px-4 py-1.5 flex-shrink-0"
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            >
              View API Docs <ChevronRight className="w-3 h-3" />
            </motion.button>
          </div>
        </div>
      </FadeInWhenVisible>

      {/* Schedule Modal */}
      <AnimatePresence>
        {scheduleModal && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setScheduleModal(false)} />
            <motion.div
              className="relative glass-card p-6 w-full max-w-md z-10"
              initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-bold text-white">Schedule a Report</h3>
                <button onClick={() => setScheduleModal(false)} className="text-surface-400 hover:text-white p-1"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Report Title', type: 'input', placeholder: 'e.g. Weekly Class Summary' },
                ].map(f => (
                  <div key={f.label}>
                    <label className="block text-xs font-semibold text-surface-300 mb-1.5">{f.label}</label>
                    <input type="text" placeholder={f.placeholder} className="w-full bg-white/[0.04] border border-white/[0.08] text-surface-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-accent-500" />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-semibold text-surface-300 mb-1.5">Report Type</label>
                  <select className="w-full bg-white/[0.04] border border-white/[0.08] text-surface-200 rounded-xl px-3 py-2 text-xs focus:outline-none">
                    {reportTypes.map(r => <option key={r.id} value={r.id} className="bg-surface-900">{r.title}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-surface-300 mb-1.5">Frequency</label>
                  <div className="flex gap-2">
                    {['Daily', 'Weekly', 'Monthly'].map(f => (
                      <button key={f} className="flex-1 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-surface-300 hover:border-accent-500/40 hover:text-white transition-all">
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-surface-300 mb-1.5">Recipients (email)</label>
                  <input type="email" placeholder="Add email address..." className="w-full bg-white/[0.04] border border-white/[0.08] text-surface-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-accent-500" />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setScheduleModal(false)} className="btn-secondary text-xs flex-1">Cancel</button>
                <motion.button className="btn-gradient text-xs flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => { setScheduleModal(false); showToast('Report schedule created!') }}>
                  <Bell className="w-3.5 h-3.5" /> Create Schedule
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <AnimatePresence>
        {shareModal && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShareModal(null)} />
            <motion.div className="relative glass-card p-6 w-full max-w-sm z-10" initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white">Share Report</h3>
                <button onClick={() => setShareModal(null)} className="text-surface-400 hover:text-white p-1"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Email link', icon: Mail, color: '#6366f1' },
                  { label: 'Copy shareable link', icon: Globe, color: '#14b8a6' },
                  { label: 'Restrict access', icon: Lock, color: '#f59e0b' },
                ].map(o => (
                  <button key={o.label} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.04] text-left transition-colors">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: o.color + '18' }}>
                      <o.icon className="w-4 h-4" style={{ color: o.color }} />
                    </div>
                    <span className="text-sm text-surface-200">{o.label}</span>
                  </button>
                ))}
                <div>
                  <label className="block text-xs font-semibold text-surface-300 mb-1.5">Share with</label>
                  <input type="email" placeholder="Enter email address..." className="w-full bg-white/[0.04] border border-white/[0.08] text-surface-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-accent-500" />
                </div>
              </div>
              <motion.button className="btn-gradient text-xs w-full mt-4" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => { setShareModal(null); showToast('Report shared successfully!') }}>
                <Send className="w-3.5 h-3.5" /> Send Report
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toastMsg && (
          <motion.div
            className="fixed top-5 right-5 z-[100] flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border border-white/[0.08]"
            style={{ background: 'linear-gradient(135deg,#0a0f1a,#111827)' }}
            initial={{ opacity: 0, y: -16, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 400, damping: 28 } }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
          >
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span className="text-sm text-white font-medium">{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
