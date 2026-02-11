import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'
import sitemap from '@astrojs/sitemap'
import AstroPWA from '@vite-pwa/astro'

// https://astro.build/config
export default defineConfig({
  site: 'https://heyoub.dev',
  integrations: [
    react(),
    tailwind(),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    }),
    AstroPWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt', 'sitemap.xml', 'profile.json', 'llms.txt'],
      manifest: {
        name: 'Eassa Ayoub — Cognitive-First Systems',
        short_name: 'Eassa Ayoub',
        description: 'Most software makes users carry its complexity. I build software that feels like thinking.',
        theme_color: '#0a0a0b',
        background_color: '#0a0a0b',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: '/assets/logo/AXLG.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: '/assets/logo/AXLG.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-stylesheets',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
            },
          },
          {
            urlPattern: /\.(?:mp4|webm|ogg)$/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'videos',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 7,
              },
              networkTimeoutSeconds: 10,
            },
          },
          {
            urlPattern: /\.(?:js|css)$/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-resources',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 7,
              },
            },
          },
        ],
        globIgnores: ['**/*.mp4', '**/*.webm'],
      },
    }),
  ],
  vite: {
    plugins: [
      // GLSL support for shaders
      (await import('vite-plugin-glsl')).default({
        include: ['**/*.glsl', '**/*.vert', '**/*.frag'],
        defaultExtension: 'glsl',
        compress: true,
      }),
    ],
    resolve: {
      alias: {
        '@': '/src',
        '@components': '/src/components',
        '@three': '/src/components/three',
        '@lib': '/src/lib',
        '@data': '/src/data',
      },
    },
    build: {
      target: 'esnext',
      cssCodeSplit: true,
      chunkSizeWarningLimit: 600,
      minify: 'esbuild',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks(id) {
            // Core Three.js - the WebGL engine
            if (id.includes('node_modules/three/')) {
              return 'three-core'
            }
            // React Three Fiber - the React reconciler
            if (id.includes('@react-three/fiber')) {
              return 'three-fiber'
            }
            // Drei abstractions - split heavy materials separately
            if (id.includes('@react-three/drei')) {
              // MeshDistortMaterial and similar heavy shaders
              if (id.includes('MeshDistort') || id.includes('MeshWobble') || id.includes('shaderMaterial')) {
                return 'drei-shaders'
              }
              return 'drei-helpers'
            }
            // Framer Motion
            if (id.includes('framer-motion')) {
              return 'framer'
            }
            // React core - split for better caching
            if (id.includes('node_modules/react-dom/')) {
              return 'react-dom'
            }
            if (id.includes('node_modules/react/')) {
              return 'react-core'
            }
            // Scheduler (React internals)
            if (id.includes('node_modules/scheduler/')) {
              return 'react-core'
            }
            // Lenis smooth scroll
            if (id.includes('node_modules/lenis/')) {
              return 'lenis'
            }
          },
        },
      },
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'framer-motion', 'three', '@react-three/fiber', '@react-three/drei'],
    },
  },
  output: 'static',
  build: {
    inlineStylesheets: 'auto',
  },
})
