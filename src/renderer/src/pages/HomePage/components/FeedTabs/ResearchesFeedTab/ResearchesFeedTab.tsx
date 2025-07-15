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
import { useNavigate } from 'react-router-dom'

export function ResearchesFeedTab(): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()
  const navigate = useNavigate()

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

  function handleGoToResearches(): void {
    navigate('/researches')
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
        <p className="text-sm text-green-1 mb-1">{t('researches')}</p>
      </div>
      {researchesIds.length === 0 ? (
        <div className="items-center my-10">
          <p className="text-white text-center">{t('noResearches')}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-5 w-full">
          {researchesIds.slice(0, 3).map((item) => (
            <ResearcheFeedItem key={item} id={item} />
          ))}
        </div>
      )}

      {researchesIds.length > 3 && (
        <div className="flex items-center justify-center h-8 mt-3 border-t border-green-900 bg-card-1 rounded-b-2xl">
          <button
            className="text-green-500 underline hover:cursor-pointer text-start w-fit"
            onClick={handleGoToResearches}
          >
            {t('seeMore')}
          </button>
        </div>
      )}
    </div>
  )
}
