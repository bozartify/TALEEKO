export default function DashboardLoading() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-surface-800 rounded-xl" />
          <div className="h-4 w-40 bg-surface-800/60 rounded-lg" />
        </div>
        <div className="h-10 w-32 bg-surface-800 rounded-xl" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-card rounded-2xl p-5 space-y-3">
            <div className="h-4 w-20 bg-surface-700 rounded" />
            <div className="h-8 w-16 bg-surface-700 rounded-lg" />
            <div className="h-3 w-24 bg-surface-800 rounded" />
          </div>
        ))}
      </div>

      {/* Content rows */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="glass-card rounded-2xl p-5 space-y-4">
            <div className="h-5 w-32 bg-surface-700 rounded-lg" />
            {[...Array(4)].map((_, j) => (
              <div key={j} className="flex items-center gap-3">
                <div className="w-9 h-9 bg-surface-700 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 bg-surface-700 rounded w-3/4" />
                  <div className="h-3 bg-surface-800 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
