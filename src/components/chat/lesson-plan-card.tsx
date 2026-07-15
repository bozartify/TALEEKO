import { BookOpen, Clock, Target, Lightbulb, ClipboardCheck, Users } from 'lucide-react'

interface Props { data: Record<string, unknown> }

export default function LessonPlanCard({ data }: Props) {
  const sections = [
    { icon: Lightbulb,    label: 'Warm-Up',           key: 'warmUp' },
    { icon: BookOpen,     label: 'Direct Instruction', key: 'directInstruction' },
    { icon: Users,        label: 'Guided Practice',    key: 'guidedPractice' },
    { icon: ClipboardCheck, label: 'Independent Work', key: 'independentPractice' },
    { icon: Target,       label: 'Closure',            key: 'closure' },
    { icon: ClipboardCheck, label: 'Assessment',       key: 'assessment' },
  ]

  return (
    <div className="w-full max-w-2xl bg-white rounded-2xl border border-brand-100 shadow-card overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-brand-50" style={{ background: 'linear-gradient(135deg,rgba(139,92,246,0.08),rgba(109,40,217,0.04))' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)' }}>
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold text-brand-600 uppercase tracking-wider">Lesson Plan</p>
            <h3 className="font-black text-slate-900 text-sm">{String(data.title ?? 'Lesson Plan')}</h3>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {data.subject && <span className="badge bg-brand-100 text-brand-700">{String(data.subject)}</span>}
          {data.grade   && <span className="badge bg-slate-100 text-slate-600">Grade {String(data.grade)}</span>}
          {data.duration && (
            <span className="badge bg-slate-100 text-slate-600">
              <Clock className="w-3 h-3" />{String(data.duration)} min
            </span>
          )}
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Objective */}
        {data.objective && (
          <div className="p-3 bg-brand-50 rounded-xl">
            <p className="text-xs font-bold text-brand-700 mb-1">Learning Objective</p>
            <p className="text-xs text-slate-700">{String(data.objective)}</p>
          </div>
        )}

        {/* Sections */}
        {sections.map(({ icon: Icon, label, key }) =>
          data[key] ? (
            <div key={key} className="flex gap-3">
              <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                <Icon className="w-3.5 h-3.5 text-slate-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-700">{label}</p>
                <p className="text-xs text-slate-600 mt-0.5">{String(data[key])}</p>
              </div>
            </div>
          ) : null
        )}

        {/* Differentiation */}
        {data.differentiation && (
          <div className="p-3 bg-emerald-50 rounded-xl">
            <p className="text-xs font-bold text-emerald-700 mb-1">Differentiation</p>
            <p className="text-xs text-slate-700">{String(data.differentiation)}</p>
          </div>
        )}

        {/* Materials */}
        {Array.isArray(data.materials) && data.materials.length > 0 && (
          <div>
            <p className="text-xs font-bold text-slate-700 mb-1.5">Materials Needed</p>
            <div className="flex flex-wrap gap-1.5">
              {(data.materials as string[]).map((m, i) => (
                <span key={i} className="badge bg-slate-100 text-slate-600">{m}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
