// Scene mood → the GPU shader cast, via the LiteShip quantizer.
//
// The sceneMood boundary quantizes scroll into four named moods. The
// AnimatedQuantizer eases the *mood* uniforms between those states (tier-gated:
// below the `physics` motion tier it degrades to CSS-only), and we stream the
// eased values onto the shader through czap:uniform-update. Easing the mood
// off the quantizer (rather than tracking raw scroll 1:1) keeps it stable —
// scroll jitter no longer jitters the orbs. The shader's own RAF loop animates
// the lava flow via u_time; the quantizer owns only the slow mood crossings.
//   • glsl  → u_* mood uniforms + u_state on the canvas (the shader)
//   • css   → --czap-mood-* vars on <html> (the gradient fallback)
//   • u_scroll → a light continuous parallax input, fed on scroll (disjoint
//     uniform, so it never fights the eased mood values)
import { Q, AnimatedQuantizer } from '@czap/quantizer'
import { Millis, Easing, type MotionTier } from '@czap/core'
import { Effect, Stream, Fiber } from 'effect'
import { sceneMood } from './boundaries'
import { MOOD_GLSL, MOOD_CSS, MOOD_STATES, type MoodState } from '@/data/scene-moods'

// u_-prefixed mood table to match the shader's uniform names.
const GLSL_U = Object.fromEntries(
  MOOD_STATES.map((s) => [s, Object.fromEntries(Object.entries(MOOD_GLSL[s]).map(([k, v]) => [`u_${k}`, v]))]),
) as Record<MoodState, Record<string, number>>

declare global {
  // Written (frozen) by the @czap/astro detect script in <head>.
  var __CZAP_DETECT__: { tier?: string; motionTier?: string } | undefined
}

const MOTION_TIERS: ReadonlySet<string> = new Set(['none', 'transitions', 'animations', 'physics', 'compute'])
function currentMotionTier(): MotionTier {
  const d = globalThis.__CZAP_DETECT__?.motionTier
  return (d && MOTION_TIERS.has(d) ? d : 'physics') as MotionTier
}
const stateNorm = (s: string): number => {
  const i = MOOD_STATES.indexOf(s as MoodState)
  return i < 0 ? 0 : i / (MOOD_STATES.length - 1)
}

export interface SceneMoodHandle {
  dispose(): void
}

export function initSceneMood(canvas: HTMLElement): SceneMoodHandle {
  const root = document.documentElement
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  let lastScroll = 0

  // Update only the uniform keys present — GL retains the rest, so the eased
  // mood (from the quantizer) and u_scroll (from the scroll handler) coexist.
  const dispatch = (glsl: Record<string, number>, wgsl: Record<string, number>): void => {
    canvas.dispatchEvent(
      new CustomEvent('czap:uniform-update', { bubbles: true, detail: { discrete: {}, css: {}, aria: {}, glsl, wgsl } }),
    )
  }

  if (reduce) {
    dispatch({ ...GLSL_U.arrival, u_state: 0, u_scroll: 0 }, { state_index: 0, emissive: GLSL_U.arrival.u_emissive, scroll: 0 })
    for (const [k, v] of Object.entries(MOOD_CSS.arrival)) root.style.setProperty(k, String(v))
    return { dispose() {} }
  }

  // .force('glsl') so the shader is fed even on the 'transitions' motion tier
  // (which otherwise emits css+aria only). The gpu directive already gates the
  // shader to reactive+ capability tiers; this just stops the quantizer from
  // dropping the mood uniforms once the shader IS live.
  const config = Q.from(sceneMood, { tier: currentMotionTier() }).force('glsl').outputs({ glsl: GLSL_U, css: MOOD_CSS })
  let evaluate: ((v: number) => void) | null = null

  const program = Effect.gen(function* () {
    const live = yield* config.create()
    // Mood crossings ease on a spring (0.2.1 Easing.spring) instead of plain
    // cubic — a gentle overshoot-and-settle gives the uniform shifts physical
    // life. Returns an (t)=>number curve, exactly what the quantizer samples.
    const animated = yield* AnimatedQuantizer.make(
      live,
      { '*': { duration: Millis(900), easing: Easing.spring({ stiffness: 160, damping: 20, mass: 1 }) } },
      GLSL_U,
    )

    // Eased mood uniforms → shader (the quantizer, mixed in).
    yield* Effect.forkScoped(
      Stream.runForEach(animated.interpolated, (frame) =>
        Effect.sync(() => {
          const out = frame.outputs as Record<string, number>
          dispatch(
            { ...out, u_state: stateNorm(frame.state) },
            { state_index: Math.round(stateNorm(frame.state) * (MOOD_STATES.length - 1)), emissive: out.u_emissive ?? 0, scroll: lastScroll },
          )
        }),
      ),
    )

    // CSS mood vars (tier-gated — present even when the glsl target is gated off).
    yield* Effect.forkScoped(
      Stream.runForEach(live.outputChanges, (outputs) =>
        Effect.sync(() => {
          const css = (outputs as { css?: Record<string, string | number> }).css
          if (!css) return
          for (const [k, v] of Object.entries(css)) root.style.setProperty(k, String(v))
        }),
      ),
    )

    evaluate = (v) => live.evaluate(v)
    yield* Effect.never
  })

  const fiber = Effect.runFork(Effect.scoped(program))

  // Seed the starting mood so the shader isn't stuck at the GLSL uniform default
  // (all 0 → faint) before the first scroll-driven transition. Re-push on a
  // couple of delays + on gpu-ready to cover the directive's async shader
  // compile (it may subscribe to czap:uniform-update after this first call).
  const seed = (): void =>
    dispatch(
      { ...GLSL_U.arrival, u_state: 0, u_scroll: lastScroll },
      { state_index: 0, emissive: GLSL_U.arrival.u_emissive, scroll: lastScroll },
    )
  seed()
  const seedTimers = [setTimeout(seed, 300), setTimeout(seed, 900)]
  canvas.addEventListener('czap:gpu-ready', seed)

  let pending = false
  const onScroll = (): void => {
    if (pending) return
    pending = true
    requestAnimationFrame(() => {
      pending = false
      const max = root.scrollHeight - window.innerHeight
      lastScroll = max > 0 ? window.scrollY / max : 0
      evaluate?.(lastScroll * 100) // boundary input is scroll.progress 0..100
      dispatch({ u_scroll: lastScroll }, { scroll: lastScroll })
    })
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  canvas.addEventListener('czap:gpu-ready', onScroll)
  onScroll()

  return {
    dispose() {
      window.removeEventListener('scroll', onScroll)
      canvas.removeEventListener('czap:gpu-ready', onScroll)
      canvas.removeEventListener('czap:gpu-ready', seed)
      seedTimers.forEach(clearTimeout)
      Effect.runFork(Fiber.interrupt(fiber))
    },
  }
}
