import { DataRow } from '@renderer/components/DataRow/DataRow'
import { activistAbi, activistAddress } from '@renderer/services/contracts'
import { ActivistProps } from '@renderer/types/activist'
import { useTranslation } from 'react-i18next'
import { formatUnits } from 'viem'
import { useReadContract } from 'wagmi'
import { UserTypeContentProps } from '../UserTypeContent'
import { HeaderUser } from '../HeaderUser/HeaderUser'
import { InvitationCard } from '../Cards/InvitationCard/InvitationCard'
import { InvitedUsersCard } from '../Cards/InvitedUsersCard/InvitedUsersCard'
import { ValidationsCard } from '../Cards/ValidationsCard/ValidationsCard'
import { DelationsCard } from '../Cards/DelationsCard/DelationsCard'
import { useInviterPenalties } from '@renderer/domain/Community/useCases/useInviterPenalties'

export function ActivistData({ address, profilePage }: UserTypeContentProps): JSX.Element {
  const { t } = useTranslation()

  const { penalties } = useInviterPenalties({ address })

  const { data } = useReadContract({
    address: activistAddress,
    abi: activistAbi,
    functionName: 'getActivist',
    args: [address]
  })

  const activist = data as ActivistProps

  return (
    <div className="flex flex-col pb-10">
      <HeaderUser
        address={address}
        areaPhotoUpdated={() => {}}
        name={activist?.name}
        userType={6}
        proofPhoto={activist?.proofPhoto}
      />

      {activist && (
        <div className="flex gap-5 mt-5 items-start">
          <div className="flex flex-col gap-5 flex-1">
            <div className="flex flex-col rounded-2xl bg-card-primary p-5">
              <p className="text-white font-bold mb-2">{t('common.data')}</p>
              <DataRow label="ID" value={formatUnits(BigInt(activist?.id), 0)} />
              <DataRow label={t('common.proofPhoto')} value={activist?.proofPhoto} />
              <DataRow
                label={t('common.level')}
                value={formatUnits(BigInt(activist?.pool?.level), 0)}
              />
              <DataRow
                label={t('account.eraPool')}
                value={formatUnits(BigInt(activist?.pool?.currentEra), 0)}
              />
              <DataRow
                label={t('account.registeredAt')}
                value={formatUnits(BigInt(activist?.createdAt), 0)}
              />
              <DataRow label={t('account.inviterPenalties')} value={penalties} danger />
            </div>

            <DelationsCard address={address} />
          </div>

          <div className="flex flex-col gap-5 max-w-[420px]">
            <InvitationCard address={address} />
            <InvitedUsersCard address={address} />
            <ValidationsCard address={address} profilePage={profilePage} />
          </div>
        </div>
      )}
    </div>
  )
}
