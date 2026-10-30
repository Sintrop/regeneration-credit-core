import { DataRow } from '@renderer/components/DataRow/DataRow'
import { useState } from 'react'
import { regeneratorAbi, regeneratorAddress } from '@renderer/services/contracts'
import { RegeneratorProps } from '@renderer/types/regenerator'
import { useTranslation } from 'react-i18next'
import { formatUnits } from 'viem'
import { useReadContract } from 'wagmi'
import { UserTypeContentProps } from '../UserTypeContent'
import { RegenerationAreaMap } from './RegenerationAreaMap'
import { HeaderUser } from '../HeaderUser/HeaderUser'
import { InvitationCard } from '../Cards/InvitationCard/InvitationCard'
import { InspectionsCard } from '../Cards/InspectionsCard/InspectionsCard'
import { ValidationsCard } from '../Cards/ValidationsCard/ValidationsCard'
import { CertificatesCard } from '../../../../components/CertificatesCard/CertificatesCard'
import { DelationsCard } from '../Cards/DelationsCard/DelationsCard'

export interface AverageInspectionsProps {
  bio: number
  trees: number
}

export function RegeneratorData({ address, profilePage }: UserTypeContentProps): JSX.Element {
  const { t } = useTranslation()
  const [averageInspections, setAverageInspections] = useState<AverageInspectionsProps>({
    bio: 0,
    trees: 0
  })

  const { data: responseRegenerator } = useReadContract({
    address: regeneratorAddress,
    abi: regeneratorAbi,
    functionName: 'getRegenerator',
    args: [address]
  })

  const { data: responseProjectDescription } = useReadContract({
    address: regeneratorAddress,
    abi: regeneratorAbi,
    functionName: 'projectDescriptions',
    args: [address]
  })

  const { data: responseAreaPhoto, refetch } = useReadContract({
    address: regeneratorAddress,
    abi: regeneratorAbi,
    functionName: 'areaPhoto',
    args: [address]
  })

  const regenerator = responseRegenerator as RegeneratorProps
  const areaPhoto = responseAreaPhoto as string
  const projectDescription = responseProjectDescription as string

  if (!regenerator) return <div />

  return (
    <div className="flex flex-col pb-10">
      <HeaderUser
        address={address}
        areaPhotoUpdated={refetch}
        name={regenerator?.name}
        userType={1}
        areaPhoto={areaPhoto}
        canUpdateAreaPhoto={profilePage}
        description={projectDescription}
        proofPhoto={regenerator?.proofPhoto}
      />

      <div className="flex gap-5 mt-5 items-start">
        {regenerator && (
          <div className="flex flex-col gap-5 flex-1">
            <div className="flex flex-col rounded-2xl bg-card-primary p-5">
              <p className="text-white font-bold mb-2">{t('common.data')}</p>
              <DataRow label="ID" value={formatUnits(BigInt(regenerator?.id), 0)} />
              <DataRow label={t('common.proofPhoto')} value={regenerator?.proofPhoto} />
              <DataRow
                label={t('account.totalArea')}
                value={<>{formatUnits(BigInt(regenerator?.totalArea), 0)} m²</>}
              />
              <DataRow
                label={t('account.totalInspections')}
                value={formatUnits(BigInt(regenerator?.totalInspections), 0)}
              />
              <DataRow
                label={t('account.lastRequestAt')}
                value={formatUnits(BigInt(regenerator?.lastRequestAt), 0)}
              />
              <DataRow
                label={t('common.regenerationScore')}
                value={formatUnits(BigInt(regenerator?.regenerationScore?.score), 0)}
              />
              <DataRow
                label={t('account.eraPool')}
                value={formatUnits(BigInt(regenerator?.pool?.currentEra), 0)}
              />
              <DataRow
                label={t('account.registeredAt')}
                value={formatUnits(BigInt(regenerator?.createdAt), 0)}
              />
            </div>

            <CertificatesCard
              name={regenerator.name}
              address={address}
              userType={1}
              totalArea={parseInt(formatUnits(BigInt(regenerator?.totalArea), 0))}
              totalInspections={parseInt(formatUnits(BigInt(regenerator?.totalInspections), 0))}
              score={parseInt(formatUnits(BigInt(regenerator?.regenerationScore.score), 0))}
              averageInspections={averageInspections}
            />
            <RegenerationAreaMap address={address} />
            <InspectionsCard address={address} updateAverage={setAverageInspections} />
            <DelationsCard address={address} />
          </div>
        )}

        <div className="flex flex-col gap-5 flex-1 max-w-[420px]">
          <InvitationCard address={address} />
          <ValidationsCard address={address} profilePage={profilePage} />
        </div>
      </div>
    </div>
  )
}
