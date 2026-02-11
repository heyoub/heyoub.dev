import { motion } from 'framer-motion'
import { scrollReveal, staggerContainer, staggerItem, viewportConfig } from '@/lib/animations'
import { matrix, domains } from '@/data/projects'
import { portfolioContent } from '@/data/content'

export function Portfolio() {
  return (
    <section id="capabilities" className="py-[clamp(2.5rem,10vw,10rem)] px-[8vw]">
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

      {/* Domain Matrix */}
      <motion.div
        className="space-y-8 md:space-y-12"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
      >
        {domains.map((domain) => {
          const domainCells = matrix.filter((cell) => cell.domain === domain.name)

          return (
            <motion.div key={domain.id} variants={staggerItem}>
              <h3 className="font-serif text-[clamp(1.25rem,3vw,2rem)] mb-4 md:mb-6 flex items-center gap-3">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: `var(--${domain.color})` }}
                />
                {domain.name}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {domainCells.map((cell, idx) => (
                  <motion.div
                    key={idx}
                    className="p-4 md:p-6 bg-bg-tertiary border border-white/5 hover:border-white/10 transition-all duration-300"
                    variants={staggerItem}
                  >
                    <div className="font-mono text-[clamp(0.65rem,1.5vw,0.75rem)] tracking-wider uppercase text-text-muted mb-3">
                      {cell.techCategory}
                    </div>

                    <p className="text-text-primary font-light text-[clamp(0.95rem,2vw,1.125rem)] leading-relaxed mb-4">
                      {cell.capability}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {cell.stack.map((tech) => (
                        <span
                          key={tech}
                          className="font-mono text-[clamp(0.65rem,1.5vw,0.75rem)] px-2.5 md:px-3 py-1.5 bg-white/5 text-accent border border-accent/20"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <p className="text-green font-medium text-[clamp(0.85rem,1.75vw,1rem)] border-t border-white/5 pt-4">
                      → {cell.delivered}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </section>
  )
}
