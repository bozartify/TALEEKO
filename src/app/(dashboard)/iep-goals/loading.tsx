export default function IEPGoalsLoading() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-8 w-40 bg-surface-800 rounded-xl" />
        <div className="flex gap-2">
          <div className="h-10 w-28 bg-surface-800 rounded-xl" />
          <div className="h-10 w-28 bg-surface-800 rounded-xl" />
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-card rounded-2xl p-5 space-y-2">
            <div className="h-4 w-20 bg-surface-700 rounded" />
            <div className="h-8 w-12 bg-surface-700 rounded-lg" />
          </div>
        ))}
      </div>
      <div className="flex gap-2 mb-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-10 w-28 bg-surface-800 rounded-xl" />
        ))}
      </div>
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="glass-card rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-surface-700 rounded-xl" />
                <div className="space-y-1">
                  <div className="h-4 w-32 bg-surface-700 rounded" />
                  <div className="h-3 w-24 bg-surface-800 rounded" />
                </div>
              </div>
              <div className="h-6 w-20 bg-surface-800 rounded-lg" />
            </div>
            <div className="h-2 bg-surface-800 rounded-full" />
            <div className="flex justify-between">
              <div className="h-3 w-16 bg-surface-800 rounded" />
              <div className="h-3 w-16 bg-surface-800 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
