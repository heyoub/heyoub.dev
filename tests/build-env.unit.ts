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
import { productionEnv, runBuild } from '../scripts/build.mjs'
import { clearWorkerd, killCommand } from '../scripts/clear-workerd.mjs'

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

// ---- stale workerd sweep ---------------------------------------------------
//
// The Cloudflare adapter spawns workerd to prerender and does not reap it. The
// survivors hold dist/client open, so the NEXT build dies in Astro's emptyDir
// with EPERM plus a libuv assertion that reads like a crash rather than a stale
// lock. Reproduced on the sibling repo: build 1 exits 0 and leaves two workerd
// processes, build 2 then fails. Same adapter here, same exposure.

test('the kill command is right for each platform', () => {
  const win = killCommand('win32')
  assert.equal(win.cmd, 'taskkill')
  assert.ok(win.args.includes('workerd.exe'), 'Windows kill must name workerd.exe')
  assert.ok(win.args.includes('/T'), 'Windows kill must include /T for the process tree')
  for (const platform of ['linux', 'darwin']) {
    const posix = killCommand(platform)
    assert.equal(posix.cmd, 'pkill', `${platform} should use pkill`)
    assert.ok(posix.args.includes('workerd'))
  }
})

test('finding nothing to kill is not a build failure', () => {
  // taskkill exits 128, pkill exits 1, when nothing matches — the normal case.
  for (const status of [128, 1]) {
    assert.equal(
      clearWorkerd({ platform: 'win32', run: () => ({ status }), log: () => {}, wait: () => {} }),
      false,
      `status ${status} should report nothing killed`,
    )
  }
})

test('a missing taskkill/pkill binary does not stop the build', () => {
  assert.doesNotThrow(() =>
    clearWorkerd({
      run: () => {
        throw new Error('ENOENT')
      },
      log: () => {},
      wait: () => {},
    }),
  )
})

test('a successful kill settles before returning, so the handle is released', () => {
  let waited = 0
  const killed = clearWorkerd({
    run: () => ({ status: 0 }),
    log: () => {},
    wait: (ms) => (waited = ms),
  })
  assert.equal(killed, true)
  assert.ok(waited > 0, 'a successful kill must wait for handles to release')
})

test('the sweep runs BEFORE astro build, not after', () => {
  // The lock is on dist/client, which astro build empties on startup, so
  // sweeping afterwards is sweeping after the failure.
  const order: string[] = []
  const code = runBuild({
    clear: () => order.push('clear'),
    run: (...args) => {
      order.push('build')
      assert.equal((args[2] as { env: Record<string, string> }).env.NODE_ENV, 'production')
      return { status: 0 }
    },
  })
  assert.deepEqual(order, ['clear', 'build'])
  assert.equal(code, 0)
})

test('runBuild reports a failing build rather than swallowing it', () => {
  assert.equal(runBuild({ clear: () => {}, run: () => ({ status: 3 }) }), 3)
  assert.equal(runBuild({ clear: () => {}, run: () => ({}) }), 1)
})
