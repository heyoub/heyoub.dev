import { Boundary } from '@czap/core'

// The hero composition regime — drives the satellite layout AND the GPU
// shader's u_state from one definition.
export const heroLayout = Boundary.make({
  input: 'viewport.width',
  at: [
    [0, 'stacked'],
    [768, 'split'],
    [1180, 'cinematic'],
  ] as const,
  hysteresis: 40,
})
