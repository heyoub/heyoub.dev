// One typed canonical identity record (issue #9). The homepage JSON-LD
// (Person / ProfilePage / WebSite / FAQPage), `public/profile.json`, and
// `public/llms.txt` all describe the same person; without a single source they
// drift. This module owns the load-bearing identity FACTS; the JSON-LD is
// derived from it (below), and a drift test (tests/identity-drift.unit.ts)
// asserts `profile.json` still agrees on every field here.
//
// Scope note: this owns identity FACTS, not the FAQ COPY. The homepage JSON-LD
// FAQ and profile.json FAQ are two different curations pending a content
// decision (which set is canonical + render-visibly vs remove-schema). Until
// that's decided, `FAQ` below mirrors the current JSON-LD set exactly, so this
// refactor changes no emitted output.

// Explicit .ts extension: lets `node --test` (type-stripping) resolve this leaf
// import too, while vite/astro resolve it fine at build.
import { APEX_ORIGIN } from './url-canonical.ts'

// Stable @id anchors — every node points back to these so the graph resolves.
export const PERSON_ID = `${APEX_ORIGIN}/#person`
export const PROFILEPAGE_ID = `${APEX_ORIGIN}/#profilepage`
export const WEBSITE_ID = `${APEX_ORIGIN}/#website`

export interface Identity {
  readonly name: string
  readonly givenName: string
  readonly familyName: string
  readonly url: string
  readonly email: string
  readonly calendar: string
  readonly image: string
  readonly jobTitle: string
  readonly description: string
  readonly location: { readonly locality: string; readonly region: string; readonly country: string }
  readonly wikidata: string
  readonly linkedin: string
  readonly github: string
  readonly organization: { readonly name: string; readonly url: string; readonly wikidata: string; readonly role: string }
  readonly knowsAbout: readonly string[]
  readonly occupationalCategory: string
  readonly occupationSkills: readonly string[]
  /** Portfolio/site names (surface-specific, kept here so they can't drift silently). */
  readonly profilePageName: string
  readonly websiteName: string
  readonly websiteDescription: string
}

export const IDENTITY: Identity = {
  name: 'Eassa Ayoub',
  givenName: 'Eassa',
  familyName: 'Ayoub',
  url: APEX_ORIGIN,
  email: 'hello@heyoub.dev',
  calendar: 'https://cal.com/eassa-ayoub-hf9yfh',
  image: `${APEX_ORIGIN}/assets/Eassa_Headshot_-_Low_Res-1-removebg-preview.png`,
  jobTitle: 'Cognitive-First Systems Architect',
  description:
    'Building software that feels like thinking. Systems where mental models become structure, constraints compile, and complexity transfers to the machine.',
  location: { locality: 'Philadelphia', region: 'PA', country: 'US' },
  wikidata: 'https://www.wikidata.org/wiki/Q140440561',
  linkedin: 'https://linkedin.com/in/eassageorge',
  github: 'https://github.com/heyoub',
  organization: {
    name: 'The Free Battery Factory',
    url: 'https://freebatteryfactory.com',
    wikidata: 'https://www.wikidata.org/wiki/Q140440449',
    role: 'Founder',
  },
  knowsAbout: [
    'Systems Architecture',
    'AI Infrastructure',
    'Cross-Domain Integration',
    'Type Systems',
    'Event Sourcing',
    'Rust',
    'OCaml',
    'Elixir',
    'TypeScript',
    'React',
    'Effect-TS',
    'Multi-Agent Orchestration',
    'Cognitive-First Design',
  ],
  occupationalCategory: '15-1252.00',
  occupationSkills: ['Systems Architecture', 'AI Infrastructure', 'Type Systems', 'Event Sourcing', 'Full-Stack Development'],
  profilePageName: 'Eassa Ayoub — Cognitive-First Systems',
  websiteName: 'Eassa Ayoub Portfolio',
  websiteDescription: 'Portfolio and professional profile of Eassa Ayoub, Cognitive-First Systems Architect',
}

/** The `sameAs` set, derived once so JSON-LD and any other surface agree. */
export const sameAs = (): string[] => [
  IDENTITY.wikidata,
  IDENTITY.linkedin,
  IDENTITY.github,
  IDENTITY.calendar,
]

export interface Faq {
  readonly question: string
  readonly answer: string
}

// Canonical FAQ — rendered visibly by <Faq />, and projected into FAQPage
// JSON-LD by faqJsonLd(). One source, so the visible copy and the schema can't
// disagree.
//
// Why it reads the way it does: Google stopped serving FAQ rich results
// entirely on 2026-05-07 (developers.google.com/search/docs/appearance/
// structured-data/faqpage), so the previous third-person, keyword-stuffed sets
// were optimizing for a surface that no longer renders. Search Console also
// shows heyoub.dev with no meaningful query volume yet — nobody arrives here by
// searching a problem. Everyone who reads this got here from a referral, a
// link, or outreach, and has already read the hero. So these answer the
// objections of someone one click from emailing, in first person, rather than
// chasing keywords. Revisit once Search Console has real query data.
//
// Every claim here traces to a fact already published in public/profile.json
// (proof_of_work, ideal_client, open_to) — do not add answers that assert
// process, pricing, or timelines that aren't documented there.
export const FAQ: readonly Faq[] = [
  {
    question: 'My prototype works in the demo and falls apart with real users. Is it salvageable?',
    answer:
      "Almost always — it's the most common reason people call. The demo isn't the problem; the demo is proof the idea works. What's missing is everything that happens after it stops being a demo: the race conditions, the edge cases the model never handled, the architectural debt that only surfaces under real load and real failure. Most AI-assisted code gets you 80% there. I handle the 80% that's left.",
  },
  {
    question: 'When are you the wrong person to call?',
    answer:
      "When you just need more features bolted onto code that already works — that's not architecture, and you'd be overpaying me for it. When you're shopping for the cheapest option, because I'm not it. And when you don't think type safety and tests are worth the time, because that's the whole mechanism I work through, and we'd spend the engagement arguing about it. I'd rather tell you now than invoice you to find out.",
  },
  {
    question: 'Do you consult, or do you actually build it?',
    answer:
      "Both, depending on what the problem needs. Sometimes it's an architecture review and a diagram you hand to your own team. Sometimes it's me in the codebase doing the rebuild. I also take fractional CTO work when the fit is genuinely there. If you don't know which one you need yet, that's a normal place to start.",
  },
  {
    question: 'What does "compliance-by-architecture" actually mean?',
    answer:
      'That the rule compiles instead of living in a policy doc. A healthcare tool leaking PII got rebuilt with local-only processing — HIPAA-safe by construction, not by promise. Loan rules scattered across spreadsheets got encoded into a type system, so an illegal loan became a compile error. The constraint stops being something a human remembers to check and becomes something the build refuses to produce.',
  },
  {
    question: 'What makes this "cognitive-first" and not just good engineering?',
    answer:
      "The question is never whether a system is complex — it's who carries the complexity. Every layer you add is complexity the user eventually carries, so I collapse layers instead of adding them: fewer hops in the architecture, fewer decisions on the screen. Working memory is finite. Build for that, or build friction.",
  },
]

// ── JSON-LD projections (derived — Layout.astro emits these) ──────────────────

export const personJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': PERSON_ID,
  name: IDENTITY.name,
  givenName: IDENTITY.givenName,
  familyName: IDENTITY.familyName,
  url: IDENTITY.url,
  email: IDENTITY.email,
  image: IDENTITY.image,
  jobTitle: IDENTITY.jobTitle,
  description: IDENTITY.description,
  knowsAbout: [...IDENTITY.knowsAbout],
  hasOccupation: {
    '@type': 'Occupation',
    name: IDENTITY.jobTitle,
    occupationalCategory: IDENTITY.occupationalCategory,
    skills: [...IDENTITY.occupationSkills],
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: IDENTITY.location.locality,
    addressRegion: IDENTITY.location.region,
    addressCountry: IDENTITY.location.country,
  },
  sameAs: sameAs(),
  worksFor: {
    '@type': 'Organization',
    name: IDENTITY.organization.name,
    url: IDENTITY.organization.url,
    sameAs: IDENTITY.organization.wikidata,
  },
})

export const profilePageJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  '@id': PROFILEPAGE_ID,
  url: IDENTITY.url,
  name: IDENTITY.profilePageName,
  mainEntity: { '@id': PERSON_ID },
  about: { '@id': PERSON_ID },
  inLanguage: 'en-US',
})

export const websiteJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: IDENTITY.url,
  name: IDENTITY.websiteName,
  description: IDENTITY.websiteDescription,
  publisher: { '@id': PERSON_ID },
  inLanguage: 'en-US',
})

export const faqJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map((f) => ({
    '@type': 'Question',
    name: f.question,
    acceptedAnswer: { '@type': 'Answer', text: f.answer },
  })),
})
