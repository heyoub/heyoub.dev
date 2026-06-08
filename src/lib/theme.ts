import { Theme } from '@czap/core'

// The brand palette as a coordinated token-space variant. Dark is the
// home key (the v2 site was dark-first); light is the daylight transpose.
// One definition → CSS vars, a Tailwind token file, and the AI manifest.
export const brand = Theme.make({
  name: 'brand',
  variants: ['dark', 'light'] as const,
  tokens: {
    bg:        { dark: '#0a0a0b', light: '#fafafa' },
    surface:   { dark: '#111113', light: '#ffffff' },
    text:      { dark: '#fafafa', light: '#18181b' },
    muted:     { dark: '#a1a1aa', light: '#52525b' },
    accent:    { dark: '#22d3ee', light: '#0891b2' },
    purple:    { dark: '#a78bfa', light: '#7c3aed' },
    gradStart: { dark: '#06b6d4', light: '#0891b2' },
    gradEnd:   { dark: '#8b5cf6', light: '#7c3aed' },
  },
  meta: {
    dark: { label: 'Dark', mode: 'dark' },
    light: { label: 'Light', mode: 'light' },
  },
})
