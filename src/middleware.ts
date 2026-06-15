import { cloudflareMiddleware } from '@czap/cloudflare'
import { boundaries } from 'virtual:czap/boundaries'
import { compileLayoutCss } from './lib/layout-css'

// LiteShip on Cloudflare Workers: per-request tier detection from Client
// Hints + UA into Astro.locals.czap, with the compiled boundary CSS memoized
// in Workers KV. With workers enabled it also sets COOP/COEP, so the page is
// crossOriginIsolated and the hero boundary evaluates off-thread over a
// SharedArrayBuffer ring (Google Fonts ships CORP headers; verified).
//
// 0.2.0: the boundary id is now derived from the build-emitted manifest
// (`virtual:czap/boundaries`, keyed by export name) instead of hand-typed —
// `binding` defaults to CZAP_BOUNDARY_CACHE so it's dropped too.
//
// We keep our own `.czap-vp`-scoped compile as the CSS source rather than
// adopting `@quantize` precompiled outputs: @czap/vite's @quantize auto-emits
// a `:root` container-type for viewport.width boundaries with no opt-out
// (css-quantize.ts viewportContainmentRule), and :root containment makes
// <html> the containing block for our viewport-fixed background/nav/parallax
// (the "orbs vanished" bug). Scoping the container to .czap-vp is the whole
// point — so the manifest gives us identity + KV keying, our compile gives the
// scoped CSS. [Upstream finding: @quantize needs a container-target option.]
export const onRequest = cloudflareMiddleware({
  manifest: boundaries,
  boundary: 'heroLayout',
  compile: () => ({
    css: compileLayoutCss(),
    propertyRegistrations: '',
    containerQueries: '',
  }),
  ttl: 60 * 60 * 24, // a day — the CSS only changes on deploy
  detect: true,
  workers: { enabled: true },
})
