export default function AnalyticsLoading() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-8 w-40 bg-surface-800 rounded-xl" />
        <div className="flex gap-2">
          <div className="h-10 w-32 bg-surface-800 rounded-xl" />
          <div className="h-10 w-28 bg-surface-800 rounded-xl" />
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-card rounded-2xl p-5 space-y-3">
            <div className="h-4 w-24 bg-surface-700 rounded" />
            <div className="h-10 w-16 bg-surface-700 rounded-lg" />
            <div className="h-2 bg-surface-800 rounded-full" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-5 space-y-3">
          <div className="h-5 w-36 bg-surface-700 rounded-lg" />
          <div className="h-48 bg-surface-800/60 rounded-xl" />
        </div>
        <div className="glass-card rounded-2xl p-5 space-y-3">
          <div className="h-5 w-32 bg-surface-700 rounded-lg" />
          <div className="h-48 bg-surface-800/60 rounded-xl" />
        </div>
      </div>
    </div>
  )
}
