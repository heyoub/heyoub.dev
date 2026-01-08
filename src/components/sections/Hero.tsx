import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { heroLabel, heroName, heroTagline, heroStats, heroPhoto, fadeUp } from '@/lib/animations'

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)

  // Track scroll progress through hero section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  // Tuck down effect as user scrolls away - inverse to video roll up
  // Hero tucks DOWN and BEHIND as video rolls UP
  const contentY = useTransform(scrollYProgress, [0, 0.5, 1], [0, 100, 250])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.4, 0.7, 1], [1, 0.8, 0.3, 0])
  const contentScale = useTransform(scrollYProgress, [0, 1], [1, 0.95])

  return (
    <section ref={sectionRef} className="min-h-screen grid grid-cols-1 lg:grid-cols-2 items-center px-[8vw] gap-8 md:gap-16 py-24 md:py-0 relative overflow-hidden">
      {/* Content */}
      <motion.div
        className="max-w-xl lg:max-w-none"
        style={{ y: contentY, opacity: contentOpacity, scale: contentScale }}
      >
        <motion.h1
          className="font-serif text-[clamp(2.5rem,8vw,7rem)] font-normal leading-[0.95] tracking-tight mb-3 md:mb-4"
          variants={heroName}
          initial="hidden"
          animate="visible"
        >
          Eassa <span className="italic text-text-secondary">Ayoub</span>
        </motion.h1>

        <motion.div
          className="font-mono text-[clamp(0.65rem,1.5vw,0.75rem)] tracking-[0.3em] uppercase text-accent mb-6 md:mb-8"
          variants={heroLabel}
          initial="hidden"
          animate="visible"
        >
          Technical Architect · AI Systems & Cross-Domain Synthesis
        </motion.div>

        <motion.p
          className="text-[clamp(1rem,2.5vw,1.25rem)] font-light text-text-secondary leading-relaxed mb-6 md:mb-8"
          variants={heroTagline}
          initial="hidden"
          animate="visible"
        >
          I build{' '}
          <strong className="text-text-primary font-medium">
            software that feels like thinking
          </strong>
          . Systems where your mental model becomes structure, behavior becomes enforced, and
          complexity dissolves into clarity — without forcing you into abstraction hell.
        </motion.p>

        <motion.div
          className="grid grid-cols-[1fr_auto] gap-6 max-w-2xl"
          variants={heroStats}
          initial="hidden"
          animate="visible"
        >
          {/* Quote-style text block */}
          <div className="flex items-center gap-4 border-l-2 border-accent/30 pl-4">
            <p className="text-[clamp(0.95rem,2vw,1.125rem)] font-light text-text-secondary">
              You're not just building apps.{' '}
              <span className="text-text-primary italic">
                You're shaping how people experience reality.
              </span>
            </p>
          </div>

          {/* Square CTA button with padding */}
          <div className="flex items-center justify-center p-2">
            <a
              href="https://cal.com/eassa-ayoub-hf9yfh"
              target="_blank"
              rel="noopener noreferrer"
              className="aspect-square w-[clamp(7rem,15vw,9rem)] bg-accent/10 border border-accent/30 hover:bg-accent hover:border-accent hover:text-bg-primary transition-all duration-300 flex flex-col items-center justify-center gap-2 group touch-target"
            >
              <span className="font-mono text-[clamp(0.65rem,1.5vw,0.75rem)] tracking-wider uppercase">Book a</span>
              <span className="font-serif text-[clamp(1.5rem,3vw,2rem)] text-accent group-hover:text-bg-primary transition-colors">Call</span>
            </a>
          </div>
        </motion.div>
      </motion.div>

      {/* Photo */}
      <motion.div
        className="flex justify-center items-center order-first lg:order-last mt-16 lg:mt-0"
        variants={heroPhoto}
        initial="hidden"
        animate="visible"
        style={{ y: contentY, opacity: contentOpacity, scale: contentScale }}
      >
        <div className="w-full max-w-[380px] aspect-[380/480] bg-gradient-to-br from-bg-tertiary to-bg-secondary border border-white/[0.08] relative overflow-hidden">
          {/* Gradient accent line */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-cyan-500 to-purple-500" />

          {/* Headshot - Hero image is critical, use fetchpriority high */}
          <img
            src="/assets/Eassa_Headshot_-_Low_Res-1-removebg-preview.png"
            alt="Eassa Ayoub - Technical Architect specializing in AI Systems"
            className="w-full h-full object-cover object-top"
            fetchPriority="high"
            decoding="async"
            width={380}
            height={480}
          />
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 md:bottom-12 left-[8vw] flex items-center gap-3 md:gap-4 font-mono text-[clamp(0.65rem,1.5vw,0.75rem)] tracking-widest text-text-muted"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 1 }}
      >
        <span className="w-12 md:w-16 h-px bg-gradient-to-r from-text-muted to-transparent" />
        <span>Scroll to explore</span>
      </motion.div>
    </section>
  )
}
