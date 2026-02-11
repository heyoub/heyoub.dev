import { useRef, useEffect } from 'react'
import { motion, useScroll, useSpring, useTransform, useMotionValueEvent } from 'framer-motion'
import { zIndex } from '@/lib/responsive'

const MARKER_COUNT = 16
const labels = ['INIT', 'BOOT', 'LOAD', 'PARSE', 'EXEC', 'COMP', 'LINK', 'PROC', 'SYNC', 'HASH', 'PACK', 'SEND', 'RECV', 'DONE', 'EXIT', 'END'] as const
const sections = Array.from({ length: MARKER_COUNT }, (_, i) => ({
  id: `section-${i}`,
  position: i / (MARKER_COUNT - 1),
  label: labels[i] ?? 'NODE',
}))

// Deterministic hash - same input always gives same output (no Math.random!)
function hash(x: number, y: number): number {
  const h = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
  return h - Math.floor(h)
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  // Show after initial scroll
  const barOpacity = useTransform(scrollYProgress, [0, 0.02, 0.98, 1], [0, 1, 1, 0])

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 pointer-events-none"
      style={{ zIndex: zIndex.scrollProgress, opacity: barOpacity }}
    >
      {/* Track background */}
      <div className="h-[3px] w-full bg-bg-tertiary border-b border-white/[0.05]" />

      {/* Scanline effect */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-accent/10 to-transparent"
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      />

      {/* Main progress line */}
      <motion.div
        className="absolute top-0 left-0 h-[3px] w-full origin-left"
        style={{
          scaleX: smoothProgress,
          background: 'linear-gradient(90deg, var(--accent) 0%, var(--purple) 60%, var(--pink) 100%)',
        }}
      >
        {/* Leading edge glow */}
        <div
          className="absolute right-0 top-0 h-full w-16 opacity-60"
          style={{
            background: `repeating-linear-gradient(90deg,
              transparent 0px, transparent 2px,
              var(--accent) 2px, var(--accent) 4px)`,
          }}
        />
      </motion.div>

      {/* Terminal-style section bars — driven by a single ref write, not 240 useTransform callbacks */}
      <TerminalBars progress={smoothProgress} />

      {/* Terminal status readout */}
      <motion.div
        className="absolute top-1.5 right-3 font-mono text-[9px] tracking-[0.2em] flex items-center gap-2"
        style={{ opacity: useTransform(smoothProgress, [0, 0.05, 0.95, 1], [0, 0.7, 0.7, 0]) }}
      >
        <span className="text-text-muted/40">SCROLL</span>
        <span className="text-accent/70 tabular-nums">
          <motion.span>
            {useTransform(smoothProgress, (v) => `${Math.round(v * 100).toString().padStart(3, '0')}`)}
          </motion.span>
        </span>
        <span className="text-text-muted/40">%</span>
      </motion.div>
    </motion.div>
  )
}

/**
 * Renders all 16 terminal bars using a single useMotionValueEvent
 * that writes to a ref, then updates DOM via one RAF — instead of
 * 240 individual useTransform callbacks per frame.
 */
function TerminalBars({ progress }: { progress: ReturnType<typeof useSpring> }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useMotionValueEvent(progress, 'change', (v) => {
    const container = containerRef.current
    if (!container) return

    const bars = container.children
    for (let idx = 0; idx < bars.length; idx++) {
      const bar = bars[idx] as HTMLElement
      const position = idx / (MARKER_COUNT - 1)
      const distance = Math.abs(v - position)
      const prox = Math.max(0, 1 - distance * 8)
      const passed = v >= position
      const active = v >= position - 0.05 && v <= position + 0.05

      // Update width
      const width = 120 + prox * 40
      bar.style.width = `${width}px`

      // Update segments
      const segContainer = bar.firstElementChild as HTMLElement | null
      if (segContainer) {
        const segs = segContainer.children
        for (let seg = 0; seg < segs.length; seg++) {
          const segEl = segs[seg] as HTMLElement
          const glitchVal = hash(seg + idx * 8, Math.floor(v * 50))
          let color: string
          if (active && glitchVal > 0.7) {
            color = 'rgba(244, 114, 182, 0.8)'
          } else if (passed) {
            color = seg <= 5 ? 'rgba(34, 211, 238, 0.8)' : 'rgba(167, 139, 250, 0.8)'
          } else if (prox > 0.3) {
            color = `rgba(34, 211, 238, ${(0.3 + prox * 0.5) * 0.8})`
          } else {
            color = 'transparent'
          }
          segEl.style.backgroundColor = color
        }
      }

      // Update label
      const label = bar.lastElementChild as HTMLElement | null
      if (label) {
        const labelOpacity = prox < 0.5 ? prox * 0.8 : 0.4 + (prox - 0.5) * 1.0
        label.style.opacity = String(Math.min(0.9, labelOpacity))
        label.style.color = passed ? 'var(--accent)' : 'var(--text-muted)'

        // Cursor blink
        const cursor = label.lastElementChild as HTMLElement | null
        if (cursor) {
          cursor.style.opacity = active ? '1' : '0'
        }
      }
    }
  })

  return (
    <div ref={containerRef} className="absolute top-0 left-0 right-0 h-[3px]">
      {sections.map((section, idx) => (
        <div
          key={section.id}
          className="absolute top-0 h-full flex items-center"
          style={{ left: `${section.position * 100}%`, transform: 'translateX(-50%)', width: 120 }}
        >
          {/* Bar segments */}
          <div className="flex gap-px h-[3px] w-full">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((seg) => (
              <div key={seg} className="flex-1 h-full" style={{ backgroundColor: 'transparent' }} />
            ))}
          </div>

          {/* Label */}
          <div
            className="absolute top-full mt-1 left-1/2 -translate-x-1/2 font-mono text-[7px] tracking-[0.15em] whitespace-nowrap"
            style={{ opacity: 0, color: 'var(--text-muted)' }}
          >
            {section.label}
            <span className="ml-0.5" style={{ opacity: 0 }}>_</span>
          </div>
        </div>
      ))}
    </div>
  )
}
