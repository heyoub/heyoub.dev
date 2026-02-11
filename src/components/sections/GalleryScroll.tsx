import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { proofPoints } from '@/data/projects'
import { pathContent, coreThesisContent } from '@/data/content'

// Map principles to their pillar data
const principleMap = {
  attention: coreThesisContent.pillars[0]!,
  rent: coreThesisContent.pillars[1]!,
  constraints: coreThesisContent.pillars[2]!,
} as const

export function GalleryScroll() {
  const sectionRef = useRef<HTMLElement>(null)

  // Track scroll for sticky header fade
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'start -200px'],
  })

  const headerOpacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 1, 0])
  const headerY = useTransform(scrollYProgress, [0, 1], [0, -20])

  return (
    <section ref={sectionRef} id="work" className="relative min-h-screen px-[8vw]">
      {/* Sticky fading header */}
      <div className="sticky top-20 z-0 py-[clamp(2.5rem,8vw,6rem)] pointer-events-none">
        <motion.div style={{ opacity: headerOpacity, y: headerY }}>
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

      {/* Main card - Pattern + Principles with proof */}
      <motion.div
        className="relative z-10 p-6 lg:p-10 bg-bg-tertiary border border-white/5 mb-16"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
      >
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-16 h-px bg-gradient-to-r from-accent to-transparent" />
        <div className="absolute top-0 left-0 h-16 w-px bg-gradient-to-b from-accent to-transparent" />
        <div className="absolute bottom-0 right-0 w-16 h-px bg-gradient-to-l from-purple to-transparent" />
        <div className="absolute bottom-0 right-0 h-16 w-px bg-gradient-to-t from-purple to-transparent" />

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

          {/* Right: Principles with inline proof */}
          <div className="space-y-6">
            {proofPoints.map((point, idx) => {
              const principle = principleMap[point.principle]
              return (
                <motion.div
                  key={point.id}
                  className="group"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  {/* Principle header */}
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: `var(--${principle.accent})` }}
                    />
                    <span className="font-mono text-[clamp(0.6rem,1.25vw,0.7rem)] tracking-wider uppercase text-accent">
                      {principle.label}
                    </span>
                  </div>

                  {/* Principle rule */}
                  <p className="text-text-secondary text-[clamp(0.85rem,1.5vw,0.95rem)] mb-2 pl-4 border-l border-white/10 group-hover:border-accent/30 transition-colors">
                    {principle.title} — <span className="text-text-muted">{principle.summary}</span>
                  </p>

                  {/* Proof point */}
                  <p className="text-text-primary text-[clamp(0.9rem,1.75vw,1rem)] pl-4 font-light">
                    → {point.proof}
                    {point.link && (
                      <a
                        href={point.link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 text-accent/70 hover:text-accent text-[clamp(0.7rem,1.25vw,0.8rem)] font-mono transition-colors"
                      >
                        [{point.link.label}]
                      </a>
                    )}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </motion.div>

      {/* Parallax section */}
      <ParallaxImage />
    </section>
  )
}

// CSS fixed parallax section (webflow-style)
function ParallaxImage() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const textOpacity = useTransform(scrollYProgress, [0.3, 0.5, 0.7], [0, 1, 0])

  return (
    <div
      ref={ref}
      className="relative h-[60vh] lg:h-[80vh] my-16 lg:my-24"
      style={{
        backgroundImage: 'url(/assets/fs/pexels-kevin-ku-glasses.jpg)',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-bg-primary/60" />

      {/* Gradient fade edges */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg-primary via-transparent to-bg-primary pointer-events-none" />

      {/* Floating text */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
        style={{ opacity: textOpacity }}
      >
        <h3
          className="font-serif text-[clamp(2rem,5vw,3.5rem)] text-center leading-tight"
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.9) 50%, #ffffff 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            textShadow: '0 0 40px rgba(165,105,251,0.4), 0 0 80px rgba(165,105,251,0.2)',
            filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.5))',
          }}
        >
          The pattern persists
        </h3>
      </motion.div>
    </div>
  )
}
