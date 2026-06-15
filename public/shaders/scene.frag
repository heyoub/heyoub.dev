#version 300 es
// The scene background — a LiteShip GPU cast (replaces the old vanilla three.js
// orbs). Drift + glow + grid are driven by the sceneMood boundary: u_state is
// the normalized mood index, and the per-mood uniforms below are streamed in
// continuously on the RAF spine (BlendTree-blended) via czap:uniform-update.
precision highp float;

in vec2 v_uv;
out vec4 fragColor;

// Auto-provided by the client:gpu runtime.
uniform float u_time;        // seconds since mount
uniform vec2 u_resolution;   // canvas px
uniform float u_state;       // mood index, normalized 0..1

// Per-mood uniforms (czap:uniform-update detail.glsl, BlendTree-smoothed).
uniform float u_distortAmp;  // flow turbulence
uniform float u_rotSpeed;    // drift speed
uniform float u_orbOpacity;  // orb presence
uniform float u_emissive;    // glow strength
uniform float u_gridOpacity; // grid presence
uniform float u_scroll;      // continuous scroll progress 0..1

// Brand orbs.
const vec3 CYAN = vec3(0.024, 0.714, 0.831);   // #06b6d4
const vec3 VIOLET = vec3(0.545, 0.361, 0.965); // #8b5cf6
const vec3 BASE = vec3(0.03, 0.04, 0.06);       // near --bg-primary

// Cheap value-noise flow field for organic distortion.
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x),
             mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}

float orb(vec2 uv, vec2 c, float r, float distort, float t) {
  vec2 d = uv - c;
  d += distort * 0.08 * vec2(noise(uv * 3.0 + t), noise(uv * 3.0 - t));
  float dist = length(d * vec2(u_resolution.x / u_resolution.y, 1.0));
  return smoothstep(r, r * 0.25, dist);
}

void main() {
  vec2 uv = v_uv;
  float t = u_time * 0.06 * (0.4 + u_rotSpeed);

  // Two orbs drift on slow lissajous paths; scroll nudges them apart.
  vec2 c1 = vec2(0.78 + 0.05 * sin(t), 0.24 + 0.04 * cos(t * 0.8) + u_scroll * 0.06);
  vec2 c2 = vec2(0.22 + 0.05 * cos(t * 0.9), 0.78 + 0.04 * sin(t * 1.1) - u_scroll * 0.06);

  float o1 = orb(uv, c1, 0.42, u_distortAmp, t) * u_orbOpacity;
  float o2 = orb(uv, c2, 0.40, u_distortAmp, t + 10.0) * u_orbOpacity;

  vec3 col = BASE;
  col += CYAN * o1 * (0.6 + u_emissive);
  col += VIOLET * o2 * (0.6 + u_emissive);

  // Faint moving grid — sharpens with the 'work' mood.
  vec2 g = fract(uv * vec2(u_resolution.x / u_resolution.y, 1.0) * 18.0 + vec2(0.0, -u_scroll * 4.0));
  float grid = smoothstep(0.0, 0.04, min(g.x, g.y)) ;
  col += (1.0 - grid) * u_gridOpacity * mix(CYAN, VIOLET, u_state) * 0.5;

  // Subtle vignette so edges settle into the page.
  float vig = smoothstep(1.2, 0.3, length(uv - 0.5));
  col *= mix(0.85, 1.0, vig);

  fragColor = vec4(col, 1.0);
}
