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

export const proofPoints: ProofPoint[] = [
  {
    id: 'attention-liteship',
    principle: 'attention',
    proof: 'LiteShip: name the few states, cast them to every surface from one definition. The UI carries less.',
    link: { label: 'repo', url: 'https://github.com/heyoub/LiteShip', type: 'repo' },
  },
  {
    id: 'rent-batpak',
    principle: 'rent',
    proof: 'BatPAK: seven Rust crates, each earning its place — release gates, semver checks, dry-run publish. No dead weight.',
    link: { label: 'crate', url: 'https://crates.io/crates/batpak', type: 'live' },
  },
  {
    id: 'constraints-boundaries',
    principle: 'constraints',
    proof: 'Declared boundaries and public-API checks that compile. Illegal states are type errors, not runbook notes.',
    link: { label: 'repo', url: 'https://github.com/heyoub/LiteShip', type: 'repo' },
  },
]
