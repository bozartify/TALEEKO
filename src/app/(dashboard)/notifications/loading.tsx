export default function NotificationsLoading() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-8 w-44 bg-surface-800 rounded-xl" />
        <div className="h-10 w-32 bg-surface-800 rounded-xl" />
      </div>
      <div className="flex gap-2 mb-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-9 w-24 bg-surface-800 rounded-xl" />
        ))}
      </div>
      <div className="space-y-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="glass-card rounded-2xl p-4 flex items-start gap-4">
            <div className="w-10 h-10 bg-surface-700 rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-surface-700 rounded w-3/4" />
              <div className="h-3 bg-surface-800 rounded w-1/2" />
            </div>
            <div className="h-6 w-16 bg-surface-800 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  )
}
