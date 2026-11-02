import { Modal } from '@renderer/components/Modal/Modal'
import { ByteCounter } from '@renderer/components/ByteCounter/ByteCounter'
import { clampToBytes } from '@renderer/utils/byteLength'
import { useWriteContract } from '@renderer/hooks/useSintropTransaction'
import { SendTransactionButton } from '@renderer/components/ScreenPage/components/ActionBar/Actions/components/SendTransactionButton/SendTransactionButton'
import { TransactionLoading } from '@renderer/components/TransactionLoading/TransactionLoading'
import { userAbi, userAddress } from '@renderer/services/contracts'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useWaitForTransactionReceipt } from 'wagmi'

interface Props {
  address: string
}
export function AddDelation({ address }: Props): JSX.Element {
  const { t } = useTranslation()
  const [showModal, setShowModal] = useState(false)

  const [inputTitle, setInputTitle] = useState('')
  const [inputTestimony, setInputTestimony] = useState('')

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
    setDisplayLoadingTx(true)

    writeContract({
      address: userAddress,
      abi: userAbi,
      functionName: 'addDelation',
      args: [address, inputTitle, inputTestimony]
    })
  }

  function success(): void {
    setDisplayLoadingTx(false)
    toast(t('actions.delationSent'), { type: 'success' })
    toggleShowModal()
  }

  function toggleShowModal(): void {
    setShowModal((value) => !value)
    setInputTestimony('')
    setInputTitle('')
  }

  return (
    <div className="flex flex-col">
      <button
        onClick={toggleShowModal}
        className="h-10 px-4 rounded-xl border border-amber-400/60 text-amber-300 text-sm font-semibold hover:cursor-pointer hover:bg-amber-400/10"
      >
        {t('account.addDelation')}
      </button>
      {showModal && (
        <Modal title={<>{t('account.addDelation')}</>} onClose={toggleShowModal}>
          <div className="max-h-[400px] overflow-y-auto">
            <p className="text-white my-5">{t('descActions.addDelation')}</p>

            <div className="flex flex-col pt-5">
              <p className="text-sm mt-3 text-gray-300">{t('actions.reportTitle')}:</p>
              <input
                value={inputTitle}
                className="w-full rounded-2xl px-3 bg-container-secondary text-white h-10"
                placeholder={t('actions.typeHere')}
                onChange={(e) => setInputTitle(clampToBytes(e.target.value, 100))}
              />
              <ByteCounter text={inputTitle} max={100} />

              <p className="text-sm mt-3 text-gray-300">{t('actions.reportTestimony')}:</p>
              <input
                value={inputTestimony}
                className="w-full rounded-2xl px-3 bg-container-secondary text-white h-10"
                placeholder={t('actions.typeHere')}
                onChange={(e) => setInputTestimony(clampToBytes(e.target.value, 300))}
              />
              <ByteCounter text={inputTestimony} max={300} />

              <SendTransactionButton
                label={t('actions.report')}
                handleSendTransaction={handleSendTransaction}
                disabled={!inputTestimony.trim() || !inputTitle.trim() || isPending}
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
          </div>
        </Modal>
      )}
    </div>
  )
}
