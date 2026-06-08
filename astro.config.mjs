import { defineConfig } from 'astro/config'
import node from '@astrojs/node'
import { integration as czap } from '@czap/astro'

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
})
