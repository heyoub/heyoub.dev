import { defineConfig } from 'astro/config'
import { fileURLToPath } from 'node:url'
import sitemap from '@astrojs/sitemap'
import cloudflare from '@astrojs/cloudflare'
import { integration as czap } from '@czap/astro'
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
    }),
    sitemap(),
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
