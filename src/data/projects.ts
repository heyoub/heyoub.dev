// Simplified portfolio - problem-focused, rescue-angled

export interface PortfolioItem {
  id: string
  label: string
  problem: string
  outcome: string
  stack: string[]
  angle?: 'rescue' | 'ground-up' | 'infrastructure'
}

export const portfolioItems: PortfolioItem[] = [
  {
    id: 'medical-pii',
    label: 'Healthcare',
    problem: 'AI-generated medical tools that leaked PII and failed compliance review',
    outcome: 'Rebuilt with local-only processing. Now HIPAA-compliant by architecture, not policy.',
    stack: ['Rust', 'WASM'],
    angle: 'rescue',
  },
  {
    id: 'agent-memory',
    label: 'AI Infrastructure',
    problem: 'AI agents with no persistent memory — every conversation started from zero',
    outcome: 'Production memory framework with retrieval, decay scoring, and context reconstruction.',
    stack: ['TypeScript', 'Convex'],
    angle: 'ground-up',
  },
  {
    id: 'crm-chaos',
    label: 'Business Systems',
    problem: 'Vibe-coded CRM that worked in demos but broke under real usage',
    outcome: 'Event-sourced rebuild. Full audit trail, max 3 choices per screen, zero data loss.',
    stack: ['React', 'TypeScript', 'Convex'],
    angle: 'rescue',
  },
  {
    id: 'mortgage-compliance',
    label: 'Financial Systems',
    problem: 'Loan eligibility rules scattered across spreadsheets and tribal knowledge',
    outcome: 'Type system that encodes regulations. Illegal loan states become compile errors.',
    stack: ['Effect-TS'],
    angle: 'ground-up',
  },
  {
    id: 'ml-costs',
    label: 'ML Infrastructure',
    problem: 'ML pipeline burning money with no visibility into where compute actually went',
    outcome: 'Memory-hierarchy-aware routing. 6400x cost transparency, predictable scaling.',
    stack: ['Rust', 'OCaml'],
    angle: 'infrastructure',
  },
]
