import { useReadContract } from 'wagmi'

import { userAbi, userAddress } from '@renderer/services/contracts'

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
  const { data, isLoading, isError, refetch } = useReadContract({
    address: userAddress,
    abi: userAbi,
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
