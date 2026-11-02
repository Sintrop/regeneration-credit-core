import { useReadContract } from 'wagmi'

import { userAbi, userAddress } from '@renderer/services/contracts'
import { formatUnits } from 'viem'

interface Props {
  address: string
}

interface ReturnUseUserDelationsIds {
  isLoading: boolean
  delationsIds: number[]
  isError: boolean
  refetch: () => void
}

export function useUserDelationsIds({ address }: Props): ReturnUseUserDelationsIds {
  const { data, isLoading, isError, refetch } = useReadContract({
    address: userAddress,
    abi: userAbi,
    functionName: 'getUserDelations',
    args: [address]
  })

  const response = data ? (data as string[]) : []
  const delationsIds: number[] = []

  for (let i = 0; i < response.length; i++) {
    delationsIds.push(parseInt(formatUnits(BigInt(response[i]), 0)))
  }

  return {
    isLoading,
    delationsIds,
    isError,
    refetch
  }
}
