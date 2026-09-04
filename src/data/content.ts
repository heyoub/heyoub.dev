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
  label: 'Founder, The Free Battery Factory · Operator-Engineer',
  tagline: {
    before: 'Businesses are full of people doing a job the software should be doing. I build',
    emphasis: 'the machinery underneath',
    after: '— for work somebody has to answer for.',
  },
  quote: {
    regular: `The question is never "is this complex?" It's "who's carrying it?"`,
    emphasis: 'The machine carries the machinery. The operator keeps the judgment.',
  },
  cta: {
    label: 'Book a',
    action: 'Call',
    // Opens the booking chooser (src/components/BookingDialog.astro). Stays a
    // real href so cmd-click and the no-JS path land on the /book page.
    href: '/book',
  },
  scrollHint: 'Scroll to explore',
  photo: {
    src: '/assets/Eassa_Headshot_-_Low_Res-1-removebg-preview.png',
    alt: 'Eassa Ayoub - founder of The Free Battery Factory',
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
    'It usually starts smaller than people admit.',
    'One more dropdown.',
    'One more field.',
    'One more place to remember what the system forgot.',
    '',
    'Then someone says, "I\'m just bad at this."',
    'They\'re usually not.',
    'The system is handing its bookkeeping to a human.',
  ],
  closer: {
    before: 'I build the',
    emphasis: 'other way.',
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
    bridge: string
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
    bridge: "Most overload doesn't arrive as one dramatic failure. It arrives as dozens of tiny decisions the system could have made itself.",
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
    'I want small teams doing work that matters — where getting it wrong costs somebody something real.',
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
    label: 'Before I built the systems, I ran them',
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
  /** Rendered as `var(--<accent>)`, so every member must exist as a token in
   *  globals.css. `warm` is the hero's gold, closest of the three to Macroonz's
   *  own orange without importing a colour the site does not otherwise use. */
  accent: 'accent' | 'purple' | 'warm'
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
      { label: 'Released', title: 'v0.10.0, and finished', detail: 'The line shipped, then stopped. Still installable, still resolvable, stated at exactly that.' },
    ],
    link: { url: 'https://freebatteryfactory.com/batpak/overview', label: 'batpak/overview' },
    accent: 'purple',
  },
  {
    name: 'Macroonz',
    tagline: 'A macro that emits tokens and hopes is a process nobody can reconstruct.',
    body: "Code generation for Rust that can say what it made. It names every unit it produced, proves the set matches its plan, and explains each decision before rustc sees a byte — then a harness tries to break the result on purpose: generated inputs, injected faults, a controlled clock, mutants of your own code, and a capsule that replays whatever it found. Same argument as everything else here, pointed at a compiler.",
    points: [
      { label: 'Accounted', title: 'Every unit named', detail: 'The expansion proves the set it produced matches the plan it was asked for.' },
      { label: 'Adversarial', title: 'Tested by a stranger', detail: 'Property, fuzz, fault, schedule and mutation testing with typed evidence and replay.' },
      // No version here on purpose: this line is still shipping, and a number
      // in this file would be stale the next time it is bumped. crates.io is
      // the authority, and the link goes there.
      { label: 'Released', title: 'Four crates, on crates.io', detail: 'Published and in active development — the registry says which version is current.' },
    ],
    link: { url: 'https://freebatteryfactory.com/macroonz/overview', label: 'macroonz/overview' },
    accent: 'warm',
  },
]

