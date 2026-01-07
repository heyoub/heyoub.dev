import { motion } from 'framer-motion'
import { scrollReveal, staggerContainer, staggerItem, viewportConfig } from '@/lib/animations'

const domains = [
  { years: '2017-2018', title: 'Mortgage Lending', insight: 'Constraint networks, compliance' },
  { years: '2021-PRESENT', title: 'Mortgage Broker', insight: 'Custom solutions, NMLS licensed' },
  { years: '2022-2025', title: 'Accounting & Strategy', insight: 'Data flows, client success' },
  { years: '2024-PRESENT', title: 'Technical Architecture', insight: 'Systems design, AI integration' },
]

export function CrossDomain() {
  return (
    <section className="py-32 px-[8vw] bg-bg-secondary border-y border-white/5">
      <motion.div
        className="section-label"
        variants={scrollReveal}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
      >
        Cross-Domain Synthesis
      </motion.div>

      <motion.div
        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
      >
        {domains.map((domain) => (
          <motion.div
            key={domain.title}
            className="p-6 bg-white/[0.02] border border-white/5 text-center hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300 hover:-translate-y-1"
            variants={staggerItem}
          >
            <div className="font-mono text-[0.65rem] tracking-widest text-accent mb-3">
              {domain.years}
            </div>
            <h4 className="font-serif text-lg mb-2">{domain.title}</h4>
            <p className="text-sm text-text-muted font-light">{domain.insight}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
