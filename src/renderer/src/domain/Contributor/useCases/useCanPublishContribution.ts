import { useAccount, useBlockNumber, useReadContract } from 'wagmi'
import { developerAbi, contributorAddress, contributorAbi } from '@renderer/services/contracts'
import { formatUnits } from 'viem'
import { ContributorProps } from '@renderer/types/contributor'

interface ReturnUseCanPublishContribution {
  canPublish: boolean
  isLoading: boolean
  isError: boolean
  refetch: () => void
  waitBlocks: number
}
export function useCanPublishContribution(): ReturnUseCanPublishContribution {
  const { address } = useAccount()
  const {
    data: responseContributor,
    refetch: refetchContributor,
    isLoading: isLoadingContributor
  } = useReadContract({
    address: contributorAddress,
    abi: contributorAbi,
    functionName: 'getContributor',
    args: [address]
  })

  const developer = responseContributor as ContributorProps
  const lastPublishedAt = developer
    ? parseInt(formatUnits(BigInt(developer?.lastPublishedAt), 0))
    : 0

  const {
    data: responseTime,
    refetch: refetchTime,
    isLoading: isLoadingTime
  } = useReadContract({
    address: contributorAddress,
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
    refetchContributor()
    refetchTime()
  }

  const canPublish = lastPublishedAt + timeBetweenWorks < blockNumber
  const waitBlocks = lastPublishedAt + timeBetweenWorks - blockNumber

  return {
    canPublish,
    isError: false,
    isLoading: isLoadingContributor || isLoadingTime,
    refetch,
    waitBlocks
  }
}
