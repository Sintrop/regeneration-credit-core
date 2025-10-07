/* eslint-disable @typescript-eslint/ban-ts-comment */
import { TransactionLoading } from '@renderer/components/TransactionLoading/TransactionLoading'
import { useSwitchChain } from '@renderer/hooks/useChainSwitch'
import { ContractListProps, MethodAbiProps } from '@renderer/types/contract'
import { useEffect, useState } from 'react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'

interface Props {
  method: MethodAbiProps
  contract: ContractListProps
  args: string[]
}

export function WriteMethodContract({ contract, method, args }: Props): JSX.Element {
  const { switchChain, isSuccess: isSuccessSwitch } = useSwitchChain()
  const { writeContract, data: hash, isPending, isError, error } = useWriteContract()
  const {
    isLoading,
    isSuccess,
    isError: isErrorTx,
    error: errorTx
  } = useWaitForTransactionReceipt({ hash })
  const errorMessage = error ? error.message : errorTx ? errorTx.message : ''
  const [displayLoadingTx, setDisplayLoadingTx] = useState(false)

  useEffect(() => {
    async function write(): Promise<void> {
      setDisplayLoadingTx(true)

      await switchChain()
      if (!isSuccessSwitch) {
        setDisplayLoadingTx(false)
        return
      }
      writeContract({
        //@ts-ignore
        address: contract.address,
        abi: contract?.abi,
        functionName: method.name,
        args
      })
    }
    write()
  }, [])

  return (
    <div className="flex flex-col">
      {displayLoadingTx && (
        <TransactionLoading
          close={() => setDisplayLoadingTx(false)}
          ok={() => setDisplayLoadingTx(false)}
          isError={isError || isErrorTx}
          isPending={isPending}
          isSuccess={isSuccess}
          loading={isLoading}
          errorMessage={errorMessage}
          transactionHash={hash}
        />
      )}
    </div>
  )
}
