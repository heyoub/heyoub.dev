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
  label: 'Systems Builder · AI Workflow Infrastructure · Rust & TypeScript',
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
// VIDEO INTERLUDE / "THE MOMENT" SECTION
// ============================================================================

export interface MomentContent {
  lines: string[]
  closer: {
    before: string
    emphasis: string
  }
}

export const momentContent: MomentContent = {
  lines: [
    'It starts with a tap.',
    'Your finger hesitates over "submit" for the thousandth time.',
    'Another spreadsheet. Another app. Another fix.',
    'But the chaos remains.',
    '',
    'What if the problem isn\'t you at all?',
    'What if the software you use daily was built to fight your brain?',
  ],
  closer: {
    before: "That's why I build",
    emphasis: 'differently.',
  },
}

// ============================================================================
// CORE THESIS SECTION
// ============================================================================

export interface Stat {
  value: string
  description: string
  accent: 'accent' | 'purple' | 'green'
}

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
  problem: {
    hook: string
    narrative: string[]
    definition: {
      term: string
      meaning: string
    }
    stats: Stat[]
  }
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
  problem: {
    hook: 'Ever seen a grown adult break down over a password reset?',
    narrative: [
      'Ever watched someone avoid their CRM like it\'s a haunted house?',
      'Seen a colleague stare helplessly at a screen overloaded with dropdowns?',
      'Heard someone sigh, "I\'m just bad at keeping track of things"—when the real problem is their tools?',
    ],
    definition: {
      term: 'Cognitive Overload',
      meaning: 'Mental exhaustion caused by badly designed systems.',
    },
    stats: [
      {
        value: '40% longer',
        description: 'Users take to complete tasks in poorly structured interfaces',
        accent: 'accent',
      },
      {
        value: '2x error rates',
        description: 'When systems overload your brain with tiny decisions',
        accent: 'purple',
      },
      {
        value: '3x abandonment',
        description: 'Not because users don\'t need it—because it\'s mentally exhausting',
        accent: 'green',
      },
    ],
  },
  universalTruth: {
    before: "This isn't about special modes or accessibility theater.",
    emphasis: 'Cognitive ease is just better engineering.',
    after: "If it's easier for the most overloaded user, it's smoother for everyone.",
  },
  techStackLabel: 'Full Stack',
}

// Standalone pillars - used by GalleryScroll
export const pillars: Pillar[] = [
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
]

export interface TechTag {
  name: string
  color: 'orange' | 'warm' | 'purple' | 'green' | 'accent' | 'pink'
}

// Inverted pyramid - widest at top, narrows to point
// Story: from bare metal to intelligence, complexity gets abstracted
export interface StackLayer {
  label: string
  hint: string
  techs: TechTag[]
}

export const stackPyramid: StackLayer[] = [
  {
    label: 'METAL',
    hint: 'where cycles matter',
    techs: [
      { name: 'Rust', color: 'orange' },
      { name: 'WASM', color: 'purple' },
      { name: 'Cargo', color: 'warm' },
    ],
  },
  {
    label: 'RUNTIME',
    hint: 'where state lives',
    techs: [
      { name: 'TypeScript', color: 'accent' },
      { name: 'Effect', color: 'accent' },
      { name: 'Node.js', color: 'green' },
    ],
  },
  {
    label: 'PRODUCT',
    hint: 'where people land',
    techs: [
      { name: 'Astro', color: 'orange' },
      { name: 'React', color: 'accent' },
      { name: 'Vitest', color: 'green' },
    ],
  },
  {
    label: 'INTELLIGENCE',
    hint: 'where agents work',
    techs: [
      { name: 'MCP', color: 'purple' },
      { name: 'Agents', color: 'warm' },
    ],
  },
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

export interface Service {
  title: string
  description: string
  accent: 'accent' | 'purple' | 'green'
}

export interface OpenToContent {
  heading: string
  description: string
  services: Service[]
  roles: string[]
}

export const openToContent: OpenToContent = {
  heading: "Let's Build",
  description:
    "I'm looking for teams building real systems—or rescuing promising ones from prototype purgatory.",
  services: [
    {
      title: 'Practical AI Integration',
      description: 'Intelligent features designed to simplify tasks, not complicate them.',
      accent: 'accent',
    },
    {
      title: 'Tailored Systems & Workflows',
      description: 'Custom-built solutions that reflect your natural cognitive patterns.',
      accent: 'purple',
    },
    {
      title: 'Cognitive Load Reduction',
      description: 'Interfaces meticulously crafted to eliminate decision fatigue.',
      accent: 'green',
    },
  ],
  roles: [
    'Systems Architecture',
    'AI Infrastructure',
    'Production Hardening',
    'Product Engineering',
    'Architecture Consulting',
    'Technical Co-Founder',
  ],
}

