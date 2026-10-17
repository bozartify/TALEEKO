export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-white/[0.04] rounded-xl animate-pulse" />
          <div className="h-4 w-48 bg-white/[0.04] rounded-lg animate-pulse" />
        </div>
        <div className="h-10 w-32 bg-white/[0.04] rounded-xl animate-pulse" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 bg-white/[0.04] rounded-xl animate-pulse" />
              <div className="h-4 w-12 bg-white/[0.04] rounded-lg animate-pulse" />
            </div>
            <div className="h-7 w-16 bg-white/[0.04] rounded-lg animate-pulse" />
            <div className="h-3 w-24 bg-white/[0.04] rounded-md animate-pulse" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass-card p-6 space-y-4">
          <div className="h-5 w-40 bg-white/[0.04] rounded-lg animate-pulse" />
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-10 w-10 bg-white/[0.04] rounded-xl animate-pulse flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-white/[0.04] rounded-lg animate-pulse" />
                  <div className="h-3 w-1/2 bg-white/[0.04] rounded-md animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6 space-y-4">
          <div className="h-5 w-32 bg-white/[0.04] rounded-lg animate-pulse" />
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-8 w-8 bg-white/[0.04] rounded-lg animate-pulse flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 w-full bg-white/[0.04] rounded-md animate-pulse" />
                  <div className="h-3 w-2/3 bg-white/[0.04] rounded-md animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
