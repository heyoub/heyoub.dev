import { czapMiddleware } from '@czap/astro'

// Per-request bridge: parses Client Hints (Sec-CH-Viewport-Width, DPR,
// Save-Data, ECT, prefers-*) + User-Agent into a resolved tier and writes
// it to Astro.locals.czap, so pages can branch markup before first paint.
// Pure Client-Hints mode for now; an @czap/edge adapter (KV cache) gets
// passed here in Phase 6 when we move onto Cloudflare.
export const onRequest = czapMiddleware({
  detect: true,
  workers: { enabled: true },
})
