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
//
// CACHE IDENTITY: the middleware keys KV by the single `boundary` content
// address (heroLayout → fnv1a:xxxx), but our compile() emits CSS for ALL the
// layout boundaries together (hero + grid-3 + split-2). So changing or adding
// ANY OTHER boundary leaves heroLayout's address — and the KV key — unchanged,
// and the edge keeps serving stale CSS (the "never-stale" invariant assumes the
// keyed boundary's content covers the whole compiled output; with a bundled
// multi-boundary compile() it doesn't). We restore the invariant by folding a
// hash of the FULL compiled CSS into the KV `prefix`: any boundary change mints
// a fresh keyspace, orphaning the old keys (reclaimed by `ttl`).
// [Upstream finding: content-address should cover the entire compile() output,
//  not just the one keyed boundary — or expose a `cacheKey`/content-salt knob.]
const layoutCss = compileLayoutCss()
function fnv1a(s: string): string {
  let h = 0x811c9dc5
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return (h >>> 0).toString(16).padStart(8, '0')
}

export const onRequest = cloudflareMiddleware({
  manifest: boundaries,
  boundary: 'heroLayout',
  prefix: `layout-${fnv1a(layoutCss)}-`,
  compile: () => ({
    css: layoutCss,
    propertyRegistrations: '',
    containerQueries: '',
  }),
  ttl: 60 * 60 * 24 * 30, // 30 days — orphaned keyspaces from old builds get reclaimed
  detect: true,
  workers: { enabled: true },
})
