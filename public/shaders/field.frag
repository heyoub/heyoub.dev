#version 300 es
// heyoub.dev — ambient cognitive field.
// Driven by the same boundary that lays out the page (u_state) plus the
// continuous scroll signal from the scroll bridge (u_scroll) and time.
precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform float u_time;       // seconds since load (per-frame)
uniform vec2  u_resolution; // canvas px
uniform float u_state;      // 0 stacked · 0.5 split · 1 cinematic (normalized)
uniform float u_scroll;     // 0 top → 1 bottom (continuous, scroll bridge)
uniform float u_audio;      // 0..1 live audio level (AnalyserNode → audio field)

// brand palette
const vec3 BG     = vec3(0.039, 0.039, 0.043); // #0a0a0b
const vec3 ACCENT = vec3(0.133, 0.827, 0.933); // #22d3ee
const vec3 PURPLE = vec3(0.655, 0.545, 0.980); // #a78bfa

// soft additive orb
float orb(vec2 uv, vec2 c, float r) {
  float d = length(uv - c);
  return r / (d * d + r * 0.6);
}

void main() {
  vec2 res = u_resolution;
  vec2 uv = (gl_FragCoord.xy - 0.5 * res) / min(res.x, res.y);

  // scroll parallax: the field drifts up and breathes as you descend
  float scroll = u_scroll;
  uv.y += scroll * 0.9;
  float t = u_time * 0.08;

  // density scales with the layout bearing — quieter on small screens.
  // Audio level swells the field: orbs bloom and the time base quickens.
  float audio = u_audio;
  float density = 0.45 + u_state * 0.4 + audio * 0.9;
  t += audio * 0.15;

  vec3 col = BG;

  // a few drifting orbs, accent → purple by depth. Each pulses with audio,
  // and the orbit widens on louder passages.
  for (int i = 0; i < 4; i++) {
    float fi = float(i);
    float a = t + fi * 1.7;
    float swing = 0.6 + audio * 0.25;
    vec2 c = vec2(sin(a * 1.3 + fi) * swing, cos(a + fi * 0.8) * 0.4 - 0.1);
    float glow = orb(uv, c, 0.0012 * density);
    vec3 tint = mix(ACCENT, PURPLE, fract(fi * 0.37 + scroll));
    col += tint * glow * (0.02 + audio * 0.03);
  }

  // faint perspective grid, brighter in cinematic, fading with scroll,
  // flickering up on the beat.
  float gridScale = 14.0 + u_state * 10.0;
  vec2 g = abs(fract(uv * gridScale + vec2(0.0, t)) - 0.5);
  float line = 1.0 - smoothstep(0.0, 0.04, min(g.x, g.y));
  col += ACCENT * line * (0.012 + audio * 0.02) * (1.0 - scroll * 0.6);

  // gentle vignette so content stays legible
  float vig = smoothstep(1.3, 0.2, length(uv));
  col *= 0.6 + 0.4 * vig;

  fragColor = vec4(col, 1.0);
}
