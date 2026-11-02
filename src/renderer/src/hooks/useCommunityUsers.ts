import { useQuery } from '@tanstack/react-query'

import { useSettingsContext } from '@renderer/hooks/useSettingsContext'
import { CommunityUser, getUsersOfType } from '@renderer/services/community/usersService'

export function useCommunityUsers(userType: number): {
  users: CommunityUser[]
  isLoading: boolean
  isError: boolean
  refetch: () => void
} {
  const { rpcUrl } = useSettingsContext()
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['communityUsers', rpcUrl, userType],
    queryFn: () => getUsersOfType(rpcUrl, userType),
    enabled: !!rpcUrl && userType >= 1 && userType <= 7
  })
  return { users: data ?? [], isLoading, isError, refetch }
}
