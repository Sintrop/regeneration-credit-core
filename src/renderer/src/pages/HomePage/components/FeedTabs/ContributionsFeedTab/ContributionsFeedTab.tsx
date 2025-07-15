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
    <div className="bg-card-2 rounded-2xl w-full">
      <div className="flex items-center justify-center h-10 border-b border-green-900 bg-card-1 rounded-t-2xl">
        <p className="text-sm text-green-1 mb-1">{t('contributions')}</p>
      </div>
      {contributionsIds.length === 0 ? (
        <div className="items-center my-10 w-[350px]">
          <p className="text-white text-center">{t('noContributions')}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-5 w-full">
          {contributionsIds.map((item) => (
            <ContributionFeedItem id={item} key={item} />
          ))}
        </div>
      )}
    </div>
  )
}
