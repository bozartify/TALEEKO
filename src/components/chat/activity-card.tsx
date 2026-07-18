import { Zap, Clock, Users, Package } from 'lucide-react'

interface RubricRow { criteria?: string; excellent?: string; good?: string; needsWork?: string }
interface Props { data: Record<string, unknown> }

export default function ActivityCard({ data }: Props) {
  const steps  = (data.steps  as string[]) ?? []
  const materials = (data.materials as string[]) ?? []
  const rubric = (data.rubric as RubricRow[]) ?? []

  return (
    <div className="w-full max-w-2xl glass-card overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/[0.06]" style={{ background: 'linear-gradient(135deg,rgba(245,158,11,0.08),rgba(217,119,6,0.04))' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-warning-500 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold text-warning-400 uppercase tracking-wider">Activity</p>
            <h3 className="font-black text-white text-sm">{String(data.title ?? 'Activity')}</h3>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {!!data.subject  && <span className="badge bg-warning-500/20 text-warning-300">{String(data.subject)}</span>}
          {!!data.grade    && <span className="badge bg-white/[0.06] text-surface-400">Grade {String(data.grade)}</span>}
          {!!data.type     && <span className="badge bg-white/[0.06] text-surface-400"><Users className="w-3 h-3" />{String(data.type).replace('_', ' ')}</span>}
          {!!data.duration && <span className="badge bg-white/[0.06] text-surface-400"><Clock className="w-3 h-3" />{String(data.duration)} min</span>}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {!!data.overview && (
          <p className="text-xs text-surface-400">{String(data.overview)}</p>
        )}

        {materials.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Package className="w-3.5 h-3.5 text-surface-400" />
              <p className="text-xs font-bold text-surface-200">Materials</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {materials.map((m, i) => <span key={i} className="badge bg-white/[0.06] text-surface-400">{m}</span>)}
            </div>
          </div>
        )}

        {steps.length > 0 && (
          <div>
            <p className="text-xs font-bold text-surface-200 mb-2">Steps</p>
            <ol className="space-y-2">
              {steps.map((step, i) => (
                <li key={i} className="flex gap-2">
                  <span className="w-5 h-5 rounded-full bg-warning-500/20 text-warning-300 text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                  <span className="text-xs text-surface-400">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {rubric.length > 0 && (
          <div>
            <p className="text-xs font-bold text-surface-200 mb-2">Rubric</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="text-left py-1.5 pr-3 text-surface-400 font-semibold">Criteria</th>
                    <th className="text-left py-1.5 pr-3 text-success-400 font-semibold">Excellent</th>
                    <th className="text-left py-1.5 pr-3 text-warning-400 font-semibold">Good</th>
                    <th className="text-left py-1.5 text-danger-400 font-semibold">Needs Work</th>
                  </tr>
                </thead>
                <tbody>
                  {rubric.map((row, i) => (
                    <tr key={i} className="border-b border-white/[0.04]">
                      <td className="py-1.5 pr-3 font-medium text-surface-200">{row.criteria}</td>
                      <td className="py-1.5 pr-3 text-surface-400">{row.excellent}</td>
                      <td className="py-1.5 pr-3 text-surface-400">{row.good}</td>
                      <td className="py-1.5 text-surface-400">{row.needsWork}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!!data.differentiation && (
          <div className="p-3 bg-electric-500/10 rounded-xl border border-electric-500/10">
            <p className="text-xs font-bold text-electric-400 mb-1">Differentiation</p>
            <p className="text-xs text-surface-300">{String(data.differentiation)}</p>
          </div>
        )}
        {!!data.extensions && (
          <div className="p-3 bg-neon-500/10 rounded-xl border border-neon-500/10">
            <p className="text-xs font-bold text-neon-400 mb-1">Extensions</p>
            <p className="text-xs text-surface-300">{String(data.extensions)}</p>
          </div>
        )}
      </div>
    </div>
  )
}
