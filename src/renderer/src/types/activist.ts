export interface ActivistContractProps {
  id: string
  name: string
  activistWallet: string
  proofPhoto: string
  pool: {
    level: string
    currentEra: string
  }
  createdAt: string
}

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
