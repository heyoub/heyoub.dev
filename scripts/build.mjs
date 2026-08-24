// Pins NODE_ENV=production for the real build.
//
// Vite 8 decides `isProduction` from NODE_ENV alone — it never consults
// `--mode` (vite/dist/node/chunks/node.js:34582). Astro and Vite both only
// *default* NODE_ENV when it is unset (`ensureProcessNodeEnv`, and vite's
// `isNodeEnvSet` guard at node.js:34454), so an inherited NODE_ENV wins over
// both. On a machine whose environment sets NODE_ENV=development, `astro
// build` therefore produces a "production" bundle in which
// `import.meta.env.DEV` folds to true and `process.env.NODE_ENV` is defined
// as "development" — dev-only branches survive into shipped code.
//
// The build must not depend on whose shell it runs in, so the value is set
// here rather than left to the environment.
//
// The workerd sweep runs FIRST and that ordering is the whole point: the lock
// it clears is taken on dist/client, which `astro build` empties on startup.
// Sweeping afterwards would be sweeping after the failure. See
// scripts/clear-workerd.mjs for what leaves the lock behind.
import { spawnSync } from 'node:child_process'
import { pathToFileURL } from 'node:url'
import { clearWorkerd } from './clear-workerd.mjs'

export const productionEnv = (env = process.env) => ({ ...env, NODE_ENV: 'production' })

/**
 * @returns {number} the exit code astro build produced.
 */
export const runBuild = ({
  args = [],
  run = spawnSync,
  clear = clearWorkerd,
  env = productionEnv,
} = {}) => {
  clear()
  const result = run('astro', ['build', ...args], {
    stdio: 'inherit',
    shell: true,
    env: env(),
  })
  return result?.status ?? 1
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exit(runBuild({ args: process.argv.slice(2) }))
}
