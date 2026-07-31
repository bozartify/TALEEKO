'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FadeUp, StaggerList, StaggerItem } from '@/components/ui/motion'
import {
  Layers, Sparkles, RefreshCw, Copy, Check, ChevronDown, ChevronRight,
  BookOpen, Target, Brain, Lightbulb, Users, AlertCircle, ArrowRight,
  Download, Star, CheckCircle, Clock, Zap, FileText, Search
} from 'lucide-react'

interface UnpackedStandard {
  code: string
  fullText: string
  grade: string
  subject: string
  studentFriendly: string
  prerequisites: string[]
  keyVocabulary: string[]
  suggestedActivities: string[]
  assessmentIdeas: string[]
  commonMisconceptions: string[]
  differentiations: { level: string; strategy: string }[]
  estimatedDays: number
  bloomsLevels: string[]
}

const SAMPLE_STANDARD = `NGSS MS-LS1-6: Construct a scientific explanation based on evidence for the role of photosynthesis in the cycling of matter and flow of energy into and out of organisms.`

const UNPACKED: UnpackedStandard = {
  code: 'MS-LS1-6',
  fullText: 'Construct a scientific explanation based on evidence for the role of photosynthesis in the cycling of matter and flow of energy into and out of organisms.',
  grade: 'Middle School (6–8)',
  subject: 'Life Science / Biology',
  studentFriendly: 'I can explain HOW plants make food using sunlight, and WHY this is important for energy to move through living things. I can back up my explanation with real scientific evidence.',
  prerequisites: [
    'Understanding of cells and cell structures (PS1-1)',
    'Basic knowledge of atoms and molecules',
    'Concept of energy transformation (PS3-1)',
    'Familiarity with matter and chemical reactions',
  ],
  keyVocabulary: [
    'Photosynthesis', 'Chloroplast', 'Chlorophyll', 'Glucose', 'Carbon dioxide',
    'Cellular respiration', 'Energy transformation', 'Matter cycling', 'Autotroph', 'Producer',
  ],
  suggestedActivities: [
    'Floating Disk Lab: use spinach leaf disks to measure photosynthesis rates under different light conditions',
    'Energy Flow Diagram: trace energy from sun → producer → consumer and model where energy goes',
    'Photosynthesis + Respiration Equation Matching Card Sort',
    'Compare/contrast photosynthesis and cellular respiration using a Venn diagram',
    'Elodea Aquatic Plant Lab: count oxygen bubbles under different light intensities',
  ],
  assessmentIdeas: [
    'Constructed Response: Given a diagram of a food web, explain where all the energy originally comes from',
    'CER (Claim-Evidence-Reasoning) paragraph about the spinach lab results',
    'Analogy: compare photosynthesis to making food in a kitchen — what are the "ingredients" and "appliances"?',
    'Exit Ticket: traffic light — how confident are you that you can explain the carbon cycle?',
  ],
  commonMisconceptions: [
    'Plants get food FROM the soil (they MAKE food using CO₂ + water + light)',
    'Photosynthesis and respiration are opposites and cancel each other out',
    'Only green parts of a plant photosynthesize',
    'Plants only photosynthesize during the day (they do cellular respiration all the time)',
  ],
  differentiations: [
    { level: 'Support (IEP/ELL)', strategy: 'Graphic organizer with fill-in-the-blank equation; picture vocabulary cards for key terms; simplified lab with visual data tables' },
    { level: 'On-Grade',          strategy: 'Spinach disk lab with guided data analysis; CER framework for written explanation; concept mapping activity' },
    { level: 'Extension',         strategy: 'Investigate how CO₂ concentration and temperature affect photosynthesis rate; connect to climate change and carbon sequestration research' },
  ],
  estimatedDays: 5,
  bloomsLevels: ['Remember', 'Understand', 'Apply', 'Analyze'],
}

const recentUnpacked = [
  { code: 'CCSS.ELA-W.7.1', subject: 'ELA', desc: 'Write arguments to support claims', date: '2h ago', color: '#8b5cf6' },
  { code: 'CCSS.MATH.6.NS.A.1', subject: 'Math', desc: 'Interpret and compute quotients of fractions', date: 'Yesterday', color: '#22d3ee' },
  { code: 'NGSS HS-LS3-1', subject: 'Biology', desc: 'Ask questions about heredity and genetic variation', date: '3 days ago', color: '#10b981' },
  { code: 'C3.D2.His.1.6-8', subject: 'Social Studies', desc: 'Analyze connections among events and developments', date: '1 week ago', color: '#f97316' },
]

const frameworks = [
  { id: 'ngss',  label: 'NGSS',       flag: '🔬', color: '#14b8a6' },
  { id: 'ccss',  label: 'Common Core', flag: '📐', color: '#6366f1' },
  { id: 'ap',    label: 'AP',          flag: '🎓', color: '#f43f5e' },
  { id: 'c3',    label: 'C3 (SS)',     flag: '🌎', color: '#f59e0b' },
  { id: 'state', label: 'State',       flag: '📋', color: '#8b5cf6' },
]

export default function StandardsUnpackerPage() {
  const [input, setInput] = useState(SAMPLE_STANDARD)
  const [framework, setFramework] = useState('ngss')
  const [generating, setGenerating] = useState(false)
  const [unpacked, setUnpacked] = useState<UnpackedStandard | null>(UNPACKED)
  const [expandedSection, setExpandedSection] = useState<string | null>('studentFriendly')
  const [copied, setCopied] = useState(false)

  async function handleUnpack() {
    setGenerating(true)
    await new Promise(r => setTimeout(r, 2000))
    setUnpacked(UNPACKED)
    setGenerating(false)
    setExpandedSection('studentFriendly')
  }

  function handleCopy() {
    if (!unpacked) return
    const text = [
      `Standard: ${unpacked.code}`,
      `"${unpacked.fullText}"`,
      `\nStudent-Friendly: ${unpacked.studentFriendly}`,
      `\nPrerequisites:\n${unpacked.prerequisites.map(p => `• ${p}`).join('\n')}`,
      `\nKey Vocabulary: ${unpacked.keyVocabulary.join(', ')}`,
      `\nSuggested Activities:\n${unpacked.suggestedActivities.map(a => `• ${a}`).join('\n')}`,
    ].join('\n')
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const sections = unpacked ? [
    {
      id: 'studentFriendly',
      label: 'Student-Friendly "I Can" Statement',
      icon: Users, color: '#10b981',
      content: (
        <div className="p-3 rounded-xl bg-success-500/5 border border-success-500/20">
          <p className="text-sm text-success-300 leading-relaxed font-medium">&ldquo;{unpacked.studentFriendly}&rdquo;</p>
        </div>
      )
    },
    {
      id: 'prerequisites',
      label: `Prerequisites (${unpacked.prerequisites.length})`,
      icon: ChevronRight, color: '#f59e0b',
      content: (
        <ul className="space-y-2">
          {unpacked.prerequisites.map((p, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-surface-300">
              <div className="w-5 h-5 rounded-full bg-warning-500/10 text-warning-400 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</div>
              {p}
            </li>
          ))}
        </ul>
      )
    },
    {
      id: 'vocabulary',
      label: `Key Vocabulary (${unpacked.keyVocabulary.length} terms)`,
      icon: BookOpen, color: '#6366f1',
      content: (
        <div className="flex flex-wrap gap-2">
          {unpacked.keyVocabulary.map(v => (
            <span key={v} className="px-2.5 py-1 rounded-xl bg-accent-500/10 border border-accent-500/20 text-xs text-accent-300 font-medium">{v}</span>
          ))}
        </div>
      )
    },
    {
      id: 'activities',
      label: `Suggested Activities (${unpacked.suggestedActivities.length})`,
      icon: Zap, color: '#22d3ee',
      content: (
        <ul className="space-y-2">
          {unpacked.suggestedActivities.map((a, i) => (
            <li key={i} className="flex items-start gap-2.5 text-xs text-surface-300">
              <Star className="w-3.5 h-3.5 text-electric-400 mt-0.5 flex-shrink-0" />
              {a}
            </li>
          ))}
        </ul>
      )
    },
    {
      id: 'assessments',
      label: `Assessment Ideas (${unpacked.assessmentIdeas.length})`,
      icon: Target, color: '#ec4899',
      content: (
        <ul className="space-y-2">
          {unpacked.assessmentIdeas.map((a, i) => (
            <li key={i} className="flex items-start gap-2.5 text-xs text-surface-300">
              <CheckCircle className="w-3.5 h-3.5 text-neon-400 mt-0.5 flex-shrink-0" />
              {a}
            </li>
          ))}
        </ul>
      )
    },
    {
      id: 'misconceptions',
      label: `Common Misconceptions (${unpacked.commonMisconceptions.length})`,
      icon: AlertCircle, color: '#ef4444',
      content: (
        <ul className="space-y-2">
          {unpacked.commonMisconceptions.map((m, i) => (
            <li key={i} className="flex items-start gap-2.5 text-xs text-surface-300">
              <AlertCircle className="w-3.5 h-3.5 text-danger-400 mt-0.5 flex-shrink-0" />
              {m}
            </li>
          ))}
        </ul>
      )
    },
    {
      id: 'differentiation',
      label: 'Differentiation Strategies',
      icon: Users, color: '#8b5cf6',
      content: (
        <div className="space-y-3">
          {unpacked.differentiations.map((d, i) => {
            const colors = ['#ef4444', '#22d3ee', '#10b981']
            const labels = ['Support', 'On-Grade', 'Extension']
            return (
              <div key={i} className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: colors[i] }}>{d.level}</p>
                <p className="text-xs text-surface-400">{d.strategy}</p>
              </div>
            )
          })}
        </div>
      )
    },
  ] : []

  return (
    <div className="p-6 space-y-6 max-w-[1600px]">
      {/* Header */}
      <FadeUp>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #14b8a6, #6366f1)' }}>
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-surface-100">Standards Unpacker</h1>
              <p className="text-sm text-surface-500">AI breaks down any standard into actionable teaching elements</p>
            </div>
          </div>
          {unpacked && (
            <div className="flex items-center gap-2">
              <button onClick={handleCopy} className="btn-secondary text-sm px-4 py-2">
                {copied ? <><Check className="w-4 h-4 text-success-400" />Copied</> : <><Copy className="w-4 h-4" />Copy All</>}
              </button>
              <button className="btn-secondary text-sm px-4 py-2">
                <Download className="w-4 h-4" />
                Export PDF
              </button>
            </div>
          )}
        </div>
      </FadeUp>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Input Panel */}
        <div className="xl:col-span-1 space-y-4">
          {/* Framework selector */}
          <FadeUp delay={0.05}>
            <div className="glass-card p-4">
              <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Standards Framework</p>
              <div className="space-y-1.5">
                {frameworks.map(f => (
                  <button
                    key={f.id}
                    onClick={() => setFramework(f.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-all text-left ${framework === f.id ? 'border-accent-500/30 bg-accent-500/5' : 'border-transparent hover:bg-white/[0.03]'}`}
                  >
                    <span className="text-base">{f.flag}</span>
                    <span className={`text-xs font-medium ${framework === f.id ? 'text-accent-300' : 'text-surface-300'}`}>{f.label}</span>
                    {framework === f.id && <Check className="w-3.5 h-3.5 text-accent-400 ml-auto" />}
                  </button>
                ))}
              </div>
            </div>
          </FadeUp>

          {/* Standard Input */}
          <FadeUp delay={0.1}>
            <div className="glass-card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Standard to Unpack</p>
                <button onClick={() => setInput('')} className="text-[11px] text-surface-500 hover:text-surface-300">Clear</button>
              </div>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                rows={6}
                className="w-full px-3 py-2.5 text-xs rounded-xl bg-white/[0.04] border border-white/[0.08] text-surface-200 placeholder:text-surface-600 focus:outline-none focus:border-accent-500/40 resize-none leading-relaxed"
                placeholder="Paste your standard code or full text here…&#10;e.g. CCSS.ELA-LITERACY.W.7.1&#10;or paste the full standard text"
              />
              <button
                onClick={handleUnpack}
                disabled={generating || !input.trim()}
                className="btn-gradient text-xs px-4 py-2 w-full justify-center disabled:opacity-50"
              >
                {generating
                  ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" />Unpacking…</>
                  : <><Sparkles className="w-3.5 h-3.5" />Unpack Standard</>
                }
              </button>
            </div>
          </FadeUp>

          {/* Recent History */}
          <FadeUp delay={0.15}>
            <div className="glass-card p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Recent</p>
              </div>
              <div className="space-y-2">
                {recentUnpacked.map(r => (
                  <button key={r.code} className="w-full flex items-start gap-2.5 text-left hover:bg-white/[0.03] rounded-xl px-2 py-2 transition-colors group">
                    <div className="w-1 h-10 rounded-full flex-shrink-0 mt-1" style={{ background: r.color }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-surface-200 group-hover:text-white transition-colors">{r.code}</p>
                      <p className="text-[11px] text-surface-500 truncate">{r.desc}</p>
                      <p className="text-[10px] text-surface-600">{r.subject} · {r.date}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>

        {/* Results Panel */}
        <div className="xl:col-span-2">
          {unpacked ? (
            <FadeUp delay={0.08}>
              <div className="space-y-3">
                {/* Standard Header */}
                <div className="glass-card p-5">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-bold px-2.5 py-1 rounded-xl" style={{ background: '#14b8a620', color: '#14b8a6' }}>{unpacked.code}</span>
                        <span className="text-xs text-surface-500">{unpacked.grade}</span>
                        <span className="text-xs text-surface-500">·</span>
                        <span className="text-xs text-surface-500">{unpacked.subject}</span>
                      </div>
                      <p className="text-sm text-surface-300 leading-relaxed">&ldquo;{unpacked.fullText}&rdquo;</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-4 flex-wrap">
                    <div className="flex items-center gap-1.5 text-xs text-surface-400">
                      <Clock className="w-3.5 h-3.5 text-warning-400" />
                      <span>~{unpacked.estimatedDays} teaching days</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {unpacked.bloomsLevels.map(b => (
                        <span key={b} className="text-[10px] px-2 py-0.5 rounded-full bg-accent-500/10 text-accent-400 border border-accent-500/20">{b}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Accordion Sections */}
                {sections.map(section => {
                  const isExpanded = expandedSection === section.id
                  return (
                    <div key={section.id} className="glass-card overflow-hidden">
                      <button
                        onClick={() => setExpandedSection(isExpanded ? null : section.id)}
                        className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
                      >
                        <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: section.color + '20' }}>
                          <section.icon className="w-4 h-4" style={{ color: section.color }} />
                        </div>
                        <span className="text-sm font-semibold text-surface-200 flex-1">{section.label}</span>
                        <ChevronDown className={`w-4 h-4 text-surface-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="border-t border-white/[0.06] px-4 py-4"
                          >
                            {section.content}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </div>
            </FadeUp>
          ) : (
            <FadeUp delay={0.1}>
              <div className="glass-card p-12 text-center">
                <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #14b8a6, #6366f1)' }}>
                  <Layers className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-surface-200 mb-2">Paste a Standard to Get Started</h3>
                <p className="text-sm text-surface-500 max-w-sm mx-auto">Paste any NGSS, CCSS, AP, or state standard and AI will break it down into student-friendly language, activities, vocabulary, and more.</p>
              </div>
            </FadeUp>
          )}
        </div>
      </div>
    </div>
  )
}
