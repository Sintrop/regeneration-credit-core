/* eslint-disable react-refresh/only-export-components */
import {
  sequoiaUserAbi,
  sequoiaUserAddress,
  userAbi,
  userAddress
} from '@renderer/services/contracts'
import { createContext, ReactNode, useEffect, useState } from 'react'
import { useAccount, useChainId, useReadContract } from 'wagmi'

interface UserContextProviderProps {
  children: ReactNode
}
export interface UserContextProps {
  userType: number
  isConnected: boolean
  address: `0x${string}` | undefined
  eraPool: number
  setEraPool: (era: number) => void
}

export const UserContext = createContext({} as UserContextProps)

export function UserContextProvider({ children }: UserContextProviderProps): JSX.Element {
  const chainId = useChainId()
  const { address, isConnected } = useAccount()
  const [userType, setUserType] = useState<number>(0)
  const [eraPool, setEraPool] = useState<number>(1)

  const { data: responseUserType } = useReadContract({
    address: chainId === 250225 ? userAddress : sequoiaUserAddress,
    abi: chainId === 250225 ? userAbi : sequoiaUserAbi,
    functionName: 'getUser',
    args: [address]
  })

  useEffect(() => {
    if (responseUserType) {
      setUserType(responseUserType as number)
    }
  }, [responseUserType])

  return (
    <UserContext.Provider value={{ userType, isConnected, address, eraPool, setEraPool }}>
      {children}
    </UserContext.Provider>
  )
}
