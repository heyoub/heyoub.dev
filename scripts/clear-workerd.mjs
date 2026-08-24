// Clears orphaned `workerd` processes before a build.
//
// The Cloudflare adapter spawns workerd, and it does not always reap it. The
// survivors keep an open handle on dist/client, so the NEXT build dies in
// Astro's emptyDir with:
//
//   EPERM, Permission denied: \\?\...\dist\client
//   Assertion failed: !(handle->flags & UV_HANDLE_CLOSING), file src\win\async.c
//
// which reads like a crash in the build rather than a stale file lock, and the
// libuv assertion buries the actual EPERM above it. It recurs reliably after a
// dev server has been running, so it is not worth rediscovering each time — a
// real deploy hit exactly this and lost a build to it.
//
// Running a dev server IS the common case here, so this deliberately kills
// live workerds too, not only orphans: a dev server's worker holds the same
// lock, and a failed build is worse than a dev server that needs restarting.
// It logs whatever it killed so that is never a surprise.
//
// Not finding anything to kill is the normal outcome and must not fail the
// build: taskkill exits 128 and pkill exits 1 when nothing matches.
import { spawnSync } from 'node:child_process'
import { pathToFileURL } from 'node:url'

/** The kill invocation per platform. Windows needs the .exe and /T for children. */
export const killCommand = (platform = process.platform) =>
  platform === 'win32'
    ? { cmd: 'taskkill', args: ['/F', '/T', '/IM', 'workerd.exe'] }
    : { cmd: 'pkill', args: ['-f', 'workerd'] }

/** Block the thread briefly so the OS can release the file handles. */
const settle = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms)

/**
 * @returns {boolean} whether anything was actually killed.
 */
export const clearWorkerd = ({
  platform = process.platform,
  run = spawnSync,
  log = console.log,
  wait = settle,
} = {}) => {
  const { cmd, args } = killCommand(platform)
  let result
  try {
    result = run(cmd, args, { stdio: 'pipe', encoding: 'utf8' })
  } catch {
    // No taskkill/pkill on this box. Nothing to do, and certainly not a reason
    // to stop a build.
    return false
  }
  const killed = result?.status === 0
  if (killed) {
    log('[clear-workerd] killed running workerd (it holds dist/client open)')
    wait(400)
  }
  return killed
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  clearWorkerd()
}
