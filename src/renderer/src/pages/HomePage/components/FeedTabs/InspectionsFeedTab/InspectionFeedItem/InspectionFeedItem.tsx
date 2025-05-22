import { useChainId, useReadContract } from 'wagmi'
import {
  inspectionAbi,
  inspectionAddress,
  regeneratorAbi,
  regeneratorAddress,
  sequoiaInspectionAbi,
  sequoiaInspectionAddress,
  sequoiaRegeneratorAbi,
  sequoiaRegeneratorAddress
} from '@renderer/services/contracts'
import { formatUnits } from 'viem'
import { HeaderFeedItem } from '../../HeaderFeedItem/HeaderFeedItem'
import { InspectionFeedContent } from './InspectionFeedContent'
import { ResourceValidationsFeed } from '../../ResourceValidationsFeed/ResourceValidationsFeed'
import { InspectionProps } from '@renderer/types/inspection'
import { RegeneratorProps } from '@renderer/types/regenerator'

interface Props {
  id: number
}

export function InspectionFeedItem({ id }: Props): JSX.Element {
  const chainId = useChainId()
  const { data } = useReadContract({
    address: chainId === 250225 ? inspectionAddress : sequoiaInspectionAddress,
    abi: chainId === 250225 ? inspectionAbi : sequoiaInspectionAbi,
    functionName: 'getInspection',
    args: [id]
  })

  const inspection = data as InspectionProps

  const { data: data2 } = useReadContract({
    address: chainId === 250225 ? regeneratorAddress : sequoiaRegeneratorAddress,
    abi: chainId === 250225 ? regeneratorAbi : sequoiaRegeneratorAbi,
    functionName: 'getRegenerator',
    args: [inspection?.regenerator]
  })

  const regenerator = data2 as RegeneratorProps

  if (regenerator && regenerator) {
    return (
      <div className="flex flex-col rounded-2xl p-3 bg-container-primary w-full">
        <HeaderFeedItem
          name={regenerator.name}
          proofPhoto={regenerator.proofPhoto}
          publishedAt={formatUnits(BigInt(inspection.createdAt), 0)}
          address={inspection.regenerator}
        />

        <InspectionFeedContent inspection={inspection} />

        <ResourceValidationsFeed
          resourceId={id}
          resourceType="inspection"
          validationsCount={parseInt(formatUnits(BigInt(inspection.validationsCount), 0))}
        />
      </div>
    )
  }

  return <div />
}
