export interface RegeneratorProps {
  id: number
  producerWallet: string
  name: string
  proofPhoto: string
  pendingInspection: boolean
  totalInspections: number
  lastRequestAt: number
  regenerationScore: {
    score: number
    average: number
    sustainable: boolean
  }
  areaInformation: {
    coordinates: string
    totalArea: number
  }
  pool: {
    onContractPool: boolean
    currentEra: number
  }
}
