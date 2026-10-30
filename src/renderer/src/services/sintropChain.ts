export const SINTROP_CHAIN_ID = '0x3d171'

/** Native symbol stays SIN: MetaMask rejects native currency symbols longer than 6 characters. */
export const SINTROP_CHAIN_PARAMS = {
  chainId: SINTROP_CHAIN_ID,
  chainName: 'Sintrop',
  nativeCurrency: { name: 'SINTROP', symbol: 'SIN', decimals: 18 },
  rpcUrls: ['https://rpc.sintrop.com'],
  blockExplorerUrls: ['https://explorer.sintrop.com']
}

const UNRECOGNIZED_CHAIN_ERROR = 4902
const USER_REJECTED_ERROR = 4001
const METHOD_NOT_FOUND_ERRORS = [-32601, 4200]

export interface EthereumRequester {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
}

export function isSintropChain(chainId?: string | null): boolean {
  if (!chainId) return false
  return chainId.toLowerCase() === SINTROP_CHAIN_ID
}

function errorCode(error: unknown): number | undefined {
  const err = error as { code?: number; data?: { originalError?: { code?: number } } }
  return err?.code ?? err?.data?.originalError?.code
}

export function isUserRejection(error: unknown): boolean {
  return errorCode(error) === USER_REJECTED_ERROR
}

/** Switches the wallet to Sintrop, adding the network first when the wallet does not know it. */
export async function switchToSintrop(ethereum: EthereumRequester): Promise<boolean> {
  try {
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: SINTROP_CHAIN_ID }]
    })
    return true
  } catch (error) {
    if (errorCode(error) !== UNRECOGNIZED_CHAIN_ERROR) return false
  }

  try {
    await ethereum.request({ method: 'wallet_addEthereumChain', params: [SINTROP_CHAIN_PARAMS] })
    return true
  } catch {
    return false
  }
}

/**
 * Sends a transaction on Sintrop with a single trip to the wallet.
 * When the wallet is on another network, the network switch (or add) and the
 * transaction go together in one metamask_batch request instead of two prompts.
 * Wallets without metamask_batch fall back to switching first, then sending.
 * Resolves with the transaction hash.
 */
export async function sendTransactionOnSintrop(
  ethereum: EthereumRequester,
  txParams: Record<string, string>
): Promise<string> {
  const send = { method: 'eth_sendTransaction', params: [txParams] }

  let chainId: unknown
  try {
    chainId = await ethereum.request({ method: 'eth_chainId' })
  } catch {
    chainId = undefined
  }
  if (isSintropChain(chainId as string)) {
    return (await ethereum.request(send)) as string
  }

  const batch = (networkRequest: { method: string; params: unknown[] }): Promise<unknown[]> =>
    ethereum.request({ method: 'metamask_batch', params: [networkRequest, send] }) as Promise<
      unknown[]
    >

  try {
    let results: unknown[]
    try {
      results = await batch({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: SINTROP_CHAIN_ID }]
      })
    } catch (error) {
      if (errorCode(error) !== UNRECOGNIZED_CHAIN_ERROR) throw error
      results = await batch({ method: 'wallet_addEthereumChain', params: [SINTROP_CHAIN_PARAMS] })
    }
    return results[results.length - 1] as string
  } catch (error) {
    if (!METHOD_NOT_FOUND_ERRORS.includes(errorCode(error) ?? 0)) throw error
  }

  if (!(await switchToSintrop(ethereum))) {
    throw new Error('Wallet is not connected to the Sintrop network')
  }
  return (await ethereum.request(send)) as string
}
