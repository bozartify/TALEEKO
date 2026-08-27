'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FadeUp } from '@/components/ui/motion'
import {
  MessageCircle, Sparkles, RefreshCw, Copy, Check, ChevronDown,
  Star, Plus, Download, Share2, ArrowRight, Clock,
  Play, Pause, SkipForward, Maximize2, X, ChevronLeft, ChevronRight,
  BookOpen, Brain, Zap, Target, TrendingUp, Filter, CheckCircle
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
  usedCount?: number
  difficulty?: 'easy' | 'medium' | 'hard'
}

interface PromptTypeConfig {
  label: string
  icon: string
  color: string
  desc: string
}

const promptTypeConfig: Record<PromptType, PromptTypeConfig> = {
  'socratic':          { label: 'Socratic Seminar',     icon: '🏛️', color: '#6366f1', desc: 'Deep questioning that builds on student answers' },
  'think-pair-share':  { label: 'Think-Pair-Share',     icon: '💬', color: '#22d3ee', desc: 'Structured partner discussion before whole class' },
  'debate':            { label: 'Debate Starters',      icon: '⚖️',  color: '#f97316', desc: 'Two-sided prompts that spark respectful debate' },
  'fishbowl':          { label: 'Fishbowl',             icon: '🐟', color: '#10b981', desc: 'Inner-circle discussion with outer-circle observers' },
  'four-corners':      { label: 'Four Corners',         icon: '🟦', color: '#f59e0b', desc: 'Students physically move to agree/disagree positions' },
  'philosophical':     { label: 'Philosophical Chairs', icon: '🪑', color: '#ec4899', desc: 'Position-based ethical and moral dilemmas' },
}

const bloomsConfig: Record<BloomsLevel, { label: string; color: string; order: number }> = {
  remember:   { label: 'Remember',   color: '#6b7280', order: 1 },
  understand: { label: 'Understand', color: '#3b82f6', order: 2 },
  apply:      { label: 'Apply',      color: '#10b981', order: 3 },
  analyze:    { label: 'Analyze',    color: '#f59e0b', order: 4 },
  evaluate:   { label: 'Evaluate',   color: '#f97316', order: 5 },
  create:     { label: 'Create',     color: '#8b5cf6', order: 6 },
}

const difficultyConfig = {
  easy:   { label: 'Easy',   color: '#10b981' },
  medium: { label: 'Medium', color: '#f59e0b' },
  hard:   { label: 'Hard',   color: '#ef4444' },
}

const SAMPLE_PROMPTS: DiscussionPrompt[] = [
  {
    id: 'p1',
    text: 'If a plant has access to light and water but no carbon dioxide, can it survive? Why or why not?',
    type: 'socratic', blooms: 'analyze', difficulty: 'medium', usedCount: 5, starred: true,
    followUps: ['What does your answer tell us about the role of each ingredient in photosynthesis?', 'How might this scenario apply to plants in a sealed space?', 'What evidence from our lab would support your answer?'],
  },
  {
    id: 'p2',
    text: 'Should we consider plants "alive" in the same way we consider animals alive? Defend your position with evidence from what we\'ve learned.',
    type: 'philosophical', blooms: 'evaluate', difficulty: 'hard', usedCount: 2,
    followUps: ['What defines "life" — and does photosynthesis meet that definition?', 'Does the fact that plants respond to stimuli (like light) change your view?'],
  },
  {
    id: 'p3',
    text: 'In one sentence, explain photosynthesis to your partner. Then: what\'s the most surprising thing you each included?',
    type: 'think-pair-share', blooms: 'understand', difficulty: 'easy', usedCount: 8,
    followUps: ['What were the most common misconceptions your partner had?', 'How would you now improve your explanation?'],
  },
  {
    id: 'p4',
    text: 'AGREE or DISAGREE: "Without photosynthesis, humans would cease to exist within 10 years."',
    type: 'debate', blooms: 'evaluate', difficulty: 'medium', usedCount: 3, starred: true,
    followUps: ['What assumptions are built into this claim?', 'What could humans do to extend survival if all plants disappeared?', 'How does the 10% rule of energy transfer factor in?'],
  },
  {
    id: 'p5',
    text: 'What would happen to the global climate if photosynthesis suddenly stopped? Think through the chain of effects.',
    type: 'fishbowl', blooms: 'analyze', difficulty: 'hard', usedCount: 1, starred: true,
    followUps: ['What happens to CO₂ levels? What then?', 'Which species would be first affected? Which last?', 'How does this connect to current climate change discussions?'],
  },
  {
    id: 'p6',
    text: 'STRONGLY AGREE — AGREE — DISAGREE — STRONGLY DISAGREE: "Plants are the most important living things on Earth."',
    type: 'four-corners', blooms: 'evaluate', difficulty: 'medium', usedCount: 4,
    followUps: ['What criterion are you using to define "important"?', 'Does your position change if we define importance differently?'],
  },
  {
    id: 'p7',
    text: 'Create an analogy: photosynthesis is like _____ because _____. Which analogy in the class is the most accurate? The most creative?',
    type: 'socratic', blooms: 'create', difficulty: 'medium', usedCount: 6,
    followUps: ['Where does the analogy break down?', 'Could a better analogy exist? What would it look like?'],
  },
  {
    id: 'p8',
    text: 'If you were a plant engineer given the ability to redesign photosynthesis, what one change would you make and why?',
    type: 'think-pair-share', blooms: 'create', difficulty: 'hard', usedCount: 2,
    followUps: ['What trade-offs would your design create?', 'How might this affect ecosystems?'],
  },
  {
    id: 'p9',
    text: 'Name one thing from today\'s reading you could explain to a younger student. What would you say first?',
    type: 'think-pair-share', blooms: 'remember', difficulty: 'easy', usedCount: 11,
    followUps: ['What language would you change to make it simpler?', 'What question do you think they would ask?'],
  },
  {
    id: 'p10',
    text: 'FISHBOWL INNER CIRCLE: A world without oxygen-producing organisms has just been discovered. As scientists, what is your first priority?',
    type: 'fishbowl', blooms: 'apply', difficulty: 'hard', usedCount: 0,
    followUps: ['What resources do you have?', 'How does photosynthesis knowledge guide your plan?'],
  },
  {
    id: 'p11',
    text: 'Compare the process of photosynthesis to charging a phone battery. Where does the analogy hold — and where does it fall apart?',
    type: 'socratic', blooms: 'analyze', difficulty: 'medium', usedCount: 3,
    followUps: ['What is the "charger" in the analogy?', 'What happens to the energy in each case?'],
  },
  {
    id: 'p12',
    text: 'Is it ethical to genetically modify plants to photosynthesize more efficiently if it risks displacing natural species? Take a position.',
    type: 'philosophical', blooms: 'evaluate', difficulty: 'hard', usedCount: 1,
    followUps: ['Who benefits from this technology?', 'What obligations do scientists have to ecosystems?'],
  },
]

const recentSets = [
  { title: 'Cell Division Discussion Set',       topic: 'Mitosis & Meiosis',               prompts: 6, date: 'Yesterday',  color: '#6366f1' },
  { title: 'American Revolution Debate',          topic: 'Was the Revolution justified?',    prompts: 4, date: '3 days ago', color: '#f97316' },
  { title: 'To Kill a Mockingbird Socratic',      topic: 'Justice & Morality in Literature', prompts: 8, date: '1 week ago', color: '#ec4899' },
]

const TIMER_PRESETS = [2, 3, 5, 8, 10]

export default function DiscussionPromptsPage() {
  const [topic, setTopic]               = useState('Photosynthesis and Energy Flow')
  const [subject, setSubject]           = useState('Biology')
  const [gradeLevel, setGradeLevel]     = useState('9-12')
  const [selectedTypes, setSelectedTypes] = useState<PromptType[]>(['socratic', 'debate', 'think-pair-share'])
  const [generating, setGenerating]     = useState(false)
  const [prompts, setPrompts]           = useState<DiscussionPrompt[]>(SAMPLE_PROMPTS)
  const [expandedId, setExpandedId]     = useState<string | null>('p1')
  const [copiedId, setCopiedId]         = useState<string | null>(null)
  const [filterType, setFilterType]     = useState<PromptType | 'all'>('all')
  const [filterBlooms, setFilterBlooms] = useState<BloomsLevel | 'all'>('all')
  const [starredOnly, setStarredOnly]   = useState(false)
  const [aiOpen, setAiOpen]             = useState(true)
  const [newPromptOpen, setNewPromptOpen] = useState(false)
  const [shareOpen, setShareOpen]         = useState(false)
  const [slideMode, setSlideMode]         = useState(false)
  const [slideIndex, setSlideIndex]       = useState(0)
  const [timerActive, setTimerActive]     = useState(false)
  const [timerSecs, setTimerSecs]         = useState(180)
  const [timerRunning, setTimerRunning]   = useState(false)
  const [timerPreset, setTimerPreset]     = useState(3)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const [newPrompt, setNewPrompt] = useState({ text: '', type: 'socratic' as PromptType, blooms: 'analyze' as BloomsLevel, followUp: '' })
  const [toastMsg, setToastMsg] = useState('')
  function showToast(msg: string) { setToastMsg(msg); setTimeout(() => setToastMsg(''), 2500) }

  useEffect(() => {
    if (timerRunning && timerSecs > 0) {
      intervalRef.current = setInterval(() => setTimerSecs(s => s - 1), 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (timerSecs === 0) setTimerRunning(false)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [timerRunning, timerSecs])

  const resetTimer = (mins: number) => {
    setTimerRunning(false)
    setTimerSecs(mins * 60)
    setTimerPreset(mins)
  }

  function toggleType(type: PromptType) {
    setSelectedTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type])
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
    try {
      const types: PromptType[] = selectedTypes.length > 0 ? selectedTypes : ['socratic', 'debate', 'think-pair-share']
      const typeLabels = types.map(t => promptTypeConfig[t].label).join(', ')
      const prompt = `Generate ${types.length * 2} discussion prompts about "${topic}" for grade ${gradeLevel} ${subject} students.
Discussion types needed: ${typeLabels}.
For each prompt provide:
- The main discussion question
- The Bloom's taxonomy level (remember/understand/apply/analyze/evaluate/create)
- Difficulty (easy/medium/hard)
- 2-3 follow-up questions

Format as a JSON array with this structure:
[{"type": "socratic|think-pair-share|debate|fishbowl|four-corners|philosophical", "text": "...", "blooms": "...", "difficulty": "...", "followUps": ["...", "..."]}]

Return ONLY the JSON array, no other text.`
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: prompt }], mode: 'general' }),
      })
      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let buf = ''
      let fullText = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buf += decoder.decode(value, { stream: true })
        const lines = buf.split('\n')
        buf = lines.pop() ?? ''
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6).trim()
          if (data === '[DONE]') break
          try { const p = JSON.parse(data); if (p.type === 'text') fullText += p.text } catch { /* ignore */ }
        }
      }
      const jsonMatch = fullText.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]) as Array<{ type: string; text: string; blooms: string; difficulty: string; followUps: string[] }>
        const validTypes = new Set(['socratic', 'think-pair-share', 'debate', 'fishbowl', 'four-corners', 'philosophical'])
        const validBlooms = new Set(['remember', 'understand', 'apply', 'analyze', 'evaluate', 'create'])
        const generated: DiscussionPrompt[] = parsed.map((p, i) => ({
          id: `gen-${i}-${Date.now()}`,
          type: (validTypes.has(p.type) ? p.type : 'socratic') as PromptType,
          text: p.text,
          blooms: (validBlooms.has(p.blooms) ? p.blooms : 'analyze') as BloomsLevel,
          difficulty: (['easy', 'medium', 'hard'].includes(p.difficulty) ? p.difficulty : 'medium') as 'easy' | 'medium' | 'hard',
          followUps: Array.isArray(p.followUps) ? p.followUps : [],
          starred: false,
          usedCount: 0,
        }))
        setPrompts(generated)
        setExpandedId(generated[0]?.id ?? null)
        showToast(`${generated.length} discussion prompts generated for "${topic}"`)
      } else {
        showToast('Prompts generated!')
      }
    } catch {
      showToast('Generation failed — check connection')
    } finally {
      setGenerating(false)
    }
  }

  function addCustomPrompt() {
    if (!newPrompt.text.trim()) return
    const p: DiscussionPrompt = {
      id: `custom-${Date.now()}`,
      text: newPrompt.text,
      type: newPrompt.type,
      blooms: newPrompt.blooms,
      followUps: newPrompt.followUp ? [newPrompt.followUp] : [],
      usedCount: 0,
      difficulty: 'medium',
    }
    setPrompts(prev => [p, ...prev])
    setNewPromptOpen(false)
    setNewPrompt({ text: '', type: 'socratic', blooms: 'analyze', followUp: '' })
  }

  const filtered = prompts.filter(p => {
    if (filterType !== 'all' && p.type !== filterType) return false
    if (filterBlooms !== 'all' && p.blooms !== filterBlooms) return false
    if (starredOnly && !p.starred) return false
    return true
  })

  const slidePrompts = filtered.length > 0 ? filtered : prompts
  const currentSlide = slidePrompts[slideIndex] ?? slidePrompts[0]
  const timerPct = (timerSecs / (timerPreset * 60)) * 100
  const timerMins = Math.floor(timerSecs / 60)
  const timerRemSecs = timerSecs % 60

  return (
    <div className="space-y-6">
      {/* Header */}
      <FadeUp>
        <div className="hero-mesh rounded-3xl p-6 border border-white/[0.06]">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg,#6366f1,#ec4899)' }}>
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-black text-white tracking-tight">Discussion Prompts</h1>
                  <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full font-bold border border-indigo-500/20">AI-Powered</span>
                </div>
                <p className="text-sm text-surface-400">AI-generated Bloom&apos;s-aligned prompts for deeper classroom thinking</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => { setSlideMode(true); setSlideIndex(0) }} className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1.5">
                <Maximize2 className="w-3.5 h-3.5" /> Present
              </button>
              <button className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1.5" onClick={() => { setShareOpen(true) }}>
                <Share2 className="w-3.5 h-3.5" /> Share
              </button>
              <button className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1.5" onClick={() => showToast('Prompts exported!')}>
                <Download className="w-3.5 h-3.5" /> Export
              </button>
              <motion.button onClick={handleGenerate} disabled={generating || !topic.trim()} className="btn-gradient text-xs px-4 py-1.5 disabled:opacity-50" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                {generating
                  ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" />Generating…</>
                  : <><Sparkles className="w-3.5 h-3.5" />Generate</>}
              </motion.button>
            </div>
          </div>
          <div className="border-t border-white/[0.06] pt-4 flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold">Prompts</span>
              <span className="text-xs font-bold text-white">{prompts.length}</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold">Filtered</span>
              <span className="text-xs font-bold text-white">{filtered.length}</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold">Types Selected</span>
              <span className="text-xs font-bold text-indigo-400">{selectedTypes.length}</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold">Subject</span>
              <span className="text-xs font-bold text-white">{subject || 'General'}</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold">Timer</span>
              <span className="text-xs font-bold text-white">{timerPreset}min</span>
            </div>
          </div>
        </div>
      </FadeUp>

      {/* AI Insights Panel */}
      <FadeUp delay={0.04}>
        <div className="glass-card overflow-hidden">
          <button
            className="w-full flex items-center justify-between px-5 py-4"
            onClick={() => setAiOpen(p => !p)}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent-400" />
              <span className="text-sm font-semibold text-white">AI Teaching Insights</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-surface-400 transition-transform ${aiOpen ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {aiOpen && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-5 space-y-2 border-t border-white/[0.06] pt-4">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-accent-400/[0.08] border border-accent-400/15">
                    <Brain className="w-4 h-4 text-accent-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-accent-300">Bloom's Balance Check</p>
                      <p className="text-[11px] text-surface-400 mt-0.5">Your current set skews toward <strong className="text-white">Evaluate</strong> (4 prompts). Consider adding a <strong className="text-white">Remember</strong> or <strong className="text-white">Apply</strong> prompt to scaffold lower-order thinking first.</p>
                    </div>
                    <button className="text-[10px] font-semibold text-accent-400 hover:text-accent-300 whitespace-nowrap">Auto-Add →</button>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-success-400/[0.08] border border-success-400/15">
                    <TrendingUp className="w-4 h-4 text-success-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-success-300">High-Engagement Prompts</p>
                      <p className="text-[11px] text-surface-400 mt-0.5">Think-Pair-Share prompts in your library average 11 uses — 2× more than other types. Add 2 more for this unit to maximize participation rates.</p>
                    </div>
                    <button className="text-[10px] font-semibold text-success-400 hover:text-success-300 whitespace-nowrap">Generate →</button>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-warning-400/[0.08] border border-warning-400/15">
                    <Zap className="w-4 h-4 text-warning-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-warning-300">Tip: Open with a Hook Prompt</p>
                      <p className="text-[11px] text-surface-400 mt-0.5">Research shows starting with a provocative debate starter increases initial participation by up to 40%. Try prompt #4 ("Without photosynthesis…") as your opener.</p>
                    </div>
                    <button className="text-[10px] font-semibold text-warning-400 hover:text-warning-300 whitespace-nowrap">Pin →</button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </FadeUp>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Sidebar */}
        <div className="xl:col-span-1 space-y-4">

          {/* Generator Config */}
          <FadeUp delay={0.06}>
            <div className="glass-card p-4 space-y-3">
              <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Generate New Set</p>
              <div>
                <label className="text-[11px] text-surface-500 block mb-1">Topic / Text / Unit</label>
                <textarea
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white/[0.04] border border-white/[0.08] text-surface-200 placeholder:text-surface-600 focus:outline-none focus:border-accent-500/40 resize-none"
                  placeholder="e.g. Photosynthesis, To Kill a Mockingbird Ch. 12…"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-surface-500 block mb-1">Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-white/[0.04] border border-white/[0.08] text-surface-200 focus:outline-none focus:border-accent-500/40"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-surface-500 block mb-1">Grade Level</label>
                  <select
                    value={gradeLevel}
                    onChange={e => setGradeLevel(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-white/[0.04] border border-white/[0.08] text-surface-200 focus:outline-none focus:border-accent-500/40"
                  >
                    {['K-2', '3-5', '6-8', '9-12', 'College'].map(g => <option key={g} value={g}>{g === 'College' ? g : `Grade ${g}`}</option>)}
                  </select>
                </div>
              </div>
              <motion.button
                onClick={handleGenerate}
                disabled={generating || !topic.trim()}
                className="w-full btn-gradient text-xs py-2 disabled:opacity-50"
                whileTap={{ scale: 0.97 }}
              >
                {generating
                  ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" />Generating…</>
                  : <><Sparkles className="w-3.5 h-3.5" />Generate Prompts</>}
              </motion.button>
            </div>
          </FadeUp>

          {/* Discussion Strategies */}
          <FadeUp delay={0.1}>
            <div className="glass-card p-4">
              <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Discussion Strategies</p>
              <div className="space-y-1.5">
                {(Object.entries(promptTypeConfig) as [PromptType, PromptTypeConfig][]).map(([key, cfg]) => (
                  <button
                    key={key}
                    onClick={() => toggleType(key)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-all text-left ${
                      selectedTypes.includes(key)
                        ? 'border-white/[0.06] bg-white/[0.05]'
                        : 'border-transparent opacity-50 hover:opacity-75'
                    }`}
                    style={selectedTypes.includes(key) ? { borderColor: cfg.color + '30' } : {}}
                  >
                    <div
                      className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-all border"
                      style={
                        selectedTypes.includes(key)
                          ? { background: cfg.color, borderColor: cfg.color }
                          : { borderColor: 'rgba(255,255,255,0.2)', background: 'transparent' }
                      }
                    >
                      {selectedTypes.includes(key) && <Check className="w-2.5 h-2.5 text-white" />}
                    </div>
                    <span className="text-lg">{cfg.icon}</span>
                    <span className="text-xs font-medium text-surface-200 truncate">{cfg.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </FadeUp>

          {/* Bloom's Taxonomy Ladder */}
          <FadeUp delay={0.14}>
            <div className="glass-card p-4">
              <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                Bloom&apos;s Taxonomy
              </p>
              <div className="space-y-1.5">
                {(Object.entries(bloomsConfig) as [BloomsLevel, { label: string; color: string; order: number }][])
                  .sort((a, b) => b[1].order - a[1].order)
                  .map(([key, cfg]) => {
                    const count = prompts.filter(p => p.blooms === key).length
                    return (
                      <button
                        key={key}
                        onClick={() => setFilterBlooms(filterBlooms === key ? 'all' : key)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all text-left ${
                          filterBlooms === key ? 'bg-white/[0.07]' : 'hover:bg-white/[0.03]'
                        }`}
                      >
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: cfg.color }} />
                        <span className="text-xs font-medium text-surface-200 flex-1">{cfg.label}</span>
                        <span className="text-[10px] text-surface-500 font-medium">{count}</span>
                        <div className="w-12 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                          <div className="h-full rounded-full transition-all" style={{ background: cfg.color, width: `${(count / prompts.length) * 100}%` }} />
                        </div>
                      </button>
                    )
                  })}
              </div>
              {filterBlooms !== 'all' && (
                <button
                  onClick={() => setFilterBlooms('all')}
                  className="mt-2 w-full text-[11px] text-surface-500 hover:text-surface-300 transition-colors"
                >
                  Clear filter ×
                </button>
              )}
            </div>
          </FadeUp>

          {/* Class Timer */}
          <FadeUp delay={0.18}>
            <div className="glass-card p-4">
              <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Discussion Timer
              </p>
              <div className="flex items-center justify-center mb-3">
                <div className="relative w-24 h-24">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                    <motion.circle
                      cx="50" cy="50" r="40" fill="none"
                      stroke={timerSecs <= 30 ? '#ef4444' : '#6366f1'}
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      animate={{ strokeDashoffset: `${2 * Math.PI * 40 * (1 - timerPct / 100)}` }}
                      transition={{ duration: 0.5 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-lg font-black ${timerSecs <= 30 ? 'text-danger-400' : 'text-white'}`}>
                      {timerMins}:{timerRemSecs.toString().padStart(2, '0')}
                    </span>
                    <span className="text-[9px] text-surface-500">
                      {timerRunning ? 'running' : timerSecs === 0 ? 'done' : 'paused'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 mb-3">
                <button
                  onClick={() => setTimerRunning(r => !r)}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-accent-500/20 text-accent-300 text-xs font-semibold hover:bg-accent-500/30 transition-all"
                >
                  {timerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  {timerRunning ? 'Pause' : 'Start'}
                </button>
                <button
                  onClick={() => resetTimer(timerPreset)}
                  className="px-3 py-1.5 rounded-xl bg-white/[0.04] text-surface-400 text-xs hover:bg-white/[0.08] transition-all"
                >
                  Reset
                </button>
              </div>
              <div className="flex items-center gap-1 justify-center flex-wrap">
                {TIMER_PRESETS.map(min => (
                  <button
                    key={min}
                    onClick={() => resetTimer(min)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-medium transition-all ${
                      timerPreset === min ? 'bg-accent-500/20 text-accent-300' : 'text-surface-500 hover:text-surface-300'
                    }`}
                  >
                    {min}m
                  </button>
                ))}
              </div>
            </div>
          </FadeUp>

          {/* Bloom's Distribution */}
          <FadeUp delay={0.20}>
            <div className="glass-card p-4">
              <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Bloom&apos;s Level Distribution</p>
              {(() => {
                const levels = Object.entries(bloomsConfig).sort((a, b) => a[1].order - b[1].order) as [BloomsLevel, typeof bloomsConfig[BloomsLevel]][]
                const counts = levels.map(([lv, cfg]) => ({ label: cfg.label, color: cfg.color, count: prompts.filter(p => p.blooms === lv).length }))
                const maxC = Math.max(...counts.map(x => x.count), 1)
                const W = 220, ROW = 15, GAP = 4, LW = 62, CW = 16, BAR_MAX = W - LW - CW - 6
                const H = counts.length * (ROW + GAP)
                return (
                  <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: H }}>
                    <defs>
                      {counts.map((x, i) => (
                        <linearGradient key={i} id={`dp-blooms-${i}`} x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor={x.color} stopOpacity="0.9" />
                          <stop offset="100%" stopColor={x.color} stopOpacity="0.35" />
                        </linearGradient>
                      ))}
                    </defs>
                    {counts.map((x, i) => {
                      const y = i * (ROW + GAP)
                      const bw = (x.count / maxC) * BAR_MAX
                      return (
                        <g key={x.label}>
                          <text x={LW - 4} y={y + ROW - 3} textAnchor="end" fill="rgba(255,255,255,0.4)" fontSize="9">{x.label}</text>
                          <rect x={LW} y={y + 1} width={BAR_MAX} height={ROW - 3} rx="2" fill="rgba(255,255,255,0.04)" />
                          <motion.rect x={LW} y={y + 1} width={bw} height={ROW - 3} rx="2" fill={`url(#dp-blooms-${i})`}
                            initial={{ width: 0 }} animate={{ width: bw }} transition={{ delay: 0.08 + i * 0.06, duration: 0.5, ease: 'easeOut' }} />
                          <text x={W} y={y + ROW - 3} textAnchor="end" fill={x.color} fontSize="9" fontWeight="700">{x.count}</text>
                        </g>
                      )
                    })}
                  </svg>
                )
              })()}
            </div>
          </FadeUp>

          {/* Recent Sets */}
          <FadeUp delay={0.22}>
            <div className="glass-card p-4">
              <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Recent Sets</p>
              <div className="space-y-2">
                {recentSets.map(s => (
                  <div key={s.title} className="flex items-start gap-2.5 py-2 border-b border-white/[0.04] last:border-0">
                    <div className="w-1.5 h-10 rounded-full flex-shrink-0 mt-0.5" style={{ background: s.color }} />
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

        {/* Main Prompt List */}
        <div className="xl:col-span-2 space-y-4">

          {/* Filter Bar */}
          <FadeUp delay={0.08}>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setStarredOnly(p => !p)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                  starredOnly
                    ? 'bg-warning-500/20 text-warning-300 border-warning-500/30'
                    : 'border-white/[0.06] text-surface-400 hover:text-surface-200'
                }`}
              >
                <Star className="w-3.5 h-3.5" />
                Starred
              </button>
              <div className="flex items-center gap-1 flex-wrap">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                    filterType === 'all' ? 'bg-white/[0.08] text-white' : 'text-surface-500 hover:text-surface-300'
                  }`}
                >
                  All Types
                </button>
                {(Object.entries(promptTypeConfig) as [PromptType, PromptTypeConfig][]).slice(0, 4).map(([key, cfg]) => (
                  <button
                    key={key}
                    onClick={() => setFilterType(filterType === key ? 'all' : key)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all`}
                    style={filterType === key ? { background: cfg.color + '30', color: cfg.color } : { color: 'rgb(var(--surface-500))' }}
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
              const bc  = bloomsConfig[prompt.blooms]
              const dc  = prompt.difficulty ? difficultyConfig[prompt.difficulty] : null
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
                      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: ptc.color + '22', color: ptc.color }}>
                          {ptc.label}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: bc.color + '22', color: bc.color }}>
                          {bc.label}
                        </span>
                        {dc && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: dc.color + '22', color: dc.color }}>
                            {dc.label}
                          </span>
                        )}
                        {typeof prompt.usedCount === 'number' && (
                          <span className="text-[10px] text-surface-600">
                            Used {prompt.usedCount}×
                          </span>
                        )}
                        {prompt.followUps.length > 0 && (
                          <span className="text-[10px] text-surface-600">{prompt.followUps.length} follow-ups</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5 flex-shrink-0">
                      <button
                        onClick={() => toggleStar(prompt.id)}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                          prompt.starred ? 'text-warning-400' : 'text-surface-600 hover:text-surface-300'
                        }`}
                      >
                        <Star className={`w-4 h-4 ${prompt.starred ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={() => handleCopy(prompt)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-surface-500 hover:text-surface-200 transition-colors"
                      >
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
                        <div className="flex items-center gap-2 mt-3 pt-2 border-t border-white/[0.04]">
                          <button className="flex items-center gap-1 text-[10px] text-surface-500 hover:text-surface-300 transition-colors" onClick={() => showToast('Follow-ups added to slide deck')}>
                            <Target className="w-3 h-3" /> Add to Slide Deck
                          </button>
                          <button className="flex items-center gap-1 text-[10px] text-surface-500 hover:text-surface-300 transition-colors" onClick={() => { navigator.clipboard?.writeText(prompt.followUps?.join('\n') ?? '').catch(() => {}); showToast('Follow-ups copied') }}>
                            <Copy className="w-3 h-3" /> Copy All
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>

          {/* Add Prompt Button */}
          <FadeUp delay={0.3}>
            <button
              onClick={() => setNewPromptOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-white/[0.08] text-xs text-surface-500 hover:border-accent-500/30 hover:text-accent-400 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Custom Prompt
            </button>
          </FadeUp>
        </div>
      </div>

      {/* Presentation / Slide Mode Overlay */}
      <AnimatePresence>
        {slideMode && currentSlide && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center p-8"
            style={{ background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              onClick={() => setSlideMode(false)}
              className="absolute top-6 right-6 w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center text-surface-400 hover:text-white hover:bg-white/[0.10] transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-full max-w-3xl">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-4xl">{promptTypeConfig[currentSlide.type].icon}</span>
                  <span className="text-sm font-semibold px-3 py-1 rounded-full" style={{ background: promptTypeConfig[currentSlide.type].color + '22', color: promptTypeConfig[currentSlide.type].color }}>
                    {promptTypeConfig[currentSlide.type].label}
                  </span>
                </div>
                <motion.p
                  key={currentSlide.id}
                  className="text-2xl md:text-3xl font-bold text-white leading-relaxed text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  &ldquo;{currentSlide.text}&rdquo;
                </motion.p>
              </div>

              <div className="flex items-center justify-center gap-4 mt-8">
                <button
                  onClick={() => setSlideIndex(i => Math.max(0, i - 1))}
                  disabled={slideIndex === 0}
                  className="p-3 rounded-xl bg-white/[0.06] text-surface-400 hover:text-white hover:bg-white/[0.10] transition-all disabled:opacity-30"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm text-surface-500 min-w-[80px] text-center">
                  {slideIndex + 1} / {slidePrompts.length}
                </span>
                <button
                  onClick={() => setSlideIndex(i => Math.min(slidePrompts.length - 1, i + 1))}
                  disabled={slideIndex === slidePrompts.length - 1}
                  className="p-3 rounded-xl bg-white/[0.06] text-surface-400 hover:text-white hover:bg-white/[0.10] transition-all disabled:opacity-30"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Prompt Modal */}
      <AnimatePresence>
        {newPromptOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setNewPromptOpen(false)} />
            <motion.div
              className="relative glass-card p-6 w-full max-w-lg z-10"
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white">Add Custom Prompt</h3>
                <button onClick={() => setNewPromptOpen(false)} className="text-surface-500 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] text-surface-500 block mb-1">Prompt Text</label>
                  <textarea
                    value={newPrompt.text}
                    onChange={e => setNewPrompt(p => ({ ...p, text: e.target.value }))}
                    rows={3}
                    placeholder="Enter your discussion prompt…"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white/[0.04] border border-white/[0.08] text-surface-200 placeholder:text-surface-600 focus:outline-none focus:border-accent-500/40 resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-surface-500 block mb-1">Strategy</label>
                    <select
                      value={newPrompt.type}
                      onChange={e => setNewPrompt(p => ({ ...p, type: e.target.value as PromptType }))}
                      className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-white/[0.04] border border-white/[0.08] text-surface-200 focus:outline-none focus:border-accent-500/40"
                    >
                      {Object.entries(promptTypeConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-surface-500 block mb-1">Bloom&apos;s Level</label>
                    <select
                      value={newPrompt.blooms}
                      onChange={e => setNewPrompt(p => ({ ...p, blooms: e.target.value as BloomsLevel }))}
                      className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-white/[0.04] border border-white/[0.08] text-surface-200 focus:outline-none focus:border-accent-500/40"
                    >
                      {Object.entries(bloomsConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[11px] text-surface-500 block mb-1">Follow-Up Question (optional)</label>
                  <input
                    type="text"
                    value={newPrompt.followUp}
                    onChange={e => setNewPrompt(p => ({ ...p, followUp: e.target.value }))}
                    placeholder="Add a follow-up question…"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white/[0.04] border border-white/[0.08] text-surface-200 placeholder:text-surface-600 focus:outline-none focus:border-accent-500/40"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button onClick={() => setNewPromptOpen(false)} className="btn-secondary text-xs px-4 py-2">Cancel</button>
                <button
                  onClick={addCustomPrompt}
                  disabled={!newPrompt.text.trim()}
                  className="btn-gradient text-xs px-4 py-2 disabled:opacity-50"
                >
                  Add Prompt
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <AnimatePresence>
        {shareOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShareOpen(false)} />
            <motion.div
              className="relative glass-card p-6 w-full max-w-sm z-10"
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white">Share Prompt Set</h3>
                <button onClick={() => setShareOpen(false)} className="text-surface-500 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2">
                {[
                  { label: 'Copy Link',              emoji: '🔗', desc: 'Share a read-only link',   toast: 'Link copied to clipboard' },
                  { label: 'Email to Team',           emoji: '📧', desc: 'Send to colleagues',        toast: 'Email sent to team' },
                  { label: 'Export as PDF',           emoji: '📄', desc: 'Student-ready handout',     toast: 'Exported as PDF' },
                  { label: 'Post to Google Classroom',emoji: '🏫', desc: 'Push to active class',      toast: 'Posted to Google Classroom' },
                ].map(opt => (
                  <button
                    key={opt.label}
                    onClick={() => { showToast(opt.toast); setShareOpen(false) }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] transition-all text-left"
                  >
                    <span className="text-xl">{opt.emoji}</span>
                    <div>
                      <div className="text-xs font-medium text-surface-200">{opt.label}</div>
                      <div className="text-[10px] text-surface-500">{opt.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
