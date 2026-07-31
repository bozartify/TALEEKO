'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FadeUp, StaggerList, StaggerItem } from '@/components/ui/motion'
import {
  ClipboardList, Sparkles, Plus, Download, Printer, Clock, Users,
  BookOpen, AlertTriangle, CheckSquare, ChevronDown, ChevronRight,
  RefreshCw, Copy, Star, MapPin, Phone, Shield, Zap, FileText,
  Calendar, Edit, Check, X, Settings
} from 'lucide-react'

type PlanStatus = 'draft' | 'ready' | 'used'

interface Period {
  id: string
  time: string
  name: string
  grade: string
  students: number
  activity: string
  materials: string[]
  notes: string
  color: string
}

interface SubPlan {
  id: string
  date: string
  title: string
  status: PlanStatus
  periods: Period[]
  substitute?: string
  emergencyContact: string
  seatingNote: string
  behaviorNote: string
  medicalAlerts: string[]
  classroomProcedures: string[]
}

const periodColors = ['#6366f1', '#22d3ee', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899']

const samplePlans: SubPlan[] = [
  {
    id: 'sp1',
    date: '2026-08-01',
    title: 'Friday Sub Plan – Biology',
    status: 'ready',
    substitute: 'Ms. Patricia Davis',
    emergencyContact: 'Ms. Johnson (Dept Chair) – Room 114 – ext. 4114',
    seatingNote: 'Seating chart is printed and attached. Please enforce assigned seats — Marcus and Devon must not sit adjacent.',
    behaviorNote: 'Class is generally well-behaved. Period 3 can be noisy during transitions. Use the 3-tap-signal to get attention.',
    medicalAlerts: ['Emma J. – EpiPen in nurse\'s office (nut allergy)', 'Carlos M. – Type 1 diabetic, may need bathroom pass'],
    classroomProcedures: [
      'Take attendance in PowerSchool within 5 minutes of class start',
      'Students may use the bathroom one at a time with the hall pass (blue laminated card)',
      'If fire alarm: exit through back door, assemble at the flagpole',
      'Students know the classroom routines — let them lead the warm-up',
    ],
    periods: [
      {
        id: 'p1', time: '8:05 – 8:55', name: 'Period 1 – Biology Honors',
        grade: '10th', students: 24, color: '#6366f1',
        activity: 'Photosynthesis Lab (Part 2)',
        materials: ['Lab worksheet (copies on my desk)', 'Spinach leaves (in fridge in prep room)', 'Sodium bicarbonate solution (labeled)'],
        notes: 'Students already did part 1 yesterday. They know the procedure. Circulate and ask guiding questions. Collect lab worksheets at the end.',
      },
      {
        id: 'p2', time: '9:00 – 9:50', name: 'Period 2 – Biology',
        grade: '9th', students: 28, color: '#22d3ee',
        activity: 'Cell Organelle Review + Kahoot',
        materials: ['Kahoot code: 8847291 (on sticky note on my monitor)', 'Review packet (copies in blue folder)'],
        notes: 'Play Kahoot for first 25 minutes, then let students complete the review packet independently. Collect completed packets.',
      },
      {
        id: 'p3', time: '10:05 – 10:55', name: 'Period 3 – Biology',
        grade: '9th', students: 22, color: '#10b981',
        activity: 'Video: "The Secret Life of Cells" + Reflection',
        materials: ['YouTube link on whiteboard', 'Reflection worksheet (copies in green folder)'],
        notes: 'This class can be chatty. Start the video immediately. Students fill in reflection as they watch. Collect at bell.',
      },
      {
        id: 'p4', time: '11:00 – 11:50', name: 'Period 4 – AP Biology',
        grade: '11th', students: 26, color: '#f59e0b',
        activity: 'FRQ Practice: Enzyme Kinetics',
        materials: ['FRQ packet (copies on my desk)', '2024 AP Biology FRQ rubric (binder on shelf)'],
        notes: 'AP students are self-directed. Give them the FRQ packet, set a timer for 40 minutes, then go over answers using the rubric. They can grade each other.',
      },
      {
        id: 'p5', time: '12:35 – 1:25', name: 'Period 5 – Biology',
        grade: '9th', students: 24, color: '#8b5cf6',
        activity: 'Cell Organelle Review + Kahoot',
        materials: ['Same Kahoot as Period 2', 'Review packet (copies in blue folder)'],
        notes: 'Same activity as Period 2. Remind students the review packet counts as a classwork grade.',
      },
      {
        id: 'p6', time: '1:30 – 2:20', name: 'Period 6 – Biology Honors',
        grade: '10th', students: 20, color: '#ec4899',
        activity: 'Independent Research: Genetic Disorders',
        materials: ['Chromebooks (cart in hallway, code: 4872)', 'Research guideline sheet (copies on my desk)'],
        notes: 'Students are researching a chosen genetic disorder for their upcoming presentation. They work independently. Monitor screen usage.',
      },
    ],
  },
  {
    id: 'sp2',
    date: '2026-08-05',
    title: 'PD Day Sub Plan – Monday',
    status: 'draft',
    emergencyContact: 'Mr. Kim (Dept Chair) – Room 108 – ext. 4108',
    seatingNote: 'Seating chart in top drawer of desk.',
    behaviorNote: 'Use proximity to manage behavior. Refer serious issues to the office.',
    medicalAlerts: ['Emma J. – EpiPen in nurse\'s office (nut allergy)'],
    classroomProcedures: [
      'Attendance in PowerSchool within 5 minutes',
      'Hall pass by door – one student at a time',
      'No phones during instruction',
    ],
    periods: [
      {
        id: 'p1', time: '8:05 – 8:55', name: 'Period 1 – Biology',
        grade: '9th', students: 26, color: '#6366f1',
        activity: 'Textbook Reading: Chapter 7 + Questions',
        materials: ['Textbooks (class set on shelf)', 'Chapter 7 questions (copies in red folder)'],
        notes: 'Students read pages 142–158 and answer all questions. This is independent work.',
      },
    ],
  },
]

const statusConfig: Record<PlanStatus, { bg: string; text: string; label: string; dot: string }> = {
  draft: { bg: 'bg-surface-700/50', text: 'text-surface-400', label: 'Draft',     dot: 'bg-surface-500' },
  ready: { bg: 'bg-success-500/10', text: 'text-success-400', label: 'Ready',     dot: 'bg-success-400' },
  used:  { bg: 'bg-accent-500/10',  text: 'text-accent-400',  label: 'Used',      dot: 'bg-accent-400' },
}

export default function SubPlansPage() {
  const [selectedPlan, setSelectedPlan] = useState<SubPlan>(samplePlans[0])
  const [expandedPeriod, setExpandedPeriod] = useState<string | null>('p1')
  const [generating, setGenerating] = useState(false)
  const [absentDate, setAbsentDate] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [showProcedures, setShowProcedures] = useState(false)

  async function handleGenerate() {
    setGenerating(true)
    await new Promise(r => setTimeout(r, 2500))
    setGenerating(false)
  }

  function handleCopy(id: string) {
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="p-6 space-y-6 max-w-[1600px]">
      {/* Header */}
      <FadeUp>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #22d3ee, #6366f1)' }}>
              <ClipboardList className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-surface-100">Sub Plans</h1>
              <p className="text-sm text-surface-500">AI-powered substitute teacher plans, ready in seconds</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-gradient text-sm px-4 py-2" onClick={handleGenerate}>
              <Sparkles className="w-4 h-4" />
              {generating ? 'Generating…' : 'AI Generate Plan'}
            </button>
            <button className="btn-secondary text-sm px-4 py-2">
              <Plus className="w-4 h-4" />
              New Plan
            </button>
          </div>
        </div>
      </FadeUp>

      {/* Quick Generate Banner */}
      <FadeUp delay={0.05}>
        <div className="glass-card p-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-electric-500/5 to-accent-500/5" />
          <div className="relative flex items-center gap-4 flex-wrap">
            <Zap className="w-5 h-5 text-electric-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-surface-200">Quick-generate from your lesson plans</p>
              <p className="text-xs text-surface-500">AI reads your upcoming lesson plans and writes a complete sub plan automatically</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-surface-500" />
                <input
                  type="date"
                  value={absentDate}
                  onChange={e => setAbsentDate(e.target.value)}
                  className="px-3 py-1.5 text-xs rounded-xl bg-white/[0.04] border border-white/[0.08] text-surface-200 focus:outline-none focus:border-accent-500/40"
                />
              </div>
              <button onClick={handleGenerate} disabled={generating} className="btn-gradient text-xs px-3 py-1.5 disabled:opacity-50">
                {generating ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                Generate for This Date
              </button>
            </div>
          </div>
        </div>
      </FadeUp>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Sidebar: Plan List */}
        <div className="xl:col-span-1 space-y-3">
          <FadeUp delay={0.1}>
            <h3 className="text-sm font-semibold text-surface-300 px-1">Saved Plans</h3>
          </FadeUp>
          <StaggerList>
            {samplePlans.map(plan => {
              const sc = statusConfig[plan.status]
              const isSelected = selectedPlan.id === plan.id
              return (
                <StaggerItem key={plan.id}>
                  <button
                    onClick={() => setSelectedPlan(plan)}
                    className={`w-full text-left glass-card p-4 transition-all ${isSelected ? 'border-accent-500/40 bg-accent-500/5' : 'hover:border-white/10'}`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <p className="text-sm font-semibold text-surface-100 leading-tight">{plan.title}</p>
                      <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold flex-shrink-0 ${sc.bg} ${sc.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                        {sc.label}
                      </span>
                    </div>
                    <p className="text-xs text-surface-500">{new Date(plan.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                    <p className="text-[11px] text-surface-600 mt-1">{plan.periods.length} periods planned{plan.substitute ? ` · ${plan.substitute}` : ''}</p>
                  </button>
                </StaggerItem>
              )
            })}
          </StaggerList>

          {/* Tips Card */}
          <FadeUp delay={0.3}>
            <div className="glass-card p-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-success-500/5 to-transparent" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-4 h-4 text-warning-400" />
                  <span className="text-xs font-semibold text-surface-200">Pro Tips</span>
                </div>
                <ul className="space-y-2 text-xs text-surface-500">
                  {[
                    'Keep a printed copy in your desk drawer',
                    'Update seating chart notes each semester',
                    'Include a reward/activity for good behavior',
                    'Leave a feedback form for the sub',
                  ].map((t, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckSquare className="w-3 h-3 text-success-400 mt-0.5 flex-shrink-0" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </FadeUp>
        </div>

        {/* Main Plan View */}
        <div className="xl:col-span-3 space-y-4">
          <FadeUp delay={0.1}>
            {/* Plan Header */}
            <div className="glass-card p-5">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-lg font-bold text-surface-100">{selectedPlan.title}</h2>
                  <p className="text-sm text-surface-500 mt-0.5">
                    {new Date(selectedPlan.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    {selectedPlan.substitute && ` · Sub: ${selectedPlan.substitute}`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="btn-secondary text-xs px-3 py-1.5">
                    <Printer className="w-3.5 h-3.5" />
                    Print
                  </button>
                  <button className="btn-secondary text-xs px-3 py-1.5">
                    <Download className="w-3.5 h-3.5" />
                    PDF
                  </button>
                  <button className="btn-secondary text-xs px-3 py-1.5">
                    <Edit className="w-3.5 h-3.5" />
                    Edit
                  </button>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <Phone className="w-4 h-4 text-accent-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold mb-0.5">Emergency Contact</p>
                    <p className="text-xs text-surface-300">{selectedPlan.emergencyContact}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <MapPin className="w-4 h-4 text-success-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold mb-0.5">Seating Note</p>
                    <p className="text-xs text-surface-300">{selectedPlan.seatingNote}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <Users className="w-4 h-4 text-warning-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold mb-0.5">Behavior Note</p>
                    <p className="text-xs text-surface-300">{selectedPlan.behaviorNote}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl bg-danger-500/5 border border-danger-500/20">
                  <AlertTriangle className="w-4 h-4 text-danger-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-danger-400 uppercase tracking-wider font-semibold mb-0.5">Medical Alerts</p>
                    {selectedPlan.medicalAlerts.map((a, i) => (
                      <p key={i} className="text-xs text-surface-300">{a}</p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Classroom Procedures Accordion */}
              <button
                onClick={() => setShowProcedures(p => !p)}
                className="w-full flex items-center gap-2 mt-3 px-3 py-2 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs text-surface-400 hover:text-surface-200 transition-colors"
              >
                <Settings className="w-3.5 h-3.5" />
                <span className="flex-1 text-left font-medium">Classroom Procedures ({selectedPlan.classroomProcedures.length})</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showProcedures ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {showProcedures && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <ul className="mt-2 space-y-1.5 pl-2">
                      {selectedPlan.classroomProcedures.map((proc, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-surface-400">
                          <div className="w-5 h-5 rounded-full bg-accent-500/10 text-accent-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                            {i + 1}
                          </div>
                          {proc}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </FadeUp>

          {/* Period Plans */}
          <FadeUp delay={0.2}>
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-surface-300 px-1">Period-by-Period Schedule</h3>
              {selectedPlan.periods.map((period, idx) => {
                const isExpanded = expandedPeriod === period.id
                return (
                  <motion.div
                    key={period.id}
                    className="glass-card overflow-hidden"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                  >
                    <button
                      onClick={() => setExpandedPeriod(isExpanded ? null : period.id)}
                      className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
                    >
                      <div
                        className="w-1.5 h-8 rounded-full flex-shrink-0"
                        style={{ background: period.color }}
                      />
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Clock className="w-3.5 h-3.5 text-surface-500" />
                        <span className="text-[11px] text-surface-500 font-mono">{period.time}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-surface-200 truncate">{period.name}</p>
                        <p className="text-xs text-surface-500 truncate">{period.activity}</p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="flex items-center gap-1 text-[11px] text-surface-500">
                          <Users className="w-3.5 h-3.5" />
                          {period.students}
                        </div>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-surface-500">
                          {period.grade}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-surface-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </div>
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="border-t border-white/[0.06]"
                        >
                          <div className="p-4 space-y-4">
                            {/* Activity */}
                            <div>
                              <p className="text-[10px] font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Activity</p>
                              <p className="text-sm font-medium text-surface-200">{period.activity}</p>
                            </div>

                            {/* Materials */}
                            <div>
                              <p className="text-[10px] font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Materials Needed</p>
                              <ul className="space-y-1">
                                {period.materials.map((m, i) => (
                                  <li key={i} className="flex items-start gap-2 text-xs text-surface-400">
                                    <CheckSquare className="w-3.5 h-3.5 text-success-400 mt-0.5 flex-shrink-0" />
                                    {m}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Notes */}
                            <div className="px-3 py-2.5 rounded-xl bg-warning-500/5 border border-warning-500/20">
                              <p className="text-[10px] font-semibold text-warning-400 uppercase tracking-wider mb-1">Sub Notes</p>
                              <p className="text-xs text-surface-400">{period.notes}</p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleCopy(period.id)}
                                className="btn-secondary text-xs px-3 py-1.5"
                              >
                                {copiedId === period.id ? <><Check className="w-3.5 h-3.5 text-success-400" />Copied</> : <><Copy className="w-3.5 h-3.5" />Copy Period</>}
                              </button>
                              <button className="btn-secondary text-xs px-3 py-1.5">
                                <Edit className="w-3.5 h-3.5" />
                                Edit
                              </button>
                              <button className="btn-secondary text-xs px-3 py-1.5 ml-auto">
                                <Sparkles className="w-3.5 h-3.5 text-accent-400" />
                                AI Improve
                              </button>
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

          {/* Footer Actions */}
          <FadeUp delay={0.35}>
            <div className="glass-card p-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-success-400" />
                  <span className="text-xs text-surface-400">All medical alerts verified against school records</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="btn-secondary text-xs px-3 py-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    Add End-of-Day Note
                  </button>
                  <button className="btn-gradient text-xs px-4 py-1.5">
                    <Check className="w-3.5 h-3.5" />
                    Mark as Ready
                  </button>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </div>
  )
}
