import { useQuery } from '@tanstack/react-query'

import { useSettingsContext } from '@renderer/hooks/useSettingsContext'
import { ErasOverview, getErasOverview } from '@renderer/services/eras/erasService'

export function useErasOverview(): { overview: ErasOverview | undefined; isLoading: boolean } {
  const { rpcUrl } = useSettingsContext()
  const { data, isLoading } = useQuery({
    queryKey: ['erasOverview', rpcUrl],
    queryFn: () => getErasOverview(rpcUrl),
    enabled: !!rpcUrl,
    staleTime: 5 * 60 * 1000
  })
  return { overview: data, isLoading }
}
