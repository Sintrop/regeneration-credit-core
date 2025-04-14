import {
  contributorAbi,
  contributorAddress,
  sequoiaContributorAbi,
  sequoiaContributorAddress
} from '@renderer/services/contracts'
import { useTranslation } from 'react-i18next'
import { formatUnits } from 'viem'
import { useChainId, useReadContract } from 'wagmi'
import { ContributionItem } from './ContributionItem'
import { Loading } from '@renderer/components/Loading/Loading'

export function ContributionsTab(): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()

  const { data, isLoading } = useReadContract({
    address: chainId === 250225 ? contributorAddress : sequoiaContributorAddress,
    abi: chainId === 250225 ? contributorAbi : sequoiaContributorAbi,
    functionName: 'contributionsCount',
    args: []
  })

  let contributionsCount: number = 0
  let contributionsIds: number[] = []

  if (data) {
    const count = parseInt(formatUnits(BigInt(data as string), 0))
    contributionsCount = count

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
      <p className="text-white">
        {t('contributionsCount')}: {contributionsCount}
      </p>

      {contributionsIds.length === 0 ? (
        <div className="items-center mt-10">
          <p className="text-white text-center">{t('anyContributionAvailable')}</p>
        </div>
      ) : (
        <table className="min-w-full border-collapse bg-container-primary rounded-xl overflow-hidden">
          <thead>
            <tr className="border-b border-container-secondary text-white">
              <th className="p-2 border-r border-container-secondary">ID</th>
              <th className="p-2 border-r border-container-secondary">{t('contributor')}</th>
              <th className="p-2 border-r border-container-secondary">{t('createdAt')}</th>
              <th className="p-2 border-r border-container-secondary">{t('era')}</th>
              <th className="p-2 border-r border-container-secondary">{t('report')}</th>
              <th className="p-2">{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {contributionsIds.map((id, index) => (
              <ContributionItem key={index} id={id} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
