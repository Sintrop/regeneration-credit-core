import { sequoiaResearcherAbi, sequoiaResearcherAddress } from '@renderer/services/contracts'
import { ResearcherProps } from '@renderer/types/researcher'
import { Jazzicon } from '@ukstv/jazzicon-react'
import { useTranslation } from 'react-i18next'
import { formatUnits } from 'viem'
import { useAccount, useChainId, useReadContract } from 'wagmi'

export function ResearcherData(): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()
  const { address } = useAccount()

  const { data } = useReadContract({
    address: chainId === 1600 ? sequoiaResearcherAddress : sequoiaResearcherAddress,
    abi: chainId === 1600 ? sequoiaResearcherAbi : sequoiaResearcherAbi,
    functionName: 'getResearcher',
    args: [address]
  })

  const researcher = data as ResearcherProps

  return (
    <div className="flex flex-col">
      <Jazzicon className="w-20 h-20" address={address as string} />

      <p className="text-white mt-5">{address}</p>
      {researcher && (
        <div className="flex flex-col">
          <p className="text-white mt-5">
            <span className="text-white font-bold">{t('id')}: </span>
            {formatUnits(BigInt(researcher?.id), 0)}
          </p>
          <p className="text-white mt-5">
            <span className="text-white font-bold">{t('name')}: </span>
            {researcher?.name}
          </p>
          <p className="text-white mt-5">
            <span className="text-white font-bold">{t('proofPhoto')}: </span>
            {researcher?.proofPhoto}
          </p>
          <p className="text-white mt-5">
            <span className="text-white font-bold">{t('level')}: </span>
            {formatUnits(BigInt(researcher?.pool?.level), 0)}
          </p>
          <p className="text-white mt-5">
            <span className="text-white font-bold">{t('eraPool')}: </span>
            {formatUnits(BigInt(researcher?.pool?.currentEra), 0)}
          </p>
          <p className="text-white mt-5">
            <span className="text-white font-bold">{t('publishedResearches')}: </span>
            {formatUnits(BigInt(researcher?.publishedResearches), 0)}
          </p>
          <p className="text-white mt-5">
            <span className="text-white font-bold">{t('lastPublishedAt')}: </span>
            {formatUnits(BigInt(researcher?.lastPublishedAt), 0)}
          </p>
          <p className="text-white mt-5">
            <span className="text-white font-bold">{t('lastCalculatorItemAt')}: </span>
            {formatUnits(BigInt(researcher?.lastCalculatorItemAt), 0)}
          </p>
          <p className="text-white mt-5">
            <span className="text-white font-bold">{t('registeredAt')}: </span>
            {formatUnits(BigInt(researcher?.createdAt), 0)}
          </p>
          <p className="text-white mt-5">
            <span className="text-white font-bold">{t('userType')}: </span> 6
          </p>
        </div>
      )}
    </div>
  )
}
