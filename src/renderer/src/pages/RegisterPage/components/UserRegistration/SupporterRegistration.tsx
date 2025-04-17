/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { useChainId, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import {
  sequoiaSupporterAbi,
  sequoiaSupporterAddress,
  supporterAbi,
  supporterAddress
} from '@renderer/services/contracts'
import { ConfirmButton } from './ConfirmButton'
import { WriteContractErrorType } from 'viem'
import { base64ToBlob, uploadToIpfs } from '@renderer/services/ipfs'
import { ProofPhoto } from './ProofPhoto'

interface Props {
  name: string
}

export function SupporterRegistration({ name }: Props): JSX.Element {
  const [profilePhoto, setProfilePhoto] = useState('')
  const [disableBtnRegister, setDisableBtnRegister] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)

  const chainId = useChainId()
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash })

  useEffect(() => {
    validityData()
  }, [name, profilePhoto])

  function validityData(): void {
    if (!name.trim()) {
      setDisableBtnRegister(true)
      return
    }

    if (!profilePhoto.trim()) {
      setDisableBtnRegister(true)
      return
    }

    setDisableBtnRegister(false)
  }

  async function uploadProfilePhoto(): Promise<string> {
    setUploadingImage(true)
    const blobImage = base64ToBlob(profilePhoto)
    const response = await uploadToIpfs({ file: blobImage })
    setUploadingImage(false)
    return response.hash
  }

  async function handleRegister(): Promise<void> {
    if (isLoading || isPending || uploadingImage) return

    const hashProofPhoto = await uploadProfilePhoto()

    if (hashProofPhoto === '') {
      alert('error on upload profile photo')
      return
    }

    writeContract({
      address: chainId === 250225 ? supporterAddress : sequoiaSupporterAddress,
      abi: chainId === 250225 ? supporterAbi : sequoiaSupporterAbi,
      functionName: 'addSupporter',
      args: [name, hashProofPhoto]
    })
  }

  return (
    <div className="flex flex-col mb-10 z-0">
      <ProofPhoto proofPhoto={profilePhoto} onChange={setProfilePhoto} />

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
