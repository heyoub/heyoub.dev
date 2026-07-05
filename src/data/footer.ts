// Shared contact data - used by both styled Contact section and code-view Footer
// Edit once, updates both views

export interface ContactLink {
  key: string
  label: string
  href: string
  external?: boolean
}

export interface ContactConfig {
  heading: string
  description: string
  links: ContactLink[]
  status: {
    building: boolean
    available: boolean
    location: string
    year: number
  }
  code: {
    filename: string
    openComment: string
    closeComment: string
  }
}

export const contactConfig: ContactConfig = {
  heading: "Let's Connect",
  description:
    'Interested in semantic computing, cognitive ergonomics, or the future of human-AI collaboration? Building in public. Always open to substantive conversations.',
  links: [
    {
      key: 'email',
      label: 'Email',
      href: 'mailto:hello@heyoub.dev',
      external: false,
    },
    {
      key: 'calendar',
      label: 'Book a Call',
      href: 'https://cal.com/eassa-ayoub-hf9yfh',
      external: true,
    },
    {
      key: 'linkedin',
      label: 'LinkedIn',
      href: 'https://linkedin.com/in/eassageorge',
      external: true,
    },
    {
      key: 'github',
      label: 'GitHub',
      href: 'https://github.com/heyoub',
      external: true,
    },
    {
      key: 'resume',
      label: 'Résumé',
      href: '/Eassa_Ayoub_Resume.pdf',
      external: true,
    },
  ],
  status: {
    building: true,
    available: true, // open for work as of 2026 (understated — not a banner)
    location: 'Philadelphia, PA',
    // Lazy getter, NOT a plain `new Date().getFullYear()` value: on Cloudflare
    // Workers the clock is frozen at epoch (1970) until the first request I/O,
    // and this module is evaluated at isolate init — BEFORE any I/O — so a plain
    // value renders "© 1970". A getter defers the read to render time (in-request),
    // when the clock reflects the real date. See the SEO/AEO audit, 2026-07-05.
    get year() {
      return new Date().getFullYear()
    },
  },
  code: {
    filename: 'contact.tsx',
    openComment: 'where abstractions terminate',
    closeComment: 'all state terminates here',
  },
}

// Helper to get display value for code view
export function getLinkDisplayValue(link: ContactLink): string {
  if (link.key === 'email') {
    return link.href.replace('mailto:', '')
  }
  if (link.key === 'calendar') {
    // Display as cal.com/eassa-ayoub (without hash)
    return 'cal.com/eassa-ayoub'
  }
  if (link.key === 'resume') {
    return 'resume.pdf'
  }
  return link.href.replace('https://', '')
}
