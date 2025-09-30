import { formatUnits } from 'viem'
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

interface ReturnUseInviterPenalties {
  isLoading: boolean
  penalties: number
  isError: boolean
  refetch: () => void
}

export function useInviterPenalties({ address }: Props): ReturnUseInviterPenalties {
  const mainnet = useMainnet()
  const { data, isLoading, isError, refetch } = useReadContract({
    address: mainnet ? userAddress : sequoiaUserAddress,
    abi: mainnet ? userAbi : sequoiaUserAbi,
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
