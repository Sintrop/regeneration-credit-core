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

export function ContributionsTab(): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()

  const { data } = useReadContract({
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

  return (
    <div className="flex flex-col">
      <p className="text-white">
        {t('contributionsCount')}: {contributionsCount}
      </p>
      <div className="flex items-center bg-container-primary rounded-t-2xl px-5 h-10 border-b-2 border-container-secondary">
        <div className="border-r border-container-secondary w-[50px]">
          <p className="text-white font-semibold">ID</p>
        </div>

        <div className="border-r border-container-secondary flex-1 pl-5">
          <p className="text-white font-semibold">{t('contributor')}</p>
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

      {contributionsIds.length === 0 ? (
        <div className="items-center mt-10">
          <p className="text-white text-center">{t('anyContributionAvailable')}</p>
        </div>
      ) : (
        <>
          {contributionsIds.map((id, index) => (
            <ContributionItem key={index} id={id} />
          ))}
        </>
      )}
    </div>
  )
}
