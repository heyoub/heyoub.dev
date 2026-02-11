import { motion } from 'framer-motion'
import { scrollReveal, staggerContainer, staggerItem, viewportConfig } from '@/lib/animations'
import { openToContent } from '@/data/content'

export function OpenTo() {
  return (
    <section className="py-[clamp(1.5rem,6vw,6rem)] px-[8vw] bg-gradient-to-br from-accent/[0.03] to-purple/[0.03] border-y border-white/5">
      <motion.div
        className="flex flex-col lg:flex-row justify-between items-center gap-8 md:gap-12"
        variants={scrollReveal}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
      >
        <div className="text-center lg:text-left">
          <h3 className="font-serif text-[clamp(1.5rem,4vw,2rem)] mb-4">{openToContent.heading}</h3>
          <p className="text-text-secondary font-light text-[clamp(0.95rem,2vw,1.125rem)] max-w-lg">
            {openToContent.description}
          </p>
        </div>

        <motion.div
          className="flex flex-wrap justify-center gap-2 md:gap-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          {openToContent.roles.map((role, index) => (
            <motion.button
              key={role}
              className={`font-mono text-[clamp(0.65rem,1.5vw,0.75rem)] tracking-wider px-4 md:px-5 py-2.5 md:py-3 border transition-colors touch-target focus-ring press-effect tap-highlight ${
                index === openToContent.roles.length - 1
                  ? 'border-accent/10 text-accent/40 hover:bg-accent/5 active:bg-accent/5'
                  : 'border-accent/30 text-accent hover:bg-accent/10 active:bg-accent/10'
              }`}
              variants={staggerItem}
            >
              {role}
            </motion.button>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
