import { BarChart2, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react'

interface Props { data: Record<string, unknown> }

function ScoreBar({ label, value }: { label: string; value: number }) {
  const pct = Math.round((value / 10) * 100)
  const color = value >= 8 ? '#10b981' : value >= 6 ? '#b0623f' : value >= 4 ? '#f59e0b' : '#f43f5e'
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-surface-400">{label}</span>
        <span className="text-xs font-bold" style={{ color }}>{value}/10</span>
      </div>
      <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  )
}

export default function AnalysisCard({ data }: Props) {
  const strengths     = (data.strengths     as string[]) ?? []
  const improvements  = (data.improvements  as string[]) ?? []
  const recommendations = (data.recommendations as string[]) ?? []

  return (
    <div className="w-full max-w-2xl glass-card overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/[0.06]" style={{ background: 'linear-gradient(135deg,rgba(14,165,233,0.08),rgba(2,132,199,0.04))' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-electric-500 flex items-center justify-center">
            <BarChart2 className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold text-electric-400 uppercase tracking-wider">Lesson Analysis</p>
            <h3 className="font-black text-white text-sm">AI Feedback Report</h3>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Score ring */}
        {!!data.overallScore && (
          <div className="flex items-center gap-4 p-4 bg-white/[0.03] rounded-xl border border-white/[0.04]">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-white font-black text-lg flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#dd9a33,#c67954)' }}
            >
              {Number(data.overallScore).toFixed(1)}
            </div>
            <div>
              <p className="text-sm font-bold text-white">Overall Score</p>
              <p className="text-xs text-surface-400">Out of 10.0</p>
            </div>
          </div>
        )}

        {/* Score bars */}
        <div className="space-y-2">
          {!!data.alignmentScore      && <ScoreBar label="Standards Alignment" value={Number(data.alignmentScore)} />}
          {!!data.engagementScore     && <ScoreBar label="Student Engagement"  value={Number(data.engagementScore)} />}
          {!!data.differentiationScore && <ScoreBar label="Differentiation"    value={Number(data.differentiationScore)} />}
        </div>

        {/* Strengths */}
        {strengths.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <CheckCircle className="w-3.5 h-3.5 text-success-400" />
              <p className="text-xs font-bold text-surface-200">Strengths</p>
            </div>
            <ul className="space-y-1">
              {strengths.map((s, i) => <li key={i} className="text-xs text-surface-400 pl-5 list-disc">{s}</li>)}
            </ul>
          </div>
        )}

        {/* Improvements */}
        {improvements.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <AlertCircle className="w-3.5 h-3.5 text-warning-400" />
              <p className="text-xs font-bold text-surface-200">Areas to Improve</p>
            </div>
            <ul className="space-y-1">
              {improvements.map((s, i) => <li key={i} className="text-xs text-surface-400 pl-5 list-disc">{s}</li>)}
            </ul>
          </div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="p-3 bg-accent-500/10 rounded-xl border border-accent-500/10">
            <div className="flex items-center gap-1.5 mb-2">
              <TrendingUp className="w-3.5 h-3.5 text-accent-400" />
              <p className="text-xs font-bold text-accent-300">Recommendations</p>
            </div>
            <ol className="space-y-1">
              {recommendations.map((r, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-accent-400 font-bold text-xs flex-shrink-0">{i + 1}.</span>
                  <span className="text-xs text-surface-300">{r}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {!!data.summary && (
          <p className="text-xs text-surface-500 italic">{String(data.summary)}</p>
        )}
      </div>
    </div>
  )
}
