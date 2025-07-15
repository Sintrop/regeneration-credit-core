import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { http, WagmiProvider, createConfig } from 'wagmi'
import { metaMask } from 'wagmi/connectors'
import { sequoia } from '../chains/sequoia'
import { sintrop } from '../chains/sintrop'

const config = createConfig({
  ssr: false, // Make sure to enable this for server-side rendering (SSR) applications.
  chains: [sequoia, sintrop],
  connectors: [metaMask()],
  transports: {
    [sequoia.id]: http(),
    [sintrop.id]: http()
  }
})

const client = new QueryClient()

export function MetamaskProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
