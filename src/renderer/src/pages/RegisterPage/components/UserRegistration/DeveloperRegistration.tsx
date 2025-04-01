/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { ProofPhoto } from './ProofPhoto'
import { useChainId, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { sequoiaDeveloperAbi, sequoiaDeveloperAddress } from '@renderer/services/contracts'
import { InvitationProps } from '@renderer/types/invitation'
import { ConfirmButton } from './ConfirmButton'
import { WriteContractErrorType } from 'viem'

interface Props {
  name: string
  invitation: InvitationProps
}

export function DeveloperRegistration({ name, invitation }: Props): JSX.Element {
  const [proofPhoto, setProofPhoto] = useState('')
  const [disableBtnRegister, setDisableBtnRegister] = useState(false)

  const chainId = useChainId()
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash })

  useEffect(() => {
    validityData()
  }, [name, proofPhoto, invitation])

  function validityData(): void {
    if (!name.trim()) {
      setDisableBtnRegister(true)
      return
    }

    if (!proofPhoto.trim()) {
      setDisableBtnRegister(true)
      return
    }

    if (invitation?.userType !== 4) {
      setDisableBtnRegister(true)
      return
    }

    setDisableBtnRegister(false)
  }

  function handleRegister(): void {
    if (isLoading || isPending) return

    writeContract({
      address: chainId === 1600 ? sequoiaDeveloperAddress : sequoiaDeveloperAddress,
      abi: chainId === 1600 ? sequoiaDeveloperAbi : sequoiaDeveloperAbi,
      functionName: 'addDeveloper',
      args: [name, 'hashProofphoto']
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
      />
    </div>
  )
}
