import { czapMiddleware } from '@czap/astro'

// LiteShip resolves the device tier per-request from Client Hints + UA into
// Astro.locals.czap before first paint. With workers enabled it also sets
// COOP `same-origin` + COEP `require-corp`, so the page is crossOriginIsolated
// and @czap/worker gets SharedArrayBuffer (the hero boundary evaluates
// off-thread over an SPSC ring). Google Fonts survives require-corp — both
// the stylesheet and font files ship CORP headers (verified in headless).
export const onRequest = czapMiddleware({
  detect: true,
  workers: { enabled: true },
})
