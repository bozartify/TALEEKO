export default function UnitPlannerLoading() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-8 w-44 bg-surface-800 rounded-xl" />
        <div className="h-10 w-36 bg-surface-800 rounded-xl" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-card rounded-2xl p-5 space-y-2">
            <div className="h-4 w-20 bg-surface-700 rounded" />
            <div className="h-8 w-12 bg-surface-700 rounded-lg" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="glass-card rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-surface-700 rounded-xl" />
              <div className="space-y-1 flex-1">
                <div className="h-4 bg-surface-700 rounded w-3/4" />
                <div className="h-3 bg-surface-800 rounded w-1/2" />
              </div>
            </div>
            <div className="h-2 bg-surface-800 rounded-full" />
            <div className="flex gap-2">
              <div className="h-7 w-20 bg-surface-800 rounded-lg" />
              <div className="h-7 w-20 bg-surface-800 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
