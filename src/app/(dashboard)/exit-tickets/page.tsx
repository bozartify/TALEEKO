'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FadeUp, StaggerList, StaggerItem, FadeInWhenVisible } from '@/components/ui/motion'
import {
  Target, Sparkles, Plus, Send, CheckCircle, XCircle, Clock,
  Users, BarChart2, TrendingUp, AlertCircle, ChevronDown,
  ThumbsUp, ThumbsDown, Minus, RefreshCw,
  Download, Eye, Zap, Brain, BookOpen, Star,
  X, Check, ArrowRight, Lightbulb, Copy, Share2,
  MoreVertical, Archive, Flag, ExternalLink, BarChart3
} from 'lucide-react'

type QuestionType = 'multiple-choice' | 'thumbs' | 'traffic-light' | 'rating' | 'short-answer'
type Status = 'draft' | 'active' | 'completed'
type View = 'overview' | 'results' | 'create'

interface Choice { id: string; text: string; correct?: boolean }
interface Question {
  id: string
  type: QuestionType
  text: string
  choices?: Choice[]
}
interface ExitTicket {
  id: string; title: string; topic: string; period: string
  status: Status; questions: Question[]
  responses: number; totalStudents: number
  completionRate: number; avgScore: number; createdAt: string
}
interface StudentResult {
  name: string; initials: string; color: string
  score: number; status: 'got-it' | 'almost' | 'needs-help'
  answers: string[]; flagged?: boolean
}

const TYPE_CONFIG: Record<QuestionType, { label: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
  'multiple-choice': { label: 'Multiple Choice', icon: CheckCircle, color: 'text-accent-400' },
  'thumbs':          { label: 'Thumbs Up/Down',  icon: ThumbsUp,    color: 'text-success-400' },
  'traffic-light':   { label: 'Traffic Light',   icon: AlertCircle, color: 'text-warning-400' },
  'rating':          { label: 'Rating Scale',    icon: Star,        color: 'text-electric-400' },
  'short-answer':    { label: 'Short Answer',    icon: BookOpen,    color: 'text-neon-400' },
}

const TICKETS: ExitTicket[] = [
  {
    id: 'et1', title: 'Photosynthesis Check', topic: 'Cell Biology',
    period: 'Period 2 – Biology', status: 'completed',
    responses: 24, totalStudents: 28, completionRate: 86, avgScore: 78, createdAt: '2026-07-30',
    questions: [
      { id: 'q1', type: 'multiple-choice', text: 'Where does photosynthesis primarily occur?', choices: [
        { id: 'a', text: 'Mitochondria' }, { id: 'b', text: 'Chloroplast', correct: true },
        { id: 'c', text: 'Nucleus' }, { id: 'd', text: 'Ribosome' }
      ]},
      { id: 'q2', type: 'thumbs', text: 'I understand the light-dependent reactions.' },
      { id: 'q3', type: 'short-answer', text: 'In one sentence, explain what happens during the Calvin cycle.' },
    ]
  },
  {
    id: 'et2', title: 'Mitosis Quick Check', topic: 'Cell Division',
    period: 'Period 4 – Biology', status: 'active',
    responses: 12, totalStudents: 26, completionRate: 46, avgScore: 82, createdAt: '2026-07-31',
    questions: [
      { id: 'q1', type: 'traffic-light', text: 'How confident are you in naming all phases of mitosis in order?' },
      { id: 'q2', type: 'multiple-choice', text: 'Which phase comes after Metaphase?', choices: [
        { id: 'a', text: 'Prophase' }, { id: 'b', text: 'Anaphase', correct: true },
        { id: 'c', text: 'Telophase' }, { id: 'd', text: 'Interphase' }
      ]},
      { id: 'q3', type: 'rating', text: 'Rate your understanding of cytokinesis (1 = very confused, 5 = totally got it)' },
    ]
  },
  {
    id: 'et3', title: 'Ecosystem Energy Flow', topic: 'Ecology',
    period: 'Period 6 – Biology', status: 'draft',
    responses: 0, totalStudents: 24, completionRate: 0, avgScore: 0, createdAt: '2026-07-31',
    questions: [
      { id: 'q1', type: 'multiple-choice', text: 'Which trophic level contains the most energy?', choices: [
        { id: 'a', text: 'Primary Consumers' }, { id: 'b', text: 'Secondary Consumers' },
        { id: 'c', text: 'Producers', correct: true }, { id: 'd', text: 'Decomposers' }
      ]},
      { id: 'q2', type: 'thumbs', text: 'I can explain the 10% energy rule between trophic levels.' },
    ]
  },
]

const STUDENT_RESULTS: StudentResult[] = [
  { name: 'Emma Johnson',    initials: 'EJ', color: '#6366f1', score: 95, status: 'got-it',     answers: ['Chloroplast', 'Yes', 'Calvin cycle uses CO2 to make glucose'] },
  { name: 'Marcus Chen',     initials: 'MC', color: '#22d3ee', score: 80, status: 'almost',     answers: ['Chloroplast', 'No',  'It uses light energy somehow'] },
  { name: 'Sofia Rodriguez', initials: 'SR', color: '#10b981', score: 40, status: 'needs-help', answers: ['Nucleus',     'No',  "I'm not sure what it does"], flagged: true },
  { name: 'Aiden Park',      initials: 'AP', color: '#f59e0b', score: 85, status: 'got-it',     answers: ['Chloroplast', 'Yes', 'Fixes carbon dioxide into sugar'] },
  { name: 'Lily Turner',     initials: 'LT', color: '#8b5cf6', score: 60, status: 'almost',     answers: ['Mitochondria','Yes', 'Makes oxygen and glucose'] },
  { name: 'James Kim',       initials: 'JK', color: '#ef4444', score: 35, status: 'needs-help', answers: ['Ribosome',    'No',  'I forgot'], flagged: true },
]

const STATUS_BADGE: Record<Status, { bg: string; text: string; label: string; dot: string }> = {
  draft:     { bg: 'bg-surface-700/50', text: 'text-surface-400', label: 'Draft',     dot: 'bg-surface-500' },
  active:    { bg: 'bg-success-500/10', text: 'text-success-400', label: 'Active',    dot: 'bg-success-400' },
  completed: { bg: 'bg-accent-500/10',  text: 'text-accent-400',  label: 'Completed', dot: 'bg-accent-400'  },
}

const STUDENT_STATUS = {
  'got-it':    { bg: 'bg-success-500/10', text: 'text-success-400', label: 'Got It',    icon: ThumbsUp },
  'almost':    { bg: 'bg-warning-500/10', text: 'text-warning-400', label: 'Almost',    icon: Minus },
  'needs-help':{ bg: 'bg-danger-500/10',  text: 'text-danger-400',  label: 'Needs Help', icon: ThumbsDown },
}

const Q_CORRECT_RATES = [64, 88, 55]
const PERIOD_SCORES = [82, 78, 65, 82, 71, 0]
const PERIOD_LABELS = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6']

const AI_ALERTS = [
  {
    icon: AlertCircle,
    color: '#ef4444',
    bg: '#ef444418',
    title: '4 Students Need Follow-Up',
    body: 'Sofia Rodriguez and James Kim scored below 50% on the Photosynthesis Check. Small-group reteach is recommended before the unit test.',
    action: 'Flag & Group',
  },
  {
    icon: TrendingUp,
    color: '#10b981',
    bg: '#10b98118',
    title: 'Mitosis Ticket At 46% Response',
    body: '12 of 26 students have completed the active ticket. At this pace, full responses will be in by end of period.',
    action: 'Live View',
  },
  {
    icon: Lightbulb,
    color: '#6366f1',
    bg: '#6366f118',
    title: 'AI Reteach Suggestion Ready',
    body: 'Q3 (Calvin Cycle) had a 55% correct rate — the lowest question. A 10-minute mini-lesson on the topic is suggested for tomorrow.',
    action: 'Generate Lesson',
  },
]

const NEW_QN_TYPES: { type: QuestionType; label: string; desc: string; color: string; icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }> }[] = [
  { type: 'multiple-choice', label: 'Multiple Choice', desc: '4 options, 1 correct answer', color: '#6366f1', icon: CheckCircle },
  { type: 'thumbs',          label: 'Thumbs Up/Down',  desc: 'Quick binary confidence check', color: '#10b981', icon: ThumbsUp },
  { type: 'traffic-light',   label: 'Traffic Light',   desc: 'Green/Yellow/Red understanding', color: '#f59e0b', icon: AlertCircle },
  { type: 'rating',          label: 'Rating Scale',    desc: '1–5 scale self-assessment', color: '#22d3ee', icon: Star },
  { type: 'short-answer',    label: 'Short Answer',    desc: 'Free text written response', color: '#8b5cf6', icon: BookOpen },
]

/* ─────────────────────────────────────────────────────────
   COMPONENT
   ───────────────────────────────────────────────────────── */

export default function ExitTicketsPage() {
  const [tickets, setTickets] = useState<ExitTicket[]>(TICKETS)
  const [selectedTicket, setSelectedTicket] = useState<ExitTicket>(TICKETS[0])
  const [view, setView] = useState<View>('overview')
  const [topic, setTopic] = useState('')
  const [generating, setGenerating] = useState(false)
  const [period, setPeriod] = useState('Period 2 – Biology')
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>('q1')
  const [aiOpen, setAiOpen] = useState(true)
  const [exportOpen, setExportOpen] = useState(false)
  const [flagged, setFlagged] = useState<Set<string>>(new Set(['Sofia Rodriguez', 'James Kim']))
  const [actionMenu, setActionMenu] = useState<string | null>(null)
  const [toastMsg, setToastMsg] = useState('')
  const [newQType, setNewQType] = useState<QuestionType | null>(null)

  const gotItCount  = STUDENT_RESULTS.filter(s => s.status === 'got-it').length
  const almostCount = STUDENT_RESULTS.filter(s => s.status === 'almost').length
  const needsCount  = STUDENT_RESULTS.filter(s => s.status === 'needs-help').length

  const showToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 2500)
  }

  const handleGenerate = async () => {
    if (!topic.trim()) return
    setGenerating(true)
    await new Promise(r => setTimeout(r, 2000))
    setGenerating(false)
    const newTicket: ExitTicket = {
      id: `et${Date.now()}`,
      title: `${topic} Exit Ticket`,
      topic,
      period,
      status: 'draft',
      responses: 0,
      totalStudents: 26,
      completionRate: 0,
      avgScore: 0,
      createdAt: '2026-08-01',
      questions: [
        { id: 'q1', type: 'multiple-choice', text: `What is the most important concept in ${topic}?`, choices: [
          { id: 'a', text: 'Option A' }, { id: 'b', text: 'Option B', correct: true },
          { id: 'c', text: 'Option C' }, { id: 'd', text: 'Option D' }
        ]},
        { id: 'q2', type: 'thumbs', text: `I understand the key ideas of ${topic}.` },
        { id: 'q3', type: 'short-answer', text: `Summarize ${topic} in one sentence.` },
      ]
    }
    setTickets(prev => [newTicket, ...prev])
    setSelectedTicket(newTicket)
    setView('overview')
    showToast(`Exit ticket created: "${topic} Exit Ticket"`)
    setTopic('')
  }

  const toggleFlag = (name: string) => {
    setFlagged(prev => {
      const next = new Set(prev)
      if (next.has(name)) { next.delete(name); showToast(`${name} unflagged`) }
      else { next.add(name); showToast(`${name} flagged for follow-up`) }
      return next
    })
  }

  const handleSend = () => {
    setTickets(prev => prev.map(t => t.id === selectedTicket.id ? { ...t, status: 'active' as Status } : t))
    setSelectedTicket(prev => ({ ...prev, status: 'active' }))
    showToast(`Sent to class: "${selectedTicket.title}"`)
  }

  return (
    <div className="space-y-6">
      {/* ── TOAST ─── */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white shadow-xl"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}
            initial={{ opacity: 0, y: -16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.95 }}
          >
            <Check className="w-4 h-4" />
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HEADER ─── */}
      <FadeUp>
        <div className="hero-mesh rounded-3xl p-6 border border-white/[0.06]">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg,#f59e0b,#ef4444)' }}>
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-black text-white tracking-tight">Exit Tickets</h1>
                  <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-bold border border-amber-500/20">AI-Powered</span>
                </div>
                <p className="text-sm text-surface-400">Formative checks to gauge comprehension every period</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <motion.button className="btn-secondary text-xs px-3 py-1.5" whileHover={{ scale: 1.03 }} onClick={() => setExportOpen(true)}>
                <Download className="w-3.5 h-3.5" /> Export
              </motion.button>
              <motion.button className="btn-secondary text-xs px-3 py-1.5" whileHover={{ scale: 1.03 }} onClick={() => showToast('New exit ticket created!')}>
                <Plus className="w-3.5 h-3.5" /> New Ticket
              </motion.button>
              <motion.button className="btn-gradient text-xs" whileHover={{ scale: 1.03 }} onClick={() => setView('create')}>
                <Sparkles className="w-3.5 h-3.5" /> AI Generate
              </motion.button>
            </div>
          </div>
          <div className="border-t border-white/[0.06] pt-4 flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold">Tickets</span>
              <span className="text-xs font-bold text-white">{tickets.length}</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold">Got It</span>
              <span className="text-xs font-bold text-success-400">{gotItCount}</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold">Almost</span>
              <span className="text-xs font-bold text-warning-400">{almostCount}</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold">Needs Help</span>
              <span className="text-xs font-bold text-danger-400">{needsCount}</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold">Flagged</span>
              <span className="text-xs font-bold text-amber-400">{flagged.size}</span>
            </div>
          </div>
        </div>
      </FadeUp>

      {/* ── AI INSIGHTS ─── */}
      <FadeUp delay={0.04}>
        <div className="glass-card overflow-hidden">
          <button
            className="w-full flex items-center justify-between p-4 text-left"
            onClick={() => setAiOpen(v => !v)}
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-amber-500/15">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <span className="text-sm font-bold text-white">AI Exit Ticket Insights</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 font-medium">1 urgent</span>
            </div>
            <motion.div animate={{ rotate: aiOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="w-4 h-4 text-surface-400" />
            </motion.div>
          </button>
          <AnimatePresence initial={false}>
            {aiOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.28, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                  {AI_ALERTS.map((alert, i) => (
                    <motion.div
                      key={alert.title}
                      className="rounded-xl p-4"
                      style={{ background: alert.bg, border: `1px solid ${alert.color}25` }}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07 }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <alert.icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: alert.color }} />
                        <span className="text-xs font-bold text-white">{alert.title}</span>
                      </div>
                      <p className="text-[11px] text-surface-400 leading-relaxed mb-3">{alert.body}</p>
                      <button className="text-[11px] font-semibold flex items-center gap-1" style={{ color: alert.color }}>
                        {alert.action} <ArrowRight className="w-3 h-3" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </FadeUp>

      {/* ── QUICK STATS ─── */}
      <FadeUp delay={0.08}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Total Tickets', value: tickets.length.toString(), icon: Target, color: '#f59e0b', sub: 'this week' },
            { label: 'Avg Completion', value: '86%', icon: TrendingUp, color: '#10b981', sub: '↑ 4% vs last week' },
            { label: 'Avg Score', value: '78%', icon: BarChart2, color: '#6366f1', sub: 'class average' },
            { label: 'Need Follow-Up', value: flagged.size.toString(), icon: Flag, color: '#ef4444', sub: 'students flagged' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="glass-card p-4"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              whileHover={{ y: -2 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: stat.color + '18' }}>
                  <stat.icon className="w-3.5 h-3.5" style={{ color: stat.color }} />
                </div>
                <span className="text-xs text-surface-400">{stat.label}</span>
              </div>
              <p className="text-xl font-black text-white">{stat.value}</p>
              <p className="text-[10px] text-surface-500 mt-0.5">{stat.sub}</p>
            </motion.div>
          ))}
        </div>
      </FadeUp>

      {/* ── MAIN GRID ─── */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* TICKET LIST SIDEBAR */}
        <div className="xl:col-span-1 space-y-3">
          <FadeUp delay={0.12}>
            <h3 className="text-xs font-bold text-surface-400 uppercase tracking-wider px-1">Exit Tickets ({tickets.length})</h3>
          </FadeUp>
          <StaggerList>
            {tickets.map(ticket => {
              const sb = STATUS_BADGE[ticket.status]
              const isSelected = selectedTicket.id === ticket.id
              return (
                <StaggerItem key={ticket.id}>
                  <div className="relative">
                    <button
                      onClick={() => { setSelectedTicket(ticket); setView('overview') }}
                      className={`w-full text-left glass-card p-4 transition-all ${isSelected ? 'border-amber-500/40 bg-amber-500/5' : 'hover:border-white/10'}`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2 pr-5">
                        <div>
                          <p className="text-sm font-semibold text-white leading-tight">{ticket.title}</p>
                          <p className="text-xs text-surface-500 mt-0.5">{ticket.period}</p>
                        </div>
                        <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold flex-shrink-0 ${sb.bg} ${sb.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sb.dot} ${ticket.status === 'active' ? 'animate-pulse' : ''}`} />
                          {sb.label}
                        </span>
                      </div>
                      {ticket.status !== 'draft' && (
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[11px] text-surface-500">
                            <span>{ticket.responses}/{ticket.totalStudents} responses</span>
                            <span>{ticket.completionRate}%</span>
                          </div>
                          <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ background: 'linear-gradient(90deg, #f59e0b, #ef4444)' }}
                              initial={{ width: 0 }}
                              animate={{ width: `${ticket.completionRate}%` }}
                              transition={{ duration: 0.6, ease: 'easeOut' }}
                            />
                          </div>
                          <div className="text-[11px] text-surface-500">
                            {ticket.questions.length} questions · Avg {ticket.avgScore}%
                          </div>
                        </div>
                      )}
                      {ticket.status === 'draft' && (
                        <p className="text-[11px] text-surface-500">{ticket.questions.length} questions · Not yet sent</p>
                      )}
                    </button>
                    {/* Action menu */}
                    <div className="absolute top-3 right-3">
                      <button
                        onClick={e => { e.stopPropagation(); setActionMenu(actionMenu === ticket.id ? null : ticket.id) }}
                        className="p-1 rounded-lg hover:bg-white/[0.08] transition-colors"
                      >
                        <MoreVertical className="w-3.5 h-3.5 text-surface-500" />
                      </button>
                      <AnimatePresence>
                        {actionMenu === ticket.id && (
                          <motion.div
                            className="absolute right-0 top-6 z-20 glass-card py-1 min-w-[130px] shadow-xl"
                            initial={{ opacity: 0, scale: 0.92, y: -6 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.92, y: -6 }}
                            transition={{ duration: 0.15 }}
                          >
                            {[
                              { icon: Copy, label: 'Duplicate', action: () => { setActionMenu(null); showToast('Ticket duplicated!') } },
                              { icon: Share2, label: 'Share', action: () => { setActionMenu(null); showToast('Share link copied!') } },
                              { icon: Download, label: 'Export', action: () => { setActionMenu(null); setExportOpen(true) } },
                              { icon: Archive, label: 'Archive', action: () => { setActionMenu(null); showToast('Ticket archived') } },
                            ].map(item => (
                              <button
                                key={item.label}
                                onClick={item.action}
                                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-surface-300 hover:text-white hover:bg-white/[0.06] transition-colors"
                              >
                                <item.icon className="w-3.5 h-3.5" />
                                {item.label}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </StaggerItem>
              )
            })}
          </StaggerList>

          {/* Quick AI Generate */}
          <FadeInWhenVisible>
            <div className="glass-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-xs font-bold text-white">Quick Generate</span>
              </div>
              <p className="text-[11px] text-surface-500 mb-3">Type a topic for instant 3-question exit ticket</p>
              <input
                type="text"
                value={topic}
                onChange={e => setTopic(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleGenerate()}
                placeholder="e.g. Newton's Laws"
                className="w-full px-3 py-2 text-xs rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-surface-600 focus:outline-none focus:border-amber-500/40 mb-2"
              />
              <motion.button
                onClick={handleGenerate}
                disabled={generating || !topic.trim()}
                className="btn-gradient text-xs w-full disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                {generating
                  ? <><RefreshCw className="w-3 h-3 animate-spin" /> Generating…</>
                  : <><Sparkles className="w-3 h-3" /> Generate</>
                }
              </motion.button>
            </div>
          </FadeInWhenVisible>
        </div>

        {/* MAIN PANEL */}
        <div className="xl:col-span-3 space-y-4">
          {/* View Tabs */}
          <FadeUp delay={0.12}>
            <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06] w-fit">
              {(['overview', 'results', 'create'] as const).map(v => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${view === v ? 'bg-amber-500/20 text-amber-300' : 'text-surface-400 hover:text-surface-200'}`}
                >
                  {v === 'overview' ? 'Questions' : v === 'results' ? 'Results' : 'Create New'}
                </button>
              ))}
            </div>
          </FadeUp>

          {/* QUESTIONS VIEW */}
          <AnimatePresence mode="wait">
            {view === 'overview' && (
              <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                <FadeUp delay={0.14}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-base font-bold text-white">{selectedTicket.title}</h2>
                        <p className="text-xs text-surface-500">{selectedTicket.period} · {selectedTicket.topic}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedTicket.status === 'draft' && (
                          <motion.button className="btn-gradient text-xs" whileHover={{ scale: 1.03 }} onClick={handleSend}>
                            <Send className="w-3.5 h-3.5" /> Send to Class
                          </motion.button>
                        )}
                        {selectedTicket.status === 'active' && (
                          <motion.button className="btn-secondary text-xs px-3 py-1.5" whileHover={{ scale: 1.03 }}>
                            <Eye className="w-3.5 h-3.5" /> Live View
                          </motion.button>
                        )}
                        <button className="btn-secondary text-xs px-3 py-1.5" onClick={() => setExportOpen(true)}>
                          <Download className="w-3.5 h-3.5" /> Export
                        </button>
                      </div>
                    </div>

                    {/* Active response counter */}
                    {selectedTicket.status === 'active' && (
                      <motion.div
                        className="rounded-xl p-3 flex items-center gap-3"
                        style={{ background: '#10b98110', border: '1px solid #10b98125' }}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs text-emerald-400 font-semibold">
                          Live — {selectedTicket.responses} of {selectedTicket.totalStudents} students responded ({selectedTicket.completionRate}%)
                        </span>
                        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-emerald-400 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${selectedTicket.completionRate}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                          />
                        </div>
                      </motion.div>
                    )}

                    {selectedTicket.questions.map((q, i) => {
                      const tc = TYPE_CONFIG[q.type]
                      const isExpanded = expandedQuestion === q.id
                      const correctRate = Q_CORRECT_RATES[i] ?? 0
                      return (
                        <motion.div key={q.id} className="glass-card overflow-hidden" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                          <button
                            onClick={() => setExpandedQuestion(isExpanded ? null : q.id)}
                            className="w-full flex items-center gap-3 p-4 text-left"
                          >
                            <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-xs font-bold text-surface-400 flex-shrink-0">
                              {i + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-surface-200 truncate">{q.text}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <tc.icon className={`w-3 h-3 ${tc.color}`} />
                                <span className={`text-[10px] font-medium ${tc.color}`}>{tc.label}</span>
                                {selectedTicket.status === 'completed' && (
                                  <span className="text-[10px] text-surface-500">{correctRate}% correct</span>
                                )}
                              </div>
                            </div>
                            {selectedTicket.status === 'completed' && (
                              <div className="flex items-center gap-2 mr-2">
                                <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                  <div className="h-full rounded-full" style={{ width: `${correctRate}%`, backgroundColor: correctRate >= 80 ? '#10b981' : correctRate >= 60 ? '#f59e0b' : '#ef4444' }} />
                                </div>
                                <span className="text-[10px] font-semibold" style={{ color: correctRate >= 80 ? '#10b981' : correctRate >= 60 ? '#f59e0b' : '#ef4444' }}>{correctRate}%</span>
                              </div>
                            )}
                            <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                              <ChevronDown className="w-4 h-4 text-surface-500 flex-shrink-0" />
                            </motion.div>
                          </button>
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="border-t border-white/[0.06] overflow-hidden"
                              >
                                <div className="p-4">
                                  {q.type === 'multiple-choice' && q.choices && (
                                    <div className="space-y-2">
                                      {q.choices.map(c => (
                                        <div key={c.id} className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border text-xs ${c.correct ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-300' : 'border-white/[0.06] bg-white/[0.02] text-surface-400'}`}>
                                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 text-[10px] font-bold ${c.correct ? 'border-emerald-500/50 bg-emerald-500/20 text-emerald-400' : 'border-white/10 text-surface-500'}`}>
                                            {c.id.toUpperCase()}
                                          </div>
                                          {c.text}
                                          {c.correct && <CheckCircle className="w-3 h-3 text-emerald-400 ml-auto" />}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                  {q.type === 'thumbs' && (
                                    <div className="flex gap-3">
                                      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                                        <ThumbsUp className="w-4 h-4" /> I got it
                                      </div>
                                      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
                                        <ThumbsDown className="w-4 h-4" /> Not yet
                                      </div>
                                    </div>
                                  )}
                                  {q.type === 'traffic-light' && (
                                    <div className="flex gap-4">
                                      {[{ color: '#10b981', label: 'Got it!' }, { color: '#f59e0b', label: 'Almost' }, { color: '#ef4444', label: 'Need help' }].map(l => (
                                        <div key={l.label} className="flex flex-col items-center gap-2">
                                          <div className="w-10 h-10 rounded-full" style={{ background: l.color, boxShadow: `0 0 16px ${l.color}50` }} />
                                          <span className="text-[10px] text-surface-400">{l.label}</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                  {q.type === 'rating' && (
                                    <div className="flex gap-2">
                                      {[1,2,3,4,5].map(n => (
                                        <div key={n} className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-sm font-bold text-surface-400">
                                          {n}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                  {q.type === 'short-answer' && (
                                    <div className="px-3 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs text-surface-500 italic min-h-[48px]">
                                      Student typed response area…
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      )
                    })}

                    <motion.button
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-white/[0.08] text-surface-500 hover:border-amber-500/30 hover:text-amber-400 transition-all text-sm"
                      whileHover={{ scale: 1.01 }}
                      onClick={() => showToast('Question added!')}
                    >
                      <Plus className="w-4 h-4" /> Add Question
                    </motion.button>
                  </div>
                </FadeUp>
              </motion.div>
            )}

            {/* RESULTS VIEW */}
            {view === 'results' && (
              <motion.div key="results" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                <div className="space-y-4">
                  {/* Distribution */}
                  <div className="glass-card p-5">
                    <h3 className="text-sm font-bold text-white mb-4">Class Understanding</h3>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      {[
                        { label: 'Got It',    count: gotItCount,  pct: Math.round(gotItCount/STUDENT_RESULTS.length*100),  color: '#10b981' },
                        { label: 'Almost',    count: almostCount, pct: Math.round(almostCount/STUDENT_RESULTS.length*100), color: '#f59e0b' },
                        { label: 'Needs Help',count: needsCount,  pct: Math.round(needsCount/STUDENT_RESULTS.length*100),  color: '#ef4444' },
                      ].map((d, i) => (
                        <motion.div key={d.label} className="text-center" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                          <div className="text-2xl font-black mb-0.5" style={{ color: d.color }}>{d.count}</div>
                          <div className="text-xs font-semibold text-surface-300">{d.label}</div>
                          <div className="text-[11px] text-surface-500">{d.pct}%</div>
                        </motion.div>
                      ))}
                    </div>
                    <div className="h-3 rounded-full overflow-hidden flex gap-0.5">
                      {[
                        { pct: Math.round(gotItCount/STUDENT_RESULTS.length*100), color: '#10b981' },
                        { pct: Math.round(almostCount/STUDENT_RESULTS.length*100), color: '#f59e0b' },
                        { pct: Math.round(needsCount/STUDENT_RESULTS.length*100), color: '#ef4444' },
                      ].map((seg, i) => (
                        <motion.div
                          key={i}
                          className="h-full rounded-full"
                          style={{ backgroundColor: seg.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${seg.pct}%` }}
                          transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Per-Question Breakdown */}
                  <div className="glass-card p-5">
                    <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-amber-400" />
                      Question Correctness
                    </h3>
                    {(() => {
                      const rows = selectedTicket.questions.map((q, i) => {
                        const rate = Q_CORRECT_RATES[i] ?? 0
                        const color = rate >= 80 ? '#10b981' : rate >= 60 ? '#f59e0b' : '#ef4444'
                        return { label: `Q${i + 1}: ${q.text}`, rate, color }
                      })
                      const W = 340, LW = 130, CW = 32, GAP = 6, ROW = 14, BAR_MAX = W - LW - CW - 6
                      const H = rows.length * (ROW + GAP) - GAP
                      return (
                        <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible">
                          <defs>
                            {rows.map((r, i) => (
                              <linearGradient key={i} id={`et-q-${i}`} x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor={r.color} stopOpacity={0.9} />
                                <stop offset="100%" stopColor={r.color} stopOpacity={0.5} />
                              </linearGradient>
                            ))}
                          </defs>
                          {rows.map((r, i) => {
                            const bw = (r.rate / 100) * BAR_MAX
                            const y = i * (ROW + GAP)
                            return (
                              <g key={r.label}>
                                <text x={0} y={y + 11} fill="rgba(255,255,255,0.5)" fontSize={9} fontFamily="inherit">
                                  {r.label.length > 18 ? r.label.slice(0, 17) + '…' : r.label}
                                </text>
                                <rect x={LW} y={y + 2} width={BAR_MAX} height={10} rx={3} fill="rgba(255,255,255,0.04)" />
                                <motion.rect x={LW} y={y + 2} height={10} rx={3} fill={`url(#et-q-${i})`}
                                  initial={{ width: 0 }} animate={{ width: bw }}
                                  transition={{ delay: 0.2 + i * 0.08, duration: 0.5, ease: 'easeOut' }}
                                />
                                <text x={LW + BAR_MAX + 5} y={y + 11} fill={r.color} fontSize={9} fontFamily="inherit" fontWeight="bold">{r.rate}%</text>
                              </g>
                            )
                          })}
                        </svg>
                      )
                    })()}
                  </div>

                  {/* AI Suggestions */}
                  <div className="glass-card p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Brain className="w-4 h-4 text-accent-400" />
                      <span className="text-sm font-bold text-white">AI Reteach Suggestions</span>
                    </div>
                    <ul className="space-y-2">
                      {[
                        { text: '4 students confused about cell organelle functions — consider an organelle sorting activity', icon: AlertCircle, color: '#ef4444' },
                        { text: 'Most students understand basics but struggle with light-dependent vs. independent reactions', icon: Brain, color: '#f59e0b' },
                        { text: 'Sofia, James need 1:1 or small group support before the unit assessment', icon: Users, color: '#6366f1' },
                      ].map((tip, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs text-surface-400">
                          <tip.icon className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: tip.color }} />
                          {tip.text}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Student List */}
                  <div className="glass-card overflow-hidden">
                    <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
                      <h3 className="text-sm font-bold text-white">Student Responses</h3>
                      <span className="text-xs text-surface-500">{STUDENT_RESULTS.length} students</span>
                    </div>
                    <div className="divide-y divide-white/[0.04]">
                      {STUDENT_RESULTS.map(s => {
                        const sc = STUDENT_STATUS[s.status]
                        const isFlagged = flagged.has(s.name)
                        return (
                          <motion.div
                            key={s.name}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors"
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                          >
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0" style={{ background: s.color }}>
                              {s.initials}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-white">{s.name}</p>
                              <p className="text-xs text-surface-500 truncate">{s.answers[2]}</p>
                            </div>
                            <div className="text-sm font-bold text-white">{s.score}%</div>
                            <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${sc.bg} ${sc.text}`}>
                              <sc.icon className="w-3 h-3" />{sc.label}
                            </span>
                            <motion.button
                              onClick={() => toggleFlag(s.name)}
                              className="p-1.5 rounded-lg transition-colors"
                              style={{ backgroundColor: isFlagged ? '#ef444418' : 'rgba(255,255,255,0.04)' }}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              title={isFlagged ? 'Unflag' : 'Flag for follow-up'}
                            >
                              <Flag className="w-3.5 h-3.5" style={{ color: isFlagged ? '#ef4444' : '#475569' }} />
                            </motion.button>
                          </motion.div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* CREATE VIEW */}
            {view === 'create' && (
              <motion.div key="create" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                <div className="glass-card p-5 space-y-4">
                  <h3 className="text-sm font-bold text-white">Create New Exit Ticket</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-surface-500 block mb-1">Title</label>
                      <input className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white placeholder-surface-600 focus:outline-none focus:border-amber-500/40" placeholder="e.g. Photosynthesis Check" />
                    </div>
                    <div>
                      <label className="text-[10px] text-surface-500 block mb-1">Period</label>
                      <select className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/40" style={{ backgroundColor: 'rgba(15,15,35,0.6)' }}>
                        {['Period 1', 'Period 2', 'Period 3', 'Period 4', 'Period 5', 'Period 6'].map(p => (
                          <option key={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-surface-500 block mb-2">Question Types</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {NEW_QN_TYPES.map(qt => (
                        <motion.button
                          key={qt.type}
                          onClick={() => setNewQType(newQType === qt.type ? null : qt.type)}
                          className="flex items-center gap-3 p-3 rounded-xl text-left transition-all"
                          style={{
                            background: newQType === qt.type ? qt.color + '12' : 'rgba(255,255,255,0.03)',
                            border: `1px solid ${newQType === qt.type ? qt.color + '30' : 'rgba(255,255,255,0.06)'}`,
                          }}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: qt.color + '18' }}>
                            <qt.icon className="w-3.5 h-3.5" style={{ color: qt.color }} />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-white">{qt.label}</p>
                            <p className="text-[10px] text-surface-500">{qt.desc}</p>
                          </div>
                          {newQType === qt.type && <Check className="w-4 h-4 ml-auto" style={{ color: qt.color }} />}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button onClick={() => setView('overview')} className="flex-1 btn-secondary text-xs py-2">Cancel</button>
                    <motion.button
                      className="flex-1 btn-gradient text-xs py-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => { showToast('New exit ticket created!'); setView('overview') }}
                    >
                      <Plus className="w-3.5 h-3.5" /> Create Ticket
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── PERIOD SCORE SUMMARY ─── */}
      <FadeInWhenVisible>
        <div className="glass-card p-5">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-amber-400" />
            Today's Period Score Summary
          </h3>
          {(() => {
            const W = 560, H = 110, PX = 20, PY = 14
            const barW = (W - PX * 2 - (PERIOD_SCORES.length - 1) * 10) / PERIOD_SCORES.length
            const baseY = H - PY
            const maxBar = baseY - PY
            const barColor = (s: number) => s >= 80 ? '#10b981' : s >= 65 ? '#f59e0b' : s > 0 ? '#ef4444' : 'rgba(255,255,255,0.06)'
            const gradId = (i: number) => `et-bar-${i}`
            return (
              <svg viewBox={`0 0 ${W} ${H}`} className="w-full mb-2" style={{ height: H }}>
                <defs>
                  {PERIOD_SCORES.map((s, i) => (
                    <linearGradient key={i} id={gradId(i)} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={barColor(s)} stopOpacity="0.95" />
                      <stop offset="100%" stopColor={barColor(s)} stopOpacity="0.5" />
                    </linearGradient>
                  ))}
                </defs>
                {[50, 65, 80, 100].map(g => (
                  <line key={g} x1={PX} y1={baseY - (g / 100) * maxBar} x2={W - PX} y2={baseY - (g / 100) * maxBar}
                    stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                ))}
                {PERIOD_SCORES.map((score, i) => {
                  const x = PX + i * (barW + 10)
                  const bh = score > 0 ? (score / 100) * maxBar : 3
                  return (
                    <g key={i}>
                      <rect x={x} y={baseY - bh} width={barW} height={bh} rx="3" fill="rgba(255,255,255,0.04)" />
                      <motion.rect x={x} y={baseY} width={barW} height={0} rx="3" fill={`url(#${gradId(i)})`}
                        animate={{ y: baseY - bh, height: bh }}
                        initial={{ y: baseY, height: 0 }}
                        transition={{ delay: 0.25 + i * 0.07, duration: 0.55, ease: 'easeOut' }}
                        style={{ transformOrigin: `${x + barW / 2}px ${baseY}px` }}
                      />
                      {score > 0 && <text x={x + barW / 2} y={baseY - bh - 4} textAnchor="middle" fill={barColor(score)} fontSize="9" fontWeight="700">{score}%</text>}
                      <text x={x + barW / 2} y={H - 1} textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="9">{PERIOD_LABELS[i]}</text>
                    </g>
                  )
                })}
              </svg>
            )
          })()}
          <div className="flex gap-4 text-[10px] text-surface-500">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-emerald-500 inline-block" /> ≥80% On Track</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-amber-500 inline-block" /> 65–79% Monitor</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-red-500 inline-block" /> &lt;65% Reteach</span>
          </div>
        </div>
      </FadeInWhenVisible>

      {/* ── EXPORT MODAL ─── */}
      <AnimatePresence>
        {exportOpen && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setExportOpen(false)} />
            <motion.div
              className="relative glass-card p-6 w-full max-w-sm"
              initial={{ scale: 0.93, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.93, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-bold text-white">Export Results</h3>
                <button onClick={() => setExportOpen(false)} className="p-1.5 rounded-lg hover:bg-white/[0.08] transition-colors">
                  <X className="w-4 h-4 text-surface-400" />
                </button>
              </div>
              <div className="space-y-2">
                {[
                  { label: 'Results PDF', icon: Download, desc: 'Full class results formatted report' },
                  { label: 'CSV Gradebook', icon: BarChart2, desc: 'Student scores for gradebook import' },
                  { label: 'Google Sheets', icon: ExternalLink, desc: 'Export directly to your Drive' },
                  { label: 'Copy Summary', icon: Copy, desc: 'Plain text class summary' },
                ].map(opt => (
                  <motion.button
                    key={opt.label}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.07] transition-colors text-left"
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { showToast(`Exported: ${opt.label}`); setExportOpen(false) }}
                  >
                    <div className="w-7 h-7 rounded-lg bg-amber-500/15 flex items-center justify-center flex-shrink-0">
                      <opt.icon className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">{opt.label}</p>
                      <p className="text-[10px] text-surface-500">{opt.desc}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
