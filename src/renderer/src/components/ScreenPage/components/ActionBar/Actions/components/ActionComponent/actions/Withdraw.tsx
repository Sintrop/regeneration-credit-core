/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState } from 'react'
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { useTranslation } from 'react-i18next'
import { SendTransactionButton } from '../../SendTransactionButton/SendTransactionButton'
import { ActionContractProps } from '../ActionComponent'
import { TransactionLoading } from '@renderer/components/TransactionLoading/TransactionLoading'
import { toast } from 'react-toastify'

export function Withdraw({ abi, addressContract, close }: ActionContractProps): JSX.Element {
  const { t } = useTranslation()
  const { writeContract, isPending, data: hash, isError, error } = useWriteContract()
  const {
    isLoading,
    isSuccess,
    isError: isErrorTx,
    error: errorTx
  } = useWaitForTransactionReceipt({ hash })
  const errorMessage = error ? error.message : errorTx ? errorTx.message : ''
  const [displayLoadingTx, setDisplayLoadingTx] = useState(false)

  function handleSendTransaction(): void {
    setDisplayLoadingTx(true)
    writeContract({
      //@ts-ignore
      address: addressContract ? addressContract : '',
      abi: abi ? abi : [],
      functionName: 'withdraw'
    })
  }

  function success(): void {
    setDisplayLoadingTx(false)
    toast(t('actions.withdrawnTokens'), { type: 'success' })
    close()
  }

  return (
    <div className="flex flex-col pt-5">
      <SendTransactionButton
        label={t('actions.withdraw')}
        handleSendTransaction={handleSendTransaction}
        disabled={isPending || isLoading}
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
