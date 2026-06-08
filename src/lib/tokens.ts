import { Token } from '@czap/core'

// Material primitives — the brand's accent, varying on the `theme` axis.
// `Token.cssVar(accent)` gives the var name; `Token.tap(accent, { theme })`
// resolves the value. Same token also casts to a GLSL uniform later.
export const accent = Token.make({
  name: 'accent',
  category: 'color',
  axes: ['theme'] as const,
  values: { dark: '#22d3ee', light: '#0891b2' },
  fallback: '#22d3ee',
})

export const text = Token.make({
  name: 'text',
  category: 'color',
  axes: ['theme'] as const,
  values: { dark: '#fafafa', light: '#18181b' },
  fallback: '#fafafa',
})

export const bg = Token.make({
  name: 'bg',
  category: 'color',
  axes: ['theme'] as const,
  values: { dark: '#0a0a0b', light: '#fafafa' },
  fallback: '#0a0a0b',
})
