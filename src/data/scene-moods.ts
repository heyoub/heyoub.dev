// The scene's mood states — ONE definition, cast to three surfaces:
//   • GLSL/WGSL shader uniforms (the live background — scene-mood.ts / Scene)
//   • CSS custom properties on <html> (the static-gradient fallback)
//   • DocumentGraph pose bindings (graph.ts → @czap/stage video/OG export)
// The same four named moods the sceneMood boundary quantizes scroll into.
export type MoodState = 'arrival' | 'thesis' | 'work' | 'sendoff'

export const MOOD_STATES: readonly MoodState[] = ['arrival', 'thesis', 'work', 'sendoff']

// Numeric shader uniforms per mood. Calm baseline; `work` is as kinetic as it gets.
export const MOOD_GLSL: Record<MoodState, Record<string, number>> = {
  arrival: { distortAmp: 1.0, rotSpeed: 1.0, orbOpacity: 0.32, emissive: 0.55, gridOpacity: 0.07 },
  thesis: { distortAmp: 1.25, rotSpeed: 1.2, orbOpacity: 0.26, emissive: 0.45, gridOpacity: 0.1 },
  work: { distortAmp: 1.5, rotSpeed: 1.45, orbOpacity: 0.22, emissive: 0.4, gridOpacity: 0.12 },
  sendoff: { distortAmp: 0.8, rotSpeed: 0.7, orbOpacity: 0.38, emissive: 0.65, gridOpacity: 0.05 },
}

// Same states cast to CSS — the fallback gradient (and anything else) follows.
export const MOOD_CSS: Record<MoodState, Record<string, string | number>> = {
  arrival: { '--czap-mood-glow': 0.22, '--czap-mood-grid': 0.07 },
  thesis: { '--czap-mood-glow': 0.16, '--czap-mood-grid': 0.1 },
  work: { '--czap-mood-glow': 0.12, '--czap-mood-grid': 0.12 },
  sendoff: { '--czap-mood-glow': 0.28, '--czap-mood-grid': 0.05 },
}
