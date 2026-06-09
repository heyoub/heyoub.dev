import { Token, Theme } from '@czap/core'

// The brand palette, authored once as LiteShip Tokens. Cast to CSS vars by
// TokenStyles.astro (TokenCSSCompiler) — the same definitions also resolve in
// TS via Token.tap and feed the AI manifest. One source, every surface.
const color = (name: string, dark: string, light: string) =>
  Token.make({ name, category: 'color', axes: ['theme'] as const, values: { dark, light }, fallback: dark })

export const tokens = [
  color('accent', '#22d3ee', '#0891b2'),
  color('purple', '#a78bfa', '#7c3aed'),
  color('green', '#22c55e', '#16a34a'),
  color('orange', '#fb923c', '#ea580c'),
  color('warm', '#fbbf24', '#d97706'),
  color('pink', '#f472b6', '#db2777'),
  color('bg-primary', '#0a0a0b', '#fafafa'),
  color('bg-secondary', '#111113', '#f4f4f5'),
  color('bg-tertiary', '#18181b', '#e4e4e7'),
  color('text-primary', '#fafafa', '#18181b'),
  color('text-secondary', '#a1a1aa', '#52525b'),
  color('text-muted', '#52525b', '#a1a1aa'),
]

// Coordinated theme variant (dark is the home key).
export const brand = Theme.make({
  name: 'brand',
  variants: ['dark', 'light'] as const,
  tokens: {
    accent: { dark: '#22d3ee', light: '#0891b2' },
    purple: { dark: '#a78bfa', light: '#7c3aed' },
    'bg-primary': { dark: '#0a0a0b', light: '#fafafa' },
    'text-primary': { dark: '#fafafa', light: '#18181b' },
  },
  meta: { dark: { label: 'Dark', mode: 'dark' }, light: { label: 'Light', mode: 'light' } },
})
