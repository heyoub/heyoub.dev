// The scene background — WGSL cast (net-new in LiteShip 0.2.0, WebGPU path).
// Activated only when navigator.gpu exists (Scene.astro upgrades the directive
// in place); GLSL is the universal fallback so non-WebGPU devices never see the
// black-canvas WGSL fallback.
//
// The runtime parses this struct at @group(0) @binding(0) and lays it out by WGSL
// alignment rules (0.6.0 vector uniforms): the four scalars pack into one vec4f,
// then `u_resolution` (vec2, 8-byte aligned) lands at offset 16. Two fields carry
// the framework's STANDARD auto-feed — a field literally named `u_time` /
// `u_resolution` is written every frame by the runtime (monotonic seconds /
// canvas [w,h]), at GLSL parity. `state_index` / `emissive` / `scroll` are the
// signal fields, hand-fed on boundary crossings via detail.wgsl (scene-mood.ts).
// Entry points must be vs_main / fs_main.
struct SceneState {
  state_index: u32,          // mood index 0..3        (signal — detail.wgsl)
  emissive: f32,             // glow strength, blended  (signal — detail.wgsl)
  scroll: f32,               // scroll progress 0..1    (signal — detail.wgsl)
  u_time: f32,               // seconds since mount     (auto-fed every frame)
  u_resolution: vec2<f32>,   // canvas [w, h] in px     (auto-fed every frame)
}
@group(0) @binding(0) var<uniform> scene: SceneState;

@vertex
fn vs_main(@builtin(vertex_index) i: u32) -> @builtin(position) vec4<f32> {
  var p = array<vec2<f32>, 6>(
    vec2<f32>(-1.0, -1.0), vec2<f32>(1.0, -1.0), vec2<f32>(-1.0, 1.0),
    vec2<f32>(-1.0, 1.0), vec2<f32>(1.0, -1.0), vec2<f32>(1.0, 1.0),
  );
  return vec4<f32>(p[i], 0.0, 1.0);
}

@fragment
fn fs_main(@builtin(position) frag: vec4<f32>) -> @location(0) vec4<f32> {
  // Aspect-correct UV: normalize the fragment position by the canvas HEIGHT
  // (guarded against a 0 before the first resolution feed) so the flow field is
  // isotropic — glows stay round on any viewport instead of stretching with the
  // canvas aspect. FIELD_SCALE reproduces the density of the old fixed 0.0016
  // px-scale at a ~1080px-tall canvas, now resolution-aware. This is the GLSL
  // parity the WGSL path lacked while u_resolution was unavailable.
  let res = max(scene.u_resolution, vec2<f32>(1.0, 1.0));
  let FIELD_SCALE = 1.73;
  let uv = frag.xy / res.y * FIELD_SCALE;
  let t = scene.u_time * 0.1;

  let cyan = vec3<f32>(0.024, 0.714, 0.831);
  let violet = vec3<f32>(0.545, 0.361, 0.965);
  let base = vec3<f32>(0.03, 0.04, 0.06);

  // Two drifting glows, scroll shifts the hue mix between brand colors.
  let g1 = 0.5 + 0.5 * sin(uv.x * 3.0 + t) * cos(uv.y * 3.0 - t);
  let g2 = 0.5 + 0.5 * cos(uv.x * 2.0 - t * 0.8 + scene.scroll * 6.2831) * sin(uv.y * 2.5 + t);
  let glow = (0.45 + scene.emissive) * mix(g1, g2, scene.scroll);

  let col = base + mix(cyan, violet, scene.scroll) * glow;
  return vec4<f32>(col, 1.0);
}
