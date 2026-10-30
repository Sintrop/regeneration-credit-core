import { useQuery, useQueryClient } from '@tanstack/react-query'

import { useSettingsContext } from '@renderer/hooks/useSettingsContext'
import { checkRpc, RpcCheckResult } from '@renderer/services/rpcHealth'

/** Health of the configured RPC, checked every 30 s. */
export function useRpcHealth(): {
  health: RpcCheckResult | undefined
  unstable: boolean
  recheck: () => void
} {
  const queryClient = useQueryClient()
  const { rpcUrl } = useSettingsContext()
  const { data, refetch } = useQuery({
    queryKey: ['rpcHealth', rpcUrl],
    queryFn: () => checkRpc(rpcUrl),
    enabled: !!rpcUrl,
    refetchInterval: 30_000,
    retry: false
  })

  function recheck(): void {
    refetch()
    queryClient.invalidateQueries()
  }

  return { health: data, unstable: !!data && !data.ok, recheck }
}
