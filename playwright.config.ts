import { defineConfig } from '@playwright/test'

// Smoke tests for the LiteShip integration surface (tier shell attrs, the WASM
// compute kernel, the GPU shader cast). Headless Chromium needs ANGLE/SwiftShader
// flags to expose WebGL2 (the shader cast falls back to CSS without it).
export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  fullyParallel: false,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4321',
    launchOptions: {
      args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
    },
  },
  // Reuse the dev server if it's already up (it boots slowly on low-end hardware).
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:4321',
    reuseExistingServer: true,
    timeout: 120_000,
  },
})
