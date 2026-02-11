// Centralized content configuration
// Edit copy here, not in components
// Pattern follows footer.ts

// ============================================================================
// HERO SECTION
// ============================================================================

export interface HeroContent {
  name: {
    first: string
    last: string
  }
  label: string
  tagline: {
    before: string
    emphasis: string
    after: string
  }
  quote: {
    regular: string
    emphasis: string
  }
  cta: {
    label: string
    action: string
    href: string
  }
  scrollHint: string
  photo: {
    src: string
    alt: string
  }
}

export const heroContent: HeroContent = {
  name: {
    first: 'Eassa',
    last: 'Ayoub',
  },
  label: 'Cognitive-First Systems · Former Operator',
  tagline: {
    before: 'Most software makes users carry its complexity. I build',
    emphasis: 'software that feels like thinking',
    after: '— systems that match how humans actually work.',
  },
  quote: {
    regular: 'The question is never "is this complex?" It\'s "WHO carries the complexity?"',
    emphasis: 'I vote computer.',
  },
  cta: {
    label: 'Book a',
    action: 'Call',
    href: 'https://cal.com/eassa-ayoub-hf9yfh',
  },
  scrollHint: 'Scroll to explore',
  photo: {
    src: '/assets/Eassa_Headshot_-_Low_Res-1-removebg-preview.png',
    alt: 'Eassa Ayoub - Cognitive-first systems architect',
  },
}

// ============================================================================
// CORE THESIS SECTION
// ============================================================================

export interface Pillar {
  label: string
  title: string
  summary: string
  details: string[]
  accent: 'accent' | 'purple' | 'green' | 'orange' | 'warm' | 'pink'
}

export interface CoreThesisContent {
  hook: string
  headline: {
    regular: string
    emphasis: string
  }
  description: {
    before: string
    emphasis: string
  }
  pillars: Pillar[]
  universalTruth: {
    before: string
    emphasis: string
    after: string
  }
  techStackLabel: string
}

export const coreThesisContent: CoreThesisContent = {
  hook: "Here's the pattern I can't unsee:",
  headline: {
    regular: 'Every layer you add is complexity the user eventually carries.',
    emphasis: 'Transfer it back to the machine.',
  },
  description: {
    before:
      "When systems get complicated, people compensate: extra tabs, duplicate notes, 'don't touch that' rituals. Fewer layers in the system, fewer decisions for the user.",
    emphasis: 'Same principle, different scales.',
  },
  pillars: [
    {
      label: 'Protect Attention',
      title: 'Working memory is finite',
      summary: 'Build for that or build friction.',
      details: [
        'Max meaningful choices, not max features',
        'Progressive reveal instead of configuration mazes',
        'Interfaces that preserve the user\'s mental model',
      ],
      accent: 'accent',
    },
    {
      label: 'Earn Your Rent',
      title: 'Every abstraction should earn its place',
      summary: "If it can't justify the hop, it goes.",
      details: [
        'Fewer hops, fewer moving parts',
        'Simpler debugging, clearer ownership',
        'No "platform" theater, just reliable behavior',
      ],
      accent: 'purple',
    },
    {
      label: 'Constraints Are Architecture',
      title: "These aren't limitations",
      summary: "They're the structure. Encode them and illegal states can't exist.",
      details: [
        'Constraints define structure',
        'Auditability by default',
        'Illegal states blocked early, not patched late',
      ],
      accent: 'green',
    },
  ],
  universalTruth: {
    before: "This isn't about special modes or accessibility theater.",
    emphasis: 'Cognitive ease is just better engineering.',
    after: "If it's easier for the most overloaded user, it's smoother for everyone.",
  },
  techStackLabel: 'Full Stack',
}

export interface TechTag {
  name: string
  color: 'orange' | 'warm' | 'purple' | 'green' | 'accent' | 'pink'
}

export const techStack: TechTag[] = [
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

// ============================================================================
// PATH SECTION (The Pattern)
// ============================================================================

export interface PathContent {
  sectionLabel: string
  heading: string[]
  body: string
}

export const pathContent: PathContent = {
  sectionLabel: 'The Pattern',
  heading: ['Same Question,', 'Different Layers'],
  body: 'I don\'t "add AI." I keep pulling on the same thread and interrogate the system until the unnecessary parts confess. The goal is to collapse the distance between intent and truth. In architecture, fewer hops. In UX, fewer decisions. When the same principle works at different scales, I trust it.',
}

// ============================================================================
// OPEN TO SECTION
// ============================================================================

export interface OpenToContent {
  heading: string
  description: string
  roles: string[]
}

export const openToContent: OpenToContent = {
  heading: "Let's Build",
  description:
    "I'm looking for teams building real systems — or rescuing promising ones from prototype purgatory. If correctness, clarity, and operability matter to you, we'll get along.",
  roles: [
    'Systems Architecture',
    'AI Infrastructure',
    'Production Hardening',
    'Product Engineering',
    'Architecture Consulting',
    'Technical Co-Founder',
  ],
}

// ============================================================================
// PORTFOLIO SECTION
// ============================================================================

export interface PortfolioContent {
  sectionLabel: string
  heading: string
  description: string
}

export const portfolioContent: PortfolioContent = {
  sectionLabel: 'The Work',
  heading: 'Where the pattern shows up',
  description:
    "Here's what happens when you pull the same thread across different domains. The patterns keep showing up.",
}
