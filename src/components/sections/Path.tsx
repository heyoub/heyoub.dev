import { motion } from 'framer-motion'
import { scrollReveal, staggerContainer, staggerItem, viewportConfig } from '@/lib/animations'

const timeline = [
  {
    year: '2017',
    title: 'Pattern Recognition',
    description: "CGP Grey's 'Humans Need Not Apply' crystallized an understanding of AI's trajectory. Started in mortgage lending at New Penn Financial, then Freedom Mortgage.",
    company: 'NMLS Licensed · 25+ States',
  },
  {
    year: '2021',
    title: 'Go Loan Go, LLC',
    description: 'Founded mortgage brokerage. Custom-tailored solutions combining local expertise with national partnerships. Financial strategy meets lending.',
    company: 'Licensed Mortgage Broker · Founder',
  },
  {
    year: '2022-2025',
    title: 'Office Service Solutions',
    description: 'Client Success & Business Strategy. Bookkeeping excellence, strategic deal execution, brand leadership. Launched Agent Ledger project.',
    company: 'Accounting Solutions Expert',
  },
  {
    year: 'Nov 2024',
    title: 'Discovery',
    description: 'First encounter with AI-assisted coding. Recognition of a paradigm shift. Never wrote code without AI collaboration — shipped 11 projects in under a year.',
  },
  {
    year: 'Dec 2024',
    title: 'ForgeStack Labs',
    description: 'Founded technical architecture practice. Advanced frontend-backend integration, dynamic business logic, AI orchestration with RAG pipelines.',
    company: 'Founder & Technical Architect',
  },
  {
    year: 'Now',
    title: 'Building Foundations',
    description: 'Two decades earlier on the timeline of peers like Bret Victor, Alan Kay, Jim Keller, and Chris Lattner. Convergence with frontier research — MCP, thermodynamic computing, hybrid architectures. The work is foundational. The trajectory is generational.',
  },
]

export function Path() {
  return (
    <section id="path" className="py-40 px-[8vw]">
      <motion.div
        className="section-label"
        variants={scrollReveal}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
      >
        Path
      </motion.div>

      <div className="grid lg:grid-cols-[1fr_2fr] gap-24 items-start">
        <motion.h2
          className="font-serif text-5xl sticky top-32"
          variants={scrollReveal}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          The
          <br />
          Trajectory
        </motion.h2>

        <motion.div
          className="flex flex-col gap-12"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          {timeline.map((item) => (
            <motion.div
              key={item.year}
              className="grid md:grid-cols-[120px_1fr] gap-8 pb-12 border-b border-white/5"
              variants={staggerItem}
            >
              <div className="font-mono text-sm text-accent tracking-wider">{item.year}</div>
              <div>
                <h4 className="font-serif text-xl mb-2">{item.title}</h4>
                <p className="text-text-secondary font-light">{item.description}</p>
                {item.company && (
                  <div className="font-mono text-xs tracking-wider text-text-muted mt-2">
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
