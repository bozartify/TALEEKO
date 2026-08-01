'use client'
/**
 * HoursReclaimed — an animated area chart that draws itself once in view.
 *
 * Two series: hours spent on prep before TeachWeaver, and after. The gap
 * between them is the product's whole argument, so the gap is the thing
 * that gets filled and labelled — not the lines.
 *
 * Hand-built SVG with a path-length draw-on, an emphasized endpoint, and
 * a hover readout. No chart library.
 */
import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const WEEKS = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8']
const BEFORE = [12.5, 12.0, 13.2, 12.8, 12.2, 13.0, 12.6, 12.9]
const AFTER  = [12.1, 10.4, 8.6, 7.1, 6.0, 5.2, 4.6, 4.1]

const W = 620, H = 240, PAD_X = 34, PAD_Y = 22
const MAX = 14

const x = (i: number) => PAD_X + (i / (WEEKS.length - 1)) * (W - PAD_X * 2)
const y = (v: number) => PAD_Y + (1 - v / MAX) * (H - PAD_Y * 2)

const line = (d: number[]) => d.map((v, i) => `${i ? 'L' : 'M'}${x(i)},${y(v)}`).join(' ')
const band = () =>
  `${BEFORE.map((v, i) => `${i ? 'L' : 'M'}${x(i)},${y(v)}`).join(' ')} ` +
  `${[...AFTER].reverse().map((v, i) => `L${x(AFTER.length - 1 - i)},${y(v)}`).join(' ')} Z`

export default function HoursReclaimed({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [hover, setHover] = useState<number | null>(null)

  const saved = (BEFORE[BEFORE.length - 1] - AFTER[AFTER.length - 1]).toFixed(1)
  const idx = hover ?? WEEKS.length - 1

  return (
    <div ref={ref} className={className}>
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-accent-400 mb-1.5">Prep hours per week</p>
          <p className="display text-3xl text-surface-50 tabular-nums">
            {(BEFORE[idx] - AFTER[idx]).toFixed(1)}h<span className="text-lg text-surface-400"> reclaimed</span>
          </p>
        </div>
        <div className="text-right text-xs text-surface-500">
          <div className="flex items-center gap-2 justify-end mb-1">
            <span className="w-3 h-px" style={{ background: '#94856f' }} /> before
          </div>
          <div className="flex items-center gap-2 justify-end">
            <span className="w-3 h-px" style={{ background: '#dd9a33' }} /> with TeachWeaver
          </div>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto overflow-visible"
        role="img"
        aria-label={`Weekly prep hours fall from ${BEFORE[0]} to ${AFTER[AFTER.length - 1]} hours, reclaiming ${saved} hours a week.`}
        onPointerLeave={() => setHover(null)}
      >
        {/* faint grid */}
        {[0, 3.5, 7, 10.5, 14].map((v) => (
          <g key={v}>
            <line x1={PAD_X} x2={W - PAD_X} y1={y(v)} y2={y(v)} stroke="rgba(240,224,197,0.07)" strokeWidth="1" />
            <text x={PAD_X - 9} y={y(v) + 3.5} textAnchor="end" fontSize="9" fill="#6f6150" fontFamily="ui-monospace, monospace">{v}</text>
          </g>
        ))}

        {/* the saved-hours band — the actual story */}
        <motion.path
          d={band()}
          fill="rgba(221,154,51,0.13)"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.75, duration: 0.7 }}
        />

        {/* before */}
        <motion.path
          d={line(BEFORE)}
          fill="none" stroke="#94856f" strokeWidth="1.6" strokeDasharray="4 4"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : {}}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* after */}
        <motion.path
          d={line(AFTER)}
          fill="none" stroke="#dd9a33" strokeWidth="2.4" strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : {}}
          transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1], delay: 0.18 }}
        />

        {/* hover targets + points */}
        {WEEKS.map((wk, i) => (
          <g key={wk}>
            <rect
              x={x(i) - 20} y={0} width={40} height={H} fill="transparent"
              onPointerEnter={() => setHover(i)} style={{ cursor: 'crosshair' }}
            />
            {hover === i && (
              <line x1={x(i)} x2={x(i)} y1={PAD_Y} y2={H - PAD_Y} stroke="rgba(240,224,197,0.18)" strokeWidth="1" />
            )}
            <text x={x(i)} y={H - 4} textAnchor="middle" fontSize="9"
                  fill={hover === i ? '#ddd0bd' : '#6f6150'} fontFamily="ui-monospace, monospace">{wk}</text>
          </g>
        ))}

        {/* emphasized endpoint */}
        <motion.circle
          cx={x(AFTER.length - 1)} cy={y(AFTER[AFTER.length - 1])} r="4.5"
          fill="#dd9a33" stroke="#17140f" strokeWidth="2"
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ delay: 1.25, type: 'spring', stiffness: 400, damping: 18 }}
        />
        {hover !== null && (
          <>
            <circle cx={x(hover)} cy={y(AFTER[hover])} r="3.5" fill="#e8ad4b" />
            <circle cx={x(hover)} cy={y(BEFORE[hover])} r="3" fill="#94856f" />
          </>
        )}
      </svg>
    </div>
  )
}
