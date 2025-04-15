import {
  userAbi,
  userAddress,
  sequoiaUserAbi,
  sequoiaUserAddress
} from '@renderer/services/contracts'
import { useTranslation } from 'react-i18next'
import { formatUnits } from 'viem'
import { useChainId, useReadContract } from 'wagmi'
import { ContributorItem } from './ContributorItem'
import { Loading } from '@renderer/components/Loading/Loading'

export function ContributorsTab(): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()

  const { data, isLoading } = useReadContract({
    address: chainId === 250225 ? userAddress : sequoiaUserAddress,
    abi: chainId === 250225 ? userAbi : sequoiaUserAbi,
    functionName: 'userTypesTotalCount',
    args: [5]
  })

  let contributorsCount: number = 0
  let contributorsIds: number[] = []

  if (data) {
    const count = parseInt(formatUnits(BigInt(data as string), 0))
    contributorsCount = count

    const ids = Array.from({ length: count }, (_, i) => i + 1)
    contributorsIds = ids.reverse()
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
        {t('contributorsCount')}: {contributorsCount}
      </p>

      {contributorsIds.length === 0 ? (
        <div className="items-center mt-10">
          <p className="text-white text-center">{t('anyContributorsRegistered')}</p>
        </div>
      ) : (
        <table className="min-w-full border-collapse bg-container-primary rounded-xl overflow-hidden">
          <thead>
            <tr className="border-b border-container-secondary text-white">
              <th className="p-2 border-r border-container-secondary">ID</th>
              <th className="p-2 border-r border-container-secondary">{t('wallet')}</th>
              <th className="p-2 border-r border-container-secondary">{t('name')}</th>
              <th className="p-2 border-r border-container-secondary">{t('createdAt')}</th>
              <th className="p-2 border-r border-container-secondary">{t('totalConributions')}</th>
              <th className="p-2 border-r border-container-secondary">{t('level')}</th>
              <th className="p-2">{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {contributorsIds.map((id, index) => (
              <ContributorItem key={index} id={id} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
