'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen, Calendar, ChevronDown, ChevronRight, Download,
  Filter, Plus, Search, Sparkles, Target, CheckCircle,
  Clock, BarChart2, Layers, ArrowRight, X, Edit3,
  Copy, Eye, Link2, Grid, List, Zap, Star
} from 'lucide-react'
import { FadeUp, FadeInWhenVisible } from '@/components/ui/motion'

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */

type Quarter = 'Q1' | 'Q2' | 'Q3' | 'Q4'
type Subject = 'ELA' | 'Math' | 'Science' | 'Social Studies' | 'Art'
type ViewMode = 'gantt' | 'grid' | 'list'

interface Unit {
  id: string
  title: string
  subject: Subject
  quarter: Quarter
  weeks: number
  startWeek: number
  color: string
  standards: string[]
  bigIdeas: string[]
  skills: string[]
  assessments: string[]
  completed: number
}

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */

const SUBJECT_COLORS: Record<Subject, string> = {
  ELA:            '#6366f1',
  Math:           '#22d3ee',
  Science:        '#10b981',
  'Social Studies':'#f59e0b',
  Art:            '#ec4899',
}

const TOTAL_WEEKS = 36

const units: Unit[] = [
  {
    id: 'u1', title: 'Narrative Writing', subject: 'ELA', quarter: 'Q1',
    weeks: 6, startWeek: 1, color: '#6366f1',
    standards: ['W.6.3', 'W.6.4', 'W.6.5'],
    bigIdeas: ['Story structure drives meaning', 'Voice is intentional'],
    skills: ['Plot development', 'Character arc', 'Dialogue'],
    assessments: ['Personal narrative draft', 'Peer review', 'Final essay'],
    completed: 100,
  },
  {
    id: 'u2', title: 'Number Systems', subject: 'Math', quarter: 'Q1',
    weeks: 5, startWeek: 1, color: '#22d3ee',
    standards: ['6.NS.A.1', '6.NS.B.2', '6.NS.C.5'],
    bigIdeas: ['Numbers extend in both directions', 'Division as sharing'],
    skills: ['Integer operations', 'Absolute value', 'Coordinate plane'],
    assessments: ['Unit test', 'Number line quiz', 'Problem set'],
    completed: 100,
  },
  {
    id: 'u3', title: 'Cells & Life', subject: 'Science', quarter: 'Q1',
    weeks: 5, startWeek: 1, color: '#10b981',
    standards: ['MS-LS1-1', 'MS-LS1-2', 'MS-LS1-3'],
    bigIdeas: ['Cells are the unit of life', 'Structure enables function'],
    skills: ['Microscopy', 'Cell diagrams', 'Organelle function'],
    assessments: ['Cell model project', 'Lab report', 'Vocab quiz'],
    completed: 100,
  },
  {
    id: 'u4', title: 'Ancient Civilizations', subject: 'Social Studies', quarter: 'Q1',
    weeks: 6, startWeek: 1, color: '#f59e0b',
    standards: ['6.H.1.1', '6.H.1.2', '6.G.1.1'],
    bigIdeas: ['Geography shapes society', 'Primary sources reveal perspective'],
    skills: ['Map analysis', 'Source evaluation', 'Timeline'],
    assessments: ['DBQ essay', 'Map project', 'Class debate'],
    completed: 90,
  },
  {
    id: 'u5', title: 'Argumentative Writing', subject: 'ELA', quarter: 'Q2',
    weeks: 6, startWeek: 10, color: '#818cf8',
    standards: ['W.6.1', 'W.6.4', 'W.6.9'],
    bigIdeas: ['Evidence supports claims', 'Counterargument strengthens'],
    skills: ['Thesis writing', 'Evidence selection', 'Citation'],
    assessments: ['Position paper', 'Socratic seminar', 'Revision portfolio'],
    completed: 75,
  },
  {
    id: 'u6', title: 'Ratios & Rates', subject: 'Math', quarter: 'Q2',
    weeks: 5, startWeek: 10, color: '#67e8f9',
    standards: ['6.RP.A.1', '6.RP.A.2', '6.RP.A.3'],
    bigIdeas: ['Proportional relationships are multiplicative'],
    skills: ['Unit rate', 'Percent', 'Ratio tables'],
    assessments: ['Rate quiz', 'Real-world project', 'Unit test'],
    completed: 60,
  },
  {
    id: 'u7', title: 'Ecosystems & Energy', subject: 'Science', quarter: 'Q2',
    weeks: 6, startWeek: 10, color: '#34d399',
    standards: ['MS-LS2-1', 'MS-LS2-2', 'MS-LS2-3'],
    bigIdeas: ['Energy flows through ecosystems', 'Interdependence sustains life'],
    skills: ['Food webs', 'Energy pyramids', 'Biome analysis'],
    assessments: ['Ecosystem model', 'Lab investigation', 'Research poster'],
    completed: 40,
  },
  {
    id: 'u8', title: 'Medieval World', subject: 'Social Studies', quarter: 'Q2',
    weeks: 6, startWeek: 10, color: '#fcd34d',
    standards: ['6.H.2.1', '6.H.2.2', '6.C.1.1'],
    bigIdeas: ['Power structures shape daily life', 'Religion influenced governance'],
    skills: ['Comparative analysis', 'Feudal hierarchy', 'Historical causation'],
    assessments: ['Feudalism diagram', 'Comparative essay', 'Role-play'],
    completed: 30,
  },
  {
    id: 'u9', title: 'Research & Informational', subject: 'ELA', quarter: 'Q3',
    weeks: 6, startWeek: 19, color: '#6366f1',
    standards: ['W.6.2', 'W.6.7', 'W.6.8'],
    bigIdeas: ['Research requires evaluation', 'Synthesis creates new understanding'],
    skills: ['Source credibility', 'Note-taking', 'Synthesis writing'],
    assessments: ['Research paper', 'Source annotation', 'Presentation'],
    completed: 10,
  },
  {
    id: 'u10', title: 'Expressions & Equations', subject: 'Math', quarter: 'Q3',
    weeks: 6, startWeek: 19, color: '#22d3ee',
    standards: ['6.EE.A.1', '6.EE.A.2', '6.EE.B.5'],
    bigIdeas: ['Variables represent unknowns', 'Balance is preserved through operations'],
    skills: ['Writing expressions', 'Solving equations', 'Inequalities'],
    assessments: ['Expression quiz', 'Equation project', 'Unit test'],
    completed: 0,
  },
  {
    id: 'u11', title: 'Earth Systems', subject: 'Science', quarter: 'Q3',
    weeks: 5, startWeek: 19, color: '#10b981',
    standards: ['MS-ESS2-1', 'MS-ESS2-2', 'MS-ESS3-1'],
    bigIdeas: ['Earth is a system of systems', 'Human impact is measurable'],
    skills: ['Rock cycle', 'Plate tectonics', 'Climate data analysis'],
    assessments: ['Rock lab', 'Tectonic model', 'Environmental report'],
    completed: 0,
  },
  {
    id: 'u12', title: 'Geometry & Statistics', subject: 'Math', quarter: 'Q4',
    weeks: 6, startWeek: 28, color: '#67e8f9',
    standards: ['6.G.A.1', '6.G.A.2', '6.SP.A.1'],
    bigIdeas: ['Area and volume measure different attributes'],
    skills: ['Area formulas', 'Volume', 'Statistical displays'],
    assessments: ['Geometry test', 'Data project', 'Final exam'],
    completed: 0,
  },
  {
    id: 'u13', title: 'Poetry & Voice', subject: 'ELA', quarter: 'Q4',
    weeks: 5, startWeek: 28, color: '#818cf8',
    standards: ['RL.6.4', 'RL.6.5', 'W.6.3'],
    bigIdeas: ['Form shapes meaning', 'Precise language creates effect'],
    skills: ['Figurative language', 'Meter', 'Poetry analysis'],
    assessments: ['Poetry portfolio', 'Analysis essay', 'Recitation'],
    completed: 0,
  },
]

const QUARTERS: { label: Quarter; weeks: [number, number]; color: string }[] = [
  { label: 'Q1', weeks: [1, 9],   color: 'rgba(99,102,241,0.08)' },
  { label: 'Q2', weeks: [10, 18], color: 'rgba(34,211,238,0.06)' },
  { label: 'Q3', weeks: [19, 27], color: 'rgba(16,185,129,0.06)' },
  { label: 'Q4', weeks: [28, 36], color: 'rgba(245,158,11,0.06)' },
]

const SUBJECTS: Subject[] = ['ELA', 'Math', 'Science', 'Social Studies', 'Art']

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */

export default function ScopeSequencePage() {
  const [view, setView] = useState<ViewMode>('gantt')
  const [selectedSubjects, setSelectedSubjects] = useState<Subject[]>(['ELA', 'Math', 'Science', 'Social Studies'])
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null)
  const [search, setSearch] = useState('')
  const [expandedQuarter, setExpandedQuarter] = useState<Quarter | null>('Q2')
  const [aiGenerating, setAiGenerating] = useState(false)
  const [toastMsg, setToastMsg] = useState('')

  function showToast(msg: string) {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 2500)
  }

  function toggleSubject(s: Subject) {
    setSelectedSubjects(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    )
  }

  const visibleUnits = units.filter(u =>
    selectedSubjects.includes(u.subject) &&
    (search === '' || u.title.toLowerCase().includes(search.toLowerCase()))
  )

  function handleAiSuggest() {
    setAiGenerating(true)
    setTimeout(() => {
      setAiGenerating(false)
      showToast('AI aligned 3 cross-curricular connections')
    }, 1800)
  }

  /* ── GANTT helpers ── */
  const GANTT_W = 900
  const GANTT_ROW_H = 40
  const LABEL_W = 130
  const CHART_W = GANTT_W - LABEL_W

  function weekX(week: number) {
    return LABEL_W + ((week - 1) / TOTAL_WEEKS) * CHART_W
  }

  const ganttSubjects = SUBJECTS.filter(s => selectedSubjects.includes(s))

  /* ── Quarter stats ── */
  const qStats = QUARTERS.map(q => {
    const qUnits = units.filter(u => u.quarter === q.label && selectedSubjects.includes(u.subject))
    const totalStds = qUnits.reduce((a, u) => a + u.standards.length, 0)
    const avgCompletion = qUnits.length ? Math.round(qUnits.reduce((a, u) => a + u.completed, 0) / qUnits.length) : 0
    return { ...q, units: qUnits.length, standards: totalStds, completion: avgCompletion }
  })

  return (
    <div className="space-y-6 p-6 max-w-[1400px] mx-auto">

      {/* ── HEADER ── */}
      <FadeUp>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Scope &amp; Sequence</h1>
            <p className="text-surface-400 text-sm mt-1">Curriculum mapping across subjects and quarters</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleAiSuggest}
              disabled={aiGenerating}
              className="btn-gradient text-sm flex items-center gap-2"
            >
              {aiGenerating
                ? <><motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}><Sparkles className="w-4 h-4" /></motion.span> Analyzing…</>
                : <><Sparkles className="w-4 h-4" /> AI Align</>
              }
            </button>
            <button className="btn-secondary text-sm flex items-center gap-2">
              <Download className="w-4 h-4" /> Export
            </button>
            <button className="btn-gradient text-sm flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Unit
            </button>
          </div>
        </div>
      </FadeUp>

      {/* ── QUARTER STAT CARDS ── */}
      <FadeUp>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {qStats.map((q, qi) => {
            const W = 200, H = 6
            const bw = (q.completion / 100) * W
            const col = q.completion >= 80 ? '#10b981' : q.completion >= 40 ? '#f59e0b' : '#6366f1'
            return (
              <div key={q.label} className="glass-card p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-surface-400 uppercase tracking-widest">{q.label}</span>
                  <span className="text-xs font-semibold text-surface-300">{q.completion}%</span>
                </div>
                <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible mb-3">
                  <defs>
                    <linearGradient id={`ss-q-${qi}`} x1="0" x2="1" y1="0" y2="0">
                      <stop offset="0%" stopColor={col} />
                      <stop offset="100%" stopColor={col} stopOpacity={0.5} />
                    </linearGradient>
                  </defs>
                  <rect x={0} y={0} width={W} height={H} rx={3} fill="rgba(255,255,255,0.06)" />
                  <motion.rect
                    x={0} y={0} height={H} rx={3}
                    fill={`url(#ss-q-${qi})`}
                    initial={{ width: 0 }}
                    animate={{ width: bw }}
                    transition={{ duration: 0.8, delay: qi * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  />
                </svg>
                <div className="flex justify-between text-xs text-surface-400">
                  <span>{q.units} units</span>
                  <span>{q.standards} standards</span>
                </div>
              </div>
            )
          })}
        </div>
      </FadeUp>

      {/* ── CONTROLS ── */}
      <FadeUp>
        <div className="glass-card p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-wrap">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search units…"
                className="input-base pl-9 text-sm w-56"
              />
            </div>

            {/* Subject filter pills */}
            <div className="flex items-center gap-2 flex-wrap">
              {SUBJECTS.filter(s => s !== 'Art').map(s => (
                <button
                  key={s}
                  onClick={() => toggleSubject(s)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                    selectedSubjects.includes(s)
                      ? 'border-white/20 text-white'
                      : 'border-white/[0.06] text-surface-500'
                  }`}
                  style={selectedSubjects.includes(s)
                    ? { background: SUBJECT_COLORS[s] + '33', borderColor: SUBJECT_COLORS[s] + '66' }
                    : {}}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* View toggle */}
            <div className="ml-auto flex items-center bg-white/[0.04] rounded-xl p-1 gap-1">
              {([['gantt', BarChart2], ['grid', Grid], ['list', List]] as const).map(([v, Icon]) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`p-2 rounded-lg transition-all ${view === v ? 'bg-accent-600/40 text-accent-300' : 'text-surface-500 hover:text-surface-300'}`}
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </FadeUp>

      {/* ══════════════════════════════════
          GANTT VIEW
      ══════════════════════════════════ */}
      {view === 'gantt' && (
        <FadeInWhenVisible>
          <div className="glass-card overflow-hidden">
            <div className="p-5 border-b border-white/[0.06]">
              <h2 className="text-sm font-bold text-white">Curriculum Timeline — {new Date().getFullYear()}</h2>
            </div>
            <div className="overflow-x-auto">
              <div style={{ minWidth: GANTT_W + 40 }}>
                <svg
                  viewBox={`0 0 ${GANTT_W} ${(ganttSubjects.length + 1) * GANTT_ROW_H + 60}`}
                  className="w-full overflow-visible"
                  style={{ minWidth: GANTT_W }}
                >
                  <defs>
                    {units.map((u, i) => (
                      <linearGradient key={u.id} id={`ss-bar-${i}`} x1="0" x2="1" y1="0" y2="0">
                        <stop offset="0%" stopColor={u.color} />
                        <stop offset="100%" stopColor={u.color} stopOpacity={0.65} />
                      </linearGradient>
                    ))}
                  </defs>

                  {/* Quarter bands */}
                  {QUARTERS.map((q, qi) => {
                    const x = weekX(q.weeks[0])
                    const w = weekX(q.weeks[1] + 1) - x
                    return (
                      <g key={q.label}>
                        <rect x={x} y={0} width={w} height={(ganttSubjects.length + 1) * GANTT_ROW_H + 60}
                          fill={q.color} />
                        <text x={x + w / 2} y={20} textAnchor="middle"
                          fontSize={11} fontWeight={700} fill="rgba(255,255,255,0.3)" letterSpacing={2}>
                          {q.label}
                        </text>
                      </g>
                    )
                  })}

                  {/* Week tick marks */}
                  {Array.from({ length: TOTAL_WEEKS + 1 }, (_, w) => w + 1).filter(w => w % 3 === 1 || w === TOTAL_WEEKS).map(w => {
                    const x = weekX(w)
                    return (
                      <g key={w}>
                        <line x1={x} y1={28} x2={x} y2={(ganttSubjects.length + 1) * GANTT_ROW_H + 60}
                          stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
                        <text x={x} y={38} textAnchor="middle" fontSize={9} fill="rgba(255,255,255,0.2)">
                          W{w}
                        </text>
                      </g>
                    )
                  })}

                  {/* Subject rows */}
                  {ganttSubjects.map((subject, si) => {
                    const y = 50 + si * GANTT_ROW_H
                    const subjectUnits = visibleUnits.filter(u => u.subject === subject)
                    return (
                      <g key={subject}>
                        {/* Row label */}
                        <text x={LABEL_W - 8} y={y + GANTT_ROW_H / 2 + 4}
                          textAnchor="end" fontSize={11} fontWeight={600}
                          fill={SUBJECT_COLORS[subject]}>
                          {subject}
                        </text>

                        {/* Row background */}
                        <rect x={LABEL_W} y={y + 4} width={CHART_W} height={GANTT_ROW_H - 8}
                          rx={6} fill="rgba(255,255,255,0.02)" />

                        {/* Unit bars */}
                        {subjectUnits.map((u) => {
                          const uIdx = units.findIndex(x => x.id === u.id)
                          const bx = weekX(u.startWeek)
                          const bw = (u.weeks / TOTAL_WEEKS) * CHART_W - 2
                          const barY = y + 8
                          const barH = GANTT_ROW_H - 16
                          return (
                            <g key={u.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedUnit(u)}>
                              {/* Background bar */}
                              <rect x={bx} y={barY} width={bw} height={barH} rx={6}
                                fill={u.color} opacity={0.2} />
                              {/* Completion fill */}
                              <motion.rect
                                x={bx} y={barY} height={barH} rx={6}
                                fill={`url(#ss-bar-${uIdx})`}
                                initial={{ width: 0 }}
                                animate={{ width: (u.completed / 100) * bw }}
                                transition={{ duration: 0.9, delay: si * 0.08 + 0.2, ease: [0.22, 1, 0.36, 1] }}
                              />
                              {/* Label */}
                              {bw > 60 && (
                                <text x={bx + 8} y={barY + barH / 2 + 4}
                                  fontSize={10} fontWeight={600} fill="white">
                                  {u.title.length > 18 ? u.title.slice(0, 16) + '…' : u.title}
                                </text>
                              )}
                            </g>
                          )
                        })}
                      </g>
                    )
                  })}

                  {/* Today marker */}
                  {(() => {
                    const todayWeek = 16
                    const tx = weekX(todayWeek)
                    return (
                      <g>
                        <line x1={tx} y1={28} x2={tx} y2={(ganttSubjects.length + 1) * GANTT_ROW_H + 60}
                          stroke="#ef4444" strokeWidth={1.5} strokeDasharray="4,3" />
                        <text x={tx + 4} y={38} fontSize={9} fill="#ef4444" fontWeight={700}>TODAY</text>
                      </g>
                    )
                  })()}
                </svg>
              </div>
            </div>
            <div className="px-5 py-3 border-t border-white/[0.06] flex items-center gap-6 text-xs text-surface-400 flex-wrap">
              <span>Click any unit bar to see details</span>
              <div className="flex items-center gap-1.5"><span className="w-3 h-1 rounded-full bg-red-500/60 inline-block" /> Today</div>
              {ganttSubjects.map(s => (
                <div key={s} className="flex items-center gap-1.5">
                  <span className="w-3 h-1 rounded-full inline-block" style={{ background: SUBJECT_COLORS[s] }} />
                  {s}
                </div>
              ))}
            </div>
          </div>
        </FadeInWhenVisible>
      )}

      {/* ══════════════════════════════════
          GRID VIEW
      ══════════════════════════════════ */}
      {view === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {visibleUnits.map((unit, ui) => {
            const W = 300, H = 6
            const bw = (unit.completed / 100) * W
            return (
              <FadeInWhenVisible key={unit.id}>
                <motion.div
                  className="glass-card p-5 cursor-pointer hover:border-white/[0.12] transition-colors"
                  style={{ borderLeft: `3px solid ${unit.color}` }}
                  whileHover={{ y: -2 }}
                  onClick={() => setSelectedUnit(unit)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md mb-1.5 inline-block"
                        style={{ background: unit.color + '22', color: unit.color }}>
                        {unit.subject} · {unit.quarter}
                      </span>
                      <h3 className="text-sm font-bold text-white">{unit.title}</h3>
                    </div>
                    <span className="text-xs text-surface-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />{unit.weeks}w
                    </span>
                  </div>
                  <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible mb-3">
                    <defs>
                      <linearGradient id={`ss-grid-${ui}`} x1="0" x2="1" y1="0" y2="0">
                        <stop offset="0%" stopColor={unit.color} />
                        <stop offset="100%" stopColor={unit.color} stopOpacity={0.5} />
                      </linearGradient>
                    </defs>
                    <rect x={0} y={0} width={W} height={H} rx={3} fill="rgba(255,255,255,0.06)" />
                    <motion.rect
                      x={0} y={0} height={H} rx={3}
                      fill={`url(#ss-grid-${ui})`}
                      initial={{ width: 0 }}
                      animate={{ width: bw }}
                      transition={{ duration: 0.7, delay: ui * 0.04, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </svg>
                  <div className="flex items-center justify-between text-xs text-surface-400">
                    <span>{unit.standards.length} standards</span>
                    <span className="font-semibold" style={{ color: unit.color }}>{unit.completed}% done</span>
                  </div>
                </motion.div>
              </FadeInWhenVisible>
            )
          })}
        </div>
      )}

      {/* ══════════════════════════════════
          LIST VIEW  — Quarterly accordion
      ══════════════════════════════════ */}
      {view === 'list' && (
        <div className="space-y-3">
          {QUARTERS.map(q => {
            const qUnits = visibleUnits.filter(u => u.quarter === q.label)
            const isOpen = expandedQuarter === q.label
            return (
              <FadeInWhenVisible key={q.label}>
                <div className="glass-card overflow-hidden">
                  <button
                    className="w-full flex items-center justify-between p-5 hover:bg-white/[0.02] transition-colors"
                    onClick={() => setExpandedQuarter(isOpen ? null : q.label)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-surface-400 uppercase tracking-widest w-6">{q.label}</span>
                      <span className="text-sm font-bold text-white">{qUnits.length} units</span>
                    </div>
                    <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown className="w-4 h-4 text-surface-500" />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-4 space-y-2">
                          {qUnits.map(unit => (
                            <div
                              key={unit.id}
                              className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.05] cursor-pointer transition-colors"
                              onClick={() => setSelectedUnit(unit)}
                            >
                              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: unit.color }} />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-white truncate">{unit.title}</p>
                                <p className="text-xs text-surface-400">{unit.subject} · {unit.weeks} weeks</p>
                              </div>
                              <div className="text-right">
                                <p className="text-xs font-bold" style={{ color: unit.color }}>{unit.completed}%</p>
                                <p className="text-xs text-surface-500">{unit.standards.length} stds</p>
                              </div>
                              <ChevronRight className="w-4 h-4 text-surface-600 flex-shrink-0" />
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </FadeInWhenVisible>
            )
          })}
        </div>
      )}

      {/* ── CROSS-CURRICULAR CONNECTIONS ── */}
      <FadeInWhenVisible>
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Link2 className="w-4 h-4 text-accent-400" /> Cross-Curricular Connections
            </h2>
            <button
              onClick={() => showToast('AI found 2 new connections')}
              className="text-xs text-accent-400 hover:text-accent-300 flex items-center gap-1 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" /> AI Discover
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { from: 'ELA: Argumentative Writing', to: 'Social Studies: Medieval World', link: 'Primary source analysis as evidence', color: '#6366f1' },
              { from: 'Science: Ecosystems', to: 'Math: Ratios & Rates', link: 'Population growth rates & energy flow', color: '#10b981' },
              { from: 'ELA: Research Writing', to: 'Science: Earth Systems', link: 'Environmental research papers', color: '#22d3ee' },
            ].map((conn, ci) => (
              <motion.div
                key={ci}
                className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]"
                whileHover={{ borderColor: conn.color + '44' }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-start gap-2 mb-2">
                  <div className="w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: conn.color + '22' }}>
                    <Link2 className="w-3 h-3" style={{ color: conn.color }} />
                  </div>
                  <p className="text-xs text-surface-400 leading-relaxed">{conn.link}</p>
                </div>
                <div className="flex flex-col gap-1 text-xs">
                  <span className="text-surface-200 font-medium">{conn.from}</span>
                  <ArrowRight className="w-3 h-3 text-surface-600" />
                  <span className="text-surface-200 font-medium">{conn.to}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </FadeInWhenVisible>

      {/* ── STANDARDS COVERAGE MATRIX ── */}
      <FadeInWhenVisible>
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-electric-400" /> Standards Coverage Overview
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left py-2 pr-4 text-surface-400 font-semibold">Subject</th>
                  <th className="text-center py-2 px-2 text-surface-400 font-semibold">Q1</th>
                  <th className="text-center py-2 px-2 text-surface-400 font-semibold">Q2</th>
                  <th className="text-center py-2 px-2 text-surface-400 font-semibold">Q3</th>
                  <th className="text-center py-2 px-2 text-surface-400 font-semibold">Q4</th>
                  <th className="text-left py-2 pl-4 text-surface-400 font-semibold">Coverage</th>
                </tr>
              </thead>
              <tbody>
                {SUBJECTS.filter(s => selectedSubjects.includes(s)).map((s, si) => {
                  const sUnits = units.filter(u => u.subject === s)
                  const totalStds = sUnits.reduce((a, u) => a + u.standards.length, 0)
                  const W = 120, H = 4
                  const bw = Math.min(1, totalStds / 15) * W
                  return (
                    <tr key={s} className="border-b border-white/[0.03]">
                      <td className="py-3 pr-4 font-semibold" style={{ color: SUBJECT_COLORS[s] }}>{s}</td>
                      {QUARTERS.map(q => {
                        const qu = sUnits.filter(u => u.quarter === q.label)
                        return (
                          <td key={q.label} className="py-3 px-2 text-center">
                            {qu.length > 0
                              ? <span className="inline-flex items-center justify-center w-6 h-6 rounded-md text-xs font-bold"
                                  style={{ background: SUBJECT_COLORS[s] + '22', color: SUBJECT_COLORS[s] }}>
                                  {qu.length}
                                </span>
                              : <span className="text-surface-700">—</span>
                            }
                          </td>
                        )
                      })}
                      <td className="py-3 pl-4">
                        <div className="flex items-center gap-2">
                          <svg viewBox={`0 0 ${W} ${H}`} style={{ width: W, minWidth: W }} className="overflow-visible flex-shrink-0">
                            <defs>
                              <linearGradient id={`ss-cov-${si}`} x1="0" x2="1" y1="0" y2="0">
                                <stop offset="0%" stopColor={SUBJECT_COLORS[s]} />
                                <stop offset="100%" stopColor={SUBJECT_COLORS[s]} stopOpacity={0.5} />
                              </linearGradient>
                            </defs>
                            <rect x={0} y={0} width={W} height={H} rx={2} fill="rgba(255,255,255,0.06)" />
                            <motion.rect x={0} y={0} height={H} rx={2}
                              fill={`url(#ss-cov-${si})`}
                              initial={{ width: 0 }}
                              animate={{ width: bw }}
                              transition={{ duration: 0.8, delay: si * 0.08, ease: [0.22, 1, 0.36, 1] }}
                            />
                          </svg>
                          <span className="text-surface-400 whitespace-nowrap">{totalStds} stds</span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </FadeInWhenVisible>

      {/* ══════════════════════════════════
          UNIT DETAIL DRAWER
      ══════════════════════════════════ */}
      <AnimatePresence>
        {selectedUnit && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedUnit(null)}
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
                    style={{ background: selectedUnit.color + '22', color: selectedUnit.color }}>
                    {selectedUnit.subject} · {selectedUnit.quarter}
                  </span>
                  <button onClick={() => setSelectedUnit(null)}
                    className="p-1.5 rounded-lg bg-white/[0.06] text-surface-400 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <h2 className="text-2xl font-black text-white mb-1">{selectedUnit.title}</h2>
                <p className="text-surface-400 text-sm mb-5 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" /> {selectedUnit.weeks} weeks
                  <span className="text-surface-600">·</span>
                  Week {selectedUnit.startWeek}–{selectedUnit.startWeek + selectedUnit.weeks - 1}
                </p>

                {/* Progress */}
                {(() => {
                  const W = 300, H = 8
                  const bw = (selectedUnit.completed / 100) * W
                  return (
                    <div className="mb-6">
                      <div className="flex justify-between text-xs text-surface-400 mb-1.5">
                        <span>Completion</span>
                        <span className="font-bold" style={{ color: selectedUnit.color }}>{selectedUnit.completed}%</span>
                      </div>
                      <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible">
                        <defs>
                          <linearGradient id="ss-detail-prog" x1="0" x2="1" y1="0" y2="0">
                            <stop offset="0%" stopColor={selectedUnit.color} />
                            <stop offset="100%" stopColor={selectedUnit.color} stopOpacity={0.5} />
                          </linearGradient>
                        </defs>
                        <rect x={0} y={0} width={W} height={H} rx={4} fill="rgba(255,255,255,0.06)" />
                        <motion.rect x={0} y={0} height={H} rx={4}
                          fill="url(#ss-detail-prog)"
                          initial={{ width: 0 }}
                          animate={{ width: bw }}
                          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        />
                      </svg>
                    </div>
                  )
                })()}

                {/* Standards */}
                <div className="mb-5">
                  <h3 className="text-xs font-bold text-surface-400 uppercase tracking-widest mb-2">Standards</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedUnit.standards.map(std => (
                      <span key={std} className="px-2 py-1 rounded-lg text-xs font-semibold bg-white/[0.06] text-surface-200">{std}</span>
                    ))}
                  </div>
                </div>

                {/* Big Ideas */}
                <div className="mb-5">
                  <h3 className="text-xs font-bold text-surface-400 uppercase tracking-widest mb-2">Big Ideas</h3>
                  <ul className="space-y-1.5">
                    {selectedUnit.bigIdeas.map((idea, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-surface-200">
                        <Star className="w-3.5 h-3.5 text-accent-400 flex-shrink-0 mt-0.5" />
                        {idea}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Skills */}
                <div className="mb-5">
                  <h3 className="text-xs font-bold text-surface-400 uppercase tracking-widest mb-2">Key Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedUnit.skills.map(skill => (
                      <span key={skill} className="px-2 py-1 rounded-lg text-xs font-semibold border border-white/[0.08] text-surface-300">{skill}</span>
                    ))}
                  </div>
                </div>

                {/* Assessments */}
                <div className="mb-6">
                  <h3 className="text-xs font-bold text-surface-400 uppercase tracking-widest mb-2">Assessments</h3>
                  <ul className="space-y-1.5">
                    {selectedUnit.assessments.map((a, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-surface-200">
                        <CheckCircle className="w-3.5 h-3.5 text-success-400 flex-shrink-0" />
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => { showToast('Opening lesson planner…'); setSelectedUnit(null) }}
                    className="btn-gradient w-full justify-center text-sm"
                  >
                    <BookOpen className="w-4 h-4" /> Open Lesson Planner
                  </button>
                  <button
                    onClick={() => showToast('Unit copied to clipboard')}
                    className="btn-secondary w-full justify-center text-sm"
                  >
                    <Copy className="w-4 h-4" /> Copy Unit
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
