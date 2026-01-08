// responsive.ts - Fluid design system utilities

/**
 * Fluid Typography System
 * Generates clamp() values for responsive text scaling
 * Formula: clamp(min, preferred, max)
 */
export const fluidType = {
  // Display text (Hero name)
  display: 'clamp(2.5rem, 8vw, 7rem)',

  // Headings
  h1: 'clamp(2rem, 5vw, 3.5rem)',
  h2: 'clamp(1.5rem, 4vw, 2.5rem)',
  h3: 'clamp(1.25rem, 3vw, 2rem)',
  h4: 'clamp(1.125rem, 2.5vw, 1.5rem)',

  // Body text
  lg: 'clamp(1rem, 2.5vw, 1.25rem)',    // Large body
  base: 'clamp(0.95rem, 2vw, 1.125rem)', // Base body
  sm: 'clamp(0.85rem, 1.75vw, 1rem)',    // Small body
  xs: 'clamp(0.75rem, 1.5vw, 0.875rem)', // Extra small

  // Mono text (labels, code)
  monoBase: 'clamp(0.7rem, 1.5vw, 0.875rem)',
  monoSmall: 'clamp(0.65rem, 1.25vw, 0.75rem)',
}

/**
 * Fluid Spacing System
 * Responsive gaps, padding, and margins
 */
export const fluidSpace = {
  // Extra large gaps (section spacing)
  xl: 'clamp(3rem, 8vw, 6rem)',     // 48px -> 96px

  // Large gaps (between major elements)
  lg: 'clamp(2rem, 5vw, 4rem)',      // 32px -> 64px

  // Medium gaps (between cards, content blocks)
  md: 'clamp(1rem, 3vw, 2rem)',      // 16px -> 32px

  // Small gaps (between related items)
  sm: 'clamp(0.5rem, 2vw, 1rem)',    // 8px -> 16px

  // Tiny gaps (within components)
  xs: 'clamp(0.375rem, 1.5vw, 0.75rem)', // 6px -> 12px
}

/**
 * Fluid Layout Utilities
 */
export const fluidLayout = {
  // Section padding vertical
  sectionPy: 'clamp(2.5rem, 10vw, 10rem)', // 40px -> 160px (replaces py-40)

  // Section padding small
  sectionPySmall: 'clamp(1.5rem, 6vw, 6rem)', // 24px -> 96px (replaces py-24)

  // Container padding horizontal (already good with px-[8vw])
  containerPx: '8vw',
}

/**
 * Touch Target Utilities
 * Ensure minimum 48x48px touch targets on mobile
 */
export const touchTarget = {
  minHeight: '3rem', // 48px minimum
  minWidth: '3rem',  // 48px minimum
  padding: 'clamp(0.75rem, 2vw, 1rem)', // Responsive padding
}

/**
 * Breakpoint helper for JS/TS usage
 */
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
}

/**
 * Check if viewport is mobile-sized
 * Useful for conditional logic (like orb arrangement)
 */
export function isMobileViewport(): boolean {
  return typeof window !== 'undefined' && window.innerWidth < breakpoints.md
}

/**
 * Hook for responsive breakpoint detection
 */
export function useBreakpoint(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop'

  const width = window.innerWidth
  if (width < breakpoints.md) return 'mobile'
  if (width < breakpoints.lg) return 'tablet'
  return 'desktop'
}
