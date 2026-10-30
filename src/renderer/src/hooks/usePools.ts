import { useQuery } from '@tanstack/react-query'

import { useSettingsContext } from '@renderer/hooks/useSettingsContext'
import {
  getPoolEraDetails,
  getPoolOverview,
  getPoolUserPosition,
  PoolEraDetails,
  PoolOverview,
  PoolUserPosition
} from '@renderer/services/pools/poolService'

export function usePoolOverview(poolType: number): {
  overview: PoolOverview | undefined
  isLoading: boolean
  refetch: () => void
} {
  const { rpcUrl } = useSettingsContext()
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['poolOverview', rpcUrl, poolType],
    queryFn: () => getPoolOverview(rpcUrl, poolType),
    enabled: !!rpcUrl
  })
  return { overview: data, isLoading, refetch }
}

export function usePoolEraDetails(
  poolType: number,
  era: number,
  currentEra?: number
): { details: PoolEraDetails | undefined; isLoading: boolean } {
  const { rpcUrl } = useSettingsContext()
  const { data, isLoading } = useQuery({
    queryKey: ['poolEra', rpcUrl, poolType, era, currentEra],
    queryFn: () => getPoolEraDetails(rpcUrl, poolType, era, currentEra as number),
    enabled: !!rpcUrl && !!currentEra && era > 0
  })
  return { details: data, isLoading }
}

export function usePoolUserPosition(
  poolType: number,
  address: string | undefined,
  currentEra?: number
): { position: PoolUserPosition | undefined; isLoading: boolean; refetch: () => void } {
  const { rpcUrl } = useSettingsContext()
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['poolPosition', rpcUrl, poolType, address, currentEra],
    queryFn: () => getPoolUserPosition(rpcUrl, poolType, address as string, currentEra as number),
    enabled: !!rpcUrl && !!address && !!currentEra
  })
  return { position: data, isLoading: !!address && isLoading, refetch }
}
