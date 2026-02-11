import { motion } from 'framer-motion'
import { scrollReveal, staggerContainer, staggerItem, viewportConfig } from '@/lib/animations'
import { openToContent } from '@/data/content'
import { fluidType, fluidLayout } from '@/lib/responsive'

export function OpenTo() {
  return (
    <section
      className="bg-gradient-to-br from-accent/[0.03] to-purple/[0.03] border-y border-white/5"
      style={{
        paddingTop: fluidLayout.sectionPySmall,
        paddingBottom: fluidLayout.sectionPySmall,
        paddingLeft: fluidLayout.containerPx,
        paddingRight: fluidLayout.containerPx,
      }}
    >
      <motion.div
        className="flex flex-col lg:flex-row justify-between items-center gap-8 md:gap-12"
        variants={scrollReveal}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
      >
        <div className="text-center lg:text-left">
          <h3
            className="font-serif mb-4"
            style={{ fontSize: fluidType.h2 }}
          >
            {openToContent.heading}
          </h3>
          <p
            className="text-text-secondary font-light max-w-lg"
            style={{ fontSize: fluidType.base }}
          >
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
            <motion.span
              key={role}
              className={`font-mono tracking-wider px-4 md:px-5 py-2.5 md:py-3 border transition-colors ${
                index === openToContent.roles.length - 1
                  ? 'border-accent/10 text-accent/40'
                  : 'border-accent/30 text-accent hover:bg-accent/10'
              }`}
              style={{ fontSize: fluidType.heroLabel }}
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
