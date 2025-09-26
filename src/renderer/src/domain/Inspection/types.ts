export interface InspectionValidationContractProps {
  _validatorAddress: string
  _resourceId: string
  _justification: string
}

export interface InspectionValidationProps {
  validatorAddress: string
  resourceId: number
  justification: string
  createdAt: number
}
