'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FadeUp, StaggerList, StaggerItem } from '@/components/ui/motion'
import {
  Target, Sparkles, Plus, Send, CheckCircle, XCircle, Clock,
  Users, BarChart2, TrendingUp, AlertCircle, ChevronDown,
  ChevronRight, ThumbsUp, ThumbsDown, Minus, RefreshCw,
  Download, Eye, Zap, Brain, BookOpen, Star
} from 'lucide-react'

type QuestionType = 'multiple-choice' | 'thumbs' | 'traffic-light' | 'rating' | 'short-answer'
type Status = 'draft' | 'active' | 'completed'

interface Choice { id: string; text: string; correct?: boolean }
interface Question {
  id: string
  type: QuestionType
  text: string
  choices?: Choice[]
}

interface ExitTicket {
  id: string
  title: string
  topic: string
  period: string
  status: Status
  questions: Question[]
  responses: number
  totalStudents: number
  completionRate: number
  avgScore: number
  createdAt: string
}

interface StudentResult {
  name: string; initials: string; color: string
  score: number; status: 'got-it' | 'almost' | 'needs-help'
  answers: string[]
}

const typeConfig: Record<QuestionType, { label: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
  'multiple-choice': { label: 'Multiple Choice', icon: CheckCircle, color: 'text-accent-400' },
  'thumbs':          { label: 'Thumbs Up/Down',  icon: ThumbsUp,    color: 'text-success-400' },
  'traffic-light':   { label: 'Traffic Light',   icon: AlertCircle, color: 'text-warning-400' },
  'rating':          { label: 'Rating Scale',    icon: Star,        color: 'text-electric-400' },
  'short-answer':    { label: 'Short Answer',    icon: BookOpen,    color: 'text-neon-400' },
}

const sampleTickets: ExitTicket[] = [
  {
    id: 'et1',
    title: 'Photosynthesis Check',
    topic: 'Cell Biology',
    period: 'Period 2 – Biology',
    status: 'completed',
    responses: 24,
    totalStudents: 28,
    completionRate: 86,
    avgScore: 78,
    createdAt: '2026-07-30',
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
    id: 'et2',
    title: 'Mitosis Quick Check',
    topic: 'Cell Division',
    period: 'Period 4 – Biology',
    status: 'active',
    responses: 12,
    totalStudents: 26,
    completionRate: 46,
    avgScore: 82,
    createdAt: '2026-07-31',
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
    id: 'et3',
    title: 'Ecosystem Energy Flow',
    topic: 'Ecology',
    period: 'Period 6 – Biology',
    status: 'draft',
    responses: 0,
    totalStudents: 24,
    completionRate: 0,
    avgScore: 0,
    createdAt: '2026-07-31',
    questions: [
      { id: 'q1', type: 'multiple-choice', text: 'Which trophic level contains the most energy?', choices: [
        { id: 'a', text: 'Primary Consumers' }, { id: 'b', text: 'Secondary Consumers' },
        { id: 'c', text: 'Producers', correct: true }, { id: 'd', text: 'Decomposers' }
      ]},
      { id: 'q2', type: 'thumbs', text: 'I can explain the 10% energy rule between trophic levels.' },
    ]
  },
]

const studentResults: StudentResult[] = [
  { name: 'Emma Johnson',   initials: 'EJ', color: '#6366f1', score: 95, status: 'got-it',    answers: ['Chloroplast', 'Yes', 'Calvin cycle uses CO2 to make glucose'] },
  { name: 'Marcus Chen',    initials: 'MC', color: '#22d3ee', score: 80, status: 'almost',    answers: ['Chloroplast', 'No',  'It uses light energy somehow'] },
  { name: 'Sofia Rodriguez', initials: 'SR', color: '#10b981', score: 40, status: 'needs-help', answers: ['Nucleus',     'No',  'I\'m not sure what it does'] },
  { name: 'Aiden Park',     initials: 'AP', color: '#f59e0b', score: 85, status: 'got-it',    answers: ['Chloroplast', 'Yes', 'Fixes carbon dioxide into sugar'] },
  { name: 'Lily Turner',    initials: 'LT', color: '#8b5cf6', score: 60, status: 'almost',    answers: ['Mitochondria', 'Yes', 'Makes oxygen and glucose'] },
  { name: 'James Kim',      initials: 'JK', color: '#ef4444', score: 35, status: 'needs-help', answers: ['Ribosome',    'No',  'I forgot'] },
]

const statusBadge: Record<Status, { bg: string; text: string; label: string; dot: string }> = {
  draft:     { bg: 'bg-surface-700/50', text: 'text-surface-400', label: 'Draft',     dot: 'bg-surface-500' },
  active:    { bg: 'bg-success-500/10', text: 'text-success-400', label: 'Active',    dot: 'bg-success-400' },
  completed: { bg: 'bg-accent-500/10',  text: 'text-accent-400',  label: 'Completed', dot: 'bg-accent-400' },
}

const studentStatusConfig = {
  'got-it':    { bg: 'bg-success-500/10', text: 'text-success-400', label: 'Got It',      icon: ThumbsUp },
  'almost':    { bg: 'bg-warning-500/10', text: 'text-warning-400', label: 'Almost',      icon: Minus },
  'needs-help':{ bg: 'bg-danger-500/10',  text: 'text-danger-400',  label: 'Needs Help',  icon: ThumbsDown },
}

export default function ExitTicketsPage() {
  const [selectedTicket, setSelectedTicket] = useState<ExitTicket>(sampleTickets[0])
  const [view, setView] = useState<'overview' | 'results' | 'create'>('overview')
  const [topic, setTopic] = useState('')
  const [generating, setGenerating] = useState(false)
  const [period, setPeriod] = useState('Period 2 – Biology')
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>('q1')

  const gotItCount   = studentResults.filter(s => s.status === 'got-it').length
  const almostCount  = studentResults.filter(s => s.status === 'almost').length
  const needsCount   = studentResults.filter(s => s.status === 'needs-help').length

  async function handleGenerate() {
    if (!topic.trim()) return
    setGenerating(true)
    await new Promise(r => setTimeout(r, 2000))
    setGenerating(false)
    setView('overview')
  }

  return (
    <div className="p-6 space-y-6 max-w-[1600px]">
      {/* Header */}
      <FadeUp>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}>
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-surface-100">Exit Tickets</h1>
                <p className="text-sm text-surface-500">Quick formative assessments to gauge lesson comprehension</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setView('create')} className="btn-gradient text-sm px-4 py-2">
              <Sparkles className="w-4 h-4" />
              AI Generate
            </button>
            <button className="btn-secondary text-sm px-4 py-2">
              <Plus className="w-4 h-4" />
              New Ticket
            </button>
          </div>
        </div>
      </FadeUp>

      {/* Stats Row */}
      <FadeUp delay={0.05}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Tickets',   value: '3',   sub: 'this week',  icon: Target,    color: '#f59e0b' },
            { label: 'Avg Completion',  value: '86%', sub: '↑ 4% vs last week', icon: TrendingUp, color: '#10b981' },
            { label: 'Avg Score',       value: '78%', sub: 'class average', icon: BarChart2, color: '#6366f1' },
            { label: 'Need Follow-Up',  value: '4',   sub: 'students flagged', icon: AlertCircle, color: '#ef4444' },
          ].map(s => (
            <div key={s.label} className="glass-card p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${s.color}20` }}>
                  <s.icon className="w-4 h-4" style={{ color: s.color }} />
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-0.5">{s.value}</div>
              <div className="text-xs text-surface-500">{s.label}</div>
              <div className="text-[11px] text-surface-600 mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>
      </FadeUp>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Ticket List */}
        <div className="xl:col-span-1 space-y-3">
          <FadeUp delay={0.1}>
            <h3 className="text-sm font-semibold text-surface-300 px-1">Recent Exit Tickets</h3>
          </FadeUp>
          <StaggerList>
            {sampleTickets.map(ticket => {
              const sb = statusBadge[ticket.status]
              const isSelected = selectedTicket.id === ticket.id
              return (
                <StaggerItem key={ticket.id}>
                  <button
                    onClick={() => { setSelectedTicket(ticket); setView('overview') }}
                    className={`w-full text-left glass-card p-4 transition-all ${isSelected ? 'border-accent-500/40 bg-accent-500/5' : 'hover:border-white/10'}`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <p className="text-sm font-semibold text-surface-100">{ticket.title}</p>
                        <p className="text-xs text-surface-500 mt-0.5">{ticket.period}</p>
                      </div>
                      <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${sb.bg} ${sb.text}`}>
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
                            className="h-full rounded-full bg-gradient-to-r from-accent-500 to-electric-400"
                            initial={{ width: 0 }}
                            animate={{ width: `${ticket.completionRate}%` }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                          />
                        </div>
                        <div className="text-[11px] text-surface-500">{ticket.questions.length} questions • Avg {ticket.avgScore}%</div>
                      </div>
                    )}
                    {ticket.status === 'draft' && (
                      <p className="text-[11px] text-surface-500">{ticket.questions.length} questions ready • Not yet sent</p>
                    )}
                  </button>
                </StaggerItem>
              )
            })}
          </StaggerList>

          {/* AI Quick Generate */}
          <FadeUp delay={0.3}>
            <div className="glass-card p-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-warning-500/5 via-transparent to-transparent" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-4 h-4 text-warning-400" />
                  <span className="text-sm font-semibold text-surface-200">Quick AI Generate</span>
                </div>
                <p className="text-xs text-surface-500 mb-3">Type a topic and get 3 exit ticket questions instantly</p>
                <input
                  type="text"
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  placeholder="e.g. Newton's Laws of Motion"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white/[0.04] border border-white/[0.08] text-surface-200 placeholder:text-surface-600 focus:outline-none focus:border-accent-500/40 mb-2"
                />
                <button
                  onClick={handleGenerate}
                  disabled={generating || !topic.trim()}
                  className="btn-gradient text-xs px-3 py-1.5 w-full justify-center disabled:opacity-50"
                >
                  {generating ? <><RefreshCw className="w-3 h-3 animate-spin" />Generating…</> : <><Sparkles className="w-3 h-3" />Generate Questions</>}
                </button>
              </div>
            </div>
          </FadeUp>
        </div>

        {/* Main Panel */}
        <div className="xl:col-span-2 space-y-4">
          {/* Tabs */}
          <FadeUp delay={0.1}>
            <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06] w-fit">
              {(['overview', 'results'] as const).map(v => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${view === v ? 'bg-accent-500/20 text-accent-300' : 'text-surface-400 hover:text-surface-200'}`}
                >
                  {v === 'overview' ? 'Questions' : 'Results'}
                </button>
              ))}
            </div>
          </FadeUp>

          {view === 'overview' && (
            <FadeUp delay={0.15}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-surface-100">{selectedTicket.title}</h2>
                    <p className="text-xs text-surface-500">{selectedTicket.period} · {selectedTicket.topic}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedTicket.status === 'draft' && (
                      <button className="btn-gradient text-xs px-3 py-1.5">
                        <Send className="w-3.5 h-3.5" />
                        Send to Class
                      </button>
                    )}
                    {selectedTicket.status === 'active' && (
                      <button className="btn-secondary text-xs px-3 py-1.5">
                        <Eye className="w-3.5 h-3.5" />
                        Live View
                      </button>
                    )}
                    <button className="btn-secondary text-xs px-3 py-1.5">
                      <Download className="w-3.5 h-3.5" />
                      Export
                    </button>
                  </div>
                </div>

                {selectedTicket.questions.map((q, i) => {
                  const tc = typeConfig[q.type]
                  const isExpanded = expandedQuestion === q.id
                  return (
                    <motion.div key={q.id} className="glass-card overflow-hidden">
                      <button
                        onClick={() => setExpandedQuestion(isExpanded ? null : q.id)}
                        className="w-full flex items-center gap-3 p-4 text-left"
                      >
                        <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-xs font-bold text-surface-400 flex-shrink-0">
                          {i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-surface-200 truncate">{q.text}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <tc.icon className={`w-3 h-3 ${tc.color}`} />
                            <span className={`text-[10px] font-medium ${tc.color}`}>{tc.label}</span>
                          </div>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-surface-500 transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="border-t border-white/[0.06]"
                          >
                            <div className="p-4 pt-3">
                              {q.type === 'multiple-choice' && q.choices && (
                                <div className="space-y-2">
                                  {q.choices.map(c => (
                                    <div key={c.id} className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border text-xs ${c.correct ? 'border-success-500/30 bg-success-500/5 text-success-300' : 'border-white/[0.06] bg-white/[0.02] text-surface-400'}`}>
                                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 text-[10px] font-bold ${c.correct ? 'border-success-500/50 bg-success-500/20 text-success-400' : 'border-white/[0.10] text-surface-500'}`}>
                                        {c.id.toUpperCase()}
                                      </div>
                                      {c.text}
                                      {c.correct && <CheckCircle className="w-3 h-3 text-success-400 ml-auto" />}
                                    </div>
                                  ))}
                                </div>
                              )}
                              {q.type === 'thumbs' && (
                                <div className="flex gap-3">
                                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-success-500/10 border border-success-500/20 text-success-400 text-xs font-medium">
                                    <ThumbsUp className="w-4 h-4" /> I got it
                                  </div>
                                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-danger-500/10 border border-danger-500/20 text-danger-400 text-xs font-medium">
                                    <ThumbsDown className="w-4 h-4" /> Not yet
                                  </div>
                                </div>
                              )}
                              {q.type === 'traffic-light' && (
                                <div className="flex gap-3">
                                  {[{ color: '#10b981', label: 'Got it!' }, { color: '#f59e0b', label: 'Almost' }, { color: '#ef4444', label: 'Need help' }].map(l => (
                                    <div key={l.label} className="flex flex-col items-center gap-1.5">
                                      <div className="w-8 h-8 rounded-full" style={{ background: l.color, boxShadow: `0 0 12px ${l.color}40` }} />
                                      <span className="text-[10px] text-surface-400">{l.label}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {q.type === 'rating' && (
                                <div className="flex gap-2">
                                  {[1, 2, 3, 4, 5].map(n => (
                                    <div key={n} className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-sm font-bold text-surface-400">
                                      {n}
                                    </div>
                                  ))}
                                </div>
                              )}
                              {q.type === 'short-answer' && (
                                <div className="px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs text-surface-500 italic min-h-[48px]">
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

                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border-2 border-dashed border-white/[0.08] text-surface-500 hover:border-accent-500/30 hover:text-accent-400 transition-all text-sm">
                  <Plus className="w-4 h-4" />
                  Add Question
                </button>
              </div>
            </FadeUp>
          )}

          {view === 'results' && (
            <FadeUp delay={0.15}>
              <div className="space-y-4">
                {/* Distribution */}
                <div className="glass-card p-5">
                  <h3 className="text-sm font-semibold text-surface-200 mb-4">Class Understanding Distribution</h3>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {[
                      { label: 'Got It',    count: gotItCount,  pct: Math.round(gotItCount/studentResults.length*100),  color: '#10b981' },
                      { label: 'Almost',    count: almostCount, pct: Math.round(almostCount/studentResults.length*100), color: '#f59e0b' },
                      { label: 'Needs Help',count: needsCount,  pct: Math.round(needsCount/studentResults.length*100),  color: '#ef4444' },
                    ].map(d => (
                      <div key={d.label} className="text-center">
                        <div className="text-2xl font-bold mb-0.5" style={{ color: d.color }}>{d.count}</div>
                        <div className="text-xs text-surface-500">{d.label}</div>
                        <div className="text-[11px] text-surface-600">{d.pct}%</div>
                      </div>
                    ))}
                  </div>
                  <div className="h-2.5 rounded-full overflow-hidden flex">
                    <div className="h-full bg-success-500" style={{ width: `${Math.round(gotItCount/studentResults.length*100)}%` }} />
                    <div className="h-full bg-warning-500" style={{ width: `${Math.round(almostCount/studentResults.length*100)}%` }} />
                    <div className="h-full bg-danger-500" style={{ width: `${Math.round(needsCount/studentResults.length*100)}%` }} />
                  </div>
                </div>

                {/* AI Insights */}
                <div className="glass-card p-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent-600/5 to-transparent" />
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-3">
                      <Brain className="w-4 h-4 text-accent-400" />
                      <span className="text-sm font-semibold text-surface-200">AI Reteach Suggestions</span>
                    </div>
                    <ul className="space-y-2">
                      {[
                        { text: '4 students confused about cell organelle functions — consider a quick organelle sorting activity', icon: AlertCircle, color: '#ef4444' },
                        { text: 'Most students understand the basics but struggle with light-dependent vs. independent reactions', icon: Brain, color: '#f59e0b' },
                        { text: 'Sofia, James need 1:1 or small group support before the unit assessment', icon: Users, color: '#6366f1' },
                      ].map((tip, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs text-surface-400">
                          <tip.icon className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: tip.color }} />
                          {tip.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Student List */}
                <div className="glass-card overflow-hidden">
                  <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-surface-200">Student Responses</h3>
                    <span className="text-xs text-surface-500">{studentResults.length} students</span>
                  </div>
                  <div className="divide-y divide-white/[0.04]">
                    {studentResults.map(s => {
                      const sc = studentStatusConfig[s.status]
                      return (
                        <div key={s.name} className="flex items-center gap-3 px-4 py-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0" style={{ background: s.color }}>
                            {s.initials}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-surface-200">{s.name}</p>
                            <p className="text-xs text-surface-500 truncate">{s.answers[2]}</p>
                          </div>
                          <div className="text-sm font-bold text-surface-200">{s.score}%</div>
                          <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${sc.bg} ${sc.text}`}>
                            <sc.icon className="w-3 h-3" />
                            {sc.label}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </FadeUp>
          )}
        </div>
      </div>

      {/* Periods Quick Summary */}
      <FadeUp delay={0.4}>
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-surface-200">Today's Period Summary</h3>
            <button className="text-xs text-accent-400 hover:text-accent-300">View All →</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { period: 'Period 1', status: 'completed', score: 82, students: 24, icon: CheckCircle, color: '#10b981' },
              { period: 'Period 2', status: 'completed', score: 78, students: 28, icon: CheckCircle, color: '#10b981' },
              { period: 'Period 3', status: 'active',    score: 65, students: 22, icon: Clock,       color: '#f59e0b' },
              { period: 'Period 4', status: 'active',    score: 82, students: 26, icon: Clock,       color: '#f59e0b' },
            ].map(p => (
              <div key={p.period} className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-surface-300">{p.period}</span>
                  <p.icon className="w-3.5 h-3.5" style={{ color: p.color }} />
                </div>
                <div className="text-lg font-bold text-white">{p.score}%</div>
                <div className="text-[11px] text-surface-500 mt-0.5">{p.students} students</div>
              </div>
            ))}
          </div>
        </div>
      </FadeUp>
    </div>
  )
}
