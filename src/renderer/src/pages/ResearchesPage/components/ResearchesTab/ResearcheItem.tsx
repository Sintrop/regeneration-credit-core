import { useChainId, useReadContract } from 'wagmi'
import {
  researcherAbi,
  researcherAddress,
  sequoiaResearcherAbi,
  sequoiaResearcherAddress
} from '@renderer/services/contracts'
import { formatUnits } from 'viem'
import { ResearchProps } from '@renderer/types/researcher'
import { PdfHashLink } from '@renderer/components/PdfHashLink/PdfHashLink'

interface Props {
  id: number
}

export function ResearcheItem({ id }: Props): JSX.Element {
  const chainId = useChainId()
  const { data } = useReadContract({
    address: chainId === 250225 ? researcherAddress : sequoiaResearcherAddress,
    abi: chainId === 250225 ? researcherAbi : sequoiaResearcherAbi,
    functionName: 'getResearch',
    args: [id]
  })

  const research = data as ResearchProps

  return (
    <div className="flex items-center bg-container-primary px-5 h-10 border-b border-container-secondary">
      <div className="border-r border-container-secondary w-[50px]">
        <p className="text-white">{id}</p>
      </div>

      <div className="border-r border-container-secondary flex-1 pl-5">
        <p className="text-white">{research && research?.createdBy}</p>
      </div>

      <div className="border-r border-container-secondary w-[120px] pl-5">
        <p className="text-white">{research && formatUnits(BigInt(research?.createdAtBlock), 0)}</p>
      </div>

      <div className="border-r border-container-secondary w-[120px] pl-5">
        <p className="text-white">{research && formatUnits(BigInt(research?.era), 0)}</p>
      </div>

      <div className="border-r border-container-secondary w-[200px] pl-5 overflow-hidden">
        {research && <PdfHashLink hash={research?.file} />}
      </div>

      <div className="border-r border-container-secondary w-[120px] pl-5">
        <p className="text-white"></p>
      </div>
    </div>
  )
}
