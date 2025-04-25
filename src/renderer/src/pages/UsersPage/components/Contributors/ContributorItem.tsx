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

interface Props {
  id: number
}

export function ContributorItem({ id }: Props): JSX.Element {
  const chainId = useChainId()
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
      <td className="p-2"></td>
    </tr>
  )
}
