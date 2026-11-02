import { useQuery } from '@tanstack/react-query'

import { useSettingsContext } from '@renderer/hooks/useSettingsContext'
import { useUserContext } from '@renderer/hooks/useUserContext'
import { getTimerInputs } from '@renderer/services/timers/timersService'
import { buildUserTimers, UserTimer } from '@renderer/services/timers/userTimers'

/** Time-gated actions of the connected user, read from the contracts and refreshed every minute. */
export function useUserTimers(): {
  timers: UserTimer[]
  lastPublishedAt: number
  isLoading: boolean
  refetch: () => void
} {
  const { rpcUrl } = useSettingsContext()
  const { address, userType } = useUserContext()

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['userTimers', rpcUrl, address, userType],
    queryFn: async () => {
      const input = await getTimerInputs(rpcUrl, address as string, userType)
      return {
        timers: buildUserTimers(input),
        lastPublishedAt: input.publisher?.lastPublishedAt ?? 0
      }
    },
    enabled: !!rpcUrl && !!address && userType > 0 && userType !== 8,
    refetchInterval: 60_000
  })

  return {
    timers: data?.timers ?? [],
    lastPublishedAt: data?.lastPublishedAt ?? 0,
    isLoading,
    refetch
  }
}
