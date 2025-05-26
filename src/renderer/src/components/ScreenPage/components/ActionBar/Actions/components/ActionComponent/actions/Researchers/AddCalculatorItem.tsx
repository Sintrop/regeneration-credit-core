/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { useTranslation } from 'react-i18next'
import { WriteContractErrorType } from 'viem'
import { useState } from 'react'
import { SendTransactionButton } from '../../../SendTransactionButton/SendTransactionButton'
import { TransactionData } from '@renderer/components/TransactionData/TransactionData'
import { ActionContractProps } from '../../ActionComponent'

export function AddCalculatorItem({ abi, addressContract }: ActionContractProps): JSX.Element {
  const { t } = useTranslation()
  const [inputTitle, setInputTitle] = useState('')
  const [inputUnit, setInputUnit] = useState('')
  const [inputJustification, setInputJustification] = useState('')
  const [inputCarbonImpact, setInputCarbonImpact] = useState('')

  const { writeContract, isPending, data: hash } = useWriteContract()
  const { isLoading, isSuccess, error, isError } = useWaitForTransactionReceipt({ hash })

  async function handleSendTransaction(): Promise<void> {
    writeContract({
      //@ts-ignore
      address: addressContract ? addressContract : '',
      abi: abi ? abi : [],
      functionName: 'addCalculatorItem',
      args: [inputTitle, inputUnit, inputJustification, parseInt(inputCarbonImpact)]
    })
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
          !inputCarbonImpact.trim() ||
          isPending
        }
      />

      <TransactionData
        hash={hash}
        isLoading={isLoading}
        isPending={isPending}
        isSuccess={isSuccess}
        errorTx={error as WriteContractErrorType}
        isError={isError}
      />
    </div>
  )
}
