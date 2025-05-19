import {
  researcherAbi,
  researcherAddress,
  sequoiaResearcherAbi,
  sequoiaResearcherAddress
} from '@renderer/services/contracts'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAccount, useChainId, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { TransactionData } from '../TransactionData/TransactionData'
import { WriteContractErrorType } from 'viem'
import { SendTransactionButton } from '../ScreenPage/components/ActionBar/Actions/components/SendTransactionButton/SendTransactionButton'
import { useCanVote } from '@renderer/hooks/useCanVote'
import { Loading } from '../Loading/Loading'

interface Props {
  researchId: number
  close: () => void
  publishedEra: number
}

export function VoteResearch({ close, researchId, publishedEra }: Props): JSX.Element {
  const { t } = useTranslation()
  const [justification, setJustification] = useState('')
  const chainId = useChainId()
  const { address } = useAccount()
  const {
    isLoading: checkingAvailableVote,
    canVote,
    canVoteThisResource,
    differentEra
  } = useCanVote({
    address: address ? address : '',
    resource: 'research',
    publishedEra
  })
  const { writeContract, isPending, data: hash } = useWriteContract()
  const { isLoading, isSuccess, isError, error } = useWaitForTransactionReceipt({ hash })

  async function handleVoteResearch(): Promise<void> {
    if (!justification.trim()) return

    const address = chainId === 250225 ? researcherAddress : sequoiaResearcherAddress
    const abi = chainId === 250225 ? researcherAbi : sequoiaResearcherAbi

    writeContract({
      abi,
      address,
      args: [researchId, justification],
      functionName: 'addResearchValidation'
    })
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-20">
      <div className="bg-container-primary p-6 rounded-2xl shadow-2xl w-96">
        <div className="flex items-center justify-between w-full">
          <p className="text-white">{t('voteResearch')}</p>
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
            {differentEra ? (
              <div className="flex flex-col w-full h-[200px] items-center justify-center">
                <p className="text-white">
                  {t('youCannotVoteOnAResearchThatWasPublishedInAnEraOtherThanTheCurrentOne')}
                </p>
              </div>
            ) : (
              <>
                {canVoteThisResource ? (
                  <>
                    {canVote ? (
                      <div className="">
                        <p className="text-white">
                          {t('youAreVotingToInvalidateTheResearch')}: #{researchId}
                        </p>

                        <p className="text-gray-300 text-sm mt-5">{t('justification')}</p>
                        <input
                          value={justification}
                          onChange={(e) => setJustification(e.target.value)}
                          placeholder={t('typeHere')}
                          className="w-full rounded-2xl bg-container-secondary px-3 text-white h-10"
                        />

                        <SendTransactionButton
                          label={t('vote')}
                          handleSendTransaction={handleVoteResearch}
                          disabled={!justification.trim() || isLoading || isPending}
                        />

                        <TransactionData
                          errorTx={error as WriteContractErrorType}
                          hash={hash}
                          isLoading={isLoading}
                          isPending={isPending}
                          isSuccess={isSuccess}
                          isError={isError}
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col w-full h-[200px] items-center justify-center">
                        <p className="text-white">{t("youCan'tVoteNow")}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col w-full h-[200px] items-center justify-center">
                    <p className="text-white">{t("youCan'tVoteThisResource")}</p>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
