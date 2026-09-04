// Booking chooser guard. Three Google appointment schedules sit behind
// first-party /book/<slot> URLs, and this file exists to keep that indirection
// from quietly springing a leak.
//
// What it prevents, concretely:
//   • a raw calendar.app.google (or leftover cal.com) URL reaching a public
//     surface, where an opaque hash would print as visible garbage and rot the
//     moment a schedule is regenerated
//   • the redirect route growing a SECOND literal list of slots that drifts
//     from the one the UI renders — the allowlist must be derived, so a slot
//     cannot exist in the chooser and 404 in the router
//   • the three rows losing their shared shape (every row carries a timing
//     value and a note line; onsite fills the timing slot with "By request"
//     rather than dropping it)
//   • onsite being described as a booking when it is a request that needs a
//     phone number and a call back
//   • the footer's code view printing an opaque appointment hash as a visible
//     string value (getLinkDisplayValue), which is the reason the indirection
//     exists on this site at all
//
// Run: node --experimental-strip-types --test tests/booking.unit.ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { BOOKING, bookingSlot, bookingPath } from '../src/lib/booking.ts'
import { IDENTITY } from '../src/lib/identity.ts'
import { getLinkDisplayValue } from '../src/data/footer.ts'

const slots = BOOKING.slots
const read = (p: string) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8')

test('there are exactly three slots and their keys are unique url segments', () => {
  assert.equal(slots.length, 3)
  const keys = slots.map((s) => s.key)
  assert.deepEqual([...new Set(keys)], keys, 'duplicate slot key')
  for (const key of keys) {
    assert.match(key, /^[a-z][a-z0-9-]*$/, `${key} is not a safe lowercase URL segment`)
    assert.equal(encodeURIComponent(key), key, `${key} would need escaping in a URL`)
  }
})

test('every destination is an https calendar link', () => {
  for (const s of slots) {
    const url = new URL(s.destination)
    assert.equal(url.protocol, 'https:', `${s.key} destination is not https`)
    assert.equal(url.hostname, 'calendar.app.google', `${s.key} points somewhere unexpected`)
  }
})

test('the rows share one shape: every slot has a timing value and a note line', () => {
  for (const s of slots) {
    assert.ok(s.name.length > 0, `${s.key} has no name`)
    assert.ok(s.timing.length > 0, `${s.key} dropped the timing slot instead of filling it`)
    assert.ok(s.note.length > 0, `${s.key} has no note line — the set stops being siblings`)
  }
})

test('onsite reads as a request with a phone requirement, not as a booking', () => {
  const onsite = slots.find((s) => s.key === 'onsite')
  assert.ok(onsite, 'no onsite slot')
  assert.match(onsite.note, /phone/i, 'onsite must state the phone requirement before the click')
  assert.doesNotMatch(onsite.timing, /\bmin\b|\bhour\b/i, 'onsite has no fixed duration')
})

test('the per-day cap stays out of the UI — availability is Google\'s to show', () => {
  const prose = slots.map((s) => `${s.timing} ${s.note}`).join(' ')
  assert.doesNotMatch(prose, /one per day|1 per day|limited/i)
})

// --- the router agrees with the data, by derivation and not by a second list --
test('every slot key resolves to its exact destination', () => {
  for (const s of slots) {
    assert.equal(bookingSlot(s.key)?.destination, s.destination)
  }
})

test('an unknown slot resolves to nothing, so the route can fail closed', () => {
  for (const bad of ['', 'nope', 'INTRO', '../intro', 'intro/', 'onsite-visit']) {
    assert.equal(bookingSlot(bad), undefined, `${bad} must not resolve`)
  }
})

test('bookingPath builds the first-party URL from the key', () => {
  assert.equal(bookingPath('intro'), '/book/intro')
  assert.equal(BOOKING.path, '/book')
})

// --- public surfaces carry the first-party URL, never the raw one ------------
for (const file of ['public/llms.txt', 'public/profile.json']) {
  test(`${file} carries no raw calendar or cal.com URL`, () => {
    const text = read(file)
    assert.doesNotMatch(text, /calendar\.app\.google/, 'raw appointment hash leaked')
    assert.doesNotMatch(text, /cal\.com/, 'stale cal.com link')
  })

  test(`${file} points at the first-party booking URLs`, () => {
    const text = read(file)
    for (const s of slots) {
      assert.ok(text.includes(bookingPath(s.key)), `${file} is missing ${bookingPath(s.key)}`)
    }
  })
}

test('every surface that names a booking URL uses the first-party one', () => {
  for (const file of ['src/data/content.ts', 'src/data/footer.ts', 'src/lib/identity.ts']) {
    const text = read(file)
    assert.doesNotMatch(text, /cal\.com\/eassa/, `${file} still carries the retired cal.com link`)
    assert.doesNotMatch(text, /calendar\.app\.google/, `${file} leaked a raw appointment hash`)
  }
})

test('IDENTITY.calendar is the first-party chooser', () => {
  assert.equal(IDENTITY.calendar, 'https://heyoub.dev/book')
})

test("the footer's code view prints a readable value, not a hash", () => {
  const shown = getLinkDisplayValue({ key: 'calendar', label: 'Book a Call', href: '/book', external: false })
  assert.equal(shown, 'heyoub.dev/book')
})

test('llms.txt states the onsite constraint so an agent does not mis-advise', () => {
  const text = read('public/llms.txt')
  assert.match(text, /phone/i, 'llms.txt must carry the onsite phone requirement')
})
