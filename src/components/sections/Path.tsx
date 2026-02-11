import { motion } from 'framer-motion'
import { scrollReveal, viewportConfig } from '@/lib/animations'
import { pathContent } from '@/data/content'

export function Path() {
  return (
    <section id="path" className="py-[clamp(2.5rem,10vw,10rem)] px-[8vw]">
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
          className="font-serif text-[clamp(1.5rem,5vw,3.5rem)] sticky top-20 md:top-32"
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
          className="text-text-secondary font-light text-[clamp(1rem,2.5vw,1.25rem)] leading-relaxed"
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
