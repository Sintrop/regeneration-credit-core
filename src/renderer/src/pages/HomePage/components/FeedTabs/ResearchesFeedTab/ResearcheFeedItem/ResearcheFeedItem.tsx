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

  return (
    <div className="flex flex-col rounded-2xl p-3 bg-container-primary w-full">
      <HeaderFeedItem
        name={researcher && researcher.name}
        proofPhoto={researcher && researcher.proofPhoto}
        publishedAt={research && formatUnits(BigInt(research.createdAtBlock), 0)}
        address={research && research.createdBy}
      />

      <ResearcheFeedContent
        era={research ? parseInt(formatUnits(BigInt(research.era), 0)) : 0}
        report={research ? research.file : ''}
      />
    </div>
  )
}
