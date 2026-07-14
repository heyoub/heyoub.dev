// Drift guard (issue #9): the one typed identity record (src/lib/identity.ts)
// and public/profile.json must agree on every load-bearing identity FACT. This
// fails the moment a name/title/contact/sameAs/org field diverges across the
// generated surfaces. (FAQ COPY is intentionally out of scope — the two FAQ
// curations are a pending content decision, not drift.)
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

const profile = JSON.parse(
  readFileSync(new URL('../public/profile.json', import.meta.url), 'utf8'),
)
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
