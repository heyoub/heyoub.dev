import { motion } from 'framer-motion'
import { scrollReveal, viewportConfig } from '@/lib/animations'

export function Signal() {
  return (
    <section className="py-40 px-[8vw] bg-bg-secondary border-y border-white/5">
      <motion.div
        className="max-w-2xl p-16 bg-gradient-to-br from-bg-tertiary to-bg-secondary border border-white/[0.08] relative"
        variants={scrollReveal}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
      >
        {/* Quote mark */}
        <div className="absolute top-4 left-8 font-serif text-[8rem] text-accent/10 leading-none">
          "
        </div>

        <p className="font-serif text-2xl leading-relaxed mb-8">
          I build for the person who <em className="text-accent">always wanted to be an architect</em>{' '}
          but became a construction worker. The frameworks I'm developing should explain themselves
          without jargon — and when they land, the reaction is <em className="text-accent">"whoa."</em>
        </p>

        <p className="font-serif text-2xl leading-relaxed mb-8">
          That's the test. If a foundational concept can't create that moment of recognition in
          someone outside the field, it isn't ready.
        </p>

        <div className="font-mono text-xs tracking-widest text-text-muted">
          — On validation through clarity
        </div>
      </motion.div>
    </section>
  )
}
