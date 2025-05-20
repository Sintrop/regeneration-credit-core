import {
  contributorAbi,
  contributorAddress,
  sequoiaContributorAbi,
  sequoiaContributorAddress
} from '@renderer/services/contracts'
import { useTranslation } from 'react-i18next'
import { formatUnits } from 'viem'
import { useChainId, useReadContract } from 'wagmi'
import { ContributionFeedItem } from './ContributorFeedItem/ContributionFeedItem'
import { Loading } from '@renderer/components/Loading/Loading'

export function ContributionsFeedTab(): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()

  const { data, isLoading } = useReadContract({
    address: chainId === 250225 ? contributorAddress : sequoiaContributorAddress,
    abi: chainId === 250225 ? contributorAbi : sequoiaContributorAbi,
    functionName: 'contributionsTotalCount',
    args: []
  })

  let contributionsIds: number[] = []

  if (data) {
    const count = parseInt(formatUnits(BigInt(data as string), 0))

    const ids = Array.from({ length: count }, (_, i) => i + 1)
    contributionsIds = ids.reverse()
  }

  if (isLoading) {
    return (
      <div className="mx-auto overflow-hidden">
        <Loading />
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <p className="text-xs text-gray-300 mb-1">{t('contributions')}</p>
      {contributionsIds.length === 0 ? (
        <div className="items-center mt-10 w-[400px]">
          <p className="text-white text-center">{t('anyContributionAvailable')}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-5 w-[400px]">
          {contributionsIds.map((item) => (
            <ContributionFeedItem id={item} key={item} />
          ))}
        </div>
      )}
    </div>
  )
}
