'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Clock, BookOpen, Sparkles, FileText, ClipboardList,
  Zap, Users, Target, Play, Check, ChevronDown, Download, Share2
} from 'lucide-react'
import { FadeUp } from '@/components/ui/motion'

const materials = [
  { id: '1', type: 'lesson_plan', title: 'Photosynthesis – 45 Min Lesson Plan', date: 'Today' },
  { id: '2', type: 'quiz', title: 'Photosynthesis Quiz (10 questions)', date: 'Today' },
  { id: '3', type: 'worksheet', title: 'Light Reactions Worksheet', date: 'Yesterday' },
  { id: '4', type: 'activity', title: 'Leaf Disk Flotation Lab', date: 'Yesterday' },
  { id: '5', type: 'worksheet', title: 'Calvin Cycle Diagram Labeling', date: '2 days ago' },
]

const TYPE_META: Record<string, { icon: React.ElementType; label: string; color: string }> = {
  lesson_plan: { icon: BookOpen, label: 'Lesson Plan', color: 'bg-accent-500/15 text-accent-400' },
  quiz: { icon: ClipboardList, label: 'Quiz', color: 'bg-warning-400/15 text-warning-400' },
  worksheet: { icon: FileText, label: 'Worksheet', color: 'bg-success-400/15 text-success-400' },
  activity: { icon: Zap, label: 'Activity', color: 'bg-electric-400/15 text-electric-400' },
}

const lessonSections = [
  { title: 'Warm-Up (5 min)', content: 'Show time-lapse video of a plant growing toward sunlight. Ask students: "What does this plant need to survive?" Collect responses on whiteboard.' },
  { title: 'Direct Instruction (15 min)', content: 'Present the photosynthesis equation: 6CO₂ + 6H₂O + Light → C₆H₁₂O₆ + 6O₂. Explain each reactant and product. Use the chloroplast diagram to show where reactions occur (thylakoid vs. stroma).' },
  { title: 'Guided Practice (15 min)', content: 'Leaf Disk Flotation Lab: Students punch leaf disks, remove air with syringe, and observe disks rising as O₂ is produced during photosynthesis. Record observations every 2 minutes.' },
  { title: 'Independent Practice (10 min)', content: 'Complete the Light Reactions Worksheet. Label the chloroplast diagram. Answer conceptual questions about energy transformation.' },
  { title: 'Exit Ticket (5 min)', content: 'Three questions: (1) What are the reactants of photosynthesis? (2) Where does photosynthesis occur? (3) Why is photosynthesis important for life on Earth?' },
]

const studentProgress = [
  { name: 'Emma Davis', status: 'completed' as const, score: 95 },
  { name: 'Liam Chen', status: 'completed' as const, score: 88 },
  { name: 'Sofia Rodriguez', status: 'completed' as const, score: 92 },
  { name: 'Noah Williams', status: 'in-progress' as const, score: null },
  { name: 'Ava Patel', status: 'completed' as const, score: 78 },
  { name: 'Ethan Kim', status: 'not-started' as const, score: null },
]

const standards = [
  { code: 'MS-LS1-6', desc: 'Construct a scientific explanation based on evidence for the role of photosynthesis' },
  { code: 'MS-LS1-7', desc: 'Develop a model to describe how food is rearranged through chemical reactions' },
]

export default function LessonDetailPage({
  params,
}: {
  params: { courseId: string; lessonId: string }
}) {
  const [expandedSection, setExpandedSection] = useState<number>(0)
  const completedCount = studentProgress.filter(s => s.status === 'completed').length
  const avgScore = Math.round(
    studentProgress.filter(s => s.score !== null).reduce((a, s) => a + (s.score ?? 0), 0) /
    studentProgress.filter(s => s.score !== null).length
  )

  return (
    <div className="space-y-6 max-w-4xl">
      <FadeUp>
        <div className="flex items-center gap-2 text-xs text-surface-500">
          <Link href="/courses" className="hover:text-surface-300">Courses</Link>
          <span>/</span>
          <Link href={`/courses/${params.courseId}`} className="hover:text-surface-300">7th Grade Biology</Link>
          <span>/</span>
          <span className="text-surface-300">Photosynthesis</span>
        </div>
      </FadeUp>

      <FadeUp delay={0.03}>
        <div className="flex items-start gap-4">
          <Link href={`/courses/${params.courseId}`} className="text-surface-500 hover:text-surface-300 mt-1">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex-1">
            <h2 className="text-2xl font-black text-white">Photosynthesis</h2>
            <div className="flex items-center gap-3 mt-1 text-xs text-surface-500">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />60 minutes</span>
              <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{materials.length} materials</span>
              <span className="badge bg-success-400/15 text-success-400">published</span>
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button className="btn-secondary text-xs"><Download className="w-3.5 h-3.5" /> Export</button>
            <button className="btn-secondary text-xs"><Share2 className="w-3.5 h-3.5" /> Share</button>
            <Link href="/magic-chat?mode=lesson" className="btn-gradient text-xs">
              <Sparkles className="w-4 h-4" /> Generate More
            </Link>
          </div>
        </div>
      </FadeUp>

      <FadeUp delay={0.05}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Completed', value: `${completedCount}/${studentProgress.length}`, icon: Check, color: '#10b981' },
            { label: 'Avg Score', value: `${avgScore}%`, icon: Target, color: '#6366f1' },
            { label: 'Duration', value: '60 min', icon: Clock, color: '#f97316' },
            { label: 'Materials', value: materials.length, icon: BookOpen, color: '#22d3ee' },
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

      <FadeUp delay={0.07}>
        <div className="glass-card p-5">
          <h3 className="text-sm font-bold text-white mb-2">Learning Objective</h3>
          <p className="text-sm text-surface-300 leading-relaxed">
            Students will be able to explain the process of photosynthesis, identify the reactants and products, and describe how plants convert light energy into chemical energy stored in glucose.
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            {standards.map(s => (
              <div key={s.code} className="flex items-center gap-2 px-3 py-1.5 bg-accent-500/10 rounded-lg border border-accent-500/15">
                <Target className="w-3 h-3 text-accent-400 flex-shrink-0" />
                <span className="text-[11px] font-semibold text-accent-400">{s.code}</span>
                <span className="text-[11px] text-surface-400 hidden md:inline">— {s.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </FadeUp>

      <FadeUp delay={0.09}>
        <div className="glass-card overflow-hidden">
          <div className="px-5 pt-5 pb-3">
            <h3 className="text-sm font-bold text-white">Lesson Flow</h3>
          </div>
          {lessonSections.map((section, i) => (
            <div key={i} className="border-t border-white/[0.06]">
              <button
                onClick={() => setExpandedSection(expandedSection === i ? -1 : i)}
                className="w-full flex items-center gap-3 px-5 py-3.5 text-left hover:bg-white/[0.02] transition-colors"
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #a78bfa)' }}
                >
                  <span className="text-white">{i + 1}</span>
                </div>
                <span className="text-sm font-semibold text-white flex-1">{section.title}</span>
                <motion.div animate={{ rotate: expandedSection === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown className="w-4 h-4 text-surface-500" />
                </motion.div>
              </button>
              {expandedSection === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="px-5 pb-4 pl-14"
                >
                  <p className="text-sm text-surface-400 leading-relaxed">{section.content}</p>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </FadeUp>

      <FadeUp delay={0.11}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-white">Materials ({materials.length})</h3>
          <div className="flex gap-2">
            <Link href="/magic-chat?mode=quiz" className="btn-secondary text-xs">
              <ClipboardList className="w-3.5 h-3.5" /> Add Quiz
            </Link>
            <Link href="/magic-chat?mode=worksheet" className="btn-secondary text-xs">
              <FileText className="w-3.5 h-3.5" /> Add Worksheet
            </Link>
          </div>
        </div>
        <div className="space-y-3">
          {materials.map((mat, i) => {
            const meta = TYPE_META[mat.type] ?? TYPE_META.lesson_plan
            return (
              <motion.div
                key={mat.id}
                className="glass-card p-4 flex items-center gap-4 cursor-pointer group"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.04 }}
                whileHover={{ x: 3, transition: { duration: 0.15 } }}
              >
                <div className={`icon-bubble ${meta.color}`}>
                  <meta.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate group-hover:text-accent-400 transition-colors">{mat.title}</p>
                  <p className="text-xs text-surface-500">{meta.label} · {mat.date}</p>
                </div>
                <button className="btn-outline text-xs px-3 py-1.5">View</button>
              </motion.div>
            )
          })}
        </div>
      </FadeUp>

      <FadeUp delay={0.13}>
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white">Student Progress</h3>
            <span className="text-xs text-surface-400">{completedCount} of {studentProgress.length} completed</span>
          </div>
          <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden mb-4">
            <motion.div
              className="h-full rounded-full bg-success-400"
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / studentProgress.length) * 100}%` }}
              transition={{ delay: 0.3, duration: 0.6 }}
            />
          </div>
          <div className="space-y-2">
            {studentProgress.map((s, i) => (
              <motion.div
                key={s.name}
                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/[0.03] transition-colors"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.03 }}
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #a78bfa)' }}
                >
                  {s.name.split(' ').map(n => n[0]).join('')}
                </div>
                <span className="text-sm text-white flex-1">{s.name}</span>
                <span className={`badge text-[10px] ${
                  s.status === 'completed' ? 'bg-success-400/15 text-success-400' :
                  s.status === 'in-progress' ? 'bg-accent-500/15 text-accent-400' :
                  'bg-white/[0.06] text-surface-500'
                }`}>
                  {s.status === 'completed' ? 'Completed' : s.status === 'in-progress' ? 'In Progress' : 'Not Started'}
                </span>
                {s.score !== null && (
                  <span className={`text-sm font-bold ${s.score >= 90 ? 'text-success-400' : s.score >= 80 ? 'text-accent-400' : 'text-warning-400'}`}>
                    {s.score}%
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </FadeUp>

      <FadeUp delay={0.15}>
        <div className="glass-card p-5">
          <h3 className="text-sm font-bold text-white mb-3">Generate More Materials</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { href: '/magic-chat?mode=lesson', icon: BookOpen, label: 'New Plan', color: 'bg-accent-500/10 text-accent-400 hover:bg-accent-500/20' },
              { href: '/magic-chat?mode=quiz', icon: ClipboardList, label: 'Quiz', color: 'bg-warning-400/10 text-warning-400 hover:bg-warning-400/20' },
              { href: '/magic-chat?mode=worksheet', icon: FileText, label: 'Worksheet', color: 'bg-success-400/10 text-success-400 hover:bg-success-400/20' },
              { href: '/magic-chat?mode=activity', icon: Zap, label: 'Activity', color: 'bg-electric-400/10 text-electric-400 hover:bg-electric-400/20' },
            ].map(a => (
              <Link key={a.label} href={a.href} className={`flex flex-col items-center gap-2 p-3 rounded-xl text-xs font-semibold transition-colors ${a.color}`}>
                <a.icon className="w-4 h-4" />
                {a.label}
              </Link>
            ))}
          </div>
        </div>
      </FadeUp>
    </div>
  )
}
