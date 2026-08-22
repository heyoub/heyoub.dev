// Vite 8 derives `isProduction` from NODE_ENV alone — it never consults
// `--mode` — and both Vite and Astro only default NODE_ENV when it is unset.
// An inherited NODE_ENV therefore wins over both, and a machine whose
// environment sets NODE_ENV=development turns `astro build` into a
// "production" build that defines process.env.NODE_ENV as "development" and
// leaves dev-only branches in shipped code. scripts/build.mjs pins it; these
// guard that it stays pinned.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { productionEnv } from '../scripts/build.mjs'

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))

test('the build env overrides an inherited development NODE_ENV', () => {
  // Through a real process boundary, because the whole failure was about what
  // a *child* process sees — asserting on the object alone would not prove it
  // survives the spawn.
  const seen = execFileSync(process.execPath, ['-p', 'process.env.NODE_ENV'], {
    env: productionEnv({ ...process.env, NODE_ENV: 'development' }),
    encoding: 'utf8',
  }).trim()
  assert.equal(seen, 'production')
})

test('the build script routes through the pin, never bare astro build', () => {
  assert.match(pkg.scripts.build, /node scripts\/build\.mjs/)
  // Any script invoking `astro build` directly bypasses the pin and silently
  // reintroduces the bug, so no script may do it.
  for (const [name, cmd] of Object.entries(pkg.scripts as Record<string, string>)) {
    assert.ok(
      !/(^|&&|\|\||;|\s)astro build(\s|$)/.test(cmd),
      `script "${name}" calls astro build directly, bypassing the NODE_ENV pin: ${cmd}`,
    )
  }
})
