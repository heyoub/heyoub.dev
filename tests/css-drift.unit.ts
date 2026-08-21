// CSS + boundary drift guards.
//
// This repo had none. That is the gap worth closing rather than any single
// rule below: heyoub's layout is almost entirely boundary-driven already, and
// nothing was holding it there. Every guard here encodes a property the site
// currently HAS, so a regression has to trip a test instead of shipping.
//
// The same guards on the sibling repo caught two real bugs — a rail describing
// the wrong orientation to screen readers, and a dead-rule sweep that deleted a
// live selector — so these are written from that experience.
//
// A note on shape, matching tests/identity-drift.unit.ts: every check is an
// ALLOWLIST. It names what must be true, never a list of forbidden strings.
// This repo is public, and a test that enumerates what you must not write is a
// durable searchable record of exactly those things.
//
// Run: node --experimental-strip-types --test tests/css-drift.unit.ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import postcss from 'postcss'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = (p: string): string => readFileSync(join(root, p), 'utf8')

/** Every file under src/, so a guard can ask what the site actually renders. */
function walk(dir: string): string[] {
  const out: string[] = []
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name)
    if (e.isDirectory()) out.push(...walk(p))
    else out.push(p)
  }
  return out
}

const SRC_FILES = walk(join(root, 'src'))
const STYLESHEETS = SRC_FILES.filter((f) => f.endsWith('.css'))

// The corpus a selector must be reachable from — mirroring
// the-fbf/scripts/css-orphans.mjs exactly, because two implementations of
// "is this class rendered" is two answers waiting to disagree.
//
// src/styles is EXCLUDED on purpose. Including it makes every rule its own
// evidence: a dead `.foo {}` in globals.css proves `.foo` is "rendered"
// because the string appears in the corpus, and the guard passes vacuously
// forever. Caught by mutation-testing this file — appending an orphan rule
// did not fail the test until this exclusion went in.
const rel = (f: string): string => f.slice(root.length + 1).replace(/\\/g, '/')
const MARKUP = SRC_FILES.filter(
  (f) => /\.(astro|ts|tsx)$/.test(f) && !rel(f).startsWith('src/styles/'),
)
  .map((f) => readFileSync(f, 'utf8'))
  .join('\n')

/**
 * Is this class name rendered anywhere? Delimiter-anchored, not a substring
 * test: a bare `includes('card')` would report `.card` live because
 * `.gallery-card` exists somewhere, which is how a dead rule survives a sweep.
 *
 * Deliberately loose in one direction: a bare word in prose or a string literal
 * (`'hero'`, `id="hero"`) vouches for a class of the same name. Tightening that
 * would mean parsing every class attribute, and the cost of being wrong is
 * asymmetric — a false "live" leaves one dead rule in the sheet, a false
 * "dead" deletes a rule the site is painting with. This already happened once
 * on the sibling repo. It errs toward keeping.
 */
const seen = new Map<string, boolean>()
const rendered = (c: string): boolean => {
  if (!seen.has(c)) {
    const escaped = c.replace(/[-[\]{}()*+?.,\\^$|#]/g, '\\$&')
    seen.set(c, new RegExp(`[\\s"'.\`]${escaped}[\\s"'.\`]`).test(MARKUP))
  }
  return seen.get(c)!
}

test('width media queries stay at the architectural floor', () => {
  // The layout regimes live in @quantize blocks (src/styles/layout.quantize.css)
  // and compile to native @container queries against .czap-vp. A width media
  // query is therefore either a regime that escaped the boundary, or one of the
  // few elements that CANNOT be inside the query container.
  //
  // Exactly one qualifies today: .scene is `position: fixed; inset: 0` — the
  // orb background. Containment would make its ancestor the containing block
  // and re-parent it, which is the documented "orbs vanished" failure that put
  // quantize.container on .czap-vp instead of :root in the first place. A fixed
  // element cannot resolve a container query, so it gets a media query and a
  // reason.
  const widthQueries: string[] = []
  for (const f of SRC_FILES.filter((p) => /\.(css|astro)$/.test(p))) {
    const text = readFileSync(f, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')
    for (const m of text.matchAll(/@media[^{]*\(m(?:in|ax)-width[^{]*/g)) {
      widthQueries.push(`${f.slice(root.length + 1)}: ${m[0].trim()}`)
    }
  }
  assert.equal(
    widthQueries.length,
    1,
    `expected one width media query (the fixed .scene background), found:\n  ${widthQueries.join('\n  ')}`,
  )
  assert.match(widthQueries[0], /Scene\.astro/)

  // and it must still be describing fixed chrome — if .scene stops being fixed,
  // it belongs in the container and this exemption expires with it
  assert.match(read('src/components/Scene.astro'), /\.scene\s*\{[^}]*position:\s*fixed/s)
})

test('every @container rule is compiled from a boundary, not hand-written', () => {
  // @quantize blocks are the authoring form; @czap/vite compiles them to
  // @container at build. A hand-written @container is a second author for the
  // same layout, able to disagree with the boundary about where a regime
  // starts — and invisible to the boundary manifest.
  for (const f of STYLESHEETS.concat(SRC_FILES.filter((p) => p.endsWith('.astro')))) {
    // strip all three comment forms these files mix: CSS/JS block, JS line,
    // and the HTML comments an .astro template carries — several of which
    // legitimately EXPLAIN the @container pipeline and would otherwise read as
    // violations of the very rule they describe
    const css = readFileSync(f, 'utf8')
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\/\/.*$/gm, '')
    assert.ok(
      !/@container\s/.test(css),
      `${f.slice(root.length + 1)} hand-writes an @container rule; author it as a @quantize state instead`,
    )
  }
})

test('every @quantize block names a boundary that exists', () => {
  // A typo'd boundary name does not fail the build — the block simply never
  // matches, and the layout silently falls back to its base rules. That failure
  // mode is invisible until someone resizes a window.
  const sheet = read('src/styles/layout.quantize.css')
  const declared = new Set(
    [...read('src/lib/boundaries.ts').matchAll(/export const (\w+)\s*=\s*Boundary\.make/g)].map(
      (m) => m[1],
    ),
  )
  assert.ok(declared.size > 0, 'no boundaries found in src/lib/boundaries.ts')

  // match only real at-rules (`@quantize name {`), never the word in prose
  const used = [...sheet.matchAll(/@quantize\s+(\w+)\s*\{/g)].map((m) => m[1])
  assert.ok(used.length > 0, 'layout.quantize.css declares no @quantize blocks')
  for (const name of used) {
    assert.ok(declared.has(name), `@quantize ${name} names no boundary exported from lib/boundaries.ts`)
  }
})

test('no stylesheet carries a rule nothing can render', () => {
  // The dead-rule sweep that removed 50 of these deleted a LIVE rule on the
  // sibling repo the first time, because it treated :not() contents as required.
  // The semantics that matter:
  //   :not(...)          EXCLUSION  — its classes are meant to be absent
  //   :is()/:where(...)  ALTERNATION — live if ANY branch renders
  // Anything else: every class in the selector must appear somewhere in src/.
  const GROUP = /:(?:is|where|any)\(([^()]*)\)/g
  const classesIn = (s: string): string[] =>
    [...s.matchAll(/\.([a-zA-Z][\w-]*)/g)].map((m) => m[1])

  const partIsLive = (part: string): boolean => {
    let p = part.replace(/:not\([^()]*\)/g, '')
    for (const m of p.matchAll(GROUP)) {
      const cs = classesIn(m[1])
      if (cs.length && !cs.some(rendered)) return false
    }
    p = p.replace(GROUP, '')
    return classesIn(p).every(rendered)
  }

  const orphans: string[] = []
  for (const f of STYLESHEETS) {
    postcss.parse(readFileSync(f, 'utf8'), { from: f }).walkRules((rule) => {
      if (rule.selectors.every((s) => !partIsLive(s))) {
        orphans.push(`${f.slice(root.length + 1)}: ${rule.selector.replace(/\s+/g, ' ').slice(0, 60)}`)
      }
    })
  }
  assert.deepEqual(
    orphans,
    [],
    `stylesheets carry rules nothing renders:\n  ${orphans.join('\n  ')}`,
  )
})

test('the brand palette is stated once and flows', () => {
  // palette.ts is the single source: tokens.ts casts it through Token/Theme to
  // --czap-* vars, tailwind.config reads the same map for its utility colors.
  // The failure this prevents is a brand hex typed a second time in
  // tailwind.config, which renders correctly until the day palette.ts changes.
  const palette = read('src/lib/palette.ts')
  const tailwind = read('tailwind.config.ts')

  const brandHexes = new Set(
    [...palette.matchAll(/'(#[0-9a-fA-F]{6})'/g)].map((m) => m[1].toLowerCase()),
  )
  assert.ok(brandHexes.size > 0, 'no hexes found in palette.ts')

  const restated = [...tailwind.matchAll(/'(#[0-9a-fA-F]{6})'/g)]
    .map((m) => m[1].toLowerCase())
    .filter((h) => brandHexes.has(h))
  assert.deepEqual(
    restated,
    [],
    `tailwind.config.ts restates brand hexes instead of reading palette.ts: ${restated.join(', ')}`,
  )

  // and it must actually be importing the shared map, not just avoiding hexes
  assert.match(tailwind, /from '\.\/src\/lib\/palette'/)

  // tokens.ts casts the same source through LiteShip rather than its own copy
  const tokens = read('src/lib/tokens.ts')
  assert.match(tokens, /from '\.\/palette'/)
  assert.ok(
    !/'#[0-9a-fA-F]{6}'/.test(tokens),
    'tokens.ts hardcodes a hex instead of reading palette.ts',
  )
})

test('LiteShip diagnostics reach both a build logger and the browser', () => {
  // Two sinks, because they cover different halves. installDiagnosticsBridge
  // takes an Astro logger, so it only sees build/SSR diagnostics. The
  // frozen-signal warnings that matter most fire in the browser and need
  // Diagnostics.setSink client-side. Installing one and calling it done was
  // the trap here.
  const config = read('astro.config.mjs')
  assert.match(config, /installDiagnosticsBridge/)
  assert.match(config, /astro:config:setup/)

  const layoutSrc = read('src/layouts/Layout.astro')
  assert.match(layoutSrc, /installBrowserDiagnostics/)
})
