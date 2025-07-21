/* eslint-disable react-refresh/only-export-components */
import { createContext, ReactNode, useEffect, useState } from 'react'

interface ChangeOrAddUrlToListProps {
  type: 'ipfsApi' | 'ipfsGateway' | 'rpc' | 'sequoiaRpc'
  url: string
}

export interface SettingsContextProps {
  ipfsGatewayURL: string
  ipfsApiUrl: string
  ipfsGatewayList: string[]
  ipfsApiList: string[]
  rpcUrl: string
  sequoiaRpcUrl: string
  rpcList: string[]
  sequoiaRpcList: string[]
  addUrlToList: (data: ChangeOrAddUrlToListProps) => void
  changeBaseUrl: (data: ChangeOrAddUrlToListProps) => void
}

interface SettingsProviderProps {
  children: ReactNode
}
export const SettingsContext = createContext({} as SettingsContextProps)

export function SettingsProvider({ children }: SettingsProviderProps): JSX.Element {
  const defaultIpfsGateway = import.meta.env.VITE_DEFAULT_IPFS_GATEWAY_URL
  const defaultIpfsApi = import.meta.env.VITE_DEFAULT_IPFS_API_URL
  const defaultRpc = import.meta.env.VITE_DEFAULT_RPC_URL
  const defaultSequoiaRpc = import.meta.env.VITE_DEFAULT_SEQUOIA_RPC_URL

  const [ipfsGatewayURL, setIpfsGatewayURL] = useState<string>('https://ipfs.sintrop.com')
  const [ipfsApiUrl, setIpfsApiUrl] = useState<string>('https://apiipfs.sintrop.com')
  const [ipfsGatewayList, setIpfsGatewayList] = useState<string[]>([])
  const [ipfsApiList, setIpfsApiList] = useState<string[]>([])
  const [rpcUrl, setRpcUrl] = useState<string>('https://rpc.sintrop.com')
  const [rpcList, setRpcList] = useState<string[]>([])
  const [sequoiaRpcUrl, setSequoiaRpcUrl] = useState<string>('https://sequoiarpc.sintrop.com')
  const [sequoiaRpcList, setSequoiaRpcList] = useState<string[]>([])

  useEffect(() => {
    getListUrls()
    getSetUrls()
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

    const resSequoiaRpcList = await localStorage.getItem('sequoiaRpcList')
    if (resSequoiaRpcList) {
      setSequoiaRpcList(JSON.parse(resSequoiaRpcList))
    } else {
      setSequoiaRpcList([defaultSequoiaRpc])
    }
  }

  async function getSetUrls(): Promise<void> {
    const resIpfsApiUrl = await localStorage.getItem('ipfsApiUrl')
    setIpfsApiUrl(resIpfsApiUrl ? resIpfsApiUrl : defaultIpfsApi)

    const resIpfsGatewayUrl = await localStorage.getItem('ipfsGatewayUrl')
    setIpfsGatewayURL(resIpfsGatewayUrl ? resIpfsGatewayUrl : defaultIpfsGateway)

    const resRpcUrl = await localStorage.getItem('rpcUrl')
    setRpcUrl(resRpcUrl ? resRpcUrl : defaultRpc)

    const resSequoiaRpcUrl = await localStorage.getItem('sequoiaRpcUrl')
    setSequoiaRpcUrl(resSequoiaRpcUrl ? resSequoiaRpcUrl : defaultSequoiaRpc)
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

    if (type === 'sequoiaRpc') {
      const newSequoiaRpcList = sequoiaRpcList
      newSequoiaRpcList.push(url)
      setSequoiaRpcList(newSequoiaRpcList)
      localStorage.setItem('sequoiaRpcList', JSON.stringify(newSequoiaRpcList))
    }

    changeBaseUrl({ type, url })
  }

  function changeBaseUrl({ type, url }: ChangeOrAddUrlToListProps): void {
    if (type === 'ipfsApi') setIpfsApiUrl(url)
    if (type === 'ipfsGateway') setIpfsGatewayURL(url)
    if (type === 'rpc') setRpcUrl(url)
    if (type === 'sequoiaRpc') setSequoiaRpcUrl(url)
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
        sequoiaRpcList,
        sequoiaRpcUrl,
        addUrlToList,
        changeBaseUrl
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}
