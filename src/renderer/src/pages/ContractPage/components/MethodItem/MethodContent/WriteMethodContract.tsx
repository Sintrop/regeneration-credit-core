/* eslint-disable @typescript-eslint/ban-ts-comment */
import { TransactionLoading } from '@renderer/components/TransactionLoading/TransactionLoading'
import { ContractListProps, MethodAbiProps } from '@renderer/types/contract'
import { useEffect, useState } from 'react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'

interface Props {
  method: MethodAbiProps
  contract: ContractListProps
  args: string[]
}

export function WriteMethodContract({ contract, method, args }: Props): JSX.Element {
  const { writeContract, data: hash, isPending, isError } = useWriteContract()
  const { isLoading, isSuccess, isError: isErrorTx, error } = useWaitForTransactionReceipt({ hash })
  const [displayLoadingTx, setDisplayLoadingTx] = useState(false)

  useEffect(() => {
    setDisplayLoadingTx(true)
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
      {displayLoadingTx && (
        <TransactionLoading
          close={() => setDisplayLoadingTx(false)}
          ok={() => {}}
          isError={isError || isErrorTx}
          isPending={isPending}
          isSuccess={isSuccess}
          loading={isLoading}
          error={error}
          transactionHash={hash}
        />
      )}
    </div>
  )
}
