/* eslint-disable react-refresh/only-export-components */
import { createContext, ReactNode, useEffect, useState } from 'react'
import i18n from '../../../i18n'

interface ChangeOrAddUrlToListProps {
  type: 'ipfsApi' | 'ipfsGateway' | 'rpc'
  url: string
}

export interface SettingsContextProps {
  ipfsGatewayURL: string
  ipfsApiUrl: string
  ipfsGatewayList: string[]
  ipfsApiList: string[]
  rpcUrl: string
  rpcList: string[]
  addUrlToList: (data: ChangeOrAddUrlToListProps) => void
  changeBaseUrl: (data: ChangeOrAddUrlToListProps) => void
  handleChangeLanguage: (lang: string) => void
}

interface SettingsProviderProps {
  children: ReactNode
}
export const SettingsContext = createContext({} as SettingsContextProps)

export function SettingsProvider({ children }: SettingsProviderProps): JSX.Element {
  const { changeLanguage, language } = i18n
  const defaultIpfsGateway = import.meta.env.VITE_DEFAULT_IPFS_GATEWAY_URL
  const defaultIpfsApi = import.meta.env.VITE_DEFAULT_IPFS_API_URL
  const defaultRpc = import.meta.env.VITE_DEFAULT_RPC_URL

  const [ipfsGatewayURL, setIpfsGatewayURL] = useState<string>('https://ipfs.sintrop.com')
  const [ipfsApiUrl, setIpfsApiUrl] = useState<string>('https://apiipfs.sintrop.com')
  const [ipfsGatewayList, setIpfsGatewayList] = useState<string[]>([])
  const [ipfsApiList, setIpfsApiList] = useState<string[]>([])
  const [rpcUrl, setRpcUrl] = useState<string>('https://rpc.sintrop.com')
  const [rpcList, setRpcList] = useState<string[]>([])

  useEffect(() => {
    getListUrls()
    getSetUrls()
    getSavedLanguage()
  }, [])

  async function getListUrls(): Promise<void> {
    const resIpfsGatewayList = await localStorage.getItem('ipfsGatewayList')
    if (resIpfsGatewayList) {
      setIpfsGatewayList(JSON.parse(resIpfsGatewayList))
    } else {
      setIpfsGatewayList([defaultIpfsGateway])
    }

    const resIpfsApiList = await localStorage.getItem('ipfsApiList')
    if (resIpfsApiList) {
      setIpfsApiList(JSON.parse(resIpfsApiList))
    } else {
      setIpfsApiList([defaultIpfsApi])
    }

    const resRpcList = await localStorage.getItem('rpcList')
    if (resRpcList) {
      setRpcList(JSON.parse(resRpcList))
    } else {
      setRpcList([defaultRpc])
    }
  }

  async function getSetUrls(): Promise<void> {
    const resIpfsApiUrl = await localStorage.getItem('ipfsApiUrl')
    setIpfsApiUrl(resIpfsApiUrl ? resIpfsApiUrl : defaultIpfsApi)

    const resIpfsGatewayUrl = await localStorage.getItem('ipfsGatewayUrl')
    setIpfsGatewayURL(resIpfsGatewayUrl ? resIpfsGatewayUrl : defaultIpfsGateway)

    const resRpcUrl = await localStorage.getItem('rpcUrl')
    setRpcUrl(resRpcUrl ? resRpcUrl : defaultRpc)
  }

  function addUrlToList({ type, url }: ChangeOrAddUrlToListProps): void {
    if (type === 'ipfsApi') {
      const newApiList = ipfsApiList
      newApiList.push(url)
      setIpfsApiList(newApiList)
      localStorage.setItem('ipfsApiList', JSON.stringify(newApiList))
    }

    if (type === 'ipfsGateway') {
      const newGatewayList = ipfsGatewayList
      newGatewayList.push(url)
      setIpfsGatewayList(newGatewayList)
      localStorage.setItem('ipfsGatewayList', JSON.stringify(newGatewayList))
    }

    if (type === 'rpc') {
      const newRpcList = rpcList
      newRpcList.push(url)
      setRpcList(newRpcList)
      localStorage.setItem('rpcList', JSON.stringify(newRpcList))
    }

    changeBaseUrl({ type, url })
  }

  function changeBaseUrl({ type, url }: ChangeOrAddUrlToListProps): void {
    if (type === 'ipfsApi') setIpfsApiUrl(url)
    if (type === 'ipfsGateway') setIpfsGatewayURL(url)
    if (type === 'rpc') setRpcUrl(url)
  }

  async function getSavedLanguage(): Promise<void> {
    const response = await localStorage.getItem('language')
    if (response) {
      if (language !== response) changeLanguage(response)
    }
  }

  function handleChangeLanguage(lang: string): void {
    changeLanguage(lang)
    localStorage.setItem('language', lang)
  }

  return (
    <SettingsContext.Provider
      value={{
        ipfsGatewayURL,
        ipfsApiList,
        ipfsApiUrl,
        ipfsGatewayList,
        rpcList,
        rpcUrl,
        addUrlToList,
        changeBaseUrl,
        handleChangeLanguage
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}
