import {
  sequoiaRegeneratorPoolAbi,
  sequoiaRegeneratorPoolAddress,
  sequoiaInspectorPoolAbi,
  sequoiaInspectorPoolAddress,
  sequoiaResearcherPoolAbi,
  sequoiaResearcherPoolAddress,
  sequoiaDeveloperPoolAbi,
  sequoiaDeveloperPoolAddress,
  sequoiaContributorPoolAbi,
  sequoiaContributorPoolAddress,
  sequoiaActivistPoolAbi,
  sequoiaActivistPoolAddress
} from '@renderer/services/contracts'

export const contractsPool = {
  regenerator: {
    addressTestnet: sequoiaRegeneratorPoolAddress,
    addressMainnet: sequoiaRegeneratorPoolAddress,
    abiTestnet: sequoiaRegeneratorPoolAbi,
    abiMainnet: sequoiaRegeneratorPoolAbi,
    poolFunds: BigInt('750000000000000000000000000')
  },
  inspector: {
    addressTestnet: sequoiaInspectorPoolAddress,
    addressMainnet: sequoiaInspectorPoolAddress,
    abiTestnet: sequoiaInspectorPoolAbi,
    abiMainnet: sequoiaInspectorPoolAbi,
    poolFunds: BigInt('180000000000000000000000000')
  },
  researcher: {
    addressTestnet: sequoiaResearcherPoolAddress,
    addressMainnet: sequoiaResearcherPoolAddress,
    abiTestnet: sequoiaResearcherPoolAbi,
    abiMainnet: sequoiaResearcherPoolAbi,
    poolFunds: BigInt('30000000000000000000000000')
  },
  developer: {
    addressTestnet: sequoiaDeveloperPoolAddress,
    addressMainnet: sequoiaDeveloperPoolAddress,
    abiTestnet: sequoiaDeveloperPoolAbi,
    abiMainnet: sequoiaDeveloperPoolAbi,
    poolFunds: BigInt('30000000000000000000000000')
  },
  contributor: {
    addressTestnet: sequoiaContributorPoolAddress,
    addressMainnet: sequoiaContributorPoolAddress,
    abiTestnet: sequoiaContributorPoolAbi,
    abiMainnet: sequoiaContributorPoolAbi,
    poolFunds: BigInt('30000000000000000000000000')
  },
  activist: {
    addressTestnet: sequoiaActivistPoolAddress,
    addressMainnet: sequoiaActivistPoolAddress,
    abiTestnet: sequoiaActivistPoolAbi,
    abiMainnet: sequoiaActivistPoolAbi,
    poolFunds: BigInt('30000000000000000000000000')
  }
}

export type ContractPoolType = typeof contractsPool
export type ContractsPoolName = keyof ContractPoolType
