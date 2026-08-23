// czap client directives do not start themselves on plain elements. Astro's
// addClientDirective only fires for framework-component islands; on a plain
// element `data-czap-directive="worker"` serialises verbatim and nothing runs.
// @czap/astro ships a scanner for exactly this, and the consumer has to call
// it — this repo deleted its manual invocation on the belief that 0.1.5 made
// the activation native. Verified against 0.10.0: it did not.
//
// It hid well here because resolveInitialState is request-aware, so a desktop
// UA SSRs the right state and first paint looks correct. What never happened
// was any later evaluation.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { SITE_DIRECTIVES } from '../src/lib/directives.ts'

const read = (rel: string) => readFileSync(new URL(rel, import.meta.url), 'utf8')

const walk = (rel: string, ext: string): string[] => {
  const base = new URL(rel, import.meta.url)
  const out: string[] = []
  for (const entry of readdirSync(base)) {
    const child = `${rel}${entry}`
    if (statSync(new URL(child, import.meta.url)).isDirectory()) out.push(...walk(`${child}/`, ext))
    else if (entry.endsWith(ext)) out.push(child)
  }
  return out
}

/**
 * Every directive actually marked into the markup. BOTH forms are first-class
 * per the runtime's own scanner, and scanning only the first one missed
 * MoodSvg's hand-written marker in the sibling repo:
 *   - satelliteAttrs({ directive: 'x' })
 *   - a literal data-czap-directive="x" attribute (space-separated tokens OK)
 * Only .astro files are walked, so prose mentioning the attribute name in a
 * .ts doc comment cannot register as a declaration.
 */
const declaredDirectives = (): Map<string, string[]> => {
  const found = new Map<string, string[]>()
  const add = (name: string, file: string) =>
    found.set(name, [...(found.get(name) ?? []), file])
  for (const file of walk('../src/', '.astro')) {
    const src = read(file)
    for (const m of src.matchAll(/directive:\s*'([a-z]+)'/g)) add(m[1], file)
    for (const m of src.matchAll(/data-czap-directive="([a-z\s]+)"/g)) {
      for (const token of m[1].split(/\s+/).filter(Boolean)) add(token, file)
    }
  }
  return found
}

test('every directive the markup declares is in the bootstrap list', () => {
  const declared = declaredDirectives()
  // A scan that finds nothing would pass this test forever.
  assert.ok(declared.size > 0, 'no `directive:` declarations found under src/ — the scan is broken')

  const missing = [...declared].filter(([name]) => !SITE_DIRECTIVES.includes(name as never))
  assert.deepEqual(
    missing.map(([name, files]) => `'${name}' (${files.join(', ')}) is not in SITE_DIRECTIVES`),
    [],
    'a directive is marked into the HTML but never booted, so it silently never activates',
  )
})

test('the bootstrap list carries nothing the markup does not declare', () => {
  // The other direction: a stale entry here is dead weight that reads as
  // coverage. Boot only what is actually marked.
  const declared = declaredDirectives()
  const extra = SITE_DIRECTIVES.filter((name) => !declared.has(name))
  assert.deepEqual(extra, [], 'SITE_DIRECTIVES names a directive no component marks')
})

test('the layout actually calls the scanner', () => {
  // The list being right is worthless if nothing invokes it. This is the one
  // wiring fact no runtime assertion in this suite can reach, because no
  // .unit.ts executes .astro.
  const layout = read('../src/layouts/Layout.astro')
  assert.match(layout, /bootstrapDirectives\(/, 'Layout.astro never boots czap directives')
  assert.match(layout, /SITE_DIRECTIVES/, 'Layout.astro boots a hand-written list instead of the guarded one')
})
