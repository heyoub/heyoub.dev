// Scene mood — @czap/quantizer driving the WebGL background from scroll.
//
// ONE definition (the sceneMood boundary + this output table) casts to two
// surfaces at once:
//   glsl → streamed into the Three.js scene as eased uniform values
//   css  → --czap-mood-* vars on <html> (the static-gradient fallback and any
//          CSS that wants to follow the scene's mood reads these)
// AnimatedQuantizer owns the crossing animation: 900ms easeInOutCubic, numeric
// outputs lerped per-frame at ~60fps. MotionTier gating is real — on devices
// whose motion tier is below `physics`, the glsl target is never produced and
// the same quantizer degrades to CSS-only. The orbs are literally an Effect
// program.
import { Q, AnimatedQuantizer } from '@czap/quantizer'
import { Millis, Easing, type MotionTier } from '@czap/core'
import { Effect, Stream, Fiber } from 'effect'
import { sceneMood } from './boundaries'
import { MOOD_GLSL as GLSL, MOOD_CSS as CSS } from '@/data/scene-moods'
import type { SceneMoodOutputs } from './scene3d'

const MOTION_TIERS: ReadonlySet<string> = new Set(['none', 'transitions', 'animations', 'physics', 'compute'])

declare global {
  // Written (frozen) by the @czap/astro detect script in <head>.
  var __CZAP_DETECT__: { tier?: string; motionTier?: string } | undefined

  interface Window {
    __CZAP_DETECT__?: { tier?: string; motionTier?: string }
  }
}

function currentMotionTier(): MotionTier {
  // The detect script publishes the resolved motion tier on the frozen
  // __CZAP_DETECT__ global (data-czap-motion is the reduced-motion preference,
  // not the tier). Default to physics — this module only loads on capability
  // tiers that already passed the scene gate.
  const detected = globalThis.__CZAP_DETECT__?.motionTier
  return (detected && MOTION_TIERS.has(detected) ? detected : 'physics') as MotionTier
}

export interface SceneMoodHandle {
  dispose(): void
}

/**
 * Boot the mood quantizer and stream eased outputs into the scene.
 * `applyGlsl` receives pre-interpolated numeric outputs every animation frame
 * during a boundary crossing — the scene just assigns uniforms.
 */
export function initSceneMood(applyGlsl: (outputs: SceneMoodOutputs) => void): SceneMoodHandle {
  const config = Q.from(sceneMood, { tier: currentMotionTier() }).outputs({ glsl: GLSL, css: CSS })

  let evaluateScroll: ((value: number) => void) | null = null

  const program = Effect.gen(function* () {
    const live = yield* config.create()
    const animated = yield* AnimatedQuantizer.make(
      live,
      { '*': { duration: Millis(900), easing: Easing.easeInOutCubic } },
      GLSL,
    )

    // glsl cast → eased uniforms, frame by frame
    yield* Effect.forkScoped(
      Stream.runForEach(animated.interpolated, (frame) =>
        Effect.sync(() => applyGlsl(frame.outputs as SceneMoodOutputs)),
      ),
    )

    // css cast → --czap-mood-* vars on <html> (tier-gated by the quantizer)
    yield* Effect.forkScoped(
      Stream.runForEach(live.outputChanges, (outputs) =>
        Effect.sync(() => {
          const css = outputs.css
          if (!css) return
          for (const [prop, value] of Object.entries(css)) {
            document.documentElement.style.setProperty(prop, String(value))
          }
        }),
      ),
    )

    evaluateScroll = (value) => live.evaluate(value)
    yield* Effect.never
  })

  const fiber = Effect.runFork(Effect.scoped(program))

  // Feed scroll progress (0–100) in. rAF-throttled; Lenis drives native
  // scroll so the plain scroll event is the right tap point.
  let rafPending = false
  const onScroll = (): void => {
    if (rafPending) return
    rafPending = true
    requestAnimationFrame(() => {
      rafPending = false
      const max = document.documentElement.scrollHeight - window.innerHeight
      evaluateScroll?.(max > 0 ? (window.scrollY / max) * 100 : 0)
    })
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()

  return {
    dispose() {
      window.removeEventListener('scroll', onScroll)
      Effect.runFork(Fiber.interrupt(fiber))
    },
  }
}
