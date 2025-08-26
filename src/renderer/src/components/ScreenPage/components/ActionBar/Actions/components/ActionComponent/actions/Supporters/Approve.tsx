import { useState } from 'react'
import { useWaitForTransactionReceipt } from 'wagmi'
import { useTranslation } from 'react-i18next'

import { useApprove } from '@renderer/domain/Supporter/useCases/useApprove'
import { TransactionLoading } from '@renderer/components/TransactionLoading/TransactionLoading'

interface Props {
  refetchAllowance: () => void
}
export function Approve({ refetchAllowance }: Props): JSX.Element {
  const { t } = useTranslation()
  const [inputAmmount, setInputAmmount] = useState('')
  const [displayLoadingTx, setDisplayLoadingTx] = useState(false)

  const { approve, isError, isPending, error, hash } = useApprove()

  const {
    isLoading,
    isSuccess,
    isError: isErrorTx,
    error: errorTx
  } = useWaitForTransactionReceipt({ hash })
  const errorMessage = error ? error : isErrorTx ? errorTx.message : ''

  function handleApprove(): void {
    if (!inputAmmount.trim()) return

    setDisplayLoadingTx(true)
    approve(inputAmmount)
  }

  function success(): void {
    setDisplayLoadingTx(false)
    setInputAmmount('')
    refetchAllowance()
  }

  return (
    <div className="flex flex-col gap-5">
      <p className="text-white">{t('actions.descApproveToPublish')}</p>

      <div className="flex flex-col gap-1">
        <p className="text-gray-300">{t('actions.labelInputAmmount')}</p>
        <input
          value={inputAmmount}
          className="w-full rounded-2xl px-3 bg-container-secondary text-white h-10"
          placeholder={t('common.typeHere')}
          onChange={(e) => setInputAmmount(e.target.value)}
          type="number"
        />
      </div>

      <button
        className="w-full h-10 rounded-2xl bg-blue-primary text-white font-semibold hover:cursor-pointer disabled:opacity-50 disabled:cursor-default"
        onClick={handleApprove}
        disabled={!inputAmmount.trim()}
      >
        {t('actions.approve')}
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
