import { useQuery } from '@tanstack/react-query'

import { useSettingsContext } from '@renderer/hooks/useSettingsContext'
import {
  fetchInvalidations,
  InvalidationsOverview
} from '@renderer/services/invalidations/invalidationsService'

export function useInvalidations(): {
  overview: InvalidationsOverview | undefined
  isLoading: boolean
  isError: boolean
} {
  const { rpcUrl } = useSettingsContext()
  const { data, isLoading, isError } = useQuery({
    queryKey: ['invalidations', rpcUrl],
    queryFn: () => fetchInvalidations(rpcUrl),
    enabled: !!rpcUrl
  })
  return { overview: data, isLoading, isError }
}
