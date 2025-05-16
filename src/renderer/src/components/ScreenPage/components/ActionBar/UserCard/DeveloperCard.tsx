import {
  developerAddress,
  sequoiaDeveloperAddress,
  developerAbi,
  sequoiaDeveloperAbi
} from '@renderer/services/contracts'
import { DeveloperProps } from '@renderer/types/developer'
import { useAccount, useChainId, useReadContract } from 'wagmi'
import { BasicData } from './BasicData'
import { ContentCardProps } from './UserCard'
import { formatUnits } from 'viem'

export function DeveloperCard({ setLastPublishedWork }: ContentCardProps): JSX.Element {
  const { address } = useAccount()
  const chainId = useChainId()

  const { data } = useReadContract({
    address: chainId === 250225 ? developerAddress : sequoiaDeveloperAddress,
    abi: chainId === 250225 ? developerAbi : sequoiaDeveloperAbi,
    functionName: 'getDeveloper',
    args: [address]
  })

  const developer = data as DeveloperProps

  if (developer) {
    setLastPublishedWork(parseInt(formatUnits(BigInt(developer?.lastPublishedAt), 0)))
  }

  return (
    <BasicData
      address={address ? address : ''}
      name={developer ? developer?.name : ''}
      photoHash={developer ? developer?.proofPhoto : ''}
      userTypeName="developer"
    />
  )
}
