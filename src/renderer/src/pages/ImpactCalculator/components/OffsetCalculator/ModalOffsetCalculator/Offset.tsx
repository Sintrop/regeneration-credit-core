import { CalculatorItemProps } from '@renderer/types/researcher'
import RcTokenImg from '@renderer/assets/images/rc.png'
import { useEffect, useState } from 'react'
import { useImpactPerToken } from '@renderer/hooks/useImpactPerToken'
import { formatUnits } from 'viem'
import { TransactionLoading } from '@renderer/components/TransactionLoading/TransactionLoading'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useOffset } from '@renderer/domain/Supporter/useCases/useOffset'
import { useWaitForTransactionReceipt } from 'wagmi'

interface Props {
  item: CalculatorItemProps
  close: () => void
  tokensAllowed: number
  handleApproveMore: () => void
}
export function Offset({ item, close, tokensAllowed, handleApproveMore }: Props): JSX.Element {
  const { t } = useTranslation()
  const { carbonPerToken } = useImpactPerToken()
  const [inputAmmount, setInputAmmount] = useState('')
  const [inputMessage, setInputMessage] = useState('')
  const [quantity, setQuantity] = useState('')
  const [mustCompensate, setMustCompensate] = useState(0)
  const [displayLoadingTx, setDisplayLoadingTx] = useState(false)
  const [insuffiecientAllowed, setInsufficientAllowed] = useState(false)

  const { isError, isPending, offset, error, hash } = useOffset()
  const {
    isLoading,
    isSuccess,
    isError: isErrorTx,
    error: errorTx
  } = useWaitForTransactionReceipt({ hash })
  const errorMessage = error ? error : errorTx ? errorTx.message : ''

  useEffect(() => {
    calculeMustCompensate()
  }, [quantity, carbonPerToken])

  useEffect(() => {
    checkInsufficientAllowed()
  }, [tokensAllowed, inputAmmount])

  function checkInsufficientAllowed(): void {
    if (!inputAmmount.trim()) setInsufficientAllowed(false)
    if (parseFloat(inputAmmount) > tokensAllowed) {
      setInsufficientAllowed(true)
    } else {
      setInsufficientAllowed(false)
    }
  }

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
    offset({
      ammount: parseFloat(inputAmmount),
      calculatorItemId: item.id,
      message: inputMessage
    })
  }

  function success(): void {
    setDisplayLoadingTx(false)
    toast(t('impactCalculator.realizedOffset'), { type: 'success' })
    setMustCompensate(0)
    setQuantity('')
    close()
  }

  return (
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

      <div className="flex gap-10 mt-5">
        <div className="flex flex-col gap-1 w-[50%]">
          <p className="text-gray-200">{t('impactCalculator.youMustCompensate')}</p>
          <div className="flex items-center gap-3">
            <img src={RcTokenImg} className="w-8 h-8 object-contain" />
            <p className="font-bold text-white">
              {Intl.NumberFormat('pt-BR', { maximumFractionDigits: 5 }).format(mustCompensate)} RC
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-1 w-[50%]">
          <p className="text-gray-200">{t('impactCalculator.tokensApproved')}</p>
          <div className="flex items-center gap-3">
            <img src={RcTokenImg} className="w-8 h-8 object-contain" />
            <p className="font-bold text-white">
              {Intl.NumberFormat('pt-BR', { maximumFractionDigits: 5 }).format(tokensAllowed)} RC
            </p>
          </div>
          <p
            className="text-sm text-white underline hover:cursor-pointer"
            onClick={handleApproveMore}
          >
            {t('impactCalculator.approveMore')}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-1 mt-5">
        <p className="text-gray-300">{t('impactCalculator.howMuchDoYouWantToCompensate')}</p>
        <input
          value={inputAmmount}
          className="w-full rounded-2xl px-3 bg-container-secondary text-white h-10"
          placeholder={t('common.typeHere')}
          onChange={(e) => setInputAmmount(e.target.value)}
          type="number"
        />
        {insuffiecientAllowed && (
          <p className="text-red-500 mt-2">{t('impactCalculator.insufficientTokensApproved')}</p>
        )}
      </div>

      <div className="flex flex-col gap-1 mt-5">
        <p className="text-gray-300">{t('impactCalculator.inputMessage')}</p>
        <input
          value={inputMessage}
          className="w-full rounded-2xl px-3 bg-container-secondary text-white h-10"
          placeholder={t('common.typeHere')}
          onChange={(e) => setInputMessage(e.target.value)}
        />
      </div>

      <button
        className="w-full h-10 rounded-2xl mt-5 text-white bg-green-1 hover:cursor-pointer disabled:opacity-50 disabled:cursor-default duration-200"
        onClick={handleSendTransaction}
        disabled={insuffiecientAllowed || !inputAmmount.trim()}
      >
        {t('impactCalculator.offset')}
      </button>

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
