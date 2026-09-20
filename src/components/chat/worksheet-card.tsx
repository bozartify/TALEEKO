import { FileText } from 'lucide-react'

interface Section {
  title?: string
  instructions?: string
  exercises?: string[]
}

interface Props { data: Record<string, unknown> }

export default function WorksheetCard({ data }: Props) {
  const sections = (data.sections as Section[]) ?? []

  return (
    <div className="w-full max-w-2xl glass-card overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/[0.06]" style={{ background: 'linear-gradient(135deg,rgba(20,184,166,0.08),rgba(13,148,136,0.04))' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-success-500 flex items-center justify-center">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold text-success-400 uppercase tracking-wider">Worksheet</p>
            <h3 className="font-black text-white text-sm">{String(data.title ?? 'Worksheet')}</h3>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {!!data.subject && <span className="badge bg-success-500/20 text-success-300">{String(data.subject)}</span>}
          {!!data.grade   && <span className="badge bg-white/[0.06] text-surface-400">Grade {String(data.grade)}</span>}
          {!!data.topic   && <span className="badge bg-white/[0.06] text-surface-400">{String(data.topic)}</span>}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {!!data.objective && (
          <div className="p-3 bg-success-500/10 rounded-xl border border-success-500/10">
            <p className="text-xs font-bold text-success-400 mb-1">Objective</p>
            <p className="text-xs text-surface-300">{String(data.objective)}</p>
          </div>
        )}

        {sections.map((section, i) => (
          <div key={i}>
            <p className="text-xs font-bold text-white mb-1">
              Part {i + 1}{section.title ? `: ${section.title}` : ''}
            </p>
            {section.instructions && (
              <p className="text-xs text-surface-500 italic mb-2">{section.instructions}</p>
            )}
            {Array.isArray(section.exercises) && (
              <ol className="space-y-1.5 pl-4">
                {section.exercises.map((ex, j) => (
                  <li key={j} className="text-xs text-surface-300 list-decimal">{ex}</li>
                ))}
              </ol>
            )}
          </div>
        ))}

        {!!data.answerKey && (
          <div className="p-3 bg-warning-500/10 rounded-xl border border-warning-500/10">
            <p className="text-xs font-bold text-warning-400 mb-1">Answer Key</p>
            <p className="text-xs text-surface-300 whitespace-pre-wrap">{String(data.answerKey)}</p>
          </div>
        )}
      </div>
    </div>
  )
}
