'use client'
/**
 * ClassroomSim — an agent-based simulation, not a decorative particle loop.
 *
 * Every dot is a student with attention, curiosity and a social tie. Each
 * frame they steer through a curl-noise flow field ("the lesson"), drift
 * toward peers they're linked to, and lose or regain attention. Drop a
 * "prompt" (click) and a wave of renewed attention propagates outward.
 *
 * The readout under the canvas is computed from the actual simulation
 * state, so the numbers move because the model moves.
 */
import { useEffect, useRef, useState } from 'react'

type Student = {
  x: number; y: number
  vx: number; vy: number
  attention: number   // 0..1
  curiosity: number   // trait, fixed
  peer: number        // index of a linked classmate
  phase: number
}

const COUNT = 90

export default function ClassroomSim({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const [stats, setStats] = useState({ engaged: 0, avg: 0, clusters: 0 })

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    let W = 0, H = 0

    function resize() {
      if (!canvas) return
      W = canvas.clientWidth
      H = canvas.clientHeight
      canvas.width = Math.floor(W * dpr)
      canvas.height = Math.floor(H * dpr)
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    // --- seed the class -------------------------------------------------
    const students: Student[] = Array.from({ length: COUNT }, (_, i) => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: 0, vy: 0,
      attention: 0.35 + Math.random() * 0.5,
      curiosity: 0.3 + Math.random() * 0.7,
      peer: (i + 1 + Math.floor(Math.random() * 6)) % COUNT,
      phase: Math.random() * Math.PI * 2,
    }))

    // Prompt waves dropped by the user.
    const waves: { x: number; y: number; r: number; life: number }[] = []

    function onClick(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect()
      waves.push({ x: e.clientX - rect.left, y: e.clientY - rect.top, r: 0, life: 1 })
      if (waves.length > 4) waves.shift()
    }
    canvas.addEventListener('click', onClick)

    // Curl-ish flow field: cheap divergence-free-ish steering.
    function flow(x: number, y: number, t: number) {
      const s = 0.0042
      const a = Math.sin(x * s + t * 0.35) + Math.cos(y * s * 1.3 - t * 0.28)
      const b = Math.cos(x * s * 1.1 - t * 0.31) + Math.sin(y * s + t * 0.24)
      return { fx: Math.cos(a * 1.7), fy: Math.sin(b * 1.7) }
    }

    let raf = 0
    let visible = true
    let t = 0
    let statTick = 0

    function frame() {
      raf = requestAnimationFrame(frame)
      if (!visible) return
      t += reduced ? 0 : 0.016

      ctx!.clearRect(0, 0, W, H)

      // advance prompt waves
      for (let i = waves.length - 1; i >= 0; i--) {
        const w = waves[i]
        w.r += 3.4
        w.life -= 0.009
        if (w.life <= 0) waves.splice(i, 1)
      }

      // --- links first, so dots sit on top ------------------------------
      ctx!.lineWidth = 1
      for (let i = 0; i < COUNT; i++) {
        const s = students[i]
        const p = students[s.peer]
        const dx = p.x - s.x, dy = p.y - s.y
        const dist = Math.hypot(dx, dy)
        if (dist < 150) {
          const strength = (1 - dist / 150) * Math.min(s.attention, p.attention)
          if (strength > 0.06) {
            ctx!.strokeStyle = `rgba(221,154,51,${strength * 0.32})`
            ctx!.beginPath()
            ctx!.moveTo(s.x, s.y)
            ctx!.lineTo(p.x, p.y)
            ctx!.stroke()
          }
        }
      }

      // --- integrate + draw ---------------------------------------------
      let engagedCount = 0, attnSum = 0
      for (let i = 0; i < COUNT; i++) {
        const s = students[i]
        const { fx, fy } = flow(s.x, s.y, t)

        // steer along the lesson's flow, scaled by how curious they are
        s.vx += fx * 0.07 * (0.5 + s.curiosity * 0.5)
        s.vy += fy * 0.07 * (0.5 + s.curiosity * 0.5)

        // mild attraction to their linked peer — study groups form
        const p = students[s.peer]
        s.vx += (p.x - s.x) * 0.00035
        s.vy += (p.y - s.y) * 0.00035

        // Separation against a sparse sample of the class. Without this the
        // peer attraction collapses everyone into one blob; with it you get
        // distinct clusters, which is the behaviour worth showing.
        for (let k = i + 1; k < i + 9; k++) {
          const o = students[k % COUNT]
          const ox = s.x - o.x, oy = s.y - o.y
          const d2 = ox * ox + oy * oy
          if (d2 > 0.01 && d2 < 1600) {
            const f = (1 - d2 / 1600) * 0.05
            s.vx += ox * f
            s.vy += oy * f
          }
        }

        // Gentle pull back toward the room so nobody drifts to a corner.
        s.vx += (W / 2 - s.x) * 0.00012
        s.vy += (H / 2 - s.y) * 0.00012

        // attention decays; curiosity slows the decay
        s.attention -= 0.0016 * (1.25 - s.curiosity)

        // prompt waves re-engage anyone the ring passes over
        for (const w of waves) {
          const d = Math.abs(Math.hypot(s.x - w.x, s.y - w.y) - w.r)
          if (d < 26) s.attention = Math.min(1, s.attention + 0.055 * w.life)
        }
        s.attention = Math.max(0.05, Math.min(1, s.attention))

        s.vx *= 0.94
        s.vy *= 0.94
        s.x += s.vx
        s.y += s.vy

        // wrap
        if (s.x < -10) s.x = W + 10
        if (s.x > W + 10) s.x = -10
        if (s.y < -10) s.y = H + 10
        if (s.y > H + 10) s.y = -10

        const a = s.attention
        if (a > 0.55) engagedCount++
        attnSum += a

        // breathing radius keyed to attention
        const r = 1.6 + a * 3.1 + Math.sin(t * 2 + s.phase) * 0.35

        // glow for the highly engaged
        if (a > 0.62) {
          const g = ctx!.createRadialGradient(s.x, s.y, 0, s.x, s.y, r * 4.2)
          g.addColorStop(0, `rgba(232,173,75,${(a - 0.62) * 0.5})`)
          g.addColorStop(1, 'rgba(232,173,75,0)')
          ctx!.fillStyle = g
          ctx!.beginPath()
          ctx!.arc(s.x, s.y, r * 4.2, 0, Math.PI * 2)
          ctx!.fill()
        }

        // disengaged read as cool sage, engaged as marigold
        ctx!.fillStyle = a > 0.5
          ? `rgba(221,154,51,${0.45 + a * 0.55})`
          : `rgba(130,156,110,${0.3 + a * 0.5})`
        ctx!.beginPath()
        ctx!.arc(s.x, s.y, r, 0, Math.PI * 2)
        ctx!.fill()
      }

      // --- prompt rings ---------------------------------------------------
      for (const w of waves) {
        ctx!.strokeStyle = `rgba(221,154,51,${w.life * 0.4})`
        ctx!.lineWidth = 1.6
        ctx!.beginPath()
        ctx!.arc(w.x, w.y, w.r, 0, Math.PI * 2)
        ctx!.stroke()
      }

      // throttle React updates to ~6/sec; per-frame setState would thrash
      if (++statTick % 10 === 0) {
        const grouped = students.filter((s) => {
          const p = students[s.peer]
          return Math.hypot(p.x - s.x, p.y - s.y) < 90
        }).length
        setStats({
          engaged: Math.round((engagedCount / COUNT) * 100),
          avg: Math.round((attnSum / COUNT) * 100),
          clusters: Math.round(grouped / 3),
        })
      }
    }

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting }, { threshold: 0 })
    io.observe(canvas)
    window.addEventListener('resize', resize)
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('click', onClick)
    }
  }, [])

  return (
    <div className={className}>
      <div className="relative rounded-xl overflow-hidden border border-white/[0.09]" style={{ background: '#1e1a14' }}>
        <canvas ref={ref} className="block w-full h-[340px] cursor-crosshair" />
        <p className="absolute bottom-3 left-4 text-[11px] font-mono text-surface-500 pointer-events-none">
          click to pose a question
        </p>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-4">
        {[
          { k: 'Engaged now', v: `${stats.engaged}%` },
          { k: 'Mean attention', v: `${stats.avg}%` },
          { k: 'Study clusters', v: stats.clusters },
        ].map((s) => (
          <div key={s.k}>
            <div className="display text-2xl text-surface-50 tabular-nums">{s.v}</div>
            <div className="text-[11px] text-surface-500 mt-0.5">{s.k}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
