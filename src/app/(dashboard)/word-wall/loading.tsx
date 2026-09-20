export default function WordWallLoading() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-8 w-36 bg-surface-800 rounded-xl" />
        <div className="flex gap-2">
          <div className="h-10 w-28 bg-surface-800 rounded-xl" />
          <div className="h-10 w-28 bg-surface-800 rounded-xl" />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="h-10 flex-1 bg-surface-800 rounded-xl" />
        <div className="h-10 w-36 bg-surface-800 rounded-xl" />
      </div>
      <div className="flex flex-wrap gap-3">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="h-10 bg-surface-800 rounded-xl"
            style={{ width: `${60 + (i % 5) * 20}px` }}
          />
        ))}
      </div>
    </div>
  )
}
