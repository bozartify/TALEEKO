'use client'
/**
 * TiltCard — real 3D perspective on hover.
 *
 * The card rotates in X/Y toward the pointer with spring physics, its
 * children lift on the Z axis (so they parallax against the card face),
 * and a specular sheen tracks the pointer as if a light were above the
 * surface. Everything runs on transforms, so it never triggers layout.
 */
import { useRef, ReactNode } from 'react'
import { motion, useMotionValue, useSpring, useTransform, MotionValue } from 'framer-motion'

type Props = {
  children: ReactNode
  className?: string
  /** Max rotation in degrees. Keep this low; past ~12 it reads as a gimmick. */
  max?: number
  /** How far the content floats above the card face, in px. */
  lift?: number
}

export default function TiltCard({ children, className = '', max = 9, lift = 26 }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  // Normalized pointer position over the card, -0.5..0.5
  const px = useMotionValue(0)
  const py = useMotionValue(0)

  const spring = { stiffness: 260, damping: 26, mass: 0.6 }
  const sx = useSpring(px, spring)
  const sy = useSpring(py, spring)

  const rotateX = useTransform(sy, [-0.5, 0.5], [max, -max])
  const rotateY = useTransform(sx, [-0.5, 0.5], [-max, max])

  // Sheen follows the pointer, opposite the tilt — reads as a fixed light.
  const sheenX = useTransform(sx, [-0.5, 0.5], ['15%', '85%'])
  const sheenY = useTransform(sy, [-0.5, 0.5], ['10%', '90%'])
  const sheen = useTransform(
    [sheenX, sheenY] as [MotionValue<string>, MotionValue<string>],
    ([x, y]: string[]) =>
      `radial-gradient(340px circle at ${x} ${y}, rgba(232,173,75,0.16), transparent 62%)`
  )

  function onMove(e: React.PointerEvent) {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width - 0.5)
    py.set((e.clientY - r.top) / r.height - 0.5)
  }
  function onLeave() {
    px.set(0)
    py.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ perspective: 900 }}
      className={className}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative h-full rounded-xl"
      >
        {/* sheen sits above the surface but below the content */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-xl z-10"
          style={{ background: sheen }}
        />
        <div style={{ transform: `translateZ(${lift}px)`, transformStyle: 'preserve-3d' }} className="relative z-20 h-full">
          {children}
        </div>
      </motion.div>
    </motion.div>
  )
}
