export default function QuizBuilderLoading() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-8 w-44 bg-surface-800 rounded-xl" />
        <div className="h-10 w-40 bg-accent-500/20 rounded-xl" />
      </div>

      {/* Config panel */}
      <div className="glass-card rounded-2xl p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-1.5">
            <div className="h-3 w-20 bg-surface-700 rounded" />
            <div className="h-10 bg-surface-800 rounded-xl" />
          </div>
        ))}
      </div>

      {/* Questions list */}
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-card rounded-2xl p-5 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 bg-surface-700 rounded-lg flex-shrink-0 mt-0.5" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-surface-700 rounded w-full" />
                <div className="h-4 bg-surface-700 rounded w-3/4" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 pl-10">
              {[...Array(4)].map((_, j) => (
                <div key={j} className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-surface-700 rounded-full" />
                  <div className="h-3.5 bg-surface-800 rounded w-full" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
