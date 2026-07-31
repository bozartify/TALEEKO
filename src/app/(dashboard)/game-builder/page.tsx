'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FadeUp, StaggerList, StaggerItem, FadeInWhenVisible } from '@/components/ui/motion'
import {
  Gamepad2, Sparkles, Plus, Play, RefreshCw, Check, Star,
  Users, Clock, BarChart2, Zap, Trophy, Target, BookOpen,
  ChevronRight, Download, Share2, Edit, Copy, Brain, Layers,
  Heart, Puzzle, Timer, Flag, Lock, ChevronDown, ChevronUp,
  AlertCircle, TrendingUp, X, BarChart3, QrCode, Link
} from 'lucide-react'

type GameType = 'quiz-race' | 'word-scramble' | 'memory-match' | 'escape-room' | 'bingo' | 'jeopardy'
type Difficulty = 'easy' | 'medium' | 'hard'
type GameTheme = 'space' | 'ocean' | 'forest' | 'volcano'

interface GameConfig {
  label: string
  icon: string
  desc: string
  color: string
  players: string
  time: string
  skills: string[]
  premium?: boolean
}

const gameTypes: Record<GameType, GameConfig> = {
  'quiz-race':    { label: 'Quiz Race',      icon: '🏁', color: '#6366f1', desc: 'Students race to answer questions correctly',   players: '2–30', time: '10–20 min', skills: ['Recall', 'Speed', 'Competition'] },
  'word-scramble':{ label: 'Word Scramble',  icon: '🔤', color: '#22d3ee', desc: 'Unscramble key vocabulary words',               players: '1–30', time: '5–15 min',  skills: ['Vocabulary', 'Spelling', 'Pattern Recognition'] },
  'memory-match': { label: 'Memory Match',   icon: '🃏', color: '#10b981', desc: 'Match terms to definitions in a card flip game', players: '1–4', time: '5–10 min',  skills: ['Memory', 'Vocabulary', 'Definitions'] },
  'escape-room':  { label: 'Escape Room',    icon: '🗝️', color: '#f97316', desc: 'Solve puzzles to unlock the next challenge',    players: '2–6', time: '20–40 min', skills: ['Problem Solving', 'Collaboration', 'Critical Thinking'], premium: true },
  'bingo':        { label: 'Bingo',          icon: '🎲', color: '#ec4899', desc: 'Classic bingo with academic content',            players: '5–35',time: '10–20 min', skills: ['Listening', 'Recognition', 'Focus'] },
  'jeopardy':     { label: 'Jeopardy',       icon: '📺', color: '#f59e0b', desc: 'Category-based question board for teams',        players: '2–30',time: '20–30 min', skills: ['Recall', 'Strategy', 'Teams'], premium: true },
}

interface Question {
  id: string
  question: string
  answer: string
  category: string
  points: number
  difficulty: Difficulty
}

const difficultyConfig: Record<Difficulty, { color: string; bg: string; label: string }> = {
  easy:   { color: '#10b981', bg: 'bg-success-500/10', label: 'Easy' },
  medium: { color: '#f59e0b', bg: 'bg-warning-500/10', label: 'Medium' },
  hard:   { color: '#ef4444', bg: 'bg-danger-500/10',  label: 'Hard' },
}

const THEMES: Record<GameTheme, { label: string; gradient: string; icon: string }> = {
  space:   { label: 'Space',   gradient: 'from-indigo-900 to-purple-900', icon: '🚀' },
  ocean:   { label: 'Ocean',   gradient: 'from-blue-900 to-teal-900',     icon: '🌊' },
  forest:  { label: 'Forest',  gradient: 'from-green-900 to-emerald-900', icon: '🌲' },
  volcano: { label: 'Volcano', gradient: 'from-red-900 to-orange-900',    icon: '🌋' },
}

const INITIAL_QUESTIONS: Question[] = [
  { id: 'q1', question: 'What organelle is responsible for photosynthesis?', answer: 'Chloroplast', category: 'Cell Biology', points: 100, difficulty: 'easy' },
  { id: 'q2', question: 'What is the equation for photosynthesis?', answer: '6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂', category: 'Cell Biology', points: 200, difficulty: 'medium' },
  { id: 'q3', question: 'During which phase of mitosis do chromosomes align at the center of the cell?', answer: 'Metaphase', category: 'Cell Division', points: 100, difficulty: 'easy' },
  { id: 'q4', question: 'What is the difference between osmosis and diffusion?', answer: 'Osmosis is the movement of water across a semi-permeable membrane; diffusion is the movement of any molecule from high to low concentration', category: 'Cell Transport', points: 300, difficulty: 'hard' },
  { id: 'q5', question: 'Name the 4 nitrogen bases found in DNA.', answer: 'Adenine, Thymine, Guanine, Cytosine', category: 'Genetics', points: 200, difficulty: 'medium' },
  { id: 'q6', question: 'What is a codon?', answer: 'A sequence of 3 nucleotides that codes for an amino acid', category: 'Genetics', points: 300, difficulty: 'hard' },
]

const LEADERBOARD = [
  { rank: 1, name: 'Emma R.', score: 2800, streak: 6, avatar: 'ER', color: '#f59e0b' },
  { rank: 2, name: 'James K.', score: 2500, streak: 4, avatar: 'JK', color: '#ec4899' },
  { rank: 3, name: 'Sofia P.', score: 2200, streak: 3, avatar: 'SP', color: '#8b5cf6' },
  { rank: 4, name: 'Noah W.', score: 1900, streak: 2, avatar: 'NW', color: '#22d3ee' },
  { rank: 5, name: 'Liam C.', score: 1700, streak: 1, avatar: 'LC', color: '#10b981' },
]

const recentGames = [
  { title: 'Cell Bio Quiz Race',    type: 'quiz-race',    date: 'Yesterday',  played: 24, avgScore: 82, color: '#6366f1' },
  { title: 'Genetics Memory Match', type: 'memory-match', date: '3 days ago', played: 18, avgScore: 76, color: '#10b981' },
  { title: 'Mitosis Bingo',         type: 'bingo',        date: 'Last week',  played: 26, avgScore: 91, color: '#ec4899' },
  { title: 'Vocab Scramble',        type: 'word-scramble',date: 'Last week',  played: 22, avgScore: 85, color: '#22d3ee' },
]

const ENGAGEMENT_DATA = [68, 74, 79, 82, 88, 89, 91, 94]
const ENGAGE_LABELS = ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Now']

export default function GameBuilderPage() {
  const [selectedType, setSelectedType] = useState<GameType>('quiz-race')
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [title, setTitle] = useState('Photosynthesis & Cell Division Quiz Race')
  const [subject, setSubject] = useState('AP Biology')
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [questionCount, setQuestionCount] = useState(10)
  const [timeLimit, setTimeLimit] = useState(15)
  const [generating, setGenerating] = useState(false)
  const [questions, setQuestions] = useState<Question[]>(INITIAL_QUESTIONS)
  const [expandedQ, setExpandedQ] = useState<string | null>(null)
  const [editingQ, setEditingQ] = useState<string | null>(null)
  const [aiOpen, setAiOpen] = useState(false)
  const [theme, setTheme] = useState<GameTheme>('space')
  const [shareOpen, setShareOpen] = useState(false)
  const [liveMode, setLiveMode] = useState(false)
  const PIN = '847291'

  const cfg = gameTypes[selectedType]

  async function handleGenerate() {
    setGenerating(true)
    await new Promise(r => setTimeout(r, 2200))
    setGenerating(false)
    setStep(2)
  }

  function deleteQuestion(id: string) {
    setQuestions(prev => prev.filter(q => q.id !== id))
  }

  function duplicateQuestion(id: string) {
    const orig = questions.find(q => q.id === id)
    if (!orig) return
    const dupe = { ...orig, id: `q-${Date.now()}`, question: orig.question + ' (copy)' }
    setQuestions(prev => [...prev, dupe])
  }

  const diffCounts = {
    easy: questions.filter(q => q.difficulty === 'easy').length,
    medium: questions.filter(q => q.difficulty === 'medium').length,
    hard: questions.filter(q => q.difficulty === 'hard').length,
  }

  return (
    <div className="space-y-6">
      {/* Share Modal */}
      <AnimatePresence>
        {shareOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShareOpen(false)}
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
                <h3 className="text-base font-bold text-white">Share Game</h3>
                <button onClick={() => setShareOpen(false)} className="p-1 rounded-lg hover:bg-white/[0.08] text-surface-400"><X className="w-4 h-4" /></button>
              </div>
              {/* PIN */}
              <div className="text-center mb-5">
                <p className="text-xs text-surface-400 mb-2">Students join with this PIN at gamepin.io</p>
                <div className="flex items-center justify-center gap-2">
                  {PIN.split('').map((d, i) => (
                    <div key={i} className="w-12 h-14 rounded-xl bg-accent-500/20 border border-accent-500/30 flex items-center justify-center text-2xl font-black text-accent-300">{d}</div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.06] transition-colors text-left">
                  <div className="w-9 h-9 rounded-xl bg-accent-500/10 flex items-center justify-center">
                    <Link className="w-4 h-4 text-accent-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Copy Join Link</p>
                    <p className="text-[10px] text-surface-400">gamepin.io/join/847291</p>
                  </div>
                </button>
                <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.06] transition-colors text-left">
                  <div className="w-9 h-9 rounded-xl bg-success-500/10 flex items-center justify-center">
                    <QrCode className="w-4 h-4 text-success-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Download QR Code</p>
                    <p className="text-[10px] text-surface-400">Project on board or print for students</p>
                  </div>
                </button>
                <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.06] transition-colors text-left">
                  <div className="w-9 h-9 rounded-xl bg-electric-500/10 flex items-center justify-center">
                    <Share2 className="w-4 h-4 text-electric-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Share to Google Classroom</p>
                    <p className="text-[10px] text-surface-400">Post directly to your class stream</p>
                  </div>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Insights */}
      <FadeUp delay={0.05}>
        <div className="glass-card overflow-hidden">
          <button
            className="w-full flex items-center justify-between p-4 hover:bg-white/[0.03] transition-colors"
            onClick={() => setAiOpen(o => !o)}
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-pink-500/20 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              </div>
              <span className="text-sm font-bold text-white">AI Game Insights</span>
              <span className="bg-pink-500/20 text-pink-400 text-[10px] font-bold px-2 py-0.5 rounded-full">3 tips</span>
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
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-warning-500/[0.08] border border-warning-500/20">
                    <AlertCircle className="w-4 h-4 text-warning-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-warning-300">Difficulty Imbalance</p>
                      <p className="text-[11px] text-surface-400 mt-0.5">Your current game is 50% hard questions — this risks disengaging lower-performing students. AI recommends 60% easy, 30% medium, 10% hard for optimal retention.</p>
                      <button className="text-[10px] text-warning-400 font-semibold mt-1 hover:underline">Auto-balance →</button>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-success-500/[0.08] border border-success-500/20">
                    <TrendingUp className="w-4 h-4 text-success-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-success-300">Engagement Trending Up</p>
                      <p className="text-[11px] text-surface-400 mt-0.5">Your class engagement on games has grown from 68% → 94% over 8 months. Games work particularly well for Unit 3 (Cell Division) content.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-electric-500/[0.08] border border-electric-500/20">
                    <Zap className="w-4 h-4 text-electric-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-electric-300">Optimal Timing</p>
                      <p className="text-[11px] text-surface-400 mt-0.5">Your class performs 23% better on games played at the START of class vs. end. Try this game as a warm-up for Thursday&apos;s lesson on Genetics.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </FadeUp>

      {/* Step Indicator */}
      <FadeUp delay={0.08}>
        <div className="flex items-center gap-3 flex-wrap">
          {[{ n: 1, label: 'Choose Game Type' }, { n: 2, label: 'Edit Questions' }, { n: 3, label: 'Launch & Share' }].map((s, i) => (
            <div key={s.n} className="flex items-center gap-2">
              <button
                onClick={() => setStep(s.n as 1 | 2 | 3)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${step === s.n ? 'bg-accent-500/20 text-accent-300 border border-accent-500/30' : step > s.n ? 'text-success-400' : 'text-surface-500'}`}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step === s.n ? 'bg-accent-500 text-white' : step > s.n ? 'bg-success-500/20 text-success-400' : 'bg-white/[0.06] text-surface-500'}`}>
                  {step > s.n ? <Check className="w-3 h-3" /> : s.n}
                </div>
                {s.label}
              </button>
              {i < 2 && <ChevronRight className="w-3.5 h-3.5 text-surface-600" />}
            </div>
          ))}
        </div>
      </FadeUp>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="xl:col-span-2 space-y-4">

          {/* Step 1: Game Type + Settings */}
          {step === 1 && (
            <FadeUp delay={0.1}>
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-surface-300">Select Game Type</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(Object.entries(gameTypes) as [GameType, GameConfig][]).map(([key, gcfg]) => (
                    <motion.button
                      key={key}
                      onClick={() => !gcfg.premium && setSelectedType(key)}
                      className={`relative glass-card p-4 text-left transition-all ${selectedType === key && !gcfg.premium ? 'border-accent-500/40 bg-accent-500/5' : 'hover:border-white/10'} ${gcfg.premium ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
                      whileHover={!gcfg.premium ? { scale: 1.01 } : {}}
                    >
                      {gcfg.premium && (
                        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-warning-500/20 border border-warning-500/30">
                          <Lock className="w-3 h-3 text-warning-400" />
                          <span className="text-[10px] font-bold text-warning-400">Pro</span>
                        </div>
                      )}
                      {selectedType === key && !gcfg.premium && (
                        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-accent-500 flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{gcfg.icon}</span>
                        <div>
                          <p className="text-sm font-bold text-surface-100">{gcfg.label}</p>
                          <p className="text-[11px] text-surface-500">{gcfg.desc}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-surface-500 mb-2">
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" />{gcfg.players}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{gcfg.time}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {gcfg.skills.map(skill => (
                          <span key={skill} className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/[0.04] text-surface-500 border border-white/[0.05]">{skill}</span>
                        ))}
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Game Settings */}
                <div className="glass-card p-5 space-y-4">
                  <h3 className="text-sm font-semibold text-surface-200">Game Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] text-surface-500 block mb-1">Game Title</label>
                      <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white/[0.04] border border-white/[0.08] text-surface-200 focus:outline-none focus:border-accent-500/40" />
                    </div>
                    <div>
                      <label className="text-[11px] text-surface-500 block mb-1">Subject / Topic</label>
                      <input type="text" value={subject} onChange={e => setSubject(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white/[0.04] border border-white/[0.08] text-surface-200 focus:outline-none focus:border-accent-500/40" />
                    </div>
                    <div>
                      <label className="text-[11px] text-surface-500 block mb-2">Difficulty</label>
                      <div className="flex gap-2">
                        {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => {
                          const dc = difficultyConfig[d]
                          return (
                            <button key={d} onClick={() => setDifficulty(d)}
                              className={`flex-1 py-1.5 rounded-xl text-xs font-semibold border transition-all capitalize ${difficulty === d ? 'border-transparent' : 'border-white/[0.06] text-surface-500'}`}
                              style={difficulty === d ? { background: dc.color + '25', color: dc.color, borderColor: dc.color + '40' } : {}}>
                              {dc.label}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] text-surface-500 block mb-1">Questions</label>
                        <div className="flex items-center gap-2">
                          <button onClick={() => setQuestionCount(q => Math.max(5, q - 5))} className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] text-surface-300 hover:bg-white/[0.08] flex items-center justify-center">−</button>
                          <span className="text-sm font-bold text-white min-w-[2rem] text-center">{questionCount}</span>
                          <button onClick={() => setQuestionCount(q => Math.min(30, q + 5))} className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] text-surface-300 hover:bg-white/[0.08] flex items-center justify-center">+</button>
                        </div>
                      </div>
                      <div>
                        <label className="text-[11px] text-surface-500 block mb-1">Time Limit (min)</label>
                        <div className="flex items-center gap-2">
                          <button onClick={() => setTimeLimit(t => Math.max(5, t - 5))} className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] text-surface-300 hover:bg-white/[0.08] flex items-center justify-center">−</button>
                          <span className="text-sm font-bold text-white min-w-[2rem] text-center">{timeLimit}</span>
                          <button onClick={() => setTimeLimit(t => Math.min(60, t + 5))} className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] text-surface-300 hover:bg-white/[0.08] flex items-center justify-center">+</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Theme picker */}
                  <div>
                    <label className="text-[11px] text-surface-500 block mb-2">Game Theme</label>
                    <div className="flex gap-2">
                      {(Object.entries(THEMES) as [GameTheme, typeof THEMES.space][]).map(([key, t]) => (
                        <button
                          key={key}
                          onClick={() => setTheme(key)}
                          className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${theme === key ? 'border-accent-500/30 bg-accent-500/10 text-accent-300' : 'border-white/[0.06] text-surface-500 hover:text-surface-300'}`}
                        >
                          <span className="mr-1">{t.icon}</span>{t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <motion.button
                    onClick={handleGenerate}
                    disabled={generating}
                    className="btn-gradient text-sm px-5 py-2.5 w-full justify-center disabled:opacity-50"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    {generating ? <><RefreshCw className="w-4 h-4 animate-spin" />Building your game…</> : <><Sparkles className="w-4 h-4" />Build {cfg.label} with AI</>}
                  </motion.button>
                </div>
              </div>
            </FadeUp>
          )}

          {/* Step 2: Edit Questions */}
          {step === 2 && (
            <FadeUp delay={0.1}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h3 className="text-sm font-semibold text-surface-300">{questions.length} Questions · {cfg.label}</h3>
                    <div className="flex items-center gap-2">
                      {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => {
                        const dc = difficultyConfig[d]
                        return (
                          <span key={d} className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: dc.color + '20', color: dc.color }}>
                            {diffCounts[d]} {dc.label}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="btn-secondary text-xs px-3 py-1.5" onClick={() => setQuestions(prev => [...prev, { id: `q-${Date.now()}`, question: 'New Question', answer: 'Answer', category: 'General', points: 100, difficulty: 'easy' }])}>
                      <Plus className="w-3.5 h-3.5" />Add
                    </button>
                    <button className="btn-gradient text-xs px-3 py-1.5" onClick={() => setStep(3)}>
                      Preview & Launch →
                    </button>
                  </div>
                </div>

                {questions.map((q, i) => {
                  const dc = difficultyConfig[q.difficulty]
                  const isExpanded = expandedQ === q.id
                  return (
                    <motion.div
                      key={q.id}
                      className="glass-card overflow-hidden"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <button
                        onClick={() => setExpandedQ(isExpanded ? null : q.id)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/[0.02] transition-colors"
                      >
                        <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-xs font-bold text-surface-400 flex-shrink-0">
                          {i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-surface-200 truncate">{q.question}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[11px] text-surface-500">{q.category}</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${dc.bg}`} style={{ color: dc.color }}>{dc.label}</span>
                            <span className="text-[10px] text-surface-600">{q.points} pts</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0" onClick={e => e.stopPropagation()}>
                          <button onClick={() => duplicateQuestion(q.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-surface-500 hover:text-surface-200 hover:bg-white/[0.04] transition-colors" title="Duplicate">
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => deleteQuestion(q.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-surface-500 hover:text-danger-400 hover:bg-danger-500/10 transition-colors" title="Delete">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </button>
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.18 }}
                            className="border-t border-white/[0.06] px-4 py-3 space-y-3 overflow-hidden"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <label className="text-[10px] text-surface-500 font-semibold uppercase tracking-wider block mb-1">Question</label>
                                <textarea
                                  defaultValue={q.question}
                                  rows={3}
                                  className="w-full px-3 py-2 text-xs rounded-xl bg-white/[0.04] border border-white/[0.08] text-surface-200 focus:outline-none focus:border-accent-500/40 resize-none"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] text-success-400 font-semibold uppercase tracking-wider block mb-1">Answer</label>
                                <textarea
                                  defaultValue={q.answer}
                                  rows={3}
                                  className="w-full px-3 py-2 text-xs rounded-xl bg-success-500/5 border border-success-500/20 text-success-200 focus:outline-none focus:border-success-500/40 resize-none"
                                />
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] text-surface-500">Points:</span>
                                {[100, 200, 300, 400].map(pts => (
                                  <button key={pts} className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${q.points === pts ? 'border-accent-500/40 bg-accent-500/20 text-accent-300' : 'border-white/[0.06] text-surface-500 hover:text-surface-300'}`}>
                                    {pts}
                                  </button>
                                ))}
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
          )}

          {/* Step 3: Launch */}
          {step === 3 && (
            <FadeUp delay={0.1}>
              <div className="space-y-4">
                {/* Hero card */}
                <div className="glass-card p-6 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent-600/10 via-electric-400/5 to-success-500/5" />
                  <div className="relative">
                    <div className="text-5xl mb-4">{cfg.icon}</div>
                    <h2 className="text-xl font-bold text-white mb-1">{title}</h2>
                    <p className="text-sm text-surface-400 mb-2">{cfg.label} · {questions.length} questions · {timeLimit} min</p>
                    <div className="flex items-center justify-center gap-4 text-sm text-surface-500 mb-2">
                      <span className="flex items-center gap-1"><Users className="w-4 h-4" />{cfg.players} players</span>
                      <span className="flex items-center gap-1"><Trophy className="w-4 h-4 text-warning-400" />Competitive</span>
                      <span className="flex items-center gap-1"><Zap className="w-4 h-4 text-electric-400" />Live</span>
                    </div>
                    <p className="text-xs text-surface-500 mb-5">Theme: {THEMES[theme].icon} {THEMES[theme].label}</p>
                    <div className="flex items-center justify-center gap-3 flex-wrap">
                      <motion.button
                        className="btn-gradient text-sm px-6 py-2.5"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setLiveMode(true)}
                      >
                        <Play className="w-4 h-4" />
                        Launch Live Game
                      </motion.button>
                      <button className="btn-secondary text-sm px-4 py-2.5" onClick={() => setShareOpen(true)}>
                        <Share2 className="w-4 h-4" />
                        Share
                      </button>
                      <button className="btn-secondary text-sm px-4 py-2.5">
                        <Download className="w-4 h-4" />
                        Export
                      </button>
                    </div>
                  </div>
                </div>

                {/* Live mode simulation */}
                <AnimatePresence>
                  {liveMode && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="glass-card p-5 border border-success-500/20">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-success-400 animate-pulse" />
                            <span className="text-sm font-bold text-white">LIVE — {title}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-surface-400">Pin: <span className="font-bold text-accent-400">{PIN}</span></span>
                            <button onClick={() => setLiveMode(false)} className="p-1 rounded-lg hover:bg-white/[0.08] text-surface-500"><X className="w-4 h-4" /></button>
                          </div>
                        </div>
                        <p className="text-xs font-bold text-surface-300 mb-3">Live Leaderboard</p>
                        <div className="space-y-2">
                          {LEADERBOARD.map((player, i) => (
                            <motion.div
                              key={player.rank}
                              className="flex items-center gap-3 p-2 rounded-xl bg-white/[0.03]"
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.06 }}
                            >
                              <span className={`text-sm font-black w-6 text-center ${i === 0 ? 'text-warning-400' : i === 1 ? 'text-surface-300' : i === 2 ? 'text-orange-400' : 'text-surface-500'}`}>
                                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : player.rank}
                              </span>
                              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0" style={{ background: `linear-gradient(135deg,${player.color},${player.color}dd)` }}>
                                {player.avatar}
                              </div>
                              <span className="text-xs font-semibold text-surface-200 flex-1">{player.name}</span>
                              <span className="text-xs text-electric-400 font-bold">{player.score.toLocaleString()} pts</span>
                              {player.streak > 0 && (
                                <span className="text-[9px] text-warning-400 font-bold">🔥{player.streak}</span>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Play modes */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { icon: Play, label: 'Live Mode', desc: 'Play together in class with a real-time leaderboard', color: '#6366f1' },
                    { icon: Timer, label: 'Homework Mode', desc: 'Students play on their own time — due date assignable', color: '#10b981' },
                    { icon: Flag, label: 'Competition Mode', desc: 'Head-to-head class challenge with bracket standings', color: '#f97316' },
                  ].map(mode => (
                    <div key={mode.label} className="glass-card p-4 hover:border-white/10 transition-colors cursor-pointer group">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-3" style={{ background: mode.color + '20' }}>
                        <mode.icon className="w-4 h-4" style={{ color: mode.color }} />
                      </div>
                      <p className="text-sm font-semibold text-surface-200 group-hover:text-white transition-colors">{mode.label}</p>
                      <p className="text-xs text-surface-500 mt-0.5">{mode.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeUp>
          )}
        </div>

        {/* Sidebar */}
        <div className="xl:col-span-1 space-y-4">
          {/* Monthly Stats */}
          <FadeInWhenVisible delay={0.12}>
            <div className="glass-card p-4 space-y-3">
              <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider">This Month</h3>
              {[
                { label: 'Games Created', value: '12', icon: Gamepad2, color: '#6366f1' },
                { label: 'Times Played',  value: '47', icon: Play,     color: '#10b981' },
                { label: 'Avg Engagement',value: '89%',icon: Heart,    color: '#ec4899' },
                { label: 'Top Score',     value: '98%',icon: Trophy,   color: '#f59e0b' },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: s.color + '20' }}>
                    <s.icon className="w-3.5 h-3.5" style={{ color: s.color }} />
                  </div>
                  <span className="text-xs text-surface-400 flex-1">{s.label}</span>
                  <span className="text-sm font-bold text-surface-100">{s.value}</span>
                </div>
              ))}
            </div>
          </FadeInWhenVisible>

          {/* Engagement Trend */}
          <FadeInWhenVisible delay={0.15}>
            <div className="glass-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="w-4 h-4 text-success-400" />
                <h3 className="text-xs font-bold text-white">Engagement Trend</h3>
              </div>
              <div className="flex items-end gap-1.5 h-20">
                {ENGAGEMENT_DATA.map((val, i) => {
                  const pct = (val / 100) * 100
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full bg-white/[0.06] rounded-sm flex flex-col justify-end" style={{ height: '60px' }}>
                        <motion.div
                          className="w-full rounded-sm"
                          style={{ background: `linear-gradient(180deg, #10b981, #059669)` }}
                          initial={{ height: 0 }}
                          animate={{ height: `${pct}%` }}
                          transition={{ delay: 0.3 + i * 0.06, duration: 0.7, ease: 'easeOut' }}
                        />
                      </div>
                      <span className="text-[8px] text-surface-600">{ENGAGE_LABELS[i]}</span>
                    </div>
                  )
                })}
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                <TrendingUp className="w-3.5 h-3.5 text-success-400" />
                <span className="text-[11px] text-success-300 font-semibold">+26% engagement over 8 months</span>
              </div>
            </div>
          </FadeInWhenVisible>

          {/* AI Tip */}
          <FadeInWhenVisible delay={0.18}>
            <div className="glass-card p-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-electric-500/5 to-transparent" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-4 h-4 text-electric-400" />
                  <span className="text-xs font-semibold text-surface-200">AI Game Tip</span>
                </div>
                <p className="text-xs text-surface-400 leading-relaxed">Mix difficulty levels — 60% easy, 30% medium, 10% hard keeps all students engaged. Reward streaks (consecutive correct answers) to sustain momentum throughout the game.</p>
              </div>
            </div>
          </FadeInWhenVisible>

          {/* Recent Games */}
          <FadeInWhenVisible delay={0.2}>
            <div className="glass-card p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Recent Games</h3>
                <button className="text-xs text-accent-400 hover:text-accent-300">All →</button>
              </div>
              <div className="space-y-2">
                {recentGames.map(game => {
                  const gt = gameTypes[game.type as GameType]
                  return (
                    <div key={game.title} className="flex items-center gap-3 py-2 border-b border-white/[0.04] last:border-0">
                      <span className="text-lg flex-shrink-0">{gt.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-surface-200 truncate">{game.title}</p>
                        <div className="flex items-center gap-2 text-[10px] text-surface-500 mt-0.5">
                          <span>{game.played} played</span>
                          <span>·</span>
                          <span className="text-success-400">{game.avgScore}% avg</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-surface-600 flex-shrink-0">{game.date}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </FadeInWhenVisible>
        </div>
      </div>
    </div>
  )
}
