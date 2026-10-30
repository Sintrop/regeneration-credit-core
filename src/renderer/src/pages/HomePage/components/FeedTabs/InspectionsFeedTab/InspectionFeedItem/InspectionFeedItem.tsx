import { useReadContract } from 'wagmi'
import {
  inspectionAbi,
  inspectionAddress,
  regeneratorAbi,
  regeneratorAddress
} from '@renderer/services/contracts'
import { formatUnits } from 'viem'
import { HeaderFeedItem } from '../../HeaderFeedItem/HeaderFeedItem'
import { InspectionFeedContent } from './InspectionFeedContent'
import { InspectionProps } from '@renderer/types/inspection'
import { RegeneratorProps } from '@renderer/types/regenerator'

interface Props {
  id: number
}

export function InspectionFeedItem({ id }: Props): JSX.Element {
  const { data } = useReadContract({
    address: inspectionAddress,
    abi: inspectionAbi,
    functionName: 'getInspection',
    args: [id]
  })

  const inspection = data as InspectionProps

  const { data: data2 } = useReadContract({
    address: regeneratorAddress,
    abi: regeneratorAbi,
    functionName: 'getRegenerator',
    args: [inspection?.regenerator]
  })

  const regenerator = data2 as RegeneratorProps

  if (regenerator && regenerator) {
    return (
      <div className="flex flex-col p-3 w-full border-t border-green-900">
        <HeaderFeedItem
          name={regenerator.name}
          proofPhoto={regenerator.proofPhoto}
          publishedAt={formatUnits(BigInt(inspection.createdAt), 0)}
          address={inspection.regenerator}
        />

        <InspectionFeedContent inspection={inspection} />
      </div>
    )
  }

  return <div />
}
