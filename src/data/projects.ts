// Principle-first proof points
// One strong example per principle - shows the pattern, not the industry

export interface ProofPoint {
  id: string
  principle: 'attention' | 'rent' | 'constraints'
  proof: string
  link?: {
    label: string
    url: string
    type: 'repo' | 'demo' | 'writeup' | 'live'
  }
}

// Two of the three now link to a PUBLIC, inspectable artifact (batpak/LiteShip) —
// "here, look" instead of "trust me". The attention proof stays deliberately
// anonymized: it's real operator/CRM work done relationship-basis, so no client,
// no numbers, no link — by rule (see never-fabricate + the openTo hook comment).
export const proofPoints: ProofPoint[] = [
  {
    id: 'attention-crm',
    principle: 'attention',
    proof: 'Rebuilt the CRM people actually live in — three choices per screen, the next action already decided. It stopped being the app they dreaded opening.',
  },
  {
    id: 'rent-liteship',
    principle: 'rent',
    proof: 'LiteShip: one definition, cast to every surface — CSS, shaders, ARIA, the machine manifest — with nothing to keep in sync by hand.',
    link: { label: 'liteship/overview', url: 'https://freebatteryfactory.com/liteship/overview', type: 'live' },
  },
  {
    id: 'constraints-batpak',
    principle: 'constraints',
    proof: 'Regulatory logic where illegal states are type errors, not runtime prayers. Same principle, shipped in the open: batpak.',
    link: { label: 'batpak/overview', url: 'https://freebatteryfactory.com/batpak/overview', type: 'live' },
  },
]
