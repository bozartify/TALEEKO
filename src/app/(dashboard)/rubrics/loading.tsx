export default function RubricsLoading() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-8 w-36 bg-surface-800 rounded-xl" />
        <div className="flex gap-2">
          <div className="h-10 w-28 bg-surface-800 rounded-xl" />
          <div className="h-10 w-36 bg-surface-800 rounded-xl" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="glass-card rounded-2xl p-5 space-y-3">
            <div className="h-5 bg-surface-700 rounded w-3/4" />
            <div className="flex gap-2">
              <div className="h-5 w-16 bg-surface-800 rounded-lg" />
              <div className="h-5 w-16 bg-surface-800 rounded-lg" />
            </div>
            <div className="space-y-2">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="h-3 bg-surface-800 rounded w-full" />
              ))}
            </div>
            <div className="flex gap-2 pt-1">
              <div className="h-8 flex-1 bg-surface-800 rounded-xl" />
              <div className="h-8 w-8 bg-surface-800 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
