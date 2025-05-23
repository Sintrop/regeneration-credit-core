import { Loading } from '@renderer/components/Loading/Loading'
import { UserAddressLink } from '@renderer/components/UserAddressLink/UserAddressLink'
import { VoteToInvalidate } from '@renderer/components/VoteToInvalidate/VoteToInvalidate'
import {
  contributorAbi,
  contributorAddress,
  sequoiaContributorAbi,
  sequoiaContributorAddress
} from '@renderer/services/contracts'
import { ContributionProps } from '@renderer/types/contributor'
import { useTranslation } from 'react-i18next'
import { formatUnits } from 'viem'
import { useChainId, useReadContract } from 'wagmi'

interface Props {
  id: number
  setValidationsCount: (count: number) => void
  setReport: (report: string) => void
}
export function ContributionData({ id, setReport, setValidationsCount }: Props): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()

  const { data, isLoading } = useReadContract({
    address: chainId === 250225 ? contributorAddress : sequoiaContributorAddress,
    abi: chainId === 250225 ? contributorAbi : sequoiaContributorAbi,
    args: [id],
    functionName: 'getContribution'
  })

  const contribution = data as ContributionProps

  if (contribution) {
    setReport(contribution.report)
    setValidationsCount(parseInt(formatUnits(BigInt(contribution.validationsCount), 0)))
  }

  if (isLoading) {
    return (
      <div>
        <div className="w-full items-center overflow-hidden">
          <Loading />
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-10">
      <div className="flex flex-col gap-2 max-w-[500px]">
        <div className="flex items-center gap-2">
          <p className="text-white">{t('contributor')}:</p>
          <UserAddressLink address={contribution.user} />
        </div>

        <div className="flex gap-2">
          <p className="text-white">{t('description')}:</p>
          <p className="text-white">{contribution && contribution.description}</p>
        </div>

        <div className="flex items-center gap-2">
          <p className="text-white">{t('createdAt')}:</p>
          <p className="text-white">
            {contribution && formatUnits(BigInt(contribution.createdAtBlockNumber), 0)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <p className="text-white">{t('era')}:</p>
          <p className="text-white">{contribution && formatUnits(BigInt(contribution.era), 0)}</p>
        </div>

        <div className="flex items-center gap-2">
          <p className="text-white">{t('validationsCount')}:</p>
          <p className="text-white">
            {contribution && formatUnits(BigInt(contribution.validationsCount), 0)}
          </p>
        </div>
      </div>

      <VoteToInvalidate
        resourceId={id}
        resourceType="contribution"
        publishedEra={parseInt(formatUnits(BigInt(contribution.era), 0))}
      />
    </div>
  )
}
