import { useChainId, useReadContract } from 'wagmi'
import {
  contributorAbi,
  contributorAddress,
  sequoiaContributorAbi,
  sequoiaContributorAddress
} from '@renderer/services/contracts'
import { formatUnits } from 'viem'
import { ContributorProps } from '@renderer/types/contributor'
import { UserAddressLink } from '@renderer/components/UserAddressLink/UserAddressLink'
import { useState } from 'react'
import { BiSolidMegaphone } from 'react-icons/bi'
import { VoteUser } from '@renderer/components/Votes/VoteUser'

interface Props {
  id: number
}

export function ContributorItem({ id }: Props): JSX.Element {
  const chainId = useChainId()
  const [showVote, setShowVote] = useState(false)
  const { data } = useReadContract({
    address: chainId === 250225 ? contributorAddress : sequoiaContributorAddress,
    abi: chainId === 250225 ? contributorAbi : sequoiaContributorAbi,
    functionName: 'contributorsAddress',
    args: [id]
  })

  const userContributorAddress = data as string

  const { data: contributorResponse } = useReadContract({
    address: chainId === 250225 ? contributorAddress : sequoiaContributorAddress,
    abi: chainId === 250225 ? contributorAbi : sequoiaContributorAbi,
    functionName: 'getContributor',
    args: [userContributorAddress]
  })

  const contributor = contributorResponse as ContributorProps

  function handleShowVote(): void {
    setShowVote(true)
  }

  return (
    <tr className="border-b border-container-primary text-white">
      <td className="p-2">{id}</td>
      <td className="p-2">
        {contributor && <UserAddressLink address={contributor?.contributorWallet} />}
      </td>
      <td className="p-2">{contributor && contributor?.name}</td>
      <td className="p-2">{contributor && formatUnits(BigInt(contributor?.createdAt), 0)}</td>
      <td className="p-2">{contributor && formatUnits(BigInt(contributor?.pool?.level), 0)}</td>
      <td className="p-2">{contributor && formatUnits(BigInt(contributor?.pool?.level), 0)}</td>
      <td className="p-2 flex items-center gap-5">
        <button className="hover:cursor-pointer" onClick={handleShowVote}>
          <BiSolidMegaphone color="white" />
        </button>
      </td>

      {showVote && (
        <VoteUser userWallet={contributor.contributorWallet} close={() => setShowVote(false)} />
      )}
    </tr>
  )
}
