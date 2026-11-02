import { defineChain } from 'viem'

export const sintrop = /*#__PURE__*/ defineChain({
  id: 250225,
  name: 'Sintrop Network',
  nativeCurrency: {
    decimals: 18,
    name: 'SINTROP',
    // MetaMask caps native symbols at 6 characters; the app labels the unit SINTROP.
    symbol: 'SIN'
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
