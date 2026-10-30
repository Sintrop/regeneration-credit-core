import {
  regeneratorAddress,
  regeneratorAbi,
  developerAddress,
  developerAbi,
  inspectorAddress,
  inspectorAbi,
  researcherAddress,
  researcherAbi,
  contributorAddress,
  contributorAbi,
  activistAddress,
  activistAbi,
  validationPoolAddress,
  validationAddress,
  validationAbi,
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
    addressMainnet: regeneratorPoolAddress,
    abiMainnet: regeneratorPoolAbi,
    poolFunds: BigInt(REGENERATOR_POOL_FUNDS),
    userAddressMainnet: regeneratorAddress,
    userAbiMainnet: regeneratorAbi
  },
  inspector: {
    addressMainnet: inspectorPoolAddress,
    abiMainnet: inspectorPoolAbi,
    poolFunds: BigInt(INSPECTOR_POOL_FUNDS),
    userAddressMainnet: inspectorAddress,
    userAbiMainnet: inspectorAbi
  },
  researcher: {
    addressMainnet: researcherPoolAddress,
    abiMainnet: researcherPoolAbi,
    poolFunds: BigInt(RESEARCHER_POOL_FUNDS),
    userAddressMainnet: researcherAddress,
    userAbiMainnet: researcherAbi
  },
  developer: {
    addressMainnet: developerPoolAddress,
    abiMainnet: developerPoolAbi,
    poolFunds: BigInt(DEVELOPER_POOL_FUNDS),
    userAddressMainnet: developerAddress,
    userAbiMainnet: developerAbi
  },
  contributor: {
    addressMainnet: contributorPoolAddress,
    abiMainnet: contributorPoolAbi,
    poolFunds: BigInt(CONTRIBUTOR_POOL_FUNDS),
    userAddressMainnet: contributorAddress,
    userAbiMainnet: contributorAbi
  },
  activist: {
    addressMainnet: activistPoolAddress,
    abiMainnet: activistPoolAbi,
    poolFunds: BigInt(ACTIVIST_POOL_FUNDS),
    userAddressMainnet: activistAddress,
    userAbiMainnet: activistAbi
  },
  validation: {
    addressMainnet: validationPoolAddress,
    abiMainnet: validationPoolAbi,
    poolFunds: BigInt(VALIDATION_POOL_FUNDS),
    userAddressMainnet: validationAddress,
    userAbiMainnet: validationAbi
  }
}

export type ContractPoolType = typeof contractsPool
export type ContractsPoolName = keyof ContractPoolType
