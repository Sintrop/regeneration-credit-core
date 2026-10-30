/* eslint-disable @typescript-eslint/no-explicit-any -- web3 contract method results are untyped */
import Web3 from 'web3'

import * as C from '../contracts'

/** POOL_HALVING of the mainnet deploy: eras per epoch (getEpochForEra(13) === 2). */
export const POOL_HALVING = 12
/** Pool type 8 is the validation pool, paid to voters for the invalidation hunt. */
export const VALIDATION_POOL = 8
export const POOL_TYPES = [1, 2, 3, 4, 5, 6, VALIDATION_POOL]

interface ContractRef {
  abi: unknown
  address: string
}

export const POOLS: Record<number, { pool: ContractRef; rules: ContractRef; getter?: string }> = {
  1: {
    pool: { abi: C.regeneratorPoolAbi, address: C.regeneratorPoolAddress },
    rules: { abi: C.regeneratorAbi, address: C.regeneratorAddress },
    getter: 'getRegenerator'
  },
  2: {
    pool: { abi: C.inspectorPoolAbi, address: C.inspectorPoolAddress },
    rules: { abi: C.inspectorAbi, address: C.inspectorAddress },
    getter: 'getInspector'
  },
  3: {
    pool: { abi: C.researcherPoolAbi, address: C.researcherPoolAddress },
    rules: { abi: C.researcherAbi, address: C.researcherAddress },
    getter: 'getResearcher'
  },
  4: {
    pool: { abi: C.developerPoolAbi, address: C.developerPoolAddress },
    rules: { abi: C.developerAbi, address: C.developerAddress },
    getter: 'getDeveloper'
  },
  5: {
    pool: { abi: C.contributorPoolAbi, address: C.contributorPoolAddress },
    rules: { abi: C.contributorAbi, address: C.contributorAddress },
    getter: 'getContributor'
  },
  6: {
    pool: { abi: C.activistPoolAbi, address: C.activistPoolAddress },
    rules: { abi: C.activistAbi, address: C.activistAddress },
    getter: 'getActivist'
  },
  [VALIDATION_POOL]: {
    pool: { abi: C.validationPoolAbi, address: C.validationPoolAddress },
    rules: { abi: C.validationAbi, address: C.validationAddress }
  }
}

/** User types that can withdraw from each pool: voters (3, 4, 5) share the validation pool. */
export function canUsePool(poolType: number, userType: number): boolean {
  return poolType === VALIDATION_POOL ? [3, 4, 5].includes(userType) : poolType === userType
}

const WEI = 10 ** 18
const num = (value: unknown): number => Number(value ?? 0)
const rc = (value: unknown): number => num(value) / WEI

/** Poolable._calculateUserEraTokens: userLevels * tokensPerEra / eraLevels (0 without levels). */
export function userEraTokens(userLevels: number, eraLevels: number, eraTokens: number): number {
  if (userLevels <= 0 || eraLevels <= 0) return 0
  return (userLevels * eraTokens) / eraLevels
}

export function percentage(part: number, total: number): number {
  if (total <= 0) return 0
  return Math.min(100, Math.max(0, (part / total) * 100))
}

function contracts(rpc: string, poolType: number): { web3: Web3; pool: any; rules: any } {
  const web3 = new Web3(new Web3.providers.HttpProvider(rpc))
  const ref = POOLS[poolType]
  return {
    web3,
    pool: new web3.eth.Contract(ref.pool.abi as any, ref.pool.address),
    rules: new web3.eth.Contract(ref.rules.abi as any, ref.rules.address)
  }
}

async function eraTokens(pool: any, era: number): Promise<number> {
  const epoch = await pool.methods.getEpochForEra(era).call()
  return rc(await pool.methods.tokensPerEra(epoch, POOL_HALVING).call())
}

export interface PoolOverview {
  poolType: number
  totalTokens: number
  balance: number
  distributed: number
  distributedPercentage: number
  currentEra: number
  currentEpoch: number
  tokensPerEra: number
  blocksToNextEra: number
}

export async function getPoolOverview(rpc: string, poolType: number): Promise<PoolOverview> {
  const { web3, pool } = contracts(rpc, poolType)
  const token = new web3.eth.Contract(C.rcAbi as any, C.rcAddress) as any
  const [total, balance, currentEra] = await Promise.all([
    pool.methods.tokensPerEpoch(0).call(),
    token.methods.balanceOf(POOLS[poolType].pool.address).call(),
    pool.methods.currentContractEra().call()
  ])
  const era = num(currentEra)
  const [blocksToNextEra, epoch, perEra] = await Promise.all([
    pool.methods.nextEraIn(era).call(),
    pool.methods.getEpochForEra(era).call(),
    eraTokens(pool, era)
  ])
  const totalTokens = rc(total)
  const poolBalance = rc(balance)
  const distributed = Math.max(0, totalTokens - poolBalance)
  return {
    poolType,
    totalTokens,
    balance: poolBalance,
    distributed,
    distributedPercentage: percentage(distributed, totalTokens),
    currentEra: era,
    currentEpoch: num(epoch),
    tokensPerEra: perEra,
    blocksToNextEra: Math.max(0, num(blocksToNextEra))
  }
}

export interface PoolWithdrawal {
  user: string
  amount: number
  blockNumber: number
}

export interface PoolEraDetails {
  era: number
  /** Withdrawable once it is behind the pool's current era (Blockable.canWithdraw). */
  claimable: boolean
  tokensToDistribute: number
  withdrawnTokens: number
  withdrawnPercentage: number
  levels: number
  claimsCount: number
  withdrawals: PoolWithdrawal[]
}

export async function getPoolEraDetails(
  rpc: string,
  poolType: number,
  era: number,
  currentEra: number
): Promise<PoolEraDetails> {
  const { pool } = contracts(rpc, poolType)
  const [eraData, tokensToDistribute, events] = await Promise.all([
    pool.methods.getEra(era).call(),
    eraTokens(pool, era),
    pool.getPastEvents('TokensWithdrawn', { fromBlock: 0, toBlock: 'latest' })
  ])
  const withdrawnTokens = rc(eraData.tokens)
  const withdrawals = (events as any[])
    .filter((event) => num(event.returnValues.era) === era)
    .map((event) => ({
      user: String(event.returnValues.user),
      amount: rc(event.returnValues.amount),
      blockNumber: num(event.blockNumber)
    }))
    .sort((a, b) => b.amount - a.amount)
  return {
    era,
    claimable: era < currentEra,
    tokensToDistribute,
    withdrawnTokens,
    withdrawnPercentage: percentage(withdrawnTokens, tokensToDistribute),
    levels: num(eraData.levels),
    claimsCount: num(eraData.claimsCount),
    withdrawals
  }
}

export interface PoolUserPosition {
  /** Era the next withdraw() processes. */
  userEra: number
  canWithdraw: boolean
  estimatedTokens: number
  userLevelsInEra: number
  eraLevels: number
  currentEraLevels: number
  blocksToUserEraEnd: number
  /** Contract requirement besides the era, when not met: regenerators need 3 inspections, voters a first vote. */
  blocker?: 'minimumInspections' | 'notVoter' | 'noVote'
  pendingTokens: number
  pendingEras: number
}

/** The user's era in this pool, read where each Rules contract keeps it. */
async function userPoolState(
  poolType: number,
  rules: any,
  web3: Web3,
  address: string
): Promise<{ userEra: number; blocker?: PoolUserPosition['blocker'] }> {
  if (poolType === VALIDATION_POOL) {
    const community = new web3.eth.Contract(C.userAbi as any, C.userAddress) as any
    const [hunter, lastVoteAt, isVoter] = await Promise.all([
      rules.methods.hunterPools(address).call(),
      rules.methods.validatorLastVoteAt(address).call(),
      community.methods.isVoter(address).call()
    ])
    // ValidationRules.withdraw: isVoter, validatorLastVoteAt > 0, then hunterPools(user).currentEra.
    const blocker = !isVoter ? 'notVoter' : num(lastVoteAt) === 0 ? 'noVote' : undefined
    return { userEra: Math.max(1, num(hunter.currentEra)), blocker }
  }
  const user = await rules.methods[POOLS[poolType].getter as string](address).call()
  const blocker =
    poolType === 1 && num(user?.totalInspections) < 3 ? 'minimumInspections' : undefined
  return { userEra: Math.max(1, num(user?.pool?.currentEra)), blocker }
}

export async function getPoolUserPosition(
  rpc: string,
  poolType: number,
  address: string,
  currentEra: number
): Promise<PoolUserPosition> {
  const { web3, pool, rules } = contracts(rpc, poolType)
  const { userEra, blocker } = await userPoolState(poolType, rules, web3, address)

  const [userLevels, eraData, currentLevels, blocksToEnd, userEraTokensTotal] = await Promise.all([
    pool.methods.eraLevels(userEra, address).call(),
    pool.methods.getEra(userEra).call(),
    pool.methods.eraLevels(currentEra, address).call(),
    pool.methods.nextEraIn(userEra).call(),
    eraTokens(pool, userEra)
  ])

  const pendingEraIds = Array.from(
    { length: Math.max(0, currentEra - userEra) },
    (_, i) => userEra + i
  )
  const pending = await Promise.all(
    pendingEraIds.map(async (era) => {
      const [levels, info, tokens] = await Promise.all([
        pool.methods.eraLevels(era, address).call(),
        pool.methods.getEra(era).call(),
        eraTokens(pool, era)
      ])
      return userEraTokens(num(levels), num(info.levels), tokens)
    })
  )

  return {
    userEra,
    canWithdraw: userEra < currentEra,
    estimatedTokens: userEraTokens(num(userLevels), num(eraData.levels), userEraTokensTotal),
    userLevelsInEra: num(userLevels),
    eraLevels: num(eraData.levels),
    currentEraLevels: num(currentLevels),
    blocksToUserEraEnd: Math.max(0, num(blocksToEnd)),
    blocker,
    pendingTokens: pending.reduce((sum, value) => sum + value, 0),
    pendingEras: pendingEraIds.length
  }
}
