import {
  inspectionAbi,
  inspectionAddress,
  sequoiaInspectionAbi,
  sequoiaInspectionAddress
} from '@renderer/services/contracts'
import { useTranslation } from 'react-i18next'
import { formatUnits } from 'viem'
import { useChainId, useReadContract } from 'wagmi'
import { InspectionItem } from './InspectionItem'

export function InspectionsTab(): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()

  const { data } = useReadContract({
    address: chainId === 250225 ? inspectionAddress : sequoiaInspectionAddress,
    abi: chainId === 250225 ? inspectionAbi : sequoiaInspectionAbi,
    functionName: 'inspectionsTotalCount'
  })

  let inspectionsCount: number = 0
  let inspectionsIds: number[] = []

  if (data) {
    const count = parseInt(formatUnits(BigInt(data as string), 0))
    inspectionsCount = count

    const ids = Array.from({ length: count }, (_, i) => i + 1)
    inspectionsIds = ids.reverse()
  }

  return (
    <div className="flex flex-col">
      <p className="text-white">
        {t('inspectionsCount')}: {inspectionsCount}
      </p>
      <div className="flex items-center bg-container-primary rounded-t-2xl px-5 h-10 border-b-2 border-container-secondary">
        <div className="border-r border-container-secondary w-[50px]">
          <p className="text-white font-semibold">ID</p>
        </div>

        <div className="border-r border-container-secondary flex-1 pl-5">
          <p className="text-white font-semibold">{t('regenerator')}</p>
        </div>

        <div className="border-r border-container-secondary flex-1 pl-5">
          <p className="text-white font-semibold">{t('inspector')}</p>
        </div>

        <div className="border-r border-container-secondary w-[120px] pl-5">
          <p className="text-white font-semibold">{t('status')}</p>
        </div>

        <div className="border-r border-container-secondary w-[120px] pl-5">
          <p className="text-white font-semibold">{t('score')}</p>
        </div>

        <div className="border-r border-container-secondary w-[120px] pl-5">
          <p className="text-white font-semibold">{t('actions')}</p>
        </div>
      </div>

      {inspectionsIds.length === 0 ? (
        <div className="items-center mt-10">
          <p className="text-white text-center">{t('anyInspectionsAvailable')}</p>
        </div>
      ) : (
        <>
          {inspectionsIds.map((id, index) => (
            <InspectionItem key={index} id={id} />
          ))}
        </>
      )}
    </div>
  )
}
