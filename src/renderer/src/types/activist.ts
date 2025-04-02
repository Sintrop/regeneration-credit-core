export interface ActivistProps {
  id: number
  name: string
  activistWallet: string
  proofPhoto: string
  pool: {
    level: number
    currentEra: number
  }
  createdAt: number
}
