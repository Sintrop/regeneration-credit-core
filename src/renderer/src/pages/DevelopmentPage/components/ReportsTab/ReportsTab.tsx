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

  let reportsCount: number = 0
  let reportsId: number[] = []

  if (data) {
    const count = parseInt(formatUnits(BigInt(data as string), 0))
    reportsCount = count

    const ids = Array.from({ length: count }, (_, i) => i + 1)
    reportsId = ids.reverse()
  }

  return (
    <div className="flex flex-col">
      <p className="text-white">
        {t('reportsCount')}: {reportsCount}
      </p>

      {reportsId.length === 0 ? (
        <div className="items-center mt-10">
          <p className="text-white text-center">{t('anyReportAvailable')}</p>
        </div>
      ) : (
        <table className="min-w-full border-collapse bg-container-primary rounded-xl overflow-hidden">
          <thead>
            <tr className="border-b border-container-secondary text-white">
              <th className="p-2 border-r border-container-secondary">ID</th>
              <th className="p-2 border-r border-container-secondary">{t('developer')}</th>
              <th className="p-2 border-r border-container-secondary">{t('createdAt')}</th>
              <th className="p-2 border-r border-container-secondary">{t('era')}</th>
              <th className="p-2 border-r border-container-secondary">{t('report')}</th>
              <th className="p-2">{t('actions')}</th>
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
