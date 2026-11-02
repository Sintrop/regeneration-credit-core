import { useState } from 'react'
import { Abi, encodeFunctionData, toHex } from 'viem'
import { useAccount } from 'wagmi'

import { EthereumRequester, sendTransactionOnSintrop } from '@renderer/services/sintropChain'

type Hex = `0x${string}`

interface TxRequest {
  to: Hex
  data?: Hex
  value?: bigint
}

/** Sends any transaction through the connected wallet, already on Sintrop, in one wallet prompt. */
function useSintropTransaction(): {
  send: (tx: TxRequest) => void
  hash: Hex | undefined
  isPending: boolean
  error: Error | null
} {
  const { connector, address } = useAccount()
  const [hash, setHash] = useState<Hex>()
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  function send(tx: TxRequest): void {
    setHash(undefined)
    setError(null)
    setIsPending(true)
    ;(async (): Promise<void> => {
      try {
        if (!connector || !address) throw new Error('Wallet not connected')
        const provider = (await connector.getProvider()) as EthereumRequester
        const params: Record<string, string> = { from: address, to: tx.to }
        if (tx.data) params.data = tx.data
        if (tx.value !== undefined) params.value = toHex(tx.value)
        setHash((await sendTransactionOnSintrop(provider, params)) as Hex)
      } catch (e) {
        setError(
          e instanceof Error ? e : new Error(String((e as { message?: string })?.message ?? e))
        )
      } finally {
        setIsPending(false)
      }
    })()
  }

  return { send, hash, isPending, error }
}

interface WriteContractParams {
  address: Hex | string
  abi: Abi | readonly unknown[]
  functionName: string
  args?: readonly unknown[]
  value?: bigint
}

/** Drop-in for wagmi's useWriteContract that switches network and sends in a single prompt. */
export function useWriteContract(): {
  writeContract: (params: WriteContractParams) => void
  data: Hex | undefined
  isPending: boolean
  isError: boolean
  error: Error | null
} {
  const { send, hash, isPending, error } = useSintropTransaction()

  function writeContract({
    address,
    abi,
    functionName,
    args = [],
    value
  }: WriteContractParams): void {
    const data = encodeFunctionData({ abi: abi as Abi, functionName, args: args as unknown[] })
    send({ to: address as Hex, data, value })
  }

  return { writeContract, data: hash, isPending, isError: !!error, error }
}

/** Drop-in for wagmi's useSendTransaction (native SINTROP transfers). */
export function useSendTransaction(): {
  sendTransaction: (params: { to: Hex; value: bigint }) => void
  data: Hex | undefined
  isPending: boolean
  isError: boolean
  error: Error | null
} {
  const { send, hash, isPending, error } = useSintropTransaction()
  return {
    sendTransaction: ({ to, value }) => send({ to, value }),
    data: hash,
    isPending,
    isError: !!error,
    error
  }
}
