import { cloudflareMiddleware } from '@czap/cloudflare'
import { boundaries } from 'virtual:czap/boundaries'
import { apexRedirectTarget } from './lib/url-canonical'
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
// Layout is authored as @quantize convention CSS (src/styles/layout.quantize.css):
// the @czap/vite plugin compiles it to static @container queries in the page
// bundle (driving layout client-side against .czap-vp) AND per-tier precompiled
// outputs in virtual:czap/boundaries. The middleware serves those precompiled
// outputs per boundary — NO compile() callback (the worker bundle stays
// compiler-free), retiring the hand-compiled Style.make + regex-scrape + fnv1a
// salt of the old layout-css.ts. `quantize.container: '.czap-vp'` (astro.config)
// keeps containment off :root, so it never makes <html> the containing block for
// the fixed orb bg/nav (finding #7) — framework-native now, not hand-authored.
const SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  // Deny powerful features the site never uses (verified absent from live headers,
  // 2026-07-14). Matches the-fbf's policy so the two sites don't drift.
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
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
  boundary: ['heroLayout', 'cardGrid', 'splitLayout'],
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

  // Host + scheme canonicalization in ONE hop (no redirect chains): force https
  // AND strip a leading `www.` so a `www` + http hit resolves straight to
  // apex + https in a single 301 (never www→apex→https). Both hosts are attached
  // as Worker custom domains, so `www` would otherwise be its own crawl/cache/
  // analytics cohort with a self-canonical `www` URL. Local dev is exempt so it
  // can't redirect-loop. The edge "Always Use HTTPS" toggle does the scheme half
  // before the Worker too — this is the in-app guarantee, regardless of zone config.
  // Logic lives in the pure, unit-tested `apexRedirectTarget` (lib/url-canonical).
  const isLoopback = /^(localhost|127\.|0\.0\.0\.0|\[)/.test(url.hostname)
  const redirectTo = apexRedirectTarget(url, { loopback: isLoopback })
  if (redirectTo) {
    return new Response(null, { status: 301, headers: { Location: redirectTo.href, ...SECURITY_HEADERS } })
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
