#!/usr/bin/env node
// Reproducible Core Web Vitals probe with attribution — the lab half of issues
// #6 (LCP tail), #7 (INP outliers), and #8 (footer CLS).
//
// Why this exists rather than a browser-extension session or PageSpeed Insights:
// all three of those failed for structural reasons, not bad luck.
//
//   1. An observer installed AFTER load misses LCP entirely, and Chrome does not
//      report LCP for a backgrounded tab at all. Driving a real browser by hand
//      produced 6183ms on one run and an empty buffer on the next — both
//      artifacts of the harness, not the site. FIX: addInitScript() runs before
//      any page script, so the observer exists from navigation start, and a
//      Playwright page is always foregrounded.
//   2. Resizing a browser window does not change the page viewport (innerWidth
//      stayed 1920 after a resize to 390), so "mobile" runs were desktop runs
//      wearing a hat. FIX: CDP device emulation sets viewport, DPR, UA, and
//      touch for real. This matters because the field RUM is mostly mobile.
//   3. PageSpeed Insights rate-limits (429) without an API key. FIX: run the
//      measurement locally, unthrottled by anyone's quota.
//
// This is LAB data — reproducible, attributable, good for finding a cause and
// proving a fix. It is NOT field data. The numbers in #6/#7/#8 come from
// Cloudflare RUM (the page POSTs to /cdn-cgi/rum), so the FIELD half lives in
// Cloudflare Web Analytics. Lab tells you why; field tells you whether it matters.
//
// Usage:
//   node scripts/perf-probe.mjs                          # prod, both profiles
//   node scripts/perf-probe.mjs --url http://localhost:4321
//   node scripts/perf-probe.mjs --profile mobile
//   node scripts/perf-probe.mjs --reduced-motion         # measure the still-frame path

import { chromium, devices } from '@playwright/test'

const arg = (flag, fallback) => {
  const i = process.argv.indexOf(flag)
  return i !== -1 && process.argv[i + 1] && !process.argv[i + 1].startsWith('--') ? process.argv[i + 1] : fallback
}
const URL_ = arg('--url', 'https://heyoub.dev/')
const ONLY = arg('--profile', null)
const REDUCED = process.argv.includes('--reduced-motion')

// Lighthouse's mobile defaults — the conditions field RUM actually samples.
// Slow 4G: 1.6Mbit down / 750Kbit up / 150ms RTT. 4x CPU slowdown approximates
// a mid-tier Android against a desktop dev machine.
const PROFILES = [
  {
    name: 'mobile',
    device: devices['Pixel 5'],
    cpu: 4,
    net: { offline: false, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8, latency: 150 },
  },
  {
    name: 'desktop',
    device: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, isMobile: false, hasTouch: false },
    cpu: 1,
    net: null,
  },
]

// Installed via addInitScript — runs before ANY page script, so nothing is missed.
function collector() {
  window.__V = { lcp: [], shifts: [], longtasks: [], events: [] }
  const d = (n) => {
    if (!n || !n.tagName) return '(detached)'
    const id = n.id ? '#' + n.id : ''
    const cls = n.className && typeof n.className === 'string'
      ? '.' + n.className.split(' ').filter(Boolean).slice(0, 3).join('.')
      : ''
    return n.tagName.toLowerCase() + id + cls
  }
  const obs = (type, fn, extra) => {
    try {
      new PerformanceObserver((l) => l.getEntries().forEach(fn)).observe({ type, buffered: true, ...extra })
    } catch { /* type unsupported in this browser — the others still report */ }
  }
  obs('largest-contentful-paint', (e) =>
    window.__V.lcp.push({ t: Math.round(e.startTime), size: e.size, el: d(e.element), url: e.url || null }))
  obs('layout-shift', (e) => {
    if (e.hadRecentInput) return
    window.__V.shifts.push({ v: +e.value.toFixed(5), t: Math.round(e.startTime), src: (e.sources || []).map((s) => d(s.node)) })
  })
  obs('longtask', (e) => window.__V.longtasks.push({ t: Math.round(e.startTime), dur: Math.round(e.duration) }))
  obs('event', (e) =>
    window.__V.events.push({ name: e.name, dur: Math.round(e.duration), el: d(e.target) }), { durationThreshold: 40 })
}

async function run(profile) {
  const browser = await chromium.launch({
    // The GPU shader cast needs software GL in headless, or it silently falls back
    // to the CSS gradient and the run measures a page the user never sees.
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
  })
  const context = await browser.newContext({
    ...profile.device,
    reducedMotion: REDUCED ? 'reduce' : 'no-preference',
  })
  const page = await context.newPage()
  await page.addInitScript(collector)

  const cdp = await context.newCDPSession(page)
  if (profile.cpu > 1) await cdp.send('Emulation.setCPUThrottlingRate', { rate: profile.cpu })
  if (profile.net) await cdp.send('Network.emulateNetworkConditions', profile.net)

  await page.goto(URL_, { waitUntil: 'load', timeout: 90_000 })
  await page.waitForTimeout(3000)

  // LCP finalises on first interaction; scroll AFTER a settle so the load-phase
  // LCP is honest, then keep observing so footer-entry shifts (#8) still land.
  await page.evaluate(() => scrollTo({ top: document.documentElement.scrollHeight / 2, behavior: 'instant' }))
  await page.waitForTimeout(1500)
  await page.evaluate(() => scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }))
  await page.waitForTimeout(2500)

  // INP proxy: drive a real interaction and read its event duration.
  let inp = null
  const faq = page.locator('summary').first()
  if (await faq.count()) {
    await faq.click({ timeout: 5000 }).catch(() => {})
    await page.waitForTimeout(1200)
    inp = await page.evaluate(() => {
      const es = window.__V.events || []
      return es.length ? Math.max(...es.map((e) => e.dur)) : 0
    })
  }

  const v = await page.evaluate(() => window.__V)
  const nav = await page.evaluate(() => {
    const n = performance.getEntriesByType('navigation')[0]
    return n ? { ttfb: Math.round(n.responseStart), load: Math.round(n.loadEventEnd) } : null
  })
  await browser.close()

  const lcp = v.lcp.length ? v.lcp[v.lcp.length - 1] : null
  const cls = +v.shifts.reduce((a, s) => a + s.v, 0).toFixed(5)
  const tbt = v.longtasks.reduce((a, t) => a + Math.max(0, t.dur - 50), 0)
  return { profile: profile.name, nav, lcp, cls, shifts: [...v.shifts].sort((a, b) => b.v - a.v).slice(0, 6), tbt, longtasks: v.longtasks.length, inp, slowEvents: v.events.slice(0, 5) }
}

// Thresholds are Google's published Core Web Vitals "good" bounds.
const rate = (metric, value) => {
  if (value == null) return '?'
  const t = { lcp: [2500, 4000], cls: [0.1, 0.25], inp: [200, 500], tbt: [200, 600] }[metric]
  return value <= t[0] ? 'good' : value <= t[1] ? 'needs-improvement' : 'POOR'
}

console.log(`\nperf probe — ${URL_}${REDUCED ? '  [prefers-reduced-motion: reduce]' : ''}\n`)
for (const p of PROFILES) {
  if (ONLY && p.name !== ONLY) continue
  const r = await run(p)
  console.log(`── ${r.profile}${p.cpu > 1 ? `  (${p.cpu}x CPU, Slow 4G)` : ''} ──`)
  if (r.nav) console.log(`   TTFB ${r.nav.ttfb}ms   load ${r.nav.load}ms`)
  console.log(`   LCP  ${r.lcp ? r.lcp.t + 'ms' : 'not reported'}  ${r.lcp ? '[' + rate('lcp', r.lcp.t) + ']' : ''}`)
  if (r.lcp) console.log(`        element: ${r.lcp.el}${r.lcp.url ? '\n        url:     ' + r.lcp.url : ''}`)
  console.log(`   CLS  ${r.cls}  [${rate('cls', r.cls)}]`)
  for (const s of r.shifts) console.log(`        ${String(s.v).padEnd(9)} @${s.t}ms  ${s.src.join(', ') || '(no source)'}`)
  console.log(`   TBT  ${r.tbt}ms  [${rate('tbt', r.tbt)}]  (${r.longtasks} long tasks)`)
  console.log(`   INP  ${r.inp != null ? r.inp + 'ms  [' + rate('inp', r.inp) + ']  (FAQ summary click)' : 'no interactive target found'}`)
  for (const e of r.slowEvents) console.log(`        ${e.name} ${e.dur}ms on ${e.el}`)
  console.log('')
}
