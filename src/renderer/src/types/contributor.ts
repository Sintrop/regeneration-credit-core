export interface ContributorProps {
  id: number
  contributorWallet: string
  name: string
  proofPhoto: string
  pool: {
    currentEra: number
    level: number
  }
  createdAt: number
}
