// LiteShip's own diagnostics, routed somewhere a human will see them.
//
// @czap/core emits DiagnosticEvents for conditions no test can catch: a
// directive wired to a signal input outside the vocabulary (a typo), or to
// recognised vocabulary with no live producer on this surface. Both fail
// SILENTLY — the boundary simply never re-evaluates, which looks identical to
// "the layout is correct and nothing needed to change".
//
// Nothing was listening. `installDiagnosticsBridge` from @czap/astro covers
// build and SSR because it takes an Astro logger, but these warnings fire in
// the BROWSER, so they need a client-side sink as well. Installing only the
// server bridge would look like coverage while missing the half that matters.
import { Diagnostics } from '@czap/core'
import type { DiagnosticEvent, DiagnosticsSink } from '@czap/core'

/** Format one event as a single line: `[czap:<source>] <code> — <message>`. */
export function consoleSink(target: Pick<Console, 'warn' | 'error'>): DiagnosticsSink {
  return {
    emit(event: DiagnosticEvent): void {
      const line = `[czap:${event.source}] ${event.code} — ${event.message}`
      if (event.level === 'error') target.error(line)
      else target.warn(line)
    },
  }
}

/** Route @czap diagnostics to the console. Dev-only; call from the layout. */
export function installBrowserDiagnostics(
  target: Pick<Console, 'warn' | 'error'> = console,
): void {
  Diagnostics.setSink(consoleSink(target))
}
