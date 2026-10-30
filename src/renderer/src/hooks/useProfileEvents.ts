import { useQuery } from '@tanstack/react-query'

import { useSettingsContext } from '@renderer/hooks/useSettingsContext'
import {
  Compensation,
  getInvitedUsers,
  getSupporterCompensations,
  InvitedUser
} from '@renderer/services/profile/profileEvents'

export function useSupporterCompensations(address: string): {
  compensations: Compensation[]
  isLoading: boolean
} {
  const { rpcUrl } = useSettingsContext()
  const { data, isLoading } = useQuery({
    queryKey: ['supporterCompensations', rpcUrl, address],
    queryFn: () => getSupporterCompensations(rpcUrl, address),
    enabled: !!rpcUrl && !!address
  })
  return { compensations: data ?? [], isLoading }
}

export function useInvitedUsers(inviter: string): { invited: InvitedUser[]; isLoading: boolean } {
  const { rpcUrl } = useSettingsContext()
  const { data, isLoading } = useQuery({
    queryKey: ['invitedUsers', rpcUrl, inviter],
    queryFn: () => getInvitedUsers(rpcUrl, inviter),
    enabled: !!rpcUrl && !!inviter
  })
  return { invited: data ?? [], isLoading }
}
