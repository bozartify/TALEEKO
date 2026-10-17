export default function GroupsLoading() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-8 w-40 bg-surface-800 rounded-xl" />
        <div className="h-10 w-36 bg-surface-800 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="glass-card rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-surface-700 rounded-xl" />
              <div className="space-y-1 flex-1">
                <div className="h-4 bg-surface-700 rounded w-2/3" />
                <div className="h-3 bg-surface-800 rounded w-1/3" />
              </div>
            </div>
            <div className="flex gap-1">
              {[...Array(4)].map((_, j) => (
                <div key={j} className="w-8 h-8 bg-surface-700 rounded-full" />
              ))}
            </div>
            <div className="flex gap-2">
              <div className="h-8 flex-1 bg-surface-800 rounded-xl" />
              <div className="h-8 w-8 bg-surface-800 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
