import { defineConfig, fontProviders } from 'astro/config'
import { fileURLToPath } from 'node:url'
import sitemap from '@astrojs/sitemap'
import cloudflare from '@astrojs/cloudflare'
import { integration as czap, installDiagnosticsBridge } from '@czap/astro'
import { cloudflareCacheProvider } from '@czap/cloudflare/cache-provider'

// Your real site, on Astro + LiteShip. No React. SSR on Cloudflare Workers so
// cloudflareMiddleware can resolve the device tier per-request (with the
// compiled boundary CSS cached in Workers KV at the edge) before paint.
const src = fileURLToPath(new URL('./src', import.meta.url))

export default defineConfig({
  site: 'https://heyoub.dev',
  output: 'server',
  adapter: cloudflare(),
  // #9 — Astro 7's cache API, backed by CZAP's Cloudflare KV boundary cache with
  // tag-based active invalidation (BoundaryCache.invalidateByTag/Path). Distinct
  // `czap` key prefix from the middleware's `layout-<hash>-`, so no collision.
  cache: { provider: cloudflareCacheProvider({ binding: 'CZAP_BOUNDARY_CACHE' }) },
  // Astro Fonts API (stable, Astro 7): self-host at BUILD time (Cloudflare-safe,
  // no runtime), preload the LCP-critical faces, and auto-generate size-adjust /
  // ascent-override metric-matched fallbacks (zero-CLS swap). Retires the render-
  // blocking cross-origin Google Fonts <link> + its preconnect hints. Dropped Fira
  // Code (0 uses). Same typefaces → pixel-identical once loaded, faster to first
  // paint. cssVariable resolves to `"<Font>", <metric-matched fallback>, <generic>`.
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'DM Sans',
      cssVariable: '--font-dm-sans',
      weights: [300, 400, 500, 600],
    },
    {
      provider: fontProviders.google(),
      name: 'Instrument Serif',
      cssVariable: '--font-instrument-serif',
      weights: [400],
      styles: ['normal', 'italic'],
    },
    {
      provider: fontProviders.google(),
      name: 'Space Mono',
      cssVariable: '--font-space-mono',
      weights: [400, 700],
    },
  ],
  integrations: [
    czap({
      // detect / gpu default-on; 0.2.0 auto-registers directives (no rename
      // ritual). preferWebGPU lights up the net-new WGSL cast where supported,
      // falling back to the GLSL cast otherwise. workers stays on for the
      // off-thread hero boundary (COOP/COEP).
      detect: true,
      gpu: { enabled: true, preferWebGPU: true },
      workers: { enabled: true },
      stream: { enabled: false },
      llm: { enabled: false },
      // wasm ON (0.2.1): @czap/core ships czap-compute.wasm; @czap/vite resolves
      // it off the plain install through the module graph (no path needed, no
      // hosted artifact). The runtime fires czap:wasm-ready and publishes the
      // Rust kernels to window.__CZAP_WASM__ — Boundary.evaluateBatch routes
      // through them. Falls back to the (bit-identical) JS kernels if absent.
      wasm: { enabled: true },
      // @quantize convention CSS (src/styles/layout.quantize.css): retarget the
      // auto-emitted viewport @container containment off :root onto .czap-vp —
      // :root can't be size-contained here (it'd make <html> the containing block
      // for the fixed orb bg/nav/parallax = the "orbs vanished" bug). The plugin
      // now owns the .czap-vp container rule; finding-#7 guard, framework-native.
      vite: {
        quantize: { container: '.czap-vp' },
        dirs: { boundary: 'src/lib', style: 'src/styles' },
      },
    }),
    sitemap(),
    // Route @czap's build/SSR diagnostics into Astro's logger, so they land
    // in the same stream --json configures instead of raw console. No
    // browser half: @czap/core's defaultSink already writes labelled
    // diagnostics (`[source] code: message`, plus detail/cause) to console
    // in every environment. A second console sink was built, measured, and
    // removed — it stuttered its prefix to `[czap:czap/astro.satellite]`
    // and dropped detail/cause. Don't re-add one without re-measuring.
    {
      name: 'czap-diagnostics',
      hooks: {
        'astro:config:setup': ({ logger }) => {
          installDiagnosticsBridge(logger)
        },
      },
    },
  ],
  vite: {
    resolve: {
      alias: {
        '@': src,
        '@components': `${src}/components`,
        '@three': `${src}/components/three`,
        '@lib': `${src}/lib`,
        '@data': `${src}/data`,
        '@hooks': `${src}/hooks`,
      },
    },
  },
})
