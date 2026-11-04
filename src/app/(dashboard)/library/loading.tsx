export default function LibraryLoading() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-8 w-40 bg-surface-800 rounded-xl" />
        <div className="h-10 w-64 bg-surface-800 rounded-xl" />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-9 w-24 bg-surface-800 rounded-xl" />
        ))}
      </div>

      {/* Grid of cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="glass-card rounded-2xl overflow-hidden">
            <div className="h-36 bg-surface-800" />
            <div className="p-4 space-y-2.5">
              <div className="h-4 bg-surface-700 rounded w-4/5" />
              <div className="h-3.5 bg-surface-800 rounded w-3/5" />
              <div className="flex gap-2 mt-3">
                <div className="h-8 flex-1 bg-surface-800 rounded-lg" />
                <div className="h-8 w-8 bg-surface-800 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
