/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { useTranslation } from 'react-i18next'
import { WriteContractErrorType } from 'viem'
import { useState } from 'react'
import { SendTransactionButton } from '../../../SendTransactionButton/SendTransactionButton'
import { TransactionData } from '@renderer/components/TransactionData/TransactionData'
import { ActionContractProps } from '../../ActionComponent'
import { base64ToBlob, uploadToIpfs } from '@renderer/services/ipfs'
import { ImageInput } from '@renderer/components/Input/ImageInput'

export function UpdateProfilePhoto({ abi, addressContract }: ActionContractProps): JSX.Element {
  const { t } = useTranslation()
  const [image, setImage] = useState<string>()
  const [uploadingFile, setUploadingFile] = useState(false)

  const { writeContract, isPending, data: hash } = useWriteContract()
  const { isLoading, isSuccess, isError, error } = useWaitForTransactionReceipt({ hash })

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
        functionName: 'updateProfilePhoto',
        args: [response.hash]
      })
    } else {
      alert('error on upload image')
    }
  }

  return (
    <div className="flex flex-col pt-5">
      <p className="text-sm mt-3 text-gray-300">{t('image')}:</p>
      <ImageInput onChange={setImage} />

      <SendTransactionButton
        label={t('updateProfilePhoto')}
        handleSendTransaction={handleSendTransaction}
        disabled={!image || isPending || uploadingFile}
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
