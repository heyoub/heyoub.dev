import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'

// Ambient dots - small handful on the right side
const DOTS = [
  { top: '12%', right: '1.2rem', size: 3, delay: 0 },
  { top: '28%', right: '0.8rem', size: 2, delay: 0.4 },
  { top: '44%', right: '1.5rem', size: 2.5, delay: 0.8 },
  { top: '60%', right: '0.6rem', size: 2, delay: 1.2 },
  { top: '76%', right: '1.3rem', size: 3, delay: 0.2 },
  { top: '90%', right: '0.9rem', size: 2, delay: 0.6 },
]

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const [isVisible, setIsVisible] = useState(false)

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  // Show after initial scroll
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (v) => {
      setIsVisible(v > 0.02)
    })
    return () => unsubscribe()
  }, [scrollYProgress])

  return (
    <motion.div
      className="fixed top-0 right-0 bottom-0 z-[100] pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Terminal counter - top right */}
      <motion.div
        className="absolute top-4 right-3 font-mono text-[9px] tracking-[0.2em] flex items-center gap-2"
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

      {/* Ambient dots along right edge */}
      {DOTS.map((dot, i) => (
        <AmbientDot key={i} dot={dot} progress={smoothProgress} />
      ))}
    </motion.div>
  )
}

interface AmbientDotProps {
  dot: (typeof DOTS)[number]
  progress: ReturnType<typeof useSpring>
}

function AmbientDot({ dot, progress }: AmbientDotProps) {
  // Dot lights up as scroll passes its vertical position
  const dotPosition = parseFloat(dot.top) / 100
  const opacity = useTransform(progress, (v) => {
    const distance = Math.abs(v - dotPosition)
    if (distance < 0.08) return 0.9
    if (v > dotPosition) return 0.4
    return 0.1
  })

  const scale = useTransform(progress, (v) => {
    const distance = Math.abs(v - dotPosition)
    return distance < 0.08 ? 1.4 : 1
  })

  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        top: dot.top,
        right: dot.right,
        width: dot.size,
        height: dot.size,
        backgroundColor: 'var(--accent)',
        opacity,
        scale,
        boxShadow: useTransform(progress, (v) => {
          const distance = Math.abs(v - dotPosition)
          return distance < 0.08
            ? '0 0 8px rgba(34, 211, 238, 0.6)'
            : 'none'
        }),
      }}
      transition={{ duration: 0.3 }}
    />
  )
}
