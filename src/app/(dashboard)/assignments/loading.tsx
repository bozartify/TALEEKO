export default function AssignmentsLoading() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-8 w-44 bg-surface-800 rounded-xl" />
        <div className="flex gap-2">
          <div className="h-10 w-52 bg-surface-800 rounded-xl" />
          <div className="h-10 w-36 bg-accent-500/20 rounded-xl" />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-card rounded-2xl p-4 space-y-2">
            <div className="h-4 w-16 bg-surface-700 rounded" />
            <div className="h-7 w-10 bg-surface-700 rounded-lg" />
          </div>
        ))}
      </div>
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="glass-card rounded-2xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-surface-700 rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-4 bg-surface-700 rounded w-3/5" />
              <div className="h-3 bg-surface-800 rounded w-2/5" />
            </div>
            <div className="h-6 w-20 bg-surface-800 rounded-lg" />
            <div className="h-6 w-16 bg-surface-800 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  )
}
