'use client'
import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  PenTool, Plus, ChevronRight, Star, Copy, Download, Trash2,
  Sparkles, Check, X, Edit3, Eye, BarChart2, BookOpen, Grid3X3,
  ChevronDown, AlertTriangle, Brain, Share2, Search, MoreHorizontal,
  CheckCircle, FileText, Printer, Link2, Users, TrendingUp, Filter
} from 'lucide-react'
import { FadeUp, FadeInWhenVisible, StaggerList, StaggerItem, fadeUp } from '@/components/ui/motion'

/* ─────────────────────────────────────────── Types ── */
interface Rubric {
  id: string
  title: string
  subject: string
  grade: string
  criteria: number
  levels: number
  lastUsed: string
  uses: number
  color: string
  tags: string[]
}

/* ─────────────────────────────────────────── Constants ── */
const INITIAL_RUBRICS: Rubric[] = [
  { id: '1', title: 'Essay Writing Rubric',        subject: 'English', grade: '10th', criteria: 4, levels: 4, lastUsed: 'Today',       uses: 12, color: '#f43f5e', tags: ['Writing', 'Analytical'] },
  { id: '2', title: 'Lab Report Assessment',        subject: 'Science', grade: '7th',  criteria: 5, levels: 3, lastUsed: 'Yesterday',    uses: 8,  color: '#8b5cf6', tags: ['Lab', 'Scientific Method'] },
  { id: '3', title: 'Math Problem Solving',         subject: 'Math',    grade: '9th',  criteria: 3, levels: 4, lastUsed: '3 days ago',  uses: 15, color: '#14b8a6', tags: ['Problem Solving', 'Show Work'] },
  { id: '4', title: 'History Research Project',     subject: 'History', grade: '8th',  criteria: 6, levels: 4, lastUsed: '1 week ago',  uses: 5,  color: '#f97316', tags: ['Research', 'Citation'] },
  { id: '5', title: 'Oral Presentation Rubric',     subject: 'Any',     grade: 'All',  criteria: 5, levels: 4, lastUsed: '2 weeks ago', uses: 20, color: '#6366f1', tags: ['Speaking', 'Communication'] },
  { id: '6', title: 'Group Project Collaboration',  subject: 'Any',     grade: 'All',  criteria: 4, levels: 3, lastUsed: '2 weeks ago', uses: 9,  color: '#ec4899', tags: ['Collaboration', 'Teamwork'] },
  { id: '7', title: 'Reading Comprehension Rubric', subject: 'English', grade: '6th',  criteria: 4, levels: 4, lastUsed: '3 weeks ago', uses: 7,  color: '#10b981', tags: ['Reading', 'Comprehension'] },
  { id: '8', title: 'Creative Writing Assessment',  subject: 'English', grade: '11th', criteria: 5, levels: 4, lastUsed: '1 month ago', uses: 4,  color: '#22d3ee', tags: ['Creative', 'Voice'] },
]

const rubricPreview = {
  criteria: ['Content & Ideas', 'Organization', 'Language & Style', 'Conventions'],
  levels:   ['Exemplary (4)', 'Proficient (3)', 'Developing (2)', 'Beginning (1)'],
  cells: [
    ['Insightful thesis, compelling evidence, deep analysis',          'Clear thesis, sufficient evidence, solid analysis',      'Vague thesis, limited evidence, surface analysis',          'No clear thesis, minimal evidence'],
    ['Logical flow, smooth transitions, strong intro/conclusion',      'Generally organized, some transitions, adequate intro/conclusion', 'Inconsistent organization, few transitions',          'No clear structure, missing components'],
    ['Varied sentence structure, precise vocabulary, engaging voice',  'Adequate sentence variety, appropriate vocabulary',      'Simple sentences, basic vocabulary, inconsistent voice',    'Fragments/run-ons, limited vocabulary'],
    ['0–1 errors in grammar, spelling, punctuation',                  '2–4 errors in grammar, spelling, punctuation',           '5–8 errors that may impede meaning',                        'Numerous errors that significantly impede meaning'],
  ],
}

const templates = [
  { name: 'Essay / Writing',     icon: '📝', criteria: 4 },
  { name: 'Lab Report',         icon: '🔬', criteria: 5 },
  { name: 'Presentation',       icon: '🎤', criteria: 5 },
  { name: 'Group Project',      icon: '👥', criteria: 4 },
  { name: 'Math Problem Set',   icon: '🧮', criteria: 3 },
  { name: 'Art / Creative',     icon: '🎨', criteria: 4 },
  { name: 'Research Paper',     icon: '📚', criteria: 6 },
  { name: 'Custom (AI-Generated)', icon: '✨', criteria: 0 },
]

const AI_ALERTS = [
  { icon: Brain,         color: '#6366f1', title: 'Criteria Optimization', text: 'Essay Writing Rubric has vague level 2 descriptors — AI can sharpen them for more consistent grading' },
  { icon: AlertTriangle, color: '#f59e0b', title: 'Standards Alignment',   text: '3 rubrics are missing CCSS alignment tags. Run "Auto-Tag Standards" to fix all at once' },
  { icon: Star,          color: '#10b981', title: 'Most-Used Rubric',      text: 'Oral Presentation Rubric (20 uses) is your top performer — consider creating subject-specific variants' },
]

const USAGE_TREND  = [5, 7, 4, 8, 6, 9, 11, 8]
const TREND_LABELS = ['Jun 3', 'Jun 10', 'Jun 17', 'Jun 24', 'Jul 1', 'Jul 8', 'Jul 15', 'Jul 22']
const SUBJECTS     = ['All', 'English', 'Science', 'Math', 'History', 'Any']

/* ─────────────────────────────────────────── Helpers ── */
function getLevelPoints(levels: string[], index: number): number {
  const match = levels[index]?.match(/\((\d+)\)/)
  if (match) return parseInt(match[1], 10)
  return levels.length - index
}

type View = 'gallery' | 'preview'

/* ─────────────────────────────────────────── Component ── */
export default function RubricsPage() {
  const [rubrics, setRubrics]       = useState<Rubric[]>(INITIAL_RUBRICS)
  const [view, setView]             = useState<View>('gallery')
  const [showTemplates, setShowTemplates] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [aiOpen, setAiOpen]         = useState(false)
  const [searchQ, setSearchQ]       = useState('')
  const [filterSubject, setFilterSubject] = useState('All')
  const [actionMenu, setActionMenu] = useState<string | null>(null)
  const [exportOpen, setExportOpen] = useState(false)
  const [shareOpen, setShareOpen]   = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Rubric | null>(null)
  const [copiedLink, setCopiedLink] = useState(false)
  const [toastMsg, setToastMsg]     = useState('')

  // Editor state
  const [editing, setEditing]       = useState(false)
  const [editableCriteria, setEditableCriteria] = useState<string[]>(rubricPreview.criteria)
  const [editableLevels, setEditableLevels]     = useState<string[]>(rubricPreview.levels)
  const [editableCells, setEditableCells]       = useState<string[][]>(rubricPreview.cells.map(r => [...r]))
  const [aiImproving, setAiImproving]           = useState(false)
  const snapshotRef = useRef<{ criteria: string[]; levels: string[]; cells: string[][] } | null>(null)

  function showToast(msg: string) {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 2500)
  }

  function handleGenerate() {
    setGenerating(true)
    setShowTemplates(false)
    setTimeout(() => { setGenerating(false); setView('preview') }, 2000)
  }

  function handleDelete(rubric: Rubric) {
    setRubrics(prev => prev.filter(r => r.id !== rubric.id))
    setDeleteTarget(null)
    showToast(`"${rubric.title}" deleted`)
  }

  function handleDuplicate(rubric: Rubric) {
    const copy: Rubric = { ...rubric, id: `${rubric.id}-copy-${Date.now()}`, title: `${rubric.title} (Copy)`, uses: 0, lastUsed: 'Just now' }
    setRubrics(prev => [copy, ...prev])
    setActionMenu(null)
    showToast(`Duplicated: "${rubric.title}"`)
  }

  function startEditing() {
    snapshotRef.current = { criteria: [...editableCriteria], levels: [...editableLevels], cells: editableCells.map(r => [...r]) }
    setEditing(true)
  }

  function cancelEditing() {
    if (snapshotRef.current) {
      setEditableCriteria(snapshotRef.current.criteria)
      setEditableLevels(snapshotRef.current.levels)
      setEditableCells(snapshotRef.current.cells)
    }
    setEditing(false)
  }

  function doneEditing() {
    snapshotRef.current = null
    setEditing(false)
    showToast('Rubric saved')
  }

  function handleAiImprove() {
    setAiImproving(true)
    setTimeout(() => {
      setEditableCells(prev => prev.map(row => row.map(cell => {
        const t = cell.trim()
        return t ? t.charAt(0).toUpperCase() + t.slice(1) : t
      })))
      setAiImproving(false)
      showToast('AI improved rubric descriptors')
    }, 1500)
  }

  function handleCopyLink() {
    setCopiedLink(true)
    showToast('Share link copied!')
    setTimeout(() => setCopiedLink(false), 2000)
  }

  const updateCriterion = useCallback((index: number, value: string) => {
    setEditableCriteria(prev => { const n = [...prev]; n[index] = value; return n })
  }, [])
  const updateLevel = useCallback((index: number, value: string) => {
    setEditableLevels(prev => { const n = [...prev]; n[index] = value; return n })
  }, [])
  const updateCell = useCallback((ri: number, ci: number, value: string) => {
    setEditableCells(prev => { const n = prev.map(r => [...r]); n[ri][ci] = value; return n })
  }, [])

  function addCriterion() {
    setEditableCriteria(prev => [...prev, ''])
    setEditableCells(prev => [...prev, Array(editableLevels.length).fill('')])
  }
  function addLevel() {
    const newIdx = editableLevels.length
    setEditableLevels(prev => [...prev, `Level ${newIdx + 1}`])
    setEditableCells(prev => prev.map(row => [...row, '']))
  }
  function removeCriterion(index: number) {
    if (editableCriteria.length <= 2) return
    setEditableCriteria(prev => prev.filter((_, i) => i !== index))
    setEditableCells(prev => prev.filter((_, i) => i !== index))
  }
  function removeLevel(index: number) {
    if (editableLevels.length <= 2) return
    setEditableLevels(prev => prev.filter((_, i) => i !== index))
    setEditableCells(prev => prev.map(row => row.filter((_, i) => i !== index)))
  }

  const totalPoints = editableLevels.length > 0
    ? editableCriteria.length * getLevelPoints(editableLevels, 0) : 0

  const filteredRubrics = rubrics.filter(r => {
    const matchSubject = filterSubject === 'All' || r.subject === filterSubject
    const matchSearch  = !searchQ.trim() || r.title.toLowerCase().includes(searchQ.toLowerCase()) || r.tags.some(t => t.toLowerCase().includes(searchQ.toLowerCase()))
    return matchSubject && matchSearch
  })

  const topByUse = [...rubrics].sort((a, b) => b.uses - a.uses).slice(0, 4)

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <FadeUp>
        <div className="hero-mesh rounded-3xl p-6 border border-white/[0.06]">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)' }}>
                <PenTool className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-black text-white tracking-tight">Rubric Builder</h1>
                  <span className="text-[10px] bg-violet-500/20 text-violet-400 px-2 py-0.5 rounded-full font-bold border border-violet-500/20">AI-Powered</span>
                </div>
                <p className="text-sm text-surface-400">Create standards-aligned rubrics with AI-generated criteria and inline editing</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="flex items-center gap-1 bg-white/[0.06] rounded-full p-0.5">
                <button onClick={() => setView('gallery')} className={`p-1.5 rounded-full transition-all ${view === 'gallery' ? 'bg-white/[0.08] text-white' : 'text-surface-500'}`}>
                  <Grid3X3 className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setView('preview')} className={`p-1.5 rounded-full transition-all ${view === 'preview' ? 'bg-white/[0.08] text-white' : 'text-surface-500'}`}>
                  <Eye className="w-3.5 h-3.5" />
                </button>
              </div>
              <motion.button className="btn-gradient text-xs" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setShowTemplates(true)}>
                <Sparkles className="w-3.5 h-3.5" /> Generate Rubric
              </motion.button>
            </div>
          </div>
          <div className="border-t border-white/[0.06] pt-4 flex items-center gap-6 flex-wrap">
            {[
              { label: 'Rubrics', value: `${rubrics.length}` },
              { label: 'Total Uses', value: `${rubrics.reduce((s, r) => s + r.uses, 0)}` },
              { label: 'Avg Criteria', value: `${Math.round(rubrics.reduce((s, r) => s + r.criteria, 0) / rubrics.length)}` },
              { label: 'Most Used', value: `${Math.max(...rubrics.map(r => r.uses))}x` },
              { label: 'Subjects', value: `${new Set(rubrics.map(r => r.subject)).size}` },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-2">
                <span className="text-lg font-black text-white">{s.value}</span>
                <span className="text-xs text-surface-500">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </FadeUp>

      {/* ── AI Insights ── */}
      <FadeUp delay={0.03}>
        <div className="glass-card overflow-hidden">
          <button
            className="w-full flex items-center justify-between p-4"
            onClick={() => setAiOpen(o => !o)}
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-accent-500/15 flex items-center justify-center">
                <Brain className="w-3.5 h-3.5 text-accent-400" />
              </div>
              <span className="text-xs font-bold text-white">AI Rubric Insights</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent-500/15 text-accent-400 font-semibold">{AI_ALERTS.length} tips</span>
            </div>
            <motion.div animate={{ rotate: aiOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="w-4 h-4 text-surface-500" />
            </motion.div>
          </button>
          <AnimatePresence initial={false}>
            {aiOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                  {AI_ALERTS.map((alert, i) => {
                    const Icon = alert.icon
                    return (
                      <motion.div
                        key={i}
                        className="flex gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:border-white/[0.09] transition-all cursor-pointer"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        whileHover={{ x: 2 }}
                      >
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: alert.color + '20' }}>
                          <Icon className="w-3.5 h-3.5" style={{ color: alert.color }} />
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-white mb-0.5">{alert.title}</p>
                          <p className="text-[10px] text-surface-400 leading-relaxed">{alert.text}</p>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </FadeUp>

      {/* ── Quick Stats ── */}
      <FadeUp delay={0.05}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Total Rubrics',    value: rubrics.length,                                           icon: Grid3X3,   color: '#6366f1' },
            { label: 'Total Uses',       value: rubrics.reduce((s, r) => s + r.uses, 0),                  icon: BarChart2, color: '#10b981' },
            { label: 'Avg Criteria',     value: Math.round(rubrics.reduce((s, r) => s + r.criteria, 0) / rubrics.length), icon: BookOpen, color: '#f59e0b' },
            { label: 'Most Used',        value: Math.max(...rubrics.map(r => r.uses)),                    icon: Star,      color: '#ec4899' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="glass-card p-4"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: stat.color + '18' }}>
                  <stat.icon className="w-3.5 h-3.5" style={{ color: stat.color }} />
                </div>
                <span className="text-xs text-surface-400">{stat.label}</span>
              </div>
              <p className="text-xl font-black text-white">{stat.value}</p>
            </motion.div>
          ))}
        </div>
      </FadeUp>

      {/* ── Generating overlay ── */}
      <AnimatePresence>
        {generating && (
          <motion.div
            className="bg-gradient-to-r from-accent-500/10 to-neon-500/10 rounded-2xl border border-white/[0.06] p-8 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <motion.div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>
            <h3 className="text-lg font-black text-white mb-1">Generating Rubric...</h3>
            <p className="text-sm text-surface-400">AI is creating assessment criteria tailored to your needs</p>
            {(() => {
              const W = 192, H = 6
              return (
                <svg viewBox={`0 0 ${W} ${H}`} width={192} height={6} className="overflow-visible mx-auto mt-4">
                  <defs>
                    <linearGradient id="rb-load" x1="0" x2="1" y1="0" y2="0">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#818cf8" />
                    </linearGradient>
                  </defs>
                  <rect x={0} y={0} width={W} height={H} rx={3} fill="rgba(99,102,241,0.15)" />
                  <motion.rect
                    x={0} y={0} height={H} rx={3}
                    fill="url(#rb-load)"
                    initial={{ width: 0 }}
                    animate={{ width: W }}
                    transition={{ duration: 2, ease: 'linear' }}
                  />
                </svg>
              )
            })()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Template picker ── */}
      <AnimatePresence>
        {showTemplates && (
          <motion.div
            className="glass-card p-6"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white">Choose a Template</h3>
              <button onClick={() => setShowTemplates(false)} className="text-surface-500 hover:text-surface-300">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {templates.map((t, i) => (
                <motion.button
                  key={t.name}
                  className="p-4 bg-white/[0.03] rounded-xl text-center hover:bg-white/[0.06] hover:border-accent-500/20 border border-white/[0.06] transition-all"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04 }}
                  whileHover={{ y: -2 }}
                  onClick={handleGenerate}
                >
                  <span className="text-2xl block mb-2">{t.icon}</span>
                  <p className="text-xs font-bold text-white">{t.name}</p>
                  {t.criteria > 0 && <p className="text-[10px] text-surface-500 mt-0.5">{t.criteria} criteria</p>}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {/* ── Gallery view ── */}
        {view === 'gallery' && !generating && !showTemplates && (
          <motion.div key="gallery" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

            {/* Search + Filter */}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-surface-500" />
                <input
                  value={searchQ}
                  onChange={e => setSearchQ(e.target.value)}
                  placeholder="Search rubrics or tags..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-white placeholder:text-surface-600 focus:outline-none focus:border-accent-500/40"
                />
              </div>
              <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                {SUBJECTS.map(s => (
                  <button
                    key={s}
                    onClick={() => setFilterSubject(s)}
                    className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all ${filterSubject === s ? 'bg-white/[0.1] text-white' : 'text-surface-500 hover:text-surface-200'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_260px] gap-6">
              {/* Rubric cards */}
              <div>
                {filteredRubrics.length === 0 ? (
                  <div className="glass-card p-12 text-center">
                    <Search className="w-8 h-8 text-surface-600 mx-auto mb-2" />
                    <p className="text-sm text-surface-400">No rubrics match your filter</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredRubrics.map((rubric, i) => (
                      <motion.div
                        key={rubric.id}
                        className="glass-card overflow-hidden cursor-pointer group relative"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05, duration: 0.35 }}
                        whileHover={{ y: -3, transition: { duration: 0.18 } }}
                        onClick={() => { if (!actionMenu) setView('preview') }}
                      >
                        <div className="h-1.5" style={{ backgroundColor: rubric.color }} />
                        <div className="p-5">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-bold text-white text-sm group-hover:text-accent-400 transition-colors flex-1 min-w-0 pr-2">{rubric.title}</h4>
                            <div className="relative flex-shrink-0">
                              <button
                                className="p-1.5 rounded-lg text-surface-500 hover:text-white hover:bg-white/[0.08] transition-all"
                                onClick={e => { e.stopPropagation(); setActionMenu(actionMenu === rubric.id ? null : rubric.id) }}
                              >
                                <MoreHorizontal className="w-3.5 h-3.5" />
                              </button>
                              <AnimatePresence>
                                {actionMenu === rubric.id && (
                                  <motion.div
                                    className="absolute right-0 top-8 z-20 glass-card min-w-[140px] py-1 shadow-2xl"
                                    initial={{ opacity: 0, scale: 0.95, y: -4 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -4 }}
                                    onClick={e => e.stopPropagation()}
                                  >
                                    {[
                                      { label: 'View / Edit', icon: Eye,      fn: () => { setView('preview'); setActionMenu(null) } },
                                      { label: 'Duplicate',   icon: Copy,     fn: () => handleDuplicate(rubric) },
                                      { label: 'Export',      icon: Download, fn: () => { setExportOpen(true); setActionMenu(null) } },
                                      { label: 'Share',       icon: Share2,   fn: () => { setShareOpen(true); setActionMenu(null) } },
                                    ].map(item => (
                                      <button
                                        key={item.label}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-[11px] text-surface-300 hover:text-white hover:bg-white/[0.06] transition-all"
                                        onClick={item.fn}
                                      >
                                        <item.icon className="w-3 h-3" />
                                        {item.label}
                                      </button>
                                    ))}
                                    <div className="border-t border-white/[0.06] mt-1 pt-1">
                                      <button
                                        className="w-full flex items-center gap-2 px-3 py-2 text-[11px] text-red-400 hover:text-red-300 hover:bg-red-500/[0.08] transition-all"
                                        onClick={() => { setDeleteTarget(rubric); setActionMenu(null) }}
                                      >
                                        <Trash2 className="w-3 h-3" />
                                        Delete
                                      </button>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                          <p className="text-xs text-surface-400">{rubric.subject} · Grade {rubric.grade}</p>
                          <div className="flex items-center gap-3 mt-3 text-xs text-surface-500">
                            <span>{rubric.criteria} criteria</span>
                            <span>{rubric.levels} levels</span>
                            <span className="ml-auto">{rubric.uses} uses</span>
                          </div>
                          <div className="flex gap-1.5 mt-3 flex-wrap">
                            {rubric.tags.map(tag => (
                              <span key={tag} className="text-[10px] px-2 py-0.5 bg-white/[0.06] text-surface-400 rounded-full">{tag}</span>
                            ))}
                          </div>
                          <div className="mt-3 pt-3 border-t border-white/[0.05] flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: rubric.color }} />
                            <span className="text-[10px] text-surface-600">Last used {rubric.lastUsed}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Sidebar: Analytics */}
              <div className="space-y-4">
                {/* Usage trend */}
                <FadeInWhenVisible delay={0.1}>
                  <div className="glass-card p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-3.5 h-3.5 text-accent-400" />
                      <p className="text-xs font-bold text-surface-300">Rubric Uses</p>
                      <span className="text-[10px] text-surface-600 ml-auto">8 weeks</span>
                    </div>
                    {(() => {
                      const W = 240, H = 70, PX = 10, PY = 8
                      const maxV = Math.max(...USAGE_TREND) + 2
                      const sx = (i: number) => PX + (i / (USAGE_TREND.length - 1)) * (W - PX * 2)
                      const sy = (v: number) => PY + ((maxV - v) / maxV) * (H - PY * 2)
                      const pts = USAGE_TREND.map((v, i) => ({ x: sx(i), y: sy(v) }))
                      let lp = `M ${pts[0].x} ${pts[0].y}`
                      for (let i = 1; i < pts.length; i++) {
                        const cpx = (pts[i].x + pts[i - 1].x) / 2
                        lp += ` C ${cpx} ${pts[i - 1].y} ${cpx} ${pts[i].y} ${pts[i].x} ${pts[i].y}`
                      }
                      const ap = lp + ` L ${pts[pts.length - 1].x} ${H} L ${pts[0].x} ${H} Z`
                      return (
                        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: H }}>
                          <defs>
                            <linearGradient id="rb-trend" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.35" />
                              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                          <path d={ap} fill="url(#rb-trend)" />
                          <motion.path d={lp} fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round"
                            initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.8, ease: 'easeOut' }} />
                          {pts.map((pt, i) => (
                            <g key={i}>
                              <circle cx={pt.x} cy={pt.y} r={2.5} fill="#8b5cf6" />
                              <text x={pt.x} y={H - 1} textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize="6.5">{TREND_LABELS[i].split(' ')[1]}</text>
                            </g>
                          ))}
                        </svg>
                      )
                    })()}
                  </div>
                </FadeInWhenVisible>

                {/* Top rubrics */}
                <FadeInWhenVisible delay={0.14}>
                  <div className="glass-card p-4">
                    <p className="text-xs font-bold text-surface-300 mb-3">Top Rubrics by Use</p>
                    <div className="space-y-2.5">
                      {topByUse.map((r, i) => (
                        <div key={r.id} className="flex items-center gap-2">
                          <span className="text-[10px] text-surface-600 w-4">{i + 1}.</span>
                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: r.color }} />
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] text-surface-300 truncate">{r.title}</p>
                            <div className="flex items-center gap-1 mt-0.5">
                              <div className="flex-1 h-1 rounded-full bg-white/[0.06]">
                                <div className="h-full rounded-full" style={{ width: `${(r.uses / topByUse[0].uses) * 100}%`, backgroundColor: r.color + '80' }} />
                              </div>
                              <span className="text-[9px] text-surface-600">{r.uses}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </FadeInWhenVisible>

                {/* Quick actions */}
                <FadeInWhenVisible delay={0.18}>
                  <div className="glass-card p-4">
                    <p className="text-xs font-bold text-surface-300 mb-3">Quick Actions</p>
                    <div className="space-y-1.5">
                      {[
                        { label: 'Generate from standards', icon: Sparkles, color: '#6366f1', fn: () => setShowTemplates(true) },
                        { label: 'Import from document',    icon: FileText,  color: '#10b981', fn: () => showToast('Import feature coming soon') },
                        { label: 'Share all rubrics',       icon: Share2,    color: '#22d3ee', fn: () => setShareOpen(true) },
                        { label: 'Export library (PDF)',    icon: Download,  color: '#f59e0b', fn: () => setExportOpen(true) },
                      ].map(a => (
                        <motion.button
                          key={a.label}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] text-surface-300 hover:text-white hover:bg-white/[0.04] transition-all"
                          whileHover={{ x: 2 }}
                          onClick={a.fn}
                        >
                          <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0" style={{ backgroundColor: a.color + '18' }}>
                            <a.icon className="w-3 h-3" style={{ color: a.color }} />
                          </div>
                          {a.label}
                          <ChevronRight className="w-3 h-3 ml-auto text-surface-600" />
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </FadeInWhenVisible>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Preview / Editor view ── */}
        {view === 'preview' && !generating && (
          <motion.div key="preview" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
            <div className="glass-card overflow-hidden relative">
              {/* Header bar */}
              <div className="p-5 border-b border-white/[0.06] flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-white">Essay Writing Rubric</h3>
                  <p className="text-xs text-surface-400">
                    English · 10th Grade · {editableCriteria.length} criteria × {editableLevels.length} levels
                    <span className="ml-2 text-accent-400 font-semibold">{totalPoints} pts possible</span>
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {!editing && (
                    <motion.button className="btn-secondary text-xs px-3 py-1.5" onClick={startEditing} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                      <Edit3 className="w-3 h-3" /> Edit
                    </motion.button>
                  )}
                  <button className="btn-secondary text-xs px-3 py-1.5" onClick={() => setShareOpen(true)}><Share2 className="w-3 h-3" /> Share</button>
                  <button className="btn-secondary text-xs px-3 py-1.5" onClick={() => setExportOpen(true)}><Download className="w-3 h-3" /> Export</button>
                </div>
              </div>

              {/* Editing toolbar */}
              <AnimatePresence>
                {editing && (
                  <motion.div
                    className="px-5 py-3 border-b border-white/[0.06] flex items-center gap-2 bg-accent-500/[0.04]"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.button className="btn-primary text-xs px-3 py-1.5" onClick={doneEditing} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                      <Check className="w-3 h-3" /> Done
                    </motion.button>
                    <motion.button className="btn-secondary text-xs px-3 py-1.5" onClick={cancelEditing} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                      <X className="w-3 h-3" /> Cancel
                    </motion.button>
                    <motion.button className="btn-gradient text-xs px-3 py-1.5" onClick={handleAiImprove} disabled={aiImproving} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                      <Sparkles className={`w-3 h-3 ${aiImproving ? 'animate-spin' : ''}`} />
                      {aiImproving ? 'Improving...' : 'AI Improve'}
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* AI Improving overlay */}
              <AnimatePresence>
                {aiImproving && (
                  <motion.div
                    className="absolute inset-0 z-10 flex items-center justify-center bg-surface-900/60 backdrop-blur-sm rounded-2xl"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  >
                    <div className="text-center">
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}>
                        <Sparkles className="w-8 h-8 text-accent-400 mx-auto" />
                      </motion.div>
                      <p className="text-sm text-white font-semibold mt-3">AI is improving your rubric...</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="overflow-x-auto relative">
                <table className="w-full min-w-[700px]">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      <th className="text-left text-xs font-bold text-surface-200 px-4 py-3 w-32 bg-white/[0.03]">Criteria</th>
                      {editableLevels.map((l, li) => {
                        const pts = getLevelPoints(editableLevels, li)
                        return (
                          <th key={li} className="text-center text-xs font-bold text-surface-200 px-4 py-3 bg-white/[0.03]">
                            {editing ? (
                              <div className="flex items-center gap-1 justify-center">
                                <input
                                  value={l}
                                  onChange={e => updateLevel(li, e.target.value)}
                                  className="bg-transparent border border-transparent focus:border-accent-500/40 focus:bg-white/[0.05] rounded-lg px-2 py-1 text-xs text-center text-surface-200 outline-none transition-all w-full min-w-[80px]"
                                />
                                {editableLevels.length > 2 && (
                                  <button onClick={() => removeLevel(li)} className="text-surface-500 hover:text-red-400 flex-shrink-0">
                                    <X className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            ) : <span>{l}</span>}
                            <span className="block text-[10px] text-surface-500 font-normal mt-0.5">{pts} pts</span>
                          </th>
                        )
                      })}
                      {editing && (
                        <th className="px-2 py-3 bg-white/[0.03]">
                          <motion.button className="text-surface-500 hover:text-accent-400 transition-colors p-1 rounded-lg hover:bg-white/[0.06]" onClick={addLevel} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Plus className="w-4 h-4" />
                          </motion.button>
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {editableCriteria.map((criterion, ri) => (
                      <motion.tr
                        key={ri}
                        className="border-b border-white/[0.04]"
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + ri * 0.06 }}
                      >
                        <td className="px-4 py-3 text-sm font-semibold text-accent-400 bg-accent-500/10">
                          {editing ? (
                            <div className="flex items-center gap-1">
                              <input
                                value={criterion}
                                onChange={e => updateCriterion(ri, e.target.value)}
                                className="bg-transparent border border-transparent focus:border-accent-500/40 focus:bg-white/[0.05] rounded-lg px-2 py-1 text-sm font-semibold text-accent-400 outline-none transition-all w-full"
                              />
                              {editableCriteria.length > 2 && (
                                <button onClick={() => removeCriterion(ri)} className="text-surface-500 hover:text-red-400 flex-shrink-0">
                                  <X className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          ) : criterion}
                        </td>
                        {editableCells[ri]?.map((cell, ci) => (
                          <td key={ci} className="px-4 py-3 text-xs text-surface-400 leading-relaxed border-l border-white/[0.04]">
                            {editing ? (
                              <textarea
                                value={cell}
                                onChange={e => updateCell(ri, ci, e.target.value)}
                                rows={3}
                                className="bg-transparent border border-transparent focus:border-accent-500/40 focus:bg-white/[0.05] rounded-lg px-2 py-1.5 text-xs text-surface-400 outline-none transition-all w-full resize-none leading-relaxed"
                              />
                            ) : cell}
                          </td>
                        ))}
                        {editing && <td />}
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
                <AnimatePresence>
                  {editing && (
                    <motion.div
                      className="px-4 py-3 border-t border-white/[0.04]"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <motion.button
                        className="btn-secondary text-xs px-3 py-1.5 w-full justify-center"
                        onClick={addCriterion}
                        whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                      >
                        <Plus className="w-3 h-3" /> Add Criterion
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Export Modal ── */}
      <AnimatePresence>
        {exportOpen && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setExportOpen(false)}
          >
            <motion.div
              className="glass-card w-full max-w-sm p-6"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-black text-white">Export Rubric</h3>
                <button onClick={() => setExportOpen(false)} className="text-surface-500 hover:text-surface-300"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-2">
                {[
                  { label: 'PDF Rubric',       icon: Printer,  color: '#6366f1', desc: 'Print-ready PDF with scoring guide' },
                  { label: 'Word Document',    icon: FileText,  color: '#10b981', desc: 'Editable .docx format' },
                  { label: 'Google Docs',      icon: Share2,    color: '#22d3ee', desc: 'Push to Google Drive' },
                  { label: 'Copy as Text',     icon: Copy,      color: '#f59e0b', desc: 'Plain text, paste anywhere' },
                ].map(opt => (
                  <motion.button
                    key={opt.label}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1] text-left transition-all"
                    whileHover={{ x: 2 }}
                    onClick={() => { setExportOpen(false); showToast(`Exported as ${opt.label}`) }}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: opt.color + '18' }}>
                      <opt.icon className="w-4 h-4" style={{ color: opt.color }} />
                    </div>
                    <div><p className="text-xs font-bold text-white">{opt.label}</p><p className="text-[10px] text-surface-500">{opt.desc}</p></div>
                    <ChevronRight className="w-3.5 h-3.5 text-surface-600 ml-auto" />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Share Modal ── */}
      <AnimatePresence>
        {shareOpen && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShareOpen(false)}
          >
            <motion.div
              className="glass-card w-full max-w-sm p-6"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-black text-white">Share Rubric</h3>
                <button onClick={() => setShareOpen(false)} className="text-surface-500 hover:text-surface-300"><X className="w-4 h-4" /></button>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] mb-4">
                <input readOnly value="https://taleeko.ai/rubric/essay-writing-2024" className="flex-1 text-xs text-surface-300 bg-transparent outline-none" />
                <motion.button className="text-accent-400 hover:text-accent-300 flex items-center gap-1 text-[11px] font-semibold flex-shrink-0" onClick={handleCopyLink} whileHover={{ scale: 1.05 }}>
                  {copiedLink ? <CheckCircle className="w-3.5 h-3.5 text-success-400" /> : <Link2 className="w-3.5 h-3.5" />}
                  {copiedLink ? 'Copied!' : 'Copy'}
                </motion.button>
              </div>
              <div className="space-y-2">
                {[
                  { label: 'Share with Students', icon: Users,   color: '#6366f1', desc: 'Students get read-only access' },
                  { label: 'Email to Parents',    icon: FileText, color: '#10b981', desc: 'Send assessment criteria home' },
                  { label: 'Collaborate (Dept)', icon: Share2,   color: '#22d3ee', desc: 'Co-edit with your department' },
                ].map(opt => (
                  <motion.button
                    key={opt.label}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1] text-left transition-all"
                    whileHover={{ x: 2 }}
                    onClick={() => { setShareOpen(false); showToast(`${opt.label} — link sent!`) }}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: opt.color + '18' }}>
                      <opt.icon className="w-4 h-4" style={{ color: opt.color }} />
                    </div>
                    <div><p className="text-xs font-bold text-white">{opt.label}</p><p className="text-[10px] text-surface-500">{opt.desc}</p></div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Delete Confirmation ── */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setDeleteTarget(null)}
          >
            <motion.div
              className="glass-card w-full max-w-sm p-6 text-center"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="w-12 h-12 rounded-2xl bg-red-500/15 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-sm font-black text-white mb-1">Delete Rubric?</h3>
              <p className="text-xs text-surface-400 mb-6">&ldquo;{deleteTarget.title}&rdquo; will be permanently deleted. This cannot be undone.</p>
              <div className="flex gap-3">
                <button className="btn-secondary text-xs flex-1" onClick={() => setDeleteTarget(null)}>Cancel</button>
                <button
                  className="flex-1 px-4 py-2 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-semibold hover:bg-red-500/25 transition-all"
                  onClick={() => handleDelete(deleteTarget)}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Toast ── */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            className="fixed top-4 right-4 z-[60] px-4 py-2.5 rounded-xl bg-surface-800 border border-white/[0.1] shadow-2xl flex items-center gap-2"
            initial={{ opacity: 0, y: -12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.95 }}
          >
            <CheckCircle className="w-3.5 h-3.5 text-success-400 flex-shrink-0" />
            <span className="text-xs text-white font-medium">{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Close action menu on outside click */}
      <AnimatePresence>
        {actionMenu && (
          <motion.div
            className="fixed inset-0 z-10"
            initial={{ opacity: 0 }} animate={{ opacity: 0 }} exit={{ opacity: 0 }}
            onClick={() => setActionMenu(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
