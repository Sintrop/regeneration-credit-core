import { useWriteContract } from '@renderer/hooks/useSintropTransaction'
import { inspectionAbi, inspectionAddress } from '@renderer/services/contracts'

interface AcceptInspectionProps {
  inspectionId: number
}

interface ReturnUseAcceptInspectionProps {
  acceptInspection: (data: AcceptInspectionProps) => void
  isPending: boolean
  isError: boolean
  error?: string
  hash?: `0x${string}`
}

export function useAcceptInspection(): ReturnUseAcceptInspectionProps {
  const { data, isError, isPending, error, writeContract } = useWriteContract()

  function handleAccept({ inspectionId }: AcceptInspectionProps): void {
    writeContract({
      address: inspectionAddress,
      abi: inspectionAbi,
      functionName: 'acceptInspection',
      args: [inspectionId]
    })
  }

  return {
    isError,
    isPending,
    error: error?.message,
    hash: data,
    acceptInspection: handleAccept
  }
}
