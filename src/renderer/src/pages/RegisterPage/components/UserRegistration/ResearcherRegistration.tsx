import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useWriteContract } from '@renderer/hooks/useSintropTransaction'
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { ProofPhoto } from './ProofPhoto'
import { useWaitForTransactionReceipt } from 'wagmi'
import { researcherAbi, researcherAddress } from '@renderer/services/contracts'
import { ConfirmButton } from './ConfirmButton'
import { base64ToBlob, uploadToIpfs } from '@renderer/services/ipfs'
import { TransactionLoading } from '@renderer/components/TransactionLoading/TransactionLoading'
import { useSettingsContext } from '@renderer/hooks/useSettingsContext'

interface Props {
  name: string
  /** Every contract requirement to register (invitation, vacancies, inviter standing). */
  requirementsMet: boolean
  success: () => void
}

export function ResearcherRegistration({ name, requirementsMet, success }: Props): JSX.Element {
  const { t } = useTranslation()
  const { ipfsApiUrl } = useSettingsContext()
  const [proofPhoto, setProofPhoto] = useState('')
  const [disableBtnRegister, setDisableBtnRegister] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [displayLoadingTx, setDisplayLoadingTx] = useState(false)

  const { writeContract, data: hash, isPending, error, isError } = useWriteContract()
  const {
    isLoading,
    isSuccess,
    isError: isErrorTx,
    error: errorTx
  } = useWaitForTransactionReceipt({ hash })
  const errorMessage = error ? error.message : errorTx ? errorTx.message : ''

  useEffect(() => {
    validityData()
  }, [name, proofPhoto, requirementsMet])

  function validityData(): void {
    if (!name.trim()) {
      setDisableBtnRegister(true)
      return
    }

    if (!proofPhoto.trim()) {
      setDisableBtnRegister(true)
      return
    }

    if (!requirementsMet) {
      setDisableBtnRegister(true)
      return
    }

    setDisableBtnRegister(false)
  }

  async function uploadProofPhoto(): Promise<string> {
    setUploadingImage(true)
    const blobImage = base64ToBlob(proofPhoto)
    const response = await uploadToIpfs({ file: blobImage, ipfsApiUrl })
    setUploadingImage(false)
    return response.hash
  }

  async function handleRegister(): Promise<void> {
    if (isLoading || isPending || uploadingImage) return

    const hashProofPhoto = await uploadProofPhoto()

    if (hashProofPhoto === '') {
      toast.error(t('registerPage.photoUploadError'))
      return
    }

    setDisplayLoadingTx(true)

    writeContract({
      address: researcherAddress,
      abi: researcherAbi,
      functionName: 'addResearcher',
      args: [name, hashProofPhoto]
    })
  }

  return (
    <div className="flex flex-col z-0">
      <ProofPhoto proofPhoto={proofPhoto} onChange={setProofPhoto} />

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
