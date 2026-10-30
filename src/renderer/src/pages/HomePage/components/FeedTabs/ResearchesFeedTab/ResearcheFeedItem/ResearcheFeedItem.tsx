import { useReadContract } from 'wagmi'
import { researcherAbi, researcherAddress } from '@renderer/services/contracts'
import { formatUnits } from 'viem'
import { ResearcherProps, ResearchProps } from '@renderer/types/researcher'
import { HeaderFeedItem } from '../../HeaderFeedItem/HeaderFeedItem'
import { ResearcheFeedContent } from './ResearcheFeedContent'

interface Props {
  id: number
}

export function ResearcheFeedItem({ id }: Props): JSX.Element {
  const { data } = useReadContract({
    address: researcherAddress,
    abi: researcherAbi,
    functionName: 'getResearch',
    args: [id]
  })

  const research = data as ResearchProps

  const { data: data2 } = useReadContract({
    address: researcherAddress,
    abi: researcherAbi,
    functionName: 'getResearcher',
    args: [research?.createdBy]
  })

  const researcher = data2 as ResearcherProps

  if (researcher && research) {
    return (
      <div className="flex flex-col p-3 w-full border-t border-green-900">
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
      </div>
    )
  }

  return <div />
}
