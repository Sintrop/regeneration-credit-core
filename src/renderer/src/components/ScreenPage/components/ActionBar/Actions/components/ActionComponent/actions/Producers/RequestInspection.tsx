/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState } from 'react'
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { useTranslation } from 'react-i18next'
import { SendTransactionButton } from '../../../SendTransactionButton/SendTransactionButton'
import { Abi } from 'viem'
import { TransactionLoading } from '@renderer/components/TransactionLoading/TransactionLoading'
import { toast } from 'react-toastify'
import { useSwitchChain } from '@renderer/hooks/useChainSwitch'

interface Props {
  addressContract?: string
  abi?: Abi
  close: () => void
}
export function RequestInspection({ abi, addressContract, close }: Props): JSX.Element {
  const { t } = useTranslation()
  const { switchChain, isSuccess: isSuccessSwitch } = useSwitchChain()

  const { writeContract, isPending, data: hash, isError, error } = useWriteContract()
  const {
    isLoading,
    isSuccess,
    isError: isErrorTx,
    error: errorTx
  } = useWaitForTransactionReceipt({ hash })
  const errorMessage = error ? error.message : errorTx ? errorTx.message : ''
  const [displayLoadingTx, setDisplayLoadingTx] = useState(false)

  async function handleSendTransaction(): Promise<void> {
    setDisplayLoadingTx(true)

    await switchChain()
    if (!isSuccessSwitch) {
      setDisplayLoadingTx(false)
      return
    }

    writeContract({
      //@ts-ignore
      address: addressContract ? addressContract : '',
      abi: abi ? abi : [],
      functionName: 'requestInspection'
    })
  }

  function success(): void {
    setDisplayLoadingTx(false)
    toast(t('actions.requestedInspection'), { type: 'success' })
    close()
  }

  return (
    <div className="flex flex-col pt-5">
      <SendTransactionButton
        label={t('actions.requestInspection')}
        handleSendTransaction={handleSendTransaction}
        disabled={isLoading}
      />

      {displayLoadingTx && (
        <TransactionLoading
          close={() => setDisplayLoadingTx(false)}
          ok={success}
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
