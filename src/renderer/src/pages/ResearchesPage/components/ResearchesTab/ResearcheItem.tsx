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
import { UserAddressLink } from '@renderer/components/UserAddressLink/UserAddressLink'

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
    <tr className="border-b border-container-primary text-white">
      <td className="p-2">{id}</td>
      <td className="p-2">{research && <UserAddressLink address={research?.createdBy} />}</td>
      <td className="p-2">{research && formatUnits(BigInt(research?.createdAtBlock), 0)}</td>
      <td className="p-2">{research && formatUnits(BigInt(research?.era), 0)}</td>
      <td className="p-2">{research && <PdfHashLink hash={research?.file} />}</td>
      <td className="p-2">action</td>
    </tr>
  )
}
