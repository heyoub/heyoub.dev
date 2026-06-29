#version 300 es
// The scene background — LiteShip GPU cast (GLSL). A reimagining of the v2
// three.js ParallaxOrbs: THREE soft, translucent, matte spheres (the
// MeshDistortMaterial feel — opacity ~0.25, roughness ~0.2, gentle distort)
// that slowly float and wobble with an organic surface displacement (analytic,
// no per-step 3D noise). Laid out yellow LEFT · cyan CENTER · purple RIGHT over
// a faint perspective grid. Soft diffuse glow — NOT glassy/shiny. Tuned for low
// GPU cost. Driven by the sceneMood boundary via the AnimatedQuantizer (eased,
// tier-gated) on czap:uniform-update.
precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform float u_time;        // seconds since mount
uniform vec2 u_resolution;   // canvas px
uniform float u_state;       // mood index, normalized 0..1

uniform float u_distortAmp;  // surface wobble amplitude (MeshDistort DNA)
uniform float u_rotSpeed;    // float/flow speed
uniform float u_orbOpacity;  // blob presence (translucency)
uniform float u_emissive;    // glow strength
uniform float u_gridOpacity; // floor grid presence
uniform float u_scroll;      // scroll progress 0..1

// The three hero hues — matched to the v2 orbs.
const vec3 YELLOW = vec3(0.984, 0.749, 0.141); // #fbbf24
const vec3 CYAN   = vec3(0.024, 0.714, 0.831); // #06b6d4
const vec3 VIOLET = vec3(0.545, 0.361, 0.965); // #8b5cf6
const vec3 BASE   = vec3(0.027, 0.031, 0.043); // ~--bg-primary

float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

// Per-orb animated center: hand-placed home + a gentle float (sin/cos on a
// per-orb speed, like the v2 useFrame drift). i: 0 yellow-left, 1 cyan-center,
// 2 purple-right. Pushed back in z so the field sits behind the content.
vec3 orbCenter(int i, float t) {
  vec3 home; float spd;
  if (i == 0)      { home = vec3(-1.95,  0.20, -0.7); spd = 0.30; } // yellow LEFT
  else if (i == 1) { home = vec3( 0.00, -0.10, -0.5); spd = 0.45; } // cyan CENTER
  else             { home = vec3( 1.95,  0.30, -0.8); spd = 0.65; } // purple RIGHT
  float ph = float(i) * 2.39996; // golden-angle phase per orb
  vec3 drift = vec3(
    sin(t * spd + ph) * 0.26,        // v2: sin(time*speed)*0.3 in x
    cos(t * spd * 0.8 + ph) * 0.18,  // v2: cos(time*speed*0.8)*0.2 in y
    sin(t * spd * 0.5 + ph) * 0.09);
  return home + drift;
}

// Sphere SDF with a gentle organic surface wobble — the MeshDistortMaterial
// look, analytic and cheap. Small amplitude so the orbs read as soft bodies.
float orbDist(vec3 p, vec3 c, float r, float t, float ph) {
  vec3 q = p - c;
  float w = sin(q.x * 2.6 + t * 1.1 + ph) *
            sin(q.y * 2.4 - t * 0.9 + ph) *
            sin(q.z * 2.8 + t * 0.7);
  return (length(q) - r) + u_distortAmp * 0.08 * w;
}

// Scene SDF; writes the dominant orb color into `col`. Colors are kept distinct
// (tiny smin k + sharpened inverse-distance weighting) so the three read as
// three separate spheres — yellow / cyan / purple — like the v2 group.
float map(vec3 p, out vec3 col) {
  float t = u_time * 0.17 * (0.5 + u_rotSpeed);
  float lift = (0.4 - u_scroll * 0.35); // mood/scroll lifts the field a touch
  vec3 cs[3] = vec3[3](YELLOW, CYAN, VIOLET);
  float rs[3] = float[3](1.05, 1.22, 1.12); // balanced sizes — cyan only slightly larger

  float d = 1e9;
  vec3 acc = vec3(0.0);
  float wsum = 0.0;
  for (int i = 0; i < 3; i++) {
    float ph = float(i) * 2.39996;
    vec3 c = orbCenter(i, t);
    c.y += lift;
    float pulse = 1.0 + 0.04 * u_distortAmp * sin(t * 0.7 + ph);
    float di = orbDist(p, c, rs[i] * pulse, t, ph);
    d = (i == 0) ? di : smin(d, di, 0.05); // mostly distinct spheres
    float w = 1.0 / (0.06 + max(di, 0.0));
    w *= w;                                 // sharpen → nearest hue dominates
    acc += cs[i] * w;
    wsum += w;
  }
  col = acc / max(wsum, 1e-3);
  return d;
}

// Cheap tetrahedron normal (4 taps).
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

  vec3 ro = vec3(0.0, 0.1, 4.0);
  vec3 rd = normalize(vec3(uv * 1.15, -1.35));
  vec3 col = BASE;

  // --- faint perspective floor grid ---
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

  // --- raymarch the orbs (track closest approach for a soft rim halo) ---
  // step factor 0.75 keeps the march safe against the surface displacement.
  float t = 0.0;
  vec3 bc = CYAN;
  float minD = 1e9;
  bool hit = false;
  for (int i = 0; i < 56; i++) {
    vec3 p = ro + rd * t;
    float d = map(p, bc);
    minD = min(minD, d);
    if (d < 0.004) { hit = true; break; }
    t += d * 0.75;
    if (t > 12.0) break;
  }
  if (hit) {
    vec3 p = ro + rd * t;
    vec3 n = calcNormal(p);
    vec3 L = normalize(vec3(0.4, 0.8, 0.6));
    // Soft WRAP diffuse — matte, like MeshDistortMaterial (roughness ~0.2). No
    // hard terminator, no metallic sheen.
    float diff = 0.55 + 0.45 * max(dot(n, L), 0.0);
    float fres = pow(1.0 - max(dot(n, -rd), 0.0), 2.5);          // gentle rim only
    float spec = pow(max(dot(reflect(-L, n), -rd), 0.0), 20.0);  // faint, not glassy
    vec3 body = bc * (0.55 + u_emissive * 0.55) * diff;
    vec3 surf = body + bc * fres * 0.45 + vec3(1.0) * spec * 0.10;
    // Translucent presence (the v2 opacity ~0.25 read) — capped low so the orbs
    // stay see-through and recede behind the content.
    col = mix(col, surf, clamp(0.10 + u_orbOpacity * 0.55, 0.0, 0.36));
  } else {
    // Tight halo hugging the silhouette only — NOT a full-screen fog.
    float halo = smoothstep(0.5, 0.0, minD);
    col += bc * halo * halo * u_orbOpacity * (0.55 + u_emissive) * 0.45;
  }

  float vig = smoothstep(1.5, 0.3, length(v_uv - 0.5));
  col *= mix(0.8, 1.0, vig);

  fragColor = vec4(col, 1.0);
}
