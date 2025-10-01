import { formatUnits } from 'viem'
import { useBlockNumber } from 'wagmi'

interface ReturnUseCurrentBlock {
  blockNumber: number
  isLoading: boolean
  isError: boolean
  refetch: () => void
}

export function useCurrentBlock(): ReturnUseCurrentBlock {
  const { data, isLoading, isError, refetch } = useBlockNumber()

  const blockNumber = data ? parseInt(formatUnits(data, 0)) : 0

  return {
    isError,
    isLoading,
    blockNumber,
    refetch
  }
}
