/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { useTranslation } from 'react-i18next'
import { parseUnits, WriteContractErrorType } from 'viem'
import { useState } from 'react'
import { SendTransactionButton } from '../../../SendTransactionButton/SendTransactionButton'
import { TransactionData } from '@renderer/components/TransactionData/TransactionData'
import { ActionContractProps } from '../../ActionComponent'
import { base64ToBlob, uploadToIpfs } from '@renderer/services/ipfs'
import { ImageInput } from '@renderer/components/Input/ImageInput'

export function Publish({ abi, addressContract }: ActionContractProps): JSX.Element {
  const { t } = useTranslation()
  const [inputAmmount, setInputAmmount] = useState('')
  const [inputDescription, setInputDescription] = useState('')
  const [image, setImage] = useState<string>()
  const [uploadingFile, setUploadingFile] = useState(false)

  const { writeContract, isPending, data: hash } = useWriteContract()
  const { isLoading, isSuccess, error, isError } = useWaitForTransactionReceipt({ hash })

  async function handleSendTransaction(): Promise<void> {
    if (!image) return
    setUploadingFile(true)
    const blobFile = await base64ToBlob(image)
    const response = await uploadToIpfs({ file: blobFile })
    setUploadingFile(false)

    if (response.success) {
      writeContract({
        //@ts-ignore
        address: addressContract ? addressContract : '',
        abi: abi ? abi : [],
        functionName: 'publish',
        args: [parseUnits(inputAmmount, 18), inputDescription, response.hash]
      })
    } else {
      alert('error on upload image')
    }
  }

  return (
    <div className="flex flex-col pt-5">
      <p className="text-sm mt-3 text-gray-300">{t('ammount')}:</p>
      <input
        value={inputAmmount}
        className="w-full rounded-2xl px-3 bg-container-secondary text-white h-10"
        placeholder={t('typeHere')}
        onChange={(e) => setInputAmmount(e.target.value)}
        type="number"
      />

      <p className="text-sm mt-3 text-gray-300">{t('description')}:</p>
      <input
        value={inputDescription}
        className="w-full rounded-2xl px-3 bg-container-secondary text-white h-10"
        placeholder={t('typeHere')}
        onChange={(e) => setInputDescription(e.target.value)}
      />

      <p className="text-sm mt-3 text-gray-300">{t('image')}:</p>
      <ImageInput onChange={setImage} />

      <SendTransactionButton
        label={t('publish')}
        handleSendTransaction={handleSendTransaction}
        disabled={
          !inputDescription.trim() || !inputAmmount.trim() || !image || isPending || uploadingFile
        }
      />

      {uploadingFile && <p className="text-white">{t('uloadingImageToIPFS')}</p>}

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
