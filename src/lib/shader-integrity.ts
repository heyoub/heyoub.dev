// 0.4.0: the gpu directive is secure-by-default — an external shader loaded via
// data-czap-shader-src is REFUSED unless the canvas also pins its content with
// data-czap-shader-integrity="sha256-<base64>" (SRI). We compute that pin from
// the shader SOURCE at build (?raw inlines the exact bytes that get served from
// public/shaders/), so editing a shader regenerates the hash automatically — no
// manual bump, no silent "orbs vanished" regression on the next shader edit.
import sceneFragRaw from '../../public/shaders/scene.frag?raw'
import sceneWgslRaw from '../../public/shaders/scene.wgsl?raw'

const cache = new Map<string, string>()

async function sri(key: string, source: string): Promise<string> {
  const hit = cache.get(key)
  if (hit) return hit
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(source))
  const value = `sha256-${btoa(String.fromCharCode(...new Uint8Array(digest)))}`
  cache.set(key, value)
  return value
}

export const sceneFragIntegrity = (): Promise<string> => sri('scene.frag', sceneFragRaw)
export const sceneWgslIntegrity = (): Promise<string> => sri('scene.wgsl', sceneWgslRaw)
