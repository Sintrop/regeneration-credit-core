import { formatUnits } from 'viem'
import { useReadContract } from 'wagmi'

import { userAbi, userAddress } from '@renderer/services/contracts'

interface Props {
  address: string
}

interface ReturnUseInviterPenalties {
  isLoading: boolean
  penalties: number
  isError: boolean
  refetch: () => void
}

export function useInviterPenalties({ address }: Props): ReturnUseInviterPenalties {
  const { data, isLoading, isError, refetch } = useReadContract({
    address: userAddress,
    abi: userAbi,
    functionName: 'inviterPenalties',
    args: [address]
  })

  const penalties = data ? parseInt(formatUnits(BigInt(data as string), 0)) : 0

  return {
    isLoading,
    penalties,
    isError,
    refetch
  }
}
