'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FadeUp, StaggerList, StaggerItem } from '@/components/ui/motion'
import {
  Gamepad2, Sparkles, Plus, Play, RefreshCw, Check, Star,
  Users, Clock, BarChart2, Zap, Trophy, Target, BookOpen,
  ChevronRight, Download, Share2, Edit, Copy, Brain, Layers,
  Heart, Puzzle, Timer, Flag, Lock
} from 'lucide-react'

type GameType = 'quiz-race' | 'word-scramble' | 'memory-match' | 'escape-room' | 'bingo' | 'jeopardy'
type Difficulty = 'easy' | 'medium' | 'hard'

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
  'quiz-race':    { label: 'Quiz Race',      icon: '🏁', color: '#6366f1', desc: 'Students race to answer questions correctly', players: '2–30',  time: '10–20 min', skills: ['Recall', 'Speed', 'Competition'] },
  'word-scramble':{ label: 'Word Scramble',  icon: '🔤', color: '#22d3ee', desc: 'Unscramble key vocabulary words',              players: '1–30',  time: '5–15 min',  skills: ['Vocabulary', 'Spelling', 'Pattern Recognition'] },
  'memory-match': { label: 'Memory Match',   icon: '🃏', color: '#10b981', desc: 'Match terms to definitions in a card flip game', players: '1–4', time: '5–10 min',  skills: ['Memory', 'Vocabulary', 'Definitions'] },
  'escape-room':  { label: 'Escape Room',    icon: '🗝️', color: '#f97316', desc: 'Solve puzzles to unlock the next challenge',    players: '2–6',  time: '20–40 min', skills: ['Problem Solving', 'Collaboration', 'Critical Thinking'], premium: true },
  'bingo':        { label: 'Bingo',          icon: '🎲', color: '#ec4899', desc: 'Classic bingo with academic content',           players: '5–35', time: '10–20 min', skills: ['Listening', 'Recognition', 'Focus'] },
  'jeopardy':     { label: 'Jeopardy',       icon: '📺', color: '#f59e0b', desc: 'Category-based question board for teams',       players: '2–30', time: '20–30 min', skills: ['Recall', 'Strategy', 'Teams'], premium: true },
}

interface Question {
  id: string
  question: string
  answer: string
  category: string
  points: number
  difficulty: Difficulty
}

const sampleQuestions: Question[] = [
  { id: 'q1', question: 'What organelle is responsible for photosynthesis?', answer: 'Chloroplast', category: 'Cell Biology', points: 100, difficulty: 'easy' },
  { id: 'q2', question: 'What is the equation for photosynthesis?', answer: '6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂', category: 'Cell Biology', points: 200, difficulty: 'medium' },
  { id: 'q3', question: 'During which phase of mitosis do chromosomes align at the center of the cell?', answer: 'Metaphase', category: 'Cell Division', points: 100, difficulty: 'easy' },
  { id: 'q4', question: 'What is the difference between osmosis and diffusion?', answer: 'Osmosis is the movement of water across a semi-permeable membrane; diffusion is the movement of any molecule from high to low concentration', category: 'Cell Transport', points: 300, difficulty: 'hard' },
  { id: 'q5', question: 'Name the 4 nitrogen bases found in DNA.', answer: 'Adenine, Thymine, Guanine, Cytosine', category: 'Genetics', points: 200, difficulty: 'medium' },
  { id: 'q6', question: 'What is a codon?', answer: 'A sequence of 3 nucleotides that codes for an amino acid', category: 'Genetics', points: 300, difficulty: 'hard' },
]

const difficultyConfig: Record<Difficulty, { color: string; bg: string; label: string }> = {
  easy:   { color: '#10b981', bg: 'bg-success-500/10', label: 'Easy' },
  medium: { color: '#f59e0b', bg: 'bg-warning-500/10', label: 'Medium' },
  hard:   { color: '#ef4444', bg: 'bg-danger-500/10',  label: 'Hard' },
}

const recentGames = [
  { title: 'Cell Bio Quiz Race',    type: 'quiz-race',     date: 'Yesterday',  played: 24, avgScore: 82, color: '#6366f1' },
  { title: 'Genetics Memory Match', type: 'memory-match',  date: '3 days ago', played: 18, avgScore: 76, color: '#10b981' },
  { title: 'Mitosis Bingo',         type: 'bingo',         date: 'Last week',  played: 26, avgScore: 91, color: '#ec4899' },
  { title: 'Science Vocab Scramble',type: 'word-scramble', date: 'Last week',  played: 22, avgScore: 85, color: '#22d3ee' },
]

export default function GameBuilderPage() {
  const [selectedType, setSelectedType] = useState<GameType>('quiz-race')
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [title, setTitle] = useState('Photosynthesis & Cell Division Quiz Race')
  const [subject, setSubject] = useState('AP Biology')
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [questionCount, setQuestionCount] = useState(10)
  const [timeLimit, setTimeLimit] = useState(15)
  const [generating, setGenerating] = useState(false)
  const [questions, setQuestions] = useState<Question[]>(sampleQuestions)
  const [expandedQ, setExpandedQ] = useState<string | null>(null)

  const cfg = gameTypes[selectedType]

  async function handleGenerate() {
    setGenerating(true)
    await new Promise(r => setTimeout(r, 2200))
    setGenerating(false)
    setStep(2)
  }

  return (
    <div className="p-6 space-y-6 max-w-[1600px]">
      {/* Header */}
      <FadeUp>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #ec4899, #8b5cf6)' }}>
              <Gamepad2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-surface-100">Game Builder</h1>
              <p className="text-sm text-surface-500">Turn your content into engaging classroom games with AI</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-secondary text-sm px-4 py-2">
              <Plus className="w-4 h-4" />
              Blank Game
            </button>
            <button onClick={handleGenerate} disabled={generating} className="btn-gradient text-sm px-4 py-2 disabled:opacity-50">
              {generating
                ? <><RefreshCw className="w-4 h-4 animate-spin" />Building…</>
                : <><Sparkles className="w-4 h-4" />AI Build Game</>
              }
            </button>
          </div>
        </div>
      </FadeUp>

      {/* Step Indicator */}
      <FadeUp delay={0.05}>
        <div className="flex items-center gap-3">
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
          {/* Step 1: Game Type Selection */}
          {step === 1 && (
            <FadeUp delay={0.1}>
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-surface-300">Select Game Type</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(Object.entries(gameTypes) as [GameType, GameConfig][]).map(([key, gcfg]) => (
                    <motion.button
                      key={key}
                      onClick={() => !gcfg.premium && setSelectedType(key)}
                      className={`relative glass-card p-4 text-left transition-all ${selectedType === key ? 'border-accent-500/40 bg-accent-500/5' : 'hover:border-white/10'} ${gcfg.premium ? 'opacity-70 cursor-not-allowed' : ''}`}
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
                      <div className="flex items-center gap-3 text-[11px] text-surface-500">
                        <div className="flex items-center gap-1"><Users className="w-3 h-3" />{gcfg.players}</div>
                        <div className="flex items-center gap-1"><Clock className="w-3 h-3" />{gcfg.time}</div>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
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
                  <button onClick={handleGenerate} disabled={generating} className="btn-gradient text-sm px-5 py-2.5 w-full justify-center disabled:opacity-50">
                    {generating ? <><RefreshCw className="w-4 h-4 animate-spin" />Building your game…</> : <><Sparkles className="w-4 h-4" />Build {cfg.label} with AI</>}
                  </button>
                </div>
              </div>
            </FadeUp>
          )}

          {/* Step 2: Edit Questions */}
          {step === 2 && (
            <FadeUp delay={0.1}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-surface-300">{questions.length} Questions · {cfg.label}</h3>
                  <div className="flex items-center gap-2">
                    <button className="btn-secondary text-xs px-3 py-1.5">
                      <Plus className="w-3.5 h-3.5" />
                      Add Question
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
                        className="w-full flex items-center gap-3 px-4 py-3 text-left"
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
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <button className="w-7 h-7 rounded-lg flex items-center justify-center text-surface-500 hover:text-surface-200 hover:bg-white/[0.04] transition-colors">
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button className="w-7 h-7 rounded-lg flex items-center justify-center text-surface-500 hover:text-surface-200 hover:bg-white/[0.04] transition-colors">
                            <Copy className="w-3.5 h-3.5" />
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
                            className="border-t border-white/[0.06] px-4 py-3 space-y-2"
                          >
                            <div>
                              <label className="text-[10px] text-surface-600 uppercase tracking-wider font-semibold">Question</label>
                              <p className="text-sm text-surface-200 mt-0.5">{q.question}</p>
                            </div>
                            <div>
                              <label className="text-[10px] text-success-500 uppercase tracking-wider font-semibold">Answer</label>
                              <p className="text-sm text-success-300 mt-0.5">{q.answer}</p>
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
                <div className="glass-card p-6 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent-600/10 via-electric-400/5 to-success-500/5" />
                  <div className="relative">
                    <div className="text-5xl mb-4">{cfg.icon}</div>
                    <h2 className="text-xl font-bold text-white mb-1">{title}</h2>
                    <p className="text-sm text-surface-400 mb-2">{cfg.label} · {questions.length} questions · {timeLimit} min</p>
                    <div className="flex items-center justify-center gap-4 text-sm text-surface-500 mb-6">
                      <span className="flex items-center gap-1"><Users className="w-4 h-4" />{cfg.players} players</span>
                      <span className="flex items-center gap-1"><Trophy className="w-4 h-4 text-warning-400" />Competitive</span>
                      <span className="flex items-center gap-1"><Zap className="w-4 h-4 text-electric-400" />Live Mode</span>
                    </div>
                    <div className="flex items-center justify-center gap-3 flex-wrap">
                      <button className="btn-gradient text-sm px-6 py-2.5">
                        <Play className="w-4 h-4" />
                        Launch Live Game
                      </button>
                      <button className="btn-secondary text-sm px-4 py-2.5">
                        <Share2 className="w-4 h-4" />
                        Share Link
                      </button>
                      <button className="btn-secondary text-sm px-4 py-2.5">
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { icon: Play, label: 'Live Mode',       desc: 'Play together in class, real-time leaderboard', color: '#6366f1' },
                    { icon: Timer, label: 'Homework Mode',  desc: 'Students play on their own time', color: '#10b981' },
                    { icon: Flag, label: 'Competition Mode', desc: 'Head-to-head class challenge', color: '#f97316' },
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

        {/* Right Sidebar */}
        <div className="xl:col-span-1 space-y-4">
          {/* Stats */}
          <FadeUp delay={0.12}>
            <div className="glass-card p-4 space-y-3">
              <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider">This Month</h3>
              {[
                { label: 'Games Created', value: '12',  icon: Gamepad2,  color: '#6366f1' },
                { label: 'Times Played',  value: '47',  icon: Play,      color: '#10b981' },
                { label: 'Avg Engagement', value: '89%',icon: Heart,     color: '#ec4899' },
                { label: 'Top Score',     value: '98%', icon: Trophy,    color: '#f59e0b' },
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
          </FadeUp>

          {/* AI Tip */}
          <FadeUp delay={0.16}>
            <div className="glass-card p-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-electric-500/5 to-transparent" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-4 h-4 text-electric-400" />
                  <span className="text-xs font-semibold text-surface-200">AI Game Tip</span>
                </div>
                <p className="text-xs text-surface-400 leading-relaxed">Mix difficulty levels in your game — 60% easy, 30% medium, 10% hard keeps all students engaged and prevents frustration or boredom.</p>
              </div>
            </div>
          </FadeUp>

          {/* Recent Games */}
          <FadeUp delay={0.2}>
            <div className="glass-card p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Recent Games</h3>
                <button className="text-xs text-accent-400 hover:text-accent-300">All →</button>
              </div>
              <StaggerList>
                {recentGames.map(game => {
                  const gt = gameTypes[game.type as GameType]
                  return (
                    <StaggerItem key={game.title}>
                      <div className="flex items-center gap-3 py-2 border-b border-white/[0.04] last:border-0">
                        <span className="text-lg flex-shrink-0">{gt.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-surface-200 truncate">{game.title}</p>
                          <div className="flex items-center gap-2 text-[10px] text-surface-500 mt-0.5">
                            <span>{game.played} played</span>
                            <span>·</span>
                            <span className="text-success-400">{game.avgScore}% avg</span>
                          </div>
                        </div>
                        <span className="text-[10px] text-surface-600">{game.date}</span>
                      </div>
                    </StaggerItem>
                  )
                })}
              </StaggerList>
            </div>
          </FadeUp>
        </div>
      </div>
    </div>
  )
}
