import { useQuery } from '@tanstack/react-query'

import { useSettingsContext } from '@renderer/hooks/useSettingsContext'
import {
  getAllInspections,
  InspectionSummary
} from '@renderer/services/inspections/inspectionsService'

export function useInspectionsList(): {
  inspections: InspectionSummary[]
  isLoading: boolean
  isError: boolean
  refetch: () => void
} {
  const { rpcUrl } = useSettingsContext()
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['inspectionsList', rpcUrl],
    queryFn: () => getAllInspections(rpcUrl),
    enabled: !!rpcUrl,
    refetchInterval: 60_000
  })
  return { inspections: data ?? [], isLoading, isError, refetch }
}
