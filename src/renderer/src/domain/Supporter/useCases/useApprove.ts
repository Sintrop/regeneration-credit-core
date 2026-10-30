import { rcAbi, rcAddress, supporterAddress } from '@renderer/services/contracts'
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
  const { data, isError, isPending, error, writeContract } = useWriteContract()

  function handleApprove(ammount: string): void {
    const value = parseEther(ammount)

    writeContract({
      address: rcAddress,
      abi: rcAbi,
      functionName: 'approve',
      args: [supporterAddress, value]
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
