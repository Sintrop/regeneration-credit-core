import { useChainId, useReadContract } from 'wagmi'
import {
  contributorAbi,
  contributorAddress,
  sequoiaContributorAbi,
  sequoiaContributorAddress
} from '@renderer/services/contracts'
import { formatUnits } from 'viem'
import { ContributionProps } from '@renderer/types/contributor'

interface Props {
  id: number
}

export function ContributionItem({ id }: Props): JSX.Element {
  const chainId = useChainId()
  const { data } = useReadContract({
    address: chainId === 250225 ? contributorAddress : sequoiaContributorAddress,
    abi: chainId === 250225 ? contributorAbi : sequoiaContributorAbi,
    functionName: 'getContribution',
    args: [id]
  })

  const contribution = data as ContributionProps

  return (
    <div className="flex items-center bg-container-primary px-5 h-10 border-b border-container-secondary">
      <div className="border-r border-container-secondary w-[50px]">
        <p className="text-white">{id}</p>
      </div>

      <div className="border-r border-container-secondary flex-1 pl-5">
        <p className="text-white">{contribution && contribution?.user}</p>
      </div>

      <div className="border-r border-container-secondary w-[120px] pl-5">
        <p className="text-white">
          {contribution && formatUnits(BigInt(contribution?.createdAtBlockNumber), 0)}
        </p>
      </div>

      <div className="border-r border-container-secondary w-[120px] pl-5">
        <p className="text-white">{contribution && formatUnits(BigInt(contribution?.era), 0)}</p>
      </div>

      <div className="border-r border-container-secondary w-[200px] pl-5 overflow-hidden">
        <p className="text-white text-truncate text-ellipsis max-w-[90%]">
          {contribution && contribution.report}
        </p>
      </div>

      <div className="border-r border-container-secondary w-[120px] pl-5">
        <p className="text-white"></p>
      </div>
    </div>
  )
}
