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

// Domain-Tech Matrix (Capabilities, not projects)
export interface MatrixCell {
  domain: string
  techCategory: string
  capability: string
  stack: string[]
  delivered: string
}

export const matrix: MatrixCell[] = [
  // Healthcare x Type Systems
  {
    domain: 'Healthcare Compliance',
    techCategory: 'Type-Safe Systems',
    capability: 'WASM-powered medical data sanitizers with dual-pipeline PII scrubbing',
    stack: ['Rust', 'WASM', 'BERT NER'],
    delivered: '100% local processing, HIPAA-compliant by design',
  },
  {
    domain: 'Healthcare Compliance',
    techCategory: 'Frontend PWA',
    capability: 'FDA-compliant non-device medication trackers with behavioral psychology',
    stack: ['Go WASM', 'IndexedDB', 'PWA'],
    delivered: 'ADHD-optimized, offline-first, zero server transmission',
  },

  // FinTech x Type Systems
  {
    domain: 'Financial Systems',
    techCategory: 'Type-Safe Systems',
    capability: 'Category theory for compliance — mortgages as typed constraint regions',
    stack: ['Effect-TS', 'Schema', 'Morphisms'],
    delivered: 'Compile-time validation of loan eligibility rules',
  },

  // AI/ML x Infrastructure
  {
    domain: 'AI/ML Infrastructure',
    techCategory: 'Physics-Aware Systems',
    capability: 'Memory-hierarchy-aware ML VMs with Horowitz energy modeling',
    stack: ['Rust', 'OCaml', 'CUDA'],
    delivered: 'Roofline analysis, attention routing, 6400x cost transparency',
  },
  {
    domain: 'AI/ML Infrastructure',
    techCategory: 'Hybrid Architectures',
    capability: 'Tribrid language models with learned per-token pathway routing',
    stack: ['PyTorch', 'Transformers', 'Mamba', 'LNN'],
    delivered: 'O(n²) vs O(n) vs O(1) memory selected dynamically',
  },

  // Business OS x Event Sourcing
  {
    domain: 'Business Operating Systems',
    techCategory: 'Event-Sourced Systems',
    capability: 'Cognition-first CRMs with ECS architecture and circular entity evolution',
    stack: ['React', 'TypeScript', 'Convex'],
    delivered: 'Max 3 choices per screen, full event history, no cognitive overhead',
  },
  {
    domain: 'Business Operating Systems',
    techCategory: 'Multi-Agent AI',
    capability: 'Lead generation engines with 7 behavioral paradigms and consensus mechanisms',
    stack: ['Elixir', 'Phoenix', 'Ash', 'Broadway'],
    delivered: 'Opportune moment detection, transparent scoring, radical honesty',
  },
  {
    domain: 'Business Operating Systems',
    techCategory: 'Workflow Automation',
    capability: 'Document management with morphing modes — text to table to spreadsheet to canvas',
    stack: ['React', 'TypeScript', 'Convex'],
    delivered: 'Context-aware linkification, real-time collaboration, version history',
  },
  {
    domain: 'Business Operating Systems',
    techCategory: 'Invoice & Billing',
    capability: 'Auto-generated invoicing from tasks/workflows with portal-based payment',
    stack: ['React', 'TypeScript', 'Convex'],
    delivered: 'Recurring invoices, tax calculation, aging reports, payment reminders',
  },

  // AI Agents x Business Math
  {
    domain: 'AI Agent Infrastructure',
    techCategory: 'Council Systems',
    capability: 'Multi-persona AI councils with visible deliberation and confidence scoring',
    stack: ['TypeScript', 'Convex', 'CAG'],
    delivered: 'Operator/Strategist/Signal personas, thinking modes, metacognition bootstrapping',
  },
  {
    domain: 'AI Agent Infrastructure',
    techCategory: 'Deterministic Math',
    capability: 'Decimal-precision business math for AI agents with currency/recency/health scoring',
    stack: ['Decimal.js', 'TypeScript'],
    delivered: 'Linear/exponential/log decay, momentum scoring, confidence thresholds',
  },

  // Cross-Domain x Compilers
  {
    domain: 'Cross-Domain Integration',
    techCategory: 'Business Logic Compilers',
    capability: 'Spreadsheet-to-native-code compilers via intermediate representations',
    stack: ['TypeScript', 'C codegen', 'WASM'],
    delivered: 'YAML → WorkIR → optimized binaries, no coding required',
  },
  {
    domain: 'Cross-Domain Integration',
    techCategory: 'Self-Learning Systems',
    capability: 'Real-time pattern detection with automatic automation suggestions',
    stack: ['Convex', 'TypeScript', 'Event Sourcing'],
    delivered: 'Observes user actions, detects patterns, suggests automations with one-tap approval',
  },
]

// Domain categories
export const domains = [
  { id: 'healthcare', name: 'Healthcare Compliance', color: 'green' },
  { id: 'fintech', name: 'Financial Systems', color: 'orange' },
  { id: 'ai-ml', name: 'AI/ML Infrastructure', color: 'accent' },
  { id: 'ai-agents', name: 'AI Agent Infrastructure', color: 'pink' },
  { id: 'business-os', name: 'Business Operating Systems', color: 'warm' },
  { id: 'cross-domain', name: 'Cross-Domain Integration', color: 'purple' },
] as const

// Tech categories
export const techCategories = [
  { id: 'type-systems', name: 'Type-Safe Systems', icon: '🔒' },
  { id: 'ai-ml', name: 'AI / ML', icon: '🤖' },
  { id: 'frontend', name: 'Frontend / PWA', icon: '🎨' },
  { id: 'backend', name: 'Event-Sourced Backend', icon: '⚡' },
  { id: 'compilers', name: 'Compilers / DSLs', icon: '🔧' },
  { id: 'physics', name: 'Physics-Aware', icon: '⚡' },
] as const
