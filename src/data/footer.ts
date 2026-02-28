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
  ],
  status: {
    building: true,
    location: 'Philadelphia, PA',
    year: new Date().getFullYear(),
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
  return link.href.replace('https://', '')
}
