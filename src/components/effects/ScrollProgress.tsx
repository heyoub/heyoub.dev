import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
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

      {/* Terminal-style section bars */}
      <div className="absolute top-0 left-0 right-0 h-[3px]">
        {sections.map((section, idx) => (
          <TerminalBar key={section.id} section={section} progress={smoothProgress} index={idx} />
        ))}
      </div>

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

interface TerminalBarProps {
  section: { id: string; position: number; label: string }
  progress: ReturnType<typeof useSpring>
  index: number
}

function TerminalBar({ section, progress, index }: TerminalBarProps) {
  const proximity = useTransform(progress, (v) => {
    const distance = Math.abs(v - section.position)
    return Math.max(0, 1 - distance * 8)
  })

  const isPassed = useTransform(progress, (v) => v >= section.position)
  const isActive = useTransform(progress, (v) =>
    v >= section.position - 0.05 && v <= section.position + 0.05
  )

  return (
    <motion.div
      className="absolute top-0 h-full flex items-center"
      style={{ left: `${section.position * 100}%`, transform: 'translateX(-50%)' }}
    >
      <motion.div
        className="relative h-full flex flex-col justify-center"
        style={{ width: useTransform(proximity, [0, 1], [120, 160]) }}
      >
        {/* Bar segments - deterministic color based on progress, no Math.random */}
        <div className="flex gap-px h-[3px]">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((seg) => (
            <motion.div
              key={seg}
              className="flex-1 h-full"
              style={{
                backgroundColor: useTransform(progress, (v) => {
                  const passed = v >= section.position
                  const active = v >= section.position - 0.05 && v <= section.position + 0.05
                  const distance = Math.abs(v - section.position)
                  const prox = Math.max(0, 1 - distance * 8)
                  // Deterministic glitch: based on segment index + section position, not random
                  const glitchVal = hash(seg + index * 8, Math.floor(v * 50))
                  if (active && glitchVal > 0.7) return 'rgba(244, 114, 182, 0.8)'
                  if (passed) return seg <= 5 ? 'rgba(34, 211, 238, 0.8)' : 'rgba(167, 139, 250, 0.8)'
                  if (prox > 0.3) return `rgba(34, 211, 238, ${(0.3 + prox * 0.5) * 0.8})`
                  return 'transparent'
                }),
              }}
            />
          ))}
        </div>

        {/* Label - shows when near */}
        <motion.div
          className="absolute top-full mt-1 left-1/2 -translate-x-1/2 font-mono text-[7px] tracking-[0.15em] whitespace-nowrap"
          style={{
            opacity: useTransform(proximity, [0, 0.5, 1], [0, 0.4, 0.9]),
            color: useTransform(isPassed, (p) => (p ? 'var(--accent)' : 'var(--text-muted)')),
          }}
        >
          {section.label}
          <motion.span
            className="ml-0.5"
            style={{ opacity: useTransform(isActive, (a) => (a ? 1 : 0)) }}
          >
            _
          </motion.span>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
