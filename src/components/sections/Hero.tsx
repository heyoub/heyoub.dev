import { motion } from 'framer-motion'
import { heroLabel, heroName, heroTagline, heroStats, heroPhoto, fadeUp } from '@/lib/animations'

export function Hero() {
  return (
    <section className="min-h-screen grid grid-cols-1 lg:grid-cols-2 items-center px-[8vw] gap-16 relative">
      {/* Content */}
      <div className="max-w-xl lg:max-w-none">
        <motion.div
          className="font-mono text-xs tracking-[0.3em] uppercase text-accent mb-6"
          variants={heroLabel}
          initial="hidden"
          animate="visible"
        >
          Technical Architect · AI Systems & Cross-Domain Synthesis
        </motion.div>

        <motion.h1
          className="font-serif text-[clamp(3.5rem,8vw,7rem)] font-normal leading-[0.95] tracking-tight mb-8"
          variants={heroName}
          initial="hidden"
          animate="visible"
        >
          <span className="block">Eassa</span>
          <span className="block italic text-text-secondary">Ayoub</span>
        </motion.h1>

        <motion.p
          className="text-lg font-light text-text-secondary leading-relaxed mb-8"
          variants={heroTagline}
          initial="hidden"
          animate="visible"
        >
          I build{' '}
          <strong className="text-text-primary font-medium">
            software that feels like thinking
          </strong>
          . Systems where your mental model becomes structure, behavior becomes enforced, and
          complexity dissolves into clarity — without forcing you into abstraction hell.
        </motion.p>

        <motion.div
          className="flex gap-12"
          variants={heroStats}
          initial="hidden"
          animate="visible"
        >
          <Stat number={11} label="Active Projects" />
          <Stat number={6} label="Core Patterns" />
          <Stat number="8+" label="Years Cross-Domain" />
        </motion.div>
      </div>

      {/* Photo */}
      <motion.div
        className="flex justify-center items-center order-first lg:order-last mt-24 lg:mt-0"
        variants={heroPhoto}
        initial="hidden"
        animate="visible"
      >
        <div className="w-[380px] h-[480px] bg-gradient-to-br from-bg-tertiary to-bg-secondary border border-white/[0.08] relative overflow-hidden">
          {/* Gradient accent line */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-cyan-500 to-purple-500" />
          
          {/* Headshot */}
          <img
            src="/assets/Eassa_Headshot_-_Low_Res-1-removebg-preview.png"
            alt="Eassa Ayoub"
            className="w-full h-full object-cover object-top"
          />
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-12 left-[8vw] flex items-center gap-4 font-mono text-xs tracking-widest text-text-muted"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 1 }}
      >
        <span className="w-16 h-px bg-gradient-to-r from-text-muted to-transparent" />
        <span>Scroll to explore</span>
      </motion.div>
    </section>
  )
}

function Stat({ number, label }: { number: number | string; label: string }) {
  return (
    <div className="text-center">
      <div className="font-serif text-4xl text-accent leading-none">{number}</div>
      <div className="font-mono text-[0.65rem] tracking-[0.15em] text-text-muted mt-2">
        {label}
      </div>
    </div>
  )
}
