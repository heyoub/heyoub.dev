#!/usr/bin/env node
// Resolve heyoub.dev's live TXT records and check them against the expected set
// in src/lib/dns-records.ts. Runs in predeploy, so a deploy cannot ship over
// silently-broken DNS.
//
// Queries authoritative nameservers directly rather than the system resolver:
// a cached negative from a local resolver would otherwise read as "record gone"
// and a cached positive would hide a real deletion. We want ground truth.
//
// Exit 1 on a missing required record or a forbidden one. `--warn` downgrades to
// a report (used when you want the picture without failing a deploy).

import { Resolver } from 'node:dns/promises'

// .href, not fileURLToPath: import() needs a file:// URL — a bare Windows drive
// path is rejected as an unsupported scheme.
const { EXPECTED_TXT, FORBIDDEN_TXT, APEX } = await import(
  new URL('../src/lib/dns-records.ts', import.meta.url).href
)

const warnOnly = process.argv.includes('--warn')

async function authoritativeTxt(domain) {
  const sys = new Resolver()
  const ns = await sys.resolveNs(domain)
  // Resolve each nameserver to an address, then ask it directly.
  const addrs = []
  for (const host of ns) {
    try {
      addrs.push(...(await sys.resolve4(host)))
    } catch {
      /* nameserver without an A record — skip it, another will answer */
    }
  }
  if (!addrs.length) throw new Error(`no authoritative nameserver addresses for ${domain}`)
  const auth = new Resolver()
  auth.setServers(addrs)
  const records = await auth.resolveTxt(domain)
  // node returns TXT as arrays of string chunks; a long record is split at 255
  // bytes and MUST be rejoined before matching, or a >255-byte token never matches.
  return { ns, records: records.map((chunks) => chunks.join('')) }
}

const { ns, records } = await authoritativeTxt(APEX)

console.log(`DNS check — ${APEX}`)
console.log(`authoritative: ${ns.join(', ')}`)
console.log(`${records.length} TXT record(s) live\n`)

const problems = []

for (const exp of EXPECTED_TXT) {
  if (exp.status !== 'required') continue
  const hit = records.find((r) => (exp.prefixOnly ? r.startsWith(exp.value) : r === exp.value))
  if (hit) {
    console.log(`  OK       ${exp.id.padEnd(28)} ${hit.slice(0, 52)}${hit.length > 52 ? '…' : ''}`)
  } else {
    console.log(`  MISSING  ${exp.id.padEnd(28)} expected ${exp.prefixOnly ? 'prefix ' : ''}"${exp.value}"`)
    problems.push({ kind: 'missing', exp })
  }
}

for (const bad of FORBIDDEN_TXT) {
  for (const r of records) {
    if (r.includes(bad.match)) {
      console.log(`  FORBIDDEN ${bad.id.padEnd(27)} ${r}`)
      problems.push({ kind: 'forbidden', bad, record: r })
    }
  }
}

// Surface records we don't have an expectation for. Not a failure — it's how a
// new record gets noticed and either documented or removed, instead of accreting.
const unexpected = records.filter(
  (r) => !EXPECTED_TXT.some((e) => (e.prefixOnly ? r.startsWith(e.value) : r === e.value)),
)
if (unexpected.length) {
  console.log('')
  for (const r of unexpected) console.log(`  UNTRACKED ${r.slice(0, 68)}${r.length > 68 ? '…' : ''}`)
  console.log('  ^ not in dns-records.ts — document it there or remove it from the zone.')
}

if (!problems.length) {
  console.log('\nAll required TXT records present. No forbidden records.')
  process.exit(0)
}

console.log(`\n${problems.length} problem(s):\n`)
for (const p of problems) {
  if (p.kind === 'missing') {
    console.log(`  ${p.exp.id}`)
    console.log(`    breaks:  ${p.exp.why}`)
    console.log(`    reissue: ${p.exp.reissue}\n`)
  } else {
    console.log(`  ${p.bad.id}`)
    console.log(`    live:    ${p.record}`)
    console.log(`    why bad: ${p.bad.why}\n`)
  }
}

if (warnOnly) {
  console.log('(--warn: reporting only, not failing)')
  process.exit(0)
}
process.exit(1)
