'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FadeUp } from '@/components/ui/motion'
import {
  Type, Sparkles, RefreshCw, Copy, Check, ChevronDown, ArrowRight,
  BookOpen, TrendingUp, TrendingDown, Minus, BarChart2, Info,
  Download, Wand2, AlertCircle, Brain, Lightbulb
} from 'lucide-react'

type ReadingLevel = 'K-2' | '3-5' | '6-8' | '9-12' | 'College'
type Audience = 'students' | 'parents' | 'peers'
type Mode = 'simplify' | 'elevate' | 'translate'

interface LevelConfig {
  label: string
  lexile: string
  grade: string
  color: string
  description: string
}

const levelConfig: Record<ReadingLevel, LevelConfig> = {
  'K-2':    { label: 'K–2',    lexile: 'BR–450L',  grade: 'Kindergarten–2nd',  color: '#10b981', description: 'Simple words, short sentences, concrete ideas' },
  '3-5':    { label: '3–5',    lexile: '450–800L',  grade: '3rd–5th grade',    color: '#22d3ee', description: 'Developing vocabulary, compound sentences' },
  '6-8':    { label: '6–8',    lexile: '800–1050L', grade: '6th–8th grade',    color: '#6366f1', description: 'Academic vocabulary, multi-clause sentences' },
  '9-12':   { label: '9–12',   lexile: '1050–1335L',grade: '9th–12th grade',   color: '#8b5cf6', description: 'Complex ideas, domain-specific language' },
  'College':{ label: 'College',lexile: '1335L+',    grade: 'Higher education', color: '#f59e0b', description: 'Advanced discourse, technical terminology' },
}

const SAMPLE_TEXT = `Photosynthesis is the process by which plants, algae, and some bacteria convert light energy, usually from the sun, into chemical energy that can be later used to fuel the organism's activities. Carbon dioxide and water are consumed while oxygen and energy-rich organic compounds are produced. This process occurs primarily in the chloroplasts, specifically using a green pigment called chlorophyll.`

const SIMPLIFIED_TEXT = `Photosynthesis is how plants make their own food. Plants use sunlight to turn water and air into sugar. This sugar gives the plant energy to grow. The green part of the plant, called chlorophyll, helps catch the sunlight. When plants make food, they also release oxygen, which is the air we breathe!`

const ELEVATED_TEXT = `Photosynthesis constitutes a fundamental biochemical process wherein photoautotrophic organisms—principally vascular plants, algae, and cyanobacteria—transduce electromagnetic radiation into the thermodynamic free energy stored in organic molecules. This endergonic metabolic pathway proceeds through two principal stages: the light-dependent reactions occurring within the thylakoid membranes, and the Calvin-Benson cycle transpiring in the stroma, collectively converting CO₂ and H₂O into glucose while liberating molecular oxygen as a metabolic byproduct.`

const readingStats = (text: string) => {
  const words = text.split(/\s+/).length
  const sentences = text.split(/[.!?]+/).filter(Boolean).length
  const avgWordLen = Math.round(text.replace(/\s/g, '').length / words)
  const avgSentLen = Math.round(words / sentences)
  return { words, sentences, avgWordLen, avgSentLen }
}

export default function TextLevelerPage() {
  const [inputText, setInputText] = useState(SAMPLE_TEXT)
  const [targetLevel, setTargetLevel] = useState<ReadingLevel>('3-5')
  const [originalLevel, setOriginalLevel] = useState<ReadingLevel>('9-12')
  const [mode, setMode] = useState<Mode>('simplify')
  const [audience, setAudience] = useState<Audience>('students')
  const [generating, setGenerating] = useState(false)
  const [outputText, setOutputText] = useState(SIMPLIFIED_TEXT)
  const [copied, setCopied] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [preserveVocab, setPreserveVocab] = useState(true)
  const [addDefinitions, setAddDefinitions] = useState(false)
  const [keepSentenceCount, setKeepSentenceCount] = useState(false)

  const inputStats = readingStats(inputText)
  const outputStats = readingStats(outputText)
  const targetConfig = levelConfig[targetLevel]
  const originalConfig = levelConfig[originalLevel]

  async function handleGenerate() {
    setGenerating(true)
    await new Promise(r => setTimeout(r, 2200))
    if (targetLevel === 'College') setOutputText(ELEVATED_TEXT)
    else if (targetLevel === 'K-2' || targetLevel === '3-5') setOutputText(SIMPLIFIED_TEXT)
    else setOutputText(outputText)
    setGenerating(false)
  }

  function handleCopy() {
    navigator.clipboard.writeText(outputText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const levelDiff = (['K-2', '3-5', '6-8', '9-12', 'College'] as ReadingLevel[]).indexOf(targetLevel) -
                    (['K-2', '3-5', '6-8', '9-12', 'College'] as ReadingLevel[]).indexOf(originalLevel)

  return (
    <div className="p-6 space-y-6 max-w-[1600px]">
      {/* Header */}
      <FadeUp>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}>
              <Type className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-surface-100">Text Leveler</h1>
              <p className="text-sm text-surface-500">AI adjusts reading complexity for any audience or grade level</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleGenerate} disabled={generating || !inputText.trim()} className="btn-gradient text-sm px-4 py-2 disabled:opacity-50">
              {generating
                ? <><RefreshCw className="w-4 h-4 animate-spin" />Leveling…</>
                : <><Wand2 className="w-4 h-4" />Level Text</>
              }
            </button>
          </div>
        </div>
      </FadeUp>

      {/* Mode + Audience Row */}
      <FadeUp delay={0.05}>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            {([
              { id: 'simplify', label: 'Simplify', icon: TrendingDown },
              { id: 'elevate',  label: 'Elevate',  icon: TrendingUp },
              { id: 'translate',label: 'Translate', icon: ArrowRight },
            ] as const).map(m => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${mode === m.id ? 'bg-accent-500/20 text-accent-300' : 'text-surface-400 hover:text-surface-200'}`}
              >
                <m.icon className="w-3.5 h-3.5" />
                {m.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-surface-500">For:</span>
            {(['students', 'parents', 'peers'] as Audience[]).map(a => (
              <button
                key={a}
                onClick={() => setAudience(a)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all capitalize ${audience === a ? 'bg-white/[0.08] text-white' : 'text-surface-400 hover:text-surface-200 hover:bg-white/[0.04]'}`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>
      </FadeUp>

      {/* Level Selector */}
      <FadeUp delay={0.08}>
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
            <div className="flex-1">
              <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">Original Level</p>
              <div className="flex gap-2 flex-wrap">
                {(Object.keys(levelConfig) as ReadingLevel[]).map(lv => {
                  const cfg = levelConfig[lv]
                  const isSelected = originalLevel === lv
                  return (
                    <button
                      key={lv}
                      onClick={() => setOriginalLevel(lv)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${isSelected ? 'border-transparent text-white' : 'border-white/[0.06] text-surface-400 hover:text-surface-200'}`}
                      style={isSelected ? { background: cfg.color + '30', color: cfg.color, borderColor: cfg.color + '50' } : {}}
                    >
                      {cfg.label}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="flex items-center gap-2 text-surface-500">
              <ArrowRight className="w-5 h-5" />
            </div>

            <div className="flex-1">
              <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">Target Level</p>
              <div className="flex gap-2 flex-wrap">
                {(Object.keys(levelConfig) as ReadingLevel[]).map(lv => {
                  const cfg = levelConfig[lv]
                  const isSelected = targetLevel === lv
                  return (
                    <button
                      key={lv}
                      onClick={() => setTargetLevel(lv)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${isSelected ? 'border-transparent text-white' : 'border-white/[0.06] text-surface-400 hover:text-surface-200'}`}
                      style={isSelected ? { background: cfg.color + '30', color: cfg.color, borderColor: cfg.color + '50' } : {}}
                    >
                      {cfg.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Level description */}
          <div className="flex items-center gap-3 text-xs text-surface-400">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: originalConfig.color }} />
              <span className="font-medium" style={{ color: originalConfig.color }}>{originalConfig.lexile}</span>
              <span>({originalConfig.grade})</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-surface-600" />
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: targetConfig.color }} />
              <span className="font-medium" style={{ color: targetConfig.color }}>{targetConfig.lexile}</span>
              <span>({targetConfig.grade})</span>
            </div>
            <div className={`ml-auto flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full ${levelDiff < 0 ? 'bg-success-500/10 text-success-400' : levelDiff > 0 ? 'bg-warning-500/10 text-warning-400' : 'bg-white/[0.04] text-surface-500'}`}>
              {levelDiff < 0 ? <TrendingDown className="w-3 h-3" /> : levelDiff > 0 ? <TrendingUp className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
              {levelDiff < 0 ? `${Math.abs(levelDiff)} levels down` : levelDiff > 0 ? `${levelDiff} levels up` : 'Same level'}
            </div>
          </div>
        </div>
      </FadeUp>

      {/* Main Editor */}
      <FadeUp delay={0.12}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-surface-200">Original Text</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full border text-surface-500 border-white/[0.06]">{inputStats.words} words</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-surface-500">
                <span>~{originalConfig.lexile}</span>
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: originalConfig.color }} />
              </div>
            </div>
            <div className="relative">
              <textarea
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                rows={12}
                className="w-full px-4 py-3.5 text-sm rounded-2xl bg-white/[0.04] border border-white/[0.08] text-surface-200 placeholder:text-surface-600 focus:outline-none focus:border-accent-500/40 resize-none leading-relaxed"
                placeholder="Paste your text here to level it…"
              />
              <div className="absolute bottom-3 right-3 text-[10px] text-surface-600">{inputStats.words} words · {inputStats.sentences} sentences</div>
            </div>
            {/* Input stats */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Avg Word Length', value: `${inputStats.avgWordLen} chars` },
                { label: 'Avg Sentence', value: `${inputStats.avgSentLen} words` },
                { label: 'Sentences', value: inputStats.sentences },
              ].map(s => (
                <div key={s.label} className="rounded-xl bg-white/[0.03] border border-white/[0.05] px-3 py-2 text-center">
                  <div className="text-sm font-bold text-surface-200">{s.value}</div>
                  <div className="text-[10px] text-surface-600">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Output */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-surface-200">Leveled Text</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full border text-surface-500 border-white/[0.06]">{outputStats.words} words</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: targetConfig.color + '20', color: targetConfig.color }}>
                  Grade {targetConfig.label}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={handleCopy} className="flex items-center gap-1 text-[11px] text-surface-400 hover:text-surface-200 transition-colors">
                  {copied ? <><Check className="w-3 h-3 text-success-400" />Copied</> : <><Copy className="w-3 h-3" />Copy</>}
                </button>
              </div>
            </div>
            <div className="relative">
              <textarea
                value={outputText}
                onChange={e => setOutputText(e.target.value)}
                rows={12}
                className="w-full px-4 py-3.5 text-sm rounded-2xl bg-white/[0.04] border border-white/[0.08] text-surface-200 focus:outline-none focus:border-accent-500/40 resize-none leading-relaxed"
                style={{ borderColor: targetConfig.color + '30' }}
              />
              {generating && (
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-surface-900/80 backdrop-blur-sm">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 rounded-full border-2 border-accent-500/30 border-t-accent-400 animate-spin" />
                    <p className="text-sm text-surface-400">AI is leveling your text…</p>
                  </div>
                </div>
              )}
              <div className="absolute bottom-3 right-3 text-[10px] text-surface-600">{outputStats.words} words · {outputStats.sentences} sentences</div>
            </div>
            {/* Output stats */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Avg Word Length', value: `${outputStats.avgWordLen} chars`, orig: inputStats.avgWordLen, out: outputStats.avgWordLen },
                { label: 'Avg Sentence', value: `${outputStats.avgSentLen} words`, orig: inputStats.avgSentLen, out: outputStats.avgSentLen },
                { label: 'Sentences', value: outputStats.sentences, orig: inputStats.sentences, out: outputStats.sentences },
              ].map(s => {
                const diff = typeof s.orig === 'number' && typeof s.out === 'number' ? s.out - s.orig : 0
                return (
                  <div key={s.label} className="rounded-xl bg-white/[0.03] border border-white/[0.05] px-3 py-2 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-sm font-bold text-surface-200">{s.value}</span>
                      {diff !== 0 && (
                        <span className={`text-[9px] font-bold ${diff < 0 ? 'text-success-400' : 'text-warning-400'}`}>
                          {diff > 0 ? '+' : ''}{diff}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-surface-600">{s.label}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </FadeUp>

      {/* Advanced Options */}
      <FadeUp delay={0.18}>
        <div className="glass-card overflow-hidden">
          <button
            onClick={() => setShowAdvanced(p => !p)}
            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-surface-400 hover:text-surface-200 transition-colors"
          >
            <Brain className="w-4 h-4" />
            <span className="font-medium">Advanced Options</span>
            <ChevronDown className={`w-4 h-4 ml-auto transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {showAdvanced && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="border-t border-white/[0.06] px-4 py-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: 'preserveVocab', label: 'Preserve Key Vocabulary', desc: 'Keep domain-specific terms intact', value: preserveVocab, set: setPreserveVocab },
                    { id: 'addDefinitions', label: 'Inline Definitions', desc: 'Add brief definitions for hard words', value: addDefinitions, set: setAddDefinitions },
                    { id: 'keepSentenceCount', label: 'Match Sentence Count', desc: 'Keep the same number of sentences', value: keepSentenceCount, set: setKeepSentenceCount },
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => opt.set(v => !v)}
                      className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${opt.value ? 'border-accent-500/30 bg-accent-500/5' : 'border-white/[0.06] bg-white/[0.02]'}`}
                    >
                      <div className={`w-4 h-4 rounded-md border flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${opt.value ? 'bg-accent-500 border-accent-500' : 'border-white/[0.20]'}`}>
                        {opt.value && <Check className="w-2.5 h-2.5 text-white" />}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-surface-200">{opt.label}</p>
                        <p className="text-[11px] text-surface-500">{opt.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </FadeUp>

      {/* AI Tip + Batch */}
      <FadeUp delay={0.22}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-card p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent-600/5 to-transparent" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-warning-400" />
                <span className="text-sm font-semibold text-surface-200">Why Text Leveling Matters</span>
              </div>
              <p className="text-xs text-surface-400 leading-relaxed">Students with a wide range of reading abilities benefit when the same concept is presented at their level. Leveled texts increase comprehension, reduce anxiety, and support ELL students — without watering down the learning objectives.</p>
            </div>
          </div>

          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Download className="w-4 h-4 text-electric-400" />
              <span className="text-sm font-semibold text-surface-200">Export Options</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Side-by-Side PDF', desc: 'Both versions for differentiated instruction' },
                { label: 'Student Worksheet', desc: 'Formatted with reading questions' },
                { label: 'Google Docs', desc: 'Export directly to Drive' },
                { label: 'All Grade Levels', desc: 'Generate K-2 through 9-12 at once' },
              ].map(e => (
                <button key={e.label} className="btn-secondary text-xs px-2 py-2 flex flex-col items-start gap-0.5 text-left h-auto">
                  <span className="font-semibold">{e.label}</span>
                  <span className="text-surface-500 text-[10px] font-normal">{e.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </FadeUp>

      {/* Recent Leveled Texts */}
      <FadeUp delay={0.26}>
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-surface-200">Recently Leveled</h3>
            <button className="text-xs text-accent-400 hover:text-accent-300">View All →</button>
          </div>
          <div className="space-y-2">
            {[
              { title: 'Mitosis Lab Background Reading', from: '9–12', to: '6–8', words: 340, date: '2h ago', color: '#6366f1' },
              { title: 'American Revolution Primary Source',from: '9–12', to: '3–5', words: 520, date: 'Yesterday', color: '#f97316' },
              { title: 'Ecosystem Vocabulary Passage', from: '6–8', to: 'K–2', words: 210, date: '2 days ago', color: '#10b981' },
              { title: 'Research Methods Introduction', from: 'College', to: '9–12', words: 680, date: '3 days ago', color: '#8b5cf6' },
            ].map(item => (
              <div key={item.title} className="flex items-center gap-3 py-2 border-b border-white/[0.04] last:border-0">
                <div className="w-1 h-8 rounded-full flex-shrink-0" style={{ background: item.color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-surface-200 truncate">{item.title}</p>
                  <div className="flex items-center gap-2 text-[11px] text-surface-500 mt-0.5">
                    <span>Grade {item.from}</span>
                    <ArrowRight className="w-3 h-3" />
                    <span>Grade {item.to}</span>
                    <span>· {item.words} words</span>
                  </div>
                </div>
                <span className="text-[11px] text-surface-600">{item.date}</span>
              </div>
            ))}
          </div>
        </div>
      </FadeUp>
    </div>
  )
}
