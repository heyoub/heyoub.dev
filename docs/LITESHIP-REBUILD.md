# heyoub.dev v3 — LiteShip rebuild plan

Rebuild `heyoub.dev` (currently Astro + React islands, v2.0.0) **in place** as v3.0.0,
dogfooding and showcasing [LiteShip](../../../../LiteShip) (the CZAP engine, `@czap/*`).

> **Thesis of the rebuild:** Astro keeps owning HTML / structure / content. LiteShip
> takes over every responsive breakpoint, theme swap, and adaptive-state decision and
> *casts one definition to five surfaces* (CSS, GLSL, ARIA, AI manifest, TS union).
> React, framer-motion, and react-three-fiber are removed; their jobs are absorbed by
> compiled CSS + a handful of `data-czap-*` client directives. The site becomes the
> canonical showcase of LiteShip.

---

## 1. Ground truth: what LiteShip actually does (verified against source)

### Sweet spot — build the site around these
- **One boundary → many surfaces.** `Boundary.make` + `Token.make` + `Theme.make` + `Style.make`
  (`@czap/core`) compile to CSS vars, GLSL/WGSL preambles, ARIA attrs, an AI manifest, and a
  TS union. Content-addressed (FNV-1a + CBOR) so no surface silently drifts.
- **Spring-eased transitions *between* named states** — `Q.from()` → `Transition.for()` →
  `AnimatedQuantizer.make()` (`@czap/quantizer`). `SpringConfig {stiffness,damping,mass}`,
  per-pair `duration`/`easing`/`delay`, motion-tier gating (`none → physics`). **This is the
  real framer-motion replacement.** Caveat: interpolation ticks at ~16ms `Effect.sleep`, not RAF.
- **Audio analysis** — `detectBeats()`, `detectOnsets()`, `computeWaveform()` (`@czap/assets`).
  Extract beat markers / waveform at **build time** from real audio/video assets.
- **Scene / timeline authoring** — `Track.video/audio/transition/effect`, `compileScene`,
  `SceneRuntime`, beat-synced effects (`@czap/scene`). Track/time-range based (not keyframe curves).
- **GPU shaders** — `client:gpu` reads `data-czap-shader-src` (`.frag`/WGSL), WebGL2/WebGPU,
  `u_state` (discrete) + `u_time` (elapsed) uniforms, `czap:uniform-update` events.
- **Off-thread** — `client:worker`, SPSC ring buffer, OffscreenCanvas (`@czap/worker`).
- **Streaming / DOM** — `SSE`, `LLMAdapter`, `Morph`, `createAudioProcessor()` (AudioWorklet),
  `Physical` capture/restore (`@czap/web`).
- **WASM kernels** — `spring_curve`, `batch_boundary_eval`, `blend_normalize`
  (`crates/czap-compute`), TS fallback in `@czap/core/src/wasm-fallback.ts`.
- **Astro host** — `integration()`, `czapMiddleware()`, `resolveInitialState()`, `<Satellite>`,
  `satelliteAttrs()`, `@czap/vite` `@token`/`@theme`/`@style`/`@quantize` CSS transforms + HMR.

### Small bridges (shipped plumbing, ~10 lines of glue — we build + upstream these)
- **Continuous scroll → shader uniform / CSS var.** The GPU runtime already has a per-frame
  `requestAnimationFrame` render loop (`gpu.ts:222-242`, updates `u_time`/`u_resolution` every
  frame) **and** a shipped document handler `onDocumentUniformUpdate` (`gpu.ts:287-297`) that takes
  `{uniform, value}`. A passive `scroll` listener that dispatches `czap:uniform-update` with the
  scroll value (or sets `--czap-scroll` and lets the CSS-var → `u_*` mapping at `gpu.ts:275` carry
  it) gives true continuous scroll-driven motion. **Not pioneering — it's a small bridge on shipped
  rails, and a clean candidate to upstream as a `@czap/web` continuous-signal primitive.**

### Genuinely hard / deferred
- **Real-time scroll-scrubbed *video frames* in-browser.** `videoDecoder()` is metadata-only
  (ffprobe); frame decode is offline (ffmpeg subprocess / Remotion). Live `scroll → video frame`
  needs WebCodecs / ffmpeg.wasm decode. Deferred (§6).
- **`AnimatedQuantizer.interpolated`** ticks at 16ms `Effect.sleep`, not RAF — fine for
  state-to-state transitions, not for per-frame motion (use the scroll bridge / CSS for that).

**Design consequence:** motion is a *three-layer* system (§3): spring transitions between named
states, native CSS scroll-driven animations, **and** the continuous scroll→uniform bridge for
shader/parallax. Audio/scene-reactivity (§5) is the multimedia centerpiece. Only scroll-scrubbed
*video frames* stay deferred (§6).

---

## 2. Current site inventory (what we're replacing)

| Current (React island) | Verdict |
|---|---|
| `globals.css` vars + `@frontend-hq/design-tokens` preset | → `Token`/`Theme`, cast to CSS **and** Tailwind v4 tokens (one source) |
| Tailwind `lg:` / `clamp()` breakpoints everywhere | → `siteLayout` / `heroLayout` **boundaries** + `@quantize` CSS |
| `three/Scene` `ParallaxOrbs` `GridPlane` (R3F + three) | → `<canvas client:gpu>` + `.frag` shader; removes `three`, `@react-three/*` |
| `Hero` (framer `useTransform` tuck/scale) | → named bearings (`intro/reading/cinematic`) + `AnimatedQuantizer` spring; CSS scroll-timeline for the tuck |
| `Nav` / `MobileMenu` (framer) | → static HTML + tiny `client:satellite`; CSS for menu/scroll-hide state |
| `CoreThesis` / `OpenTo` (scroll-reveal stagger) | → CSS `animation-timeline: view()`, zero JS |
| `ScrollProgress` | → `scroll.progress` signal → CSS var, pure-CSS bar |
| `VideoInterlude` / `ParallaxVideo` | → `@czap/scene` beat-synced composition; CSS scroll-timeline for parallax |
| `ContactDecompile` (renders projects as source code) | → **AI-manifest centerpiece**: `manifest.ts` authored as the AI cast; same data → human "decompile" view + machine manifest |
| Lenis smooth scroll + framer scroll transforms | → native CSS scroll-driven animation (continuous) + boundaries (state). See §6 for opt-in scrub track |
| PWA (`@vite-pwa/astro`) | keep — LiteShip is presentation-focused, pairs with existing PWA stack |

Content already lives in `src/data/*` (`content.ts`, `projects.ts`, `footer.ts`, `manifest.ts`) —
that separation survives the rebuild and feeds the AI-manifest cast directly.

---

## 3. Motion language (the intentional, granular decision)

Five layers, each on the tool that's genuinely best for it. **LiteShip ships a real continuous-motion
engine in `@czap/core`** — the ast-grep audit (§9) surfaced it; the first draft missed it:
- `Animation` (`core/src/animation.ts`) — **RAF-driven** value interpolation as an `Effect.Stream`
  (lerp + numeric-record interpolate). Corrects the earlier "16ms tick, use CSS only" framing.
- `Timeline` (`core/src/timeline.ts`) — a boundary advanced over time with `play/pause/reverse/`
  **`seek(ms)`/`scrub(progress 0–1)`** and a `progress` stream. **This is first-class scroll-scrubbing.**
- `BlendTree` (`core/src/blend.ts`) — weighted multi-state blend of numeric records (continuous).

1. **State motion** (layout regime, theme, density): boundaries + `AnimatedQuantizer`/`Animation`
   spring+RAF transitions. Discrete→discrete, semantic, multi-surface.
2. **Continuous reveals/parallax** (fade-up, sticky tuck): native CSS `animation-timeline:
   scroll()/view()` where pure CSS suffices — no JS, honors reduced-motion via the motion tier.
3. **Scroll-scrubbed states/animation**: `Timeline.from(boundary)` + the scroll bridge calling
   `timeline.scrub(scrollProgress)`. The hero "tuck/scale", the video roll-up, gallery progression
   — all expressible as a scrubbed timeline. This *is* the LiteShip-native answer to framer's
   `useScroll`/`useTransform`, and it was shipped all along.
4. **Continuous scroll → shader/CSS** (WebGL depth, gradient drift): the ~10-line scroll-bridge over
   `czap:uniform-update` (§1, §6), optionally feeding a `BlendTree` for multi-state blends.
5. **Multimedia reactivity** (the showcase): audio-analysis-driven. See §5.

Smooth-scroll feel: try CSS `scroll-behavior` + scroll-timeline first; only reintroduce a
Lenis-class lib if the native feel is insufficient (measure, don't assume).

---

## 3a. Device-aware adaptive rendering (the part the first draft under-leveraged)

LiteShip ships a real capability model — use it as a first-class design axis, not an afterthought.

**The tiers** (`@czap/detect`, `tiers.ts`):
- **Capability:** `static < styled < reactive < animated < gpu` (monotone lattice; derived from GPU
  renderer string → tier 0–3, cores, deviceMemory, WebGPU, reduced-motion).
- **Design (orthogonal):** `minimal / standard / enhanced / rich` — `rich` keys off P3/rec2020
  color-gamut + HDR `dynamic-range`; `minimal` off `forced-colors`/e-ink.
- **Motion (orthogonal):** `none / transitions / animations / physics / compute` — `none` on
  reduced-motion, `compute` only on WebGPU + high GPU + ≥4 cores.
- **Signals also read:** `Save-Data`, network `ECT`/downlink, DPR, touch/pointer, contrast,
  forced-colors, reduced-transparency.

**Server-side, before first paint** (`czapMiddleware`, `resolveInitialState`, `@czap/edge`,
`@czap/cloudflare`): Client Hints (`Sec-CH-Viewport-Width`, `Sec-CH-DPR`, `Sec-CH-Prefers-*`,
`Save-Data`, `ECT`) are parsed at the edge into a tier, cached in KV by `boundaryId:tier`, and
injected into `Astro.locals.czap`. Two consequences we will exploit:

1. **Branch markup per device in `.astro` frontmatter** — e.g.
   `{ locals.czap.tier === 'gpu' ? <canvas client:gpu/> : <img src={poster}/> }`. Low-tier /
   `Save-Data` / reduced-motion visitors get a static poster + CSS-only; high-tier gets the full
   shader + audio reactivity. Same boundary vocabulary, different surface — server-resolved, no flash.
2. **`client:gpu` auto-skips WebGL on `static`/`styled` tiers** (`gpu.ts:88`) and the LLM directive
   maps tier → motion complexity (`llm.ts:74`). Progressive enhancement is built in; we just author
   the high and low ends.

**Implication for the stack:** go **SSR-on-edge (Cloudflare + KV)**, not pure `output: 'static'`.
That's what makes "knowing the user's device" real at first paint. (Static export still works but
forfeits server tier resolution — first paint would use the provisional inline-script guess only.)

---

## 4. Kitchen-sink showcase map (every LiteShip surface, intentionally placed)

| Surface / directive | Where on the site | What it proves |
|---|---|---|
| CSS cast + `@quantize` | whole layout, all sections | responsive without media-query sprawl |
| GLSL `client:gpu` | hero WebGL background (replaces R3F) | same boundary drives CSS *and* shader `u_state` |
| ARIA cast | `data-czap-state` mirrored to a11y tree | layout state visible to screen readers, free |
| AI manifest | `ContactDecompile` / `/manifest` | site is machine-legible; same vocab as visuals |
| `client:worker` | off-thread boundary eval badge | "main thread stays free at 60fps" |
| `client:wasm` | spring-curve easing for transitions | WASM kernel path with TS fallback |
| `client:llm` + `client:stream` | "talk to my site" chat / streaming case studies | generative UI; LLM tokens as adaptive media |
| `@czap/scene` + `@czap/assets` | video interludes, beat-synced hero | real assets → beats/waveform → visuals |
| `Timeline.scrub` / `Animation` / `BlendTree` (`@czap/core`) | hero tuck, video roll-up, gallery scrub | scroll-scrubbed boundary timelines — native framer-`useScroll` replacement |
| `WebCodecsCapture` + `captureVideo` + `VideoRenderer` | generate OG/share/intro video client-side | one boundary vocabulary → an actual encoded video, no server/ffmpeg |
| `Store`/`Cell`/`LiveCell`/`Derived` (`@czap/core`) | nav/menu/form interactive state | shipped reactive runtime instead of hand-rolled vanilla state |
| `mcpAppManifest` + `listUiResources` + `@czap/mcp-server` | site exposes generative UI widgets + app manifest to agents | "cognitive-first": the site is a queryable MCP app, not just a page |
| `@czap/edge` + `@czap/cloudflare` | edge middleware + KV tier cache | device tier resolved server-side from Client Hints, first paint correct |
| capability/design/motion tiers | markup branches on `Astro.locals.czap` | low-tier/Save-Data → poster + CSS; `gpu` → shader + audio; one vocab, many surfaces |
| `@czap/cli` / `@czap/mcp-server` | build step + an MCP demo (optional) | authoring is AI-first JSON I/O |

---

## 5. Multimedia centerpiece — run the real assets through LiteShip

This is the "incredibleness" the brief asked for, built on what genuinely works:

1. **Build-time analysis.** Feed the existing `public/assets/fs/*.mp4` (and any audio bed)
   through `@czap/assets`: `videoDecoder()` for metadata, `detectBeats()` / `computeWaveform()`
   for an audio bed → committed analysis projections (beat markers, waveform JSON).
2. **Scene authoring.** Author the video interludes as `@czap/scene` contracts — `Track.video()`
   with crossfades, `Track.effect()` intensities bound via `syncTo.beat(...)`.
3. **Reactive background.** The hero WebGL shader takes an audio uniform via `AVBridge` +
   `createAudioProcessor()` (AudioWorklet) — ambient orbs/grid pulse to the bed; section
   transitions land on onsets.
4. **Optional offline render.** Use `@czap/remotion` (`precomputeFrames`) to render a
   boundary-driven intro/OG video from the same state vocabulary.

Net: the site's motion is *driven by the media it ships*, not hand-tuned easing curves.

---

## 6. Continuous scroll — what's easy vs what's deferred

- **Continuous scroll → shader uniform / CSS var: EASY, in v3.0 (Phase 3).** A passive `scroll`
  listener writing `--czap-scroll` / dispatching `czap:uniform-update` rides shipped rails
  (`gpu.ts` RAF loop + `onDocumentUniformUpdate` + the `--czap-* → u_*` mapping). Factor it as a
  reusable module and propose it upstream as a `@czap/web` continuous-signal primitive — the
  ultimate dogfood (the site drives a new framework feature).
- **Scroll-scrubbed *video frames*: DEFERRED to v3.1 (Phase 7).** Needs client-side frame decode
  (WebCodecs / ffmpeg.wasm) + `scroll → frameIndex`. High cost, Chromium-first; only if a section
  truly demands it. Ship audio/scene reactivity (§5) first.

---

## 7. Phased plan

**Phase 0 — Spike & deps (½ day).** New branch. Swap `astro.config.mjs`: drop `@astrojs/react`,
add `@czap/astro` `integration({ detect, gpu, worker, wasm, stream, llm })` + `@czap/vite`. Set
`output: 'server'` + Cloudflare adapter; wire `czapMiddleware()`/`cloudflareMiddleware()` and KV.
Add `@czap/core/quantizer/compiler/web/scene/assets/edge/cloudflare` to deps. Stand up one
`<Satellite>` page with a viewport boundary **and** log `Astro.locals.czap` to confirm edge tier
resolution end-to-end (Effect 4 beta peer dep — pin the tested baseline).

**Phase 0.5 — Tier-branch skeleton.** Establish the `Astro.locals.czap.{tier,designTier,motionTier}`
branching pattern: high end (`gpu`/`animated`) vs low end (`static`/`styled`/`Save-Data`/reduced-motion)
as the spine every section is authored against.

**Phase 1 — Token/theme foundation.** Port `globals.css` + `design-tokens` to `Token`/`Theme`;
cast to CSS vars and Tailwind v4. Define `siteLayout`, `heroLayout`, `motionTier`, `theme` boundaries.

**Phase 2 — Static shell, no React.** Convert `Layout.astro` + every section to static Astro HTML +
`@quantize` styles. Nav/menu/scroll-progress via CSS + tiny `client:satellite`. Delete framer-motion
usage section by section. CSS scroll-driven animations for reveals/parallax.

**Phase 3 — GPU background + scroll bridge.** Replace `Scene`/`ParallaxOrbs`/`GridPlane` with
`client:gpu` canvas + `.frag` shader fed by `heroLayout`. Tier-branch: `gpu`/`animated` get the
canvas, `static`/`styled`/`Save-Data` get a static poster `<img>`. Build the ~10-line continuous
**scroll bridge** (passive `scroll` listener → `czap:uniform-update {uniform:'u_scroll', value}`),
factor it as a reusable module, and open an upstream proposal in LiteShip. Remove `three`, `@react-three/*`.

**Phase 4 — Multimedia (§5).** Build-time asset analysis, `@czap/scene` interludes, AVBridge audio
uniform.

**Phase 5 — Kitchen-sink surfaces.** AI manifest (`ContactDecompile`/`/manifest`), `client:worker`
badge, `client:llm`+`client:stream` "talk to my site", `client:wasm` easing.

**Phase 6 — Polish & cut over.** A11y (ARIA cast), Lighthouse/bundle-size before/after (expect a big
win from dropping React+three+framer), PWA re-verify, bump to `3.0.0`, ship.

**Phase 7 (later) — scroll-scrubbed *video frames* (§6)** as v3.1 (WebCodecs/ffmpeg.wasm). The
continuous scroll→shader bridge already lands in Phase 3; this phase is only the harder video-frame
decode case.

---

## 8. Open risks / decisions
- **Effect 4 beta peer dep** — LiteShip's load-bearing caveat; pin the tested baseline, accept beta.
- **16ms transition tick** (not RAF) — fine for state transitions; don't use it for per-frame motion.
- **Smooth scroll feel** — measure native CSS vs Lenis before deciding to keep a scroll lib.
- **`client:llm` needs an endpoint** — decide host (Cloudflare Worker via `@czap/cloudflare`?).
- **macOS is tier-2** in LiteShip CI — relevant if you dev on macOS.

---

## 9. ast-grep export audit (straggler sweep)

Method: structural enumeration of every public export with ast-grep 0.43 — a YAML rule matching
`export_statement` nodes with a `string` source field, run over `packages/*/src/index.ts`, split
into value vs type exports. Ground truth, not grep guessing. This is how we confirmed we weren't
leaving features as footnotes.

**Promoted from "missed/footnote" → first-class in this plan** (found by the sweep):
- `Timeline` / `Animation` / `BlendTree` (`@czap/core`) — the continuous-motion engine. → §3 layers 3–4.
- `WebCodecsCapture` / `captureVideo` / `renderToCanvas` (`@czap/web`) + `VideoRenderer` (`@czap/core`)
  — in-browser generative video. → kitchen-sink map; OG/share/intro clips.
- `Store` / `Cell` / `LiveCell` / `Derived` / `World` / `Scheduler` / `FrameBudget` (`@czap/core`)
  — reactive runtime for interactive state. → replaces vanilla JS in Phase 2.
- `mcpAppManifest` / `compileMcpAppManifest` / `listUiResources` (`@czap/mcp-server`, `@czap/compiler`)
  — MCP Apps: site exposes generative UI widgets + app manifest to agents. → Phase 5 showcase.
- `generatePropertyRegistrations` (`@czap/compiler`) — CSS `@property` typed custom props, so
  `--czap-*` vars (incl. `--czap-scroll`, gradients) are *animatable/interpolable*. → motion polish.

**Already covered by the plan** (sweep confirmed, no change): `Boundary`/`Token`/`Theme`/`Style`/
`Signal`/`Compositor`/`AVBridge` (core); `Q`/`AnimatedQuantizer`/`Transition` (quantizer); all
compilers `CSS`/`GLSL`/`WGSL`/`ARIA`/`AIManifest`/`TokenTailwind` (compiler); `detect`/tier fns
(detect); `ClientHints`/`EdgeTier`/`KVCache`/`EdgeHostAdapter` (edge); `cloudflareMiddleware` +
KV (cloudflare); `Track`/`compileScene`/`SceneRuntime`/`syncTo`/`bindBeats` (scene);
`detectBeats`/`computeWaveform`/`videoDecoder` (assets); `SSE`/`LLMAdapter`/`Morph`/
`createAudioProcessor`/`sanitizeHTML` (web); `CompositorWorker`/`RenderWorker`/`SPSCRing` (worker);
the `@token`/`@theme`/`@style`/`@quantize` transforms (vite); `precomputeFrames`/hooks (remotion).

**Deliberately out of scope for a personal site** (real, but not for this build): `HLC` /
`VectorClock` / `Wire` / `Receipt` / `Codec` / `CanonicalCbor` (core distributed-sync/CRDT layer);
`SpeculativeEvaluator` / `Plan` / `DAG` (speculative scheduling); most of `@czap/command` /
`@czap/cli` / `@czap/audit` (release & authoring tooling, not site runtime). Note `WGSLCompiler` /
WebGPU: optional — only worth wiring for the `gpu` tier if a shader needs compute.

**Still genuinely deferred:** scroll-scrubbed *existing-video-frame* decode (WebCodecs here is
*encode*; live decode needs a separate WebCodecs `VideoDecoder` / ffmpeg.wasm path — Phase 7).

Re-run the sweep before each phase to catch new exports as LiteShip moves pre-1.0:
`ast-grep scan -r /tmp/exports-rule.yml packages/*/src/index.ts` (rule in the repo notes).
