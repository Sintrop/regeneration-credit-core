import { useWriteContract } from '@renderer/hooks/useSintropTransaction'
import { rcAbi, rcAddress, supporterAddress } from '@renderer/services/contracts'

interface ReturnUseApproveProps {
  approve: (amountWei: bigint) => void
  isPending: boolean
  isError: boolean
  error?: string
  hash?: `0x${string}`
}

export function useApprove(): ReturnUseApproveProps {
  const { data, isError, isPending, error, writeContract } = useWriteContract()

  function handleApprove(amountWei: bigint): void {
    writeContract({
      address: rcAddress,
      abi: rcAbi,
      functionName: 'approve',
      args: [supporterAddress, amountWei]
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
