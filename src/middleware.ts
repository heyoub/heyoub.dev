import { czapMiddleware } from '@czap/astro'

// LiteShip resolves the device tier per-request from Client Hints + UA into
// Astro.locals.czap before first paint.
export const onRequest = czapMiddleware({
  detect: true,
  workers: { enabled: true },
})
