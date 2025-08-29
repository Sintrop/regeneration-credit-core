import {
  userAbi,
  userAddress,
  sequoiaUserAbi,
  sequoiaUserAddress
} from '@renderer/services/contracts'
import { useTranslation } from 'react-i18next'
import { formatUnits } from 'viem'
import { useChainId, useReadContract } from 'wagmi'
import { DeveloperItem } from './DeveloperItem'

export function DevelopersTab(): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()

  const { data } = useReadContract({
    address: chainId === 250225 ? userAddress : sequoiaUserAddress,
    abi: chainId === 250225 ? userAbi : sequoiaUserAbi,
    functionName: 'userTypesTotalCount',
    args: [4]
  })

  let developersIds: number[] = []

  if (data) {
    const count = parseInt(formatUnits(BigInt(data as string), 0))

    const ids = Array.from({ length: count }, (_, i) => i + 1)
    developersIds = ids.reverse()
  }

  return (
    <div className="flex flex-col">
      {developersIds.length === 0 ? (
        <div className="items-center mt-10">
          <p className="text-white text-center">{t('resources.noDevelopersRegistered')}</p>
        </div>
      ) : (
        <table className="min-w-full border-collapse bg-container-primary rounded-xl overflow-hidden">
          <thead>
            <tr className="border-b border-container-secondary text-white">
              <th className="p-2 border-r border-container-secondary text-start">ID</th>
              <th className="p-2 border-r border-container-secondary text-start max-w-[100px]">
                {t('resources.wallet')}
              </th>
              <th className="p-2 border-r border-container-secondary text-start">
                {t('resources.name')}
              </th>
              <th className="p-2 border-r border-container-secondary text-start">
                {t('resources.createdAt')}
              </th>
              <th className="p-2 border-r border-container-secondary text-start">
                {t('resources.totalReports')}
              </th>
              <th className="p-2 border-r border-container-secondary text-start">
                {t('resources.level')}
              </th>
              <th className="p-2">{t('resources.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {developersIds.map((id, index) => (
              <DeveloperItem key={index} id={id} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
