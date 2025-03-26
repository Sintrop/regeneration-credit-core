/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ContractListProps, MethodAbiProps } from '@renderer/types/contract'
import { formatUnits } from 'viem'
import { useReadContract } from 'wagmi'

interface Props {
  method: MethodAbiProps
  contract: ContractListProps
  args: string[]
}

export function ReadMethodContract({ contract, method, args }: Props): JSX.Element {
  const { data, isError, isLoading, error, isSuccess } = useReadContract({
    //@ts-ignore
    address: contract.address,
    abi: contract?.abi,
    functionName: method.name,
    args
  })

  function customStringify(value): string {
    if (typeof value === 'bigint') {
      return value.toString() // Converte BigInt para string
    }
    return value
  }

  return (
    <div className="flex flex-col">
      {isLoading && <div className="w-8 h-8 bg-green-500 animate-spin" />}
      {isError && <p className="text-red-500">{error.message}</p>}

      {isSuccess && (
        <>
          {typeof data === 'string' && <p className="text-white">{data}</p>}

          {typeof data === 'number' && <p className="text-white">{data}</p>}

          {typeof data === 'bigint' && (
            <p className="text-white">
              {data?.toString().length > 17
                ? Intl.NumberFormat('pt-BR', { maximumFractionDigits: 5 }).format(
                    parseFloat(formatUnits(data, 18))
                  )
                : Intl.NumberFormat('pt-BR', { maximumFractionDigits: 5 }).format(
                    parseFloat(data.toString())
                  )}
            </p>
          )}

          {typeof data === 'object' && (
            <pre className="text-white">
              {JSON.stringify(data, (key, value) => customStringify(value), 2)}
            </pre>
          )}
        </>
      )}
    </div>
  )
}
