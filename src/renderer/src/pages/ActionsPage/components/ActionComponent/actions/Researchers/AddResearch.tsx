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

export function AddResearch({ abi, addressContract }: ActionContractProps): JSX.Element {
  const { t } = useTranslation()
  const [inputTitle, setInputTitle] = useState('')
  const [inputThesis, setInputThesis] = useState('')
  const [file, setFile] = useState<Blob>()
  const [uploadingFile, setUploadingFile] = useState(false)

  const { writeContract, isPending, data: hash, error } = useWriteContract()
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash })

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
        functionName: 'addResearch',
        args: [inputTitle, inputThesis, response.hash]
      })
    } else {
      alert('error on upload file')
    }
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

      <p className="text-sm mt-3 text-gray-300">{t('thesis')}:</p>
      <input
        value={inputThesis}
        className="w-full rounded-2xl px-3 bg-container-secondary text-white h-10"
        placeholder={t('typeHere')}
        onChange={(e) => setInputThesis(e.target.value)}
      />

      <p className="text-sm mt-3 text-gray-300">{t('file')}:</p>
      <PdfInput onChangeFile={setFile} />

      <SendTransactionButton
        label={t('addResearch')}
        handleSendTransaction={handleSendTransaction}
        disabled={!inputTitle.trim() || !inputThesis.trim() || !file || isPending || uploadingFile}
      />

      {uploadingFile && <p className="text-white">{t('uloadingFileToIPFS')}</p>}

      <TransactionData
        hash={hash}
        isLoading={isLoading}
        isPending={isPending}
        isSuccess={isSuccess}
        errorTx={error as WriteContractErrorType}
      />
    </div>
  )
}
