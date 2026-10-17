export default function GradebookLoading() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-8 w-36 bg-surface-800 rounded-xl" />
        <div className="flex gap-2">
          <div className="h-10 w-44 bg-surface-800 rounded-xl" />
          <div className="h-10 w-28 bg-surface-800 rounded-xl" />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-card rounded-xl p-4 space-y-1.5">
            <div className="h-3.5 w-20 bg-surface-700 rounded" />
            <div className="h-7 w-12 bg-surface-700 rounded-lg" />
          </div>
        ))}
      </div>
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="p-4 flex gap-4 border-b border-white/[0.06]">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-4 bg-surface-700 rounded flex-1" />
          ))}
        </div>
        {[...Array(7)].map((_, i) => (
          <div key={i} className="p-4 border-b border-white/[0.04] flex gap-4">
            <div className="w-8 h-8 bg-surface-700 rounded-full" />
            <div className="h-4 bg-surface-700 rounded flex-1" />
            {[...Array(4)].map((_, j) => (
              <div key={j} className="h-8 w-12 bg-surface-800 rounded-lg" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
