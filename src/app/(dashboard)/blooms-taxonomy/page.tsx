'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FadeUp, FadeInWhenVisible } from '@/components/ui/motion'
import {
  Brain, Sparkles, ChevronDown, ChevronRight, Copy, Check,
  BarChart2, BookOpen, Layers, Target, Zap, RefreshCw,
  Download, Share2, Plus, X, Star, TrendingUp, Eye,
  PenTool, Settings, ArrowRight, Lightbulb, CheckCircle, Filter
} from 'lucide-react'

type Level = 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create'
type Domain = 'science' | 'math' | 'english' | 'history' | 'art'

const LEVELS: { id: Level; label: string; color: string; icon: typeof Brain; verb: string; desc: string; verbs: string[] }[] = [
  {
    id: 'remember', label: 'Remember', color: '#ef4444', icon: BookOpen, verb: 'Recall',
    desc: 'Retrieve relevant knowledge from long-term memory',
    verbs: ['Define', 'List', 'Recall', 'Identify', 'Name', 'Recognize', 'State', 'Match', 'Label', 'Reproduce'],
  },
  {
    id: 'understand', label: 'Understand', color: '#f97316', icon: Eye, verb: 'Explain',
    desc: 'Construct meaning from instructional messages',
    verbs: ['Explain', 'Summarize', 'Paraphrase', 'Classify', 'Describe', 'Discuss', 'Interpret', 'Translate', 'Illustrate', 'Outline'],
  },
  {
    id: 'apply', label: 'Apply', color: '#f59e0b', icon: Target, verb: 'Use',
    desc: 'Carry out or use a procedure in a given situation',
    verbs: ['Apply', 'Calculate', 'Demonstrate', 'Execute', 'Solve', 'Use', 'Implement', 'Operate', 'Practice', 'Construct'],
  },
  {
    id: 'analyze', label: 'Analyze', color: '#22d3ee', icon: Layers, verb: 'Break Down',
    desc: 'Break material into parts and determine relationships',
    verbs: ['Analyze', 'Compare', 'Contrast', 'Differentiate', 'Examine', 'Categorize', 'Deconstruct', 'Investigate', 'Organize', 'Test'],
  },
  {
    id: 'evaluate', label: 'Evaluate', color: '#8b5cf6', icon: Star, verb: 'Judge',
    desc: 'Make judgments based on criteria and standards',
    verbs: ['Evaluate', 'Critique', 'Justify', 'Assess', 'Argue', 'Judge', 'Defend', 'Appraise', 'Recommend', 'Prioritize'],
  },
  {
    id: 'create', label: 'Create', color: '#6366f1', icon: Sparkles, verb: 'Design',
    desc: 'Put elements together to form a coherent whole; generate a new pattern',
    verbs: ['Create', 'Design', 'Construct', 'Develop', 'Formulate', 'Produce', 'Compose', 'Generate', 'Plan', 'Invent'],
  },
]

const SAMPLE_OBJECTIVES: Record<Level, string[]> = {
  remember: [
    'Students will be able to name the 6 levels of Bloom\'s Taxonomy.',
    'Students will identify the parts of a plant cell and their functions.',
    'Students will list the causes of World War I in chronological order.',
    'Students will recall key vocabulary terms from Chapter 3.',
  ],
  understand: [
    'Students will explain the process of photosynthesis in their own words.',
    'Students will summarize the main themes of Romeo and Juliet.',
    'Students will describe the relationship between supply and demand.',
    'Students will interpret data from a population growth graph.',
  ],
  apply: [
    'Students will solve quadratic equations using the quadratic formula.',
    'Students will apply the scientific method to a new experiment.',
    'Students will use figurative language in their own creative writing.',
    'Students will calculate the area and perimeter of composite shapes.',
  ],
  analyze: [
    'Students will compare and contrast the causes of WWI and WWII.',
    'Students will examine evidence to determine the author\'s point of view.',
    'Students will analyze how mutations affect protein synthesis.',
    'Students will deconstruct a mathematical proof step by step.',
  ],
  evaluate: [
    'Students will evaluate the effectiveness of various conservation strategies.',
    'Students will critique a peer\'s argument using evidence-based reasoning.',
    'Students will justify their solution approach with mathematical reasoning.',
    'Students will assess the reliability of different historical sources.',
  ],
  create: [
    'Students will design an experiment to test the effect of light on plant growth.',
    'Students will compose an original short story using narrative techniques.',
    'Students will construct a model of the water cycle with labeled annotations.',
    'Students will develop a proposal for a school sustainability initiative.',
  ],
}

const TOPIC_SUGGESTIONS: Record<Domain, string[]> = {
  science: ['Photosynthesis', 'Cell Division', 'Genetics & Heredity', 'Newton\'s Laws', 'Chemical Reactions', 'Ecosystems'],
  math: ['Quadratic Equations', 'Geometry Proofs', 'Statistics & Probability', 'Calculus Derivatives', 'Linear Systems'],
  english: ['Literary Analysis', 'Persuasive Writing', 'Shakespeare', 'Poetry Analysis', 'Research Writing'],
  history: ['Civil War', 'World War II', 'Industrial Revolution', 'Cold War', 'Ancient Civilizations'],
  art: ['Color Theory', 'Perspective Drawing', 'Art Movements', 'Digital Media', 'Sculpture Techniques'],
}

const QUESTION_STEMS: Record<Level, string[]> = {
  remember: ['What is…?', 'When did…?', 'Who was…?', 'List the…', 'Define…', 'Identify…'],
  understand: ['Explain in your own words…', 'What is meant by…?', 'How would you describe…?', 'Give an example of…'],
  apply: ['How would you use…?', 'What approach would you use to…?', 'Demonstrate how…', 'Solve using…'],
  analyze: ['What evidence supports…?', 'How does ___ relate to ___?', 'What is the relationship between…?', 'Compare and contrast…'],
  evaluate: ['Do you agree with…? Why?', 'What is your assessment of…?', 'How would you evaluate…?', 'Justify your position…'],
  create: ['Design a…', 'What would happen if…?', 'Develop a plan to…', 'How would you improve…?'],
}

const DIST_DATA = [18, 24, 22, 16, 12, 8] // % per level (sum 100)

export default function BloomsTaxonomyPage() {
  const [activeLevel, setActiveLevel] = useState<Level>('understand')
  const [activeDomain, setActiveDomain] = useState<Domain>('science')
  const [topic, setTopic] = useState('Photosynthesis')
  const [generating, setGenerating] = useState(false)
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)
  const [expandedLevel, setExpandedLevel] = useState<Level | null>(null)
  const [savedObjectives, setSavedObjectives] = useState<{ text: string; level: Level }[]>([])
  const [pyramidHover, setPyramidHover] = useState<Level | null>(null)
  const [toastMsg, setToastMsg] = useState('')
  function showToast(msg: string) { setToastMsg(msg); setTimeout(() => setToastMsg(''), 2500) }

  function handleCopy(text: string, idx: number) {
    navigator.clipboard?.writeText(text).catch(() => {})
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 2000)
  }

  function handleSave(text: string, level: Level) {
    setSavedObjectives(prev => [...prev, { text, level }])
    showToast('Objective saved!')
  }

  function handleGenerate() {
    setGenerating(true)
    setTimeout(() => setGenerating(false), 1800)
  }

  const activeLevelData = LEVELS.find(l => l.id === activeLevel)!

  return (
    <div className="min-h-screen space-y-6 pb-10">

      {/* ── Header ── */}
      <FadeUp>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-xl bg-accent-500/20 flex items-center justify-center">
                <Brain className="w-4 h-4 text-accent-400" />
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight">Bloom's Taxonomy</h1>
            </div>
            <p className="text-sm text-surface-400">Generate differentiated learning objectives · Question stems · DOK levels</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={handleGenerate} disabled={generating}
              className="btn-primary flex items-center gap-2 text-sm px-4 py-2">
              {generating
                ? <RefreshCw className="w-4 h-4 animate-spin" />
                : <Sparkles className="w-4 h-4" />}
              {generating ? 'Generating…' : 'AI Generate'}
            </button>
            <button className="btn-secondary flex items-center gap-2 text-sm px-4 py-2">
              <Download className="w-4 h-4" /> Export PDF
            </button>
            <button className="btn-secondary flex items-center gap-2 text-sm px-4 py-2">
              <Share2 className="w-4 h-4" /> Share Unit
            </button>
          </div>
        </div>
      </FadeUp>

      {/* ── Stat Tiles ── */}
      <FadeUp delay={0.05}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Objectives Generated', value: '48', delta: '+12 today', color: '#6366f1', icon: Target },
            { label: 'Levels Covered', value: '6/6', delta: 'Full pyramid', color: '#10b981', icon: Layers },
            { label: 'HOT Questions', value: '31', delta: 'Levels 4–6', color: '#8b5cf6', icon: TrendingUp },
            { label: 'Aligned Standards', value: '14', delta: 'NGSS + CCSS', color: '#22d3ee', icon: CheckCircle },
          ].map((t, i) => (
            <motion.div key={t.label} className="glass-card p-4"
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <div className="flex items-center justify-between mb-2">
                <t.icon className="w-4 h-4" style={{ color: t.color }} />
                <span className="text-[10px] text-surface-500 bg-white/[0.04] px-2 py-0.5 rounded-full">{t.delta}</span>
              </div>
              <div className="text-2xl font-black text-white">{t.value}</div>
              <div className="text-xs text-surface-500 mt-0.5">{t.label}</div>
            </motion.div>
          ))}
        </div>
      </FadeUp>

      {/* ── Main Layout ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* ── Left: Pyramid + Distribution ── */}
        <FadeUp delay={0.1} className="xl:col-span-1">
          <div className="glass-card p-5 h-full">
            <div className="flex items-center gap-2 mb-5">
              <BarChart2 className="w-4 h-4 text-accent-400" />
              <span className="text-sm font-bold text-white">Cognitive Pyramid</span>
            </div>

            {/* Pyramid SVG */}
            <div className="mb-5">
              {(() => {
                const W = 280, levels = LEVELS.slice().reverse()
                return (
                  <svg viewBox={`0 0 ${W} 200`} className="w-full overflow-visible">
                    {levels.map((lvl, i) => {
                      const n = levels.length
                      const sliceH = 200 / n
                      const topW = W * (i + 1) / n
                      const botW = W * (i + 2) / n
                      const y = i * sliceH
                      const leftTop = (W - topW) / 2
                      const leftBot = (W - Math.min(botW, W)) / 2
                      const pts = `${leftTop},${y} ${leftTop + topW},${y} ${leftBot + Math.min(botW, W)},${y + sliceH} ${leftBot},${y + sliceH}`
                      const isActive = lvl.id === activeLevel
                      const isHover = lvl.id === pyramidHover
                      return (
                        <g key={lvl.id} className="cursor-pointer"
                          onClick={() => setActiveLevel(lvl.id)}
                          onMouseEnter={() => setPyramidHover(lvl.id)}
                          onMouseLeave={() => setPyramidHover(null)}>
                          <motion.polygon
                            points={pts}
                            fill={lvl.color + (isActive || isHover ? 'cc' : '55')}
                            stroke={lvl.color}
                            strokeWidth={isActive ? 2 : 1}
                            animate={{ opacity: isActive || isHover ? 1 : 0.7 }}
                          />
                          <text
                            x={W / 2} y={y + sliceH / 2 + 4}
                            textAnchor="middle"
                            fill={isActive ? '#fff' : 'rgba(255,255,255,0.7)'}
                            fontSize={11} fontWeight={isActive ? 700 : 500}>
                            {lvl.label}
                          </text>
                        </g>
                      )
                    })}
                  </svg>
                )
              })()}
            </div>

            {/* Distribution bars */}
            <div className="space-y-2">
              <p className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold mb-2">Objective Distribution</p>
              {LEVELS.map((lvl, i) => {
                const pct = DIST_DATA[i]
                const W = 200, H = 6
                const bw = (pct / 100) * W
                return (
                  <div key={lvl.id} className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveLevel(lvl.id)}>
                    <span className="text-[10px] text-surface-400 w-20 flex-shrink-0">{lvl.label}</span>
                    <svg viewBox={`0 0 ${W} ${H}`} className="flex-1 overflow-visible">
                      <defs>
                        <linearGradient id={`bt-dist-${i}`} x1="0" x2="1" y1="0" y2="0">
                          <stop offset="0%" stopColor={lvl.color} />
                          <stop offset="100%" stopColor={lvl.color + '80'} />
                        </linearGradient>
                      </defs>
                      <rect x={0} y={0} width={W} height={H} rx={3} fill="rgba(255,255,255,0.06)" />
                      <motion.rect x={0} y={0} height={H} rx={3}
                        fill={`url(#bt-dist-${i})`}
                        initial={{ width: 0 }} animate={{ width: bw }}
                        transition={{ delay: 0.3 + i * 0.07, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </svg>
                    <span className="text-[10px] font-bold text-surface-400 w-7 text-right">{pct}%</span>
                  </div>
                )
              })}
            </div>
          </div>
        </FadeUp>

        {/* ── Center + Right: Generator ── */}
        <div className="xl:col-span-2 space-y-5">

          {/* Topic + Domain Input */}
          <FadeUp delay={0.12}>
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="w-4 h-4 text-electric-400" />
                <span className="text-sm font-bold text-white">Generator Settings</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold block mb-1.5">Topic / Standard</label>
                  <input
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                    placeholder="Enter topic or standard code…"
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white placeholder-surface-600 focus:outline-none focus:border-accent-500/50 focus:bg-accent-500/[0.04]"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold block mb-1.5">Subject Domain</label>
                  <div className="flex flex-wrap gap-1.5">
                    {(['science', 'math', 'english', 'history', 'art'] as Domain[]).map(d => (
                      <button key={d}
                        onClick={() => { setActiveDomain(d); setTopic(TOPIC_SUGGESTIONS[d][0]) }}
                        className={`text-[10px] font-semibold px-2.5 py-1 rounded-full capitalize transition-all ${
                          activeDomain === d ? 'bg-accent-500/20 text-accent-400 border border-accent-500/30' : 'bg-white/[0.04] text-surface-400 border border-white/[0.06] hover:text-white'
                        }`}>
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              {/* Quick topics */}
              <div>
                <p className="text-[10px] text-surface-600 mb-2">Quick topics:</p>
                <div className="flex flex-wrap gap-1.5">
                  {TOPIC_SUGGESTIONS[activeDomain].map(t => (
                    <button key={t} onClick={() => setTopic(t)}
                      className={`text-[10px] px-2 py-0.5 rounded-full border transition-all ${
                        topic === t ? 'bg-electric-400/15 text-electric-400 border-electric-400/30' : 'bg-white/[0.03] text-surface-500 border-white/[0.06] hover:text-white'
                      }`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </FadeUp>

          {/* Level Selector */}
          <FadeUp delay={0.15}>
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Layers className="w-4 h-4 text-electric-400" />
                <span className="text-sm font-bold text-white">Select Cognitive Level</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                {LEVELS.map((lvl, i) => {
                  const isActive = activeLevel === lvl.id
                  return (
                    <motion.button key={lvl.id}
                      onClick={() => setActiveLevel(lvl.id)}
                      className={`flex items-center gap-2 p-3 rounded-xl border transition-all text-left ${
                        isActive
                          ? 'border-2 bg-white/[0.06]'
                          : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.1]'
                      }`}
                      style={{ borderColor: isActive ? lvl.color : undefined }}
                      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.04 }}>
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: lvl.color + '25' }}>
                        <span className="text-[10px] font-black" style={{ color: lvl.color }}>{i + 1}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white leading-tight">{lvl.label}</p>
                        <p className="text-[9px] text-surface-500 truncate">{lvl.verb}</p>
                      </div>
                    </motion.button>
                  )
                })}
              </div>

              {/* Active level detail */}
              <AnimatePresence mode="wait">
                <motion.div key={activeLevel}
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                  className="p-3 rounded-xl border"
                  style={{ backgroundColor: activeLevelData.color + '10', borderColor: activeLevelData.color + '30' }}>
                  <p className="text-xs text-surface-300 mb-2">{activeLevelData.desc}</p>
                  <div className="flex flex-wrap gap-1">
                    {activeLevelData.verbs.map(v => (
                      <span key={v} className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                        style={{ backgroundColor: activeLevelData.color + '20', color: activeLevelData.color }}>
                        {v}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </FadeUp>

          {/* Generated Objectives */}
          <FadeUp delay={0.18}>
            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4" style={{ color: activeLevelData.color }} />
                  <span className="text-sm font-bold text-white">
                    Learning Objectives — <span style={{ color: activeLevelData.color }}>{activeLevelData.label}</span>
                  </span>
                </div>
                <button onClick={handleGenerate} disabled={generating}
                  className="flex items-center gap-1.5 text-xs text-accent-400 font-semibold hover:text-accent-300 transition-colors">
                  {generating ? <RefreshCw className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                  Regenerate
                </button>
              </div>

              <AnimatePresence mode="wait">
                {generating ? (
                  <motion.div key="loading" className="space-y-2"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="h-10 rounded-xl bg-white/[0.04] animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                    ))}
                  </motion.div>
                ) : (
                  <motion.div key="objectives" className="space-y-2"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {SAMPLE_OBJECTIVES[activeLevel].map((obj, idx) => (
                      <motion.div key={obj}
                        className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] group hover:bg-white/[0.05] hover:border-white/[0.1] transition-all"
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.07 }}>
                        <div className="w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{ background: activeLevelData.color + '25' }}>
                          <span className="text-[9px] font-black" style={{ color: activeLevelData.color }}>{idx + 1}</span>
                        </div>
                        <p className="text-sm text-surface-200 flex-1 leading-relaxed">{obj}</p>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                          <button onClick={() => handleSave(obj, activeLevel)}
                            className="p-1.5 rounded-lg hover:bg-white/[0.08] text-surface-500 hover:text-success-400 transition-all" title="Save">
                            <Star className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleCopy(obj, idx)}
                            className="p-1.5 rounded-lg hover:bg-white/[0.08] text-surface-500 hover:text-white transition-all" title="Copy">
                            {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-success-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </FadeUp>
        </div>
      </div>

      {/* ── Question Stems ── */}
      <FadeInWhenVisible delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <PenTool className="w-4 h-4 text-electric-400" />
              <span className="text-sm font-bold text-white">Question Stems</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                style={{ background: activeLevelData.color + '20', color: activeLevelData.color }}>
                {activeLevelData.label}
              </span>
            </div>
            <div className="space-y-2">
              {QUESTION_STEMS[activeLevel].map((stem, i) => (
                <motion.div key={stem}
                  className="flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.05] group hover:bg-white/[0.05] cursor-pointer"
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}>
                  <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" style={{ color: activeLevelData.color }} />
                  <span className="text-sm text-surface-300 flex-1">{stem}</span>
                  <button onClick={() => handleCopy(stem, 100 + i)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white/[0.08] text-surface-500 hover:text-white transition-all">
                    {copiedIdx === 100 + i ? <Check className="w-3 h-3 text-success-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* DOK Alignment */}
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-4 h-4 text-warning-400" />
              <span className="text-sm font-bold text-white">DOK Level Alignment</span>
            </div>
            <div className="space-y-3">
              {[
                { dok: 1, label: 'Recall & Reproduction', blooms: ['Remember'], color: '#ef4444',
                  desc: 'Simple recall, facts, definitions' },
                { dok: 2, label: 'Skills & Concepts', blooms: ['Understand', 'Apply'], color: '#f59e0b',
                  desc: 'Use information, explain ideas, classify' },
                { dok: 3, label: 'Strategic Thinking', blooms: ['Analyze', 'Evaluate'], color: '#22d3ee',
                  desc: 'Reason, justify, cite evidence' },
                { dok: 4, label: 'Extended Thinking', blooms: ['Create'], color: '#6366f1',
                  desc: 'Complex reasoning, design, create' },
              ].map((row, i) => {
                const W = 200, H = 6, pct = [25, 45, 65, 90][i]
                const bw = (pct / 100) * W
                return (
                  <motion.div key={row.dok} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]"
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black" style={{ color: row.color }}>DOK {row.dok}</span>
                        <span className="text-xs font-semibold text-surface-200">{row.label}</span>
                      </div>
                      <div className="flex gap-1">
                        {row.blooms.map(b => (
                          <span key={b} className="text-[9px] px-1.5 py-0.5 rounded font-semibold bg-white/[0.06] text-surface-400">{b}</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-[10px] text-surface-500 mb-2">{row.desc}</p>
                    <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible">
                      <defs>
                        <linearGradient id={`bt-dok-${i}`} x1="0" x2="1" y1="0" y2="0">
                          <stop offset="0%" stopColor={row.color} />
                          <stop offset="100%" stopColor={row.color + '80'} />
                        </linearGradient>
                      </defs>
                      <rect x={0} y={0} width={W} height={H} rx={3} fill="rgba(255,255,255,0.06)" />
                      <motion.rect x={0} y={0} height={H} rx={3}
                        fill={`url(#bt-dok-${i})`}
                        initial={{ width: 0 }} animate={{ width: bw }}
                        transition={{ delay: 0.4 + i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </svg>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </FadeInWhenVisible>

      {/* ── All Levels Accordion ── */}
      <FadeInWhenVisible delay={0.15}>
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-4 h-4 text-accent-400" />
            <span className="text-sm font-bold text-white">All Levels — Objectives for "{topic}"</span>
          </div>
          <div className="space-y-2">
            {LEVELS.map((lvl, i) => {
              const isExp = expandedLevel === lvl.id
              return (
                <div key={lvl.id} className="border border-white/[0.06] rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedLevel(isExp ? null : lvl.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors text-left">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: lvl.color + '25' }}>
                      <span className="text-[10px] font-black" style={{ color: lvl.color }}>{i + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-semibold text-white">{lvl.label}</span>
                      <span className="text-xs text-surface-500 ml-2">{lvl.desc}</span>
                    </div>
                    <div className="flex gap-1 mr-2">
                      {lvl.verbs.slice(0, 4).map(v => (
                        <span key={v} className="text-[9px] px-1.5 py-0.5 rounded font-semibold"
                          style={{ background: lvl.color + '20', color: lvl.color }}>{v}</span>
                      ))}
                    </div>
                    <motion.div animate={{ rotate: isExp ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown className="w-4 h-4 text-surface-500" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {isExp && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                        className="border-t border-white/[0.06]">
                        <div className="p-4 space-y-2">
                          {SAMPLE_OBJECTIVES[lvl.id].map((obj, idx) => (
                            <div key={idx} className="flex items-start gap-2 group">
                              <ChevronRight className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: lvl.color }} />
                              <p className="text-sm text-surface-300 flex-1">{obj}</p>
                              <button onClick={() => handleCopy(obj, i * 10 + idx)}
                                className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white/[0.08] text-surface-500 transition-all">
                                {copiedIdx === i * 10 + idx ? <Check className="w-3 h-3 text-success-400" /> : <Copy className="w-3 h-3" />}
                              </button>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </div>
      </FadeInWhenVisible>

      {/* ── Saved Objectives ── */}
      {savedObjectives.length > 0 && (
        <FadeInWhenVisible delay={0.1}>
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-warning-400" />
                <span className="text-sm font-bold text-white">Saved Objectives ({savedObjectives.length})</span>
              </div>
              <div className="flex gap-2">
                <button className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5" /> Export
                </button>
                <button onClick={() => setSavedObjectives([])} className="text-xs text-surface-500 hover:text-danger-400 transition-colors">
                  Clear all
                </button>
              </div>
            </div>
            <div className="space-y-2">
              {savedObjectives.map((s, i) => {
                const lvl = LEVELS.find(l => l.id === s.level)!
                return (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] group">
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold flex-shrink-0"
                      style={{ background: lvl.color + '20', color: lvl.color }}>{lvl.label}</span>
                    <p className="text-sm text-surface-200 flex-1">{s.text}</p>
                    <button onClick={() => setSavedObjectives(prev => prev.filter((_, j) => j !== i))}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white/[0.08] text-surface-500 hover:text-danger-400 transition-all">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </FadeInWhenVisible>
      )}

      {/* Toast */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-surface-800 border border-white/[0.1] text-sm text-white shadow-elevation-3 flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-success-400 animate-pulse" />
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
