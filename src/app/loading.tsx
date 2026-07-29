export default function RootLoading() {
  return (
    <div className="min-h-screen bg-surface-950 flex flex-col items-center justify-center">
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-500 to-electric-400 flex items-center justify-center animate-pulse">
          <svg
            className="w-8 h-8 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
          </svg>
        </div>
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent-500 to-electric-400 animate-ping opacity-20" />
      </div>
      <p className="mt-6 text-surface-400 text-sm font-medium animate-pulse">
        TeachWeaver
      </p>
    </div>
  )
}
