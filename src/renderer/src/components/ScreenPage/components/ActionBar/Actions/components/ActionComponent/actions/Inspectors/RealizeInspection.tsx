/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState } from 'react'
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { useTranslation } from 'react-i18next'
import { SendTransactionButton } from '../../../SendTransactionButton/SendTransactionButton'
import { ActionContractProps } from '../../ActionComponent'
import { uploadToIpfs } from '@renderer/services/ipfs'
import { PdfInput } from '@renderer/components/Input/PdfInput'
import { useSettingsContext } from '@renderer/hooks/useSettingsContext'
import { TransactionLoading } from '@renderer/components/TransactionLoading/TransactionLoading'
import { toast } from 'react-toastify'

export function RealizeInspection({
  abi,
  addressContract,
  close
}: ActionContractProps): JSX.Element {
  const { ipfsApiUrl } = useSettingsContext()
  const { t } = useTranslation()
  const [input, setInput] = useState('')
  const [inputTrees, setInputTrees] = useState('')
  const [inputBio, setInputBio] = useState('')
  const [image, setImage] = useState<Blob>()
  const [file, setFile] = useState<Blob>()

  const [uploadingImage, setUploadingImage] = useState(false)
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

  async function handleSendTransaction(): Promise<void> {
    if (!image) return
    if (!file) return
    const id = parseInt(input)
    const trees = parseInt(inputTrees)
    const bio = parseInt(inputBio)

    setUploadingImage(true)
    const proofPhotoHash = await uploadToIpfs({ file: image, ipfsApiUrl })
    if (!proofPhotoHash.success) {
      alert('error on upload proof photo')
      setUploadingImage(false)
    }
    setUploadingImage(false)

    setUploadingFile(true)
    const reportHash = await uploadToIpfs({ file, ipfsApiUrl })
    if (!reportHash.success) {
      alert('error on upload report')
      setUploadingFile(false)
    }
    setUploadingFile(false)

    setDisplayLoadingTx(true)
    writeContract({
      //@ts-ignore
      address: addressContract ? addressContract : '',
      abi: abi ? abi : [],
      functionName: 'realizeInspection',
      args: [id, proofPhotoHash.hash, reportHash.hash, trees, bio]
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

      <p className="text-sm mt-3 text-gray-300">{t('actions.images')}:</p>
      <PdfInput onChangeFile={setImage} idInput="images" />

      <p className="text-sm mt-3 text-gray-300">{t('actions.reportFile')}:</p>
      <PdfInput onChangeFile={setFile} idInput="report" />

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
        disabled={!input.trim() || !inputTrees.trim() || !inputBio.trim() || !image || !file}
      />

      {uploadingFile && <p className="text-white">{t('actions.uploadingFileToIPFS')}</p>}
      {uploadingImage && <p className="text-white">{t('actions.uploadingImagesToIPFS')}</p>}

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
