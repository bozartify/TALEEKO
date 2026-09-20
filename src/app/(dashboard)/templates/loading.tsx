export default function TemplatesLoading() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-8 w-40 bg-surface-800 rounded-xl" />
        <div className="h-10 w-36 bg-surface-800 rounded-xl" />
      </div>
      <div className="glass-card rounded-2xl p-6 mb-6">
        <div className="flex items-start gap-6">
          <div className="w-16 h-16 bg-surface-700 rounded-2xl" />
          <div className="flex-1 space-y-2">
            <div className="h-6 w-64 bg-surface-700 rounded-lg" />
            <div className="h-4 w-96 bg-surface-800 rounded" />
            <div className="flex gap-2 pt-1">
              <div className="h-6 w-20 bg-surface-800 rounded-lg" />
              <div className="h-6 w-16 bg-surface-800 rounded-lg" />
            </div>
          </div>
          <div className="h-10 w-32 bg-surface-800 rounded-xl" />
        </div>
      </div>
      <div className="flex gap-2 mb-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-9 w-24 bg-surface-800 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="glass-card rounded-2xl p-5 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-surface-700 rounded-xl" />
              <div className="space-y-1 flex-1">
                <div className="h-4 bg-surface-700 rounded w-3/4" />
                <div className="h-3 bg-surface-800 rounded w-1/2" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="h-3 bg-surface-800 rounded w-full" />
              <div className="h-3 bg-surface-800 rounded w-4/5" />
            </div>
            <div className="h-9 bg-surface-800 rounded-xl w-full" />
          </div>
        ))}
      </div>
    </div>
  )
}
