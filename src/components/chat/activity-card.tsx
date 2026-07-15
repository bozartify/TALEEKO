import { Zap, Clock, Users, Package } from 'lucide-react'

interface RubricRow { criteria?: string; excellent?: string; good?: string; needsWork?: string }
interface Props { data: Record<string, unknown> }

export default function ActivityCard({ data }: Props) {
  const steps  = (data.steps  as string[]) ?? []
  const materials = (data.materials as string[]) ?? []
  const rubric = (data.rubric as RubricRow[]) ?? []

  return (
    <div className="w-full max-w-2xl bg-white rounded-2xl border border-amber-100 shadow-card overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-amber-50" style={{ background: 'linear-gradient(135deg,rgba(245,158,11,0.08),rgba(217,119,6,0.04))' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Activity</p>
            <h3 className="font-black text-slate-900 text-sm">{String(data.title ?? 'Activity')}</h3>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {data.subject  && <span className="badge bg-amber-100 text-amber-700">{String(data.subject)}</span>}
          {data.grade    && <span className="badge bg-slate-100 text-slate-600">Grade {String(data.grade)}</span>}
          {data.type     && <span className="badge bg-slate-100 text-slate-600"><Users className="w-3 h-3" />{String(data.type).replace('_', ' ')}</span>}
          {data.duration && <span className="badge bg-slate-100 text-slate-600"><Clock className="w-3 h-3" />{String(data.duration)} min</span>}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {data.overview && (
          <p className="text-xs text-slate-600">{String(data.overview)}</p>
        )}

        {materials.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Package className="w-3.5 h-3.5 text-slate-500" />
              <p className="text-xs font-bold text-slate-700">Materials</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {materials.map((m, i) => <span key={i} className="badge bg-slate-100 text-slate-600">{m}</span>)}
            </div>
          </div>
        )}

        {steps.length > 0 && (
          <div>
            <p className="text-xs font-bold text-slate-700 mb-2">Steps</p>
            <ol className="space-y-2">
              {steps.map((step, i) => (
                <li key={i} className="flex gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                  <span className="text-xs text-slate-600">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {rubric.length > 0 && (
          <div>
            <p className="text-xs font-bold text-slate-700 mb-2">Rubric</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left py-1.5 pr-3 text-slate-500 font-semibold">Criteria</th>
                    <th className="text-left py-1.5 pr-3 text-emerald-600 font-semibold">Excellent</th>
                    <th className="text-left py-1.5 pr-3 text-amber-600 font-semibold">Good</th>
                    <th className="text-left py-1.5 text-red-500 font-semibold">Needs Work</th>
                  </tr>
                </thead>
                <tbody>
                  {rubric.map((row, i) => (
                    <tr key={i} className="border-b border-slate-50">
                      <td className="py-1.5 pr-3 font-medium text-slate-700">{row.criteria}</td>
                      <td className="py-1.5 pr-3 text-slate-600">{row.excellent}</td>
                      <td className="py-1.5 pr-3 text-slate-600">{row.good}</td>
                      <td className="py-1.5 text-slate-600">{row.needsWork}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {data.differentiation && (
          <div className="p-3 bg-sky-50 rounded-xl">
            <p className="text-xs font-bold text-sky-700 mb-1">Differentiation</p>
            <p className="text-xs text-slate-700">{String(data.differentiation)}</p>
          </div>
        )}
        {data.extensions && (
          <div className="p-3 bg-purple-50 rounded-xl">
            <p className="text-xs font-bold text-purple-700 mb-1">Extensions</p>
            <p className="text-xs text-slate-700">{String(data.extensions)}</p>
          </div>
        )}
      </div>
    </div>
  )
}
