import { motion } from 'framer-motion'
import { scrollReveal, viewportConfig } from '@/lib/animations'

export function Philosophy() {
  return (
    <section className="py-48 px-[8vw] text-center">
      <motion.blockquote
        className="font-serif text-[clamp(1.5rem,3.5vw,2.2rem)] italic max-w-4xl mx-auto leading-relaxed text-text-secondary mb-8"
        variants={scrollReveal}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
      >
        "The receipts prove legitimacy.{' '}
        <strong className="text-text-primary font-normal">
          Depth of engagement with sophisticated people
        </strong>{' '}
        matters more than follower counts. Let the work speak through layered disclosure."
      </motion.blockquote>
      <motion.div
        className="font-mono text-xs tracking-[0.3em] uppercase text-text-muted"
        variants={scrollReveal}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
      >
        The Omar Principle
      </motion.div>
    </section>
  )
}
