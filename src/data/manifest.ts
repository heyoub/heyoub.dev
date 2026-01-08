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
  // Add more projects here as they become public
]
