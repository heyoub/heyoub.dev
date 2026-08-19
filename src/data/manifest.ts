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
  // Numbers below describe the RELEASED 0.10.0 line, not the repository head
  // (the head is a paused successor rebuild). Provenance: the package count is
  // 23 @czap/* plus liteship and create-liteship, each confirmed at 0.10.0 on
  // the npm registry; the coverage figures are the thresholds enforced by
  // scripts/merge-coverage.ts at tag v0.10.0 (commit 12861f76). A gate CI
  // applies can be checked by anyone; a coverage snapshot is one run on one day.
  {
    name: 'LiteShip',
    gitUrl: 'https://github.com/freebatteryfactory/LiteShip',
    siteUrl: 'https://www.npmjs.com/package/@czap/core',
    pitch: {
      filename: 'liteship.ts',
      tagline: 'Name the states once. Everything else falls in line.',
      blurb:
        "Most 'responsive' UIs are a junk drawer of media queries held together with hope. LiteShip makes you name the few states that actually matter, then casts them to every surface listening — CSS, shaders, the screen reader, an AI manifest — from one source. 25 packages published at 0.10.0, and CI won't take a merge below 90% coverage overall or 85% on any single package. This site is running on it right now.",
      stack: ['TypeScript', 'Astro', 'Effect', 'Vitest'],
      links: [
        { label: 'npm', url: 'https://www.npmjs.com/package/@czap/core', display: 'npmjs.com/@czap/core' },
        { label: 'repo', url: 'https://github.com/freebatteryfactory/LiteShip', display: 'github.com/freebatteryfactory/LiteShip' },
      ],
    },
  },
  {
    name: 'BatPAK',
    gitUrl: 'https://github.com/freebatteryfactory/batpak_DEPRECATED',
    siteUrl: 'https://crates.io/crates/batpak',
    pitch: {
      filename: 'batpak.rs',
      tagline: 'Seven Rust crates. Shipped, then finished.',
      blurb:
        "Seven crates shipped in dependency order, each dragged through the full gauntlet before it went near crates.io — CI, mutation testing, semver and public-API checks, consumer smoke, dry-run publish. Released at 0.10.0 and no longer developed; the crate is still there and still installable, and the repo carries the rename that says so.",
      stack: ['Rust', 'Cargo', 'CI/CD'],
      links: [
        { label: 'crate', url: 'https://crates.io/crates/batpak', display: 'crates.io/crates/batpak' },
        { label: 'repo', url: 'https://github.com/freebatteryfactory/batpak_DEPRECATED', display: 'github.com/freebatteryfactory/batpak_DEPRECATED' },
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
