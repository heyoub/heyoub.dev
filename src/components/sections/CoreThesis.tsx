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

const pillars = [
  {
    label: 'Systems Thinking',
    title: 'Prevention over patches',
    description:
      "It's the difference between fixing a leaky pipe and redesigning the plumbing so leaks don't happen. I build systems that prevent fires—not put them out.",
    accent: 'accent',
  },
  {
    label: 'Cognitive-First',
    title: 'Designed for how brains work',
    description:
      "Users take 40% longer to complete tasks when software fights their cognition. Error rates double with poor information structure. I understand these challenges intimately—and I build for them.",
    accent: 'purple',
  },
  {
    label: 'Type Guarantees',
    title: 'Constraints become compile-time',
    description:
      "Your mental model becomes the structure. HIPAA rules, energy costs, cognitive load—they become architectural guarantees. Illegal states become unrepresentable.",
    accent: 'green',
  },
]

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
            Ever spent hours solving the same problem again and again?
          </motion.p>
          <h2 className="font-serif text-[clamp(1.8rem,4vw,2.8rem)] font-normal leading-snug mb-6">
            Most software fights how your brain works.{' '}
            <em className="text-accent">Mine doesn't.</em>
          </h2>
          <p className="text-text-secondary font-light text-[clamp(1rem,2vw,1.15rem)] leading-relaxed max-w-3xl mx-auto">
            The problem isn't users being "bad at tech." It's tech being bad at understanding users.
            When software adds cognitive burden instead of reducing it, everyone suffers—but some
            far more than others.{' '}
            <span className="text-text-primary">
              I build systems where complexity dissolves into clarity.
            </span>
          </p>
        </div>

        {/* Three Pillars - Eye-flow optimized grid */}
        <motion.div
          className="grid md:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          {pillars.map((pillar) => (
            <motion.div
              key={pillar.label}
              className="p-6 md:p-8 bg-bg-tertiary/50 border border-white/5 hover:border-white/10 transition-all duration-300 group"
              variants={staggerItem}
            >
              <div
                className="font-mono text-[clamp(0.6rem,1.2vw,0.7rem)] tracking-[0.2em] uppercase mb-3"
                style={{ color: `var(--${pillar.accent})` }}
              >
                {pillar.label}
              </div>
              <h3 className="font-serif text-[clamp(1.1rem,2vw,1.35rem)] text-text-primary mb-3 group-hover:text-accent transition-colors">
                {pillar.title}
              </h3>
              <p className="text-text-secondary font-light text-[clamp(0.9rem,1.5vw,1rem)] leading-relaxed">
                {pillar.description}
              </p>
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
            This isn't about making "special modes" for different users.{' '}
            <strong className="text-text-primary font-medium">
              When you build for cognitive ease, you create software everyone prefers.
            </strong>{' '}
            Research shows 42% higher productivity in teams using cognitive-optimized workflows.
            The benefits compound across the board.
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
