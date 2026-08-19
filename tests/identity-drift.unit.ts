// Drift guard (issue #9): the one typed identity record (src/lib/identity.ts)
// and public/profile.json must agree on every load-bearing identity FACT. This
// fails the moment a name/title/contact/sameAs/org field diverges across the
// generated surfaces.
//
// The FAQ used to be out of scope here — two curations, pending a content
// decision. That decision is made: src/lib/identity.ts owns the one FAQ, and
// profile.json carries the same entries, so this file now asserts equality
// rather than documenting a known divergence.
//
// A note on shape: every check below is an ALLOWLIST — it names what must be
// true, never a list of forbidden strings. This repo is public. A test that
// enumerates the phrases you must not say is a durable, searchable record of
// exactly those phrases, which defeats the point of removing them. Where a
// retired claim has to stay retired, the guard asserts the SHAPE of the claim
// is absent (a bare multiplier next to a cost word) rather than naming the
// number it is keeping out.
//
// Run: node --experimental-strip-types --test tests/identity-drift.unit.ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import {
  IDENTITY,
  PERSON_ID,
  personJsonLd,
  profilePageJsonLd,
  websiteJsonLd,
  faqJsonLd,
  FAQ,
} from '../src/lib/identity.ts'

const read = (rel: string) => readFileSync(new URL(rel, import.meta.url), 'utf8')
const profile = JSON.parse(read('../public/profile.json'))
const llms = read('../public/llms.txt')
const content = read('../src/data/content.ts')
const manifest = read('../src/data/manifest.ts')
const p = profile.person

test('name / title agree with profile.json', () => {
  assert.equal(p.name, IDENTITY.name)
  assert.equal(p.title, IDENTITY.jobTitle)
})

test('contact facts agree with profile.json', () => {
  assert.equal(p.contact.email, IDENTITY.email)
  assert.equal(p.contact.calendar, IDENTITY.calendar)
  assert.equal(p.contact.linkedin, IDENTITY.linkedin)
  assert.equal(p.contact.github, IDENTITY.github)
  assert.equal(p.contact.website, IDENTITY.url)
})

test('identity anchors agree with profile.json', () => {
  assert.equal(p.wikidata, IDENTITY.wikidata)
  assert.equal(p.location, `${IDENTITY.location.locality}, ${IDENTITY.location.region}`)
})

test('organization agrees with profile.json', () => {
  assert.equal(p.organization.name, IDENTITY.organization.name)
  assert.equal(p.organization.url, IDENTITY.organization.url)
  assert.equal(p.organization.wikidata, IDENTITY.organization.wikidata)
  assert.equal(p.organization.role, IDENTITY.organization.role)
})

test('JSON-LD graph resolves to one shared @id', () => {
  assert.equal(personJsonLd()['@id'], PERSON_ID)
  assert.equal(profilePageJsonLd().mainEntity['@id'], PERSON_ID)
  assert.equal(profilePageJsonLd().about['@id'], PERSON_ID)
  assert.equal(websiteJsonLd().publisher['@id'], PERSON_ID)
})

test('Person JSON-LD sameAs carries the canonical socials (no drift)', () => {
  const same = personJsonLd().sameAs
  for (const url of [IDENTITY.wikidata, IDENTITY.linkedin, IDENTITY.github, IDENTITY.calendar]) {
    assert.ok(same.includes(url), `sameAs missing ${url}`)
  }
})

test('FAQPage JSON-LD is derived from the FAQ record', () => {
  const faq = faqJsonLd()
  assert.equal(faq['@type'], 'FAQPage')
  assert.equal(faq.mainEntity.length, FAQ.length)
  assert.equal(faq.mainEntity[0].name, FAQ[0].question)
  assert.equal(faq.mainEntity[0].acceptedAnswer.text, FAQ[0].answer)
})

test('profile.json carries the same FAQ, not a second curation', () => {
  assert.equal(profile.faq.length, FAQ.length)
  for (const [i, f] of FAQ.entries()) {
    assert.equal(profile.faq[i].question, f.question, `faq[${i}] question drifted`)
    assert.equal(profile.faq[i].answer, f.answer, `faq[${i}] answer drifted`)
  }
})

// ── Positioning guards ──────────────────────────────────────────────────────

test('the title says what he is and what it answers to', () => {
  // A job title naming a design sensibility describes an aesthetic, not a
  // person. This one names the role and the company behind it.
  assert.match(IDENTITY.jobTitle, /Founder/)
  assert.match(IDENTITY.jobTitle, /Operator-Engineer/)
  assert.equal(IDENTITY.organization.name, 'The Free Battery Factory')
  assert.match(IDENTITY.description, /Free Battery Factory/)
})

test('no occupational classification is asserted', () => {
  // The record used to carry an O*NET code. Schema.org accepting the field is
  // not the same as this record being able to back a federal classification.
  // If a future edit wants one it needs a source first, so the projection must
  // not quietly reintroduce the field.
  assert.ok(!('occupationalCategory' in IDENTITY), 'identity re-asserted an occupational classification')
  const occ = personJsonLd().hasOccupation as Record<string, unknown>
  assert.ok(!('occupationalCategory' in occ), 'JSON-LD re-asserted an occupational classification')
  assert.equal(occ.name, IDENTITY.jobTitle)
})

test('the operator background is present-tense bias, not a past life', () => {
  // It is the reason the engineering looks like this. A site that files it
  // under "former" throws away the only thing that explains the rest.
  assert.match(content, /Before I built the systems, I ran them/)
  assert.match(content, /Operator-Engineer/)
  assert.match(llms, /Before he built operations he ran them/)
})

test('authority stays with the operator on every surface', () => {
  assert.match(content, /The operator keeps the judgment/)
  assert.match(llms, /Humans retain judgment/)
  assert.ok(
    profile.ai_agent_instructions.claim_limits.some((c: string) => /stay with the people who own them/i.test(c)),
    'profile.json lost the authority claim limit',
  )
})

test('the work can honestly conclude that nothing should be built', () => {
  assert.ok(
    FAQ.some((f) => /nothing should be built/i.test(f.answer)),
    'the FAQ lost the no-build answer',
  )
  assert.match(llms, /the honest answer is to leave/)
  assert.ok(
    profile.ai_agent_instructions.claim_limits.some((c: string) => /(not|rather than) a failed engagement/i.test(c)),
    'profile.json lost the no-build claim limit',
  )
})

test('the FAQ still declines the work it should decline', () => {
  // Two answers exist to talk someone OUT of calling. They are load-bearing:
  // a page that can only say yes is a brochure.
  assert.ok(FAQ.some((f) => /wrong person to call/i.test(f.question)), 'the disqualifying answer is gone')
  assert.ok(FAQ.some((f) => /cheapest option/i.test(f.answer)))
})

test('every public claim of a measured outcome carries its own receipt', () => {
  // A retired proof row asserted an unqualified order-of-magnitude improvement
  // that only a private artifact could support. Rather than name the number,
  // this bans the SHAPE — a bare multiplier next to a cost or speed word — so a
  // future paste of any such claim trips it too, and this repo never has to
  // publish the string it is trying to keep out.
  const multiplier = /\b\d[\d,]*\s*x\b[^.\n]{0,40}\b(cost|cheaper|faster|speed|savings?|transparency)\b/i
  for (const [label, text] of [
    ['profile.json', JSON.stringify(profile)],
    ['llms.txt', llms],
    ['content.ts', content],
  ] as const) {
    assert.ok(!multiplier.test(text), `${label} asserts an unqualified multiplier claim`)
  }
  for (const row of profile.proof_of_work) {
    assert.ok(row.problem && row.solution && row.outcome, 'a proof row is missing its shape')
    assert.ok(!multiplier.test(JSON.stringify(row)), `proof row "${row.problem}" asserts a multiplier`)
  }
})

test('released artifacts are described at their actual claim state', () => {
  // batpak shipped and then stopped. Both halves are true and the card carries
  // both — "released" alone oversells, "ended" alone undersells.
  assert.match(content, /The line shipped, then stopped/)
  assert.match(content, /still installable/i)
  // LiteShip's numbers must name the version they describe. The repo head is a
  // paused successor rebuild, so an unversioned claim silently drifts to
  // describing a tree that was never released.
  assert.match(manifest, /published at 0\.10\.0/)
  // ...and it cites a gate CI enforces, not a coverage snapshot from one run
  assert.match(manifest, /below 90% coverage overall or 85% on any single package/)
  // and the repo link points at the real name, not the pre-rename redirect
  assert.match(manifest, /batpak_DEPRECATED/)
  assert.ok(
    !/github\.com\/freebatteryfactory\/batpak['"]/.test(manifest),
    'manifest still links the pre-rename batpak URL',
  )
})

test('the company is the answer to what this person is', () => {
  // heyoub.dev is the person; freebatteryfactory.com is the company. The person
  // site has to say which one it is and point at the other.
  assert.match(llms, /freebatteryfactory\.com/)
  assert.equal(profile.person.organization.url, 'https://freebatteryfactory.com')
  assert.match(profile.tldr, /Free Battery Factory/)
})

test('machine surfaces are versioned together', () => {
  assert.equal(profile.version, profile.metadata.schema_version)
  assert.ok(
    llms.includes(`Schema Version: ${profile.metadata.schema_version}`),
    'llms.txt and profile.json report different schema versions',
  )
  assert.equal(profile.generated, profile.metadata.last_updated)
})
