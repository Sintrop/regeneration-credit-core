import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { http, WagmiProvider, createConfig } from 'wagmi'
import { metaMask } from 'wagmi/connectors'
import { sintrop } from '../chains/sintrop'
import { SINTROP_CHAIN_PARAMS } from '../renderer/src/services/sintropChain'

const client = new QueryClient()

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
    [sintrop.id]: http()
  }
})

export function MetamaskProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
