export interface ContributionProps {
  id: number
  era: number
  level: number
  validationsCount: number
  invalidatedAt: number
  createdAtBlockNumber: number
  contributed: boolean
  valid: boolean
  report: string
  developer: string
}

export interface DeveloperProps {
  id: number
  developerWallet: string
  name: string
  proofPhoto: string
  totalContributions: number
  createdAt: number
  pool: {
    level: number
    currentEra: number
  }
}
