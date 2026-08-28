export default function StudentsLoading() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-8 w-36 bg-surface-800 rounded-xl" />
        <div className="flex gap-2">
          <div className="h-10 w-52 bg-surface-800 rounded-xl" />
          <div className="h-10 w-32 bg-accent-500/20 rounded-xl" />
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="glass-card rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-surface-700 rounded-xl" />
            <div className="space-y-1.5">
              <div className="h-5 w-8 bg-surface-700 rounded" />
              <div className="h-3 w-16 bg-surface-800 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/[0.06] flex gap-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-4 bg-surface-700 rounded flex-1" />
          ))}
        </div>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="p-4 border-b border-white/[0.04] flex items-center gap-4">
            <div className="w-9 h-9 bg-surface-700 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <div className="h-4 bg-surface-700 rounded w-40" />
              <div className="h-3 bg-surface-800 rounded w-28" />
            </div>
            <div className="h-3.5 bg-surface-800 rounded w-20" />
            <div className="h-3.5 bg-surface-800 rounded w-16" />
            <div className="h-7 w-16 bg-surface-800 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  )
}
