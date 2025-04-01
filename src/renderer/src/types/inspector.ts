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
