import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import glsl from 'vite-plugin-glsl'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    glsl({
      include: [
        '**/*.glsl',
        '**/*.vert',
        '**/*.frag',
      ],
      defaultExtension: 'glsl',
      compress: true,
    }),
    // PWA with Service Worker for aggressive caching
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt', 'sitemap.xml', 'profile.json', 'llms.txt'],
      manifest: {
        name: 'Eassa Ayoub — Technical Architect',
        short_name: 'Eassa Ayoub',
        description: 'Building software that feels like thinking. Technical Architect specializing in AI Systems & Cross-Domain Synthesis.',
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
        // Cache strategies for different asset types
        runtimeCaching: [
          {
            // Cache Google Fonts stylesheets
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-stylesheets',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
          {
            // Cache Google Fonts webfonts
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
          {
            // Cache images
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
          {
            // Cache videos with network-first (large files)
            urlPattern: /\.(?:mp4|webm|ogg)$/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'videos',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
              },
              networkTimeoutSeconds: 10,
            },
          },
          {
            // Cache JS/CSS with stale-while-revalidate
            urlPattern: /\.(?:js|css)$/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-resources',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
              },
            },
          },
        ],
        // Don't precache videos (too large)
        globIgnores: ['**/*.mp4', '**/*.webm'],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@three': '/src/components/three',
      '@hooks': '/src/hooks',
      '@lib': '/src/lib',
      '@data': '/src/data',
    },
  },
  build: {
    // Target modern browsers for smaller bundles
    target: 'esnext',
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Minification settings
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          // Split Three.js into its own chunk
          'three': ['three', '@react-three/fiber', '@react-three/drei'],
          // Split Framer Motion into its own chunk
          'framer': ['framer-motion'],
          // Split React vendor into its own chunk
          'react-vendor': ['react', 'react-dom'],
        },
        // Optimize chunk file names for caching
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    // Increase chunk size warning limit since we're intentionally splitting
    chunkSizeWarningLimit: 1000,
    // Source maps for production debugging (optional)
    sourcemap: false,
  },
  // Optimize dependency pre-bundling
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion', 'three', '@react-three/fiber', '@react-three/drei'],
  },
  // Server optimizations for dev
  server: {
    // Enable compression
    middlewareMode: false,
  },
})
