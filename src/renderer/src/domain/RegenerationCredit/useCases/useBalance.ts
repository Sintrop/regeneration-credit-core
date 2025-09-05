import { useAccount, useReadContract } from 'wagmi'
import { formatUnits } from 'viem'
import { rcAbi, rcAddress, sequoiaRcAbi, sequoiaRcAddress } from '@renderer/services/contracts'
import { useMainnet } from '@renderer/hooks/useMainnet'

interface ReturnUseBalanceRc {
  isLoading: boolean
  balance: number
  refetch: () => void
}
export function useBalance(): ReturnUseBalanceRc {
  const mainnet = useMainnet()
  const { isDisconnected, address } = useAccount()
  const { data, isLoading, isRefetching, refetch } = useReadContract({
    address: mainnet ? rcAddress : sequoiaRcAddress,
    abi: mainnet ? rcAbi : sequoiaRcAbi,
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
