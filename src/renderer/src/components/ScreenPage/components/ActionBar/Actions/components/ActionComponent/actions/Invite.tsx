import { useChainId, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import {
  sequoiaInvitationAddress,
  invitationAddress,
  invitationAbi,
  sequoiaInvitationAbi
} from '@renderer/services/contracts'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { SendTransactionButton } from '../../SendTransactionButton/SendTransactionButton'
import { TransactionData } from '@renderer/components/TransactionData/TransactionData'
import { WriteContractErrorType } from 'viem'
import { ActionContractProps } from '../ActionComponent'
import { useCanInvite } from '@renderer/hooks/useCanInvite'
import { Loading } from '@renderer/components/Loading/Loading'

export function Invite({ userTypeToInvite }: ActionContractProps): JSX.Element {
  const chainId = useChainId()
  const { t } = useTranslation()
  const [inputAddress, setInputAddress] = useState('')
  const {
    canInvite,
    canInviteIn,
    canInviteThisUserType,
    isLoading: loadingCanInvite
  } = useCanInvite({ userTypeToInvite })

  const { writeContract, isPending, data: hash } = useWriteContract()
  const { isLoading, isSuccess, isError, error } = useWaitForTransactionReceipt({ hash })

  function handleSendTransaction(): void {
    if (!userTypeToInvite) return

    const functionName =
      userTypeToInvite === 1 || userTypeToInvite === 2 ? 'inviteRegeneratorInspector' : 'invite'
    writeContract({
      address: chainId === 250225 ? invitationAddress : sequoiaInvitationAddress,
      abi: chainId === 250225 ? invitationAbi : sequoiaInvitationAbi,
      functionName,
      args: [inputAddress, userTypeToInvite]
    })
  }

  if (loadingCanInvite) {
    return (
      <div className="flex flex-col items-center justify-center h-[200px] overflow-hidden">
        <Loading />
      </div>
    )
  }

  if (!canInviteThisUserType) {
    return (
      <div className="flex flex-col items-center justify-center h-[200px]">
        <p className="text-white text-center">{t("youCan'tInviteThisUserType")}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col pt-5">
      {canInvite ? (
        <>
          <p className="text-sm mt-3 text-gray-300">{t('whoDoYouWantToInvite')}:</p>
          <input
            value={inputAddress}
            className="w-full rounded-2xl px-3 bg-container-secondary text-white h-10"
            placeholder={t('Wallet')}
            onChange={(e) => setInputAddress(e.target.value)}
          />

          <SendTransactionButton
            label={t('invite')}
            handleSendTransaction={handleSendTransaction}
            disabled={!inputAddress.trim() || isPending}
          />

          <TransactionData
            hash={hash}
            isLoading={isLoading}
            isPending={isPending}
            isSuccess={isSuccess}
            errorTx={error as WriteContractErrorType}
            isError={isError}
          />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-[200px]">
          <p className="text-white text-center">{t("youCan'tInviteNow")}</p>
          <p className="text-white text-center">
            {t('wait')} {canInviteIn} {t('blocks')}
          </p>
        </div>
      )}
    </div>
  )
}
