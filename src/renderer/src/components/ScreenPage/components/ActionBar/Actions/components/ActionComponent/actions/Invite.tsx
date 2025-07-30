import { useState } from 'react'
import { useChainId, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import {
  sequoiaInvitationAddress,
  invitationAddress,
  invitationAbi,
  sequoiaInvitationAbi
} from '@renderer/services/contracts'
import { useTranslation } from 'react-i18next'
import { SendTransactionButton } from '../../SendTransactionButton/SendTransactionButton'
import { ActionContractProps } from '../ActionComponent'
import { useCanInvite } from '@renderer/hooks/useCanInvite'
import { Loading } from '@renderer/components/Loading/Loading'
import { TransactionLoading } from '@renderer/components/TransactionLoading/TransactionLoading'

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

  const { writeContract, isPending, data: hash, isError, error } = useWriteContract()
  const {
    isLoading,
    isSuccess,
    isError: isErrorTx,
    error: errorTx
  } = useWaitForTransactionReceipt({ hash })
  const errorMessage = error ? error.message : errorTx ? errorTx.message : ''
  const [displayLoadingTx, setDisplayLoadingTx] = useState(false)

  function handleSendTransaction(): void {
    if (!userTypeToInvite) return

    const functionName =
      userTypeToInvite === 1 || userTypeToInvite === 2 ? 'inviteRegeneratorInspector' : 'invite'

    setDisplayLoadingTx(true)
    writeContract({
      address: chainId === 250225 ? invitationAddress : sequoiaInvitationAddress,
      abi: chainId === 250225 ? invitationAbi : sequoiaInvitationAbi,
      functionName,
      args: [inputAddress, userTypeToInvite]
    })
  }

  function success(): void {
    setDisplayLoadingTx(false)
    alert(t('burnedTokens'))
    setInputAddress('')
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
