import { cloudflareMiddleware } from '@czap/cloudflare'
import { heroLayout } from './lib/boundaries'
import { compileLayoutCss } from './lib/layout-css'

// LiteShip on Cloudflare Workers: per-request tier detection from Client
// Hints + UA into Astro.locals.czap, with the compiled boundary CSS memoized
// in Workers KV keyed by (boundary, tier) — repeat requests at the same tier
// skip the StyleCSSCompiler entirely and LayoutStyles reads the cached output
// off locals.czap.edge. With workers enabled it also sets COOP/COEP, so the
// page is crossOriginIsolated and the hero boundary evaluates off-thread over
// a SharedArrayBuffer ring (Google Fonts ships CORP headers; verified).
export const onRequest = cloudflareMiddleware({
  binding: 'CZAP_BOUNDARY_CACHE',
  boundaryId: heroLayout.id,
  compile: () => ({
    css: compileLayoutCss(),
    propertyRegistrations: '',
    containerQueries: '',
  }),
  ttl: 60 * 60 * 24, // a day — the CSS only changes on deploy
  detect: true,
  workers: { enabled: true },
})
