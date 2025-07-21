/* eslint-disable react-refresh/only-export-components */
import { createContext, ReactNode, useState } from 'react'

export interface SettingsContextProps {
  ipfsGatewayURL: string
}

interface SettingsProviderProps {
  children: ReactNode
}
export const SettingsContext = createContext({} as SettingsContextProps)

export function SettingsProvider({ children }: SettingsProviderProps): JSX.Element {
  const [ipfsGatewayURL, setIpfsGatewayURL] = useState('https://ipfs.sintrop.com')

  return <SettingsContext.Provider value={{ ipfsGatewayURL }}>{children}</SettingsContext.Provider>
}
