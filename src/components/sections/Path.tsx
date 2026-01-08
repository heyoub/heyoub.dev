import { motion } from 'framer-motion'
import { scrollReveal, staggerContainer, staggerItem, viewportConfig } from '@/lib/animations'

const timeline = [
  {
    year: 'Foundation',
    title: 'Constraints Define Structure',
    description: 'Domain constraints, physics, regulations — these become the type system. Structure follows constraint. HIPAA rules compile. Energy budgets enforce. Illegal states become unrepresentable.',
    company: 'Type Systems · Compile-Time Guarantees',
  },
  {
    year: 'Architecture',
    title: 'Events Over State',
    description: 'State is derived, never stored. Append-only logs as truth with deterministic derivation. Time travel and audit trails come free. Complete system history. Reproducible bugs.',
    company: 'Event Sourcing · Temporal Logic',
  },
  {
    year: 'Evolution',
    title: 'Circular Continuity',
    description: 'Objects evolve bidirectionally. Note → Task → Workflow, and back. Transform + Ghost mechanics preserve provenance. Information never gets trapped in dead ends.',
    company: 'Entity Evolution · Reversible Windows',
  },
  {
    year: 'Interface',
    title: 'Cognitive-First Design',
    description: "I don't force users into my abstractions. Max 3 choices per screen. Neurodivergent-friendly. Zero cognitive overhead between thought and action. Mental model preservation at the interface layer.",
    company: 'UX Architecture · Human Systems',
  },
  {
    year: 'Automation',
    title: 'Approve, Don\'t Build',
    description: 'Systems observe patterns, suggest automations. Users approve with one tap. No canvas dragging, no workflow builders. Just work — the system learns and proposes.',
    company: 'Learning Loop · Pattern Detection',
  },
  {
    year: 'Disclosure',
    title: 'Progressive Reveal',
    description: 'Zero-config by default. Four layers: Invisible → Ambient → Detailed → Expert. Features work without configuration. Configuration is a failure mode.',
    company: 'Information Architecture · Cognitive Load',
  },
  {
    year: 'Intelligence',
    title: 'Multi-Agent Orchestration',
    description: 'Specialized AI systems with consensus mechanisms. Each agent handles what it does best, coordinating through structured protocols — not prompt engineering spaghetti. Predictable behavior. Auditable paths.',
    company: 'AI Systems · Hybrid Routing',
  },
  {
    year: 'Determinism',
    title: 'Decimal-Precision Math',
    description: 'AI agents need deterministic computation. Business math with Decimal.js precision. Recency decay, momentum scoring, confidence thresholds — no floating-point surprises.',
    company: 'CAG · Compute-Augmented Generation',
  },
  {
    year: 'Synthesis',
    title: 'Cross-Domain Integration',
    description: 'Traditional boundaries between domains are arbitrary. Business logic compiles. ML respects physics. Infrastructure becomes interface. I see patterns others miss. Connections become systems.',
    company: 'System Architecture · Pattern Recognition',
  },
]

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
        Mental Models
      </motion.div>

      <div className="grid lg:grid-cols-[1fr_2fr] gap-8 md:gap-16 lg:gap-24 items-start">
        <motion.h2
          className="font-serif text-[clamp(1.5rem,5vw,3.5rem)] sticky top-20 md:top-32"
          variants={scrollReveal}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          How I Think
          <br />
          About Systems
        </motion.h2>

        <motion.div
          className="flex flex-col gap-6 md:gap-12"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          {timeline.map((item) => (
            <motion.div
              key={item.year}
              className="grid md:grid-cols-[140px_1fr] gap-4 md:gap-12 pb-6 md:pb-12 border-b border-white/5"
              variants={staggerItem}
            >
              <div className="font-mono text-[clamp(0.85rem,1.75vw,1rem)] text-accent tracking-wider">{item.year}</div>
              <div>
                <h4 className="font-serif text-[clamp(1.125rem,2.5vw,1.5rem)] mb-2 leading-tight">{item.title}</h4>
                <p className="text-text-secondary font-light text-[clamp(0.95rem,2vw,1.125rem)]">{item.description}</p>
                {item.company && (
                  <div className="font-mono text-[clamp(0.65rem,1.5vw,0.75rem)] tracking-wider text-text-muted mt-2">
                    {item.company}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
