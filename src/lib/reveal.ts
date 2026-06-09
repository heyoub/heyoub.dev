// Vanilla scroll-reveal — the framer-motion `whileInView` replacement.
// Adds `.is-visible` to [data-reveal] elements as they enter the viewport;
// children of [data-reveal-stagger] cascade via CSS nth-child delays.
export function initReveal(): void {
  if (typeof window === 'undefined') return
  const els = document.querySelectorAll<HTMLElement>('[data-reveal]')
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce) {
    els.forEach((el) => el.classList.add('is-visible'))
    return
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible')
          io.unobserve(e.target)
        }
      }
    },
    { rootMargin: '0px 0px -80px 0px', threshold: 0.05 },
  )
  els.forEach((el) => io.observe(el))
}
