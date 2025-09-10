import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useChainId, useReadContract } from 'wagmi'
import { Loading } from '@renderer/components/Loading/Loading'
import {
  inspectionAbi,
  inspectionAddress,
  sequoiaInspectionAbi,
  sequoiaInspectionAddress
} from '@renderer/services/contracts'
import { InspectionCardItem } from './InspectionCardItem'
import { AverageInspectionsProps } from '../../RegeneratorData/RegeneratorData'

export interface UpdateTotalProps {
  inspectionId: number
  trees: number
  bio: number
}

interface Props {
  address: string
  updateAverage: (data: AverageInspectionsProps) => void
}

export function InspectionsCard({ address, updateAverage }: Props): JSX.Element {
  const { t } = useTranslation()
  const [inspectionsList] = useState<UpdateTotalProps[]>([])

  const chainId = useChainId()
  const { data, isLoading } = useReadContract({
    address: chainId === 250225 ? inspectionAddress : sequoiaInspectionAddress,
    abi: chainId === 250225 ? inspectionAbi : sequoiaInspectionAbi,
    functionName: 'getInspectionsHistory',
    args: [address]
  })
  const inspectionsIds = data as string[]

  function updateTotal(data: UpdateTotalProps): void {
    const inspectionExists = inspectionsList.find((item) => item.inspectionId === data.inspectionId)
    if (inspectionExists) return

    inspectionsList.push(data)
  }

  useEffect(() => {
    if (inspectionsIds) {
      const totalInspections = inspectionsIds.length
      const totalTrees = inspectionsList.reduce((acc, item) => acc + item.trees, 0)
      const totalBio = inspectionsList.reduce((acc, item) => acc + item.bio, 0)
      const averageTrees = Math.ceil(totalTrees / totalInspections)
      const averageBio = Math.ceil(totalBio / totalInspections)
      updateAverage({
        bio: averageBio,
        trees: averageTrees
      })
    }

    console.log(inspectionsList)
  }, [inspectionsList, inspectionsIds])

  if (isLoading) {
    return (
      <div className="mx-auto overflow-hidden">
        <Loading />
      </div>
    )
  }

  if (inspectionsIds) {
    return (
      <div className="flex flex-col p-3 rounded-2xl bg-green-card gap-3">
        <p className="text-gray-300 text-sm">{t('account.inspections')}</p>
        {inspectionsIds.length === 0 ? (
          <div className="flex mt-3">
            <p className="text-white">{t('account.noInspections')}</p>
          </div>
        ) : (
          <>
            {inspectionsIds.reverse().map((item) => (
              <InspectionCardItem
                key={item}
                inspectionId={parseInt(item)}
                updateTotal={updateTotal}
              />
            ))}
          </>
        )}
      </div>
    )
  }

  return <div />
}
