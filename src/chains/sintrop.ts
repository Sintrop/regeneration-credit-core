import { defineChain } from 'viem'

export const sintrop = /*#__PURE__*/ defineChain({
  id: 250225,
  name: 'Sintrop Network',
  nativeCurrency: {
    decimals: 18,
    name: 'SINTROP',
    symbol: 'SINTROP'
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.sintrop.com']
    }
  },
  blockExplorers: {
    default: {
      name: 'Sintrop Explorer',
      url: 'https://explorer.sintrop.com'
    }
  },
  testnet: false
})
