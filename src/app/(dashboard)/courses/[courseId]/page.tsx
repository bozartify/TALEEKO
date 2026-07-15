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
        <Link href="/courses" className="text-slate-400 hover:text-slate-600 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1">
          <h2 className="text-xl font-black text-slate-900">7th Grade Biology</h2>
          <p className="text-xs text-slate-500">Science · Grade 7 · {lessons.length} lessons</p>
        </div>
        <Link href="/magic-chat?mode=lesson" className="btn-gradient">
          <Sparkles className="w-4 h-4" />
          Generate Lesson
        </Link>
      </div>

      {/* Progress bar */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-slate-900">Course Progress</span>
          <span className="text-sm text-brand-600 font-bold">{Math.round((lessons.filter(l => l.status === 'published').length / lessons.length) * 100)}% published</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${(lessons.filter(l => l.status === 'published').length / lessons.length) * 100}%`,
              background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)'
            }}
          />
        </div>
        <div className="flex gap-4 mt-3 text-xs text-slate-500">
          <span className="text-emerald-600 font-medium">{lessons.filter(l => l.status === 'published').length} published</span>
          <span>{lessons.filter(l => l.status === 'draft').length} drafts</span>
        </div>
      </div>

      {/* Lessons list */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900">Lessons</h3>
          <button className="btn-secondary text-xs">
            <Plus className="w-3.5 h-3.5" />
            Add Lesson
          </button>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
          {lessons.map((lesson, i) => (
            <Link
              key={lesson.id}
              href={`/courses/${params.courseId}/lessons/${lesson.id}`}
              className={`flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors ${
                i < lessons.length - 1 ? 'border-b border-slate-100' : ''
              }`}
            >
              <div className="w-7 h-7 rounded-lg bg-brand-50 text-brand-600 text-xs font-bold flex items-center justify-center flex-shrink-0">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{lesson.title}</p>
                <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{lesson.duration} min</span>
                  <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{lesson.materials} materials</span>
                </div>
              </div>
              <span className={`badge ${
                lesson.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
              }`}>{lesson.status}</span>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
