'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageSquare, Sparkles, Copy, CheckCircle, RefreshCw, Download,
  Users, Star, TrendingUp, TrendingDown, Brain, ChevronDown,
  Sliders, Globe, BookOpen, Heart, Zap, ChevronRight, FileText,
  ThumbsUp, AlertCircle, Edit3
} from 'lucide-react'
import { FadeUp, FadeInWhenVisible } from '@/components/ui/motion'

interface Student {
  id: string
  name: string
  initials: string
  color: string
  grade: string
  avg: number
  trend: 'up' | 'down' | 'stable'
  strengths: string[]
  growthAreas: string[]
  recentNotes: string
  status: 'excelling' | 'on-track' | 'needs-support'
  iep: boolean
  ell: boolean
}

const students: Student[] = [
  { id: 's1', name: 'Emma Davis', initials: 'ED', color: '#8b5cf6', grade: 'A', avg: 94, trend: 'up', strengths: ['Critical thinking', 'Lab skills', 'Written communication'], growthAreas: ['Pacing on exams'], recentNotes: 'Led group discussion on photosynthesis; volunteered extra analysis', status: 'excelling', iep: false, ell: false },
  { id: 's2', name: 'Noah Williams', initials: 'NW', color: '#f97316', grade: 'C+', avg: 68, trend: 'up', strengths: ['Participates actively', 'Improved attendance'], growthAreas: ['Reading comprehension', 'Written responses', 'Test preparation'], recentNotes: 'Significant improvement since tutoring started; ELL vocabulary support helping', status: 'needs-support', iep: false, ell: true },
  { id: 's3', name: 'Sophia Chen', initials: 'SC', color: '#10b981', grade: 'A-', avg: 91, trend: 'stable', strengths: ['Data analysis', 'Collaboration', 'Consistent effort'], growthAreas: ['Oral presentations'], recentNotes: 'Consistent high performer; shy but strong lab partner', status: 'on-track', iep: false, ell: false },
  { id: 's4', name: 'Liam Rodriguez', initials: 'LR', color: '#22d3ee', grade: 'B', avg: 82, trend: 'up', strengths: ['Creativity', 'Hands-on learning'], growthAreas: ['Organizational skills', 'Note-taking'], recentNotes: 'IEP accommodations are working; benefits from graphic organizers', status: 'on-track', iep: true, ell: false },
  { id: 's5', name: 'Ava Patel', initials: 'AP', color: '#ec4899', grade: 'A+', avg: 98, trend: 'up', strengths: ['Mathematical reasoning', 'Leadership', 'Peer tutoring'], growthAreas: ['Challenge-seeking'], recentNotes: 'Consistently exceeds expectations; would benefit from acceleration', status: 'excelling', iep: false, ell: false },
  { id: 's6', name: 'James Thompson', initials: 'JT', color: '#f59e0b', grade: 'B-', avg: 76, trend: 'down', strengths: ['Curiosity', 'Creative writing'], growthAreas: ['Attendance', 'Homework completion', 'Focus during instruction'], recentNotes: '3 missed assignments this month; check in recommended', status: 'needs-support', iep: false, ell: false },
]

type ToneOption = 'encouraging' | 'formal' | 'growth-focused' | 'celebratory'
type LengthOption = 'brief' | 'standard' | 'detailed'
type AudienceOption = 'parent' | 'student' | 'portfolio'

const toneOptions: { key: ToneOption; label: string; desc: string }[] = [
  { key: 'encouraging', label: 'Encouraging', desc: 'Warm, positive tone' },
  { key: 'formal', label: 'Formal', desc: 'Professional and structured' },
  { key: 'growth-focused', label: 'Growth-Focused', desc: 'Emphasizes improvement areas' },
  { key: 'celebratory', label: 'Celebratory', desc: 'Highlights achievements' },
]

const lengthOptions: { key: LengthOption; label: string; words: string }[] = [
  { key: 'brief', label: 'Brief', words: '50–80 words' },
  { key: 'standard', label: 'Standard', words: '100–150 words' },
  { key: 'detailed', label: 'Detailed', words: '200–250 words' },
]

const sampleFeedback: Record<string, Record<ToneOption, string>> = {
  s1: {
    encouraging: `Emma continues to be an exceptional learner in 7th Grade Science. Her critical thinking skills shine during class discussions — particularly during our photosynthesis unit, where she took initiative in leading group analysis beyond what was required. Emma's lab reports reflect strong scientific writing, and her ability to connect concepts across units shows genuine intellectual curiosity. I encourage Emma to continue challenging herself and trust her instincts when reasoning through complex problems. She is a pleasure to have in class, and her enthusiasm positively influences her peers.`,
    formal: `Emma Davis has demonstrated outstanding academic performance throughout this reporting period, achieving an average of 94%. Her proficiency in laboratory procedures and written scientific communication is consistently at an advanced level. Emma participates constructively in class discussions and shows initiative in seeking deeper understanding of course material. She is advised to continue her current academic trajectory while seeking additional challenge through independent inquiry or enrichment opportunities.`,
    'growth-focused': `Emma is thriving in 7th Grade Science with a 94% average and consistently strong engagement. To continue her growth, I would encourage Emma to focus on exam pacing strategies — she demonstrates deep knowledge but benefits from time management practice under timed conditions. Participating in science fair or independent research would be an excellent next step. Emma's leadership in group settings is a real strength worth nurturing further.`,
    celebratory: `What an outstanding semester for Emma! Achieving a 94% average, Emma has truly excelled in every area of 7th Grade Science. Her leadership during our photosynthesis investigation was a highlight — going above and beyond with her analysis. Emma's lab skills are exceptional, and her clear, thoughtful writing demonstrates a mature scientific mind. We celebrate Emma's hard work, dedication, and the positive energy she brings to our classroom every day. Congratulations, Emma!`,
  },
  s2: {
    encouraging: `Noah has shown meaningful growth this semester, and I'm proud of the effort he has invested in 7th Grade Science. His attendance and classroom participation have both improved significantly, and the ELL vocabulary support is clearly making a difference in his understanding. Noah's grade of 68% reflects real progress — especially given the challenges he has been working to overcome. Areas to focus on include reading comprehension of science texts and extending written responses. With continued effort and support, I believe Noah is on a positive trajectory. Keep up the great work, Noah!`,
    formal: `Noah Williams has shown notable improvement in participation and attendance during this reporting period. His current average of 68% reflects developing proficiency in core science concepts. Ongoing ELL support has contributed positively to his vocabulary development and classroom comprehension. Recommended focus areas include strengthening reading comprehension strategies and extending written response detail. Continued academic and linguistic support is advised to sustain and accelerate his academic progress.`,
    'growth-focused': `Noah has made meaningful strides this semester, particularly in attendance and classroom engagement. The ELL vocabulary support is working well, and tutoring sessions have helped him build confidence. To continue growing, Noah should focus on reading science texts carefully and practicing extended written responses — these are key areas where additional practice will have the most impact. I encourage Noah to visit during office hours and continue attending tutoring sessions. His upward trend is genuinely encouraging.`,
    celebratory: `Noah, we are so proud of the growth you have shown this semester! From improved attendance to more confident classroom participation, your effort is truly visible. The vocabulary support is paying off, and your willingness to try even when things are challenging shows incredible strength of character. You've earned your grade improvement — keep pushing forward. Every step you take toward your goals counts, and we are all rooting for you!`,
  },
  s3: {
    encouraging: `Sophia is a consistently excellent student in 7th Grade Science, maintaining a 91% average through steady, focused effort. Her analytical thinking — especially in data interpretation during lab activities — is a real strength, and she is a reliable, collaborative partner in group settings. I would love to see Sophia build confidence in oral presentations, as her knowledge and insights deserve to be heard more often. Sophia's reliable dedication and thoughtful work make her a valued member of our classroom community.`,
    formal: `Sophia Chen has maintained strong academic performance with a 91% average throughout this reporting period. Her laboratory skills and data analysis abilities are proficient, and she contributes positively to collaborative group work. An area for continued development is oral presentation confidence; Sophia is encouraged to participate more actively in class discussions and presentations to further build this skill. Overall, Sophia's academic performance reflects consistent effort and intellectual capability.`,
    'growth-focused': `Sophia is performing exceptionally well with a 91% average, and her data analysis skills are a clear strength. To take her learning to the next level, I encourage Sophia to speak up more in class discussions and take opportunities to present — her insights are thoughtful and her peers would benefit from hearing them more. Sophia is well-prepared for more advanced science coursework and should continue challenging herself with complex problems.`,
    celebratory: `Sophia has had a wonderful semester in 7th Grade Science! Maintaining a 91% average through consistent hard work, she has shown that steady dedication truly pays off. Her lab skills and analytical thinking are genuinely impressive, and her collaborative spirit makes her a fantastic group partner. We celebrate Sophia's perseverance and look forward to seeing her continue to grow — especially as she builds confidence sharing her great ideas with the class!`,
  },
  s4: { encouraging: 'Liam is making steady progress in 7th Grade Science with an 82% average that reflects his creative approach to learning and growing organizational skills. With IEP supports in place — including graphic organizers and extended time — Liam has been able to demonstrate his true understanding of science concepts. His creative problem-solving is a genuine strength that often brings fresh perspectives to labs and projects. I encourage Liam to continue using the organizational tools we\'ve practiced together — they make a real difference. Keep building on these great habits, Liam!', formal: 'Liam Rodriguez has demonstrated satisfactory to good academic performance with an 82% average this reporting period. Implemented IEP accommodations, including graphic organizers and extended time, have supported his access to curriculum content. Liam shows strengths in creative and hands-on learning modalities. Continued support for organizational skills and systematic note-taking is recommended to further solidify his academic progress. IEP goals are being addressed and progress is being monitored.', 'growth-focused': 'Liam is growing meaningfully in 7th Grade Science, and the upward trend in his grades reflects real effort. With IEP accommodations in place, he is better able to access the material and demonstrate what he knows. The biggest opportunity for growth is organizational systems — using the graphic organizers and Cornell notes templates consistently will help Liam retain and review information more effectively. He is building great study habits, and I encourage him to continue.', celebratory: 'Liam, you\'ve had a growth-filled semester! Your 82% average shows how much you\'ve worked through — from building better organizational habits to thriving with the supports in place. Your creative thinking adds so much to our lab investigations, and it\'s been wonderful to watch your confidence grow. We celebrate your progress and your willingness to keep trying. You\'re showing everyone that hard work and the right tools make all the difference!' },
  s5: { encouraging: 'Ava is an extraordinary student who has truly set the standard in 7th Grade Science this semester with a remarkable 98% average. Her mathematical reasoning in data analysis is exceptional, and her willingness to support peers as an informal tutor shows both mastery and generosity. Ava is encouraged to continue seeking challenge — whether through independent research, enrichment programs, or science competitions — as her potential is truly remarkable. It is an absolute privilege to have Ava in class.', formal: 'Ava Patel has achieved exceptional academic performance with a 98% average, demonstrating mastery across all assessed content areas. Her mathematical reasoning abilities are particularly noteworthy, as is her leadership in peer learning contexts. Ava is encouraged to pursue academic enrichment and challenge through independent research, science competitions, or advanced coursework. Her academic achievements reflect exceptional ability and consistent high-level effort.', 'growth-focused': 'Ava is achieving at the highest level with a 98% average, and her next growth opportunity lies in seeking greater challenge. I encourage Ava to pursue a science fair project on a topic that genuinely intrigues her, or to look into extracurricular STEM programs where she can explore beyond the standard curriculum. Her peer tutoring shows strong interpersonal skills — developing these in leadership roles would be an excellent next step.', celebratory: 'Ava, 98%! This is an extraordinary achievement and a reflection of your incredible hard work, intellect, and dedication. Your mathematical reasoning is exceptional, your leadership as a peer tutor is inspiring, and your enthusiasm for science is infectious. We are so proud of everything you have accomplished this semester. The sky is truly the limit for you — keep reaching for it. Congratulations on a spectacular semester, Ava!' },
  s6: { encouraging: 'James has real strengths in creativity and written expression that shine when he is engaged. This semester, his natural curiosity and imaginative writing have produced some genuinely impressive work. The challenge for James has been consistency — particularly with homework completion and attendance — and these are areas we will focus on together. I encourage James to channel his obvious talents by prioritizing attendance and completing assignments, as these are the building blocks for showing what he truly knows. I believe strongly in James\'s potential and look forward to seeing it more consistently.', formal: 'James Thompson has shown creative ability and intellectual curiosity, achieving a 76% average this reporting period. However, attendance irregularities and incomplete assignments have impacted his academic performance. James is encouraged to prioritize consistent attendance and timely submission of work. When engaged, James demonstrates genuine potential; sustained effort and follow-through are the key areas for development. A parent/guardian conference is recommended to align on strategies for improvement.', 'growth-focused': 'James has real potential that we are working to unlock this semester. His creativity and writing skills are genuine assets, and when he is present and engaged, his contributions are valuable. The priority areas for growth are attendance, homework completion, and focus during direct instruction — three habits that, when built, will dramatically change his academic outcomes. I\'d strongly recommend scheduling a check-in to discuss strategies and support. James is capable of much more than his current grade reflects.', celebratory: 'James, your creativity and curiosity are truly special — when you bring those qualities to class, it lights up the room! Your writing has moments of real brilliance, and I know there\'s a lot more where that came from. This semester taught us that with consistent attendance and completed assignments, your grade will reflect what you\'re truly capable of. I\'m excited for the growth ahead. Let\'s make next semester the one where your potential really shines through. I believe in you!' },
}

export default function FeedbackWriterPage() {
  const [selectedStudent, setSelectedStudent] = useState<Student>(students[0])
  const [tone, setTone] = useState<ToneOption>('encouraging')
  const [length, setLength] = useState<LengthOption>('standard')
  const [audience, setAudience] = useState<AudienceOption>('parent')
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(true)
  const [copied, setCopied] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editedText, setEditedText] = useState('')

  const feedback = sampleFeedback[selectedStudent.id]?.[tone] || ''

  function handleGenerate() {
    setGenerating(true)
    setGenerated(false)
    setTimeout(() => {
      setGenerating(false)
      setGenerated(true)
      setEditMode(false)
      setEditedText(sampleFeedback[selectedStudent.id]?.[tone] || '')
    }, 2200)
  }

  function handleCopy() {
    navigator.clipboard.writeText(editMode ? editedText : feedback)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const statusConfig = {
    excelling: { bg: 'bg-success-400/15', text: 'text-success-400', label: 'Excelling' },
    'on-track': { bg: 'bg-accent-400/15', text: 'text-accent-400', label: 'On Track' },
    'needs-support': { bg: 'bg-warning-400/15', text: 'text-warning-400', label: 'Needs Support' },
  }

  return (
    <div className="space-y-6">
      <FadeUp>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #14b8a6, #0d9488)' }}
              whileHover={{ rotate: 8, scale: 1.08 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <MessageSquare className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h2 className="text-xl font-black text-white">Feedback Writer</h2>
              <p className="text-xs text-surface-400">AI-powered report comments · {students.length} students · Multiple tones</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-secondary text-xs px-3 py-1.5">
              <Download className="w-3.5 h-3.5" />
              Export All
            </button>
            <motion.button
              className="btn-gradient text-xs"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleGenerate}
              disabled={generating}
            >
              {generating ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                    <Sparkles className="w-3.5 h-3.5" />
                  </motion.div>
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Generate All
                </>
              )}
            </motion.button>
          </div>
        </div>
      </FadeUp>

      {/* Stats */}
      <FadeUp delay={0.04}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Students', value: students.length, icon: Users, color: '#6366f1', sub: 'Need comments' },
            { label: 'Generated', value: 4, icon: CheckCircle, color: '#10b981', sub: 'This session' },
            { label: 'Time Saved', value: '2.4h', icon: Zap, color: '#f97316', sub: 'Est. vs manual' },
            { label: 'Languages', value: 10, icon: Globe, color: '#22d3ee', sub: 'Available' },
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
              <p className="text-[10px] text-surface-500 mt-0.5">{stat.sub}</p>
            </motion.div>
          ))}
        </div>
      </FadeUp>

      <div className="grid grid-cols-1 xl:grid-cols-[280px_1fr_280px] gap-6">
        {/* Student List */}
        <FadeUp delay={0.07}>
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-bold text-white">Students</p>
              <span className="text-[10px] text-surface-500">{students.length} total</span>
            </div>
            {students.map((student, i) => {
              const st = statusConfig[student.status]
              const isSelected = selectedStudent.id === student.id
              return (
                <motion.button
                  key={student.id}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-accent-500/30 bg-accent-500/[0.07]'
                      : 'border-white/[0.05] hover:border-white/[0.1] hover:bg-white/[0.03]'
                  }`}
                  onClick={() => { setSelectedStudent(student); setGenerated(true); setEditMode(false) }}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + i * 0.04 }}
                  whileHover={{ x: 2 }}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${student.color}, ${student.color}99)` }}
                  >
                    {student.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-white truncate">{student.name}</p>
                      {student.iep && <span className="text-[8px] px-1 py-0.5 rounded bg-purple-500/20 text-purple-400 font-bold">IEP</span>}
                      {student.ell && <span className="text-[8px] px-1 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-bold">ELL</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold" style={{ color: student.avg >= 90 ? '#10b981' : student.avg >= 75 ? '#6366f1' : '#f59e0b' }}>{student.grade}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${st.bg} ${st.text}`}>{st.label}</span>
                    </div>
                  </div>
                  {student.trend === 'up' && <TrendingUp className="w-3 h-3 text-success-400 flex-shrink-0" />}
                  {student.trend === 'down' && <TrendingDown className="w-3 h-3 text-danger-400 flex-shrink-0" />}
                </motion.button>
              )
            })}
          </div>
        </FadeUp>

        {/* Main feedback area */}
        <div className="space-y-4">
          <FadeUp delay={0.1}>
            {/* Student profile card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedStudent.id}
                className="glass-card p-5"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${selectedStudent.color}, ${selectedStudent.color}99)` }}
                  >
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
                  <div className="text-right">
                    <span className={`text-[10px] px-2 py-1 rounded-full font-semibold ${statusConfig[selectedStudent.status].bg} ${statusConfig[selectedStudent.status].text}`}>
                      {statusConfig[selectedStudent.status].label}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <ThumbsUp className="w-3 h-3 text-success-400" />
                      <span className="text-[10px] font-bold text-success-400 uppercase tracking-wider">Strengths</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {selectedStudent.strengths.map(s => (
                        <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-success-400/10 text-success-400">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <AlertCircle className="w-3 h-3 text-warning-400" />
                      <span className="text-[10px] font-bold text-warning-400 uppercase tracking-wider">Growth Areas</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {selectedStudent.growthAreas.map(g => (
                        <span key={g} className="text-[10px] px-2 py-0.5 rounded-full bg-warning-400/10 text-warning-400">{g}</span>
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

          {/* Generated Feedback */}
          <FadeUp delay={0.13}>
            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-teal-500/15">
                    <FileText className="w-3.5 h-3.5 text-teal-400" />
                  </div>
                  <span className="text-sm font-bold text-white">Generated Comment</span>
                  {generated && !generating && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-success-400/15 text-success-400 font-medium">Ready</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    className="flex items-center gap-1.5 text-[11px] text-accent-400 hover:text-accent-300 transition-colors"
                    onClick={() => { setEditMode(!editMode); if (!editMode) setEditedText(feedback) }}
                  >
                    <Edit3 className="w-3 h-3" />
                    {editMode ? 'Done Editing' : 'Edit'}
                  </motion.button>
                  <motion.button
                    className="flex items-center gap-1.5 text-[11px] text-accent-400 hover:text-accent-300 transition-colors"
                    onClick={handleGenerate}
                  >
                    <RefreshCw className="w-3 h-3" />
                    Regenerate
                  </motion.button>
                  <motion.button
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium bg-white/[0.06] text-white hover:bg-white/[0.1] transition-all"
                    onClick={handleCopy}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {copied ? <CheckCircle className="w-3 h-3 text-success-400" /> : <Copy className="w-3 h-3" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </motion.button>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {generating ? (
                  <motion.div
                    key="loading"
                    className="py-12 flex flex-col items-center gap-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg, #14b8a6, #0d9488)' }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    >
                      <Sparkles className="w-5 h-5 text-white" />
                    </motion.div>
                    <p className="text-sm font-bold text-white">Writing {selectedStudent.name}'s comment...</p>
                    <p className="text-xs text-surface-400">Analyzing strengths, growth areas, and tone</p>
                    <motion.div className="w-48 h-1 bg-white/[0.06] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-teal-400 rounded-full"
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 2.2, ease: 'linear' }}
                      />
                    </motion.div>
                  </motion.div>
                ) : generated ? (
                  <motion.div
                    key="feedback"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {editMode ? (
                      <textarea
                        value={editedText || feedback}
                        onChange={e => setEditedText(e.target.value)}
                        rows={8}
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-sm text-surface-200 leading-relaxed focus:outline-none focus:border-accent-500/30 resize-none transition-all"
                      />
                    ) : (
                      <div className="px-4 py-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                        <p className="text-sm text-surface-200 leading-relaxed">{feedback}</p>
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-[10px] text-surface-600">
                        ~{(feedback || '').split(' ').length} words · For {audience === 'parent' ? 'Parent/Guardian' : audience === 'student' ? 'Student' : 'Portfolio'}
                      </p>
                      <div className="flex items-center gap-2">
                        <button className="btn-secondary text-xs px-3 py-1.5">
                          <Globe className="w-3 h-3" /> Translate
                        </button>
                        <button className="btn-gradient text-xs px-3 py-1.5">
                          <CheckCircle className="w-3 h-3" /> Save to Student
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    className="py-12 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
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

        {/* Right Controls */}
        <div className="space-y-4">
          {/* Tone */}
          <FadeInWhenVisible delay={0.1}>
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-neon-400/15">
                  <Heart className="w-3.5 h-3.5 text-neon-400" />
                </div>
                <span className="text-sm font-bold text-white">Tone</span>
              </div>
              <div className="space-y-2">
                {toneOptions.map(opt => (
                  <motion.button
                    key={opt.key}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border text-left transition-all ${
                      tone === opt.key
                        ? 'border-accent-500/40 bg-accent-500/10'
                        : 'border-white/[0.05] hover:border-white/[0.1] hover:bg-white/[0.03]'
                    }`}
                    onClick={() => setTone(opt.key)}
                    whileHover={{ x: 2 }}
                  >
                    <div>
                      <p className="text-xs font-bold text-white">{opt.label}</p>
                      <p className="text-[10px] text-surface-500">{opt.desc}</p>
                    </div>
                    {tone === opt.key && <CheckCircle className="w-4 h-4 text-accent-400 flex-shrink-0" />}
                  </motion.button>
                ))}
              </div>
            </div>
          </FadeInWhenVisible>

          {/* Length */}
          <FadeInWhenVisible delay={0.15}>
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-orange-500/15">
                  <Sliders className="w-3.5 h-3.5 text-orange-400" />
                </div>
                <span className="text-sm font-bold text-white">Length & Audience</span>
              </div>
              <div className="space-y-2 mb-4">
                {lengthOptions.map(opt => (
                  <button
                    key={opt.key}
                    onClick={() => setLength(opt.key)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl border text-xs transition-all ${
                      length === opt.key
                        ? 'border-orange-500/40 bg-orange-500/10 text-orange-400'
                        : 'border-white/[0.05] text-surface-400 hover:border-white/[0.1]'
                    }`}
                  >
                    <span className="font-semibold">{opt.label}</span>
                    <span className="text-[10px] opacity-70">{opt.words}</span>
                  </button>
                ))}
              </div>
              <div className="space-y-1.5">
                <p className="text-[10px] font-semibold text-surface-500 uppercase tracking-wider">Audience</p>
                {([
                  { key: 'parent', label: 'Parent / Guardian' },
                  { key: 'student', label: 'Student' },
                  { key: 'portfolio', label: 'Portfolio' },
                ] as const).map(opt => (
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

          {/* AI Features */}
          <FadeInWhenVisible delay={0.2}>
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-accent-500/15">
                  <Brain className="w-3.5 h-3.5 text-accent-400" />
                </div>
                <span className="text-sm font-bold text-white">AI Features</span>
              </div>
              <div className="space-y-2">
                {[
                  { label: 'FERPA-safe language check', desc: 'Removes identifying info', active: true },
                  { label: 'Bias detection', desc: 'Scans for unintentional bias', active: true },
                  { label: 'IEP/504 aware', desc: 'Considers accommodations', active: !!selectedStudent.iep },
                  { label: 'ELL adapted tone', desc: 'Simpler structure when needed', active: !!selectedStudent.ell },
                ].map((feat, i) => (
                  <div key={feat.label} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-white/[0.02]">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${feat.active ? 'bg-success-400/20' : 'bg-white/[0.06]'}`}>
                      <div className={`w-2 h-2 rounded-full ${feat.active ? 'bg-success-400' : 'bg-surface-600'}`} />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-white">{feat.label}</p>
                      <p className="text-[10px] text-surface-500">{feat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeInWhenVisible>
        </div>
      </div>
    </div>
  )
}
