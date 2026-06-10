import { Boundary } from '@czap/core'

// The hero composition regime — drives the satellite layout AND the GPU
// shader's u_state from one definition.
// `split` at 1024 matches the v2 `lg:` two-column switch exactly; `cinematic`
// at 1440 is room to enhance on very wide screens. Compiled to @container CSS
// (HeroGridStyle.astro) so it drives layout with zero first-paint shift, and
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
// from the `md` breakpoint up. Compiled to @container CSS (LayoutStyles).
export const cardGrid = Boundary.make({
  input: 'viewport.width',
  at: [
    [0, 'one'],
    [768, 'triple'],
  ] as const,
  hysteresis: 32,
})

// The scene-mood regime — quantizes scroll progress (0–100%) into the named
// moods the WebGL background moves through as you read the page. Fed through
// Q.from(sceneMood).outputs({ glsl, css }) + AnimatedQuantizer (scene-mood.ts),
// so one boundary drives shader uniforms AND CSS vars with eased crossings.
// The directive runtime can't read scroll signals itself (viewport.* only),
// so the scene chunk feeds live.evaluate() — quantizer is signal-agnostic.
export const sceneMood = Boundary.make({
  input: 'scroll.progress',
  at: [
    [0, 'arrival'], // hero — calm, luminous, grid barely there
    [18, 'thesis'], // the argument — orbs recede, grid sharpens
    [55, 'work'], // the proof — most kinetic the scene gets
    [85, 'sendoff'], // contact — settle back down, warmest glow
  ] as const,
  hysteresis: 5,
})
