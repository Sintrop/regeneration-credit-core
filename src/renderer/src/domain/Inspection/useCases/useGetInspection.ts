import { inspectionAbi, inspectionAddress } from '@renderer/services/contracts'
import { InspectionContractProps, InspectionProps } from '@renderer/types/inspection'
import { useReadContract } from 'wagmi'
import { inspectionAdapter } from '../inspectionAdapter'

interface Props {
  inspectionId: number
}

interface ReturnUseGetInspection {
  isLoading: boolean
  inspection: InspectionProps
  isError: boolean
  refetch: () => void
}

export function useGetInspection({ inspectionId }: Props): ReturnUseGetInspection {
  const { data, isLoading, isError, refetch } = useReadContract({
    address: inspectionAddress,
    abi: inspectionAbi,
    functionName: 'getInspection',
    args: [inspectionId]
  })

  const inspection = data
    ? inspectionAdapter.parseInspection(data as InspectionContractProps)
    : ({} as InspectionProps)

  return {
    isLoading,
    isError,
    refetch,
    inspection
  }
}
