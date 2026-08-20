'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain, Users, BookOpen, Globe, Target, Sparkles, Check,
  Layers, Eye, Volume2, Clock, Star, Zap, GraduationCap,
  FileText, Puzzle, MessageSquare, Accessibility, Award,
  BarChart3, Lightbulb, PenTool, List, Layout, Languages,
  Headphones, Hand, SplitSquareHorizontal,
  ChevronDown, Copy, Share2, Download, X, Plus,
  AlertTriangle, TrendingUp, Filter, BookMarked,
  CheckSquare, Square, Printer, ExternalLink, Sliders,
  ArrowRight, Users2, BookCheck, Microscope
} from 'lucide-react'
import { FadeUp, FadeInWhenVisible } from '@/components/ui/motion'

/* ──────────────────────────────────────────────
   DATA
   ────────────────────────────────────────────── */

const LEARNER_PROFILES = [
  {
    id: 'advanced',
    label: 'Advanced / Gifted',
    icon: Star,
    color: '#f59e0b',
    students: 4,
    pct: 13,
    description: 'Needs enrichment, higher-order thinking, and accelerated pacing',
    tags: ['Enrichment', 'Critical Thinking', 'Independent Projects'],
    bloomLevel: 'Create / Evaluate',
    mastery: 96,
  },
  {
    id: 'on-level',
    label: 'On Grade Level',
    icon: Target,
    color: '#10b981',
    students: 12,
    pct: 40,
    description: 'Standard instruction with regular formative checks',
    tags: ['Core Instruction', 'Grade-Level Texts', 'Collaborative Work'],
    bloomLevel: 'Apply / Analyze',
    mastery: 81,
  },
  {
    id: 'approaching',
    label: 'Approaching Level',
    icon: BarChart3,
    color: '#6366f1',
    students: 6,
    pct: 20,
    description: 'Needs scaffolding, pre-teaching, and guided practice',
    tags: ['Scaffolding', 'Guided Practice', 'Pre-Teaching'],
    bloomLevel: 'Understand / Apply',
    mastery: 67,
  },
  {
    id: 'ell',
    label: 'English Language Learners',
    icon: Globe,
    color: '#22d3ee',
    students: 5,
    pct: 17,
    description: 'Bilingual support, visual aids, and language-rich activities',
    tags: ['Visual Aids', 'Bilingual Support', 'Sentence Frames'],
    bloomLevel: 'Remember / Understand',
    mastery: 74,
  },
  {
    id: 'iep',
    label: 'IEP / 504 Students',
    icon: Accessibility,
    color: '#ec4899',
    students: 3,
    pct: 10,
    description: 'Accommodations required per individual education plans',
    tags: ['Accommodations', 'Modified Pacing', 'Assistive Tech'],
    bloomLevel: 'Remember / Understand',
    mastery: 71,
  },
]

interface Adaptation {
  title: string
  bloomBadge: string
  bullets: string[]
  saved?: boolean
}

const ADAPTATIONS: Record<string, Adaptation> = {
  advanced: {
    title: 'Enrichment Adaptation',
    bloomBadge: 'Create',
    bullets: [
      'Replace guided notes with an independent research mini-project on C4 vs CAM photosynthesis.',
      'Add analysis questions: "What would happen to oxygen levels if photosynthesis ceased globally?"',
      'Extension: Design an experiment to measure the rate of photosynthesis under different light wavelengths.',
      'Provide journal article excerpt (Lexile 1200+) on artificial photosynthesis for critical reading.',
      'Debate prompt: "Should humans engineer more efficient photosynthesis in crops?" — argue both sides.',
    ],
  },
  'on-level': {
    title: 'Standard Instruction',
    bloomBadge: 'Apply',
    bullets: [
      'Use interactive diagram to label the stages of photosynthesis (light reactions & Calvin cycle).',
      'Guided notes with fill-in-the-blank key vocabulary.',
      'Lab activity: Observe Elodea bubbles to visualize oxygen production.',
      'Formative check: Exit ticket matching inputs/outputs of photosynthesis.',
      'Peer discussion: Compare photosynthesis diagrams and identify 3 differences.',
    ],
  },
  approaching: {
    title: 'Scaffolded Adaptation',
    bloomBadge: 'Understand',
    bullets: [
      'Pre-teach vocabulary: chlorophyll, glucose, carbon dioxide, light energy (with picture cards).',
      'Provide a simplified equation with color-coded reactants and products.',
      'Chunked reading passage (Lexile 800) with highlighted key terms.',
      'Graphic organizer: "What goes in?" / "What comes out?" T-chart.',
      'Think-aloud with guided annotation — teacher models first, students follow.',
    ],
  },
  ell: {
    title: 'ELL Adaptation',
    bloomBadge: 'Remember',
    bullets: [
      'Bilingual glossary (English/Spanish): fotosintesis, clorofila, glucosa, dioxido de carbono.',
      'Sentence frames: "During photosynthesis, plants use ___ and ___ to make ___."',
      'Labeled diagram with L1 cognates; visual flowchart of the process.',
      'Word bank with pronunciation guide; partner discussion in home language permitted.',
      'Multimedia anchor: 3-minute video with subtitles in student\'s home language before reading.',
    ],
  },
  iep: {
    title: 'IEP/504 Adaptation',
    bloomBadge: 'Remember',
    bullets: [
      'Extended time (1.5x) for lab write-up and exit ticket.',
      'Preferential seating near demonstration table; reduced visual clutter on handouts.',
      'Text-to-speech enabled digital version of the reading passage.',
      'Modified assessment: multiple-choice instead of open-response; word bank provided.',
      'Check-in every 10 minutes during independent work to confirm understanding.',
    ],
  },
}

const ACCOMMODATION_ITEMS = [
  { label: 'Extended Time', icon: Clock, group: 'time' },
  { label: 'Preferential Seating', icon: Hand, group: 'environment' },
  { label: 'Visual Aids', icon: Eye, group: 'presentation' },
  { label: 'Audio Support', icon: Volume2, group: 'presentation' },
  { label: 'Simplified Text', icon: FileText, group: 'content' },
  { label: 'Chunked Assignments', icon: SplitSquareHorizontal, group: 'content' },
  { label: 'Graphic Organizers', icon: Layout, group: 'support' },
  { label: 'Word Banks', icon: List, group: 'support' },
  { label: 'Sentence Frames', icon: MessageSquare, group: 'support' },
  { label: 'Bilingual Glossary', icon: Languages, group: 'ell' },
  { label: 'Modified Assessments', icon: PenTool, group: 'assessment' },
  { label: 'Peer Tutoring', icon: Users, group: 'support' },
  { label: 'Audio Recording', icon: Headphones, group: 'presentation' },
  { label: 'Reduce # of Items', icon: Filter, group: 'content' },
  { label: 'Extra Processing Time', icon: Clock, group: 'time' },
  { label: 'Alternative Response', icon: Sliders, group: 'assessment' },
]

const UDL_PILLARS = [
  {
    id: 'representation',
    title: 'Representation',
    subtitle: 'Multiple means of presenting content',
    icon: Eye,
    color: '#6366f1',
    strategies: ['Visual diagrams', 'Audio narration', 'Bilingual resources', 'Simplified reading'],
    score: 82,
  },
  {
    id: 'action',
    title: 'Action & Expression',
    subtitle: 'Multiple ways to demonstrate learning',
    icon: PenTool,
    color: '#10b981',
    strategies: ['Written response', 'Oral presentation', 'Lab demonstration', 'Digital artifact'],
    score: 74,
  },
  {
    id: 'engagement',
    title: 'Engagement',
    subtitle: 'Multiple ways to motivate learners',
    icon: Zap,
    color: '#f59e0b',
    strategies: ['Choice boards', 'Collaborative tasks', 'Real-world connections', 'Self-reflection'],
    score: 68,
  },
]

const STUDENT_TRACKER = [
  { name: 'Aaliyah M.', group: 'advanced', adaptation: 'Enrichment', status: 'completed', score: 98 },
  { name: 'Brandon K.', group: 'on-level', adaptation: 'Standard', status: 'in-progress', score: 82 },
  { name: 'Camila R.', group: 'ell', adaptation: 'ELL Adapted', status: 'completed', score: 77 },
  { name: 'Daniel T.', group: 'approaching', adaptation: 'Scaffolded', status: 'not-started', score: null },
  { name: 'Esme W.', group: 'iep', adaptation: 'IEP Modified', status: 'in-progress', score: 71 },
]

const STATUS_COLORS: Record<string, string> = {
  'completed': '#10b981',
  'in-progress': '#f59e0b',
  'not-started': '#64748b',
}
const STATUS_LABELS: Record<string, string> = {
  'completed': 'Completed',
  'in-progress': 'In Progress',
  'not-started': 'Not Started',
}

const AI_ALERTS = [
  {
    icon: AlertTriangle,
    color: '#f59e0b',
    bg: '#f59e0b18',
    title: 'Low Mastery: Approaching Group',
    body: 'The Approaching Level group shows 67% mastery — below the 75% threshold. Pre-teaching vocabulary before next class is recommended.',
    action: 'View Resources',
  },
  {
    icon: TrendingUp,
    color: '#10b981',
    bg: '#10b98118',
    title: 'ELL Progress Trending Up',
    body: '3 of 5 ELL students improved by 2+ mastery points this week. Sentence frames and bilingual glossary show strong impact.',
    action: 'See Details',
  },
  {
    icon: Lightbulb,
    color: '#6366f1',
    bg: '#6366f118',
    title: 'UDL Gap: Engagement Score Low',
    body: 'Engagement pillar scores 68% — lowest of the three UDL areas. Adding choice boards or collaborative tasks could close this gap.',
    action: 'UDL Tips',
  },
]

const TREND_DATA = [62, 66, 68, 71, 73, 76, 79, 81]
const TREND_LABELS = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8']

/* ──────────────────────────────────────────────
   COMPONENT
   ────────────────────────────────────────────── */

export default function DifferentiationPage() {
  const [activeTab, setActiveTab] = useState('advanced')
  const [selectedAccommodations, setSelectedAccommodations] = useState<string[]>([
    'Extended Time', 'Visual Aids', 'Word Banks', 'Sentence Frames',
  ])
  const [generating, setGenerating] = useState(false)
  const [aiOpen, setAiOpen] = useState(true)
  const [savedAdaptations, setSavedAdaptations] = useState<Set<string>>(new Set(['on-level']))
  const [exportOpen, setExportOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [lessonTopic, setLessonTopic] = useState('Photosynthesis')
  const [lessonGrade, setLessonGrade] = useState('7')
  const [lessonSubject, setLessonSubject] = useState('Science')
  const [lessonObjective, setLessonObjective] = useState('Explain the process of photosynthesis and its role in energy transfer')
  const [lessonStandard, setLessonStandard] = useState('MS-LS1-6')
  const [lessonTime, setLessonTime] = useState('50')
  const [saveToast, setSaveToast] = useState('')

  const totalStudents = LEARNER_PROFILES.reduce((sum, p) => sum + p.students, 0)

  const toggleAccommodation = (label: string) => {
    setSelectedAccommodations(prev =>
      prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
    )
  }

  const toggleSaveAdaptation = (id: string) => {
    setSavedAdaptations(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
        showSaveToast('Adaptation removed from saved')
      } else {
        next.add(id)
        showSaveToast('Adaptation saved!')
      }
      return next
    })
  }

  const showSaveToast = (msg: string) => {
    setSaveToast(msg)
    setTimeout(() => setSaveToast(''), 2500)
  }

  const handleGenerate = () => {
    setGenerating(true)
    setTimeout(() => {
      setGenerating(false)
      showSaveToast('All 5 adaptations generated!')
    }, 2200)
  }

  const handleCopyLink = () => {
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  const activeProfile = LEARNER_PROFILES.find(p => p.id === activeTab)!
  const activeAdaptation = ADAPTATIONS[activeTab]

  return (
    <div className="space-y-6">
      {/* ── TOAST ─────────────────────────────────── */}
      <AnimatePresence>
        {saveToast && (
          <motion.div
            className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white shadow-xl"
            style={{ background: 'linear-gradient(135deg, #6366f1, #a78bfa)' }}
            initial={{ opacity: 0, y: -16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.95 }}
          >
            <Check className="w-4 h-4" />
            {saveToast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HEADER ─────────────────────────────────── */}
      <FadeUp>
        <div className="hero-mesh rounded-3xl p-6 border border-white/[0.06]">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg,#a78bfa,#6366f1)' }}>
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-black text-white tracking-tight">AI Differentiation Wizard</h1>
                  <span className="text-[10px] bg-violet-500/20 text-violet-400 px-2 py-0.5 rounded-full font-bold border border-violet-500/20">AI-Powered</span>
                </div>
                <p className="text-sm text-surface-400">Adapt any lesson for all {totalStudents} learners instantly</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <motion.button className="btn-secondary text-xs px-3 py-1.5" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setShareOpen(true)}>
                <Share2 className="w-3.5 h-3.5" /> Share
              </motion.button>
              <motion.button className="btn-secondary text-xs px-3 py-1.5" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setExportOpen(true)}>
                <Download className="w-3.5 h-3.5" /> Export
              </motion.button>
              <motion.button className="btn-gradient text-xs" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => showSaveToast('New lesson created!')}>
                <Sparkles className="w-3.5 h-3.5" /> New Lesson
              </motion.button>
            </div>
          </div>
          <div className="border-t border-white/[0.06] pt-4 flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold">Profiles</span>
              <span className="text-xs font-bold text-white">{LEARNER_PROFILES.length}</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold">Students</span>
              <span className="text-xs font-bold text-white">{totalStudents}</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold">Saved</span>
              <span className="text-xs font-bold text-success-400">{savedAdaptations.size}</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold">Accommodations</span>
              <span className="text-xs font-bold text-violet-400">{selectedAccommodations.length}</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold">Subject</span>
              <span className="text-xs font-bold text-white">{lessonSubject}</span>
            </div>
          </div>
        </div>
      </FadeUp>

      {/* ── AI INSIGHTS ────────────────────────────── */}
      <FadeUp delay={0.04}>
        <div className="glass-card overflow-hidden">
          <button
            className="w-full flex items-center justify-between p-4 text-left"
            onClick={() => setAiOpen(v => !v)}
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-accent-500/15">
                <Sparkles className="w-3.5 h-3.5 text-accent-400" />
              </div>
              <span className="text-sm font-bold text-white">AI Differentiation Insights</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent-500/15 text-accent-400 font-medium">3 alerts</span>
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

      {/* ── QUICK STATS ────────────────────────────── */}
      <FadeUp delay={0.08}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Learner Profiles', value: 5, icon: Users, color: '#a78bfa', sub: 'active groups' },
            { label: 'Adaptations Made', value: 47, icon: Layers, color: '#6366f1', sub: 'this semester' },
            { label: 'Avg Mastery', value: '78%', icon: BookCheck, color: '#10b981', sub: 'across all groups' },
            { label: 'Languages', value: 3, icon: Globe, color: '#22d3ee', sub: 'in classroom' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="glass-card p-4"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
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

      {/* ── MAIN GRID ──────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* LEFT: Profiles + Lesson Adapter + Accommodations */}
        <div className="xl:col-span-3 space-y-6">

          {/* ── LEARNER PROFILES ─────────────────────── */}
          <FadeUp delay={0.12}>
            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Users2 className="w-4 h-4 text-violet-400" />
                  Class Composition
                </h3>
                <span className="text-[10px] text-surface-500">{totalStudents} students total</span>
              </div>

              {/* Distribution bar */}
              <div className="flex h-3 rounded-full overflow-hidden mb-4">
                {LEARNER_PROFILES.map((p, i) => (
                  <motion.div
                    key={p.id}
                    style={{ backgroundColor: p.color, width: `${p.pct}%` }}
                    initial={{ scaleX: 0, originX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.14 + i * 0.06, duration: 0.5, ease: 'easeOut' }}
                    title={`${p.label}: ${p.pct}%`}
                  />
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {LEARNER_PROFILES.map((profile, i) => (
                  <motion.div
                    key={profile.id}
                    className="relative rounded-xl p-4 cursor-pointer"
                    style={{
                      background: `linear-gradient(135deg, ${profile.color}08, ${profile.color}04)`,
                      border: `1px solid ${profile.color}20`,
                    }}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.16 + i * 0.06 }}
                    whileHover={{
                      borderColor: profile.color + '40',
                      boxShadow: `0 4px 20px ${profile.color}15`,
                      y: -2,
                    }}
                    onClick={() => setActiveTab(profile.id)}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: profile.color + '18' }}>
                        <profile.icon className="w-4 h-4" style={{ color: profile.color }} />
                      </div>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: profile.color + '18', color: profile.color }}>
                        {profile.students}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white mb-1">{profile.label}</h4>
                    {/* Mastery bar */}
                    <div className="mt-2 mb-2">
                      <div className="flex justify-between mb-1">
                        <span className="text-[9px] text-surface-500">Mastery</span>
                        <span className="text-[9px] font-bold" style={{ color: profile.color }}>{profile.mastery}%</span>
                      </div>
                      {(() => {
                        const bw = (profile.mastery / 100) * 200
                        return (
                          <svg viewBox="0 0 200 8" className="w-full overflow-visible">
                            <defs>
                              <linearGradient id={`df-m-${i}`} x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor={profile.color} stopOpacity={0.9} />
                                <stop offset="100%" stopColor={profile.color} stopOpacity={0.55} />
                              </linearGradient>
                            </defs>
                            <rect x={0} y={1} width={200} height={6} rx={3} fill="rgba(255,255,255,0.05)" />
                            <motion.rect x={0} y={1} height={6} rx={3} fill={`url(#df-m-${i})`}
                              initial={{ width: 0 }} animate={{ width: bw }}
                              transition={{ delay: 0.2 + i * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            />
                          </svg>
                        )
                      })()}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {profile.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: profile.color + '10', color: profile.color }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </FadeUp>

          {/* ── LESSON ADAPTER ───────────────────────── */}
          <FadeUp delay={0.16}>
            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Lesson Adapter
                </h3>
                <span className="badge bg-accent-500/15 text-accent-400 text-[10px]">AI Powered</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* INPUT */}
                <div className="rounded-xl p-4" style={{ background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.12)' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-accent-500/15">
                      <FileText className="w-3 h-3 text-accent-400" />
                    </div>
                    <h4 className="text-xs font-bold text-white">Lesson Details</h4>
                  </div>
                  <div className="space-y-2.5">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-surface-500 block mb-1">Topic</label>
                        <input
                          value={lessonTopic}
                          onChange={e => setLessonTopic(e.target.value)}
                          className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-white placeholder-surface-500 focus:outline-none focus:border-accent-500/40"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-surface-500 block mb-1">Grade</label>
                        <select
                          value={lessonGrade}
                          onChange={e => setLessonGrade(e.target.value)}
                          className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-accent-500/40"
                          style={{ backgroundColor: 'rgba(15,15,35,0.6)' }}
                        >
                          {['K','1','2','3','4','5','6','7','8','9','10','11','12'].map(g => (
                            <option key={g} value={g}>Grade {g}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-surface-500 block mb-1">Subject</label>
                        <input
                          value={lessonSubject}
                          onChange={e => setLessonSubject(e.target.value)}
                          className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-white placeholder-surface-500 focus:outline-none focus:border-accent-500/40"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-surface-500 block mb-1">Time (min)</label>
                        <input
                          value={lessonTime}
                          onChange={e => setLessonTime(e.target.value)}
                          className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-white placeholder-surface-500 focus:outline-none focus:border-accent-500/40"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] text-surface-500 block mb-1">Standard</label>
                      <input
                        value={lessonStandard}
                        onChange={e => setLessonStandard(e.target.value)}
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-white placeholder-surface-500 focus:outline-none focus:border-accent-500/40"
                        placeholder="e.g. MS-LS1-6"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-surface-500 block mb-1">Learning Objective</label>
                      <textarea
                        value={lessonObjective}
                        onChange={e => setLessonObjective(e.target.value)}
                        rows={2}
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-white placeholder-surface-500 focus:outline-none focus:border-accent-500/40 resize-none"
                      />
                    </div>
                  </div>
                  <motion.button
                    className="btn-gradient text-xs mt-3 w-full relative overflow-hidden"
                    onClick={handleGenerate}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={generating}
                  >
                    {generating && (
                      <motion.div
                        className="absolute inset-0"
                        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)' }}
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                      />
                    )}
                    <Sparkles className="w-3.5 h-3.5" />
                    {generating ? 'Generating All 5 Adaptations...' : 'Generate All Adaptations'}
                  </motion.button>
                </div>

                {/* OUTPUT */}
                <div>
                  {/* Profile tabs */}
                  <div className="flex gap-1 mb-3 overflow-x-auto pb-1">
                    {LEARNER_PROFILES.map(profile => (
                      <button
                        key={profile.id}
                        onClick={() => setActiveTab(profile.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all duration-200"
                        style={{
                          backgroundColor: activeTab === profile.id ? profile.color + '18' : 'rgba(255,255,255,0.03)',
                          color: activeTab === profile.id ? profile.color : 'rgba(148,163,184,0.7)',
                          border: `1px solid ${activeTab === profile.id ? profile.color + '30' : 'rgba(255,255,255,0.06)'}`,
                        }}
                      >
                        <profile.icon className="w-3 h-3" />
                        {profile.label.split(' ')[0]}
                      </button>
                    ))}
                  </div>

                  {/* Active adaptation */}
                  <AnimatePresence mode="wait">
                    {LEARNER_PROFILES.map(profile => {
                      if (profile.id !== activeTab) return null
                      const adaptation = ADAPTATIONS[profile.id]
                      const isSaved = savedAdaptations.has(profile.id)
                      return (
                        <motion.div
                          key={profile.id}
                          className="rounded-xl p-4"
                          style={{
                            background: `linear-gradient(135deg, ${profile.color}06, ${profile.color}03)`,
                            border: `1px solid ${profile.color}18`,
                          }}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ backgroundColor: profile.color + '18' }}>
                                <profile.icon className="w-3 h-3" style={{ color: profile.color }} />
                              </div>
                              <h4 className="text-xs font-bold" style={{ color: profile.color }}>{adaptation.title}</h4>
                              <span className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold" style={{ backgroundColor: profile.color + '20', color: profile.color }}>
                                Bloom's: {adaptation.bloomBadge}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <motion.button
                                onClick={() => toggleSaveAdaptation(profile.id)}
                                className="p-1.5 rounded-lg transition-colors"
                                style={{ backgroundColor: isSaved ? profile.color + '18' : 'rgba(255,255,255,0.04)' }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                title={isSaved ? 'Unsave' : 'Save'}
                              >
                                <BookMarked className="w-3 h-3" style={{ color: isSaved ? profile.color : '#64748b' }} />
                              </motion.button>
                              <motion.button
                                className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                title="Copy adaptation"
                              >
                                <Copy className="w-3 h-3 text-surface-400" />
                              </motion.button>
                            </div>
                          </div>
                          <ul className="space-y-2">
                            {adaptation.bullets.map((bullet, bi) => (
                              <motion.li
                                key={bi}
                                className="flex items-start gap-2"
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: bi * 0.06 }}
                              >
                                <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: profile.color + '18' }}>
                                  <Check className="w-2.5 h-2.5" style={{ color: profile.color }} />
                                </div>
                                <span className="text-[11px] text-surface-300 leading-relaxed">{bullet}</span>
                              </motion.li>
                            ))}
                          </ul>
                          <div className="flex gap-2 mt-4">
                            <motion.button
                              className="flex-1 py-2 rounded-lg text-xs font-semibold transition-colors"
                              style={{ backgroundColor: profile.color + '15', color: profile.color }}
                              whileHover={{ backgroundColor: profile.color + '25' }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => showSaveToast(`Applied ${adaptation.title} to lesson plan!`)}
                            >
                              Save & Apply
                            </motion.button>
                            <motion.button
                              className="px-3 py-2 rounded-lg text-xs font-semibold bg-white/[0.04] text-surface-400 hover:bg-white/[0.08] transition-colors"
                              whileTap={{ scale: 0.97 }}
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </motion.button>
                          </div>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </FadeUp>

          {/* ── ACCOMMODATION CHECKLIST ──────────────── */}
          <FadeUp delay={0.2}>
            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Puzzle className="w-4 h-4 text-emerald-400" />
                  Accommodation Checklist
                </h3>
                <span className="text-[10px] text-surface-500">
                  {selectedAccommodations.length} / {ACCOMMODATION_ITEMS.length} selected
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {ACCOMMODATION_ITEMS.map((item, i) => {
                  const isSelected = selectedAccommodations.includes(item.label)
                  return (
                    <motion.button
                      key={item.label}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all duration-200"
                      style={{
                        background: isSelected ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${isSelected ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.06)'}`,
                      }}
                      onClick={() => toggleAccommodation(item.label)}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.22 + i * 0.025 }}
                      whileHover={{ borderColor: 'rgba(99,102,241,0.3)' }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <div
                        className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-all duration-200"
                        style={{
                          background: isSelected ? 'linear-gradient(135deg, #6366f1, #a78bfa)' : 'rgba(255,255,255,0.06)',
                          border: isSelected ? 'none' : '1px solid rgba(255,255,255,0.1)',
                        }}
                      >
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <div className="flex items-center gap-1.5 min-w-0">
                        <item.icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: isSelected ? '#818cf8' : 'rgba(148,163,184,0.5)' }} />
                        <span className="text-xs font-medium truncate" style={{ color: isSelected ? '#e0e7ff' : 'rgba(148,163,184,0.7)' }}>
                          {item.label}
                        </span>
                      </div>
                    </motion.button>
                  )
                })}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-[11px] text-surface-500">
                  Selected accommodations will be bundled with exported adaptations.
                </p>
                <motion.button
                  className="btn-gradient text-xs"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => showSaveToast('Accommodation plan saved!')}
                >
                  <Check className="w-3.5 h-3.5" /> Save Plan
                </motion.button>
              </div>
            </div>
          </FadeUp>

          {/* ── STUDENT TRACKER ──────────────────────── */}
          <FadeUp delay={0.24}>
            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-blue-400" />
                  Per-Student Adaptation Tracker
                </h3>
                <button className="text-[11px] text-accent-400 flex items-center gap-1">
                  View All <ExternalLink className="w-3 h-3" />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-white/[0.05]">
                      {['Student', 'Group', 'Adaptation', 'Status', 'Score'].map(h => (
                        <th key={h} className="text-left py-2 pr-4 text-[10px] text-surface-500 font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {STUDENT_TRACKER.map((row, i) => {
                      const profile = LEARNER_PROFILES.find(p => p.id === row.group)!
                      const statusColor = STATUS_COLORS[row.status]
                      return (
                        <motion.tr
                          key={row.name}
                          className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.26 + i * 0.04 }}
                        >
                          <td className="py-2.5 pr-4">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ background: `linear-gradient(135deg, ${profile.color}40, ${profile.color}20)` }}>
                                {row.name[0]}
                              </div>
                              <span className="font-medium text-white">{row.name}</span>
                            </div>
                          </td>
                          <td className="py-2.5 pr-4">
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: profile.color + '15', color: profile.color }}>
                              {profile.label.split(' ')[0]}
                            </span>
                          </td>
                          <td className="py-2.5 pr-4 text-surface-400">{row.adaptation}</td>
                          <td className="py-2.5 pr-4">
                            <span className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: statusColor }} />
                              <span style={{ color: statusColor }}>{STATUS_LABELS[row.status]}</span>
                            </span>
                          </td>
                          <td className="py-2.5">
                            <span className="font-bold text-white">{row.score !== null ? `${row.score}%` : '—'}</span>
                          </td>
                        </motion.tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </FadeUp>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="xl:col-span-1 space-y-5">

          {/* UDL Framework */}
          <FadeInWhenVisible>
            <div className="glass-card p-4">
              <h4 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-violet-400" />
                UDL Framework
              </h4>
              <div className="space-y-3">
                {UDL_PILLARS.map((pillar, i) => (
                  <motion.div
                    key={pillar.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.06 }}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0" style={{ backgroundColor: pillar.color + '18' }}>
                        <pillar.icon className="w-3 h-3" style={{ color: pillar.color }} />
                      </div>
                      <span className="text-[11px] font-semibold text-white flex-1">{pillar.title}</span>
                      <span className="text-[10px] font-bold" style={{ color: pillar.color }}>{pillar.score}%</span>
                    </div>
                    {(() => {
                      const bw = (pillar.score / 100) * 220
                      return (
                        <svg viewBox="0 0 220 8" className="w-full overflow-visible">
                          <defs>
                            <linearGradient id={`udl-${pillar.id}`} x1="0" y1="0" x2="1" y2="0">
                              <stop offset="0%" stopColor={pillar.color} stopOpacity={0.9} />
                              <stop offset="100%" stopColor={pillar.color} stopOpacity={0.55} />
                            </linearGradient>
                          </defs>
                          <rect x={0} y={1} width={220} height={6} rx={3} fill="rgba(255,255,255,0.05)" />
                          <motion.rect x={0} y={1} height={6} rx={3} fill={`url(#udl-${pillar.id})`}
                            initial={{ width: 0 }} animate={{ width: bw }}
                            transition={{ delay: 0.32 + i * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                          />
                        </svg>
                      )
                    })()}
                    <p className="text-[9px] text-surface-500 mt-1">{pillar.subtitle}</p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {pillar.strategies.map(s => (
                        <span key={s} className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: pillar.color + '10', color: pillar.color + 'dd' }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </FadeInWhenVisible>

          {/* Mastery Trend Chart */}
          <FadeInWhenVisible>
            <div className="glass-card p-4">
              <h4 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                8-Week Mastery Trend
              </h4>
              {(() => {
                const W = 240, H = 80, PX = 10, PY = 8
                const minV = 58, maxV = 85
                const sx = (i: number) => PX + (i / (TREND_DATA.length - 1)) * (W - PX * 2)
                const sy = (v: number) => PY + ((maxV - v) / (maxV - minV)) * (H - PY * 2)
                const pts = TREND_DATA.map((v, i) => ({ x: sx(i), y: sy(v) }))
                let lp = `M ${pts[0].x} ${pts[0].y}`
                for (let i = 1; i < pts.length; i++) {
                  const cpx = (pts[i].x + pts[i - 1].x) / 2
                  lp += ` C ${cpx} ${pts[i - 1].y} ${cpx} ${pts[i].y} ${pts[i].x} ${pts[i].y}`
                }
                const ap = lp + ` L ${pts[pts.length - 1].x} ${H} L ${pts[0].x} ${H} Z`
                return (
                  <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: H }}>
                    <defs>
                      <linearGradient id="diff-trend" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {[65, 75, 85].map(g => (
                      <line key={g} x1={PX} y1={sy(g)} x2={W - PX} y2={sy(g)} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                    ))}
                    <path d={ap} fill="url(#diff-trend)" />
                    <motion.path d={lp} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.85, ease: 'easeOut' }} />
                    {pts.map((pt, i) => (
                      <g key={i}>
                        <circle cx={pt.x} cy={pt.y} r={i === pts.length - 1 ? 3.5 : 2} fill="#10b981" />
                        <text x={pt.x} y={H - 1} textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize="7.5">{TREND_LABELS[i]}</text>
                      </g>
                    ))}
                    <text x={pts[pts.length - 1].x} y={pts[pts.length - 1].y - 7} textAnchor="middle" fill="#10b981" fontSize="9" fontWeight="700">{TREND_DATA[TREND_DATA.length - 1]}%</text>
                  </svg>
                )
              })()}
              <div className="flex justify-between mt-2">
                <span className="text-[10px] text-surface-500">Class avg: 81% ↑</span>
                <span className="text-[10px] text-emerald-400 font-semibold">+19pts this term</span>
              </div>
            </div>
          </FadeInWhenVisible>

          {/* Saved Adaptations */}
          <FadeInWhenVisible>
            <div className="glass-card p-4">
              <h4 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
                <BookMarked className="w-3.5 h-3.5 text-amber-400" />
                Saved Adaptations
              </h4>
              {savedAdaptations.size === 0 ? (
                <p className="text-[11px] text-surface-500 text-center py-4">No saved adaptations yet.</p>
              ) : (
                <div className="space-y-2">
                  {Array.from(savedAdaptations).map(id => {
                    const profile = LEARNER_PROFILES.find(p => p.id === id)!
                    return (
                      <div key={id} className="flex items-center gap-2 p-2 rounded-lg" style={{ background: profile.color + '08', border: `1px solid ${profile.color}15` }}>
                        <profile.icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: profile.color }} />
                        <span className="text-[11px] font-medium text-white flex-1">{profile.label}</span>
                        <button onClick={() => toggleSaveAdaptation(id)} className="p-0.5 hover:text-red-400 transition-colors">
                          <X className="w-3 h-3 text-surface-500 hover:text-red-400" />
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </FadeInWhenVisible>

          {/* Quick Stats Sidebar */}
          <FadeInWhenVisible>
            <div className="glass-card p-4">
              <h4 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
                <Award className="w-3.5 h-3.5 text-blue-400" />
                Differentiation Impact
              </h4>
              <div className="space-y-2.5">
                {[
                  { label: 'Adaptations this week', value: '12', color: '#6366f1' },
                  { label: 'Students supported', value: '30', color: '#10b981' },
                  { label: 'Avg time saved', value: '38 min', color: '#f59e0b' },
                  { label: 'Accommodations applied', value: selectedAccommodations.length.toString(), color: '#22d3ee' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-[11px] text-surface-400">{item.label}</span>
                    <span className="text-xs font-bold" style={{ color: item.color }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeInWhenVisible>
        </div>
      </div>

      {/* ── EXPORT MODAL ───────────────────────────── */}
      <AnimatePresence>
        {exportOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setExportOpen(false)} />
            <motion.div
              className="relative glass-card p-6 w-full max-w-sm"
              initial={{ scale: 0.93, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.93, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-bold text-white">Export Adaptations</h3>
                <button onClick={() => setExportOpen(false)} className="p-1.5 rounded-lg hover:bg-white/[0.08] transition-colors">
                  <X className="w-4 h-4 text-surface-400" />
                </button>
              </div>
              <div className="space-y-2">
                {[
                  { label: 'All 5 Adaptations (PDF)', icon: FileText, desc: 'Full differentiated lesson packet' },
                  { label: 'Student Handouts (PDF)', icon: Users, desc: 'Separate printable per group' },
                  { label: 'Google Docs', icon: ExternalLink, desc: 'Export to your Drive' },
                  { label: 'Copy as Text', icon: Copy, desc: 'Plain text for email or LMS' },
                ].map(opt => (
                  <motion.button
                    key={opt.label}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.07] transition-colors text-left"
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { showSaveToast(`Exported: ${opt.label}`); setExportOpen(false) }}
                  >
                    <div className="w-7 h-7 rounded-lg bg-accent-500/15 flex items-center justify-center flex-shrink-0">
                      <opt.icon className="w-3.5 h-3.5 text-accent-400" />
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

      {/* ── SHARE MODAL ────────────────────────────── */}
      <AnimatePresence>
        {shareOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShareOpen(false)} />
            <motion.div
              className="relative glass-card p-6 w-full max-w-sm"
              initial={{ scale: 0.93, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.93, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-bold text-white">Share Adaptations</h3>
                <button onClick={() => setShareOpen(false)} className="p-1.5 rounded-lg hover:bg-white/[0.08] transition-colors">
                  <X className="w-4 h-4 text-surface-400" />
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] text-surface-500 block mb-1.5">Share link</label>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-[11px] text-surface-400 truncate">
                      https://taleeko.ai/adapt/ph7g2k...
                    </div>
                    <motion.button
                      className="px-3 py-2 rounded-lg text-xs font-semibold transition-colors"
                      style={{ backgroundColor: copiedLink ? '#10b98120' : 'rgba(99,102,241,0.15)', color: copiedLink ? '#10b981' : '#818cf8' }}
                      onClick={handleCopyLink}
                      whileTap={{ scale: 0.95 }}
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </motion.button>
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    { label: 'Share with Co-Teacher', icon: Users2, desc: 'Send via TALEEKO messaging' },
                    { label: 'Google Classroom', icon: ExternalLink, desc: 'Post to your class stream' },
                    { label: 'Email Parents', icon: MessageSquare, desc: 'Send accommodation summary' },
                  ].map(opt => (
                    <motion.button
                      key={opt.label}
                      className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.07] transition-colors text-left"
                      whileHover={{ x: 2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => { showSaveToast(`Shared via: ${opt.label}`); setShareOpen(false) }}
                    >
                      <div className="w-7 h-7 rounded-lg bg-accent-500/15 flex items-center justify-center flex-shrink-0">
                        <opt.icon className="w-3.5 h-3.5 text-accent-400" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white">{opt.label}</p>
                        <p className="text-[10px] text-surface-500">{opt.desc}</p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
