import {
  regeneratorAbi,
  regeneratorAddress,
  sequoiaRegeneratorAbi,
  sequoiaRegeneratorAddress
} from '@renderer/services/contracts'
import { RegeneratorProps } from '@renderer/types/regenerator'
import { useTranslation } from 'react-i18next'
import { formatUnits } from 'viem'
import { useChainId, useReadContract } from 'wagmi'
import { UserTypeContentProps } from '../UserTypeContent'
import { RegenerationAreaMap } from './RegenerationAreaMap'
import { VoteToInvalidate } from '@renderer/components/VoteToInvalidate/VoteToInvalidate'
import { HeaderUser } from '../HeaderUser/HeaderUser'
import { InvitationCard } from '../Cards/InvitationCard/InvitationCard'
import { InspectionsCard } from '../Cards/InspectionsCard/InspectionsCard'
import { ValidationsCard } from '../Cards/ValidationsCard/ValidationsCard'
import { CertificatesCard } from '../Cards/CertificatesCard/CertificatesCard'

export function RegeneratorData({ address, profilePage }: UserTypeContentProps): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()

  const { data: responseRegenerator } = useReadContract({
    address: chainId === 250225 ? regeneratorAddress : sequoiaRegeneratorAddress,
    abi: chainId === 250225 ? regeneratorAbi : sequoiaRegeneratorAbi,
    functionName: 'getRegenerator',
    args: [address]
  })

  const { data: responseProjectDescription } = useReadContract({
    address: chainId === 250225 ? regeneratorAddress : sequoiaRegeneratorAddress,
    abi: chainId === 250225 ? regeneratorAbi : sequoiaRegeneratorAbi,
    functionName: 'projectDescriptions',
    args: [address]
  })

  const { data: responseAreaPhoto, refetch } = useReadContract({
    address: chainId === 250225 ? regeneratorAddress : sequoiaRegeneratorAddress,
    abi: chainId === 250225 ? regeneratorAbi : sequoiaRegeneratorAbi,
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
        name={regenerator.name}
        userType={1}
        areaPhoto={areaPhoto}
        canUpdateAreaPhoto={profilePage}
        description={projectDescription}
        proofPhoto={regenerator.proofPhoto}
      />

      <div className="flex gap-5 mt-5 max-w-[1024px]">
        {regenerator && (
          <div className="flex flex-col gap-5 flex-1">
            <div className="flex flex-col gap-2 rounded-2xl bg-green-card p-3">
              <p className="text-gray-300 text-sm">{t('data')}</p>
              <p className="text-white">
                <span className="text-white font-bold">{t('id')}: </span>
                {formatUnits(BigInt(regenerator?.id), 0)}
              </p>
              <p className="text-white">
                <span className="text-white font-bold">{t('proofPhoto')}: </span>
                {regenerator?.proofPhoto}
              </p>
              <p className="text-white">
                <span className="text-white font-bold">{t('totalArea')}: </span>
                {formatUnits(BigInt(regenerator?.totalArea), 0)} m²
              </p>
              <p className="text-white">
                <span className="text-white font-bold">{t('totalInspections')}: </span>
                {formatUnits(BigInt(regenerator?.totalInspections), 0)}
              </p>
              <p className="text-white">
                <span className="text-white font-bold">{t('lastRequestAt')}: </span>
                {formatUnits(BigInt(regenerator?.lastRequestAt), 0)}
              </p>
              <p className="text-white">
                <span className="text-white font-bold">{t('regenerationScore')}: </span>
                {formatUnits(BigInt(regenerator?.regenerationScore?.score), 0)}
              </p>
              <p className="text-white">
                <span className="text-white font-bold">{t('eraPool')}: </span>
                {formatUnits(BigInt(regenerator?.pool?.currentEra), 0)}
              </p>
              <p className="text-white">
                <span className="text-white font-bold">{t('registeredAt')}: </span>
                {formatUnits(BigInt(regenerator?.createdAt), 0)}
              </p>
              <p className="text-white">
                <span className="text-white font-bold">{t('userType')}: </span> 1
              </p>
            </div>

            <CertificatesCard
              name={regenerator.name} 
              address={address} 
              userType={1} 
              totalArea={parseInt(formatUnits(BigInt(regenerator?.totalArea), 0))}
              totalInspections={parseInt(formatUnits(BigInt(regenerator?.totalInspections), 0))}
              score={parseInt(formatUnits(BigInt(regenerator?.regenerationScore.score), 0))}
            />
            <RegenerationAreaMap address={address} />
            <InspectionsCard address={address} />
          </div>
        )}

        <div className="flex flex-col gap-5 max-w-[450px]">
          <InvitationCard address={address} />
          <ValidationsCard address={address} />
          {!profilePage && <VoteToInvalidate resourceType="user" userWallet={address} />}
        </div>
      </div>
    </div>
  )
}
