import { useReadContracts } from 'wagmi'

import {
  inspectionAbi,
  inspectionAddress,
  researcherAbi,
  researcherAddress,
  userAbi,
  userAddress,
  validationAbi,
  validationAddress
} from '@renderer/services/contracts'

/** InvitationRules.ACTIVIST_DELAY_BLOCKS: delay between an activist's regenerator/inspector invites. */
export const ACTIVIST_INVITE_DELAY_BLOCKS = 3000

export interface ProtocolRules {
  /** ResearcherRules/DeveloperRules/ContributorRules.timeBetweenWorks (same value in the three contracts). */
  timeBetweenWorks: number
  /** ValidationRules.timeBetweenVotes */
  timeBetweenVotes: number
  /** InspectionRules.acceptInspectionDelayBlocks */
  acceptInspectionDelayBlocks: number
  /** InspectionRules.blocksToExpireAcceptedInspection */
  blocksToExpireAcceptedInspection: number
  /** InspectionRules.securityBlocksToValidation */
  securityBlocksToValidation: number
  /** CommunityRules.getUserTypeSettings(userType).invitationDelayBlocks */
  invitationDelayBlocks: number
}

const toNumber = (value: unknown): number => Number(value ?? 0)

/** Deadlines read from the contracts, never from configuration. */
export function useProtocolRules(userType = 0): {
  rules: ProtocolRules | null
  isLoading: boolean
} {
  const { data, isLoading } = useReadContracts({
    contracts: [
      { address: researcherAddress, abi: researcherAbi, functionName: 'timeBetweenWorks' },
      { address: validationAddress, abi: validationAbi, functionName: 'timeBetweenVotes' },
      {
        address: inspectionAddress,
        abi: inspectionAbi,
        functionName: 'acceptInspectionDelayBlocks'
      },
      {
        address: inspectionAddress,
        abi: inspectionAbi,
        functionName: 'blocksToExpireAcceptedInspection'
      },
      {
        address: inspectionAddress,
        abi: inspectionAbi,
        functionName: 'securityBlocksToValidation'
      },
      { address: userAddress, abi: userAbi, functionName: 'getUserTypeSettings', args: [userType] }
    ],
    query: { staleTime: Infinity }
  })

  if (!data || data.some((item) => item.status !== 'success')) {
    return { rules: null, isLoading }
  }

  const settings = data[5].result as { invitationDelayBlocks?: number | bigint } | undefined

  return {
    rules: {
      timeBetweenWorks: toNumber(data[0].result),
      timeBetweenVotes: toNumber(data[1].result),
      acceptInspectionDelayBlocks: toNumber(data[2].result),
      blocksToExpireAcceptedInspection: toNumber(data[3].result),
      securityBlocksToValidation: toNumber(data[4].result),
      invitationDelayBlocks: toNumber(settings?.invitationDelayBlocks)
    },
    isLoading
  }
}
