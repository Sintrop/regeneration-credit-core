import { TransactionLoading } from '@renderer/components/TransactionLoading/TransactionLoading'
import {
  regeneratorAbi,
  regeneratorAddress,
  sequoiaRegeneratorAbi,
  sequoiaRegeneratorAddress
} from '@renderer/services/contracts'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MdClose } from 'react-icons/md'
import { useChainId, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'

interface Props {
  updated: () => void
}

export function UpdateAreaPhoto({ updated }: Props): JSX.Element {
  const { t } = useTranslation()
  const [showModal, setShowModal] = useState(false)
  const [url, setUrl] = useState('')
  const [displayLoadingTx, setDisplayLoadingTx] = useState(false)

  const chainId = useChainId()
  const { writeContract, data: hash, isPending, isError, error } = useWriteContract()
  const {
    isLoading,
    isSuccess,
    isError: isErrorTx,
    error: errorTx
  } = useWaitForTransactionReceipt({ hash })
  const errorMessage = error ? error.message : errorTx ? errorTx.message : ''

  function handleShowModal(): void {
    setShowModal(true)
  }

  function handleClose(): void {
    setShowModal(false)
  }

  function handleUpdate(): void {
    setDisplayLoadingTx(true)
    writeContract({
      address: chainId === 250225 ? regeneratorAddress : sequoiaRegeneratorAddress,
      abi: chainId === 250225 ? regeneratorAbi : sequoiaRegeneratorAbi,
      functionName: 'updateAreaPhoto',
      args: [url]
    })
  }

  function updateSuccess(): void {
    updated()
    setDisplayLoadingTx(false)
    handleClose()
    setUrl('')
  }

  return (
    <div className="flex flex-col">
      <button
        className="w-fit px-10 h-10 rounded-2xl text-white text-sm bg-green-1 hover:cursor-pointer"
        onClick={handleShowModal}
      >
        {t('updateAreaPhoto')}
      </button>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-green-card p-6 rounded-2xl shadow-2xl w-120 relative">
            <button className="absolute top-3 right-3 hover:cursor-pointer" onClick={handleClose}>
              <MdClose size={25} color="white" />
            </button>

            <p className="text-white text-center">{t('updateAreaPhoto')}</p>

            <p className="mt-5 text-gray-300 text-sm mb-1">{t('typeUrlOfAreaPhoto')}:</p>
            <input
              className="w-full h-10 rounded-2xl bg-container-secondary text-white px-3"
              placeholder={t('typeHere')}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />

            <button
              className="mt-5 w-full rounded-2xl bg-green-1 text-white h-10 hover:cursor-pointer disabled:opacity-40 disabled:cursor-default duration-200"
              disabled={!url.trim()}
              onClick={handleUpdate}
            >
              {t('update')}
            </button>
          </div>
        </div>
      )}

      {displayLoadingTx && (
        <TransactionLoading
          close={() => setDisplayLoadingTx(false)}
          ok={updateSuccess}
          isError={isError || isErrorTx}
          isPending={isPending}
          isSuccess={isSuccess}
          loading={isLoading}
          transactionHash={hash}
          errorMessage={errorMessage}
        />
      )}
    </div>
  )
}
