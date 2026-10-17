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
    <div className="w-full max-w-2xl glass-card overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/[0.06]" style={{ background: 'linear-gradient(135deg,rgba(99,102,241,0.08),rgba(167,139,250,0.04))' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#6366f1,#a78bfa)' }}>
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold text-accent-400 uppercase tracking-wider">Lesson Plan</p>
            <h3 className="font-black text-white text-sm">{String(data.title ?? 'Lesson Plan')}</h3>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {!!data.subject && <span className="badge bg-accent-500/20 text-accent-300">{String(data.subject)}</span>}
          {!!data.grade   && <span className="badge bg-white/[0.06] text-surface-400">Grade {String(data.grade)}</span>}
          {!!data.duration && (
            <span className="badge bg-white/[0.06] text-surface-400">
              <Clock className="w-3 h-3" />{String(data.duration)} min
            </span>
          )}
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Objective */}
        {!!data.objective && (
          <div className="p-3 bg-accent-500/10 rounded-xl border border-accent-500/10">
            <p className="text-xs font-bold text-accent-300 mb-1">Learning Objective</p>
            <p className="text-xs text-surface-300">{String(data.objective)}</p>
          </div>
        )}

        {/* Sections */}
        {sections.map(({ icon: Icon, label, key }) =>
          data[key] ? (
            <div key={key} className="flex gap-3">
              <div className="w-7 h-7 rounded-lg bg-white/[0.06] flex items-center justify-center flex-shrink-0">
                <Icon className="w-3.5 h-3.5 text-surface-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-surface-200">{label}</p>
                <p className="text-xs text-surface-400 mt-0.5">{String(data[key])}</p>
              </div>
            </div>
          ) : null
        )}

        {/* Differentiation */}
        {!!data.differentiation && (
          <div className="p-3 bg-success-500/10 rounded-xl border border-success-500/10">
            <p className="text-xs font-bold text-success-400 mb-1">Differentiation</p>
            <p className="text-xs text-surface-300">{String(data.differentiation)}</p>
          </div>
        )}

        {/* Materials */}
        {Array.isArray(data.materials) && data.materials.length > 0 && (
          <div>
            <p className="text-xs font-bold text-surface-200 mb-1.5">Materials Needed</p>
            <div className="flex flex-wrap gap-1.5">
              {(data.materials as string[]).map((m, i) => (
                <span key={i} className="badge bg-white/[0.06] text-surface-400">{m}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
