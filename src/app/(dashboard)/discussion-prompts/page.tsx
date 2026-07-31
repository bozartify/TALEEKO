'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FadeUp, StaggerList, StaggerItem } from '@/components/ui/motion'
import {
  MessageCircle, Sparkles, RefreshCw, Copy, Check, ChevronDown,
  BookOpen, Users, Brain, Lightbulb, Star, Heart, Zap,
  Plus, Download, Share2, Target, ArrowRight, Clock, Filter
} from 'lucide-react'

type PromptType = 'socratic' | 'think-pair-share' | 'debate' | 'fishbowl' | 'four-corners' | 'philosophical'
type BloomsLevel = 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create'

interface DiscussionPrompt {
  id: string
  text: string
  type: PromptType
  blooms: BloomsLevel
  followUps: string[]
  starred?: boolean
}

interface PromptTypeConfig {
  label: string
  icon: string
  color: string
  desc: string
}

const promptTypeConfig: Record<PromptType, PromptTypeConfig> = {
  'socratic':         { label: 'Socratic Seminar', icon: '🏛️', color: '#6366f1', desc: 'Deep questioning that builds on student answers' },
  'think-pair-share': { label: 'Think-Pair-Share', icon: '💬', color: '#22d3ee', desc: 'Structured partner discussion before whole class' },
  'debate':           { label: 'Debate Starters',  icon: '⚖️',  color: '#f97316', desc: 'Two-sided prompts that spark respectful debate' },
  'fishbowl':         { label: 'Fishbowl',          icon: '🐟', color: '#10b981', desc: 'Inner-circle discussion with outer-circle observers' },
  'four-corners':     { label: 'Four Corners',      icon: '🟦', color: '#f59e0b', desc: 'Students physically move to agree/disagree positions' },
  'philosophical':    { label: 'Philosophical Chairs', icon: '🪑', color: '#ec4899', desc: 'Position-based ethical and moral dilemmas' },
}

const bloomsConfig: Record<BloomsLevel, { label: string; color: string }> = {
  remember:  { label: "Remember",  color: '#6b7280' },
  understand:{ label: "Understand",color: '#3b82f6' },
  apply:     { label: "Apply",     color: '#10b981' },
  analyze:   { label: "Analyze",   color: '#f59e0b' },
  evaluate:  { label: "Evaluate",  color: '#f97316' },
  create:    { label: "Create",    color: '#8b5cf6' },
}

const SAMPLE_PROMPTS: DiscussionPrompt[] = [
  {
    id: 'p1',
    text: 'If a plant has access to light and water but no carbon dioxide, can it survive? Why or why not?',
    type: 'socratic',
    blooms: 'analyze',
    followUps: ['What does your answer tell us about the role of each ingredient in photosynthesis?', 'How might this scenario apply to plants in a sealed space?', 'What evidence from our lab would support your answer?'],
    starred: true,
  },
  {
    id: 'p2',
    text: 'Should we consider plants "alive" in the same way we consider animals alive? Defend your position with evidence from what we\'ve learned.',
    type: 'philosophical',
    blooms: 'evaluate',
    followUps: ['What defines "life" — and does photosynthesis meet that definition?', 'Does the fact that plants respond to stimuli (like light) change your view?'],
  },
  {
    id: 'p3',
    text: 'In one sentence, explain photosynthesis to your partner. Then: what\'s the most surprising thing you each included?',
    type: 'think-pair-share',
    blooms: 'understand',
    followUps: ['What were the most common misconceptions your partner had?', 'How would you now improve your explanation?'],
  },
  {
    id: 'p4',
    text: 'AGREE or DISAGREE: "Without photosynthesis, humans would cease to exist within 10 years."',
    type: 'debate',
    blooms: 'evaluate',
    followUps: ['What assumptions are built into this claim?', 'What could humans do to extend survival if all plants disappeared?', 'How does the 10% rule of energy transfer factor in?'],
  },
  {
    id: 'p5',
    text: 'What would happen to the global climate if photosynthesis suddenly stopped? Think through the chain of effects.',
    type: 'fishbowl',
    blooms: 'analyze',
    followUps: ['What happens to CO₂ levels? What then?', 'Which species would be first affected? Which last?', 'How does this connect to current climate change discussions?'],
    starred: true,
  },
  {
    id: 'p6',
    text: 'STRONGLY AGREE — AGREE — DISAGREE — STRONGLY DISAGREE: "Plants are the most important living things on Earth."',
    type: 'four-corners',
    blooms: 'evaluate',
    followUps: ['What criterion are you using to define "important"?', 'Does your position change if we define importance differently?'],
  },
  {
    id: 'p7',
    text: 'Create an analogy: photosynthesis is like _____ because _____. Which analogy in the class is the most accurate? The most creative?',
    type: 'socratic',
    blooms: 'create',
    followUps: ['Where does the analogy break down?', 'Could a better analogy exist? What would it look like?'],
  },
  {
    id: 'p8',
    text: 'If you were a plant engineer given the ability to redesign photosynthesis, what one change would you make and why?',
    type: 'think-pair-share',
    blooms: 'create',
    followUps: ['What trade-offs would your design create?', 'How might this affect ecosystems?'],
  },
]

const recentSets = [
  { title: 'Cell Division Discussion Set', topic: 'Mitosis & Meiosis', prompts: 6, date: 'Yesterday', color: '#6366f1' },
  { title: 'American Revolution Debate', topic: 'Was the Revolution justified?', prompts: 4, date: '3 days ago', color: '#f97316' },
  { title: 'To Kill a Mockingbird Socratic', topic: 'Justice & Morality in Literature', prompts: 8, date: '1 week ago', color: '#ec4899' },
]

export default function DiscussionPromptsPage() {
  const [topic, setTopic] = useState('Photosynthesis and Energy Flow')
  const [subject, setSubject] = useState('Biology')
  const [gradeLevel, setGradeLevel] = useState('9-12')
  const [selectedTypes, setSelectedTypes] = useState<PromptType[]>(['socratic', 'debate', 'think-pair-share'])
  const [generating, setGenerating] = useState(false)
  const [prompts, setPrompts] = useState<DiscussionPrompt[]>(SAMPLE_PROMPTS)
  const [expandedId, setExpandedId] = useState<string | null>('p1')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [filterType, setFilterType] = useState<PromptType | 'all'>('all')
  const [filterBlooms, setFilterBlooms] = useState<BloomsLevel | 'all'>('all')
  const [starredOnly, setStarredOnly] = useState(false)

  function toggleType(type: PromptType) {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    )
  }

  function toggleStar(id: string) {
    setPrompts(prev => prev.map(p => p.id === id ? { ...p, starred: !p.starred } : p))
  }

  function handleCopy(prompt: DiscussionPrompt) {
    navigator.clipboard.writeText([prompt.text, ...prompt.followUps.map(f => `→ ${f}`)].join('\n'))
    setCopiedId(prompt.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  async function handleGenerate() {
    setGenerating(true)
    await new Promise(r => setTimeout(r, 2200))
    setGenerating(false)
  }

  const filtered = prompts.filter(p => {
    if (filterType !== 'all' && p.type !== filterType) return false
    if (filterBlooms !== 'all' && p.blooms !== filterBlooms) return false
    if (starredOnly && !p.starred) return false
    return true
  })

  return (
    <div className="p-6 space-y-6 max-w-[1600px]">
      {/* Header */}
      <FadeUp>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6366f1, #ec4899)' }}>
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-surface-100">Discussion Prompts</h1>
              <p className="text-sm text-surface-500">AI-generated discussion prompts for deeper classroom thinking</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-secondary text-sm px-4 py-2">
              <Download className="w-4 h-4" />
              Export Set
            </button>
            <button onClick={handleGenerate} disabled={generating || !topic.trim()} className="btn-gradient text-sm px-4 py-2 disabled:opacity-50">
              {generating
                ? <><RefreshCw className="w-4 h-4 animate-spin" />Generating…</>
                : <><Sparkles className="w-4 h-4" />Generate Prompts</>
              }
            </button>
          </div>
        </div>
      </FadeUp>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: Generator Config */}
        <div className="xl:col-span-1 space-y-4">
          {/* Topic Input */}
          <FadeUp delay={0.05}>
            <div className="glass-card p-4 space-y-3">
              <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Generate New Set</p>
              <div>
                <label className="text-[11px] text-surface-500 block mb-1">Topic / Text / Unit</label>
                <textarea
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white/[0.04] border border-white/[0.08] text-surface-200 placeholder:text-surface-600 focus:outline-none focus:border-accent-500/40 resize-none"
                  placeholder="e.g. Photosynthesis, To Kill a Mockingbird Ch. 12, The American Revolution…"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-surface-500 block mb-1">Subject</label>
                  <input type="text" value={subject} onChange={e => setSubject(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-white/[0.04] border border-white/[0.08] text-surface-200 focus:outline-none focus:border-accent-500/40" />
                </div>
                <div>
                  <label className="text-[11px] text-surface-500 block mb-1">Grade Level</label>
                  <select value={gradeLevel} onChange={e => setGradeLevel(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-white/[0.04] border border-white/[0.08] text-surface-200 focus:outline-none focus:border-accent-500/40">
                    <option value="K-2">K–2</option>
                    <option value="3-5">3–5</option>
                    <option value="6-8">6–8</option>
                    <option value="9-12">9–12</option>
                    <option value="College">College</option>
                  </select>
                </div>
              </div>
            </div>
          </FadeUp>

          {/* Discussion Types */}
          <FadeUp delay={0.1}>
            <div className="glass-card p-4">
              <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Discussion Strategies</p>
              <div className="space-y-2">
                {(Object.entries(promptTypeConfig) as [PromptType, PromptTypeConfig][]).map(([key, cfg]) => (
                  <button
                    key={key}
                    onClick={() => toggleType(key)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-all text-left ${selectedTypes.includes(key) ? 'border-transparent bg-white/[0.05]' : 'border-transparent opacity-60 hover:opacity-80'}`}
                    style={selectedTypes.includes(key) ? { borderColor: cfg.color + '30' } : {}}
                  >
                    <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-all ${selectedTypes.includes(key) ? 'border-0' : 'border border-white/[0.20]'}`}
                         style={selectedTypes.includes(key) ? { background: cfg.color } : {}}>
                      {selectedTypes.includes(key) && <Check className="w-2.5 h-2.5 text-white" />}
                    </div>
                    <span className="text-lg">{cfg.icon}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-surface-200 truncate">{cfg.label}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </FadeUp>

          {/* Past Sets */}
          <FadeUp delay={0.15}>
            <div className="glass-card p-4">
              <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Recent Sets</p>
              <div className="space-y-2">
                {recentSets.map(s => (
                  <div key={s.title} className="flex items-start gap-2.5 py-2 border-b border-white/[0.04] last:border-0">
                    <div className="w-1.5 h-10 rounded-full flex-shrink-0 mt-1" style={{ background: s.color }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-surface-200 truncate">{s.title}</p>
                      <p className="text-[11px] text-surface-500 truncate">{s.topic}</p>
                      <p className="text-[10px] text-surface-600">{s.prompts} prompts · {s.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>

        {/* Main: Prompt List */}
        <div className="xl:col-span-2 space-y-4">
          {/* Filters */}
          <FadeUp delay={0.08}>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <button
                  onClick={() => setStarredOnly(p => !p)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${starredOnly ? 'bg-warning-500/20 text-warning-300' : 'text-surface-400 hover:text-surface-200'}`}
                >
                  <Star className="w-3.5 h-3.5" />
                  Starred
                </button>
              </div>
              <div className="flex items-center gap-1 flex-wrap">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${filterType === 'all' ? 'bg-white/[0.08] text-white' : 'text-surface-500 hover:text-surface-300'}`}
                >
                  All Types
                </button>
                {(Object.entries(promptTypeConfig) as [PromptType, PromptTypeConfig][]).slice(0, 4).map(([key, cfg]) => (
                  <button
                    key={key}
                    onClick={() => setFilterType(filterType === key ? 'all' : key)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${filterType === key ? 'text-white' : 'text-surface-500 hover:text-surface-300'}`}
                    style={filterType === key ? { background: cfg.color + '30', color: cfg.color } : {}}
                  >
                    {cfg.icon} {cfg.label}
                  </button>
                ))}
              </div>
              <span className="text-xs text-surface-600 ml-auto">{filtered.length} prompts</span>
            </div>
          </FadeUp>

          {/* Prompt Cards */}
          <div className="space-y-3">
            {filtered.map((prompt, i) => {
              const ptc = promptTypeConfig[prompt.type]
              const bc = bloomsConfig[prompt.blooms]
              const isExpanded = expandedId === prompt.id
              return (
                <motion.div
                  key={prompt.id}
                  className="glass-card overflow-hidden"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <div className="flex items-start gap-3 p-4">
                    <span className="text-2xl flex-shrink-0 mt-0.5">{ptc.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-surface-200 leading-relaxed">&ldquo;{prompt.text}&rdquo;</p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: ptc.color + '20', color: ptc.color }}>{ptc.label}</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: bc.color + '20', color: bc.color }}>Bloom's: {bc.label}</span>
                        {prompt.followUps.length > 0 && (
                          <span className="text-[10px] text-surface-600">{prompt.followUps.length} follow-ups</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button onClick={() => toggleStar(prompt.id)} className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${prompt.starred ? 'text-warning-400' : 'text-surface-600 hover:text-surface-300'}`}>
                        <Star className={`w-4 h-4 ${prompt.starred ? 'fill-current' : ''}`} />
                      </button>
                      <button onClick={() => handleCopy(prompt)} className="w-7 h-7 rounded-lg flex items-center justify-center text-surface-500 hover:text-surface-200 transition-colors">
                        {copiedId === prompt.id ? <Check className="w-4 h-4 text-success-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : prompt.id)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-surface-500 hover:text-surface-200 transition-colors"
                      >
                        <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && prompt.followUps.length > 0 && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        className="border-t border-white/[0.06] px-4 py-3"
                      >
                        <p className="text-[10px] font-semibold text-surface-500 uppercase tracking-wider mb-2">Follow-Up Questions</p>
                        <ul className="space-y-1.5">
                          {prompt.followUps.map((fu, j) => (
                            <li key={j} className="flex items-start gap-2 text-xs text-surface-400">
                              <ArrowRight className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: ptc.color }} />
                              {fu}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>

          {/* Add Prompt */}
          <FadeUp delay={0.3}>
            <button className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-white/[0.08] text-xs text-surface-500 hover:border-accent-500/30 hover:text-accent-400 transition-all">
              <Plus className="w-4 h-4" />
              Add Custom Prompt
            </button>
          </FadeUp>
        </div>
      </div>
    </div>
  )
}
