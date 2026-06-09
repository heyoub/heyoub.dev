// Continuous scroll → continuous output bridge.
//
// LiteShip quantizes signals into discrete named states; for genuinely
// continuous scroll-driven motion it gives you the rails but not the glue.
// This is that glue, ~30 lines: a passive scroll listener, rAF-coalesced,
// that writes a normalized 0→1 scroll signal to:
//   1. a `--czap-scroll` CSS custom property on <html>  (CSS reads it), and
//   2. a document `czap:uniform-update` event {uniform:'u_scroll', value}
//      which the @czap GPU runtime's onDocumentUniformUpdate maps straight
//      onto the shader's u_scroll uniform.
//
// Candidate to upstream as a @czap/web continuous-signal primitive.

let started = false

export function startScrollBridge(): void {
  if (started || typeof window === 'undefined') return
  started = true

  const root = document.documentElement
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  let ticking = false

  const emit = (): void => {
    ticking = false
    const max = root.scrollHeight - window.innerHeight
    const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0

    root.style.setProperty('--czap-scroll', progress.toFixed(4))

    // Only drive the GPU uniform when motion is allowed — keeps the shader
    // still for reduced-motion users while CSS can still read the var.
    if (!reduce) {
      document.dispatchEvent(
        new CustomEvent('czap:uniform-update', {
          detail: { uniform: 'u_scroll', value: progress },
        }),
      )
    }
  }

  const onScroll = (): void => {
    if (ticking) return
    ticking = true
    requestAnimationFrame(emit)
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
  emit()

  // Re-arm cleanly across Astro view transitions.
  document.addEventListener('astro:before-swap', () => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onScroll)
    started = false
  }, { once: true })
}
