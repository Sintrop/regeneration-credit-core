/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { ProofPhoto } from './ProofPhoto'
import { useTranslation } from 'react-i18next'
import { useChainId, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { sequoiaInspectorAbi, sequoiaInspectorAddress } from '@renderer/services/contracts'

interface Props {
  name: string
}

export function InspectorRegistration({ name }: Props): JSX.Element {
  const { t } = useTranslation()
  const [proofPhoto, setProofPhoto] = useState('')
  const [disableBtnRegister, setDisableBtnRegister] = useState(false)

  const chainId = useChainId()
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash })

  useEffect(() => {
    validityData()
  }, [name, proofPhoto])

  function validityData(): void {
    if (!name.trim()) {
      setDisableBtnRegister(true)
      return
    }

    if (!proofPhoto.trim()) {
      setDisableBtnRegister(true)
      return
    }

    setDisableBtnRegister(false)
  }

  function handleRegister(): void {
    if (isLoading || isPending) return

    writeContract({
      address: chainId === 1600 ? sequoiaInspectorAddress : sequoiaInspectorAddress,
      abi: chainId === 1600 ? sequoiaInspectorAbi : sequoiaInspectorAbi,
      functionName: 'addInspector',
      args: [name, 'hashProofphoto']
    })
  }

  return (
    <div className="flex flex-col mb-10 z-0">
      <ProofPhoto proofPhoto={proofPhoto} onChange={setProofPhoto} />

      <button
        className={`bg-green-btn rounded-2xl px-10 h-10 text-white font-semibold mt-10 w-fit hover:cursor-pointer ${disableBtnRegister ? 'opacity-50' : 'opacity-100'}`}
        onClick={handleRegister}
        disabled={disableBtnRegister || isPending || isLoading}
      >
        {isPending ? t('confirmYourWallet') : t('register')}
      </button>

      {hash && (
        <div className="flex flex-col">
          <p className="text-white">Transaction hash: {hash}</p>
          {isLoading && (
            <>
              <p className="text-white">Waiting for confirmation...</p>
              <div className="w-10 h-10 bg-green-btn animate-spin" />
            </>
          )}
          {isSuccess && <p className="text-green-600">{t('transactionSuccess')}</p>}
        </div>
      )}

      {error && <p className="text-red-500">{error.message}</p>}
    </div>
  )
}
