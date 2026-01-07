import { motion } from 'framer-motion'
import { scrollReveal, staggerContainer, staggerItem, viewportConfig } from '@/lib/animations'
import { principles } from '@/data/patterns'

export function Patterns() {
  return (
    <section id="principles" className="py-32 px-[8vw]">
      <motion.div
        className="section-label"
        variants={scrollReveal}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
      >
        How I Build
      </motion.div>

      <motion.div
        className="max-w-2xl mb-16"
        variants={scrollReveal}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
      >
        <h2 className="font-serif text-4xl mb-4">Principles</h2>
        <p className="text-text-secondary font-light text-lg">
          Not methodologies or best practices — these are the core beliefs that shape every system
          I build. Philosophy first, technical depth underneath.
        </p>
      </motion.div>

      <motion.div
        className="grid md:grid-cols-2 gap-8"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
      >
        {principles.map((principle) => (
          <motion.div
            key={principle.id}
            className="p-8 bg-bg-tertiary border border-white/5 hover:border-white/10 transition-all duration-300"
            variants={staggerItem}
          >
            <div className="font-mono text-[0.6rem] tracking-[0.3em] text-accent mb-3">
              Principle {principle.number}
            </div>
            <h3 className="font-serif text-xl mb-4">{principle.title}</h3>

            {/* Philosophy - 65% emphasis with larger text */}
            <p className="text-text-secondary font-light text-base leading-relaxed mb-4">
              {principle.philosophy}
            </p>

            {/* Technical - 35% emphasis with smaller, muted text */}
            <p className="text-text-muted font-light text-sm leading-relaxed border-t border-white/5 pt-4">
              <span className="font-mono text-[0.6rem] tracking-wider uppercase text-accent/60 block mb-2">
                Technical
              </span>
              {principle.technical}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
