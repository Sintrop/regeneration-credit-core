/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { ProofPhoto } from './ProofPhoto'
import { useChainId, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { sequoiaContributorAbi, sequoiaContributorAddress } from '@renderer/services/contracts'
import { InvitationProps } from '@renderer/types/invitation'
import { ConfirmButton } from './ConfirmButton'
import { WriteContractErrorType } from 'viem'
import { base64ToBlob, uploadToIpfs } from '@renderer/services/ipfs'

interface Props {
  name: string
  invitation: InvitationProps
  availableVacancie: boolean
}

export function ContributorRegistration({
  name,
  invitation,
  availableVacancie
}: Props): JSX.Element {
  const [proofPhoto, setProofPhoto] = useState('')
  const [disableBtnRegister, setDisableBtnRegister] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)

  const chainId = useChainId()
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash })

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

    if (invitation?.userType !== 5) {
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
    const response = await uploadToIpfs({ file: blobImage })
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

    writeContract({
      address: chainId === 1600 ? sequoiaContributorAddress : sequoiaContributorAddress,
      abi: chainId === 1600 ? sequoiaContributorAbi : sequoiaContributorAbi,
      functionName: 'addContributor',
      args: [name, hashProofPhoto]
    })
  }

  return (
    <div className="flex flex-col mb-10 z-0">
      <ProofPhoto proofPhoto={proofPhoto} onChange={setProofPhoto} />

      <ConfirmButton
        btnDisabled={disableBtnRegister}
        handleRegister={handleRegister}
        hash={hash}
        isLoading={isLoading}
        isPending={isPending}
        isSuccess={isSuccess}
        error={error as WriteContractErrorType}
        uploadingImage={uploadingImage}
      />
    </div>
  )
}
