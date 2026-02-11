import { motion } from 'framer-motion'
import { scrollReveal, viewportConfig } from '@/lib/animations'
import { pathContent } from '@/data/content'
import { fluidType, fluidLayout } from '@/lib/responsive'

export function Path() {
  return (
    <section
      id="path"
      style={{
        paddingTop: fluidLayout.sectionPy,
        paddingBottom: fluidLayout.sectionPy,
        paddingLeft: fluidLayout.containerPx,
        paddingRight: fluidLayout.containerPx,
      }}
    >
      <motion.div
        className="section-label mb-6 md:mb-8"
        variants={scrollReveal}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
      >
        {pathContent.sectionLabel}
      </motion.div>

      <div className="grid lg:grid-cols-[1fr_2fr] gap-8 md:gap-16 lg:gap-24 items-start">
        <motion.h2
          className="font-serif sticky top-20 md:top-32"
          style={{ fontSize: fluidType.h1 }}
          variants={scrollReveal}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          {pathContent.heading[0]}
          <br />
          {pathContent.heading[1]}
        </motion.h2>

        <motion.p
          className="text-text-secondary font-light leading-relaxed"
          style={{ fontSize: fluidType.lg }}
          variants={scrollReveal}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          {pathContent.body}
        </motion.p>
      </div>
    </section>
  )
}
