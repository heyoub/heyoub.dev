import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { portfolioItems } from '@/data/projects'
import { pathContent, coreThesisContent } from '@/data/content'

const angleColors = {
  rescue: { text: 'text-orange', bg: 'bg-orange/10', border: 'border-orange/20', glow: 'shadow-orange/20' },
  'ground-up': { text: 'text-green', bg: 'bg-green/10', border: 'border-green/20', glow: 'shadow-green/20' },
  infrastructure: { text: 'text-purple', bg: 'bg-purple/10', border: 'border-purple/20', glow: 'shadow-purple/20' },
} as const

const angleLabels = {
  rescue: 'Rescue',
  'ground-up': 'Built',
  infrastructure: 'Infrastructure',
} as const

export function GalleryScroll() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)

  // Track scroll for sticky header fade
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'start -200px'],
  })

  // Header fades out as it would go behind first card, reappears on scroll up
  const headerOpacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 1, 0])
  const headerY = useTransform(scrollYProgress, [0, 1], [0, -20])

  return (
    <section ref={sectionRef} id="work" className="relative min-h-screen px-[8vw]">
        {/* Sticky fading header - lower z so cards tuck over it */}
        <div ref={headerRef} className="sticky top-20 z-0 py-[clamp(2.5rem,8vw,6rem)] pointer-events-none">
          <motion.div
            style={{ opacity: headerOpacity, y: headerY }}
          >
            <motion.div
              className="section-label"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
            >
              The Work
            </motion.div>

            <motion.h2
              className="font-serif text-[clamp(1.5rem,4vw,2.5rem)] max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ delay: 0.1 }}
            >
              Where the pattern shows up
            </motion.h2>
          </motion.div>
        </div>

        {/* Home card - The Pattern + Pillars */}
        <GalleryCard
          id="gallery-home"
          isHome
          className="mb-8 lg:mb-16"
        >
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Left: Same Question, Different Layers */}
            <div>
              <h3 className="font-serif text-[clamp(1.5rem,4vw,2.5rem)] mb-6 leading-tight">
                {pathContent.heading[0]}
                <br />
                <span className="text-text-secondary">{pathContent.heading[1]}</span>
              </h3>

              <p className="text-text-secondary font-light text-[clamp(0.95rem,2vw,1.1rem)] leading-relaxed">
                {pathContent.body}
              </p>
            </div>

            {/* Right: Pillars summary */}
            <div className="space-y-4">
              {coreThesisContent.pillars.map((pillar, idx) => (
                <motion.div
                  key={pillar.label}
                  className="p-4 border-l-2 border-white/10 hover:border-accent/50 transition-colors"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <div className="font-mono text-[clamp(0.6rem,1.25vw,0.7rem)] tracking-wider uppercase text-accent mb-2">
                    {pillar.label}
                  </div>
                  <p className="text-text-secondary text-[clamp(0.85rem,1.5vw,0.95rem)]">
                    {pillar.title} — {pillar.summary}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </GalleryCard>

        {/* Project cards */}
        {portfolioItems.map((project, idx) => (
          <GalleryCard
            key={project.id}
            id={`gallery-${project.id}`}
            className="mb-8 lg:mb-16"
            delay={idx * 0.05}
          >
            <ProjectCardContent project={project} />
          </GalleryCard>
        ))}

        {/* Parallax image section */}
        <ParallaxImage />
    </section>
  )
}

// Gallery card wrapper with consistent styling
interface GalleryCardProps {
  id: string
  isHome?: boolean
  className?: string
  delay?: number
  children: React.ReactNode
}

function GalleryCard({ id, isHome, className = '', delay = 0, children }: GalleryCardProps) {
  return (
    <motion.div
      id={id}
      className={`relative z-10 p-6 lg:p-10 bg-bg-tertiary border border-white/5 ${className}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay }}
    >
      {/* Corner accents for home card */}
      {isHome && (
        <>
          <div className="absolute top-0 left-0 w-16 h-px bg-gradient-to-r from-accent to-transparent" />
          <div className="absolute top-0 left-0 h-16 w-px bg-gradient-to-b from-accent to-transparent" />
          <div className="absolute bottom-0 right-0 w-16 h-px bg-gradient-to-l from-purple to-transparent" />
          <div className="absolute bottom-0 right-0 h-16 w-px bg-gradient-to-t from-purple to-transparent" />
        </>
      )}

      {children}
    </motion.div>
  )
}

// Project card inner content
interface ProjectCardContentProps {
  project: typeof portfolioItems[number]
}

function ProjectCardContent({ project }: ProjectCardContentProps) {
  const colors = project.angle ? angleColors[project.angle] : null

  return (
    <div className="grid lg:grid-cols-[1fr_auto] gap-6 lg:gap-12">
      <div>
        {/* Header: Label + Angle badge */}
        <div className="flex items-center gap-4 mb-6">
          <span className="font-mono text-[clamp(0.65rem,1.5vw,0.75rem)] tracking-wider uppercase text-accent">
            {project.label}
          </span>
          {project.angle && colors && (
            <span
              className={`font-mono text-[clamp(0.55rem,1vw,0.65rem)] tracking-wider uppercase px-2 py-1 ${colors.text} ${colors.bg} border ${colors.border}`}
            >
              {angleLabels[project.angle]}
            </span>
          )}
        </div>

        {/* Problem */}
        <p className="text-text-secondary font-light text-[clamp(0.95rem,2vw,1.15rem)] leading-relaxed mb-4">
          {project.problem}
        </p>

        {/* Outcome */}
        <p className="text-text-primary font-medium text-[clamp(1rem,2.25vw,1.25rem)] leading-relaxed">
          → {project.outcome}
        </p>
      </div>

      {/* Stack tags */}
      <div className="flex lg:flex-col flex-wrap gap-2 lg:justify-center">
        {project.stack.map((tech) => (
          <span
            key={tech}
            className="font-mono text-[clamp(0.55rem,1vw,0.65rem)] px-3 py-1.5 bg-white/5 text-text-muted border border-white/5"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  )
}

// Parallax image section
function ParallaxImage() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 1, 1, 0.3])

  return (
    <div ref={ref} className="relative h-[60vh] lg:h-[80vh] overflow-hidden my-16 lg:my-24">
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg-primary via-transparent to-bg-primary z-10 pointer-events-none" />

      {/* Parallax image container */}
      <motion.div
        className="absolute inset-0"
        style={{ y, scale, opacity }}
      >
        {/* Placeholder gradient - replace with actual image */}
        <div className="w-full h-full bg-gradient-to-br from-bg-tertiary via-bg-secondary to-bg-tertiary">
          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(to right, var(--accent) 1px, transparent 1px),
                linear-gradient(to bottom, var(--accent) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
            }}
          />

          {/* Center glow */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 rounded-full bg-accent/10 blur-3xl" />
          </div>
        </div>
      </motion.div>

      {/* Floating text overlay */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
        style={{ opacity: useTransform(scrollYProgress, [0.3, 0.5, 0.7], [0, 1, 0]) }}
      >
        <span className="font-mono text-[clamp(0.7rem,1.5vw,0.85rem)] tracking-[0.3em] uppercase text-accent/70">
          The pattern persists
        </span>
      </motion.div>
    </div>
  )
}

