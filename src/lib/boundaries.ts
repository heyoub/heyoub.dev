import { Boundary } from '@czap/core'

// The hero composition regime — drives the satellite layout AND the GPU
// shader's u_state from one definition.
// `split` at 1024 matches the v2 `lg:` two-column switch exactly; `cinematic`
// at 1440 is room to enhance on very wide screens. Compiled to @container CSS
// (src/styles/layout.quantize.css) so it drives layout with zero first-paint shift, and
// also feeds the shader's u_state.
export const heroLayout = Boundary.make({
  input: 'viewport.width',
  at: [
    [0, 'stacked'],
    [1024, 'split'],
    [1440, 'cinematic'],
  ] as const,
  hysteresis: 40,
})

// The card-grid regime (thesis stats, services): one column on phones, three
// from the `md` breakpoint up. Compiled to @container CSS (src/styles/layout.quantize.css).
export const cardGrid = Boundary.make({
  input: 'viewport.width',
  at: [
    [0, 'one'],
    [768, 'triple'],
  ] as const,
  hysteresis: 32,
})

// The two-column split regime (the gallery's path / principle layout): one
// column on phones, two from 1024 up — the same threshold as the hero's
// `split`. Authored as a boundary (compiled to @container CSS via layout.quantize.css)
// rather than a hand-written `lg:` media query, so the gallery's layout is
// sourced from LiteShip like every other regime on the page.
export const splitLayout = Boundary.make({
  input: 'viewport.width',
  at: [
    [0, 'one'],
    [1024, 'two'],
  ] as const,
  hysteresis: 40,
})

// The scene-mood regime — quantizes scroll progress (0–100%) into the named
// moods the WebGL background moves through as you read the page. Fed through
// Q.from(sceneMood).outputs({ glsl, css }) + AnimatedQuantizer (scene-mood.ts),
// so one boundary drives shader uniforms AND CSS vars with eased crossings.
// The runtime serves scroll.progress live (0.5.0) and the continuous shader
// uniform rides it via driveUniformFromSignal; the scene chunk still feeds
// live.evaluate() only to drive the AnimatedQuantizer's eased MOOD crossings
// (the animated quantizer samples a curve, not a signal — so it's hand-fed).
export const sceneMood = Boundary.make({
  input: 'scroll.progress',
  at: [
    [0, 'arrival'], // hero — calm, luminous, grid barely there
    [0.18, 'thesis'], // the argument — orbs recede, grid sharpens
    [0.55, 'work'], // the proof — most kinetic the scene gets
    [0.85, 'sendoff'], // contact — settle back down, warmest glow
  ] as const,
  hysteresis: 0.05, // 0.3.0+: scroll.progress is 0..1 (was 0..100)
})
