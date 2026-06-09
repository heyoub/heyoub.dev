import { defineConfig } from 'astro/config'
import { fileURLToPath } from 'node:url'
import sitemap from '@astrojs/sitemap'
import node from '@astrojs/node'
import { integration as czap } from '@czap/astro'

// Your real site, on Astro + LiteShip. No React. SSR so czapMiddleware can
// resolve the device tier per-request into Astro.locals.czap before paint.
const src = fileURLToPath(new URL('./src', import.meta.url))

export default defineConfig({
  site: 'https://heyoub.dev',
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  integrations: [
    czap({
      detect: true,
      gpu: { enabled: true, preferWebGPU: false },
      stream: { enabled: true },
      llm: { enabled: true },
      workers: { enabled: true },
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
