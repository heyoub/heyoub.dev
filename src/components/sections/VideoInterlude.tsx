import { useRef, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { staggerContainer, staggerItem } from '@/lib/animations'
import { momentContent } from '@/data/content'

interface VideoInterludeProps {
  src: string
  height?: string
  overlay?: 'gradient' | 'dark' | 'none'
  className?: string
}

export function VideoInterlude({
  src,
  height = '60vh',
  overlay = 'gradient',
  className = ''
}: VideoInterludeProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  // Roll up from below effect - inverse to hero tuck down
  const containerY = useTransform(scrollYProgress, [0, 0.3, 0.5], [200, 50, 0])
  const containerOpacity = useTransform(scrollYProgress, [0, 0.15, 0.3], [0, 0.6, 1])
  const containerScale = useTransform(scrollYProgress, [0, 0.3], [0.95, 1])

  // Glass card: dramatic bell-curve fade peaking at center of viewport
  const glassTextOpacity = useTransform(
    scrollYProgress,
    [0, 0.25, 0.4, 0.5, 0.6, 0.75, 1],
    [0, 0, 0.8, 1, 0.8, 0, 0]
  )
  const glassTextScale = useTransform(scrollYProgress, [0.2, 0.4], [0.95, 1])

  // Internal video parallax (subtle)
  const y = useTransform(scrollYProgress, [0.3, 1], ['0%', '20%'])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])

  // Smooth boomerang: play forward from 4s to (duration-4s), then reverse back
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const BUFFER = 4
    let raf: number
    let direction: 'forward' | 'reverse' = 'forward'

    const tick = () => {
      if (!video.duration || video.paused) {
        raf = requestAnimationFrame(tick)
        return
      }

      const end = video.duration - BUFFER

      if (direction === 'forward' && video.currentTime >= end) {
        direction = 'reverse'
      } else if (direction === 'reverse' && video.currentTime <= BUFFER) {
        direction = 'forward'
      }

      if (direction === 'reverse') {
        video.currentTime = Math.max(BUFFER, video.currentTime - 0.033)
      }

      raf = requestAnimationFrame(tick)
    }

    video.currentTime = 0
    video.play().catch(() => {})
    raf = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <motion.div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        height,
        y: containerY,
        opacity: containerOpacity,
        scale: containerScale
      }}
    >
      {/* Video - Optimized loading */}
      <motion.div
        className="absolute inset-0 w-full h-[130%] -top-[15%]"
        style={{ y }}
      >
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          src={src}
          muted
          playsInline
          autoPlay
          preload="metadata"
          poster="/assets/Hero_3.jpg"
          disablePictureInPicture
          disableRemotePlayback
        />
      </motion.div>

      {/* Overlay */}
      {overlay === 'gradient' && (
        <div className="absolute inset-0 bg-gradient-to-b from-bg-primary via-transparent to-bg-primary" />
      )}
      {overlay === 'dark' && (
        <div className="absolute inset-0 bg-bg-primary/60" />
      )}

      {/* Narrative overlay - staggered lines over video */}
      <motion.div
        className="absolute inset-0 z-50 flex flex-col items-center justify-center pointer-events-none px-[8vw]"
        style={{
          opacity: glassTextOpacity,
          scale: glassTextScale,
        }}
      >
        <motion.div
          className="max-w-5xl w-full text-center space-y-3 px-8 py-10 md:px-12 md:py-14 border border-white/10"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
            backdropFilter: 'blur(16px) saturate(1.2)',
            WebkitBackdropFilter: 'blur(16px) saturate(1.2)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)',
          }}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px 0px' }}
        >
          {momentContent.lines.map((line, i) => {
            if (line === '') return <div key={i} className="h-6" />

            if (i === 0) return (
              <motion.p
                key={i}
                className="font-mono text-[clamp(0.7rem,1.5vw,0.85rem)] tracking-[0.2em] uppercase text-accent/80"
                variants={staggerItem}
              >
                {line}
              </motion.p>
            )

            if (i <= 2) return (
              <motion.p
                key={i}
                className="font-light text-[clamp(0.95rem,2vw,1.1rem)] text-white/70 leading-relaxed"
                variants={staggerItem}
              >
                {line}
              </motion.p>
            )

            if (i === 3) return (
              <motion.p
                key={i}
                className="font-serif text-[clamp(1.1rem,2.2vw,1.3rem)] text-white/90 italic"
                variants={staggerItem}
              >
                {line}
              </motion.p>
            )

            if (i === 5) return (
              <motion.p
                key={i}
                className="font-serif text-[clamp(1.15rem,2.5vw,1.4rem)] text-white/90 leading-snug"
                variants={staggerItem}
              >
                {line}
              </motion.p>
            )

            return (
              <motion.p
                key={i}
                className="font-serif text-[clamp(1.3rem,3vw,1.6rem)] text-white leading-snug"
                variants={staggerItem}
              >
                {line}
              </motion.p>
            )
          })}
          <motion.p
            className="pt-4 font-serif text-[clamp(1.2rem,2.5vw,1.5rem)] text-white"
            variants={staggerItem}
          >
            {momentContent.closer.before}{' '}
            <em className="text-accent">{momentContent.closer.emphasis}</em>
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Fade edges */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ opacity }}
      >
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-bg-primary to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-primary to-transparent" />
      </motion.div>
    </motion.div>
  )
}
