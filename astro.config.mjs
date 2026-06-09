import { defineConfig } from 'astro/config'
import { fileURLToPath } from 'node:url'
import node from '@astrojs/node'
import { integration as czap } from '@czap/astro'

// `@/` must resolve in client <script> bundling too (vite uses resolve.alias,
// not tsconfig paths) — otherwise client-side module imports silently drop.
const srcAlias = fileURLToPath(new URL('./src', import.meta.url))

// heyoub.dev v3 — Astro 6 host, LiteShip (CZAP) owns adaptive state.
// SSR so czapMiddleware can resolve the device tier per-request into
// Astro.locals.czap before first paint. Cloudflare adapter swaps in later
// (Phase 6); @astrojs/node keeps the Phase-0 spike runnable anywhere.
export default defineConfig({
  site: 'https://heyoub.dev',
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  integrations: [
    czap({
      detect: true,
      gpu: { enabled: true, preferWebGPU: false },
      workers: { enabled: true },
      stream: { enabled: true },
      llm: { enabled: true },
      wasm: { enabled: true },
    }),
  ],
  vite: {
    resolve: {
      alias: { '@': srcAlias },
    },
  },
})
