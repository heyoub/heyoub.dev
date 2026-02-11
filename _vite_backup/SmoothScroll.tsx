import { useEffect, useRef, createContext, useContext, ReactNode } from 'react'
import Lenis from 'lenis'

// Lenis context for accessing the instance anywhere
const LenisContext = createContext<Lenis | null>(null)

export const useLenis = () => useContext(LenisContext)

interface SmoothScrollProps {
  children: ReactNode
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential ease out
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    })

    lenisRef.current = lenis

    // Animation frame loop
    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    // Cleanup
    return () => {
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  return (
    <LenisContext.Provider value={lenisRef.current}>
      {children}
    </LenisContext.Provider>
  )
}

// Hook to get scroll progress (0 to 1)
export function useScrollProgress() {
  const lenis = useLenis()
  const progressRef = useRef(0)

  useEffect(() => {
    if (!lenis) return

    const handleScroll = () => {
      progressRef.current = lenis.progress
    }

    lenis.on('scroll', handleScroll)
    return () => lenis.off('scroll', handleScroll)
  }, [lenis])

  return progressRef
}

// Hook to scroll to element
export function useScrollTo() {
  const lenis = useLenis()

  return (target: string | HTMLElement, options?: { offset?: number; duration?: number }) => {
    if (!lenis) return
    lenis.scrollTo(target, {
      offset: options?.offset ?? 0,
      duration: options?.duration ?? 1.2,
    })
  }
}

// Hook to stop/start scroll
export function useScrollControl() {
  const lenis = useLenis()

  return {
    stop: () => lenis?.stop(),
    start: () => lenis?.start(),
  }
}
