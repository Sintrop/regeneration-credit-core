/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState } from 'react'
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { useTranslation } from 'react-i18next'
import { SendTransactionButton } from '../../../SendTransactionButton/SendTransactionButton'
import { ActionContractProps } from '../../ActionComponent'
import { PdfInput } from '@renderer/components/Input/PdfInput'
import { uploadToIpfs } from '@renderer/services/ipfs'
import { useCanPublishWork } from '@renderer/hooks/useCanPublishWork'
import { Loading } from '@renderer/components/Loading/Loading'
import { useSettingsContext } from '@renderer/hooks/useSettingsContext'
import { TransactionLoading } from '@renderer/components/TransactionLoading/TransactionLoading'

export function AddResearch({
  abi,
  addressContract,
  lastPublishedWork
}: ActionContractProps): JSX.Element {
  const { ipfsApiUrl } = useSettingsContext()
  const { t } = useTranslation()
  const [inputTitle, setInputTitle] = useState('')
  const [inputThesis, setInputThesis] = useState('')
  const [file, setFile] = useState<Blob>()
  const [uploadingFile, setUploadingFile] = useState(false)

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
    setUploadingFile(true)
    const response = await uploadToIpfs({ file, ipfsApiUrl })
    setUploadingFile(false)

    if (response.success) {
      setDisplayLoadingTx(true)
      writeContract({
        //@ts-ignore
        address: addressContract ? addressContract : '',
        abi: abi ? abi : [],
        functionName: 'addResearch',
        args: [inputTitle, inputThesis, response.hash]
      })
    } else {
      alert('error on upload file')
    }
  }

  function success(): void {
    setDisplayLoadingTx(false)
    alert(t('actions.publishedResearche'))
    setInputTitle('')
    setInputThesis('')
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
          />

          <p className="text-sm mt-3 text-gray-300">{t('actions.thesis')}:</p>
          <input
            value={inputThesis}
            className="w-full rounded-2xl px-3 bg-container-secondary text-white h-10"
            placeholder={t('actions.typeHere')}
            onChange={(e) => setInputThesis(e.target.value)}
          />

          <p className="text-sm mt-3 text-gray-300">{t('actions.file')}:</p>
          <PdfInput onChangeFile={setFile} />

          <SendTransactionButton
            label={t('actions.addResearch')}
            handleSendTransaction={handleSendTransaction}
            disabled={!inputTitle.trim() || !inputThesis.trim() || !file || uploadingFile}
          />

          {uploadingFile && <p className="text-white">{t('actions.uloadingFileToIPFS')}</p>}

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
