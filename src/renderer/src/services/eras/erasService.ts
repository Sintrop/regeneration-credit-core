/* eslint-disable @typescript-eslint/no-explicit-any -- web3 contract method results are untyped */
import Web3 from 'web3'

import { POOL_HALVING, POOL_TYPES, POOLS } from '../pools/poolService'

const WEI = 10 ** 18
const num = (value: unknown): number => Number(value ?? 0)
/** Epochs shown in the halving schedule. */
export const SCHEDULE_EPOCHS = 6

export interface ErasOverview {
  currentEra: number
  currentEpoch: number
  /** Blockable.blocksPerEra is private: it is the gap between the ends of two consecutive eras. */
  blocksPerEra: number
  blocksToNextEra: number
  /** RC each pool distributes over its whole life (tokensPerEpoch(0)). */
  pools: { poolType: number; total: number }[]
  /** RC all pools distribute in one era of each epoch, from tokensPerEra(epoch, halving). */
  schedule: { epoch: number; perEra: number }[]
}

export async function getErasOverview(rpc: string): Promise<ErasOverview> {
  const web3 = new Web3(new Web3.providers.HttpProvider(rpc))
  const contract = (poolType: number): any =>
    new web3.eth.Contract(POOLS[poolType].pool.abi as any, POOLS[poolType].pool.address)
  const reference = contract(1)
  const currentEra = num(await reference.methods.currentContractEra().call())
  const epochs = Array.from({ length: SCHEDULE_EPOCHS }, (_, index) => index + 1)

  const [currentEpoch, endOfThis, endOfNext, totals, perEpoch] = await Promise.all([
    reference.methods.getEpochForEra(currentEra).call(),
    reference.methods.nextEraIn(currentEra).call(),
    reference.methods.nextEraIn(currentEra + 1).call(),
    Promise.all(POOL_TYPES.map((type) => contract(type).methods.tokensPerEpoch(0).call())),
    Promise.all(
      epochs.map((epoch) =>
        Promise.all(
          POOL_TYPES.map((type) => contract(type).methods.tokensPerEra(epoch, POOL_HALVING).call())
        )
      )
    )
  ])

  return {
    currentEra,
    currentEpoch: num(currentEpoch),
    blocksPerEra: num(endOfNext) - num(endOfThis),
    blocksToNextEra: Math.max(0, num(endOfThis)),
    pools: POOL_TYPES.map((poolType, index) => ({ poolType, total: num(totals[index]) / WEI })),
    schedule: epochs.map((epoch, index) => ({
      epoch,
      perEra: perEpoch[index].reduce((sum: number, value: unknown) => sum + num(value) / WEI, 0)
    }))
  }
}
