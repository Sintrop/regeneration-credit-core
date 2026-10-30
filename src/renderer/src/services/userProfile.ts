import { Abi } from 'viem'

import * as C from './contracts'

/** Contract read that returns each user type's own record. */
export const PROFILE_READ: Record<
  number,
  { address: `0x${string}`; abi: Abi; functionName: string }
> = {
  1: {
    address: C.regeneratorAddress,
    abi: C.regeneratorAbi as Abi,
    functionName: 'getRegenerator'
  },
  2: { address: C.inspectorAddress, abi: C.inspectorAbi as Abi, functionName: 'getInspector' },
  3: { address: C.researcherAddress, abi: C.researcherAbi as Abi, functionName: 'getResearcher' },
  4: { address: C.developerAddress, abi: C.developerAbi as Abi, functionName: 'getDeveloper' },
  5: {
    address: C.contributorAddress,
    abi: C.contributorAbi as Abi,
    functionName: 'getContributor'
  },
  6: { address: C.activistAddress, abi: C.activistAbi as Abi, functionName: 'getActivist' },
  7: { address: C.supporterAddress, abi: C.supporterAbi as Abi, functionName: 'getSupporter' }
}

export interface UserProfile {
  name: string
  photoHash: string
  /** Pool level; regenerators show their regeneration score instead. Supporters have no pool. */
  level?: number
  poolEra?: number
  lastPublishedAt?: number
}

interface RawProfile {
  name?: string
  proofPhoto?: string
  profilePhoto?: string
  lastPublishedAt?: bigint
  pool?: { level?: bigint; currentEra?: bigint }
  regenerationScore?: { score?: bigint }
}

const num = (value: bigint | number | undefined): number | undefined =>
  value === undefined ? undefined : Number(value)

export function toUserProfile(userType: number, raw: unknown): UserProfile | undefined {
  if (!raw || typeof raw !== 'object') return undefined
  const data = raw as RawProfile
  return {
    name: data.name ?? '',
    photoHash: (userType === 7 ? data.profilePhoto : data.proofPhoto) ?? '',
    level: userType === 1 ? num(data.regenerationScore?.score) : num(data.pool?.level),
    poolEra: num(data.pool?.currentEra),
    lastPublishedAt: num(data.lastPublishedAt)
  }
}
