import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useWaitForTransactionReceipt } from 'wagmi'
import { toast } from 'react-toastify'

import { TransactionLoading } from '@renderer/components/TransactionLoading/TransactionLoading'
import { useVoteOnDelation } from '@renderer/domain/Community/useCases/useVoteOnDelation'

interface Props {
  delationId: number
  thumbsUp: number
  thumbsDown: number
  refetchData: () => void
}
export function VoteDelation({
  delationId,
  thumbsDown,
  thumbsUp,
  refetchData
}: Props): JSX.Element {
  const { t } = useTranslation()
  const [displayLoadingTx, setDisplayLoadingTx] = useState(false)

  const { isError, isPending, voteOnDelation, error, hash } = useVoteOnDelation()
  const {
    isLoading,
    isSuccess,
    isError: isErrorTx,
    error: errorTx
  } = useWaitForTransactionReceipt({ hash })
  const errorMessage = error ? error : isErrorTx ? errorTx.message : ''

  function handleVote(supports: boolean): void {
    setDisplayLoadingTx(true)
    voteOnDelation({
      delationId,
      supportsDelation: supports
    })
  }

  function success(): void {
    setDisplayLoadingTx(false)
    toast.success(t('feed.voteSent'))
    refetchData()
  }

  return (
    <div className="flex flex-col gap-1 mt-3">
      <p className="text-gray-300 text-sm">{t('feed.supportsDelation')}</p>

      <div className="flex items-center gap-5">
        <div className="flex flex-col items-center gap-1">
          <button
            className="border border-red-500 w-32 h-8 rounded-2xl text-red-500 hover:cursor-pointer"
            onClick={() => handleVote(false)}
          >
            {t('common.no')}
          </button>
          <p className="text-xs text-white">
            {thumbsDown} {t('feed.votes')}
          </p>
        </div>

        <div className="flex flex-col items-center gap-1">
          <button
            className="border border-green-500 w-32 h-8 rounded-2xl text-green-500 hover:cursor-pointer"
            onClick={() => handleVote(true)}
          >
            {t('common.yes')}
          </button>
          <p className="text-xs text-white">
            {thumbsUp} {t('feed.votes')}
          </p>
        </div>
      </div>

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
