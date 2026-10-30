import { describe, expect, it, vi } from 'vitest'
import {
  SINTROP_CHAIN_PARAMS,
  isSintropChain,
  sendTransactionOnSintrop,
  switchToSintrop
} from '@renderer/services/sintropChain'

type Handler = (params?: unknown[]) => unknown

function createWallet(handlers: Record<string, Handler>): {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
} {
  const request = vi.fn(async ({ method, params }: { method: string; params?: unknown[] }) => {
    const handler = handlers[method]
    if (!handler) throw new Error(`unexpected ${method}`)
    return handler(params)
  })
  return { request }
}

function rpcError(code: number): Error & { code: number } {
  return Object.assign(new Error(`rpc error ${code}`), { code })
}

describe('isSintropChain', () => {
  it('matches the Sintrop chain id in any case', () => {
    expect(isSintropChain('0x3D171')).toBe(true)
    expect(isSintropChain('0x3d171')).toBe(true)
    expect(isSintropChain('0x1')).toBe(false)
    expect(isSintropChain(undefined)).toBe(false)
  })
})

describe('switchToSintrop', () => {
  it('switches when the wallet already knows the network', async () => {
    const wallet = createWallet({ wallet_switchEthereumChain: () => null })
    await expect(switchToSintrop(wallet)).resolves.toBe(true)
    expect(wallet.request).toHaveBeenCalledTimes(1)
  })

  it('adds the network when the wallet does not know it (4902)', async () => {
    const wallet = createWallet({
      wallet_switchEthereumChain: () => {
        throw rpcError(4902)
      },
      wallet_addEthereumChain: () => null
    })
    await expect(switchToSintrop(wallet)).resolves.toBe(true)
    expect(wallet.request).toHaveBeenLastCalledWith({
      method: 'wallet_addEthereumChain',
      params: [SINTROP_CHAIN_PARAMS]
    })
  })

  it('does not add the network when the user rejects the switch', async () => {
    const wallet = createWallet({
      wallet_switchEthereumChain: () => {
        throw rpcError(4001)
      },
      wallet_addEthereumChain: () => null
    })
    await expect(switchToSintrop(wallet)).resolves.toBe(false)
    expect(wallet.request).toHaveBeenCalledTimes(1)
  })
})

describe('sendTransactionOnSintrop', () => {
  const tx = { from: '0xabc', to: '0xdef', data: '0x' }

  it('sends directly when the wallet is already on Sintrop', async () => {
    const wallet = createWallet({
      eth_chainId: () => '0x3d171',
      eth_sendTransaction: () => '0xhash'
    })
    await expect(sendTransactionOnSintrop(wallet, tx)).resolves.toBe('0xhash')
    expect(wallet.request).toHaveBeenCalledTimes(2)
  })

  it('switches network and sends in one batch when on another network', async () => {
    const wallet = createWallet({
      eth_chainId: () => '0x1',
      metamask_batch: (params) => {
        const [network, send] = params as { method: string }[]
        expect(network.method).toBe('wallet_switchEthereumChain')
        expect(send.method).toBe('eth_sendTransaction')
        return [null, '0xhash']
      }
    })
    await expect(sendTransactionOnSintrop(wallet, tx)).resolves.toBe('0xhash')
  })

  it('adds the network in the batch when the wallet does not know it', async () => {
    const wallet = createWallet({
      eth_chainId: () => '0x1',
      metamask_batch: (params) => {
        const [network] = params as { method: string }[]
        if (network.method === 'wallet_switchEthereumChain') throw rpcError(4902)
        return [null, '0xhash']
      }
    })
    await expect(sendTransactionOnSintrop(wallet, tx)).resolves.toBe('0xhash')
  })

  it('falls back to switch then send when the wallet has no batch support', async () => {
    const wallet = createWallet({
      eth_chainId: () => '0x1',
      metamask_batch: () => {
        throw rpcError(-32601)
      },
      wallet_switchEthereumChain: () => null,
      eth_sendTransaction: () => '0xhash'
    })
    await expect(sendTransactionOnSintrop(wallet, tx)).resolves.toBe('0xhash')
  })

  it('propagates a user rejection without retrying', async () => {
    const wallet = createWallet({
      eth_chainId: () => '0x1',
      metamask_batch: () => {
        throw rpcError(4001)
      }
    })
    await expect(sendTransactionOnSintrop(wallet, tx)).rejects.toMatchObject({ code: 4001 })
  })
})
