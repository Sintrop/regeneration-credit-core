export interface InspectorContractProps {
  id: string
  inspectorWallet: string
  name: string
  proofPhoto: string
  totalInspections: string
  giveUps: string
  lastAcceptedAt: string
  lastInspection: string
  pool: {
    level: string
    currentEra: string
  }
  createdAt: string
}

export interface InspectorProps {
  id: number
  inspectorWallet: string
  name: string
  proofPhoto: string
  totalInspections: number
  giveUps: number
  lastAcceptedAt: number
  lastInspection: number
  pool: {
    level: number
    currentEra: number
  }
  createdAt: number
}
