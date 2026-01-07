import { motion } from 'framer-motion'
import { scrollReveal, staggerContainer, staggerItem, viewportConfig } from '@/lib/animations'

const roles = [
  'Full-Stack Architecture',
  'Cross-Domain Integration',
  'AI Systems Engineering',
  'Technical Architecture Consulting',
  'Technical Co-Founder',
]

export function OpenTo() {
  return (
    <section className="py-24 px-[8vw] bg-gradient-to-br from-accent/[0.03] to-purple/[0.03] border-y border-white/5">
      <motion.div
        className="flex flex-col lg:flex-row justify-between items-center gap-12"
        variants={scrollReveal}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
      >
        <div className="text-center lg:text-left">
          <h3 className="font-serif text-3xl mb-4">Open to Opportunities</h3>
          <p className="text-text-secondary font-light max-w-lg">
            Looking for roles where I can preserve mental models, extend them with architectural
            depth, and build systems where thinking becomes structure. Let's create software that
            feels inevitable.
          </p>
        </div>

        <motion.div
          className="flex flex-wrap justify-center gap-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          {roles.map((role, index) => (
            <motion.span
              key={role}
              className={`font-mono text-xs tracking-wider px-5 py-3 border transition-colors ${
                index === roles.length - 1
                  ? 'border-accent/10 text-accent/40 hover:bg-accent/5'
                  : 'border-accent/30 text-accent hover:bg-accent/10'
              }`}
              variants={staggerItem}
            >
              {role}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
