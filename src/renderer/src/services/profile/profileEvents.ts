import { Abi, createPublicClient, http } from 'viem'

import { sintrop } from '../../../../chains/sintrop'
import * as C from '../contracts'

export type CompensationKind = 'offset' | 'treeFunding'

export interface Compensation {
  kind: CompensationKind
  /** Wei. */
  amount: bigint
  blockNumber: number
  /** Offsets only: calculator item and the message left by the supporter. */
  calculatorItemId?: number
  message?: string
  transactionHash: string
}

export interface InvitedUser {
  invited: string
  invitedType: number
  blockNumber: number
}

interface Log {
  args: Record<string, unknown>
  blockNumber: bigint
  transactionHash: string
}

function events(
  rpcUrl: string,
  address: string,
  abi: unknown,
  eventName: string,
  args: Record<string, string>
): Promise<Log[]> {
  return createPublicClient({ chain: sintrop, transport: http(rpcUrl) }).getContractEvents({
    address: address as `0x${string}`,
    abi: abi as Abi,
    eventName,
    args,
    fromBlock: 0n,
    toBlock: 'latest'
  }) as unknown as Promise<Log[]>
}

/**
 * Offsets (SupporterRules.OffsetMade) and direct tree-funding burns of one supporter, newest first.
 * An offset also emits TokensCertified in the same transaction, so those are not counted twice.
 */
export function toCompensations(offsets: Log[], certified: Log[]): Compensation[] {
  const offsetTxs = new Set(offsets.map((log) => log.transactionHash))
  const fromOffsets: Compensation[] = offsets.map((log) => ({
    kind: 'offset',
    amount: BigInt(log.args.amountBurned as bigint),
    blockNumber: Number((log.args.blockNumber as bigint | undefined) ?? log.blockNumber),
    calculatorItemId: Number(log.args.calculatorItemId),
    message: String(log.args.message ?? ''),
    transactionHash: log.transactionHash
  }))
  const fundings: Compensation[] = certified
    .filter((log) => !offsetTxs.has(log.transactionHash))
    .map((log) => ({
      kind: 'treeFunding',
      amount: BigInt(log.args.amount as bigint),
      blockNumber: Number(log.blockNumber),
      transactionHash: log.transactionHash
    }))
  return [...fromOffsets, ...fundings].sort((a, b) => b.blockNumber - a.blockNumber)
}

export async function getSupporterCompensations(
  rpcUrl: string,
  address: string
): Promise<Compensation[]> {
  const [offsets, certified] = await Promise.all([
    events(rpcUrl, C.supporterAddress, C.supporterAbi, 'OffsetMade', { supporterAddress: address }),
    events(rpcUrl, C.rcAddress, C.rcAbi, 'TokensCertified', { account: address })
  ])
  return toCompensations(offsets, certified)
}

/** InvitationRules.UserInvited sent by one inviter, newest first. */
export async function getInvitedUsers(rpcUrl: string, inviter: string): Promise<InvitedUser[]> {
  const logs = await events(rpcUrl, C.invitationAddress, C.invitationAbi, 'UserInvited', {
    inviter
  })
  return logs
    .map((log) => ({
      invited: String(log.args.invited),
      invitedType: Number(log.args.invitedType),
      blockNumber: Number((log.args.blockNumber as bigint | undefined) ?? log.blockNumber)
    }))
    .sort((a, b) => b.blockNumber - a.blockNumber)
}
