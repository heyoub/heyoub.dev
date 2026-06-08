import { Boundary } from '@czap/core'

// Signals carved into named experiences — not numbers. The rest of the
// system reads `stacked | split | cinematic`, never raw px.

/**
 * Hero composition regime. Drives layout AND (later) the shader `u_state`
 * and the scroll-scrubbed Timeline from one definition.
 *   stacked   — single column, portrait / mobile
 *   split     — two-up, the headshot earns its own lane
 *   cinematic — wide, the WebGL field opens up behind the type
 */
export const heroLayout = Boundary.make({
  input: 'viewport.width',
  at: [
    [0, 'stacked'],
    [760, 'split'],
    [1180, 'cinematic'],
  ] as const,
  // Half-width dead-zone: no flicker at 760.0001px while dragging the edge.
  hysteresis: 40,
})

/**
 * Site-wide reading density — chrome, rhythm, gutter.
 *   compact     — phone
 *   comfortable — tablet / small laptop
 *   editorial   — desktop, full measure
 */
export const siteLayout = Boundary.make({
  input: 'viewport.width',
  at: [
    [0, 'compact'],
    [720, 'comfortable'],
    [1280, 'editorial'],
  ] as const,
  hysteresis: 32,
})
