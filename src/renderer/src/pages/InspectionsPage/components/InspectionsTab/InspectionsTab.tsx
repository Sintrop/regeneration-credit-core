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

  let inspectionsIds: number[] = []

  if (data) {
    const count = parseInt(formatUnits(BigInt(data as string), 0))

    const ids = Array.from({ length: count }, (_, i) => i + 1)
    inspectionsIds = ids.reverse()
  }

  return (
    <div className="flex flex-col">
      {inspectionsIds.length === 0 ? (
        <div className="items-center mt-10">
          <p className="text-white text-center">{t('resources.noInspectionsAvailable')}</p>
        </div>
      ) : (
        <table className="min-w-full border-collapse bg-container-primary rounded-xl overflow-hidden">
          <thead>
            <tr className="border-b border-container-secondary text-white">
              <th className="p-2 border-r border-container-secondary items-start">ID</th>
              <th className="p-2 border-r border-container-secondary max-w-[180px]">
                {t('resources.regenerator')}
              </th>
              <th className="p-2 border-r border-container-secondary max-w-[180px]">
                {t('resources.inspector')}
              </th>
              <th className="p-2 border-r border-container-secondary">{t('resources.status')}</th>
              <th className="p-2 border-r border-container-secondary">
                {t('resources.canAccept')}
              </th>
              <th className="p-2 border-r border-container-secondary">{t('resources.trees')}</th>
              <th className="p-2 border-r border-container-secondary">
                {t('resources.biodiversity')}
              </th>
              <th className="p-2 border-r border-container-secondary">{t('resources.score')}</th>
              <th className="p-2 border-r border-container-secondary">{t('resources.valCount')}</th>
              <th className="p-2">{t('resources.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {inspectionsIds.map((id, index) => (
              <InspectionItem key={index} id={id} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
