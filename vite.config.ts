import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import glsl from 'vite-plugin-glsl'

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
      },
    },
    // Increase chunk size warning limit since we're intentionally splitting
    chunkSizeWarningLimit: 1000,
  },
})
