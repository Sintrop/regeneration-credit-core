import { useAccount, useReadContract } from 'wagmi'
import { formatUnits } from 'viem'
import { rcAbi, rcAddress } from '@renderer/services/contracts'

interface ReturnUseBalanceRc {
  isLoading: boolean
  balance: number
  refetch: () => void
}
export function useBalance(): ReturnUseBalanceRc {
  const { isDisconnected, address } = useAccount()
  const { data, isLoading, isRefetching, refetch } = useReadContract({
    address: rcAddress,
    abi: rcAbi,
    functionName: 'balanceOf',
    args: [address]
  })

  const balance = data ? parseFloat(formatUnits(BigInt(data as string), 18)) : 0

  return {
    isLoading: isLoading || isRefetching,
    balance: isDisconnected ? 0 : balance,
    refetch
  }
}
