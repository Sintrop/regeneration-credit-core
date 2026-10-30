import { contributorAddress, contributorAbi } from '@renderer/services/contracts'
import { useAccount, useReadContract } from 'wagmi'
import { BasicData } from './BasicData'
import { ContributorProps } from '@renderer/types/contributor'
import { ContentCardProps } from './UserCard'
import { formatUnits } from 'viem'
import { useUserContext } from '@renderer/hooks/useUserContext'

export function ContributorCard({ setLastPublishedWork }: ContentCardProps): JSX.Element {
  const { setEraPool } = useUserContext()
  const { address } = useAccount()

  const { data } = useReadContract({
    address: contributorAddress,
    abi: contributorAbi,
    functionName: 'getContributor',
    args: [address]
  })

  const contributor = data as ContributorProps

  if (contributor) {
    setLastPublishedWork(parseInt(formatUnits(BigInt(contributor?.lastPublishedAt), 0)))
    setEraPool(parseInt(formatUnits(BigInt(contributor.pool.currentEra), 0)))
  }

  return (
    <BasicData
      address={address ? address : ''}
      name={contributor ? contributor?.name : ''}
      photoHash={contributor ? contributor?.proofPhoto : ''}
      userTypeName="contributor"
      indicator={contributor ? parseInt(formatUnits(BigInt(contributor.pool.level), 0)) : 0}
    />
  )
}
