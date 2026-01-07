import { motion } from 'framer-motion'
import { scrollReveal, staggerContainer, staggerItem, viewportConfig } from '@/lib/animations'
import { capabilities } from '@/data/projects'

export function Portfolio() {
  return (
    <section id="capabilities" className="py-40 px-[8vw]">
      <motion.div
        className="section-label"
        variants={scrollReveal}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
      >
        What I Build
      </motion.div>

      <motion.div
        className="max-w-2xl mb-16"
        variants={scrollReveal}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
      >
        <h2 className="font-serif text-4xl mb-4">Capabilities</h2>
        <p className="text-text-secondary font-light text-lg">
          I don't just write code — I architect systems where constraints become guarantees,
          complexity becomes clarity, and your mental model becomes structure.
        </p>
      </motion.div>

      <motion.div
        className="grid md:grid-cols-2 gap-8"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
      >
        {capabilities.map((capability) => (
          <motion.div
            key={capability.id}
            className="p-8 bg-bg-tertiary border border-white/5 hover:border-white/10 transition-all duration-300"
            variants={staggerItem}
          >
            <h3 className="font-serif text-2xl mb-4">{capability.title}</h3>
            <p className="text-text-secondary font-light text-base leading-relaxed mb-4">
              {capability.description}
            </p>
            <p className="text-accent font-medium text-sm mb-4">{capability.impact}</p>
            <div className="flex flex-wrap gap-2">
              {capability.examples.map((example) => (
                <span
                  key={example}
                  className="font-mono text-[0.6rem] px-3 py-1.5 bg-white/5 text-text-muted border border-white/[0.08]"
                >
                  {example}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
