import { DataRow } from '@renderer/components/DataRow/DataRow'
import { supporterAbi, supporterAddress } from '@renderer/services/contracts'
import { SupporterProps } from '@renderer/types/supporter'
import { useTranslation } from 'react-i18next'
import { formatUnits } from 'viem'
import { useReadContract } from 'wagmi'
import { UserTypeContentProps } from '../UserTypeContent'
import { HeaderUser } from '../HeaderUser/HeaderUser'
import { InvitationCard } from '../Cards/InvitationCard/InvitationCard'
import { CertificatesCard } from '../../../../components/CertificatesCard/CertificatesCard'
import { ReductionCommitmentsCard } from '../Cards/ReductionCommitmentsCard/ReductionCommitmentsCard'
import { InvitedUsersCard } from '../Cards/InvitedUsersCard/InvitedUsersCard'
import { SupporterCompensations } from './SupporterCompensations'

export function SupporterData({ address }: UserTypeContentProps): JSX.Element {
  const { t } = useTranslation()

  const { data } = useReadContract({
    address: supporterAddress,
    abi: supporterAbi,
    functionName: 'getSupporter',
    args: [address]
  })

  const supporter = data as SupporterProps

  return (
    <div className="flex flex-col pb-10">
      <HeaderUser
        address={address}
        areaPhotoUpdated={() => {}}
        name={supporter?.name}
        userType={7}
        proofPhoto={supporter?.profilePhoto}
        description={supporter ? supporter?.description : ''}
      />

      {supporter && (
        <div className="flex gap-5 mt-5 items-start">
          <div className="flex flex-col flex-1 gap-5">
            <SupporterCompensations address={address} />
            <div className="flex flex-col rounded-2xl bg-card-primary p-5">
              <p className="text-white font-bold mb-2">{t('common.data')}</p>
              <DataRow label="ID" value={formatUnits(BigInt(supporter?.id), 0)} />
              <DataRow
                label={t('account.registeredAt')}
                value={formatUnits(BigInt(supporter?.createdAt), 0)}
              />
            </div>

            <CertificatesCard address={address} userType={7} />
          </div>

          <div className="flex flex-col gap-5 flex-1 max-w-[420px]">
            <InvitationCard address={address} />
            <InvitedUsersCard address={address} />
            <ReductionCommitmentsCard address={address} />
          </div>
        </div>
      )}
    </div>
  )
}
