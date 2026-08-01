import Link from 'next/link'
import { ArrowLeft, BookOpen, Plus, Clock, ChevronRight, Sparkles } from 'lucide-react'

const lessons = [
  { id: '1', title: 'Introduction to Cells',          duration: 45, status: 'published', materials: 3 },
  { id: '2', title: 'Cell Structure and Organelles',  duration: 50, status: 'published', materials: 4 },
  { id: '3', title: 'Photosynthesis',                 duration: 60, status: 'published', materials: 5 },
  { id: '4', title: 'Cellular Respiration',           duration: 55, status: 'draft',     materials: 2 },
  { id: '5', title: 'DNA and Genetics',               duration: 60, status: 'draft',     materials: 1 },
  { id: '6', title: 'Ecosystems and Food Webs',       duration: 45, status: 'draft',     materials: 0 },
]

export default function CourseDetailPage({ params }: { params: { courseId: string } }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/courses" className="text-surface-500 hover:text-surface-300 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1">
          <h2 className="text-xl font-black text-white">7th Grade Biology</h2>
          <p className="text-xs text-surface-400">Science · Grade 7 · {lessons.length} lessons</p>
        </div>
        <Link href="/magic-chat?mode=lesson" className="btn-gradient">
          <Sparkles className="w-4 h-4" />
          Generate Lesson
        </Link>
      </div>

      {/* Progress bar */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-white">Course Progress</span>
          <span className="text-sm text-accent-400 font-bold">{Math.round((lessons.filter(l => l.status === 'published').length / lessons.length) * 100)}% published</span>
        </div>
        <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${(lessons.filter(l => l.status === 'published').length / lessons.length) * 100}%`,
              background: 'linear-gradient(135deg,#b0623f,#914d30)'
            }}
          />
        </div>
        <div className="flex gap-4 mt-3 text-xs text-surface-400">
          <span className="text-success-400 font-medium">{lessons.filter(l => l.status === 'published').length} published</span>
          <span>{lessons.filter(l => l.status === 'draft').length} drafts</span>
        </div>
      </div>

      {/* Lessons list */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-white">Lessons</h3>
          <button className="btn-secondary text-xs">
            <Plus className="w-3.5 h-3.5" />
            Add Lesson
          </button>
        </div>
        <div className="glass-card overflow-hidden">
          {lessons.map((lesson, i) => (
            <Link
              key={lesson.id}
              href={`/courses/${params.courseId}/lessons/${lesson.id}`}
              className={`flex items-center gap-4 px-5 py-4 hover:bg-white/[0.04] transition-colors ${
                i < lessons.length - 1 ? 'border-b border-white/[0.06]' : ''
              }`}
            >
              <div className="w-7 h-7 rounded-lg bg-accent-500/15 text-accent-400 text-xs font-bold flex items-center justify-center flex-shrink-0">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{lesson.title}</p>
                <div className="flex items-center gap-3 mt-0.5 text-xs text-surface-500">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{lesson.duration} min</span>
                  <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{lesson.materials} materials</span>
                </div>
              </div>
              <span className={`badge ${
                lesson.status === 'published' ? 'bg-success-400/15 text-success-400' : 'bg-white/[0.06] text-surface-400'
              }`}>{lesson.status}</span>
              <ChevronRight className="w-4 h-4 text-surface-500" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
