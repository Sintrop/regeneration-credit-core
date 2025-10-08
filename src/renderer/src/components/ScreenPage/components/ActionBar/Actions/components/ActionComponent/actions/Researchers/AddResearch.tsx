/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState } from 'react'
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { useTranslation } from 'react-i18next'
import { SendTransactionButton } from '../../../SendTransactionButton/SendTransactionButton'
import { ActionContractProps } from '../../ActionComponent'
import { useCanPublishWork } from '@renderer/hooks/useCanPublishWork'
import { Loading } from '@renderer/components/Loading/Loading'
import { TransactionLoading } from '@renderer/components/TransactionLoading/TransactionLoading'
import { toast } from 'react-toastify'
import { FileInputSelector } from '@renderer/components/FileInputSelector/FileInputSelector'
import { useSwitchChain } from '@renderer/hooks/useChainSwitch'

export function AddResearch({
  abi,
  addressContract,
  lastPublishedWork,
  close
}: ActionContractProps): JSX.Element {
  const { switchChain } = useSwitchChain()

  const { t } = useTranslation()
  const [inputTitle, setInputTitle] = useState('')
  const [inputThesis, setInputThesis] = useState('')
  const [file, setFile] = useState<string>('')

  const { writeContract, isPending, data: hash, isError, error } = useWriteContract()
  const {
    isLoading,
    isSuccess,
    isError: isErrorTx,
    error: errorTx
  } = useWaitForTransactionReceipt({ hash })
  const errorMessage = error ? error.message : errorTx ? errorTx.message : ''
  const [displayLoadingTx, setDisplayLoadingTx] = useState(false)

  const {
    canPublish,
    canPublishIn,
    isLoading: loadingCanPublish
  } = useCanPublishWork({ lastPublishedAt: lastPublishedWork })

  async function handleSendTransaction(): Promise<void> {
    if (!file.trim()) return

    setDisplayLoadingTx(true)

    switchChain()

    writeContract({
      //@ts-ignore
      address: addressContract ? addressContract : '',
      abi: abi ? abi : [],
      functionName: 'addResearch',
      args: [inputTitle, inputThesis, file]
    })
  }

  function success(): void {
    setDisplayLoadingTx(false)
    toast(t('actions.publishedResearche'), { type: 'success' })
    setInputTitle('')
    setInputThesis('')
    close()
  }

  if (loadingCanPublish) {
    return (
      <div className="flex flex-col items-center justify-center h-[200px] overflow-hidden">
        <Loading />
      </div>
    )
  }

  return (
    <div className="flex flex-col pt-5">
      {canPublish ? (
        <>
          <p className="text-sm mt-3 text-gray-300">{t('actions.title')}:</p>
          <input
            value={inputTitle}
            className="w-full rounded-2xl px-3 bg-container-secondary text-white h-10"
            placeholder={t('actions.typeHere')}
            onChange={(e) => setInputTitle(e.target.value)}
            maxLength={100}
          />

          <p className="text-sm mt-3 text-gray-300">{t('actions.thesis')}:</p>
          <input
            value={inputThesis}
            className="w-full rounded-2xl px-3 bg-container-secondary text-white h-10"
            placeholder={t('actions.typeHere')}
            onChange={(e) => setInputThesis(e.target.value)}
            maxLength={300}
          />

          <p className="text-sm mt-3 text-gray-300">{t('actions.file')}:</p>
          <FileInputSelector setValue={setFile} value={file} />

          <SendTransactionButton
            label={t('actions.addResearch')}
            handleSendTransaction={handleSendTransaction}
            disabled={!inputTitle.trim() || !inputThesis.trim() || !file.trim()}
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
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-[200px]">
          <p className="text-white text-center">{t("actions.youCan'tAddResearchNow")}</p>
          <p className="text-white text-center">
            {t('actions.wait')} {canPublishIn} {t('actions.blocks')}
          </p>
        </div>
      )}
    </div>
  )
}
