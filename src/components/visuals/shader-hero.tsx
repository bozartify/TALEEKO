'use client'
/**
 * ShaderHero — raw WebGL2 volumetric "woven light" field.
 *
 * No 3D library: a single fullscreen triangle running a custom fragment
 * shader. The scene is a raymarched slab of domain-warped FBM noise, lit
 * as if threads of marigold light were being woven in dark air — the
 * literal metaphor of the product name.
 *
 * Craft notes:
 *  - Renders at min(dpr, 2) and pauses entirely when scrolled offscreen.
 *  - Honors prefers-reduced-motion by drawing one static frame.
 *  - Ordered dithering kills the banding you'd otherwise get across a
 *    large dark gradient.
 */
import { useEffect, useRef } from 'react'

const VERT = `#version 300 es
precision highp float;
out vec2 vUv;
void main() {
  // Fullscreen triangle — cheaper than a quad, no seam down the middle.
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  vUv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`

const FRAG = `#version 300 es
precision highp float;

in vec2 vUv;
out vec4 outColor;

uniform vec2  uRes;
uniform float uTime;
uniform vec2  uMouse;     // eased, -1..1
uniform float uIntensity;

// --- hash / value noise ------------------------------------------------
float hash(vec3 p) {
  p = fract(p * 0.3183099 + vec3(0.71, 0.113, 0.419));
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float vnoise(vec3 x) {
  vec3 i = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);          // smoothstep interpolant
  return mix(
    mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
        mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
    mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
        mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
    f.z);
}

// Fractional Brownian motion. Octave count is a template parameter in
// spirit: the warp only needs 2, the body 3. Paying for 5 everywhere was
// ~4000 hash evaluations per pixel and tanked software renderers.
float fbm2(vec3 p) {
  const mat3 rot = mat3( 0.00, 0.80, 0.60,
                        -0.80, 0.36,-0.48,
                        -0.60,-0.48, 0.64);
  float sum = 0.5 * vnoise(p);
  p = rot * p * 2.02;
  sum += 0.25 * vnoise(p);
  return sum;
}

float fbm3(vec3 p) {
  const mat3 rot = mat3( 0.00, 0.80, 0.60,
                        -0.80, 0.36,-0.48,
                        -0.60,-0.48, 0.64);
  float sum = 0.5 * vnoise(p);
  p = rot * p * 2.02; sum += 0.25  * vnoise(p);
  p = rot * p * 2.02; sum += 0.125 * vnoise(p);
  return sum;
}

// --- the weave ---------------------------------------------------------
// Two counter-running thread systems, warped through each other. The
// warp is what makes it read as "woven" rather than as generic fog.
// One vector warp (not three) is enough once the sine interference sits
// on top of it — the extra two were invisible and cost 2/3 of the frame.
float weave(vec3 p) {
  float t = uTime * 0.055;

  float w = fbm2(p * 0.9 + vec3(0.0, t, 0.0));
  p += (w - 0.5) * 1.9;

  // Two rotated filament systems. pow(1 - |sin|) turns each sine field
  // into thin bright lines instead of a soft wave, so the crossings read
  // as threads rather than fog.
  float a = 1.0 - abs(sin(p.x * 3.1 + p.z * 0.8 + t * 2.0));
  float b = 1.0 - abs(sin(p.y * 3.4 - p.z * 0.6 - t * 1.6));
  float filaments = pow(a, 6.0) + pow(b, 6.0);

  float body = fbm3(p * 1.15 + vec3(0.0, t * 1.4, 0.0));
  // Body gates the filaments so threads only glow inside the cloud.
  return smoothstep(0.30, 0.85, body * 0.85 + filaments * body * 0.9);
}

void main() {
  vec2 uv = vUv;
  vec2 p  = (uv * 2.0 - 1.0);
  p.x *= uRes.x / uRes.y;

  // Camera drifts gently with the pointer — parallax, never a snap.
  vec3 ro = vec3(uMouse.x * 0.34, uMouse.y * 0.2, -2.6);
  vec3 rd = normalize(vec3(p, 1.6));

  // Raymarch a bounded slab. 14 steps with a larger stride reads the same
  // as 26 once the depth falloff is applied, at roughly half the cost.
  float density = 0.0;
  float t = 0.9;
  for (int i = 0; i < 14; i++) {
    vec3 pos = ro + rd * t;
    float d = weave(pos);
    // Fade the contribution with depth so the far field stays quiet.
    density += d * (1.0 - smoothstep(1.4, 5.2, t)) * 0.105;
    t += 0.31;
  }
  density = clamp(density * uIntensity, 0.0, 1.0);

  // --- palette: warm charcoal ground → marigold core -------------------
  vec3 ground   = vec3(0.090, 0.078, 0.059);   // #17140f
  vec3 ember    = vec3(0.404, 0.243, 0.102);   // deep clay
  vec3 marigold = vec3(0.867, 0.604, 0.200);   // #dd9a33
  vec3 hot      = vec3(0.960, 0.800, 0.470);   // filament highlight

  vec3 col = ground;
  col = mix(col, ember,    smoothstep(0.02, 0.42, density));
  col = mix(col, marigold, smoothstep(0.34, 0.78, density));
  col = mix(col, hot,      smoothstep(0.74, 0.98, density));

  // Vignette keeps the eye on the headline sitting over this.
  float vig = 1.0 - 0.5 * dot(p * 0.55, p * 0.55);
  col *= clamp(vig, 0.0, 1.0);

  // Ordered dithering — removes banding across the dark falloff.
  float dither = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
  col += (dither - 0.5) / 255.0;

  outColor = vec4(col, 1.0);
}`

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!
  gl.shaderSource(s, src)
  gl.compileShader(s)
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(s))
    gl.deleteShader(s)
    return null
  }
  return s
}

export default function ShaderHero({ className = '', intensity = 1 }: { className?: string; intensity?: number }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const gl = canvas.getContext('webgl2', { antialias: false, alpha: false, powerPreference: 'high-performance' })
    if (!gl) return // Graceful: the CSS gradient underneath stays visible.

    const vs = compile(gl, gl.VERTEX_SHADER, VERT)
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG)
    if (!vs || !fs) return

    const prog = gl.createProgram()!
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(prog))
      return
    }
    gl.useProgram(prog)

    const uRes = gl.getUniformLocation(prog, 'uRes')
    const uTime = gl.getUniformLocation(prog, 'uTime')
    const uMouse = gl.getUniformLocation(prog, 'uMouse')
    const uInt = gl.getUniformLocation(prog, 'uIntensity')
    gl.uniform1f(uInt, intensity)

    const vao = gl.createVertexArray()
    gl.bindVertexArray(vao)

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // Volumetric noise carries no hard edges, so rendering below native
    // resolution and letting the browser upscale is free quality.
    const SCALE = 0.85
    let dpr = Math.min(window.devicePixelRatio || 1, 1.5) * SCALE

    function resize() {
      if (!canvas) return
      const w = Math.floor(canvas.clientWidth * dpr)
      const h = Math.floor(canvas.clientHeight * dpr)
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
        gl!.viewport(0, 0, w, h)
      }
      gl!.uniform2f(uRes, canvas.width, canvas.height)
    }

    // Pointer target vs. eased actual — the easing is what makes the
    // parallax feel like a camera rather than a cursor readout.
    const target = { x: 0, y: 0 }
    const eased = { x: 0, y: 0 }
    function onMove(e: PointerEvent) {
      target.x = (e.clientX / window.innerWidth) * 2 - 1
      target.y = 1 - (e.clientY / window.innerHeight) * 2
    }

    let raf = 0
    let visible = true
    const start = performance.now()

    // Adaptive quality: machines without a real GPU (or with a loaded one)
    // fall back rather than shipping a 3fps hero. First we halve the
    // resolution; if that still isn't enough, we settle on a static frame.
    let frames = 0
    let probeStart = performance.now()
    let degraded = 0

    function frame(now: number) {
      raf = requestAnimationFrame(frame)
      if (!visible) {
        probeStart = now
        frames = 0
        return
      }
      resize()
      eased.x += (target.x - eased.x) * 0.045
      eased.y += (target.y - eased.y) * 0.045
      gl!.uniform2f(uMouse, eased.x, eased.y)
      gl!.uniform1f(uTime, reduced ? 8.0 : (now - start) / 1000)
      gl!.drawArrays(gl!.TRIANGLES, 0, 3)
      if (reduced) { cancelAnimationFrame(raf); return } // one static frame is enough

      frames++
      const elapsed = now - probeStart
      if (elapsed > 1400) {
        const fps = (frames / elapsed) * 1000
        if (fps < 24 && degraded < 2) {
          degraded++
          if (degraded === 1) {
            dpr *= 0.6            // cheaper pass
          } else {
            cancelAnimationFrame(raf) // hold the last frame; still looks good
            return
          }
        }
        frames = 0
        probeStart = now
      }
    }

    const io = new IntersectionObserver(
      ([entry]) => { visible = entry.isIntersecting },
      { threshold: 0 }
    )
    io.observe(canvas)

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('resize', resize)
    resize()
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('resize', resize)
      gl.deleteProgram(prog)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
      gl.deleteVertexArray(vao)
    }
  }, [intensity])

  return <canvas ref={ref} className={className} aria-hidden="true" />
}
