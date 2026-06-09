import { motion } from 'framer-motion'
import { scrollReveal, staggerContainer, staggerItem, viewportConfig } from '@/lib/animations'
import { openToContent } from '@/data/content'

export function OpenTo() {
  return (
    <section
      id="services"
      className="py-[clamp(1.5rem,6vw,6rem)] px-[8vw] bg-gradient-to-br from-accent/[0.03] to-purple/[0.03] border-y border-white/5"
    >
      <motion.div
        className="flex flex-col items-center gap-8 md:gap-12"
        variants={scrollReveal}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
      >
        {/* Heading + Description */}
        <div className="text-center">
          <h3 className="font-serif text-[clamp(1.5rem,4vw,2rem)] mb-4">{openToContent.heading}</h3>
          <p className="text-text-secondary font-light text-[clamp(0.95rem,2vw,1.125rem)] max-w-lg mx-auto">
            {openToContent.description}
          </p>
        </div>

        {/* Services grid */}
        <motion.div
          className="grid md:grid-cols-3 gap-3 md:gap-4 w-full max-w-5xl"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          {openToContent.services.map((service) => (
            <motion.div
              key={service.title}
              className="p-4 md:p-5 bg-bg-tertiary/50 border border-white/5 hover:border-white/10 transition-all duration-300 border-t-2"
              style={{ borderTopColor: `var(--${service.accent})` }}
              variants={staggerItem}
            >
              <h4
                className="font-serif text-[clamp(1rem,1.8vw,1.15rem)] mb-2"
                style={{ color: `var(--${service.accent})` }}
              >
                {service.title}
              </h4>
              <p className="text-text-secondary font-light text-[clamp(0.85rem,1.5vw,0.95rem)] leading-snug">
                {service.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Role buttons */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 md:gap-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          {openToContent.roles.map((role, index) => (
            <motion.span
              key={role}
              className={`font-mono text-[clamp(0.65rem,1.5vw,0.75rem)] tracking-wider px-4 md:px-5 py-2.5 md:py-3 border transition-colors ${
                index === openToContent.roles.length - 1
                  ? 'border-accent/10 text-accent/40'
                  : 'border-accent/30 text-accent'
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
