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

  return (
    <div className="flex flex-col">
      {isLoading && <div className="w-8 h-8 bg-green-500 animate-spin" />}
      {isError && <p className="text-red-500">{error.message}</p>}
      {isSuccess && <p className="text-white">{formatUnits(data as bigint, 18)}</p>}
    </div>
  )
}
