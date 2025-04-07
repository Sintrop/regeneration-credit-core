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

export interface ResearchProps {
  id: number
  era: number
  createdBy: string
  title: string
  thesis: string
  file: string
  validationsCount: number
  valid: boolean
  invalidatedAt: number
  createdAtBlock: number
}

export interface CalculatorItemProps {
  id: number
  createdBy: string
  title: string
  unit: string
  justification: string
  carbonImpact: number
}
