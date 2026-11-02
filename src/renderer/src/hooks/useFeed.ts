import { useQuery } from '@tanstack/react-query'

import { useSettingsContext } from '@renderer/hooks/useSettingsContext'
import { fetchFeed } from '@renderer/services/feed/feedService'
import { FeedEvent } from '@renderer/services/feed/feedTypes'

export function useFeed(): {
  events: FeedEvent[]
  isLoading: boolean
  isError: boolean
  refetch: () => void
} {
  const { rpcUrl } = useSettingsContext()
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['feed', rpcUrl],
    queryFn: () => fetchFeed(rpcUrl),
    enabled: !!rpcUrl,
    refetchInterval: 60_000
  })
  return { events: data ?? [], isLoading, isError, refetch }
}
