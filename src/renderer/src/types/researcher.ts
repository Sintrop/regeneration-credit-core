export interface ResearcherProps {
  id: number
  researcherWallet: string
  name: string
  proofPhoto: string
  publishedResearches: number
  lastPublishedAt: number
  lastCalculatorItemAt: number
  pool: {
    level: number
    currentEra: number
  }
  createdAt: number
}
