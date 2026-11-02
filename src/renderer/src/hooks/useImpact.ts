import { useQuery } from '@tanstack/react-query'

import { useSettingsContext } from '@renderer/hooks/useSettingsContext'
import {
  EraImpact,
  getImpactEras,
  getImpactOverview,
  ImpactOverview
} from '@renderer/services/impact/impactService'

export function useImpactOverview(): { overview: ImpactOverview | undefined; isLoading: boolean } {
  const { rpcUrl } = useSettingsContext()
  const { data, isLoading } = useQuery({
    queryKey: ['impactOverview', rpcUrl],
    queryFn: () => getImpactOverview(rpcUrl),
    enabled: !!rpcUrl
  })
  return { overview: data, isLoading }
}

export function useImpactEras(currentEra: number): { eras: EraImpact[]; isLoading: boolean } {
  const { rpcUrl } = useSettingsContext()
  const { data, isLoading } = useQuery({
    queryKey: ['impactEras', rpcUrl, currentEra],
    queryFn: () => getImpactEras(rpcUrl, currentEra),
    enabled: !!rpcUrl && currentEra > 0
  })
  return { eras: data ?? [], isLoading: currentEra > 0 && isLoading }
}
