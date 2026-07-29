'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${60 + i * 40}px`,
              height: `${60 + i * 40}px`,
              left: `${15 + i * 14}%`,
              top: `${20 + (i % 3) * 25}%`,
              background: `rgba(99, 102, 241, ${0.03 + i * 0.008})`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="text-[120px] sm:text-[160px] font-black leading-none text-gradient">
            404
          </h1>
        </motion.div>

        <motion.p
          className="text-xl sm:text-2xl text-surface-300 mt-4 font-medium"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Page not found
        </motion.p>

        <motion.p
          className="text-surface-500 mt-2 max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          The page you are looking for does not exist or has been moved.
        </motion.p>

        <motion.div
          className="flex items-center justify-center gap-3 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Link href="/dashboard" className="btn-gradient">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <Link href="/" className="btn-secondary">
            <Home className="w-4 h-4" />
            Go Home
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
