'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Activity, AlertTriangle, ArrowUpRight, Bell, BookOpen,
  Calendar, CheckCircle, ChevronDown, ChevronRight,
  ChevronUp, Clock, Download, FileText, Filter,
  Heart, MessageSquare, Plus, Search, Shield, Star,
  TrendingDown, TrendingUp, Users, X, Zap,
  Brain, Target, BarChart2, Layers, Flag, Eye
} from 'lucide-react'
import { FadeUp, FadeInWhenVisible } from '@/components/ui/motion'

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */

type Tier = 1 | 2 | 3
type Area = 'Reading' | 'Math' | 'Behavior' | 'Social-Emotional'
type Status = 'On Track' | 'At Risk' | 'Exited' | 'Paused'

interface Intervention {
  id: string
  student: string
  initials: string
  avatarColor: string
  tier: Tier
  area: Area
  type: string
  startDate: string
  sessions: number
  progress: number
  nextSession: string
  status: Status
  iep?: boolean
}

interface SparkStudent {
  name: string
  tier: Tier
  area: Area
  data: number[]
}

interface UpcomingSession {
  student: string
  type: string
  time: string
  tier: Tier
}

interface DocEntry {
  student: string
  initials: string
  note: string
  date: string
  teacher: string
  tier: Tier
  area: Area
}

/* ─────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────── */

const TIER_COLORS: Record<Tier, string> = {
  1: '#10b981',
  2: '#f59e0b',
  3: '#ef4444',
}
const TIER_BG: Record<Tier, string> = {
  1: 'rgba(16,185,129,0.12)',
  2: 'rgba(245,158,11,0.12)',
  3: 'rgba(239,68,68,0.12)',
}
const TIER_BORDER: Record<Tier, string> = {
  1: 'rgba(16,185,129,0.25)',
  2: 'rgba(245,158,11,0.25)',
  3: 'rgba(239,68,68,0.25)',
}
const TIER_LABELS: Record<Tier, string> = {
  1: 'Universal',
  2: 'Targeted',
  3: 'Intensive',
}

const AREA_COLORS: Record<Area, string> = {
  'Reading': '#6366f1',
  'Math': '#22d3ee',
  'Behavior': '#f97316',
  'Social-Emotional': '#a78bfa',
}

const STATUS_CONFIG: Record<Status, { color: string; bg: string; dot: string }> = {
  'On Track':  { color: '#10b981', bg: 'rgba(16,185,129,0.12)',  dot: '#10b981' },
  'At Risk':   { color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   dot: '#ef4444' },
  'Exited':    { color: '#22d3ee', bg: 'rgba(34,211,238,0.12)',  dot: '#22d3ee' },
  'Paused':    { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  dot: '#f59e0b' },
}

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */

const interventions: Intervention[] = [
  { id: 'i1',  student: 'Marcus Bellamy',    initials: 'MB', avatarColor: '#6366f1', tier: 2, area: 'Reading',          type: 'Guided Reading Groups',     startDate: 'Sep 3',  sessions: 8,  progress: 72, nextSession: 'Sep 17 · 9:00 AM',  status: 'On Track' },
  { id: 'i2',  student: 'Sofia Reyes',       initials: 'SR', avatarColor: '#f43f5e', tier: 3, area: 'Math',             type: 'Math Intervention Program', startDate: 'Aug 20', sessions: 14, progress: 45, nextSession: 'Sep 16 · 10:30 AM', status: 'At Risk' },
  { id: 'i3',  student: 'Jaylen Turner',     initials: 'JT', avatarColor: '#f97316', tier: 2, area: 'Behavior',         type: 'Check-In/Check-Out',        startDate: 'Aug 27', sessions: 6,  progress: 58, nextSession: 'Sep 17 · 11:00 AM', status: 'At Risk' },
  { id: 'i4',  student: 'Emma Kasprzak',     initials: 'EK', avatarColor: '#10b981', tier: 2, area: 'Reading',          type: 'Phonics Intensive',         startDate: 'Sep 5',  sessions: 5,  progress: 81, nextSession: 'Sep 19 · 9:30 AM',  status: 'On Track' },
  { id: 'i5',  student: 'Devon Whitmore',    initials: 'DW', avatarColor: '#8b5cf6', tier: 3, area: 'Social-Emotional', type: 'Individual Counseling',     startDate: 'Aug 15', sessions: 18, progress: 38, nextSession: 'Sep 16 · 2:00 PM',  status: 'At Risk' },
  { id: 'i6',  student: 'Priya Subramaniam', initials: 'PS', avatarColor: '#22d3ee', tier: 2, area: 'Math',             type: 'Small Group Instruction',   startDate: 'Sep 1',  sessions: 7,  progress: 79, nextSession: 'Sep 18 · 10:00 AM', status: 'On Track' },
  { id: 'i7',  student: 'Carlos Mendez',     initials: 'CM', avatarColor: '#f59e0b', tier: 3, area: 'Reading',          type: 'Reading Recovery',          startDate: 'Aug 10', sessions: 22, progress: 55, nextSession: 'Sep 20 · 9:00 AM',  status: 'Paused',  iep: true },
  { id: 'i8',  student: 'Aisha Nkemdirim',   initials: 'AN', avatarColor: '#14b8a6', tier: 2, area: 'Behavior',         type: 'Behavior Contract',         startDate: 'Sep 8',  sessions: 4,  progress: 68, nextSession: 'Sep 20 · 1:30 PM',  status: 'On Track' },
  { id: 'i9',  student: 'Tyler Harding',     initials: 'TH', avatarColor: '#6d28d9', tier: 2, area: 'Social-Emotional', type: 'Peer Mentoring Program',    startDate: 'Sep 2',  sessions: 6,  progress: 91, nextSession: 'Sep 17 · 3:00 PM',  status: 'Exited' },
  { id: 'i10', student: 'Lily Chen',         initials: 'LC', avatarColor: '#f97316', tier: 2, area: 'Math',             type: 'Math Facts Fluency',        startDate: 'Aug 28', sessions: 9,  progress: 73, nextSession: 'Sep 18 · 11:00 AM', status: 'On Track' },
  { id: 'i11', student: 'Jordan Park',       initials: 'JP', avatarColor: '#ef4444', tier: 3, area: 'Reading',          type: 'Orton-Gillingham',          startDate: 'Aug 5',  sessions: 24, progress: 48, nextSession: 'Sep 16 · 9:00 AM',  status: 'At Risk',  iep: true },
  { id: 'i12', student: 'Maya Abramowitz',   initials: 'MA', avatarColor: '#a78bfa', tier: 2, area: 'Reading',          type: 'Decodable Readers',         startDate: 'Sep 10', sessions: 3,  progress: 62, nextSession: 'Sep 20 · 10:00 AM', status: 'On Track' },
]

const sparkStudents: SparkStudent[] = [
  { name: 'Marcus Bellamy',  tier: 2, area: 'Reading',          data: [55, 60, 62, 68, 70, 72] },
  { name: 'Sofia Reyes',     tier: 3, area: 'Math',             data: [38, 40, 39, 42, 44, 45] },
  { name: 'Jaylen Turner',   tier: 2, area: 'Behavior',         data: [48, 52, 50, 55, 56, 58] },
  { name: 'Emma Kasprzak',   tier: 2, area: 'Reading',          data: [65, 70, 72, 74, 78, 81] },
  { name: 'Devon Whitmore',  tier: 3, area: 'Social-Emotional', data: [30, 32, 35, 33, 37, 38] },
]

const upcomingSessions: UpcomingSession[] = [
  { student: 'Jordan Park',    type: 'Orton-Gillingham',      time: 'Today · 9:00 AM',    tier: 3 },
  { student: 'Sofia Reyes',    type: 'Math Intervention',     time: 'Today · 10:30 AM',   tier: 3 },
  { student: 'Jaylen Turner',  type: 'Check-In/Check-Out',    time: 'Today · 11:00 AM',   tier: 2 },
  { student: 'Devon Whitmore', type: 'Individual Counseling', time: 'Today · 2:00 PM',    tier: 3 },
  { student: 'Emma Kasprzak',  type: 'Phonics Intensive',     time: 'Tomorrow · 9:30 AM', tier: 2 },
]

const alerts = [
  { student: 'Devon Whitmore', message: 'No measurable progress in 4 weeks. Tier 3 review meeting recommended.', tier: 3 as Tier, icon: TrendingDown, color: '#ef4444' },
  { student: 'Jordan Park',    message: 'Missed 3 consecutive sessions — parent contact logged, reschedule needed.', tier: 3 as Tier, icon: AlertTriangle, color: '#f59e0b' },
  { student: 'Sofia Reyes',    message: 'Progress below expected trajectory. Consider adding frequency to sessions.', tier: 3 as Tier, icon: Target, color: '#ef4444' },
]

const docLog: DocEntry[] = [
  { student: 'Marcus Bellamy',  initials: 'MB', tier: 2, area: 'Reading',          date: 'Sep 14', teacher: 'T.M.', note: 'Student correctly identified 8/10 target sight words during today\'s session. Fluency improving steadily on decodable passage level C. Next session: introduce Tier 2 vocabulary from unit 4 and progress to level D readers.' },
  { student: 'Sofia Reyes',     initials: 'SR', tier: 3, area: 'Math',             date: 'Sep 13', teacher: 'K.L.', note: 'Completed fraction addition with visual support and fraction strips. Struggles with fraction multiplication — continued scaffolding required. Manipulatives helping significantly. Will update IEP goal phrasing before next parent conference.' },
  { student: 'Emma Kasprzak',   initials: 'EK', tier: 2, area: 'Reading',          date: 'Sep 12', teacher: 'T.M.', note: 'Excellent session — student read a short decodable text independently for the first time! CVC patterns fully mastered. Beginning CVC-e patterns next week. Recommend exit from Tier 2 at end of next benchmark window.' },
  { student: 'Jaylen Turner',   initials: 'JT', tier: 2, area: 'Behavior',         date: 'Sep 11', teacher: 'A.R.', note: 'Check-in meeting went well. Student identified 2 positive classroom moments unprompted. Behavior contract reviewed and updated to reflect new morning routine goal. 3 of 5 daily point targets met this week — an improvement from 1/5 last week.' },
  { student: 'Devon Whitmore',  initials: 'DW', tier: 3, area: 'Social-Emotional', date: 'Sep 10', teacher: 'D.C.', note: 'Student disclosed new details about social anxiety triggers in group settings. Introduced calm-down corner strategy and visual feelings chart. Will coordinate with homeroom teacher (Ms. Patel) to implement classroom-level supports. Counselor referral submitted.' },
]

const tierStudentGroups = [
  {
    tier: 1 as Tier,
    count: 18,
    pct: 64,
    desc: 'Whole-class instruction meets all learning needs. Universal screening complete for this cycle.',
    examples: [
      { name: 'Noah T.', initials: 'NT', color: '#6366f1' },
      { name: 'Ava P.', initials: 'AP', color: '#22d3ee' },
      { name: 'Ethan D.', initials: 'ED', color: '#10b981' },
      { name: 'Isabella J.', initials: 'IJ', color: '#a78bfa' },
    ],
  },
  {
    tier: 2 as Tier,
    count: 7,
    pct: 25,
    desc: 'Supplemental small-group intervention 3–5x per week targeting specific skill gaps.',
    examples: [
      { name: 'Marcus B.', initials: 'MB', color: '#6366f1' },
      { name: 'Emma K.', initials: 'EK', color: '#10b981' },
      { name: 'Priya S.', initials: 'PS', color: '#22d3ee' },
      { name: 'Aisha N.', initials: 'AN', color: '#14b8a6' },
    ],
  },
  {
    tier: 3 as Tier,
    count: 3,
    pct: 11,
    desc: 'Intensive individualized intervention daily. Progress monitoring weekly. IEP review pending.',
    examples: [
      { name: 'Sofia R.', initials: 'SR', color: '#f43f5e' },
      { name: 'Devon W.', initials: 'DW', color: '#8b5cf6' },
      { name: 'Jordan P.', initials: 'JP', color: '#ef4444' },
    ],
  },
]

const WEEK_LABELS = ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Wk 5', 'Wk 6']

/* ─────────────────────────────────────────────
   SVG PATH BUILDERS
───────────────────────────────────────────── */

function buildSparkPath(data: number[], W: number, H: number): string {
  const n = data.length
  const min = Math.min(...data) - 5
  const max = Math.max(...data) + 5
  const pts = data.map((v, i) => ({
    x: i * (W / (n - 1)),
    y: H - ((v - min) / (max - min)) * H,
  }))
  return pts.map((p, k) => {
    if (k === 0) return `M ${p.x.toFixed(1)} ${p.y.toFixed(1)}`
    const cpx = ((pts[k].x + pts[k - 1].x) / 2).toFixed(1)
    return `C ${cpx} ${pts[k - 1].y.toFixed(1)} ${cpx} ${p.y.toFixed(1)} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`
  }).join(' ')
}

function buildSparkArea(data: number[], W: number, H: number): string {
  const n = data.length
  const min = Math.min(...data) - 5
  const max = Math.max(...data) + 5
  const pts = data.map((v, i) => ({
    x: i * (W / (n - 1)),
    y: H - ((v - min) / (max - min)) * H,
  }))
  let d = pts.map((p, k) => {
    if (k === 0) return `M ${p.x.toFixed(1)} ${p.y.toFixed(1)}`
    const cpx = ((pts[k].x + pts[k - 1].x) / 2).toFixed(1)
    return `C ${cpx} ${pts[k - 1].y.toFixed(1)} ${cpx} ${p.y.toFixed(1)} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`
  }).join(' ')
  d += ` L ${W} ${H} L 0 ${H} Z`
  return d
}

/* ─────────────────────────────────────────────
   PAGE COMPONENT
───────────────────────────────────────────── */

export default function InterventionTrackerPage() {
  const [caseload, setCaseload]       = useState<Intervention[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('taleeko_interventions')
        if (saved) return JSON.parse(saved)
      } catch {}
    }
    return interventions
  })
  const [search, setSearch]           = useState('')
  const [filterTier, setFilterTier]   = useState<Tier | 0>(0)
  const [sortField, setSortField]     = useState<'student' | 'progress' | 'sessions'>('student')
  const [sortAsc, setSortAsc]         = useState(true)
  const [toastMsg, setToastMsg]       = useState('')
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null)

  function showToast(msg: string) {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 2600)
  }

  function toggleSort(field: 'student' | 'progress' | 'sessions') {
    if (sortField === field) setSortAsc(v => !v)
    else { setSortField(field); setSortAsc(true) }
  }

  const filtered = caseload
    .filter(iv => {
      const matchSearch = iv.student.toLowerCase().includes(search.toLowerCase())
        || iv.type.toLowerCase().includes(search.toLowerCase())
      const matchTier = filterTier === 0 || iv.tier === filterTier
      return matchSearch && matchTier
    })
    .sort((a, b) => {
      if (sortField === 'student')  return sortAsc ? a.student.localeCompare(b.student)   : b.student.localeCompare(a.student)
      if (sortField === 'progress') return sortAsc ? a.progress - b.progress              : b.progress - a.progress
      if (sortField === 'sessions') return sortAsc ? a.sessions - b.sessions              : b.sessions - a.sessions
      return 0
    })

  const atRiskCount  = caseload.filter(iv => iv.status === 'At Risk').length
  const onTrackCount = caseload.filter(iv => iv.status === 'On Track').length

  return (
    <div className="space-y-6">

      {/* ══════════════════════════════════
          HEADER
      ══════════════════════════════════ */}
      <FadeUp>
        <div className="hero-mesh rounded-3xl p-6 border border-white/[0.06] relative overflow-hidden">
          {/* Ambient glow blobs */}
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-30 pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(239,68,68,0.15), transparent 70%)' }} />
          <div className="absolute -bottom-10 left-1/3 w-48 h-48 rounded-full opacity-20 pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.12), transparent 70%)' }} />

          <div className="relative flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 relative"
                style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
                <Layers className="w-6 h-6 text-white" />
                <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-danger-500 border-2 border-surface-900 animate-pulse-slow" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-black text-white tracking-tight">Intervention Tracker</h1>
                  <span className="text-[10px] bg-danger-500/15 text-danger-400 px-2 py-0.5 rounded-full font-bold border border-danger-500/20">
                    {atRiskCount} At Risk
                  </span>
                </div>
                <p className="text-sm text-surface-400">RTI/MTSS · Tier 1–3 Monitoring · Progress Tracking · Session Scheduling</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
              <motion.button
                className="btn-secondary text-xs px-4 py-2"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => showToast('Intervention report exported!')}
              >
                <Download className="w-3.5 h-3.5" /> Export Report
              </motion.button>
              <motion.button
                className="btn-primary text-xs px-4 py-2"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => showToast('New intervention form opened!')}
              >
                <Plus className="w-3.5 h-3.5" /> Add Intervention
              </motion.button>
            </div>
          </div>

          {/* Stat tiles */}
          <div className="relative grid grid-cols-3 gap-4">
            {[
              {
                label: 'Total Students',
                value: '28',
                sub: 'enrolled in RTI program',
                icon: Users,
                color: '#6366f1',
                grad: 'rgba(99,102,241,0.1)',
              },
              {
                label: 'Active Interventions',
                value: '12',
                sub: `${onTrackCount} on track · ${atRiskCount} at risk`,
                icon: Activity,
                color: '#f59e0b',
                grad: 'rgba(245,158,11,0.1)',
              },
              {
                label: 'Avg Progress',
                value: '67%',
                sub: 'across all active plans',
                icon: TrendingUp,
                color: '#10b981',
                grad: 'rgba(16,185,129,0.1)',
              },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="rounded-2xl p-4 relative overflow-hidden"
                style={{ background: stat.grad, border: `1px solid ${stat.color}25` }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: stat.color + '20' }}>
                    <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5" style={{ color: stat.color }} />
                </div>
                <p className="text-2xl font-black text-white">{stat.value}</p>
                <p className="text-[10px] text-surface-400 mt-0.5 font-medium">{stat.label}</p>
                <p className="text-[9px] text-surface-500 mt-0.5">{stat.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </FadeUp>

      {/* ══════════════════════════════════
          TIER OVERVIEW CARDS
      ══════════════════════════════════ */}
      <FadeUp delay={0.06}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tierStudentGroups.map((tg, ti) => {
            const color = TIER_COLORS[tg.tier]
            const bg    = TIER_BG[tg.tier]
            const brd   = TIER_BORDER[tg.tier]
            const W = 280, H = 10
            const bw = (tg.pct / 100) * W
            const gid = `tc-tier-${tg.tier}`
            return (
              <motion.div
                key={tg.tier}
                className="glass-card p-5 relative overflow-hidden"
                style={{ borderColor: brd }}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 + ti * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -2 }}
              >
                {/* Top accent stripe */}
                <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl" style={{ background: color }} />
                <div className="absolute inset-0 pointer-events-none" style={{ background: bg, opacity: 0.4 }} />

                <div className="relative">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-black uppercase tracking-widest" style={{ color }}>
                          Tier {tg.tier}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded font-semibold"
                          style={{ backgroundColor: color + '20', color }}>
                          {TIER_LABELS[tg.tier]}
                        </span>
                      </div>
                      <p className="text-3xl font-black text-white">{tg.count}</p>
                      <p className="text-[10px] text-surface-400">students · {tg.pct}% of class</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: color + '15' }}>
                      {tg.tier === 1
                        ? <Shield className="w-5 h-5" style={{ color }} />
                        : tg.tier === 2
                          ? <Target className="w-5 h-5" style={{ color }} />
                          : <Zap className="w-5 h-5" style={{ color }} />}
                    </div>
                  </div>

                  <p className="text-[11px] text-surface-400 leading-relaxed mb-4">{tg.desc}</p>

                  {/* SVG progress bar */}
                  <div className="mb-4">
                    <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible">
                      <defs>
                        <linearGradient id={gid} x1="0" x2="1" y1="0" y2="0">
                          <stop offset="0%" stopColor={color} />
                          <stop offset="100%" stopColor={color + '60'} />
                        </linearGradient>
                      </defs>
                      <rect x={0} y={0} width={W} height={H} rx={5} fill="rgba(255,255,255,0.06)" />
                      <motion.rect
                        x={0} y={0} height={H} rx={5}
                        fill={`url(#${gid})`}
                        initial={{ width: 0 }}
                        animate={{ width: bw }}
                        transition={{ delay: 0.4 + ti * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </svg>
                  </div>

                  {/* Avatar dots */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {tg.examples.map(ex => (
                      <div
                        key={ex.name}
                        className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-black text-white cursor-pointer transition-transform hover:scale-110"
                        style={{ background: `linear-gradient(135deg, ${ex.color}, ${ex.color}99)` }}
                        title={ex.name}
                      >
                        {ex.initials}
                      </div>
                    ))}
                    {tg.count > tg.examples.length && (
                      <span className="text-[10px] text-surface-500 font-semibold">
                        +{tg.count - tg.examples.length} more
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </FadeUp>

      {/* ══════════════════════════════════
          MAIN 2-COLUMN LAYOUT
      ══════════════════════════════════ */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* LEFT col (2/3 width) */}
        <div className="xl:col-span-2 space-y-6">

          {/* ════════════════════════
              ACTIVE INTERVENTIONS TABLE
          ════════════════════════ */}
          <FadeUp delay={0.1}>
            <div className="glass-card overflow-hidden">
              {/* Table toolbar */}
              <div className="px-5 py-4 border-b border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg,#6366f1,#4f46e5)' }}>
                    <BarChart2 className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white">Active Interventions</h2>
                    <p className="text-[10px] text-surface-500">{filtered.length} of {caseload.length} plans displayed</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Search */}
                  <div className="relative">
                    <Search className="w-3 h-3 text-surface-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search student or type..."
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      className="pl-7 pr-3 py-1.5 text-[11px] rounded-lg bg-white/[0.04] border border-white/[0.08] text-surface-200 placeholder:text-surface-500 focus:outline-none focus:ring-1 focus:ring-accent-500/40 w-44"
                    />
                  </div>

                  {/* Tier filter pills */}
                  <div className="flex items-center gap-1 p-0.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                    {([0, 1, 2, 3] as (0 | Tier)[]).map(t => (
                      <button
                        key={t}
                        onClick={() => setFilterTier(t)}
                        className="px-2.5 py-1 rounded-md text-[10px] font-bold transition-all"
                        style={filterTier === t ? {
                          backgroundColor: t === 0 ? '#6366f1' : TIER_COLORS[t as Tier] + '30',
                          color: t === 0 ? 'white' : TIER_COLORS[t as Tier],
                        } : { color: 'rgba(255,255,255,0.35)' }}
                      >
                        {t === 0 ? 'All' : `T${t}`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Scrollable table */}
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px]">
                  <thead>
                    <tr className="border-b border-white/[0.05]">
                      {[
                        { label: 'Student',           field: 'student' as const },
                        { label: 'Tier',              field: null },
                        { label: 'Area',              field: null },
                        { label: 'Intervention Type', field: null },
                        { label: 'Start',             field: null },
                        { label: 'Sessions',          field: 'sessions' as const },
                        { label: 'Progress',          field: 'progress' as const },
                        { label: 'Next Session',      field: null },
                        { label: 'Status',            field: null },
                      ].map(col => (
                        <th
                          key={col.label}
                          className="text-left text-[10px] font-bold text-surface-500 uppercase tracking-wider px-4 py-3"
                        >
                          {col.field ? (
                            <button
                              onClick={() => toggleSort(col.field!)}
                              className="flex items-center gap-1 hover:text-surface-300 transition-colors"
                            >
                              {col.label}
                              {sortField === col.field
                                ? sortAsc
                                  ? <ChevronUp className="w-2.5 h-2.5" />
                                  : <ChevronDown className="w-2.5 h-2.5" />
                                : <ChevronDown className="w-2.5 h-2.5 opacity-30" />}
                            </button>
                          ) : col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((iv, i) => {
                      const tc = TIER_COLORS[iv.tier]
                      const sc = STATUS_CONFIG[iv.status]
                      const ac = AREA_COLORS[iv.area]
                      const W = 200, H = 8
                      const bw = (iv.progress / 100) * W
                      const gid = `it-bar-${iv.id}`
                      const progressColor = iv.progress >= 75 ? '#10b981' : iv.progress >= 50 ? '#f59e0b' : '#ef4444'
                      return (
                        <motion.tr
                          key={iv.id}
                          className="border-b border-white/[0.04] hover:bg-white/[0.025] transition-colors"
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.18 + i * 0.04, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        >
                          {/* Student */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2.5">
                              <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black text-white flex-shrink-0"
                                style={{ background: `linear-gradient(135deg, ${iv.avatarColor}, ${iv.avatarColor}88)` }}
                              >
                                {iv.initials}
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-surface-100">{iv.student}</p>
                                {iv.iep && (
                                  <span className="text-[9px] bg-electric-400/15 text-electric-400 px-1.5 py-0.5 rounded font-bold">IEP</span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Tier */}
                          <td className="px-4 py-3">
                            <span
                              className="inline-flex items-center justify-center w-8 h-6 rounded-lg text-[10px] font-black"
                              style={{ backgroundColor: tc + '20', color: tc }}
                            >
                              T{iv.tier}
                            </span>
                          </td>

                          {/* Area */}
                          <td className="px-4 py-3">
                            <span
                              className="text-[10px] font-semibold px-2 py-1 rounded-full"
                              style={{ backgroundColor: ac + '18', color: ac }}
                            >
                              {iv.area}
                            </span>
                          </td>

                          {/* Intervention type */}
                          <td className="px-4 py-3">
                            <p className="text-[11px] text-surface-300">{iv.type}</p>
                          </td>

                          {/* Start date */}
                          <td className="px-4 py-3">
                            <p className="text-[10px] text-surface-500">{iv.startDate}</p>
                          </td>

                          {/* Sessions */}
                          <td className="px-4 py-3 text-center">
                            <span className="text-xs font-bold text-surface-200 tabular-nums">{iv.sessions}</span>
                          </td>

                          {/* Progress bar (SVG) */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <svg viewBox={`0 0 ${W} ${H}`} className="flex-1 overflow-visible" style={{ minWidth: 80 }}>
                                <defs>
                                  <linearGradient id={gid} x1="0" x2="1" y1="0" y2="0">
                                    <stop offset="0%" stopColor={progressColor} />
                                    <stop offset="100%" stopColor={progressColor + '80'} />
                                  </linearGradient>
                                </defs>
                                <rect x={0} y={0} width={W} height={H} rx={4} fill="rgba(255,255,255,0.06)" />
                                <motion.rect
                                  x={0} y={0} height={H} rx={4}
                                  fill={`url(#${gid})`}
                                  initial={{ width: 0 }}
                                  animate={{ width: bw }}
                                  transition={{ delay: 0.3 + i * 0.04, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                                />
                              </svg>
                              <span
                                className="text-[10px] font-bold w-8 text-right flex-shrink-0 tabular-nums"
                                style={{ color: progressColor }}
                              >
                                {iv.progress}%
                              </span>
                            </div>
                          </td>

                          {/* Next session */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-surface-500 flex-shrink-0" />
                              <p className="text-[10px] text-surface-400">{iv.nextSession}</p>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="px-4 py-3">
                            <span
                              className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full"
                              style={{ backgroundColor: sc.bg, color: sc.color }}
                            >
                              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: sc.dot }} />
                              {iv.status}
                            </span>
                          </td>
                        </motion.tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {filtered.length === 0 && (
                <div className="py-12 text-center">
                  <Search className="w-6 h-6 text-surface-600 mx-auto mb-2" />
                  <p className="text-sm text-surface-500">No interventions match your search or filters</p>
                </div>
              )}

              {/* Table footer */}
              <div className="px-5 py-3 border-t border-white/[0.05] flex items-center justify-between">
                <span className="text-[10px] text-surface-500">Updated Aug 15, 2026 · 7:42 AM</span>
                <div className="flex items-center gap-3">
                  {(['On Track', 'At Risk', 'Exited', 'Paused'] as Status[]).map(s => (
                    <div key={s} className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: STATUS_CONFIG[s].dot }} />
                      <span className="text-[9px] text-surface-500">
                        {caseload.filter(iv => iv.status === s).length} {s}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeUp>

          {/* ════════════════════════
              PROGRESS MONITORING CHART
          ════════════════════════ */}
          <FadeInWhenVisible delay={0.05}>
            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg,#22d3ee,#0891b2)' }}>
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white">6-Week Progress Monitoring</h2>
                    <p className="text-[10px] text-surface-500">Weekly benchmark scores · cubic bezier interpolation</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {[{ label: 'Tier 2', color: TIER_COLORS[2] }, { label: 'Tier 3', color: TIER_COLORS[3] }].map(l => (
                    <div key={l.label} className="flex items-center gap-1.5">
                      <div className="w-5 h-0.5 rounded" style={{ background: l.color }} />
                      <span className="text-[9px] text-surface-500">{l.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sparkline rows */}
              <div className="space-y-1">
                {sparkStudents.map((ss, si) => {
                  const color    = TIER_COLORS[ss.tier]
                  const areaColor = AREA_COLORS[ss.area]
                  const W = 400, H = 44
                  const firstVal = ss.data[0]
                  const lastVal  = ss.data[ss.data.length - 1]
                  const delta    = lastVal - firstVal
                  const n        = ss.data.length
                  const min      = Math.min(...ss.data) - 5
                  const max      = Math.max(...ss.data) + 5
                  const linePath = buildSparkPath(ss.data, W, H)
                  const areaPath = buildSparkArea(ss.data, W, H)
                  const dotX     = (n - 1) * (W / (n - 1))
                  const dotY     = H - ((lastVal - min) / (max - min)) * H
                  const gidLine  = `sp-line-${si}`
                  const gidArea  = `sp-area-${si}`
                  return (
                    <motion.div
                      key={ss.name}
                      className="flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-white/[0.03] transition-colors"
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25 + si * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {/* Student meta */}
                      <div className="w-44 flex-shrink-0">
                        <div className="flex items-center gap-2">
                          <span
                            className="text-[9px] font-black px-1.5 py-0.5 rounded"
                            style={{ backgroundColor: color + '20', color }}
                          >T{ss.tier}</span>
                          <p className="text-xs font-semibold text-surface-200 truncate">{ss.name}</p>
                        </div>
                        <p className="text-[9px] mt-0.5 pl-[26px]" style={{ color: areaColor }}>{ss.area}</p>
                      </div>

                      {/* Sparkline SVG */}
                      <div className="flex-1 min-w-0 relative">
                        <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible" style={{ height: 44 }}>
                          <defs>
                            <linearGradient id={gidLine} x1="0" x2="1" y1="0" y2="0">
                              <stop offset="0%" stopColor={color} stopOpacity="0.9" />
                              <stop offset="100%" stopColor={color} stopOpacity="0.6" />
                            </linearGradient>
                            <linearGradient id={gidArea} x1="0" x2="0" y1="0" y2="1">
                              <stop offset="0%" stopColor={color} stopOpacity="0.18" />
                              <stop offset="100%" stopColor={color} stopOpacity="0.01" />
                            </linearGradient>
                          </defs>
                          {/* Area fill */}
                          <path d={areaPath} fill={`url(#${gidArea})`} />
                          {/* Animated line */}
                          <motion.path
                            d={linePath}
                            fill="none"
                            stroke={`url(#${gidLine})`}
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ delay: 0.35 + si * 0.1, duration: 1.2, ease: 'easeOut' }}
                          />
                          {/* Subtle dots */}
                          {ss.data.map((v, di) => {
                            const dx = di * (W / (n - 1))
                            const dy = H - ((v - min) / (max - min)) * H
                            if (di === n - 1) return null
                            return (
                              <circle key={di} cx={dx} cy={dy} r={2.5}
                                fill="none" stroke={color} strokeWidth={1} strokeOpacity={0.35} />
                            )
                          })}
                          {/* Endpoint */}
                          <circle cx={dotX} cy={dotY} r={6} fill={color} fillOpacity={0.15} />
                          <circle cx={dotX} cy={dotY} r={3.5} fill={color} />
                          <circle cx={dotX} cy={dotY} r={1.5} fill="white" fillOpacity={0.8} />
                        </svg>
                      </div>

                      {/* Value summary */}
                      <div className="w-28 flex-shrink-0 flex items-center justify-end gap-3">
                        <div className="text-right">
                          <p className="text-[9px] text-surface-500">Current</p>
                          <p className="text-sm font-black text-white tabular-nums">{lastVal}%</p>
                        </div>
                        <div
                          className="flex items-center gap-0.5 text-[10px] font-bold px-2 py-1 rounded-lg"
                          style={{
                            backgroundColor: delta >= 0 ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                            color: delta >= 0 ? '#10b981' : '#ef4444',
                          }}
                        >
                          {delta >= 0
                            ? <TrendingUp className="w-3 h-3" />
                            : <TrendingDown className="w-3 h-3" />}
                          {delta >= 0 ? '+' : ''}{delta}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {/* X-axis labels */}
              <div className="flex items-center mt-2 pl-[11.5rem] pr-[7.5rem]">
                {WEEK_LABELS.map(w => (
                  <div key={w} className="flex-1 text-center text-[9px] text-surface-600 font-semibold">{w}</div>
                ))}
              </div>

              <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                <p className="text-[10px] text-surface-500">Benchmark target: 70% · Universal screening every 6 weeks</p>
                <button
                  className="text-[10px] text-accent-400 hover:text-accent-300 font-semibold flex items-center gap-0.5"
                  onClick={() => showToast('Full progress report opened!')}
                >
                  Full report <ChevronRight className="w-2.5 h-2.5" />
                </button>
              </div>
            </div>
          </FadeInWhenVisible>
        </div>

        {/* RIGHT col (1/3 width) */}
        <div className="space-y-4">

          {/* ════════════════════════
              UPCOMING SESSIONS
          ════════════════════════ */}
          <FadeUp delay={0.14}>
            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-electric-400" />
                  <h3 className="text-sm font-bold text-white">Upcoming Sessions</h3>
                </div>
                <span className="text-[10px] text-electric-400 font-semibold bg-electric-400/10 px-2 py-0.5 rounded-full">
                  Today
                </span>
              </div>

              <div className="space-y-2">
                {upcomingSessions.map((sess, si) => {
                  const tc      = TIER_COLORS[sess.tier]
                  const isToday = sess.time.startsWith('Today')
                  return (
                    <motion.div
                      key={si}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer"
                      style={{ borderLeft: `2px solid ${tc}40` }}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + si * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      whileHover={{ x: 2, transition: { duration: 0.15 } }}
                    >
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-[9px] font-black text-white"
                        style={{ background: `linear-gradient(135deg, ${tc}, ${tc}80)` }}
                      >
                        T{sess.tier}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-semibold text-surface-200 truncate">{sess.student}</p>
                        <p className="text-[9px] text-surface-500 truncate">{sess.type}</p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className={`text-[9px] font-bold ${isToday ? 'text-electric-400' : 'text-surface-400'}`}>
                          {sess.time.split(' · ')[0]}
                        </p>
                        <p className="text-[9px] text-surface-500">{sess.time.split(' · ')[1]}</p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              <motion.button
                className="mt-3 w-full py-2 rounded-xl text-[11px] font-semibold text-surface-400 hover:text-surface-200 border border-white/[0.06] hover:border-white/[0.1] transition-all flex items-center justify-center gap-1"
                whileHover={{ scale: 1.01 }}
                onClick={() => showToast('Full schedule opened!')}
              >
                <Calendar className="w-3 h-3" /> View Full Schedule
              </motion.button>
            </div>
          </FadeUp>

          {/* ════════════════════════
              ALERTS
          ════════════════════════ */}
          <FadeUp delay={0.2}>
            <div className="glass-card p-5 border border-danger-500/15">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-danger-500/20">
                    <Bell className="w-3.5 h-3.5 text-danger-400" />
                  </div>
                  <h3 className="text-sm font-bold text-white">Alerts</h3>
                  <span className="text-[10px] bg-danger-500/20 text-danger-400 px-2 py-0.5 rounded-full font-bold border border-danger-500/20">
                    {alerts.length}
                  </span>
                </div>
                <motion.div
                  className="w-2 h-2 rounded-full bg-danger-400"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </div>

              <div className="space-y-3">
                {alerts.map((alert, ai) => {
                  const tc = TIER_COLORS[alert.tier]
                  return (
                    <motion.div
                      key={ai}
                      className="p-3 rounded-xl"
                      style={{
                        backgroundColor: alert.color + '0a',
                        border: `1px solid ${alert.color}25`,
                      }}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.28 + ai * 0.08, duration: 0.4 }}
                      whileHover={{ scale: 1.01, transition: { duration: 0.15 } }}
                    >
                      <div className="flex items-start gap-2">
                        <alert.icon className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: alert.color }} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-1">
                            <p className="text-[11px] font-bold text-surface-100">{alert.student}</p>
                            <span
                              className="text-[8px] font-black px-1 py-0.5 rounded"
                              style={{ backgroundColor: tc + '25', color: tc }}
                            >T{alert.tier}</span>
                          </div>
                          <p className="text-[10px] text-surface-400 leading-relaxed">{alert.message}</p>
                        </div>
                      </div>
                      <motion.button
                        className="mt-2 text-[9px] font-semibold flex items-center gap-0.5"
                        style={{ color: alert.color }}
                        whileHover={{ x: 1 }}
                        onClick={() => showToast(`Reviewing ${alert.student}'s plan...`)}
                      >
                        Review Plan <ChevronRight className="w-2.5 h-2.5" />
                      </motion.button>
                    </motion.div>
                  )
                })}
              </div>

              <div className="mt-3 pt-3 border-t border-white/[0.05] flex items-center justify-between">
                <p className="text-[9px] text-surface-600">Auto-checks run every 24 hours</p>
                <button className="text-[9px] text-surface-500 hover:text-surface-300 font-semibold flex items-center gap-0.5">
                  Configure <ChevronRight className="w-2.5 h-2.5" />
                </button>
              </div>
            </div>
          </FadeUp>

          {/* ════════════════════════
              AREA BREAKDOWN
          ════════════════════════ */}
          <FadeUp delay={0.26}>
            <div className="glass-card p-5">
              <h3 className="text-[11px] font-bold text-surface-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-warning-400" /> Area Breakdown
              </h3>
              <div className="space-y-3">
                {(['Reading', 'Math', 'Behavior', 'Social-Emotional'] as Area[]).map((area, ai) => {
                  const count = caseload.filter(iv => iv.area === area).length
                  const pct   = Math.round((count / caseload.length) * 100)
                  const color = AREA_COLORS[area]
                  const W = 200, H = 6
                  const bw  = (pct / 100) * W
                  const gid = `area-stat-${ai}`
                  return (
                    <div key={area}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] text-surface-300">{area}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-surface-500">{count}</span>
                          <span className="text-[10px] font-bold tabular-nums" style={{ color }}>{pct}%</span>
                        </div>
                      </div>
                      <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible">
                        <defs>
                          <linearGradient id={gid} x1="0" x2="1" y1="0" y2="0">
                            <stop offset="0%" stopColor={color} />
                            <stop offset="100%" stopColor={color + '70'} />
                          </linearGradient>
                        </defs>
                        <rect x={0} y={0} width={W} height={H} rx={3} fill="rgba(255,255,255,0.06)" />
                        <motion.rect
                          x={0} y={0} height={H} rx={3}
                          fill={`url(#${gid})`}
                          initial={{ width: 0 }}
                          animate={{ width: bw }}
                          transition={{ delay: 0.45 + ai * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        />
                      </svg>
                    </div>
                  )
                })}
              </div>
            </div>
          </FadeUp>
        </div>
      </div>

      {/* ══════════════════════════════════
          DOCUMENTATION LOG
      ══════════════════════════════════ */}
      <FadeInWhenVisible delay={0.05}>
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #a78bfa, #7c3aed)' }}>
                <FileText className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">Documentation Log</h2>
                <p className="text-[10px] text-surface-500">Recent intervention session notes · click to expand</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-surface-500">{docLog.length} recent entries</span>
              <motion.button
                className="btn-secondary text-xs px-3 py-1.5"
                whileHover={{ scale: 1.02 }}
                onClick={() => showToast('New session note opened!')}
              >
                <Plus className="w-3 h-3" /> Add Note
              </motion.button>
            </div>
          </div>

          <div className="space-y-2.5">
            {docLog.map((entry, di) => {
              const tc         = TIER_COLORS[entry.tier]
              const ac         = AREA_COLORS[entry.area]
              const docKey     = `${entry.student}-${di}`
              const isExpanded = expandedDoc === docKey
              return (
                <motion.div
                  key={di}
                  className="rounded-xl overflow-hidden"
                  style={{ border: `1px solid ${tc}18`, background: `${tc}06` }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + di * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <button
                    className="w-full text-left p-4 hover:bg-white/[0.02] transition-colors"
                    onClick={() => setExpandedDoc(isExpanded ? null : docKey)}
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[9px] font-black text-white flex-shrink-0 mt-0.5"
                        style={{ background: `linear-gradient(135deg, ${tc}, ${tc}80)` }}
                      >
                        {entry.initials}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <p className="text-xs font-bold text-surface-100">{entry.student}</p>
                          <span
                            className="text-[9px] font-black px-1.5 py-0.5 rounded"
                            style={{ backgroundColor: tc + '20', color: tc }}
                          >T{entry.tier}</span>
                          <span
                            className="text-[9px] font-semibold px-1.5 py-0.5 rounded"
                            style={{ backgroundColor: ac + '18', color: ac }}
                          >{entry.area}</span>
                        </div>
                        <p className={`text-[11px] text-surface-400 leading-relaxed ${isExpanded ? '' : 'line-clamp-1'}`}>
                          {entry.note}
                        </p>
                      </div>

                      <div className="flex-shrink-0 flex items-center gap-3 ml-2">
                        <div className="text-right">
                          <p className="text-[9px] font-semibold text-surface-400">{entry.date}</p>
                          <p className="text-[9px] text-surface-600">{entry.teacher}</p>
                        </div>
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="w-3.5 h-3.5 text-surface-500" />
                        </motion.div>
                      </div>
                    </div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 border-t border-white/[0.05] pt-3">
                          <p className="text-[11px] text-surface-300 leading-relaxed mb-3">{entry.note}</p>
                          <div className="flex items-center gap-2">
                            <motion.button
                              className="btn-secondary text-[10px] px-3 py-1.5"
                              whileHover={{ scale: 1.02 }}
                              onClick={() => showToast('Note editing opened!')}
                            >
                              <FileText className="w-3 h-3" /> Edit Note
                            </motion.button>
                            <motion.button
                              className="btn-secondary text-[10px] px-3 py-1.5"
                              whileHover={{ scale: 1.02 }}
                              onClick={() => showToast(`Opened ${entry.student}'s full profile!`)}
                            >
                              <Eye className="w-3 h-3" /> View Profile
                            </motion.button>
                            <motion.button
                              className="btn-secondary text-[10px] px-3 py-1.5"
                              whileHover={{ scale: 1.02 }}
                              onClick={() => showToast('Message sent to intervention team!')}
                            >
                              <MessageSquare className="w-3 h-3" /> Message Team
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-white/[0.05] flex items-center justify-between">
            <p className="text-[10px] text-surface-500">Notes are encrypted and accessible to intervention team members only</p>
            <motion.button
              className="text-[10px] text-accent-400 font-semibold hover:text-accent-300 flex items-center gap-1"
              whileHover={{ x: 1 }}
              onClick={() => showToast('Full documentation archive opened!')}
            >
              View all notes <ChevronRight className="w-2.5 h-2.5" />
            </motion.button>
          </div>
        </div>
      </FadeInWhenVisible>

      {/* ══════════════════════════════════
          TOAST
      ══════════════════════════════════ */}
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
