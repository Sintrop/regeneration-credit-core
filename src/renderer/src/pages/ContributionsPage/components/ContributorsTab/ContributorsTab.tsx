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

export function ContributorsTab(): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()

  const { data } = useReadContract({
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

  return (
    <div className="flex flex-col">
      <p className="text-white">
        {t('contributorsCount')}: {contributorsCount}
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
            <p className="text-white font-semibold">{t('totalConributions')}</p>
          </div>

          <div className="border-r border-container-secondary min-w-[100px] pl-5">
            <p className="text-white font-semibold">{t('level')}</p>
          </div>

          <div className="border-r border-container-secondary min-w-[120px] pl-5">
            <p className="text-white font-semibold">{t('actions')}</p>
          </div>
        </div>

        {contributorsIds.length === 0 ? (
          <div className="items-center mt-10">
            <p className="text-white text-center">{t('anyContributorsRegistered')}</p>
          </div>
        ) : (
          <>
            {contributorsIds.map((id, index) => (
              <ContributorItem key={index} id={id} />
            ))}
          </>
        )}
      </div>
    </div>
  )
}
