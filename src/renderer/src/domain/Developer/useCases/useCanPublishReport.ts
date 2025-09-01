import { useAccount, useReadContract } from 'wagmi'
import { useMainnet } from '@renderer/hooks/useMainnet'
import {
  developerAbi,
  developerAddress,
  sequoiaDeveloperAbi,
  sequoiaDeveloperAddress
} from '@renderer/services/contracts'

interface ReturnUseCanPublishReport {
  canPublish: boolean
  isLoading: boolean
  isError: boolean
  refetch: () => void
}
export function useCanPublishReport(): ReturnUseCanPublishReport {
  const mainnet = useMainnet()
  const { address } = useAccount()
  const { data, isLoading, isError, refetch } = useReadContract({
    address: mainnet ? developerAddress : sequoiaDeveloperAddress,
    abi: mainnet ? developerAbi : sequoiaDeveloperAbi,
    functionName: 'canPublishReport',
    args: [address]
  })

  const canPublish = data ? (data ? true : false) : false

  return {
    canPublish,
    isError,
    isLoading,
    refetch
  }
}
