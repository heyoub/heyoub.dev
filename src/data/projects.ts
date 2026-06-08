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
    id: 'attention-crm',
    principle: 'attention',
    proof: 'CRM rebuild. Max three choices per screen. Decision fatigue gone.',
  },
  {
    id: 'rent-memory',
    principle: 'rent',
    proof: 'Agent memory with real retrieval and decay. No wrapper theater.',
  },
  {
    id: 'constraints-compliance',
    principle: 'constraints',
    proof: 'Regulatory rules that compile. Illegal states are type errors.',
  },
]
