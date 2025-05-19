import { useChainId, useReadContract } from 'wagmi'
import {
  contributorAbi,
  contributorAddress,
  sequoiaContributorAbi,
  sequoiaContributorAddress
} from '@renderer/services/contracts'
import { formatUnits } from 'viem'
import { ContributionProps } from '@renderer/types/contributor'
import { ContributionFeedHeader } from './ContributionFeedHeader'
import { ContributionFeedContent } from './ContributionFeedContent'

interface Props {
  id: number
}

export function ContributionFeedItem({ id }: Props): JSX.Element {
  const chainId = useChainId()
  const { data } = useReadContract({
    address: chainId === 250225 ? contributorAddress : sequoiaContributorAddress,
    abi: chainId === 250225 ? contributorAbi : sequoiaContributorAbi,
    functionName: 'getContribution',
    args: [id]
  })

  const contribution = data as ContributionProps

  if (contribution) {
    return (
      <div className="flex flex-col rounded-2xl p-3 bg-container-primary w-full">
        <ContributionFeedHeader
          address={contribution?.user}
          publishedAt={formatUnits(BigInt(contribution.createdAtBlockNumber), 0)}
        />
        <ContributionFeedContent contributionId={id} description={contribution.description} />
      </div>
    )
  }

  return <div />
}
