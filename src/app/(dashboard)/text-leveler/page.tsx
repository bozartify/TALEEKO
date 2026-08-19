'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FadeUp, FadeInWhenVisible } from '@/components/ui/motion'
import {
  Type, Sparkles, RefreshCw, Copy, Check, ChevronDown, ArrowRight,
  BookOpen, TrendingUp, TrendingDown, Minus, BarChart2, Info,
  Download, Wand2, AlertCircle, Brain, Lightbulb, ChevronUp,
  Languages, X, FileText, Layers, BarChart3, Eye, Zap, Globe,
  CheckCircle, Users, Clock
} from 'lucide-react'

type ReadingLevel = 'K-2' | '3-5' | '6-8' | '9-12' | 'College'
type Audience = 'students' | 'parents' | 'peers' | 'admin'
type Mode = 'simplify' | 'elevate' | 'translate'
type OutputLanguage = 'English' | 'Spanish' | 'French' | 'Mandarin' | 'Arabic'

interface LevelConfig {
  label: string
  lexile: string
  grade: string
  color: string
  description: string
  fkGrade: number
}

const levelConfig: Record<ReadingLevel, LevelConfig> = {
  'K-2':    { label: 'K–2',     lexile: 'BR–450L',   grade: 'Kindergarten–2nd', color: '#10b981', description: 'Simple words, short sentences, concrete ideas', fkGrade: 1.5 },
  '3-5':    { label: '3–5',     lexile: '450–800L',  grade: '3rd–5th grade',   color: '#22d3ee', description: 'Developing vocabulary, compound sentences',      fkGrade: 4 },
  '6-8':    { label: '6–8',     lexile: '800–1050L', grade: '6th–8th grade',   color: '#6366f1', description: 'Academic vocabulary, multi-clause sentences',    fkGrade: 7 },
  '9-12':   { label: '9–12',    lexile: '1050–1335L',grade: '9th–12th grade',  color: '#8b5cf6', description: 'Complex ideas, domain-specific language',        fkGrade: 10.5 },
  'College':{ label: 'College', lexile: '1335L+',    grade: 'Higher education',color: '#f59e0b', description: 'Advanced discourse, technical terminology',       fkGrade: 14 },
}

const LEVELS = Object.keys(levelConfig) as ReadingLevel[]

const SAMPLE_TEXT = `Photosynthesis is the process by which plants, algae, and some bacteria convert light energy, usually from the sun, into chemical energy that can be later used to fuel the organism's activities. Carbon dioxide and water are consumed while oxygen and energy-rich organic compounds are produced. This process occurs primarily in the chloroplasts, specifically using a green pigment called chlorophyll.`

const TEXTS: Record<ReadingLevel, string> = {
  'K-2': `Plants make their own food using sunlight. They drink water through their roots. They breathe in air through tiny holes in their leaves. When sunlight hits the green parts of a plant, the plant uses the sunlight, water, and air to make sugar. This sugar is food for the plant. When the plant makes food, it also makes fresh air for us to breathe!`,
  '3-5': `Photosynthesis is how plants make their own food. Plants use sunlight to turn water and air into sugar. This sugar gives the plant energy to grow. The green part of the plant, called chlorophyll, helps catch the sunlight. When plants make food, they also release oxygen, which is the air we breathe!`,
  '6-8': SAMPLE_TEXT,
  '9-12': `Photosynthesis is a fundamental biological process in which photoautotrophs — primarily vascular plants, algae, and cyanobacteria — convert solar energy into chemical energy stored in glucose. Using carbon dioxide and water as reactants, the process occurs within chloroplasts and involves two interconnected stages: the light-dependent reactions and the Calvin cycle. Oxygen is released as a byproduct, making photosynthesis essential to Earth's atmospheric composition.`,
  'College': `Photosynthesis constitutes a fundamental biochemical process wherein photoautotrophic organisms—principally vascular plants, algae, and cyanobacteria—transduce electromagnetic radiation into the thermodynamic free energy stored in organic molecules. This endergonic metabolic pathway proceeds through two principal stages: the light-dependent reactions occurring within the thylakoid membranes, and the Calvin-Benson cycle transpiring in the stroma, collectively converting CO₂ and H₂O into glucose while liberating molecular oxygen as a metabolic byproduct.`,
}

const readingStats = (text: string) => {
  const words = text.trim().split(/\s+/).length
  const sentences = text.split(/[.!?]+/).filter(Boolean).length
  const avgWordLen = Math.round(text.replace(/\s/g, '').length / words)
  const avgSentLen = Math.round(words / sentences)
  return { words, sentences, avgWordLen, avgSentLen }
}

function fkScore(text: string) {
  const stats = readingStats(text)
  const score = 0.39 * stats.avgSentLen + 11.8 * (stats.avgWordLen / 1) - 15.59
  return Math.max(1, Math.min(18, Math.round(score * 10) / 10))
}

export default function TextLevelerPage() {
  const [inputText, setInputText] = useState(SAMPLE_TEXT)
  const [targetLevel, setTargetLevel] = useState<ReadingLevel>('3-5')
  const [originalLevel, setOriginalLevel] = useState<ReadingLevel>('6-8')
  const [mode, setMode] = useState<Mode>('simplify')
  const [audience, setAudience] = useState<Audience>('students')
  const [outputLanguage, setOutputLanguage] = useState<OutputLanguage>('English')
  const [generating, setGenerating] = useState(false)
  const [outputText, setOutputText] = useState('')
  const [copied, setCopied] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [preserveVocab, setPreserveVocab] = useState(true)
  const [addDefinitions, setAddDefinitions] = useState(false)
  const [keepSentenceCount, setKeepSentenceCount] = useState(false)
  const [aiOpen, setAiOpen] = useState(false)
  const [multiView, setMultiView] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const [toastMsg, setToastMsg] = useState('')

  const showToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 2500)
  }

  const inputStats = readingStats(inputText)
  const outputStats = readingStats(outputText)
  const targetConfig = levelConfig[targetLevel]
  const originalConfig = levelConfig[originalLevel]
  const levelDiff = LEVELS.indexOf(targetLevel) - LEVELS.indexOf(originalLevel)
  const inputFK = fkScore(inputText)
  const outputFK = fkScore(outputText)

  async function handleGenerate() {
    setGenerating(true)
    await new Promise(r => setTimeout(r, 2000))
    setOutputText(TEXTS[targetLevel])
    setGenerating(false)
    showToast(`Leveled to Grade ${targetConfig.label} — ${TEXTS[targetLevel].trim().split(/\s+/).length} words generated`)
  }

  function handleCopy() {
    navigator.clipboard.writeText(outputText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    showToast('Leveled text copied to clipboard')
  }

  return (
    <div className="space-y-6">
      {/* Hero */}
      <FadeUp>
        <div className="hero-mesh rounded-3xl p-6 border border-white/[0.06]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <motion.div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
                whileHover={{ rotate: 8, scale: 1.08 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <Type className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <h2 className="text-xl font-black text-white">Text Leveler</h2>
                <p className="text-xs text-surface-400">AI-powered reading level adapter · 5 grade bands · 5 languages · Differentiation in seconds</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                className="btn-gradient text-xs"
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => setMultiView(true)}
              >
                <Layers className="w-3.5 h-3.5" /> All Levels
              </motion.button>
              <button className="btn-secondary text-xs px-3 py-1.5" onClick={() => setExportOpen(true)}>
                <Download className="w-3.5 h-3.5" /> Export
              </button>
            </div>
          </div>
        </div>
      </FadeUp>

      {/* Stat cards */}
      <FadeUp delay={0.03}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Words Leveled', value: '4,812', icon: Type, color: '#6366f1', sub: 'This semester' },
            { label: 'ELL Adaptations', value: '34', icon: Globe, color: '#22d3ee', sub: 'Multi-language outputs' },
            { label: 'Grade Levels', value: 5, icon: Layers, color: '#10b981', sub: 'K–2 through College' },
            { label: 'Time Saved', value: '8.2 hrs', icon: Clock, color: '#f59e0b', sub: 'vs. manual leveling' },
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

      {/* Export Modal */}
      <AnimatePresence>
        {exportOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExportOpen(false)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              className="relative glass-card p-6 w-full max-w-md"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-bold text-white">Export Leveled Text</h3>
                <button onClick={() => setExportOpen(false)} className="p-1 rounded-lg hover:bg-white/[0.08] text-surface-400"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-2">
                {[
                  { label: 'Side-by-Side PDF', icon: FileText, desc: 'Original + leveled version for differentiated instruction' },
                  { label: 'Student Worksheet', icon: Layers, desc: 'Formatted with comprehension questions appended' },
                  { label: 'All Grade Levels', icon: BarChart3, desc: 'K-2 through College in one document (5 versions)' },
                  { label: 'Export to Google Docs', icon: FileText, desc: 'Open directly in Google Drive' },
                ].map(opt => (
                  <button key={opt.label} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.06] transition-colors text-left" onClick={() => { setExportOpen(false); showToast(`Exporting: ${opt.label}…`) }}>
                    <div className="w-9 h-9 rounded-xl bg-accent-500/10 flex items-center justify-center flex-shrink-0">
                      <opt.icon className="w-4 h-4 text-accent-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{opt.label}</p>
                      <p className="text-[10px] text-surface-400">{opt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Insights Panel */}
      <FadeUp delay={0.05}>
        <div className="glass-card overflow-hidden">
          <button
            className="w-full flex items-center justify-between p-4 hover:bg-white/[0.03] transition-colors"
            onClick={() => setAiOpen(o => !o)}
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <span className="text-sm font-bold text-white">AI Leveling Insights</span>
              <span className="bg-purple-500/20 text-purple-400 text-[10px] font-bold px-2 py-0.5 rounded-full">3 alerts</span>
            </div>
            {aiOpen ? <ChevronUp className="w-4 h-4 text-surface-400" /> : <ChevronDown className="w-4 h-4 text-surface-400" />}
          </button>
          <AnimatePresence>
            {aiOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-electric-500/[0.08] border border-electric-500/20">
                    <Languages className="w-4 h-4 text-electric-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-electric-300">ELL Opportunity</p>
                      <p className="text-[11px] text-surface-400 mt-0.5">4 students in your class are ELL learners (Patel, Garcia, Lee, Nguyen). Try generating a Spanish version of this passage alongside the K-2 English version.</p>
                      <button className="text-[10px] text-electric-400 font-semibold mt-1 hover:underline" onClick={() => { setOutputLanguage('Spanish'); setAiOpen(false); showToast('Language set to Spanish') }}>Enable Spanish →</button>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-warning-500/[0.08] border border-warning-500/20">
                    <AlertCircle className="w-4 h-4 text-warning-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-warning-300">Rigor Concern</p>
                      <p className="text-[11px] text-surface-400 mt-0.5">Simplifying this NGSS standard text by 3 levels may remove key scientific vocabulary required for the upcoming unit assessment. Consider using "Preserve Key Vocabulary" mode.</p>
                      <button className="text-[10px] text-warning-400 font-semibold mt-1 hover:underline" onClick={() => { setPreserveVocab(true); setShowAdvanced(true); setAiOpen(false); showToast('Preserve Key Vocabulary enabled') }}>Enable now →</button>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-success-500/[0.08] border border-success-500/20">
                    <TrendingUp className="w-4 h-4 text-success-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-success-300">Multi-Version Mode</p>
                      <p className="text-[11px] text-surface-400 mt-0.5">You have 3 ability groups in class. AI can generate all 5 reading levels at once, so you can distribute differentiated versions without extra steps.</p>
                      <button className="text-[10px] text-success-400 font-semibold mt-1 hover:underline" onClick={() => { setMultiView(true); setAiOpen(false); showToast('Showing all 5 grade levels') }}>Show all levels →</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </FadeUp>

      {/* Mode + Audience + Language Row */}
      <FadeUp delay={0.08}>
        <div className="flex flex-wrap items-center gap-3">
          {/* Mode */}
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
          {/* Audience */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-surface-500">For:</span>
            {(['students', 'parents', 'peers', 'admin'] as Audience[]).map(a => (
              <button
                key={a}
                onClick={() => setAudience(a)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all capitalize ${audience === a ? 'bg-white/[0.08] text-white' : 'text-surface-400 hover:text-surface-200 hover:bg-white/[0.04]'}`}
              >
                {a}
              </button>
            ))}
          </div>
          {/* Language */}
          <div className="flex items-center gap-2 ml-auto">
            <Globe className="w-3.5 h-3.5 text-surface-500" />
            <select
              value={outputLanguage}
              onChange={e => setOutputLanguage(e.target.value as OutputLanguage)}
              className="px-2 py-1.5 text-xs rounded-lg border border-white/[0.08] bg-white/[0.04] text-surface-300 focus:outline-none focus:ring-1 focus:ring-accent-500"
            >
              {(['English', 'Spanish', 'French', 'Mandarin', 'Arabic'] as OutputLanguage[]).map(l => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </div>
        </div>
      </FadeUp>

      {/* Level Selector */}
      <FadeUp delay={0.1}>
        <div className="glass-card p-5">
          <div className="flex items-center gap-4 flex-wrap mb-4">
            <div className="flex-1">
              <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">Original Level</p>
              <div className="flex gap-2 flex-wrap">
                {LEVELS.map(lv => {
                  const cfg = levelConfig[lv]
                  const isSel = originalLevel === lv
                  return (
                    <button key={lv} onClick={() => setOriginalLevel(lv)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${isSel ? 'text-white' : 'border-white/[0.06] text-surface-400 hover:text-surface-200'}`}
                      style={isSel ? { background: cfg.color + '30', color: cfg.color, borderColor: cfg.color + '50' } : {}}
                    >
                      {cfg.label}
                    </button>
                  )
                })}
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-surface-500 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">Target Level</p>
              <div className="flex gap-2 flex-wrap">
                {LEVELS.map(lv => {
                  const cfg = levelConfig[lv]
                  const isSel = targetLevel === lv
                  return (
                    <button key={lv} onClick={() => setTargetLevel(lv)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${isSel ? 'text-white' : 'border-white/[0.06] text-surface-400 hover:text-surface-200'}`}
                      style={isSel ? { background: cfg.color + '30', color: cfg.color, borderColor: cfg.color + '50' } : {}}
                    >
                      {cfg.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Readability Scale Track */}
          {(() => {
            const W = 560, trackH = 6, PX = 28
            const fkMin = 0, fkMax = 16
            const levelPts = LEVELS.map((lv, i) => ({
              lv,
              x: PX + ((levelConfig[lv].fkGrade - fkMin) / (fkMax - fkMin)) * (W - PX * 2),
              color: levelConfig[lv].color,
              label: levelConfig[lv].label,
            }))
            const origX = PX + ((inputFK - fkMin) / (fkMax - fkMin)) * (W - PX * 2)
            const targX = PX + ((outputFK - fkMin) / (fkMax - fkMin)) * (W - PX * 2)
            return (
              <div className="mt-4 pt-4 border-t border-white/[0.06]">
                <p className="text-[10px] text-surface-500 mb-3 uppercase tracking-wider font-semibold">Readability Track (Flesch-Kincaid)</p>
                <svg viewBox={`0 0 ${W} 52`} width="100%" className="overflow-visible" style={{ maxHeight: 60 }}>
                  <defs>
                    <linearGradient id="rl-grad" x1="0" y1="0" x2="1" y2="0">
                      {LEVELS.map((lv, i) => (
                        <stop key={lv} offset={`${(i / (LEVELS.length - 1)) * 100}%`} stopColor={levelConfig[lv].color} stopOpacity="0.8" />
                      ))}
                    </linearGradient>
                  </defs>
                  <rect x={PX} y={16} width={W - PX * 2} height={trackH} rx="3" fill="url(#rl-grad)" />
                  {levelPts.map(p => (
                    <g key={p.lv}>
                      <circle cx={p.x} cy={19} r="4" fill={p.color} />
                      <text x={p.x} y={34} textAnchor="middle" fontSize="8" fill={p.color}>{p.label}</text>
                    </g>
                  ))}
                  {/* Original marker */}
                  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                    <circle cx={origX} cy={19} r="6" fill="none" stroke={originalConfig.color} strokeWidth="2" />
                    <circle cx={origX} cy={19} r="3" fill={originalConfig.color} />
                    <text x={origX} y={10} textAnchor="middle" fontSize="7.5" fill={originalConfig.color} fontWeight="700">Original</text>
                  </motion.g>
                  {/* Target marker */}
                  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                    <circle cx={targX} cy={19} r="6" fill={targetConfig.color} opacity="0.9" />
                    <text x={targX} y={48} textAnchor="middle" fontSize="7.5" fill={targetConfig.color} fontWeight="700">Target</text>
                  </motion.g>
                </svg>
              </div>
            )
          })()}

          <div className="flex items-center gap-3 flex-wrap text-xs text-surface-400 mt-3">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: originalConfig.color }} />
              <span style={{ color: originalConfig.color }}>{originalConfig.lexile}</span>
              <span className="text-surface-500">({originalConfig.grade})</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-surface-600" />
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: targetConfig.color }} />
              <span style={{ color: targetConfig.color }}>{targetConfig.lexile}</span>
              <span className="text-surface-500">({targetConfig.grade})</span>
            </div>
            <span className="text-surface-600">·</span>
            <span className="text-surface-500 italic">{targetConfig.description}</span>
            <div className={`ml-auto flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full ${levelDiff < 0 ? 'bg-success-500/10 text-success-400' : levelDiff > 0 ? 'bg-warning-500/10 text-warning-400' : 'bg-white/[0.04] text-surface-500'}`}>
              {levelDiff < 0 ? <TrendingDown className="w-3 h-3" /> : levelDiff > 0 ? <TrendingUp className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
              {levelDiff < 0 ? `${Math.abs(levelDiff)} levels down` : levelDiff > 0 ? `${levelDiff} levels up` : 'Same level'}
            </div>
          </div>
        </div>
      </FadeUp>

      {/* Multi-View Toggle */}
      <AnimatePresence>
        {multiView && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <FadeInWhenVisible>
              <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-success-400" />
                    <h3 className="text-sm font-bold text-white">All 5 Reading Levels</h3>
                  </div>
                  <button onClick={() => setMultiView(false)} className="p-1 rounded-lg hover:bg-white/[0.08] text-surface-500 hover:text-surface-300">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  {LEVELS.map(lv => {
                    const cfg = levelConfig[lv]
                    const text = TEXTS[lv]
                    const stats = readingStats(text)
                    return (
                      <div key={lv} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: cfg.color }} />
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold" style={{ color: cfg.color }}>Grade {cfg.label}</span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] text-surface-500">{stats.words}w</span>
                            <button
                              className="p-1 rounded hover:bg-white/[0.08] text-surface-500 hover:text-surface-300 transition-colors"
                              onClick={() => { setTargetLevel(lv); setOutputText(text); setMultiView(false); showToast(`Switched to Grade ${cfg.label} version`) }}
                              title="Use this version"
                            >
                              <Eye className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-surface-400 leading-relaxed line-clamp-4">{text}</p>
                        <div className="flex items-center gap-2 mt-2 text-[9px] text-surface-600">
                          <span>{cfg.lexile}</span>
                          <span>·</span>
                          <span>FK {fkScore(text)}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </FadeInWhenVisible>
          </motion.div>
        )}
      </AnimatePresence>

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
                <span>FK {inputFK}</span>
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
              <div className="absolute bottom-3 right-3 text-[10px] text-surface-600">{inputStats.words}w · {inputStats.sentences}s</div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Avg Word Len', value: `${inputStats.avgWordLen} ch` },
                { label: 'Avg Sentence', value: `${inputStats.avgSentLen} w` },
                { label: 'FK Score', value: `${inputFK}` },
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
                <button onClick={() => setExportOpen(true)} className="flex items-center gap-1 text-[11px] text-surface-400 hover:text-surface-200 transition-colors">
                  <Download className="w-3 h-3" />Export
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
              <div className="absolute bottom-3 right-3 text-[10px] text-surface-600">{outputStats.words}w · {outputStats.sentences}s</div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Avg Word Len', value: `${outputStats.avgWordLen} ch`, orig: inputStats.avgWordLen, out: outputStats.avgWordLen },
                { label: 'Avg Sentence', value: `${outputStats.avgSentLen} w`, orig: inputStats.avgSentLen, out: outputStats.avgSentLen },
                { label: 'FK Score', value: `${outputFK}`, orig: inputFK, out: outputFK },
              ].map(s => {
                const diff = s.out - s.orig
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

      {/* Reading Level Comparison Bar Chart */}
      <FadeInWhenVisible delay={0.14}>
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-accent-400" />
              <h3 className="text-sm font-bold text-white">Text Complexity Comparison</h3>
            </div>
            <motion.button
              className="btn-gradient text-xs"
              onClick={handleGenerate}
              disabled={generating}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {generating
                ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" />Leveling…</>
                : <><Wand2 className="w-3.5 h-3.5" />Level Text</>
              }
            </motion.button>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {[
              { label: 'Word Count', orig: inputStats.words, out: outputStats.words, max: Math.max(inputStats.words, outputStats.words, 1) },
              { label: 'Avg Sentence Length', orig: inputStats.avgSentLen, out: outputStats.avgSentLen, max: Math.max(inputStats.avgSentLen, outputStats.avgSentLen, 1) },
              { label: 'Avg Word Length', orig: inputStats.avgWordLen, out: outputStats.avgWordLen, max: Math.max(inputStats.avgWordLen, outputStats.avgWordLen, 1) },
              { label: 'Flesch-Kincaid Grade', orig: inputFK, out: outputFK, max: Math.max(inputFK, outputFK, 1) },
            ].map((row, i) => (
              <div key={row.label} className="space-y-2">
                <div className="flex items-center justify-between text-[10px] text-surface-500">
                  <span>{row.label}</span>
                  <span className="text-surface-600">{row.orig} → {row.out}</span>
                </div>
                {(() => {
                  const W = 240, LW = 52, CW = 28, GAP = 5, ROW = 12, BAR_MAX = W - LW - CW - 6
                  const H = 2 * (ROW + GAP) - GAP
                  const bars = [
                    { label: 'Original', value: row.orig, color: originalConfig.color, id: `tl-orig-${i}` },
                    { label: 'Leveled', value: row.out, color: targetConfig.color, id: `tl-out-${i}` },
                  ]
                  return (
                    <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible">
                      <defs>
                        {bars.map(b => (
                          <linearGradient key={b.id} id={b.id} x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor={b.color} stopOpacity={0.9} />
                            <stop offset="100%" stopColor={b.color} stopOpacity={0.5} />
                          </linearGradient>
                        ))}
                      </defs>
                      {bars.map((b, bi) => {
                        const bw = row.max > 0 ? (b.value / row.max) * BAR_MAX : 0
                        const y = bi * (ROW + GAP)
                        return (
                          <g key={b.label}>
                            <text x={LW - 4} y={y + 9} fill="rgba(255,255,255,0.35)" fontSize={8} fontFamily="inherit" textAnchor="end">{b.label}</text>
                            <rect x={LW} y={y} width={BAR_MAX} height={ROW} rx={3} fill="rgba(255,255,255,0.04)" />
                            <motion.rect x={LW} y={y} height={ROW} rx={3} fill={`url(#${b.id})`}
                              initial={{ width: 0 }} animate={{ width: bw }}
                              transition={{ delay: 0.3 + i * 0.06, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                            />
                            <text x={LW + BAR_MAX + 4} y={y + 9} fill={b.color} fontSize={9} fontFamily="inherit" fontWeight="bold">{b.value}</text>
                          </g>
                        )
                      })}
                    </svg>
                  )
                })()}
              </div>
            ))}
          </div>
        </div>
      </FadeInWhenVisible>

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
                className="border-t border-white/[0.06] px-4 py-4 overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {[
                    { id: 'preserveVocab', label: 'Preserve Key Vocabulary', desc: 'Keep domain-specific terms intact', value: preserveVocab, set: setPreserveVocab },
                    { id: 'addDefinitions', label: 'Inline Definitions', desc: 'Add brief definitions for hard words', value: addDefinitions, set: setAddDefinitions },
                    { id: 'keepSentenceCount', label: 'Match Sentence Count', desc: 'Keep the same number of sentences', value: keepSentenceCount, set: setKeepSentenceCount },
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => opt.set((v: boolean) => !v)}
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
                <div>
                  <p className="text-[10px] font-semibold text-surface-500 uppercase tracking-wider mb-2">Multi-Version Generator</p>
                  <button
                    onClick={() => setMultiView(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-xs text-surface-300 hover:bg-white/[0.08] transition-colors"
                  >
                    <Layers className="w-3.5 h-3.5 text-accent-400" />
                    Generate All 5 Grade Levels at Once
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </FadeUp>

      {/* Bottom Row: Tip + Export + Recent */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FadeInWhenVisible>
          <div className="glass-card p-4 relative overflow-hidden h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-accent-600/5 to-transparent" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-warning-400" />
                <span className="text-sm font-semibold text-surface-200">Why Text Leveling Matters</span>
              </div>
              <p className="text-xs text-surface-400 leading-relaxed">Students with a wide range of reading abilities benefit when the same concept is presented at their reading level. Leveled texts increase comprehension by up to 40%, reduce anxiety, and support ELL students — without watering down the learning objectives.</p>
              <div className="mt-3 flex items-center gap-3 text-[10px] text-surface-500">
                <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-electric-400" />40% better comprehension</span>
                <span className="flex items-center gap-1"><Globe className="w-3 h-3 text-teal-400" />ELL-friendly</span>
              </div>
            </div>
          </div>
        </FadeInWhenVisible>

        <FadeInWhenVisible delay={0.06}>
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-surface-200">Recently Leveled</h3>
              <button className="text-xs text-accent-400 hover:text-accent-300">View All →</button>
            </div>
            <div className="space-y-2">
              {[
                { title: 'Mitosis Lab Background Reading', from: '9–12', to: '6–8', words: 340, date: '2h ago', color: '#6366f1' },
                { title: 'American Revolution Primary Source', from: '9–12', to: '3–5', words: 520, date: 'Yesterday', color: '#f97316' },
                { title: 'Ecosystem Vocabulary Passage', from: '6–8', to: 'K–2', words: 210, date: '2d ago', color: '#10b981' },
                { title: 'Research Methods Introduction', from: 'College', to: '9–12', words: 680, date: '3d ago', color: '#8b5cf6' },
              ].map(item => (
                <div key={item.title} className="flex items-center gap-3 py-2 border-b border-white/[0.04] last:border-0">
                  <div className="w-1 h-8 rounded-full flex-shrink-0" style={{ background: item.color }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-surface-200 truncate">{item.title}</p>
                    <div className="flex items-center gap-1.5 text-[10px] text-surface-500 mt-0.5">
                      <span>Grade {item.from}</span>
                      <ArrowRight className="w-3 h-3" />
                      <span>Grade {item.to}</span>
                      <span>· {item.words}w</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-surface-600 flex-shrink-0">{item.date}</span>
                </div>
              ))}
            </div>
          </div>
        </FadeInWhenVisible>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            className="fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl shadow-xl text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg,#1e1b4b,#312e81)', border: '1px solid rgba(99,102,241,0.3)' }}
            initial={{ opacity: 0, y: -16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.95 }}
            transition={{ duration: 0.25 }}
          >
            <CheckCircle className="w-4 h-4 text-accent-400" />
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
