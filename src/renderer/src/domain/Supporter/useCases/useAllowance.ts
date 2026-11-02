import { useAccount, useReadContract } from 'wagmi'

import { rcAbi, rcAddress, supporterAddress } from '@renderer/services/contracts'
import { formatUnits } from 'viem'

interface ReturnUseAllowanceProps {
  tokensAllowed: number
  isLoading: boolean
  isError: boolean
  refetch: () => void
}
export function useAllowance(): ReturnUseAllowanceProps {
  const { address } = useAccount()

  const { data, isError, isLoading, refetch } = useReadContract({
    address: rcAddress,
    abi: rcAbi,
    functionName: 'allowance',
    args: [address, supporterAddress]
  })

  return {
    tokensAllowed: data ? parseFloat(formatUnits(BigInt(data as string), 18)) : 0,
    isError,
    isLoading,
    refetch
  }
}
