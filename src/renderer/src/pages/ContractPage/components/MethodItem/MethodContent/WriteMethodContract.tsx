/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ContractListProps, MethodAbiProps } from '@renderer/types/contract'
import { useEffect } from 'react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'

interface Props {
  method: MethodAbiProps
  contract: ContractListProps
  args: string[]
}

export function WriteMethodContract({ contract, method, args }: Props): JSX.Element {
  const { writeContract, data: hash, isError, error, isPending } = useWriteContract()
  const { isLoading, isSuccess, error: errorTransaction } = useWaitForTransactionReceipt({ hash })

  useEffect(() => {
    writeContract({
      //@ts-ignore
      address: contract.address,
      abi: contract?.abi,
      functionName: method.name,
      args
    })
  }, [])

  return (
    <div className="flex flex-col">
      {isPending && <div className="w-8 h-8 bg-green-500 animate-spin" />}
      {isLoading && <div className="w-8 h-8 bg-green-500 animate-spin" />}
      {hash && (
        <div className="flex flex-col">
          <p className="text-white">Transaction hash: {hash}</p>
          {isLoading && <p className="text-white">Confirming transaction....</p>}
          {isSuccess && <p className="text-green-500">Transaction confirmed!</p>}
        </div>
      )}
      {isError && <p className="text-red-500">{error.message}</p>}
      {errorTransaction && <p className="text-red-500">{errorTransaction.message}</p>}
    </div>
  )
}
