'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutGrid, Download, Plus, Eye, Edit2, X,
  CheckCircle, Clock, Target, TrendingUp,
  Calendar, BookOpen, ClipboardList, Layers, ChevronRight,
} from 'lucide-react'
import { FadeUp, FadeInWhenVisible, StaggerList, StaggerItem, fadeUp } from '@/components/ui/motion'

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */

type UnitStatus = 'Active' | 'Planning' | 'Complete'

interface UnitObjective {
  text: string
}

interface UnitAssessment {
  title: string
  type: string
}

interface WeekEntry {
  week: number
  topic: string
}

interface Unit {
  id: string
  title: string
  subject: string
  grade: string
  color: string
  weekStart: number
  weekEnd: number
  standardsCount: number
  status: UnitStatus
  description: string
  progress: number
  objectives: UnitObjective[]
  assessments: UnitAssessment[]
  timeline: WeekEntry[]
}

interface UnitForm {
  title: string
  subject: string
  grade: string
  durationWeeks: string
  standards: string
}

/* ─────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────── */

const SUBJECT_COLORS: Record<string, string> = {
  Biology: '#10b981',
  Mathematics: '#6366f1',
  History: '#f97316',
  English: '#ec4899',
  Chemistry: '#22d3ee',
  Physics: '#8b5cf6',
}

const SUBJECT_OPTIONS = Object.keys(SUBJECT_COLORS)

const STATUS_CONFIG: Record<UnitStatus, { bg: string; text: string; dot: string }> = {
  Active:   { bg: 'bg-success-500/15', text: 'text-success-400', dot: 'bg-success-400' },
  Planning: { bg: 'bg-warning-400/15', text: 'text-warning-400', dot: 'bg-warning-400' },
  Complete: { bg: 'bg-accent-500/15',  text: 'text-accent-400',  dot: 'bg-accent-400'  },
}

/* ─────────────────────────────────────────────
   INITIAL DATA
───────────────────────────────────────────── */

const initialUnits: Unit[] = [
  {
    id: 'u1',
    title: 'Photosynthesis & Energy Flow',
    subject: 'Biology',
    grade: '10th Grade',
    color: '#10b981',
    weekStart: 1, weekEnd: 4,
    standardsCount: 4,
    status: 'Active',
    description: 'Explore how plants convert light energy into chemical energy and how this powers ecosystems through the process of photosynthesis.',
    progress: 72,
    objectives: [
      { text: 'Explain the chemical equation for photosynthesis and identify inputs/outputs' },
      { text: 'Analyze how light intensity affects the rate of photosynthesis using data' },
      { text: 'Connect photosynthesis to cellular respiration as reverse processes' },
      { text: 'Evaluate the ecological importance of photosynthesis to global carbon cycles' },
    ],
    assessments: [
      { title: 'Lab Report: Light Intensity Experiment', type: 'Lab' },
      { title: 'Unit Quiz: Photosynthesis Basics', type: 'Quiz' },
      { title: 'Exit Ticket: 3-2-1 Reflection', type: 'Formative' },
    ],
    timeline: [
      { week: 1, topic: 'Introduction to photosynthesis & chemical equations' },
      { week: 2, topic: 'Chlorophyll, light spectrum, and pigment roles' },
      { week: 3, topic: 'Lab: Elodea oxygen bubble experiment' },
      { week: 4, topic: 'Assessment, review, and ecosystem connections' },
    ],
  },
  {
    id: 'u2',
    title: 'Quadratic Functions & Modeling',
    subject: 'Mathematics',
    grade: '9th Grade',
    color: '#6366f1',
    weekStart: 1, weekEnd: 3,
    standardsCount: 3,
    status: 'Active',
    description: 'Develop fluency with quadratic functions through graphing, factoring, and real-world application problems using projectile motion contexts.',
    progress: 55,
    objectives: [
      { text: 'Graph quadratic functions and identify key features (vertex, axis of symmetry)' },
      { text: 'Factor quadratic expressions using multiple strategies' },
      { text: 'Solve quadratic equations by factoring, completing the square, and quadratic formula' },
      { text: 'Model real-world situations with quadratic functions' },
    ],
    assessments: [
      { title: 'Graphing Quadratics Task', type: 'Performance' },
      { title: 'Factoring Skills Check', type: 'Quiz' },
      { title: 'Projectile Motion Project', type: 'Project' },
    ],
    timeline: [
      { week: 1, topic: 'Introduction to parabolas, graphing in vertex form' },
      { week: 2, topic: 'Factoring techniques, zeros, and standard form' },
      { week: 3, topic: 'Quadratic formula, discriminant, and real-world modeling' },
    ],
  },
  {
    id: 'u3',
    title: 'The American Revolution',
    subject: 'History',
    grade: '8th Grade',
    color: '#f97316',
    weekStart: 5, weekEnd: 7,
    standardsCount: 5,
    status: 'Complete',
    description: 'Examine the causes, key events, and lasting impact of the American Revolution, with emphasis on primary source analysis and multiple perspectives.',
    progress: 100,
    objectives: [
      { text: 'Analyze the political, economic, and social causes of the Revolution' },
      { text: 'Evaluate primary sources from multiple perspectives (loyalist, patriot, enslaved)' },
      { text: 'Trace key military campaigns and their strategic significance' },
      { text: 'Explain how revolutionary ideals shaped the founding documents' },
      { text: 'Assess the Revolution\'s impact on different groups in colonial society' },
    ],
    assessments: [
      { title: 'Primary Source Analysis DBQ', type: 'Essay' },
      { title: 'Revolutionary Timeline Project', type: 'Project' },
      { title: 'Unit Exam', type: 'Test' },
    ],
    timeline: [
      { week: 5, topic: 'Colonial tensions, taxation without representation' },
      { week: 6, topic: 'Key battles, turning points, and military strategy' },
      { week: 7, topic: 'Treaty of Paris, founding documents, lasting legacy' },
    ],
  },
  {
    id: 'u4',
    title: 'Poetry Analysis & Craft',
    subject: 'English',
    grade: '7th Grade',
    color: '#ec4899',
    weekStart: 4, weekEnd: 6,
    standardsCount: 3,
    status: 'Complete',
    description: 'Develop close reading skills through analysis of diverse poetic forms, focusing on figurative language, structure, and the relationship between form and meaning.',
    progress: 100,
    objectives: [
      { text: 'Identify and analyze figurative language devices (metaphor, simile, imagery, alliteration)' },
      { text: 'Examine how poetic structure and form contribute to meaning' },
      { text: 'Compare perspectives and themes across poems from diverse authors' },
      { text: 'Write original poems using mentor text as a model' },
    ],
    assessments: [
      { title: 'Poem Annotation & Analysis Essay', type: 'Essay' },
      { title: 'Original Poetry Portfolio', type: 'Portfolio' },
      { title: 'Reading Response Journals', type: 'Formative' },
    ],
    timeline: [
      { week: 4, topic: 'Figurative language, imagery, and sensory details' },
      { week: 5, topic: 'Structure, form, rhyme scheme, and free verse' },
      { week: 6, topic: 'Comparative analysis and original poetry drafting' },
    ],
  },
  {
    id: 'u5',
    title: 'Atomic Structure & Periodicity',
    subject: 'Chemistry',
    grade: '11th Grade',
    color: '#22d3ee',
    weekStart: 3, weekEnd: 5,
    standardsCount: 4,
    status: 'Active',
    description: 'Investigate atomic models, electron configuration, and periodic trends to understand how atomic structure explains elemental properties and chemical behavior.',
    progress: 40,
    objectives: [
      { text: 'Describe the evolution of atomic models from Dalton to quantum mechanical model' },
      { text: 'Write electron configurations using the Aufbau principle' },
      { text: 'Explain periodic trends: atomic radius, ionization energy, electronegativity' },
      { text: 'Predict elemental properties based on position in the periodic table' },
    ],
    assessments: [
      { title: 'Atomic Model Historical Timeline', type: 'Project' },
      { title: 'Electron Configuration Quiz', type: 'Quiz' },
      { title: 'Periodic Trends Lab Analysis', type: 'Lab' },
    ],
    timeline: [
      { week: 3, topic: 'History of atomic models and subatomic particles' },
      { week: 4, topic: 'Electron configuration and quantum numbers' },
      { week: 5, topic: 'Periodic trends, patterns, and predictions' },
    ],
  },
  {
    id: 'u6',
    title: 'Motion, Forces & Newton\'s Laws',
    subject: 'Physics',
    grade: '10th Grade',
    color: '#8b5cf6',
    weekStart: 6, weekEnd: 9,
    standardsCount: 6,
    status: 'Planning',
    description: 'Build a deep understanding of kinematics, Newton\'s three laws of motion, and free-body diagrams through inquiry labs and real-world engineering challenges.',
    progress: 0,
    objectives: [
      { text: 'Distinguish between scalar and vector quantities in kinematics' },
      { text: 'Analyze motion using position-time and velocity-time graphs' },
      { text: 'Apply Newton\'s three laws to explain everyday phenomena' },
      { text: 'Construct and interpret free-body diagrams for systems in equilibrium' },
      { text: 'Calculate net force, acceleration, and friction in multi-object systems' },
      { text: 'Design an engineering challenge applying forces and motion principles' },
    ],
    assessments: [
      { title: 'Motion Graphing Lab', type: 'Lab' },
      { title: 'Newton\'s Laws Problem Set', type: 'Assignment' },
      { title: 'Egg Drop Engineering Challenge', type: 'Performance' },
      { title: 'Unit Test', type: 'Test' },
    ],
    timeline: [
      { week: 6, topic: 'Introduction to kinematics, scalars vs. vectors' },
      { week: 7, topic: 'Newton\'s first and second laws, mass and acceleration' },
      { week: 8, topic: 'Newton\'s third law, friction, free-body diagrams' },
      { week: 9, topic: 'Engineering challenge and unit assessment' },
    ],
  },
]

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */

export default function UnitPlannerPage() {
  const [units, setUnits] = useState<Unit[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('taleeko_units')
        if (saved) return JSON.parse(saved) as Unit[]
      } catch {}
    }
    return initialUnits
  })
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null)
  const [toastMsg, setToastMsg] = useState('')
  const [form, setForm] = useState<UnitForm>({
    title: '',
    subject: 'Biology',
    grade: '',
    durationWeeks: '',
    standards: '',
  })

  /* ── helpers ── */
  function showToast(msg: string) {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 2800)
  }

  function handleCreateUnit() {
    if (!form.title.trim()) {
      showToast('Please enter a unit title')
      return
    }
    const dur = parseInt(form.durationWeeks) || 2
    const lastWeekEnd = Math.max(...units.map(u => u.weekEnd), 0)
    const newUnit: Unit = {
      id: `u${Date.now()}`,
      title: form.title.trim(),
      subject: form.subject,
      grade: form.grade.trim() || 'Unspecified',
      color: SUBJECT_COLORS[form.subject] ?? '#6366f1',
      weekStart: lastWeekEnd + 1,
      weekEnd: lastWeekEnd + dur,
      standardsCount: parseInt(form.standards) || 0,
      status: 'Planning',
      description: `A new ${form.subject} unit spanning ${dur} week${dur !== 1 ? 's' : ''}.`,
      progress: 0,
      objectives: [],
      assessments: [],
      timeline: Array.from({ length: dur }, (_, i) => ({
        week: lastWeekEnd + 1 + i,
        topic: `Week ${i + 1} — to be planned`,
      })),
    }
    setUnits(prev => {
      const next = [...prev, newUnit]
      try { localStorage.setItem('taleeko_units', JSON.stringify(next)) } catch {}
      return next
    })
    setForm({ title: '', subject: 'Biology', grade: '', durationWeeks: '', standards: '' })
    showToast(`"${newUnit.title}" added to your unit list`)
  }

  /* ── derived stats ── */
  const totalUnits = units.length
  const avgDuration = units.length
    ? (units.reduce((s, u) => s + (u.weekEnd - u.weekStart + 1), 0) / units.length).toFixed(1)
    : '0'
  const totalStandards = units.reduce((s, u) => s + u.standardsCount, 0)
  const completedUnits = units.filter(u => u.status === 'Complete').length
  const completionRate = units.length ? Math.round((completedUnits / units.length) * 100) : 0

  const statCards = [
    { label: 'Total Units',       value: totalUnits,           suffix: '',   icon: LayoutGrid,  color: '#6366f1', bg: 'from-accent-600 to-accent-800' },
    { label: 'Avg Duration',      value: parseFloat(avgDuration), suffix: ' wks', icon: Clock,  color: '#22d3ee', bg: 'from-cyan-500 to-cyan-700' },
    { label: 'Standards Covered', value: totalStandards,       suffix: '',   icon: Target,      color: '#10b981', bg: 'from-success-600 to-success-800' },
    { label: 'Completion Rate',   value: completionRate,       suffix: '%',  icon: TrendingUp,  color: '#f59e0b', bg: 'from-warning-500 to-warning-700' },
  ]

  /* ── input class ── */
  const inputCls =
    'w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-surface-500 focus:outline-none focus:border-accent-500/40 focus:ring-1 focus:ring-accent-500/20 transition-all'

  return (
    <div className="space-y-6">

      {/* ── Hero Header ── */}
      <FadeUp>
        <div className="hero-mesh rounded-3xl p-6 border border-white/[0.06]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <motion.div
                className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                whileHover={{ rotate: 8, scale: 1.08 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <LayoutGrid className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-black text-white">Unit Planner</h2>
                  <span className="text-[10px] bg-accent-500/20 text-accent-300 px-2 py-0.5 rounded-full font-bold border border-accent-500/20">
                    Standards Aligned
                  </span>
                </div>
                <p className="text-sm text-surface-400">
                  Plan, track, and manage your curriculum units across all subjects
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                className="btn-secondary text-xs"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => showToast('Exporting unit plan to PDF…')}
              >
                <Download className="w-3.5 h-3.5" />
                Export PDF
              </motion.button>
              <motion.button
                className="btn-gradient text-xs"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  const el = document.getElementById('quick-add-form')
                  el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
                  showToast('Scroll to Quick Add Unit →')
                }}
              >
                <Plus className="w-3.5 h-3.5" />
                New Unit
              </motion.button>
            </div>
          </div>

          {/* Quick pill stats */}
          <div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/[0.06] flex-wrap">
            {[
              { label: 'Active', value: units.filter(u => u.status === 'Active').length,   color: '#10b981' },
              { label: 'Planning', value: units.filter(u => u.status === 'Planning').length, color: '#f59e0b' },
              { label: 'Complete', value: units.filter(u => u.status === 'Complete').length, color: '#6366f1' },
              { label: 'Total Standards', value: totalStandards, color: '#22d3ee' },
            ].map(pill => (
              <div key={pill.label} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: pill.color }} />
                <span className="text-xs text-surface-400">{pill.label}</span>
                <span className="text-xs font-black" style={{ color: pill.color }}>{pill.value}</span>
              </div>
            ))}
          </div>
        </div>
      </FadeUp>

      {/* ── Stat Cards ── */}
      <FadeUp delay={0.06}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card, i) => {
            const Icon = card.icon
            return (
              <motion.div
                key={card.label}
                className="glass-card p-5"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.bg} flex items-center justify-center`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-surface-600 mt-0.5" />
                </div>
                <p className="text-xs text-surface-400 mb-1">{card.label}</p>
                <p className="text-2xl font-black text-white">
                  {typeof card.value === 'number' && card.suffix === ' wks'
                    ? `${card.value}${card.suffix}`
                    : `${card.value}${card.suffix}`}
                </p>
              </motion.div>
            )
          })}
        </div>
      </FadeUp>

      {/* ── Main Grid: Units + Sidebar ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6 items-start">

        {/* ── Unit Cards ── */}
        <FadeUp delay={0.12}>
          <StaggerList className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {units.map((unit) => {
              const cfg = STATUS_CONFIG[unit.status]
              const weekRange = `Weeks ${unit.weekStart}–${unit.weekEnd}`
              return (
                <StaggerItem key={unit.id} variants={fadeUp} className="glass-card overflow-hidden flex flex-col">
                  {/* color bar */}
                  <div className="h-1 w-full" style={{ backgroundColor: unit.color }} />

                  <div className="p-5 flex flex-col flex-1">
                    {/* header row */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-white leading-tight mb-1 truncate">
                          {unit.title}
                        </h3>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: unit.color + '20', color: unit.color }}
                          >
                            {unit.subject}
                          </span>
                          <span className="text-[10px] text-surface-500">{unit.grade}</span>
                        </div>
                      </div>
                      <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0 ${cfg.bg} ${cfg.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                        {unit.status}
                      </span>
                    </div>

                    {/* meta row */}
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-1 text-[11px] text-surface-400">
                        <Calendar className="w-3 h-3" />
                        {weekRange}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-surface-400">
                        <Layers className="w-3 h-3" />
                        {unit.standardsCount} standards
                      </div>
                    </div>

                    {/* description */}
                    <p className="text-[12px] text-surface-400 leading-relaxed line-clamp-2 mb-4 flex-1">
                      {unit.description}
                    </p>

                    {/* progress bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] text-surface-500">Progress</span>
                        <span className="text-[10px] font-bold" style={{ color: unit.color }}>
                          {unit.progress}%
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: unit.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${unit.progress}%` }}
                          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                        />
                      </div>
                    </div>

                    {/* action buttons */}
                    <div className="flex items-center gap-2">
                      <motion.button
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] font-semibold border border-white/[0.08] text-surface-300 hover:text-white hover:bg-white/[0.05] transition-all"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setSelectedUnit(unit)}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </motion.button>
                      <motion.button
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] font-semibold border border-white/[0.08] text-surface-300 hover:text-white hover:bg-white/[0.05] transition-all"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => showToast(`Editing "${unit.title}"…`)}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        Edit
                      </motion.button>
                    </div>
                  </div>
                </StaggerItem>
              )
            })}
          </StaggerList>
        </FadeUp>

        {/* ── Quick Add Unit Sidebar ── */}
        <FadeInWhenVisible delay={0.15}>
          <div id="quick-add-form" className="glass-card p-5 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
              >
                <Plus className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-bold text-white">Quick Add Unit</span>
            </div>
            <p className="text-[11px] text-surface-500 leading-relaxed">
              Create a new unit and it will appear in your unit list immediately.
            </p>

            {/* Title */}
            <div>
              <label className="text-[10px] font-semibold text-surface-500 uppercase tracking-wider block mb-1.5">
                Title *
              </label>
              <input
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Ecosystems & Food Webs"
                className={inputCls}
              />
            </div>

            {/* Subject */}
            <div>
              <label className="text-[10px] font-semibold text-surface-500 uppercase tracking-wider block mb-1.5">
                Subject
              </label>
              <select
                value={form.subject}
                onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                className={inputCls + ' cursor-pointer'}
              >
                {SUBJECT_OPTIONS.map(s => (
                  <option key={s} value={s} className="bg-surface-900">
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Grade */}
            <div>
              <label className="text-[10px] font-semibold text-surface-500 uppercase tracking-wider block mb-1.5">
                Grade
              </label>
              <input
                value={form.grade}
                onChange={e => setForm(f => ({ ...f, grade: e.target.value }))}
                placeholder="e.g. 10th Grade"
                className={inputCls}
              />
            </div>

            {/* Duration Weeks */}
            <div>
              <label className="text-[10px] font-semibold text-surface-500 uppercase tracking-wider block mb-1.5">
                Duration (Weeks)
              </label>
              <input
                value={form.durationWeeks}
                onChange={e => setForm(f => ({ ...f, durationWeeks: e.target.value }))}
                placeholder="e.g. 4"
                type="number"
                min="1"
                className={inputCls}
              />
            </div>

            {/* Standards count */}
            <div>
              <label className="text-[10px] font-semibold text-surface-500 uppercase tracking-wider block mb-1.5">
                Standards Count
              </label>
              <input
                value={form.standards}
                onChange={e => setForm(f => ({ ...f, standards: e.target.value }))}
                placeholder="e.g. 3"
                type="number"
                min="0"
                className={inputCls}
              />
            </div>

            {/* Subject color preview */}
            {form.subject && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: SUBJECT_COLORS[form.subject] }} />
                <span className="text-[11px] text-surface-400">
                  Subject color: <span className="font-bold text-white">{form.subject}</span>
                </span>
              </div>
            )}

            <motion.button
              className="btn-gradient w-full text-sm justify-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleCreateUnit}
            >
              <Plus className="w-4 h-4" />
              Create Unit
            </motion.button>
          </div>
        </FadeInWhenVisible>
      </div>

      {/* ── Unit Detail Drawer ── */}
      <AnimatePresence>
        {selectedUnit && (
          <>
            {/* backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedUnit(null)}
            />

            {/* drawer */}
            <motion.aside
              className="fixed inset-y-0 right-0 z-50 w-full max-w-[520px] bg-surface-950 border-l border-white/[0.08] overflow-y-auto shadow-2xl"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            >
              {/* drawer color bar */}
              <div className="h-1 w-full" style={{ backgroundColor: selectedUnit.color }} />

              {/* drawer header */}
              <div className="sticky top-0 z-10 bg-surface-950/90 backdrop-blur-md border-b border-white/[0.07] px-6 py-4 flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: selectedUnit.color + '20' }}
                  >
                    <BookOpen className="w-5 h-5" style={{ color: selectedUnit.color }} />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white leading-tight">{selectedUnit.title}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] font-semibold" style={{ color: selectedUnit.color }}>
                        {selectedUnit.subject}
                      </span>
                      <span className="text-[11px] text-surface-500">·</span>
                      <span className="text-[11px] text-surface-400">{selectedUnit.grade}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedUnit(null)}
                  className="w-8 h-8 rounded-lg bg-white/[0.06] hover:bg-white/[0.10] transition-colors flex items-center justify-center flex-shrink-0 mt-0.5"
                >
                  <X className="w-4 h-4 text-surface-300" />
                </button>
              </div>

              {/* drawer body */}
              <div className="px-6 py-6 space-y-6">

                {/* overview */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-lg bg-white/[0.06] flex items-center justify-center">
                      <BookOpen className="w-3.5 h-3.5 text-surface-400" />
                    </div>
                    <span className="text-xs font-bold text-white uppercase tracking-widest">Overview</span>
                  </div>
                  <p className="text-sm text-surface-300 leading-relaxed">{selectedUnit.description}</p>
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    {[
                      { label: 'Week Range', value: `Weeks ${selectedUnit.weekStart}–${selectedUnit.weekEnd}` },
                      { label: 'Standards', value: `${selectedUnit.standardsCount} covered` },
                      { label: 'Progress', value: `${selectedUnit.progress}%` },
                    ].map(m => (
                      <div key={m.label} className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.07] text-center">
                        <p className="text-[10px] text-surface-500 mb-1">{m.label}</p>
                        <p className="text-sm font-black text-white">{m.value}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* progress bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-surface-400">Completion</span>
                    <span className="text-[11px] font-bold" style={{ color: selectedUnit.color }}>
                      {selectedUnit.progress}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: selectedUnit.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${selectedUnit.progress}%` }}
                      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
                    />
                  </div>
                </div>

                {/* learning objectives */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-lg bg-white/[0.06] flex items-center justify-center">
                      <Target className="w-3.5 h-3.5 text-accent-400" />
                    </div>
                    <span className="text-xs font-bold text-white uppercase tracking-widest">Learning Objectives</span>
                  </div>
                  {selectedUnit.objectives.length > 0 ? (
                    <ul className="space-y-2.5">
                      {selectedUnit.objectives.map((obj, i) => (
                        <li key={i} className="flex gap-2.5 text-sm text-surface-300 leading-relaxed">
                          <CheckCircle
                            className="w-4 h-4 mt-0.5 flex-shrink-0"
                            style={{ color: selectedUnit.color }}
                          />
                          {obj.text}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-surface-500 italic">No objectives added yet.</p>
                  )}
                </section>

                {/* assessments */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-lg bg-white/[0.06] flex items-center justify-center">
                      <ClipboardList className="w-3.5 h-3.5 text-cyan-400" />
                    </div>
                    <span className="text-xs font-bold text-white uppercase tracking-widest">Assessments</span>
                  </div>
                  {selectedUnit.assessments.length > 0 ? (
                    <ul className="space-y-2">
                      {selectedUnit.assessments.map((a, i) => (
                        <li
                          key={i}
                          className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06]"
                        >
                          <span className="text-sm text-surface-200">{a.title}</span>
                          <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                            style={{
                              backgroundColor: selectedUnit.color + '20',
                              color: selectedUnit.color,
                            }}
                          >
                            {a.type}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-surface-500 italic">No assessments added yet.</p>
                  )}
                </section>

                {/* week-by-week timeline */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-lg bg-white/[0.06] flex items-center justify-center">
                      <Calendar className="w-3.5 h-3.5 text-warning-400" />
                    </div>
                    <span className="text-xs font-bold text-white uppercase tracking-widest">Week-by-Week Timeline</span>
                  </div>
                  <div className="space-y-2 relative">
                    <div
                      className="absolute left-4 top-4 bottom-4 w-px"
                      style={{ backgroundColor: selectedUnit.color + '30' }}
                    />
                    {selectedUnit.timeline.map((entry, i) => (
                      <motion.div
                        key={i}
                        className="flex gap-3 pl-1"
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * i, duration: 0.3 }}
                      >
                        <div
                          className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-[10px] font-black flex-shrink-0 z-10 bg-surface-950"
                          style={{ borderColor: selectedUnit.color, color: selectedUnit.color }}
                        >
                          {entry.week}
                        </div>
                        <div className="flex-1 py-1">
                          <p className="text-sm text-surface-200 leading-snug">{entry.topic}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>

                {/* drawer actions */}
                <div className="flex gap-2 pt-2 border-t border-white/[0.07]">
                  <motion.button
                    className="btn-gradient flex-1 justify-center text-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      showToast(`Editing "${selectedUnit.title}"…`)
                      setSelectedUnit(null)
                    }}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit Unit
                  </motion.button>
                  <motion.button
                    className="btn-secondary flex-1 justify-center text-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => showToast(`Exporting "${selectedUnit.title}" to PDF…`)}
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export
                  </motion.button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Toast ── */}
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
              <CheckCircle className="w-3.5 h-3.5 text-accent-400" />
            </div>
            <span className="text-xs font-semibold text-white max-w-[220px]">{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
