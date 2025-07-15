import { useContext } from 'react'
import { UserContext, UserContextProps } from '@renderer/contexts/UserContext'

export function useUserContext(): UserContextProps {
  const context = useContext(UserContext)
  return context
}
