// CoreThesis.tsx
import { motion } from 'framer-motion'
import { scrollReveal, staggerContainer, staggerItem, viewportConfig } from '@/lib/animations'
import { coreThesisContent, techStack } from '@/data/content'

export function CoreThesis() {
  return (
    <section
      id="thesis"
      className="py-[clamp(2.5rem,10vw,10rem)] px-[8vw] bg-bg-secondary border-y border-white/5"
    >
      <motion.div
        className="max-w-5xl mx-auto"
        variants={scrollReveal}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
      >
        {/* Opening Hook - Provocative */}
        <div className="text-center mb-12 md:mb-16">
          <motion.p
            className="font-mono text-[clamp(0.7rem,1.5vw,0.85rem)] tracking-[0.2em] uppercase text-text-muted mb-4"
            variants={staggerItem}
          >
            {coreThesisContent.hook}
          </motion.p>
          <h2 className="font-serif text-[clamp(1.8rem,4vw,2.8rem)] font-normal leading-snug mb-6">
            {coreThesisContent.headline.regular}{' '}
            <em className="text-accent">{coreThesisContent.headline.emphasis}</em>
          </h2>
          <p className="text-text-secondary font-light text-[clamp(1rem,2vw,1.15rem)] leading-relaxed max-w-3xl mx-auto">
            {coreThesisContent.description.before}{' '}
            <span className="text-text-primary">
              {coreThesisContent.description.emphasis}
            </span>
          </p>
        </div>

        {/* Three Pillars - Tight justified grid */}
        <motion.div
          className="grid md:grid-cols-3 gap-3 md:gap-4 mb-12 md:mb-16"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          {coreThesisContent.pillars.map((pillar) => (
            <motion.div
              key={pillar.label}
              className="p-4 md:p-5 bg-bg-tertiary/50 border border-white/5 hover:border-white/10 transition-all duration-300 group"
              variants={staggerItem}
            >
              <div
                className="font-mono text-[clamp(0.55rem,1.1vw,0.65rem)] tracking-[0.2em] uppercase mb-2"
                style={{ color: `var(--${pillar.accent})` }}
              >
                {pillar.label}
              </div>
              <h3 className="font-serif text-[clamp(1rem,1.8vw,1.25rem)] text-text-primary mb-2 group-hover:text-accent transition-colors leading-tight">
                {pillar.title}
              </h3>
              <p className="text-text-secondary font-light text-[clamp(0.8rem,1.3vw,0.9rem)] leading-snug mb-3">
                {pillar.summary}
              </p>
              {/* Detail bullets in Fira Code */}
              <ul className="space-y-1.5 border-t border-white/5 pt-3">
                {pillar.details.map((detail, idx) => (
                  <li
                    key={idx}
                    className="font-code text-[clamp(0.6rem,1vw,0.7rem)] text-text-muted leading-snug flex items-start gap-1.5"
                  >
                    <span
                      className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0"
                      style={{ backgroundColor: `var(--${pillar.accent})` }}
                    />
                    {detail}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* The Universal Truth - Centered callout */}
        <motion.div
          className="text-center py-8 md:py-10 px-6 border-y border-white/5 mb-12 md:mb-16"
          variants={scrollReveal}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          <p className="text-[clamp(1.1rem,2.5vw,1.4rem)] font-light text-text-secondary leading-relaxed max-w-3xl mx-auto">
            {coreThesisContent.universalTruth.before}{' '}
            <strong className="text-text-primary font-medium">
              {coreThesisContent.universalTruth.emphasis}
            </strong>{' '}
            {coreThesisContent.universalTruth.after}
          </p>
        </motion.div>

        {/* Tech Stack */}
        <motion.div
          className="pt-8 md:pt-10 border-t border-white/5 text-center"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          <div className="font-mono text-[clamp(0.65rem,1.5vw,0.75rem)] tracking-[0.3em] uppercase text-text-muted mb-6">
            {coreThesisContent.techStackLabel}
          </div>
          <div className="flex flex-wrap gap-2 md:gap-3 justify-center">
            {techStack.map((tech) => (
              <motion.span
                key={tech.name}
                className="tech-tag text-[clamp(0.65rem,1.5vw,0.75rem)]"
                style={{
                  borderColor: `var(--${tech.color})`,
                  color: `var(--${tech.color})`,
                }}
                variants={staggerItem}
              >
                {tech.name}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
