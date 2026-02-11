export interface ProjectLink {
  name: string
  gitUrl?: string
  siteUrl?: string
}

export const projectManifest: ProjectLink[] = [
  {
    name: 'Scrubah.PII',
    gitUrl: 'https://github.com/Heyoub/scrubah.pii',
    siteUrl: 'https://scrub.heyoub.dev/',
  },
  {
    name: 'SunSetter AQM',
    gitUrl: 'https://github.com/Heyoub/SunSetter_AQM',
    siteUrl: 'https://sunsetter-aqm.heyoub.dev',
  },
]
