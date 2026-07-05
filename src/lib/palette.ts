// The brand palette — the SINGLE source, as one plain zero-dep map so it can feed
// BOTH surfaces without either re-declaring the values:
//   • tokens.ts        → LiteShip Token.make/Theme.make → --czap-* CSS vars
//                         (TokenCSSCompiler, theme-reactive via [data-theme]).
//   • tailwind.config  → static dark hexes for utility classes (the home key the
//                         site renders in).
// Change a color here and it flows to both. Previously the same hexes were
// restated in three places (tokens.ts, the brand theme, and tailwind.config.ts).
//
// Why not TokenTailwindCompiler (the pure-LiteShip route)? It emits a Tailwind v4
// `@theme { }` block and this site is on Tailwind v3.4 (JS config), so a shared
// plain map is the pixel-identical single source until/unless we move to v4.
export const palette = {
  accent: { dark: '#22d3ee', light: '#0891b2' },
  purple: { dark: '#a78bfa', light: '#7c3aed' },
  green: { dark: '#22c55e', light: '#16a34a' },
  orange: { dark: '#fb923c', light: '#ea580c' },
  warm: { dark: '#fbbf24', light: '#d97706' },
  pink: { dark: '#f472b6', light: '#db2777' },
  'bg-primary': { dark: '#0a0a0b', light: '#fafafa' },
  'bg-secondary': { dark: '#111113', light: '#f4f4f5' },
  'bg-tertiary': { dark: '#18181b', light: '#e4e4e7' },
  'text-primary': { dark: '#fafafa', light: '#18181b' },
  'text-secondary': { dark: '#a1a1aa', light: '#52525b' },
  'text-muted': { dark: '#52525b', light: '#a1a1aa' },
} satisfies Record<string, { dark: string; light: string }>

export type PaletteName = keyof typeof palette

// Dark values keyed by name — the home key Tailwind reads.
export const paletteDark = Object.fromEntries(
  Object.entries(palette).map(([k, v]) => [k, v.dark]),
) as Record<PaletteName, string>
