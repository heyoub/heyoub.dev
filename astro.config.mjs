import { defineConfig } from 'astro/config'
import { fileURLToPath } from 'node:url'
import sitemap from '@astrojs/sitemap'
import cloudflare from '@astrojs/cloudflare'
import { integration as czap } from '@czap/astro'

// Your real site, on Astro + LiteShip. No React. SSR on Cloudflare Workers so
// cloudflareMiddleware can resolve the device tier per-request (with the
// compiled boundary CSS cached in Workers KV at the edge) before paint.
const src = fileURLToPath(new URL('./src', import.meta.url))

export default defineConfig({
  site: 'https://heyoub.dev',
  output: 'server',
  adapter: cloudflare(),
  integrations: [
    czap({
      // detect / gpu default-on; 0.2.0 auto-registers directives (no rename
      // ritual). preferWebGPU lights up the net-new WGSL cast where supported,
      // falling back to the GLSL cast otherwise. workers stays on for the
      // off-thread hero boundary (COOP/COEP). stream/llm/wasm dropped: no SSE,
      // AI is out of scope here, and wasm is opt-in (TS fallback is identical).
      detect: true,
      gpu: { enabled: true, preferWebGPU: true },
      workers: { enabled: true },
      stream: { enabled: false },
      llm: { enabled: false },
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
