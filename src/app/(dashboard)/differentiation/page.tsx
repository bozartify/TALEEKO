'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain, Users, BookOpen, Globe, Target, Sparkles, Check,
  Layers, Eye, Volume2, Clock, Star, Zap, GraduationCap,
  FileText, Puzzle, MessageSquare, Accessibility, Award,
  BarChart3, Lightbulb, PenTool, List, Layout, Languages,
  Headphones, Hand, SplitSquareHorizontal
} from 'lucide-react'
import { FadeUp, FadeInWhenVisible } from '@/components/ui/motion'

/* ──────────────────────────────────────────────
   DATA
   ────────────────────────────────────────────── */

const learnerProfiles = [
  {
    id: 'advanced',
    label: 'Advanced / Gifted',
    icon: Star,
    color: '#f59e0b',
    students: 4,
    description: 'Needs enrichment, higher-order thinking, and accelerated pacing',
    tags: ['Enrichment', 'Critical Thinking', 'Independent Projects'],
  },
  {
    id: 'on-level',
    label: 'On Grade Level',
    icon: Target,
    color: '#10b981',
    students: 12,
    description: 'Standard instruction with regular formative checks',
    tags: ['Core Instruction', 'Grade-Level Texts', 'Collaborative Work'],
  },
  {
    id: 'approaching',
    label: 'Approaching Grade Level',
    icon: BarChart3,
    color: '#6366f1',
    students: 6,
    description: 'Needs scaffolding, pre-teaching, and guided practice',
    tags: ['Scaffolding', 'Guided Practice', 'Pre-Teaching'],
  },
  {
    id: 'ell',
    label: 'English Language Learners',
    icon: Globe,
    color: '#22d3ee',
    students: 5,
    description: 'Bilingual support, visual aids, and language-rich activities',
    tags: ['Visual Aids', 'Bilingual Support', 'Sentence Frames'],
  },
  {
    id: 'iep',
    label: 'IEP / 504 Students',
    icon: Accessibility,
    color: '#ec4899',
    students: 3,
    description: 'Accommodations required per individual education plans',
    tags: ['Accommodations', 'Modified Pacing', 'Assistive Tech'],
  },
]

const adaptations: Record<string, { title: string; bullets: string[] }> = {
  advanced: {
    title: 'Enrichment Adaptation',
    bullets: [
      'Replace guided notes with an independent research mini-project on C4 vs CAM photosynthesis.',
      'Add analysis questions: "What would happen to oxygen levels if photosynthesis ceased globally?"',
      'Extension: Design an experiment to measure the rate of photosynthesis under different light wavelengths.',
      'Provide journal article excerpt (Lexile 1200+) on artificial photosynthesis for critical reading.',
    ],
  },
  'on-level': {
    title: 'Standard Instruction',
    bullets: [
      'Use interactive diagram to label the stages of photosynthesis (light reactions & Calvin cycle).',
      'Guided notes with fill-in-the-blank key vocabulary.',
      'Lab activity: Observe Elodea bubbles to visualize oxygen production.',
      'Formative check: Exit ticket matching inputs/outputs of photosynthesis.',
    ],
  },
  approaching: {
    title: 'Scaffolded Adaptation',
    bullets: [
      'Pre-teach vocabulary: chlorophyll, glucose, carbon dioxide, light energy (with picture cards).',
      'Provide a simplified equation with color-coded reactants and products.',
      'Chunked reading passage (Lexile 800) with highlighted key terms.',
      'Graphic organizer: "What goes in?" / "What comes out?" T-chart.',
    ],
  },
  ell: {
    title: 'ELL Adaptation',
    bullets: [
      'Bilingual glossary (English/Spanish): fotosintesis, clorofila, glucosa, dioxido de carbono.',
      'Sentence frames: "During photosynthesis, plants use ___ and ___ to make ___."',
      'Labeled diagram with L1 cognates; visual flowchart of the process.',
      'Word bank with pronunciation guide; partner discussion in home language permitted.',
    ],
  },
  iep: {
    title: 'IEP/504 Adaptation',
    bullets: [
      'Extended time (1.5x) for lab write-up and exit ticket.',
      'Preferential seating near demonstration table; reduced visual clutter on handouts.',
      'Text-to-speech enabled digital version of the reading passage.',
      'Modified assessment: multiple-choice instead of open-response; word bank provided.',
    ],
  },
}

const accommodationItems = [
  { label: 'Extended Time', icon: Clock },
  { label: 'Preferential Seating', icon: Hand },
  { label: 'Visual Aids', icon: Eye },
  { label: 'Audio Support', icon: Volume2 },
  { label: 'Simplified Text', icon: FileText },
  { label: 'Chunked Assignments', icon: SplitSquareHorizontal },
  { label: 'Graphic Organizers', icon: Layout },
  { label: 'Word Banks', icon: List },
  { label: 'Sentence Frames', icon: MessageSquare },
  { label: 'Bilingual Glossary', icon: Languages },
  { label: 'Modified Assessments', icon: PenTool },
  { label: 'Peer Tutoring', icon: Users },
]

/* ──────────────────────────────────────────────
   COMPONENT
   ────────────────────────────────────────────── */

export default function DifferentiationPage() {
  const [activeTab, setActiveTab] = useState('advanced')
  const [selectedAccommodations, setSelectedAccommodations] = useState<string[]>([
    'Extended Time', 'Visual Aids', 'Word Banks', 'Sentence Frames',
  ])
  const [generating, setGenerating] = useState(false)

  const toggleAccommodation = (label: string) => {
    setSelectedAccommodations(prev =>
      prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
    )
  }

  const handleGenerate = () => {
    setGenerating(true)
    setTimeout(() => setGenerating(false), 2200)
  }

  const totalStudents = learnerProfiles.reduce((sum, p) => sum + p.students, 0)

  return (
    <div className="space-y-6">
      {/* ── HEADER ─────────────────────────────── */}
      <FadeUp>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #a78bfa, #6366f1)' }}
              whileHover={{ rotate: 8, scale: 1.08 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <Brain className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h2 className="text-xl font-black text-white">AI Differentiation Wizard</h2>
              <p className="text-xs text-surface-400">Adapt any lesson for all learners</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.button className="btn-gradient text-xs" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Sparkles className="w-3.5 h-3.5" /> New Adaptation
            </motion.button>
            <button className="btn-secondary text-xs px-3 py-1.5">
              <BookOpen className="w-3.5 h-3.5" /> My Lessons
            </button>
          </div>
        </div>
      </FadeUp>

      {/* ── QUICK STATS ────────────────────────── */}
      <FadeUp delay={0.05}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Learner Profiles', value: 5, icon: Users, color: '#a78bfa' },
            { label: 'Adaptations Made', value: 47, icon: Layers, color: '#6366f1' },
            { label: 'Reading Levels', value: 4, icon: BookOpen, color: '#10b981' },
            { label: 'Languages', value: 3, icon: Globe, color: '#22d3ee' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="glass-card p-4"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: stat.color + '18' }}
                >
                  <stat.icon className="w-3.5 h-3.5" style={{ color: stat.color }} />
                </div>
                <span className="text-xs text-surface-400">{stat.label}</span>
              </div>
              <p className="text-xl font-black text-white">{stat.value}</p>
            </motion.div>
          ))}
        </div>
      </FadeUp>

      {/* ── LEARNER PROFILES ───────────────────── */}
      <FadeUp delay={0.1}>
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white">Classroom Learner Profiles</h3>
            <span className="text-[10px] text-surface-500">{totalStudents} students total</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {learnerProfiles.map((profile, i) => (
              <motion.div
                key={profile.id}
                className="relative rounded-xl p-4 transition-all duration-300 cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, ${profile.color}08, ${profile.color}04)`,
                  border: `1px solid ${profile.color}20`,
                }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 + i * 0.06 }}
                whileHover={{
                  borderColor: profile.color + '40',
                  boxShadow: `0 4px 20px ${profile.color}15`,
                  y: -2,
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: profile.color + '18' }}
                  >
                    <profile.icon className="w-4 h-4" style={{ color: profile.color }} />
                  </div>
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: profile.color + '18', color: profile.color }}
                  >
                    {profile.students} students
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white mb-1">{profile.label}</h4>
                <p className="text-[10px] text-surface-400 leading-relaxed mb-2">{profile.description}</p>
                <div className="flex flex-wrap gap-1">
                  {profile.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-[9px] px-1.5 py-0.5 rounded-full"
                      style={{ backgroundColor: profile.color + '10', color: profile.color }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </FadeUp>

      {/* ── LESSON ADAPTER ─────────────────────── */}
      <FadeUp delay={0.15}>
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Lesson Adapter
            </h3>
            <span className="badge bg-accent-500/15 text-accent-400">Demo</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* INPUT: Original Lesson */}
            <div
              className="rounded-xl p-5"
              style={{
                background: 'linear-gradient(135deg, rgba(99,102,241,0.06), rgba(34,211,238,0.04))',
                border: '1px solid rgba(99,102,241,0.12)',
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-accent-500/15">
                  <FileText className="w-3.5 h-3.5 text-accent-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Original Lesson</h4>
                  <p className="text-[10px] text-surface-500">Grade 7 Science</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-surface-500 w-16">Topic:</span>
                  <span className="text-xs font-semibold text-white">Photosynthesis</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-surface-500 w-16">Standard:</span>
                  <span className="text-xs text-surface-300">MS-LS1-6</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-surface-500 w-16">Objective:</span>
                  <span className="text-xs text-surface-300">Explain the process of photosynthesis and its role in energy transfer</span>
                </div>
              </div>
              <div className="mt-3 p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                <p className="text-[11px] text-surface-400 leading-relaxed">
                  Students will learn how plants convert light energy, water, and carbon dioxide
                  into glucose and oxygen through the process of photosynthesis. The lesson includes
                  a reading passage, labeled diagram activity, and an Elodea lab to observe
                  oxygen production.
                </p>
              </div>
              <motion.button
                className="btn-gradient text-xs mt-4 w-full relative overflow-hidden"
                onClick={handleGenerate}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={generating}
              >
                {generating && (
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
                    }}
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                  />
                )}
                <Sparkles className="w-3.5 h-3.5" />
                {generating ? 'Generating Adaptations...' : 'Generate Adaptations'}
              </motion.button>
            </div>

            {/* OUTPUT: Adapted Versions */}
            <div>
              {/* Tabs */}
              <div className="flex gap-1 mb-3 overflow-x-auto pb-1">
                {learnerProfiles.map(profile => (
                  <button
                    key={profile.id}
                    onClick={() => setActiveTab(profile.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all duration-200"
                    style={{
                      backgroundColor: activeTab === profile.id ? profile.color + '18' : 'rgba(255,255,255,0.03)',
                      color: activeTab === profile.id ? profile.color : 'rgba(148,163,184,0.7)',
                      border: `1px solid ${activeTab === profile.id ? profile.color + '30' : 'rgba(255,255,255,0.06)'}`,
                    }}
                  >
                    <profile.icon className="w-3 h-3" />
                    {profile.label.split(' ')[0]}
                  </button>
                ))}
              </div>

              {/* Active Adaptation */}
              <AnimatePresence mode="wait">
                {learnerProfiles.map(profile => {
                  if (profile.id !== activeTab) return null
                  const adaptation = adaptations[profile.id]
                  return (
                    <motion.div
                      key={profile.id}
                      className="rounded-xl p-4"
                      style={{
                        background: `linear-gradient(135deg, ${profile.color}06, ${profile.color}03)`,
                        border: `1px solid ${profile.color}18`,
                      }}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: profile.color + '18' }}
                        >
                          <profile.icon className="w-3.5 h-3.5" style={{ color: profile.color }} />
                        </div>
                        <h4 className="text-xs font-bold" style={{ color: profile.color }}>
                          {adaptation.title}
                        </h4>
                      </div>
                      <ul className="space-y-2">
                        {adaptation.bullets.map((bullet, bi) => (
                          <motion.li
                            key={bi}
                            className="flex items-start gap-2"
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: bi * 0.06 }}
                          >
                            <div
                              className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                              style={{ backgroundColor: profile.color + '18' }}
                            >
                              <Check className="w-2.5 h-2.5" style={{ color: profile.color }} />
                            </div>
                            <span className="text-[11px] text-surface-300 leading-relaxed">{bullet}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </FadeUp>

      {/* ── ACCOMMODATION CHECKLIST ────────────── */}
      <FadeUp delay={0.2}>
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Puzzle className="w-4 h-4 text-emerald-400" />
              Accommodation Checklist
            </h3>
            <span className="text-[10px] text-surface-500">
              {selectedAccommodations.length} of {accommodationItems.length} selected
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {accommodationItems.map((item, i) => {
              const isSelected = selectedAccommodations.includes(item.label)
              return (
                <motion.button
                  key={item.label}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all duration-200"
                  style={{
                    background: isSelected ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${isSelected ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.06)'}`,
                  }}
                  onClick={() => toggleAccommodation(item.label)}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.22 + i * 0.03 }}
                  whileHover={{ borderColor: 'rgba(99,102,241,0.3)' }}
                  whileTap={{ scale: 0.97 }}
                >
                  <div
                    className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-all duration-200"
                    style={{
                      background: isSelected
                        ? 'linear-gradient(135deg, #6366f1, #a78bfa)'
                        : 'rgba(255,255,255,0.06)',
                      border: isSelected ? 'none' : '1px solid rgba(255,255,255,0.1)',
                    }}
                  >
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <div className="flex items-center gap-1.5 min-w-0">
                    <item.icon
                      className="w-3.5 h-3.5 flex-shrink-0"
                      style={{ color: isSelected ? '#818cf8' : 'rgba(148,163,184,0.5)' }}
                    />
                    <span
                      className="text-xs font-medium truncate"
                      style={{ color: isSelected ? '#e0e7ff' : 'rgba(148,163,184,0.7)' }}
                    >
                      {item.label}
                    </span>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </div>
      </FadeUp>
    </div>
  )
}
