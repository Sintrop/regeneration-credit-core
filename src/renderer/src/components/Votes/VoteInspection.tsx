import {
  inspectionAbi,
  inspectionAddress,
  sequoiaInspectionAbi,
  sequoiaInspectionAddress
} from '@renderer/services/contracts'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { SendTransactionButton } from '../ScreenPage/components/ActionBar/Actions/components/SendTransactionButton/SendTransactionButton'
import { useCanVote } from '@renderer/hooks/useCanVote'
import { Loading } from '../Loading/Loading'
import { TransactionLoading } from '../TransactionLoading/TransactionLoading'
import { useMainnet } from '@renderer/hooks/useMainnet'
import { toast } from 'react-toastify'

interface Props {
  inspectionId: number
  close: () => void
  inspectedEra: number
}

export function VoteInspection({ close, inspectionId, inspectedEra }: Props): JSX.Element {
  const { t } = useTranslation()
  const [justification, setJustification] = useState('')
  const mainnet = useMainnet()
  const { address } = useAccount()
  const {
    isLoading: checkingAvailableVote,
    canVote,
    canVoteThisResource,
    differentEra,
    canVoteIn
  } = useCanVote({
    address: address ? address : '',
    resource: 'inspection',
    publishedEra: inspectedEra
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

  async function handleVoteInspection(): Promise<void> {
    if (!justification.trim()) return

    const address = mainnet ? inspectionAddress : sequoiaInspectionAddress
    const abi = mainnet ? inspectionAbi : sequoiaInspectionAbi

    setDisplayLoadingTx(true)
    writeContract({
      abi,
      address,
      args: [inspectionId, justification],
      functionName: 'addInspectionValidation'
    })
  }

  function success(): void {
    setDisplayLoadingTx(false)
    toast(t('vote.votedInspection'), { type: 'success' })
    close()
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-20">
      <div className="bg-container-primary p-6 rounded-2xl shadow-2xl w-[500px]">
        <div className="flex items-center justify-between w-full">
          <p className="text-white">{t('vote.voteInspection')}</p>
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
                <p className="text-white">{t('vote.voteInspectionDifferentEra')}</p>
              </div>
            ) : (
              <>
                {canVoteThisResource ? (
                  <>
                    {canVote ? (
                      <div className="">
                        <p className="text-white">
                          {t('vote.youAreVotingToInvalidateTheInspection')}: #{inspectionId}
                        </p>

                        <p className="text-gray-300 text-sm mt-5">{t('common.justification')}</p>
                        <input
                          value={justification}
                          onChange={(e) => setJustification(e.target.value)}
                          placeholder={t('common.typeHere')}
                          className="w-full rounded-2xl bg-container-secondary px-3 text-white h-10"
                        />

                        <SendTransactionButton
                          label={t('vote.vote')}
                          handleSendTransaction={handleVoteInspection}
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
      </div>
    </div>
  )
}
