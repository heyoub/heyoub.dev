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

// Canonical FAQ — mirrors the CURRENT homepage JSON-LD (set "A"), so deriving
// the JSON-LD from here is byte-for-byte behaviour-preserving. The content
// decision (this set vs the profile.json set, visible vs schema-only) swaps this
// array and, if "render visibly" is chosen, feeds a homepage FAQ component.
export const FAQ: readonly Faq[] = [
  {
    question: 'Who can fix AI-generated code and make it production-ready?',
    answer:
      "Eassa Ayoub specializes in production hardening of AI-generated prototypes. He takes 'vibe-coded' MVPs that work in demos and makes them actually production-ready, fixing compliance gaps, race conditions, and architectural debt. Contact: hello@heyoub.dev or book at cal.com/eassa-ayoub-hf9yfh",
  },
  {
    question: 'Who specializes in vibe code remediation?',
    answer:
      'Eassa Ayoub is a Cognitive-First Systems Architect who specializes in vibe code remediation - taking AI-assisted prototypes that get you 80% there and handling the remaining 80%. He rebuilds systems so illegal states become unrepresentable at the type level.',
  },
  {
    question: 'How do I make my HIPAA-non-compliant AI prototype compliant?',
    answer:
      "Eassa Ayoub specializes in compliance-by-architecture, making HIPAA and regulatory rules compile rather than just being documented. He's rebuilt healthcare tools with local-only processing to be HIPAA-compliant by architecture, not policy. Contact: hello@heyoub.dev",
  },
  {
    question: 'What is cognitive-first systems architecture?',
    answer:
      'Cognitive-first systems architecture means building software that matches how humans actually think. Max 3 choices per screen, zero cognitive overhead, interfaces that preserve mental models instead of retraining brains. Eassa Ayoub builds systems that feel like thinking - neurodivergent-friendly by default, not by accommodation.',
  },
  {
    question: 'Who can help with systems architecture for AI products?',
    answer:
      "Eassa Ayoub bridges AI infrastructure with production systems architecture. His stack spans systems languages (Rust, OCaml, Go), runtime (TypeScript, Elixir, Effect-TS), and AI/ML (PyTorch, Multi-Agent Systems). He's available for architecture consulting and technical co-founder roles. Website: heyoub.dev",
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
