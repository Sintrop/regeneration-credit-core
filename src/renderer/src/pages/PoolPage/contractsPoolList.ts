import {
  sequoiaRegeneratorPoolAbi,
  sequoiaRegeneratorPoolAddress
} from '@renderer/services/contracts'

export const contractsPool = {
  regenerator: {
    addressTestnet: sequoiaRegeneratorPoolAddress,
    addressMainnet: sequoiaRegeneratorPoolAddress,
    abiTestnet: sequoiaRegeneratorPoolAbi,
    abiMainnet: sequoiaRegeneratorPoolAbi,
    poolFunds: BigInt('750000000000000000000000000')
  }
}

export type ContractPoolType = typeof contractsPool
export type ContractsPoolName = keyof ContractPoolType
