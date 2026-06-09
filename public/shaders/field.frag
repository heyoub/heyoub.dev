#version 300 es
// heyoub.dev ambient field — the v2 Three.js scene (3 distorted parallax orbs
// + grid floor) re-expressed as a LiteShip GPU shader. Driven by u_time,
// u_state (heroLayout boundary), pointer (u_mx/u_my) and scroll (u_scroll).
precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform float u_time;
uniform vec2  u_resolution;
uniform float u_state;   // 0 stacked · 0.5 split · 1 cinematic
uniform float u_scroll;  // 0 top → 1 bottom
uniform float u_mx;      // pointer x, -1..1
uniform float u_my;      // pointer y, -1..1

// brand orb colors (match ParallaxOrbs.tsx)
const vec3 CYAN   = vec3(0.024, 0.714, 0.831); // #06b6d4
const vec3 PURPLE = vec3(0.545, 0.361, 0.965); // #8b5cf6
const vec3 AMBER  = vec3(0.984, 0.749, 0.141); // #fbbf24
const vec3 GRID   = vec3(0.133, 0.827, 0.933); // #22d3ee
const vec3 BG     = vec3(0.039, 0.039, 0.043); // #0a0a0b

// hash + value noise for the organic "distort" wobble
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x),
             mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}

// soft distorted orb → additive glow
vec3 orb(vec2 uv, vec2 c, float r, vec3 tint, float t, float seed) {
  vec2 d = uv - c;
  // organic distortion of the radius (mirrors MeshDistortMaterial)
  float wob = noise(d * 2.5 + vec2(seed, t * 0.4)) * 0.18 + noise(d * 5.0 - t * 0.2) * 0.08;
  float dist = length(d) * (1.0 - wob);
  float core = smoothstep(r, 0.0, dist);
  float halo = smoothstep(r * 2.2, 0.0, dist) * 0.35;
  return tint * (core * 0.25 + halo);
}

void main() {
  vec2 res = u_resolution;
  float aspect = res.x / max(1.0, res.y);
  vec2 uv = (gl_FragCoord.xy / res - 0.5) * vec2(aspect, 1.0) * 2.0;

  float t = u_time;
  vec2 par = vec2(u_mx, u_my) * 0.12;        // pointer parallax
  float depth = mix(0.78, 1.0, u_state);      // tighter on small screens

  vec3 col = BG;

  // cyan — top right
  col += orb(uv, (vec2(0.95, 0.62) + vec2(sin(t * 0.5) * 0.12, cos(t * 0.4) * 0.08)) * depth + par,
             0.95 * depth, CYAN, t, 1.3);
  // purple — bottom left
  col += orb(uv, (vec2(-0.95, -0.5) + vec2(sin(t * 0.7 + 1.0) * 0.12, cos(t * 0.56) * 0.08)) * depth + par * 0.8,
             0.8 * depth, PURPLE, t, 4.1);
  // amber — center, deepest
  col += orb(uv, (vec2(0.0, -0.05) + vec2(sin(t * 0.3 + 2.0) * 0.1, cos(t * 0.24) * 0.06)) * depth + par * 0.5,
             0.62 * depth, AMBER, t, 7.7);

  // faint perspective grid on the floor (matches GridPlane.tsx vibe)
  float horizon = -0.35;
  if (uv.y < horizon) {
    float pz = 1.0 / (horizon - uv.y);          // perspective scale
    vec2 g = vec2(uv.x * pz * 1.4, (t * 0.25 + pz)) ;
    vec2 gl = abs(fract(g) - 0.5);
    float line = 1.0 - smoothstep(0.0, 0.06, min(gl.x, gl.y));
    float fade = smoothstep(0.0, 0.5, horizon - uv.y) * smoothstep(2.5, 0.4, pz);
    float pulse = sin(t * 0.5) * 0.1 + 0.9;
    col += GRID * line * 0.05 * fade * pulse;
  }

  // gentle vignette + subtle scroll dim so foreground text stays legible
  float vig = smoothstep(1.9, 0.4, length(uv));
  col *= (0.65 + 0.35 * vig) * (1.0 - u_scroll * 0.15);

  fragColor = vec4(col, 1.0);
}
