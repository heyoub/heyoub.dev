export interface ProjectPitch {
  filename: string
  tagline: string
  blurb: string
  stack: string[]
  links: {
    label: string
    url: string
    display: string
  }[]
}

export interface ProjectLink {
  name: string
  gitUrl?: string
  siteUrl?: string
  pitch: ProjectPitch
}

export const projectManifest: ProjectLink[] = [
  {
    name: 'LiteShip',
    gitUrl: 'https://github.com/heyoub/LiteShip',
    siteUrl: 'https://www.npmjs.com/package/@czap/core',
    pitch: {
      filename: 'liteship.ts',
      tagline: 'One boundary — CSS, GLSL, ARIA, AI, all at once',
      blurb:
        'Adaptive projection on Astro: declared boundaries cast to every surface from one definition. A multi-package @czap/* workspace — 3,534 tests, 97% line coverage, 18 packages. This very site runs on it.',
      stack: ['TypeScript', 'Astro', 'Effect', 'Vitest'],
      links: [
        { label: 'npm', url: 'https://www.npmjs.com/package/@czap/core', display: 'npmjs.com/@czap/core' },
        { label: 'repo', url: 'https://github.com/heyoub/LiteShip', display: 'github.com/heyoub/LiteShip' },
      ],
    },
  },
  {
    name: 'BatPAK',
    gitUrl: 'https://github.com/heyoub/batpak',
    siteUrl: 'https://crates.io/crates/batpak',
    pitch: {
      filename: 'batpak.rs',
      tagline: 'Seven Rust crates, release discipline as code',
      blurb:
        'Seven published crates (batpak, syncbat, netbat + macro/bench support) on hard release discipline: CI, mutation testing, semver & public-API checks, consumer smoke, dry-run publish. crates.io v0.8.0.',
      stack: ['Rust', 'Cargo', 'CI/CD'],
      links: [
        { label: 'crate', url: 'https://crates.io/crates/batpak', display: 'crates.io/crates/batpak' },
        { label: 'repo', url: 'https://github.com/heyoub/batpak', display: 'github.com/heyoub/batpak' },
      ],
    },
  },
  {
    name: 'Scrubah.PII',
    gitUrl: 'https://github.com/Heyoub/scrubah.pii',
    siteUrl: 'https://scrubah-pii.heyoub.dev',
    pitch: {
      filename: 'scrubah.tsx',
      tagline: 'PII detection that actually works',
      blurb: 'Pattern-aware PII scrubbing for unstructured data. No regex guessing.',
      stack: ['TypeScript', 'React', 'AST Parsing'],
      links: [
        { label: 'live', url: 'https://scrubah-pii.heyoub.dev', display: 'scrubah-pii.heyoub.dev' },
        { label: 'repo', url: 'https://github.com/Heyoub/scrubah.pii', display: 'github.com/Heyoub/scrubah.pii' },
      ],
    },
  },
  {
    name: 'SunSetter AQM',
    gitUrl: 'https://github.com/Heyoub/SunSetter_AQM',
    siteUrl: 'https://sunsetter-aqm.heyoub.dev',
    pitch: {
      filename: 'sunsetter.tsx',
      tagline: 'Real-time air quality, beautifully mapped',
      blurb: 'Live AQI monitoring with interactive maps and historical trends. Data you can breathe easy about.',
      stack: ['TypeScript', 'React', 'Leaflet', 'OpenAQ API'],
      links: [
        { label: 'live', url: 'https://sunsetter-aqm.heyoub.dev', display: 'sunsetter-aqm.heyoub.dev' },
        { label: 'repo', url: 'https://github.com/Heyoub/SunSetter_AQM', display: 'github.com/Heyoub/SunSetter_AQM' },
      ],
    },
  },
]
