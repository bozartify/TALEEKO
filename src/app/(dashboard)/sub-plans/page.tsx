'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FadeUp, StaggerList, StaggerItem, FadeInWhenVisible } from '@/components/ui/motion'
import {
  ClipboardList, Sparkles, Plus, Download, Printer, Clock, Users,
  BookOpen, AlertTriangle, CheckSquare, ChevronDown, ChevronRight,
  RefreshCw, Copy, Star, MapPin, Phone, Shield, Zap, FileText,
  Calendar, Edit, Check, X, Settings, TrendingUp, Lightbulb,
  Share2, Bell, Archive, Trash2, MoreVertical, User, MessageSquare,
  ThumbsUp, ThumbsDown, ArrowRight, Award, BarChart3, ExternalLink,
  BookMarked
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

const PERIOD_COLORS = ['#6366f1', '#22d3ee', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899']

const SAMPLE_PLANS: SubPlan[] = [
  {
    id: 'sp1',
    date: '2026-08-01',
    title: 'Friday Sub Plan – Biology',
    status: 'ready',
    substitute: 'Ms. Patricia Davis',
    emergencyContact: 'Ms. Johnson (Dept Chair) – Room 114 – ext. 4114',
    seatingNote: 'Seating chart is printed and attached. Please enforce assigned seats — Marcus and Devon must not sit adjacent.',
    behaviorNote: 'Class is generally well-behaved. Period 3 can be noisy during transitions. Use the 3-tap-signal to get attention.',
    medicalAlerts: ["Emma J. – EpiPen in nurse's office (nut allergy)", 'Carlos M. – Type 1 diabetic, may need bathroom pass'],
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
        notes: 'AP students are self-directed. Give them the FRQ packet, set a timer for 40 minutes, then go over answers using the rubric.',
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
        notes: 'Students are researching a chosen genetic disorder for their upcoming presentation. Monitor screen usage.',
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
    medicalAlerts: ["Emma J. – EpiPen in nurse's office (nut allergy)"],
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
  {
    id: 'sp3',
    date: '2026-07-18',
    title: 'Sick Day – Last Used',
    status: 'used',
    substitute: 'Mr. Robert Chang',
    emergencyContact: 'Ms. Johnson – Room 114 – ext. 4114',
    seatingNote: 'Chart attached.',
    behaviorNote: 'Standard procedures apply.',
    medicalAlerts: ["Emma J. – EpiPen (nut allergy)"],
    classroomProcedures: ['Attendance first 5 minutes', 'Hall pass one at a time'],
    periods: [
      {
        id: 'p1', time: '8:05 – 8:55', name: 'Period 1 – Biology',
        grade: '9th', students: 24, color: '#6366f1',
        activity: 'Chapter 8 Reading + Summary',
        materials: ['Textbooks', 'Summary worksheet in red folder'],
        notes: 'Independent reading. Collect summaries at the end.',
      },
    ],
  },
]

const STATUS_CONFIG: Record<PlanStatus, { bg: string; text: string; label: string; dot: string }> = {
  draft: { bg: 'bg-surface-700/50', text: 'text-surface-400', label: 'Draft', dot: 'bg-surface-500' },
  ready: { bg: 'bg-success-500/10', text: 'text-success-400', label: 'Ready', dot: 'bg-success-400' },
  used:  { bg: 'bg-accent-500/10',  text: 'text-accent-400',  label: 'Used',  dot: 'bg-accent-400'  },
}

const SUB_RATINGS = [
  { name: 'Ms. Patricia Davis', date: 'Jul 18', rating: 5, note: 'Excellent — students loved her energy!' },
  { name: 'Mr. Robert Chang', date: 'Jun 9', rating: 4, note: 'Solid. All tasks completed on time.' },
  { name: 'Ms. Tanya Brooks', date: 'May 22', rating: 3, note: 'Left early — period 6 unsupervised briefly.' },
]

const AI_ALERTS = [
  {
    icon: AlertTriangle,
    color: '#f59e0b',
    bg: '#f59e0b18',
    title: 'Plan Expiring Soon',
    body: '"PD Day Sub Plan" is still in Draft. You have 2 absences scheduled next month — finalize this plan before Aug 3.',
    action: 'Finalize Now',
  },
  {
    icon: TrendingUp,
    color: '#10b981',
    bg: '#10b98118',
    title: 'High-Quality Activities',
    body: 'Plans with video + reflection outperform lecture-only plans by 23% on sub feedback ratings. Great choice for Period 3!',
    action: 'View Report',
  },
  {
    icon: Lightbulb,
    color: '#6366f1',
    bg: '#6366f118',
    title: 'Add a Feedback Form',
    body: 'Subs who leave feedback improve your plan quality 2× faster. Add a quick end-of-day form to this plan.',
    action: 'Add Form',
  },
]

const USAGE_TREND = [2, 1, 3, 2, 4, 3, 5, 4]
const TREND_LABELS = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8']

const QUICK_ACTIVITIES = [
  'Independent reading + reflection',
  'Review packet (worksheet)',
  'Kahoot review game',
  'Video + guided notes',
  'Peer collaboration activity',
  'Silent study + quiz review',
]

/* ─────────────────────────────────────────────────────────
   COMPONENT
   ───────────────────────────────────────────────────────── */

export default function SubPlansPage() {
  const [plans, setPlans] = useState<SubPlan[]>(SAMPLE_PLANS)
  const [selectedPlan, setSelectedPlan] = useState<SubPlan>(SAMPLE_PLANS[0])
  const [expandedPeriod, setExpandedPeriod] = useState<string | null>('p1')
  const [generating, setGenerating] = useState(false)
  const [absentDate, setAbsentDate] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [showProcedures, setShowProcedures] = useState(false)
  const [aiOpen, setAiOpen] = useState(true)
  const [exportOpen, setExportOpen] = useState(false)
  const [addPeriodOpen, setAddPeriodOpen] = useState(false)
  const [newPeriodName, setNewPeriodName] = useState('')
  const [newPeriodTime, setNewPeriodTime] = useState('')
  const [newPeriodActivity, setNewPeriodActivity] = useState('')
  const [newPeriodMaterials, setNewPeriodMaterials] = useState('')
  const [newPeriodNotes, setNewPeriodNotes] = useState('')
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [actionMenu, setActionMenu] = useState<string | null>(null)
  const [toastMsg, setToastMsg] = useState('')
  const [subRating, setSubRating] = useState(0)

  const showToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 2500)
  }

  const handleGenerate = async () => {
    setGenerating(true)
    await new Promise(r => setTimeout(r, 2500))
    setGenerating(false)
    showToast('Sub plan generated for selected date!')
  }

  const handleCopy = (id: string) => {
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
    showToast('Period details copied to clipboard!')
  }

  const handleMarkReady = () => {
    setPlans(prev => prev.map(p => p.id === selectedPlan.id ? { ...p, status: 'ready' as PlanStatus } : p))
    setSelectedPlan(prev => ({ ...prev, status: 'ready' }))
    showToast('Plan marked as Ready!')
  }

  const handleDuplicate = (planId: string) => {
    const src = plans.find(p => p.id === planId)
    if (!src) return
    const dup: SubPlan = { ...src, id: `sp${Date.now()}`, title: `${src.title} (Copy)`, status: 'draft', date: '' }
    setPlans(prev => [dup, ...prev])
    setSelectedPlan(dup)
    setActionMenu(null)
    showToast('Plan duplicated!')
  }

  const totalStudents = selectedPlan.periods.reduce((s, p) => s + p.students, 0)
  const readyCount = plans.filter(p => p.status === 'ready').length

  return (
    <div className="space-y-6">
      <style>{`
        @media print {
          nav, aside, header, .no-print, [data-no-print] { display: none !important; }
          body { background: white !important; color: black !important; }
          .glass-card { background: white !important; border: 1px solid #ccc !important; box-shadow: none !important; }
          .text-white { color: black !important; }
          .text-surface-200, .text-surface-300, .text-surface-400 { color: #333 !important; }
          .hero-mesh { background: none !important; border: 1px solid #ccc !important; }
          .btn-gradient, .btn-secondary, .btn-primary { display: none !important; }
          .sub-plan-print-area { display: block !important; }
          @page { margin: 1in; }
        }
      `}</style>
      {/* ── TOAST ─── */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white shadow-xl"
            style={{ background: 'linear-gradient(135deg, #22d3ee, #6366f1)' }}
            initial={{ opacity: 0, y: -16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.95 }}
          >
            <Check className="w-4 h-4" />
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HEADER ─── */}
      <FadeUp>
        <div className="hero-mesh rounded-3xl p-6 border border-white/[0.06]">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg,#22d3ee,#0891b2)' }}>
                <ClipboardList className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-black text-white tracking-tight">Sub Plans</h1>
                  <span className="text-[10px] bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full font-bold border border-cyan-500/20">AI-Powered</span>
                </div>
                <p className="text-sm text-surface-400">AI-powered substitute teacher plans, ready in seconds</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <motion.button className="btn-secondary text-xs px-3 py-1.5" whileHover={{ scale: 1.03 }} onClick={() => setExportOpen(true)}>
                <Download className="w-3.5 h-3.5" /> Export
              </motion.button>
              <motion.button className="btn-secondary text-xs px-3 py-1.5" whileHover={{ scale: 1.03 }} onClick={() => showToast('New plan created!')}>
                <Plus className="w-3.5 h-3.5" /> New Plan
              </motion.button>
              <motion.button className="btn-gradient text-xs" whileHover={{ scale: 1.03 }} onClick={handleGenerate}>
                <Sparkles className="w-3.5 h-3.5" />
                {generating ? 'Generating…' : 'AI Generate'}
              </motion.button>
            </div>
          </div>
          <div className="border-t border-white/[0.06] pt-4 flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold">Plans</span>
              <span className="text-xs font-bold text-white">{plans.length}</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold">Ready</span>
              <span className="text-xs font-bold text-success-400">{readyCount}</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold">Periods</span>
              <span className="text-xs font-bold text-white">{selectedPlan.periods.length}</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold">Students</span>
              <span className="text-xs font-bold text-white">{totalStudents}</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold">Sub Notes</span>
              <span className="text-xs font-bold text-cyan-400">Active</span>
            </div>
          </div>
        </div>
      </FadeUp>

      {/* ── AI INSIGHTS ─── */}
      <FadeUp delay={0.04}>
        <div className="glass-card overflow-hidden">
          <button
            className="w-full flex items-center justify-between p-4 text-left"
            onClick={() => setAiOpen(v => !v)}
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-accent-500/15">
                <Sparkles className="w-3.5 h-3.5 text-accent-400" />
              </div>
              <span className="text-sm font-bold text-white">AI Sub Plan Insights</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 font-medium">1 urgent</span>
            </div>
            <motion.div animate={{ rotate: aiOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="w-4 h-4 text-surface-400" />
            </motion.div>
          </button>
          <AnimatePresence initial={false}>
            {aiOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.28, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                  {AI_ALERTS.map((alert, i) => (
                    <motion.div
                      key={alert.title}
                      className="rounded-xl p-4"
                      style={{ background: alert.bg, border: `1px solid ${alert.color}25` }}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07 }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <alert.icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: alert.color }} />
                        <span className="text-xs font-bold text-white">{alert.title}</span>
                      </div>
                      <p className="text-[11px] text-surface-400 leading-relaxed mb-3">{alert.body}</p>
                      <button className="text-[11px] font-semibold flex items-center gap-1" style={{ color: alert.color }}>
                        {alert.action} <ArrowRight className="w-3 h-3" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </FadeUp>

      {/* ── QUICK STATS ─── */}
      <FadeUp delay={0.08}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Plans Ready', value: readyCount, icon: CheckSquare, color: '#10b981', sub: 'of ' + plans.length + ' total' },
            { label: 'Total Periods', value: selectedPlan.periods.length, icon: Clock, color: '#6366f1', sub: 'in selected plan' },
            { label: 'Students Covered', value: totalStudents, icon: Users, color: '#22d3ee', sub: 'across all periods' },
            { label: 'Time Saved', value: '2.4h', icon: Zap, color: '#f59e0b', sub: 'vs manual writing' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="glass-card p-4"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: stat.color + '18' }}>
                  <stat.icon className="w-3.5 h-3.5" style={{ color: stat.color }} />
                </div>
                <span className="text-xs text-surface-400">{stat.label}</span>
              </div>
              <p className="text-xl font-black text-white">{stat.value}</p>
              <p className="text-[10px] text-surface-500 mt-0.5">{stat.sub}</p>
            </motion.div>
          ))}
        </div>
      </FadeUp>

      {/* ── QUICK GENERATE BANNER ─── */}
      <FadeUp delay={0.12}>
        <div className="glass-card p-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-electric-500/5 to-accent-500/5 pointer-events-none" />
          <div className="relative flex items-center gap-4 flex-wrap">
            <Zap className="w-5 h-5 text-electric-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-surface-200">Quick-generate from your lesson plans</p>
              <p className="text-xs text-surface-500">AI reads your upcoming plans and writes a complete sub plan automatically</p>
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
              <motion.button
                onClick={handleGenerate}
                disabled={generating}
                className="btn-gradient text-xs px-3 py-1.5 disabled:opacity-50"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {generating ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                Generate for This Date
              </motion.button>
            </div>
          </div>
        </div>
      </FadeUp>

      {/* ── MAIN GRID ─── */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">

        {/* SIDEBAR: Plan List */}
        <div className="xl:col-span-1 space-y-3">
          <FadeUp delay={0.14}>
            <h3 className="text-xs font-bold text-surface-400 uppercase tracking-wider px-1">Saved Plans ({plans.length})</h3>
          </FadeUp>
          <StaggerList>
            {plans.map(plan => {
              const sc = STATUS_CONFIG[plan.status]
              const isSelected = selectedPlan.id === plan.id
              return (
                <StaggerItem key={plan.id}>
                  <div className="relative">
                    <button
                      onClick={() => setSelectedPlan(plan)}
                      className={`w-full text-left glass-card p-4 transition-all ${isSelected ? 'border-accent-500/40 bg-accent-500/5' : 'hover:border-white/10'}`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <p className="text-sm font-semibold text-white leading-tight pr-4">{plan.title}</p>
                        <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold flex-shrink-0 ${sc.bg} ${sc.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                          {sc.label}
                        </span>
                      </div>
                      <p className="text-xs text-surface-500">
                        {plan.date ? new Date(plan.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : 'No date set'}
                      </p>
                      <p className="text-[11px] text-surface-600 mt-1">
                        {plan.periods.length} periods{plan.substitute ? ` · ${plan.substitute.split(' ')[0]} ${plan.substitute.split(' ')[1]}` : ''}
                      </p>
                    </button>
                    {/* Action menu button */}
                    <div className="absolute top-3 right-3">
                      <button
                        className="p-1 rounded-lg hover:bg-white/[0.08] transition-colors"
                        onClick={e => { e.stopPropagation(); setActionMenu(actionMenu === plan.id ? null : plan.id) }}
                      >
                        <MoreVertical className="w-3.5 h-3.5 text-surface-500" />
                      </button>
                      <AnimatePresence>
                        {actionMenu === plan.id && (
                          <motion.div
                            className="absolute right-0 top-6 z-20 glass-card py-1 min-w-[140px] shadow-xl"
                            initial={{ opacity: 0, scale: 0.92, y: -6 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.92, y: -6 }}
                            transition={{ duration: 0.15 }}
                          >
                            {[
                              { icon: Copy, label: 'Duplicate', action: () => handleDuplicate(plan.id) },
                              { icon: Share2, label: 'Share', action: () => { setActionMenu(null); showToast('Share link copied!') } },
                              { icon: Printer, label: 'Print', action: () => { setActionMenu(null); window.print() } },
                              { icon: Archive, label: 'Archive', action: () => { setActionMenu(null); showToast('Plan archived') } },
                            ].map(item => (
                              <button
                                key={item.label}
                                onClick={item.action}
                                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-surface-300 hover:text-white hover:bg-white/[0.06] transition-colors"
                              >
                                <item.icon className="w-3.5 h-3.5" />
                                {item.label}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </StaggerItem>
              )
            })}
          </StaggerList>

          {/* Pro Tips */}
          <FadeInWhenVisible>
            <div className="glass-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-xs font-bold text-white">Sub Plan Tips</span>
              </div>
              <ul className="space-y-2">
                {[
                  'Keep a printed copy in your desk drawer',
                  'Update seating chart notes each semester',
                  'Include a reward activity for good behavior',
                  'Leave a feedback form for the sub',
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-[11px] text-surface-500">
                    <CheckSquare className="w-3 h-3 text-emerald-400 mt-0.5 flex-shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </FadeInWhenVisible>
        </div>

        {/* MAIN: Plan Detail */}
        <div className="xl:col-span-3 space-y-4">

          {/* Plan Header Card */}
          <FadeUp delay={0.14}>
            <div className="glass-card p-5">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-lg font-bold text-white">{selectedPlan.title}</h2>
                  <p className="text-sm text-surface-500 mt-0.5">
                    {selectedPlan.date
                      ? new Date(selectedPlan.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
                      : 'No date set'
                    }
                    {selectedPlan.substitute && ` · Sub: ${selectedPlan.substitute}`}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap justify-end">
                  <button className="btn-secondary text-xs px-3 py-1.5" onClick={() => setFeedbackOpen(true)}>
                    <MessageSquare className="w-3.5 h-3.5" /> Feedback
                  </button>
                  <button className="btn-secondary text-xs px-3 py-1.5" onClick={() => window.print()}>
                    <Printer className="w-3.5 h-3.5" /> Print
                  </button>
                  <button className="btn-secondary text-xs px-3 py-1.5" onClick={() => showToast('Opening plan editor…')}>
                    <Edit className="w-3.5 h-3.5" /> Edit
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <Phone className="w-4 h-4 text-accent-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold mb-0.5">Emergency Contact</p>
                    <p className="text-xs text-surface-300">{selectedPlan.emergencyContact}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <MapPin className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold mb-0.5">Seating Note</p>
                    <p className="text-xs text-surface-300">{selectedPlan.seatingNote}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <Users className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold mb-0.5">Behavior Note</p>
                    <p className="text-xs text-surface-300">{selectedPlan.behaviorNote}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl bg-red-500/5 border border-red-500/20">
                  <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-red-400 uppercase tracking-wider font-semibold mb-0.5">Medical Alerts</p>
                    {selectedPlan.medicalAlerts.map((a, i) => (
                      <p key={i} className="text-xs text-surface-300">{a}</p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Procedures Accordion */}
              <button
                onClick={() => setShowProcedures(p => !p)}
                className="w-full flex items-center gap-2 mt-3 px-3 py-2 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs text-surface-400 hover:text-surface-200 transition-colors"
              >
                <Settings className="w-3.5 h-3.5" />
                <span className="flex-1 text-left font-medium">Classroom Procedures ({selectedPlan.classroomProcedures.length})</span>
                <motion.div animate={{ rotate: showProcedures ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </button>
              <AnimatePresence>
                {showProcedures && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22 }}
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

          {/* Period-by-Period */}
          <FadeUp delay={0.18}>
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-sm font-bold text-white">Period-by-Period Schedule</h3>
                <motion.button
                  className="flex items-center gap-1.5 text-xs text-accent-400 font-medium"
                  onClick={() => setAddPeriodOpen(true)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Plus className="w-3.5 h-3.5" /> Add Period
                </motion.button>
              </div>
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
                      <div className="w-1.5 h-8 rounded-full flex-shrink-0" style={{ background: period.color }} />
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Clock className="w-3.5 h-3.5 text-surface-500" />
                        <span className="text-[11px] text-surface-500 font-mono">{period.time}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{period.name}</p>
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
                        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                          <ChevronDown className="w-4 h-4 text-surface-500" />
                        </motion.div>
                      </div>
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22 }}
                          className="border-t border-white/[0.06] overflow-hidden"
                        >
                          <div className="p-4 space-y-4">
                            <div>
                              <p className="text-[10px] font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Activity</p>
                              <p className="text-sm font-medium text-white">{period.activity}</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Materials Needed</p>
                              <ul className="space-y-1">
                                {period.materials.map((m, i) => (
                                  <li key={i} className="flex items-start gap-2 text-xs text-surface-400">
                                    <CheckSquare className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                                    {m}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="px-3 py-2.5 rounded-xl bg-amber-500/5 border border-amber-500/20">
                              <p className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider mb-1">Sub Notes</p>
                              <p className="text-xs text-surface-400">{period.notes}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <motion.button
                                onClick={() => handleCopy(period.id)}
                                className="btn-secondary text-xs px-3 py-1.5"
                                whileTap={{ scale: 0.97 }}
                              >
                                {copiedId === period.id
                                  ? <><Check className="w-3.5 h-3.5 text-emerald-400" /> Copied</>
                                  : <><Copy className="w-3.5 h-3.5" /> Copy Period</>
                                }
                              </motion.button>
                              <button className="btn-secondary text-xs px-3 py-1.5" onClick={() => showToast(`Editing "${period.name}"…`)}>
                                <Edit className="w-3.5 h-3.5" /> Edit
                              </button>
                              <button className="btn-secondary text-xs px-3 py-1.5 ml-auto" onClick={() => showToast(`AI improving "${period.name}"…`)}>
                                <Sparkles className="w-3.5 h-3.5 text-accent-400" /> AI Improve
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
          <FadeUp delay={0.3}>
            <div className="glass-card p-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs text-surface-400">Medical alerts verified against school records</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="btn-secondary text-xs px-3 py-1.5" onClick={() => setFeedbackOpen(true)}>
                    <FileText className="w-3.5 h-3.5" /> Add End-of-Day Note
                  </button>
                  {selectedPlan.status !== 'ready' && (
                    <motion.button
                      className="btn-gradient text-xs px-4 py-1.5"
                      onClick={handleMarkReady}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Check className="w-3.5 h-3.5" /> Mark as Ready
                    </motion.button>
                  )}
                  {selectedPlan.status === 'ready' && (
                    <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                      <Check className="w-4 h-4" /> Plan is Ready
                    </span>
                  )}
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </div>

      {/* ── RIGHT META PANELS (below main grid on XL) ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Sub Usage Trend */}
        <FadeInWhenVisible>
          <div className="glass-card p-4">
            <h4 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
              <BarChart3 className="w-3.5 h-3.5 text-blue-400" />
              Sub Days (8-Week Trend)
            </h4>
            {(() => {
              const W = 240, H = 70, PX = 10, PY = 8
              const maxV = Math.max(...USAGE_TREND) + 1
              const sx = (i: number) => PX + (i / (USAGE_TREND.length - 1)) * (W - PX * 2)
              const sy = (v: number) => PY + ((maxV - v) / maxV) * (H - PY * 2)
              const pts = USAGE_TREND.map((v, i) => ({ x: sx(i), y: sy(v) }))
              let lp = `M ${pts[0].x} ${pts[0].y}`
              for (let i = 1; i < pts.length; i++) {
                const cpx = (pts[i].x + pts[i - 1].x) / 2
                lp += ` C ${cpx} ${pts[i - 1].y} ${cpx} ${pts[i].y} ${pts[i].x} ${pts[i].y}`
              }
              const ap = lp + ` L ${pts[pts.length - 1].x} ${H} L ${pts[0].x} ${H} Z`
              return (
                <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: H }}>
                  <defs>
                    <linearGradient id="sp-trend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d={ap} fill="url(#sp-trend)" />
                  <motion.path d={lp} fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.8, ease: 'easeOut' }} />
                  {pts.map((pt, i) => (
                    <g key={i}>
                      <circle cx={pt.x} cy={pt.y} r={2.5} fill="#6366f1" />
                      <text x={pt.x} y={pt.y - 6} textAnchor="middle" fill="#a5b4fc" fontSize="8" fontWeight="600">{USAGE_TREND[i]}</text>
                      <text x={pt.x} y={H - 1} textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize="7.5">{TREND_LABELS[i]}</text>
                    </g>
                  ))}
                </svg>
              )
            })()}
            <p className="text-[10px] text-surface-500 mt-2">Avg 3.1 sub days/week this term</p>
          </div>
        </FadeInWhenVisible>

        {/* Substitute Ratings */}
        <FadeInWhenVisible>
          <div className="glass-card p-4">
            <h4 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              Recent Sub Ratings
            </h4>
            <div className="space-y-2.5">
              {SUB_RATINGS.map((sub, i) => (
                <motion.div key={sub.name} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.07 }}>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[11px] font-semibold text-white">{sub.name}</span>
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} className="w-2.5 h-2.5" style={{ color: s <= sub.rating ? '#f59e0b' : '#334155' }} fill={s <= sub.rating ? '#f59e0b' : 'none'} />
                      ))}
                    </div>
                  </div>
                  <p className="text-[10px] text-surface-500">{sub.note}</p>
                  {i < SUB_RATINGS.length - 1 && <div className="border-t border-white/[0.04] mt-2" />}
                </motion.div>
              ))}
            </div>
          </div>
        </FadeInWhenVisible>

        {/* Quick Activity Bank */}
        <FadeInWhenVisible>
          <div className="glass-card p-4">
            <h4 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
              <BookMarked className="w-3.5 h-3.5 text-violet-400" />
              Quick Activity Bank
            </h4>
            <div className="space-y-1.5">
              {QUICK_ACTIVITIES.map((activity, i) => (
                <motion.button
                  key={activity}
                  className="w-full flex items-center gap-2 p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.07] text-left transition-colors"
                  initial={{ opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => showToast(`Activity added: "${activity}"`)}
                >
                  <Plus className="w-3 h-3 text-accent-400 flex-shrink-0" />
                  <span className="text-[11px] text-surface-300">{activity}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </FadeInWhenVisible>
      </div>

      {/* ── EXPORT MODAL ─── */}
      <AnimatePresence>
        {exportOpen && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setExportOpen(false)} />
            <motion.div
              className="relative glass-card p-6 w-full max-w-sm"
              initial={{ scale: 0.93, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.93, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-bold text-white">Export Sub Plan</h3>
                <button onClick={() => setExportOpen(false)} className="p-1.5 rounded-lg hover:bg-white/[0.08] transition-colors">
                  <X className="w-4 h-4 text-surface-400" />
                </button>
              </div>
              <div className="space-y-2">
                {[
                  { label: 'Full Plan PDF', icon: FileText, desc: 'Formatted for printing — 1–2 pages' },
                  { label: 'Period Cards (PDF)', icon: ClipboardList, desc: 'One card per period for quick reference' },
                  { label: 'Google Docs', icon: ExternalLink, desc: 'Export to your Drive for editing' },
                  { label: 'Copy as Text', icon: Copy, desc: 'Plain text for email or sub portal' },
                ].map(opt => (
                  <motion.button
                    key={opt.label}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.07] transition-colors text-left"
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { showToast(`Exported: ${opt.label}`); setExportOpen(false) }}
                  >
                    <div className="w-7 h-7 rounded-lg bg-accent-500/15 flex items-center justify-center flex-shrink-0">
                      <opt.icon className="w-3.5 h-3.5 text-accent-400" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">{opt.label}</p>
                      <p className="text-[10px] text-surface-500">{opt.desc}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── ADD PERIOD MODAL ─── */}
      <AnimatePresence>
        {addPeriodOpen && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setAddPeriodOpen(false)} />
            <motion.div
              className="relative glass-card p-6 w-full max-w-md"
              initial={{ scale: 0.93, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.93, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-bold text-white">Add Period</h3>
                <button onClick={() => setAddPeriodOpen(false)} className="p-1.5 rounded-lg hover:bg-white/[0.08] transition-colors">
                  <X className="w-4 h-4 text-surface-400" />
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] text-surface-500 block mb-1">Period Name</label>
                  <input value={newPeriodName} onChange={e => setNewPeriodName(e.target.value)} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white placeholder-surface-600 focus:outline-none focus:border-accent-500/40" placeholder="e.g. Period 3 – Biology" />
                </div>
                <div>
                  <label className="text-[10px] text-surface-500 block mb-1">Time</label>
                  <input value={newPeriodTime} onChange={e => setNewPeriodTime(e.target.value)} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white placeholder-surface-600 focus:outline-none focus:border-accent-500/40" placeholder="e.g. 10:05 – 10:55" />
                </div>
                <div>
                  <label className="text-[10px] text-surface-500 block mb-1">Activity</label>
                  <input value={newPeriodActivity} onChange={e => setNewPeriodActivity(e.target.value)} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white placeholder-surface-600 focus:outline-none focus:border-accent-500/40" placeholder="e.g. Independent Reading + Reflection" />
                </div>
                <div>
                  <label className="text-[10px] text-surface-500 block mb-1">Materials</label>
                  <input value={newPeriodMaterials} onChange={e => setNewPeriodMaterials(e.target.value)} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white placeholder-surface-600 focus:outline-none focus:border-accent-500/40" placeholder="e.g. Worksheets in red folder" />
                </div>
                <div>
                  <label className="text-[10px] text-surface-500 block mb-1">Sub Notes</label>
                  <textarea value={newPeriodNotes} onChange={e => setNewPeriodNotes(e.target.value)} rows={2} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white placeholder-surface-600 focus:outline-none focus:border-accent-500/40 resize-none" placeholder="Any special instructions for the substitute..." />
                </div>
              </div>
              <div className="flex gap-2 mt-5">
                <button onClick={() => setAddPeriodOpen(false)} className="flex-1 btn-secondary text-xs py-2">Cancel</button>
                <motion.button
                  className="flex-1 btn-gradient text-xs py-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    const name = newPeriodName.trim() || `Period ${selectedPlan.periods.length + 1}`
                    const newP: Period = {
                      id: `p${Date.now()}`, time: newPeriodTime || 'TBD', name, grade: '9th', students: 25,
                      activity: newPeriodActivity || 'See instructions', color: PERIOD_COLORS[selectedPlan.periods.length % PERIOD_COLORS.length],
                      materials: newPeriodMaterials ? [newPeriodMaterials] : [], notes: newPeriodNotes,
                    }
                    const updated = { ...selectedPlan, periods: [...selectedPlan.periods, newP] }
                    setSelectedPlan(updated)
                    setPlans(prev => prev.map(p => p.id === updated.id ? updated : p))
                    setNewPeriodName(''); setNewPeriodTime(''); setNewPeriodActivity(''); setNewPeriodMaterials(''); setNewPeriodNotes('')
                    showToast(`"${name}" added!`); setAddPeriodOpen(false)
                  }}
                >
                  <Plus className="w-3.5 h-3.5" /> Add Period
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FEEDBACK MODAL ─── */}
      <AnimatePresence>
        {feedbackOpen && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setFeedbackOpen(false)} />
            <motion.div
              className="relative glass-card p-6 w-full max-w-sm"
              initial={{ scale: 0.93, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.93, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-bold text-white">Sub Feedback</h3>
                <button onClick={() => setFeedbackOpen(false)} className="p-1.5 rounded-lg hover:bg-white/[0.08] transition-colors">
                  <X className="w-4 h-4 text-surface-400" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] text-surface-500 block mb-2">How did the sub perform?</label>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(s => (
                      <motion.button
                        key={s}
                        onClick={() => setSubRating(s)}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Star className="w-6 h-6" style={{ color: s <= subRating ? '#f59e0b' : '#334155' }} fill={s <= subRating ? '#f59e0b' : 'none'} />
                      </motion.button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-surface-500 block mb-1">End-of-Day Notes</label>
                  <textarea
                    rows={3}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white placeholder-surface-600 focus:outline-none focus:border-accent-500/40 resize-none"
                    placeholder="What did the sub report? Any incidents or student notes?"
                  />
                </div>
                <div className="flex gap-2">
                  <motion.button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold bg-emerald-500/15 text-emerald-400" whileHover={{ scale: 1.02 }}>
                    <ThumbsUp className="w-3.5 h-3.5" /> Good Day
                  </motion.button>
                  <motion.button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold bg-red-500/10 text-red-400" whileHover={{ scale: 1.02 }}>
                    <ThumbsDown className="w-3.5 h-3.5" /> Issues
                  </motion.button>
                </div>
              </div>
              <motion.button
                className="w-full btn-gradient text-xs mt-4"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => { showToast('Feedback saved!'); setFeedbackOpen(false) }}
              >
                <Check className="w-3.5 h-3.5" /> Save Feedback
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
