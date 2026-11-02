import { ByteCounter } from '@renderer/components/ByteCounter/ByteCounter'
import { clampToBytes } from '@renderer/utils/byteLength'
import { useWriteContract } from '@renderer/hooks/useSintropTransaction'
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { useWaitForTransactionReceipt } from 'wagmi'
import { supporterAbi, supporterAddress } from '@renderer/services/contracts'
import { ConfirmButton } from './ConfirmButton'
import { base64ToBlob, uploadToIpfs } from '@renderer/services/ipfs'
import { ProofPhoto } from './ProofPhoto'
import { useTranslation } from 'react-i18next'
import { TransactionLoading } from '@renderer/components/TransactionLoading/TransactionLoading'
import { useSettingsContext } from '@renderer/hooks/useSettingsContext'
import { toast } from 'react-toastify'

interface Props {
  name: string
  /** Every contract requirement to register (invitation, vacancies, inviter standing). */
  requirementsMet: boolean
  success: () => void
}

export function SupporterRegistration({ name, requirementsMet, success }: Props): JSX.Element {
  const { ipfsApiUrl } = useSettingsContext()
  const { t } = useTranslation()
  const [profilePhoto, setProfilePhoto] = useState('')
  const [disableBtnRegister, setDisableBtnRegister] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [description, setDescription] = useState('')
  const [displayLoadingTx, setDisplayLoadingTx] = useState(false)

  const { writeContract, data: hash, isPending, isError, error } = useWriteContract()
  const {
    isLoading,
    isSuccess,
    isError: isErrorTx,
    error: errorTx
  } = useWaitForTransactionReceipt({ hash })
  const errorMessage = error ? error.message : errorTx ? errorTx.message : ''

  useEffect(() => {
    validityData()
  }, [name, profilePhoto, description, requirementsMet])

  function validityData(): void {
    if (!name.trim()) {
      setDisableBtnRegister(true)
      return
    }

    if (!description.trim()) {
      setDisableBtnRegister(true)
      return
    }

    if (!requirementsMet) {
      setDisableBtnRegister(true)
      return
    }

    setDisableBtnRegister(false)
  }

  async function uploadProfilePhoto(): Promise<string> {
    setUploadingImage(true)
    const blobImage = base64ToBlob(profilePhoto)
    const response = await uploadToIpfs({ file: blobImage, ipfsApiUrl })
    setUploadingImage(false)
    return response.hash
  }

  async function handleRegister(): Promise<void> {
    if (isLoading || isPending || uploadingImage) return

    let proofPhoto = ''

    if (profilePhoto !== '') {
      const hashProofPhoto = await uploadProfilePhoto()
      if (hashProofPhoto === '') {
        toast.error('error on upload profile photo')
        return
      } else {
        proofPhoto = hashProofPhoto
      }
    }

    setDisplayLoadingTx(true)

    writeContract({
      address: supporterAddress,
      abi: supporterAbi,
      functionName: 'addSupporter',
      args: [name, description, proofPhoto]
    })
  }

  return (
    <div className="flex flex-col z-0">
      <p className="text-gray-300 text-sm mt-5">{t('description')}</p>
      <input
        value={description}
        onChange={(e) => setDescription(clampToBytes(e.target.value, 200))}
        className="w-full h-11 rounded-xl bg-card-secondary px-3 text-white outline-none focus:ring-1 focus:ring-green-primary"
        placeholder={t('typeHere')}
      />
      <ByteCounter text={description} max={200} />

      <ProofPhoto proofPhoto={profilePhoto} onChange={setProfilePhoto} labelProfilePhoto />

      <ConfirmButton
        btnDisabled={disableBtnRegister}
        handleRegister={handleRegister}
        uploadingImage={uploadingImage}
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
    </div>
  )
}
