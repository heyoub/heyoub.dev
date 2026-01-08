// CoreThesis.tsx
import { motion } from 'framer-motion'
import { scrollReveal, staggerContainer, staggerItem, viewportConfig } from '@/lib/animations'

const techStack = [
  { name: 'Rust', color: 'orange' },
  { name: 'OCaml', color: 'warm' },
  { name: 'Elixir', color: 'purple' },
  { name: 'Python', color: 'green' },
  { name: 'Go', color: 'accent' },
  { name: 'TypeScript', color: 'accent' },
  { name: 'React', color: 'accent' },
  { name: 'Effect-TS', color: 'accent' },
  { name: 'Convex', color: 'accent' },
  { name: 'Phoenix', color: 'purple' },
  { name: 'PyTorch', color: 'orange' },
  { name: 'WASM', color: 'purple' },
]

export function CoreThesis() {
  return (
    <section
      id="thesis"
      className="py-[clamp(2.5rem,10vw,10rem)] px-[8vw] bg-bg-secondary border-y border-white/5 text-center"
    >
      <motion.div
        className="max-w-4xl mx-auto"
        variants={scrollReveal}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
      >
        <h2 className="font-serif text-[clamp(1.8rem,4vw,2.8rem)] font-normal leading-snug mb-6 md:mb-8">
          Most developers force users to understand their architecture.{' '}
          <em className="text-accent">I preserve yours and extend it with depth.</em>
        </h2>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 text-left mt-8 md:mt-12">
          <p className="text-text-secondary font-light text-[clamp(1rem,2.5vw,1.25rem)] leading-relaxed">
            I build type systems that encode behavior, not just data.{' '}
            <strong className="text-text-primary font-medium">
              The compiler enforces your domain logic
            </strong>{' '}
            — crash hard, burn loud, start fast. No runtime surprises.
          </p>
          <p className="text-text-secondary font-light text-[clamp(1rem,2.5vw,1.25rem)] leading-relaxed">
            Your mental model becomes the structure. Real constraints — HIPAA rules, energy costs,
            user cognitive load —{' '}
            <strong className="text-text-primary font-medium">
              become architectural guarantees
            </strong>
            . Illegal states become unrepresentable.
          </p>
        </div>

        {/* Tech Stack */}
        <motion.div
          className="mt-12 md:mt-16 pt-8 md:pt-12 border-t border-white/5"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          <div className="font-mono text-[clamp(0.65rem,1.5vw,0.75rem)] tracking-[0.3em] uppercase text-text-muted mb-6">
            Full Stack
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
