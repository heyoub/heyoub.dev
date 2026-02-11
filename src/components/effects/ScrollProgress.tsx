import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'

// Generate evenly spaced markers across full width
const MARKER_COUNT = 16
const labels = ['INIT', 'BOOT', 'LOAD', 'PARSE', 'EXEC', 'COMP', 'LINK', 'PROC', 'SYNC', 'HASH', 'PACK', 'SEND', 'RECV', 'DONE', 'EXIT', 'END'] as const
const sections = Array.from({ length: MARKER_COUNT }, (_, i) => ({
  id: `section-${i}`,
  position: i / (MARKER_COUNT - 1), // 0 to 1 evenly spread
  label: labels[i] ?? 'NODE',
}))

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const [isVisible, setIsVisible] = useState(false)
  const [glitchFrame, setGlitchFrame] = useState(0)

  // Smooth spring animation for the progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  // Glitch effect - random frame updates
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchFrame(Math.random())
    }, 100)
    return () => clearInterval(interval)
  }, [])

  // Show after initial scroll
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (v) => {
      setIsVisible(v > 0.02)
    })
    return () => unsubscribe()
  }, [scrollYProgress])

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[100] pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Track background - terminal style */}
      <div className="h-[3px] w-full bg-bg-tertiary border-b border-white/[0.05]" />

      {/* Scanline effect */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-accent/10 to-transparent"
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Main progress line */}
      <motion.div
        className="absolute top-0 left-0 h-[3px] origin-left"
        style={{
          scaleX: smoothProgress,
          background: `linear-gradient(90deg,
            var(--accent) 0%,
            var(--purple) 60%,
            var(--pink) 100%
          )`,
        }}
      >
        {/* Glitchy leading edge */}
        <motion.div
          className="absolute right-0 top-0 h-full w-16"
          style={{
            background: `repeating-linear-gradient(90deg,
              transparent 0px,
              transparent 2px,
              var(--accent) 2px,
              var(--accent) 4px
            )`,
            opacity: 0.6,
          }}
          animate={{
            x: [0, -4, 2, -1, 0],
            opacity: [0.6, 0.8, 0.4, 0.9, 0.6],
          }}
          transition={{
            duration: 0.15,
            repeat: Infinity,
            repeatType: 'mirror',
          }}
        />
      </motion.div>

      {/* Terminal-style section bars */}
      <div className="absolute top-0 left-0 right-0 h-[3px]">
        {sections.map((section, idx) => (
          <TerminalBar
            key={section.id}
            section={section}
            progress={smoothProgress}
            glitchFrame={glitchFrame}
            index={idx}
          />
        ))}
      </div>

      {/* Terminal status readout */}
      <motion.div
        className="absolute top-1.5 right-3 font-mono text-[9px] tracking-[0.2em] flex items-center gap-2"
        style={{ opacity: useTransform(smoothProgress, [0, 0.05, 0.95, 1], [0, 0.7, 0.7, 0]) }}
      >
        <span className="text-text-muted/40">SCROLL</span>
        <span className="text-accent/70 tabular-nums">
          <motion.span>{useTransform(smoothProgress, (v) => `${Math.round(v * 100).toString().padStart(3, '0')}`)}</motion.span>
        </span>
        <span className="text-text-muted/40">%</span>
      </motion.div>
    </motion.div>
  )
}

interface TerminalBarProps {
  section: { id: string; position: number; label: string }
  progress: ReturnType<typeof useSpring>
  glitchFrame: number
  index: number
}

function TerminalBar({ section, progress, glitchFrame, index }: TerminalBarProps) {
  // Bar becomes active when progress approaches
  const proximity = useTransform(progress, (v) => {
    const distance = Math.abs(v - section.position)
    return Math.max(0, 1 - distance * 8)
  })

  const isPassed = useTransform(progress, (v) => v >= section.position)
  const isActive = useTransform(progress, (v) =>
    v >= section.position - 0.05 && v <= section.position + 0.05
  )

  // Glitch offset based on glitchFrame
  const glitchOffset = Math.sin(glitchFrame * Math.PI * 2 + index) * 2

  return (
    <motion.div
      className="absolute top-0 h-full flex items-center"
      style={{
        left: `${section.position * 100}%`,
        transform: `translateX(-50%)`,
      }}
    >
      {/* Vertical terminal bar */}
      <motion.div
        className="relative h-full flex flex-col justify-center"
        style={{
          width: useTransform(proximity, [0, 1], [120, 160]),
        }}
      >
        {/* Bar segments - terminal loading style */}
        <div className="flex gap-px h-[3px]">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((seg) => (
            <motion.div
              key={seg}
              className="flex-1 h-full"
              style={{
                backgroundColor: useTransform(
                  progress,
                  (v) => {
                    const passed = v >= section.position
                    const active = v >= section.position - 0.05 && v <= section.position + 0.05
                    const distance = Math.abs(v - section.position)
                    const prox = Math.max(0, 1 - distance * 8)
                    const shouldGlitch = active && Math.random() > 0.7
                    if (shouldGlitch) return 'rgba(244, 114, 182, 0.8)'
                    if (passed) return seg <= 5 ? 'rgba(34, 211, 238, 0.8)' : 'rgba(167, 139, 250, 0.8)'
                    if (prox > 0.3) return `rgba(34, 211, 238, ${(0.3 + prox * 0.5) * 0.8})`
                    return 'transparent'
                  }
                ),
                transform: `translateX(${glitchOffset * (seg % 2 ? 1 : -1)}px)`,
              }}
            />
          ))}
        </div>

        {/* Label - shows when active */}
        <motion.div
          className="absolute top-full mt-1 left-1/2 -translate-x-1/2 font-mono text-[7px] tracking-[0.15em] whitespace-nowrap"
          style={{
            opacity: useTransform(proximity, [0, 0.5, 1], [0, 0.4, 0.9]),
            color: useTransform(isPassed, (p) => p ? 'var(--accent)' : 'var(--text-muted)'),
          }}
        >
          <motion.span
            animate={{
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 0.5 + index * 0.1,
              repeat: Infinity,
            }}
          >
            {section.label}
          </motion.span>
          <motion.span
            className="ml-0.5"
            style={{
              opacity: useTransform(isActive, (a) => a ? 1 : 0),
            }}
          >
            _
          </motion.span>
        </motion.div>

        {/* Glitch artifacts when active */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: useTransform(isActive, (a) => a ? 0.5 : 0),
          }}
        >
          <div
            className="absolute h-px bg-accent/50"
            style={{
              top: `${glitchFrame * 100}%`,
              left: -4,
              right: -4,
              transform: `translateY(${glitchOffset}px)`,
            }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
