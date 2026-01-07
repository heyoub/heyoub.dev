export interface Principle {
  id: string
  number: string
  title: string
  philosophy: string
  technical: string
}

export const principles: Principle[] = [
  {
    id: 'tension-click',
    number: '01',
    title: 'Build Until the Tension Clicks',
    philosophy: `I improvise solutions like a guitar solo. Read the problem space, feel where the friction is,
      and build until the tension releases. When questions disappear, it's done. Not perfect — done.`,
    technical: `Emergent design driven by constraint satisfaction. The architecture reveals itself through
      iterative refinement until the state space converges.`,
  },
  {
    id: 'preserve-extend',
    number: '02',
    title: 'Preserve Their Model, Extend with Depth',
    philosophy: `Most developers force users to learn their abstractions. I start with the user's mental model
      and extend it. Their language becomes the interface. Their constraints become the type system.`,
    technical: `Domain-Driven Design with type-level encoding of business rules. The ubiquitous language
      becomes the API surface. Illegal states become unrepresentable.`,
  },
  {
    id: 'events-truth',
    number: '03',
    title: 'State is a Lie, Events are Truth',
    philosophy: `Current state is just a snapshot — a lossy compression of history. I build systems where the full
      story is preserved. Every change leaves a trail. Time travel comes free.`,
    technical: `Event sourcing with append-only logs. State derived from event fold. CQRS for read optimization.
      Deterministic replay enables debugging and audit compliance.`,
  },
  {
    id: 'compiler-enforces',
    number: '04',
    title: 'Let the Compiler Be Your Enforcer',
    philosophy: `Runtime errors are design failures. If business logic can be violated, the types are wrong.
      Crash hard during development, never in production. Make the impossible uncompilable.`,
    technical: `Phantom types, GADTs, refinement types. Type-level programming to encode invariants.
      Dependent types where warranted. Parse, don't validate.`,
  },
  {
    id: 'cognitive-first',
    number: '05',
    title: 'Design for How Brains Actually Work',
    philosophy: `Humans aren't compilers. Working memory holds 3-4 chunks. Attention is scarce. Every interface
      decision should minimize cognitive load. Neurodivergent-friendly by default.`,
    technical: `Miller's Law applied to UI state machines. Progressive disclosure patterns. Cognitive Load Theory
      informing information architecture. Max 3 choices per decision point.`,
  },
  {
    id: 'physics-matters',
    number: '06',
    title: 'Respect the Physics',
    philosophy: `Software doesn't run in a vacuum. Memory moves slow. Networks are unreliable. Energy costs money.
      Good architecture makes physical constraints visible, not hidden behind abstractions.`,
    technical: `Mechanical sympathy. Data locality optimization. Horowitz energy models for ML. Memory hierarchy
      awareness. Language boundaries follow physics boundaries.`,
  },
]
