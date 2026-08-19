'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageSquare, Sparkles, Copy, CheckCircle, RefreshCw, Download,
  Users, Star, TrendingUp, TrendingDown, Brain, ChevronDown,
  Sliders, Globe, BookOpen, Heart, Zap, FileText,
  ThumbsUp, AlertCircle, Edit3, X, Check, ArrowRight,
  Lightbulb, Languages, Printer, Share2, Clock, Flag,
  Award, BarChart3, ExternalLink, BookMarked
} from 'lucide-react'
import { FadeUp, FadeInWhenVisible } from '@/components/ui/motion'

interface Student {
  id: string; name: string; initials: string; color: string
  grade: string; avg: number; trend: 'up' | 'down' | 'stable'
  strengths: string[]; growthAreas: string[]
  recentNotes: string
  status: 'excelling' | 'on-track' | 'needs-support'
  iep: boolean; ell: boolean
}

const STUDENTS: Student[] = [
  { id: 's1', name: 'Emma Davis', initials: 'ED', color: '#8b5cf6', grade: 'A', avg: 94, trend: 'up', strengths: ['Critical thinking', 'Lab skills', 'Written communication'], growthAreas: ['Pacing on exams'], recentNotes: 'Led group discussion on photosynthesis; volunteered extra analysis', status: 'excelling', iep: false, ell: false },
  { id: 's2', name: 'Noah Williams', initials: 'NW', color: '#f97316', grade: 'C+', avg: 68, trend: 'up', strengths: ['Participates actively', 'Improved attendance'], growthAreas: ['Reading comprehension', 'Written responses', 'Test preparation'], recentNotes: 'Significant improvement since tutoring started; ELL vocabulary support helping', status: 'needs-support', iep: false, ell: true },
  { id: 's3', name: 'Sophia Chen', initials: 'SC', color: '#10b981', grade: 'A-', avg: 91, trend: 'stable', strengths: ['Data analysis', 'Collaboration', 'Consistent effort'], growthAreas: ['Oral presentations'], recentNotes: 'Consistent high performer; shy but strong lab partner', status: 'on-track', iep: false, ell: false },
  { id: 's4', name: 'Liam Rodriguez', initials: 'LR', color: '#22d3ee', grade: 'B', avg: 82, trend: 'up', strengths: ['Creativity', 'Hands-on learning'], growthAreas: ['Organizational skills', 'Note-taking'], recentNotes: 'IEP accommodations are working; benefits from graphic organizers', status: 'on-track', iep: true, ell: false },
  { id: 's5', name: 'Ava Patel', initials: 'AP', color: '#ec4899', grade: 'A+', avg: 98, trend: 'up', strengths: ['Mathematical reasoning', 'Leadership', 'Peer tutoring'], growthAreas: ['Challenge-seeking'], recentNotes: 'Consistently exceeds expectations; would benefit from acceleration', status: 'excelling', iep: false, ell: false },
  { id: 's6', name: 'James Thompson', initials: 'JT', color: '#f59e0b', grade: 'B-', avg: 76, trend: 'down', strengths: ['Curiosity', 'Creative writing'], growthAreas: ['Attendance', 'Homework completion', 'Focus during instruction'], recentNotes: '3 missed assignments this month; check-in recommended', status: 'needs-support', iep: false, ell: false },
]

type ToneOption = 'encouraging' | 'formal' | 'growth-focused' | 'celebratory'
type LengthOption = 'brief' | 'standard' | 'detailed'
type AudienceOption = 'parent' | 'student' | 'portfolio'

const TONE_OPTIONS: { key: ToneOption; label: string; desc: string; color: string }[] = [
  { key: 'encouraging',    label: 'Encouraging',    desc: 'Warm, positive tone',          color: '#10b981' },
  { key: 'formal',         label: 'Formal',          desc: 'Professional and structured',   color: '#6366f1' },
  { key: 'growth-focused', label: 'Growth-Focused',  desc: 'Emphasizes improvement areas',  color: '#f59e0b' },
  { key: 'celebratory',   label: 'Celebratory',     desc: 'Highlights achievements',       color: '#ec4899' },
]

const LENGTH_OPTIONS: { key: LengthOption; label: string; words: string }[] = [
  { key: 'brief',    label: 'Brief',    words: '50–80 words' },
  { key: 'standard', label: 'Standard', words: '100–150 words' },
  { key: 'detailed', label: 'Detailed', words: '200–250 words' },
]

const TRANSLATE_LANGS = [
  'Spanish', 'French', 'Mandarin', 'Arabic', 'Portuguese',
  'Russian', 'Hindi', 'Japanese', 'Korean', 'German',
]

const SAMPLE_FEEDBACK: Record<string, Record<ToneOption, string>> = {
  s1: {
    encouraging: `Emma continues to be an exceptional learner in 7th Grade Science. Her critical thinking skills shine during class discussions — particularly during our photosynthesis unit, where she took initiative in leading group analysis beyond what was required. Emma's lab reports reflect strong scientific writing, and her ability to connect concepts across units shows genuine intellectual curiosity. I encourage Emma to continue challenging herself and trust her instincts when reasoning through complex problems. She is a pleasure to have in class, and her enthusiasm positively influences her peers.`,
    formal: `Emma Davis has demonstrated outstanding academic performance throughout this reporting period, achieving an average of 94%. Her proficiency in laboratory procedures and written scientific communication is consistently at an advanced level. Emma participates constructively in class discussions and shows initiative in seeking deeper understanding of course material. She is advised to continue her current academic trajectory while seeking additional challenge through independent inquiry or enrichment opportunities.`,
    'growth-focused': `Emma is thriving in 7th Grade Science with a 94% average and consistently strong engagement. To continue her growth, I would encourage Emma to focus on exam pacing strategies — she demonstrates deep knowledge but benefits from time management practice under timed conditions. Participating in science fair or independent research would be an excellent next step. Emma's leadership in group settings is a real strength worth nurturing further.`,
    celebratory: `What an outstanding semester for Emma! Achieving a 94% average, Emma has truly excelled in every area of 7th Grade Science. Her leadership during our photosynthesis investigation was a highlight — going above and beyond with her analysis. Emma's lab skills are exceptional, and her clear, thoughtful writing demonstrates a mature scientific mind. We celebrate Emma's hard work, dedication, and the positive energy she brings to our classroom every day. Congratulations, Emma!`,
  },
  s2: {
    encouraging: `Noah has shown meaningful growth this semester, and I'm proud of the effort he has invested in 7th Grade Science. His attendance and classroom participation have both improved significantly, and the ELL vocabulary support is clearly making a difference in his understanding. Noah's grade of 68% reflects real progress — especially given the challenges he has been working to overcome. Areas to focus on include reading comprehension of science texts and extending written responses. With continued effort and support, I believe Noah is on a positive trajectory. Keep up the great work, Noah!`,
    formal: `Noah Williams has shown notable improvement in participation and attendance during this reporting period. His current average of 68% reflects developing proficiency in core science concepts. Ongoing ELL support has contributed positively to his vocabulary development and classroom comprehension. Recommended focus areas include strengthening reading comprehension strategies and extending written response detail. Continued academic and linguistic support is advised to sustain and accelerate his academic progress.`,
    'growth-focused': `Noah has made meaningful strides this semester, particularly in attendance and classroom engagement. The ELL vocabulary support is working well, and tutoring sessions have helped him build confidence. To continue growing, Noah should focus on reading science texts carefully and practicing extended written responses. I encourage Noah to visit during office hours and continue attending tutoring sessions. His upward trend is genuinely encouraging.`,
    celebratory: `Noah, we are so proud of the growth you have shown this semester! From improved attendance to more confident classroom participation, your effort is truly visible. The vocabulary support is paying off, and your willingness to try even when things are challenging shows incredible strength of character. You've earned your grade improvement — keep pushing forward!`,
  },
  s3: {
    encouraging: `Sophia is a consistently excellent student in 7th Grade Science, maintaining a 91% average through steady, focused effort. Her analytical thinking — especially in data interpretation during lab activities — is a real strength, and she is a reliable, collaborative partner in group settings. I would love to see Sophia build confidence in oral presentations, as her knowledge and insights deserve to be heard more often.`,
    formal: `Sophia Chen has maintained strong academic performance with a 91% average throughout this reporting period. Her laboratory skills and data analysis abilities are proficient, and she contributes positively to collaborative group work. An area for continued development is oral presentation confidence; Sophia is encouraged to participate more actively in class discussions and presentations.`,
    'growth-focused': `Sophia is performing exceptionally well with a 91% average, and her data analysis skills are a clear strength. To take her learning to the next level, I encourage Sophia to speak up more in class discussions and take opportunities to present — her insights are thoughtful and her peers would benefit from hearing them more.`,
    celebratory: `Sophia has had a wonderful semester in 7th Grade Science! Maintaining a 91% average through consistent hard work, she has shown that steady dedication truly pays off. Her lab skills and analytical thinking are genuinely impressive, and her collaborative spirit makes her a fantastic group partner.`,
  },
  s4: {
    encouraging: `Liam is making steady progress in 7th Grade Science with an 82% average that reflects his creative approach to learning. With IEP supports in place — including graphic organizers and extended time — Liam has been able to demonstrate his true understanding. His creative problem-solving often brings fresh perspectives to labs and projects.`,
    formal: `Liam Rodriguez has demonstrated satisfactory academic performance with an 82% average this reporting period. Implemented IEP accommodations, including graphic organizers and extended time, have supported his access to curriculum content. Continued support for organizational skills is recommended to further solidify his academic progress.`,
    'growth-focused': `Liam is growing meaningfully in 7th Grade Science, and the upward trend in his grades reflects real effort. The biggest opportunity for growth is organizational systems — using the graphic organizers and Cornell notes templates consistently will help Liam retain and review information more effectively.`,
    celebratory: `Liam, you've had a growth-filled semester! Your 82% average shows how much you've worked through — from building better organizational habits to thriving with the supports in place. Your creative thinking adds so much to our lab investigations, and it's been wonderful to watch your confidence grow.`,
  },
  s5: {
    encouraging: `Ava is an extraordinary student who has truly set the standard in 7th Grade Science with a remarkable 98% average. Her mathematical reasoning in data analysis is exceptional, and her willingness to support peers shows both mastery and generosity. Ava is encouraged to continue seeking challenge through independent research or science competitions.`,
    formal: `Ava Patel has achieved exceptional academic performance with a 98% average, demonstrating mastery across all assessed content areas. Her mathematical reasoning abilities are particularly noteworthy, as is her leadership in peer learning contexts. Ava is encouraged to pursue academic enrichment through independent research or advanced coursework.`,
    'growth-focused': `Ava is achieving at the highest level with a 98% average, and her next growth opportunity lies in seeking greater challenge. I encourage Ava to pursue a science fair project or look into extracurricular STEM programs where she can explore beyond the standard curriculum. Her peer tutoring shows strong interpersonal skills worth developing in leadership roles.`,
    celebratory: `Ava, 98%! This is an extraordinary achievement and a reflection of your incredible hard work, intellect, and dedication. Your mathematical reasoning is exceptional, your leadership as a peer tutor is inspiring, and your enthusiasm for science is infectious. Congratulations on a spectacular semester, Ava!`,
  },
  s6: {
    encouraging: `James has real strengths in creativity and written expression that shine when he is engaged. This semester, his natural curiosity and imaginative writing have produced some genuinely impressive work. The challenge for James has been consistency — particularly with homework completion and attendance — and these are areas we will focus on together.`,
    formal: `James Thompson has shown creative ability and intellectual curiosity, achieving a 76% average this reporting period. However, attendance irregularities and incomplete assignments have impacted his academic performance. James is encouraged to prioritize consistent attendance and timely submission of work. A parent/guardian conference is recommended to align on improvement strategies.`,
    'growth-focused': `James has real potential that we are working to unlock this semester. His creativity and writing skills are genuine assets, and when he is present and engaged, his contributions are valuable. The priority areas for growth are attendance, homework completion, and focus during direct instruction. I'd strongly recommend scheduling a check-in to discuss strategies and support.`,
    celebratory: `James, your creativity and curiosity are truly special — when you bring those qualities to class, it lights up the room! Your writing has moments of real brilliance. This semester taught us that with consistent attendance and completed assignments, your grade will reflect what you're truly capable of. I'm excited for the growth ahead!`,
  },
}

const AI_ALERTS = [
  {
    icon: AlertCircle,
    color: '#f59e0b',
    bg: '#f59e0b18',
    title: 'Report Card Deadline: Aug 5',
    body: '6 students still need comments. At this pace, you can complete all comments in ~18 minutes using batch generate.',
    action: 'Generate All Now',
  },
  {
    icon: TrendingDown,
    color: '#ef4444',
    bg: '#ef444418',
    title: 'James & Noah Need Follow-Up',
    body: 'Both students have downward or struggling trends. Flagging for parent contact before report cards go home is recommended.',
    action: 'Flag for Contact',
  },
  {
    icon: Lightbulb,
    color: '#6366f1',
    bg: '#6366f118',
    title: 'ELL Adapt Available',
    body: 'Noah Williams is flagged as ELL. Simplified sentence structure and vocabulary checks are automatically applied to his comment.',
    action: 'View ELL Tips',
  },
]

const STATUS_CONFIG = {
  excelling:      { bg: 'bg-success-400/15', text: 'text-success-400', label: 'Excelling' },
  'on-track':     { bg: 'bg-accent-400/15',  text: 'text-accent-400',  label: 'On Track' },
  'needs-support':{ bg: 'bg-warning-400/15', text: 'text-warning-400', label: 'Needs Support' },
}

/* ─────────────────────────────────────────────────────────
   COMPONENT
   ───────────────────────────────────────────────────────── */

export default function FeedbackWriterPage() {
  const [selectedStudent, setSelectedStudent] = useState<Student>(STUDENTS[0])
  const [tone, setTone] = useState<ToneOption>('encouraging')
  const [length, setLength] = useState<LengthOption>('standard')
  const [audience, setAudience] = useState<AudienceOption>('parent')
  const [generating, setGenerating] = useState(false)
  const [batchGenerating, setBatchGenerating] = useState(false)
  const [batchProgress, setBatchProgress] = useState(0)
  const [generated, setGenerated] = useState(false)
  const [copied, setCopied] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editedText, setEditedText] = useState('')
  const [aiOpen, setAiOpen] = useState(true)
  const [exportOpen, setExportOpen] = useState(false)
  const [translateOpen, setTranslateOpen] = useState(false)
  const [toastMsg, setToastMsg] = useState('')
  const [approved, setApproved] = useState<Set<string>>(new Set())
  const [avoidCliches, setAvoidCliches] = useState(true)
  const [includeExamples, setIncludeExamples] = useState(true)
  const [ferpaCheck, setFerpaCheck] = useState(true)

  const feedback = SAMPLE_FEEDBACK[selectedStudent.id]?.[tone] || ''
  const wordCount = (feedback || '').split(' ').length

  const showToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 2500)
  }

  const handleGenerate = () => {
    setGenerating(true)
    setGenerated(false)
    setTimeout(() => {
      setGenerating(false)
      setGenerated(true)
      setEditMode(false)
      setEditedText('')
      showToast(`Comment generated for ${selectedStudent.name}!`)
    }, 2200)
  }

  const handleCopy = () => {
    const text = editMode ? editedText : feedback
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    showToast('Comment copied to clipboard!')
  }

  const handleBatchGenerate = async () => {
    setBatchGenerating(true)
    setBatchProgress(0)
    for (let i = 1; i <= STUDENTS.length; i++) {
      await new Promise(r => setTimeout(r, 500))
      setBatchProgress(i)
    }
    setBatchGenerating(false)
    setApproved(new Set(STUDENTS.map(s => s.id)))
    showToast(`All ${STUDENTS.length} comments generated!`)
  }

  const handleApprove = () => {
    setApproved(prev => {
      const next = new Set(prev)
      if (next.has(selectedStudent.id)) {
        next.delete(selectedStudent.id)
        showToast('Comment un-approved')
      } else {
        next.add(selectedStudent.id)
        showToast(`Comment saved for ${selectedStudent.name}!`)
      }
      return next
    })
  }

  return (
    <div className="space-y-6">
      {/* ── TOAST ─── */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white shadow-xl"
            style={{ background: 'linear-gradient(135deg, #14b8a6, #0d9488)' }}
            initial={{ opacity: 0, y: -16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.95 }}
          >
            <Check className="w-4 h-4" />
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── BATCH PROGRESS OVERLAY ─── */}
      <AnimatePresence>
        {batchGenerating && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <motion.div
              className="relative glass-card p-8 w-full max-w-sm text-center"
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 20 }}
            >
              <motion.div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: 'linear-gradient(135deg, #14b8a6, #0d9488)' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="w-7 h-7 text-white" />
              </motion.div>
              <h3 className="text-base font-bold text-white mb-1">Generating All Comments</h3>
              <p className="text-xs text-surface-400 mb-4">{batchProgress} of {STUDENTS.length} students complete</p>
              {(() => {
                const W = 400, H = 8
                const bw = (batchProgress / STUDENTS.length) * W
                return (
                  <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible mb-2">
                    <defs>
                      <linearGradient id="fw-batch" x1="0" x2="1" y1="0" y2="0">
                        <stop offset="0%" stopColor="#14b8a6" />
                        <stop offset="100%" stopColor="#0d9488" />
                      </linearGradient>
                    </defs>
                    <rect x={0} y={0} width={W} height={H} rx={4} fill="rgba(255,255,255,0.05)" />
                    <motion.rect
                      x={0} y={0} height={H} rx={4}
                      fill="url(#fw-batch)"
                      animate={{ width: bw }}
                      transition={{ duration: 0.4 }}
                    />
                  </svg>
                )
              })()}
              <div className="flex gap-1 justify-center mt-3">
                {STUDENTS.map((s, i) => (
                  <div key={s.id} className="w-2 h-2 rounded-full" style={{ backgroundColor: i < batchProgress ? '#14b8a6' : 'rgba(255,255,255,0.1)' }} />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HEADER ─── */}
      <FadeUp>
        <div className="hero-mesh rounded-3xl p-6 border border-white/[0.06]">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg,#14b8a6,#0d9488)' }}>
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-black text-white tracking-tight">Feedback Writer</h1>
                  <span className="text-[10px] bg-teal-500/20 text-teal-400 px-2 py-0.5 rounded-full font-bold border border-teal-500/20">AI-Powered</span>
                </div>
                <p className="text-sm text-surface-400">AI report comments · {STUDENTS.length} students · 4 tones · 10 languages</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <motion.button className="btn-secondary text-xs px-3 py-1.5" whileHover={{ scale: 1.03 }} onClick={() => setExportOpen(true)}>
                <Download className="w-3.5 h-3.5" /> Export All
              </motion.button>
              <motion.button className="btn-secondary text-xs px-3 py-1.5" whileHover={{ scale: 1.03 }} onClick={handleBatchGenerate} disabled={batchGenerating}>
                <Users className="w-3.5 h-3.5" /> Batch Generate
              </motion.button>
              <motion.button className="btn-gradient text-xs" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleGenerate} disabled={generating}>
                {generating
                  ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}><Sparkles className="w-3.5 h-3.5" /></motion.div>
                  : <Sparkles className="w-3.5 h-3.5" />
                }
                {generating ? 'Generating...' : 'Generate'}
              </motion.button>
            </div>
          </div>
          <div className="border-t border-white/[0.06] pt-4 flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold">Students</span>
              <span className="text-xs font-bold text-white">{STUDENTS.length}</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold">Approved</span>
              <span className="text-xs font-bold text-success-400">{approved.size}</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold">Tone</span>
              <span className="text-xs font-bold text-white capitalize">{tone}</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold">Languages</span>
              <span className="text-xs font-bold text-white">10</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold">Batch Progress</span>
              <span className="text-xs font-bold text-teal-400">{batchProgress}/{STUDENTS.length}</span>
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
              <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-teal-500/15">
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              </div>
              <span className="text-sm font-bold text-white">AI Feedback Insights</span>
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

      {/* ── STATS + PROGRESS ─── */}
      <FadeUp delay={0.08}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Total Students', value: STUDENTS.length.toString(), icon: Users, color: '#6366f1', sub: 'Need comments' },
            { label: 'Approved', value: approved.size.toString(), icon: CheckCircle, color: '#10b981', sub: `of ${STUDENTS.length} done` },
            { label: 'Time Saved', value: '2.4h', icon: Zap, color: '#f97316', sub: 'Est. vs manual' },
            { label: 'Languages', value: '10', icon: Globe, color: '#22d3ee', sub: 'Available' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="glass-card p-4"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              whileHover={{ y: -2 }}
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

      {/* Class Overview Chart */}
      <FadeUp delay={0.07}>
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-teal-400" /> Class Average Overview
            </h3>
            <span className="text-[10px] text-surface-500">Avg: {Math.round(STUDENTS.reduce((a, s) => a + s.avg, 0) / STUDENTS.length)}%</span>
          </div>
          {(() => {
            const W = 560, H = 100, PX = 12, PY = 14
            const maxV = 100, minV = 60
            const barW = (W - PX * 2 - (STUDENTS.length - 1) * 8) / STUDENTS.length
            const baseY = H - PY
            const maxBar = baseY - PY
            return (
              <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: H }}>
                <defs>
                  {STUDENTS.map((s) => (
                    <linearGradient key={s.id} id={`fw-bar-${s.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={s.color} stopOpacity="0.95" />
                      <stop offset="100%" stopColor={s.color} stopOpacity="0.45" />
                    </linearGradient>
                  ))}
                </defs>
                {[70, 80, 90, 100].map(g => (
                  <line key={g} x1={PX} y1={baseY - ((g - minV) / (maxV - minV)) * maxBar} x2={W - PX} y2={baseY - ((g - minV) / (maxV - minV)) * maxBar}
                    stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                ))}
                {STUDENTS.map((s, i) => {
                  const x = PX + i * (barW + 8)
                  const bh = ((Math.max(s.avg, minV) - minV) / (maxV - minV)) * maxBar
                  return (
                    <g key={s.id}>
                      <motion.rect x={x} y={baseY} width={barW} height={0} rx="3" fill={`url(#fw-bar-${s.id})`}
                        animate={{ y: baseY - bh, height: bh }}
                        initial={{ y: baseY, height: 0 }}
                        transition={{ delay: 0.15 + i * 0.07, duration: 0.55, ease: 'easeOut' }}
                      />
                      <text x={x + barW / 2} y={baseY - bh - 4} textAnchor="middle" fill={s.color} fontSize="9" fontWeight="700">{s.avg}%</text>
                      <text x={x + barW / 2} y={H - 1} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="8.5">{s.initials}</text>
                    </g>
                  )
                })}
              </svg>
            )
          })()}
        </div>
      </FadeUp>

      {/* ── MAIN 3-COLUMN LAYOUT ─── */}
      <div className="grid grid-cols-1 xl:grid-cols-[260px_1fr_260px] gap-6">

        {/* STUDENT LIST */}
        <FadeUp delay={0.1}>
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-bold text-white">Students</p>
              <span className="text-[10px] text-surface-500">{approved.size}/{STUDENTS.length} approved</span>
            </div>
            {STUDENTS.map((student, i) => {
              const st = STATUS_CONFIG[student.status]
              const isSelected = selectedStudent.id === student.id
              const isApproved = approved.has(student.id)
              return (
                <motion.button
                  key={student.id}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-teal-500/30 bg-teal-500/[0.07]'
                      : 'border-white/[0.05] hover:border-white/[0.1] hover:bg-white/[0.03]'
                  }`}
                  onClick={() => { setSelectedStudent(student); setGenerated(true); setEditMode(false); setEditedText('') }}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.04 }}
                  whileHover={{ x: 2 }}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0 relative"
                    style={{ background: `linear-gradient(135deg, ${student.color}, ${student.color}99)` }}
                  >
                    {student.initials}
                    {isApproved && (
                      <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 flex items-center justify-center">
                        <Check className="w-2 h-2 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-white truncate">{student.name}</p>
                      {student.iep && <span className="text-[8px] px-1 py-0.5 rounded bg-purple-500/20 text-purple-400 font-bold">IEP</span>}
                      {student.ell && <span className="text-[8px] px-1 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-bold">ELL</span>}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-bold" style={{ color: student.avg >= 90 ? '#10b981' : student.avg >= 75 ? '#6366f1' : '#f59e0b' }}>
                        {student.grade}
                      </span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${st.bg} ${st.text}`}>{st.label}</span>
                    </div>
                  </div>
                  {student.trend === 'up' && <TrendingUp className="w-3 h-3 text-emerald-400 flex-shrink-0" />}
                  {student.trend === 'down' && <TrendingDown className="w-3 h-3 text-red-400 flex-shrink-0" />}
                </motion.button>
              )
            })}
          </div>
        </FadeUp>

        {/* MAIN FEEDBACK AREA */}
        <div className="space-y-4">
          {/* Student Profile Card */}
          <FadeUp delay={0.12}>
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedStudent.id}
                className="glass-card p-5"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black flex-shrink-0" style={{ background: `linear-gradient(135deg, ${selectedStudent.color}, ${selectedStudent.color}99)` }}>
                    {selectedStudent.initials}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-black text-white">{selectedStudent.name}</h3>
                      {selectedStudent.iep && <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 font-bold">IEP</span>}
                      {selectedStudent.ell && <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-bold">ELL</span>}
                    </div>
                    <p className="text-xs text-surface-400">Grade {selectedStudent.grade} · {selectedStudent.avg}% average</p>
                  </div>
                  <span className={`text-[10px] px-2 py-1 rounded-full font-semibold ${STATUS_CONFIG[selectedStudent.status].bg} ${STATUS_CONFIG[selectedStudent.status].text}`}>
                    {STATUS_CONFIG[selectedStudent.status].label}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <ThumbsUp className="w-3 h-3 text-emerald-400" />
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Strengths</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {selectedStudent.strengths.map(s => (
                        <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-400/10 text-emerald-400">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <AlertCircle className="w-3 h-3 text-amber-400" />
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Growth Areas</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {selectedStudent.growthAreas.map(g => (
                        <span key={g} className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-400">{g}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                  <p className="text-[10px] font-bold text-surface-500 uppercase tracking-wider mb-1">Teacher Notes</p>
                  <p className="text-xs text-surface-300 leading-relaxed">{selectedStudent.recentNotes}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </FadeUp>

          {/* Generated Comment */}
          <FadeUp delay={0.15}>
            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-teal-500/15">
                    <FileText className="w-3 h-3 text-teal-400" />
                  </div>
                  <span className="text-sm font-bold text-white">Generated Comment</span>
                  {generated && !generating && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-400/15 text-emerald-400 font-medium">Ready</span>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <motion.button
                    className="flex items-center gap-1.5 text-[11px] text-accent-400 hover:text-accent-300 transition-colors px-2 py-1"
                    onClick={() => { setEditMode(!editMode); if (!editMode) setEditedText(feedback) }}
                  >
                    <Edit3 className="w-3 h-3" />
                    {editMode ? 'Done' : 'Edit'}
                  </motion.button>
                  <motion.button
                    className="flex items-center gap-1.5 text-[11px] text-surface-400 hover:text-surface-200 transition-colors px-2 py-1"
                    onClick={handleGenerate}
                  >
                    <RefreshCw className="w-3 h-3" />
                    Retry
                  </motion.button>
                  <motion.button
                    className="flex items-center gap-1.5 text-[11px] text-surface-400 hover:text-surface-200 transition-colors px-2 py-1"
                    onClick={() => setTranslateOpen(true)}
                  >
                    <Languages className="w-3 h-3" />
                    Translate
                  </motion.button>
                  <motion.button
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium bg-white/[0.06] text-white hover:bg-white/[0.1] transition-all"
                    onClick={handleCopy}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {copied ? <CheckCircle className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </motion.button>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {generating ? (
                  <motion.div key="loading" className="py-10 flex flex-col items-center gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <motion.div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg, #14b8a6, #0d9488)' }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    >
                      <Sparkles className="w-5 h-5 text-white" />
                    </motion.div>
                    <p className="text-sm font-bold text-white">Writing {selectedStudent.name}&apos;s comment…</p>
                    <p className="text-xs text-surface-400">Analyzing strengths, growth areas, and tone</p>
                    {(() => {
                      const W = 192, H = 6
                      return (
                        <svg viewBox={`0 0 ${W} ${H}`} width={192} height={6} className="overflow-visible">
                          <defs>
                            <linearGradient id="fw-load" x1="0" x2="1" y1="0" y2="0">
                              <stop offset="0%" stopColor="#2dd4bf" />
                              <stop offset="100%" stopColor="#14b8a6" />
                            </linearGradient>
                          </defs>
                          <rect x={0} y={0} width={W} height={H} rx={3} fill="rgba(255,255,255,0.06)" />
                          <motion.rect
                            x={0} y={0} height={H} rx={3}
                            fill="url(#fw-load)"
                            initial={{ width: 0 }}
                            animate={{ width: W }}
                            transition={{ duration: 2.2, ease: 'linear' }}
                          />
                        </svg>
                      )
                    })()}
                  </motion.div>
                ) : generated ? (
                  <motion.div key="feedback" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                    {editMode ? (
                      <textarea
                        value={editedText || feedback}
                        onChange={e => setEditedText(e.target.value)}
                        rows={8}
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-sm text-surface-200 leading-relaxed focus:outline-none focus:border-teal-500/30 resize-none"
                      />
                    ) : (
                      <div className="px-4 py-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                        <p className="text-sm text-surface-200 leading-relaxed">{feedback}</p>
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-[10px] text-surface-500">
                        ~{wordCount} words · For {audience === 'parent' ? 'Parent/Guardian' : audience === 'student' ? 'Student' : 'Portfolio'}
                      </p>
                      <div className="flex items-center gap-2">
                        <button className="btn-secondary text-xs px-3 py-1.5" onClick={() => setTranslateOpen(true)}>
                          <Globe className="w-3 h-3" /> Translate
                        </button>
                        <motion.button
                          className="btn-gradient text-xs px-3 py-1.5"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={handleApprove}
                          style={approved.has(selectedStudent.id) ? { background: 'linear-gradient(135deg, #10b981, #059669)' } : {}}
                        >
                          <CheckCircle className="w-3 h-3" />
                          {approved.has(selectedStudent.id) ? 'Approved ✓' : 'Save & Approve'}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="empty" className="py-10 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 bg-teal-500/15">
                      <MessageSquare className="w-6 h-6 text-teal-400" />
                    </div>
                    <p className="text-sm font-bold text-white mb-1">Ready to generate</p>
                    <p className="text-xs text-surface-400">Select a student and click Generate</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </FadeUp>
        </div>

        {/* RIGHT CONTROLS */}
        <div className="space-y-4">
          {/* Tone */}
          <FadeInWhenVisible delay={0.12}>
            <div className="glass-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-pink-500/15">
                  <Heart className="w-3 h-3 text-pink-400" />
                </div>
                <span className="text-xs font-bold text-white">Tone</span>
              </div>
              <div className="space-y-1.5">
                {TONE_OPTIONS.map(opt => (
                  <motion.button
                    key={opt.key}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl border text-left transition-all"
                    style={{
                      backgroundColor: tone === opt.key ? opt.color + '12' : 'rgba(255,255,255,0.02)',
                      borderColor: tone === opt.key ? opt.color + '35' : 'rgba(255,255,255,0.05)',
                    }}
                    onClick={() => setTone(opt.key)}
                    whileHover={{ x: 1 }}
                  >
                    <div>
                      <p className="text-xs font-bold text-white">{opt.label}</p>
                      <p className="text-[10px] text-surface-500">{opt.desc}</p>
                    </div>
                    {tone === opt.key && <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: opt.color }} />}
                  </motion.button>
                ))}
              </div>
            </div>
          </FadeInWhenVisible>

          {/* Length & Audience */}
          <FadeInWhenVisible delay={0.16}>
            <div className="glass-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-orange-500/15">
                  <Sliders className="w-3 h-3 text-orange-400" />
                </div>
                <span className="text-xs font-bold text-white">Length & Audience</span>
              </div>
              <div className="space-y-1.5 mb-3">
                {LENGTH_OPTIONS.map(opt => (
                  <button
                    key={opt.key}
                    onClick={() => setLength(opt.key)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl border text-xs transition-all ${
                      length === opt.key ? 'border-orange-500/40 bg-orange-500/10 text-orange-400' : 'border-white/[0.05] text-surface-400 hover:border-white/[0.1]'
                    }`}
                  >
                    <span className="font-semibold">{opt.label}</span>
                    <span className="text-[10px] opacity-70">{opt.words}</span>
                  </button>
                ))}
              </div>
              <p className="text-[10px] font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Audience</p>
              <div className="space-y-1.5">
                {([
                  { key: 'parent' as const, label: 'Parent / Guardian' },
                  { key: 'student' as const, label: 'Student' },
                  { key: 'portfolio' as const, label: 'Portfolio' },
                ]).map(opt => (
                  <button
                    key={opt.key}
                    onClick={() => setAudience(opt.key)}
                    className={`w-full text-left px-3 py-2 rounded-xl border text-xs transition-all ${
                      audience === opt.key ? 'border-orange-500/30 bg-orange-500/[0.07] text-orange-300' : 'border-white/[0.05] text-surface-400 hover:border-white/[0.1]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </FadeInWhenVisible>

          {/* Writing Quality Controls */}
          <FadeInWhenVisible delay={0.2}>
            <div className="glass-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-accent-500/15">
                  <Brain className="w-3 h-3 text-accent-400" />
                </div>
                <span className="text-xs font-bold text-white">AI Quality</span>
              </div>
              <div className="space-y-2">
                {[
                  { label: 'FERPA-safe check', desc: 'Removes identifying info', state: ferpaCheck, set: setFerpaCheck, color: '#10b981' },
                  { label: 'Avoid clichés', desc: 'Unique phrasing per comment', state: avoidCliches, set: setAvoidCliches, color: '#6366f1' },
                  { label: 'Include examples', desc: 'References specific moments', state: includeExamples, set: setIncludeExamples, color: '#f59e0b' },
                  { label: 'IEP/ELL aware', desc: 'Considers accommodations', state: selectedStudent.iep || selectedStudent.ell, set: () => {}, color: '#ec4899' },
                ].map(feat => (
                  <button
                    key={feat.label}
                    onClick={() => feat.set(!feat.state)}
                    className="w-full flex items-center gap-2.5 p-2.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors text-left"
                  >
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-colors`} style={{ backgroundColor: feat.state ? feat.color + '25' : 'rgba(255,255,255,0.05)' }}>
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: feat.state ? feat.color : 'rgba(100,116,139,0.5)' }} />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-white">{feat.label}</p>
                      <p className="text-[10px] text-surface-500">{feat.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </FadeInWhenVisible>
        </div>
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
                <h3 className="text-sm font-bold text-white">Export All Comments</h3>
                <button onClick={() => setExportOpen(false)} className="p-1.5 rounded-lg hover:bg-white/[0.08] transition-colors">
                  <X className="w-4 h-4 text-surface-400" />
                </button>
              </div>
              <div className="space-y-2">
                {[
                  { label: 'PDF Report Card Pack', icon: FileText, desc: 'Formatted for school records' },
                  { label: 'Word Document (.docx)', icon: Download, desc: 'Editable comments document' },
                  { label: 'Google Docs', icon: ExternalLink, desc: 'Export directly to Drive' },
                  { label: 'Copy All as Text', icon: Copy, desc: 'Plain text for email or SIS' },
                ].map(opt => (
                  <motion.button
                    key={opt.label}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.07] transition-colors text-left"
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { showToast(`Exported: ${opt.label}`); setExportOpen(false) }}
                  >
                    <div className="w-7 h-7 rounded-lg bg-teal-500/15 flex items-center justify-center flex-shrink-0">
                      <opt.icon className="w-3.5 h-3.5 text-teal-400" />
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

      {/* ── TRANSLATE MODAL ─── */}
      <AnimatePresence>
        {translateOpen && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setTranslateOpen(false)} />
            <motion.div
              className="relative glass-card p-6 w-full max-w-sm"
              initial={{ scale: 0.93, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.93, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-bold text-white">Translate Comment</h3>
                <button onClick={() => setTranslateOpen(false)} className="p-1.5 rounded-lg hover:bg-white/[0.08] transition-colors">
                  <X className="w-4 h-4 text-surface-400" />
                </button>
              </div>
              <p className="text-[11px] text-surface-500 mb-3">Select a language to translate {selectedStudent.name}&apos;s comment:</p>
              <div className="grid grid-cols-2 gap-2">
                {TRANSLATE_LANGS.map(lang => (
                  <motion.button
                    key={lang}
                    className="px-3 py-2.5 rounded-xl text-xs font-medium bg-white/[0.04] hover:bg-teal-500/15 hover:text-teal-400 text-surface-300 transition-colors border border-white/[0.06] hover:border-teal-500/30 text-left"
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => { showToast(`Translating to ${lang}…`); setTranslateOpen(false) }}
                  >
                    <Globe className="w-3 h-3 inline mr-1.5 opacity-60" />
                    {lang}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
