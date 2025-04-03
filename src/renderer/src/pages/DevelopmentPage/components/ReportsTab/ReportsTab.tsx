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
    functionName: 'reportsCount',
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
      <div className="flex items-center bg-container-primary rounded-t-2xl px-5 h-10 border-b-2 border-container-secondary">
        <div className="border-r border-container-secondary w-[50px]">
          <p className="text-white font-semibold">ID</p>
        </div>

        <div className="border-r border-container-secondary flex-1 pl-5">
          <p className="text-white font-semibold">{t('developer')}</p>
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

      {reportsId.length === 0 ? (
        <div></div>
      ) : (
        <>
          {reportsId.map((id, index) => (
            <ReportItem key={index} id={id} />
          ))}
        </>
      )}
    </div>
  )
}
