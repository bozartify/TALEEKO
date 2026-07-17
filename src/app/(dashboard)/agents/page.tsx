'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bot, Zap, CheckCircle2, XCircle, Clock, Cpu, Activity, ShieldCheck,
  Play, Pause, GitBranch, Layers, Sparkles, AlertCircle, ArrowRight,
  Users, BookOpen, ClipboardList, MessageSquare, Target, Gauge
} from 'lucide-react'
import { FadeUp, StaggerList, StaggerItem, fadeUp } from '@/components/ui/motion'

type AgentStatus = 'running' | 'idle' | 'awaiting' | 'paused'
type Autonomy = 'supervised' | 'semi' | 'autonomous'

interface Agent {
  id: string
  name: string
  role: string
  icon: React.ElementType
  color: string
  bg: string
  status: AgentStatus
  task: string
  progress: number
  autonomy: Autonomy
  tasksDone: number
}

const INITIAL_AGENTS: Agent[] = [
  { id: 'a1', name: 'Curriculum Architect', role: 'Vertical · Planning',    icon: Layers,        color: '#8b5cf6', bg: 'bg-brand-100 text-brand-600',     status: 'running',  task: 'Mapping 7th-grade biology unit to NGSS standards', progress: 72, autonomy: 'autonomous', tasksDone: 148 },
  { id: 'a2', name: 'Assessment Engine',    role: 'Vertical · Evaluation',  icon: ClipboardList, color: '#f97316', bg: 'bg-orange-100 text-orange-600',   status: 'running',  task: 'Generating differentiated quiz variants (3 tiers)', progress: 45, autonomy: 'semi',       tasksDone: 92 },
  { id: 'a3', name: 'Grading Assistant',    role: 'Horizontal · Feedback',  icon: CheckCircle2,  color: '#14b8a6', bg: 'bg-emerald-100 text-emerald-600', status: 'awaiting', task: 'Batch-graded 28 essays — needs human sign-off',     progress: 100, autonomy: 'supervised', tasksDone: 310 },
  { id: 'a4', name: 'Differentiation Spec', role: 'Horizontal · Access',    icon: Target,        color: '#f43f5e', bg: 'bg-rose-100 text-rose-600',       status: 'running',  task: 'Adapting materials for 4 IEP profiles',            progress: 60, autonomy: 'semi',       tasksDone: 67 },
  { id: 'a5', name: 'Parent Comms Agent',   role: 'Horizontal · Outreach',  icon: MessageSquare, color: '#0ea5e9', bg: 'bg-sky-100 text-sky-600',         status: 'awaiting', task: 'Drafted 12 progress emails — awaiting approval',    progress: 100, autonomy: 'supervised', tasksDone: 204 },
  { id: 'a6', name: 'Standards Aligner',    role: 'Vertical · Compliance',  icon: ShieldCheck,   color: '#a855f7', bg: 'bg-purple-100 text-purple-600',   status: 'idle',     task: 'Idle — waiting for new lesson input',              progress: 0,   autonomy: 'autonomous', tasksDone: 51 },
]

interface Approval {
  id: string
  agent: string
  action: string
  detail: string
  risk: 'low' | 'medium' | 'high'
}

const INITIAL_APPROVALS: Approval[] = [
  { id: 'p1', agent: 'Grading Assistant',  action: 'Publish 28 graded essays to gradebook', detail: 'Avg score 84% · 3 flagged for review', risk: 'medium' },
  { id: 'p2', agent: 'Parent Comms Agent', action: 'Send 12 progress emails to guardians',  detail: 'Personalized · EN/ES/FR localized',    risk: 'high' },
  { id: 'p3', agent: 'Assessment Engine',  action: 'Auto-assign quiz to 1st Period',        detail: '25 students · opens tomorrow 9 AM',    risk: 'low' },
]

const INITIAL_FEED = [
  { t: 'now',    agent: 'Curriculum Architect', msg: 'Linked lesson "Photosynthesis" → NGSS MS-LS1-6', kind: 'ok' },
  { t: '2m',     agent: 'Differentiation Spec',  msg: 'Generated large-print + audio variant', kind: 'ok' },
  { t: '4m',     agent: 'Assessment Engine',     msg: 'Requested human review on ambiguous item #7', kind: 'warn' },
  { t: '6m',     agent: 'Grading Assistant',     msg: 'Completed batch grade — held for approval', kind: 'hold' },
  { t: '9m',     agent: 'Standards Aligner',     msg: 'Verified 15/15 objectives aligned', kind: 'ok' },
]

const AUTONOMY_META: Record<Autonomy, { label: string; color: string }> = {
  supervised:  { label: 'Human-in-loop', color: 'bg-amber-100 text-amber-700' },
  semi:        { label: 'Semi-auto',     color: 'bg-sky-100 text-sky-700' },
  autonomous:  { label: 'Autonomous',    color: 'bg-emerald-100 text-emerald-700' },
}

const STATUS_META: Record<AgentStatus, { label: string; dot: string; text: string }> = {
  running:  { label: 'Running',  dot: 'bg-emerald-500', text: 'text-emerald-600' },
  idle:     { label: 'Idle',     dot: 'bg-slate-300',   text: 'text-slate-400' },
  awaiting: { label: 'Awaiting', dot: 'bg-amber-500',   text: 'text-amber-600' },
  paused:   { label: 'Paused',   dot: 'bg-slate-400',   text: 'text-slate-500' },
}

const AUTONOMY_CYCLE: Autonomy[] = ['supervised', 'semi', 'autonomous']

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS)
  const [approvals, setApprovals] = useState<Approval[]>(INITIAL_APPROVALS)
  const [feed, setFeed] = useState(INITIAL_FEED)

  const activeCount = agents.filter(a => a.status === 'running').length
  const awaitingCount = agents.filter(a => a.status === 'awaiting').length
  const totalDone = agents.reduce((s, a) => s + a.tasksDone, 0)

  function cycleAutonomy(id: string) {
    setAgents(prev => prev.map(a => {
      if (a.id !== id) return a
      const next = AUTONOMY_CYCLE[(AUTONOMY_CYCLE.indexOf(a.autonomy) + 1) % 3]
      return { ...a, autonomy: next }
    }))
  }

  function toggleRun(id: string) {
    setAgents(prev => prev.map(a => {
      if (a.id !== id) return a
      if (a.status === 'running') return { ...a, status: 'paused' }
      if (a.status === 'paused' || a.status === 'idle') return { ...a, status: 'running' }
      return a
    }))
  }

  function resolve(id: string, approved: boolean) {
    const item = approvals.find(a => a.id === id)
    setApprovals(prev => prev.filter(a => a.id !== id))
    if (item) {
      setFeed(prev => [
        { t: 'now', agent: item.agent, msg: `${approved ? 'Approved' : 'Rejected'}: ${item.action}`, kind: approved ? 'ok' : 'warn' },
        ...prev,
      ])
      // Flip the corresponding agent back to running
      setAgents(prev => prev.map(a =>
        a.name === item.agent ? { ...a, status: 'running', progress: approved ? 100 : 0, task: approved ? 'Executing approved action…' : 'Reworking — approval rejected' } : a
      ))
    }
  }

  const stats = [
    { label: 'Active Agents',    value: `${activeCount}/6`,   icon: Cpu,          color: 'bg-brand-100 text-brand-600' },
    { label: 'Awaiting Approval', value: approvals.length,     icon: ShieldCheck,  color: 'bg-amber-100 text-amber-600' },
    { label: 'In Swarm',         value: agents.length,        icon: GitBranch,    color: 'bg-sky-100 text-sky-600' },
    { label: 'Tasks Completed',  value: totalDone,            icon: CheckCircle2, color: 'bg-emerald-100 text-emerald-600' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <FadeUp>
        <div className="hero-mesh rounded-3xl p-6 border border-slate-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <motion.div
                className="w-11 h-11 rounded-2xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)' }}
                animate={{ boxShadow: ['0 0 0px rgba(139,92,246,0.4)', '0 0 24px rgba(139,92,246,0.6)', '0 0 0px rgba(139,92,246,0.4)'] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                <Bot className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-black text-slate-900">Agent Swarm</h2>
                <p className="text-slate-500 text-sm">Autonomous teaching agents · vertical &amp; horizontal · human-in-the-loop</p>
              </div>
            </div>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="btn-gradient flex-shrink-0">
              <Sparkles className="w-4 h-4" />
              Deploy Agent
            </motion.button>
          </div>
        </div>
      </FadeUp>

      {/* Stats */}
      <StaggerList className="grid grid-cols-2 lg:grid-cols-4 gap-4" delay={0.08}>
        {stats.map((s) => (
          <StaggerItem key={s.label} variants={fadeUp}>
            <motion.div className="stat-card h-full" whileHover={{ y: -3, boxShadow: '0 8px 30px rgba(139,92,246,0.12)' }}>
              <div className={`icon-bubble ${s.color} mb-3`}><s.icon className="w-5 h-5" /></div>
              <div className="text-2xl font-black text-slate-900 tabular-nums">{s.value}</div>
              <div className="text-xs font-semibold text-slate-700 mt-0.5">{s.label}</div>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerList>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Swarm grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-brand-500" />
            <h3 className="text-base font-bold text-slate-900">Swarm</h3>
            <span className="text-xs text-slate-400">{activeCount} running · {awaitingCount} awaiting</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {agents.map((a, i) => {
              const st = STATUS_META[a.status]
              const au = AUTONOMY_META[a.autonomy]
              return (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                  className="bg-white rounded-2xl border border-slate-100 shadow-card p-4 hover:shadow-card-hover transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`icon-bubble ${a.bg} w-9 h-9`}><a.icon className="w-4 h-4" /></div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 leading-tight">{a.name}</p>
                        <p className="text-xs text-slate-400">{a.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${st.dot} ${a.status === 'running' ? 'animate-pulse' : ''}`} />
                      <span className={`text-xs font-medium ${st.text}`}>{st.label}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mb-3 min-h-[32px]">{a.task}</p>

                  {/* Progress */}
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-3">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: a.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${a.progress}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => cycleAutonomy(a.id)}
                      className={`badge ${au.color} cursor-pointer hover:opacity-80 transition-opacity`}
                      title="Click to change autonomy level"
                    >
                      <Gauge className="w-3 h-3" />{au.label}
                    </button>
                    <button
                      onClick={() => toggleRun(a.id)}
                      className="text-slate-400 hover:text-brand-600 p-1.5 rounded-lg hover:bg-brand-50 transition-colors"
                      title={a.status === 'running' ? 'Pause agent' : 'Resume agent'}
                    >
                      {a.status === 'running' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Right column: approvals + feed */}
        <div className="space-y-6">
          {/* Human-in-the-loop approvals */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              <h3 className="text-base font-bold text-slate-900">Approval Queue</h3>
              <span className="badge bg-amber-100 text-amber-700">{approvals.length}</span>
            </div>
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {approvals.map((p) => (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, x: 40, transition: { duration: 0.25 } }}
                    className="bg-white rounded-2xl border border-slate-100 shadow-card p-4"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-brand-600">{p.agent}</span>
                      <span className={`badge ${
                        p.risk === 'high' ? 'bg-red-100 text-red-600' :
                        p.risk === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>{p.risk} risk</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-900 mb-1">{p.action}</p>
                    <p className="text-xs text-slate-400 mb-3">{p.detail}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => resolve(p.id, true)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-500 text-white text-xs font-semibold hover:bg-emerald-600 transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />Approve
                      </button>
                      <button
                        onClick={() => resolve(p.id, false)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-semibold hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />Reject
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {approvals.length === 0 && (
                <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-6 text-center">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                  <p className="text-xs text-slate-400">All caught up — no pending approvals</p>
                </div>
              )}
            </div>
          </div>

          {/* Orchestration feed */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-brand-500" />
              <h3 className="text-base font-bold text-slate-900">Orchestration Feed</h3>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-4 space-y-3 max-h-80 overflow-y-auto">
              <AnimatePresence initial={false}>
                {feed.map((f, i) => (
                  <motion.div
                    key={`${f.t}-${f.msg}-${i}`}
                    layout
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-2.5"
                  >
                    <div className="flex flex-col items-center pt-0.5">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        f.kind === 'ok' ? 'bg-emerald-400' : f.kind === 'warn' ? 'bg-amber-400' : 'bg-sky-400'
                      }`} />
                      {i < feed.length - 1 && <span className="w-px flex-1 bg-slate-100 mt-1" />}
                    </div>
                    <div className="pb-1">
                      <p className="text-xs text-slate-700 leading-snug">{f.msg}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{f.agent} · {f.t}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
