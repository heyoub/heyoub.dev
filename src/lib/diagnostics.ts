// LiteShip's own diagnostics, given a source/code prefix and one place to
// redirect them from.
//
// Correction to an earlier version of this comment: @czap/core installs a
// console-writing sink by default (see node_modules/@czap/core/dist/
// diagnostics.js), so a directive wired to a signal input outside the
// vocabulary (a typo), or to recognised vocabulary with no live producer on
// this surface, was never going NOWHERE — it was already reaching the
// console, just as a bare, unprefixed console.warn indistinguishable from
// any other warning on the page. On a boundary that fails SILENTLY at the
// LAYOUT level (it simply never re-evaluates, which looks identical to "the
// layout is correct and nothing needed to change"), an unlabelled console
// line is easy to miss precisely when you need to know WHICH boundary is
// complaining. This sink adds the `[czap:<source>] <code>` label, and gives
// us one place to redirect diagnostics later without hunting down call
// sites.
//
// `installDiagnosticsBridge` from @czap/astro does the equivalent for
// build/SSR: same relabelling goal, but through Astro's own logger instead
// of raw console, and it only sees the server half (it takes an Astro
// logger). This is the client half.
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

/** Route @czap diagnostics through the console with a `[czap:...]` prefix. Call from the layout. */
export function installBrowserDiagnostics(
  target: Pick<Console, 'warn' | 'error'> = console,
): void {
  Diagnostics.setSink(consoleSink(target))
}
