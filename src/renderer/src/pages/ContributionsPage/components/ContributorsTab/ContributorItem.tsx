import { useReadContract } from 'wagmi'
import { contributorAbi, contributorAddress } from '@renderer/services/contracts'
import { formatUnits } from 'viem'
import { ContributorProps } from '@renderer/types/contributor'
import { UserAddressLink } from '@renderer/components/UserAddressLink/UserAddressLink'

interface Props {
  id: number
}

export function ContributorItem({ id }: Props): JSX.Element {
  const { data } = useReadContract({
    address: contributorAddress,
    abi: contributorAbi,
    functionName: 'contributorsAddress',
    args: [id]
  })

  const userContributorAddress = data as string

  const { data: contributorResponse } = useReadContract({
    address: contributorAddress,
    abi: contributorAbi,
    functionName: 'getContributor',
    args: [userContributorAddress]
  })

  const contributor = contributorResponse as ContributorProps

  return (
    <tr className="border-b border-container-primary text-white">
      <td className="p-2">{id}</td>
      <td className="p-2 max-w-[100px]">
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
