import { Loading } from '@renderer/components/Loading/Loading'
import { inspectionAbi, inspectionAddress, sequoiaInspectionAbi, sequoiaInspectionAddress } from '@renderer/services/contracts'
import { useChainId, useReadContract } from 'wagmi'
import { InspectionHistoryItem } from './InspectionHistoryItem'

interface Props {
  address: string
}

export function InspectionsHistoryTab({ address }: Props): JSX.Element {
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
      <div className="flex flex-col gap-3 mt-5">
        {inspectionsIds.reverse().map((item) => (
          <InspectionHistoryItem key={item} inspectionId={parseInt(item)} />
        ))}
      </div>
    )
  }

  return <div/>
} 
