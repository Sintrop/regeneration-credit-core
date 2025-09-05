import { Loading } from '@renderer/components/Loading/Loading'
import {
  inspectionAbi,
  inspectionAddress,
  sequoiaInspectionAbi,
  sequoiaInspectionAddress
} from '@renderer/services/contracts'
import { useChainId, useReadContract } from 'wagmi'
import { InspectionCardItem } from './InspectionCardItem'
import { useTranslation } from 'react-i18next'

interface Props {
  address: string
}

export function InspectionsCard({ address }: Props): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()
  const { data, isLoading } = useReadContract({
    address: chainId === 250225 ? inspectionAddress : sequoiaInspectionAddress,
    abi: chainId === 250225 ? inspectionAbi : sequoiaInspectionAbi,
    functionName: 'getInspectionsHistory',
    args: [address]
  })

  const inspectionsIds = data as string[]

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
              <InspectionCardItem key={item} inspectionId={parseInt(item)} />
            ))}
          </>
        )}
      </div>
    )
  }

  return <div />
}
