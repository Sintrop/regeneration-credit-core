export interface ReportValidationContractProps {
  _validatorAddress: string
  _resourceId: string
  _justification: string
}

export interface ReportValidationProps {
  validatorAddress: string
  resourceId: number
  justification: string
  createdAt: number
}
