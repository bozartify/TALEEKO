'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Map, Plus, ChevronRight, ChevronDown, Calendar, Target,
  BookOpen, Sparkles, Check, Clock, Layers, GripVertical,
  ArrowRight, Edit3, Trash2, Copy, Eye
} from 'lucide-react'
import { FadeUp, FadeInWhenVisible } from '@/components/ui/motion'

const units = [
  {
    id: '1', title: 'Cell Biology & Organization', weeks: '3 weeks', status: 'completed' as const,
    color: '#86b06a', standards: 4, lessons: 8, progress: 100,
    topics: ['Cell Structure', 'Cell Transport', 'Cell Division', 'Photosynthesis'],
  },
  {
    id: '2', title: 'Genetics & Heredity', weeks: '4 weeks', status: 'in-progress' as const,
    color: '#dd9a33', standards: 5, lessons: 10, progress: 60,
    topics: ['DNA Structure', 'Protein Synthesis', 'Mendelian Genetics', 'Genetic Disorders', 'Biotechnology'],
  },
  {
    id: '3', title: 'Evolution & Natural Selection', weeks: '3 weeks', status: 'upcoming' as const,
    color: '#c67954', standards: 3, lessons: 7, progress: 0,
    topics: ['Evidence for Evolution', 'Natural Selection', 'Speciation'],
  },
  {
    id: '4', title: 'Ecology & Ecosystems', weeks: '3 weeks', status: 'upcoming' as const,
    color: '#829c6e', standards: 4, lessons: 9, progress: 0,
    topics: ['Energy Flow', 'Nutrient Cycles', 'Population Dynamics', 'Human Impact'],
  },
  {
    id: '5', title: 'Human Body Systems', weeks: '4 weeks', status: 'upcoming' as const,
    color: '#d97b63', standards: 6, lessons: 12, progress: 0,
    topics: ['Circulatory', 'Respiratory', 'Nervous', 'Digestive', 'Immune', 'Endocrine'],
  },
]

const statusColors = {
  'completed': { bg: 'bg-success-500/15', text: 'text-success-400', label: 'Completed' },
  'in-progress': { bg: 'bg-accent-500/15', text: 'text-accent-400', label: 'In Progress' },
  'upcoming': { bg: 'bg-surface-500/15', text: 'text-surface-400', label: 'Upcoming' },
}

const yearOverview = [
  { quarter: 'Q1 (Aug-Oct)', units: 2, weeks: 7, progress: 100 },
  { quarter: 'Q2 (Nov-Jan)', units: 1, weeks: 4, progress: 60 },
  { quarter: 'Q3 (Feb-Apr)', units: 1, weeks: 3, progress: 0 },
  { quarter: 'Q4 (Apr-Jun)', units: 1, weeks: 4, progress: 0 },
]

export default function CurriculumPage() {
  const [expandedUnit, setExpandedUnit] = useState<string | null>('2')
  const [view, setView] = useState<'timeline' | 'list'>('list')

  const totalLessons = units.reduce((acc, u) => acc + u.lessons, 0)
  const totalStandards = units.reduce((acc, u) => acc + u.standards, 0)
  const overallProgress = Math.round(units.reduce((acc, u) => acc + u.progress, 0) / units.length)

  return (
    <div className="space-y-6">
      <FadeUp>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #dd9a33, #b0623f)' }}
              whileHover={{ rotate: 8, scale: 1.08 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <Map className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h2 className="text-xl font-black text-white">Curriculum Planner</h2>
              <p className="text-xs text-surface-400">AP Biology · {units.length} units · {totalLessons} lessons</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-white/[0.06] rounded-full p-0.5">
              <button
                onClick={() => setView('list')}
                className={`px-3 py-1 rounded-full text-xs transition-all ${view === 'list' ? 'bg-white/[0.08] text-white' : 'text-surface-500'}`}
              >
                List
              </button>
              <button
                onClick={() => setView('timeline')}
                className={`px-3 py-1 rounded-full text-xs transition-all ${view === 'timeline' ? 'bg-white/[0.08] text-white' : 'text-surface-500'}`}
              >
                Timeline
              </button>
            </div>
            <motion.button className="btn-gradient text-xs" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Sparkles className="w-3.5 h-3.5" /> AI Plan
            </motion.button>
            <button className="btn-secondary text-xs px-3 py-1.5">
              <Plus className="w-3.5 h-3.5" /> Add Unit
            </button>
          </div>
        </div>
      </FadeUp>

      <FadeUp delay={0.05}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Units', value: units.length, icon: Layers, color: '#dd9a33' },
            { label: 'Lessons', value: totalLessons, icon: BookOpen, color: '#829c6e' },
            { label: 'Standards', value: totalStandards, icon: Target, color: '#c67954' },
            { label: 'Progress', value: `${overallProgress}%`, icon: Check, color: '#86b06a' },
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

      <FadeUp delay={0.1}>
        <div className="glass-card p-5">
          <h3 className="text-sm font-bold text-white mb-3">Year Overview</h3>
          <div className="flex gap-2">
            {yearOverview.map((q, i) => (
              <div key={q.quarter} className="flex-1">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] text-surface-400">{q.quarter}</span>
                  <span className="text-[10px] text-surface-500">{q.progress}%</span>
                </div>
                <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: q.progress === 100 ? '#86b06a' : q.progress > 0 ? '#dd9a33' : '#362e23' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${q.progress}%` }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                  />
                </div>
                <p className="text-[10px] text-surface-500 mt-1">{q.units} units · {q.weeks} wks</p>
              </div>
            ))}
          </div>
        </div>
      </FadeUp>

      <div className="space-y-3">
        {units.map((unit, i) => {
          const status = statusColors[unit.status]
          const isExpanded = expandedUnit === unit.id
          return (
            <motion.div
              key={unit.id}
              className="glass-card overflow-hidden"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.06 }}
            >
              <button
                className="w-full flex items-center gap-4 p-5 text-left"
                onClick={() => setExpandedUnit(isExpanded ? null : unit.id)}
              >
                <div className="w-1 h-10 rounded-full" style={{ backgroundColor: unit.color }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-bold text-white truncate">{unit.title}</h4>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${status.bg} ${status.text}`}>
                      {status.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-surface-500">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{unit.weeks}</span>
                    <span>{unit.lessons} lessons</span>
                    <span>{unit.standards} standards</span>
                  </div>
                </div>
                <div className="w-20">
                  <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${unit.progress}%`, backgroundColor: unit.color }} />
                  </div>
                  <p className="text-[10px] text-surface-500 text-right mt-0.5">{unit.progress}%</p>
                </div>
                <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                  <ChevronDown className="w-4 h-4 text-surface-500" />
                </motion.div>
              </button>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-0 border-t border-white/[0.06]">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4 mb-4">
                        {unit.topics.map((topic, ti) => (
                          <motion.div
                            key={topic}
                            className="flex items-center gap-2 px-3 py-2 bg-white/[0.03] rounded-lg border border-white/[0.06]"
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: ti * 0.05 }}
                          >
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: unit.color }} />
                            <span className="text-xs text-surface-300">{topic}</span>
                          </motion.div>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="btn-secondary text-xs px-3 py-1.5"><Eye className="w-3 h-3" /> View Lessons</button>
                        <button className="btn-secondary text-xs px-3 py-1.5"><Edit3 className="w-3 h-3" /> Edit</button>
                        <button className="btn-secondary text-xs px-3 py-1.5"><Copy className="w-3 h-3" /> Duplicate</button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
