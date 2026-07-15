import { TrendingUp, BookOpen, Users, Clock, BarChart2, Star, Target, Zap } from 'lucide-react'

const weekData = [
  { day: 'Mon', lessons: 2, minutes: 45 },
  { day: 'Tue', lessons: 4, minutes: 60 },
  { day: 'Wed', lessons: 1, minutes: 30 },
  { day: 'Thu', lessons: 5, minutes: 75 },
  { day: 'Fri', lessons: 3, minutes: 50 },
]

const topTools = [
  { name: 'Lesson Plans',   uses: 24, pct: 85, color: '#8b5cf6' },
  { name: 'Quiz Generator', uses: 18, pct: 65, color: '#f97316' },
  { name: 'Worksheets',     uses: 12, pct: 43, color: '#14b8a6' },
  { name: 'Activities',     uses: 8,  pct: 29, color: '#f59e0b' },
  { name: 'AI Analysis',    uses: 5,  pct: 18, color: '#f43f5e' },
]

const highlights = [
  { icon: Star,    label: 'Highest Scoring Lesson', value: 'Photosynthesis (9.4/10)' },
  { icon: Target,  label: 'Most Used Tool',         value: 'Lesson Plan Generator' },
  { icon: Zap,     label: 'Fastest Material',        value: 'Quiz in 1m 23s' },
  { icon: Clock,   label: 'Total Time Saved',        value: '31+ hours this month' },
]

export default function AnalyticsPage() {
  const maxLessons = Math.max(...weekData.map(d => d.lessons))

  return (
    <div className="space-y-6">
      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Materials Created', value: '67',   icon: BookOpen,   color: 'bg-brand-100 text-brand-600',   delta: '+12 this week' },
          { label: 'AI Interactions',   value: '143',  icon: BarChart2,  color: 'bg-sky-100 text-sky-600',       delta: '+28 this week' },
          { label: 'Students Reached',  value: '142',  icon: Users,      color: 'bg-emerald-100 text-emerald-600', delta: 'Across 4 classes' },
          { label: 'Hours Saved',       value: '31h',  icon: TrendingUp, color: 'bg-amber-100 text-amber-600',   delta: 'This month' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className={`icon-bubble ${s.color} mb-3`}><s.icon className="w-5 h-5" /></div>
            <div className="text-2xl font-black text-slate-900">{s.value}</div>
            <div className="text-xs font-semibold text-slate-700 mt-0.5">{s.label}</div>
            <div className="text-xs text-slate-400 mt-1">{s.delta}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly activity bar chart */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Weekly Activity</h3>
          <div className="flex items-end gap-3 h-32">
            {weekData.map(d => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs font-bold text-brand-600">{d.lessons}</span>
                <div
                  className="w-full rounded-t-lg transition-all"
                  style={{
                    height: `${(d.lessons / maxLessons) * 96}px`,
                    background: 'linear-gradient(180deg,#8b5cf6,#6d28d9)'
                  }}
                />
                <span className="text-xs text-slate-400">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top tools */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Most Used Tools</h3>
          <div className="space-y-3">
            {topTools.map(tool => (
              <div key={tool.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-slate-700">{tool.name}</span>
                  <span className="text-xs font-bold text-slate-500">{tool.uses}x</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${tool.pct}%`, backgroundColor: tool.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Highlights */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-5">
        <h3 className="text-sm font-bold text-slate-900 mb-4">Highlights</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {highlights.map(h => (
            <div key={h.label} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
              <div className="icon-bubble bg-brand-100 text-brand-600 w-8 h-8 rounded-lg">
                <h.icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-slate-400">{h.label}</p>
                <p className="text-xs font-bold text-slate-900 mt-0.5">{h.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
