import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useWaitForTransactionReceipt } from 'wagmi'

import { SelectCalculatorItem } from '../ModalSelectCalculatorItem/SelectCalculatorItem'
import { useOffset } from '@renderer/domain/Supporter/useCases/useOffset'
import { TransactionLoading } from '@renderer/components/TransactionLoading/TransactionLoading'
import RCLogo from '@renderer/assets/images/rc.png'
import { toast } from 'react-toastify'
import { useSwitchChain } from '@renderer/hooks/useChainSwitch'

interface Props {
  refecthAllowance: () => void
  tokensAllowed: number
  handleApproveMore: () => void
  close: () => void
}
export function SelectItem({
  refecthAllowance,
  tokensAllowed,
  handleApproveMore,
  close
}: Props): JSX.Element {
  const { switchChain, isSuccess: isSuccessSwitch } = useSwitchChain()
  const { t } = useTranslation()
  const [inputAmmount, setInputAmmount] = useState('')
  const [inputMessage, setInputMessage] = useState('')
  const [itemId, setItemId] = useState<number | null>()
  const [insufficientTokens, setInsufficientTokens] = useState(false)

  useEffect(() => {
    if (parseFloat(inputAmmount) > tokensAllowed) {
      setInsufficientTokens(true)
    } else {
      setInsufficientTokens(false)
    }
  }, [inputAmmount, tokensAllowed])

  const { isError, isPending, offset, error, hash } = useOffset()
  const {
    isLoading,
    isSuccess,
    isError: isErrorTx,
    error: errorTx
  } = useWaitForTransactionReceipt({ hash })
  const errorMessage = error ? error : errorTx ? errorTx.message : ''
  const [displayLoadingTx, setDisplayLoadingTx] = useState(false)

  async function handleOffset(): Promise<void> {
    if (!itemId || !inputAmmount.trim()) return
    setDisplayLoadingTx(true)

    await switchChain()
    if (!isSuccessSwitch) {
      setDisplayLoadingTx(false)
      return
    }

    offset({
      ammount: parseFloat(inputAmmount),
      calculatorItemId: itemId,
      message: inputMessage
    })
  }

  function success(): void {
    setDisplayLoadingTx(false)
    toast(t('actions.publishedOffset'), { type: 'success' })
    setInputAmmount('')
    setItemId(null)
    refecthAllowance()
    close()
  }

  return (
    <div className="flex flex-col">
      <p className="text-white">{t('actions.descOffset')}</p>

      <div className="flex items-center gap-3 mb-3">
        <img src={RCLogo} className="w-10 h-10 object-contain" />
        <div className="flex flex-col">
          <p className="text-gray-300 text-sm">{t('actions.totalTokensAllowed')}</p>
          <p className="font-bold text-white text-xl">
            {Intl.NumberFormat('pt-BR').format(tokensAllowed)} RC
          </p>
          <p
            className="text-sm text-white underline hover:cursor-pointer"
            onClick={handleApproveMore}
          >
            {t('actions.approveMore')}
          </p>
        </div>
      </div>

      <p className="text-sm mt-3 text-gray-300">{t('actions.labelAmmountPublish')}:</p>
      <input
        value={inputAmmount}
        className="w-full rounded-2xl px-3 bg-container-secondary text-white h-10"
        placeholder={t('common.typeHere')}
        onChange={(e) => setInputAmmount(e.target.value)}
        type="number"
      />
      {insufficientTokens && (
        <p className="text-red-500 mt-2">{t('actions.insufficientTokensAllowed')}</p>
      )}

      <p className="text-sm mt-3 text-gray-300">{t('actions.selectCalculatorItem')}:</p>
      <SelectCalculatorItem onChangeItem={(item) => setItemId(item?.id)} />

      <p className="text-sm mt-3 text-gray-300">{t('actions.labelMessage')}:</p>
      <input
        value={inputMessage}
        className="w-full rounded-2xl px-3 bg-container-secondary text-white h-10"
        placeholder={t('common.typeHere')}
        onChange={(e) => setInputMessage(e.target.value)}
        maxLength={300}
      />

      <button
        className="w-full h-10 mt-5 rounded-2xl bg-blue-primary text-white font-semibold hover:cursor-pointer disabled:cursor-default disabled:opacity-50"
        onClick={handleOffset}
        disabled={!itemId || !inputAmmount.trim()}
      >
        {t('actions.offset')}
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
