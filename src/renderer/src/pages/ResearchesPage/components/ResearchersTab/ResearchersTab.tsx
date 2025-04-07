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

export function ResearchersTab(): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()

  const { data } = useReadContract({
    address: chainId === 250225 ? userAddress : sequoiaUserAddress,
    abi: chainId === 250225 ? userAbi : sequoiaUserAbi,
    functionName: 'userTypesTotalCount',
    args: [3]
  })

  let researchersCount: number = 0
  let researchersIds: number[] = []

  if (data) {
    const count = parseInt(formatUnits(BigInt(data as string), 0))
    researchersCount = count

    const ids = Array.from({ length: count }, (_, i) => i + 1)
    researchersIds = ids.reverse()
  }

  return (
    <div className="flex flex-col">
      <p className="text-white">
        {t('researchersCount')}: {researchersCount}
      </p>
      <div className="flex flex-col overflow-x-auto bg-container-primary rounded-2xl">
        <div className="flex items-center px-5 h-10 border-b-2 border-container-secondary">
          <div className="border-r border-container-secondary min-w-[50px]">
            <p className="text-white font-semibold">ID</p>
          </div>

          <div className="border-r border-container-secondary min-w-[400px] pl-5">
            <p className="text-white font-semibold">{t('wallet')}</p>
          </div>

          <div className="border-r border-container-secondary min-w-[300px] pl-5">
            <p className="text-white font-semibold">{t('name')}</p>
          </div>

          <div className="border-r border-container-secondary min-w-[120px] pl-5">
            <p className="text-white font-semibold">{t('createdAt')}</p>
          </div>

          <div className="border-r border-container-secondary min-w-[120px] pl-5">
            <p className="text-white font-semibold">{t('totalResearches')}</p>
          </div>

          <div className="border-r border-container-secondary min-w-[100px] pl-5">
            <p className="text-white font-semibold">{t('level')}</p>
          </div>

          <div className="border-r border-container-secondary min-w-[120px] pl-5">
            <p className="text-white font-semibold">{t('actions')}</p>
          </div>
        </div>

        {researchersIds.length === 0 ? (
          <div className="items-center mt-10">
            <p className="text-white text-center">{t('anyResearchersRegistered')}</p>
          </div>
        ) : (
          <>
            {researchersIds.map((id, index) => (
              <ResearcherItem key={index} id={id} />
            ))}
          </>
        )}
      </div>
    </div>
  )
}
