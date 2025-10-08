/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState } from 'react'
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { useTranslation } from 'react-i18next'
import { SendTransactionButton } from '../../../SendTransactionButton/SendTransactionButton'
import { ActionContractProps } from '../../ActionComponent'
import { TransactionLoading } from '@renderer/components/TransactionLoading/TransactionLoading'
import { toast } from 'react-toastify'
import { FileInputSelector } from '@renderer/components/FileInputSelector/FileInputSelector'
import { useSwitchChain } from '@renderer/hooks/useChainSwitch'

export function RealizeInspection({
  abi,
  addressContract,
  close
}: ActionContractProps): JSX.Element {
  const { switchChain } = useSwitchChain()

  const { t } = useTranslation()
  const [input, setInput] = useState('')
  const [inputTrees, setInputTrees] = useState('')
  const [inputBio, setInputBio] = useState('')
  const [proofPhotos, setProofPhotos] = useState<string>('')
  const [report, setReport] = useState<string>('')

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
    if (!report.trim()) return
    if (!proofPhotos.trim()) return
    const id = parseInt(input)
    const trees = parseInt(inputTrees)
    const bio = parseInt(inputBio)

    setDisplayLoadingTx(true)

    switchChain()

    writeContract({
      //@ts-ignore
      address: addressContract ? addressContract : '',
      abi: abi ? abi : [],
      functionName: 'realizeInspection',
      args: [id, proofPhotos, report, trees, bio]
    })
  }

  function success(): void {
    setDisplayLoadingTx(false)
    toast(t('actions.realizedInspection'), { type: 'success' })
    setInput('')
    setInputTrees('')
    setInputBio('')
    close()
  }

  return (
    <div className="flex flex-col pt-5">
      <p className="text-sm mt-3 text-gray-300">{t('actions.inspectionID')}:</p>
      <input
        value={input}
        className="w-full rounded-2xl px-3 bg-container-secondary text-white h-10"
        placeholder={t('actions.typeHere')}
        onChange={(e) => setInput(e.target.value)}
        type="number"
      />

      <div className="flex flex-col gap-1 border border-white rounded-2xl p-3 mt-3">
        <p className="text-sm text-gray-300">{t('actions.images')}:</p>
        <FileInputSelector setValue={setProofPhotos} value={proofPhotos} inputId="1" />
      </div>

      <div className="flex flex-col gap-1 border border-white rounded-2xl p-3 mt-3">
        <p className="text-sm text-gray-300">{t('actions.reportFile')}:</p>
        <FileInputSelector setValue={setReport} value={report} inputId="2" />
      </div>

      <p className="text-sm mt-3 text-gray-300">{t('actions.treesResult')}:</p>
      <input
        value={inputTrees}
        className="w-full rounded-2xl px-3 bg-container-secondary text-white h-10"
        placeholder={t('actions.typeHere')}
        onChange={(e) => setInputTrees(e.target.value)}
        type="number"
      />

      <p className="text-sm mt-3 text-gray-300">{t('actions.biodiversityResult')}:</p>
      <input
        value={inputBio}
        className="w-full rounded-2xl px-3 bg-container-secondary text-white h-10"
        placeholder={t('actions.typeHere')}
        onChange={(e) => setInputBio(e.target.value)}
        type="number"
      />

      <SendTransactionButton
        label={t('actions.realizeInspection')}
        handleSendTransaction={handleSendTransaction}
        disabled={
          !input.trim() ||
          !inputTrees.trim() ||
          !inputBio.trim() ||
          !proofPhotos.trim() ||
          !report.trim()
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
