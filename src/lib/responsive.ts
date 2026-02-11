// responsive.ts - Single source of truth for fluid design system
// ALL responsive values live here. Components import, never hardcode.

import { useSyncExternalStore } from 'react'

// ============================================================================
// BREAKPOINTS
// ============================================================================

export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const

// ============================================================================
// SHARED MOBILE DETECTION HOOK (replaces 4 duplicate implementations)
// ============================================================================

function subscribeToResize(callback: () => void) {
  window.addEventListener('resize', callback)
  return () => window.removeEventListener('resize', callback)
}

function getIsMobile() {
  return typeof window !== 'undefined' ? window.innerWidth < breakpoints.md : false
}

function getBreakpoint(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop'
  const width = window.innerWidth
  if (width < breakpoints.md) return 'mobile'
  if (width < breakpoints.lg) return 'tablet'
  return 'desktop'
}

/** Shared hook for mobile detection. Use this EVERYWHERE instead of local useState+useEffect. */
export function useIsMobile(): boolean {
  return useSyncExternalStore(subscribeToResize, getIsMobile, () => false)
}

/** Shared hook for breakpoint detection. */
export function useBreakpoint(): 'mobile' | 'tablet' | 'desktop' {
  return useSyncExternalStore(subscribeToResize, getBreakpoint, () => 'desktop')
}

// ============================================================================
// FLUID TYPOGRAPHY - Tailwind class names mapping to config tokens
// Use as: className={`text-${ft.display}`} or fontSize style
// ============================================================================

export const fluidType = {
  // Display text (Hero name)
  display: 'clamp(2.5rem, 8vw, 7rem)',

  // Headings
  h1: 'clamp(2rem, 5vw, 3.5rem)',
  h2: 'clamp(1.5rem, 4vw, 2.5rem)',
  h2Large: 'clamp(1.8rem, 4vw, 2.8rem)',
  h3: 'clamp(1.25rem, 3vw, 2rem)',
  h3Large: 'clamp(2rem, 5vw, 3.5rem)',
  h4: 'clamp(1.125rem, 2.5vw, 1.5rem)',

  // Body text
  lg: 'clamp(1rem, 2.5vw, 1.25rem)',
  base: 'clamp(0.95rem, 2vw, 1.125rem)',
  baseLg: 'clamp(1rem, 2vw, 1.15rem)',
  sm: 'clamp(0.85rem, 1.75vw, 1rem)',
  xs: 'clamp(0.75rem, 1.5vw, 0.875rem)',

  // Mono text (labels, code)
  monoBase: 'clamp(0.7rem, 1.5vw, 0.875rem)',
  monoSmall: 'clamp(0.65rem, 1.25vw, 0.75rem)',
  monoXs: 'clamp(0.6rem, 1.1vw, 0.7rem)',
  monoXxs: 'clamp(0.55rem, 1.1vw, 0.65rem)',
  monoTiny: 'clamp(0.6rem, 1vw, 0.7rem)',

  // Detail text
  detail: 'clamp(0.8rem, 1.3vw, 0.9rem)',
  detailSm: 'clamp(0.85rem, 1.5vw, 0.95rem)',
  detailBase: 'clamp(0.9rem, 1.75vw, 1rem)',

  // Section-specific
  heroLabel: 'clamp(0.65rem, 1.5vw, 0.75rem)',
  sectionHook: 'clamp(0.7rem, 1.5vw, 0.85rem)',
  pillarTitle: 'clamp(1rem, 1.8vw, 1.25rem)',
  contactHeading: 'clamp(2rem, 8vw, 4rem)',
  contactBody: 'clamp(1rem, 2.5vw, 1.25rem)',
  glassmorphic: 'clamp(3.5rem, 14vw, 9rem)',
  parallaxText: 'clamp(2rem, 5vw, 3.5rem)',

  // Code footer
  codeBase: 'clamp(0.7rem, 1.5vw, 0.875rem)',
} as const

// ============================================================================
// FLUID SPACING
// ============================================================================

export const fluidSpace = {
  xl: 'clamp(3rem, 8vw, 6rem)',
  lg: 'clamp(2rem, 5vw, 4rem)',
  md: 'clamp(1rem, 3vw, 2rem)',
  sm: 'clamp(0.5rem, 2vw, 1rem)',
  xs: 'clamp(0.375rem, 1.5vw, 0.75rem)',
} as const

// ============================================================================
// FLUID LAYOUT
// ============================================================================

export const fluidLayout = {
  sectionPy: 'clamp(2.5rem, 10vw, 10rem)',
  sectionPySmall: 'clamp(1.5rem, 6vw, 6rem)',
  containerPx: '8vw',
} as const

// ============================================================================
// Z-INDEX SCALE (single source of truth)
// ============================================================================

export const zIndex = {
  behind: -100,
  base: 0,
  sticky: 10,
  bgCover: 15,
  videoLayer: 20,
  styledContact: 25,
  glitchLayer: 30,
  codeFooter: 40,
  nav: 50,
  scrollProgress: 100,
  noiseOverlay: 1000,
} as const
