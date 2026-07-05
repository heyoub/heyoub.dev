import { Token, Theme } from '@czap/core'
import { palette } from './palette'

// The brand palette, authored once in ./palette.ts. Cast to CSS vars by
// TokenStyles.astro (TokenCSSCompiler) — the same values also feed Tailwind
// (tailwind.config.ts), resolve in TS via Token.tap, and feed the AI manifest.
// One source, every surface.
const color = (name: string, dark: string, light: string) =>
  Token.make({ name, category: 'color', axes: ['theme'] as const, values: { dark, light }, fallback: dark })

export const tokens = Object.entries(palette).map(([name, v]) => color(name, v.dark, v.light))

// Coordinated theme variant (dark is the home key) — the subset the theme cast
// needs, sourced from the same palette so it can't drift from the tokens.
export const brand = Theme.make({
  name: 'brand',
  variants: ['dark', 'light'] as const,
  tokens: {
    accent: palette.accent,
    purple: palette.purple,
    'bg-primary': palette['bg-primary'],
    'text-primary': palette['text-primary'],
  },
  meta: { dark: { label: 'Dark', mode: 'dark' }, light: { label: 'Light', mode: 'light' } },
})
