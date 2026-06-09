# heyoub.dev — v3

Personal site of **Eassa Ayoub** — cognitive-first systems. Rebuilt as a
**dogfood and showcase of [LiteShip](https://github.com/heyoub/LiteShip)**
(the CZAP engine, `@czap/*`).

> The site doesn't just *describe* how I think about software — it's built
> out of the thing. Name the few states reality has; cast them to every
> surface at once. The site argues the thesis by being it.

## Stack

- **Astro 6**, `output: 'server'` (`@astrojs/node` for the spike; Cloudflare edge is the deploy target).
- **LiteShip / CZAP** (`@czap/*`) owns every adaptive-state decision:
  - `czapMiddleware` resolves the **device tier** (capability / motion / design) server-side from Client Hints + User-Agent into `Astro.locals.czap` — **the page knows your machine before first paint** and branches markup (`Hero` full vs lean rig; the WebGL field is omitted for reduced-motion).
  - `heroLayout` **boundary** (`stacked → split → cinematic`) drives the hero's CSS layout *and* the shader's `u_state` from one definition.
  - **GPU backdrop** (`public/shaders/field.frag`, WebGL2) via `@czap` GPU runtime; `u_scroll` fed by a continuous **scroll bridge** (`src/lib/scroll-bridge.ts`) → also drives the pure-CSS scroll-progress bar via `--czap-scroll`.
  - **`/manifest.json`** casts the site's content as a machine-legible surface (same vocabulary as the human "decompile" Contact section), echoing the caller's resolved tier.
- No React, no framer-motion, no three.js. Motion is CSS scroll-driven + the scroll bridge.

## Develop

```bash
pnpm install
pnpm dev            # http://localhost:4321
pnpm build && pnpm start
```

Try it adaptively — send Client Hints and watch the tier change:

```bash
curl -s localhost:4321/manifest.json -H 'Save-Data: on' \
  -H 'Sec-CH-Prefers-Reduced-Motion: reduce' | jq .your_session
```

## Layout

```
src/lib/{boundaries,tokens,theme}.ts   # CZAP authoring layer
src/middleware.ts                       # czapMiddleware → Astro.locals.czap
src/components/*.astro                   # sections (static, no React)
src/components/GpuField.astro            # tier-gated WebGL backdrop
src/lib/scroll-bridge.ts                 # continuous scroll → --czap-scroll + u_scroll
src/pages/index.astro                    # composition
src/pages/manifest.json.ts               # the machine surface
public/shaders/field.frag                # the ambient field shader
docs/LITESHIP-REBUILD.md                 # the full plan + phases
```

## Note on `@czap/*` install

`@czap/core@0.1.4` shipped a leaked `workspace:*` spec; until a patch lands,
`package.json` pins it via `pnpm.overrides` (`@czap/_spine: 0.1.4`). Upstream
fix: [LiteShip#9](https://github.com/heyoub/LiteShip/pull/9).
