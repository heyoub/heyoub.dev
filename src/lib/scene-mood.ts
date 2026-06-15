// Scene mood → the GPU shader cast, on the RAF spine.
//
// The sceneMood boundary quantizes scroll into four named moods; this bridges
// scroll → the live shader's uniforms. Unlike the old AnimatedQuantizer path
// (which eased over 900ms on a fixed ~16ms Effect.sleep AFTER a discrete
// crossing), the mood now tracks scroll position *continuously*: a passive,
// rAF-coalesced scroll listener blends the two bracketing moods and dispatches
// `czap:uniform-update` to the canvas — the client:gpu runtime binds detail.glsl
// every frame, and the shader's own RAF loop animates u_time. Scroll-linked, so
// it never lags and never over-runs. The same blend also casts --czap-mood-*
// CSS vars (the gradient fallback on tiers where the shader is gated off).
import { sceneMood } from './boundaries'
import { MOOD_GLSL, MOOD_CSS, MOOD_STATES } from '@/data/scene-moods'

// sceneMood scroll.progress stops: arrival 0, thesis 18, work 55, sendoff 85.
const STOPS = sceneMood.thresholds as readonly number[]
const UNIFORM_KEYS = ['distortAmp', 'rotSpeed', 'orbOpacity', 'emissive', 'gridOpacity'] as const

const lerp = (a: number, b: number, t: number): number => a + (b - a) * t

/** Blend the two moods bracketing scroll progress `p` (0..100). */
function blendAt(p: number): {
  glsl: Record<string, number>
  css: Record<string, number>
  stateNorm: number
} {
  let i = 0
  while (i < STOPS.length - 1 && p >= STOPS[i + 1]) i++
  const lo = MOOD_STATES[i]
  const hi = MOOD_STATES[Math.min(i + 1, MOOD_STATES.length - 1)]
  const span = (STOPS[i + 1] ?? 100) - STOPS[i]
  const t = span > 0 ? Math.min(1, Math.max(0, (p - STOPS[i]) / span)) : 0

  const glsl: Record<string, number> = {}
  for (const k of UNIFORM_KEYS) glsl['u_' + k] = lerp(MOOD_GLSL[lo][k], MOOD_GLSL[hi][k], t)

  const css: Record<string, number> = {}
  for (const k of Object.keys(MOOD_CSS[lo])) {
    css[k] = lerp(MOOD_CSS[lo][k] as number, MOOD_CSS[hi][k] as number, t)
  }
  return { glsl, css, stateNorm: (i + t) / (MOOD_STATES.length - 1) }
}

export interface SceneMoodHandle {
  dispose(): void
}

/**
 * Wire scroll → shader uniforms + CSS mood vars. `canvas` is the client:gpu
 * element; `czap:uniform-update` events on it drive the shader. Returns a
 * disposer (removes the listener). On reduced-motion the shader is parked and
 * we just set the calm `arrival` mood once for the CSS gradient.
 */
export function initSceneMood(canvas: HTMLElement): SceneMoodHandle {
  const root = document.documentElement
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // WGSL has no auto u_time/u_resolution, so that path streams `time` through
  // the 4-slot struct each frame; the GLSL path only needs to update on scroll
  // (the shader's own RAF loop animates via the auto u_time uniform).
  const isWgsl = (canvas.getAttribute('data-czap-shader-type') ?? 'glsl') === 'wgsl'
  const progress = (): number => {
    const max = root.scrollHeight - window.innerHeight
    return max > 0 ? (window.scrollY / max) * 100 : 0
  }

  const apply = (p: number, timeSec: number): void => {
    const { glsl, css, stateNorm } = blendAt(p)
    canvas.dispatchEvent(
      new CustomEvent('czap:uniform-update', {
        bubbles: true,
        detail: {
          discrete: {},
          aria: {},
          css,
          glsl: { ...glsl, u_state: stateNorm, u_scroll: p / 100 },
          // WGSL mirror — 4-slot uniform buffer; see scene.wgsl.
          wgsl: {
            state_index: Math.round(stateNorm * (MOOD_STATES.length - 1)),
            emissive: glsl.u_emissive,
            scroll: p / 100,
            time: timeSec,
          },
        },
      }),
    )
    for (const [k, v] of Object.entries(css)) root.style.setProperty(k, String(v))
  }

  if (reduce) {
    apply(0, 0)
    return { dispose() {} }
  }

  const start = performance.now()

  if (isWgsl) {
    // Continuous RAF: feed time + current scroll every frame. Pause when hidden.
    let raf = 0
    let running = true
    const loop = (): void => {
      if (!running) return
      apply(progress(), (performance.now() - start) / 1000)
      raf = requestAnimationFrame(loop)
    }
    const onVisibility = (): void => {
      if (document.hidden) {
        running = false
        cancelAnimationFrame(raf)
      } else if (!running) {
        running = true
        raf = requestAnimationFrame(loop)
      }
    }
    document.addEventListener('visibilitychange', onVisibility)
    raf = requestAnimationFrame(loop)
    return {
      dispose() {
        running = false
        cancelAnimationFrame(raf)
        document.removeEventListener('visibilitychange', onVisibility)
      },
    }
  }

  // GLSL path: rAF-coalesced scroll updates (time is the shader's auto uniform).
  let pending = false
  const onScroll = (): void => {
    if (pending) return
    pending = true
    requestAnimationFrame(() => {
      pending = false
      apply(progress(), 0)
    })
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  // Re-push the current mood once the shader program is live (covers the
  // async compile race so the first paint isn't the u_state=0 default).
  canvas.addEventListener('czap:gpu-ready', onScroll)
  onScroll()

  return {
    dispose() {
      window.removeEventListener('scroll', onScroll)
      canvas.removeEventListener('czap:gpu-ready', onScroll)
    },
  }
}
