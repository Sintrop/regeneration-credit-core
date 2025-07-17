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
import { UserContentTabs } from '../Tabs/UserContentTabs'
import { VoteToInvalidate } from '@renderer/components/VoteToInvalidate/VoteToInvalidate'
import { UserCanVote } from '../UserCanVote/UserCanVote'
import { HeaderUser } from '../HeaderUser/HeaderUser'
import { InvitationCard } from '../InvitationCard/InvitationCard'

export function ActivistData({ address, profilePage }: UserTypeContentProps): JSX.Element {
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
      <HeaderUser
        address={address}
        areaPhotoUpdated={() => {}}
        name={activist.name}
        userType={6}
        proofPhoto={activist.proofPhoto}
      />

      {activist && (
        <div className="flex gap-10 mt-5">
          <div className="flex flex-col">
            <div className="flex flex-col gap-2 rounded-2xl bg-green-card p-3">
              <p className="text-gray-300 text-sm">{t('data')}</p>
              <p className="text-white">
                <span className="text-white font-bold">{t('id')}: </span>
                {formatUnits(BigInt(activist?.id), 0)}
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

              <UserCanVote address={address} />
            </div>

            <InvitationCard address={address} />
          </div>

          {!profilePage && <VoteToInvalidate resourceType="user" userWallet={address} />}
        </div>
      )}

      <UserContentTabs
        address={address}
        availableTabs={['approvedInvites', 'validations']}
        userType={6}
      />
    </div>
  )
}
