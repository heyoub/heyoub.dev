# heyoub.dev — LiteShip 0.2.0 overhaul plan

Upgrade `heyoub.dev` from the LiteShip **0.1.5** dogfood to the **0.2.0 "substrate cut."**
This is not a cosmetic version bump — 0.2.0 moved the framework's center of gravity, and the
site's job changes with it.

> **What changed in the framework.** 0.1.x *proved the casts* (one boundary → CSS / GLSL / ARIA /
> AI manifest). 0.2.0 makes the **DocumentGraph IR** the keystone every cast projects *from*, lands
> the full production cast family (CSS / SVG / GLSL / **WGSL** / ARIA / video / **AI**), and ships
> the **AI Cast primitive**: a content-addressed graph is spoken to a model, and a *validated,
> unforgeable proposal* is taken back. Plus precompiled edge manifests, an escalation chooser, a
> headless video encoder, a full dev inspector, and a backward-compatible DX pass.
>
> **What the site must become.** v3 (0.1.5) showed "one definition casts to many surfaces." v3.1
> (0.2.0) shows the substrate underneath that: **the site is a DocumentGraph, and every visual
> surface — layout, the live shader, SVG motion, even the video and OG cards — projects from it.**
> The headline is the *visual cast stack*, end to end, from one graph.
>
> **Scope lock (decided 2026-06-15).** Full-send the substrate and the visuals — but **add no new
> surfaces.** It stays a portfolio website with its current sections; we upgrade what *renders* them,
> not what they *are*. **No visitor-facing AI feature / chatbot** — the AI Cast primitive is
> deliberately out of scope here (AI is showcased elsewhere; see §4). The flex is everything you can
> *see*: WGSL/GLSL shaders, SVG egress, scene/`@czap/stage` generative video, escalation, the graph.
>
> **And it's not just "more casts" — it's the *best-feeling* version of them.** Two axes the cast
> list alone doesn't cover, both verified against 0.2.0 source and treated as first-class here:
> **(a) frame-smoothness** — drive motion off the RAF spine (`Animation` / `Timeline.scrub` /
> `BlendTree`), register `@property` so custom-prop transitions are GPU-composited, budget the frame
> (§5A); **(b) display fidelity** — use the P3 / HDR / wide-gamut signals the detect lattice already
> exposes so a capable screen actually gets a richer image (§5B). These are where "absolute best
> visual experience + smoothness" is won or lost, and the 0.1.5 site uses neither.

> **Accuracy note.** API shapes below were read from `~/Code/LiteShip` at 0.2.0 and are cited by
> file. The newest primitives (`AICast`, `chooseRung`, `@czap/stage`, the cloudflare `manifest`
> param) are net-new and some signatures were inferred from source rather than from a published
> consumer example — **verify the exact export against source at implementation time** before
> wiring. Per project rule: **zero fabricated facts in any visitor-facing copy** — every new string
> draws from `src/data/*` or real, verifiable material.

---

## 0. Snapshot — where the site is today

Current state (audited 2026-06-15, all `@czap/*` at `0.1.5`):

- **Genuinely LiteShip:** Tokens/Theme (`tokens.ts` → `TokenStyles.astro`), three Boundaries
  (`boundaries.ts`: `heroLayout`, `cardGrid`, `sceneMood`), boundary CSS compiled at SSR + KV-cached
  at edge (`layout-css.ts` + `middleware.ts`), `AnimatedQuantizer` mood spring (`scene-mood.ts`),
  device-tier branching from `Astro.locals.czap`, satellite layout (`Hero.astro`).
- **Hand-rolled vanilla (the gap):** the WebGL background is pure imperative three.js
  (`scene3d.ts`, GLSL injected via `onBeforeCompile` — *not* a LiteShip cast); smooth scroll is raw
  Lenis; scroll motion is CSS `animation-timeline: view()`; reveal is a vanilla IntersectionObserver
  (`reveal.ts`); nav/tab state is `CustomEvent` dispatch.
- **Edge wiring:** `cloudflareMiddleware` with a *hand-written* `compile` callback + `compileLayoutCss`
  shared between middleware and `LayoutStyles.astro`; KV `CZAP_BOUNDARY_CACHE`, 24h TTL.
- **Not yet built (deferred in the 0.1.5 plan):** AI manifest / genui, live GPU cast, scroll→uniform
  bridge, audio/scene, worker/wasm directives, OG generation.

The 0.2.0 overhaul closes the vanilla gap by making those hand-rolled pieces *project from the
graph*, and adds the substrate-era showcases that didn't exist before.

---

## 1. Foundation — upgrade to 0.2.0 + DX diet

Unglamorous but gates everything else. Pre-1.0 break policy applies; the changelog lists exactly
one breaking removal we touch.

1. **Bump all `@czap/*` `0.1.5 → 0.2.0`** in `package.json` (deps + devDeps), plus the
   `pnpm.overrides` `@czap/_spine` pin. Add the **net-new published packages** we'll consume:
   `@czap/genui`, `@czap/stage` (now published), `@czap/scene` if we do §6. `effect` stays the
   tested beta baseline — pin, don't float.
2. **Breaking fix:** `attachViewportObserver` is gone → use `attachSignalObserver`
   (handles `viewport.*` *and* `scroll.*`). Grep the site; `scene-mood.ts`'s scroll feed is the
   likely caller. (LiteShip changelog notes both known consumer repos are grep-clean — confirm.)
3. **Wave-3 DX cleanup** (all backward-compatible — this is deletion, not addition):
   - `@czap/astro`: directives auto-register; remove any rename/alias ritual and the
     "configure workers" boilerplate beyond `workers: { enabled: true }`.
   - `@czap/cloudflare`: `binding` now defaults to `CZAP_BOUNDARY_CACHE` — drop the explicit arg
     in `middleware.ts`.
   - `@czap/vite`: `wasm` auto-detects — omit the option unless we ship a wasm kernel (§10).
   - `Token.make` single-value shorthand `{ name, category, value }` — tidy `tokens.ts` entries
     that don't vary on an axis.
4. **Confirm the consumer audit gate** (`czap audit --consumer` in `build`) still passes on 0.2.0;
   the 0.1.5 native-consumer-mode path should carry over. Keep it as the build's publish-integrity
   gate.

*Cite:* `~/Code/LiteShip/CHANGELOG.md` (0.2.0 §Removed, §Changed), `packages/core/src/token.ts`.

**Exit:** site builds + deploys on 0.2.0 with no behavior change, config visibly smaller.

---

## 2. Edge — adopt the precompiled boundary manifest

0.2.0 ships the **build→edge handoff** the 0.1.5 site faked with a shared `compile` callback.

- `@czap/vite` now emits a real `virtual:czap/boundaries` manifest and writes
  `czap-boundary-manifest.json` at `astro:build:done` — each boundary's `ContentAddress` + a
  deduped pool of `CompiledOutputs` across the full (motion × design) tier grid.
- `cloudflareMiddleware` accepts `{ manifest }` and derives `boundaryId` + precompiled outputs;
  the hand-built `boundaryId` + `compile` form becomes an escape hatch we no longer need.
- It serves **multiple boundaries per page**, each with its own content-addressed KV key (no
  cross-boundary cache poisoning). We have `heroLayout` *and* `cardGrid` on one page — this is
  exactly the multi-boundary case.

**Work:** replace `middleware.ts`'s `compile` callback with `manifest: <virtual or disk>` and a
`boundaries: ['heroLayout','cardGrid']` (or default-all) selector. `LayoutStyles.astro` reads
`locals.czap.edge.boundaries[...]` precompiled CSS; the inline `compileLayoutCss` fallback can stay
as belt-and-suspenders but should now be cold path. Likely **deletes most of `layout-css.ts`** as a
runtime dependency (it becomes build-time only).

*Cite:* `packages/vite/src/boundary-manifest.ts`, `packages/cloudflare/src/middleware.ts`,
`packages/edge/src/manifest.ts`. **Verify** the exact `cloudflareMiddleware` config keys against
`examples/cloudflare-astro` (the changelog says it now runs this path end-to-end).

**Exit:** zero hand-written CSS compilation in the request path; cache served from manifest.

---

## 3. The DocumentGraph spine (keystone)

This is the conceptual core of the overhaul. Today the site has *three independent* `Boundary.make`
calls. In 0.2.0 they should be **nodes in one DocumentGraph** — the single IR the page, the OG card
(§9), the AI context (§4), and the inspector (§11) all project from.

- Author `src/lib/graph.ts`: assemble signal/component/projection/**policy** nodes from the existing
  boundaries + tokens, seal it (`sealGraph`), validate it (`validateGraph` — fail the build on
  dangling edges / unexpected cycles). This becomes the site's source of truth.
- Each existing cast becomes a **ProjectionNode** off the graph: the layout CSS, the mood GLSL/CSS,
  the (new) WGSL shader, the ARIA. "Every cast projects from one graph" stops being a slogan and
  becomes literally how the file is structured.
- Add a **PolicyNode** carrying `requires` / `grants` / `budgets` so §7's escalation has something
  real to read.

*Cite:* `packages/core/src/document-graph.ts` (8 node families), `document-graph-address.ts`
(`sealNode`/`sealGraph`/`validateGraph`/`linearizeGraph`), `packages/core/src/index.ts:206–241`.

**Caveat / verify:** there is **no public `DocumentGraph` builder constructor** — graphs are
assembled as node records and sealed; the high-level "walk a graph and cast it" helpers live in
`@czap/stage` (`exportAstroPage`, `exportVideo`, `dualExport`). Confirm the most ergonomic
construction path before committing to the file shape; if hand-assembling nodes is too low-level for
a consumer today, **this is prime upstream feedback** (a `Graph.make({...})` builder) and we scope
§3 to "as much graph as is ergonomic, note the rest."

**Exit:** one sealed, validated graph; existing surfaces re-expressed as projections off it.

---

## 4. AI Cast — deliberately out of scope (no new surface)

0.2.0's headline framework primitive is the **AI Cast** (graph → model → unforgeable
`ValidatedProposal`). It is intentionally **not** built into this site: no chatbot, no "ask/remix
this site" panel, no `client:llm` visitor surface. AI is showcased elsewhere; this overhaul keeps
the site *a website* and flexes what you can see.

What stays: the existing **static AI manifest** (`src/pages/manifest.json.ts` / `src/data/manifest.ts`)
— a non-interactive, build-time cast of the site's content. It costs nothing, adds no surface, and
still demonstrates that the graph is machine-describable. Leave it; optionally re-point it to project
from the §3 DocumentGraph so it's the *same* graph the visuals use.

If a model-driven feature is ever wanted, the primitive is ready (`packages/core/src/ai-cast.ts`,
`@czap/genui`) — but that's a separate decision, not this overhaul.

**The headline moves to the visual cast stack: §§5, 6, 9 (shaders, SVG, generative video).**

---

## 5. Live GPU cast — retire the vanilla three.js, ship GLSL **+ WGSL**

The WebGL background (`scene3d.ts`) is the biggest "not really LiteShip" gap and 0.2.0's net-new
**WGSL cast** is the upgrade hook.

- Author the shader as a real **ProjectionNode** off the graph (§3). `GLSLCompiler.compile(boundary,
  stateValues)` and `WGSLCompiler.compile(...)` emit per-state uniform/binding maps + a `bindUniforms`
  helper. On every boundary crossing the runtime fires `czap:uniform-update` with
  `detail.glsl` / `detail.wgsl`; the `client:gpu` directive binds them. **WebGPU (WGSL) path with
  GLSL fallback** = a genuine 0.2.0-only showcase.
- The mood states already exist (`scene-mood.ts`: arrival/thesis/work/sendoff) — they become the
  shader's discrete `u_state`. **Smoothness caveat (verified):** the current site eases between them
  with `AnimatedQuantizer.interpolated`, which ticks on a fixed **~16 ms `Effect.sleep`, not RAF**
  (`packages/quantizer/src/animated-quantizer.ts:248`) — visibly behind a 120 Hz scroll. For the
  *best-feeling* version, drive the shader's continuous uniform off the **RAF spine** instead
  (`Timeline.scrub` / `BlendTree`, see §5A); keep `AnimatedQuantizer` only for discrete CSS state
  swaps where 16 ms is imperceptible. This is the single biggest smoothness upgrade in the plan.
- Replace three.js's `onBeforeCompile` injection with the compiled cast; keep three.js only if we
  still want mesh orbs, otherwise a single full-screen shader pass is lighter and more honest.
- **Off-thread reality check (verified):** `client:worker` moves **boundary *evaluation*** to a
  worker (already used by the hero), but in 0.2.0 the **GPU render stays on the main thread** — there
  is no ergonomic OffscreenCanvas-to-worker handoff for live shaders yet
  (`packages/astro/src/runtime/worker.ts`). So smoothness comes from a *cheap* shader + RAF + frame
  budget, not from offloading the GL. (GPU-on-worker = upstream wishlist, not this overhaul.)
- **Continuous scroll bridge:** a passive, RAF-coalesced `scroll.*` observer
  (`attachSignalObserver`, which is rAF-throttled) feeds scroll → `Timeline.scrub(progress)` →
  `czap:uniform-update` into the live shader. Still no first-class "continuous signal" primitive in
  0.2.0 — the ~10-line bridge is consumer-authored and upstreamable.

*Cite:* `packages/compiler/src/{glsl,wgsl}.ts`, `packages/astro/src/runtime/gpu.ts` (the
`czap:uniform-update` handler). **Verify** the `client:gpu` vs a separate `client:wgsl` directive
name and how WGSL fallback is selected.

**Exit:** the background is a graph projection, runs WGSL where supported, GLSL elsewhere, static
poster on `static`/`styled` tier — all chosen by §7.

---

## 5A. ★ Motion fidelity & smoothness — the RAF spine

The cast list says *what* renders; this says how it *feels*. All verified against 0.2.0 source —
these are genuinely consumer-usable today, and the 0.1.5 site uses none of them.

- **RAF motion engine (use it, it's first-class).** `@czap/core` ships:
  - `Animation.run({ duration, easing, scheduler })` → an `Effect.Stream` of frames, **RAF-scheduled
    by default** (`packages/core/src/animation.ts:28,50`). The real per-frame lerp.
  - `Timeline.from(boundary)` → `play / pause / reverse / seek(ms) / scrub(progress 0–1)` + a
    `progress` stream, **RAF-driven** (`packages/core/src/timeline.ts:44,63`). This is the
    framer-`useScroll`/`useTransform` replacement: feed `scrub()` from the scroll bridge for
    butter-smooth scroll-linked motion of boundary states.
  - `BlendTree.make()` → continuous weighted blend across **>2** states (`setWeight` / synchronous
    `compute()` / `changes` stream, `packages/core/src/blend.ts:40`). The four mood states
    (arrival/thesis/work/sendoff) become a blend tree instead of stepped transitions.
  - **Action:** route the shader uniforms + any scroll-linked CSS vars through `Timeline.scrub` /
    `BlendTree` (RAF), retiring `AnimatedQuantizer` from the per-frame path (§5).
- **`@property` registration (smooth, GPU-composited custom props).** `CSSCompiler`
  `generatePropertyRegistrations(states)` emits `@property --czap-* { syntax; inherits; initial-value }`
  (`packages/compiler/src/css.ts:352`) so `--czap-*` transitions *interpolate* instead of stepping —
  and the browser can composite them off the main thread. `TokenStyles.astro` / `LayoutStyles.astro`
  should emit these for every animated token/var. Cheap, automatic, big perceived-smoothness win.
- **`FrameBudget` (no jank under load).** `FrameBudget.make()` exposes priority lanes
  (`critical > high > low > idle`) with `remaining()` / `canRun(priority)` / `scheduleSync`
  (`packages/core/src/frame-budget.ts:145`). Schedule reveal/secondary work in `idle` so the shader
  + scroll never drop a frame. Opt-in; worth it on the heavy hero.
- **Motion-tier honesty.** `Astro.locals.czap.tier.motion` (`none → transitions → animations →
  physics → compute`) already gates work server-side; keep first paint correct and never start a RAF
  loop on `reduced-motion` / `none`.

*Verify:* `Animation.run` scheduler default, `Timeline.scrub` signature, `BlendTree` change-stream
shape, `generatePropertyRegistrations` output. **Upstream finding:** `AnimatedQuantizer` should take
a RAF `scheduler` like `Animation`/`Timeline` do — it's the one motion primitive still on `sleep(16)`.

**Exit:** every continuous motion on the page runs on RAF; animated custom props are `@property`-
registered; the hero respects a frame budget. *This is the section that makes it feel premium.*

---

## 5B. ★ Display fidelity — P3 / HDR / wide-gamut

"Best visual experience" on a 2026 phone or Pro display means actually using the gamut it has. The
detect lattice already measures this and surfaces it to the consumer — the site just has to branch.

- `Astro.locals.czap.capabilities` exposes `colorGamut` (`srgb | p3 | rec2020`) and `dynamicRange`
  (`standard | high`), and `tier.design` rolls up to `rich` on wide-gamut/HDR
  (`packages/detect/src/detect.ts:462,471`, `tiers.ts:99`). Client-side watcher exists too.
- **Action:** author the palette with a graceful gamut ladder — `color(display-p3 …)` (and rec2020
  where present) wrapped so sRGB screens fall back losslessly. Drive it from `Token`/`Theme` so it's
  one definition cast per gamut, gated server-side → correct first paint, no flash. The shader
  (§5) can also widen its output on `dynamicRange: high`.
- Pairs with §7: gamut/HDR is the *design* axis of escalation, orthogonal to the motion/cap rung.

*Cite:* `packages/detect/src/{detect,tiers}.ts`, `packages/astro/src/middleware.ts` (locals inject).
Low risk, high "this looks unusually good on my display" payoff. **Verify** the exact `capabilities`
field names before authoring the token ladder.

**Exit:** rich-tier displays get a wide-gamut palette (and HDR-aware shader); sRGB unaffected.

---

## 6. SVG egress cast (low-tier-friendly motion)

0.2.0 closed the SVG cast: `@czap/scene`'s `SVGSystem` applies `_svgAttrs`
(transform/opacity/mixBlendMode/clipPath) post-tick. Good for a surface that should animate *below*
the GPU tier — e.g. a generative section divider, the logo mark, or a small ECS-driven diagram of
the DocumentGraph itself.

- One `@czap/scene` world with a couple of entities; `SVGSystem(frameIndex)` runs last; bind
  `applySvgAttrs(element, attrs)` to SVG nodes.
- Pairs naturally with §7: SVG is the `animated`-tier fallback for the WGSL background, so the site
  has *motion at every rung* (WGSL → GLSL → SVG → static poster).

*Cite:* `packages/scene/src/systems/svg.ts`, `svg-egress.ts`. Scoped as **nice-to-have** — only if
the ECS authoring cost is low; otherwise CSS scroll-timeline already covers low tiers.

---

## 7. Make escalation visible — `chooseRung` + a tier badge

Today tier-gating is scattered `if (tier === ...)` checks. 0.2.0's `chooseRung(policy, runtimeSite)`
is the principled version: read the §3 `PolicyNode` (requires/grants/budgets/sites) and return the
admitted cast targets for the device.

- Drive the §5 surface selection (WGSL vs GLSL vs SVG vs poster) through `chooseRung`'s
  `admittedTargets` instead of ad-hoc tier strings.
- **Showcase it:** a tiny, honest "rendering at tier X · casts: css glsl wgsl aria" badge (toggle in
  the footer / `ContactDecompile`). Turns an invisible infra decision into a visible portfolio point.

*Cite:* `packages/core/src/escalation.ts` (`chooseRung`, `RungChoice`), `index.ts:182–183`.
**Verify** the `PolicyNode` shape and the CapLevel→target table against source.

**Exit:** one escalation decision feeds rendering + a visible badge.

---

## 8. `viewport.height` axis (replace the `dvh` hacks)

0.2.0 makes `viewport.height` a first-class compiled axis: a height-input boundary upgrades `:root`
to `container-type: size` + `block-size: 100dvh` and emits `(height …)` container conditions.

- Use it for the cinematic hero pin and any "fit one viewport" section that currently hard-codes
  `82vh` / `100dvh` (`VideoInterlude` `height="82vh"`, hero). A real boundary (`compact/normal/
  spacious` by height) replaces the magic numbers and joins the manifest/dedup path.

*Cite:* `packages/compiler/src/css.ts:99–180`, `packages/vite/src/css-quantize.ts`. Small, clean,
demonstrates a 0.2.0 compiler feature with near-zero risk.

---

## 9. ★ Headline — `@czap/stage` + scene: generative video from the *same* graph

The biggest "flex all the visual stuff" win, and the reason to lean on stage. The site already has
two video sections (`VideoInterlude`, `ParallaxVideo`) running **stock mp4s** (`/assets/fs/*.mp4`).
0.2.0 lets those become **video the site renders from its own DocumentGraph** — no stock footage, no
ffmpeg-by-hand. Same graph that paints the page paints the clip (`dualExport` is literally that
proof). Keeps the sections exactly what they are; swaps the source from stock → substrate.

Two production paths, both real (verified in source):

- **Build-time (Node / ffmpeg)** — `@czap/stage`: `exportVideo(graph)` / `exportVideoEncoded(graph,
  ffmpegFrameEncoder())` walk poses → drive the `Compositor` → `VideoRenderer.frames()` → content-
  addressed frames → encoded MP4. Run in the Astro build; output checked-in or cached. Use for:
  - **Generative OG cards** per route (`exportAstroPage` + a frame snapshot) — "the social card and
    the page are the same content-addressed graph." A literal dual-export proof.
  - **Hero / interlude clips** — replace `VideoInterlude` / `ParallaxVideo` stock footage with a
    short graph-rendered loop. Zero runtime cost; degrades to a poster on `lite` tier exactly as now.
  *Cite:* `packages/stage/src/dual-export.ts` (`exportAstroPage`/`exportVideo`/`exportVideoEncoded`/
  `dualExport`), `packages/stage/src/ffmpeg-encoder.ts`, `@czap/stage/ffmpeg` subpath;
  `packages/core/src/{compositor,video}.ts` (`Compositor`, `VideoRenderer`).

- **In-browser (WebCodecs)** — `@czap/web` `capture/webcodecs.ts` (`WebCodecsCaptureOptions`) +
  `Compositor`/`VideoRenderer` encode a clip *client-side* on capable devices. Heavier; reserve for a
  `gpu`-tier-only flourish (e.g. a "download this moment" capture), gated by §7's `chooseRung`.
  *Cite:* `packages/web/src/capture/{webcodecs,pipeline}.ts`, `packages/_spine/web.d.ts:319`.

**Verify before building:** the `FrameEncoder` seam shape (`exportVideoEncoded(graph, encoder)`), the
`@czap/stage/ffmpeg` adapter signature, and how `Compositor` poses map from *our* graph (§3). This is
net-new published surface — expect to feed ergonomics back upstream.

**Scope:** build-time OG + interlude generation is the headline visual; in-browser WebCodecs is the
stretch. Still **no new surface** — the video *sections already exist*, we only change their source.

---

## 9A. Audio/scene beat-reactivity (optional power-flex, no new surface)

`@czap/assets` (`detectBeats` / `detectOnsets` / `computeWaveform`) and `@czap/scene`
(`Track.audio/effect`, `syncTo: beat|onset|peak`, `resolveBeatProjectionToSceneBeats`) are
published and consumable at 0.2.0 (verified). Analysis is **build-time + cached as capsule
projections** — deterministic, zero runtime DSP cost.

- If the generative interlude clips (§9) carry audio, analyze the beat track at build time and let
  beats drive effect intensity (shader pulse, orb scale, divider snap) via the scene `SceneRuntime`.
  It's reactivity layered onto sections that *already exist* — fits the no-new-surface rule.
- This is the multimedia centerpiece deferred in the 0.1.5 plan; it's the strongest "lean on its
  powers" beat (pun intended) if we want one more visual gear.

*Cite:* `packages/assets/src/analysis/beat-markers.ts:26`, `packages/scene/src/track.ts:69,117`,
`scene/src/index.ts:37`. Scoped **optional** — high payoff, real authoring cost; only if §9 lands
clip audio worth syncing to.

---

## 10. Honest-LiteShip cleanups (close the remaining vanilla gaps)

Lower priority, but they raise the "% genuinely LiteShip" number the showcase rests on:

- **Reveal:** the vanilla IntersectionObserver in `reveal.ts` is fine and cheap — keep, but consider
  expressing reveal thresholds as a boundary so the inspector (§11) can see them.
- **Scroll:** keep Lenis for feel, but the scroll *signal* should flow through `attachSignalObserver`
  (`scroll.*`, rAF-throttled) into the §5A `Timeline.scrub` bridge, not a bare listener.
- **State:** nav/tab `CustomEvent` dispatch could move to `@czap/core` `Store`/`Cell` reactivity —
  only worth it if it removes code, not adds it.
- **WASM:** `crates/czap-compute` kernels (`spring_curve`/`batch_boundary_eval`/`blend_normalize`)
  via `WASMDispatch` are **opt-in, not auto-dispatched for live motion** in 0.2.0 (TS fallback is
  bit-identical) — so this is a perf footnote, not a smoothness lever. Skip unless boundary eval is
  measurably hot; note it.

These are "if time permits," explicitly subordinate to §§3–5B.

---

## 11. Dev inspector as a literal showcase

0.2.0's inspector (Alt+Shift+C in `astro dev`) now shows per-boundary **active casts**
(css/glsl/wgsl/aria/svg + live values), an **escalation panel** (rung + admitted targets), and a
**read-only DocumentGraph peek**. Once §§3–7 land, the inspector reflects the *real* graph — so:

- Enable it (`IntegrationConfig.inspector`, default-on in dev, excluded from prod).
- Record a short clip of the inspector reading this site's own graph for the case study / README —
  the framework's devtools narrating the framework's showcase site is the cleanest possible proof.

*Cite:* `packages/astro/src/runtime/inspector.ts`, `inspector-panels.ts`,
`integration.ts:66–68`.

---

## Sequencing & scope

| Phase | Sections | Why | Risk |
|------|----------|-----------|------|
| **P1 Foundation** | §1, §2 | Unblocks all; mostly deletion | Low (one breaking rename) |
| **P2 Spine** | §3 | Keystone every visual surface projects from | Med — graph builder ergonomics unknown; verify |
| **P3 Headline visuals** | §5, **§5A**, **§5B**, §9 | Live WGSL/GLSL cast **on the RAF spine**, wide-gamut palette, generative video — the flex *and* the feel | Med-High — net-new surface (WGSL, stage) + RAF rewire; verify hard |
| **P4 Visual support** | §6, §7, §8 | SVG motion at low tiers, visible escalation, `viewport.height` | Med |
| **P5 Polish / stretch** | §9A, §10, §11 | Beat-reactivity, close vanilla gaps, inspector clip | Low–Med |
| **—** | §4 | AI Cast — **out of scope** (no new surface) | — |

**Minimum compelling overhaul** = P1 + P2 + P3. Note P3 now explicitly includes **§5A (RAF spine +
`@property` + frame budget)** and **§5B (P3/HDR palette)** — without those, it'd be "more casts" but
not the *best-feeling, best-looking* version. With them, the vanilla three.js is retired for a
graph-driven WGSL/GLSL cast that runs buttery on RAF, the palette goes wide-gamut on capable
displays, and the stock-footage sections become video rendered from the site's own graph. P4–P5
round it out.

**Upstream feedback loop (this is dogfood — capture it):** anything that's awkward from a consumer
seat — no `Graph.make` builder (§3), `client:gpu`/WGSL directive ergonomics (§5), `PolicyNode`
authoring (§7), the stage encoder injection seam (§9) — goes straight into the LiteShip findings
list, same as the 0.1.4/0.1.5 rounds.

## Verify-before-asserting checklist (load-bearing new APIs)

Before wiring each, confirm the real export against `~/Code/LiteShip` source / examples:
- [ ] `cloudflareMiddleware({ manifest, boundaries })` exact keys vs `examples/cloudflare-astro` (§2)
- [ ] DocumentGraph construction ergonomics — is there a builder or only node records? (§3)
- [ ] `client:gpu` vs `client:wgsl` directive + fallback selection (§5)
- [ ] `@czap/stage` `exportVideoEncoded(graph, encoder)` seam + `@czap/stage/ffmpeg` adapter (§9)
- [ ] How `Compositor` poses map from our graph; `VideoRenderer.frames()` output shape (§9)
- [ ] `@czap/web` WebCodecs capture API for the in-browser stretch (§9)
- [ ] `chooseRung` / `PolicyNode` shape (§7)
- [ ] `Animation.run` default scheduler, `Timeline.scrub` + `BlendTree` signatures (§5A)
- [ ] `CSSCompiler.generatePropertyRegistrations` output + how to inject it (§5A)
- [ ] `FrameBudget.make` API (§5A) — confirm it's worth wiring on the hero
- [ ] `Astro.locals.czap.capabilities` exact field names: `colorGamut` / `dynamicRange` (§5B)
- [ ] `@czap/assets` + `@czap/scene` beat-sync path if §9A is pursued
