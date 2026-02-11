import { motion } from 'framer-motion'
import { scrollReveal, staggerContainer, staggerItem, viewportConfig } from '@/lib/animations'
import { portfolioItems } from '@/data/projects'
import { portfolioContent } from '@/data/content'

const angleLabels = {
  rescue: 'Rescue',
  'ground-up': 'Built',
  infrastructure: 'Infrastructure',
} as const

export function Portfolio() {
  return (
    <section id="work" className="py-[clamp(2.5rem,10vw,10rem)] px-[8vw]">
      <motion.div
        className="section-label"
        variants={scrollReveal}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
      >
        {portfolioContent.sectionLabel}
      </motion.div>

      <motion.div
        className="max-w-2xl mb-8 md:mb-16"
        variants={scrollReveal}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
      >
        <h2 className="font-serif text-[clamp(1.5rem,4vw,2.5rem)] mb-4">{portfolioContent.heading}</h2>
        <p className="text-text-secondary font-light text-[clamp(1rem,2.5vw,1.25rem)]">
          {portfolioContent.description}
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
      >
        {portfolioItems.map((item) => (
          <motion.div
            key={item.id}
            className="p-5 md:p-6 bg-bg-tertiary border border-white/5 hover:border-white/10 transition-all duration-300 group"
            variants={staggerItem}
          >
            {/* Header: Label + Angle */}
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-[clamp(0.65rem,1.5vw,0.75rem)] tracking-wider uppercase text-accent">
                {item.label}
              </span>
              {item.angle && (
                <span className={`font-mono text-[clamp(0.6rem,1.25vw,0.7rem)] tracking-wider uppercase px-2 py-1 ${
                  item.angle === 'rescue'
                    ? 'text-orange bg-orange/10 border border-orange/20'
                    : item.angle === 'ground-up'
                    ? 'text-green bg-green/10 border border-green/20'
                    : 'text-purple bg-purple/10 border border-purple/20'
                }`}>
                  {angleLabels[item.angle]}
                </span>
              )}
            </div>

            {/* Problem */}
            <p className="text-text-secondary font-light text-[clamp(0.9rem,1.75vw,1rem)] leading-relaxed mb-4">
              {item.problem}
            </p>

            {/* Outcome */}
            <p className="text-text-primary font-medium text-[clamp(0.95rem,2vw,1.1rem)] leading-relaxed mb-4">
              → {item.outcome}
            </p>

            {/* Stack */}
            <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
              {item.stack.map((tech) => (
                <span
                  key={tech}
                  className="font-mono text-[clamp(0.6rem,1.25vw,0.7rem)] px-2 py-1 bg-white/5 text-text-muted"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
