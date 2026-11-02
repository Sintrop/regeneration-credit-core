/* eslint-disable react-refresh/only-export-components */
import { userAbi, userAddress } from '@renderer/services/contracts'
import { PROFILE_READ, toUserProfile, UserProfile } from '@renderer/services/userProfile'
import { createContext, ReactNode, useEffect, useState } from 'react'
import { useAccount, useReadContract } from 'wagmi'

interface UserContextProviderProps {
  children: ReactNode
}
export interface UserContextProps {
  userType: number
  /** False until getUser answers: a failed read must not look like an unregistered user. */
  isUserTypeKnown: boolean
  isConnected: boolean
  address: `0x${string}` | undefined
  /** The user's current era in their pool, read from their own record. */
  eraPool: number
  profile: UserProfile | undefined
  refetchUserType: () => void
  refetchProfile: () => void
}

export const UserContext = createContext({} as UserContextProps)

export function UserContextProvider({ children }: UserContextProviderProps): JSX.Element {
  const { address, isConnected } = useAccount()
  const [userType, setUserType] = useState<number>(0)

  const {
    data: responseUserType,
    isSuccess: isUserTypeKnown,
    refetch: refetchUserType
  } = useReadContract({
    address: userAddress,
    abi: userAbi,
    functionName: 'getUser',
    args: [address]
  })

  useEffect(() => {
    setUserType(address && responseUserType ? Number(responseUserType) : 0)
  }, [address, responseUserType])

  const profileRead = PROFILE_READ[userType]
  const { data: responseProfile, refetch: refetchProfile } = useReadContract({
    address: profileRead?.address,
    abi: profileRead?.abi,
    functionName: profileRead?.functionName,
    args: [address],
    query: { enabled: !!address && !!profileRead }
  })
  const profile = profileRead ? toUserProfile(userType, responseProfile) : undefined
  const eraPool = profile?.poolEra || 1

  return (
    <UserContext.Provider
      value={{
        userType,
        isUserTypeKnown,
        isConnected,
        address,
        eraPool,
        profile,
        refetchUserType,
        refetchProfile
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
