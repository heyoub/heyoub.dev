import type { Config } from 'tailwindcss'
import { paletteDark } from './src/lib/palette'

// Design tokens for the utility layer. The brand palette is NOT restated here —
// it derives from the one source (src/lib/palette.ts, the same map that feeds the
// LiteShip --czap-* token cast), so Tailwind and the token vars can't drift. Only
// the non-token extras (editor chrome, the accent glow tint) stay literal.
export default {
  content: ['./src/**/*.{astro,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-primary': paletteDark['bg-primary'],
        'bg-secondary': paletteDark['bg-secondary'],
        'bg-tertiary': paletteDark['bg-tertiary'],
        'text-primary': paletteDark['text-primary'],
        'text-secondary': paletteDark['text-secondary'],
        'text-muted': paletteDark['text-muted'],
        accent: { DEFAULT: paletteDark.accent, glow: 'rgba(34,211,238,0.15)' },
        purple: { DEFAULT: paletteDark.purple, '500': paletteDark.purple },
        green: paletteDark.green,
        orange: paletteDark.orange,
        warm: paletteDark.warm,
        pink: paletteDark.pink,
        'heyoub-accent': paletteDark.accent,
        'heyoub-purple': paletteDark.purple,
        'heyoub-green': paletteDark.green,
        'heyoub-orange': paletteDark.orange,
        'heyoub-warm': paletteDark.warm,
        'heyoub-pink': paletteDark.pink,
        // non-token extras (editor chrome) — literal, not part of the brand palette
        'editor-bg': '#0d1117',
        'editor-chrome': '#161b22',
        'editor-border': '#30363d',
        'editor-red': '#ff5f56',
        'editor-yellow': '#ffbd2e',
        'editor-green': '#27c93f',
        'editor-gray': '#484f58',
        'editor-gray-light': '#8b949e',
      },
      fontFamily: {
        serif: ['Instrument Serif', 'serif'],
        mono: ['Space Mono', 'monospace'],
        code: ['Fira Code', 'monospace'],
        sans: ['DM Sans', 'sans-serif'],
      },
      fontSize: {
        'fluid-xs': 'clamp(0.75rem, 1.5vw, 0.875rem)',
        'fluid-sm': 'clamp(0.875rem, 1.8vw, 1rem)',
        'fluid-base': 'clamp(1rem, 2vw, 1.125rem)',
        'fluid-lg': 'clamp(1.125rem, 2.5vw, 1.25rem)',
        'fluid-xl': 'clamp(1.25rem, 3vw, 1.5rem)',
        'fluid-2xl': 'clamp(1.5rem, 4vw, 2rem)',
        'fluid-3xl': 'clamp(2rem, 5vw, 2.5rem)',
        'fluid-4xl': 'clamp(2.5rem, 6vw, 3.5rem)',
        'fluid-5xl': 'clamp(3rem, 8vw, 5rem)',
        'fluid-display': 'clamp(3.5rem, 10vw, 7rem)',
      },
      spacing: {
        'fluid-xs': 'clamp(0.25rem, 0.5vw, 0.5rem)',
        'fluid-sm': 'clamp(0.5rem, 1vw, 0.75rem)',
        'fluid-md': 'clamp(0.75rem, 1.5vw, 1rem)',
        'fluid-lg': 'clamp(1rem, 2vw, 1.5rem)',
        'fluid-xl': 'clamp(1.5rem, 3vw, 2.5rem)',
        'fluid-2xl': 'clamp(2rem, 4vw, 3.5rem)',
        'fluid-3xl': 'clamp(3rem, 6vw, 5rem)',
      },
      minHeight: { touch: '44px' },
      minWidth: { touch: '44px' },
      transitionDuration: { '400': '400ms' },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-20px) rotate(1deg)' },
          '66%': { transform: 'translateY(-10px) rotate(-1deg)' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        fadeInUp: 'fadeInUp 0.6s ease-out both',
        'pulse-slow': 'pulse-slow 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Config
