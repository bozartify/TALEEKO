'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Library, Search, Eye, Edit3, Copy, Trash2, Sparkles, Clock,
  BookOpen, FileText, Zap, ChevronDown, TrendingUp, BarChart2,
  Star, ClipboardCheck, FolderOpen, Filter, Brain, GraduationCap
} from 'lucide-react'
import { FadeUp, FadeInWhenVisible, StaggerList, StaggerItem, fadeUp } from '@/components/ui/motion'

type ContentType = 'lesson' | 'quiz' | 'worksheet' | 'activity' | 'assessment'
type SortOption = 'newest' | 'oldest' | 'most-used' | 'a-z'
type FilterTab = 'all' | ContentType

const typeConfig: Record<ContentType, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  lesson:     { label: 'Lesson Plan',  color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)', icon: BookOpen },
  quiz:       { label: 'Quiz',         color: '#f97316', bg: 'rgba(249,115,22,0.12)', icon: Brain },
  worksheet:  { label: 'Worksheet',    color: '#14b8a6', bg: 'rgba(20,184,166,0.12)', icon: FileText },
  activity:   { label: 'Activity',     color: '#eab308', bg: 'rgba(234,179,8,0.12)',  icon: Zap },
  assessment: { label: 'Assessment',   color: '#ec4899', bg: 'rgba(236,72,153,0.12)', icon: ClipboardCheck },
}

const sampleItems = [
  {
    id: '1', type: 'lesson' as ContentType, title: 'Introduction to Photosynthesis',
    subject: 'Biology', grade: '7th Grade', createdAt: '2026-07-28', uses: 12, aiGenerated: true,
  },
  {
    id: '2', type: 'quiz' as ContentType, title: 'Fractions & Decimals Quiz',
    subject: 'Mathematics', grade: '5th Grade', createdAt: '2026-07-27', uses: 8, aiGenerated: true,
  },
  {
    id: '3', type: 'worksheet' as ContentType, title: 'Periodic Table Practice',
    subject: 'Chemistry', grade: '9th Grade', createdAt: '2026-07-26', uses: 15, aiGenerated: false,
  },
  {
    id: '4', type: 'activity' as ContentType, title: 'Historical Timeline Builder',
    subject: 'History', grade: '8th Grade', createdAt: '2026-07-25', uses: 6, aiGenerated: true,
  },
  {
    id: '5', type: 'assessment' as ContentType, title: 'Essay Writing Rubric Assessment',
    subject: 'English', grade: '10th Grade', createdAt: '2026-07-24', uses: 20, aiGenerated: true,
  },
  {
    id: '6', type: 'lesson' as ContentType, title: 'Newton\'s Laws of Motion',
    subject: 'Physics', grade: '9th Grade', createdAt: '2026-07-23', uses: 18, aiGenerated: true,
  },
  {
    id: '7', type: 'quiz' as ContentType, title: 'Spanish Vocabulary Chapter 5',
    subject: 'Spanish', grade: '6th Grade', createdAt: '2026-07-22', uses: 9, aiGenerated: false,
  },
  {
    id: '8', type: 'worksheet' as ContentType, title: 'Sentence Structure Exercises',
    subject: 'English', grade: '4th Grade', createdAt: '2026-07-21', uses: 22, aiGenerated: true,
  },
  {
    id: '9', type: 'activity' as ContentType, title: 'Geometry Shapes Scavenger Hunt',
    subject: 'Mathematics', grade: '3rd Grade', createdAt: '2026-07-20', uses: 14, aiGenerated: true,
  },
  {
    id: '10', type: 'lesson' as ContentType, title: 'Civil Rights Movement: Key Figures',
    subject: 'History', grade: '11th Grade', createdAt: '2026-07-19', uses: 7, aiGenerated: true,
  },
  {
    id: '11', type: 'assessment' as ContentType, title: 'Reading Comprehension Benchmark',
    subject: 'English', grade: '6th Grade', createdAt: '2026-07-18', uses: 25, aiGenerated: false,
  },
  {
    id: '12', type: 'worksheet' as ContentType, title: 'Chemical Bonding Practice',
    subject: 'Chemistry', grade: '10th Grade', createdAt: '2026-07-17', uses: 11, aiGenerated: true,
  },
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

export default function LibraryPage() {
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all')
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [showSort, setShowSort] = useState(false)

  const filtered = sampleItems
    .filter(item => {
      if (activeFilter !== 'all' && item.type !== activeFilter) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        return (
          item.title.toLowerCase().includes(q) ||
          item.subject.toLowerCase().includes(q) ||
          item.grade.toLowerCase().includes(q)
        )
      }
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':   return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'oldest':   return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'most-used': return b.uses - a.uses
        case 'a-z':      return a.title.localeCompare(b.title)
        default:         return 0
      }
    })

  const thisWeekCount = sampleItems.filter(item => {
    const d = new Date(item.createdAt)
    const now = new Date()
    const diffDays = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)
    return diffDays <= 7
  }).length

  const subjects = sampleItems.map(i => i.subject)
  const subjectCounts: Record<string, number> = {}
  subjects.forEach(s => { subjectCounts[s] = (subjectCounts[s] || 0) + 1 })
  const popularSubject = Object.entries(subjectCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'

  const aiPct = Math.round((sampleItems.filter(i => i.aiGenerated).length / sampleItems.length) * 100)

  const stats = [
    { label: 'Total Items', value: sampleItems.length.toString(), icon: FolderOpen, color: '#8b5cf6' },
    { label: 'This Week', value: thisWeekCount.toString(), icon: TrendingUp, color: '#14b8a6' },
    { label: 'Most Popular', value: popularSubject, icon: Star, color: '#f97316' },
    { label: 'AI-Generated', value: `${aiPct}%`, icon: Sparkles, color: '#ec4899' },
  ]

  return (
    <div className="space-y-6">
      <FadeUp>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)' }}
              whileHover={{ rotate: 8, scale: 1.08 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <Library className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h2 className="text-xl font-black text-white">Content Library</h2>
              <p className="text-xs text-surface-400">{sampleItems.length} items · AI-generated teaching materials</p>
            </div>
          </div>
        </div>
      </FadeUp>

      <FadeUp delay={0.05}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="glass-card p-4 flex items-center gap-3"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + i * 0.05 }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${stat.color}18` }}
              >
                <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
              </div>
              <div className="min-w-0">
                <p className="text-lg font-black text-white leading-tight truncate">{stat.value}</p>
                <p className="text-[10px] text-surface-500 uppercase tracking-wider">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </FadeUp>

      <FadeUp delay={0.1}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
            <input
              type="text"
              placeholder="Search by title, subject, or grade..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-xl text-sm text-white placeholder:text-surface-500 focus:outline-none focus:border-accent-500/40 focus:bg-white/[0.06] transition-all"
            />
          </div>
          <div className="relative">
            <button
              onClick={() => setShowSort(!showSort)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-xl text-sm text-surface-300 hover:bg-white/[0.06] transition-all whitespace-nowrap"
            >
              <Filter className="w-3.5 h-3.5" />
              {sortOptions.find(o => o.key === sortBy)?.label}
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            <AnimatePresence>
              {showSort && (
                <motion.div
                  className="absolute right-0 top-full mt-1 w-40 bg-surface-900 border border-white/[0.08] rounded-xl overflow-hidden shadow-xl z-50"
                  initial={{ opacity: 0, y: -4, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                >
                  {sortOptions.map(opt => (
                    <button
                      key={opt.key}
                      onClick={() => { setSortBy(opt.key); setShowSort(false) }}
                      className={`w-full text-left px-4 py-2.5 text-xs transition-colors ${
                        sortBy === opt.key
                          ? 'bg-accent-500/10 text-accent-400 font-bold'
                          : 'text-surface-300 hover:bg-white/[0.04]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </FadeUp>

      <FadeUp delay={0.15}>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
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
                  {sampleItems.filter(i => i.type === tab.key).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </FadeUp>

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
                className="glass-card p-3.5 cursor-pointer group"
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

      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            className="glass-card p-12 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-white/[0.04]">
              <Search className="w-7 h-7 text-surface-500" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">No results found</h3>
            <p className="text-sm text-surface-400 mb-4">
              No content matches &ldquo;{search}&rdquo;{activeFilter !== 'all' ? ` in ${filterTabs.find(t => t.key === activeFilter)?.label}` : ''}
            </p>
            <button
              onClick={() => { setSearch(''); setActiveFilter('all') }}
              className="text-xs text-accent-400 hover:text-accent-300 font-semibold transition-colors"
            >
              Clear filters
            </button>
          </motion.div>
        ) : (
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
              return (
                <motion.div
                  key={item.id}
                  className="glass-card overflow-hidden group cursor-pointer"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -4, transition: { duration: 0.18 } }}
                >
                  <div className="h-1" style={{ backgroundColor: config.color }} />
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                        style={{ backgroundColor: config.bg, color: config.color }}
                      >
                        <TypeIcon className="w-3 h-3" />
                        {config.label}
                      </span>
                      {item.aiGenerated && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-accent-500/10 text-accent-400">
                          <Sparkles className="w-2.5 h-2.5" />
                          AI
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-white mb-1.5 group-hover:text-accent-400 transition-colors leading-snug">
                      {item.title}
                    </h4>

                    <div className="flex items-center gap-2 text-xs text-surface-400 mb-3">
                      <span className="flex items-center gap-1">
                        <GraduationCap className="w-3 h-3 text-surface-500" />
                        {item.grade}
                      </span>
                      <span className="text-surface-600">|</span>
                      <span>{item.subject}</span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-surface-500 mb-4">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(item.createdAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <BarChart2 className="w-3 h-3" />
                        {item.uses} uses
                      </span>
                    </div>

                    <div className="flex items-center gap-1 pt-3 border-t border-white/[0.06]">
                      <motion.button
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] text-surface-400 hover:text-white hover:bg-white/[0.06] transition-all"
                        whileTap={{ scale: 0.95 }}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </motion.button>
                      <motion.button
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] text-surface-400 hover:text-white hover:bg-white/[0.06] transition-all"
                        whileTap={{ scale: 0.95 }}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Edit
                      </motion.button>
                      <motion.button
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] text-surface-400 hover:text-white hover:bg-white/[0.06] transition-all"
                        whileTap={{ scale: 0.95 }}
                      >
                        <Copy className="w-3.5 h-3.5" />
                        Duplicate
                      </motion.button>
                      <motion.button
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] text-surface-400 hover:text-red-400 hover:bg-red-500/10 transition-all ml-auto"
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
        )}
      </AnimatePresence>
    </div>
  )
}
