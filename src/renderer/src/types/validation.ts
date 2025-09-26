export interface ValidationProps {
  validator: string
  user: string
  justification: string
  votesToInvalidate: string
  createdAtBlockNumber: string
}

export interface ResourceValidationProps {
  validatorAddress: string
  justification: string
  createdAt: number
}
