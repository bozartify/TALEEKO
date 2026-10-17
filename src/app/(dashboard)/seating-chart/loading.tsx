export default function SeatingChartLoading() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-8 w-44 bg-surface-800 rounded-xl" />
        <div className="flex gap-2">
          <div className="h-10 w-28 bg-surface-800 rounded-xl" />
          <div className="h-10 w-28 bg-surface-800 rounded-xl" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card rounded-2xl p-5">
          <div className="h-5 w-32 bg-surface-700 rounded mb-4" />
          <div className="grid grid-cols-5 gap-2">
            {[...Array(30)].map((_, i) => (
              <div key={i} className="h-14 bg-surface-800 rounded-xl" />
            ))}
          </div>
        </div>
        <div className="glass-card rounded-2xl p-5 space-y-3">
          <div className="h-5 w-28 bg-surface-700 rounded" />
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-8 h-8 bg-surface-700 rounded-lg" />
              <div className="h-3 bg-surface-800 rounded flex-1" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
