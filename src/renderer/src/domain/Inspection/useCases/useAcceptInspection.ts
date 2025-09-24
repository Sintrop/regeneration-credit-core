import { useMainnet } from '@renderer/hooks/useMainnet'
import {
  inspectionAbi,
  inspectionAddress,
  sequoiaInspectionAbi,
  sequoiaInspectionAddress
} from '@renderer/services/contracts'
import { useWriteContract } from 'wagmi'

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
  const mainnet = useMainnet()
  const { data, isError, isPending, error, writeContract } = useWriteContract()

  function handleAccept({ inspectionId }: AcceptInspectionProps): void {
    writeContract({
      address: mainnet ? inspectionAddress : sequoiaInspectionAddress,
      abi: mainnet ? inspectionAbi : sequoiaInspectionAbi,
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
