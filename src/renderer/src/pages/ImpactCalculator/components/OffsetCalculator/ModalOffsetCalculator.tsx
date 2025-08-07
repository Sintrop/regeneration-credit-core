/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CalculatorItemProps } from '@renderer/types/researcher'
import RcTokenImg from '@renderer/assets/images/rc.png'
import { useBalanceRc } from '@renderer/hooks/useBalanceRc'
import { useImpactPerToken } from '@renderer/hooks/useImpactPerToken'
import { formatUnits, parseEther } from 'viem'
import { useChainId, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { rcAbi, rcAddress, sequoiaRcAbi, sequoiaRcAddress } from '@renderer/services/contracts'
import { TransactionLoading } from '@renderer/components/TransactionLoading/TransactionLoading'

interface Props {
  item: CalculatorItemProps
}
export function ModalOffsetCalculator({ item }: Props): JSX.Element {
  const { t } = useTranslation()
  const { carbonPerToken } = useImpactPerToken()
  const { balance } = useBalanceRc()
  const [showModal, setShowModal] = useState(false)
  const [quantity, setQuantity] = useState('')
  const [mustCompensate, setMustCompensate] = useState(0)

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

  useEffect(() => {
    calculeMustCompensate()
  }, [quantity, carbonPerToken])

  function calculeMustCompensate(): void {
    if (!quantity.trim()) {
      setMustCompensate(0)
      return
    }

    const itemImpact = parseInt(formatUnits(BigInt(item.carbonImpact), 0))
    const totalImpact = parseFloat(quantity) * itemImpact
    const result = totalImpact / carbonPerToken
    setMustCompensate(result === Infinity ? 0 : result)
  }

  async function handleSendTransaction(): Promise<void> {
    setDisplayLoadingTx(true)
    writeContract({
      //@ts-ignore
      address: chainId === 250225 ? rcAddress : sequoiaRcAddress,
      abi: chainId === 250225 ? rcAbi : sequoiaRcAbi,
      functionName: 'offset',
      args: [parseEther(mustCompensate.toString()), item.id]
    })
  }

  function success(): void {
    setDisplayLoadingTx(false)
    handleCloseModal()
    alert(t('impactCalculator.realizedOffset'))
    setMustCompensate(0)
    setQuantity('')
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
        className="w-[100px] h-10 rounded-2xl bg-red-500 text-white hover:cursor-pointer"
        onClick={handleShowModal}
      >
        {t('impactCalculator.offset')}
      </button>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-container-primary p-6 rounded-2xl shadow-2xl w-96">
            <div className="flex items-center justify-between w-full">
              <p className="text-white">{t('impactCalculator.offset')}</p>
              <button className="hover:cursor-pointer text-white" onClick={handleCloseModal}>
                X
              </button>
            </div>

            <div className="flex flex-col mt-5">
              <p className="text-gray-200">{t('impactCalculator.quantityItemUse')}:</p>
              <p className="text-white">
                {item.item} ({item.unit})
              </p>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full h-10 rounded-2xl px-3 text-white bg-container-secondary"
                placeholder={t('impactCalculator.typeHere')}
              />

              <p className="text-gray-200 mt-5">{t('impactCalculator.youMustCompensate')}</p>
              <div className="flex items-center gap-3">
                <img src={RcTokenImg} className="w-10 h-10 object-contain" />
                <p className="font-bold text-white text-xl">
                  {Intl.NumberFormat('pt-BR', { maximumFractionDigits: 5 }).format(mustCompensate)}{' '}
                  RC
                </p>
              </div>

              <p className="text-gray-200 mt-5">{t('impactCalculator.yourBalance')}</p>
              <div className="flex items-center gap-3">
                <img src={RcTokenImg} className="w-10 h-10 object-contain" />
                <p className="font-bold text-white text-xl">
                  {Intl.NumberFormat('pt-BR', { maximumFractionDigits: 5 }).format(balance)} RC
                </p>
              </div>

              <button
                className="w-full h-10 rounded-2xl mt-5 text-white bg-green-1 hover:cursor-pointer"
                onClick={handleSendTransaction}
              >
                {t('impactCalculator.offset')}
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
