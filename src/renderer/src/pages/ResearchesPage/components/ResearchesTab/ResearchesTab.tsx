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

  let researchesCount: number = 0
  let researchesIds: number[] = []

  if (data) {
    const count = parseInt(formatUnits(BigInt(data as string), 0))
    researchesCount = count

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
      <p className="text-white">
        {t('researchesCount')}: {researchesCount}
      </p>

      <table className="min-w-full border-collapse bg-container-primary rounded-xl overflow-hidden">
        <thead>
          <tr className="border-b border-container-secondary text-white">
            <th className="p-2 border-r border-container-secondary">ID</th>
            <th className="p-2 border-r border-container-secondary">{t('researcher')}</th>
            <th className="p-2 border-r border-container-secondary">{t('createdAt')}</th>
            <th className="p-2 border-r border-container-secondary">{t('era')}</th>
            <th className="p-2 border-r border-container-secondary">{t('validationsCount')}</th>
            <th className="p-2 border-r border-container-secondary">{t('')}</th>
            <th className="p-2">{t('actions')}</th>
          </tr>
        </thead>
        <tbody>
          {researchesIds.length === 0 ? (
            <div className="items-center my-10">
              <p className="text-white text-center">{t('anyResearchesAvailable')}</p>
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
