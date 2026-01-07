import { useRef, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

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

  // Parallax effect
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.play().catch(() => {
        // Autoplay may be blocked, that's okay
      })
    }
  }, [])

  return (
    <motion.div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ height }}
    >
      {/* Video */}
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
        />
      </motion.div>

      {/* Overlay */}
      {overlay === 'gradient' && (
        <div className="absolute inset-0 bg-gradient-to-b from-bg-primary via-transparent to-bg-primary" />
      )}
      {overlay === 'dark' && (
        <div className="absolute inset-0 bg-bg-primary/60" />
      )}

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
