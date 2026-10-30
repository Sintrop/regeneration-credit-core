import { useReadContract } from 'wagmi'
import { contributorAbi, contributorAddress } from '@renderer/services/contracts'
import { formatUnits } from 'viem'
import { ContributionProps, ContributorProps } from '@renderer/types/contributor'
import { ContributionFeedContent } from './ContributionFeedContent'
import { HeaderFeedItem } from '../../HeaderFeedItem/HeaderFeedItem'

interface Props {
  id: number
}

export function ContributionFeedItem({ id }: Props): JSX.Element {
  const { data } = useReadContract({
    address: contributorAddress,
    abi: contributorAbi,
    functionName: 'getContribution',
    args: [id]
  })
  const contribution = data as ContributionProps

  const { data: resContributor } = useReadContract({
    address: contributorAddress,
    abi: contributorAbi,
    functionName: 'getContributor',
    args: [data ? contribution.user : '']
  })
  const contributor = resContributor as ContributorProps

  if (contribution && contributor) {
    return (
      <div className="flex flex-col p-3 w-full border-t border-green-900">
        <HeaderFeedItem
          address={contributor.contributorWallet}
          name={contributor.name}
          proofPhoto={contributor.proofPhoto}
          publishedAt={formatUnits(BigInt(contribution.createdAtBlockNumber), 0)}
        />
        <ContributionFeedContent
          contributionId={id}
          description={contribution.description}
          valid={contribution.valid.toString() === 'true' ? true : false}
        />
      </div>
    )
  }

  return <div />
}
