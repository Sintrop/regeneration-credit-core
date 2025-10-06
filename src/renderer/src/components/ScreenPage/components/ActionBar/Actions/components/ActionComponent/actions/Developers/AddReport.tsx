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

export function AddReport({
  abi,
  addressContract,
  lastPublishedWork,
  close
}: ActionContractProps): JSX.Element {
  const { switchChain, isSuccess: isSuccessSwitch } = useSwitchChain()
  const { t } = useTranslation()
  const [inputDescription, setInputDescription] = useState('')
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
  const [file, setFile] = useState<string>()

  async function handleSendTransaction(): Promise<void> {
    if (!file) return

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
      functionName: 'addReport',
      args: [inputDescription, file]
    })
  }

  function success(): void {
    setDisplayLoadingTx(false)
    setInputDescription('')
    toast(t('actions.reportPublished'), { type: 'success' })
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
          <p className="text-sm mt-3 text-gray-300">{t('actions.description')}:</p>
          <input
            value={inputDescription}
            className="w-full rounded-2xl px-3 bg-container-secondary text-white h-10"
            placeholder={t('actions.typeHere')}
            onChange={(e) => setInputDescription(e.target.value)}
            maxLength={300}
          />

          <p className="text-sm mt-3 text-gray-300">{t('actions.reportFile')}:</p>
          <FileInputSelector value={file ? file : ''} setValue={setFile} />

          <SendTransactionButton
            label={t('actions.addReport')}
            handleSendTransaction={handleSendTransaction}
            disabled={!inputDescription.trim() || !file || !file.trim()}
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
          <p className="text-white text-center">{t("actions.youCan'tAddReportNow")}</p>
          <p className="text-white text-center">
            {t('actions.wait')} {canPublishIn} {t('actions.blocks')}
          </p>
        </div>
      )}
    </div>
  )
}
