import { DataRow } from '@renderer/components/DataRow/DataRow'
import { PublishedResources } from '../PublishedResources/PublishedResources'
import { developerAbi, developerAddress } from '@renderer/services/contracts'
import { DeveloperProps } from '@renderer/types/developer'
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

export function DeveloperData({ address, profilePage }: UserTypeContentProps): JSX.Element {
  const { t } = useTranslation()

  const { penalties: inviterPenalties } = useInviterPenalties({ address })

  const { data } = useReadContract({
    address: developerAddress,
    abi: developerAbi,
    functionName: 'getDeveloper',
    args: [address]
  })

  const developer = data as DeveloperProps

  const { data: responsePenalties } = useReadContract({
    address: developerAddress,
    abi: developerAbi,
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
        name={developer?.name}
        userType={4}
        proofPhoto={developer?.proofPhoto}
      />

      {developer && (
        <div className="flex gap-5 mt-5 items-start">
          <div className="flex flex-col flex-1">
            <div className="flex flex-col rounded-2xl bg-card-primary p-5">
              <p className="text-white font-bold mb-2">{t('common.data')}</p>
              <DataRow label="ID" value={formatUnits(BigInt(developer?.id), 0)} />
              <DataRow label={t('common.proofPhoto')} value={developer?.proofPhoto} />
              <DataRow
                label={t('account.totalReports')}
                value={formatUnits(BigInt(developer?.totalReports), 0)}
              />
              <DataRow
                label={t('account.lastPublishedAt')}
                value={formatUnits(BigInt(developer?.lastPublishedAt), 0)}
              />
              <DataRow
                label={t('account.eraPool')}
                value={formatUnits(BigInt(developer?.pool?.currentEra), 0)}
              />
              <DataRow
                label={t('account.poolLevel')}
                value={formatUnits(BigInt(developer?.pool?.level), 0)}
              />
              <DataRow
                label={t('account.registeredAt')}
                value={formatUnits(BigInt(developer?.createdAt), 0)}
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
