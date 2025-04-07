export interface ContributorProps {
  id: number
  contributorWallet: string
  name: string
  proofPhoto: string
  lastPublishedAt: number
  pool: {
    currentEra: number
    level: number
  }
  createdAt: number
}

export interface ContributionProps {
  id: number
  era: number
  user: string
  level: string
  description: string
  report: string
  createdAtBlockNumber: number
}
