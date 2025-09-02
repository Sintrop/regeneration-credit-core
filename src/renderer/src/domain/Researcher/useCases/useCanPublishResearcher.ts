import { useAccount, useBlockNumber, useReadContract } from 'wagmi'
import { useMainnet } from '@renderer/hooks/useMainnet'
import {
  researcherAbi,
  researcherAddress,
  sequoiaResearcherAbi,
  sequoiaResearcherAddress
} from '@renderer/services/contracts'
import { formatUnits } from 'viem'
import { ResearcherProps } from '@renderer/types/researcher'

interface ReturnUseCanPublishReport {
  canPublish: boolean
  isLoading: boolean
  isError: boolean
  refetch: () => void
  waitBlocks: number
}
export function useCanPublishResearcher(): ReturnUseCanPublishReport {
  const mainnet = useMainnet()
  const { address } = useAccount()
  const {
    data: responseResearcher,
    refetch: refetchResearcher,
    isLoading: isLoadingResearcher
  } = useReadContract({
    address: mainnet ? researcherAddress : sequoiaResearcherAddress,
    abi: mainnet ? researcherAbi : sequoiaResearcherAbi,
    functionName: 'getResearcher',
    args: [address]
  })

  const developer = responseResearcher as ResearcherProps
  const lastPublishedAt = developer
    ? parseInt(formatUnits(BigInt(developer?.lastPublishedAt), 0))
    : 0

  const {
    data: responseTime,
    refetch: refetchTime,
    isLoading: isLoadingTime
  } = useReadContract({
    address: mainnet ? researcherAddress : sequoiaResearcherAddress,
    abi: mainnet ? researcherAbi : sequoiaResearcherAbi,
    functionName: 'timeBetweenWorks',
    args: []
  })
  const timeBetweenWorks = responseTime
    ? parseInt(formatUnits(BigInt(responseTime as string), 0))
    : 0

  const { data: responseBlock } = useBlockNumber()
  const blockNumber = responseBlock ? parseInt(formatUnits(responseBlock, 0)) : 0

  function refetch(): void {
    refetchResearcher()
    refetchTime()
  }

  const canPublish = lastPublishedAt + timeBetweenWorks < blockNumber
  const waitBlocks = lastPublishedAt + timeBetweenWorks - blockNumber

  return {
    canPublish,
    isError: false,
    isLoading: isLoadingResearcher || isLoadingTime,
    refetch,
    waitBlocks
  }
}
