import { test, expect } from '@playwright/test'

// LiteShip integration smoke tests — the things that have actually broken
// during this build: the server-resolved tier shell attrs, the Rust/WASM
// compute kernel loading, and the GPU shader cast booting + rendering.

test('homepage serves with the server-resolved tier triple on <html>', async ({ page }) => {
  const res = await page.goto('/')
  expect(res?.status()).toBe(200)
  // Edge Client-Hints detection writes cap/motion/design onto <html> server-side
  // (rendering-sequence step 3). motion is the TIER, not the reduced-motion pref.
  const html = page.locator('html')
  await expect(html).toHaveAttribute('data-czap-cap', /^(static|styled|reactive|animated|gpu)$/)
  await expect(html).toHaveAttribute('data-czap-motion', /^(none|transitions|animations|physics|compute)$/)
  await expect(html).toHaveAttribute('data-czap-design', /^(minimal|standard|enhanced|rich)$/)
})

test('the WASM compute kernel loads and the badge reports rust', async ({ page }) => {
  await page.goto('/')
  await page.waitForFunction(() => '__CZAP_WASM__' in window, undefined, { timeout: 10_000 })
  const kernels = await page.evaluate(() =>
    Object.keys((window as unknown as { __CZAP_WASM__?: Record<string, unknown> }).__CZAP_WASM__ ?? {}),
  )
  expect(kernels).toEqual(expect.arrayContaining(['springCurve', 'batchBoundaryEval', 'blendNormalize']))
  await expect(page.locator('[data-rb="wasm"]')).toHaveText('rust ✓', { timeout: 10_000 })
})

test('the GPU shader cast boots and renders the scene canvas (?gl=force)', async ({ page }) => {
  // ?gl=force flips data-czap-gpu-force so the shader renders even on the headless
  // SwiftShader tier; on capable real hardware F2 boots it on the default URL too.
  await page.goto('/?gl=force')
  await page.waitForFunction(
    () => {
      const c = document.querySelector('.scene-canvas') as HTMLCanvasElement | null
      return !!c && c.width > 300 && c.width === c.clientWidth
    },
    undefined,
    { timeout: 15_000 },
  )
})

test('no uncaught page errors on load', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  await page.goto('/')
  await page.waitForTimeout(3_000)
  expect(errors).toEqual([])
})
