export default function CoursesLoading() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-8 w-36 bg-surface-800 rounded-xl" />
        <div className="flex gap-2">
          <div className="h-10 w-28 bg-surface-800 rounded-xl" />
          <div className="h-10 w-32 bg-surface-800 rounded-xl" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="glass-card rounded-2xl overflow-hidden">
            <div className="h-28 bg-surface-800" />
            <div className="p-5 space-y-3">
              <div className="h-5 bg-surface-700 rounded w-3/4" />
              <div className="h-3 bg-surface-800 rounded w-full" />
              <div className="h-3 bg-surface-800 rounded w-2/3" />
              <div className="flex gap-2 pt-1">
                <div className="h-7 w-24 bg-surface-800 rounded-lg" />
                <div className="h-7 w-16 bg-surface-800 rounded-lg" />
                <div className="h-7 w-8 bg-surface-800 rounded-lg ml-auto" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
