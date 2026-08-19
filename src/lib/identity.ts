// One typed canonical identity record (issue #9). The homepage JSON-LD
// (Person / ProfilePage / WebSite / FAQPage), `public/profile.json`, and
// `public/llms.txt` all describe the same person; without a single source they
// drift. This module owns the load-bearing identity FACTS; the JSON-LD is
// derived from it (below), and a drift test (tests/identity-drift.unit.ts)
// asserts `profile.json` still agrees on every field here.
//
// Scope note: this owns identity FACTS *and* the canonical FAQ. That pending
// content decision is now made — the FAQ below is the one curation, rendered
// visibly by <Faq /> and projected into FAQPage JSON-LD. profile.json carries a
// machine-shaped restatement of the same claims, and the drift test asserts the
// two do not contradict each other.

// Title note: this record used to say "Cognitive-First Systems Architect" with
// an O*NET occupational code attached. Both went. The phrase named a design
// sensibility rather than a person, the code asserted a federal classification
// nothing here can back, and neither said who the work answers to. What's here
// now is checkable: he founded the company, and he ran operations before he
// built them.
//
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
  jobTitle: 'Founder & Operator-Engineer',
  description:
    'I build the machinery underneath work somebody has to answer for. Founder of The Free Battery Factory; before that I ran the operations I now build for.',
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
    'Operator Experience',
    'Operational AI',
    'Type Systems',
    'Event Sourcing',
    'Rust',
    'OCaml',
    'Elixir',
    'TypeScript',
    'React',
    'Effect-TS',
    'Multi-Agent Orchestration',
  ],
  occupationSkills: ['Operator Experience', 'Systems Architecture', 'Event Sourcing', 'Type Systems', 'Operational AI'],
  profilePageName: 'Eassa Ayoub — Operator-Engineer',
  websiteName: 'Eassa Ayoub',
  websiteDescription: 'Eassa Ayoub — founder of The Free Battery Factory, building the machinery underneath consequential work',
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
// Every claim here traces to a fact published in public/profile.json
// (proof_of_work, ideal_client, open_to) — do not add answers that assert
// process, pricing, or timelines that aren't documented there. Two answers
// deliberately decline work ("wrong person to call", "nothing should be built");
// they are load-bearing, not modesty, and the drift test keeps them.
export const FAQ: readonly Faq[] = [
  {
    question: 'What do you actually do?',
    answer:
      "I build the machinery underneath work that somebody has to answer for. In practice that means learning how the work really happens, finding the place where a person is doing a job the software should have been doing, and automating one bounded piece of it — with the judgment and the authority left where they were. I run The Free Battery Factory, which is where that work lives. This site is me, the technical work, and how I think about it.",
  },
  {
    question: 'Why does an engineer keep talking about operations?',
    answer:
      "Because I ran them first. Mortgage, accounting, sales — work where a clumsy interface isn't a bad review, it's someone's close, someone's money, someone's signature on a mistake. That's not a credential, it's a bias: I don't treat complexity as an abstraction, because I was the one absorbing it. It's the difference between designing a screen and knowing who gets the phone call when the screen is wrong.",
  },
  {
    question: 'When am I the wrong person to call?',
    answer:
      "When you need more features bolted onto something that already works — that's not the job, and you'd be overpaying me for it. When you're shopping for the cheapest option, because I'm not it. And when nothing about the work has a consequence, because most of what I'm careful about stops being worth paying for. I'd rather say that now than invoice you to find out.",
  },
  {
    question: 'Do you consult, or do you actually build it?',
    answer:
      "Build it, mostly. Sometimes the useful thing is an architecture review and a written account you hand to your own team, and sometimes it's me in the codebase. I take fractional CTO work when the fit is genuinely there. And sometimes the honest answer is that nothing should be built — if the current thing works and replacing it buys nothing, saying so is the result.",
  },
  {
    question: 'What does "compliance-by-architecture" mean?',
    answer:
      "That the rule compiles instead of living in a policy doc. A healthcare tool leaking PII got rebuilt with local-only processing — HIPAA-safe by construction rather than by promise. Loan rules scattered across spreadsheets got encoded into a type system, so an illegal loan became a compile error. The constraint stops being something a person remembers to check and becomes something the build refuses to produce.",
  },
  {
    question: 'Why is there so much source code on a personal site?',
    answer:
      "Because \"trust me, I understand systems\" is a weak technical standard. The packages, the specs and the tests are public where they can be, stated at whatever claim state they're actually at — including the lines that stopped. You never have to read any of it. It's there so the claims can be checked.",
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
