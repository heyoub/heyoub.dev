// The scene background — WGSL cast (net-new in LiteShip 0.2.0, WebGPU path).
// Activated only when navigator.gpu exists (Scene.astro upgrades the directive
// in place); GLSL is the universal fallback so non-WebGPU devices never see the
// black-canvas WGSL fallback.
//
// The runtime parses this struct at @group(0) @binding(0), one vec4f / 4 slots:
// state_index (slot 0) + three authored scalars. No auto u_time/u_resolution on
// the WGSL path, so the RAF bridge streams `time` + `scroll` through the struct
// each frame (scene-mood.ts). Entry points must be vs_main / fs_main.
struct SceneState {
  state_index: u32,  // mood index 0..3
  emissive: f32,     // glow strength (mood-blended)
  scroll: f32,       // scroll progress 0..1
  time: f32,         // seconds since mount (RAF-fed)
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
  // No resolution uniform on the WGSL path; a fixed scale keeps the flow field
  // device-independent enough for a background.
  let uv = frag.xy * vec2<f32>(0.0016, 0.0016);
  let t = scene.time * 0.1;

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
