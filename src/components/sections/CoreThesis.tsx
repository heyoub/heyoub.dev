// CoreThesis.tsx
import { motion } from 'framer-motion'
import { scrollReveal, staggerContainer, staggerItem, viewportConfig } from '@/lib/animations'
import { coreThesisContent, stackPyramid } from '@/data/content'

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

        {/* The Universal Truth - Markdown quote style */}
        <motion.blockquote
          className="border-l-2 border-accent/30 pl-6 py-4 my-8 md:my-10 max-w-3xl mx-auto"
          variants={scrollReveal}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          <p className="text-[clamp(1rem,2vw,1.2rem)] font-light text-text-secondary leading-relaxed italic">
            {coreThesisContent.universalTruth.before}{' '}
            <span className="text-accent not-italic font-medium">
              {coreThesisContent.universalTruth.emphasis}
            </span>{' '}
            {coreThesisContent.universalTruth.after}
          </p>
        </motion.blockquote>

        {/* Tech Stack - Inverted Pyramid */}
        <motion.div
          className="pt-6 md:pt-8 border-t border-white/5"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          <div className="font-mono text-[clamp(0.65rem,1.5vw,0.75rem)] tracking-[0.3em] uppercase text-text-muted mb-8 text-center">
            {coreThesisContent.techStackLabel}
          </div>

          {/* Pyramid container - relative for floating labels */}
          <div className="relative max-w-[85%] mx-auto">
            {/* Floating labels layer - positioned by pyramid edges */}
            <div className="hidden lg:block absolute inset-0 z-10 pointer-events-none">
              {stackPyramid.map((layer, layerIdx) => {
                // Calculate vertical position based on row index
                const topPercent = (layerIdx / stackPyramid.length) * 100
                // Calculate horizontal inset based on pyramid narrowing
                const insetPercent = layerIdx * 8

                return (
                  <div key={layer.label} className="absolute w-full" style={{ top: `${topPercent}%` }}>
                    {/* Left label */}
                    <motion.div
                      className="absolute right-full mr-4 flex items-center gap-2"
                      style={{ left: `${insetPercent}%`, transform: 'translateX(-100%)' }}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: layerIdx * 0.1 }}
                    >
                      <span className="font-mono text-[10px] tracking-[0.2em] text-accent/50">
                        {layer.label}
                      </span>
                      <span className="w-4 h-px bg-accent/20" />
                    </motion.div>

                    {/* Right hint */}
                    <motion.div
                      className="absolute left-full ml-4 flex items-center gap-2"
                      style={{ right: `${insetPercent}%`, transform: 'translateX(0)' }}
                      initial={{ opacity: 0, x: 10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: layerIdx * 0.1 + 0.05 }}
                    >
                      <span className="w-4 h-px bg-white/10" />
                      <span className="font-mono text-[9px] tracking-[0.1em] text-text-muted/40 whitespace-nowrap">
                        {layer.hint}
                      </span>
                    </motion.div>
                  </div>
                )
              })}
            </div>

            {/* Pure pyramid - the visual anchor */}
            <div className="flex flex-col items-center gap-3">
              {stackPyramid.map((layer, layerIdx) => (
                <motion.div
                  key={layer.label}
                  className="flex justify-center gap-1.5 md:gap-2"
                  variants={staggerItem}
                >
                  {layer.techs.map((tech, techIdx) => (
                    <motion.span
                      key={tech.name}
                      className="px-2 py-1 font-mono text-[clamp(0.55rem,1.1vw,0.65rem)] border transition-all duration-300 hover:scale-105"
                      style={{
                        borderColor: `color-mix(in srgb, var(--${tech.color}) 40%, transparent)`,
                        color: `var(--${tech.color})`,
                        backgroundColor: `color-mix(in srgb, var(--${tech.color}) 5%, transparent)`,
                      }}
                      whileHover={{
                        borderColor: `var(--${tech.color})`,
                        backgroundColor: `color-mix(in srgb, var(--${tech.color}) 15%, transparent)`,
                      }}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: layerIdx * 0.1 + techIdx * 0.05 }}
                    >
                      {tech.name}
                    </motion.span>
                  ))}
                </motion.div>
              ))}

              {/* Bottom point */}
              <motion.div
                className="mt-1"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <span className="font-mono text-[10px] text-accent/30">▼</span>
              </motion.div>
            </div>

            {/* Mobile labels - below pyramid */}
            <div className="lg:hidden flex justify-center gap-4 mt-6 flex-wrap">
              {stackPyramid.map((layer) => (
                <span key={layer.label} className="font-mono text-[8px] tracking-[0.15em] text-accent/30">
                  {layer.label}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
