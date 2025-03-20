import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { http, WagmiProvider, createConfig } from 'wagmi'
import { mainnet, linea, lineaSepolia } from 'wagmi/chains'
import { metaMask } from 'wagmi/connectors'

const config = createConfig({
  ssr: false, // Make sure to enable this for server-side rendering (SSR) applications.
  chains: [mainnet, linea, lineaSepolia],
  connectors: [metaMask()],
  transports: {
    [mainnet.id]: http(),
    [linea.id]: http(),
    [lineaSepolia.id]: http()
  }
})

const client = new QueryClient()

export function MetamaskProvider({children}: {children: React.ReactNode}): React.JSX.Element {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
