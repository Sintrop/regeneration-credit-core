import { SINTROP_CHAIN_ID } from './sintropChain'

const DEFAULT_TIMEOUT_MS = 8000

export type RpcCheckError = 'invalidUrl' | 'timeout' | 'unreachable' | 'wrongChain'

export interface RpcCheckResult {
  ok: boolean
  error?: RpcCheckError
  latencyMs?: number
  blockNumber?: number
}

export function isValidRpcUrl(url: string): boolean {
  return /^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(url.trim())
}

async function rpcCall(url: string, method: string, signal: AbortSignal): Promise<string> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params: [] }),
    signal
  })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  const data = await response.json()
  if (!data?.result) throw new Error('Empty result')
  return data.result as string
}

/** Checks that the RPC answers in time and belongs to the Sintrop network. */
export async function checkRpc(
  url: string,
  timeoutMs = DEFAULT_TIMEOUT_MS
): Promise<RpcCheckResult> {
  if (!isValidRpcUrl(url)) return { ok: false, error: 'invalidUrl' }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  const started = Date.now()

  try {
    const [chainId, block] = await Promise.all([
      rpcCall(url.trim(), 'eth_chainId', controller.signal),
      rpcCall(url.trim(), 'eth_blockNumber', controller.signal)
    ])
    if (chainId.toLowerCase() !== SINTROP_CHAIN_ID) return { ok: false, error: 'wrongChain' }
    return { ok: true, latencyMs: Date.now() - started, blockNumber: parseInt(block, 16) }
  } catch {
    return { ok: false, error: controller.signal.aborted ? 'timeout' : 'unreachable' }
  } finally {
    clearTimeout(timer)
  }
}
