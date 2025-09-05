/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CalculatorItemProps } from '@renderer/types/researcher'
import { useChainId, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import {
  sequoiaSupporterAbi,
  sequoiaSupporterAddress,
  supporterAbi,
  supporterAddress
} from '@renderer/services/contracts'
import { TransactionLoading } from '@renderer/components/TransactionLoading/TransactionLoading'
import { toast } from 'react-toastify'
import { MdClose } from 'react-icons/md'

interface Props {
  item: CalculatorItemProps
}
export function ModalDeclareCalculator({ item }: Props): JSX.Element {
  const { t } = useTranslation()
  const [showModal, setShowModal] = useState(false)

  const chainId = useChainId()
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
      address: chainId === 250225 ? supporterAddress : sequoiaSupporterAddress,
      abi: chainId === 250225 ? supporterAbi : sequoiaSupporterAbi,
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
        className="w-[160px] h-10 rounded-2xl bg-green-500 text-white hover:cursor-pointer"
        onClick={handleShowModal}
      >
        {t('impactCalculator.declareReduction')}
      </button>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-container-primary p-6 rounded-2xl shadow-2xl w-[500px]">
            <div className="flex items-center justify-between w-full">
              <p className="text-white">{t('impactCalculator.declareReduction')}</p>
              <button className="hover:cursor-pointer text-white" onClick={handleCloseModal}>
                <MdClose size={25} color="white" />
              </button>
            </div>

            <div className="mt-5 flex flex-col gap-2">
              <p className="text-gray-200">{t('impactCalculator.descDeclareReduction')}</p>

              <p className="text-white">Item: {item.item}</p>

              <button
                className="w-full h-10 rounded-2xl mt-5 text-white bg-green-1 hover:cursor-pointer"
                onClick={handleSendTransaction}
              >
                {t('impactCalculator.declare')}
              </button>
            </div>
          </div>
        </div>
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
