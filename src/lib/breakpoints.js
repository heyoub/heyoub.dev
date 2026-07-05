// The responsive breakpoint thresholds — the SINGLE source, consumed by BOTH
// responsive engines so the pixels live in exactly one place and can't drift:
//   • src/lib/boundaries.ts → LiteShip Boundary.make `at:` (numeric px) → @quantize
//                             → native @container queries on .czap-vp.
//   • tailwind.config.ts    → theme.extend.screens (px strings) for md:/lg: utilities.
//
// Why plain .js with an explicit-extension import (not a .ts sibling)? Two loaders
// with different resolvers both have to read this:
//   - the @czap/vite boundary-manifest collector imports boundaries.ts via raw
//     Node ESM (needs an explicit extension on relative imports), and
//   - Tailwind's config is loaded by jiti (can't resolve @czap/core's exports map,
//     so Tailwind can't import boundaries.ts to read .thresholds).
// A dependency-free .js imported as `./breakpoints.js` resolves cleanly in Node,
// Vite, tsc, and jiti alike.
//
// Values are the Tailwind v3 defaults the site already renders at (md 768,
// lg 1024); xl 1440 is the hero `cinematic` regime — no `xl:` utility exists, so
// xl is consumed only by the heroLayout boundary and is deliberately NOT exposed
// to Tailwind (keeps Tailwind's default xl=1280 untouched → wiring is pixel-identical).
export const breakpoints = { md: 768, lg: 1024, xl: 1440 }

// px-string form Tailwind's theme.extend.screens wants — md/lg ONLY (xl omitted
// on purpose, see above).
export const screens = { md: `${breakpoints.md}px`, lg: `${breakpoints.lg}px` }
