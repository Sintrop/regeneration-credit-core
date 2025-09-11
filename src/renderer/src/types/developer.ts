export interface ReportProps {
  id: number
  description: string
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

export interface DeveloperContractProps {
  id: string
  developerWallet: string
  name: string
  proofPhoto: string
  totalReports: string
  createdAt: string
  pool: {
    level: string
    currentEra: string
  }
  lastPublishedAt: string
}

export interface DeveloperProps {
  id: number
  developerWallet: string
  name: string
  proofPhoto: string
  totalReports: number
  createdAt: number
  pool: {
    level: number
    currentEra: number
  }
  lastPublishedAt: number
}
