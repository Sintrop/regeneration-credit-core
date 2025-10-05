import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { http, WagmiProvider, createConfig } from 'wagmi'
import { metaMask } from 'wagmi/connectors'
import { sequoia } from '../chains/sequoia'
import { sintrop } from '../chains/sintrop'

const client = new QueryClient()

export function MetamaskProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const config = createConfig({
    ssr: false,
    chains: [sintrop, sequoia],
    connectors: [metaMask()],
    transports: {
      [sintrop.id]: http(),
      [sequoia.id]: http()
    }
  })

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
