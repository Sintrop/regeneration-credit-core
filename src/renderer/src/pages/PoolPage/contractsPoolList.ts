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
  sequoiaActivistPoolAddress,
  regeneratorAddress,
  sequoiaRegeneratorAddress,
  regeneratorAbi,
  sequoiaRegeneratorAbi,
  developerAddress,
  sequoiaDeveloperAddress,
  developerAbi,
  sequoiaDeveloperAbi,
  inspectorAddress,
  sequoiaInspectorAddress,
  inspectorAbi,
  sequoiaInspectorAbi,
  researcherAddress,
  sequoiaResearcherAddress,
  researcherAbi,
  sequoiaResearcherAbi,
  contributorAddress,
  sequoiaContributorAddress,
  contributorAbi,
  sequoiaContributorAbi,
  activistAddress,
  sequoiaActivistAddress,
  activistAbi,
  sequoiaActivistAbi
} from '@renderer/services/contracts'

const REGENERATOR_POOL_FUNDS = import.meta.env.VITE_REGENERATOR_POOL_FUNDS
const INSPECTOR_POOL_FUNDS = import.meta.env.VITE_INSPECTOR_POOL_FUNDS
const RESEARCHER_POOL_FUNDS = import.meta.env.VITE_RESEARCHER_POOL_FUNDS
const DEVELOPER_POOL_FUNDS = import.meta.env.VITE_DEVELOPER_POOL_FUNDS
const CONTRIBUTOR_POOL_FUNDS = import.meta.env.VITE_CONTRIBUTOR_POOL_FUNDS
const ACTIVIST_POOL_FUNDS = import.meta.env.VITE_ACTIVIST_POOL_FUNDS

export const contractsPool = {
  regenerator: {
    addressTestnet: sequoiaRegeneratorPoolAddress,
    addressMainnet: sequoiaRegeneratorPoolAddress,
    abiTestnet: sequoiaRegeneratorPoolAbi,
    abiMainnet: sequoiaRegeneratorPoolAbi,
    poolFunds: BigInt(REGENERATOR_POOL_FUNDS),
    userAddressMainnet: regeneratorAddress,
    userAddressTestnet: sequoiaRegeneratorAddress,
    userAbiMainnet: regeneratorAbi,
    userAbiTestnet: sequoiaRegeneratorAbi
  },
  inspector: {
    addressTestnet: sequoiaInspectorPoolAddress,
    addressMainnet: sequoiaInspectorPoolAddress,
    abiTestnet: sequoiaInspectorPoolAbi,
    abiMainnet: sequoiaInspectorPoolAbi,
    poolFunds: BigInt(INSPECTOR_POOL_FUNDS),
    userAddressMainnet: inspectorAddress,
    userAddressTestnet: sequoiaInspectorAddress,
    userAbiMainnet: inspectorAbi,
    userAbiTestnet: sequoiaInspectorAbi
  },
  researcher: {
    addressTestnet: sequoiaResearcherPoolAddress,
    addressMainnet: sequoiaResearcherPoolAddress,
    abiTestnet: sequoiaResearcherPoolAbi,
    abiMainnet: sequoiaResearcherPoolAbi,
    poolFunds: BigInt(RESEARCHER_POOL_FUNDS),
    userAddressMainnet: researcherAddress,
    userAddressTestnet: sequoiaResearcherAddress,
    userAbiMainnet: researcherAbi,
    userAbiTestnet: sequoiaResearcherAbi
  },
  developer: {
    addressTestnet: sequoiaDeveloperPoolAddress,
    addressMainnet: sequoiaDeveloperPoolAddress,
    abiTestnet: sequoiaDeveloperPoolAbi,
    abiMainnet: sequoiaDeveloperPoolAbi,
    poolFunds: BigInt(DEVELOPER_POOL_FUNDS),
    userAddressMainnet: developerAddress,
    userAddressTestnet: sequoiaDeveloperAddress,
    userAbiMainnet: developerAbi,
    userAbiTestnet: sequoiaDeveloperAbi
  },
  contributor: {
    addressTestnet: sequoiaContributorPoolAddress,
    addressMainnet: sequoiaContributorPoolAddress,
    abiTestnet: sequoiaContributorPoolAbi,
    abiMainnet: sequoiaContributorPoolAbi,
    poolFunds: BigInt(CONTRIBUTOR_POOL_FUNDS),
    userAddressMainnet: contributorAddress,
    userAddressTestnet: sequoiaContributorAddress,
    userAbiMainnet: contributorAbi,
    userAbiTestnet: sequoiaContributorAbi
  },
  activist: {
    addressTestnet: sequoiaActivistPoolAddress,
    addressMainnet: sequoiaActivistPoolAddress,
    abiTestnet: sequoiaActivistPoolAbi,
    abiMainnet: sequoiaActivistPoolAbi,
    poolFunds: BigInt(ACTIVIST_POOL_FUNDS),
    userAddressMainnet: activistAddress,
    userAddressTestnet: sequoiaActivistAddress,
    userAbiMainnet: activistAbi,
    userAbiTestnet: sequoiaActivistAbi
  }
}

export type ContractPoolType = typeof contractsPool
export type ContractsPoolName = keyof ContractPoolType
