import { Modal } from '@renderer/components/Modal/Modal'
import { ByteCounter } from '@renderer/components/ByteCounter/ByteCounter'
import { clampToBytes } from '@renderer/utils/byteLength'
import { useWriteContract } from '@renderer/hooks/useSintropTransaction'
import { contributorAbi, contributorAddress } from '@renderer/services/contracts'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAccount, useWaitForTransactionReceipt } from 'wagmi'
import { SendTransactionButton } from '../ScreenPage/components/ActionBar/Actions/components/SendTransactionButton/SendTransactionButton'
import { useCanVote } from '@renderer/hooks/useCanVote'
import { Loading } from '../Loading/Loading'
import { toast } from 'react-toastify'
import { TransactionLoading } from '../TransactionLoading/TransactionLoading'

interface Props {
  contributionId: number
  close: () => void
  publishedEra: number
}

export function VoteContribution({ close, contributionId, publishedEra }: Props): JSX.Element {
  const { t } = useTranslation()
  const [justification, setJustification] = useState('')
  const { address } = useAccount()
  const {
    isLoading: checkingAvailableVote,
    canVote,
    canVoteThisResource,
    differentEra,
    canVoteIn
  } = useCanVote({
    address: address ? address : '',
    resource: 'contribution',
    publishedEra
  })
  const { writeContract, isPending, data: hash, error, isError } = useWriteContract()
  const {
    isLoading,
    isSuccess,
    isError: isErrorTx,
    error: errorTx
  } = useWaitForTransactionReceipt({ hash })

  const errorMessage = error ? error.message : errorTx ? errorTx.message : ''
  const [displayLoadingTx, setDisplayLoadingTx] = useState(false)

  async function handleVoteContribution(): Promise<void> {
    if (!justification.trim()) return

    const address = contributorAddress
    const abi = contributorAbi

    setDisplayLoadingTx(true)

    writeContract({
      abi,
      address,
      args: [contributionId, justification],
      functionName: 'addContributionValidation'
    })
  }

  function success(): void {
    setDisplayLoadingTx(false)
    toast(t('vote.votedContribution'), { type: 'success' })
    close()
  }

  return (
    <Modal title={<>{t('vote.voteContribution')}</>} onClose={close}>
      {checkingAvailableVote ? (
        <div className="w-full h-[200] flex items-center justify-center overflow-hidden">
          <Loading />
        </div>
      ) : (
        <div className="mt-5">
          {differentEra ? (
            <div className="flex flex-col w-full h-[200px] items-center justify-center">
              <p className="text-white">{t('vote.voteContributionDifferentEra')}</p>
            </div>
          ) : (
            <>
              {canVoteThisResource ? (
                <>
                  {canVote ? (
                    <div className="">
                      <p className="text-white">
                        {t('vote.youAreVotingToInvalidateTheContribution')}: #{contributionId}
                      </p>

                      <p className="text-gray-300 text-sm mt-5">{t('common.justification')}</p>
                      <input
                        value={justification}
                        onChange={(e) => setJustification(clampToBytes(e.target.value, 300))}
                        placeholder={t('common.typeHere')}
                        className="w-full rounded-2xl bg-container-secondary px-3 text-white h-10"
                      />
                      <ByteCounter text={justification} max={300} />

                      <SendTransactionButton
                        label={t('vote.vote')}
                        handleSendTransaction={handleVoteContribution}
                        disabled={!justification.trim() || isLoading || isPending}
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
                  ) : (
                    <div className="flex flex-col w-full h-[200px] items-center justify-center">
                      <p className="text-white">{t('vote.youCanNotVoteNow')}</p>
                      <p className="text-white">
                        {t('common.wait')} {canVoteIn} {t('common.blocks')}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col w-full h-[200px] items-center justify-center">
                  <p className="text-white">{t('vote.youCanNotVoteThisResource')}</p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </Modal>
  )
}
