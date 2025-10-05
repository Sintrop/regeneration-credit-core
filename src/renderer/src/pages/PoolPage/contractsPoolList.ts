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
  sequoiaActivistAbi,
  sequoiaValidationPoolAddress,
  validationPoolAddress,
  sequoiaValidationPoolAbi,
  validationAddress,
  sequoiaValidationAddress,
  validationAbi,
  sequoiaValidationAbi,
  inspectorPoolAbi,
  inspectorPoolAddress,
  regeneratorPoolAddress,
  regeneratorPoolAbi,
  researcherPoolAddress,
  researcherPoolAbi,
  developerPoolAddress,
  developerPoolAbi,
  contributorPoolAddress,
  contributorPoolAbi,
  activistPoolAddress,
  activistPoolAbi,
  validationPoolAbi
} from '@renderer/services/contracts'

const REGENERATOR_POOL_FUNDS = import.meta.env.VITE_REGENERATOR_POOL_FUNDS
const INSPECTOR_POOL_FUNDS = import.meta.env.VITE_INSPECTOR_POOL_FUNDS
const RESEARCHER_POOL_FUNDS = import.meta.env.VITE_RESEARCHER_POOL_FUNDS
const DEVELOPER_POOL_FUNDS = import.meta.env.VITE_DEVELOPER_POOL_FUNDS
const CONTRIBUTOR_POOL_FUNDS = import.meta.env.VITE_CONTRIBUTOR_POOL_FUNDS
const ACTIVIST_POOL_FUNDS = import.meta.env.VITE_ACTIVIST_POOL_FUNDS
const VALIDATION_POOL_FUNDS = import.meta.env.VITE_VALIDATION_POOL_FUNDS

export const contractsPool = {
  regenerator: {
    addressTestnet: sequoiaRegeneratorPoolAddress,
    addressMainnet: regeneratorPoolAddress,
    abiTestnet: sequoiaRegeneratorPoolAbi,
    abiMainnet: regeneratorPoolAbi,
    poolFunds: BigInt(REGENERATOR_POOL_FUNDS),
    userAddressMainnet: regeneratorAddress,
    userAddressTestnet: sequoiaRegeneratorAddress,
    userAbiMainnet: regeneratorAbi,
    userAbiTestnet: sequoiaRegeneratorAbi
  },
  inspector: {
    addressTestnet: sequoiaInspectorPoolAddress,
    addressMainnet: inspectorPoolAddress,
    abiTestnet: sequoiaInspectorPoolAbi,
    abiMainnet: inspectorPoolAbi,
    poolFunds: BigInt(INSPECTOR_POOL_FUNDS),
    userAddressMainnet: inspectorAddress,
    userAddressTestnet: sequoiaInspectorAddress,
    userAbiMainnet: inspectorAbi,
    userAbiTestnet: sequoiaInspectorAbi
  },
  researcher: {
    addressTestnet: sequoiaResearcherPoolAddress,
    addressMainnet: researcherPoolAddress,
    abiTestnet: sequoiaResearcherPoolAbi,
    abiMainnet: researcherPoolAbi,
    poolFunds: BigInt(RESEARCHER_POOL_FUNDS),
    userAddressMainnet: researcherAddress,
    userAddressTestnet: sequoiaResearcherAddress,
    userAbiMainnet: researcherAbi,
    userAbiTestnet: sequoiaResearcherAbi
  },
  developer: {
    addressTestnet: sequoiaDeveloperPoolAddress,
    addressMainnet: developerPoolAddress,
    abiTestnet: sequoiaDeveloperPoolAbi,
    abiMainnet: developerPoolAbi,
    poolFunds: BigInt(DEVELOPER_POOL_FUNDS),
    userAddressMainnet: developerAddress,
    userAddressTestnet: sequoiaDeveloperAddress,
    userAbiMainnet: developerAbi,
    userAbiTestnet: sequoiaDeveloperAbi
  },
  contributor: {
    addressTestnet: sequoiaContributorPoolAddress,
    addressMainnet: contributorPoolAddress,
    abiTestnet: sequoiaContributorPoolAbi,
    abiMainnet: contributorPoolAbi,
    poolFunds: BigInt(CONTRIBUTOR_POOL_FUNDS),
    userAddressMainnet: contributorAddress,
    userAddressTestnet: sequoiaContributorAddress,
    userAbiMainnet: contributorAbi,
    userAbiTestnet: sequoiaContributorAbi
  },
  activist: {
    addressTestnet: sequoiaActivistPoolAddress,
    addressMainnet: activistPoolAddress,
    abiTestnet: sequoiaActivistPoolAbi,
    abiMainnet: activistPoolAbi,
    poolFunds: BigInt(ACTIVIST_POOL_FUNDS),
    userAddressMainnet: activistAddress,
    userAddressTestnet: sequoiaActivistAddress,
    userAbiMainnet: activistAbi,
    userAbiTestnet: sequoiaActivistAbi
  },
  validation: {
    addressTestnet: sequoiaValidationPoolAddress,
    addressMainnet: validationPoolAddress,
    abiTestnet: sequoiaValidationPoolAbi,
    abiMainnet: validationPoolAbi,
    poolFunds: BigInt(VALIDATION_POOL_FUNDS),
    userAddressMainnet: validationAddress,
    userAddressTestnet: sequoiaValidationAddress,
    userAbiMainnet: validationAbi,
    userAbiTestnet: sequoiaValidationAbi
  }
}

export type ContractPoolType = typeof contractsPool
export type ContractsPoolName = keyof ContractPoolType
