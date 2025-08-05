import { useChainId, useReadContract } from 'wagmi'
import {
  researcherAbi,
  researcherAddress,
  sequoiaResearcherAbi,
  sequoiaResearcherAddress
} from '@renderer/services/contracts'
import { formatUnits } from 'viem'
import { ResearcherProps } from '@renderer/types/researcher'
import { UserAddressLink } from '@renderer/components/UserAddressLink/UserAddressLink'

interface Props {
  id: number
}

export function ResearcherItem({ id }: Props): JSX.Element {
  const chainId = useChainId()
  const { data } = useReadContract({
    address: chainId === 250225 ? researcherAddress : sequoiaResearcherAddress,
    abi: chainId === 250225 ? researcherAbi : sequoiaResearcherAbi,
    functionName: 'researchersAddress',
    args: [id]
  })

  const userResearcherAddress = data as string

  const { data: researcherResponse } = useReadContract({
    address: chainId === 250225 ? researcherAddress : sequoiaResearcherAddress,
    abi: chainId === 250225 ? researcherAbi : sequoiaResearcherAbi,
    functionName: 'getResearcher',
    args: [userResearcherAddress]
  })

  const researcher = researcherResponse as ResearcherProps

  return (
    <tr className="border-b border-container-primary text-white">
      <td className="p-2">{id}</td>
      <td className="p-2 max-w-[100px]">
        {researcher && <UserAddressLink address={researcher?.researcherWallet} />}
      </td>
      <td className="p-2">{researcher && researcher?.name}</td>
      <td className="p-2">{researcher && formatUnits(BigInt(researcher?.createdAt), 0)}</td>
      <td className="p-2">{researcher && formatUnits(BigInt(researcher?.pool?.level), 0)}</td>
      <td className="p-2">{researcher && formatUnits(BigInt(researcher?.pool?.level), 0)}</td>
      <td className="p-2"></td>
    </tr>
  )
}
