import {
  researcherAbi,
  researcherAddress,
  sequoiaResearcherAbi,
  sequoiaResearcherAddress
} from '@renderer/services/contracts'
import { useTranslation } from 'react-i18next'
import { formatUnits } from 'viem'
import { useChainId, useReadContract } from 'wagmi'
import { Loading } from '@renderer/components/Loading/Loading'
import { ResearcheFeedItem } from './ResearcheFeedItem/ResearcheFeedItem'

export function ResearchesFeedTab(): JSX.Element {
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
      <p className="text-xs text-gray-300 mb-1">{t('researches')}</p>
      {researchesIds.length === 0 ? (
        <div className="items-center my-10">
          <p className="text-white text-center">{t('anyResearchesAvailable')}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-5 w-[400px]">
          {researchesIds.map((item) => (
            <ResearcheFeedItem key={item} id={item} />
          ))}
        </div>
      )}
    </div>
  )
}
