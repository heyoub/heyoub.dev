import { useRef, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { fluidType } from '@/lib/responsive'

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
  className = '',
}: VideoInterludeProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const containerY = useTransform(scrollYProgress, [0, 0.3, 0.5], [200, 50, 0])
  const containerOpacity = useTransform(scrollYProgress, [0, 0.15, 0.3], [0, 0.6, 1])
  const containerScale = useTransform(scrollYProgress, [0, 0.3], [0.95, 1])

  const glassTextOpacity = useTransform(scrollYProgress, [0.2, 0.35], [0, 1])
  const glassTextScale = useTransform(scrollYProgress, [0.2, 0.35], [0.95, 1])

  const y = useTransform(scrollYProgress, [0.3, 1], ['0%', '20%'])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])

  // Efficient: play only when visible, pause when off-screen (saves GPU/battery)
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(video)
    return () => observer.disconnect()
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
          loop
          playsInline
          autoPlay
          preload="metadata"
          poster="/assets/video-poster.jpg"
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

      {/* Glassmorphic "Core Thesis" text - video shows through letters */}
      <motion.div
        className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
        style={{
          opacity: glassTextOpacity,
          scale: glassTextScale,
        }}
      >
        <h2
          className="font-serif font-bold tracking-tight text-center px-8"
          style={{
            fontSize: fluidType.glassmorphic,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            WebkitTextFillColor: 'transparent',
            WebkitTextStroke: '0.1px rgba(255,255,255,0.3)',
            filter: 'drop-shadow(0 0 30px rgba(255,255,255,0.3)) drop-shadow(0 0 60px rgba(255,255,255,0.2))',
          }}
        >
          Core Thesis
        </h2>
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
