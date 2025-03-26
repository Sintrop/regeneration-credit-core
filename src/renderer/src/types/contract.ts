/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ContractListProps {
  address: string
  name: string
  label?: string
  description?: string
  abi: any
}

export interface MethodAbiProps {
  name: string
  inputs: InputMethodAbiProps[]
  stateMutability: string
  type: string
  outputs: OutputProps[]
  anonymous: boolean
}

export interface InputMethodAbiProps {
  internalType: string
  name: string
  type: string
  indexed: boolean
}

export interface OutputProps {
  type: string
  name: string
  internalType: string
  components: ComponentOutputProps[]
}

export interface ComponentOutputProps {
  type: string
  name: string
  internalType: string
}
