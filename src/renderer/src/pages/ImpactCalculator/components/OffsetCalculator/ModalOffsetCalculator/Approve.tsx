import { useEffect, useState } from 'react'
import { useWaitForTransactionReceipt } from 'wagmi'
import { useTranslation } from 'react-i18next'

import { useApprove } from '@renderer/domain/Supporter/useCases/useApprove'
import { TransactionLoading } from '@renderer/components/TransactionLoading/TransactionLoading'
import { useBalance } from '@renderer/domain/RegenerationCredit/useCases/useBalance'

import RCLogo from '@renderer/assets/images/rc.png'
import { useSwitchChain } from '@renderer/hooks/useChainSwitch'

interface Props {
  refetchAllowance: () => void
}
export function Approve({ refetchAllowance }: Props): JSX.Element {
  const { t } = useTranslation()
  const [inputAmmount, setInputAmmount] = useState('')
  const [insufficientBalance, setInsufficientBalance] = useState(false)
  const [displayLoadingTx, setDisplayLoadingTx] = useState(false)
  const { switchChain, isSuccess: isSuccessSwitch } = useSwitchChain()

  const { approve, isError, isPending, error, hash } = useApprove()
  const { balance } = useBalance()
  const {
    isLoading,
    isSuccess,
    isError: isErrorTx,
    error: errorTx
  } = useWaitForTransactionReceipt({ hash })
  const errorMessage = error ? error : isErrorTx ? errorTx.message : ''

  useEffect(() => {
    checkInsufficientBalance()
  }, [balance, inputAmmount])

  function checkInsufficientBalance(): void {
    if (!inputAmmount.trim()) setInsufficientBalance(false)
    if (parseFloat(inputAmmount) > balance) {
      setInsufficientBalance(true)
    } else {
      setInsufficientBalance(false)
    }
  }

  async function handleApprove(): Promise<void> {
    if (!inputAmmount.trim()) return

    setDisplayLoadingTx(true)

    await switchChain()
    if (!isSuccessSwitch) {
      setDisplayLoadingTx(false)
      return
    }

    approve(inputAmmount)
  }

  function success(): void {
    setDisplayLoadingTx(false)
    setInputAmmount('')
    refetchAllowance()
  }

  return (
    <div className="flex flex-col gap-5 mt-5">
      <p className="text-white">{t('impactCalculator.descApproveToPublish')}</p>

      <div className="flex flex-col gap-1">
        <p className="text-gray-300">{t('common.yourBalance')}</p>
        <div className="flex items-center gap-3">
          <img src={RCLogo} className="w-10 h-10 object-contain" />
          <p className="font-bold text-white text-lg">
            {Intl.NumberFormat('pt-BR', { maximumFractionDigits: 5 }).format(balance)} RC
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-gray-300">{t('impactCalculator.labelInputAmmount')}</p>
        <input
          value={inputAmmount}
          className="w-full rounded-2xl px-3 bg-container-secondary text-white h-10"
          placeholder={t('common.typeHere')}
          onChange={(e) => setInputAmmount(e.target.value)}
          type="number"
        />
        {insufficientBalance && (
          <p className="text-red-500 mt-2">{t('impactCalculator.insufficientBalance')}</p>
        )}
      </div>

      <button
        className="w-full h-10 rounded-2xl bg-blue-primary text-white font-semibold hover:cursor-pointer disabled:opacity-50 disabled:cursor-default"
        onClick={handleApprove}
        disabled={!inputAmmount.trim() || insufficientBalance}
      >
        {t('impactCalculator.approve')}
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
