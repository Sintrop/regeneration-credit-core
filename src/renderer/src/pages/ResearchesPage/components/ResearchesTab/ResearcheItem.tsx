import { useChainId, useReadContract } from 'wagmi'
import {
  researcherAbi,
  researcherAddress,
  sequoiaResearcherAbi,
  sequoiaResearcherAddress
} from '@renderer/services/contracts'
import { formatUnits } from 'viem'
import { ResearchProps } from '@renderer/types/researcher'
import { UserAddressLink } from '@renderer/components/UserAddressLink/UserAddressLink'
import { FaRegEye } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { BiSolidMegaphone } from 'react-icons/bi'
import { VoteResearch } from '@renderer/components/Votes/VoteResearch'
import { ValidTag } from '@renderer/components/ValidTag/ValidTag'

interface Props {
  id: number
}

export function ResearcheItem({ id }: Props): JSX.Element {
  const navigate = useNavigate()
  const chainId = useChainId()
  const [showVote, setShowVote] = useState(false)
  const { data } = useReadContract({
    address: chainId === 250225 ? researcherAddress : sequoiaResearcherAddress,
    abi: chainId === 250225 ? researcherAbi : sequoiaResearcherAbi,
    functionName: 'getResearch',
    args: [id]
  })

  const research = data as ResearchProps

  function handleGoToResearcheDetails(): void {
    navigate(`/resource-details/researche/${id}`)
  }

  function handleShowVote(): void {
    setShowVote(true)
  }

  if (research) {
    return (
      <tr className="border-b border-container-primary text-white">
        <td className="p-2">{id}</td>
        <td className="p-2">{<UserAddressLink address={research?.createdBy} />}</td>
        <td className="p-2">{formatUnits(BigInt(research?.createdAtBlock), 0)}</td>
        <td className="p-2">{formatUnits(BigInt(research?.era), 0)}</td>
        <td className="p-2">{formatUnits(BigInt(research?.validationsCount), 0)}</td>
        <td className="p-2">
          <ValidTag valid={research.valid.toString() === 'true' ? true : false} />
        </td>
        <td className="p-2 flex items-center gap-5">
          <button className="hover:cursor-pointer" onClick={handleGoToResearcheDetails}>
            <FaRegEye color="white" />
          </button>
  
          <button className="hover:cursor-pointer" onClick={handleShowVote}>
            <BiSolidMegaphone color="white" />
          </button>
        </td>
  
        {showVote && (
          <VoteResearch
            close={() => setShowVote(false)}
            researchId={id}
            publishedEra={parseInt(formatUnits(BigInt(research?.era), 0))}
          />
        )}
      </tr>
    )
  }

  return <tr />
}
