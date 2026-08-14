'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Map, Plus, ChevronDown, Calendar, Target,
  BookOpen, Sparkles, Check, Clock, Layers,
  Edit3, Copy, Eye, Brain, AlertTriangle,
  TrendingUp, Flag, BarChart2, ChevronLeft,
  ChevronRight, Zap, Download, RefreshCw,
  GripVertical, Star, FileText, Users, Lock,
  Unlock, CheckSquare, ArrowRight, X, Filter,
  BookMarked, Trophy, PenTool, CheckCircle
} from 'lucide-react'
import { FadeUp, FadeInWhenVisible } from '@/components/ui/motion'

type UnitStatus = 'completed' | 'in-progress' | 'upcoming' | 'draft'
type ViewMode = 'list' | 'timeline' | 'calendar'
type PaceStatus = 'on-track' | 'ahead' | 'behind'

interface Lesson {
  id: string
  title: string
  type: 'lecture' | 'lab' | 'discussion' | 'assessment' | 'project'
  duration: string
  completed: boolean
  aiGenerated: boolean
}

interface Unit {
  id: string
  title: string
  weeks: string
  weeksNum: number
  startWeek: number
  status: UnitStatus
  color: string
  standards: number
  lessons: number
  progress: number
  paceStatus: PaceStatus
  description: string
  objectives: string[]
  topics: string[]
  lessonList: Lesson[]
  assessments: string[]
}

const units: Unit[] = [
  {
    id: '1',
    title: 'Cell Biology & Organization',
    weeks: '3 weeks', weeksNum: 3, startWeek: 1,
    status: 'completed',
    color: '#10b981',
    standards: 4, lessons: 8, progress: 100,
    paceStatus: 'on-track',
    description: 'Foundations of cellular structure, function, and the processes that sustain life at the cellular level.',
    objectives: [
      'Describe the structure and function of cell organelles',
      'Compare prokaryotic and eukaryotic cells',
      'Explain the mechanisms of cell transport',
      'Model the process of mitosis and meiosis',
    ],
    topics: ['Cell Structure', 'Cell Transport', 'Cell Division', 'Photosynthesis', 'Cellular Respiration'],
    lessonList: [
      { id: '1-1', title: 'Cell Organelles Overview', type: 'lecture', duration: '50 min', completed: true, aiGenerated: false },
      { id: '1-2', title: 'Prokaryotes vs Eukaryotes', type: 'discussion', duration: '45 min', completed: true, aiGenerated: true },
      { id: '1-3', title: 'Cell Transport Lab', type: 'lab', duration: '90 min', completed: true, aiGenerated: false },
      { id: '1-4', title: 'Photosynthesis Deep Dive', type: 'lecture', duration: '50 min', completed: true, aiGenerated: true },
      { id: '1-5', title: 'Cellular Respiration', type: 'lecture', duration: '50 min', completed: true, aiGenerated: false },
      { id: '1-6', title: 'Cell Cycle & Mitosis', type: 'lab', duration: '90 min', completed: true, aiGenerated: true },
      { id: '1-7', title: 'Review Session', type: 'discussion', duration: '50 min', completed: true, aiGenerated: false },
      { id: '1-8', title: 'Unit 1 Assessment', type: 'assessment', duration: '60 min', completed: true, aiGenerated: false },
    ],
    assessments: ['Cell Organelle Quiz', 'Transport Lab Report', 'Unit 1 Test'],
  },
  {
    id: '2',
    title: 'Genetics & Heredity',
    weeks: '4 weeks', weeksNum: 4, startWeek: 4,
    status: 'in-progress',
    color: '#6366f1',
    standards: 5, lessons: 10, progress: 60,
    paceStatus: 'behind',
    description: 'Comprehensive study of DNA structure, gene expression, Mendelian genetics, and modern biotechnology applications.',
    objectives: [
      'Explain the structure of DNA and how it encodes genetic information',
      'Trace the process from gene to protein through transcription and translation',
      'Apply Mendelian inheritance patterns to predict offspring traits',
      'Evaluate the ethical implications of genetic technologies',
    ],
    topics: ['DNA Structure', 'Protein Synthesis', 'Mendelian Genetics', 'Genetic Disorders', 'Biotechnology', 'CRISPR'],
    lessonList: [
      { id: '2-1', title: 'DNA Structure & Replication', type: 'lecture', duration: '50 min', completed: true, aiGenerated: false },
      { id: '2-2', title: 'Transcription & Translation', type: 'lecture', duration: '50 min', completed: true, aiGenerated: true },
      { id: '2-3', title: 'Protein Synthesis Lab', type: 'lab', duration: '90 min', completed: true, aiGenerated: false },
      { id: '2-4', title: 'Mendelian Genetics', type: 'lecture', duration: '50 min', completed: true, aiGenerated: false },
      { id: '2-5', title: 'Punnett Square Practice', type: 'discussion', duration: '45 min', completed: true, aiGenerated: true },
      { id: '2-6', title: 'Genetics Problem Set', type: 'assessment', duration: '60 min', completed: false, aiGenerated: false },
      { id: '2-7', title: 'Genetic Disorders Case Studies', type: 'project', duration: '90 min', completed: false, aiGenerated: true },
      { id: '2-8', title: 'Biotechnology Overview', type: 'lecture', duration: '50 min', completed: false, aiGenerated: false },
      { id: '2-9', title: 'CRISPR Ethics Discussion', type: 'discussion', duration: '45 min', completed: false, aiGenerated: true },
      { id: '2-10', title: 'Unit 2 Assessment', type: 'assessment', duration: '60 min', completed: false, aiGenerated: false },
    ],
    assessments: ['DNA Quiz', 'Genetics Problem Set', 'Case Study Presentation', 'Unit 2 Test'],
  },
  {
    id: '3',
    title: 'Evolution & Natural Selection',
    weeks: '3 weeks', weeksNum: 3, startWeek: 8,
    status: 'upcoming',
    color: '#f97316',
    standards: 3, lessons: 7, progress: 0,
    paceStatus: 'on-track',
    description: 'Exploration of evolutionary theory, the mechanisms of natural selection, and the evidence supporting common descent.',
    objectives: [
      'Evaluate the lines of evidence supporting evolutionary theory',
      'Explain the mechanism of natural selection and its requirements',
      'Analyze how populations change over time through microevolution',
      'Construct phylogenetic trees to show evolutionary relationships',
    ],
    topics: ['Evidence for Evolution', 'Natural Selection', 'Speciation', 'Phylogenetics', 'Population Genetics'],
    lessonList: [
      { id: '3-1', title: 'Evidence for Evolution', type: 'lecture', duration: '50 min', completed: false, aiGenerated: false },
      { id: '3-2', title: 'Darwin\'s Theory', type: 'discussion', duration: '45 min', completed: false, aiGenerated: true },
      { id: '3-3', title: 'Natural Selection Simulation', type: 'lab', duration: '90 min', completed: false, aiGenerated: false },
      { id: '3-4', title: 'Mechanisms of Evolution', type: 'lecture', duration: '50 min', completed: false, aiGenerated: false },
      { id: '3-5', title: 'Speciation Case Studies', type: 'project', duration: '90 min', completed: false, aiGenerated: true },
      { id: '3-6', title: 'Phylogenetic Trees', type: 'lecture', duration: '50 min', completed: false, aiGenerated: false },
      { id: '3-7', title: 'Unit 3 Assessment', type: 'assessment', duration: '60 min', completed: false, aiGenerated: false },
    ],
    assessments: ['Evolution Quiz', 'Species Analysis', 'Unit 3 Test'],
  },
  {
    id: '4',
    title: 'Ecology & Ecosystems',
    weeks: '3 weeks', weeksNum: 3, startWeek: 11,
    status: 'upcoming',
    color: '#22d3ee',
    standards: 4, lessons: 9, progress: 0,
    paceStatus: 'on-track',
    description: 'Investigation of ecological relationships, energy flow through ecosystems, and human impacts on natural systems.',
    objectives: [
      'Trace the flow of energy through trophic levels in an ecosystem',
      'Explain how matter cycles through Earth\'s biogeochemical cycles',
      'Analyze how changes in population size affect community structure',
      'Evaluate human impacts on biodiversity and ecosystem services',
    ],
    topics: ['Energy Flow', 'Nutrient Cycles', 'Population Dynamics', 'Community Ecology', 'Human Impact', 'Conservation'],
    lessonList: [
      { id: '4-1', title: 'Ecosystem Components', type: 'lecture', duration: '50 min', completed: false, aiGenerated: false },
      { id: '4-2', title: 'Energy Flow & Food Webs', type: 'lecture', duration: '50 min', completed: false, aiGenerated: true },
      { id: '4-3', title: 'Biogeochemical Cycles', type: 'lecture', duration: '50 min', completed: false, aiGenerated: false },
      { id: '4-4', title: 'Carbon Cycle Lab', type: 'lab', duration: '90 min', completed: false, aiGenerated: false },
      { id: '4-5', title: 'Population Dynamics', type: 'lecture', duration: '50 min', completed: false, aiGenerated: true },
      { id: '4-6', title: 'Predator-Prey Simulation', type: 'lab', duration: '90 min', completed: false, aiGenerated: false },
      { id: '4-7', title: 'Human Impact Case Study', type: 'project', duration: '90 min', completed: false, aiGenerated: true },
      { id: '4-8', title: 'Conservation Debate', type: 'discussion', duration: '45 min', completed: false, aiGenerated: false },
      { id: '4-9', title: 'Unit 4 Assessment', type: 'assessment', duration: '60 min', completed: false, aiGenerated: false },
    ],
    assessments: ['Ecosystem Quiz', 'Cycle Models', 'Human Impact Report', 'Unit 4 Test'],
  },
  {
    id: '5',
    title: 'Human Body Systems',
    weeks: '4 weeks', weeksNum: 4, startWeek: 14,
    status: 'draft',
    color: '#ec4899',
    standards: 6, lessons: 12, progress: 0,
    paceStatus: 'on-track',
    description: 'Comprehensive exploration of human anatomy and physiology across major organ systems, integrating structure and function.',
    objectives: [
      'Describe the structure and function of major organ systems',
      'Explain how organ systems work together to maintain homeostasis',
      'Analyze the causes and effects of diseases affecting specific organ systems',
      'Design an experiment to test a hypothesis about body system function',
    ],
    topics: ['Circulatory System', 'Respiratory System', 'Nervous System', 'Digestive System', 'Immune System', 'Endocrine System'],
    lessonList: [
      { id: '5-1', title: 'Introduction to Organ Systems', type: 'lecture', duration: '50 min', completed: false, aiGenerated: false },
      { id: '5-2', title: 'Circulatory System', type: 'lecture', duration: '50 min', completed: false, aiGenerated: true },
      { id: '5-3', title: 'Heart Rate Lab', type: 'lab', duration: '90 min', completed: false, aiGenerated: false },
      { id: '5-4', title: 'Respiratory System', type: 'lecture', duration: '50 min', completed: false, aiGenerated: false },
      { id: '5-5', title: 'Nervous System & Brain', type: 'lecture', duration: '50 min', completed: false, aiGenerated: true },
      { id: '5-6', title: 'Reflex Arc Lab', type: 'lab', duration: '90 min', completed: false, aiGenerated: false },
      { id: '5-7', title: 'Digestive System', type: 'lecture', duration: '50 min', completed: false, aiGenerated: false },
      { id: '5-8', title: 'Immune System Basics', type: 'lecture', duration: '50 min', completed: false, aiGenerated: true },
      { id: '5-9', title: 'Endocrine System', type: 'lecture', duration: '50 min', completed: false, aiGenerated: false },
      { id: '5-10', title: 'Disease Case Studies', type: 'project', duration: '120 min', completed: false, aiGenerated: true },
      { id: '5-11', title: 'Systems Integration Review', type: 'discussion', duration: '50 min', completed: false, aiGenerated: false },
      { id: '5-12', title: 'Final Unit Assessment', type: 'assessment', duration: '80 min', completed: false, aiGenerated: false },
    ],
    assessments: ['Systems Quiz x3', 'Case Study Project', 'Final Unit Test'],
  },
]

const statusConfig = {
  completed:   { bg: 'bg-success-500/15', text: 'text-success-400', border: 'border-success-500/20', label: 'Completed' },
  'in-progress': { bg: 'bg-accent-500/15', text: 'text-accent-400', border: 'border-accent-500/20', label: 'In Progress' },
  upcoming:    { bg: 'bg-surface-500/15', text: 'text-surface-400', border: 'border-white/[0.06]', label: 'Upcoming' },
  draft:       { bg: 'bg-warning-500/15', text: 'text-warning-400', border: 'border-warning-500/20', label: 'Draft' },
} as const

const lessonTypeConfig = {
  lecture:    { color: '#6366f1', bg: 'bg-accent-500/15', label: 'Lecture' },
  lab:        { color: '#10b981', bg: 'bg-success-500/15', label: 'Lab' },
  discussion: { color: '#f97316', bg: 'bg-orange-500/15', label: 'Discussion' },
  assessment: { color: '#f43f5e', bg: 'bg-danger-400/15', label: 'Assessment' },
  project:    { color: '#8b5cf6', bg: 'bg-purple-500/15', label: 'Project' },
} as const

const paceConfig = {
  'on-track': { color: 'text-success-400', bg: 'bg-success-500/15', label: 'On Track' },
  ahead:      { color: 'text-electric-400', bg: 'bg-electric-400/15', label: 'Ahead' },
  behind:     { color: 'text-warning-400', bg: 'bg-warning-500/15', label: 'Behind' },
} as const

const quarterData = [
  { quarter: 'Q1', label: 'Aug-Oct', units: 2, weeks: 7, progress: 100, color: '#10b981' },
  { quarter: 'Q2', label: 'Nov-Jan', units: 1, weeks: 4, progress: 60, color: '#6366f1' },
  { quarter: 'Q3', label: 'Feb-Apr', units: 1, weeks: 3, progress: 0, color: '#f97316' },
  { quarter: 'Q4', label: 'Apr-Jun', units: 1, weeks: 4, progress: 0, color: '#22d3ee' },
]

const standardsCoverage = [
  { label: 'LS1: Molecules to Organisms', covered: 8, total: 8, color: '#10b981' },
  { label: 'LS2: Ecosystems', covered: 0, total: 6, color: '#22d3ee' },
  { label: 'LS3: Heredity', covered: 3, total: 5, color: '#6366f1' },
  { label: 'LS4: Biological Evolution', covered: 0, total: 4, color: '#f97316' },
  { label: 'PS1: Matter & Energy', covered: 2, total: 3, color: '#ec4899' },
]

export default function CurriculumPage() {
  const [expandedUnit, setExpandedUnit] = useState<string | null>('2')
  const [view, setView] = useState<ViewMode>('list')
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null)
  const [showLessons, setShowLessons] = useState<Record<string, boolean>>({})
  const [timelineMonth, setTimelineMonth] = useState(0)
  const [toastMsg, setToastMsg] = useState('')
  function showToast(msg: string) { setToastMsg(msg); setTimeout(() => setToastMsg(''), 2500) }

  const totalLessons = units.reduce((acc, u) => acc + u.lessons, 0)
  const totalStandards = units.reduce((acc, u) => acc + u.standards, 0)
  const completedLessons = units.flatMap(u => u.lessonList).filter(l => l.completed).length
  const overallProgress = Math.round(units.reduce((acc, u) => acc + u.progress, 0) / units.length)

  function toggleLessons(unitId: string) {
    setShowLessons(prev => ({ ...prev, [unitId]: !prev[unitId] }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <FadeUp>
        <div className="hero-mesh rounded-3xl p-6 border border-white/[0.06]">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                <Map className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-black text-white tracking-tight">Curriculum Planner</h1>
                  <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full font-bold border border-indigo-500/20">AI-Powered</span>
                </div>
                <p className="text-sm text-surface-400">AP Biology · {units.length} units · {totalLessons} lessons · AY 2025-26</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-end">
              <div className="flex items-center gap-1 bg-white/[0.06] rounded-full p-0.5 text-xs">
                {(['list', 'timeline', 'calendar'] as ViewMode[]).map(v => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    className={`px-3 py-1 rounded-full transition-all capitalize ${view === v ? 'bg-white/[0.1] text-white font-semibold' : 'text-surface-500 hover:text-surface-300'}`}
                  >
                    {v}
                  </button>
                ))}
              </div>
              <motion.button className="btn-gradient text-xs" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => showToast('AI curriculum plan generated!')}>
                <Sparkles className="w-3.5 h-3.5" /> AI Plan
              </motion.button>
              <button className="btn-secondary text-xs px-3 py-1.5" onClick={() => showToast('New unit added!')}>
                <Plus className="w-3.5 h-3.5" /> Add Unit
              </button>
              <button className="btn-secondary text-xs px-3 py-1.5" onClick={() => showToast('Curriculum exported!')}>
                <Download className="w-3.5 h-3.5" /> Export
              </button>
            </div>
          </div>
          <div className="border-t border-white/[0.06] pt-4 flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold">Units</span>
              <span className="text-xs font-bold text-white">{units.length}</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold">Lessons</span>
              <span className="text-xs font-bold text-white">{totalLessons}</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold">Completed</span>
              <span className="text-xs font-bold text-success-400">{completedLessons}</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold">Progress</span>
              <span className="text-xs font-bold text-indigo-400">{overallProgress}%</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold">Standards</span>
              <span className="text-xs font-bold text-white">{totalStandards}</span>
            </div>
          </div>
        </div>
      </FadeUp>

      {/* Stats */}
      <FadeUp delay={0.05}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Total Units', value: units.length.toString(), sub: '17 weeks total', icon: Layers, color: '#6366f1' },
            { label: 'Lessons Planned', value: totalLessons.toString(), sub: `${completedLessons} completed`, icon: BookOpen, color: '#14b8a6' },
            { label: 'Standards Covered', value: totalStandards.toString(), sub: 'NGSS aligned', icon: Target, color: '#f97316' },
            { label: 'Overall Progress', value: `${overallProgress}%`, sub: 'on-track for year', icon: TrendingUp, color: '#10b981' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="glass-card p-4"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
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

      {/* AI Pacing Alert */}
      <FadeUp delay={0.08}>
        <div className="glass-card p-4 border border-warning-500/20">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-warning-500/20">
              <Brain className="w-4.5 h-4.5 text-warning-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-bold text-white">AI Pacing Alert</span>
                <span className="text-[10px] bg-warning-500/20 text-warning-400 px-2 py-0.5 rounded-full font-semibold">Attention Needed</span>
              </div>
              <p className="text-xs text-surface-400 leading-relaxed">
                Unit 2 (Genetics & Heredity) is running <span className="text-warning-400 font-semibold">3 days behind schedule</span>. At the current pace, the Evolution unit may need compression by 2 days. Recommended: skip the optional Biotechnology extension lab, or move it to the enrichment track.
              </p>
              <div className="flex items-center gap-3 mt-2">
                <motion.button className="btn-gradient text-[10px] px-2.5 py-1" whileHover={{ scale: 1.02 }}>
                  <Zap className="w-2.5 h-2.5" /> Auto-Adjust Pacing
                </motion.button>
                <button className="text-xs text-accent-400 hover:text-accent-300 font-semibold">View alternatives</button>
                <button className="text-xs text-surface-500 hover:text-surface-300 ml-auto">Dismiss</button>
              </div>
            </div>
          </div>
        </div>
      </FadeUp>

      {/* Year Overview */}
      <FadeUp delay={0.1}>
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white">Year-at-a-Glance</h3>
            <span className="text-xs text-surface-500">Academic Year 2025–2026</span>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {quarterData.map((q, i) => (
              <motion.div
                key={q.quarter}
                className="space-y-2"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.06 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-white">{q.quarter}</p>
                    <p className="text-[10px] text-surface-500">{q.label}</p>
                  </div>
                  <span className="text-[10px] font-bold" style={{ color: q.color }}>{q.progress}%</span>
                </div>
                {(() => {
                  const W = 200, bw = (q.progress / 100) * W
                  return (
                    <svg viewBox={`0 0 ${W} 10`} className="w-full overflow-visible">
                      <defs>
                        <linearGradient id={`cur-q-${i}`} x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor={q.color} stopOpacity={0.9} />
                          <stop offset="100%" stopColor={q.color} stopOpacity={0.6} />
                        </linearGradient>
                      </defs>
                      <rect x={0} y={2} width={W} height={6} rx={3} fill="rgba(255,255,255,0.05)" />
                      <motion.rect x={0} y={2} height={6} rx={3} fill={`url(#cur-q-${i})`}
                        initial={{ width: 0 }} animate={{ width: bw }}
                        transition={{ delay: 0.3 + i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </svg>
                  )
                })()}
                <p className="text-[10px] text-surface-500">{q.units} unit{q.units > 1 ? 's' : ''} · {q.weeks} wks</p>
              </motion.div>
            ))}
          </div>

          {/* Visual timeline bar */}
          <div className="mt-4 pt-4 border-t border-white/[0.06]">
            <div className="flex gap-1 h-8">
              {units.map((unit, i) => (
                <motion.div
                  key={unit.id}
                  className="rounded-md flex items-center justify-center text-[9px] font-bold text-white overflow-hidden cursor-pointer"
                  style={{
                    flex: unit.weeksNum,
                    backgroundColor: unit.color + '30',
                    borderLeft: `3px solid ${unit.color}`,
                    opacity: unit.status === 'draft' ? 0.5 : 1,
                  }}
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.2 + i * 0.08, duration: 0.5 }}
                  whileHover={{ backgroundColor: unit.color + '50' }}
                  onClick={() => setExpandedUnit(unit.id === expandedUnit ? null : unit.id)}
                >
                  <span className="truncate px-1">U{unit.id}</span>
                </motion.div>
              ))}
            </div>
            <div className="flex text-[9px] text-surface-600 mt-1 gap-1">
              {units.map(u => (
                <div key={u.id} style={{ flex: u.weeksNum }} className="text-center truncate">{u.weeks}</div>
              ))}
            </div>
          </div>
        </div>
      </FadeUp>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main: Unit list */}
        <div className="xl:col-span-2 space-y-3">
          <AnimatePresence>
            {units.map((unit, i) => {
              const statusCfg = statusConfig[unit.status]
              const paceCfg = paceConfig[unit.paceStatus]
              const isExpanded = expandedUnit === unit.id
              const lessonsVisible = showLessons[unit.id]
              const completedLessonsCount = unit.lessonList.filter(l => l.completed).length
              return (
                <motion.div
                  key={unit.id}
                  className={`glass-card overflow-hidden border ${statusCfg.border}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 + i * 0.06 }}
                >
                  {/* Unit header */}
                  <button
                    className="w-full flex items-center gap-4 p-5 text-left hover:bg-white/[0.02] transition-colors"
                    onClick={() => setExpandedUnit(isExpanded ? null : unit.id)}
                  >
                    <div className="w-1.5 h-12 rounded-full flex-shrink-0" style={{ backgroundColor: unit.color }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h4 className="text-sm font-black text-white">{unit.title}</h4>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${statusCfg.bg} ${statusCfg.text}`}>
                          {statusCfg.label}
                        </span>
                        {unit.paceStatus !== 'on-track' && (
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${paceCfg.bg} ${paceCfg.color}`}>
                            {paceCfg.label}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-surface-500">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {unit.weeks}</span>
                        <span>{unit.lessons} lessons</span>
                        <span>{unit.standards} standards</span>
                        {unit.status === 'in-progress' && (
                          <span className="text-accent-400 font-semibold">{completedLessonsCount}/{unit.lessons} done</span>
                        )}
                      </div>
                    </div>
                    <div className="w-24 flex-shrink-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-surface-500">{unit.progress}%</span>
                      </div>
                      {(() => {
                        const bw = (unit.progress / 100) * 96
                        return (
                          <svg viewBox="0 0 96 8" className="w-full overflow-visible">
                            <defs>
                              <linearGradient id={`cur-unit-${unit.id}`} x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor={unit.color} stopOpacity={0.9} />
                                <stop offset="100%" stopColor={unit.color} stopOpacity={0.55} />
                              </linearGradient>
                            </defs>
                            <rect x={0} y={1} width={96} height={6} rx={3} fill="rgba(255,255,255,0.05)" />
                            <motion.rect x={0} y={1} height={6} rx={3} fill={`url(#cur-unit-${unit.id})`}
                              initial={{ width: 0 }} animate={{ width: bw }}
                              transition={{ delay: 0.3 + i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            />
                          </svg>
                        )
                      })()}
                    </div>
                    <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown className="w-4 h-4 text-surface-500 flex-shrink-0" />
                    </motion.div>
                  </button>

                  {/* Expanded content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-white/[0.06] p-5 space-y-4">
                          {/* Description */}
                          <p className="text-xs text-surface-400 leading-relaxed">{unit.description}</p>

                          {/* Learning objectives */}
                          <div>
                            <h5 className="text-xs font-bold text-surface-300 mb-2 flex items-center gap-1.5">
                              <Target className="w-3.5 h-3.5" /> Learning Objectives
                            </h5>
                            <div className="space-y-1.5">
                              {unit.objectives.map((obj, oi) => (
                                <motion.div
                                  key={oi}
                                  className="flex items-start gap-2"
                                  initial={{ opacity: 0, x: -6 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: oi * 0.05 }}
                                >
                                  <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: unit.color + '25' }}>
                                    <Check className="w-2.5 h-2.5" style={{ color: unit.color }} />
                                  </div>
                                  <p className="text-xs text-surface-400 leading-relaxed">{obj}</p>
                                </motion.div>
                              ))}
                            </div>
                          </div>

                          {/* Topics */}
                          <div>
                            <h5 className="text-xs font-bold text-surface-300 mb-2 flex items-center gap-1.5">
                              <BookOpen className="w-3.5 h-3.5" /> Key Topics
                            </h5>
                            <div className="flex flex-wrap gap-1.5">
                              {unit.topics.map(topic => (
                                <span key={topic} className="text-[10px] px-2 py-1 rounded-lg text-surface-300" style={{ backgroundColor: unit.color + '15', border: `1px solid ${unit.color}25` }}>
                                  {topic}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Lesson list toggle */}
                          <div>
                            <button
                              className="flex items-center gap-2 text-xs font-bold text-surface-300 hover:text-white mb-2 transition-colors"
                              onClick={() => toggleLessons(unit.id)}
                            >
                              <FileText className="w-3.5 h-3.5" />
                              {lessonsVisible ? 'Hide' : 'Show'} Lessons ({unit.lessons})
                              <motion.span animate={{ rotate: lessonsVisible ? 180 : 0 }} transition={{ duration: 0.2 }}>
                                <ChevronDown className="w-3.5 h-3.5" />
                              </motion.span>
                            </button>
                            <AnimatePresence>
                              {lessonsVisible && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden space-y-1.5"
                                >
                                  {unit.lessonList.map((lesson, li) => {
                                    const lType = lessonTypeConfig[lesson.type]
                                    return (
                                      <motion.div
                                        key={lesson.id}
                                        className="flex items-center gap-3 px-3 py-2 bg-white/[0.03] rounded-lg border border-white/[0.04] hover:border-white/[0.10] transition-colors"
                                        initial={{ opacity: 0, x: -6 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: li * 0.04 }}
                                      >
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                                          lesson.completed ? 'bg-success-500/25' : 'bg-white/[0.06]'
                                        }`}>
                                          {lesson.completed
                                            ? <Check className="w-3 h-3 text-success-400" />
                                            : <span className="text-[9px] text-surface-500 font-bold">{li + 1}</span>
                                          }
                                        </div>
                                        <span className="text-xs text-surface-300 flex-1">{lesson.title}</span>
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium ${lType.bg}`} style={{ color: lType.color }}>{lType.label}</span>
                                        <span className="text-[10px] text-surface-600">{lesson.duration}</span>
                                        {lesson.aiGenerated && (
                                          <Sparkles className="w-3 h-3 text-accent-400 flex-shrink-0" />
                                        )}
                                      </motion.div>
                                    )
                                  })}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          {/* Assessments */}
                          <div>
                            <h5 className="text-xs font-bold text-surface-300 mb-2 flex items-center gap-1.5">
                              <CheckSquare className="w-3.5 h-3.5" /> Assessments
                            </h5>
                            <div className="flex flex-wrap gap-2">
                              {unit.assessments.map(a => (
                                <span key={a} className="text-[10px] px-2 py-1 bg-danger-400/10 text-danger-400 border border-danger-400/20 rounded-lg">{a}</span>
                              ))}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 pt-1">
                            <motion.button
                              className="btn-gradient text-xs"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Sparkles className="w-3 h-3" /> Generate Lessons
                            </motion.button>
                            <button className="btn-secondary text-xs px-3 py-1.5"><Eye className="w-3 h-3" /> Preview</button>
                            <button className="btn-secondary text-xs px-3 py-1.5"><Edit3 className="w-3 h-3" /> Edit</button>
                            <button className="btn-secondary text-xs px-3 py-1.5"><Copy className="w-3 h-3" /> Duplicate</button>
                            <button className="btn-secondary text-xs px-3 py-1.5 ml-auto text-danger-400 hover:bg-danger-400/10">
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </AnimatePresence>

          {/* Add unit CTA */}
          <motion.button
            className="w-full glass-card p-4 border-2 border-dashed border-white/[0.08] hover:border-accent-500/30 flex items-center justify-center gap-2 text-surface-500 hover:text-white transition-all"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-semibold">Add New Unit</span>
          </motion.button>
        </div>

        {/* Sidebar: Standards coverage + AI tools */}
        <div className="space-y-4">
          {/* Standards coverage */}
          <FadeInWhenVisible>
            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white">Standards Coverage</h3>
                <span className="text-xs text-surface-500">NGSS</span>
              </div>
              {/* Radar chart */}
              {(() => {
                const items = standardsCoverage
                const N = items.length
                const CX = 80, CY = 80, R = 60
                const toXY = (i: number, r: number) => {
                  const angle = (i / N) * 2 * Math.PI - Math.PI / 2
                  return { x: CX + r * Math.cos(angle), y: CY + r * Math.sin(angle) }
                }
                const dataPoints = items.map((s, i) => toXY(i, R * (s.covered / s.total)))
                const dataPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ') + ' Z'
                const gridLevels = [0.25, 0.5, 0.75, 1.0]
                return (
                  <div className="flex justify-center mb-4">
                    <svg viewBox="0 0 160 160" width={140} height={140}>
                      {/* Grid rings */}
                      {gridLevels.map(pct => {
                        const pts = items.map((_, i) => toXY(i, R * pct))
                        const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ') + ' Z'
                        return <path key={pct} d={path} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
                      })}
                      {/* Axis lines */}
                      {items.map((_, i) => {
                        const p = toXY(i, R)
                        return <line key={i} x1={CX} y1={CY} x2={p.x.toFixed(1)} y2={p.y.toFixed(1)} stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
                      })}
                      {/* Data polygon */}
                      <path d={dataPath} fill="rgba(99,102,241,0.15)" stroke="#6366f1" strokeWidth="1.5" />
                      {/* Data dots */}
                      {dataPoints.map((p, i) => (
                        <circle key={i} cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r="3" fill={items[i].color} />
                      ))}
                      {/* Labels */}
                      {items.map((s, i) => {
                        const p = toXY(i, R + 14)
                        return (
                          <text key={i} x={p.x.toFixed(1)} y={p.y.toFixed(1)} textAnchor="middle" dominantBaseline="middle" fontSize="6.5" fill="rgba(255,255,255,0.45)">
                            {s.label.split(':')[0]}
                          </text>
                        )
                      })}
                    </svg>
                  </div>
                )
              })()}
              {(() => {
                const W = 300, LW = 28, CW = 34, GAP = 7, ROW = 20
                const BAR_MAX = W - LW - CW - 6
                const H = standardsCoverage.length * (ROW + GAP) - GAP
                return (
                  <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible">
                    <defs>
                      {standardsCoverage.map((std, i) => (
                        <linearGradient key={i} id={`cu-std-${i}`} x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor={std.color} stopOpacity={0.9} />
                          <stop offset="100%" stopColor={std.color} stopOpacity={0.45} />
                        </linearGradient>
                      ))}
                    </defs>
                    {standardsCoverage.map((std, i) => {
                      const pct = Math.round((std.covered / std.total) * 100)
                      const bw = (pct / 100) * BAR_MAX
                      const y = i * (ROW + GAP)
                      return (
                        <g key={std.label}>
                          <text x={0} y={y + 13} fill={std.color} fontSize={10} fontFamily="inherit" fontWeight="bold">{std.label.split(':')[0]}</text>
                          <rect x={LW} y={y + 4} width={BAR_MAX} height={12} rx={3} fill="rgba(255,255,255,0.04)" />
                          <motion.rect x={LW} y={y + 4} height={12} rx={3} fill={`url(#cu-std-${i})`}
                            initial={{ width: 0 }} animate={{ width: bw }}
                            transition={{ delay: 0.3 + i * 0.08, duration: 0.6, ease: 'easeOut' }}
                          />
                          <text x={LW + BAR_MAX + 5} y={y + 13} fill="rgba(255,255,255,0.6)" fontSize={10} fontFamily="inherit">{std.covered}/{std.total}</text>
                        </g>
                      )
                    })}
                  </svg>
                )
              })()}
              <div className="mt-4 pt-3 border-t border-white/[0.06]">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-surface-400">Overall Coverage</span>
                  <span className="font-bold text-white">52%</span>
                </div>
                {(() => {
                  const W = 500, H = 8
                  return (
                    <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible mt-1.5">
                      <defs>
                        <linearGradient id="cur-cov" x1="0" x2="1" y1="0" y2="0">
                          <stop offset="0%" stopColor="#6366f1" />
                          <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                      </defs>
                      <rect x={0} y={0} width={W} height={H} rx={4} fill="rgba(255,255,255,0.06)" />
                      <motion.rect
                        x={0} y={0} height={H} rx={4}
                        fill="url(#cur-cov)"
                        initial={{ width: 0 }}
                        animate={{ width: W * 0.52 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                      />
                    </svg>
                  )
                })()}
              </div>
            </div>
          </FadeInWhenVisible>

          {/* AI Curriculum Tools */}
          <FadeInWhenVisible delay={0.05}>
            <div className="glass-card p-5">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-accent-400" /> AI Curriculum Tools
              </h3>
              <div className="space-y-2">
                {[
                  { icon: Zap, label: 'Generate Full Unit Plan', color: '#6366f1', desc: 'Complete unit with lessons, assessments & rubrics' },
                  { icon: RefreshCw, label: 'Rebalance Pacing', color: '#f97316', desc: 'Auto-adjust week distribution to meet year-end goals' },
                  { icon: Target, label: 'Fill Standards Gaps', color: '#10b981', desc: 'Identify and close alignment gaps automatically' },
                  { icon: Users, label: 'Differentiation Layer', color: '#ec4899', desc: 'Add IEP/504 accommodations to every lesson' },
                  { icon: BarChart2, label: 'Assessment Audit', color: '#14b8a6', desc: 'Balance formative/summative across the year' },
                ].map((tool, i) => (
                  <motion.button
                    key={tool.label}
                    className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-white/[0.04] transition-colors text-left group"
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    whileHover={{ x: 2 }}
                  >
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: tool.color + '20' }}>
                      <tool.icon className="w-3.5 h-3.5" style={{ color: tool.color }} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white group-hover:text-accent-300 transition-colors">{tool.label}</p>
                      <p className="text-[10px] text-surface-500 leading-snug">{tool.desc}</p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-surface-600 group-hover:text-accent-400 flex-shrink-0 mt-1 transition-colors" />
                  </motion.button>
                ))}
              </div>
            </div>
          </FadeInWhenVisible>

          {/* Lesson type legend */}
          <FadeInWhenVisible delay={0.1}>
            <div className="glass-card p-4">
              <h4 className="text-xs font-bold text-surface-300 mb-3 flex items-center gap-1.5">
                <PenTool className="w-3 h-3" /> Lesson Types
              </h4>
              <div className="space-y-1.5">
                {Object.entries(lessonTypeConfig).map(([type, cfg]) => (
                  <div key={type} className="flex items-center gap-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${cfg.bg}`} style={{ color: cfg.color }}>{cfg.label}</span>
                    <span className="text-[10px] text-surface-500 capitalize">{type}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-accent-400" />
                <span className="text-[10px] text-surface-500">AI-generated lessons marked with ✦</span>
              </div>
            </div>
          </FadeInWhenVisible>

          {/* Upcoming milestones */}
          <FadeInWhenVisible delay={0.12}>
            <div className="glass-card p-4">
              <h4 className="text-xs font-bold text-surface-300 mb-3 flex items-center gap-1.5">
                <Flag className="w-3 h-3" /> Upcoming Milestones
              </h4>
              <div className="space-y-2">
                {[
                  { date: 'Aug 12', label: 'Unit 2 Genetics Problem Set', type: 'assessment', urgent: true },
                  { date: 'Aug 19', label: 'Unit 2 Case Study Presentations', type: 'project', urgent: false },
                  { date: 'Aug 26', label: 'Unit 2 Final Assessment', type: 'assessment', urgent: false },
                  { date: 'Sep 2', label: 'Unit 3 Evolution begins', type: 'milestone', urgent: false },
                ].map((m, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-1 h-8 rounded-full flex-shrink-0 ${
                      m.urgent ? 'bg-danger-400' : m.type === 'assessment' ? 'bg-warning-400' :
                      m.type === 'project' ? 'bg-purple-400' : 'bg-accent-400'
                    }`} />
                    <div>
                      <p className="text-[10px] text-surface-500">{m.date}</p>
                      <p className="text-xs text-surface-300">{m.label}</p>
                    </div>
                    {m.urgent && (
                      <AlertTriangle className="w-3.5 h-3.5 text-danger-400 ml-auto flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </FadeInWhenVisible>
        </div>
      </div>

      <AnimatePresence>
        {toastMsg && (
          <motion.div
            className="fixed top-5 right-5 z-[100] flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl text-sm font-semibold text-white border border-white/[0.08]"
            style={{ background: 'linear-gradient(135deg,#0a0f1a,#111827)' }}
            initial={{ opacity: 0, y: -12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
            exit={{ opacity: 0, y: -12, scale: 0.95 }}
          >
            <CheckCircle className="w-4 h-4 text-indigo-400 flex-shrink-0" />
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
