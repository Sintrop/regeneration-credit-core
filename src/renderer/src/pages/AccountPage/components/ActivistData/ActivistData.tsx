import {
  activistAbi,
  activistAddress,
  sequoiaActivistAbi,
  sequoiaActivistAddress
} from '@renderer/services/contracts'
import { ActivistProps } from '@renderer/types/activist'
import { useTranslation } from 'react-i18next'
import { formatUnits } from 'viem'
import { useChainId, useReadContract } from 'wagmi'
import { UserTypeContentProps } from '../UserTypeContent'
import { ProofPhoto } from '../ProofPhoto/ProofPhoto'
import { UserContentTabs } from '../Tabs/UserContentTabs'
import { VoteToInvalidate } from '@renderer/components/VoteToInvalidate/VoteToInvalidate'

export function ActivistData({ address }: UserTypeContentProps): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()

  const { data } = useReadContract({
    address: chainId === 250225 ? activistAddress : sequoiaActivistAddress,
    abi: chainId === 250225 ? activistAbi : sequoiaActivistAbi,
    functionName: 'getActivist',
    args: [address]
  })

  const activist = data as ActivistProps

  return (
    <div className="flex flex-col">
      <ProofPhoto address={address} hash={activist && activist?.proofPhoto} />

      {activist && (
        <div className="flex gap-10">
          <div className="flex flex-col gap-2 mt-2">
            <p className="text-white mt-5">{address}</p>
            <p className="text-white">
              <span className="text-white font-bold">{t('id')}: </span>
              {formatUnits(BigInt(activist?.id), 0)}
            </p>
            <p className="text-white">
              <span className="text-white font-bold">{t('name')}: </span>
              {activist?.name}
            </p>
            <p className="text-white">
              <span className="text-white font-bold">{t('proofPhoto')}: </span>
              {activist?.proofPhoto}
            </p>
            <p className="text-white">
              <span className="text-white font-bold">{t('level')}: </span>
              {formatUnits(BigInt(activist?.pool?.level), 0)}
            </p>
            <p className="text-white">
              <span className="text-white font-bold">{t('eraPool')}: </span>
              {formatUnits(BigInt(activist?.pool?.currentEra), 0)}
            </p>
            <p className="text-white">
              <span className="text-white font-bold">{t('registeredAt')}: </span>
              {formatUnits(BigInt(activist?.createdAt), 0)}
            </p>
            <p className="text-white">
              <span className="text-white font-bold">{t('userType')}: </span> 6
            </p>
          </div>

          <VoteToInvalidate resourceType="user" userWallet={address} />
        </div>
      )}

      <UserContentTabs
        address={address}
        availableTabs={['certificates', 'invitation', 'approvedInvites', 'validations']}
      />
    </div>
  )
}
