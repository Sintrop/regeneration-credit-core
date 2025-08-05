import {
  developerAbi,
  developerAddress,
  sequoiaDeveloperAbi,
  sequoiaDeveloperAddress
} from '@renderer/services/contracts'
import { useTranslation } from 'react-i18next'
import { formatUnits } from 'viem'
import { useChainId, useReadContract } from 'wagmi'
import { ReportItem } from './ReportItem'

export function ReportsTab(): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()

  const { data } = useReadContract({
    address: chainId === 250225 ? developerAddress : sequoiaDeveloperAddress,
    abi: chainId === 250225 ? developerAbi : sequoiaDeveloperAbi,
    functionName: 'reportsTotalCount',
    args: []
  })

  let reportsId: number[] = []

  if (data) {
    const count = parseInt(formatUnits(BigInt(data as string), 0))

    const ids = Array.from({ length: count }, (_, i) => i + 1)
    reportsId = ids.reverse()
  }

  return (
    <div className="flex flex-col">
      {reportsId.length === 0 ? (
        <div className="items-center mt-10">
          <p className="text-white text-center">{t('resources.noReportAvailable')}</p>
        </div>
      ) : (
        <table className="min-w-full border-collapse bg-container-primary rounded-xl overflow-hidden">
          <thead>
            <tr className="border-b border-container-secondary text-white">
              <th className="p-2 border-r border-container-secondary text-start">ID</th>
              <th className="p-2 border-r border-container-secondary text-start max-w-[100px]">
                {t('resources.developer')}
              </th>
              <th className="p-2 border-r border-container-secondary text-start">
                {t('resources.createdAt')}
              </th>
              <th className="p-2 border-r border-container-secondary text-start">Era</th>
              <th className="p-2 border-r border-container-secondary text-start">
                {t('resources.validationsCount')}
              </th>
              <th className="p-2 border-r border-container-secondary text-start">Status</th>
              <th className="p-2">{t('resources.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {reportsId.map((id, index) => (
              <ReportItem key={index} id={id} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
