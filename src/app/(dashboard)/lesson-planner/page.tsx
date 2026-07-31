'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen, Sparkles, Clock, Target, Layers, Users, Clipboard,
  CheckCircle, Download, Share2, ChevronDown, ChevronRight, Brain,
  RotateCcw, Save, Plus, Zap, FileText, Star, ArrowRight,
  AlignLeft, Lightbulb, PenTool, Eye, Microscope, GraduationCap
} from 'lucide-react'
import { FadeUp, FadeInWhenVisible } from '@/components/ui/motion'

interface Section {
  id: string
  title: string
  duration: number
  icon: React.ElementType
  color: string
  content: string
  placeholder: string
  badge?: string
}

const initialSections: Section[] = [
  {
    id: 'objectives',
    title: 'Learning Objectives',
    duration: 0,
    icon: Target,
    color: '#6366f1',
    badge: 'NGSS',
    placeholder: 'Students will be able to...',
    content: `• Explain the process of photosynthesis and identify the inputs and outputs
• Compare how light intensity affects the rate of photosynthesis using data
• Construct a diagram showing the relationship between photosynthesis and cellular respiration
• Argue from evidence about the importance of photosynthesis to ecosystems`,
  },
  {
    id: 'materials',
    title: 'Materials & Resources',
    duration: 0,
    icon: Clipboard,
    color: '#14b8a6',
    placeholder: 'List materials, technology, handouts...',
    content: `• Elodea aquatic plants (1 per group)
• LED grow lights with adjustable intensity
• Graduated cylinders, stopwatches, data recording sheets
• Chromebooks — PhET Photosynthesis Simulation
• Anchor chart: Photosynthesis equation (pre-made)
• Exit ticket slips (printed)`,
  },
  {
    id: 'hook',
    title: 'Hook / Anticipatory Set',
    duration: 5,
    icon: Zap,
    color: '#f59e0b',
    placeholder: 'Engage students with a question, video, or activity...',
    content: `Display image of a forest vs. a concrete city on the projector.

Ask: "Which environment has more CO₂? Which has more O₂? How do plants change the air around them?"

Allow 60-second think-pair-share. Cold call 2–3 students for responses.

Bridge: "Today we're going to investigate exactly HOW plants do this — and just how powerful they are."`,
  },
  {
    id: 'direct',
    title: 'Direct Instruction',
    duration: 15,
    icon: AlignLeft,
    color: '#8b5cf6',
    placeholder: 'Explain concepts, model procedures...',
    content: `Mini-lecture (8 min) with anchor chart:
• Write the chemical equation: 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂
• Point out: inputs (reactants) vs. outputs (products)
• Explain chlorophyll's role using visible light spectrum diagram

Guided Note-Taking:
Students fill in a partially completed diagram as you model

Check for Understanding: "Show me on your whiteboard — which is the reactant and which is the product?"

Connect to prior knowledge: cellular respiration (reverse process)`,
  },
  {
    id: 'guided',
    title: 'Guided Practice',
    duration: 10,
    icon: Eye,
    color: '#10b981',
    placeholder: 'Students practice with your support...',
    content: `Lab Setup — Elodea Oxygen Bubble Count:
• Each group receives elodea in beaker + LED lamp
• Demonstrate: count oxygen bubbles over 1 minute at 100% light intensity

Together we complete Row 1 of the data table (100% intensity)
Model how to calculate rate (bubbles/min)

Teacher circulates — check that all groups are counting correctly and recording units

Class share-out: "What do you predict happens at 50% intensity?"`,
  },
  {
    id: 'independent',
    title: 'Independent Practice',
    duration: 15,
    icon: Microscope,
    color: '#ec4899',
    placeholder: 'Students work independently or in small groups...',
    content: `Groups test remaining light intensities: 75%, 50%, 25%, 0%
Record data in table, calculate average, create line graph

Early finishers: PhET simulation — explore temperature + CO₂ variables

Differentiation:
• Scaffold: Sentence frames for data interpretation ("As light intensity decreases, the rate of photosynthesis...")
• Extension: Investigate the compensation point — when does the plant break even?

Monitor at-risk students: Noah, Mia — provide vocabulary card`,
  },
  {
    id: 'closure',
    title: 'Closure',
    duration: 5,
    icon: Lightbulb,
    color: '#22d3ee',
    placeholder: 'Summarize learning, connect to next lesson...',
    content: `Bring class back together. Display a student group's graph on the document camera.

Discuss: "What pattern do we see? Why does photosynthesis slow down at low light?"

Preview: "Next class, we'll explore how CO₂ levels and temperature also affect the rate — and we'll see why this matters for climate change."

Bridge to real world: "Your lab data today mirrors what scientists use to understand deforestation impacts."`,
  },
  {
    id: 'assessment',
    title: 'Assessment / Check for Understanding',
    duration: 5,
    icon: CheckCircle,
    color: '#f97316',
    placeholder: 'Formative assessment, exit ticket, observation...',
    content: `Exit Ticket (3-2-1 format):
• 3 things I learned about photosynthesis today
• 2 questions I still have
• 1 connection to something in the real world

Collect slips as students leave — sort into 3 piles:
✅ Got it (80%+) → Ready for next concept
⚡ Almost (60–79%) → Quick review tomorrow
🔴 Needs support (<60%) → Small group tomorrow

Digital alternative: Google Form auto-graded version available`,
  },
]

const recentPlans = [
  { title: 'Cell Division & Mitosis', subject: 'Biology', grade: '10th', date: 'Jul 28', duration: 50 },
  { title: 'The American Revolution', subject: 'History', grade: '8th', date: 'Jul 24', duration: 45 },
  { title: 'Solving Quadratic Equations', subject: 'Math', grade: '9th', date: 'Jul 21', duration: 50 },
  { title: 'Parts of Speech Review', subject: 'English', grade: '7th', date: 'Jul 18', duration: 45 },
]

const standards = [
  { code: 'HS-LS1-5', desc: 'Use a model to illustrate how photosynthesis transforms light energy', status: 'primary' },
  { code: 'HS-LS2-5', desc: 'Develop a model to illustrate the role of photosynthesis in the cycling of matter', status: 'secondary' },
  { code: 'HS-LS1-6', desc: 'Construct and revise an explanation based on evidence for how carbon, hydrogen, and oxygen from sugar molecules may combine', status: 'secondary' },
]

export default function LessonPlannerPage() {
  const [sections, setSections] = useState(initialSections)
  const [expandedSection, setExpandedSection] = useState<string | null>('hook')
  const [generatingSection, setGeneratingSection] = useState<string | null>(null)
  const [generatingAll, setGeneratingAll] = useState(false)
  const [savedPulse, setSavedPulse] = useState(false)
  const [topic, setTopic] = useState('Photosynthesis & Light Intensity')
  const [grade, setGrade] = useState('10th Grade')
  const [subject, setSubject] = useState('AP Biology')
  const [duration, setDuration] = useState('50')

  const totalTime = sections.reduce((acc, s) => acc + s.duration, 0)

  function handleRegenerateSection(id: string) {
    setGeneratingSection(id)
    setTimeout(() => setGeneratingSection(null), 2000)
  }

  function handleGenerateAll() {
    setGeneratingAll(true)
    setTimeout(() => setGeneratingAll(false), 3500)
  }

  function handleSave() {
    setSavedPulse(true)
    setTimeout(() => setSavedPulse(false), 2000)
  }

  return (
    <div className="space-y-6">
      <FadeUp>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
              whileHover={{ rotate: 8, scale: 1.08 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <BookOpen className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h2 className="text-xl font-black text-white">Lesson Planner</h2>
              <p className="text-xs text-surface-400">AI-assisted lesson design · Standards aligned · Export ready</p>
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
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                    <Sparkles className="w-3.5 h-3.5" />
                  </motion.div>
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Generate Full Plan
                </>
              )}
            </motion.button>
            <motion.button
              className="btn-secondary text-xs"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
            >
              {savedPulse ? <CheckCircle className="w-3.5 h-3.5 text-success-400" /> : <Save className="w-3.5 h-3.5" />}
              {savedPulse ? 'Saved!' : 'Save'}
            </motion.button>
            <button className="btn-secondary text-xs">
              <Download className="w-3.5 h-3.5" />
              Export
            </button>
            <button className="btn-secondary text-xs">
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </FadeUp>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-5">
          {/* Lesson Config */}
          <FadeUp delay={0.05}>
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#6366f118' }}>
                  <GraduationCap className="w-3.5 h-3.5 text-accent-400" />
                </div>
                <span className="text-sm font-bold text-white">Lesson Details</span>
                <div className="ml-auto flex items-center gap-1.5 px-2 py-1 rounded-full bg-success-500/15">
                  <div className="w-1.5 h-1.5 rounded-full bg-success-400 animate-pulse" />
                  <span className="text-[10px] font-medium text-success-400">AI Ready</span>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="text-[10px] font-semibold text-surface-500 uppercase tracking-wider block mb-1">Topic</label>
                  <input
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-surface-500 focus:outline-none focus:border-accent-500/40 focus:ring-1 focus:ring-accent-500/20 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-surface-500 uppercase tracking-wider block mb-1">Subject</label>
                  <input
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-surface-500 focus:outline-none focus:border-accent-500/40 focus:ring-1 focus:ring-accent-500/20 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-surface-500 uppercase tracking-wider block mb-1">Grade Level</label>
                  <input
                    value={grade}
                    onChange={e => setGrade(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-surface-500 focus:outline-none focus:border-accent-500/40 focus:ring-1 focus:ring-accent-500/20 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-surface-500 uppercase tracking-wider block mb-1">Duration (min)</label>
                  <input
                    value={duration}
                    onChange={e => setDuration(e.target.value)}
                    type="number"
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-surface-500 focus:outline-none focus:border-accent-500/40 focus:ring-1 focus:ring-accent-500/20 transition-all"
                  />
                </div>
              </div>
            </div>
          </FadeUp>

          {/* Timing Bar */}
          <FadeUp delay={0.08}>
            <div className="glass-card p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-surface-400" />
                  <span className="text-xs font-semibold text-surface-300">Time Allocation</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-white">{totalTime} min</span>
                  <span className="text-xs text-surface-500">of {duration} min</span>
                  {totalTime > parseInt(duration) && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-warning-400/15 text-warning-400 font-medium">Over by {totalTime - parseInt(duration)} min</span>
                  )}
                  {totalTime <= parseInt(duration) && totalTime > 0 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-success-400/15 text-success-400 font-medium">{parseInt(duration) - totalTime} min buffer</span>
                  )}
                </div>
              </div>
              <div className="flex gap-0.5 h-3 rounded-full overflow-hidden">
                {sections.filter(s => s.duration > 0).map(s => (
                  <motion.div
                    key={s.id}
                    className="h-full rounded-sm first:rounded-l-full last:rounded-r-full"
                    style={{
                      backgroundColor: s.color,
                      width: `${(s.duration / Math.max(totalTime, parseInt(duration))) * 100}%`,
                    }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                    title={`${s.title}: ${s.duration} min`}
                  />
                ))}
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
                {sections.filter(s => s.duration > 0).map(s => (
                  <div key={s.id} className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="text-[10px] text-surface-500">{s.title.split(' ')[0]} ({s.duration}m)</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>

          {/* Sections */}
          <FadeUp delay={0.1}>
            <div className="space-y-3">
              {sections.map((section, i) => {
                const Icon = section.icon
                const isExpanded = expandedSection === section.id
                const isGenerating = generatingSection === section.id || generatingAll

                return (
                  <motion.div
                    key={section.id}
                    className="glass-card overflow-hidden"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12 + i * 0.04 }}
                  >
                    <button
                      className="w-full px-5 py-4 flex items-center gap-3 text-left"
                      onClick={() => setExpandedSection(isExpanded ? null : section.id)}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: section.color + '18' }}
                      >
                        <Icon className="w-4 h-4" style={{ color: section.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{section.title}</span>
                          {section.badge && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-accent-500/20 text-accent-300 font-bold">{section.badge}</span>
                          )}
                        </div>
                        {!isExpanded && (
                          <p className="text-xs text-surface-500 truncate mt-0.5">
                            {section.content.split('\n')[0].replace(/^[•\-]\s*/, '')}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {section.duration > 0 && (
                          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/[0.04]">
                            <Clock className="w-3 h-3 text-surface-500" />
                            <span className="text-[11px] font-medium text-surface-400">{section.duration}m</span>
                          </div>
                        )}
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
                          transition={{ duration: 0.22 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 border-t border-white/[0.05]">
                            <div className="pt-4 relative">
                              {isGenerating && (
                                <motion.div
                                  className="absolute inset-0 bg-surface-900/60 backdrop-blur-sm rounded-xl z-10 flex items-center justify-center"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                >
                                  <div className="flex items-center gap-2">
                                    <motion.div
                                      animate={{ rotate: 360 }}
                                      transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                                    >
                                      <Sparkles className="w-4 h-4 text-accent-400" />
                                    </motion.div>
                                    <span className="text-sm font-medium text-white">AI generating...</span>
                                  </div>
                                </motion.div>
                              )}
                              <textarea
                                value={section.content}
                                onChange={e => {
                                  const updated = sections.map(s =>
                                    s.id === section.id ? { ...s, content: e.target.value } : s
                                  )
                                  setSections(updated)
                                }}
                                placeholder={section.placeholder}
                                rows={6}
                                className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.07] text-sm text-surface-200 placeholder:text-surface-600 focus:outline-none focus:border-accent-500/30 focus:ring-1 focus:ring-accent-500/15 resize-none transition-all leading-relaxed font-mono"
                              />
                            </div>
                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center gap-2">
                                {section.duration > 0 && (
                                  <div className="flex items-center gap-1.5">
                                    <label className="text-[10px] text-surface-500">Duration:</label>
                                    <input
                                      type="number"
                                      value={section.duration}
                                      onChange={e => {
                                        const updated = sections.map(s =>
                                          s.id === section.id ? { ...s, duration: parseInt(e.target.value) || 0 } : s
                                        )
                                        setSections(updated)
                                      }}
                                      className="w-14 px-2 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-white text-center focus:outline-none focus:border-accent-500/40"
                                    />
                                    <span className="text-[10px] text-surface-500">min</span>
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <motion.button
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium text-accent-400 hover:text-accent-300 hover:bg-accent-500/10 transition-all"
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => handleRegenerateSection(section.id)}
                                >
                                  <RotateCcw className="w-3 h-3" />
                                  Regenerate with AI
                                </motion.button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </div>
          </FadeUp>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4">
          {/* AI Suggestions */}
          <FadeInWhenVisible delay={0.1}>
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#8b5cf618' }}>
                  <Brain className="w-3.5 h-3.5 text-neon-400" />
                </div>
                <span className="text-sm font-bold text-white">AI Suggestions</span>
              </div>
              <div className="space-y-3">
                {[
                  { text: 'Add a visual anchor chart for the photosynthesis equation', type: 'visual', color: '#6366f1' },
                  { text: 'Include a think-pair-share before guided practice', type: 'engagement', color: '#10b981' },
                  { text: 'ELL students may need vocabulary pre-teaching for "reactant"', type: 'differentiation', color: '#f59e0b' },
                ].map((s, i) => (
                  <motion.div
                    key={i}
                    className="flex gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] group hover:border-white/[0.09] transition-all cursor-pointer"
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.06 }}
                    whileHover={{ x: 2 }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: s.color }} />
                    <div className="flex-1">
                      <p className="text-xs text-surface-300 leading-relaxed">{s.text}</p>
                      <span className="text-[10px] text-surface-600 capitalize">{s.type}</span>
                    </div>
                    <ArrowRight className="w-3 h-3 text-surface-600 group-hover:text-surface-400 transition-colors mt-0.5 flex-shrink-0" />
                  </motion.div>
                ))}
                <button className="w-full text-[11px] text-accent-400 hover:text-accent-300 py-1.5 transition-colors flex items-center justify-center gap-1.5">
                  <Plus className="w-3 h-3" />
                  More suggestions
                </button>
              </div>
            </div>
          </FadeInWhenVisible>

          {/* Standards Alignment */}
          <FadeInWhenVisible delay={0.15}>
            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#14b8a618' }}>
                    <Layers className="w-3.5 h-3.5 text-teal-400" />
                  </div>
                  <span className="text-sm font-bold text-white">Standards</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-400/15 text-teal-400 font-medium">NGSS</span>
              </div>
              <div className="space-y-2.5">
                {standards.map((std, i) => (
                  <motion.div
                    key={std.code}
                    className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.25 + i * 0.05 }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-bold text-teal-400">{std.code}</span>
                      {std.status === 'primary' ? (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-accent-500/20 text-accent-300 font-medium">PRIMARY</span>
                      ) : (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.06] text-surface-500 font-medium">SECONDARY</span>
                      )}
                    </div>
                    <p className="text-[11px] text-surface-400 leading-relaxed">{std.desc}</p>
                  </motion.div>
                ))}
                <button className="w-full text-[11px] text-accent-400 hover:text-accent-300 py-1.5 transition-colors flex items-center justify-center gap-1.5">
                  <Plus className="w-3 h-3" />
                  Add standard
                </button>
              </div>
            </div>
          </FadeInWhenVisible>

          {/* Differentiation */}
          <FadeInWhenVisible delay={0.2}>
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#ec489918' }}>
                  <Users className="w-3.5 h-3.5 text-pink-400" />
                </div>
                <span className="text-sm font-bold text-white">Differentiation</span>
              </div>
              <div className="space-y-2.5">
                {[
                  { label: 'Scaffolds', count: 3, color: '#f59e0b', items: ['Sentence frames', 'Vocabulary cards', 'Partially completed diagram'] },
                  { label: 'Extensions', count: 2, color: '#6366f1', items: ['Compensation point investigation', 'Climate change connection'] },
                  { label: 'IEP/504', count: 1, color: '#ec4899', items: ['Extended time on exit ticket'] },
                ].map((diff, i) => (
                  <div key={diff.label} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-white">{diff.label}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: diff.color + '20', color: diff.color }}>{diff.count}</span>
                    </div>
                    {diff.items.map(item => (
                      <div key={item} className="flex items-center gap-1.5 mt-1">
                        <div className="w-1 h-1 rounded-full" style={{ backgroundColor: diff.color }} />
                        <span className="text-[11px] text-surface-400">{item}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </FadeInWhenVisible>

          {/* Quick Actions */}
          <FadeInWhenVisible delay={0.25}>
            <div className="glass-card p-5">
              <p className="text-xs font-bold text-surface-300 mb-3">Quick Actions</p>
              <div className="space-y-2">
                {[
                  { label: 'Export to PDF', icon: FileText, color: '#ef4444' },
                  { label: 'Share with Team', icon: Share2, color: '#6366f1' },
                  { label: 'Duplicate Plan', icon: Clipboard, color: '#14b8a6' },
                  { label: 'Add to Library', icon: Star, color: '#f59e0b' },
                ].map(action => (
                  <motion.button
                    key={action.label}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-surface-300 hover:text-white hover:bg-white/[0.04] transition-all"
                    whileHover={{ x: 2 }}
                  >
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ backgroundColor: action.color + '15' }}>
                      <action.icon className="w-3 h-3" style={{ color: action.color }} />
                    </div>
                    {action.label}
                    <ChevronRight className="w-3 h-3 ml-auto text-surface-600" />
                  </motion.button>
                ))}
              </div>
            </div>
          </FadeInWhenVisible>
        </div>
      </div>

      {/* Recent Plans */}
      <FadeInWhenVisible delay={0.3}>
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white">Recent Lesson Plans</h3>
            <button className="text-xs text-accent-400 hover:text-accent-300 transition-colors">View All</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {recentPlans.map((plan, i) => (
              <motion.button
                key={plan.title}
                className="glass-card p-4 text-left"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.05 }}
                whileHover={{ y: -2 }}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-accent-500/15 flex-shrink-0">
                    <BookOpen className="w-4 h-4 text-accent-400" />
                  </div>
                  <span className="text-[10px] text-surface-500">{plan.date}</span>
                </div>
                <h4 className="text-sm font-bold text-white leading-tight mb-1">{plan.title}</h4>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.06] text-surface-400">{plan.subject}</span>
                  <span className="text-[10px] text-surface-500">{plan.grade}</span>
                  <span className="text-[10px] text-surface-600 ml-auto">{plan.duration}m</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </FadeInWhenVisible>
    </div>
  )
}
