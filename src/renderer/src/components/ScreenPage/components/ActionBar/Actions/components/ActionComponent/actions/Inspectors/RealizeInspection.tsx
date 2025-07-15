/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { useTranslation } from 'react-i18next'
import { WriteContractErrorType } from 'viem'
import { useState } from 'react'
import { SendTransactionButton } from '../../../SendTransactionButton/SendTransactionButton'
import { TransactionData } from '@renderer/components/TransactionData/TransactionData'
import { ActionContractProps } from '../../ActionComponent'
import { ImageInput } from '@renderer/components/Input/ImageInput'
import { base64ToBlob, uploadToIpfs } from '@renderer/services/ipfs'
import { PdfInput } from '@renderer/components/Input/PdfInput'

export function RealizeInspection({ abi, addressContract }: ActionContractProps): JSX.Element {
  const { t } = useTranslation()
  const [input, setInput] = useState('')
  const [inputTrees, setInputTrees] = useState('')
  const [inputBio, setInputBio] = useState('')
  const [image, setImage] = useState<string>()
  const [file, setFile] = useState<Blob>()

  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadingFile, setUploadingFile] = useState(false)

  const { writeContract, isPending, data: hash } = useWriteContract()
  const { isLoading, isSuccess, isError, error } = useWaitForTransactionReceipt({ hash })

  async function handleSendTransaction(): Promise<void> {
    if (!image) return
    if (!file) return
    const id = parseInt(input)
    const trees = parseInt(inputTrees)
    const bio = parseInt(inputBio)

    setUploadingImage(true)
    const blobFile = await base64ToBlob(image)
    const proofPhotoHash = await uploadToIpfs({ file: blobFile })
    if (!proofPhotoHash.success) {
      alert('error on upload proof photo')
      setUploadingImage(false)
    }
    setUploadingImage(false)

    setUploadingFile(true)
    const reportHash = await uploadToIpfs({ file })
    if (!reportHash.success) {
      alert('error on upload report')
      setUploadingFile(false)
    }
    setUploadingFile(false)

    writeContract({
      //@ts-ignore
      address: addressContract ? addressContract : '',
      abi: abi ? abi : [],
      functionName: 'realizeInspection',
      args: [id, proofPhotoHash.hash, reportHash.hash, trees, bio]
    })
  }

  return (
    <div className="flex flex-col pt-5">
      <p className="text-sm mt-3 text-gray-300">{t('inspectionID')}:</p>
      <input
        value={input}
        className="w-full rounded-2xl px-3 bg-container-secondary text-white h-10"
        placeholder={t('typeIDHere')}
        onChange={(e) => setInput(e.target.value)}
        type="number"
      />

      <p className="text-sm mt-3 text-gray-300">{t('image')}:</p>
      <ImageInput onChange={setImage} />

      <p className="text-sm mt-3 text-gray-300">{t('reportFile')}:</p>
      <PdfInput onChangeFile={setFile} />

      <p className="text-sm mt-3 text-gray-300">{t('treesResult')}:</p>
      <input
        value={inputTrees}
        className="w-full rounded-2xl px-3 bg-container-secondary text-white h-10"
        placeholder={t('typeHere')}
        onChange={(e) => setInputTrees(e.target.value)}
        type="number"
      />

      <p className="text-sm mt-3 text-gray-300">{t('biodiversityResult')}:</p>
      <input
        value={inputBio}
        className="w-full rounded-2xl px-3 bg-container-secondary text-white h-10"
        placeholder={t('typeHere')}
        onChange={(e) => setInputBio(e.target.value)}
        type="number"
      />

      <SendTransactionButton
        label={t('realizeInspection')}
        handleSendTransaction={handleSendTransaction}
        disabled={
          !input.trim() || !inputTrees.trim() || !inputBio.trim() || !image || !file || isPending
        }
      />

      {uploadingFile && <p className="text-white">{t('uploadingFileToIPFS')}</p>}
      {uploadingImage && <p className="text-white">{t('uploadingImageToIPFS')}</p>}

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
