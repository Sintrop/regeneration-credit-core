import {
  contributorAddress,
  contributorAbi,
  sequoiaContributorAddress,
  sequoiaContributorAbi
} from '@renderer/services/contracts'
import { useAccount, useChainId, useReadContract } from 'wagmi'
import { BasicData } from './BasicData'
import { ContributorProps } from '@renderer/types/contributor'

export function ContributorCard(): JSX.Element {
  const { address } = useAccount()
  const chainId = useChainId()

  const { data } = useReadContract({
    address: chainId === 250225 ? contributorAddress : sequoiaContributorAddress,
    abi: chainId === 250225 ? contributorAbi : sequoiaContributorAbi,
    functionName: 'getContributor',
    args: [address]
  })

  const contributor = data as ContributorProps

  return (
    <BasicData
      address={address ? address : ''}
      name={contributor ? contributor?.name : ''}
      photoHash={contributor ? contributor?.proofPhoto : ''}
    />
  )
}
