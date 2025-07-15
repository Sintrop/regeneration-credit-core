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
import { ProofPhoto } from '../ProofPhoto/ProofPhoto'
import { UserContentTabs } from '../Tabs/UserContentTabs'
import { VoteToInvalidate } from '@renderer/components/VoteToInvalidate/VoteToInvalidate'
import { UserCanVote } from '../UserCanVote/UserCanVote'

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
    <div className="flex flex-col">
      <ProofPhoto address={address} hash={researcher && researcher?.proofPhoto} />

      {researcher && (
        <div className="flex gap-10">
          <div className="flex flex-col gap-2 mt-2">
            <p className="text-white mt-5">{address}</p>
            <p className="text-white">
              <span className="text-white font-bold">{t('id')}: </span>
              {formatUnits(BigInt(researcher?.id), 0)}
            </p>
            <p className="text-white">
              <span className="text-white font-bold">{t('name')}: </span>
              {researcher?.name}
            </p>
            <p className="text-white">
              <span className="text-white font-bold">{t('proofPhoto')}: </span>
              {researcher?.proofPhoto}
            </p>
            <p className="text-white">
              <span className="text-white font-bold">{t('level')}: </span>
              {formatUnits(BigInt(researcher?.pool?.level), 0)}
            </p>
            <p className="text-white">
              <span className="text-white font-bold">{t('eraPool')}: </span>
              {formatUnits(BigInt(researcher?.pool?.currentEra), 0)}
            </p>
            <p className="text-white">
              <span className="text-white font-bold">{t('publishedResearches')}: </span>
              {formatUnits(BigInt(researcher?.publishedResearches), 0)}
            </p>
            <p className="text-white">
              <span className="text-white font-bold">{t('lastPublishedAt')}: </span>
              {formatUnits(BigInt(researcher?.lastPublishedAt), 0)}
            </p>
            <p className="text-white">
              <span className="text-white font-bold">{t('lastCalculatorItemAt')}: </span>
              {formatUnits(BigInt(researcher?.lastCalculatorItemAt), 0)}
            </p>
            <p className="text-white">
              <span className="text-white font-bold">{t('registeredAt')}: </span>
              {formatUnits(BigInt(researcher?.createdAt), 0)}
            </p>
            <p className="text-white">
              <span className="text-white font-bold">{t('userType')}: </span> 3
            </p>

            <UserCanVote address={address} />

            <p className="text-red-500">
              <span className="font-bold">{t('penalties')}: </span>
              {totalPenalties}
            </p>
          </div>

          {!profilePage && <VoteToInvalidate resourceType="user" userWallet={address} />}
        </div>
      )}

      <UserContentTabs
        address={address}
        availableTabs={['certificates', 'invitation', 'researches', 'validations']}
      />
    </div>
  )
}
