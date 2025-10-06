/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { SendTransactionButton } from '../../../SendTransactionButton/SendTransactionButton'
import { ActionContractProps } from '../../ActionComponent'
import { useCanPublishWork } from '@renderer/hooks/useCanPublishWork'
import { Loading } from '@renderer/components/Loading/Loading'
import { TransactionLoading } from '@renderer/components/TransactionLoading/TransactionLoading'
import { toast } from 'react-toastify'
import { FileInputSelector } from '@renderer/components/FileInputSelector/FileInputSelector'
import { useSwitchChain } from '@renderer/hooks/useChainSwitch'

export function AddContribution({
  abi,
  addressContract,
  lastPublishedWork,
  close
}: ActionContractProps): JSX.Element {
  const { switchChain, isSuccess: isSuccessSwitch } = useSwitchChain()

  const { t } = useTranslation()
  const [inputDescription, setInputDescription] = useState('')
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
      functionName: 'addContribution',
      args: [inputDescription, file]
    })
  }

  function success(): void {
    setDisplayLoadingTx(false)
    setInputDescription('')
    close()
    toast(t('actions.publishedContribution'), { type: 'success' })
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
          <FileInputSelector value={file} setValue={setFile} />

          <SendTransactionButton
            label={t('actions.addContribution')}
            handleSendTransaction={handleSendTransaction}
            disabled={!inputDescription.trim() || !file}
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
          <p className="text-white text-center">{t("actions.youCan'tAddContributionNow")}</p>
          <p className="text-white text-center">
            {t('actions.wait')} {canPublishIn} {t('actions.blocks')}
          </p>
        </div>
      )}
    </div>
  )
}
