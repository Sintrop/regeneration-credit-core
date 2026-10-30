import { useQuery } from '@tanstack/react-query'

import { useSettingsContext } from '@renderer/hooks/useSettingsContext'
import {
  getPublishedResources,
  getVotingContext,
  PublishedResource,
  PublishedResourceType
} from '@renderer/services/resources/resourcesService'

export function usePublishedResources(): {
  resources: PublishedResource[]
  isLoading: boolean
  isError: boolean
  refetch: () => void
} {
  const { rpcUrl } = useSettingsContext()
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['publishedResources', rpcUrl],
    queryFn: () => getPublishedResources(rpcUrl),
    enabled: !!rpcUrl
  })
  return { resources: data ?? [], isLoading, isError, refetch }
}

export function useVotingContext():
  | { votesNeeded: number; currentEra: Record<PublishedResourceType, number> }
  | undefined {
  const { rpcUrl } = useSettingsContext()
  const { data } = useQuery({
    queryKey: ['votingContext', rpcUrl],
    queryFn: () => getVotingContext(rpcUrl),
    enabled: !!rpcUrl
  })
  return data
}
