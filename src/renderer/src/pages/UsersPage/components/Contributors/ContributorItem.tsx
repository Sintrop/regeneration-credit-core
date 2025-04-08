import { useChainId, useReadContract } from 'wagmi'
import {
  contributorAbi,
  contributorAddress,
  sequoiaContributorAbi,
  sequoiaContributorAddress
} from '@renderer/services/contracts'
import { formatUnits } from 'viem'
import { ContributorProps } from '@renderer/types/contributor'

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
    <div className="flex items-center bg-container-primary px-5 h-10 border-b border-container-secondary">
      <div className="border-r border-container-secondary min-w-[50px]">
        <p className="text-white">{id}</p>
      </div>

      <div className="border-r border-container-secondary min-w-[400px] pl-5">
        <p className="text-white truncate text-ellipsis">
          {contributor && contributor?.contributorWallet}
        </p>
      </div>

      <div className="border-r border-container-secondary min-w-[300px] pl-5">
        <p className="text-white">{contributor && contributor?.name}</p>
      </div>

      <div className="border-r border-container-secondary min-w-[120px] pl-5">
        <p className="text-white">
          {contributor && formatUnits(BigInt(contributor?.createdAt), 0)}
        </p>
      </div>

      <div className="border-r border-container-secondary min-w-[120px] pl-5">
        <p className="text-white">
          {contributor && formatUnits(BigInt(contributor?.pool?.level), 0)}
        </p>
      </div>

      <div className="border-r border-container-secondary min-w-[100px] pl-5 overflow-hidden">
        <p className="text-white text-truncate text-ellipsis max-w-[90%]">
          {contributor && formatUnits(BigInt(contributor?.pool?.level), 0)}
        </p>
      </div>

      <div className="border-r border-container-secondary min-w-[120px] pl-5">
        <p className="text-white"></p>
      </div>
    </div>
  )
}
