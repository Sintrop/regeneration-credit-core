import React, { useEffect, useRef } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { custom, http, WagmiProvider, createConfig } from 'wagmi'
import { metaMask } from 'wagmi/connectors'
import { sintrop } from '../chains/sintrop'
import { SINTROP_CHAIN_PARAMS } from '../renderer/src/services/sintropChain'
import { useSettingsContext } from '../renderer/src/hooks/useSettingsContext'

const client = new QueryClient()

/** RPC chosen in Settings; every wagmi read goes through it. */
let readRpcUrl: string = sintrop.rpcUrls.default.http[0]
const httpTransports = new Map<string, ReturnType<ReturnType<typeof http>>>()

function readTransport(): ReturnType<ReturnType<typeof http>> {
  let transport = httpTransports.get(readRpcUrl)
  if (!transport) {
    transport = http(readRpcUrl)({ chain: sintrop })
    httpTransports.set(readRpcUrl, transport)
  }
  return transport
}

// Created once: building the config on every render would recreate the connector and drop the session.
const config = createConfig({
  ssr: false,
  chains: [sintrop],
  // Connect and add/select Sintrop in a single trip to the wallet.
  connectors: [
    metaMask({
      dappMetadata: { name: 'Regeneration Credit', url: 'https://regenerationcredit.org' },
      connectWith: { method: 'wallet_addEthereumChain', params: [SINTROP_CHAIN_PARAMS] }
    })
  ],
  transports: {
    [sintrop.id]: custom({ request: (args) => readTransport().request(args) })
  }
})

export function MetamaskProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const { rpcUrl } = useSettingsContext()
  const previousRpc = useRef(rpcUrl)
  if (rpcUrl) readRpcUrl = rpcUrl

  useEffect(() => {
    if (previousRpc.current === rpcUrl) return
    previousRpc.current = rpcUrl
    // Data read from the previous RPC may be stale or missing: read everything again.
    client.invalidateQueries()
  }, [rpcUrl])

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
