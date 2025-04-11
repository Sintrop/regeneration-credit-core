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

export function Invite(): JSX.Element {
  const chainId = useChainId()
  const { t } = useTranslation()
  const [inputAddress, setInputAddress] = useState('')
  const [userTypeInvite, setUserTypeInvite] = useState('3')

  const { writeContract, isPending, data: hash, error } = useWriteContract()
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash })

  function handleSendTransaction(): void {
    writeContract({
      address: chainId === 250225 ? invitationAddress : sequoiaInvitationAddress,
      abi: chainId === 250225 ? invitationAbi : sequoiaInvitationAbi,
      functionName: 'invite',
      args: [inputAddress, parseInt(userTypeInvite)]
    })
  }

  return (
    <div className="flex flex-col pt-5">
      <p className="text-sm mt-3 text-gray-300">{t('whoDoYouWantToInvite')}:</p>
      <input
        value={inputAddress}
        className="w-full rounded-2xl px-3 bg-container-secondary text-white h-10"
        placeholder={t('Wallet')}
        onChange={(e) => setInputAddress(e.target.value)}
      />

      <p className="text-sm mt-3 text-gray-300">{t('whatUserType')}:</p>
      <select
        value={userTypeInvite}
        onChange={(e) => setUserTypeInvite(e.target.value)}
        className="w-full rounded-2xl px-3 bg-container-secondary text-white h-10"
      >
        <option value={3}>{t('researcher')}</option>
        <option value={4}>{t('developer')}</option>
        <option value={5}>{t('contributor')}</option>
        <option value={6}>{t('activist')}</option>
        <option value={7}>{t('supporter')}</option>
      </select>

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
      />
    </div>
  )
}
