// Pure unit tests for the www→apex / http→https redirect and the path-aware
// canonical. No server needed — run with `node --test tests/url-canonical.test.ts`
// (Node ≥22 strips the types). Covers the acceptance criteria of the redirect
// issue: root, nested path, query string, trailing slash, and single-hop.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { apexRedirectTarget, canonicalUrlFor, APEX_ORIGIN } from '../src/lib/url-canonical.ts'

const target = (href: string, scheme?: string) =>
  apexRedirectTarget(new URL(href), { loopback: false, scheme })?.href ?? null

test('www + https → apex, one hop', () => {
  assert.equal(target('https://www.heyoub.dev/'), 'https://heyoub.dev/')
})

test('www + http → apex + https in a SINGLE hop (no chain)', () => {
  assert.equal(target('http://www.heyoub.dev/'), 'https://heyoub.dev/')
})

test('apex + http → apex + https', () => {
  assert.equal(target('http://heyoub.dev/'), 'https://heyoub.dev/')
})

test('apex + https is already canonical → no redirect', () => {
  assert.equal(target('https://heyoub.dev/'), null)
})

test('nested path is preserved', () => {
  assert.equal(
    target('https://www.heyoub.dev/field-notes/example'),
    'https://heyoub.dev/field-notes/example',
  )
})

test('query string is preserved byte-for-byte', () => {
  assert.equal(
    target('https://www.heyoub.dev/r/li/post-1?x=1&y=2'),
    'https://heyoub.dev/r/li/post-1?x=1&y=2',
  )
})

test('trailing slash is preserved (no normalization surprise)', () => {
  assert.equal(target('https://www.heyoub.dev/a/'), 'https://heyoub.dev/a/')
  assert.equal(target('https://www.heyoub.dev/a'), 'https://heyoub.dev/a')
})

test('edge-resolved scheme override wins over url.protocol', () => {
  // TLS terminated upstream: url looks https but the client came in over http.
  assert.equal(target('https://heyoub.dev/', 'http'), 'https://heyoub.dev/')
})

test('loopback never redirects', () => {
  assert.equal(
    apexRedirectTarget(new URL('http://localhost:4321/'), { loopback: true }),
    null,
  )
})

test('canonical is apex-hosted and path-aware, never the request host', () => {
  assert.equal(canonicalUrlFor('/'), `${APEX_ORIGIN}/`)
  assert.equal(canonicalUrlFor('/field-notes/x'), `${APEX_ORIGIN}/field-notes/x`)
})
