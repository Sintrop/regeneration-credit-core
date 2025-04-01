/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { useChainId, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { sequoiaSupporterAbi, sequoiaSupporterAddress } from '@renderer/services/contracts'
import { ConfirmButton } from './ConfirmButton'
import { WriteContractErrorType } from 'viem'

interface Props {
  name: string
}

export function SupporterRegistration({ name }: Props): JSX.Element {
  const [disableBtnRegister, setDisableBtnRegister] = useState(false)

  const chainId = useChainId()
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash })

  useEffect(() => {
    validityData()
  }, [name])

  function validityData(): void {
    if (!name.trim()) {
      setDisableBtnRegister(true)
      return
    }

    setDisableBtnRegister(false)
  }

  function handleRegister(): void {
    if (isLoading || isPending) return

    writeContract({
      address: chainId === 1600 ? sequoiaSupporterAddress : sequoiaSupporterAddress,
      abi: chainId === 1600 ? sequoiaSupporterAbi : sequoiaSupporterAbi,
      functionName: 'addSupporter',
      args: [name]
    })
  }

  return (
    <div className="flex flex-col mb-10 z-0">
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
