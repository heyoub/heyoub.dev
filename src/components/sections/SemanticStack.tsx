import { motion } from 'framer-motion'
import { scrollReveal, staggerContainer, staggerItem, viewportConfig } from '@/lib/animations'

const mentalModels = [
  {
    id: 'constraints-first',
    label: 'Constraints Define Structure',
    description: `Start with what can't change. Domain constraints, physics, regulations — these aren't afterthoughts.
      They become the type system. Structure follows constraint.`,
    color: 'accent',
  },
  {
    id: 'events-over-state',
    label: 'Events Over State',
    description: `State is a lie. It's always derived. I build systems where the event log is truth and state is computed.
      Time travel and audit trails come free.`,
    color: 'purple',
  },
  {
    id: 'mental-model-preservation',
    label: 'Mental Model Preservation',
    description: `I don't force users into my abstractions. I extend their mental model with depth. The interface speaks
      their domain language, not mine.`,
    color: 'warm',
  },
  {
    id: 'behavior-in-types',
    label: 'Behavior Encoded in Types',
    description: `Types aren't just data shape — they're behavior contracts. The compiler enforces domain logic.
      Crash hard, burn loud, start fast. No runtime surprises.`,
    color: 'green',
  },
  {
    id: 'physics-visible',
    label: 'Make Physics Visible',
    description: `Memory hierarchy costs, energy budgets, latency — the physics of hardware should be visible in software.
      Language boundaries follow physics boundaries.`,
    color: 'orange',
  },
  {
    id: 'synthesis-over-silos',
    label: 'Cross-Domain Synthesis',
    description: `Traditional boundaries between domains are arbitrary. Business logic compiles. ML respects physics.
      Infrastructure becomes interface. I see patterns others miss.`,
    color: 'pink',
  },
]

export function SemanticStack() {
  return (
    <section className="py-32 px-[8vw] bg-bg-secondary border-y border-white/5">
      <motion.div
        className="section-label"
        variants={scrollReveal}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
      >
        How I Think About Systems
      </motion.div>

      <motion.div
        className="text-center max-w-2xl mx-auto mb-16"
        variants={scrollReveal}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
      >
        <h2 className="font-serif text-4xl mb-4">Mental Models</h2>
        <p className="text-text-secondary font-light text-lg">
          Every system I build follows these core principles. Not methodologies or frameworks —
          fundamental ways of seeing how software should work.
        </p>
      </motion.div>

      <motion.div
        className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
      >
        {mentalModels.map((model) => (
          <motion.div
            key={model.id}
            className="p-6 bg-bg-tertiary border border-white/5 hover:border-white/10 transition-all duration-300"
            variants={staggerItem}
          >
            <div
              className="font-mono text-xs tracking-[0.15em] uppercase mb-3"
              style={{ color: `var(--${model.color})` }}
            >
              {model.label}
            </div>
            <p className="text-text-secondary font-light text-sm leading-relaxed">
              {model.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
