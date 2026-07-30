'use client'
import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  PenTool, Plus, ChevronRight, Star, Copy, Download, Trash2,
  Sparkles, Check, X, Edit3, Eye, BarChart2, BookOpen, Grid3X3
} from 'lucide-react'
import { FadeUp, StaggerList, StaggerItem, fadeUp } from '@/components/ui/motion'

const sampleRubrics = [
  {
    id: '1', title: 'Essay Writing Rubric', subject: 'English', grade: '10th',
    criteria: 4, levels: 4, lastUsed: 'Today', uses: 12, color: '#f43f5e',
    tags: ['Writing', 'Analytical'],
  },
  {
    id: '2', title: 'Lab Report Assessment', subject: 'Science', grade: '7th',
    criteria: 5, levels: 3, lastUsed: 'Yesterday', uses: 8, color: '#8b5cf6',
    tags: ['Lab', 'Scientific Method'],
  },
  {
    id: '3', title: 'Math Problem Solving', subject: 'Math', grade: '9th',
    criteria: 3, levels: 4, lastUsed: '3 days ago', uses: 15, color: '#14b8a6',
    tags: ['Problem Solving', 'Show Work'],
  },
  {
    id: '4', title: 'History Research Project', subject: 'History', grade: '8th',
    criteria: 6, levels: 4, lastUsed: '1 week ago', uses: 5, color: '#f97316',
    tags: ['Research', 'Citation'],
  },
  {
    id: '5', title: 'Oral Presentation Rubric', subject: 'Any', grade: 'All',
    criteria: 5, levels: 4, lastUsed: '2 weeks ago', uses: 20, color: '#6366f1',
    tags: ['Speaking', 'Communication'],
  },
  {
    id: '6', title: 'Group Project Collaboration', subject: 'Any', grade: 'All',
    criteria: 4, levels: 3, lastUsed: '2 weeks ago', uses: 9, color: '#ec4899',
    tags: ['Collaboration', 'Teamwork'],
  },
]

const rubricPreview = {
  criteria: ['Content & Ideas', 'Organization', 'Language & Style', 'Conventions'],
  levels: ['Exemplary (4)', 'Proficient (3)', 'Developing (2)', 'Beginning (1)'],
  cells: [
    ['Insightful thesis, compelling evidence, deep analysis', 'Clear thesis, sufficient evidence, solid analysis', 'Vague thesis, limited evidence, surface analysis', 'No clear thesis, minimal evidence'],
    ['Logical flow, smooth transitions, strong intro/conclusion', 'Generally organized, some transitions, adequate intro/conclusion', 'Inconsistent organization, few transitions', 'No clear structure, missing components'],
    ['Varied sentence structure, precise vocabulary, engaging voice', 'Adequate sentence variety, appropriate vocabulary', 'Simple sentences, basic vocabulary, inconsistent voice', 'Fragments/run-ons, limited vocabulary'],
    ['0-1 errors in grammar, spelling, punctuation', '2-4 errors in grammar, spelling, punctuation', '5-8 errors that may impede meaning', 'Numerous errors that significantly impede meaning'],
  ]
}

const templates = [
  { name: 'Essay / Writing', icon: '\u{1F4DD}', criteria: 4 },
  { name: 'Lab Report', icon: '\u{1F52C}', criteria: 5 },
  { name: 'Presentation', icon: '\u{1F3A4}', criteria: 5 },
  { name: 'Group Project', icon: '\u{1F465}', criteria: 4 },
  { name: 'Math Problem Set', icon: '\u{1F9EE}', criteria: 3 },
  { name: 'Art / Creative', icon: '\u{1F3A8}', criteria: 4 },
  { name: 'Research Paper', icon: '\u{1F4DA}', criteria: 6 },
  { name: 'Custom (AI-Generated)', icon: '\u{2728}', criteria: 0 },
]

/** Extract point value from level header like "Exemplary (4)" => 4 */
function getLevelPoints(levels: string[], index: number): number {
  const match = levels[index]?.match(/\((\d+)\)/)
  if (match) return parseInt(match[1], 10)
  return levels.length - index
}

type View = 'gallery' | 'preview'

export default function RubricsPage() {
  const [view, setView] = useState<View>('gallery')
  const [showTemplates, setShowTemplates] = useState(false)
  const [generating, setGenerating] = useState(false)

  // Editing state
  const [editing, setEditing] = useState(false)
  const [editableCriteria, setEditableCriteria] = useState<string[]>(rubricPreview.criteria)
  const [editableLevels, setEditableLevels] = useState<string[]>(rubricPreview.levels)
  const [editableCells, setEditableCells] = useState<string[][]>(rubricPreview.cells.map(r => [...r]))
  const [aiImproving, setAiImproving] = useState(false)

  // Snapshot for cancel
  const snapshotRef = useRef<{ criteria: string[]; levels: string[]; cells: string[][] } | null>(null)

  function handleGenerate() {
    setGenerating(true)
    setShowTemplates(false)
    setTimeout(() => {
      setGenerating(false)
      setView('preview')
    }, 2000)
  }

  function startEditing() {
    snapshotRef.current = {
      criteria: [...editableCriteria],
      levels: [...editableLevels],
      cells: editableCells.map(r => [...r]),
    }
    setEditing(true)
  }

  function cancelEditing() {
    if (snapshotRef.current) {
      setEditableCriteria(snapshotRef.current.criteria)
      setEditableLevels(snapshotRef.current.levels)
      setEditableCells(snapshotRef.current.cells)
    }
    setEditing(false)
  }

  function doneEditing() {
    snapshotRef.current = null
    setEditing(false)
  }

  function handleAiImprove() {
    setAiImproving(true)
    setTimeout(() => {
      // Simulate AI improvement: capitalize first letter and add polish wording
      setEditableCells(prev =>
        prev.map(row =>
          row.map(cell => {
            const trimmed = cell.trim()
            if (!trimmed) return trimmed
            return trimmed.charAt(0).toUpperCase() + trimmed.slice(1)
          })
        )
      )
      setAiImproving(false)
    }, 1500)
  }

  // Editable data helpers
  const updateCriterion = useCallback((index: number, value: string) => {
    setEditableCriteria(prev => { const next = [...prev]; next[index] = value; return next })
  }, [])

  const updateLevel = useCallback((index: number, value: string) => {
    setEditableLevels(prev => { const next = [...prev]; next[index] = value; return next })
  }, [])

  const updateCell = useCallback((ri: number, ci: number, value: string) => {
    setEditableCells(prev => {
      const next = prev.map(r => [...r])
      next[ri][ci] = value
      return next
    })
  }, [])

  function addCriterion() {
    setEditableCriteria(prev => [...prev, ''])
    setEditableCells(prev => [...prev, Array(editableLevels.length).fill('')])
  }

  function addLevel() {
    const newIndex = editableLevels.length
    setEditableLevels(prev => [...prev, `Level ${newIndex + 1}`])
    setEditableCells(prev => prev.map(row => [...row, '']))
  }

  function removeCriterion(index: number) {
    if (editableCriteria.length <= 2) return
    setEditableCriteria(prev => prev.filter((_, i) => i !== index))
    setEditableCells(prev => prev.filter((_, i) => i !== index))
  }

  function removeLevel(index: number) {
    if (editableLevels.length <= 2) return
    setEditableLevels(prev => prev.filter((_, i) => i !== index))
    setEditableCells(prev => prev.map(row => row.filter((_, i) => i !== index)))
  }

  // Compute total possible points
  const totalPoints = editableLevels.length > 0
    ? editableCriteria.length * getLevelPoints(editableLevels, 0)
    : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <FadeUp>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)' }}
              whileHover={{ rotate: 8, scale: 1.08 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <PenTool className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h2 className="text-xl font-black text-white">Rubric Builder</h2>
              <p className="text-xs text-surface-400">{sampleRubrics.length} rubrics · AI-powered assessment criteria</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-white/[0.06] rounded-full p-0.5">
              <button
                onClick={() => setView('gallery')}
                className={`p-1.5 rounded-full transition-all ${view === 'gallery' ? 'bg-white/[0.08] text-white' : 'text-surface-500'}`}
              >
                <Grid3X3 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setView('preview')}
                className={`p-1.5 rounded-full transition-all ${view === 'preview' ? 'bg-white/[0.08] text-white' : 'text-surface-500'}`}
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
            </div>
            <motion.button
              className="btn-gradient text-xs"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowTemplates(true)}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Generate Rubric
            </motion.button>
          </div>
        </div>
      </FadeUp>

      {/* Generating overlay */}
      <AnimatePresence>
        {generating && (
          <motion.div
            className="bg-gradient-to-r from-accent-500/10 to-neon-500/10 rounded-2xl border border-white/[0.06] p-8 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <motion.div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>
            <h3 className="text-lg font-black text-white mb-1">Generating Rubric...</h3>
            <p className="text-sm text-surface-400">AI is creating assessment criteria tailored to your needs</p>
            <motion.div
              className="w-48 h-1.5 bg-accent-500/15 rounded-full mx-auto mt-4 overflow-hidden"
            >
              <motion.div
                className="h-full bg-accent-500 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 2, ease: 'linear' }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Template picker modal */}
      <AnimatePresence>
        {showTemplates && (
          <motion.div
            className="glass-card p-6"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white">Choose a Template</h3>
              <button onClick={() => setShowTemplates(false)} className="text-surface-500 hover:text-surface-300">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {templates.map((t, i) => (
                <motion.button
                  key={t.name}
                  className="p-4 bg-white/[0.03] rounded-xl text-center hover:bg-white/[0.06] hover:border-accent-500/20 border border-white/[0.06] transition-all"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04 }}
                  whileHover={{ y: -2 }}
                  onClick={handleGenerate}
                >
                  <span className="text-2xl block mb-2">{t.icon}</span>
                  <p className="text-xs font-bold text-white">{t.name}</p>
                  {t.criteria > 0 && <p className="text-[10px] text-surface-500 mt-0.5">{t.criteria} criteria</p>}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {/* Gallery view */}
        {view === 'gallery' && !generating && !showTemplates && (
          <motion.div
            key="gallery"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sampleRubrics.map((rubric, i) => (
                <motion.div
                  key={rubric.id}
                  className="glass-card overflow-hidden cursor-pointer group"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -3, transition: { duration: 0.18 } }}
                  onClick={() => setView('preview')}
                >
                  <div className="h-1.5" style={{ backgroundColor: rubric.color }} />
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-bold text-white text-sm group-hover:text-accent-400 transition-colors">{rubric.title}</h4>
                      <div className="flex items-center gap-1">
                        <button className="text-surface-500 hover:text-surface-300 p-1"><Copy className="w-3 h-3" /></button>
                        <button className="text-surface-500 hover:text-surface-300 p-1"><Download className="w-3 h-3" /></button>
                      </div>
                    </div>
                    <p className="text-xs text-surface-400">{rubric.subject} · {rubric.grade} Grade</p>
                    <div className="flex items-center gap-3 mt-3 text-xs text-surface-500">
                      <span>{rubric.criteria} criteria</span>
                      <span>{rubric.levels} levels</span>
                      <span>{rubric.uses} uses</span>
                    </div>
                    <div className="flex gap-1.5 mt-3 flex-wrap">
                      {rubric.tags.map(tag => (
                        <span key={tag} className="text-[10px] px-2 py-0.5 bg-white/[0.06] text-surface-400 rounded-full">{tag}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Preview view */}
        {view === 'preview' && !generating && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
          >
            <div className="glass-card overflow-hidden relative">
              {/* Header bar */}
              <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Essay Writing Rubric</h3>
                  <p className="text-xs text-surface-400">
                    English · 10th Grade · {editableCriteria.length} criteria × {editableLevels.length} levels
                    <span className="ml-2 text-accent-400 font-semibold">{totalPoints} pts possible</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {!editing && (
                    <motion.button
                      className="btn-secondary text-xs px-3 py-1.5"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={startEditing}
                    >
                      <Edit3 className="w-3 h-3" /> Edit
                    </motion.button>
                  )}
                  <button className="btn-secondary text-xs px-3 py-1.5"><Copy className="w-3 h-3" /> Duplicate</button>
                  <button className="btn-secondary text-xs px-3 py-1.5"><Download className="w-3 h-3" /> Export</button>
                </div>
              </div>

              {/* Editing toolbar */}
              <AnimatePresence>
                {editing && (
                  <motion.div
                    className="px-5 py-3 border-b border-white/[0.06] flex items-center gap-2 bg-accent-500/[0.04]"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.button
                      className="btn-primary text-xs px-3 py-1.5"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={doneEditing}
                    >
                      <Check className="w-3 h-3" /> Done Editing
                    </motion.button>
                    <motion.button
                      className="btn-secondary text-xs px-3 py-1.5"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={cancelEditing}
                    >
                      <X className="w-3 h-3" /> Cancel
                    </motion.button>
                    <motion.button
                      className="btn-gradient text-xs px-3 py-1.5"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleAiImprove}
                      disabled={aiImproving}
                    >
                      <Sparkles className={`w-3 h-3 ${aiImproving ? 'animate-spin' : ''}`} />
                      {aiImproving ? 'Improving...' : 'AI Improve'}
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* AI Improving overlay */}
              <AnimatePresence>
                {aiImproving && (
                  <motion.div
                    className="absolute inset-0 z-10 flex items-center justify-center bg-surface-900/60 backdrop-blur-sm rounded-2xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="text-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                      >
                        <Sparkles className="w-8 h-8 text-accent-400 mx-auto" />
                      </motion.div>
                      <p className="text-sm text-white font-semibold mt-3">AI is improving your rubric...</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="overflow-x-auto relative">
                <table className="w-full min-w-[700px]">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      <th className="text-left text-xs font-bold text-surface-200 px-4 py-3 w-32 bg-white/[0.03]">
                        Criteria
                      </th>
                      {editableLevels.map((l, li) => {
                        const pts = getLevelPoints(editableLevels, li)
                        return (
                          <th key={li} className="text-center text-xs font-bold text-surface-200 px-4 py-3 bg-white/[0.03] relative">
                            {editing ? (
                              <div className="flex items-center gap-1 justify-center">
                                <input
                                  value={l}
                                  onChange={e => updateLevel(li, e.target.value)}
                                  className="bg-transparent border border-transparent focus:border-accent-500/40 focus:bg-white/[0.05] rounded-lg px-2 py-1 text-xs text-center text-surface-200 outline-none transition-all w-full min-w-[80px]"
                                />
                                {editableLevels.length > 2 && (
                                  <button
                                    onClick={() => removeLevel(li)}
                                    className="text-surface-500 hover:text-red-400 transition-colors flex-shrink-0"
                                    title="Remove level"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            ) : (
                              <span>{l}</span>
                            )}
                            <span className="block text-[10px] text-surface-500 font-normal mt-0.5">{pts} pts</span>
                          </th>
                        )
                      })}
                      {editing && (
                        <th className="px-2 py-3 bg-white/[0.03]">
                          <motion.button
                            className="text-surface-500 hover:text-accent-400 transition-colors p-1 rounded-lg hover:bg-white/[0.06]"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={addLevel}
                            title="Add level"
                          >
                            <Plus className="w-4 h-4" />
                          </motion.button>
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {editableCriteria.map((criterion, ri) => (
                      <motion.tr
                        key={ri}
                        className="border-b border-white/[0.04]"
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + ri * 0.06 }}
                      >
                        <td className="px-4 py-3 text-sm font-semibold text-accent-400 bg-accent-500/10">
                          {editing ? (
                            <div className="flex items-center gap-1">
                              <input
                                value={criterion}
                                onChange={e => updateCriterion(ri, e.target.value)}
                                className="bg-transparent border border-transparent focus:border-accent-500/40 focus:bg-white/[0.05] rounded-lg px-2 py-1 text-sm font-semibold text-accent-400 outline-none transition-all w-full"
                              />
                              {editableCriteria.length > 2 && (
                                <button
                                  onClick={() => removeCriterion(ri)}
                                  className="text-surface-500 hover:text-red-400 transition-colors flex-shrink-0"
                                  title="Remove criterion"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          ) : (
                            criterion
                          )}
                        </td>
                        {editableCells[ri]?.map((cell, ci) => (
                          <td key={ci} className="px-4 py-3 text-xs text-surface-400 leading-relaxed border-l border-white/[0.04]">
                            {editing ? (
                              <textarea
                                value={cell}
                                onChange={e => updateCell(ri, ci, e.target.value)}
                                rows={3}
                                className="bg-transparent border border-transparent focus:border-accent-500/40 focus:bg-white/[0.05] rounded-lg px-2 py-1.5 text-xs text-surface-400 outline-none transition-all w-full resize-none leading-relaxed"
                              />
                            ) : (
                              cell
                            )}
                          </td>
                        ))}
                        {editing && <td />}
                      </motion.tr>
                    ))}
                  </tbody>
                </table>

                {/* Add Criterion button */}
                <AnimatePresence>
                  {editing && (
                    <motion.div
                      className="px-4 py-3 border-t border-white/[0.04]"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <motion.button
                        className="btn-secondary text-xs px-3 py-1.5 w-full justify-center"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={addCriterion}
                      >
                        <Plus className="w-3 h-3" /> Add Criterion
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
