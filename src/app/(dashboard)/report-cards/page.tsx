'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText, Sparkles, Download, Users, Search,
  Check, ChevronDown, Star, TrendingUp, TrendingDown,
  Eye, Copy, Printer, Mail, X, ChevronLeft, ChevronRight,
  Award, Target, BarChart2, AlertTriangle, RefreshCw, Zap, CheckCircle
} from 'lucide-react'
import { FadeUp, FadeInWhenVisible } from '@/components/ui/motion'

type Step = 'select' | 'template' | 'preview'
type Tone = 'warm' | 'professional' | 'detailed' | 'encouraging'

interface Student {
  id: string
  name: string
  grade: string
  gpa: number
  attendance: number
  trend: 'up' | 'down' | 'stable'
  iep?: boolean
  ell?: boolean
}

interface SubjectRecord {
  name: string
  grade: string
  score: number
  comment: string
}

interface ReportData {
  studentId: string
  student: string
  period: string
  subjects: SubjectRecord[]
  strengths: string[]
  growth: string[]
  teacherNote: string
  approved?: boolean
}

const students: Student[] = [
  { id: '1', name: 'Emma Davis',       grade: 'A',   gpa: 3.9, attendance: 97, trend: 'up' },
  { id: '2', name: 'Liam Chen',        grade: 'B+',  gpa: 3.4, attendance: 94, trend: 'up',    iep: true },
  { id: '3', name: 'Sofia Rodriguez',  grade: 'A-',  gpa: 3.7, attendance: 98, trend: 'stable', ell: true },
  { id: '4', name: 'Noah Williams',    grade: 'B',   gpa: 3.0, attendance: 91, trend: 'down' },
  { id: '5', name: 'Ava Patel',        grade: 'B-',  gpa: 2.8, attendance: 89, trend: 'up' },
  { id: '6', name: 'Ethan Kim',        grade: 'A',   gpa: 3.8, attendance: 96, trend: 'stable' },
  { id: '7', name: 'Mia Thompson',     grade: 'C+',  gpa: 2.4, attendance: 85, trend: 'down' },
  { id: '8', name: 'James Brown',      grade: 'B+',  gpa: 3.3, attendance: 93, trend: 'up' },
]

const reportTemplates = [
  { id: 'standard',   name: 'Standard Report Card',    desc: 'Traditional format with grades and comments', icon: '📄', popular: true },
  { id: 'narrative',  name: 'Narrative Report',         desc: 'Detailed written narrative for each subject', icon: '📝', popular: false },
  { id: 'standards',  name: 'Standards-Based',          desc: 'Progress toward learning standards',          icon: '🎯', popular: true },
  { id: 'iep',        name: 'IEP Progress Report',      desc: 'Individualized Education Program tracking',   icon: '📋', popular: false },
  { id: 'parent',     name: 'Parent-Friendly Summary',  desc: 'Simplified overview for conferences',         icon: '👨‍👩‍👧', popular: false },
  { id: 'portfolio',  name: 'Portfolio Summary',         desc: 'Work samples and growth documentation',       icon: '🏆', popular: false },
]

const toneConfig: Record<Tone, { label: string; desc: string; color: string }> = {
  warm:         { label: 'Warm',         desc: 'Personal, caring language',     color: '#f97316' },
  professional: { label: 'Professional', desc: 'Formal, objective language',    color: '#6366f1' },
  detailed:     { label: 'Detailed',     desc: 'In-depth with specific examples', color: '#8b5cf6' },
  encouraging:  { label: 'Encouraging',  desc: 'Growth-focused, motivating',    color: '#10b981' },
}

const sampleReports: Record<string, ReportData> = {
  '1': {
    studentId: '1',
    student: 'Emma Davis',
    period: 'Quarter 2, Fall 2026',
    approved: true,
    subjects: [
      { name: 'Biology',     grade: 'A',  score: 95, comment: 'Emma demonstrates exceptional understanding of biological concepts. Her lab reports are thorough and well-organized. She actively participates in class discussions and shows strong analytical thinking.' },
      { name: 'Mathematics', grade: 'A-', score: 91, comment: 'Strong problem-solving skills with consistent homework completion. Emma excels in algebraic concepts and shows improvement in geometry. Would benefit from more practice with word problems.' },
      { name: 'English',     grade: 'B+', score: 88, comment: 'Emma is a thoughtful reader with strong comprehension skills. Her essays show good organization. Continuing to develop her analytical writing voice and thesis argumentation.' },
      { name: 'History',     grade: 'A',  score: 94, comment: 'Excellent research skills and critical thinking. Emma connects historical events to modern contexts effectively. Her Industrial Revolution presentation was outstanding.' },
    ],
    strengths: ['Critical thinking', 'Lab methodology', 'Research skills', 'Class participation'],
    growth: ['Analytical writing', 'Math word problems', 'Time management'],
    teacherNote: 'Emma is a dedicated student who consistently goes above and beyond. She is a positive influence on her peers and demonstrates strong leadership qualities in group projects. I recommend she consider joining the Science Olympiad team.',
  },
  '2': {
    studentId: '2',
    student: 'Liam Chen',
    period: 'Quarter 2, Fall 2026',
    approved: false,
    subjects: [
      { name: 'Biology',     grade: 'B+', score: 87, comment: 'Liam shows genuine curiosity about biology. Lab work is thoughtful and careful. He benefits from visual aids and hands-on activities, which align well with his IEP accommodations.' },
      { name: 'Mathematics', grade: 'B',  score: 83, comment: 'Liam has made meaningful progress this quarter. He is working consistently with his IEP supports and showing greater confidence when breaking down multi-step problems.' },
      { name: 'English',     grade: 'B-', score: 80, comment: 'Liam is growing as a reader and writer. With extended time accommodations, he is completing more assignments and the quality is improving. His ideas are creative and engaging.' },
      { name: 'History',     grade: 'B',  score: 82, comment: 'Strong oral contributions in class. Liam\'s IEP-supported essay outlines have helped him organize his written work. His progress this quarter reflects real effort and perseverance.' },
    ],
    strengths: ['Curiosity', 'Oral participation', 'Lab skills', 'Perseverance'],
    growth: ['Written expression', 'Multi-step problem solving', 'Independent organization'],
    teacherNote: 'Liam has shown impressive growth this quarter when supported with his IEP accommodations. He is kind, curious, and genuinely invested in learning. I am proud of his progress and encourage him to keep advocating for himself.',
  },
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('')
}

export default function ReportCardsPage() {
  const [step, setStep]                     = useState<Step>('select')
  const [search, setSearch]                 = useState('')
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set(['1', '2', '3']))
  const [generating, setGenerating]         = useState(false)
  const [expandedSubject, setExpandedSubject] = useState<number>(0)
  const [selectedTemplate, setSelectedTemplate] = useState('standard')
  const [tone, setTone]                     = useState<Tone>('warm')
  const [aiOpen, setAiOpen]                 = useState(true)
  const [previewStudentIdx, setPreviewStudentIdx] = useState(0)
  const [regeneratingSubject, setRegeneratingSubject] = useState<number | null>(null)
  const [commentLength, setCommentLength]   = useState<'short' | 'medium' | 'long'>('medium')
  const [approvals, setApprovals]           = useState<Set<string>>(new Set(['1']))
  const [shareOpen, setShareOpen]           = useState(false)

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  )

  const selectedList = students.filter(s => selectedStudents.has(s.id))
  const currentPreviewStudent = selectedList[previewStudentIdx]
  const currentReport = currentPreviewStudent ? (sampleReports[currentPreviewStudent.id] ?? sampleReports['1']) : sampleReports['1']

  function toggleStudent(id: string) {
    const next = new Set(selectedStudents)
    next.has(id) ? next.delete(id) : next.add(id)
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

  async function regenerateSubject(i: number) {
    setRegeneratingSubject(i)
    await new Promise(r => setTimeout(r, 1600))
    setRegeneratingSubject(null)
  }

  function toggleApproval(id: string) {
    setApprovals(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const [toastMsg, setToastMsg] = useState('')
  function showToast(msg: string) {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 2500)
  }

  const approvedCount = approvals.size
  const gradeDistribution = [
    { grade: 'A', count: students.filter(s => s.grade.startsWith('A')).length, color: '#10b981' },
    { grade: 'B', count: students.filter(s => s.grade.startsWith('B')).length, color: '#6366f1' },
    { grade: 'C', count: students.filter(s => s.grade.startsWith('C')).length, color: '#f59e0b' },
    { grade: 'D', count: students.filter(s => s.grade.startsWith('D')).length, color: '#ef4444' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <FadeUp>
        <div className="hero-mesh rounded-3xl p-6 border border-white/[0.06]">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-black text-white tracking-tight">AI Report Card Generator</h1>
                  <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full font-bold border border-indigo-500/20">AI-Powered</span>
                </div>
                <p className="text-sm text-surface-400">Generate personalized report cards with AI-written subject comments in seconds</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
              {step !== 'select' && (
                <button onClick={() => setStep('select')} className="btn-secondary text-xs px-3 py-1.5">Start Over</button>
              )}
              {step === 'preview' && (
                <>
                  <button className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1.5" onClick={() => showToast('Printing all report cards…')}>
                    <Printer className="w-3.5 h-3.5" /> Print All
                  </button>
                  <button className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1.5" onClick={() => showToast('Exporting report cards as PDF…')}>
                    <Download className="w-3.5 h-3.5" /> Export PDF
                  </button>
                  <button className="btn-gradient text-xs px-3 py-1.5 flex items-center gap-1.5" onClick={() => setShareOpen(true)}>
                    <Mail className="w-3.5 h-3.5" /> Email Parents
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="border-t border-white/[0.06] pt-4 flex items-center gap-6 flex-wrap">
            {[
              { label: 'Students', value: `${students.length}` },
              { label: 'Selected', value: `${selectedStudents.size}` },
              { label: 'Approved', value: `${approvedCount}` },
              { label: 'Templates', value: `${reportTemplates.length}` },
              { label: 'Period', value: 'Q2 2026' },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-2">
                <span className="text-lg font-black text-white">{s.value}</span>
                <span className="text-xs text-surface-500">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </FadeUp>

      {/* AI Insights */}
      {step === 'preview' && (
        <FadeUp delay={0.04}>
          <div className="glass-card overflow-hidden">
            <button
              className="w-full flex items-center justify-between px-5 py-4"
              onClick={() => setAiOpen(p => !p)}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent-400" />
                <span className="text-sm font-semibold text-white">AI Report Insights</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-accent-400/20 text-accent-400">
                  {approvedCount}/{selectedStudents.size} approved
                </span>
              </div>
              <motion.div animate={{ rotate: aiOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown className="w-4 h-4 text-surface-400" />
              </motion.div>
            </button>
            <AnimatePresence>
              {aiOpen && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 pt-4 space-y-2 border-t border-white/[0.06]">
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-warning-400/[0.08] border border-warning-400/15">
                      <AlertTriangle className="w-4 h-4 text-warning-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-warning-300">Review Before Sending — Liam Chen</p>
                        <p className="text-[11px] text-surface-400 mt-0.5">Liam has an IEP. Ensure his report comments reference specific accommodations and IEP goals. The generated comments look accurate but confirm with your special education coordinator.</p>
                      </div>
                      <button className="text-[10px] font-semibold text-warning-400 whitespace-nowrap" onClick={() => showToast('Reviewing Liam Chen\'s IEP report…')}>Review →</button>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-danger-400/[0.08] border border-danger-400/15">
                      <TrendingDown className="w-4 h-4 text-danger-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-danger-300">Low GPA — Proactive Outreach Recommended</p>
                        <p className="text-[11px] text-surface-400 mt-0.5">Mia Thompson (C+, 2.4 GPA) and Ava Patel (B-, 2.8 GPA) may benefit from a parent conference conversation alongside the report card.</p>
                      </div>
                      <button className="text-[10px] font-semibold text-danger-400 whitespace-nowrap" onClick={() => showToast('Scheduling parent conferences for Mia & Ava…')}>Schedule →</button>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-success-400/[0.08] border border-success-400/15">
                      <Award className="w-4 h-4 text-success-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-success-300">High Performers — Emma Davis & Ethan Kim</p>
                        <p className="text-[11px] text-surface-400 mt-0.5">Both students are near A/4.0 GPA. Their reports include enrichment recommendations. Consider noting advanced course eligibility for next year.</p>
                      </div>
                      <button className="text-[10px] font-semibold text-success-400 whitespace-nowrap" onClick={() => showToast('Enrichment note added to Emma & Ethan\'s reports')}>Add Note →</button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </FadeUp>
      )}

      {/* Progress Steps */}
      <FadeUp delay={0.06}>
        <div className="flex items-center gap-3 px-1">
          {[
            { key: 'select' as const, label: 'Select Students', num: 1 },
            { key: 'template' as const, label: 'Choose Template', num: 2 },
            { key: 'preview' as const, label: 'Review & Export', num: 3 },
          ].map((s, i) => {
            const isActive = s.key === step
            const isPast = (step === 'template' && s.num === 1) || (step === 'preview' && s.num <= 2)
            return (
              <div key={s.key} className="flex items-center gap-2 flex-1">
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 text-surface-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search students…"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white/[0.04] border border-white/[0.08] text-surface-200 placeholder:text-surface-600 focus:outline-none focus:border-accent-500/40"
                    />
                  </div>
                  <button onClick={selectAll} className="btn-secondary text-xs px-3 py-2">Select All</button>
                  <span className="text-xs text-surface-400 whitespace-nowrap">{selectedStudents.size} selected</span>
                </div>

                <div className="glass-card overflow-hidden">
                  {filteredStudents.map((s, i) => (
                    <motion.div
                      key={s.id}
                      className={`flex items-center gap-4 px-5 py-3.5 cursor-pointer transition-colors ${
                        i < filteredStudents.length - 1 ? 'border-b border-white/[0.06]' : ''
                      } ${selectedStudents.has(s.id) ? 'bg-accent-500/[0.06]' : 'hover:bg-white/[0.02]'}`}
                      onClick={() => toggleStudent(s.id)}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        selectedStudents.has(s.id) ? 'bg-accent-500 border-accent-500' : 'border-white/[0.15]'
                      }`}>
                        {selectedStudents.has(s.id) && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, #6366f1, #a78bfa)' }}
                      >
                        {getInitials(s.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-semibold text-white">{s.name}</p>
                          {s.iep && <span className="text-[9px] px-1 py-0.5 rounded bg-accent-500/20 text-accent-300 font-semibold">IEP</span>}
                          {s.ell && <span className="text-[9px] px-1 py-0.5 rounded bg-electric-400/20 text-electric-400 font-semibold">ELL</span>}
                        </div>
                        <p className="text-xs text-surface-500">GPA {s.gpa} · {s.attendance}% attendance</p>
                      </div>
                      <span className="text-sm font-bold text-accent-400">{s.grade}</span>
                      <span className={`text-base ${s.trend === 'up' ? 'text-success-400' : s.trend === 'down' ? 'text-danger-400' : 'text-surface-500'}`}>
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
              </div>

              {/* Grade Distribution Sidebar */}
              <div className="space-y-4">
                <FadeInWhenVisible>
                  <div className="glass-card p-4">
                    <h4 className="text-xs font-semibold text-surface-300 flex items-center gap-1.5 mb-3">
                      <BarChart2 className="w-3.5 h-3.5 text-accent-400" />
                      Grade Distribution
                    </h4>
                    <div className="space-y-2.5">
                      {gradeDistribution.map(g => (
                        <div key={g.grade}>
                          <div className="flex justify-between text-[10px] mb-1">
                            <span className="font-semibold text-surface-300">Grade {g.grade}</span>
                            <span style={{ color: g.color }} className="font-bold">{g.count} students</span>
                          </div>
                          <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ background: g.color }}
                              initial={{ width: 0 }}
                              animate={{ width: g.count > 0 ? `${(g.count / students.length) * 100}%` : '0%' }}
                              transition={{ duration: 0.7, delay: 0.2 }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-white/[0.06] flex justify-between text-[10px]">
                      <span className="text-surface-500">Class avg GPA</span>
                      <span className="font-bold text-accent-400">{(students.reduce((a, b) => a + b.gpa, 0) / students.length).toFixed(2)}</span>
                    </div>
                  </div>
                </FadeInWhenVisible>

                <FadeInWhenVisible delay={0.1}>
                  <div className="glass-card p-4">
                    <h4 className="text-xs font-semibold text-surface-300 mb-3 flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-accent-400" />
                      Batch Options
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-[11px] text-surface-500 block mb-1.5">Comment Tone</label>
                        <div className="grid grid-cols-2 gap-1">
                          {(Object.entries(toneConfig) as [Tone, typeof toneConfig[Tone]][]).map(([key, cfg]) => (
                            <button
                              key={key}
                              onClick={() => setTone(key)}
                              className={`px-2 py-1.5 rounded-lg text-[10px] font-medium border transition-all ${
                                tone === key ? 'border-white/[0.12]' : 'border-transparent hover:bg-white/[0.03]'
                              }`}
                              style={tone === key ? { color: cfg.color, borderColor: cfg.color + '30', background: cfg.color + '10' } : { color: '#94a3b8' }}
                            >
                              {cfg.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-[11px] text-surface-500 block mb-1.5">Comment Length</label>
                        <div className="flex gap-1">
                          {(['short', 'medium', 'long'] as const).map(l => (
                            <button
                              key={l}
                              onClick={() => setCommentLength(l)}
                              className={`flex-1 py-1.5 rounded-lg text-[10px] font-medium capitalize transition-all ${
                                commentLength === l ? 'bg-accent-500/20 text-accent-300' : 'text-surface-500 hover:text-surface-300'
                              }`}
                            >
                              {l}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </FadeInWhenVisible>
              </div>
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
            <p className="text-sm text-surface-400">Choose a format for {selectedStudents.size} students — <span className="text-surface-300 font-medium">{tone}</span> tone, <span className="text-surface-300 font-medium">{commentLength}</span> comments</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reportTemplates.map((t, i) => (
                <motion.button
                  key={t.id}
                  className={`glass-card p-5 text-left group cursor-pointer border transition-all ${
                    selectedTemplate === t.id ? 'border-accent-500/30 bg-accent-500/[0.04]' : 'border-transparent'
                  }`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ y: -3, transition: { duration: 0.18 } }}
                  onClick={() => { setSelectedTemplate(t.id); handleGenerate() }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl">{t.icon}</span>
                    {t.popular && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent-500/15 text-accent-400 font-semibold">Popular</span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-accent-400 transition-colors">{t.name}</h4>
                  <p className="text-xs text-surface-400 mt-1">{t.desc}</p>
                  <div className="flex items-center gap-1 mt-3 text-[10px] text-surface-600">
                    <Sparkles className="w-3 h-3" />
                    AI-generated {commentLength} comments
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Generating Overlay */}
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
            <h3 className="text-lg font-black text-white mb-1">Generating Report Cards…</h3>
            <p className="text-sm text-surface-400 mb-4">
              Writing AI comments for {selectedStudents.size} students · {tone} tone · {commentLength} length
            </p>
            <div className="w-56 h-2 bg-white/[0.06] rounded-full mx-auto overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #6366f1, #a78bfa)' }}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 2.5, ease: 'linear' }}
              />
            </div>
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
            {/* Student Navigation */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Report Card Preview</h3>
                <p className="text-xs text-surface-400">
                  {selectedStudents.size} reports generated · {currentReport.period} · {approvedCount} approved
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  disabled={previewStudentIdx === 0}
                  onClick={() => setPreviewStudentIdx(i => i - 1)}
                  className="p-1.5 rounded-lg bg-white/[0.04] text-surface-400 hover:text-white disabled:opacity-30 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs text-surface-400 min-w-[90px] text-center">
                  {previewStudentIdx + 1} / {selectedList.length}
                </span>
                <button
                  disabled={previewStudentIdx === selectedList.length - 1}
                  onClick={() => setPreviewStudentIdx(i => i + 1)}
                  className="p-1.5 rounded-lg bg-white/[0.04] text-surface-400 hover:text-white disabled:opacity-30 transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Student Tab Strip */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {selectedList.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => setPreviewStudentIdx(i)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium flex-shrink-0 transition-all ${
                    i === previewStudentIdx ? 'bg-accent-500/20 text-accent-300' : 'bg-white/[0.04] text-surface-400 hover:text-surface-200'
                  }`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${approvals.has(s.id) ? 'bg-success-400' : 'bg-white/[0.15]'}`} />
                  {s.name.split(' ')[0]}
                  {s.iep && <span className="text-[8px] text-accent-400">IEP</span>}
                </button>
              ))}
            </div>

            {/* Report Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentReport.studentId}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="glass-card overflow-hidden"
              >
                {/* Report Header */}
                <div className="p-6 border-b border-white/[0.06] bg-gradient-to-r from-accent-500/10 to-transparent">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, #6366f1, #a78bfa)' }}
                      >
                        {getInitials(currentReport.student)}
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-white">{currentReport.student}</h4>
                        <p className="text-xs text-surface-400">{currentReport.period} · Lincoln Middle School</p>
                        {currentPreviewStudent?.iep && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-accent-500/20 text-accent-300 font-semibold mt-1 inline-block">IEP</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-2xl font-black text-accent-400">{currentPreviewStudent?.gpa ?? '3.9'}</p>
                        <p className="text-[10px] text-surface-500 uppercase tracking-wider">GPA</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-white">{currentPreviewStudent?.attendance ?? 97}%</p>
                        <p className="text-[10px] text-surface-500 uppercase tracking-wider">Attendance</p>
                      </div>
                      <button
                        onClick={() => currentPreviewStudent && toggleApproval(currentPreviewStudent.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                          currentPreviewStudent && approvals.has(currentPreviewStudent.id)
                            ? 'bg-success-400/20 border-success-400/30 text-success-300'
                            : 'border-white/[0.10] text-surface-400 hover:text-white'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        {currentPreviewStudent && approvals.has(currentPreviewStudent.id) ? 'Approved' : 'Approve'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Subjects */}
                <div className="p-6 space-y-3">
                  <h4 className="text-sm font-bold text-white">Subject Grades</h4>
                  {currentReport.subjects.map((subj, i) => (
                    <motion.div
                      key={subj.name}
                      className="border border-white/[0.06] rounded-xl overflow-hidden"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                    >
                      <button
                        className="w-full flex items-center gap-4 p-4 text-left hover:bg-white/[0.02] transition-colors"
                        onClick={() => setExpandedSubject(expandedSubject === i ? -1 : i)}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1.5">
                            <span className="text-sm font-bold text-white">{subj.name}</span>
                            <span className="text-base font-black text-accent-400">{subj.grade}</span>
                          </div>
                          <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ background: subj.score >= 90 ? '#10b981' : subj.score >= 80 ? '#6366f1' : '#f97316' }}
                              initial={{ width: 0 }}
                              animate={{ width: `${subj.score}%` }}
                              transition={{ delay: 0.3 + i * 0.08, duration: 0.6 }}
                            />
                          </div>
                        </div>
                        <span className="text-sm font-bold text-surface-400">{subj.score}%</span>
                        <button
                          onClick={e => { e.stopPropagation(); regenerateSubject(i) }}
                          className="p-1.5 rounded-lg bg-white/[0.04] text-surface-500 hover:text-accent-400 hover:bg-accent-500/10 transition-all"
                          title="Regenerate comment"
                        >
                          {regeneratingSubject === i
                            ? <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            : <Sparkles className="w-3.5 h-3.5" />}
                        </button>
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
                              {regeneratingSubject === i ? (
                                <div className="flex items-center gap-2 mt-3 text-xs text-surface-500">
                                  <RefreshCw className="w-3 h-3 animate-spin text-accent-400" />
                                  Regenerating comment with {tone} tone…
                                </div>
                              ) : (
                                <p className="text-sm text-surface-300 leading-relaxed mt-3">{subj.comment}</p>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>

                {/* Strengths + Growth */}
                <div className="p-6 border-t border-white/[0.06] grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                      <Star className="w-4 h-4 text-warning-400" /> Strengths
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {currentReport.strengths.map(s => (
                        <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-success-400/15 text-success-400 font-medium">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-accent-400" /> Areas for Growth
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {currentReport.growth.map(g => (
                        <span key={g} className="text-xs px-2.5 py-1 rounded-full bg-accent-500/15 text-accent-400 font-medium">{g}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Teacher Comments */}
                <div className="p-6 border-t border-white/[0.06] bg-white/[0.02]">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-bold text-white">Teacher Comments</h4>
                    <button
                      onClick={() => regenerateSubject(-1)}
                      className="flex items-center gap-1 text-[11px] text-accent-400 hover:text-accent-300 transition-colors"
                    >
                      <Zap className="w-3 h-3" /> Regenerate
                    </button>
                  </div>
                  <p className="text-sm text-surface-300 leading-relaxed italic">&ldquo;{currentReport.teacherNote}&rdquo;</p>
                  <p className="text-xs text-surface-500 mt-2">— Alex Johnson, Science Teacher</p>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center gap-3 text-xs text-surface-500 flex-wrap">
              <span className="flex items-center gap-1.5">
                <Check className="w-3 h-3 text-success-400" />
                AI-generated {tone} comments · {commentLength} length
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="w-3 h-3" />
                Proofread before sending
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share / Email Modal */}
      <AnimatePresence>
        {shareOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShareOpen(false)} />
            <motion.div
              className="relative glass-card p-6 w-full max-w-sm z-10"
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white">Email Parents</h3>
                <button onClick={() => setShareOpen(false)} className="text-surface-500 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] mb-3">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-accent-400" />
                  <div>
                    <div className="text-xs font-semibold text-white">{selectedStudents.size} families</div>
                    <div className="text-[10px] text-surface-500">Only {approvedCount} approved — {selectedStudents.size - approvedCount} pending</div>
                  </div>
                </div>
              </div>
              {selectedStudents.size - approvedCount > 0 && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-warning-400/10 border border-warning-400/20 mb-3">
                  <AlertTriangle className="w-3.5 h-3.5 text-warning-400 flex-shrink-0" />
                  <p className="text-[11px] text-warning-300">Approve all reports before sending.</p>
                </div>
              )}
              <div className="space-y-1.5">
                {['Send Approved Reports Now', 'Schedule for Monday 8 AM', 'Download All as ZIP', 'Print All Reports'].map(opt => (
                  <button
                    key={opt}
                    onClick={() => { setShareOpen(false); showToast(opt) }}
                    className="w-full text-left px-3 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] text-xs text-surface-300 hover:text-white transition-all"
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <button onClick={() => { setShareOpen(false); showToast('Report cards sent to all parents!') }} className="btn-gradient text-xs px-4 py-2 w-full mt-3">
                <Mail className="w-3.5 h-3.5" /> Confirm & Send
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
