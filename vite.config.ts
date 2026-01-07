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
})
