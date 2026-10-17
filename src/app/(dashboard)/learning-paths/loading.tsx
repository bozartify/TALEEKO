export default function LearningPathsLoading() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 bg-surface-800 rounded-xl" />
        <div className="h-10 w-36 bg-surface-800 rounded-xl" />
      </div>
      <div className="flex gap-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-9 w-28 bg-surface-800 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="glass-card rounded-2xl p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="h-5 w-32 bg-surface-700 rounded" />
                <div className="h-3 w-24 bg-surface-800 rounded" />
              </div>
              <div className="w-10 h-10 bg-surface-700 rounded-xl" />
            </div>
            <div className="space-y-2">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="h-3 bg-surface-800 rounded w-full" />
              ))}
            </div>
            <div className="h-2 bg-surface-800 rounded-full" />
            <div className="h-8 w-full bg-surface-800 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  )
}
