import {
  researcherAbi,
  researcherAddress,
  sequoiaResearcherAbi,
  sequoiaResearcherAddress
} from '@renderer/services/contracts'
import { ResearcherProps } from '@renderer/types/researcher'
import { useTranslation } from 'react-i18next'
import { formatUnits } from 'viem'
import { useChainId, useReadContract } from 'wagmi'
import { UserTypeContentProps } from '../UserTypeContent'
import { UserCanVote } from '../UserCanVote/UserCanVote'
import { HeaderUser } from '../HeaderUser/HeaderUser'
import { InvitationCard } from '../Cards/InvitationCard/InvitationCard'
import { ValidationsCard } from '../Cards/ValidationsCard/ValidationsCard'
import { DelationsCard } from '../Cards/DelationsCard/DelationsCard'

export function ResearcherData({ address, profilePage }: UserTypeContentProps): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()

  const { data } = useReadContract({
    address: chainId === 250225 ? researcherAddress : sequoiaResearcherAddress,
    abi: chainId === 250225 ? researcherAbi : sequoiaResearcherAbi,
    functionName: 'getResearcher',
    args: [address]
  })

  const researcher = data as ResearcherProps

  const { data: responsePenalties } = useReadContract({
    address: chainId === 250225 ? researcherAddress : sequoiaResearcherAddress,
    abi: chainId === 250225 ? researcherAbi : sequoiaResearcherAbi,
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
        <div className="flex gap-5 mt-5 max-w-[1024px]">
          <div className="flex flex-col gap-5 flex-1">
            <div className="flex flex-col gap-2 rounded-2xl bg-green-card p-3">
              <p className="text-gray-300 text-sm">{t('common.data')}</p>
              <p className="text-white">
                <span className="text-white font-bold">ID: </span>
                {formatUnits(BigInt(researcher?.id), 0)}
              </p>
              <p className="text-white">
                <span className="text-white font-bold">{t('common.proofPhoto')}: </span>
                {researcher?.proofPhoto}
              </p>
              <p className="text-white">
                <span className="text-white font-bold">{t('common.level')}: </span>
                {formatUnits(BigInt(researcher?.pool?.level), 0)}
              </p>
              <p className="text-white">
                <span className="text-white font-bold">{t('account.eraPool')}: </span>
                {formatUnits(BigInt(researcher?.pool?.currentEra), 0)}
              </p>
              <p className="text-white">
                <span className="text-white font-bold">{t('account.publishedResearches')}: </span>
                {formatUnits(BigInt(researcher?.publishedResearches), 0)}
              </p>
              <p className="text-white">
                <span className="text-white font-bold">{t('account.lastPublishedAt')}: </span>
                {formatUnits(BigInt(researcher?.lastPublishedAt), 0)}
              </p>
              <p className="text-white">
                <span className="text-white font-bold">{t('account.lastCalculatorItemAt')}: </span>
                {formatUnits(BigInt(researcher?.lastCalculatorItemAt), 0)}
              </p>
              <p className="text-white">
                <span className="text-white font-bold">{t('account.registeredAt')}: </span>
                {formatUnits(BigInt(researcher?.createdAt), 0)}
              </p>
              <p className="text-white">
                <span className="text-white font-bold">{t('common.userType')}: </span> 3
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
