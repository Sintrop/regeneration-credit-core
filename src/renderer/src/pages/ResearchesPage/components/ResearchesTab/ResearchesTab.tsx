import {
  researcherAbi,
  researcherAddress,
  sequoiaResearcherAbi,
  sequoiaResearcherAddress
} from '@renderer/services/contracts'
import { useTranslation } from 'react-i18next'
import { formatUnits } from 'viem'
import { useChainId, useReadContract } from 'wagmi'
import { ResearcheItem } from './ResearcheItem'
import { Loading } from '@renderer/components/Loading/Loading'

export function ResearchesTab(): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()

  const { data, isLoading } = useReadContract({
    address: chainId === 250225 ? researcherAddress : sequoiaResearcherAddress,
    abi: chainId === 250225 ? researcherAbi : sequoiaResearcherAbi,
    functionName: 'researchesTotalCount',
    args: []
  })

  let researchesIds: number[] = []

  if (data) {
    const count = parseInt(formatUnits(BigInt(data as string), 0))

    const ids = Array.from({ length: count }, (_, i) => i + 1)
    researchesIds = ids.reverse()
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
      <table className="min-w-full border-collapse bg-container-primary rounded-xl overflow-hidden">
        <thead>
          <tr className="border-b border-container-secondary text-white">
            <th className="p-2 border-r border-container-secondary text-start">ID</th>
            <th className="p-2 border-r border-container-secondary text-start max-w-[100px]">
              {t('resources.researcher')}
            </th>
            <th className="p-2 border-r border-container-secondary text-start">
              {t('resources.createdAt')}
            </th>
            <th className="p-2 border-r border-container-secondary text-start">Era</th>
            <th className="p-2 border-r border-container-secondary text-start">
              {t('resources.validationsCount')}
            </th>
            <th className="p-2 border-r border-container-secondary text-start">
              {t('resources.status')}
            </th>
            <th className="p-2 text-start">{t('resources.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {researchesIds.length === 0 ? (
            <div className="items-center my-10">
              <p className="text-white text-center">{t('resources.noResearchesAvailable')}</p>
            </div>
          ) : (
            <>
              {researchesIds.map((id, index) => (
                <ResearcheItem key={index} id={id} />
              ))}
            </>
          )}
        </tbody>
      </table>
    </div>
  )
}
