export default function Loading() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      <div className="h-8 w-64 rounded-xl bg-white/[0.06]" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="glass-card p-5 space-y-3">
            <div className="h-4 w-24 rounded-lg bg-white/[0.06]" />
            <div className="h-8 w-16 rounded-lg bg-white/[0.08]" />
          </div>
        ))}
      </div>
      <div className="glass-card p-6 space-y-4">
        <div className="h-5 w-48 rounded-lg bg-white/[0.06]" />
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 rounded-xl bg-white/[0.04]" />
          ))}
        </div>
      </div>
    </div>
  )
}
