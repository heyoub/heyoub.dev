import { defineConfig } from 'astro/config'
import { fileURLToPath } from 'node:url'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'

// Your real site: Astro + React islands + Three.js + framer-motion + Lenis,
// exactly as built. The frontend-hq workspace path aliases, inlined.
const src = fileURLToPath(new URL('./src', import.meta.url))

export default defineConfig({
  site: 'https://heyoub.dev',
  integrations: [react(), sitemap()],
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
      dedupe: ['react', 'react-dom'],
    },
    ssr: { noExternal: ['framer-motion'] },
  },
})
