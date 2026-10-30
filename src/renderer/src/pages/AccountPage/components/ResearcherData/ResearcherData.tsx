import { DataRow } from '@renderer/components/DataRow/DataRow'
import { PublishedResources } from '../PublishedResources/PublishedResources'
import { researcherAbi, researcherAddress } from '@renderer/services/contracts'
import { ResearcherProps } from '@renderer/types/researcher'
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

export function ResearcherData({ address, profilePage }: UserTypeContentProps): JSX.Element {
  const { t } = useTranslation()

  const { penalties: inviterPenalties } = useInviterPenalties({ address })

  const { data } = useReadContract({
    address: researcherAddress,
    abi: researcherAbi,
    functionName: 'getResearcher',
    args: [address]
  })

  const researcher = data as ResearcherProps

  const { data: responsePenalties } = useReadContract({
    address: researcherAddress,
    abi: researcherAbi,
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
        name={researcher?.name}
        userType={3}
        proofPhoto={researcher?.proofPhoto}
      />

      {researcher && (
        <div className="flex gap-5 mt-5 items-start">
          <div className="flex flex-col gap-5 flex-1">
            <div className="flex flex-col rounded-2xl bg-card-primary p-5">
              <p className="text-white font-bold mb-2">{t('common.data')}</p>
              <DataRow label="ID" value={formatUnits(BigInt(researcher?.id), 0)} />
              <DataRow label={t('common.proofPhoto')} value={researcher?.proofPhoto} />
              <DataRow
                label={t('common.level')}
                value={formatUnits(BigInt(researcher?.pool?.level), 0)}
              />
              <DataRow
                label={t('account.eraPool')}
                value={formatUnits(BigInt(researcher?.pool?.currentEra), 0)}
              />
              <DataRow
                label={t('account.publishedResearches')}
                value={formatUnits(BigInt(researcher?.publishedResearches), 0)}
              />
              <DataRow
                label={t('account.lastPublishedAt')}
                value={formatUnits(BigInt(researcher?.lastPublishedAt), 0)}
              />
              <DataRow
                label={t('account.lastCalculatorItemAt')}
                value={formatUnits(BigInt(researcher?.lastCalculatorItemAt), 0)}
              />
              <DataRow
                label={t('account.registeredAt')}
                value={formatUnits(BigInt(researcher?.createdAt), 0)}
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
