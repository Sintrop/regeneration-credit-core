import {
  inspectorAbi,
  inspectorAddress,
  sequoiaInspectorAbi,
  sequoiaInspectorAddress
} from '@renderer/services/contracts'
import { InspectorProps } from '@renderer/types/inspector'
import { useTranslation } from 'react-i18next'
import { formatUnits } from 'viem'
import { useChainId, useReadContract } from 'wagmi'
import { UserTypeContentProps } from '../UserTypeContent'
import { HeaderUser } from '../HeaderUser/HeaderUser'
import { InvitationCard } from '../Cards/InvitationCard/InvitationCard'
import { ValidationsCard } from '../Cards/ValidationsCard/ValidationsCard'
import { DelationsCard } from '../Cards/DelationsCard/DelationsCard'

export function InspectorData({ address, profilePage }: UserTypeContentProps): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()

  const { data } = useReadContract({
    address: chainId === 250225 ? inspectorAddress : sequoiaInspectorAddress,
    abi: chainId === 250225 ? inspectorAbi : sequoiaInspectorAbi,
    functionName: 'getInspector',
    args: [address]
  })
  const inspector = data as InspectorProps

  const { data: responsePenalties } = useReadContract({
    address: chainId === 250225 ? inspectorAddress : sequoiaInspectorAddress,
    abi: chainId === 250225 ? inspectorAbi : sequoiaInspectorAbi,
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
        <div className="flex gap-5 mt-5 max-w-[1024px]">
          <div className="flex flex-col flex-1 gap-5">
            <div className="flex flex-col gap-2 rounded-2xl bg-green-card p-3">
              <p className="text-gray-300 text-sm">{t('common.data')}</p>
              <p className="text-white">
                <span className="text-white font-bold">ID: </span>
                {formatUnits(BigInt(inspector?.id), 0)}
              </p>
              <p className="text-white">
                <span className="text-white font-bold">{t('common.proofPhoto')}: </span>
                {inspector?.proofPhoto}
              </p>
              <p className="text-white">
                <span className="text-white font-bold">{t('account.totalInspections')}: </span>
                {formatUnits(BigInt(inspector?.totalInspections), 0)}
              </p>
              <p className="text-white">
                <span className="text-white font-bold">{t('account.lastAcceptedAt')}: </span>
                {formatUnits(BigInt(inspector?.lastAcceptedAt), 0)}
              </p>
              <p className="text-white">
                <span className="text-white font-bold">{t('account.lastInspection')}: </span>
                {formatUnits(BigInt(inspector?.lastInspection), 0)}
              </p>
              <p className="text-white">
                <span className="text-white font-bold">{t('common.level')}: </span>
                {formatUnits(BigInt(inspector?.pool?.level), 0)}
              </p>
              <p className="text-white">
                <span className="text-white font-bold">{t('account.eraPool')}: </span>
                {formatUnits(BigInt(inspector?.pool?.currentEra), 0)}
              </p>
              <p className="text-white">
                <span className="text-white font-bold">{t('account.registeredAt')}: </span>
                {formatUnits(BigInt(inspector?.createdAt), 0)}
              </p>
              <p className="text-white">
                <span className="text-white font-bold">{t('common.userType')}: </span> 2
              </p>

              <p className="text-red-500">
                <span className="font-bold">{t('account.giveUps')}: </span>
                {formatUnits(BigInt(inspector?.giveUps), 0)}
              </p>

              <p className="text-red-500">
                <span className="font-bold">{t('account.penalties')}: </span>
                {totalPenalties}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-5 flex-1 max-w-[450px]">
            <InvitationCard address={address} />
            <ValidationsCard address={address} profilePage={profilePage} />
            <DelationsCard address={address} />
          </div>
        </div>
      )}
    </div>
  )
}
