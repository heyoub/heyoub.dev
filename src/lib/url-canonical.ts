// Host + scheme canonicalization, as pure functions so the redirect and the
// `<link rel=canonical>` share ONE source of truth and can be unit-tested with
// no running server (see tests/url-canonical.test.ts).
//
// The apex is the single indexable host. `www` is attached as a second Worker
// custom domain (wrangler.jsonc), so without normalization it becomes its own
// crawl/cache/analytics cohort emitting a self-canonical `www` URL.

export const APEX_ORIGIN = 'https://heyoub.dev'

/**
 * The canonical URL a request should 301 to, or `null` when it is already
 * canonical (or is loopback/dev traffic that must not redirect).
 *
 * Forces https AND strips a leading `www.` in a SINGLE hop, so a `www` + http
 * request resolves straight to apex + https — never www→apex→https (no chains).
 * Path and query ride along byte-for-byte.
 *
 * `loopback` is decided by the caller (host-specific); `scheme` defaults to the
 * URL's own protocol but can be overridden with the edge-resolved client scheme
 * (e.g. Cloudflare's `cf-visitor`) when TLS is terminated upstream.
 */
export function apexRedirectTarget(
  url: URL,
  opts: { loopback: boolean; scheme?: string },
): URL | null {
  if (opts.loopback) return null
  const scheme = opts.scheme ?? url.protocol.replace(':', '')
  const needsHttps = scheme === 'http'
  const needsApex = url.hostname.startsWith('www.')
  if (!needsHttps && !needsApex) return null
  const out = new URL(url.href)
  out.protocol = 'https:'
  if (needsApex) out.hostname = out.hostname.slice(4)
  return out
}

/**
 * Path-aware, apex-hosted canonical URL. Built from the known apex origin plus
 * the requested pathname — never from the (untrusted) request host — so every
 * page self-canonicalizes to `https://heyoub.dev/<path>`, matching the
 * apex-only sitemap.
 */
export function canonicalUrlFor(pathname: string): string {
  return new URL(pathname, APEX_ORIGIN).href
}
