import { DataRow } from '@renderer/components/DataRow/DataRow'
import { inspectorAbi, inspectorAddress } from '@renderer/services/contracts'
import { InspectorProps } from '@renderer/types/inspector'
import { useTranslation } from 'react-i18next'
import { formatUnits } from 'viem'
import { useReadContract } from 'wagmi'
import { UserTypeContentProps } from '../UserTypeContent'
import { HeaderUser } from '../HeaderUser/HeaderUser'
import { InvitationCard } from '../Cards/InvitationCard/InvitationCard'
import { ValidationsCard } from '../Cards/ValidationsCard/ValidationsCard'
import { DelationsCard } from '../Cards/DelationsCard/DelationsCard'

export function InspectorData({ address, profilePage }: UserTypeContentProps): JSX.Element {
  const { t } = useTranslation()

  const { data } = useReadContract({
    address: inspectorAddress,
    abi: inspectorAbi,
    functionName: 'getInspector',
    args: [address]
  })
  const inspector = data as InspectorProps

  const { data: responsePenalties } = useReadContract({
    address: inspectorAddress,
    abi: inspectorAbi,
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
        name={inspector?.name}
        userType={2}
        proofPhoto={inspector?.proofPhoto}
      />

      {inspector && (
        <div className="flex gap-5 mt-5 items-start">
          <div className="flex flex-col flex-1 gap-5">
            <div className="flex flex-col rounded-2xl bg-card-primary p-5">
              <p className="text-white font-bold mb-2">{t('common.data')}</p>
              <DataRow label="ID" value={formatUnits(BigInt(inspector?.id), 0)} />
              <DataRow label={t('common.proofPhoto')} value={inspector?.proofPhoto} />
              <DataRow
                label={t('account.totalInspections')}
                value={formatUnits(BigInt(inspector?.totalInspections), 0)}
              />
              <DataRow
                label={t('account.lastAcceptedAt')}
                value={formatUnits(BigInt(inspector?.lastAcceptedAt), 0)}
              />
              <DataRow
                label={t('account.lastInspection')}
                value={formatUnits(BigInt(inspector?.lastInspection), 0)}
              />
              <DataRow
                label={t('common.level')}
                value={formatUnits(BigInt(inspector?.pool?.level), 0)}
              />
              <DataRow
                label={t('account.eraPool')}
                value={formatUnits(BigInt(inspector?.pool?.currentEra), 0)}
              />
              <DataRow
                label={t('account.registeredAt')}
                value={formatUnits(BigInt(inspector?.createdAt), 0)}
              />

              <DataRow
                label={t('account.giveUps')}
                value={formatUnits(BigInt(inspector?.giveUps), 0)}
                danger
              />

              <DataRow label={t('account.penalties')} value={totalPenalties} danger />
            </div>

            <DelationsCard address={address} />
          </div>

          <div className="flex flex-col gap-5 flex-1 max-w-[420px]">
            <InvitationCard address={address} />
            <ValidationsCard address={address} profilePage={profilePage} />
          </div>
        </div>
      )}
    </div>
  )
}
