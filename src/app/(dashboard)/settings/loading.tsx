export default function SettingsLoading() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      <div className="h-8 w-36 bg-surface-800 rounded-xl" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-2">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="h-10 bg-surface-800 rounded-xl" />
          ))}
        </div>
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 space-y-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="h-5 w-32 bg-surface-700 rounded" />
              <div className="space-y-2">
                {[...Array(2)].map((_, j) => (
                  <div key={j} className="flex items-center justify-between p-3 bg-surface-800/40 rounded-xl">
                    <div className="space-y-1">
                      <div className="h-4 w-32 bg-surface-700 rounded" />
                      <div className="h-3 w-48 bg-surface-800 rounded" />
                    </div>
                    <div className="w-12 h-6 bg-surface-700 rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
