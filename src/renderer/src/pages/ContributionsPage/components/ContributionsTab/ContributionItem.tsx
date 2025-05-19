import { useChainId, useReadContract } from 'wagmi'
import {
  contributorAbi,
  contributorAddress,
  sequoiaContributorAbi,
  sequoiaContributorAddress
} from '@renderer/services/contracts'
import { formatUnits } from 'viem'
import { ContributionProps } from '@renderer/types/contributor'
import { UserAddressLink } from '@renderer/components/UserAddressLink/UserAddressLink'
import { PdfHashLink } from '@renderer/components/PdfHashLink/PdfHashLink'
import { FaRegEye } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { BiSolidMegaphone } from 'react-icons/bi'
import { VoteContribution } from '@renderer/components/Votes/VoteContribution'

interface Props {
  id: number
}

export function ContributionItem({ id }: Props): JSX.Element {
  const navigate = useNavigate()
  const chainId = useChainId()
  const [showVote, setShowVote] = useState(false)
  const { data } = useReadContract({
    address: chainId === 250225 ? contributorAddress : sequoiaContributorAddress,
    abi: chainId === 250225 ? contributorAbi : sequoiaContributorAbi,
    functionName: 'getContribution',
    args: [id]
  })

  const contribution = data as ContributionProps

  function handleGoToContributionDetails(): void {
    navigate(`/resource-details/contribution/${id}`)
  }

  function handleShowVote(): void {
    setShowVote(true)
  }

  return (
    <tr className="border-b border-container-primary text-white">
      <td className="p-2">{id}</td>
      <td className="p-2">{contribution && <UserAddressLink address={contribution?.user} />}</td>
      <td className="p-2">
        {contribution && formatUnits(BigInt(contribution?.createdAtBlockNumber), 0)}
      </td>
      <td className="p-2">{contribution && formatUnits(BigInt(contribution?.era), 0)}</td>
      <td className="p-2">{contribution && <PdfHashLink hash={contribution.report} />}</td>
      <td className="p-2 flex items-center gap-3">
        <button className="hover:cursor-pointer" onClick={handleGoToContributionDetails}>
          <FaRegEye color="white" />
        </button>

        <button className="hover:cursor-pointer" onClick={handleShowVote}>
          <BiSolidMegaphone color="white" />
        </button>
      </td>

      {showVote && (
        <VoteContribution
          contributionId={id}
          close={() => setShowVote(false)}
          publishedEra={parseInt(formatUnits(BigInt(contribution?.era), 0))}
        />
      )}
    </tr>
  )
}
