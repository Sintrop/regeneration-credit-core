import { defineChain } from 'viem'

export const sequoia = /*#__PURE__*/ defineChain({
  id: 1600,
  name: 'Sequoia Test Network',
  nativeCurrency: {
    decimals: 18,
    name: 'SINTR',
    symbol: 'SINTR'
  },
  rpcUrls: {
    default: {
      http: ['https://sequoiarpc.sintrop.com']
    }
  },
  blockExplorers: {
    default: {
      name: 'Sequoia Explorer',
      url: 'https://sequoia.sintrop.com'
    }
  },
  testnet: true
})
