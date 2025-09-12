export interface SupporterContractProps {
  id: string
  supporterWallet: string
  name: string
  description: string
  profilePhoto: string
  createdAt: string
  offsetsCount: string
  reductionItemsCount: string
}

export interface SupporterProps {
  id: number
  supporterWallet: string
  name: string
  description: string
  profilePhoto: string
  createdAt: number
  offsetsCount: number
  reductionItemsCount: number
}
