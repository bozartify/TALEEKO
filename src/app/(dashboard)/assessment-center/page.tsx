'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart2, BookOpen, Brain, Calendar, CheckCircle,
  ChevronDown, Clock, Download, Edit3, Eye,
  FileText, Filter, Layers, Plus, Search, Sparkles,
  Star, Target, TrendingDown, TrendingUp, Users,
  X, AlertTriangle, Copy, ArrowRight, Award
} from 'lucide-react'
import { FadeUp, FadeInWhenVisible } from '@/components/ui/motion'

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */

type AssessmentType = 'Quiz' | 'Test' | 'Project' | 'Lab' | 'Essay' | 'Exam'
type Status = 'Scheduled' | 'Active' | 'Graded' | 'Draft'
type Tab = 'overview' | 'analytics' | 'ai-insights'

interface Assessment {
  id: string
  title: string
  type: AssessmentType
  subject: string
  date: string
  duration: number
  totalPoints: number
  classAvg: number
  classHigh: number
  classLow: number
  status: Status
  totalStudents: number
  submitted: number
  color: string
  standards: string[]
  distribution: number[]
}

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */

const TYPE_COLORS: Record<AssessmentType, string> = {
  Quiz:    '#22d3ee',
  Test:    '#6366f1',
  Project: '#10b981',
  Lab:     '#f59e0b',
  Essay:   '#ec4899',
  Exam:    '#ef4444',
}

const assessments: Assessment[] = [
  {
    id: 'a1', title: 'Cells & Organelles Quiz', type: 'Quiz', subject: 'Science',
    date: 'Aug 14', duration: 30, totalPoints: 50, classAvg: 82, classHigh: 98, classLow: 44,
    status: 'Graded', totalStudents: 28, submitted: 28, color: '#22d3ee',
    standards: ['MS-LS1-1', 'MS-LS1-2'],
    distribution: [2, 4, 6, 10, 8, 3, 2, 1, 1, 1],
  },
  {
    id: 'a2', title: 'Unit 2: Narrative Writing Essay', type: 'Essay', subject: 'ELA',
    date: 'Aug 12', duration: 90, totalPoints: 100, classAvg: 76, classHigh: 96, classLow: 52,
    status: 'Graded', totalStudents: 28, submitted: 27, color: '#ec4899',
    standards: ['W.6.3', 'W.6.4', 'W.6.5'],
    distribution: [1, 3, 5, 8, 7, 4, 2, 1, 0, 0],
  },
  {
    id: 'a3', title: 'Ratios & Proportions Test', type: 'Test', subject: 'Math',
    date: 'Aug 18', duration: 55, totalPoints: 80, classAvg: 0, classHigh: 0, classLow: 0,
    status: 'Scheduled', totalStudents: 28, submitted: 0, color: '#6366f1',
    standards: ['6.RP.A.1', '6.RP.A.2', '6.RP.A.3'],
    distribution: [],
  },
  {
    id: 'a4', title: 'Ecosystem Model Project', type: 'Project', subject: 'Science',
    date: 'Aug 20', duration: 0, totalPoints: 100, classAvg: 0, classHigh: 0, classLow: 0,
    status: 'Active', totalStudents: 28, submitted: 14, color: '#10b981',
    standards: ['MS-LS2-1', 'MS-LS2-2'],
    distribution: [],
  },
  {
    id: 'a5', title: 'Ancient Civilizations DBQ', type: 'Essay', subject: 'Social Studies',
    date: 'Aug 10', duration: 60, totalPoints: 100, classAvg: 79, classHigh: 95, classLow: 48,
    status: 'Graded', totalStudents: 28, submitted: 28, color: '#ec4899',
    standards: ['6.H.1.1', '6.H.1.2'],
    distribution: [1, 2, 4, 9, 7, 3, 1, 1, 0, 0],
  },
  {
    id: 'a6', title: 'Photosynthesis Lab Report', type: 'Lab', subject: 'Science',
    date: 'Aug 8', duration: 45, totalPoints: 50, classAvg: 88, classHigh: 100, classLow: 60,
    status: 'Graded', totalStudents: 28, submitted: 26, color: '#f59e0b',
    standards: ['MS-LS1-6', 'MS-LS1-7'],
    distribution: [0, 1, 2, 3, 6, 8, 5, 2, 1, 0],
  },
]

const STANDARDS_HEATMAP = [
  { std: 'MS-LS1-1', label: 'Cell structure', scores: [78, 82, 91, 65, 88, 72, 95, 81] },
  { std: 'MS-LS1-2', label: 'Cell functions', scores: [82, 75, 88, 70, 92, 68, 87, 79] },
  { std: '6.RP.A.1', label: 'Ratio concepts', scores: [65, 71, 80, 58, 75, 62, 88, 70] },
  { std: '6.RP.A.2', label: 'Unit rates', scores: [70, 78, 83, 62, 79, 74, 91, 73] },
  { std: 'W.6.3',    label: 'Narrative writing', scores: [74, 80, 86, 68, 83, 77, 90, 76] },
  { std: '6.H.1.1',  label: 'Historical thinking', scores: [80, 85, 90, 72, 87, 78, 93, 82] },
]

const STUDENTS = ['Emma', 'Liam', 'Ava', 'Noah', 'Olivia', 'James', 'Sophia', 'Lucas']

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */

function heatColor(score: number): string {
  if (score >= 90) return '#10b981'
  if (score >= 80) return '#22d3ee'
  if (score >= 70) return '#f59e0b'
  if (score >= 60) return '#f97316'
  return '#ef4444'
}

function letterGrade(avg: number): string {
  if (avg >= 93) return 'A'
  if (avg >= 90) return 'A-'
  if (avg >= 87) return 'B+'
  if (avg >= 83) return 'B'
  if (avg >= 80) return 'B-'
  if (avg >= 77) return 'C+'
  if (avg >= 73) return 'C'
  return 'D'
}

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */

export default function AssessmentCenterPage() {
  const [tab, setTab] = useState<Tab>('overview')
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null)
  const [filterStatus, setFilterStatus] = useState<Status | 'All'>('All')
  const [search, setSearch] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiInsight, setAiInsight] = useState('')
  const [toastMsg, setToastMsg] = useState('')

  function showToast(msg: string) {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 2500)
  }

  function handleAiInsight() {
    setAiLoading(true)
    setTimeout(() => {
      setAiLoading(false)
      setAiInsight('3 students scored below 60% on RP.A.1 — consider a targeted small-group reteach session before the upcoming unit test. Cross-referencing attendance data shows 2 of those students also missed the ratio intro lesson.')
    }, 1600)
  }

  const filtered = assessments.filter(a =>
    (filterStatus === 'All' || a.status === filterStatus) &&
    (search === '' || a.title.toLowerCase().includes(search.toLowerCase()))
  )

  const gradedAssessments = assessments.filter(a => a.status === 'Graded')
  const overallAvg = gradedAssessments.length
    ? Math.round(gradedAssessments.reduce((s, a) => s + a.classAvg, 0) / gradedAssessments.length)
    : 0

  const STAT_CARDS = [
    { label: 'Assessments This Month', value: assessments.length, sub: '+2 this week', color: '#6366f1', icon: FileText },
    { label: 'Class Average', value: `${overallAvg}%`, sub: letterGrade(overallAvg), color: '#22d3ee', icon: Target },
    { label: 'Pending Grading', value: assessments.filter(a => a.status === 'Active').length, sub: 'in progress', color: '#f59e0b', icon: Clock },
    { label: 'Upcoming', value: assessments.filter(a => a.status === 'Scheduled').length, sub: 'this week', color: '#10b981', icon: Calendar },
  ]

  return (
    <div className="space-y-6 p-6 max-w-[1400px] mx-auto">

      {/* ── HEADER ── */}
      <FadeUp>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Assessment Center</h1>
            <p className="text-surface-400 text-sm mt-1">Create, manage, and analyze all student assessments</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleAiInsight}
              disabled={aiLoading}
              className="btn-gradient text-sm flex items-center gap-2"
            >
              {aiLoading
                ? <><motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}><Sparkles className="w-4 h-4" /></motion.span> Analyzing…</>
                : <><Sparkles className="w-4 h-4" /> AI Insights</>
              }
            </button>
            <button className="btn-secondary text-sm flex items-center gap-2">
              <Download className="w-4 h-4" /> Export
            </button>
            <button className="btn-gradient text-sm flex items-center gap-2">
              <Plus className="w-4 h-4" /> New Assessment
            </button>
          </div>
        </div>
      </FadeUp>

      {/* ── STAT CARDS ── */}
      <FadeUp>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STAT_CARDS.map((card, ci) => {
            const Icon = card.icon
            return (
              <div key={ci} className="glass-card p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background: card.color + '22' }}>
                    <Icon className="w-4 h-4" style={{ color: card.color }} />
                  </div>
                  <span className="text-xs text-surface-500">{card.sub}</span>
                </div>
                <p className="text-2xl font-black text-white">{card.value}</p>
                <p className="text-xs text-surface-400 mt-1">{card.label}</p>
              </div>
            )
          })}
        </div>
      </FadeUp>

      {/* ── AI INSIGHT BANNER ── */}
      <AnimatePresence>
        {aiInsight && (
          <motion.div
            className="glass-card p-4 border border-accent-500/20"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-accent-500/20 flex-shrink-0 mt-0.5">
                <Brain className="w-4 h-4 text-accent-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-accent-300 mb-1 uppercase tracking-widest">AI Insight</p>
                <p className="text-sm text-surface-200 leading-relaxed">{aiInsight}</p>
              </div>
              <button onClick={() => setAiInsight('')} className="text-surface-500 hover:text-surface-300">
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── TABS ── */}
      <FadeUp>
        <div className="flex items-center gap-1 bg-white/[0.04] rounded-xl p-1 w-fit">
          {([
            ['overview', 'Overview', BarChart2],
            ['analytics', 'Analytics', TrendingUp],
            ['ai-insights', 'AI Insights', Sparkles],
          ] as const).map(([t, label, Icon]) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                tab === t ? 'bg-accent-600/40 text-accent-200' : 'text-surface-400 hover:text-surface-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>
      </FadeUp>

      {/* ══════════════════════════════════
          OVERVIEW TAB
      ══════════════════════════════════ */}
      {tab === 'overview' && (
        <>
          {/* Controls */}
          <FadeUp>
            <div className="glass-card p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-wrap">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search assessments…"
                  className="input-base pl-9 text-sm w-60"
                />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {(['All', 'Graded', 'Active', 'Scheduled', 'Draft'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => setFilterStatus(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      filterStatus === s
                        ? 'bg-accent-600/30 border-accent-500/50 text-accent-300'
                        : 'border-white/[0.06] text-surface-400 hover:border-white/[0.12]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </FadeUp>

          {/* Assessment List */}
          <div className="space-y-3">
            {filtered.map((assessment, ai) => {
              const W = 200, H = 6
              const subPct = assessment.totalStudents ? (assessment.submitted / assessment.totalStudents) * 100 : 0
              const bw = (subPct / 100) * W
              return (
                <FadeInWhenVisible key={assessment.id}>
                  <motion.div
                    className="glass-card p-5 cursor-pointer hover:border-white/[0.12] transition-colors"
                    whileHover={{ y: -1 }}
                    onClick={() => setSelectedAssessment(assessment)}
                  >
                    <div className="flex items-start gap-4">
                      {/* Type badge */}
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: assessment.color + '22' }}>
                        <FileText className="w-5 h-5" style={{ color: assessment.color }} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-xs font-bold px-2 py-0.5 rounded-md"
                              style={{ background: TYPE_COLORS[assessment.type] + '22', color: TYPE_COLORS[assessment.type] }}>
                              {assessment.type}
                            </span>
                            <h3 className="text-sm font-bold text-white mt-1">{assessment.title}</h3>
                            <p className="text-xs text-surface-400">{assessment.subject} · {assessment.date}
                              {assessment.duration > 0 && ` · ${assessment.duration} min`}
                            </p>
                          </div>

                          {/* Status */}
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-lg flex-shrink-0 ${
                            assessment.status === 'Graded'    ? 'bg-success-500/20 text-success-400' :
                            assessment.status === 'Active'    ? 'bg-electric-400/20 text-electric-400' :
                            assessment.status === 'Scheduled' ? 'bg-accent-500/20 text-accent-400' :
                            'bg-white/[0.06] text-surface-400'
                          }`}>
                            {assessment.status}
                          </span>
                        </div>

                        {/* Stats row */}
                        {assessment.status === 'Graded' && (
                          <div className="flex items-center gap-6 mt-3 text-xs text-surface-400 flex-wrap">
                            <span className="flex items-center gap-1">
                              <span className="font-bold text-white">{assessment.classAvg}%</span> avg
                            </span>
                            <span className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3 text-success-400" />
                              <span className="text-success-400">{assessment.classHigh}%</span> high
                            </span>
                            <span className="flex items-center gap-1">
                              <TrendingDown className="w-3 h-3 text-danger-400" />
                              <span className="text-danger-400">{assessment.classLow}%</span> low
                            </span>
                            <span>{assessment.submitted}/{assessment.totalStudents} submitted</span>
                          </div>
                        )}

                        {assessment.status === 'Active' && (
                          <div className="mt-3">
                            <div className="flex justify-between text-xs text-surface-400 mb-1">
                              <span>Submissions</span>
                              <span className="font-semibold text-white">{assessment.submitted}/{assessment.totalStudents}</span>
                            </div>
                            <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible">
                              <defs>
                                <linearGradient id={`ac-sub-${ai}`} x1="0" x2="1" y1="0" y2="0">
                                  <stop offset="0%" stopColor="#10b981" />
                                  <stop offset="100%" stopColor="#22d3ee" />
                                </linearGradient>
                              </defs>
                              <rect x={0} y={0} width={W} height={H} rx={3} fill="rgba(255,255,255,0.06)" />
                              <motion.rect x={0} y={0} height={H} rx={3}
                                fill={`url(#ac-sub-${ai})`}
                                initial={{ width: 0 }}
                                animate={{ width: bw }}
                                transition={{ duration: 0.7, delay: ai * 0.05, ease: [0.22, 1, 0.36, 1] }}
                              />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Standards chips */}
                      <div className="hidden xl:flex flex-col gap-1 items-end flex-shrink-0">
                        {assessment.standards.slice(0, 2).map(s => (
                          <span key={s} className="text-xs px-2 py-0.5 rounded bg-white/[0.06] text-surface-400">{s}</span>
                        ))}
                        {assessment.standards.length > 2 && (
                          <span className="text-xs text-surface-500">+{assessment.standards.length - 2} more</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </FadeInWhenVisible>
              )
            })}
          </div>
        </>
      )}

      {/* ══════════════════════════════════
          ANALYTICS TAB
      ══════════════════════════════════ */}
      {tab === 'analytics' && (
        <div className="space-y-6">
          {/* Score distribution vertical bars */}
          <FadeInWhenVisible>
            <div className="glass-card p-6">
              <h2 className="text-base font-bold text-white mb-1">Score Distribution</h2>
              <p className="text-xs text-surface-400 mb-5">Cells &amp; Organelles Quiz — most recent graded assessment</p>
              {(() => {
                const dist = assessments[0].distribution
                const BAR_W = 40
                const GAP = 8
                const CHART_H = 160
                const maxVal = Math.max(...dist)
                const labels = ['0–9', '10–19', '20–29', '30–39', '40–49', '50–59', '60–69', '70–79', '80–89', '90–100']
                const totalW = dist.length * (BAR_W + GAP) - GAP

                return (
                  <div className="overflow-x-auto">
                    <svg viewBox={`0 0 ${totalW} ${CHART_H + 40}`} style={{ minWidth: totalW }} className="overflow-visible">
                      <defs>
                        {dist.map((_, bi) => (
                          <linearGradient key={bi} id={`ac-dist-${bi}`} x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor={bi >= 8 ? '#10b981' : bi >= 6 ? '#22d3ee' : bi >= 4 ? '#f59e0b' : '#ef4444'} />
                            <stop offset="100%" stopColor={bi >= 8 ? '#10b981' : bi >= 6 ? '#22d3ee' : bi >= 4 ? '#f59e0b' : '#ef4444'} stopOpacity={0.4} />
                          </linearGradient>
                        ))}
                      </defs>

                      {/* Horizontal guide lines */}
                      {[0.25, 0.5, 0.75, 1].map(pct => (
                        <line key={pct}
                          x1={0} y1={CHART_H - CHART_H * pct}
                          x2={totalW} y2={CHART_H - CHART_H * pct}
                          stroke="rgba(255,255,255,0.04)" strokeWidth={1}
                        />
                      ))}

                      {dist.map((count, bi) => {
                        const bh = maxVal > 0 ? (count / maxVal) * CHART_H : 0
                        const bx = bi * (BAR_W + GAP)
                        const baseY = CHART_H
                        return (
                          <g key={bi}>
                            <motion.rect
                              x={bx} rx={4} width={BAR_W}
                              fill={`url(#ac-dist-${bi})`}
                              initial={{ y: baseY, height: 0 }}
                              animate={{ y: baseY - bh, height: bh }}
                              transition={{ duration: 0.7, delay: bi * 0.04, ease: [0.22, 1, 0.36, 1] }}
                            />
                            {count > 0 && (
                              <text x={bx + BAR_W / 2} y={baseY - bh - 5}
                                textAnchor="middle" fontSize={10} fontWeight={700} fill="rgba(255,255,255,0.6)">
                                {count}
                              </text>
                            )}
                            <text x={bx + BAR_W / 2} y={baseY + 16}
                              textAnchor="middle" fontSize={9} fill="rgba(255,255,255,0.25)">
                              {labels[bi]}
                            </text>
                          </g>
                        )
                      })}
                    </svg>
                  </div>
                )
              })()}

              <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-white/[0.06]">
                {[
                  { label: 'Class Avg', value: '82%', color: '#22d3ee' },
                  { label: 'Highest', value: '98%', color: '#10b981' },
                  { label: 'Lowest', value: '44%', color: '#ef4444' },
                ].map((s, si) => (
                  <div key={si} className="text-center">
                    <p className="text-xl font-black" style={{ color: s.color }}>{s.value}</p>
                    <p className="text-xs text-surface-400">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeInWhenVisible>

          {/* Standards Heatmap */}
          <FadeInWhenVisible>
            <div className="glass-card p-6">
              <h2 className="text-base font-bold text-white mb-1">Standards Mastery Heatmap</h2>
              <p className="text-xs text-surface-400 mb-5">Score by student &amp; standard — darker = higher mastery</p>
              <div className="overflow-x-auto">
                <table className="text-xs w-full">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      <th className="text-left py-2 pr-4 text-surface-400 font-semibold w-40">Standard</th>
                      {STUDENTS.map(s => (
                        <th key={s} className="text-center py-2 px-1 text-surface-400 font-semibold min-w-[52px]">{s}</th>
                      ))}
                      <th className="text-center py-2 px-2 text-surface-400 font-semibold">Avg</th>
                    </tr>
                  </thead>
                  <tbody>
                    {STANDARDS_HEATMAP.map((row, ri) => {
                      const avg = Math.round(row.scores.reduce((a, b) => a + b, 0) / row.scores.length)
                      return (
                        <tr key={ri} className="border-b border-white/[0.03]">
                          <td className="py-2 pr-4">
                            <p className="font-bold text-surface-200">{row.std}</p>
                            <p className="text-surface-500">{row.label}</p>
                          </td>
                          {row.scores.map((score, si) => (
                            <td key={si} className="py-2 px-1 text-center">
                              <motion.span
                                className="inline-flex items-center justify-center w-10 h-8 rounded-lg text-xs font-bold text-white"
                                style={{ background: heatColor(score) + '44', color: heatColor(score) }}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: ri * 0.04 + si * 0.02 }}
                              >
                                {score}
                              </motion.span>
                            </td>
                          ))}
                          <td className="py-2 px-2 text-center">
                            <span className="inline-flex items-center justify-center w-10 h-8 rounded-lg text-xs font-bold border border-white/[0.1]"
                              style={{ color: heatColor(avg) }}>
                              {avg}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/[0.06] flex-wrap text-xs text-surface-400">
                <span className="font-semibold">Score scale:</span>
                {[['≥90', '#10b981'], ['80–89', '#22d3ee'], ['70–79', '#f59e0b'], ['60–69', '#f97316'], ['<60', '#ef4444']].map(([label, col]) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded inline-block" style={{ background: col + '55' }} />
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </FadeInWhenVisible>

          {/* Assessment type breakdown */}
          <FadeInWhenVisible>
            <div className="glass-card p-6">
              <h2 className="text-base font-bold text-white mb-5">Performance by Assessment Type</h2>
              <div className="space-y-4">
                {(['Quiz', 'Test', 'Essay', 'Lab', 'Project'] as const).map((type, ti) => {
                  const typeAssessments = gradedAssessments.filter(a => a.type === type)
                  const avg = typeAssessments.length
                    ? Math.round(typeAssessments.reduce((s, a) => s + a.classAvg, 0) / typeAssessments.length)
                    : null
                  const col = TYPE_COLORS[type]
                  const W = 400, H = 8
                  const bw = avg !== null ? (avg / 100) * W : 0
                  return (
                    <div key={type}>
                      <div className="flex items-center justify-between mb-1.5 text-xs">
                        <span className="font-semibold text-surface-200">{type}</span>
                        <span className="text-surface-400">
                          {avg !== null ? `${avg}% avg · ${typeAssessments.length} assessment${typeAssessments.length > 1 ? 's' : ''}` : 'No data yet'}
                        </span>
                      </div>
                      <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible">
                        <defs>
                          <linearGradient id={`ac-type-${ti}`} x1="0" x2="1" y1="0" y2="0">
                            <stop offset="0%" stopColor={col} />
                            <stop offset="100%" stopColor={col} stopOpacity={0.5} />
                          </linearGradient>
                        </defs>
                        <rect x={0} y={0} width={W} height={H} rx={4} fill="rgba(255,255,255,0.06)" />
                        {avg !== null && (
                          <motion.rect x={0} y={0} height={H} rx={4}
                            fill={`url(#ac-type-${ti})`}
                            initial={{ width: 0 }}
                            animate={{ width: bw }}
                            transition={{ duration: 0.8, delay: ti * 0.08, ease: [0.22, 1, 0.36, 1] }}
                          />
                        )}
                      </svg>
                    </div>
                  )
                })}
              </div>
            </div>
          </FadeInWhenVisible>
        </div>
      )}

      {/* ══════════════════════════════════
          AI INSIGHTS TAB
      ══════════════════════════════════ */}
      {tab === 'ai-insights' && (
        <div className="space-y-4">
          {[
            {
              icon: AlertTriangle,
              color: '#f59e0b',
              title: 'Struggling Students Detected',
              body: '4 students scored below 70% on 2+ consecutive assessments. Early intervention is recommended. Emma R., Liam K., and 2 others may benefit from targeted support in ratios and proportional reasoning.',
              action: 'View Intervention Tracker',
            },
            {
              icon: TrendingUp,
              color: '#10b981',
              title: 'Strong Growth in Writing',
              body: 'Class average on writing assessments improved from 71% to 79% over the last 6 weeks. The narrative writing unit appears to have had a strong effect on argument essay quality.',
              action: 'View Writing Reports',
            },
            {
              icon: Target,
              color: '#6366f1',
              title: 'Standards Gap: 6.RP.A.1',
              body: 'Ratio concepts (6.RP.A.1) shows the lowest class mastery at 70%. Consider a supplemental activity before the upcoming unit test. Suggest: visual models and real-world ratio scenarios.',
              action: 'Suggest Resources',
            },
            {
              icon: Award,
              color: '#ec4899',
              title: 'High Achievers — Enrichment Ready',
              body: '7 students consistently score 90%+. Consider differentiation opportunities: extension projects, peer tutoring, or enrichment challenges in ecosystem complexity modeling.',
              action: 'View Differentiation',
            },
          ].map((insight, ii) => {
            const Icon = insight.icon
            return (
              <FadeInWhenVisible key={ii}>
                <div className="glass-card p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: insight.color + '22' }}>
                      <Icon className="w-4.5 h-4.5" style={{ color: insight.color }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-white mb-1">{insight.title}</h3>
                      <p className="text-sm text-surface-300 leading-relaxed mb-3">{insight.body}</p>
                      <button
                        onClick={() => showToast(`Opening: ${insight.action}`)}
                        className="text-xs font-semibold flex items-center gap-1 transition-colors"
                        style={{ color: insight.color }}
                      >
                        {insight.action} <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </FadeInWhenVisible>
            )
          })}

          {/* AI Question Generator */}
          <FadeInWhenVisible>
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-accent-400" />
                <h2 className="text-base font-bold text-white">AI Assessment Generator</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-surface-200 mb-1.5">Subject</label>
                  <select className="input-base text-sm">
                    <option>Science</option>
                    <option>Math</option>
                    <option>ELA</option>
                    <option>Social Studies</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-surface-200 mb-1.5">Assessment Type</label>
                  <select className="input-base text-sm">
                    <option>Quiz (10 questions)</option>
                    <option>Test (25 questions)</option>
                    <option>Exit Ticket (3 questions)</option>
                    <option>Essay Prompt</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-surface-200 mb-1.5">Standard(s)</label>
                  <input className="input-base text-sm" placeholder="e.g. MS-LS1-1, MS-LS1-2" defaultValue="MS-LS1-1" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-surface-200 mb-1.5">Difficulty</label>
                  <select className="input-base text-sm">
                    <option>Mixed (DOK 1–3)</option>
                    <option>Foundational (DOK 1)</option>
                    <option>Application (DOK 2)</option>
                    <option>Strategic (DOK 3)</option>
                  </select>
                </div>
              </div>
              <button
                onClick={() => showToast('Generating assessment… check your Quiz Builder')}
                className="btn-gradient text-sm w-full justify-center flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> Generate Assessment
              </button>
            </div>
          </FadeInWhenVisible>
        </div>
      )}

      {/* ══════════════════════════════════
          ASSESSMENT DETAIL DRAWER
      ══════════════════════════════════ */}
      <AnimatePresence>
        {selectedAssessment && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedAssessment(null)}
            />
            <motion.div
              className="fixed right-0 top-0 h-full w-full max-w-md z-50 overflow-y-auto"
              style={{ background: 'linear-gradient(135deg,#0d111e,#111827)' }}
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg"
                    style={{ background: TYPE_COLORS[selectedAssessment.type] + '22', color: TYPE_COLORS[selectedAssessment.type] }}>
                    {selectedAssessment.type}
                  </span>
                  <button onClick={() => setSelectedAssessment(null)}
                    className="p-1.5 rounded-lg bg-white/[0.06] text-surface-400 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <h2 className="text-xl font-black text-white mb-1">{selectedAssessment.title}</h2>
                <p className="text-surface-400 text-sm mb-5">{selectedAssessment.subject} · {selectedAssessment.date}
                  {selectedAssessment.duration > 0 && ` · ${selectedAssessment.duration} min`}
                </p>

                {selectedAssessment.status === 'Graded' && (
                  <>
                    {/* Score bar */}
                    {(() => {
                      const W = 300, H = 8
                      const bw = (selectedAssessment.classAvg / 100) * W
                      const col = selectedAssessment.classAvg >= 80 ? '#10b981' : selectedAssessment.classAvg >= 70 ? '#f59e0b' : '#ef4444'
                      return (
                        <div className="mb-6">
                          <div className="flex justify-between text-xs text-surface-400 mb-1.5">
                            <span>Class Average</span>
                            <span className="font-bold" style={{ color: col }}>{selectedAssessment.classAvg}% · {letterGrade(selectedAssessment.classAvg)}</span>
                          </div>
                          <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible">
                            <defs>
                              <linearGradient id="ac-detail-avg" x1="0" x2="1" y1="0" y2="0">
                                <stop offset="0%" stopColor={col} />
                                <stop offset="100%" stopColor={col} stopOpacity={0.5} />
                              </linearGradient>
                            </defs>
                            <rect x={0} y={0} width={W} height={H} rx={4} fill="rgba(255,255,255,0.06)" />
                            <motion.rect x={0} y={0} height={H} rx={4}
                              fill="url(#ac-detail-avg)"
                              initial={{ width: 0 }} animate={{ width: bw }}
                              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            />
                          </svg>
                          <div className="flex justify-between text-xs text-surface-500 mt-1">
                            <span>Low: {selectedAssessment.classLow}%</span>
                            <span>High: {selectedAssessment.classHigh}%</span>
                          </div>
                        </div>
                      )
                    })()}

                    <div className="grid grid-cols-2 gap-3 mb-5">
                      {[
                        { label: 'Submitted', value: `${selectedAssessment.submitted}/${selectedAssessment.totalStudents}`, color: '#22d3ee' },
                        { label: 'Points', value: selectedAssessment.totalPoints, color: '#6366f1' },
                        { label: 'Grade', value: letterGrade(selectedAssessment.classAvg), color: '#10b981' },
                        { label: 'Standards', value: selectedAssessment.standards.length, color: '#f59e0b' },
                      ].map((s, si) => (
                        <div key={si} className="p-3 rounded-xl bg-white/[0.04] text-center">
                          <p className="text-lg font-black" style={{ color: s.color }}>{s.value}</p>
                          <p className="text-xs text-surface-400">{s.label}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Standards */}
                <div className="mb-5">
                  <h3 className="text-xs font-bold text-surface-400 uppercase tracking-widest mb-2">Standards Assessed</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedAssessment.standards.map(std => (
                      <span key={std} className="px-2 py-1 rounded-lg text-xs font-semibold bg-white/[0.06] text-surface-200">{std}</span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 mt-6">
                  <button
                    onClick={() => { showToast('Opening gradebook…'); setSelectedAssessment(null) }}
                    className="btn-gradient w-full justify-center text-sm"
                  >
                    <Eye className="w-4 h-4" /> View Grades
                  </button>
                  <button
                    onClick={() => showToast('Assessment duplicated')}
                    className="btn-secondary w-full justify-center text-sm"
                  >
                    <Copy className="w-4 h-4" /> Duplicate Assessment
                  </button>
                  <button
                    onClick={() => { showToast('Generating AI feedback…'); setSelectedAssessment(null) }}
                    className="btn-secondary w-full justify-center text-sm"
                  >
                    <Sparkles className="w-4 h-4" /> Generate Student Feedback
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── TOAST ── */}
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
