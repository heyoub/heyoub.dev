export interface Capability {
  id: string
  title: string
  description: string
  impact: string
  examples: string[]
}

export const capabilities: Capability[] = [
  {
    id: 'constraint-systems',
    title: 'Constraint-Driven Type Systems',
    description: `I build type systems that encode your domain's reality. HIPAA rules, financial regulations,
      energy budgets — constraints become compile-time guarantees, not runtime surprises.`,
    impact: 'Illegal states become unrepresentable. The compiler enforces your business logic.',
    examples: ['Healthcare Compliance', 'Financial Modeling', 'Resource-Constrained ML'],
  },
  {
    id: 'multi-agent',
    title: 'Multi-Agent AI Orchestration',
    description: `I design specialized AI agent systems with consensus mechanisms. Each agent handles what it does best,
      coordinating through structured protocols — not prompt engineering spaghetti.`,
    impact: 'Predictable AI behavior. Auditable decision paths. No black-box chaos.',
    examples: ['Business Process Automation', 'Hybrid Routing Systems', 'Decision Support Tools'],
  },
  {
    id: 'cognitive-interfaces',
    title: 'Cognitive-First Interfaces',
    description: `I build interfaces that preserve your mental model. Max 3 choices per screen.
      Neurodivergent-friendly. Zero cognitive overhead between thought and action.`,
    impact: 'Users think in their domain, not your abstractions. Software feels like thinking.',
    examples: ['Healthcare Tools', 'Financial Dashboards', 'Business Operating Systems'],
  },
  {
    id: 'event-architectures',
    title: 'Event-Sourced Architectures',
    description: `I design systems where state is derived, never stored. Append-only logs as truth,
      with deterministic derivation. Time travel and audit trails come free.`,
    impact: 'Complete system history. Reproducible bugs. Compliance audit trails built-in.',
    examples: ['CRM Systems', 'Financial Platforms', 'Healthcare Records'],
  },
  {
    id: 'cross-domain',
    title: 'Cross-Domain System Integration',
    description: `I bridge traditionally separate domains. Business logic meets ML. Spreadsheets become compilers.
      Infrastructure becomes interfaces. I see connections others miss.`,
    impact: 'Unified systems that eliminate data silos and translation layers.',
    examples: ['Business Logic Compilers', 'Hybrid AI Systems', 'Full-Stack Platforms'],
  },
  {
    id: 'physics-aware',
    title: 'Physics-Aware Computing',
    description: `I build systems that respect physical reality. Memory hierarchy costs, energy budgets,
      latency constraints — the physics of hardware becomes visible in software design.`,
    impact: 'Predictable performance. No surprises at scale. Resource efficiency by design.',
    examples: ['ML Infrastructure', 'Real-Time Systems', 'Resource-Constrained Platforms'],
  },
]
