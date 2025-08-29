import { useAccount, useChainId, useReadContract } from 'wagmi'
import { formatUnits } from 'viem'
import { rcAbi, rcAddress, sequoiaRcAbi, sequoiaRcAddress } from '@renderer/services/contracts'

interface ReturnUseBalanceRc {
  isLoading: boolean
  balance: number
  refetch: () => void
}
export function useBalanceRc(): ReturnUseBalanceRc {
  const chainId = useChainId()
  const { isDisconnected, address } = useAccount()
  const { data, isLoading, isRefetching, refetch } = useReadContract({
    address: chainId === 250225 ? rcAddress : sequoiaRcAddress,
    abi: chainId === 250225 ? rcAbi : sequoiaRcAbi,
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
