'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Library, Search, Eye, Edit3, Copy, Trash2, Sparkles, Clock,
  BookOpen, FileText, Zap, ChevronDown, TrendingUp, BarChart2,
  Star, ClipboardCheck, FolderOpen, Filter, Brain, GraduationCap,
  ChevronUp, X, Download, Share2, Plus, Grid, List as ListIcon,
  Check, Tag, Upload, AlertTriangle, BarChart3, Heart, MoreHorizontal, CheckCircle
} from 'lucide-react'
import { FadeUp, FadeInWhenVisible, StaggerList, StaggerItem, fadeUp } from '@/components/ui/motion'

type ContentType = 'lesson' | 'quiz' | 'worksheet' | 'activity' | 'assessment'
type SortOption = 'newest' | 'oldest' | 'most-used' | 'a-z'
type FilterTab = 'all' | ContentType
type ViewMode = 'grid' | 'list'

interface LibraryItem {
  id: string
  type: ContentType
  title: string
  subject: string
  grade: string
  createdAt: string
  uses: number
  aiGenerated: boolean
  starred?: boolean
  tags?: string[]
  shared?: boolean
  description?: string
}

const typeConfig: Record<ContentType, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  lesson:     { label: 'Lesson Plan',  color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)', icon: BookOpen },
  quiz:       { label: 'Quiz',         color: '#f97316', bg: 'rgba(249,115,22,0.12)', icon: Brain },
  worksheet:  { label: 'Worksheet',    color: '#14b8a6', bg: 'rgba(20,184,166,0.12)', icon: FileText },
  activity:   { label: 'Activity',     color: '#eab308', bg: 'rgba(234,179,8,0.12)',  icon: Zap },
  assessment: { label: 'Assessment',   color: '#ec4899', bg: 'rgba(236,72,153,0.12)', icon: ClipboardCheck },
}

const INITIAL_ITEMS: LibraryItem[] = [
  { id: '1',  type: 'lesson',     title: 'Introduction to Photosynthesis',       subject: 'Biology',     grade: '7th Grade',  createdAt: '2026-07-28', uses: 12, aiGenerated: true,  starred: true,  tags: ['science', 'plants'], description: 'Full 5E lesson with labs and formative assessment' },
  { id: '2',  type: 'quiz',       title: 'Fractions & Decimals Quiz',            subject: 'Mathematics', grade: '5th Grade',  createdAt: '2026-07-27', uses: 8,  aiGenerated: true,  tags: ['math', 'fractions'], description: '20-question auto-graded quiz with answer key' },
  { id: '3',  type: 'worksheet',  title: 'Periodic Table Practice',              subject: 'Chemistry',   grade: '9th Grade',  createdAt: '2026-07-26', uses: 15, aiGenerated: false, tags: ['chemistry', 'elements'], description: 'Fill-in-the-blank and identification exercises' },
  { id: '4',  type: 'activity',   title: 'Historical Timeline Builder',          subject: 'History',     grade: '8th Grade',  createdAt: '2026-07-25', uses: 6,  aiGenerated: true,  tags: ['history', 'project'], description: 'Collaborative group activity with digital timeline' },
  { id: '5',  type: 'assessment', title: 'Essay Writing Rubric Assessment',      subject: 'English',     grade: '10th Grade', createdAt: '2026-07-24', uses: 20, aiGenerated: true,  starred: true,  shared: true, tags: ['writing', 'rubric'] },
  { id: '6',  type: 'lesson',     title: "Newton's Laws of Motion",              subject: 'Physics',     grade: '9th Grade',  createdAt: '2026-07-23', uses: 18, aiGenerated: true,  tags: ['physics', 'forces'] },
  { id: '7',  type: 'quiz',       title: 'Spanish Vocabulary Chapter 5',         subject: 'Spanish',     grade: '6th Grade',  createdAt: '2026-07-22', uses: 9,  aiGenerated: false, tags: ['spanish', 'vocab'] },
  { id: '8',  type: 'worksheet',  title: 'Sentence Structure Exercises',         subject: 'English',     grade: '4th Grade',  createdAt: '2026-07-21', uses: 22, aiGenerated: true,  tags: ['grammar', 'writing'] },
  { id: '9',  type: 'activity',   title: 'Geometry Shapes Scavenger Hunt',       subject: 'Mathematics', grade: '3rd Grade',  createdAt: '2026-07-20', uses: 14, aiGenerated: true,  tags: ['math', 'geometry'] },
  { id: '10', type: 'lesson',     title: 'Civil Rights Movement: Key Figures',   subject: 'History',     grade: '11th Grade', createdAt: '2026-07-19', uses: 7,  aiGenerated: true,  tags: ['history', 'social'] },
  { id: '11', type: 'assessment', title: 'Reading Comprehension Benchmark',      subject: 'English',     grade: '6th Grade',  createdAt: '2026-07-18', uses: 25, aiGenerated: false, shared: true, tags: ['reading', 'ELA'] },
  { id: '12', type: 'worksheet',  title: 'Chemical Bonding Practice',            subject: 'Chemistry',   grade: '10th Grade', createdAt: '2026-07-17', uses: 11, aiGenerated: true,  tags: ['chemistry', 'bonds'] },
]

const collections = [
  { name: 'Biology Unit 3', count: 8, color: '#10b981', icon: '🧬' },
  { name: 'Math Assessments', count: 12, color: '#f97316', icon: '📐' },
  { name: 'History Projects', count: 5, color: '#ec4899', icon: '📜' },
  { name: 'ELL Resources', count: 6, color: '#6366f1', icon: '🌍' },
]

const filterTabs: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'lesson', label: 'Lesson Plans' },
  { key: 'quiz', label: 'Quizzes' },
  { key: 'worksheet', label: 'Worksheets' },
  { key: 'activity', label: 'Activities' },
  { key: 'assessment', label: 'Assessments' },
]

const sortOptions: { key: SortOption; label: string }[] = [
  { key: 'newest', label: 'Newest' },
  { key: 'oldest', label: 'Oldest' },
  { key: 'most-used', label: 'Most Used' },
  { key: 'a-z', label: 'A-Z' },
]

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function isNew(dateStr: string) {
  const d = new Date(dateStr)
  const now = new Date()
  return (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24) <= 3
}

export default function LibraryPage() {
  const [items, setItems] = useState<LibraryItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('taleeko_library_stars')
        if (saved) {
          const starredIds: string[] = JSON.parse(saved)
          return INITIAL_ITEMS.map(item => ({ ...item, starred: starredIds.includes(item.id) }))
        }
      } catch {}
    }
    return INITIAL_ITEMS
  })
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all')
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [showSort, setShowSort] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [aiOpen, setAiOpen] = useState(false)
  const [previewItem, setPreviewItem] = useState<LibraryItem | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<LibraryItem | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [bulkMode, setBulkMode] = useState(false)
  const [deleteToast, setDeleteToast] = useState(false)
  const [toastMsg, setToastMsg] = useState('')
  function showToast(msg: string) { setToastMsg(msg); setTimeout(() => setToastMsg(''), 2500) }

  const filtered = items
    .filter(item => {
      if (activeFilter !== 'all' && item.type !== activeFilter) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        return (
          item.title.toLowerCase().includes(q) ||
          item.subject.toLowerCase().includes(q) ||
          item.grade.toLowerCase().includes(q) ||
          (item.tags ?? []).some(t => t.toLowerCase().includes(q))
        )
      }
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'oldest':    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'most-used': return b.uses - a.uses
        case 'a-z':       return a.title.localeCompare(b.title)
        default:          return 0
      }
    })

  const thisWeekCount = items.filter(item => isNew(item.createdAt)).length

  const subjectCounts: Record<string, number> = {}
  items.forEach(i => { subjectCounts[i.subject] = (subjectCounts[i.subject] || 0) + 1 })
  const topSubjects = Object.entries(subjectCounts).sort((a, b) => b[1] - a[1]).slice(0, 5)
  const popularSubject = topSubjects[0]?.[0] || 'N/A'
  const aiPct = Math.round((items.filter(i => i.aiGenerated).length / items.length) * 100)

  function toggleStar(id: string) {
    setItems(prev => {
      const next = prev.map(i => i.id === id ? { ...i, starred: !i.starred } : i)
      if (typeof window !== 'undefined') {
        try {
          const starredIds = next.filter(i => i.starred).map(i => i.id)
          localStorage.setItem('taleeko_library_stars', JSON.stringify(starredIds))
        } catch {}
      }
      return next
    })
  }

  function confirmDelete() {
    if (!deleteTarget) return
    setItems(prev => prev.filter(i => i.id !== deleteTarget.id))
    setDeleteTarget(null)
    setDeleteToast(true)
    setTimeout(() => setDeleteToast(false), 3000)
  }

  function toggleSelected(id: string) {
    setSelected(prev => {
      const n = new Set(prev)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })
  }

  function bulkDelete() {
    setItems(prev => prev.filter(i => !selected.has(i.id)))
    setSelected(new Set())
    setBulkMode(false)
  }

  const totalUses = items.reduce((sum, i) => sum + i.uses, 0)

  return (
    <div className="space-y-6">
      {/* Delete toast */}
      <AnimatePresence>
        {deleteToast && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl border border-danger-500/30"
            style={{ background: 'rgba(239,68,68,0.15)', backdropFilter: 'blur(16px)' }}
          >
            <Trash2 className="w-4 h-4 text-danger-400" />
            <span className="text-sm font-semibold text-danger-300">Item deleted</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDeleteTarget(null)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              className="relative glass-card p-6 w-full max-w-sm"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="w-12 h-12 rounded-2xl bg-danger-500/10 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-danger-400" />
              </div>
              <h3 className="text-base font-bold text-white text-center mb-1">Delete Item?</h3>
              <p className="text-xs text-surface-400 text-center mb-5">&ldquo;{deleteTarget.title}&rdquo; will be permanently removed from your library.</p>
              <div className="flex gap-2">
                <button className="flex-1 btn-secondary text-xs py-2" onClick={() => setDeleteTarget(null)}>Cancel</button>
                <motion.button
                  className="flex-1 text-xs py-2 rounded-xl font-semibold bg-danger-500/20 text-danger-300 border border-danger-500/30 hover:bg-danger-500/30 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={confirmDelete}
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewItem && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewItem(null)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              className="relative glass-card p-6 w-full max-w-lg"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {(() => {
                    const cfg = typeConfig[previewItem.type]
                    const Icon = cfg.icon
                    return (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: cfg.bg, color: cfg.color }}>
                        <Icon className="w-3 h-3" />
                        {cfg.label}
                      </span>
                    )
                  })()}
                  {previewItem.aiGenerated && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-accent-500/10 text-accent-400">
                      <Sparkles className="w-2.5 h-2.5" /> AI
                    </span>
                  )}
                </div>
                <button onClick={() => setPreviewItem(null)} className="p-1 rounded-lg hover:bg-white/[0.08] text-surface-400">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{previewItem.title}</h3>
              <p className="text-xs text-surface-400 mb-4">{previewItem.grade} · {previewItem.subject}</p>
              {previewItem.description && (
                <p className="text-sm text-surface-300 leading-relaxed mb-4">{previewItem.description}</p>
              )}
              <div className="flex items-center gap-4 text-xs text-surface-500 mb-5">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{formatDate(previewItem.createdAt)}</span>
                <span className="flex items-center gap-1"><BarChart2 className="w-3.5 h-3.5" />{previewItem.uses} uses</span>
                {previewItem.shared && <span className="flex items-center gap-1 text-accent-400"><Share2 className="w-3.5 h-3.5" />Shared</span>}
              </div>
              {(previewItem.tags ?? []).length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {(previewItem.tags ?? []).map(t => (
                    <span key={t} className="px-2 py-0.5 rounded-full text-[10px] bg-white/[0.06] text-surface-400 border border-white/[0.06]">#{t}</span>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <motion.button className="btn-gradient text-xs flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Edit3 className="w-3.5 h-3.5" /> Open & Edit
                </motion.button>
                <button className="btn-secondary text-xs px-4">
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button className="btn-secondary text-xs px-4">
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Header */}
      <FadeUp>
        <div className="hero-mesh rounded-3xl p-6 border border-white/[0.06]">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)' }}>
                <Library className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-black text-white tracking-tight">Resource Library</h1>
                  <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-bold border border-blue-500/20">AI-Powered</span>
                </div>
                <p className="text-sm text-surface-400">Your centralized hub for lessons, worksheets, and AI-generated resources</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <motion.button className="btn-secondary text-xs px-3 py-1.5" whileHover={{ scale: 1.03 }} onClick={() => showToast('Library exported!')}>
                <Download className="w-3.5 h-3.5" /> Export
              </motion.button>
              <motion.button className="btn-secondary text-xs px-3 py-1.5" whileHover={{ scale: 1.03 }} onClick={() => showToast('Upload started!')}>
                <Upload className="w-3.5 h-3.5" /> Upload
              </motion.button>
              <motion.button className="btn-gradient text-xs" whileHover={{ scale: 1.03 }} onClick={() => showToast('New resource created!')}>
                <Plus className="w-3.5 h-3.5" /> New Resource
              </motion.button>
            </div>
          </div>
          <div className="border-t border-white/[0.06] pt-4 flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold">Total Items</span>
              <span className="text-xs font-bold text-white">{items.length}</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold">New This Week</span>
              <span className="text-xs font-bold text-success-400">{thisWeekCount}</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold">Total Uses</span>
              <span className="text-xs font-bold text-white">{totalUses}</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold">AI Generated</span>
              <span className="text-xs font-bold text-blue-400">{aiPct}%</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold">Starred</span>
              <span className="text-xs font-bold text-warning-400">{items.filter(i => i.starred).length}</span>
            </div>
          </div>
        </div>
      </FadeUp>

      {/* Stats Row */}
      <FadeUp delay={0.05}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Total Items', value: items.length.toString(), icon: FolderOpen, color: '#8b5cf6', sub: `${items.filter(i => i.starred).length} starred` },
            { label: 'New This Week', value: thisWeekCount.toString(), icon: TrendingUp, color: '#14b8a6', sub: 'Added recently' },
            { label: 'Total Uses', value: totalUses.toString(), icon: BarChart3, color: '#f97316', sub: `Avg ${Math.round(totalUses / items.length)}/item` },
            { label: 'AI-Generated', value: `${aiPct}%`, icon: Sparkles, color: '#ec4899', sub: `${items.filter(i => i.aiGenerated).length} of ${items.length} items` },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="stat-card"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + i * 0.05 }}
              whileHover={{ y: -3 }}
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3 shrink-0" style={{ backgroundColor: `${stat.color}18` }}>
                <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
              </div>
              <p className="text-xl font-black text-white">{stat.value}</p>
              <p className="text-[10px] text-surface-500 uppercase tracking-wider">{stat.label}</p>
              <p className="text-[10px] text-surface-600 mt-0.5">{stat.sub}</p>
            </motion.div>
          ))}
        </div>
      </FadeUp>

      {/* AI Insights */}
      <FadeUp delay={0.08}>
        <div className="glass-card overflow-hidden">
          <button
            className="w-full flex items-center justify-between p-4 hover:bg-white/[0.03] transition-colors"
            onClick={() => setAiOpen(o => !o)}
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-accent-500/20 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-accent-400" />
              </div>
              <span className="text-sm font-bold text-white">AI Library Insights</span>
              <span className="bg-accent-500/20 text-accent-400 text-[10px] font-bold px-2 py-0.5 rounded-full">3 recommendations</span>
            </div>
            {aiOpen ? <ChevronUp className="w-4 h-4 text-surface-400" /> : <ChevronDown className="w-4 h-4 text-surface-400" />}
          </button>
          <AnimatePresence>
            {aiOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-success-500/[0.08] border border-success-500/20">
                    <TrendingUp className="w-4 h-4 text-success-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-success-300">Top Performer</p>
                      <p className="text-[11px] text-surface-400 mt-0.5">&ldquo;Reading Comprehension Benchmark&rdquo; has 25 uses — your most-used resource. Consider creating a follow-up version.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-warning-500/[0.08] border border-warning-500/20">
                    <AlertTriangle className="w-4 h-4 text-warning-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-warning-300">Content Gap Detected</p>
                      <p className="text-[11px] text-surface-400 mt-0.5">You have no differentiated resources for ELL students in your Science collection. AI can generate adapted versions of existing materials.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-electric-500/[0.08] border border-electric-500/20">
                    <Zap className="w-4 h-4 text-electric-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-electric-300">Batch Generation Ready</p>
                      <p className="text-[11px] text-surface-400 mt-0.5">You have 3 lesson plans but no matching exit tickets. AI can auto-generate exit tickets for each lesson in one click.</p>
                      <button className="text-[10px] text-electric-400 font-semibold mt-1 hover:underline">Generate now →</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </FadeUp>

      {/* Toolbar */}
      <FadeUp delay={0.12}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
            <input
              type="text"
              placeholder="Search by title, subject, grade, or tag..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-xl text-sm text-white placeholder:text-surface-500 focus:outline-none focus:border-accent-500/40 focus:bg-white/[0.06] transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            {/* Sort */}
            <div className="relative">
              <button
                onClick={() => setShowSort(!showSort)}
                className="flex items-center gap-2 px-3 py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-xl text-xs text-surface-300 hover:bg-white/[0.06] transition-all whitespace-nowrap"
              >
                <Filter className="w-3.5 h-3.5" />
                {sortOptions.find(o => o.key === sortBy)?.label}
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <AnimatePresence>
                {showSort && (
                  <motion.div
                    className="absolute right-0 top-full mt-1 w-36 bg-surface-900 border border-white/[0.08] rounded-xl overflow-hidden shadow-xl z-50"
                    initial={{ opacity: 0, y: -4, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                  >
                    {sortOptions.map(opt => (
                      <button
                        key={opt.key}
                        onClick={() => { setSortBy(opt.key); setShowSort(false) }}
                        className={`w-full text-left px-4 py-2.5 text-xs transition-colors ${sortBy === opt.key ? 'bg-accent-500/10 text-accent-400 font-bold' : 'text-surface-300 hover:bg-white/[0.04]'}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {/* View toggle */}
            <div className="flex items-center gap-0.5 bg-white/[0.04] border border-white/[0.06] rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white/[0.1] text-white' : 'text-surface-500 hover:text-surface-300'}`}
              >
                <Grid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white/[0.1] text-white' : 'text-surface-500 hover:text-surface-300'}`}
              >
                <ListIcon className="w-3.5 h-3.5" />
              </button>
            </div>
            {/* Bulk */}
            <button
              onClick={() => { setBulkMode(b => !b); setSelected(new Set()) }}
              className={`p-2.5 rounded-xl border transition-colors ${bulkMode ? 'border-accent-500/30 bg-accent-500/10 text-accent-300' : 'border-white/[0.06] bg-white/[0.04] text-surface-400 hover:bg-white/[0.06]'}`}
              title="Select multiple"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
            {/* Upload */}
            <button className="p-2.5 rounded-xl border border-white/[0.06] bg-white/[0.04] text-surface-400 hover:bg-white/[0.06] transition-colors" title="Import file">
              <Upload className="w-3.5 h-3.5" />
            </button>
            <motion.button
              className="btn-gradient text-xs whitespace-nowrap"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Plus className="w-3.5 h-3.5" />
              Create New
            </motion.button>
          </div>
        </div>
      </FadeUp>

      {/* Filter tabs */}
      <FadeUp delay={0.15}>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {filterTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeFilter === tab.key
                  ? 'bg-accent-500/15 text-accent-400 border border-accent-500/30'
                  : 'bg-white/[0.04] text-surface-400 border border-white/[0.06] hover:bg-white/[0.06]'
              }`}
            >
              {tab.label}
              {tab.key !== 'all' && (
                <span className="ml-1.5 text-[10px] opacity-60">
                  {items.filter(i => i.type === tab.key).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </FadeUp>

      {/* Bulk action bar */}
      <AnimatePresence>
        {bulkMode && selected.size > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="glass-card p-3 flex items-center justify-between">
              <span className="text-xs text-accent-300 font-semibold">{selected.size} item{selected.size !== 1 ? 's' : ''} selected</span>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] text-xs text-surface-300 hover:bg-white/[0.1] transition-colors">
                  <Download className="w-3.5 h-3.5" /> Export
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-danger-500/10 text-xs text-danger-400 border border-danger-500/20 hover:bg-danger-500/20 transition-colors" onClick={bulkDelete}>
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collections */}
      <FadeUp delay={0.18}>
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white">Collections</h3>
            <button className="text-xs text-accent-400 hover:text-accent-300 font-semibold transition-colors">+ New Collection</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {collections.map((col, i) => (
              <motion.div
                key={col.name}
                className="glass-card p-3.5 cursor-pointer group hover:bg-white/[0.06] transition-colors"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.04 }}
                whileHover={{ y: -2 }}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg" style={{ backgroundColor: col.color + '18' }}>
                    {col.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate group-hover:text-accent-300 transition-colors">{col.name}</p>
                    <p className="text-[10px] text-surface-500">{col.count} items</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </FadeUp>

      {/* Subject breakdown */}
      <FadeUp delay={0.2}>
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-4 h-4 text-accent-400" />
            <h3 className="text-sm font-bold text-white">Content by Subject</h3>
          </div>
          {(() => {
            const colors = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#22d3ee']
            const maxC = Math.max(...topSubjects.map(([, c]) => c), 1)
            const W = 560, ROW = 18, GAP = 5, LW = 88, CW = 22, BAR_MAX = W - LW - CW - 8
            const H = topSubjects.length * (ROW + GAP)
            return (
              <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: H }}>
                <defs>
                  {topSubjects.map(([sub], i) => (
                    <linearGradient key={sub} id={`lib-bar-${i}`} x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor={colors[i]} stopOpacity="0.9" />
                      <stop offset="100%" stopColor={colors[i]} stopOpacity="0.4" />
                    </linearGradient>
                  ))}
                </defs>
                {topSubjects.map(([subject, count], i) => {
                  const y = i * (ROW + GAP)
                  const bw = (count / maxC) * BAR_MAX
                  return (
                    <g key={subject}>
                      <text x={LW - 4} y={y + ROW - 4} textAnchor="end" fill="rgba(255,255,255,0.45)" fontSize="10">{subject}</text>
                      <rect x={LW} y={y + 2} width={BAR_MAX} height={ROW - 5} rx="3" fill="rgba(255,255,255,0.04)" />
                      <motion.rect x={LW} y={y + 2} width={bw} height={ROW - 5} rx="3" fill={`url(#lib-bar-${i})`}
                        initial={{ width: 0 }} animate={{ width: bw }} transition={{ delay: 0.15 + i * 0.08, duration: 0.6, ease: 'easeOut' }} />
                      <text x={W} y={y + ROW - 4} textAnchor="end" fill={colors[i]} fontSize="10" fontWeight="700">{count}</text>
                    </g>
                  )
                })}
              </svg>
            )
          })()}
        </div>
      </FadeUp>

      {/* Items Grid / List */}
      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            className="glass-card p-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-white/[0.04]">
              <Search className="w-7 h-7 text-surface-500" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">No results found</h3>
            <p className="text-sm text-surface-400 mb-4">
              No content matches &ldquo;{search}&rdquo;{activeFilter !== 'all' ? ` in ${filterTabs.find(t => t.key === activeFilter)?.label}` : ''}
            </p>
            <button onClick={() => { setSearch(''); setActiveFilter('all') }} className="text-xs text-accent-400 hover:text-accent-300 font-semibold transition-colors">
              Clear filters
            </button>
          </motion.div>
        ) : viewMode === 'grid' ? (
          <motion.div
            key="grid"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {filtered.map((item, i) => {
              const config = typeConfig[item.type]
              const TypeIcon = config.icon
              const isSelected = selected.has(item.id)
              return (
                <motion.div
                  key={item.id}
                  className={`glass-card overflow-hidden group cursor-pointer transition-all ${isSelected ? 'ring-2 ring-accent-500/50' : ''}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -4, transition: { duration: 0.18 } }}
                  onClick={() => bulkMode ? toggleSelected(item.id) : undefined}
                >
                  <div className="h-1" style={{ backgroundColor: config.color }} />
                  <div className="p-5">
                    {/* Header row */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider" style={{ backgroundColor: config.bg, color: config.color }}>
                          <TypeIcon className="w-3 h-3" />
                          {config.label}
                        </span>
                        {item.aiGenerated && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-accent-500/10 text-accent-400">
                            <Sparkles className="w-2.5 h-2.5" /> AI
                          </span>
                        )}
                        {isNew(item.createdAt) && (
                          <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-success-500/20 text-success-400">NEW</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {bulkMode ? (
                          <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-accent-500 border-accent-500' : 'border-surface-600'}`}>
                            {isSelected && <Check className="w-3 h-3 text-white" />}
                          </div>
                        ) : (
                          <motion.button
                            onClick={e => { e.stopPropagation(); toggleStar(item.id) }}
                            className={`p-1 rounded-lg transition-colors ${item.starred ? 'text-warning-400' : 'text-surface-600 hover:text-surface-400'}`}
                            whileHover={{ scale: 1.1 }}
                          >
                            <Star className={`w-3.5 h-3.5 ${item.starred ? 'fill-warning-400' : ''}`} />
                          </motion.button>
                        )}
                      </div>
                    </div>

                    <h4 className="text-sm font-bold text-white mb-1.5 group-hover:text-accent-400 transition-colors leading-snug">{item.title}</h4>

                    <div className="flex items-center gap-2 text-xs text-surface-400 mb-2">
                      <span className="flex items-center gap-1"><GraduationCap className="w-3 h-3 text-surface-500" />{item.grade}</span>
                      <span className="text-surface-600">|</span>
                      <span>{item.subject}</span>
                      {item.shared && <span className="flex items-center gap-1 text-electric-400 ml-auto"><Share2 className="w-3 h-3" />Shared</span>}
                    </div>

                    {/* Tags */}
                    {(item.tags ?? []).length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {(item.tags ?? []).slice(0, 3).map(t => (
                          <span key={t} className="px-1.5 py-0.5 rounded-full text-[9px] bg-white/[0.05] text-surface-500 border border-white/[0.04]">#{t}</span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-3 text-[11px] text-surface-500 mb-4">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatDate(item.createdAt)}</span>
                      <span className="flex items-center gap-1"><BarChart2 className="w-3 h-3" />{item.uses} uses</span>
                    </div>

                    <div className="flex items-center gap-1 pt-3 border-t border-white/[0.06]">
                      <motion.button
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] text-surface-400 hover:text-white hover:bg-white/[0.06] transition-all"
                        onClick={e => { e.stopPropagation(); setPreviewItem(item) }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </motion.button>
                      <motion.button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] text-surface-400 hover:text-white hover:bg-white/[0.06] transition-all" whileTap={{ scale: 0.95 }}>
                        <Edit3 className="w-3.5 h-3.5" /> Edit
                      </motion.button>
                      <motion.button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] text-surface-400 hover:text-white hover:bg-white/[0.06] transition-all" whileTap={{ scale: 0.95 }}>
                        <Copy className="w-3.5 h-3.5" /> Copy
                      </motion.button>
                      <motion.button
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] text-surface-400 hover:text-danger-400 hover:bg-danger-500/10 transition-all ml-auto"
                        onClick={e => { e.stopPropagation(); setDeleteTarget(item) }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        ) : (
          /* List View */
          <motion.div
            key="list"
            className="space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {filtered.map((item, i) => {
              const config = typeConfig[item.type]
              const TypeIcon = config.icon
              const isSelected = selected.has(item.id)
              return (
                <motion.div
                  key={item.id}
                  className={`glass-card p-4 flex items-center gap-4 hover:bg-white/[0.06] transition-all cursor-pointer group ${isSelected ? 'ring-1 ring-accent-500/40' : ''}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => bulkMode ? toggleSelected(item.id) : setPreviewItem(item)}
                >
                  {bulkMode && (
                    <div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${isSelected ? 'bg-accent-500 border-accent-500' : 'border-surface-600'}`}>
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                  )}
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: config.bg }}>
                    <TypeIcon className="w-4 h-4" style={{ color: config.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h4 className="text-sm font-bold text-white truncate group-hover:text-accent-300 transition-colors">{item.title}</h4>
                      {item.aiGenerated && <Sparkles className="w-3 h-3 text-accent-400 flex-shrink-0" />}
                      {isNew(item.createdAt) && <span className="text-[9px] font-bold px-1.5 rounded-full bg-success-500/20 text-success-400 flex-shrink-0">NEW</span>}
                    </div>
                    <p className="text-[10px] text-surface-400">{item.grade} · {item.subject}</p>
                  </div>
                  <div className="hidden md:flex items-center gap-4 text-[11px] text-surface-500 flex-shrink-0">
                    <span>{item.uses} uses</span>
                    <span>{formatDate(item.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={e => { e.stopPropagation(); toggleStar(item.id) }} className={`p-1.5 rounded-lg transition-colors ${item.starred ? 'text-warning-400' : 'text-surface-600 hover:text-surface-400'}`}>
                      <Star className={`w-3.5 h-3.5 ${item.starred ? 'fill-warning-400' : ''}`} />
                    </button>
                    <button onClick={e => { e.stopPropagation(); setDeleteTarget(item) }} className="p-1.5 rounded-lg text-surface-600 hover:text-danger-400 hover:bg-danger-500/10 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toastMsg && (
          <motion.div
            className="fixed top-5 right-5 z-[100] flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl text-sm font-semibold text-white border border-white/[0.08]"
            style={{ background: 'linear-gradient(135deg,#0a0f1a,#111827)' }}
            initial={{ opacity: 0, y: -12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
            exit={{ opacity: 0, y: -12, scale: 0.95 }}
          >
            <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0" />
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
