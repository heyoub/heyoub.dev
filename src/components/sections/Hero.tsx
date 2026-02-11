import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { heroLabel, heroName, heroTagline, heroStats, heroPhoto } from '@/lib/animations'
import { heroContent } from '@/data/content'
import { fluidType, fluidLayout } from '@/lib/responsive'

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const contentY = useTransform(scrollYProgress, [0, 0.5, 1], [0, 100, 250])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.4, 0.7, 1], [1, 0.8, 0.3, 0])
  const contentScale = useTransform(scrollYProgress, [0, 1], [1, 0.95])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen grid grid-cols-1 lg:grid-cols-2 items-center gap-8 md:gap-16 py-24 md:py-0 overflow-hidden"
      style={{ paddingLeft: fluidLayout.containerPx, paddingRight: fluidLayout.containerPx }}
    >
      {/* Content */}
      <motion.div
        className="max-w-xl lg:max-w-none"
        style={{ y: contentY, opacity: contentOpacity, scale: contentScale }}
      >
        <motion.h1
          className="font-serif font-normal leading-[0.95] tracking-tight mb-3 md:mb-4"
          style={{ fontSize: fluidType.display }}
          variants={heroName}
          initial="hidden"
          animate="visible"
        >
          {heroContent.name.first}{' '}
          <span className="italic text-text-secondary">{heroContent.name.last}</span>
        </motion.h1>

        <motion.div
          className="font-mono tracking-[0.3em] uppercase text-accent mb-6 md:mb-8"
          style={{ fontSize: fluidType.heroLabel }}
          variants={heroLabel}
          initial="hidden"
          animate="visible"
        >
          {heroContent.label}
        </motion.div>

        <motion.p
          className="font-light text-text-secondary leading-relaxed mb-6 md:mb-8"
          style={{ fontSize: fluidType.lg }}
          variants={heroTagline}
          initial="hidden"
          animate="visible"
        >
          {heroContent.tagline.before}{' '}
          <strong className="text-text-primary font-medium">
            {heroContent.tagline.emphasis}
          </strong>
          {heroContent.tagline.after}
        </motion.p>

        <motion.div
          className="grid grid-cols-[1fr_auto] gap-6 max-w-2xl"
          variants={heroStats}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center gap-4 border-l-2 border-accent/30 pl-4">
            <p
              className="font-light text-text-secondary"
              style={{ fontSize: fluidType.base }}
            >
              {heroContent.quote.regular}{' '}
              <span className="text-text-primary italic">
                {heroContent.quote.emphasis}
              </span>
            </p>
          </div>

          <div className="flex items-center justify-center p-2">
            <a
              href={heroContent.cta.href}
              target="_blank"
              rel="noopener noreferrer"
              className="aspect-square w-[clamp(7rem,15vw,9rem)] bg-accent/10 border border-accent/30 hover:bg-accent hover:border-accent hover:text-bg-primary transition-all duration-300 flex flex-col items-center justify-center gap-2 group touch-target cta-glow focus-ring press-effect tap-highlight"
            >
              <span
                className="font-mono tracking-wider uppercase"
                style={{ fontSize: fluidType.heroLabel }}
              >
                {heroContent.cta.label}
              </span>
              <span
                className="font-serif text-accent group-hover:text-bg-primary transition-colors"
                style={{ fontSize: fluidType.h3 }}
              >
                {heroContent.cta.action}
              </span>
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
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-cyan-500 to-purple-500" />
          <img
            src={heroContent.photo.src}
            alt={heroContent.photo.alt}
            className="w-full h-full object-cover object-top"
            loading="eager"
            decoding="async"
            width={380}
            height={480}
          />
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-6 md:bottom-12 left-1/2 -translate-x-1/2 md:translate-x-0 flex flex-col md:flex-row items-center gap-2 md:gap-4 font-mono tracking-widest text-text-muted"
        style={{ fontSize: 'clamp(0.6rem, 1.25vw, 0.7rem)', left: undefined }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <motion.div
          className="w-px md:w-12 h-8 md:h-px bg-gradient-to-b md:bg-gradient-to-r from-accent/50 via-accent to-transparent"
          animate={{ scaleY: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <span className="hidden md:inline">{heroContent.scrollHint}</span>
        <motion.svg
          className="md:hidden w-4 h-4 text-accent/70"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </motion.svg>
      </motion.div>
    </section>
  )
}
