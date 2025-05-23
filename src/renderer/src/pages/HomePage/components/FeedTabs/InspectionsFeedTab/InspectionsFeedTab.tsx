import {
  inspectionAbi,
  inspectionAddress,
  sequoiaInspectionAbi,
  sequoiaInspectionAddress,
} from '@renderer/services/contracts'
import { useTranslation } from 'react-i18next'
import { formatUnits } from 'viem'
import { useChainId, useReadContract } from 'wagmi'
import { Loading } from '@renderer/components/Loading/Loading'
import { InspectionFeedItem } from './InspectionFeedItem/InspectionFeedItem'

export function InspectionsFeedTab(): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()

  const { data, isLoading } = useReadContract({
    address: chainId === 250225 ? inspectionAddress : sequoiaInspectionAddress,
    abi: chainId === 250225 ? inspectionAbi : sequoiaInspectionAbi,
    functionName: 'inspectionsTotalCount',
  })

  let inspectionsIds: number[] = []

  if (data) {
    const count = parseInt(formatUnits(BigInt(data as string), 0))

    const ids = Array.from({ length: count }, (_, i) => i + 1)
    inspectionsIds = ids.reverse()
  }

  if (isLoading) {
    return (
      <div className="overflow-hidden">
        <Loading />
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <p className="text-xs text-gray-300 mb-1">{t('inspections')}</p>
      {inspectionsIds.length === 0 ? (
        <div className="items-center my-10">
          <p className="text-white text-center">{t('anyInspectionsAvailable')}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-5 w-[400px]">
          {inspectionsIds.map((item) => (
            <InspectionFeedItem key={item} id={item} />
          ))}
        </div>
      )}
    </div>
  )
}
