import { POOL_FUNDS } from '@renderer/services/poolFunds'
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

export const contractsPool = {
  regenerator: {
    addressMainnet: regeneratorPoolAddress,
    abiMainnet: regeneratorPoolAbi,
    poolFunds: POOL_FUNDS.REGENERATOR,
    userAddressMainnet: regeneratorAddress,
    userAbiMainnet: regeneratorAbi
  },
  inspector: {
    addressMainnet: inspectorPoolAddress,
    abiMainnet: inspectorPoolAbi,
    poolFunds: POOL_FUNDS.INSPECTOR,
    userAddressMainnet: inspectorAddress,
    userAbiMainnet: inspectorAbi
  },
  researcher: {
    addressMainnet: researcherPoolAddress,
    abiMainnet: researcherPoolAbi,
    poolFunds: POOL_FUNDS.RESEARCHER,
    userAddressMainnet: researcherAddress,
    userAbiMainnet: researcherAbi
  },
  developer: {
    addressMainnet: developerPoolAddress,
    abiMainnet: developerPoolAbi,
    poolFunds: POOL_FUNDS.DEVELOPER,
    userAddressMainnet: developerAddress,
    userAbiMainnet: developerAbi
  },
  contributor: {
    addressMainnet: contributorPoolAddress,
    abiMainnet: contributorPoolAbi,
    poolFunds: POOL_FUNDS.CONTRIBUTOR,
    userAddressMainnet: contributorAddress,
    userAbiMainnet: contributorAbi
  },
  activist: {
    addressMainnet: activistPoolAddress,
    abiMainnet: activistPoolAbi,
    poolFunds: POOL_FUNDS.ACTIVIST,
    userAddressMainnet: activistAddress,
    userAbiMainnet: activistAbi
  },
  validation: {
    addressMainnet: validationPoolAddress,
    abiMainnet: validationPoolAbi,
    poolFunds: POOL_FUNDS.VALIDATION,
    userAddressMainnet: validationAddress,
    userAbiMainnet: validationAbi
  }
}

export type ContractPoolType = typeof contractsPool
export type ContractsPoolName = keyof ContractPoolType
