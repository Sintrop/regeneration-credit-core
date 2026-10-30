import { Modal } from '@renderer/components/Modal/Modal'
import { useWriteContract } from '@renderer/hooks/useSintropTransaction'
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CalculatorItemProps } from '@renderer/types/researcher'
import { useWaitForTransactionReceipt } from 'wagmi'
import { supporterAbi, supporterAddress } from '@renderer/services/contracts'
import { TransactionLoading } from '@renderer/components/TransactionLoading/TransactionLoading'
import { toast } from 'react-toastify'

interface Props {
  item: CalculatorItemProps
}
export function ModalDeclareCalculator({ item }: Props): JSX.Element {
  const { t } = useTranslation()
  const [showModal, setShowModal] = useState(false)

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
      //@ts-ignore
      address: supporterAddress,
      abi: supporterAbi,
      functionName: 'declareReductionCommitment',
      args: [item.id]
    })
  }

  function success(): void {
    setDisplayLoadingTx(false)
    handleCloseModal()
    toast(t('impactCalculator.declaredReduction'), { type: 'success' })
    setShowModal(false)
  }

  function handleShowModal(): void {
    setShowModal(true)
  }

  function handleCloseModal(): void {
    setShowModal(false)
  }

  return (
    <div>
      <button
        className="w-full h-11 rounded-xl border border-green-primary text-green-primary font-semibold hover:bg-green-primary/10 hover:cursor-pointer"
        onClick={handleShowModal}
      >
        {t('impactCalculator.declareReduction')}
      </button>
      {showModal && (
        <Modal title={<>{t('impactCalculator.declareReduction')}</>} onClose={handleCloseModal}>
          <div className="mt-5 flex flex-col gap-2">
            <p className="text-gray-200">{t('impactCalculator.descDeclareReduction')}</p>

            <p className="text-white font-semibold">{item.item}</p>

            <button
              className="w-full h-11 rounded-xl mt-5 bg-green-primary text-green-secondary font-bold hover:cursor-pointer"
              onClick={handleSendTransaction}
            >
              {t('impactCalculator.declare')}
            </button>
          </div>
        </Modal>
      )}

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
