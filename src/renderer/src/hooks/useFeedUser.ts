import { Abi } from 'viem'
import { useReadContract } from 'wagmi'

import {
  activistAbi,
  activistAddress,
  contributorAbi,
  contributorAddress,
  developerAbi,
  developerAddress,
  inspectorAbi,
  inspectorAddress,
  regeneratorAbi,
  regeneratorAddress,
  researcherAbi,
  researcherAddress,
  supporterAbi,
  supporterAddress,
  userAbi,
  userAddress
} from '@renderer/services/contracts'

/** <Type>Rules getter for each CommunityTypes.UserType. */
const PROFILE_SOURCE: Record<number, { address: string; abi: unknown; functionName: string }> = {
  1: { address: regeneratorAddress, abi: regeneratorAbi, functionName: 'getRegenerator' },
  2: { address: inspectorAddress, abi: inspectorAbi, functionName: 'getInspector' },
  3: { address: researcherAddress, abi: researcherAbi, functionName: 'getResearcher' },
  4: { address: developerAddress, abi: developerAbi, functionName: 'getDeveloper' },
  5: { address: contributorAddress, abi: contributorAbi, functionName: 'getContributor' },
  6: { address: activistAddress, abi: activistAbi, functionName: 'getActivist' },
  7: { address: supporterAddress, abi: supporterAbi, functionName: 'getSupporter' }
}

export interface FeedUser {
  userType: number
  name: string
  photo: string
  isLoading: boolean
}

/** Name, photo and role of any address, cached by wagmi/react-query so repeated cards share one read. */
export function useFeedUser(address?: string): FeedUser {
  const { data: typeData, isLoading: loadingType } = useReadContract({
    address: userAddress,
    abi: userAbi as Abi,
    functionName: 'getUser',
    args: [address],
    query: { enabled: !!address, staleTime: 5 * 60_000 }
  })
  const userType = Number(typeData ?? 0)
  const source = PROFILE_SOURCE[userType]

  const { data: profile, isLoading: loadingProfile } = useReadContract({
    address: (source?.address ?? userAddress) as `0x${string}`,
    abi: (source?.abi ?? userAbi) as Abi,
    functionName: source?.functionName ?? 'getUser',
    args: [address],
    query: { enabled: !!address && !!source, staleTime: 5 * 60_000 }
  })

  const record = (profile ?? {}) as { name?: string; proofPhoto?: string; profilePhoto?: string }
  return {
    userType,
    name: record.name ?? '',
    photo: record.proofPhoto || record.profilePhoto || '',
    isLoading: loadingType || (!!source && loadingProfile)
  }
}
