#version 300 es
// The scene background — LiteShip GPU cast (GLSL), lava-lamp style. Smooth
// metaball "blobs" rise and merge over a perspective floor grid. Tuned for low
// GPU cost: no per-step 3D noise, ~44 march steps, cheap 4-tap normal — so it
// doesn't starve the rest of the page's compositing. Driven by the sceneMood
// boundary via the AnimatedQuantizer (eased, tier-gated) on czap:uniform-update.
precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform float u_time;        // seconds since mount
uniform vec2 u_resolution;   // canvas px
uniform float u_state;       // mood index, normalized 0..1

uniform float u_distortAmp;  // blob pulse amplitude (lava wobble)
uniform float u_rotSpeed;    // lava flow speed
uniform float u_orbOpacity;  // blob presence
uniform float u_emissive;    // glow strength
uniform float u_gridOpacity; // floor grid presence
uniform float u_scroll;      // scroll progress 0..1

const vec3 CYAN = vec3(0.024, 0.714, 0.831);   // #06b6d4
const vec3 VIOLET = vec3(0.545, 0.361, 0.965); // #8b5cf6
const vec3 WARM = vec3(0.98, 0.62, 0.25);
const vec3 BASE = vec3(0.027, 0.031, 0.043);    // ~--bg-primary

float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

// Three big blobs that slowly rise / fall / drift through the frame — the lava
// lamp. Pure analytic (no noise), cheap to evaluate many times per pixel. Kept
// large and central so they read as solid bodies, not a distant haze.
vec3 blobCenter(float i, float t) {
  float ph = i * 2.39996; // golden-angle phase offset per blob
  // Hand-placed homes spread across the frame (left-high, center-low, right-high,
  // far-back-right) so the orbs read as a distributed constellation — distinct
  // bodies occupying space, like the old three.js orbs, not a central pile. A
  // small, slow drift layered on top gives a gentle bob, not swimming.
  vec3 homes[4] = vec3[4](
    vec3(-1.9,  0.5, -0.2),
    vec3(-0.4, -0.7,  0.15),
    vec3( 1.5,  0.6, -0.5),
    vec3( 2.0, -0.3, -1.0));
  vec3 home = homes[int(i)];
  vec3 drift = vec3(
    sin(t * 0.17 + ph) * 0.18 + sin(t * 0.071 + ph * 2.3) * 0.1,
    sin(t * 0.23 + ph) * 0.22 + sin(t * 0.089 + ph * 1.3) * 0.13,
    cos(t * 0.13 + ph) * 0.12);
  return home + drift;
}

// Scene SDF; writes the dominant blob color into `col`.
float map(vec3 p, out vec3 col) {
  float t = u_time * 0.17 * (0.4 + u_rotSpeed); // slow, stable drift
  float pulse = 1.0 + 0.06 * u_distortAmp * sin(t * 0.7); // gentler throb
  vec3 cols[4] = vec3[4](CYAN, VIOLET, WARM, CYAN);

  float d = 1e9;
  vec3 acc = vec3(0.0);
  float wsum = 0.0;
  // Four orbs, kept mostly distinct (small smin k) so they read as separate
  // glowing spheres — the three.js look — that only gently kiss when they pass,
  // rather than melting into one lava body.
  for (float i = 0.0; i < 4.0; i += 1.0) {
    vec3 c = blobCenter(i, t);
    c.y += (0.5 - u_scroll * 0.4); // mood/scroll lifts the field a touch
    float r = (1.1 - i * 0.15) * pulse;   // clearly varied sizes — breaks the pair read
    float di = length(p - c) - r;
    d = (i == 0.0) ? di : smin(d, di, 0.12); // distinct orbs — only blend at very close range
    float w = 1.0 / (0.1 + max(di, 0.0));
    acc += cols[int(i)] * w;
    wsum += w;
  }
  col = acc / max(wsum, 0.001);
  return d;
}

// Cheap tetrahedron normal (4 taps vs 6).
vec3 calcNormal(vec3 p) {
  const vec2 e = vec2(1.0, -1.0) * 0.0025;
  vec3 d;
  return normalize(
    e.xyy * map(p + e.xyy, d) + e.yyx * map(p + e.yyx, d) +
    e.yxy * map(p + e.yxy, d) + e.xxx * map(p + e.xxx, d));
}

void main() {
  vec2 uv = (v_uv * 2.0 - 1.0);
  uv.x *= u_resolution.x / max(u_resolution.y, 1.0);

  // Close + wide so the blobs dominate the frame (read as bodies, not haze).
  vec3 ro = vec3(0.0, 0.1, 4.0);
  vec3 rd = normalize(vec3(uv * 1.15, -1.35));
  vec3 col = BASE;

  // --- perspective floor grid ---
  if (rd.y < -0.0015) {
    float tf = (-2.3 - ro.y) / rd.y;
    if (tf > 0.0) {
      vec3 hit = ro + rd * tf;
      vec2 g = abs(fract(hit.xz * 0.5 - 0.5) - 0.5) / fwidth(hit.xz * 0.5);
      float line = 1.0 - min(min(g.x, g.y), 1.0);
      float fade = exp(-tf * 0.05) * smoothstep(0.0, 0.2, -rd.y);
      col += line * fade * u_gridOpacity * 9.0 * mix(CYAN, VIOLET, u_state);
    }
  }

  // --- raymarch the blobs (track closest approach for a tight rim halo) ---
  float t = 0.0;
  vec3 bc = CYAN;
  float minD = 1e9;
  bool hit = false;
  for (int i = 0; i < 48; i++) {
    vec3 p = ro + rd * t;
    float d = map(p, bc);
    minD = min(minD, d);
    if (d < 0.004) { hit = true; break; }
    t += d * 0.9;
    if (t > 12.0) break;
  }
  if (hit) {
    vec3 p = ro + rd * t;
    vec3 n = calcNormal(p);
    vec3 L = normalize(vec3(0.5, 0.8, 0.6));
    float lit = 0.45 + 0.55 * max(dot(n, L), 0.0);
    float rim = pow(1.0 - max(dot(n, -rd), 0.0), 2.0);     // fresnel edge glow
    float spec = pow(max(dot(reflect(-L, n), -rd), 0.0), 28.0); // glassy hotspot
    vec3 blob = bc * (0.48 + u_emissive * 0.8) * lit + bc * rim * 0.9 + vec3(1.0) * spec * 0.45;
    // Quieter presence — lower floor + scale so the orbs sit back behind content.
    col = mix(col, blob, clamp(0.14 + u_orbOpacity * 1.3, 0.0, 1.0));
  } else {
    // Tight halo hugging the silhouette only — NOT a full-screen fog.
    float halo = smoothstep(0.45, 0.0, minD);
    col += bc * halo * halo * u_orbOpacity * (0.6 + u_emissive) * 0.5;
  }

  float vig = smoothstep(1.5, 0.3, length(v_uv - 0.5));
  col *= mix(0.8, 1.0, vig);

  fragColor = vec4(col, 1.0);
}
