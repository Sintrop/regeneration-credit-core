/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState } from 'react'
import { ContractListProps, MethodAbiProps } from '@renderer/types/contract'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'

interface Props {
  method: MethodAbiProps
  contract: ContractListProps
}

export function MethodItem({ method, contract }: Props): JSX.Element {
  const {
    writeContract,
    data: hashWrite,
    error: errorWrite,
    isPending: isPendingWrite
  } = useWriteContract()

  const { isLoading: isConfirmingWrite, isSuccess: isConfirmedWrite } =
    useWaitForTransactionReceipt({ hash: hashWrite })
  const [openMethod, setOpenMethod] = useState(false)

  function handleWriteContract(): void {
    writeContract({
      //@ts-ignore
      address: contract.address,
      abi: contract.abi,
      functionName: method.name,
      args: []
    })
  }

  function toggleOpenMethod(): void {
    setOpenMethod((value) => !value)
  }

  if (!method.name) return <div />

  return (
    <div className="flex flex-col w-full px-5 py-2 bg-container-primary rounded-2xl">
      <button className="flex items-center justify-between text-white" onClick={toggleOpenMethod}>
        {method.name}
      </button>

      {openMethod && (
        <div className="flex flex-col">
          <button className="text-white" onClick={handleWriteContract}>
            {isPendingWrite ? 'Confirming...' : 'Write'}
          </button>
          {hashWrite && (
            <div className="flex flex-col">
              <p className="text-white">Hash: {hashWrite}</p>
              {isConfirmingWrite && <div className="text-white">Waiting for confirmation...</div>}
              {isConfirmedWrite && <div className="text-white">Transaction Successfully!</div>}
            </div>
          )}
          {errorWrite && <p className="text-red-500">{errorWrite.message}</p>}
        </div>
      )}
    </div>
  )
}
