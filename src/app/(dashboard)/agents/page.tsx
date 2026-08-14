'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bot, Zap, CheckCircle2, XCircle, Clock, Cpu, Activity, ShieldCheck,
  Play, Pause, GitBranch, Layers, Sparkles, AlertCircle, ArrowRight,
  Users, BookOpen, ClipboardList, MessageSquare, Target, Gauge,
  Plus, X, Brain, TrendingUp, Star, Settings, Eye, ChevronDown,
  BarChart2, RefreshCw, Download, Flag, CheckSquare,
  FileText, Wand2, Timer, BookMarked, Award, Radio
} from 'lucide-react'
import { FadeUp, FadeInWhenVisible, StaggerList, StaggerItem, fadeUp } from '@/components/ui/motion'

type AgentStatus = 'running' | 'idle' | 'awaiting' | 'paused' | 'error'
type Autonomy = 'supervised' | 'semi' | 'autonomous'
type AgentTab = 'swarm' | 'templates' | 'metrics'

interface Agent {
  id: string
  name: string
  role: string
  icon: React.ElementType
  color: string
  status: AgentStatus
  task: string
  progress: number
  autonomy: Autonomy
  tasksDone: number
  timeSaved: string
  accuracy: number
  lastActive: string
  capabilities: string[]
}

interface Approval {
  id: string
  agent: string
  action: string
  detail: string
  risk: 'low' | 'medium' | 'high'
  timestamp: string
}

interface FeedItem {
  id: string
  t: string
  agent: string
  msg: string
  kind: 'ok' | 'warn' | 'hold' | 'error'
}

const INITIAL_AGENTS: Agent[] = [
  {
    id: 'a1', name: 'Curriculum Architect', role: 'Vertical · Planning', icon: Layers, color: '#6366f1',
    status: 'running', task: 'Mapping 7th-grade biology unit to NGSS standards — analyzing 22 lessons', progress: 72,
    autonomy: 'autonomous', tasksDone: 148, timeSaved: '4.2h', accuracy: 97, lastActive: 'now',
    capabilities: ['Lesson planning', 'Standards alignment', 'Scope & sequence', 'Unit design'],
  },
  {
    id: 'a2', name: 'Assessment Engine', role: 'Vertical · Evaluation', icon: ClipboardList, color: '#f97316',
    status: 'running', task: 'Generating differentiated quiz variants (3 tiers — scaffold, standard, advanced)', progress: 45,
    autonomy: 'semi', tasksDone: 92, timeSaved: '2.8h', accuracy: 94, lastActive: '1m ago',
    capabilities: ['Quiz generation', 'Rubric creation', 'Bloom\'s taxonomy', 'Item analysis'],
  },
  {
    id: 'a3', name: 'Grading Assistant', role: 'Horizontal · Feedback', icon: CheckCircle2, color: '#14b8a6',
    status: 'awaiting', task: 'Batch-graded 28 essays with detailed feedback — waiting for human sign-off', progress: 100,
    autonomy: 'supervised', tasksDone: 310, timeSaved: '12.5h', accuracy: 92, lastActive: '5m ago',
    capabilities: ['Essay grading', 'Feedback generation', 'Plagiarism check', 'Trend analysis'],
  },
  {
    id: 'a4', name: 'Differentiation Spec', role: 'Horizontal · Access', icon: Target, color: '#f43f5e',
    status: 'running', task: 'Adapting 3 lesson materials for 4 IEP profiles — adding scaffolds and visual aids', progress: 60,
    autonomy: 'semi', tasksDone: 67, timeSaved: '3.1h', accuracy: 96, lastActive: '2m ago',
    capabilities: ['IEP/504 adaptations', 'Scaffolding', 'Visual supports', 'Reading level adjustment'],
  },
  {
    id: 'a5', name: 'Parent Comms Agent', role: 'Horizontal · Outreach', icon: MessageSquare, color: '#0ea5e9',
    status: 'awaiting', task: 'Drafted 12 personalized progress emails in EN/ES/FR — awaiting approval before send', progress: 100,
    autonomy: 'supervised', tasksDone: 204, timeSaved: '6.8h', accuracy: 99, lastActive: '8m ago',
    capabilities: ['Progress emails', 'Translation (12 langs)', 'Newsletter drafts', 'Meeting scheduling'],
  },
  {
    id: 'a6', name: 'Standards Aligner', role: 'Vertical · Compliance', icon: ShieldCheck, color: '#a855f7',
    status: 'idle', task: 'Idle — waiting for new lesson content to align to framework', progress: 0,
    autonomy: 'autonomous', tasksDone: 51, timeSaved: '1.6h', accuracy: 98, lastActive: '1h ago',
    capabilities: ['CCSS alignment', 'NGSS mapping', 'IB standards', 'Gap analysis'],
  },
]

const agentTemplates = [
  { name: 'Quiz Generator', icon: ClipboardList, color: '#f97316', desc: 'Creates differentiated quizzes across Bloom\'s levels with answer keys and rubrics.', category: 'Assessment', popular: true },
  { name: 'Lesson Planner', icon: BookOpen, color: '#6366f1', desc: 'Generates complete 5E lesson plans aligned to specified standards.', category: 'Planning', popular: true },
  { name: 'Feedback Writer', icon: MessageSquare, color: '#14b8a6', desc: 'Writes personalized student feedback for essays, projects, and presentations.', category: 'Feedback', popular: false },
  { name: 'Reading Leveler', icon: BookMarked, color: '#ec4899', desc: 'Adapts text passages to multiple Lexile levels for differentiated instruction.', category: 'Accessibility', popular: false },
  { name: 'Discussion Bot', icon: Radio, color: '#f59e0b', desc: 'Facilitates asynchronous Socratic discussions with automated prompting.', category: 'Engagement', popular: false },
  { name: 'Data Analyst', icon: BarChart2, color: '#22d3ee', desc: 'Analyzes class performance data and surfaces actionable intervention insights.', category: 'Analytics', popular: true },
]

const INITIAL_APPROVALS: Approval[] = [
  { id: 'p1', agent: 'Grading Assistant', action: 'Publish 28 graded essays to gradebook', detail: 'Avg score 84% · 3 flagged for re-review · All feedback reviewed', risk: 'medium', timestamp: '5m ago' },
  { id: 'p2', agent: 'Parent Comms Agent', action: 'Send 12 progress emails to guardians', detail: 'Personalized · EN/ES/FR localized · Preview available', risk: 'high', timestamp: '8m ago' },
  { id: 'p3', agent: 'Assessment Engine', action: 'Auto-assign quiz to 1st Period', detail: '25 students · Opens tomorrow 9 AM · 45 min window', risk: 'low', timestamp: '12m ago' },
]

const INITIAL_FEED: FeedItem[] = [
  { id: 'f1', t: 'now',   agent: 'Curriculum Architect',  msg: 'Linked lesson "Photosynthesis" → NGSS MS-LS1-6 · Confidence: 98%',   kind: 'ok' },
  { id: 'f2', t: '2m',   agent: 'Differentiation Spec',  msg: 'Generated large-print + audio variant for Emma W. and Mason K.',      kind: 'ok' },
  { id: 'f3', t: '4m',   agent: 'Assessment Engine',     msg: 'Requested human review on ambiguous item #7 — answer key conflict',   kind: 'warn' },
  { id: 'f4', t: '6m',   agent: 'Grading Assistant',     msg: 'Completed batch grade for 28 essays — held for teacher approval',     kind: 'hold' },
  { id: 'f5', t: '9m',   agent: 'Standards Aligner',     msg: 'Verified all 15/15 learning objectives aligned to AP Bio standards',  kind: 'ok' },
  { id: 'f6', t: '14m',  agent: 'Parent Comms Agent',    msg: 'Translated 12 progress emails into Spanish and French',               kind: 'ok' },
  { id: 'f7', t: '22m',  agent: 'Differentiation Spec',  msg: 'Reading level adjusted: Genetics text → Lexile 720 (Grade 5)',       kind: 'ok' },
  { id: 'f8', t: '31m',  agent: 'Assessment Engine',     msg: 'Tier 1 scaffold quiz complete — 15 questions, 3 hints per item',     kind: 'ok' },
]

const AUTONOMY_META: Record<Autonomy, { label: string; colors: string }> = {
  supervised: { label: 'Human-in-loop', colors: 'bg-warning-400/15 text-warning-400' },
  semi:       { label: 'Semi-auto',     colors: 'bg-electric-400/15 text-electric-400' },
  autonomous: { label: 'Autonomous',    colors: 'bg-success-400/15 text-success-400' },
}

const STATUS_META: Record<AgentStatus, { label: string; dot: string; text: string }> = {
  running:  { label: 'Running',  dot: 'bg-success-400',  text: 'text-success-400' },
  idle:     { label: 'Idle',     dot: 'bg-surface-500',  text: 'text-surface-500' },
  awaiting: { label: 'Awaiting', dot: 'bg-warning-400',  text: 'text-warning-400' },
  paused:   { label: 'Paused',   dot: 'bg-surface-400',  text: 'text-surface-400' },
  error:    { label: 'Error',    dot: 'bg-danger-400',   text: 'text-danger-400' },
}

const AUTONOMY_CYCLE: Autonomy[] = ['supervised', 'semi', 'autonomous']

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS)
  const [approvals, setApprovals] = useState<Approval[]>(INITIAL_APPROVALS)
  const [feed, setFeed] = useState<FeedItem[]>(INITIAL_FEED)
  const [agentTab, setAgentTab] = useState<AgentTab>('swarm')
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null)
  const [showDeploy, setShowDeploy] = useState(false)
  const [toastMsg, setToastMsg] = useState('')

  function showToast(msg: string) {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 2500)
  }

  const activeCount = agents.filter(a => a.status === 'running').length
  const awaitingCount = agents.filter(a => a.status === 'awaiting').length
  const totalDone = agents.reduce((s, a) => s + a.tasksDone, 0)
  const totalTimeSaved = agents.reduce((s, a) => s + parseFloat(a.timeSaved), 0).toFixed(1)

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
      if (a.status === 'running') return { ...a, status: 'paused' as AgentStatus }
      if (a.status === 'paused' || a.status === 'idle') return { ...a, status: 'running' as AgentStatus }
      return a
    }))
  }

  function resolve(id: string, approved: boolean) {
    const item = approvals.find(a => a.id === id)
    setApprovals(prev => prev.filter(a => a.id !== id))
    if (item) {
      showToast(approved ? `Approved: ${item.action}` : `Rejected: ${item.action}`)
      const newFeedItem: FeedItem = {
        id: `f${Date.now()}`,
        t: 'now',
        agent: item.agent,
        msg: `${approved ? '✓ Approved' : '✗ Rejected'}: ${item.action}`,
        kind: approved ? 'ok' : 'warn',
      }
      setFeed(prev => [newFeedItem, ...prev])
      setAgents(prev => prev.map(a =>
        a.name === item.agent
          ? { ...a, status: 'running' as AgentStatus, progress: approved ? 100 : 0, task: approved ? 'Executing approved action…' : 'Reworking — approval rejected' }
          : a
      ))
    }
  }

  const statCards = [
    { label: 'Active Agents', value: `${activeCount}/6`, icon: Cpu, gradient: 'from-accent-500/20 to-accent-600/5', iconColor: 'text-accent-400', sub: 'in swarm' },
    { label: 'Awaiting Approval', value: approvals.length, icon: ShieldCheck, gradient: 'from-warning-400/20 to-warning-500/5', iconColor: 'text-warning-400', sub: 'need your review' },
    { label: 'Tasks Completed', value: totalDone, icon: CheckCircle2, gradient: 'from-success-400/20 to-success-500/5', iconColor: 'text-success-400', sub: 'this semester' },
    { label: 'Time Saved', value: `${totalTimeSaved}h`, icon: Timer, gradient: 'from-electric-400/20 to-electric-500/5', iconColor: 'text-electric-400', sub: 'total this week' },
  ]

  return (
    <div className="space-y-6">
      {/* Hero header */}
      <FadeUp>
        <div className="hero-mesh rounded-3xl p-6 border border-white/[0.06]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <motion.div
                className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #6366f1, #a78bfa)' }}
                animate={{ boxShadow: ['0 0 0px rgba(99,102,241,0.4)', '0 0 28px rgba(99,102,241,0.6)', '0 0 0px rgba(99,102,241,0.4)'] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                <Bot className="w-7 h-7 text-white" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-black text-white">Agent Swarm</h2>
                <p className="text-sm text-surface-400">Autonomous teaching agents · vertical & horizontal orchestration</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-success-400 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-success-400 animate-pulse" /> {activeCount} running
                  </span>
                  <span className="text-xs text-warning-400 font-semibold">{awaitingCount} awaiting approval</span>
                  <span className="text-xs text-surface-500">{totalDone} tasks done</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="btn-secondary text-xs px-3 py-1.5" onClick={() => showToast('Agent report exported to PDF')}><Download className="w-3.5 h-3.5" /> Export Report</button>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="btn-gradient"
                onClick={() => setShowDeploy(true)}
              >
                <Plus className="w-4 h-4" /> Deploy Agent
              </motion.button>
            </div>
          </div>
        </div>
      </FadeUp>

      {/* Stats */}
      <StaggerList className="grid grid-cols-2 lg:grid-cols-4 gap-4" delay={0.08}>
        {statCards.map((s) => (
          <StaggerItem key={s.label} variants={fadeUp}>
            <motion.div className="glass-card p-5 h-full" whileHover={{ y: -3, transition: { duration: 0.2 } }}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-gradient-to-br ${s.gradient}`}>
                <s.icon className={`w-5 h-5 ${s.iconColor}`} />
              </div>
              <div className="text-2xl font-black text-white tabular-nums">{s.value}</div>
              <div className="text-xs font-semibold text-surface-300 mt-0.5">{s.label}</div>
              <div className="text-[10px] text-surface-500 mt-0.5">{s.sub}</div>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerList>

      {/* Tab switcher */}
      <FadeUp delay={0.1}>
        <div className="flex items-center gap-1 bg-white/[0.04] rounded-full p-0.5 w-fit">
          {([['swarm', 'Agent Swarm'], ['templates', 'Templates'], ['metrics', 'Performance']] as [AgentTab, string][]).map(([tab, label]) => (
            <button
              key={tab}
              onClick={() => setAgentTab(tab)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                agentTab === tab ? 'bg-white/[0.1] text-white font-semibold' : 'text-surface-500 hover:text-surface-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </FadeUp>

      <AnimatePresence mode="wait">
        {agentTab === 'swarm' && (
          <motion.div key="swarm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Swarm grid */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-accent-400" />
                  <h3 className="text-base font-bold text-white">Active Swarm</h3>
                  <span className="text-xs text-surface-500">{activeCount} running · {awaitingCount} awaiting · 1 idle</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {agents.map((a, i) => {
                    const st = STATUS_META[a.status]
                    const au = AUTONOMY_META[a.autonomy]
                    const isExpanded = expandedAgent === a.id
                    return (
                      <motion.div
                        key={a.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06, duration: 0.4 }}
                        className={`glass-card overflow-hidden ${a.status === 'awaiting' ? 'border border-warning-500/20' : ''}`}
                      >
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2.5">
                              <motion.div
                                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: `${a.color}20` }}
                                animate={a.status === 'running' ? {
                                  boxShadow: [`0 0 0px ${a.color}30`, `0 0 12px ${a.color}50`, `0 0 0px ${a.color}30`]
                                } : {}}
                                transition={{ duration: 2, repeat: Infinity }}
                              >
                                <a.icon className="w-4.5 h-4.5" style={{ color: a.color }} />
                              </motion.div>
                              <div>
                                <p className="text-sm font-black text-white leading-tight">{a.name}</p>
                                <p className="text-[10px] text-surface-500">{a.role}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 flex-shrink-0">
                              <span className={`w-1.5 h-1.5 rounded-full ${st.dot} ${a.status === 'running' ? 'animate-pulse' : ''}`} />
                              <span className={`text-[10px] font-semibold ${st.text}`}>{st.label}</span>
                            </div>
                          </div>

                          <p className="text-xs text-surface-400 mb-3 min-h-[32px] leading-relaxed">{a.task}</p>

                          <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden mb-2">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ backgroundColor: a.color }}
                              initial={{ width: 0 }}
                              animate={{ width: `${a.progress}%` }}
                              transition={{ duration: 0.8, ease: 'easeOut' }}
                            />
                          </div>
                          <div className="flex items-center justify-between mb-3 text-[10px] text-surface-500">
                            <span>{a.progress}% complete</span>
                            <span>{a.tasksDone} done · {a.timeSaved} saved</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <button
                              onClick={() => cycleAutonomy(a.id)}
                              className={`text-[10px] px-2 py-1 rounded-lg font-semibold flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity ${au.colors}`}
                            >
                              <Gauge className="w-3 h-3" />{au.label}
                            </button>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => setExpandedAgent(isExpanded ? null : a.id)}
                                className="p-1.5 rounded-lg text-surface-500 hover:text-surface-300 hover:bg-white/[0.06] transition-colors"
                              >
                                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                              </button>
                              <button
                                onClick={() => toggleRun(a.id)}
                                className="text-surface-500 hover:text-accent-400 p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors"
                              >
                                {a.status === 'running' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                              </button>
                            </div>
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
                              <div className="border-t border-white/[0.06] p-4 space-y-3">
                                <div>
                                  <p className="text-[10px] text-surface-500 mb-1.5">Capabilities</p>
                                  <div className="flex flex-wrap gap-1.5">
                                    {a.capabilities.map(cap => (
                                      <span key={cap} className="text-[10px] px-2 py-0.5 bg-white/[0.06] text-surface-300 rounded-full">{cap}</span>
                                    ))}
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-[10px]">
                                  <div className="bg-white/[0.03] rounded-lg p-2">
                                    <p className="text-surface-500">Accuracy</p>
                                    <p className="text-white font-black text-sm mt-0.5">{a.accuracy}%</p>
                                  </div>
                                  <div className="bg-white/[0.03] rounded-lg p-2">
                                    <p className="text-surface-500">Last Active</p>
                                    <p className="text-white font-bold mt-0.5">{a.lastActive}</p>
                                  </div>
                                </div>
                                <div className="flex gap-1.5">
                                  <button className="btn-secondary text-[10px] px-2 py-1 flex-1" onClick={() => showToast(`${a.name} settings opened`)}><Settings className="w-2.5 h-2.5" /> Configure</button>
                                  <button className="btn-secondary text-[10px] px-2 py-1 flex-1" onClick={() => showToast(`${a.name} log opened`)}><Eye className="w-2.5 h-2.5" /> View Log</button>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )
                  })}
                </div>
              </div>

              {/* Right column */}
              <div className="space-y-5">
                {/* Approval queue */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <ShieldCheck className="w-4 h-4 text-warning-400" />
                    <h3 className="text-base font-bold text-white">Approval Queue</h3>
                    <span className="text-[10px] bg-warning-400/15 text-warning-400 px-2 py-0.5 rounded-full font-bold">{approvals.length}</span>
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
                          className="glass-card p-4"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold text-accent-400">{p.agent}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] text-surface-500">{p.timestamp}</span>
                              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                                p.risk === 'high' ? 'bg-danger-400/15 text-danger-400' :
                                p.risk === 'medium' ? 'bg-warning-400/15 text-warning-400' :
                                'bg-success-400/15 text-success-400'
                              }`}>{p.risk} risk</span>
                            </div>
                          </div>
                          <p className="text-xs font-bold text-surface-100 mb-1 leading-tight">{p.action}</p>
                          <p className="text-[10px] text-surface-500 mb-3">{p.detail}</p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => resolve(p.id, true)}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-success-500/20 text-success-400 text-xs font-bold hover:bg-success-500/30 transition-colors border border-success-500/20"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                            </button>
                            <button
                              onClick={() => resolve(p.id, false)}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/[0.04] text-surface-400 text-xs font-bold hover:bg-danger-400/15 hover:text-danger-400 transition-colors border border-white/[0.06]"
                            >
                              <XCircle className="w-3.5 h-3.5" /> Reject
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {approvals.length === 0 && (
                      <div className="glass-card p-8 text-center border-dashed border border-white/[0.06]">
                        <CheckCircle2 className="w-8 h-8 text-success-400 mx-auto mb-2" />
                        <p className="text-sm font-bold text-white mb-1">All Caught Up</p>
                        <p className="text-xs text-surface-500">No pending approvals</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Orchestration feed */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-4 h-4 text-accent-400" />
                    <h3 className="text-base font-bold text-white">Live Feed</h3>
                  </div>
                  <div className="glass-card p-4 space-y-3 max-h-80 overflow-y-auto">
                    <AnimatePresence initial={false}>
                      {feed.map((f, i) => (
                        <motion.div
                          key={f.id}
                          layout
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex gap-2.5"
                        >
                          <div className="flex flex-col items-center pt-1">
                            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                              f.kind === 'ok' ? 'bg-success-400' :
                              f.kind === 'warn' ? 'bg-warning-400' :
                              f.kind === 'error' ? 'bg-danger-400' :
                              'bg-electric-400'
                            }`} />
                            {i < feed.length - 1 && <span className="w-px flex-1 bg-white/[0.06] mt-1" />}
                          </div>
                          <div className="pb-2">
                            <p className="text-xs text-surface-300 leading-snug">{f.msg}</p>
                            <p className="text-[10px] text-surface-500 mt-0.5">{f.agent} · {f.t}</p>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {agentTab === 'templates' && (
          <motion.div key="templates" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="mb-4">
              <h3 className="text-sm font-bold text-white mb-1">Agent Templates</h3>
              <p className="text-xs text-surface-400">Deploy pre-built agents tuned for specific teaching workflows</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {agentTemplates.map((tmpl, i) => (
                <motion.div
                  key={tmpl.name}
                  className="glass-card p-5 hover:border-white/[0.15] transition-all cursor-pointer group"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -2 }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: tmpl.color + '20' }}>
                      <tmpl.icon className="w-5 h-5" style={{ color: tmpl.color }} />
                    </div>
                    <div className="flex items-center gap-1.5">
                      {tmpl.popular && (
                        <span className="text-[9px] bg-accent-500/15 text-accent-400 px-1.5 py-0.5 rounded-full font-bold">Popular</span>
                      )}
                      <span className="text-[9px] bg-white/[0.06] text-surface-400 px-1.5 py-0.5 rounded-full">{tmpl.category}</span>
                    </div>
                  </div>
                  <h4 className="text-sm font-black text-white mb-1">{tmpl.name}</h4>
                  <p className="text-xs text-surface-400 leading-relaxed mb-4">{tmpl.desc}</p>
                  <motion.button
                    className="w-full btn-gradient text-xs"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => showToast(`${tmpl.name} agent deployed`)}
                  >
                    <Play className="w-3 h-3" /> Deploy
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {agentTab === 'metrics' && (
          <motion.div key="metrics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <FadeInWhenVisible>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="glass-card p-5">
                  <h4 className="text-xs font-bold text-surface-300 mb-4 flex items-center gap-2"><TrendingUp className="w-3.5 h-3.5" /> Tasks Completed (per Agent)</h4>
                  {(() => {
                    const sorted = [...agents].sort((a, b) => b.tasksDone - a.tasksDone)
                    const maxVal = Math.max(...sorted.map(a => a.tasksDone))
                    const W = 340, LW = 124, CW = 34, GAP = 7, ROW = 22
                    const BAR_MAX = W - LW - CW - 6
                    const H = sorted.length * (ROW + GAP) - GAP
                    return (
                      <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible">
                        <defs>
                          {sorted.map((a, i) => (
                            <linearGradient key={i} id={`ag-task-${i}`} x1="0" y1="0" x2="1" y2="0">
                              <stop offset="0%" stopColor={a.color} stopOpacity={0.9} />
                              <stop offset="100%" stopColor={a.color} stopOpacity={0.45} />
                            </linearGradient>
                          ))}
                        </defs>
                        {sorted.map((a, i) => {
                          const bw = (a.tasksDone / maxVal) * BAR_MAX
                          const y = i * (ROW + GAP)
                          return (
                            <g key={a.id}>
                              <text x={0} y={y + 14} fill="rgba(255,255,255,0.5)" fontSize={10} fontFamily="inherit">{a.name.split(' ').slice(0, 2).join(' ')}</text>
                              <rect x={LW} y={y + 4} width={BAR_MAX} height={14} rx={3} fill="rgba(255,255,255,0.04)" />
                              <motion.rect x={LW} y={y + 4} height={14} rx={3} fill={`url(#ag-task-${i})`}
                                initial={{ width: 0 }} animate={{ width: bw }}
                                transition={{ delay: i * 0.08, duration: 0.6, ease: 'easeOut' }}
                              />
                              <text x={LW + BAR_MAX + 6} y={y + 14} fill="rgba(255,255,255,0.9)" fontSize={10} fontFamily="inherit" fontWeight="bold">{a.tasksDone}</text>
                            </g>
                          )
                        })}
                      </svg>
                    )
                  })()}
                </div>
                <div className="glass-card p-5">
                  <h4 className="text-xs font-bold text-surface-300 mb-4 flex items-center gap-2"><Award className="w-3.5 h-3.5" /> Accuracy Rate (per Agent)</h4>
                  {(() => {
                    const sorted = [...agents].sort((a, b) => b.accuracy - a.accuracy)
                    const W = 340, LW = 124, CW = 34, GAP = 7, ROW = 22
                    const BAR_MAX = W - LW - CW - 6
                    const H = sorted.length * (ROW + GAP) - GAP
                    return (
                      <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible">
                        <defs>
                          {sorted.map((a, i) => (
                            <linearGradient key={i} id={`ag-acc-${i}`} x1="0" y1="0" x2="1" y2="0">
                              <stop offset="0%" stopColor={a.color} stopOpacity={0.9} />
                              <stop offset="100%" stopColor={a.color} stopOpacity={0.45} />
                            </linearGradient>
                          ))}
                        </defs>
                        {sorted.map((a, i) => {
                          const bw = (a.accuracy / 100) * BAR_MAX
                          const y = i * (ROW + GAP)
                          const ac = a.accuracy >= 96 ? '#10b981' : a.accuracy >= 92 ? '#f59e0b' : '#ef4444'
                          return (
                            <g key={a.id}>
                              <text x={0} y={y + 14} fill="rgba(255,255,255,0.5)" fontSize={10} fontFamily="inherit">{a.name.split(' ').slice(0, 2).join(' ')}</text>
                              <rect x={LW} y={y + 4} width={BAR_MAX} height={14} rx={3} fill="rgba(255,255,255,0.04)" />
                              <motion.rect x={LW} y={y + 4} height={14} rx={3} fill={`url(#ag-acc-${i})`}
                                initial={{ width: 0 }} animate={{ width: bw }}
                                transition={{ delay: i * 0.08, duration: 0.6, ease: 'easeOut' }}
                              />
                              <text x={LW + BAR_MAX + 6} y={y + 14} fill={ac} fontSize={10} fontFamily="inherit" fontWeight="bold">{a.accuracy}%</text>
                            </g>
                          )
                        })}
                      </svg>
                    )
                  })()}
                </div>
              </div>
              <div className="glass-card p-5">
                <h4 className="text-xs font-bold text-surface-300 mb-4 flex items-center gap-2"><Timer className="w-3.5 h-3.5" /> Time Saved by Agent</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {agents.map((a, i) => (
                    <motion.div
                      key={a.id}
                      className="flex items-center gap-3 p-3 bg-white/[0.03] rounded-xl border border-white/[0.06]"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: a.color + '20' }}>
                        <a.icon className="w-4 h-4" style={{ color: a.color }} />
                      </div>
                      <div>
                        <p className="text-[10px] text-surface-400 leading-tight">{a.name.split(' ')[0]}</p>
                        <p className="text-sm font-black text-white">{a.timeSaved}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </FadeInWhenVisible>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Deploy Modal */}
      <AnimatePresence>
        {showDeploy && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDeploy(false)} />
            <motion.div
              className="relative glass-card p-6 w-full max-w-md z-10"
              initial={{ scale: 0.95, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 16 }}
            >
              <button onClick={() => setShowDeploy(false)} className="absolute top-4 right-4 text-surface-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
              <h3 className="text-base font-black text-white mb-1">Deploy New Agent</h3>
              <p className="text-xs text-surface-400 mb-4">Configure an AI agent for your classroom</p>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-surface-400 mb-1 block">Agent Type</label>
                  <select className="w-full px-3 py-2 text-xs bg-white/[0.06] border border-white/[0.08] rounded-xl text-surface-300 focus:outline-none focus:border-accent-500/50">
                    {agentTemplates.map(t => <option key={t.name}>{t.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-surface-400 mb-1 block">Class / Context</label>
                  <select className="w-full px-3 py-2 text-xs bg-white/[0.06] border border-white/[0.08] rounded-xl text-surface-300 focus:outline-none focus:border-accent-500/50">
                    <option>AP Biology</option>
                    <option>10th English</option>
                    <option>Algebra II</option>
                    <option>All Classes</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-surface-400 mb-1 block">Autonomy Level</label>
                  <div className="flex gap-2">
                    {(['supervised', 'semi', 'autonomous'] as Autonomy[]).map(lvl => (
                      <button key={lvl} className={`flex-1 text-[10px] py-2 rounded-xl border transition-colors capitalize font-semibold ${
                        lvl === 'semi' ? 'bg-electric-400/15 border-electric-400/30 text-electric-400' : 'border-white/[0.08] text-surface-400 hover:border-white/[0.15]'
                      }`}>
                        {lvl === 'supervised' ? 'Human-in-loop' : lvl === 'semi' ? 'Semi-auto' : 'Autonomous'}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-surface-400 mb-1 block">Task Description</label>
                  <textarea rows={2} placeholder="What should this agent do?" className="w-full px-3 py-2 text-xs bg-white/[0.06] border border-white/[0.08] rounded-xl text-white placeholder:text-surface-500 focus:outline-none focus:border-accent-500/50 resize-none" />
                </div>
                <motion.button
                  className="btn-gradient text-xs w-full"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { showToast('New agent deployed to swarm'); setShowDeploy(false) }}
                >
                  <Sparkles className="w-3.5 h-3.5" /> Deploy Agent
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            className="fixed top-5 right-5 z-[100] flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border border-white/[0.12]"
            style={{ background: 'linear-gradient(135deg, #0a0f1a, #111827)' }}
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          >
            <div className="w-6 h-6 rounded-full bg-accent-500/20 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 text-accent-400" />
            </div>
            <span className="text-xs font-semibold text-white max-w-[220px]">{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
