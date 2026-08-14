'use client'
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield, Search, ChevronDown, BookOpen, Check,
  Plus, Filter, Star, Zap, Target, Link2,
  Layers, TrendingUp, AlertTriangle, Brain,
  BarChart2, Download, RefreshCw, ChevronRight,
  Globe, BookMarked, Sparkles, X, Eye, Copy,
  CheckCircle, Clock, GraduationCap, Flag, Info
} from 'lucide-react'
import { FadeUp, FadeInWhenVisible } from '@/components/ui/motion'

type FrameworkId = 'ccss' | 'ngss' | 'ib' | 'cam' | 'ap' | 'state'
type FilterTab = 'all' | 'aligned' | 'gaps' | 'starred'
type ViewMode = 'browser' | 'gaps' | 'compare'

interface Standard {
  code: string
  text: string
  aligned: boolean
  lessons: number
  starred: boolean
  gradeRange: string
  difficulty: 'foundational' | 'developing' | 'proficient' | 'advanced'
}

interface Domain {
  domain: string
  code: string
  color: string
  standards: Standard[]
}

interface Framework {
  id: FrameworkId
  name: string
  shortName: string
  icon: string
  standards: number
  aligned: number
  color: string
  description: string
  grades: string
}

const frameworks: Framework[] = [
  { id: 'ccss', name: 'Common Core State Standards', shortName: 'CCSS', icon: '🇺🇸', standards: 1465, aligned: 42, color: '#8b5cf6', description: 'K-12 English Language Arts & Mathematics', grades: 'K-12' },
  { id: 'ngss', name: 'Next Generation Science Standards', shortName: 'NGSS', icon: '🔬', standards: 286, aligned: 18, color: '#14b8a6', description: 'K-12 Science & Engineering Practices', grades: 'K-12' },
  { id: 'ib',   name: 'International Baccalaureate', shortName: 'IB', icon: '🌍', standards: 340, aligned: 8, color: '#f97316', description: 'MYP, DP, and PYP Frameworks', grades: '3-12' },
  { id: 'cam',  name: 'Cambridge International', shortName: 'IGCSE', icon: '🇬🇧', standards: 280, aligned: 5, color: '#6366f1', description: 'IGCSE and A-Level Curriculum', grades: '9-12' },
  { id: 'ap',   name: 'AP Curriculum Framework', shortName: 'AP', icon: '📚', standards: 192, aligned: 12, color: '#f43f5e', description: 'College Board Advanced Placement', grades: '9-12' },
  { id: 'state', name: 'State Standards', shortName: 'State', icon: '📋', standards: 890, aligned: 15, color: '#0891b2', description: 'California, Texas, New York + 47 states', grades: 'K-12' },
]

const ccssStandards: Domain[] = [
  {
    domain: 'Reading: Literature',
    code: 'RL',
    color: '#8b5cf6',
    standards: [
      { code: 'RL.7.1', text: 'Cite several pieces of textual evidence to support analysis of what the text says explicitly as well as inferences drawn from the text.', aligned: true, lessons: 3, starred: true, gradeRange: 'Grade 7', difficulty: 'proficient' },
      { code: 'RL.7.2', text: 'Determine a theme or central idea of a text and analyze its development over the course of the text; provide an objective summary of the text.', aligned: true, lessons: 2, starred: false, gradeRange: 'Grade 7', difficulty: 'proficient' },
      { code: 'RL.7.3', text: 'Analyze how particular elements of a story or drama interact (e.g., how setting shapes the characters or plot).', aligned: false, lessons: 0, starred: false, gradeRange: 'Grade 7', difficulty: 'developing' },
      { code: 'RL.7.4', text: 'Determine the meaning of words and phrases as they are used in a text, including figurative and connotative meanings; analyze the impact of rhymes and other repetitions of sounds.', aligned: true, lessons: 1, starred: false, gradeRange: 'Grade 7', difficulty: 'advanced' },
      { code: 'RL.7.5', text: 'Analyze how a drama\'s or poem\'s form or structure contributes to its meaning.', aligned: false, lessons: 0, starred: false, gradeRange: 'Grade 7', difficulty: 'advanced' },
      { code: 'RL.7.6', text: 'Analyze how an author develops and contrasts the points of view of different characters or narrators in a text.', aligned: true, lessons: 2, starred: true, gradeRange: 'Grade 7', difficulty: 'proficient' },
    ]
  },
  {
    domain: 'Reading: Informational Text',
    code: 'RI',
    color: '#6366f1',
    standards: [
      { code: 'RI.7.1', text: 'Cite several pieces of textual evidence to support analysis of what the text says explicitly as well as inferences drawn from the text.', aligned: true, lessons: 4, starred: false, gradeRange: 'Grade 7', difficulty: 'proficient' },
      { code: 'RI.7.2', text: 'Determine two or more central ideas in a text and analyze their development over the course of the text.', aligned: false, lessons: 0, starred: false, gradeRange: 'Grade 7', difficulty: 'advanced' },
      { code: 'RI.7.3', text: 'Analyze the interactions between individuals, events, and ideas in a text.', aligned: true, lessons: 1, starred: false, gradeRange: 'Grade 7', difficulty: 'proficient' },
      { code: 'RI.7.4', text: 'Determine the meaning of words and phrases as they are used in a text, including figurative, connotative, and technical meanings.', aligned: false, lessons: 0, starred: false, gradeRange: 'Grade 7', difficulty: 'developing' },
    ]
  },
  {
    domain: 'Writing',
    code: 'W',
    color: '#14b8a6',
    standards: [
      { code: 'W.7.1', text: 'Write arguments to support claims with clear reasons and relevant evidence. Introduce claims, acknowledge alternate or opposing claims, and organize the reasons and evidence logically.', aligned: true, lessons: 4, starred: true, gradeRange: 'Grade 7', difficulty: 'proficient' },
      { code: 'W.7.2', text: 'Write informative/explanatory texts to examine a topic and convey ideas, concepts, and information through the selection, organization, and analysis of relevant content.', aligned: false, lessons: 0, starred: false, gradeRange: 'Grade 7', difficulty: 'developing' },
      { code: 'W.7.3', text: 'Write narratives to develop real or imagined experiences or events using effective technique, relevant descriptive details, and well-structured event sequences.', aligned: true, lessons: 2, starred: false, gradeRange: 'Grade 7', difficulty: 'advanced' },
      { code: 'W.7.4', text: 'Produce clear and coherent writing in which the development, organization, and style are appropriate to task, purpose, and audience.', aligned: true, lessons: 3, starred: false, gradeRange: 'Grade 7', difficulty: 'proficient' },
    ]
  },
  {
    domain: 'Speaking & Listening',
    code: 'SL',
    color: '#f97316',
    standards: [
      { code: 'SL.7.1', text: 'Engage effectively in a range of collaborative discussions with diverse partners on grade 7 topics, texts, and issues, building on others\' ideas and expressing their own clearly.', aligned: false, lessons: 0, starred: false, gradeRange: 'Grade 7', difficulty: 'foundational' },
      { code: 'SL.7.4', text: 'Present claims and findings, emphasizing salient points in a focused, coherent manner with pertinent descriptions, facts, details, and examples.', aligned: true, lessons: 1, starred: false, gradeRange: 'Grade 7', difficulty: 'proficient' },
      { code: 'SL.7.5', text: 'Include multimedia components and visual displays in presentations to clarify claims and findings and emphasize salient points.', aligned: false, lessons: 0, starred: false, gradeRange: 'Grade 7', difficulty: 'developing' },
    ]
  },
  {
    domain: 'Language',
    code: 'L',
    color: '#ec4899',
    standards: [
      { code: 'L.7.1', text: 'Demonstrate command of the conventions of standard English grammar and usage when writing or speaking.', aligned: true, lessons: 5, starred: true, gradeRange: 'Grade 7', difficulty: 'foundational' },
      { code: 'L.7.2', text: 'Demonstrate command of the conventions of standard English capitalization, punctuation, and spelling when writing.', aligned: true, lessons: 2, starred: false, gradeRange: 'Grade 7', difficulty: 'foundational' },
      { code: 'L.7.3', text: 'Use knowledge of language and its conventions when writing, speaking, reading, or listening.', aligned: false, lessons: 0, starred: false, gradeRange: 'Grade 7', difficulty: 'developing' },
      { code: 'L.7.4', text: 'Determine or clarify the meaning of unknown and multiple-meaning words and phrases based on grade 7 reading and content.', aligned: true, lessons: 2, starred: false, gradeRange: 'Grade 7', difficulty: 'proficient' },
    ]
  },
]

const gapAreas = [
  { standard: 'RL.7.3', domain: 'Reading: Literature', priority: 'high', suggestion: 'Create a character analysis lesson focused on how setting shapes plot — pairs well with your current unit.', impact: 'High impact' },
  { standard: 'RI.7.2', domain: 'Informational Text', priority: 'medium', suggestion: 'Add a nonfiction article comparison activity to your existing close-reading lessons.', impact: 'Medium impact' },
  { standard: 'SL.7.1', domain: 'Speaking & Listening', priority: 'medium', suggestion: 'Incorporate a Socratic seminar or fishbowl discussion into your current narrative unit.', impact: 'Medium impact' },
  { standard: 'W.7.2', domain: 'Writing', priority: 'low', suggestion: 'Assign a how-to or explanatory essay as a cross-curricular project with Science.', impact: 'Low impact' },
  { standard: 'SL.7.5', domain: 'Speaking & Listening', priority: 'low', suggestion: 'Add a multimedia presentation component to your next major project.', impact: 'Low impact' },
]

const aiSuggestions = [
  { title: 'Quick Win: RL.7.3 Alignment', desc: 'Generate a character-setting interaction lesson for your current Shakespeare unit in 30 seconds.', icon: Zap, color: '#f97316', time: '2 min' },
  { title: 'Bundle SL Standards', desc: 'Your upcoming debate activity can simultaneously cover SL.7.1, SL.7.4, and SL.7.5.', icon: Layers, color: '#8b5cf6', time: '5 min' },
  { title: 'Cross-Curricular Link', desc: 'RI.7.2 aligns with your History class\'s primary source analysis — share resources.', icon: Link2, color: '#14b8a6', time: '3 min' },
]

const difficultyConfig = {
  foundational: { label: 'Foundational', color: '#22d3ee', bg: 'bg-electric-400/15' },
  developing: { label: 'Developing', color: '#f59e0b', bg: 'bg-warning-400/15' },
  proficient: { label: 'Proficient', color: '#6366f1', bg: 'bg-accent-500/15' },
  advanced: { label: 'Advanced', color: '#ec4899', bg: 'bg-pink-500/15' },
} as const

export default function StandardsPage() {
  const [selectedFramework, setSelectedFramework] = useState<FrameworkId>('ccss')
  const [expandedDomains, setExpandedDomains] = useState<string[]>(['Reading: Literature'])
  const [search, setSearch] = useState('')
  const [filterTab, setFilterTab] = useState<FilterTab>('all')
  const [viewMode, setViewMode] = useState<ViewMode>('browser')
  const [selectedStandard, setSelectedStandard] = useState<Standard | null>(null)
  const [starred, setStarred] = useState<Set<string>>(new Set(['RL.7.1', 'RL.7.6', 'W.7.1', 'L.7.1']))
  const [compareList, setCompareList] = useState<string[]>([])
  const [gradeFilter, setGradeFilter] = useState('all')
  const [toastMsg, setToastMsg] = useState('')
  function showToast(msg: string) {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 2500)
  }

  const selectedFw = frameworks.find(f => f.id === selectedFramework)!

  const allStandards = useMemo(() =>
    ccssStandards.flatMap(d => d.standards),
    []
  )

  const filteredDomains = useMemo(() => {
    return ccssStandards.map(domain => ({
      ...domain,
      standards: domain.standards.filter(std => {
        const matchesSearch = search === '' ||
          std.code.toLowerCase().includes(search.toLowerCase()) ||
          std.text.toLowerCase().includes(search.toLowerCase())
        const matchesFilter =
          filterTab === 'all' ? true :
          filterTab === 'aligned' ? std.aligned :
          filterTab === 'gaps' ? !std.aligned :
          filterTab === 'starred' ? starred.has(std.code) : true
        const matchesGrade = gradeFilter === 'all' || std.gradeRange === gradeFilter
        return matchesSearch && matchesFilter && matchesGrade
      })
    })).filter(d => d.standards.length > 0)
  }, [search, filterTab, gradeFilter, starred])

  function toggleDomain(domain: string) {
    setExpandedDomains(prev =>
      prev.includes(domain) ? prev.filter(d => d !== domain) : [...prev, domain]
    )
  }

  function toggleStar(code: string) {
    setStarred(prev => {
      const next = new Set(prev)
      if (next.has(code)) next.delete(code)
      else next.add(code)
      return next
    })
  }

  function toggleCompare(code: string) {
    setCompareList(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) :
      prev.length < 4 ? [...prev, code] : prev
    )
  }

  const totalAligned = allStandards.filter(s => s.aligned).length
  const totalStars = starred.size
  const coveragePct = Math.round((totalAligned / allStandards.length) * 100)
  const gapCount = allStandards.filter(s => !s.aligned).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <FadeUp>
        <div className="hero-mesh rounded-3xl p-6 border border-white/[0.06]">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' }}
                whileHover={{ rotate: 8, scale: 1.08 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <Shield className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h2 className="text-xl font-black text-white">Standards Library</h2>
                <p className="text-xs text-surface-400">Align your curriculum across 6 national and international frameworks</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1 bg-white/[0.06] rounded-full p-0.5 text-xs">
                {(['browser', 'gaps', 'compare'] as ViewMode[]).map(m => (
                  <button
                    key={m}
                    onClick={() => setViewMode(m)}
                    className={`px-3 py-1 rounded-full transition-all capitalize ${
                      viewMode === m ? 'bg-white/[0.1] text-white' : 'text-surface-500 hover:text-surface-300'
                    }`}
                  >
                    {m === 'browser' ? 'Browser' : m === 'gaps' ? 'Gap Analysis' : 'Compare'}
                  </button>
                ))}
              </div>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-surface-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search standards..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 text-xs rounded-full border border-white/[0.08] bg-white/[0.04] text-surface-200 placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-accent-500 w-52 transition-all"
                />
                {search && (
                  <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-500 hover:text-surface-300">
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
              <button className="btn-secondary text-xs px-3 py-1.5" onClick={() => showToast('Standards exported as PDF')}>
                <Download className="w-3.5 h-3.5" /> Export
              </button>
            </div>
          </div>
        </div>
      </FadeUp>

      {/* Stats row */}
      <FadeUp delay={0.05}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Standards Aligned', value: totalAligned.toString(), sub: `of ${allStandards.length} total`, icon: CheckCircle, color: '#10b981' },
            { label: 'Coverage Rate', value: `${coveragePct}%`, sub: 'across all domains', icon: Target, color: '#8b5cf6' },
            { label: 'Gap Areas', value: gapCount.toString(), sub: 'need lesson alignment', icon: AlertTriangle, color: '#f59e0b' },
            { label: 'Bookmarked', value: totalStars.toString(), sub: 'priority standards', icon: Star, color: '#f43f5e' },
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
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: stat.color + '20' }}>
                  <stat.icon className="w-3.5 h-3.5" style={{ color: stat.color }} />
                </div>
                <span className="text-xs text-surface-400">{stat.label}</span>
              </div>
              <p className="text-2xl font-black text-white">{stat.value}</p>
              <p className="text-[10px] text-surface-500 mt-0.5">{stat.sub}</p>
            </motion.div>
          ))}
        </div>
      </FadeUp>

      {/* AI Insight Banner */}
      <FadeUp delay={0.08}>
        <div className="glass-card p-4 border border-accent-500/20">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
              <Brain className="w-4.5 h-4.5 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-bold text-white">AI Alignment Assistant</span>
                <span className="text-[10px] bg-accent-500/20 text-accent-400 px-2 py-0.5 rounded-full font-semibold">5 suggestions</span>
              </div>
              <p className="text-xs text-surface-400 leading-relaxed">Based on your current lesson plans, I found 5 unaligned standards that can be covered with minor adjustments. The highest-priority gap is <span className="text-white font-semibold">RL.7.3</span> (character-setting interaction) — I can generate a lesson for it in 30 seconds.</p>
              <div className="flex items-center gap-3 mt-2">
                <motion.button
                  className="text-xs text-accent-400 hover:text-accent-300 font-semibold"
                  whileHover={{ x: 2 }}
                >
                  View all suggestions →
                </motion.button>
                <button className="text-xs text-surface-500 hover:text-surface-300">Dismiss</button>
              </div>
            </div>
          </div>
        </div>
      </FadeUp>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Framework selector */}
        <FadeUp delay={0.1}>
          <div className="lg:col-span-1 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white mb-3">Frameworks</h3>
              <div className="space-y-2">
                {frameworks.map((fw, i) => {
                  const pct = Math.round((fw.aligned / fw.standards) * 100)
                  return (
                    <motion.button
                      key={fw.id}
                      onClick={() => setSelectedFramework(fw.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                        selectedFramework === fw.id
                          ? 'bg-accent-500/10 border border-accent-500/30'
                          : 'glass-card hover:border-white/[0.12]'
                      }`}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + i * 0.05 }}
                      whileHover={{ x: 2 }}
                    >
                      <span className="text-xl flex-shrink-0">{fw.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white truncate">{fw.shortName}</p>
                        <p className="text-[10px] text-surface-500 truncate">{fw.aligned} aligned · {pct}%</p>
                        {(() => {
                          const W = 120, H = 4
                          const bw = (pct / 100) * W
                          const gid = `std-fw2-${fw.id ?? i}`
                          return (
                            <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible mt-1.5">
                              <defs>
                                <linearGradient id={gid} x1="0" x2="1" y1="0" y2="0">
                                  <stop offset="0%" stopColor={fw.color} />
                                  <stop offset="100%" stopColor={fw.color + '80'} />
                                </linearGradient>
                              </defs>
                              <rect x={0} y={0} width={W} height={H} rx={2} fill="rgba(255,255,255,0.06)" />
                              <motion.rect
                                x={0} y={0} height={H} rx={2}
                                fill={`url(#${gid})`}
                                initial={{ width: 0 }}
                                animate={{ width: bw }}
                                transition={{ delay: 0.3 + i * 0.08, duration: 0.6 }}
                              />
                            </svg>
                          )
                        })()}
                      </div>
                      {selectedFramework === fw.id && (
                        <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: fw.color + '30' }}>
                          <Check className="w-2.5 h-2.5" style={{ color: fw.color }} />
                        </div>
                      )}
                    </motion.button>
                  )
                })}
              </div>
            </div>

            {/* Grade filter */}
            <div className="glass-card p-3">
              <h4 className="text-xs font-semibold text-surface-300 mb-2">Grade Level</h4>
              <div className="space-y-1">
                {['all', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9'].map(g => (
                  <button
                    key={g}
                    onClick={() => setGradeFilter(g)}
                    className={`w-full text-left text-xs px-2 py-1.5 rounded-lg transition-colors ${
                      gradeFilter === g ? 'bg-white/[0.08] text-white' : 'text-surface-400 hover:text-surface-200'
                    }`}
                  >
                    {g === 'all' ? 'All Grades' : g}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div className="glass-card p-3 space-y-2">
              <h4 className="text-xs font-semibold text-surface-300 mb-2">Quick Actions</h4>
              <button className="w-full flex items-center gap-2 text-xs text-surface-400 hover:text-white px-2 py-1.5 rounded-lg hover:bg-white/[0.04] transition-colors">
                <Sparkles className="w-3.5 h-3.5 text-accent-400" /> Auto-align with AI
              </button>
              <button className="w-full flex items-center gap-2 text-xs text-surface-400 hover:text-white px-2 py-1.5 rounded-lg hover:bg-white/[0.04] transition-colors">
                <Download className="w-3.5 h-3.5 text-surface-400" /> Export alignment report
              </button>
              <button className="w-full flex items-center gap-2 text-xs text-surface-400 hover:text-white px-2 py-1.5 rounded-lg hover:bg-white/[0.04] transition-colors">
                <RefreshCw className="w-3.5 h-3.5 text-surface-400" /> Sync with lessons
              </button>
              <button className="w-full flex items-center gap-2 text-xs text-surface-400 hover:text-white px-2 py-1.5 rounded-lg hover:bg-white/[0.04] transition-colors">
                <Globe className="w-3.5 h-3.5 text-surface-400" /> Compare frameworks
              </button>
            </div>
          </div>
        </FadeUp>

        {/* Right: Main content area */}
        <div className="lg:col-span-3 space-y-4">
          <AnimatePresence mode="wait">
            {/* BROWSER VIEW */}
            {viewMode === 'browser' && (
              <motion.div
                key="browser"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-4"
              >
                {/* Header */}
                <FadeUp delay={0.12}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white">{selectedFw.name}</h3>
                      <p className="text-xs text-surface-400">{selectedFw.standards} standards · {selectedFw.aligned} aligned · {selectedFw.grades} · {selectedFw.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="btn-secondary text-xs px-3 py-1.5">
                        <Filter className="w-3 h-3" /> Filter
                      </button>
                      <motion.button
                        className="btn-gradient text-xs"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <Zap className="w-3 h-3" /> Auto-Align All
                      </motion.button>
                    </div>
                  </div>
                </FadeUp>

                {/* Coverage bar */}
                <FadeUp delay={0.14}>
                  <div className="glass-card p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <BarChart2 className="w-4 h-4 text-surface-400" />
                        <span className="text-xs font-semibold text-surface-200">Overall Alignment Coverage</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-white">{coveragePct}%</span>
                        <span className="text-[10px] text-success-400 font-semibold">+5% this week</span>
                      </div>
                    </div>
                    {(() => {
                      const bw = (coveragePct / 100) * 500
                      return (
                        <svg viewBox="0 0 500 14" className="w-full overflow-visible">
                          <defs>
                            <linearGradient id="std-cov-main" x1="0" y1="0" x2="1" y2="0">
                              <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.95} />
                              <stop offset="100%" stopColor="#6d28d9" stopOpacity={0.85} />
                            </linearGradient>
                          </defs>
                          <rect x={0} y={2} width={500} height={10} rx={5} fill="rgba(255,255,255,0.05)" />
                          <motion.rect x={0} y={2} height={10} rx={5} fill="url(#std-cov-main)"
                            initial={{ width: 0 }} animate={{ width: bw }}
                            transition={{ delay: 0.3, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                          />
                        </svg>
                      )
                    })()}
                    <div className="flex items-center justify-between mt-2 text-[10px] text-surface-500">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-accent-500" /> Covered ({totalAligned})</span>
                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-white/[0.12]" /> Gap ({gapCount})</span>
                      </div>
                      <span>Target: 90% by year end</span>
                    </div>
                  </div>
                </FadeUp>

                {/* Filter tabs */}
                <div className="flex items-center gap-1 bg-white/[0.04] rounded-full p-0.5 w-fit">
                  {([['all', 'All'], ['aligned', 'Aligned'], ['gaps', 'Gaps'], ['starred', 'Starred']] as [FilterTab, string][]).map(([tab, label]) => (
                    <button
                      key={tab}
                      onClick={() => setFilterTab(tab)}
                      className={`px-3 py-1 rounded-full text-xs transition-all ${
                        filterTab === tab ? 'bg-white/[0.1] text-white font-semibold' : 'text-surface-500 hover:text-surface-300'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {/* Standards domains accordion */}
                <div className="space-y-2">
                  {filteredDomains.map((domain, di) => {
                    const alignedCount = domain.standards.filter(s => s.aligned).length
                    const domainPct = Math.round((alignedCount / domain.standards.length) * 100)
                    const isExpanded = expandedDomains.includes(domain.domain)
                    return (
                      <motion.div
                        key={domain.domain}
                        className="glass-card overflow-hidden"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.18 + di * 0.06 }}
                      >
                        <button
                          onClick={() => toggleDomain(domain.domain)}
                          className="w-full flex items-center gap-3 p-4 hover:bg-white/[0.03] transition-colors"
                        >
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black text-white flex-shrink-0" style={{ backgroundColor: domain.color + '25' }}>
                            <span style={{ color: domain.color }}>{domain.code}</span>
                          </div>
                          <div className="flex-1 text-left">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-bold text-white">{domain.domain}</p>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium ${
                                domainPct === 100 ? 'bg-success-500/15 text-success-400' :
                                domainPct >= 50 ? 'bg-accent-500/15 text-accent-400' :
                                'bg-warning-500/15 text-warning-400'
                              }`}>
                                {domainPct}% covered
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-[10px] text-surface-500">
                              <span>{domain.standards.length} standards</span>
                              <span>{alignedCount} aligned</span>
                              <span>{domain.standards.length - alignedCount} gaps</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {(() => {
                              const W = 64, H = 6
                              const bw = (domainPct / 100) * W
                              const gid = `std-dom-${domain.color.replace(/[^a-z0-9]/gi, '')}`
                              return (
                                <svg viewBox={`0 0 ${W} ${H}`} width={64} height={6} className="overflow-visible">
                                  <defs>
                                    <linearGradient id={gid} x1="0" x2="1" y1="0" y2="0">
                                      <stop offset="0%" stopColor={domain.color} />
                                      <stop offset="100%" stopColor={domain.color + '80'} />
                                    </linearGradient>
                                  </defs>
                                  <rect x={0} y={0} width={W} height={H} rx={3} fill="rgba(255,255,255,0.06)" />
                                  <rect x={0} y={0} width={bw} height={H} rx={3} fill={`url(#${gid})`} />
                                </svg>
                              )
                            })()}
                            <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                              <ChevronDown className="w-4 h-4 text-surface-500" />
                            </motion.div>
                          </div>
                        </button>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25 }}
                              className="overflow-hidden"
                            >
                              <div className="border-t border-white/[0.06]">
                                {domain.standards.map((std, si) => {
                                  const isStarred = starred.has(std.code)
                                  const isSelected = selectedStandard?.code === std.code
                                  const inCompare = compareList.includes(std.code)
                                  const diff = difficultyConfig[std.difficulty]
                                  return (
                                    <motion.div
                                      key={std.code}
                                      className={`flex items-start gap-3 px-4 py-3.5 border-b border-white/[0.04] last:border-0 cursor-pointer transition-colors ${
                                        isSelected ? 'bg-accent-500/[0.08]' : 'hover:bg-white/[0.03]'
                                      }`}
                                      initial={{ opacity: 0, x: -6 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: si * 0.04 }}
                                      onClick={() => setSelectedStandard(isSelected ? null : std)}
                                    >
                                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                                        std.aligned ? 'bg-success-500/25' : 'bg-white/[0.06]'
                                      }`}>
                                        {std.aligned ? (
                                          <Check className="w-3 h-3 text-success-400" />
                                        ) : (
                                          <span className="w-1.5 h-1.5 rounded-full bg-surface-500" />
                                        )}
                                      </div>

                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap mb-1">
                                          <span className="text-xs font-black" style={{ color: domain.color }}>{std.code}</span>
                                          <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium ${diff.bg}`} style={{ color: diff.color }}>
                                            {diff.label}
                                          </span>
                                          {std.aligned && std.lessons > 0 && (
                                            <span className="text-[10px] text-surface-500">
                                              {std.lessons} lesson{std.lessons !== 1 ? 's' : ''}
                                            </span>
                                          )}
                                        </div>
                                        <p className="text-xs text-surface-300 leading-relaxed">{std.text}</p>
                                        <p className="text-[10px] text-surface-500 mt-1">{std.gradeRange}</p>
                                      </div>

                                      <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                                        <button
                                          className={`p-1 rounded-lg transition-colors ${isStarred ? 'text-yellow-400' : 'text-surface-600 hover:text-surface-400'}`}
                                          onClick={e => { e.stopPropagation(); toggleStar(std.code) }}
                                        >
                                          <Star className={`w-3.5 h-3.5 ${isStarred ? 'fill-yellow-400' : ''}`} />
                                        </button>
                                        {!std.aligned && (
                                          <button
                                            className="btn-outline text-[10px] px-2 py-1"
                                            onClick={e => { e.stopPropagation() }}
                                          >
                                            <Link2 className="w-2.5 h-2.5" /> Align
                                          </button>
                                        )}
                                      </div>
                                    </motion.div>
                                  )
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )
                  })}

                  {filteredDomains.length === 0 && (
                    <motion.div className="glass-card p-10 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <Search className="w-8 h-8 text-surface-600 mx-auto mb-3" />
                      <p className="text-sm font-semibold text-surface-300">No standards match your search</p>
                      <p className="text-xs text-surface-500 mt-1">Try adjusting your filters or search terms</p>
                      <button className="btn-secondary text-xs mt-3 px-4 py-1.5" onClick={() => { setSearch(''); setFilterTab('all') }}>
                        Clear Filters
                      </button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {/* GAP ANALYSIS VIEW */}
            {viewMode === 'gaps' && (
              <motion.div
                key="gaps"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">Gap Analysis</h3>
                    <p className="text-xs text-surface-400">{gapCount} unaligned standards · AI-prioritized by impact</p>
                  </div>
                  <motion.button className="btn-gradient text-xs" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Sparkles className="w-3.5 h-3.5" /> Fill All Gaps with AI
                  </motion.button>
                </div>

                {/* AI Suggestions */}
                <div className="glass-card p-4 border border-accent-500/15">
                  <h4 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
                    <Brain className="w-3.5 h-3.5 text-accent-400" /> AI Quick Wins
                  </h4>
                  <div className="space-y-3">
                    {aiSuggestions.map((s, i) => (
                      <motion.div
                        key={s.title}
                        className="flex items-start gap-3 p-3 bg-white/[0.03] rounded-xl border border-white/[0.06] hover:border-white/[0.12] transition-colors cursor-pointer"
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06 }}
                        whileHover={{ x: 2 }}
                      >
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: s.color + '20' }}>
                          <s.icon className="w-4 h-4" style={{ color: s.color }} />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-bold text-white">{s.title}</p>
                          <p className="text-[10px] text-surface-400 leading-relaxed mt-0.5">{s.desc}</p>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-surface-500">
                          <Clock className="w-3 h-3" /> {s.time}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Gap list */}
                <div className="space-y-2">
                  {gapAreas.map((gap, i) => (
                    <motion.div
                      key={gap.standard}
                      className="glass-card p-4"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          gap.priority === 'high' ? 'bg-danger-500/20' :
                          gap.priority === 'medium' ? 'bg-warning-500/20' :
                          'bg-surface-500/20'
                        }`}>
                          <Flag className={`w-3.5 h-3.5 ${
                            gap.priority === 'high' ? 'text-danger-400' :
                            gap.priority === 'medium' ? 'text-warning-400' :
                            'text-surface-400'
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-black text-accent-400">{gap.standard}</span>
                            <span className="text-[10px] text-surface-500">{gap.domain}</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium capitalize ${
                              gap.priority === 'high' ? 'bg-danger-500/15 text-danger-400' :
                              gap.priority === 'medium' ? 'bg-warning-500/15 text-warning-400' :
                              'bg-surface-500/15 text-surface-400'
                            }`}>{gap.priority} priority</span>
                          </div>
                          <p className="text-xs text-surface-400 leading-relaxed">{gap.suggestion}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <motion.button
                              className="btn-gradient text-[10px] px-2 py-1"
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                            >
                              <Sparkles className="w-2.5 h-2.5" /> Generate Lesson
                            </motion.button>
                            <button className="btn-secondary text-[10px] px-2 py-1">
                              <Link2 className="w-2.5 h-2.5" /> Align Existing
                            </button>
                            <span className="text-[10px] text-surface-500 ml-auto">{gap.impact}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* COMPARE VIEW */}
            {viewMode === 'compare' && (
              <motion.div
                key="compare"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-4"
              >
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">Framework Comparison</h3>
                  <p className="text-xs text-surface-400">Side-by-side alignment across all 6 frameworks</p>
                </div>
                <div className="glass-card overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/[0.06]">
                        <th className="text-left text-xs font-semibold text-surface-300 px-4 py-3">Framework</th>
                        <th className="text-center text-xs font-semibold text-surface-300 px-4 py-3">Total</th>
                        <th className="text-center text-xs font-semibold text-surface-300 px-4 py-3">Aligned</th>
                        <th className="text-center text-xs font-semibold text-surface-300 px-4 py-3">Coverage</th>
                        <th className="text-left text-xs font-semibold text-surface-300 px-4 py-3">Progress</th>
                        <th className="text-center text-xs font-semibold text-surface-300 px-4 py-3">Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {frameworks.map((fw, i) => {
                        const pct = Math.round((fw.aligned / fw.standards) * 100)
                        return (
                          <motion.tr
                            key={fw.id}
                            className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: i * 0.05 }}
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{fw.icon}</span>
                                <div>
                                  <p className="text-xs font-bold text-white">{fw.shortName}</p>
                                  <p className="text-[10px] text-surface-500 truncate max-w-[120px]">{fw.description}</p>
                                </div>
                              </div>
                            </td>
                            <td className="text-center px-4 py-3 text-xs text-surface-400">{fw.standards.toLocaleString()}</td>
                            <td className="text-center px-4 py-3 text-xs font-bold text-white">{fw.aligned}</td>
                            <td className="text-center px-4 py-3">
                              <span className={`text-xs font-bold ${pct >= 50 ? 'text-success-400' : pct >= 25 ? 'text-warning-400' : 'text-danger-400'}`}>
                                {pct}%
                              </span>
                            </td>
                            <td className="px-4 py-3 min-w-[120px]">
                              {(() => {
                                const bw = (pct / 100) * 120
                                return (
                                  <svg viewBox="0 0 120 8" className="w-full overflow-visible">
                                    <defs>
                                      <linearGradient id={`std-fw-${fw.id}`} x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor={fw.color} stopOpacity={0.9} />
                                        <stop offset="100%" stopColor={fw.color} stopOpacity={0.55} />
                                      </linearGradient>
                                    </defs>
                                    <rect x={0} y={1} width={120} height={6} rx={3} fill="rgba(255,255,255,0.05)" />
                                    <motion.rect x={0} y={1} height={6} rx={3} fill={`url(#std-fw-${fw.id})`}
                                      initial={{ width: 0 }} animate={{ width: bw }}
                                      transition={{ delay: 0.3 + i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                    />
                                  </svg>
                                )
                              })()}
                            </td>
                            <td className="text-center px-4 py-3">
                              <span className="text-[10px] text-surface-500">{fw.grades}</span>
                            </td>
                          </motion.tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                <FadeInWhenVisible>
                  <div className="glass-card p-5">
                    <h4 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
                      <TrendingUp className="w-3.5 h-3.5 text-success-400" /> Alignment Trend (Last 6 Months)
                    </h4>
                    {(() => {
                      const vals = [28, 34, 42, 51, 58, 64]
                      const lbls = ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
                      const W = 280, H = 90, PX = 14, PY = 10
                      const minV = 20, maxV = 70
                      const sx = (i: number) => PX + (i / (vals.length - 1)) * (W - PX * 2)
                      const sy = (v: number) => PY + ((maxV - v) / (maxV - minV)) * (H - PY * 2)
                      const pts = vals.map((v, i) => ({ x: sx(i), y: sy(v) }))
                      let lp = `M ${pts[0].x} ${pts[0].y}`
                      for (let i = 1; i < pts.length; i++) {
                        const cpx = (pts[i].x + pts[i - 1].x) / 2
                        lp += ` C ${cpx} ${pts[i - 1].y} ${cpx} ${pts[i].y} ${pts[i].x} ${pts[i].y}`
                      }
                      const ap = lp + ` L ${pts[pts.length - 1].x} ${H} L ${pts[0].x} ${H} Z`
                      return (
                        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: H }}>
                          <defs>
                            <linearGradient id="std-align-grad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.35" />
                              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                          {[30, 45, 60].map(g => (
                            <line key={g} x1={PX} y1={sy(g)} x2={W - PX} y2={sy(g)} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                          ))}
                          <path d={ap} fill="url(#std-align-grad)" />
                          <motion.path d={lp} fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round"
                            initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.9, ease: 'easeOut' }} />
                          {pts.map((pt, i) => (
                            <g key={i}>
                              <circle cx={pt.x} cy={pt.y} r={i === pts.length - 1 ? 3.5 : 2.5} fill="#8b5cf6" />
                              <text x={pt.x} y={pt.y - 6} textAnchor="middle" fill="#c4b5fd" fontSize="9" fontWeight="700">{vals[i]}</text>
                              <text x={pt.x} y={H - 1} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="8.5">{lbls[i]}</text>
                            </g>
                          ))}
                        </svg>
                      )
                    })()}
                    <p className="text-[10px] text-success-400 mt-2 font-semibold">↑ +36 standards aligned in 6 months</p>
                  </div>
                </FadeInWhenVisible>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Recently Starred */}
      <FadeInWhenVisible delay={0.15}>
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /> Priority Standards
            </h3>
            <button className="text-xs text-accent-400 hover:text-accent-300">View all</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {ccssStandards.flatMap(d => d.standards).filter(s => starred.has(s.code)).slice(0, 4).map((std, i) => (
              <motion.div
                key={std.code}
                className="flex items-start gap-3 p-3 bg-white/[0.03] rounded-xl border border-white/[0.06]"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${std.aligned ? 'bg-success-500/25' : 'bg-white/[0.08]'}`}>
                  {std.aligned ? <Check className="w-3 h-3 text-success-400" /> : <span className="w-1.5 h-1.5 rounded-full bg-surface-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-black text-accent-400">{std.code}</span>
                    {std.aligned && <span className="text-[10px] text-success-400">{std.lessons} lessons</span>}
                  </div>
                  <p className="text-[11px] text-surface-400 leading-relaxed line-clamp-2">{std.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </FadeInWhenVisible>

      <AnimatePresence>
        {toastMsg && (
          <motion.div
            className="fixed top-5 right-5 z-[100] flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border border-white/[0.08]"
            style={{ background: 'linear-gradient(135deg,#0a0f1a,#111827)' }}
            initial={{ opacity: 0, y: -16, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 400, damping: 28 } }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
          >
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span className="text-sm text-white font-medium">{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
