'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  color: string
  trend?: {
    value: number
    label: string
  }
  subtitle?: string
}

function AnimatedNumber({ target }: { target: number }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const duration = 800
    const start = performance.now()
    let raf: number

    function tick(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(eased * target))
      if (progress < 1) raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target])

  return <>{display}</>
}

export function StatCard({ title, value, icon: Icon, color, trend, subtitle }: StatCardProps) {
  const numericValue = typeof value === 'number' ? value : parseFloat(value)
  const isNumeric = !isNaN(numericValue) && typeof value === 'number'
  const suffix = typeof value === 'string' ? value.replace(/[\d.,]+/, '') : ''

  return (
    <motion.div
      className="glass-card p-5"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
        {trend && (
          <div
            className={`flex items-center gap-0.5 text-xs font-medium ${
              trend.value >= 0 ? 'text-success-400' : 'text-danger-400'
            }`}
          >
            {trend.value >= 0 ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5" />
            )}
            <span>{trend.value >= 0 ? '+' : ''}{trend.value}%</span>
          </div>
        )}
      </div>
      <p className="text-xs text-surface-400 mb-1">{title}</p>
      <p className="text-2xl font-black text-white">
        {isNumeric ? (
          <>
            <AnimatedNumber target={numericValue} />
            {suffix}
          </>
        ) : (
          value
        )}
      </p>
      {trend && (
        <p className="text-[10px] text-surface-500 mt-1">{trend.label}</p>
      )}
      {subtitle && (
        <p className="text-[10px] text-surface-500 mt-1">{subtitle}</p>
      )}
    </motion.div>
  )
}
