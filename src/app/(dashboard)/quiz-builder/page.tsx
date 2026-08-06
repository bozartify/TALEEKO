'use client'
import { useState } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import {
  ClipboardList, Sparkles, Plus, Trash2, Copy, GripVertical,
  ChevronDown, Eye, Download, Share2, Save, CheckCircle,
  RotateCcw, ToggleLeft, AlignLeft, List, Hash, Star,
  Clock, Users, BookOpen, Brain, Zap, Check
} from 'lucide-react'
import { FadeUp, FadeInWhenVisible } from '@/components/ui/motion'

type QuestionType = 'mcq' | 'true-false' | 'short-answer' | 'matching' | 'fill-blank'

interface Question {
  id: string
  type: QuestionType
  text: string
  points: number
  options?: string[]
  correct?: number | boolean | string
  explanation?: string
}

const questionTypeConfig: Record<QuestionType, { label: string; icon: React.ElementType; color: string; desc: string }> = {
  mcq:          { label: 'Multiple Choice', icon: List,        color: '#6366f1', desc: '4 options, one correct' },
  'true-false': { label: 'True / False',    icon: ToggleLeft,  color: '#10b981', desc: 'Binary answer' },
  'short-answer': { label: 'Short Answer',  icon: AlignLeft,   color: '#f97316', desc: 'Free text response' },
  matching:     { label: 'Matching',        icon: Hash,        color: '#ec4899', desc: 'Match pairs' },
  'fill-blank': { label: 'Fill in Blank',   icon: Star,        color: '#22d3ee', desc: 'Complete the sentence' },
}

const initialQuestions: Question[] = [
  {
    id: 'q1',
    type: 'mcq',
    text: 'What is the primary source of energy for photosynthesis?',
    points: 2,
    options: ['Water', 'Sunlight', 'Carbon dioxide', 'Oxygen'],
    correct: 1,
    explanation: 'Sunlight provides the energy needed to convert CO₂ and H₂O into glucose.',
  },
  {
    id: 'q2',
    type: 'true-false',
    text: 'Plants release carbon dioxide as a byproduct of photosynthesis.',
    points: 1,
    correct: false,
    explanation: 'Plants release oxygen (O₂), not CO₂. CO₂ is consumed during photosynthesis.',
  },
  {
    id: 'q3',
    type: 'mcq',
    text: 'In which part of the plant cell does photosynthesis primarily take place?',
    points: 2,
    options: ['Mitochondria', 'Nucleus', 'Chloroplast', 'Cell membrane'],
    correct: 2,
    explanation: 'Chloroplasts contain chlorophyll and are the site of photosynthesis.',
  },
  {
    id: 'q4',
    type: 'short-answer',
    text: 'Write and explain the overall chemical equation for photosynthesis.',
    points: 4,
    explanation: '6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂. Carbon dioxide and water are converted to glucose and oxygen using light energy.',
  },
  {
    id: 'q5',
    type: 'fill-blank',
    text: 'The green pigment in plants that absorbs light for photosynthesis is called ________.',
    points: 2,
    correct: 'chlorophyll',
    explanation: 'Chlorophyll is the primary photosynthetic pigment found in chloroplasts.',
  },
]

const recentQuizzes = [
  { title: 'Cell Biology Mid-Unit', questions: 15, time: '30 min', avg: 82, date: 'Jul 28' },
  { title: 'American Revolution', questions: 20, time: '40 min', avg: 76, date: 'Jul 22' },
  { title: 'Algebra: Systems Quiz', questions: 12, time: '25 min', avg: 88, date: 'Jul 18' },
]

export default function QuizBuilderPage() {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions)
  const [expandedQ, setExpandedQ] = useState<string | null>('q1')
  const [generating, setGenerating] = useState(false)
  const [saved, setSaved] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [topic, setTopic] = useState('Photosynthesis')
  const [grade, setGrade] = useState('7th Grade')
  const [subject, setSubject] = useState('Biology')
  const [timeLimit, setTimeLimit] = useState('30')
  const [currentPreviewQ, setCurrentPreviewQ] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)

  const totalPoints = questions.reduce((a, q) => a + q.points, 0)
  const [toastMsg, setToastMsg] = useState('')
  function showToast(msg: string) {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 2500)
  }

  function handleGenerate() {
    setGenerating(true)
    setTimeout(() => setGenerating(false), 3000)
  }

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function handleDeleteQuestion(id: string) {
    setQuestions(qs => qs.filter(q => q.id !== id))
    if (expandedQ === id) setExpandedQ(null)
  }

  function handleDuplicateQuestion(id: string) {
    const q = questions.find(q => q.id === id)
    if (!q) return
    const newQ = { ...q, id: `q${Date.now()}` }
    const idx = questions.findIndex(q => q.id === id)
    const next = [...questions]
    next.splice(idx + 1, 0, newQ)
    setQuestions(next)
  }

  function addQuestion(type: QuestionType) {
    const newQ: Question = {
      id: `q${Date.now()}`,
      type,
      text: '',
      points: type === 'short-answer' ? 4 : type === 'mcq' ? 2 : 1,
      options: type === 'mcq' ? ['', '', '', ''] : undefined,
      correct: type === 'mcq' ? 0 : type === 'true-false' ? true : '',
    }
    setQuestions(qs => [...qs, newQ])
    setExpandedQ(newQ.id)
  }

  const previewQ = questions[currentPreviewQ]

  if (previewMode) {
    return (
      <div className="space-y-6">
        <FadeUp>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => { setPreviewMode(false); setCurrentPreviewQ(0); setSelectedAnswer(null); setShowExplanation(false) }}
                className="btn-secondary text-xs px-3 py-1.5"
              >
                ← Back to Editor
              </button>
              <div>
                <h2 className="text-xl font-black text-white">{topic}</h2>
                <p className="text-xs text-surface-400">Preview Mode · {questions.length} questions · {totalPoints} pts</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06]">
              <Clock className="w-4 h-4 text-surface-400" />
              <span className="text-sm font-bold text-white">{timeLimit}:00</span>
            </div>
          </div>
        </FadeUp>

        <FadeUp delay={0.05}>
          <div className="flex items-center gap-2 mb-2">
            {questions.map((_, i) => (
              <button
                key={i}
                onClick={() => { setCurrentPreviewQ(i); setSelectedAnswer(null); setShowExplanation(false) }}
                className={`w-7 h-7 rounded-full text-[11px] font-bold transition-all ${
                  i === currentPreviewQ
                    ? 'bg-accent-500 text-white'
                    : 'bg-white/[0.06] text-surface-400 hover:bg-white/[0.1]'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </FadeUp>

        <FadeUp delay={0.08}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPreviewQ}
              className="glass-card p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-surface-500">Question {currentPreviewQ + 1} of {questions.length}</span>
                <span className="text-xs font-bold text-accent-400">{previewQ.points} pts</span>
              </div>
              <h3 className="text-base font-bold text-white mb-6 leading-relaxed">{previewQ.text}</h3>

              {previewQ.type === 'mcq' && previewQ.options && (
                <div className="space-y-2.5">
                  {previewQ.options.map((opt, oi) => (
                    <motion.button
                      key={oi}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                        selectedAnswer === oi
                          ? showExplanation && oi === previewQ.correct
                            ? 'border-success-400/40 bg-success-400/10'
                            : showExplanation && oi !== previewQ.correct
                            ? 'border-danger-400/30 bg-danger-400/10'
                            : 'border-accent-500/40 bg-accent-500/10'
                          : showExplanation && oi === previewQ.correct
                          ? 'border-success-400/30 bg-success-400/[0.06]'
                          : 'border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.03]'
                      }`}
                      onClick={() => { if (!showExplanation) setSelectedAnswer(oi) }}
                      whileHover={!showExplanation ? { x: 2 } : {}}
                    >
                      <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                        selectedAnswer === oi ? 'border-accent-500 bg-accent-500 text-white' : 'border-white/[0.2] text-surface-400'
                      }`}>
                        {String.fromCharCode(65 + oi)}
                      </div>
                      <span className="text-sm text-surface-200">{opt}</span>
                      {showExplanation && oi === previewQ.correct && (
                        <CheckCircle className="w-4 h-4 text-success-400 ml-auto flex-shrink-0" />
                      )}
                    </motion.button>
                  ))}
                </div>
              )}

              {previewQ.type === 'true-false' && (
                <div className="flex gap-3">
                  {[true, false].map(val => (
                    <motion.button
                      key={String(val)}
                      className={`flex-1 p-4 rounded-xl border text-center transition-all ${
                        selectedAnswer === (val ? 1 : 0)
                          ? 'border-accent-500/40 bg-accent-500/10 text-white'
                          : 'border-white/[0.06] text-surface-300 hover:border-white/[0.12]'
                      }`}
                      onClick={() => setSelectedAnswer(val ? 1 : 0)}
                      whileHover={{ y: -2 }}
                    >
                      <span className="text-sm font-bold">{val ? 'True' : 'False'}</span>
                    </motion.button>
                  ))}
                </div>
              )}

              {(previewQ.type === 'short-answer' || previewQ.type === 'fill-blank') && (
                <textarea
                  className="w-full p-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-surface-600 focus:outline-none focus:border-accent-500/40 resize-none"
                  placeholder={previewQ.type === 'fill-blank' ? 'Type your answer...' : 'Write your answer here...'}
                  rows={4}
                />
              )}

              {showExplanation && previewQ.explanation && (
                <motion.div
                  className="mt-4 p-4 rounded-xl bg-success-400/10 border border-success-400/20"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Brain className="w-3.5 h-3.5 text-success-400" />
                    <span className="text-xs font-bold text-success-400">Explanation</span>
                  </div>
                  <p className="text-xs text-surface-300 leading-relaxed">{previewQ.explanation}</p>
                </motion.div>
              )}

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/[0.06]">
                <button
                  onClick={() => { setCurrentPreviewQ(i => Math.max(0, i - 1)); setSelectedAnswer(null); setShowExplanation(false) }}
                  className="btn-secondary text-xs px-4"
                  disabled={currentPreviewQ === 0}
                >
                  Previous
                </button>
                <div className="flex items-center gap-2">
                  {selectedAnswer !== null && !showExplanation && (
                    <button
                      onClick={() => setShowExplanation(true)}
                      className="btn-secondary text-xs px-4"
                    >
                      <Check className="w-3 h-3" /> Check Answer
                    </button>
                  )}
                  <button
                    onClick={() => { setCurrentPreviewQ(i => Math.min(questions.length - 1, i + 1)); setSelectedAnswer(null); setShowExplanation(false) }}
                    className="btn-gradient text-xs px-4"
                    disabled={currentPreviewQ === questions.length - 1}
                  >
                    Next →
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </FadeUp>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <FadeUp>
        <div className="hero-mesh rounded-3xl p-6 border border-white/[0.06]">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg,#f97316,#ef4444)' }}>
                <ClipboardList className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-black text-white tracking-tight">Quiz Builder</h1>
                  <span className="text-[10px] bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full font-bold border border-orange-500/20">AI-Powered</span>
                </div>
                <p className="text-sm text-surface-400">Build interactive quizzes with AI-generated questions and live preview mode</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
              <button className="btn-secondary text-xs px-3 py-1.5" onClick={() => setPreviewMode(true)}>
                <Eye className="w-3.5 h-3.5" /> Preview
              </button>
              <motion.button className="btn-gradient text-xs" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleGenerate} disabled={generating}>
                {generating ? (
                  <><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}><Sparkles className="w-3.5 h-3.5" /></motion.div> Generating...</>
                ) : (
                  <><Sparkles className="w-3.5 h-3.5" /> AI Generate</>
                )}
              </motion.button>
              <button className="btn-secondary text-xs px-3 py-1.5" onClick={handleSave}>
                {saved ? <CheckCircle className="w-3.5 h-3.5 text-success-400" /> : <Save className="w-3.5 h-3.5" />}
                {saved ? 'Saved!' : 'Save'}
              </button>
              <button className="btn-secondary text-xs px-3 py-1.5" onClick={() => showToast('Quiz exported as PDF')}>
                <Download className="w-3.5 h-3.5" />
              </button>
              <button className="btn-secondary text-xs px-3 py-1.5" onClick={() => showToast('Share link copied!')}>
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="border-t border-white/[0.06] pt-4 flex items-center gap-6 flex-wrap">
            {[
              { label: 'Questions', value: `${questions.length}` },
              { label: 'Total Points', value: `${totalPoints}` },
              { label: 'Time Limit', value: `${timeLimit}m` },
              { label: 'Topic', value: topic },
              { label: 'Grade', value: grade },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-2">
                <span className="text-lg font-black text-white">{s.value}</span>
                <span className="text-xs text-surface-500">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </FadeUp>

      {/* Generating overlay */}
      <AnimatePresence>
        {generating && (
          <motion.div
            className="glass-card p-8 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <motion.div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: 'linear-gradient(135deg, #f97316, #ef4444)' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="w-7 h-7 text-white" />
            </motion.div>
            <h3 className="text-lg font-black text-white mb-1">AI is building your quiz...</h3>
            <p className="text-sm text-surface-400 mb-4">Generating questions on {topic} for {grade}</p>
            <motion.div className="w-64 h-1.5 bg-white/[0.06] rounded-full mx-auto overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #f97316, #ef4444)' }}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 3, ease: 'linear' }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!generating && (
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6">
          <div className="space-y-5">
            {/* Quiz Settings */}
            <FadeUp delay={0.05}>
              <div className="glass-card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-orange-500/15">
                    <ClipboardList className="w-3.5 h-3.5 text-orange-400" />
                  </div>
                  <span className="text-sm font-bold text-white">Quiz Settings</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: 'Topic', value: topic, setter: setTopic },
                    { label: 'Subject', value: subject, setter: setSubject },
                    { label: 'Grade Level', value: grade, setter: setGrade },
                    { label: 'Time (min)', value: timeLimit, setter: setTimeLimit, type: 'number' },
                  ].map(field => (
                    <div key={field.label}>
                      <label className="text-[10px] font-semibold text-surface-500 uppercase tracking-wider block mb-1">{field.label}</label>
                      <input
                        type={field.type || 'text'}
                        value={field.value}
                        onChange={e => field.setter(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-surface-500 focus:outline-none focus:border-accent-500/40 transition-all"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </FadeUp>

            {/* Stats */}
            <FadeUp delay={0.07}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Questions', value: questions.length, icon: ClipboardList, color: '#f97316' },
                  { label: 'Total Points', value: totalPoints, icon: Star, color: '#f59e0b' },
                  { label: 'Avg per Q', value: `${(totalPoints / Math.max(questions.length, 1)).toFixed(1)}`, icon: Hash, color: '#6366f1' },
                  { label: 'Time Limit', value: `${timeLimit}m`, icon: Clock, color: '#10b981' },
                ].map((s, i) => (
                  <motion.div
                    key={s.label}
                    className="glass-card p-4"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ backgroundColor: s.color + '18' }}>
                        <s.icon className="w-3 h-3" style={{ color: s.color }} />
                      </div>
                      <span className="text-[10px] text-surface-400">{s.label}</span>
                    </div>
                    <p className="text-xl font-black text-white">{s.value}</p>
                  </motion.div>
                ))}
              </div>
            </FadeUp>

            {/* Questions List */}
            <FadeUp delay={0.1}>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-white">Questions</h3>
                  <span className="text-xs text-surface-500">Drag to reorder</span>
                </div>

                <Reorder.Group axis="y" values={questions} onReorder={setQuestions} className="space-y-3">
                  {questions.map((q, qi) => {
                    const cfg = questionTypeConfig[q.type]
                    const TypeIcon = cfg.icon
                    const isExpanded = expandedQ === q.id
                    return (
                      <Reorder.Item key={q.id} value={q}>
                        <motion.div
                          className="glass-card overflow-hidden"
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: qi * 0.04 }}
                        >
                          <div className="flex items-center gap-3 px-5 py-4">
                            <div className="cursor-grab active:cursor-grabbing flex-shrink-0">
                              <GripVertical className="w-4 h-4 text-surface-600 hover:text-surface-400 transition-colors" />
                            </div>
                            <div
                              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-[11px] font-bold text-white"
                              style={{ background: `linear-gradient(135deg, ${cfg.color}, ${cfg.color}99)` }}
                            >
                              {qi + 1}
                            </div>
                            <button
                              className="flex-1 text-left min-w-0"
                              onClick={() => setExpandedQ(isExpanded ? null : q.id)}
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1"
                                  style={{ backgroundColor: cfg.color + '18', color: cfg.color }}>
                                  <TypeIcon className="w-2.5 h-2.5" />
                                  {cfg.label}
                                </span>
                                <span className="text-[10px] font-bold text-surface-500">{q.points} pts</span>
                              </div>
                              <p className="text-sm text-white mt-0.5 truncate">
                                {q.text || <span className="text-surface-600 italic">Click to add question text...</span>}
                              </p>
                            </button>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <button
                                className="w-7 h-7 rounded-lg flex items-center justify-center text-surface-500 hover:text-surface-300 hover:bg-white/[0.04] transition-all"
                                onClick={() => handleDuplicateQuestion(q.id)}
                                title="Duplicate"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                              <button
                                className="w-7 h-7 rounded-lg flex items-center justify-center text-surface-500 hover:text-danger-400 hover:bg-danger-400/10 transition-all"
                                onClick={() => handleDeleteQuestion(q.id)}
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                              <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                                <button onClick={() => setExpandedQ(isExpanded ? null : q.id)}>
                                  <ChevronDown className="w-4 h-4 text-surface-500" />
                                </button>
                              </motion.div>
                            </div>
                          </div>

                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.22 }}
                                className="overflow-hidden"
                              >
                                <div className="px-5 pb-5 pt-3 border-t border-white/[0.05] space-y-4">
                                  {/* Question text */}
                                  <div>
                                    <label className="text-[10px] font-semibold text-surface-500 uppercase tracking-wider block mb-1.5">Question</label>
                                    <textarea
                                      value={q.text}
                                      onChange={e => setQuestions(qs => qs.map(item => item.id === q.id ? { ...item, text: e.target.value } : item))}
                                      rows={2}
                                      className="w-full px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.07] text-sm text-white placeholder:text-surface-600 focus:outline-none focus:border-accent-500/30 resize-none transition-all"
                                      placeholder="Enter your question here..."
                                    />
                                  </div>

                                  {/* MCQ Options */}
                                  {q.type === 'mcq' && q.options && (
                                    <div>
                                      <label className="text-[10px] font-semibold text-surface-500 uppercase tracking-wider block mb-1.5">Answer Options</label>
                                      <div className="space-y-2">
                                        {q.options.map((opt, oi) => (
                                          <div key={oi} className="flex items-center gap-2">
                                            <button
                                              onClick={() => setQuestions(qs => qs.map(item => item.id === q.id ? { ...item, correct: oi } : item))}
                                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold flex-shrink-0 transition-all ${
                                                q.correct === oi ? 'border-success-400 bg-success-400 text-white' : 'border-white/[0.2] text-surface-500'
                                              }`}
                                              title="Mark as correct"
                                            >
                                              {String.fromCharCode(65 + oi)}
                                            </button>
                                            <input
                                              value={opt}
                                              onChange={e => {
                                                const newOpts = [...q.options!]
                                                newOpts[oi] = e.target.value
                                                setQuestions(qs => qs.map(item => item.id === q.id ? { ...item, options: newOpts } : item))
                                              }}
                                              className={`flex-1 px-3 py-2 rounded-xl bg-white/[0.03] border text-sm text-white placeholder:text-surface-600 focus:outline-none transition-all ${
                                                q.correct === oi ? 'border-success-400/30 bg-success-400/[0.06]' : 'border-white/[0.06] focus:border-accent-500/30'
                                              }`}
                                              placeholder={`Option ${String.fromCharCode(65 + oi)}`}
                                            />
                                          </div>
                                        ))}
                                        <p className="text-[10px] text-surface-600">Click a letter to mark the correct answer</p>
                                      </div>
                                    </div>
                                  )}

                                  {/* True/False */}
                                  {q.type === 'true-false' && (
                                    <div>
                                      <label className="text-[10px] font-semibold text-surface-500 uppercase tracking-wider block mb-1.5">Correct Answer</label>
                                      <div className="flex gap-2">
                                        {[true, false].map(val => (
                                          <button
                                            key={String(val)}
                                            onClick={() => setQuestions(qs => qs.map(item => item.id === q.id ? { ...item, correct: val } : item))}
                                            className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all ${
                                              q.correct === val ? 'border-success-400 bg-success-400/15 text-success-400' : 'border-white/[0.08] text-surface-400 hover:border-white/[0.15]'
                                            }`}
                                          >
                                            {val ? 'True' : 'False'}
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Points + Explanation */}
                                  <div className="grid grid-cols-2 gap-3">
                                    <div>
                                      <label className="text-[10px] font-semibold text-surface-500 uppercase tracking-wider block mb-1.5">Points</label>
                                      <input
                                        type="number"
                                        value={q.points}
                                        onChange={e => setQuestions(qs => qs.map(item => item.id === q.id ? { ...item, points: parseInt(e.target.value) || 0 } : item))}
                                        className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.07] text-sm text-white focus:outline-none focus:border-accent-500/30 transition-all"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[10px] font-semibold text-surface-500 uppercase tracking-wider block mb-1.5">Explanation (optional)</label>
                                      <input
                                        value={q.explanation || ''}
                                        onChange={e => setQuestions(qs => qs.map(item => item.id === q.id ? { ...item, explanation: e.target.value } : item))}
                                        className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.07] text-sm text-white placeholder:text-surface-600 focus:outline-none focus:border-accent-500/30 transition-all"
                                        placeholder="Add answer explanation..."
                                      />
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2 pt-1">
                                    <button
                                      className="flex items-center gap-1.5 text-[11px] text-accent-400 hover:text-accent-300 transition-colors"
                                      onClick={() => showToast('AI regenerating question…')}
                                    >
                                      <RotateCcw className="w-3 h-3" /> Regenerate with AI
                                    </button>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      </Reorder.Item>
                    )
                  })}
                </Reorder.Group>

                {/* Add Question */}
                <div className="mt-4">
                  <p className="text-xs font-semibold text-surface-400 mb-3">Add Question</p>
                  <div className="flex flex-wrap gap-2">
                    {(Object.entries(questionTypeConfig) as [QuestionType, typeof questionTypeConfig[QuestionType]][]).map(([type, cfg]) => {
                      const Icon = cfg.icon
                      return (
                        <motion.button
                          key={type}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/[0.06] bg-white/[0.03] text-xs font-medium text-surface-300 hover:border-white/[0.12] hover:bg-white/[0.06] hover:text-white transition-all"
                          onClick={() => addQuestion(type)}
                          whileHover={{ y: -1 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ backgroundColor: cfg.color + '20' }}>
                            <Icon className="w-3 h-3" style={{ color: cfg.color }} />
                          </div>
                          {cfg.label}
                        </motion.button>
                      )
                    })}
                    <motion.button
                      className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/[0.06] bg-white/[0.03] text-xs font-medium text-surface-300 hover:border-white/[0.12] hover:bg-white/[0.06] hover:text-white transition-all"
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Plus className="w-3.5 h-3.5" /> Blank
                    </motion.button>
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>

          {/* Right sidebar */}
          <div className="space-y-4">
            {/* AI Generate Settings */}
            <FadeInWhenVisible delay={0.1}>
              <div className="glass-card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-accent-500/15">
                    <Brain className="w-3.5 h-3.5 text-accent-400" />
                  </div>
                  <span className="text-sm font-bold text-white">AI Options</span>
                </div>
                <div className="space-y-3">
                  {[
                    { label: '# of Questions', value: '10', type: 'number' },
                    { label: 'Difficulty', value: 'Mixed', type: 'select', opts: ['Easy', 'Medium', 'Hard', 'Mixed'] },
                    { label: 'Bloom\'s Level', value: 'Apply', type: 'select', opts: ['Remember', 'Understand', 'Apply', 'Analyze'] },
                  ].map(opt => (
                    <div key={opt.label}>
                      <label className="text-[10px] font-semibold text-surface-500 uppercase tracking-wider block mb-1">{opt.label}</label>
                      {opt.type === 'select' ? (
                        <select className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-accent-500/40 transition-all appearance-none">
                          {opt.opts?.map(o => <option key={o} value={o} className="bg-surface-800">{o}</option>)}
                        </select>
                      ) : (
                        <input
                          type={opt.type}
                          defaultValue={opt.value}
                          className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-accent-500/40 transition-all"
                        />
                      )}
                    </div>
                  ))}
                  <motion.button
                    className="btn-gradient text-xs w-full justify-center mt-1"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleGenerate}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Generate Quiz
                  </motion.button>
                </div>
              </div>
            </FadeInWhenVisible>

            {/* Question Type Breakdown */}
            <FadeInWhenVisible delay={0.15}>
              <div className="glass-card p-5">
                <p className="text-xs font-bold text-surface-300 mb-3">Question Types</p>
                <div className="space-y-2.5">
                  {(Object.entries(questionTypeConfig) as [QuestionType, typeof questionTypeConfig[QuestionType]][]).map(([type, cfg]) => {
                    const count = questions.filter(q => q.type === type).length
                    const pct = Math.round((count / Math.max(questions.length, 1)) * 100)
                    return (
                      <div key={type}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] text-surface-400">{cfg.label}</span>
                          <span className="text-[11px] font-bold" style={{ color: cfg.color }}>{count}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: cfg.color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ delay: 0.3, duration: 0.4 }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </FadeInWhenVisible>

            {/* Assign */}
            <FadeInWhenVisible delay={0.2}>
              <div className="glass-card p-5">
                <p className="text-xs font-bold text-surface-300 mb-3">Assign Quiz</p>
                <div className="space-y-2">
                  {[
                    { label: '7th Grade Biology', students: 28, icon: Users, color: '#6366f1' },
                    { label: '8th Grade Science', students: 24, icon: BookOpen, color: '#10b981' },
                    { label: 'AP Biology', students: 18, icon: Zap, color: '#f97316' },
                  ].map(cls => (
                    <motion.button
                      key={cls.label}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-white/[0.06] hover:border-accent-500/30 hover:bg-accent-500/[0.04] transition-all group"
                      whileHover={{ x: 2 }}
                      onClick={() => showToast(`Quiz assigned to ${cls.label}`)}
                    >
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: cls.color + '18' }}>
                        <cls.icon className="w-3.5 h-3.5" style={{ color: cls.color }} />
                      </div>
                      <div className="text-left flex-1">
                        <p className="text-xs font-semibold text-white">{cls.label}</p>
                        <p className="text-[10px] text-surface-500">{cls.students} students</p>
                      </div>
                      <Plus className="w-3.5 h-3.5 text-surface-600 group-hover:text-accent-400 transition-colors" />
                    </motion.button>
                  ))}
                </div>
              </div>
            </FadeInWhenVisible>

            {/* Recent Quizzes */}
            <FadeInWhenVisible delay={0.25}>
              <div className="glass-card p-5">
                <p className="text-xs font-bold text-surface-300 mb-3">Recent Quizzes</p>
                <div className="space-y-3">
                  {recentQuizzes.map((qz, i) => (
                    <motion.div
                      key={qz.title}
                      className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:border-white/[0.09] transition-all cursor-pointer"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                      whileHover={{ x: 2 }}
                      onClick={() => showToast(`Opening "${qz.title}"…`)}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-semibold text-white truncate">{qz.title}</p>
                        <span className="text-[10px] text-success-400 font-bold ml-1 flex-shrink-0">{qz.avg}%</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-surface-500">
                        <span>{qz.questions}Q</span>
                        <span>·</span>
                        <span>{qz.time}</span>
                        <span>·</span>
                        <span>{qz.date}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </FadeInWhenVisible>
          </div>
        </div>
      )}

      <AnimatePresence>
        {toastMsg && (
          <motion.div
            className="fixed top-5 right-5 z-[100] flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border border-white/[0.08]"
            style={{ background: 'linear-gradient(135deg,#0a0f1a,#111827)' }}
            initial={{ opacity: 0, y: -16, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 400, damping: 28 } }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
          >
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span className="text-sm text-white font-medium">{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
