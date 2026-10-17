export default function CalendarLoading() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-8 w-36 bg-surface-800 rounded-xl" />
        <div className="flex gap-2">
          <div className="h-10 w-10 bg-surface-800 rounded-xl" />
          <div className="h-10 w-32 bg-surface-800 rounded-xl" />
          <div className="h-10 w-10 bg-surface-800 rounded-xl" />
          <div className="h-10 w-32 bg-surface-800 rounded-xl" />
        </div>
      </div>
      <div className="glass-card rounded-2xl p-5">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="h-4 bg-surface-800 rounded mx-auto w-6" />
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {[...Array(35)].map((_, i) => (
            <div key={i} className="h-20 bg-surface-800 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  )
}
