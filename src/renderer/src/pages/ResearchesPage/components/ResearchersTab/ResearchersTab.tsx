import {
  userAbi,
  userAddress,
  sequoiaUserAbi,
  sequoiaUserAddress
} from '@renderer/services/contracts'
import { useTranslation } from 'react-i18next'
import { formatUnits } from 'viem'
import { useChainId, useReadContract } from 'wagmi'
import { ResearcherItem } from './ResearcherItem'
import { Loading } from '@renderer/components/Loading/Loading'

export function ResearchersTab(): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()

  const { data, isLoading } = useReadContract({
    address: chainId === 250225 ? userAddress : sequoiaUserAddress,
    abi: chainId === 250225 ? userAbi : sequoiaUserAbi,
    functionName: 'userTypesTotalCount',
    args: [3]
  })

  let researchersIds: number[] = []

  if (data) {
    const count = parseInt(formatUnits(BigInt(data as string), 0))

    const ids = Array.from({ length: count }, (_, i) => i + 1)
    researchersIds = ids.reverse()
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
      {researchersIds.length === 0 ? (
        <div className="items-center mt-10">
          <p className="text-white text-center">{t('community.noResearchersRegistered')}</p>
        </div>
      ) : (
        <table className="min-w-full border-collapse bg-container-primary rounded-xl overflow-hidden">
          <thead>
            <tr className="border-b border-container-secondary text-white">
              <th className="p-2 border-r border-container-secondary">ID</th>
              <th className="p-2 border-r border-container-secondary">{t('community.wallet')}</th>
              <th className="p-2 border-r border-container-secondary">{t('community.name')}</th>
              <th className="p-2 border-r border-container-secondary">
                {t('community.createdAt')}
              </th>
              <th className="p-2 border-r border-container-secondary">
                {t('community.totalResearches')}
              </th>
              <th className="p-2 border-r border-container-secondary">{t('community.level')}</th>
              <th className="p-2">{t('community.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {researchersIds.map((id, index) => (
              <ResearcherItem key={index} id={id} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
