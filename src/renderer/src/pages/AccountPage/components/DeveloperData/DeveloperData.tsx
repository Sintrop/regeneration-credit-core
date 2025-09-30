import {
  developerAbi,
  developerAddress,
  sequoiaDeveloperAbi,
  sequoiaDeveloperAddress
} from '@renderer/services/contracts'
import { DeveloperProps } from '@renderer/types/developer'
import { useTranslation } from 'react-i18next'
import { formatUnits } from 'viem'
import { useChainId, useReadContract } from 'wagmi'
import { UserTypeContentProps } from '../UserTypeContent'
import { UserCanVote } from '../UserCanVote/UserCanVote'
import { HeaderUser } from '../HeaderUser/HeaderUser'
import { InvitationCard } from '../Cards/InvitationCard/InvitationCard'
import { ValidationsCard } from '../Cards/ValidationsCard/ValidationsCard'
import { DelationsCard } from '../Cards/DelationsCard/DelationsCard'

export function DeveloperData({ address, profilePage }: UserTypeContentProps): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()

  const { data } = useReadContract({
    address: chainId === 250225 ? developerAddress : sequoiaDeveloperAddress,
    abi: chainId === 250225 ? developerAbi : sequoiaDeveloperAbi,
    functionName: 'getDeveloper',
    args: [address]
  })

  const developer = data as DeveloperProps

  const { data: responsePenalties } = useReadContract({
    address: chainId === 250225 ? developerAddress : sequoiaDeveloperAddress,
    abi: chainId === 250225 ? developerAbi : sequoiaDeveloperAbi,
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
        <div className="flex gap-5 mt-5 max-w-[1024px]">
          <div className="flex flex-col flex-1">
            <div className="flex flex-col gap-2 rounded-2xl bg-green-card p-3">
              <p className="text-gray-300 text-sm">{t('common.data')}</p>
              <p className="text-white">
                <span className="text-white font-bold">ID: </span>
                {formatUnits(BigInt(developer?.id), 0)}
              </p>
              <p className="text-white">
                <span className="text-white font-bold">{t('common.proofPhoto')}: </span>
                {developer?.proofPhoto}
              </p>
              <p className="text-white">
                <span className="text-white font-bold">{t('account.totalReports')}: </span>
                {formatUnits(BigInt(developer?.totalReports), 0)}
              </p>
              <p className="text-white">
                <span className="text-white font-bold">{t('account.lastPublishedAt')}: </span>
                {formatUnits(BigInt(developer?.lastPublishedAt), 0)}
              </p>
              <p className="text-white">
                <span className="text-white font-bold">{t('account.eraPool')}: </span>
                {formatUnits(BigInt(developer?.pool?.currentEra), 0)}
              </p>
              <p className="text-white">
                <span className="text-white font-bold">{t('account.poolLevel')}: </span>
                {formatUnits(BigInt(developer?.pool?.level), 0)}
              </p>
              <p className="text-white">
                <span className="text-white font-bold">{t('account.registeredAt')}: </span>
                {formatUnits(BigInt(developer?.createdAt), 0)}
              </p>
              <p className="text-white">
                <span className="text-white font-bold">{t('common.userType')}: </span> 4
              </p>

              <UserCanVote address={address} />

              <p className="text-red-500">
                <span className="font-bold">{t('account.penalties')}: </span>
                {totalPenalties}
              </p>
            </div>

            <DelationsCard address={address} />
          </div>

          <div className="flex flex-col gap-5 flex-1 max-w-[450px]">
            <InvitationCard address={address} />
            <ValidationsCard address={address} profilePage={profilePage} />
          </div>
        </div>
      )}
    </div>
  )
}
