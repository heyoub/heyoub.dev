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
    hint: 'where users live',
    techs: [
      { name: 'Astro', color: 'orange' },
      { name: 'React', color: 'accent' },
      { name: 'Convex', color: 'accent' },
      { name: 'Vitest', color: 'green' },
    ],
  },
  {
    label: 'INTELLIGENCE',
    hint: 'where patterns emerge',
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
  hook: {
    label: string
    lines: string[]
    close: string
  }
}

export const openToContent: OpenToContent = {
  heading: "Let's Build",
  description:
    'I want teams building real systems — or rescuing promising ones from prototype purgatory.',
  services: [
    {
      title: 'AI that earns its keep',
      description: 'Features that do the work — not a chatbot bolted to your dashboard so the deck looks current.',
      accent: 'accent',
    },
    {
      title: 'Systems shaped like your team',
      description: "Workflows built around how you actually think — not how the SaaS you're escaping wanted you to.",
      accent: 'purple',
    },
    {
      title: 'Fewer decisions, on purpose',
      description: "Every dropdown is a tax on someone's attention. I collect less of it.",
      accent: 'green',
    },
  ],
  // Grounded in Eassa's REAL "former operator" background (mortgage + accounting
  // + sales). Validated & deliberately ABSTRACT: he worked relationship-basis and
  // won't discuss client financials in public — so no names, numbers, or war-story
  // specifics, ever. Keep it at the "who carries the complexity" lens. Every word true.
  hook: {
    label: 'Before I built systems, I ran them',
    lines: [
      "Mortgage. Accounting. Sales. The work where a clumsy interface isn't a bad review — it's someone's close, someone's money, someone's mistake to sign off on.",
      "So I don't treat complexity as abstract. It's a cost, and someone always pays it — usually the person with the least room to.",
    ],
    close:
      "That's the lens. Work with me and it's the question I keep asking about your product: who's carrying this — and can we hand it to the machine instead?",
  },
}

// ============================================================================
// PRODUCTS — where the pattern ships (cards in GalleryScroll)
// ============================================================================

export interface ProductPoint {
  label: string
  title: string
  detail: string
}

export interface ProductCard {
  name: string
  tagline: string
  body: string
  points: ProductPoint[]
  link: { url: string; label: string }
  accent: 'accent' | 'purple'
}

export const productCards: ProductCard[] = [
  {
    name: 'LiteShip',
    tagline: "You're looking at it.",
    body: "Every responsive site is a lie you maintain by hand — breakpoints here, a theme toggle there, ARIA you forgot, a shader that drifts the moment you touch the CSS. LiteShip kills the drift: one definition, a signal quantized into named states, casts itself to every surface. signal → boundary → graph → cast → patch. This portfolio runs on it.",
    points: [
      { label: 'One definition', title: 'Every surface', detail: 'CSS, GLSL, ARIA, an AI manifest, and a TypeScript union — cast from one signal.' },
      { label: 'Content-addressed', title: "Can't drift", detail: 'Each cast is hashed; the surfaces physically cannot fall out of sync.' },
      { label: 'Text-safe', title: 'No eval, ever', detail: 'Untrusted text never becomes executable code — safe by construction.' },
    ],
    link: { url: 'https://freebatteryfactory.com/liteship/overview', label: 'liteship/overview' },
    accent: 'accent',
  },
  {
    name: 'batpak',
    tagline: "A battery doesn't own the machine. It powers one boundary.",
    body: "An embedded, append-only journal for Rust that refuses to be a database. Tamper-evident memory you can rebuild from zero — the kind of record you want when a bad write isn't a bug report, it's evidence. It does one thing, and it can prove it did.",
    points: [
      { label: 'Hash-chained', title: 'Tamper-evident', detail: 'Blake3 ancestry links every event; you can prove nothing was altered.' },
      { label: 'Deterministic', title: 'Replay from zero', detail: 'Rebuild the whole state from the log; verifiable receipts for every write.' },
      { label: 'Proven', title: '103 invariants', detail: 'Traced to 150 artifacts — loom concurrency proofs, chaos-tested with fault injection.' },
    ],
    link: { url: 'https://freebatteryfactory.com/batpak/overview', label: 'batpak/overview' },
    accent: 'purple',
  },
]

