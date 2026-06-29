import { cloudflareMiddleware } from '@czap/cloudflare'
import { boundaries } from 'virtual:czap/boundaries'
import { compileLayoutCss } from './lib/layout-css'
// The same llms.txt served statically at /llms.txt, inlined at build time so
// markdown content-negotiation needs no runtime ASSETS binding (one source).
import llmsMarkdown from '../public/llms.txt?raw'

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

const SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
}

// RFC 8288 Link headers for agent discovery — point crawlers/agents at the
// real agent-facing surfaces this site already serves (no fabricated endpoints).
// rels are IANA-registered: api-catalog (RFC 9727), service-doc/service-desc
// (RFC 8631), describedby, sitemap.
const LINK_HEADER = [
  '</.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"',
  '</llms.txt>; rel="service-doc"; type="text/plain"',
  '</manifest.json>; rel="service-desc"; type="application/json"',
  '</profile.json>; rel="describedby"; type="application/json"',
  '</sitemap-index.xml>; rel="sitemap"; type="application/xml"',
].join(', ')

// Markdown content negotiation (RFC-ish "Markdown for Agents"): an agent that
// sends `Accept: text/markdown` for the homepage gets the maintained llms.txt
// (a true markdown summary of the site) instead of the visual HTML. Browsers,
// which don't ask for markdown, still get the HTML default.
function markdownForAgents(context: any, url: URL): Response | null {
  const accept = context.request.headers.get('accept') ?? ''
  if (context.request.method !== 'GET' || url.pathname !== '/' || !/text\/markdown/i.test(accept)) return null
  const headers = new Headers()
  headers.set('Content-Type', 'text/markdown; charset=utf-8')
  headers.set('Link', LINK_HEADER)
  headers.set('Vary', 'Accept')
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) headers.set(k, v)
  return new Response(llmsMarkdown, { status: 200, headers })
}

const czapHandler = cloudflareMiddleware({
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

// Wrap czap middleware to inject security headers on the response.
// czapHandler calls next() internally and returns a Response with its own headers;
// we clone the response with additional headers (Workers response.headers can be
// read-only depending on how the underlying Response was constructed).
export const onRequest = async (context: any, next: () => Promise<Response>): Promise<Response> => {
  const url = new URL(context.request.url)

  // Always Use HTTPS: 301 any http:// hit to its https:// equivalent (skip local
  // dev so astro/wrangler dev on http://localhost don't redirect-loop). The edge
  // "Always Use HTTPS" zone toggle does this before the Worker too — this is the
  // in-app guarantee so it holds regardless of zone config.
  if (url.protocol === 'http:' && !/^(localhost|127\.|0\.0\.0\.0|\[)/.test(url.hostname)) {
    url.protocol = 'https:'
    return new Response(null, { status: 301, headers: { Location: url.href, ...SECURITY_HEADERS } })
  }

  // Agent content negotiation short-circuits the HTML render entirely.
  const md = markdownForAgents(context, url)
  if (md) return md

  const response: Response = await czapHandler(context, next)
  const headers = new Headers(response.headers)
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) {
    headers.set(k, v)
  }
  headers.set('Link', LINK_HEADER)
  headers.append('Vary', 'Accept') // we content-negotiate on Accept (markdown)
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}
