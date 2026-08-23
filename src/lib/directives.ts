import type { DirectiveName } from '@czap/astro/runtime'

/**
 * The czap client directives this site marks onto plain elements.
 *
 * These are NOT self-starting. `satelliteAttrs()` stamps
 * `data-czap-directive="..."` into the HTML, but Astro's `addClientDirective`
 * only fires for framework-component islands — on a plain element the
 * attribute serialises verbatim and nothing runs. @czap/astro ships a scanner
 * for exactly this gap, and the CONSUMER has to call it.
 *
 * Hero.astro carried the opposite belief in a comment: that "since 0.1.5 the
 * boot scanner activates the worker client directive natively off the
 * data-czap-directive marker", and the manual entrypoint invocation this site
 * shipped against 0.1.4 was deleted on the strength of it. Verified against
 * 0.10.0: nothing in the integration injects the scan. Every satellite here
 * had been frozen at its SSR initialState ever since.
 *
 * It went unnoticed because `resolveInitialState` is request-aware — a desktop
 * UA SSRs 'split' and looks right on load. What never happened was any LATER
 * evaluation: no resize, no crossing, no re-read.
 *
 * Every directive named in a satelliteAttrs() call must appear here or it
 * silently never activates; tests/directives.unit.ts derives the real set from
 * the call sites and fails if this list drifts from it.
 */
export const SITE_DIRECTIVES: readonly DirectiveName[] = ['worker', 'gpu', 'svg']
