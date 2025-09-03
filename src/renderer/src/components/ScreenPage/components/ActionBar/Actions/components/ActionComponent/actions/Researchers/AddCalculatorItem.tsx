/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState } from 'react'
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { useTranslation } from 'react-i18next'
import { SendTransactionButton } from '../../../SendTransactionButton/SendTransactionButton'
import { ActionContractProps } from '../../ActionComponent'
import { TransactionLoading } from '@renderer/components/TransactionLoading/TransactionLoading'
import { toast } from 'react-toastify'

export function AddCalculatorItem({
  abi,
  addressContract,
  close
}: ActionContractProps): JSX.Element {
  const { t } = useTranslation()
  const [inputTitle, setInputTitle] = useState('')
  const [inputUnit, setInputUnit] = useState('')
  const [inputJustification, setInputJustification] = useState('')
  const [inputCarbonImpact, setInputCarbonImpact] = useState('')

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
      functionName: 'addCalculatorItem',
      args: [inputTitle, inputJustification, inputUnit, parseInt(inputCarbonImpact)]
    })
  }

  function success(): void {
    setDisplayLoadingTx(false)
    toast(t('calculatorItemAdded'), { type: 'success' })
    setInputTitle('')
    setInputCarbonImpact('')
    setInputJustification('')
    setInputUnit('')
    close()
  }

  return (
    <div className="flex flex-col pt-5">
      <p className="text-sm mt-3 text-gray-300">{t('title')}:</p>
      <input
        value={inputTitle}
        className="w-full rounded-2xl px-3 bg-container-secondary text-white h-10"
        placeholder={t('typeHere')}
        onChange={(e) => setInputTitle(e.target.value)}
      />

      <p className="text-sm mt-3 text-gray-300">{t('justification')}:</p>
      <input
        value={inputJustification}
        className="w-full rounded-2xl px-3 bg-container-secondary text-white h-10"
        placeholder={t('typeHere')}
        onChange={(e) => setInputJustification(e.target.value)}
      />

      <p className="text-sm mt-3 text-gray-300">{t('unit')}:</p>
      <input
        value={inputUnit}
        className="w-full rounded-2xl px-3 bg-container-secondary text-white h-10"
        placeholder={t('typeHere')}
        onChange={(e) => setInputUnit(e.target.value)}
      />

      <p className="text-sm mt-3 text-gray-300">{t('carbonImpact')}:</p>
      <input
        value={inputCarbonImpact}
        className="w-full rounded-2xl px-3 bg-container-secondary text-white h-10"
        placeholder={t('typeHere')}
        onChange={(e) => setInputCarbonImpact(e.target.value)}
        type="number"
      />

      <SendTransactionButton
        label={t('addCalculatorItem')}
        handleSendTransaction={handleSendTransaction}
        disabled={
          !inputTitle.trim() ||
          !inputUnit.trim() ||
          !inputJustification.trim() ||
          !inputCarbonImpact.trim()
        }
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
