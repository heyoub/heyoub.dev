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
