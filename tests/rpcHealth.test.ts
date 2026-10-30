import { afterEach, describe, expect, it, vi } from 'vitest'

import { checkRpc, isValidRpcUrl } from '@renderer/services/rpcHealth'

function mockRpc(responses: Record<string, unknown>): void {
  vi.stubGlobal(
    'fetch',
    vi.fn(async (_url: string, init: RequestInit): Promise<unknown> => {
      const { method } = JSON.parse(init.body as string)
      return { ok: true, json: async () => ({ result: responses[method] }) }
    })
  )
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('isValidRpcUrl', () => {
  it('accepts http(s) URLs only', () => {
    expect(isValidRpcUrl('https://rpc.sintrop.com')).toBe(true)
    expect(isValidRpcUrl('http://10.0.0.2:8545')).toBe(true)
    expect(isValidRpcUrl('rpc.sintrop.com')).toBe(false)
    expect(isValidRpcUrl('')).toBe(false)
  })
})

describe('checkRpc', () => {
  it('accepts a Sintrop RPC and reports the block', async () => {
    mockRpc({ eth_chainId: '0x3d171', eth_blockNumber: '0x10' })
    await expect(checkRpc('https://rpc.sintrop.com')).resolves.toMatchObject({
      ok: true,
      blockNumber: 16
    })
  })

  it('rejects an RPC of another network', async () => {
    mockRpc({ eth_chainId: '0x1', eth_blockNumber: '0x10' })
    await expect(checkRpc('https://eth.example')).resolves.toEqual({
      ok: false,
      error: 'wrongChain'
    })
  })

  it('reports unreachable RPCs', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('network')
      })
    )
    await expect(checkRpc('https://down.example')).resolves.toEqual({
      ok: false,
      error: 'unreachable'
    })
  })

  it('reports a timeout', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(
        (_url: string, init: RequestInit) =>
          new Promise((_, reject) => {
            init.signal?.addEventListener('abort', () => reject(new Error('aborted')))
          })
      )
    )
    await expect(checkRpc('https://slow.example', 20)).resolves.toEqual({
      ok: false,
      error: 'timeout'
    })
  })

  it('rejects invalid URLs without calling the network', async () => {
    const fetch = vi.fn()
    vi.stubGlobal('fetch', fetch)
    await expect(checkRpc('not a url')).resolves.toEqual({ ok: false, error: 'invalidUrl' })
    expect(fetch).not.toHaveBeenCalled()
  })
})
