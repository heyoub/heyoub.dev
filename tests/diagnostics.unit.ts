// The diagnostics bridge, executed rather than grepped.
//
// This guard used to be `assert.match(read('astro.config.mjs'),
// /installDiagnosticsBridge/)` — it proved the string was present and nothing
// else. It would have passed with the call inside a hook that never fires,
// with a logger shape @czap/astro rejects, or against an upstream change to
// what installDiagnosticsBridge does. So it now runs the real integration
// hook and checks that a real diagnostic comes out the other end.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { Diagnostics } from '@czap/core'

test('the configured bridge routes czap diagnostics into the Astro logger', async () => {
  // installDiagnosticsBridge covers build/SSR (it takes an Astro logger, which
  // only exists server-side) — a genuine gain: those diagnostics respect
  // --json output and land in the stream CI already parses, instead of raw
  // console.
  //
  // There is deliberately no browser-side half. @czap/core's defaultSink
  // already writes labelled `[source] code: message` diagnostics straight to
  // console in every environment, browser included (diagnostics.js reads
  // globalThis.console) — so a directive wired to a bad signal input was never
  // silent. A prior version of this repo installed a second sink on the false
  // premise that it was; measured against the real default, it only stuttered
  // the label (`[czap:czap/astro.satellite]` doubling the already-namespaced
  // source) and silently dropped `event.detail` / `event.cause`, which the
  // default sink forwards as extra console args. Net regression, removed. If a
  // browser sink is proposed again, it needs to beat the default sink on a
  // real diff, not assume one exists.
  const config = (await import('../astro.config.mjs')).default
  const integration = (config.integrations ?? [])
    .flat()
    .filter(Boolean)
    .find((i: { name?: string }) => i.name === 'czap-diagnostics')
  assert.ok(integration, 'the czap-diagnostics integration is gone from astro.config.mjs')

  const seen: { level: string; message: string }[] = []
  const logger = {
    warn: (message: string) => seen.push({ level: 'warn', message }),
    error: (message: string) => seen.push({ level: 'error', message }),
  }

  try {
    await integration.hooks['astro:config:setup']({ logger })
    Diagnostics.warn({ source: 'test/bridge', code: 'probe-warn', message: 'routed' })
    Diagnostics.error({ source: 'test/bridge', code: 'probe-error', message: 'also routed' })

    assert.equal(seen.length, 2, 'diagnostics never reached the Astro logger')
    assert.equal(seen[0].level, 'warn')
    assert.match(seen[0].message, /probe-warn/, 'the warn diagnostic lost its code')
    assert.equal(seen[1].level, 'error', 'error-level diagnostics were downgraded or dropped')
    assert.match(seen[1].message, /probe-error/)
  } finally {
    // The bridge swaps the process-wide sink; leaving it installed would make
    // every later test in this run log through a dead closure.
    Diagnostics.resetSink()
  }
})
