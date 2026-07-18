import Link from 'next/link'
import { ArrowLeft, Clock, BookOpen, Sparkles, FileText, ClipboardList, Zap, BarChart2 } from 'lucide-react'

const materials = [
  { id: '1', type: 'lesson_plan', title: 'Photosynthesis – 45 Min Lesson Plan', date: 'Today' },
  { id: '2', type: 'quiz',        title: 'Photosynthesis Quiz (10 questions)',   date: 'Today' },
  { id: '3', type: 'worksheet',   title: 'Light Reactions Worksheet',            date: 'Yesterday' },
]

const TYPE_META: Record<string, { icon: React.ElementType; label: string; color: string }> = {
  lesson_plan: { icon: BookOpen,      label: 'Lesson Plan', color: 'bg-accent-500/15 text-accent-400' },
  quiz:        { icon: ClipboardList, label: 'Quiz',        color: 'bg-warning-400/15 text-warning-400' },
  worksheet:   { icon: FileText,      label: 'Worksheet',   color: 'bg-success-400/15 text-success-400' },
  activity:    { icon: Zap,           label: 'Activity',    color: 'bg-warning-400/15 text-warning-400' },
}

export default function LessonDetailPage({
  params,
}: {
  params: { courseId: string; lessonId: string }
}) {
  return (
    <div className="space-y-6 max-w-3xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-surface-500">
        <Link href="/courses" className="hover:text-surface-300">Courses</Link>
        <span>/</span>
        <Link href={`/courses/${params.courseId}`} className="hover:text-surface-300">7th Grade Biology</Link>
        <span>/</span>
        <span className="text-surface-300">Photosynthesis</span>
      </div>

      {/* Header */}
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
        <Link href="/magic-chat?mode=lesson" className="btn-gradient flex-shrink-0">
          <Sparkles className="w-4 h-4" />
          Generate More
        </Link>
      </div>

      {/* Objective */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-bold text-white mb-2">Learning Objective</h3>
        <p className="text-sm text-surface-300">
          Students will be able to explain the process of photosynthesis, identify the reactants and products, and describe how plants convert light energy into chemical energy stored in glucose.
        </p>
      </div>

      {/* Materials */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-white">Materials ({materials.length})</h3>
          <div className="flex gap-2">
            <Link href="/magic-chat?mode=quiz" className="btn-secondary text-xs">
              <ClipboardList className="w-3.5 h-3.5" />Add Quiz
            </Link>
            <Link href="/magic-chat?mode=worksheet" className="btn-secondary text-xs">
              <FileText className="w-3.5 h-3.5" />Add Worksheet
            </Link>
          </div>
        </div>
        <div className="space-y-3">
          {materials.map(mat => {
            const meta = TYPE_META[mat.type] ?? TYPE_META.lesson_plan
            return (
              <div key={mat.id} className="glass-card p-4 flex items-center gap-4 transition-all cursor-pointer">
                <div className={`icon-bubble ${meta.color}`}>
                  <meta.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{mat.title}</p>
                  <p className="text-xs text-surface-500">{meta.label} · {mat.date}</p>
                </div>
                <button className="btn-outline text-xs px-3 py-1.5">View</button>
              </div>
            )
          })}
        </div>
      </div>

      {/* AI Actions */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-bold text-white mb-3">Generate More Materials</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { href: '/magic-chat?mode=lesson',    icon: BookOpen,      label: 'New Plan',  color: 'bg-accent-500/10 text-accent-400 hover:bg-accent-500/20' },
            { href: '/magic-chat?mode=quiz',       icon: ClipboardList, label: 'Quiz',      color: 'bg-warning-400/10 text-warning-400 hover:bg-warning-400/20' },
            { href: '/magic-chat?mode=worksheet',  icon: FileText,      label: 'Worksheet', color: 'bg-success-400/10 text-success-400 hover:bg-success-400/20' },
            { href: '/magic-chat?mode=activity',   icon: Zap,           label: 'Activity',  color: 'bg-warning-400/10 text-warning-400 hover:bg-warning-400/20' },
          ].map(a => (
            <Link key={a.label} href={a.href} className={`flex flex-col items-center gap-2 p-3 rounded-xl text-xs font-semibold transition-colors ${a.color}`}>
              <a.icon className="w-4 h-4" />
              {a.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
