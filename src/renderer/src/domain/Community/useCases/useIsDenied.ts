import { useReadContract } from 'wagmi'

import { useMainnet } from '@renderer/hooks/useMainnet'
import {
  sequoiaUserAbi,
  sequoiaUserAddress,
  userAbi,
  userAddress
} from '@renderer/services/contracts'

interface Props {
  address: string
}

interface ReturnUseIsDenied {
  isLoading: boolean
  isDenied: boolean
  isError: boolean
  refetch: () => void
}

export function useIsDenied({ address }: Props): ReturnUseIsDenied {
  const mainnet = useMainnet()
  const { data, isLoading, isError, refetch } = useReadContract({
    address: mainnet ? userAddress : sequoiaUserAddress,
    abi: mainnet ? userAbi : sequoiaUserAbi,
    functionName: 'isDenied',
    args: [address]
  })

  const isDenied = data ? (data as boolean) : false

  return {
    isLoading,
    isDenied,
    isError,
    refetch
  }
}
