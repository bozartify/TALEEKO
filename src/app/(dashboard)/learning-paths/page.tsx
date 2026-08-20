'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GitBranch, Sparkles, Plus, ChevronRight, Users, CheckCircle,
  Clock, BookOpen, Star, Play, X, Eye, ArrowRight, TrendingUp,
  BarChart3, Layers, Target, Zap, Award, Lock, Check, Download,
  Share2, Settings, Filter
} from 'lucide-react'
import { FadeUp, FadeInWhenVisible, StaggerList, StaggerItem, fadeUp } from '@/components/ui/motion'

type PathStatus = 'active' | 'draft' | 'archived'
type TabType = 'paths' | 'templates' | 'analytics'

interface PathStep {
  id: string
  title: string
  type: 'lesson' | 'quiz' | 'activity' | 'video' | 'discussion'
  duration: number
  completed?: boolean
}

interface LearningPath {
  id: string
  title: string
  subject: string
  grade: string
  description: string
  color: string
  steps: PathStep[]
  enrolled: number
  completionPct: number
  status: PathStatus
  createdAt: string
  estimatedWeeks: number
}

interface Template {
  id: string
  title: string
  subject: string
  steps: number
  icon: string
  desc: string
  color: string
}

const STEP_TYPE_CONFIG = {
  lesson:     { label: 'Lesson',     color: '#6366f1', icon: BookOpen },
  quiz:       { label: 'Quiz',       color: '#f97316', icon: CheckCircle },
  activity:   { label: 'Activity',   color: '#10b981', icon: Zap },
  video:      { label: 'Video',      color: '#22d3ee', icon: Play },
  discussion: { label: 'Discussion', color: '#ec4899', icon: Users },
}

const STATUS_CONFIG: Record<PathStatus, { label: string; bg: string; text: string }> = {
  active:   { label: 'Active',   bg: 'bg-success-400/15', text: 'text-success-400' },
  draft:    { label: 'Draft',    bg: 'bg-warning-400/15', text: 'text-warning-400' },
  archived: { label: 'Archived', bg: 'bg-surface-700',    text: 'text-surface-400' },
}

const INITIAL_PATHS: LearningPath[] = [
  {
    id: 'lp1', title: 'Differentiated Reading Journey', subject: 'English', grade: '7th Grade',
    description: 'Adaptive reading path that adjusts to each student\'s level using Lexile-matched texts.',
    color: '#ec4899', enrolled: 22, completionPct: 68, status: 'active', createdAt: 'Jul 10', estimatedWeeks: 6,
    steps: [
      { id: 's1', title: 'Reading Level Assessment', type: 'quiz', duration: 20, completed: true },
      { id: 's2', title: 'Foundational Text Analysis', type: 'lesson', duration: 45, completed: true },
      { id: 's3', title: 'Independent Reading Session', type: 'activity', duration: 30, completed: true },
      { id: 's4', title: 'Comprehension Check', type: 'quiz', duration: 15, completed: false },
      { id: 's5', title: 'Group Discussion', type: 'discussion', duration: 25, completed: false },
      { id: 's6', title: 'Final Book Report', type: 'activity', duration: 60, completed: false },
    ],
  },
  {
    id: 'lp2', title: 'Mastery Math: Fractions to Algebra', subject: 'Mathematics', grade: '8th Grade',
    description: 'Sequential mastery path bridging fraction operations through pre-algebra concepts.',
    color: '#6366f1', enrolled: 18, completionPct: 45, status: 'active', createdAt: 'Jul 15', estimatedWeeks: 8,
    steps: [
      { id: 's1', title: 'Fractions Review', type: 'lesson', duration: 40, completed: true },
      { id: 's2', title: 'Operations Quiz', type: 'quiz', duration: 20, completed: true },
      { id: 's3', title: 'Intro to Variables', type: 'video', duration: 15, completed: false },
      { id: 's4', title: 'Variable Practice', type: 'activity', duration: 35, completed: false },
      { id: 's5', title: 'Solving Equations', type: 'lesson', duration: 50, completed: false },
    ],
  },
  {
    id: 'lp3', title: 'Scientific Method Deep Dive', subject: 'Biology', grade: '9th Grade',
    description: 'Hands-on lab-first path through the scientific process with real data collection.',
    color: '#10b981', enrolled: 24, completionPct: 91, status: 'active', createdAt: 'Jun 28', estimatedWeeks: 4,
    steps: [
      { id: 's1', title: 'Scientific Method Overview', type: 'lesson', duration: 35, completed: true },
      { id: 's2', title: 'Hypothesis Formation', type: 'activity', duration: 25, completed: true },
      { id: 's3', title: 'Lab Safety Video', type: 'video', duration: 10, completed: true },
      { id: 's4', title: 'Experiment Design', type: 'activity', duration: 45, completed: true },
      { id: 's5', title: 'Data Analysis', type: 'lesson', duration: 40, completed: false },
    ],
  },
  {
    id: 'lp4', title: 'Civil War Era History Path', subject: 'History', grade: '8th Grade',
    description: 'Chronological exploration of causes, events, and aftermath of the Civil War.',
    color: '#f97316', enrolled: 20, completionPct: 30, status: 'draft', createdAt: 'Jul 20', estimatedWeeks: 5,
    steps: [
      { id: 's1', title: 'Antebellum America', type: 'lesson', duration: 50, completed: true },
      { id: 's2', title: 'Causes of the War', type: 'discussion', duration: 30, completed: false },
      { id: 's3', title: 'Key Battles Documentary', type: 'video', duration: 20, completed: false },
      { id: 's4', title: 'Primary Sources Activity', type: 'activity', duration: 40, completed: false },
    ],
  },
]

const TEMPLATES: Template[] = [
  { id: 't1', title: 'Flipped Classroom Path', subject: 'Any', steps: 5, icon: '🔄', desc: 'Video first, practice in class — optimized for flipped instruction', color: '#6366f1' },
  { id: 't2', title: 'Socratic Seminar Sequence', subject: 'ELA/SS', steps: 4, icon: '💬', desc: 'Build toward rich academic discussion through structured preparation', color: '#ec4899' },
  { id: 't3', title: 'Project-Based Learning', subject: 'Any', steps: 7, icon: '🏗️', desc: 'Scaffold a PBL unit from launch to final presentation', color: '#10b981' },
  { id: 't4', title: 'Mastery Progression', subject: 'Math/Science', steps: 6, icon: '🎯', desc: 'Gate each step on demonstrated mastery before advancing', color: '#f97316' },
  { id: 't5', title: 'ELL Differentiated Path', subject: 'Any', steps: 5, icon: '🌐', desc: 'Scaffolded supports and language-accessible content at each step', color: '#22d3ee' },
  { id: 't6', title: 'Assessment Prep Sprint', subject: 'Any', steps: 4, icon: '⚡', desc: '2-week focused review sequence for standardized test preparation', color: '#f59e0b' },
]

const ANALYTICS_DATA = [
  { label: 'Reading Journey', pct: 68, color: '#ec4899', enrolled: 22 },
  { label: 'Mastery Math', pct: 45, color: '#6366f1', enrolled: 18 },
  { label: 'Scientific Method', pct: 91, color: '#10b981', enrolled: 24 },
  { label: 'Civil War Path', pct: 30, color: '#f97316', enrolled: 20 },
]

export default function LearningPathsPage() {
  const [tab, setTab] = useState<TabType>('paths')
  const [paths, setPaths] = useState<LearningPath[]>(INITIAL_PATHS)
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null)
  const [createModal, setCreateModal] = useState(false)
  const [toastMsg, setToastMsg] = useState('')
  const [newPath, setNewPath] = useState({ title: '', subject: 'Biology', grade: '7th Grade', description: '' })
  const [filterStatus, setFilterStatus] = useState<PathStatus | 'all'>('all')

  function showToast(msg: string) { setToastMsg(msg); setTimeout(() => setToastMsg(''), 2500) }

  function handleCreatePath() {
    if (!newPath.title.trim()) { showToast('Please enter a path title'); return }
    const colors: Record<string, string> = { Biology: '#10b981', Mathematics: '#6366f1', History: '#f97316', English: '#ec4899', Chemistry: '#22d3ee', Physics: '#8b5cf6' }
    const created: LearningPath = {
      id: `lp-${Date.now()}`,
      title: newPath.title,
      subject: newPath.subject,
      grade: newPath.grade,
      description: newPath.description || `A new learning path for ${newPath.subject}.`,
      color: colors[newPath.subject] ?? '#6366f1',
      steps: [],
      enrolled: 0,
      completionPct: 0,
      status: 'draft',
      createdAt: 'Today',
      estimatedWeeks: 4,
    }
    setPaths(prev => [created, ...prev])
    setNewPath({ title: '', subject: 'Biology', grade: '7th Grade', description: '' })
    setCreateModal(false)
    showToast(`"${created.title}" created!`)
  }

  const filtered = paths.filter(p => filterStatus === 'all' || p.status === filterStatus)
  const totalEnrolled = paths.reduce((s, p) => s + p.enrolled, 0)
  const avgCompletion = Math.round(paths.reduce((s, p) => s + p.completionPct, 0) / paths.length)

  return (
    <div className="space-y-6">
      {/* Hero */}
      <FadeUp>
        <div className="hero-mesh rounded-3xl p-6 border border-white/[0.06]">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg,#6366f1,#ec4899)' }}>
                <GitBranch className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-black text-white tracking-tight">Learning Paths</h1>
                  <span className="text-[10px] bg-accent-500/20 text-accent-400 px-2 py-0.5 rounded-full font-bold border border-accent-500/20">AI</span>
                </div>
                <p className="text-sm text-surface-400">Design adaptive, personalized learning journeys for every student</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="btn-secondary text-xs px-3 py-1.5" onClick={() => showToast('Paths exported')}>
                <Download className="w-3.5 h-3.5" /> Export
              </button>
              <motion.button className="btn-gradient text-xs" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setCreateModal(true)}>
                <Plus className="w-3.5 h-3.5" /> New Path
              </motion.button>
            </div>
          </div>
          <div className="border-t border-white/[0.06] pt-4 flex items-center gap-6 flex-wrap">
            {[
              { label: 'Total Paths', value: paths.length.toString(), color: '#6366f1' },
              { label: 'Total Enrolled', value: totalEnrolled.toString(), color: '#22d3ee' },
              { label: 'Avg Completion', value: `${avgCompletion}%`, color: '#10b981' },
              { label: 'Active Paths', value: paths.filter(p => p.status === 'active').length.toString(), color: '#f59e0b' },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-xs text-surface-400">{s.label}</span>
                <span className="text-xs font-bold text-white">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </FadeUp>

      {/* Tabs */}
      <FadeUp delay={0.05}>
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.06] w-fit">
          {(['paths', 'templates', 'analytics'] as TabType[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize ${tab === t ? 'bg-accent-500/20 text-accent-300 border border-accent-500/30' : 'text-surface-400 hover:text-surface-200'}`}>
              {t}
            </button>
          ))}
        </div>
      </FadeUp>

      <AnimatePresence mode="wait">
        {/* MY PATHS */}
        {tab === 'paths' && (
          <motion.div key="paths" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="space-y-4">
            {/* Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-surface-500" />
              {(['all', 'active', 'draft', 'archived'] as const).map(s => (
                <button key={s} onClick={() => setFilterStatus(s)}
                  className={`px-3 py-1 rounded-full text-[10px] font-semibold transition-all border capitalize ${filterStatus === s ? 'text-white bg-accent-500/20 border-accent-500/40' : 'text-surface-400 hover:text-white border-transparent hover:border-white/10'}`}>
                  {s}
                </button>
              ))}
            </div>

            <StaggerList className="grid grid-cols-1 md:grid-cols-2 gap-5" delay={0.06}>
              {filtered.map(path => {
                const sc = STATUS_CONFIG[path.status]
                const doneSteps = path.steps.filter(s => s.completed).length
                return (
                  <StaggerItem key={path.id} variants={fadeUp}>
                    <motion.div className="glass-card p-5 cursor-pointer" whileHover={{ y: -3, transition: { duration: 0.2 } }} onClick={() => setSelectedPath(path)}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{ background: `linear-gradient(135deg,${path.color},${path.color}99)` }}>
                            <GitBranch className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-white">{path.title}</h3>
                            <p className="text-[11px] text-surface-400">{path.subject} · {path.grade}</p>
                          </div>
                        </div>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${sc.bg} ${sc.text}`}>{sc.label}</span>
                      </div>
                      <p className="text-xs text-surface-400 mb-3 line-clamp-2">{path.description}</p>
                      <div className="flex items-center gap-4 mb-3 text-[11px] text-surface-400">
                        <span className="flex items-center gap-1"><Layers className="w-3 h-3" />{path.steps.length} steps</span>
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" />{path.enrolled} enrolled</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{path.estimatedWeeks} wks</span>
                      </div>
                      <div className="space-y-1 mb-3">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-surface-500">Completion</span>
                          <span className="text-white font-bold">{path.completionPct}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                          <motion.div className="h-full rounded-full" style={{ background: path.color }} initial={{ width: 0 }} animate={{ width: `${path.completionPct}%` }} transition={{ duration: 0.8, delay: 0.1 }} />
                        </div>
                        <p className="text-[10px] text-surface-500">{doneSteps}/{path.steps.length} steps complete</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="btn-secondary text-xs px-3 py-1.5 flex-1 justify-center" onClick={e => { e.stopPropagation(); setSelectedPath(path) }}>
                          <Eye className="w-3 h-3" /> View Path
                        </button>
                        <button className="btn-gradient text-xs px-3 py-1.5" onClick={e => { e.stopPropagation(); showToast(`Assigning "${path.title}" to class…`) }}>
                          <Share2 className="w-3 h-3" /> Assign
                        </button>
                      </div>
                    </motion.div>
                  </StaggerItem>
                )
              })}
            </StaggerList>
          </motion.div>
        )}

        {/* TEMPLATES */}
        {tab === 'templates' && (
          <motion.div key="templates" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {TEMPLATES.map((t, i) => (
                <motion.div key={t.id} className="glass-card p-5 hover:bg-white/[0.08] transition-all" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} whileHover={{ y: -3 }}>
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl">{t.icon}</span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-accent-500/10 text-accent-400">{t.subject}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">{t.title}</h4>
                  <p className="text-xs text-surface-400 mb-3">{t.desc}</p>
                  <p className="text-[11px] text-surface-500 mb-4 flex items-center gap-1"><Layers className="w-3 h-3" />{t.steps} steps</p>
                  <div className="flex gap-2">
                    <button className="btn-secondary text-xs px-3 py-1.5 flex-1 justify-center" onClick={() => showToast(`Previewing "${t.title}"`)}>
                      <Eye className="w-3 h-3" /> Preview
                    </button>
                    <button className="btn-gradient text-xs px-3 py-1.5" onClick={() => {
                      const created: LearningPath = { id: `lp-${Date.now()}`, title: t.title, subject: t.subject, grade: '7th Grade', description: t.desc, color: t.color, steps: [], enrolled: 0, completionPct: 0, status: 'draft', createdAt: 'Today', estimatedWeeks: t.steps }
                      setPaths(prev => [created, ...prev])
                      setTab('paths')
                      showToast(`Template applied: "${t.title}"`)
                    }}>
                      Use
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ANALYTICS */}
        {tab === 'analytics' && (
          <motion.div key="analytics" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="space-y-5">
            <FadeInWhenVisible>
              <div className="glass-card p-5">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-accent-400" />Completion by Path</h3>
                {(() => {
                  const W = 520, H = 160, PAD = 40, GAP = 20
                  const bw = (W - PAD * 2 - GAP * (ANALYTICS_DATA.length - 1)) / ANALYTICS_DATA.length
                  const baseY = H - 30
                  return (
                    <svg width="100%" viewBox={`0 0 ${W} ${H}`} className="overflow-visible">
                      {ANALYTICS_DATA.map((d, i) => {
                        const bh = Math.max(4, ((d.pct / 100) * (baseY - 10)))
                        const x = PAD + i * (bw + GAP)
                        return (
                          <g key={d.label}>
                            <rect x={x} y={10} width={bw} height={baseY - 10} rx={4} fill="rgba(255,255,255,0.04)" />
                            <motion.rect x={x} y={baseY} width={bw} rx={4} fill={d.color} fillOpacity={0.85} initial={{ y: baseY, height: 0 }} animate={{ y: baseY - bh, height: bh }} transition={{ duration: 0.7, delay: i * 0.1 }} />
                            <text x={x + bw / 2} y={baseY - bh - 5} textAnchor="middle" fill="white" fontSize={10} fontWeight="bold">{d.pct}%</text>
                            <text x={x + bw / 2} y={H - 4} textAnchor="middle" fill="#64748b" fontSize={9}>{d.label.split(' ')[0]}</text>
                          </g>
                        )
                      })}
                    </svg>
                  )
                })()}
              </div>
            </FadeInWhenVisible>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {ANALYTICS_DATA.map(d => (
                <FadeInWhenVisible key={d.label}>
                  <div className="glass-card p-4">
                    <p className="text-[11px] text-surface-400 mb-1">{d.label}</p>
                    <p className="text-xl font-black text-white">{d.pct}%</p>
                    <p className="text-[10px] text-surface-500">{d.enrolled} students enrolled</p>
                    <div className="h-1 rounded-full bg-white/[0.06] mt-2 overflow-hidden">
                      <motion.div className="h-full rounded-full" style={{ background: d.color }} initial={{ width: 0 }} animate={{ width: `${d.pct}%` }} transition={{ duration: 0.8 }} />
                    </div>
                  </div>
                </FadeInWhenVisible>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Path Detail Drawer */}
      <AnimatePresence>
        {selectedPath && (
          <motion.div className="fixed inset-0 z-50 flex items-start justify-end" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedPath(null)} />
            <motion.div className="relative w-full max-w-lg h-screen overflow-y-auto bg-surface-950 border-l border-white/[0.08] p-6 space-y-5" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: selectedPath.color }}>
                    <GitBranch className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-white">{selectedPath.title}</h2>
                    <p className="text-[11px] text-surface-400">{selectedPath.subject} · {selectedPath.grade}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedPath(null)} className="p-1.5 rounded-lg hover:bg-white/[0.08] text-surface-400">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-surface-300">{selectedPath.description}</p>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Enrolled', value: selectedPath.enrolled.toString() },
                  { label: 'Completion', value: `${selectedPath.completionPct}%` },
                  { label: 'Duration', value: `${selectedPath.estimatedWeeks} wks` },
                ].map(s => (
                  <div key={s.label} className="glass-card p-3 text-center">
                    <p className="text-base font-black text-white">{s.value}</p>
                    <p className="text-[10px] text-surface-400">{s.label}</p>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="text-xs font-bold text-surface-300 mb-3 uppercase tracking-wider">Learning Steps</h3>
                <div className="space-y-2">
                  {selectedPath.steps.map((step, si) => {
                    const cfg = STEP_TYPE_CONFIG[step.type]
                    const Icon = cfg.icon
                    return (
                      <div key={step.id} className="flex items-center gap-3 glass-card p-3">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ background: step.completed ? '#10b981' : 'rgba(255,255,255,0.1)' }}>
                          {step.completed ? <Check className="w-3 h-3" /> : si + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-semibold ${step.completed ? 'text-surface-400 line-through' : 'text-white'}`}>{step.title}</p>
                          <p className="text-[10px] text-surface-500">{step.duration} min</p>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: cfg.color + '20', color: cfg.color }}>
                          <Icon className="w-2.5 h-2.5" />
                          {cfg.label}
                        </div>
                      </div>
                    )
                  })}
                  {selectedPath.steps.length === 0 && (
                    <div className="glass-card p-6 text-center text-surface-500 text-xs">No steps added yet — edit this path to add steps.</div>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button className="btn-secondary text-xs px-4 py-2 flex-1 justify-center" onClick={() => { setSelectedPath(null); showToast('Path editor opened') }}>
                  <Settings className="w-3 h-3" /> Edit Path
                </button>
                <button className="btn-gradient text-xs px-4 py-2" onClick={() => { showToast(`Assigning "${selectedPath.title}" to class…`); setSelectedPath(null) }}>
                  <ArrowRight className="w-3 h-3" /> Assign to Class
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Modal */}
      <AnimatePresence>
        {createModal && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setCreateModal(false)} />
            <motion.div className="relative glass-card p-6 w-full max-w-sm z-10 space-y-4" initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }}>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">New Learning Path</h3>
                <button onClick={() => setCreateModal(false)} className="text-surface-500 hover:text-white"><X className="w-4 h-4" /></button>
              </div>
              {[
                { label: 'Title', key: 'title' as const, type: 'input', placeholder: 'e.g. Algebra Mastery Path' },
                { label: 'Description', key: 'description' as const, type: 'textarea', placeholder: 'What will students learn?' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-[11px] text-surface-500 block mb-1">{f.label}</label>
                  {f.type === 'textarea' ? (
                    <textarea value={newPath[f.key]} onChange={e => setNewPath(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} rows={2} className="w-full px-3 py-2 text-xs rounded-xl bg-white/[0.04] border border-white/[0.08] text-surface-200 placeholder:text-surface-600 focus:outline-none focus:border-accent-500/40 resize-none" />
                  ) : (
                    <input value={newPath[f.key]} onChange={e => setNewPath(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} className="w-full px-3 py-2 text-xs rounded-xl bg-white/[0.04] border border-white/[0.08] text-surface-200 placeholder:text-surface-600 focus:outline-none focus:border-accent-500/40" />
                  )}
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-surface-500 block mb-1">Subject</label>
                  <select value={newPath.subject} onChange={e => setNewPath(p => ({ ...p, subject: e.target.value }))} className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-white/[0.04] border border-white/[0.08] text-surface-200 focus:outline-none focus:border-accent-500/40">
                    {['Biology', 'Mathematics', 'History', 'English', 'Chemistry', 'Physics'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-surface-500 block mb-1">Grade</label>
                  <select value={newPath.grade} onChange={e => setNewPath(p => ({ ...p, grade: e.target.value }))} className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-white/[0.04] border border-white/[0.08] text-surface-200 focus:outline-none focus:border-accent-500/40">
                    {['6th Grade', '7th Grade', '8th Grade', '9th Grade', '10th Grade', '11th Grade', '12th Grade'].map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setCreateModal(false)} className="btn-secondary text-xs px-4 py-2">Cancel</button>
                <button onClick={handleCreatePath} className="btn-gradient text-xs px-4 py-2">
                  <Plus className="w-3 h-3" /> Create Path
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div className="fixed top-5 right-5 z-[100] flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl" style={{ background: 'linear-gradient(135deg,#0a0f1a,#111827)', border: '1px solid rgba(255,255,255,0.08)' }} initial={{ opacity: 0, y: -16, scale: 0.92 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.94 }}>
            <CheckCircle className="w-4 h-4 text-success-400 flex-shrink-0" />
            <span className="text-xs font-semibold text-white">{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
