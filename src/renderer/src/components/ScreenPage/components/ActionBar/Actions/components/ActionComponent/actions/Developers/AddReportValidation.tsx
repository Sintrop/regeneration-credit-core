/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { SendTransactionButton } from '../../../SendTransactionButton/SendTransactionButton'
import { ActionContractProps } from '../../ActionComponent'
import { TransactionLoading } from '@renderer/components/TransactionLoading/TransactionLoading'
import { toast } from 'react-toastify'

export function AddReportValidation({
  abi,
  addressContract,
  close
}: ActionContractProps): JSX.Element {
  const { t } = useTranslation()
  const [inputId, setInputId] = useState('')
  const [inputJustification, setInputJustification] = useState('')

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
    writeContract({
      //@ts-ignore
      address: addressContract ? addressContract : '',
      abi: abi ? abi : [],
      functionName: 'addReportValidation',
      args: [parseInt(inputId), inputJustification]
    })
  }

  function success(): void {
    setDisplayLoadingTx(false)
    toast(t('actions.validationSent'), { type: 'success' })
    setInputId('')
    setInputJustification('')
    close()
  }

  return (
    <div className="flex flex-col pt-5">
      <p className="text-sm mt-3 text-gray-300">{t('actions.idReport')}:</p>
      <input
        value={inputId}
        className="w-full rounded-2xl px-3 bg-container-secondary text-white h-10"
        placeholder={t('actions.typeHere')}
        onChange={(e) => setInputId(e.target.value)}
      />

      <p className="text-sm mt-3 text-gray-300">{t('actions.justification')}:</p>
      <input
        value={inputJustification}
        className="w-full rounded-2xl px-3 bg-container-secondary text-white h-10"
        placeholder={t('actions.typeHere')}
        onChange={(e) => setInputJustification(e.target.value)}
        maxLength={300}
      />

      <SendTransactionButton
        label={t('actions.addReportValidation')}
        handleSendTransaction={handleSendTransaction}
        disabled={!inputId.trim() || !inputJustification.trim()}
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
