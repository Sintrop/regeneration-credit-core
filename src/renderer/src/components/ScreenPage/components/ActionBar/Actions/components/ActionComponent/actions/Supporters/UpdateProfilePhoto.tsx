/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState } from 'react'
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { useTranslation } from 'react-i18next'
import { SendTransactionButton } from '../../../SendTransactionButton/SendTransactionButton'
import { ActionContractProps } from '../../ActionComponent'
import { base64ToBlob, uploadToIpfs } from '@renderer/services/ipfs'
import { ImageInput } from '@renderer/components/Input/ImageInput'
import { useSettingsContext } from '@renderer/hooks/useSettingsContext'
import { TransactionLoading } from '@renderer/components/TransactionLoading/TransactionLoading'

export function UpdateProfilePhoto({ abi, addressContract }: ActionContractProps): JSX.Element {
  const { ipfsApiUrl } = useSettingsContext()
  const { t } = useTranslation()
  const [image, setImage] = useState<string>()
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
    setUploadingFile(true)
    const blobFile = await base64ToBlob(image)
    const response = await uploadToIpfs({ file: blobFile, ipfsApiUrl })
    setUploadingFile(false)

    if (response.success) {
      setDisplayLoadingTx(true)
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

  function success(): void {
    setDisplayLoadingTx(false)
    alert(t('profilePhotoUpdated'))
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
