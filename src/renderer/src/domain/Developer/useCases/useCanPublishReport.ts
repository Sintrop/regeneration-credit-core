import { useAccount, useBlockNumber, useReadContract } from 'wagmi'
import { developerAbi, developerAddress } from '@renderer/services/contracts'
import { formatUnits } from 'viem'
import { DeveloperProps } from '@renderer/types/developer'

interface ReturnUseCanPublishReport {
  canPublish: boolean
  isLoading: boolean
  isError: boolean
  refetch: () => void
  waitBlocks: number
}
export function useCanPublishReport(): ReturnUseCanPublishReport {
  const { address } = useAccount()
  const {
    data: responseDeveloper,
    refetch: refetchDeveloper,
    isLoading: isLoadingDeveloper
  } = useReadContract({
    address: developerAddress,
    abi: developerAbi,
    functionName: 'getDeveloper',
    args: [address]
  })

  const developer = responseDeveloper as DeveloperProps
  const lastPublishedAt = developer
    ? parseInt(formatUnits(BigInt(developer?.lastPublishedAt), 0))
    : 0

  const {
    data: responseTime,
    refetch: refetchTime,
    isLoading: isLoadingTime
  } = useReadContract({
    address: developerAddress,
    abi: developerAbi,
    functionName: 'timeBetweenWorks',
    args: []
  })
  const timeBetweenWorks = responseTime
    ? parseInt(formatUnits(BigInt(responseTime as string), 0))
    : 0

  const { data: responseBlock } = useBlockNumber()
  const blockNumber = responseBlock ? parseInt(formatUnits(responseBlock, 0)) : 0

  function refetch(): void {
    refetchDeveloper()
    refetchTime()
  }

  const canPublish = lastPublishedAt + timeBetweenWorks < blockNumber
  const waitBlocks = lastPublishedAt + timeBetweenWorks - blockNumber

  return {
    canPublish,
    isError: false,
    isLoading: isLoadingDeveloper || isLoadingTime,
    refetch,
    waitBlocks
  }
}
