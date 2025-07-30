/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { ProofPhoto } from './ProofPhoto'
import { useChainId, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { sequoiaActivistAbi, sequoiaActivistAddress } from '@renderer/services/contracts'
import { InvitationProps } from '@renderer/types/invitation'
import { ConfirmButton } from './ConfirmButton'
import { base64ToBlob, uploadToIpfs } from '@renderer/services/ipfs'
import { TransactionLoading } from '@renderer/components/TransactionLoading/TransactionLoading'
import { useSettingsContext } from '@renderer/hooks/useSettingsContext'

interface Props {
  name: string
  invitation: InvitationProps
  availableVacancie: boolean
  success: () => void
}

export function ActivistRegistration({
  name,
  invitation,
  availableVacancie,
  success
}: Props): JSX.Element {
  const { ipfsApiUrl } = useSettingsContext()
  const [proofPhoto, setProofPhoto] = useState('')
  const [disableBtnRegister, setDisableBtnRegister] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [displayLoadingTx, setDisplayLoadingTx] = useState(false)
  const chainId = useChainId()
  const { writeContract, data: hash, isPending, isError, error } = useWriteContract()
  const {
    isLoading,
    isSuccess,
    error: errorTx,
    isError: isErrorTx
  } = useWaitForTransactionReceipt({ hash })
  const errorMessage = error ? error.message : errorTx ? errorTx.message : ''

  useEffect(() => {
    validityData()
  }, [name, proofPhoto, invitation, availableVacancie])

  function validityData(): void {
    if (!name.trim()) {
      setDisableBtnRegister(true)
      return
    }

    if (!proofPhoto.trim()) {
      setDisableBtnRegister(true)
      return
    }

    if (invitation?.userType !== 6) {
      setDisableBtnRegister(true)
      return
    }

    if (!availableVacancie) {
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
      alert('error on upload proof photo')
      return
    }

    setDisplayLoadingTx(true)
    writeContract({
      address: chainId === 1600 ? sequoiaActivistAddress : sequoiaActivistAddress,
      abi: chainId === 1600 ? sequoiaActivistAbi : sequoiaActivistAbi,
      functionName: 'addActivist',
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
