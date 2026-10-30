import { Abi, createPublicClient, http } from 'viem'

import { sintrop } from '../../../../chains/sintrop'
import * as C from '../contracts'

export type TransferKind = 'receive' | 'send' | 'poolWithdraw' | 'burn'

export interface TokenTx {
  kind: TransferKind
  /** User type of the pool that paid a withdrawal. */
  poolType?: number
  blockNumber: number
  hash: string
  logIndex: number
  from: string
  to: string
  /** Wei, as a bigint to keep every digit. */
  value: bigint
}

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export const POOL_TYPE_BY_ADDRESS: Record<string, number> = {
  [C.regeneratorPoolAddress.toLowerCase()]: 1,
  [C.inspectorPoolAddress.toLowerCase()]: 2,
  [C.researcherPoolAddress.toLowerCase()]: 3,
  [C.developerPoolAddress.toLowerCase()]: 4,
  [C.contributorPoolAddress.toLowerCase()]: 5,
  [C.activistPoolAddress.toLowerCase()]: 6,
  [C.validationPoolAddress.toLowerCase()]: 8
}

/** Classifies an RC Transfer from the point of view of `address`. */
export function classifyTransfer(
  from: string,
  to: string,
  address: string
): { kind: TransferKind; poolType?: number } {
  const me = address.toLowerCase()
  if (to.toLowerCase() === ZERO_ADDRESS && from.toLowerCase() === me) return { kind: 'burn' }
  const poolType = POOL_TYPE_BY_ADDRESS[from.toLowerCase()]
  if (poolType && to.toLowerCase() === me) return { kind: 'poolWithdraw', poolType }
  return { kind: from.toLowerCase() === me ? 'send' : 'receive' }
}

interface Log {
  args: Record<string, unknown>
  blockNumber: bigint
  transactionHash: string
  logIndex: number
}

function client(rpcUrl: string): ReturnType<typeof createPublicClient> {
  return createPublicClient({ chain: sintrop, transport: http(rpcUrl) })
}

/** RC transfers sent and received by the address, newest first. */
export async function getTransfers(rpcUrl: string, address: string): Promise<TokenTx[]> {
  const read = (args: Record<string, string>): Promise<Log[]> =>
    client(rpcUrl).getContractEvents({
      address: C.rcAddress as `0x${string}`,
      abi: C.rcAbi as Abi,
      eventName: 'Transfer',
      args,
      fromBlock: 0n,
      toBlock: 'latest'
    }) as unknown as Promise<Log[]>
  const [sent, received] = await Promise.all([read({ from: address }), read({ to: address })])

  const byKey = new Map<string, TokenTx>()
  for (const log of [...sent, ...received]) {
    const from = String(log.args.from)
    const to = String(log.args.to)
    byKey.set(`${log.transactionHash}-${log.logIndex}`, {
      ...classifyTransfer(from, to, address),
      blockNumber: Number(log.blockNumber),
      hash: log.transactionHash,
      logIndex: Number(log.logIndex),
      from,
      to,
      value: BigInt(log.args.value as bigint)
    })
  }
  return [...byKey.values()].sort(
    (a, b) => b.blockNumber - a.blockNumber || b.logIndex - a.logIndex
  )
}

/** SupporterRules.CommissionsPaid received by the address as inviter, newest first. */
export async function getCommissions(rpcUrl: string, address: string): Promise<TokenTx[]> {
  const logs = (await client(rpcUrl).getContractEvents({
    address: C.supporterAddress as `0x${string}`,
    abi: C.supporterAbi as Abi,
    eventName: 'CommissionsPaid',
    args: { inviter: address },
    fromBlock: 0n,
    toBlock: 'latest'
  })) as unknown as Log[]
  return logs
    .map((log) => ({
      kind: 'receive' as const,
      blockNumber: Number(log.blockNumber),
      hash: log.transactionHash,
      logIndex: Number(log.logIndex),
      from: String(log.args.supporter),
      to: String(log.args.inviter),
      value: BigInt(log.args.amount as bigint)
    }))
    .sort((a, b) => b.blockNumber - a.blockNumber)
}
