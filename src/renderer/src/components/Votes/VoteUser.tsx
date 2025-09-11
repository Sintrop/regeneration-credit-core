import {
  sequoiaValidationAbi,
  sequoiaValidationAddress,
  validationAbi,
  validationAddress
} from '@renderer/services/contracts'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { SendTransactionButton } from '../ScreenPage/components/ActionBar/Actions/components/SendTransactionButton/SendTransactionButton'
import { useCanVote } from '@renderer/hooks/useCanVote'
import { Loading } from '../Loading/Loading'
import { useMainnet } from '@renderer/hooks/useMainnet'
import { toast } from 'react-toastify'
import { TransactionLoading } from '../TransactionLoading/TransactionLoading'

interface Props {
  userWallet: string
  close: () => void
}

export function VoteUser({ close, userWallet }: Props): JSX.Element {
  const { t } = useTranslation()
  const [justification, setJustification] = useState('')
  const mainnet = useMainnet()
  const { address } = useAccount()
  const {
    isLoading: checkingAvailableVote,
    canVote,
    canVoteThisResource,
    canVoteIn
  } = useCanVote({
    address: address ? address : '',
    resource: 'user',
    publishedEra: 0 //not available for user vote
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

  async function handleVoteUser(): Promise<void> {
    if (!justification.trim()) return

    const address = mainnet ? validationAddress : sequoiaValidationAddress
    const abi = mainnet ? validationAbi : sequoiaValidationAbi
    setDisplayLoadingTx(true)
    writeContract({
      abi,
      address,
      args: [userWallet, justification],
      functionName: 'addUserValidation'
    })
  }

  function success(): void {
    setDisplayLoadingTx(false)
    toast(t('vote.votedUser'), { type: 'success' })
    close()
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-20">
      <div className="bg-container-primary p-6 rounded-2xl shadow-2xl w-[500px]">
        <div className="flex items-center justify-between w-full">
          <p className="text-white">{t('vote.voteUser')}</p>
          <button className="hover:cursor-pointer text-white" onClick={close}>
            X
          </button>
        </div>

        {checkingAvailableVote ? (
          <div className="w-full h-[200] flex items-center justify-center overflow-hidden">
            <Loading />
          </div>
        ) : (
          <div className="mt-5">
            {canVoteThisResource ? (
              <>
                {canVote ? (
                  <div className="">
                    <p className="text-white">
                      {t('vote.youAreVotingToInvalidateTheUser')}: {userWallet}
                    </p>

                    <p className="text-gray-300 text-sm mt-5">{t('common.justification')}</p>
                    <input
                      value={justification}
                      onChange={(e) => setJustification(e.target.value)}
                      placeholder={t('common.typeHere')}
                      className="w-full rounded-2xl bg-container-secondary px-3 text-white h-10"
                      maxLength={300}
                    />

                    <SendTransactionButton
                      label={t('vote.vote')}
                      handleSendTransaction={handleVoteUser}
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
                <p className="text-white">{t('vote.youCanNotVote')}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
