import { Boundary } from '@czap/core'
// Single-sourced breakpoint thresholds (src/lib/breakpoints.js), shared with
// tailwind.config.ts so the md/lg pixels live in exactly one place. The `.js`
// extension is REQUIRED: the @czap/vite manifest collector imports this file via
// raw Node ESM (boundary-manifest.js), which can't resolve an extensionless
// relative import.
import { breakpoints as bp } from './breakpoints.js'

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
    [bp.lg, 'split'],
    [bp.xl, 'cinematic'],
  ] as const,
  hysteresis: 40,
})

// The card-grid regime (thesis stats, services): one column on phones, three
// from the `md` breakpoint up. Compiled to @container CSS (src/styles/layout.quantize.css).
export const cardGrid = Boundary.make({
  input: 'viewport.width',
  at: [
    [0, 'one'],
    [bp.md, 'triple'],
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
    [bp.lg, 'two'],
  ] as const,
  hysteresis: 40,
})

// The hero's tablet-chrome regime — everything in the hero that flips at the `md`
// (768) tablet threshold (section gap/padding + the whole scroll-cue cluster),
// held SEPARATE from heroLayout so heroLayout's state enum stays stacked/split/
// cinematic (it feeds the shader u_state contract). Same 768 as cardGrid, its own
// boundary so the hero chrome is sourced from LiteShip and switches in lockstep
// with @container width (not viewport). Compiled to @container CSS.
export const heroChrome = Boundary.make({
  input: 'viewport.width',
  at: [
    [0, 'compact'],
    [bp.md, 'expanded'],
  ] as const,
  hysteresis: 32,
})

// The editor-footer gutter regime (ContactDecompile) — below `md` the line-number
// gutter is hidden and the code sits flush; from 768 up the gutter appears and the
// code + status bar indent to clear it. The three declarations must switch
// ATOMICALLY on one crossing, so they live in a boundary (not three independent
// utilities that could flip a scrollbar-width apart). Compiled to @container CSS.
export const editorGutter = Boundary.make({
  input: 'viewport.width',
  at: [
    [0, 'flush'],
    [bp.md, 'gutter'],
  ] as const,
  hysteresis: 32,
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
