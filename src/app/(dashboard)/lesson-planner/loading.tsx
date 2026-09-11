export default function LessonPlannerLoading() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 bg-surface-800 rounded-xl" />
        <div className="flex gap-2">
          <div className="h-10 w-36 bg-surface-800 rounded-xl" />
          <div className="h-10 w-28 bg-surface-800 rounded-xl" />
        </div>
      </div>

      {/* Form controls */}
      <div className="glass-card rounded-2xl p-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-1.5">
              <div className="h-3 w-16 bg-surface-700 rounded" />
              <div className="h-10 bg-surface-800 rounded-xl" />
            </div>
          ))}
        </div>
        <div className="h-10 w-full bg-accent-500/20 rounded-xl" />
      </div>

      {/* Sections */}
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="h-5 w-32 bg-surface-700 rounded-lg" />
              <div className="h-8 w-20 bg-surface-800 rounded-lg" />
            </div>
            <div className="space-y-2">
              <div className="h-3.5 bg-surface-800 rounded w-full" />
              <div className="h-3.5 bg-surface-800 rounded w-4/5" />
              <div className="h-3.5 bg-surface-800 rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
