import { useMainnet } from '@renderer/hooks/useMainnet'
import {
  rcAbi,
  rcAddress,
  sequoiaRcAbi,
  sequoiaRcAddress,
  sequoiaSupporterAddress,
  supporterAddress
} from '@renderer/services/contracts'
import { parseEther } from 'viem'
import { useWriteContract } from 'wagmi'

interface ReturnUseApproveProps {
  approve: (ammount: string) => void
  isPending: boolean
  isError: boolean
  error?: string
  hash?: `0x${string}`
}

export function useApprove(): ReturnUseApproveProps {
  const mainnet = useMainnet()
  const { data, isError, isPending, error, writeContract } = useWriteContract()

  function handleApprove(ammount: string): void {
    const value = parseEther(ammount)

    writeContract({
      address: mainnet ? rcAddress : sequoiaRcAddress,
      abi: mainnet ? rcAbi : sequoiaRcAbi,
      functionName: 'approve',
      args: [mainnet ? supporterAddress : sequoiaSupporterAddress, value]
    })
  }

  return {
    isError,
    isPending,
    error: error?.message,
    hash: data,
    approve: handleApprove
  }
}
