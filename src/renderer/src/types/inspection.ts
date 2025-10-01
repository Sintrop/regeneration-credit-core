export interface InspectionProps {
  id: number
  status: number
  regenerator: string
  inspector: string
  regenerationScore: number
  proofPhotos: string
  justificationReport: string
  validationsCount: number
  createdAt: number
  acceptedAt: number
  inspectedAt: number
  inspectedAtEra: number
  invalidatedAt: number
  treesResult: number
  biodiversityResult: number
}

export interface InspectionContractProps {
  id: string
  status: string
  regenerator: string
  inspector: string
  regenerationScore: string
  proofPhotos: string
  justificationReport: string
  validationsCount: string
  createdAt: string
  acceptedAt: string
  inspectedAt: string
  inspectedAtEra: string
  invalidatedAt: string
  treesResult: string
  biodiversityResult: string
}
