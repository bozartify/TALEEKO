'use client'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, RotateCcw, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-6">
      <motion.div
        className="glass-card p-8 max-w-lg w-full text-center"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          className="w-14 h-14 rounded-2xl bg-danger-500/10 flex items-center justify-center mx-auto"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
        >
          <AlertTriangle className="w-7 h-7 text-danger-400" />
        </motion.div>

        <h2 className="text-xl font-semibold text-white mt-5">
          Dashboard Error
        </h2>
        <p className="text-surface-400 text-sm mt-2 leading-relaxed">
          Something went wrong while loading this section. Your data is safe.
        </p>

        {error.digest && (
          <p className="text-surface-600 text-xs mt-3 font-mono">
            Error ID: {error.digest}
          </p>
        )}

        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            onClick={reset}
            className="btn-primary"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>
          <Link href="/dashboard" className="btn-secondary">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
