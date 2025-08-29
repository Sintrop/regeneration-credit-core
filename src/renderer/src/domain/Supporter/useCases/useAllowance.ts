import { useAccount, useReadContract } from 'wagmi'

import {
  rcAbi,
  rcAddress,
  sequoiaRcAbi,
  sequoiaRcAddress,
  sequoiaSupporterAddress,
  supporterAddress
} from '@renderer/services/contracts'
import { useMainnet } from '@renderer/hooks/useMainnet'
import { formatUnits } from 'viem'

interface ReturnUseAllowanceProps {
  tokensAllowed: number
  isLoading: boolean
  isError: boolean
  refetch: () => void
}
export function useAllowance(): ReturnUseAllowanceProps {
  const mainnet = useMainnet()
  const { address } = useAccount()

  const { data, isError, isLoading, refetch } = useReadContract({
    address: mainnet ? rcAddress : sequoiaRcAddress,
    abi: mainnet ? rcAbi : sequoiaRcAbi,
    functionName: 'allowance',
    args: [address, mainnet ? supporterAddress : sequoiaSupporterAddress]
  })

  return {
    tokensAllowed: data ? parseFloat(formatUnits(BigInt(data as string), 18)) : 0,
    isError,
    isLoading,
    refetch
  }
}
