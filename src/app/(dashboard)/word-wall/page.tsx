'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen, Plus, Sparkles, Search, Star, Globe, Download,
  Share2, ChevronDown, ChevronUp, Trash2, Brain, Zap, Check,
  Volume2, RefreshCw, Copy, Filter, Tag, List, Grid3X3
} from 'lucide-react'
import { FadeUp, FadeInWhenVisible } from '@/components/ui/motion'

interface VocabWord {
  id: string
  word: string
  partOfSpeech: string
  definition: string
  example: string
  etymology?: string
  synonyms: string[]
  color: string
  unit: string
  mastery: number
  starred: boolean
}

const vocabWords: VocabWord[] = [
  {
    id: 'w1', word: 'Photosynthesis', partOfSpeech: 'noun', color: '#10b981', unit: 'Unit 1: Cell Biology',
    definition: 'The process by which green plants and other organisms use sunlight, water, and carbon dioxide to produce food (glucose) and oxygen.',
    example: 'During photosynthesis, the plant converts light energy into chemical energy stored in glucose molecules.',
    etymology: 'Greek: photo (light) + synthesis (putting together)',
    synonyms: ['carbon fixation', 'autotrophic nutrition'],
    mastery: 78, starred: true,
  },
  {
    id: 'w2', word: 'Chloroplast', partOfSpeech: 'noun', color: '#6366f1', unit: 'Unit 1: Cell Biology',
    definition: 'A specialized organelle found in plant cells that contains chlorophyll and is responsible for photosynthesis.',
    example: 'Under the microscope, we could clearly see the oval-shaped chloroplasts within the Elodea leaf cell.',
    etymology: 'Greek: chloro (green) + plastos (formed)',
    synonyms: ['plastid'],
    mastery: 65, starred: false,
  },
  {
    id: 'w3', word: 'Osmosis', partOfSpeech: 'noun', color: '#f97316', unit: 'Unit 1: Cell Biology',
    definition: 'The movement of water molecules through a semi-permeable membrane from an area of higher water concentration to an area of lower water concentration.',
    example: 'The wilting of a plant placed in saltwater demonstrates osmosis — water moves out of the cells into the surrounding solution.',
    etymology: 'Greek: osmos (push, thrust)',
    synonyms: ['diffusion (of water)', 'passive transport'],
    mastery: 82, starred: true,
  },
  {
    id: 'w4', word: 'Mitosis', partOfSpeech: 'noun', color: '#ec4899', unit: 'Unit 1: Cell Biology',
    definition: 'A type of cell division in which one cell divides to produce two genetically identical daughter cells, each with the same number of chromosomes as the parent cell.',
    example: 'Mitosis allows our bodies to grow and replace damaged cells — skin cells, for instance, undergo mitosis approximately every 2–3 weeks.',
    etymology: 'Greek: mitos (thread) — referring to the thread-like chromosomes',
    synonyms: ['somatic cell division', 'cell replication'],
    mastery: 91, starred: false,
  },
  {
    id: 'w5', word: 'Catalyst', partOfSpeech: 'noun', color: '#22d3ee', unit: 'Unit 2: Chemistry Basics',
    definition: 'A substance that increases the rate of a chemical reaction without being consumed or permanently changed in the process.',
    example: 'Enzymes act as biological catalysts, speeding up reactions in the body that would otherwise take too long to sustain life.',
    etymology: 'Greek: kataluein (to dissolve)',
    synonyms: ['enzyme (biological)', 'accelerant'],
    mastery: 55, starred: false,
  },
  {
    id: 'w6', word: 'Ecosystem', partOfSpeech: 'noun', color: '#8b5cf6', unit: 'Unit 3: Ecology',
    definition: 'A community of living organisms interacting with each other and their physical environment as a system.',
    example: 'A pond ecosystem includes fish, algae, bacteria, water, sunlight, and nutrients — all interacting in a complex web.',
    etymology: 'Greek: oikos (house) + system (organized whole)',
    synonyms: ['biome', 'ecological community', 'habitat'],
    mastery: 88, starred: true,
  },
  {
    id: 'w7', word: 'Adaptation', partOfSpeech: 'noun', color: '#f59e0b', unit: 'Unit 3: Ecology',
    definition: 'A feature of an organism that has evolved to help it survive and reproduce in its particular environment.',
    example: 'The polar bear\'s thick white fur is an adaptation that provides insulation and camouflage in arctic environments.',
    etymology: 'Latin: adaptare (to fit to)',
    synonyms: ['evolutionary trait', 'specialization', 'fitness'],
    mastery: 72, starred: false,
  },
  {
    id: 'w8', word: 'Hypothesis', partOfSpeech: 'noun', color: '#ef4444', unit: 'Unit 0: Scientific Method',
    definition: 'A testable, falsifiable prediction or explanation for an observed phenomenon, proposed as a starting point for scientific investigation.',
    example: 'Our hypothesis was that increasing light intensity would increase the rate of photosynthesis — we then designed an experiment to test this.',
    etymology: 'Greek: hypo (under) + thesis (placing) — a proposition placed as a basis for reasoning',
    synonyms: ['conjecture', 'supposition', 'prediction'],
    mastery: 95, starred: true,
  },
]

const units = ['All Units', 'Unit 0: Scientific Method', 'Unit 1: Cell Biology', 'Unit 2: Chemistry Basics', 'Unit 3: Ecology']

type ViewMode = 'wall' | 'list' | 'flashcard'

export default function WordWallPage() {
  const [words, setWords] = useState<VocabWord[]>(vocabWords)
  const [expandedWord, setExpandedWord] = useState<string | null>(null)
  const [view, setView] = useState<ViewMode>('wall')
  const [search, setSearch] = useState('')
  const [unitFilter, setUnitFilter] = useState('All Units')
  const [flashcardIdx, setFlashcardIdx] = useState(0)
  const [flashcardFlipped, setFlashcardFlipped] = useState(false)
  const [addingWord, setAddingWord] = useState(false)
  const [newWord, setNewWord] = useState('')

  const filtered = words.filter(w => {
    const matchSearch = !search || w.word.toLowerCase().includes(search.toLowerCase()) || w.definition.toLowerCase().includes(search.toLowerCase())
    const matchUnit = unitFilter === 'All Units' || w.unit === unitFilter
    return matchSearch && matchUnit
  })

  const avgMastery = Math.round(words.reduce((a, w) => a + w.mastery, 0) / words.length)
  const starred = words.filter(w => w.starred).length

  function toggleStar(id: string) {
    setWords(ws => ws.map(w => w.id === id ? { ...w, starred: !w.starred } : w))
  }

  function deleteWord(id: string) {
    setWords(ws => ws.filter(w => w.id !== id))
  }

  const flashWords = filtered
  const flashWord = flashWords[flashcardIdx % Math.max(flashWords.length, 1)]

  return (
    <div className="space-y-6">
      <FadeUp>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
              whileHover={{ rotate: 8, scale: 1.08 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <BookOpen className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h2 className="text-xl font-black text-white">Word Wall</h2>
              <p className="text-xs text-surface-400">{words.length} vocabulary words · AI definitions · Flashcard mode</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              className="btn-gradient text-xs"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setAddingWord(true)}
            >
              <Sparkles className="w-3.5 h-3.5" />
              AI Add Words
            </motion.button>
            <button className="btn-secondary text-xs px-3 py-1.5">
              <Download className="w-3.5 h-3.5" />
              Export
            </button>
            <button className="btn-secondary text-xs px-3 py-1.5">
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </FadeUp>

      {/* Stats */}
      <FadeUp delay={0.04}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Total Words', value: words.length, icon: BookOpen, color: '#10b981' },
            { label: 'Class Mastery', value: `${avgMastery}%`, icon: Brain, color: '#6366f1' },
            { label: 'Starred', value: starred, icon: Star, color: '#f59e0b' },
            { label: 'Units', value: units.length - 1, icon: Tag, color: '#ec4899' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="glass-card p-4"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: stat.color + '18' }}>
                  <stat.icon className="w-3.5 h-3.5" style={{ color: stat.color }} />
                </div>
                <span className="text-xs text-surface-400">{stat.label}</span>
              </div>
              <p className="text-xl font-black text-white">{stat.value}</p>
            </motion.div>
          ))}
        </div>
      </FadeUp>

      {/* Add Word Modal */}
      <AnimatePresence>
        {addingWord && (
          <motion.div
            className="glass-card p-5"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-success-400" />
              <span className="text-sm font-bold text-white">AI Generate Vocabulary</span>
            </div>
            <div className="flex gap-3">
              <input
                value={newWord}
                onChange={e => setNewWord(e.target.value)}
                placeholder="Enter a word or topic (e.g. 'mitochondria' or 'ecology unit vocabulary')..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-surface-500 focus:outline-none focus:border-success-400/40 transition-all"
                autoFocus
              />
              <button
                className="btn-gradient text-xs px-4"
                onClick={() => { setAddingWord(false); setNewWord('') }}
              >
                <Sparkles className="w-3.5 h-3.5" /> Generate
              </button>
              <button className="btn-secondary text-xs px-3" onClick={() => setAddingWord(false)}>Cancel</button>
            </div>
            <p className="text-[10px] text-surface-500 mt-2">AI will generate: definition, example sentence, etymology, synonyms, and mastery exercises</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <FadeUp delay={0.07}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-surface-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search words or definitions..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm text-white placeholder:text-surface-500 focus:outline-none focus:border-success-400/30 transition-all"
            />
          </div>

          <select
            value={unitFilter}
            onChange={e => setUnitFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm text-surface-300 focus:outline-none appearance-none"
          >
            {units.map(u => <option key={u} value={u} className="bg-surface-800">{u}</option>)}
          </select>

          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.06]">
            {([
              { key: 'wall' as ViewMode, icon: Grid3X3, label: 'Wall' },
              { key: 'list' as ViewMode, icon: List, label: 'List' },
              { key: 'flashcard' as ViewMode, icon: BookOpen, label: 'Flashcards' },
            ]).map(opt => {
              const Icon = opt.icon
              return (
                <button
                  key={opt.key}
                  onClick={() => { setView(opt.key); setFlashcardFlipped(false); setFlashcardIdx(0) }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    view === opt.key ? 'bg-white/[0.1] text-white' : 'text-surface-400 hover:text-surface-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {opt.label}
                </button>
              )
            })}
          </div>
        </div>
      </FadeUp>

      {/* Word Wall View */}
      {view === 'wall' && (
        <FadeUp delay={0.09}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((word, i) => {
              const isExpanded = expandedWord === word.id
              return (
                <motion.div
                  key={word.id}
                  className="glass-card overflow-hidden"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  layout
                >
                  <div className="h-1" style={{ backgroundColor: word.color }} />
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-black text-white">{word.word}</h3>
                          <motion.button
                            onClick={() => toggleStar(word.id)}
                            whileTap={{ scale: 0.8 }}
                          >
                            <Star className={`w-3.5 h-3.5 transition-all ${word.starred ? 'fill-warning-400 text-warning-400' : 'text-surface-600 hover:text-warning-400'}`} />
                          </motion.button>
                        </div>
                        <span className="text-[10px] italic text-surface-500">{word.partOfSpeech}</span>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <div className="text-right">
                          <p className="text-xs font-black" style={{ color: word.color }}>{word.mastery}%</p>
                          <p className="text-[9px] text-surface-600">mastery</p>
                        </div>
                        <button
                          onClick={() => setExpandedWord(isExpanded ? null : word.id)}
                          className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-white/[0.06] transition-colors"
                        >
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-surface-500" /> : <ChevronDown className="w-3.5 h-3.5 text-surface-500" />}
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-surface-300 leading-relaxed mb-3">{word.definition}</p>

                    {/* Mastery bar */}
                    <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden mb-3">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: word.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${word.mastery}%` }}
                        transition={{ delay: 0.2 + i * 0.04, duration: 0.5 }}
                      />
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
                          <div className="space-y-3 pt-3 border-t border-white/[0.06]">
                            <div>
                              <p className="text-[10px] font-bold text-surface-500 uppercase tracking-wider mb-1">Example</p>
                              <p className="text-xs text-surface-300 leading-relaxed italic">&ldquo;{word.example}&rdquo;</p>
                            </div>
                            {word.etymology && (
                              <div>
                                <p className="text-[10px] font-bold text-surface-500 uppercase tracking-wider mb-1">Etymology</p>
                                <p className="text-xs text-surface-400">{word.etymology}</p>
                              </div>
                            )}
                            <div>
                              <p className="text-[10px] font-bold text-surface-500 uppercase tracking-wider mb-1">Synonyms</p>
                              <div className="flex flex-wrap gap-1">
                                {word.synonyms.map(s => (
                                  <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.06] text-surface-400">{s}</span>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 pt-1">
                              <button className="flex items-center gap-1 text-[11px] text-accent-400 hover:text-accent-300 transition-colors">
                                <Volume2 className="w-3 h-3" /> Pronounce
                              </button>
                              <button className="flex items-center gap-1 text-[11px] text-accent-400 hover:text-accent-300 transition-colors">
                                <Globe className="w-3 h-3" /> Translate
                              </button>
                              <button className="flex items-center gap-1 text-[11px] text-accent-400 hover:text-accent-300 transition-colors">
                                <RefreshCw className="w-3 h-3" /> Regenerate
                              </button>
                              <button
                                className="flex items-center gap-1 text-[11px] text-danger-400 hover:text-danger-300 transition-colors ml-auto"
                                onClick={() => deleteWord(word.id)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="text-[9px] px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: word.color + '18', color: word.color }}>
                        {word.unit.split(':')[0]}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )
            })}

            {/* Add Word Card */}
            <motion.button
              className="glass-card p-5 flex flex-col items-center justify-center gap-3 border-2 border-dashed border-white/[0.08] hover:border-success-400/30 hover:bg-success-400/[0.03] transition-all group min-h-[160px]"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setAddingWord(true)}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-success-400/15 group-hover:bg-success-400/25 transition-all">
                <Plus className="w-5 h-5 text-success-400" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-surface-300 group-hover:text-white transition-colors">Add Word</p>
                <p className="text-xs text-surface-500">or generate with AI</p>
              </div>
            </motion.button>
          </div>
        </FadeUp>
      )}

      {/* List View */}
      {view === 'list' && (
        <FadeUp delay={0.09}>
          <div className="glass-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left text-[10px] font-bold text-surface-400 uppercase tracking-wider px-5 py-3">Word</th>
                  <th className="text-left text-[10px] font-bold text-surface-400 uppercase tracking-wider px-5 py-3 hidden md:table-cell">Part of Speech</th>
                  <th className="text-left text-[10px] font-bold text-surface-400 uppercase tracking-wider px-5 py-3">Definition</th>
                  <th className="text-left text-[10px] font-bold text-surface-400 uppercase tracking-wider px-5 py-3 hidden lg:table-cell">Unit</th>
                  <th className="text-right text-[10px] font-bold text-surface-400 uppercase tracking-wider px-5 py-3">Mastery</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((word, i) => (
                  <motion.tr
                    key={word.id}
                    className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: word.color }} />
                        <span className="text-sm font-bold text-white">{word.word}</span>
                        {word.starred && <Star className="w-3 h-3 fill-warning-400 text-warning-400" />}
                      </div>
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell">
                      <span className="text-xs italic text-surface-500">{word.partOfSpeech}</span>
                    </td>
                    <td className="px-5 py-3 max-w-[300px]">
                      <p className="text-xs text-surface-400 truncate">{word.definition}</p>
                    </td>
                    <td className="px-5 py-3 hidden lg:table-cell">
                      <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: word.color + '15', color: word.color }}>{word.unit.split(':')[0]}</span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span className="text-xs font-bold" style={{ color: word.mastery >= 80 ? '#10b981' : word.mastery >= 60 ? '#6366f1' : '#f59e0b' }}>
                        {word.mastery}%
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </FadeUp>
      )}

      {/* Flashcard View */}
      {view === 'flashcard' && flashWord && (
        <FadeUp delay={0.09}>
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-surface-500">{flashcardIdx + 1} of {flashWords.length}</span>
              <div className="flex items-center gap-2">
                {flashWords.map((_, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === flashcardIdx ? 'bg-success-400 scale-125' : 'bg-white/[0.15]'}`} />
                ))}
              </div>
            </div>

            <motion.div
              className="glass-card p-10 cursor-pointer select-none min-h-[280px] flex flex-col items-center justify-center text-center"
              style={{ borderTop: `3px solid ${flashWord.color}` }}
              onClick={() => setFlashcardFlipped(f => !f)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.99 }}
            >
              <AnimatePresence mode="wait">
                {!flashcardFlipped ? (
                  <motion.div
                    key="front"
                    initial={{ opacity: 0, rotateY: -90 }}
                    animate={{ opacity: 1, rotateY: 0 }}
                    exit={{ opacity: 0, rotateY: 90 }}
                    className="space-y-3"
                  >
                    <span className="text-[10px] font-bold text-surface-500 uppercase tracking-widest">Tap to reveal definition</span>
                    <h2 className="text-4xl font-black text-white">{flashWord.word}</h2>
                    <span className="text-sm italic text-surface-400">{flashWord.partOfSpeech}</span>
                    {flashWord.etymology && (
                      <p className="text-xs text-surface-500">{flashWord.etymology}</p>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="back"
                    initial={{ opacity: 0, rotateY: -90 }}
                    animate={{ opacity: 1, rotateY: 0 }}
                    exit={{ opacity: 0, rotateY: 90 }}
                    className="space-y-4 max-w-lg"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: flashWord.color }}>Definition</span>
                    <p className="text-base text-white leading-relaxed">{flashWord.definition}</p>
                    <div className="pt-3 border-t border-white/[0.06]">
                      <p className="text-xs italic text-surface-400 leading-relaxed">&ldquo;{flashWord.example}&rdquo;</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <div className="flex items-center justify-between">
              <button
                className="btn-secondary text-xs px-4"
                onClick={() => { setFlashcardIdx(i => Math.max(0, i - 1)); setFlashcardFlipped(false) }}
                disabled={flashcardIdx === 0}
              >
                ← Previous
              </button>
              <div className="flex items-center gap-2">
                {flashcardFlipped && (
                  <>
                    <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-danger-400/30 text-xs font-semibold text-danger-400 hover:bg-danger-400/10 transition-all">
                      Still Learning
                    </button>
                    <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-success-400/20 border border-success-400/30 text-xs font-semibold text-success-400 hover:bg-success-400/30 transition-all">
                      <Check className="w-3.5 h-3.5" /> Got it!
                    </button>
                  </>
                )}
              </div>
              <button
                className="btn-gradient text-xs px-4"
                onClick={() => { setFlashcardIdx(i => Math.min(flashWords.length - 1, i + 1)); setFlashcardFlipped(false) }}
                disabled={flashcardIdx === flashWords.length - 1}
              >
                Next →
              </button>
            </div>
          </div>
        </FadeUp>
      )}

      {/* Class Mastery Summary */}
      <FadeInWhenVisible delay={0.15}>
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-accent-500/15">
                <Brain className="w-3.5 h-3.5 text-accent-400" />
              </div>
              <span className="text-sm font-bold text-white">Class Mastery Overview</span>
            </div>
            <span className="text-xs font-bold text-accent-400">{avgMastery}% average</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {words.slice(0, 8).map((word, i) => (
              <motion.div
                key={word.id}
                className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 + i * 0.04 }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-white truncate">{word.word}</span>
                  <span className="text-[10px] font-black" style={{ color: word.mastery >= 80 ? '#10b981' : word.mastery >= 60 ? '#6366f1' : '#f59e0b' }}>{word.mastery}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: word.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${word.mastery}%` }}
                    transition={{ delay: 0.3 + i * 0.04, duration: 0.4 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </FadeInWhenVisible>
    </div>
  )
}
