export default function ProgressMonitorLoading() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 bg-surface-800 rounded-xl" />
        <div className="flex gap-2">
          <div className="h-10 w-32 bg-surface-800 rounded-xl" />
          <div className="h-10 w-32 bg-surface-800 rounded-xl" />
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-card rounded-2xl p-5 space-y-2">
            <div className="h-4 w-20 bg-surface-700 rounded" />
            <div className="h-8 w-14 bg-surface-700 rounded-lg" />
          </div>
        ))}
      </div>
      <div className="space-y-2">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="glass-card rounded-2xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-surface-700 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-1">
              <div className="h-4 bg-surface-700 rounded w-1/4" />
              <div className="h-2 bg-surface-800 rounded-full w-2/3" />
            </div>
            <div className="flex gap-2">
              {[...Array(4)].map((_, j) => (
                <div key={j} className="h-6 w-12 bg-surface-800 rounded-lg" />
              ))}
            </div>
            <div className="h-6 w-20 bg-surface-800 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  )
}
