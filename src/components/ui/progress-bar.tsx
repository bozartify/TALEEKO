'use client'
import { motion } from 'framer-motion'

interface ProgressBarProps {
  value: number
  color?: string
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  animate?: boolean
}

const sizeMap = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
}

export function ProgressBar({
  value,
  color = 'bg-accent-500',
  size = 'md',
  showLabel = false,
  animate = false,
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value))

  return (
    <div className="flex items-center gap-2">
      <div className={`flex-1 bg-white/[0.06] rounded-full overflow-hidden ${sizeMap[size]}`}>
        {animate ? (
          <motion.div
            className={`${color} rounded-full h-full`}
            initial={{ width: 0 }}
            animate={{ width: `${clampedValue}%` }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
        ) : (
          <div
            className={`${color} rounded-full h-full`}
            style={{ width: `${clampedValue}%` }}
          />
        )}
      </div>
      {showLabel && (
        <span className="text-xs text-surface-400 tabular-nums font-medium">
          {Math.round(clampedValue)}%
        </span>
      )}
    </div>
  )
}
