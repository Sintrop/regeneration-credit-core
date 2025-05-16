/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { useTranslation } from 'react-i18next'
import { WriteContractErrorType } from 'viem'
import { useState } from 'react'
import { SendTransactionButton } from '../../../SendTransactionButton/SendTransactionButton'
import { TransactionData } from '@renderer/components/TransactionData/TransactionData'
import { ActionContractProps } from '../../ActionComponent'
import { PdfInput } from '@renderer/components/Input/PdfInput'
import { uploadToIpfs } from '@renderer/services/ipfs'
import { useCanPublishWork } from '@renderer/hooks/useCanPublishWork'
import { Loading } from '@renderer/components/Loading/Loading'

export function AddReport({
  abi,
  addressContract,
  lastPublishedWork
}: ActionContractProps): JSX.Element {
  const { t } = useTranslation()
  const [inputDescription, setInputDescription] = useState('')
  const { writeContract, isPending, data: hash } = useWriteContract()
  const { isLoading, isSuccess, isError, error } = useWaitForTransactionReceipt({ hash })
  const {
    canPublish,
    canPublishIn,
    isLoading: loadingCanPublish
  } = useCanPublishWork({ lastPublishedAt: lastPublishedWork })
  const [file, setFile] = useState<Blob>()
  const [uploadingFile, setUploadingFile] = useState(false)

  async function handleSendTransaction(): Promise<void> {
    if (!file) return
    setUploadingFile(true)
    const response = await uploadToIpfs({ file })
    setUploadingFile(false)

    if (response.success) {
      writeContract({
        //@ts-ignore
        address: addressContract ? addressContract : '',
        abi: abi ? abi : [],
        functionName: 'addReport',
        args: [inputDescription, response.hash]
      })
    } else {
      alert('error on upload file')
    }
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
          <p className="text-sm mt-3 text-gray-300">{t('description')}:</p>
          <input
            value={inputDescription}
            className="w-full rounded-2xl px-3 bg-container-secondary text-white h-10"
            placeholder={t('typeHere')}
            onChange={(e) => setInputDescription(e.target.value)}
          />

          <p className="text-sm mt-3 text-gray-300">{t('reportFile')}:</p>
          <PdfInput onChangeFile={setFile} />

          <SendTransactionButton
            label={t('addReport')}
            handleSendTransaction={handleSendTransaction}
            disabled={!inputDescription.trim() || !file || isPending || uploadingFile}
          />

          {uploadingFile && <p className="text-white">{t('uloadingFileToIPFS')}</p>}

          <TransactionData
            hash={hash}
            isLoading={isLoading}
            isPending={isPending}
            isSuccess={isSuccess}
            errorTx={error as WriteContractErrorType}
            isError={isError}
          />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-[200px]">
          <p className="text-white text-center">{t("youCan'tAddReportNow")}</p>
          <p className="text-white text-center">
            {t('wait')} {canPublishIn} {t('blocks')}
          </p>
        </div>
      )}
    </div>
  )
}
