export interface RegeneratorProps {
  id: number
  producerWallet: string
  name: string
  proofPhoto: string
  pendingInspection: boolean
  totalInspections: number
  lastRequestAt: number
  totalArea: number
  regenerationScore: {
    score: number
    average: number
    sustainable: boolean
  }
  pool: {
    onContractPool: boolean
    currentEra: number
  }
  createdAt: number
}
