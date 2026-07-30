'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText, Sparkles, Download, Send, Users, Search,
  Check, Clock, ChevronDown, Star, TrendingUp, Target,
  Eye, Copy, Printer, Mail
} from 'lucide-react'
import { FadeUp } from '@/components/ui/motion'

const students = [
  { id: '1', name: 'Emma Davis', grade: 'A', gpa: 3.9, attendance: 97, trend: 'up' as const, selected: true },
  { id: '2', name: 'Liam Chen', grade: 'B+', gpa: 3.4, attendance: 94, trend: 'up' as const, selected: true },
  { id: '3', name: 'Sofia Rodriguez', grade: 'A-', gpa: 3.7, attendance: 98, trend: 'stable' as const, selected: true },
  { id: '4', name: 'Noah Williams', grade: 'B', gpa: 3.0, attendance: 91, trend: 'down' as const, selected: false },
  { id: '5', name: 'Ava Patel', grade: 'B-', gpa: 2.8, attendance: 89, trend: 'up' as const, selected: false },
  { id: '6', name: 'Ethan Kim', grade: 'A', gpa: 3.8, attendance: 96, trend: 'stable' as const, selected: false },
  { id: '7', name: 'Mia Thompson', grade: 'C+', gpa: 2.4, attendance: 85, trend: 'down' as const, selected: false },
  { id: '8', name: 'James Brown', grade: 'B+', gpa: 3.3, attendance: 93, trend: 'up' as const, selected: false },
]

const reportTemplates = [
  { name: 'Standard Report Card', desc: 'Traditional format with grades and comments', icon: '📄', popular: true },
  { name: 'Narrative Report', desc: 'Detailed written narrative for each subject', icon: '📝', popular: false },
  { name: 'Standards-Based', desc: 'Progress toward learning standards', icon: '🎯', popular: true },
  { name: 'IEP Progress Report', desc: 'Individualized Education Program tracking', icon: '📋', popular: false },
  { name: 'Parent-Friendly Summary', desc: 'Simplified overview for parent conferences', icon: '👨‍👩‍👧', popular: false },
  { name: 'Portfolio Summary', desc: 'Work samples and growth documentation', icon: '🏆', popular: false },
]

const sampleReport = {
  student: 'Emma Davis',
  period: 'Quarter 2, Fall 2026',
  subjects: [
    { name: 'Biology', grade: 'A', score: 95, comment: 'Emma demonstrates exceptional understanding of biological concepts. Her lab reports are thorough and well-organized. She actively participates in class discussions and shows strong analytical thinking.' },
    { name: 'Mathematics', grade: 'A-', score: 91, comment: 'Strong problem-solving skills with consistent homework completion. Emma excels in algebraic concepts and shows improvement in geometry. Would benefit from more practice with word problems.' },
    { name: 'English', grade: 'B+', score: 88, comment: 'Emma is a thoughtful reader with strong comprehension skills. Her essays show good organization. Continuing to develop her analytical writing voice and thesis argumentation.' },
    { name: 'History', grade: 'A', score: 94, comment: 'Excellent research skills and critical thinking. Emma connects historical events to modern contexts effectively. Her presentation on the Industrial Revolution was outstanding.' },
  ],
  strengths: ['Critical thinking', 'Lab methodology', 'Research skills', 'Class participation'],
  growth: ['Analytical writing', 'Math word problems', 'Time management on projects'],
  teacherNote: 'Emma is a dedicated student who consistently goes above and beyond expectations. She is a positive influence on her peers and demonstrates strong leadership qualities in group projects. I recommend she consider joining the Science Olympiad team.',
}

type Step = 'select' | 'template' | 'preview'

export default function ReportCardsPage() {
  const [step, setStep] = useState<Step>('select')
  const [search, setSearch] = useState('')
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set(['1', '2', '3']))
  const [generating, setGenerating] = useState(false)
  const [expandedSubject, setExpandedSubject] = useState<number>(0)

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  )

  function toggleStudent(id: string) {
    const next = new Set(selectedStudents)
    if (next.has(id)) next.delete(id); else next.add(id)
    setSelectedStudents(next)
  }

  function selectAll() {
    setSelectedStudents(new Set(students.map(s => s.id)))
  }

  function handleGenerate() {
    setGenerating(true)
    setTimeout(() => {
      setGenerating(false)
      setStep('preview')
    }, 2500)
  }

  return (
    <div className="space-y-6">
      <FadeUp>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
              whileHover={{ rotate: 8, scale: 1.08 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <FileText className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h2 className="text-xl font-black text-white">AI Report Card Generator</h2>
              <p className="text-xs text-surface-400">Generate personalized report cards with AI-written comments</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {step !== 'select' && (
              <button onClick={() => setStep('select')} className="btn-secondary text-xs">
                Start Over
              </button>
            )}
          </div>
        </div>
      </FadeUp>

      {/* Progress steps */}
      <FadeUp delay={0.05}>
        <div className="flex items-center gap-4 px-4">
          {[
            { key: 'select' as const, label: 'Select Students', num: 1 },
            { key: 'template' as const, label: 'Choose Template', num: 2 },
            { key: 'preview' as const, label: 'Review & Export', num: 3 },
          ].map((s, i) => {
            const isActive = s.key === step
            const isPast = (step === 'template' && s.num === 1) || (step === 'preview' && s.num <= 2)
            return (
              <div key={s.key} className="flex items-center gap-3 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${
                  isPast ? 'bg-success-400 text-white' : isActive ? 'bg-accent-500 text-white' : 'bg-white/[0.06] text-surface-500'
                }`}>
                  {isPast ? <Check className="w-4 h-4" /> : s.num}
                </div>
                <span className={`text-xs font-semibold hidden sm:inline ${isActive ? 'text-white' : 'text-surface-500'}`}>{s.label}</span>
                {i < 2 && <div className={`flex-1 h-px ${isPast ? 'bg-success-400/40' : 'bg-white/[0.06]'}`} />}
              </div>
            )
          })}
        </div>
      </FadeUp>

      <AnimatePresence mode="wait">
        {/* Step 1: Select Students */}
        {step === 'select' && (
          <motion.div
            key="select"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-3.5 h-3.5 text-surface-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="input-base pl-9"
                />
              </div>
              <button onClick={selectAll} className="btn-secondary text-xs">Select All</button>
              <span className="text-xs text-surface-400">{selectedStudents.size} selected</span>
            </div>

            <div className="glass-card overflow-hidden">
              {filteredStudents.map((s, i) => (
                <motion.div
                  key={s.id}
                  className={`flex items-center gap-4 px-5 py-4 cursor-pointer transition-colors ${
                    i < filteredStudents.length - 1 ? 'border-b border-white/[0.06]' : ''
                  } ${selectedStudents.has(s.id) ? 'bg-accent-500/[0.06]' : 'hover:bg-white/[0.03]'}`}
                  onClick={() => toggleStudent(s.id)}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                    selectedStudents.has(s.id) ? 'bg-accent-500 border-accent-500' : 'border-white/[0.15]'
                  }`}>
                    {selectedStudents.has(s.id) && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #6366f1, #a78bfa)' }}
                  >
                    {s.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white">{s.name}</p>
                    <p className="text-xs text-surface-500">GPA {s.gpa} · {s.attendance}% attendance</p>
                  </div>
                  <span className="text-sm font-bold text-accent-400">{s.grade}</span>
                  <span className={`text-xs ${s.trend === 'up' ? 'text-success-400' : s.trend === 'down' ? 'text-danger-400' : 'text-surface-500'}`}>
                    {s.trend === 'up' ? '↑' : s.trend === 'down' ? '↓' : '→'}
                  </span>
                </motion.div>
              ))}
            </div>

            <div className="flex justify-end">
              <motion.button
                onClick={() => setStep('template')}
                disabled={selectedStudents.size === 0}
                className="btn-gradient text-sm disabled:opacity-40"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Continue with {selectedStudents.size} student{selectedStudents.size !== 1 ? 's' : ''}
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Choose Template */}
        {step === 'template' && !generating && (
          <motion.div
            key="template"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-4"
          >
            <p className="text-sm text-surface-400">Choose a report card format for {selectedStudents.size} students</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reportTemplates.map((t, i) => (
                <motion.button
                  key={t.name}
                  className="glass-card p-5 text-left group cursor-pointer"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ y: -3, transition: { duration: 0.18 } }}
                  onClick={handleGenerate}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl">{t.icon}</span>
                    {t.popular && (
                      <span className="badge bg-accent-500/15 text-accent-400 text-[10px]">Popular</span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-accent-400 transition-colors">{t.name}</h4>
                  <p className="text-xs text-surface-400 mt-1">{t.desc}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Generating overlay */}
        {generating && (
          <motion.div
            key="generating"
            className="glass-card p-12 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <motion.div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: 'linear-gradient(135deg, #6366f1, #a78bfa)' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="w-7 h-7 text-white" />
            </motion.div>
            <h3 className="text-lg font-black text-white mb-1">Generating Report Cards...</h3>
            <p className="text-sm text-surface-400 mb-4">AI is writing personalized comments for {selectedStudents.size} students</p>
            <motion.div className="w-56 h-2 bg-white/[0.06] rounded-full mx-auto overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #6366f1, #a78bfa)' }}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 2.5, ease: 'linear' }}
              />
            </motion.div>
          </motion.div>
        )}

        {/* Step 3: Preview */}
        {step === 'preview' && !generating && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Report Card Preview</h3>
                <p className="text-xs text-surface-400">{selectedStudents.size} reports generated · {sampleReport.period}</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="btn-secondary text-xs"><Printer className="w-3.5 h-3.5" /> Print All</button>
                <button className="btn-secondary text-xs"><Download className="w-3.5 h-3.5" /> Export PDF</button>
                <button className="btn-gradient text-xs"><Mail className="w-3.5 h-3.5" /> Email Parents</button>
              </div>
            </div>

            {/* Sample report card */}
            <div className="glass-card overflow-hidden">
              <div className="p-6 border-b border-white/[0.06] bg-gradient-to-r from-accent-500/10 to-neon-500/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      style={{ background: 'linear-gradient(135deg, #6366f1, #a78bfa)' }}
                    >
                      ED
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-white">{sampleReport.student}</h4>
                      <p className="text-xs text-surface-400">{sampleReport.period} · 7th Grade · Lincoln Middle School</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-accent-400">3.9</p>
                    <p className="text-[10px] text-surface-500 uppercase tracking-wider">GPA</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <h4 className="text-sm font-bold text-white">Subject Grades</h4>
                {sampleReport.subjects.map((subj, i) => (
                  <motion.div
                    key={subj.name}
                    className="border border-white/[0.06] rounded-xl overflow-hidden"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.06 }}
                  >
                    <button
                      className="w-full flex items-center gap-4 p-4 text-left hover:bg-white/[0.02] transition-colors"
                      onClick={() => setExpandedSubject(expandedSubject === i ? -1 : i)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-white">{subj.name}</span>
                          <span className="text-lg font-black text-accent-400">{subj.grade}</span>
                        </div>
                        <div className="h-1.5 bg-white/[0.06] rounded-full mt-2 overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ background: subj.score >= 90 ? '#10b981' : subj.score >= 80 ? '#6366f1' : '#f97316' }}
                            initial={{ width: 0 }}
                            animate={{ width: `${subj.score}%` }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                          />
                        </div>
                      </div>
                      <span className="text-sm font-bold text-surface-400">{subj.score}%</span>
                      <motion.div animate={{ rotate: expandedSubject === i ? 180 : 0 }}>
                        <ChevronDown className="w-4 h-4 text-surface-500" />
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {expandedSubject === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 pt-0 border-t border-white/[0.06]">
                            <p className="text-sm text-surface-300 leading-relaxed mt-3">{subj.comment}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>

              <div className="p-6 border-t border-white/[0.06] grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                    <Star className="w-4 h-4 text-warning-400" /> Strengths
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {sampleReport.strengths.map(s => (
                      <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-success-400/15 text-success-400 font-medium">{s}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-accent-400" /> Areas for Growth
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {sampleReport.growth.map(g => (
                      <span key={g} className="text-xs px-2.5 py-1 rounded-full bg-accent-500/15 text-accent-400 font-medium">{g}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-white/[0.06] bg-white/[0.02]">
                <h4 className="text-sm font-bold text-white mb-2">Teacher Comments</h4>
                <p className="text-sm text-surface-300 leading-relaxed italic">&ldquo;{sampleReport.teacherNote}&rdquo;</p>
                <p className="text-xs text-surface-500 mt-2">— Alex Johnson, Science Teacher</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-surface-500">
              <span className="flex items-center gap-1"><Check className="w-3 h-3 text-success-400" /> AI-generated comments based on grade data and class performance</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
