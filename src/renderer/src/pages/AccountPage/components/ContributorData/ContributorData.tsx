import { DataRow } from '@renderer/components/DataRow/DataRow'
import { PublishedResources } from '../PublishedResources/PublishedResources'
import { contributorAbi, contributorAddress } from '@renderer/services/contracts'
import { ContributorProps } from '@renderer/types/contributor'
import { useTranslation } from 'react-i18next'
import { formatUnits } from 'viem'
import { useReadContract } from 'wagmi'
import { UserTypeContentProps } from '../UserTypeContent'
import { UserCanVote } from '../UserCanVote/UserCanVote'
import { HeaderUser } from '../HeaderUser/HeaderUser'
import { InvitationCard } from '../Cards/InvitationCard/InvitationCard'
import { InvitedUsersCard } from '../Cards/InvitedUsersCard/InvitedUsersCard'
import { ValidationsCard } from '../Cards/ValidationsCard/ValidationsCard'
import { DelationsCard } from '../Cards/DelationsCard/DelationsCard'
import { useInviterPenalties } from '@renderer/domain/Community/useCases/useInviterPenalties'

export function ContributorData({ address, profilePage }: UserTypeContentProps): JSX.Element {
  const { t } = useTranslation()

  const { penalties: inviterPenalties } = useInviterPenalties({ address })

  const { data } = useReadContract({
    address: contributorAddress,
    abi: contributorAbi,
    functionName: 'getContributor',
    args: [address]
  })
  const contributor = data as ContributorProps

  const { data: responsePenalties } = useReadContract({
    address: contributorAddress,
    abi: contributorAbi,
    functionName: 'totalPenalties',
    args: [address]
  })
  const totalPenalties = responsePenalties
    ? parseInt(formatUnits(BigInt(responsePenalties as string), 0))
    : 0

  return (
    <div className="flex flex-col pb-10">
      <HeaderUser
        address={address}
        areaPhotoUpdated={() => {}}
        name={contributor?.name}
        userType={5}
        proofPhoto={contributor?.proofPhoto}
      />

      {contributor && (
        <div className="flex gap-5 mt-5 items-start">
          <div className="flex flex-col gap-5 flex-1">
            <div className="flex flex-col rounded-2xl bg-card-primary p-5">
              <p className="text-white font-bold mb-2">{t('common.data')}</p>
              <DataRow label="ID" value={formatUnits(BigInt(contributor?.id), 0)} />
              <DataRow label={t('common.proofPhoto')} value={contributor?.proofPhoto} />
              <DataRow
                label={t('common.level')}
                value={formatUnits(BigInt(contributor?.pool?.level), 0)}
              />
              <DataRow
                label={t('account.eraPool')}
                value={formatUnits(BigInt(contributor?.pool?.currentEra), 0)}
              />
              <DataRow
                label={t('account.registeredAt')}
                value={formatUnits(BigInt(contributor?.createdAt), 0)}
              />

              <UserCanVote address={address} />

              <DataRow label={t('account.penalties')} value={totalPenalties} danger />

              <DataRow label={t('account.inviterPenalties')} value={inviterPenalties} danger />
            </div>

            <PublishedResources address={address} />
            <DelationsCard address={address} />
          </div>

          <div className="flex flex-col gap-5 flex-1 max-w-[420px]">
            <InvitationCard address={address} />
            <InvitedUsersCard address={address} />
            <ValidationsCard address={address} profilePage={profilePage} />
          </div>
        </div>
      )}
    </div>
  )
}
