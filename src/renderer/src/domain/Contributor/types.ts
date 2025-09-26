export interface ContributionValidationContractProps {
  _validatorAddress: string
  _resourceId: string
  _justification: string
}

export interface ContributionValidationProps {
  validatorAddress: string
  resourceId: number
  justification: string
  createdAt: number
}
