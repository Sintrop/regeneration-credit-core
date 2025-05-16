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
import { useState } from 'react'
import { BiSolidMegaphone } from 'react-icons/bi'
import { VoteUser } from '@renderer/components/Votes/VoteUser'

interface Props {
  id: number
}

export function ResearcherItem({ id }: Props): JSX.Element {
  const chainId = useChainId()
  const [showVote, setShowVote] = useState(false)
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

  function handleShowVote(): void {
    setShowVote(true)
  }

  return (
    <tr className="border-b border-container-primary text-white">
      <td className="p-2">{id}</td>
      <td className="p-2">
        {researcher && <UserAddressLink address={researcher?.researcherWallet} />}
      </td>
      <td className="p-2">{researcher && researcher?.name}</td>
      <td className="p-2">{researcher && formatUnits(BigInt(researcher?.createdAt), 0)}</td>
      <td className="p-2">{researcher && formatUnits(BigInt(researcher?.pool?.level), 0)}</td>
      <td className="p-2">{researcher && formatUnits(BigInt(researcher?.pool?.level), 0)}</td>
      <td className="p-2 flex items-center gap-5">
        <button className="hover:cursor-pointer" onClick={handleShowVote}>
          <BiSolidMegaphone color="white" />
        </button>
      </td>

      {showVote && (
        <VoteUser userWallet={researcher.researcherWallet} close={() => setShowVote(false)} />
      )}
    </tr>
  )
}
