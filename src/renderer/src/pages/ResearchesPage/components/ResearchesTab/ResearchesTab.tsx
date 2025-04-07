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

export function ResearchesTab(): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()

  const { data } = useReadContract({
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

  return (
    <div className="flex flex-col">
      <p className="text-white">
        {t('researchesCount')}: {researchesCount}
      </p>
      <div className="flex items-center bg-container-primary rounded-t-2xl px-5 h-10 border-b-2 border-container-secondary">
        <div className="border-r border-container-secondary w-[50px]">
          <p className="text-white font-semibold">ID</p>
        </div>

        <div className="border-r border-container-secondary flex-1 pl-5">
          <p className="text-white font-semibold">{t('researcher')}</p>
        </div>

        <div className="border-r border-container-secondary w-[120px] pl-5">
          <p className="text-white font-semibold">{t('createdAt')}</p>
        </div>

        <div className="border-r border-container-secondary w-[120px] pl-5">
          <p className="text-white font-semibold">{t('era')}</p>
        </div>

        <div className="border-r border-container-secondary w-[200px] pl-5">
          <p className="text-white font-semibold">{t('report')}</p>
        </div>

        <div className="border-r border-container-secondary w-[120px] pl-5">
          <p className="text-white font-semibold">{t('actions')}</p>
        </div>
      </div>

      {researchesIds.length === 0 ? (
        <div className="items-center mt-10">
          <p className="text-white text-center">{t('anyResearchesAvailable')}</p>
        </div>
      ) : (
        <>
          {researchesIds.map((id, index) => (
            <ResearcheItem key={index} id={id} />
          ))}
        </>
      )}
    </div>
  )
}
