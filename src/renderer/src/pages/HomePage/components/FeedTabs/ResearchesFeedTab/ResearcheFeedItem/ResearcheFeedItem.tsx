import { useChainId, useReadContract } from 'wagmi'
import {
  researcherAbi,
  researcherAddress,
  sequoiaResearcherAbi,
  sequoiaResearcherAddress
} from '@renderer/services/contracts'
import { formatUnits } from 'viem'
import { ResearcherProps, ResearchProps } from '@renderer/types/researcher'
import { HeaderFeedItem } from '../../HeaderFeedItem/HeaderFeedItem'
import { ResearcheFeedContent } from './ResearcheFeedContent'
import { ResourceValidationsFeed } from '../../ResourceValidationsFeed/ResourceValidationsFeed'

interface Props {
  id: number
}

export function ResearcheFeedItem({ id }: Props): JSX.Element {
  const chainId = useChainId()
  const { data } = useReadContract({
    address: chainId === 250225 ? researcherAddress : sequoiaResearcherAddress,
    abi: chainId === 250225 ? researcherAbi : sequoiaResearcherAbi,
    functionName: 'getResearch',
    args: [id]
  })

  const research = data as ResearchProps

  const { data: data2 } = useReadContract({
    address: chainId === 250225 ? researcherAddress : sequoiaResearcherAddress,
    abi: chainId === 250225 ? researcherAbi : sequoiaResearcherAbi,
    functionName: 'getResearcher',
    args: [research?.createdBy]
  })

  const researcher = data2 as ResearcherProps

  if (researcher && research) {
    return (
      <div className="flex flex-col rounded-2xl p-3 bg-container-primary w-full">
        <HeaderFeedItem
          name={researcher.name}
          proofPhoto={researcher.proofPhoto}
          publishedAt={formatUnits(BigInt(research.createdAtBlock), 0)}
          address={research.createdBy}
        />

        <ResearcheFeedContent
          title={research.title}
          thesis={research.thesis}
          researchId={id}
          valid={research.valid.toString() === 'true' ? true : false}
        />

        <ResourceValidationsFeed
          resourceId={id}
          resourceType="research"
          validationsCount={parseInt(formatUnits(BigInt(research.validationsCount), 0))}
        />
      </div>
    )
  }

  return <div />
}
