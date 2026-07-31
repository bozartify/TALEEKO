'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FlaskConical, Sparkles, RefreshCw, ChevronDown, BookOpen, Target, Clock, Brain,
  CheckCircle, Lightbulb, Leaf, Plus, Download, Share2, Timer, Layers,
  Star, BarChart2,
} from 'lucide-react'
import { FadeUp, FadeInWhenVisible, StaggerList, StaggerItem, fadeUp } from '@/components/ui/motion'

// ── Types ──────────────────────────────────────────────────────────────────────

interface PhaseConfig {
  id: string
  label: string
  emoji: string
  color: string
  bloomLevel: string
  bloomColor: string
  defaultDuration: number
  description: string
  icon: React.ElementType
  tip: string
}

// ── Phase Configuration ────────────────────────────────────────────────────────

const phases: PhaseConfig[] = [
  {
    id: 'engage',
    label: 'Engage',
    emoji: '🎯',
    color: '#f97316',
    bloomLevel: 'Remember',
    bloomColor: '#f59e0b',
    defaultDuration: 10,
    description:
      'Hook students with a real-world phenomenon or provocative question that surfaces prior knowledge and sparks curiosity.',
    icon: Target,
    tip: 'Use a discrepant event, short video clip, or an open question students cannot immediately answer. Keep it brief and punchy.',
  },
  {
    id: 'explore',
    label: 'Explore',
    emoji: '🔬',
    color: '#14b8a6',
    bloomLevel: 'Apply',
    bloomColor: '#2dd4bf',
    defaultDuration: 20,
    description:
      'Students investigate hands-on through labs, simulations, or structured inquiry — discovering patterns before formal explanations.',
    icon: FlaskConical,
    tip: 'Minimize teacher talk. Resist the urge to correct mid-inquiry — let students discover misconceptions through evidence.',
  },
  {
    id: 'explain',
    label: 'Explain',
    emoji: '💡',
    color: '#6366f1',
    bloomLevel: 'Understand',
    bloomColor: '#818cf8',
    defaultDuration: 15,
    description:
      'Formalize vocabulary and concepts. Students share findings; teacher introduces precise scientific language and clarifies misconceptions.',
    icon: Lightbulb,
    tip: 'Start with student-generated language, then introduce formal terms. Anchor chart + guided notes are highly effective here.',
  },
  {
    id: 'elaborate',
    label: 'Elaborate',
    emoji: '🌱',
    color: '#a855f7',
    bloomLevel: 'Analyze',
    bloomColor: '#c084fc',
    defaultDuration: 10,
    description:
      'Extend learning to new contexts and real-world applications. Deepen understanding through transfer tasks and cross-disciplinary connections.',
    icon: Leaf,
    tip: 'Connect to current events, local ecosystems, or student interests. Transfer tasks reveal depth of understanding better than re-practice.',
  },
  {
    id: 'evaluate',
    label: 'Evaluate',
    emoji: '✅',
    color: '#10b981',
    bloomLevel: 'Evaluate',
    bloomColor: '#34d399',
    defaultDuration: 5,
    description:
      'Assess understanding formally and informally. Students self-reflect on progress toward learning goals and identify remaining gaps.',
    icon: CheckCircle,
    tip: 'Informal checks (exit tickets, whiteboards) give better real-time data than formal tests alone. Sort responses into 3 action piles.',
  },
]

// ── Sample Content — Photosynthesis ───────────────────────────────────────────

const sampleContent: Record<string, string> = {
  engage: `Display a wilted plant vs. a thriving plant under a grow lamp on the projector.

Ask: "These plants started identical two weeks ago. What does the second plant have that the first doesn't?"

Think-Pair-Share (60 sec): cold-call 2–3 pairs for responses. Don't validate — let it sit.

Show 90-sec time-lapse: a sunflower tracking sunlight across a full day.

Bridge: "We know plants need sunlight — but WHY? What are they actually doing with it? That's what we investigate today."`,

  explore: `Elodea Oxygen Bubble Investigation:
• Each group: Elodea sprig, 250 mL beaker, adjustable LED lamp, stopwatch, data recording sheet
• Count O₂ bubbles produced per minute at 4 intensities: 100%, 75%, 50%, 25%
• Calculate rate (bubbles/min) → create a line graph from data

Guiding question sheet (observe only — no answers yet):
  1. What happens to bubble rate as light intensity decreases?
  2. At what intensity does production nearly stop? What does this mean?
  3. What gas are the bubbles? How could you verify this?

Early finishers: PhET "Photosynthesis Lab" — independently explore CO₂ and temperature variables`,

  explain: `Mini-lecture with anchor chart (8 min):
Write the equation together: 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂

Break it down:
• Reactants: CO₂ (from air via stomata), H₂O (roots via xylem), light (absorbed by chlorophyll)
• Products: glucose C₆H₁₂O₆ (stored chemical energy), O₂ (released through stomata)

Guided notes: Students complete a partially-blanked diagram as you model.
"Where in the cell does this happen?" → chloroplast → zoom in on thylakoid/grana structure.

CFU: Whiteboard protocol — "Write one reactant. Hold up on 3."`,

  elaborate: `Real-World Extension: Deforestation & the Carbon Cycle
• "Your lab showed photosynthesis slows at low light. What happens to forests being cleared at scale?"
• Small groups: Analyze the Keeling Curve (CO₂ data) + global deforestation rate graph side by side
• Each group presents one connection between their Elodea data and planetary carbon dynamics

Individual extension task:
"Design an experiment to test whether CO₂ concentration or light intensity has a larger effect on photosynthesis rate. Write a hypothesis, procedure, and predicted data table."

ELL sentence frames: "When _____ decreases, the rate of photosynthesis _____ because _____"`,

  evaluate: `3-2-1 Exit Ticket (paper slip):
• 3 things I can now explain about photosynthesis
• 2 variables that affect its rate (cite evidence from today's lab)
• 1 question I still have

Sort slips into 3 piles as students leave:
  ✅ Got it (80%+)    → Ready for cellular respiration comparison next class
  ⚡ Almost (60–79%) → Re-teach during tomorrow's warm-up
  🔴 Needs support (<60%) → Small group pull-out Thursday

Lab report due Friday — distribute rubric now. Digital form version available in Google Classroom.`,
}

// ── Static Data ────────────────────────────────────────────────────────────────

const statsData = [
  { label: 'Lessons Created',   value: '12',      sub: '+3 this month',     icon: BookOpen,     color: '#6366f1' },
  { label: 'Avg Engagement',    value: '94%',     sub: 'Across 8 lessons',  icon: BarChart2,    color: '#10b981' },
  { label: 'Most Used Phase',   value: 'Explore', sub: '38% of time avg',   icon: FlaskConical, color: '#14b8a6' },
  { label: 'Standards Aligned', value: '87%',     sub: 'NGSS coverage',     icon: Layers,       color: '#a855f7' },
]

const ngssStandards = [
  {
    code: 'HS-LS1-5',
    desc: 'Use a model to illustrate how photosynthesis transforms light energy into stored chemical energy',
    primary: true,
  },
  {
    code: 'HS-LS2-5',
    desc: 'Develop a model to illustrate the role of photosynthesis and cellular respiration in the cycling of carbon',
    primary: false,
  },
  {
    code: 'HS-LS1-6',
    desc: 'Construct an explanation based on evidence for how carbon, hydrogen, and oxygen from sugar molecules may combine',
    primary: false,
  },
]

const recentLessons = [
  { title: 'Cell Division & Mitosis',    subject: 'Biology',   grade: '9th',  date: 'Jul 28', duration: 50 },
  { title: 'Forces & Motion Lab',        subject: 'Physics',   grade: '8th',  date: 'Jul 24', duration: 45 },
  { title: 'Genetics: Punnett Squares',  subject: 'Biology',   grade: '10th', date: 'Jul 21', duration: 50 },
  { title: 'Chemical Reactions',         subject: 'Chemistry', grade: '11th', date: 'Jul 18', duration: 55 },
]

const quickActions = [
  { label: 'Print Lesson Plan',  icon: BookOpen,  color: '#6366f1' },
  { label: 'Export to PDF',      icon: Download,  color: '#ef4444' },
  { label: 'Share with Team',    icon: Share2,    color: '#14b8a6' },
  { label: 'Save to Library',    icon: Star,      color: '#f59e0b' },
]

// ── Component ──────────────────────────────────────────────────────────────────

export default function FiveELessonPage() {
  const [expandedPhase, setExpandedPhase] = useState<string | null>('engage')
  const [generatingPhase, setGeneratingPhase] = useState<string | null>(null)
  const [generatingAll, setGeneratingAll] = useState(false)
  const [contents, setContents] = useState<Record<string, string>>(sampleContent)
  const [durations, setDurations] = useState<Record<string, number>>(
    Object.fromEntries(phases.map(p => [p.id, p.defaultDuration]))
  )

  const [subject, setSubject] = useState('AP Biology')
  const [grade, setGrade] = useState('10th Grade')
  const [topic, setTopic] = useState('Photosynthesis & Light Intensity')
  const [lessonDuration, setLessonDuration] = useState('60')
  const [standardsText, setStandardsText] = useState('HS-LS1-5, HS-LS2-5, HS-LS1-6')

  const totalPhaseMins = Object.values(durations).reduce((a, b) => a + b, 0)

  function handleRegeneratePhase(id: string) {
    setGeneratingPhase(id)
    setTimeout(() => setGeneratingPhase(null), 2200)
  }

  function handleGenerateAll() {
    setGeneratingAll(true)
    setTimeout(() => setGeneratingAll(false), 3500)
  }

  return (
    <div className="space-y-6">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <FadeUp>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #14b8a6, #3b82f6)' }}
              whileHover={{ rotate: 8, scale: 1.08 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <FlaskConical className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h2 className="text-xl font-black text-white">5E Lesson Builder</h2>
              <p className="text-xs text-surface-400">
                Engage · Explore · Explain · Elaborate · Evaluate · NGSS aligned
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              className="btn-gradient text-xs"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleGenerateAll}
              disabled={generatingAll}
            >
              {generatingAll ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                  </motion.div>
                  Generating…
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  AI Generate
                </>
              )}
            </motion.button>
            <motion.button
              className="btn-secondary text-xs"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="w-3.5 h-3.5" />
              New Plan
            </motion.button>
          </div>
        </div>
      </FadeUp>

      {/* ── Stat Cards ──────────────────────────────────────────────────────── */}
      <FadeUp delay={0.04}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {statsData.map((s, i) => {
            const Icon = s.icon
            return (
              <motion.div
                key={s.label}
                className="glass-card p-4"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06 + i * 0.04 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: s.color + '18' }}
                  >
                    <Icon className="w-3.5 h-3.5" style={{ color: s.color }} />
                  </div>
                  <span className="text-[10px] text-surface-400 leading-tight">{s.label}</span>
                </div>
                <p className="text-2xl font-black text-white leading-none mb-1">{s.value}</p>
                <p className="text-[10px] text-surface-500">{s.sub}</p>
              </motion.div>
            )
          })}
        </div>
      </FadeUp>

      {/* ── Main Grid ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">

        {/* Left Column */}
        <div className="space-y-5">

          {/* Lesson Metadata Panel */}
          <FadeUp delay={0.08}>
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-teal-400/15">
                  <BookOpen className="w-3.5 h-3.5 text-teal-400" />
                </div>
                <span className="text-sm font-bold text-white">Lesson Details</span>
                <div className="ml-auto flex items-center gap-1.5 px-2 py-1 rounded-full bg-teal-400/15">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                  <span className="text-[10px] font-medium text-teal-400">AI Ready</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                {[
                  { label: 'Subject',         value: subject,        setter: setSubject },
                  { label: 'Grade Level',     value: grade,          setter: setGrade },
                  { label: 'Topic / Concept', value: topic,          setter: setTopic },
                  { label: 'Duration (min)',  value: lessonDuration, setter: setLessonDuration, type: 'number' },
                ].map(field => (
                  <div key={field.label}>
                    <label className="text-[10px] font-semibold text-surface-500 uppercase tracking-wider block mb-1">
                      {field.label}
                    </label>
                    <input
                      type={field.type || 'text'}
                      value={field.value}
                      onChange={e => field.setter(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-surface-500 focus:outline-none focus:border-teal-500/40 focus:ring-1 focus:ring-teal-500/20 transition-all"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="text-[10px] font-semibold text-surface-500 uppercase tracking-wider block mb-1">
                  Standards (NGSS / State)
                </label>
                <textarea
                  value={standardsText}
                  onChange={e => setStandardsText(e.target.value)}
                  rows={2}
                  placeholder="e.g. HS-LS1-5, HS-LS2-5, CCSS.ELA-Literacy…"
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-surface-500 focus:outline-none focus:border-teal-500/40 focus:ring-1 focus:ring-teal-500/20 resize-none transition-all"
                />
              </div>
            </div>
          </FadeUp>

          {/* 5E Phase Accordion */}
          <FadeUp delay={0.12}>
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white">5E Phases</h3>
                <div className="flex items-center gap-1.5 text-[10px] text-surface-500">
                  <Timer className="w-3 h-3" />
                  <span className="tabular-nums">{totalPhaseMins} min allocated</span>
                  {totalPhaseMins > parseInt(lessonDuration) && (
                    <span className="ml-1 px-1.5 py-0.5 rounded-full bg-warning-400/15 text-warning-400 font-medium">
                      Over by {totalPhaseMins - parseInt(lessonDuration)}m
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2.5">
                {phases.map((phase, i) => {
                  const isExpanded = expandedPhase === phase.id
                  const isGenerating = generatingPhase === phase.id || generatingAll

                  return (
                    <motion.div
                      key={phase.id}
                      className="glass-card overflow-hidden relative"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.14 + i * 0.05 }}
                    >
                      {/* Left accent stripe */}
                      <div
                        className="absolute left-0 top-0 bottom-0 w-[3px]"
                        style={{ backgroundColor: phase.color }}
                      />

                      {/* Accordion trigger */}
                      <button
                        className="w-full pl-6 pr-5 py-4 flex items-center gap-3 text-left"
                        onClick={() => setExpandedPhase(isExpanded ? null : phase.id)}
                      >
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: phase.color + '18' }}
                        >
                          <span className="text-base leading-none">{phase.emoji}</span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-white">{phase.label}</span>
                            <span
                              className="text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide"
                              style={{ backgroundColor: phase.bloomColor + '22', color: phase.bloomColor }}
                            >
                              Bloom's: {phase.bloomLevel}
                            </span>
                          </div>
                          {!isExpanded && (
                            <p className="text-xs text-surface-500 truncate mt-0.5 max-w-md">
                              {phase.description}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/[0.04]">
                            <Clock className="w-3 h-3 text-surface-500" />
                            <span className="text-[11px] font-medium text-surface-400 tabular-nums">
                              {durations[phase.id]}m
                            </span>
                          </div>
                          <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown className="w-4 h-4 text-surface-500" />
                          </motion.div>
                        </div>
                      </button>

                      {/* Accordion body */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.22 }}
                            className="overflow-hidden"
                          >
                            <div className="pl-6 pr-5 pb-5 border-t border-white/[0.05]">
                              <p className="text-xs text-surface-400 leading-relaxed mt-3 mb-3">
                                {phase.description}
                              </p>

                              {/* Textarea with generating overlay */}
                              <div className="relative">
                                {isGenerating && (
                                  <motion.div
                                    className="absolute inset-0 bg-surface-900/70 backdrop-blur-sm rounded-xl z-10 flex items-center justify-center"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                  >
                                    <div className="flex items-center gap-2">
                                      <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                                      >
                                        <Sparkles className="w-4 h-4" style={{ color: phase.color }} />
                                      </motion.div>
                                      <span className="text-sm font-medium text-white">AI generating…</span>
                                    </div>
                                  </motion.div>
                                )}
                                <textarea
                                  value={contents[phase.id]}
                                  onChange={e =>
                                    setContents(prev => ({ ...prev, [phase.id]: e.target.value }))
                                  }
                                  rows={7}
                                  className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.07] text-sm text-surface-200 placeholder:text-surface-600 focus:outline-none focus:border-white/[0.15] focus:ring-1 focus:ring-white/[0.06] resize-none transition-all leading-relaxed font-mono"
                                />
                              </div>

                              <div className="flex items-center justify-between mt-3">
                                <div className="flex items-center gap-2">
                                  <label className="text-[10px] text-surface-500">Duration:</label>
                                  <input
                                    type="number"
                                    value={durations[phase.id]}
                                    onChange={e =>
                                      setDurations(prev => ({
                                        ...prev,
                                        [phase.id]: parseInt(e.target.value) || 0,
                                      }))
                                    }
                                    className="w-14 px-2 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-white text-center focus:outline-none focus:border-white/[0.2] tabular-nums"
                                  />
                                  <span className="text-[10px] text-surface-500">min</span>
                                </div>

                                <motion.button
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors"
                                  style={{ color: phase.color }}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => handleRegeneratePhase(phase.id)}
                                >
                                  <RefreshCw className="w-3 h-3" />
                                  AI Regenerate
                                </motion.button>
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
          </FadeUp>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4">

          {/* NGSS Standards */}
          <FadeInWhenVisible delay={0.1}>
            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-teal-400/15">
                    <Layers className="w-3.5 h-3.5 text-teal-400" />
                  </div>
                  <span className="text-sm font-bold text-white">NGSS Alignment</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-400/15 text-teal-400 font-bold">
                  {ngssStandards.length} standards
                </span>
              </div>

              <div className="space-y-2.5">
                {ngssStandards.map((std, i) => (
                  <motion.div
                    key={std.code}
                    className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:border-white/[0.08] transition-all"
                    initial={{ opacity: 0, x: 6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.06 }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-bold text-teal-400">{std.code}</span>
                      {std.primary ? (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-accent-500/20 text-accent-300 font-bold">
                          PRIMARY
                        </span>
                      ) : (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.06] text-surface-500 font-medium">
                          SECONDARY
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-surface-400 leading-relaxed">{std.desc}</p>
                  </motion.div>
                ))}
                <button className="w-full text-[11px] text-teal-400 hover:text-teal-300 py-1.5 transition-colors flex items-center justify-center gap-1.5">
                  <Plus className="w-3 h-3" />
                  Add standard
                </button>
              </div>
            </div>
          </FadeInWhenVisible>

          {/* Time Distribution */}
          <FadeInWhenVisible delay={0.15}>
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-blue-500/15">
                  <Timer className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <span className="text-sm font-bold text-white">Time Distribution</span>
                <span className="text-[10px] text-surface-500 ml-auto tabular-nums">{totalPhaseMins} min</span>
              </div>

              {/* Stacked bar */}
              <div className="flex gap-0.5 h-2.5 rounded-full overflow-hidden mb-4">
                {phases.map(phase => (
                  <motion.div
                    key={phase.id}
                    className="h-full first:rounded-l-full last:rounded-r-full"
                    style={{
                      backgroundColor: phase.color,
                      width: `${(durations[phase.id] / Math.max(totalPhaseMins, 1)) * 100}%`,
                    }}
                    initial={{ scaleX: 0, transformOrigin: 'left' }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    title={`${phase.label}: ${durations[phase.id]} min`}
                  />
                ))}
              </div>

              {/* Per-phase rows */}
              <div className="space-y-2.5">
                {phases.map((phase, idx) => {
                  const pct = Math.round(
                    (durations[phase.id] / Math.max(totalPhaseMins, 1)) * 100
                  )
                  return (
                    <div key={phase.id}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] text-surface-400">
                          {phase.emoji} {phase.label}
                        </span>
                        <span
                          className="text-[11px] font-bold tabular-nums"
                          style={{ color: phase.color }}
                        >
                          {durations[phase.id]}m
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: phase.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ delay: 0.4 + idx * 0.04, duration: 0.35 }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </FadeInWhenVisible>

          {/* Per-Phase Tips */}
          <FadeInWhenVisible delay={0.2}>
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-yellow-400/15">
                  <Brain className="w-3.5 h-3.5 text-yellow-400" />
                </div>
                <span className="text-sm font-bold text-white">Phase Tips</span>
              </div>

              <div className="space-y-2">
                {phases.map((phase, i) => (
                  <motion.div
                    key={phase.id}
                    className="flex gap-2.5 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.04] hover:border-white/[0.08] transition-all"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                  >
                    <span className="text-sm flex-shrink-0 mt-0.5 leading-none">{phase.emoji}</span>
                    <div>
                      <p
                        className="text-[10px] font-bold mb-0.5"
                        style={{ color: phase.color }}
                      >
                        {phase.label}
                      </p>
                      <p className="text-[11px] text-surface-400 leading-relaxed">{phase.tip}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </FadeInWhenVisible>

          {/* Quick Actions */}
          <FadeInWhenVisible delay={0.25}>
            <div className="glass-card p-5">
              <p className="text-xs font-bold text-surface-300 mb-3">Quick Actions</p>
              <div className="space-y-1.5">
                {quickActions.map(action => (
                  <motion.button
                    key={action.label}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-surface-300 hover:text-white hover:bg-white/[0.04] transition-all"
                    whileHover={{ x: 2 }}
                  >
                    <div
                      className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: action.color + '15' }}
                    >
                      <action.icon className="w-3 h-3" style={{ color: action.color }} />
                    </div>
                    {action.label}
                    <ChevronDown className="w-3 h-3 ml-auto text-surface-600 -rotate-90" />
                  </motion.button>
                ))}
              </div>
            </div>
          </FadeInWhenVisible>
        </div>
      </div>

      {/* ── Recent 5E Lessons ────────────────────────────────────────────────── */}
      <FadeInWhenVisible delay={0.3}>
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white">Recent 5E Lessons</h3>
            <button className="text-xs text-teal-400 hover:text-teal-300 transition-colors">
              View All
            </button>
          </div>

          <StaggerList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {recentLessons.map(lesson => (
              <StaggerItem
                key={lesson.title}
                variants={fadeUp}
                className="glass-card p-4 cursor-pointer"
                whileHover={{ y: -2 }}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #14b8a6, #3b82f6)' }}
                  >
                    <FlaskConical className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-[10px] text-surface-500">{lesson.date}</span>
                </div>

                <h4 className="text-sm font-bold text-white leading-tight mb-1">
                  {lesson.title}
                </h4>

                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.06] text-surface-400">
                    {lesson.subject}
                  </span>
                  <span className="text-[10px] text-surface-500">{lesson.grade}</span>
                  <span className="text-[10px] text-surface-600 ml-auto tabular-nums">
                    {lesson.duration}m
                  </span>
                </div>

                {/* Mini 5-phase color bar */}
                <div className="flex gap-0.5 mt-3 h-1 rounded-full overflow-hidden">
                  {phases.map(p => (
                    <div
                      key={p.id}
                      className="flex-1 h-full"
                      style={{ backgroundColor: p.color }}
                    />
                  ))}
                </div>
                <p className="text-[9px] text-surface-600 mt-1">All 5 phases · NGSS aligned</p>
              </StaggerItem>
            ))}
          </StaggerList>
        </div>
      </FadeInWhenVisible>
    </div>
  )
}
