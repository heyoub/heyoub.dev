import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0a0a0b',
        'bg-secondary': '#111113',
        'bg-tertiary': '#18181b',
        'text-primary': '#fafafa',
        'text-secondary': '#a1a1aa',
        'text-muted': '#52525b',
        accent: {
          DEFAULT: '#22d3ee',
          glow: 'rgba(34, 211, 238, 0.15)',
        },
        purple: {
          DEFAULT: '#a78bfa',
          500: '#a78bfa',
        },
        green: '#22c55e',
        orange: '#fb923c',
        warm: '#fbbf24',
        pink: '#f472b6',
        'editor-bg': '#0d1117',
        'editor-chrome': '#161b22',
        'editor-border': '#30363d',
        cyan: {
          500: '#06b6d4',
        },
        blue: {
          500: '#3b82f6',
        },
      },
      fontFamily: {
        serif: ['Instrument Serif', 'serif'],
        mono: ['Space Mono', 'monospace'],
        sans: ['DM Sans', 'sans-serif'],
      },
      animation: {
        'float': 'float 20s ease-in-out infinite',
        'pulse-slow': 'pulse 2s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.8s ease forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(30px, -30px) scale(1.05)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.95)' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      transitionDuration: {
        '200': '200ms',
        '300': '300ms',
        '400': '400ms',
      },
    },
  },
  plugins: [],
} satisfies Config