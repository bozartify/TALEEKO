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
    <div className="w-full max-w-2xl bg-white rounded-2xl border border-emerald-100 shadow-card overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-emerald-50" style={{ background: 'linear-gradient(135deg,rgba(20,184,166,0.08),rgba(13,148,136,0.04))' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Worksheet</p>
            <h3 className="font-black text-slate-900 text-sm">{String(data.title ?? 'Worksheet')}</h3>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {data.subject && <span className="badge bg-emerald-100 text-emerald-700">{String(data.subject)}</span>}
          {data.grade   && <span className="badge bg-slate-100 text-slate-600">Grade {String(data.grade)}</span>}
          {data.topic   && <span className="badge bg-slate-100 text-slate-600">{String(data.topic)}</span>}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {data.objective && (
          <div className="p-3 bg-emerald-50 rounded-xl">
            <p className="text-xs font-bold text-emerald-700 mb-1">Objective</p>
            <p className="text-xs text-slate-700">{String(data.objective)}</p>
          </div>
        )}

        {sections.map((section, i) => (
          <div key={i}>
            <p className="text-xs font-bold text-slate-900 mb-1">
              Part {i + 1}{section.title ? `: ${section.title}` : ''}
            </p>
            {section.instructions && (
              <p className="text-xs text-slate-500 italic mb-2">{section.instructions}</p>
            )}
            {Array.isArray(section.exercises) && (
              <ol className="space-y-1.5 pl-4">
                {section.exercises.map((ex, j) => (
                  <li key={j} className="text-xs text-slate-700 list-decimal">{ex}</li>
                ))}
              </ol>
            )}
          </div>
        ))}

        {data.answerKey && (
          <div className="p-3 bg-amber-50 rounded-xl">
            <p className="text-xs font-bold text-amber-700 mb-1">Answer Key</p>
            <p className="text-xs text-slate-700 whitespace-pre-wrap">{String(data.answerKey)}</p>
          </div>
        )}
      </div>
    </div>
  )
}
