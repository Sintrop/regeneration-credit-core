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
import { useUserContext } from '@renderer/hooks/useUserContext'

export function DeveloperCard({ setLastPublishedWork }: ContentCardProps): JSX.Element {
  const { setEraPool } = useUserContext()
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
    setEraPool(parseInt(formatUnits(BigInt(developer.pool.currentEra), 0)))
  }

  return (
    <BasicData
      address={address ? address : ''}
      name={developer ? developer?.name : ''}
      photoHash={developer ? developer?.proofPhoto : ''}
      userTypeName="developer"
      indicator={developer ? parseInt(formatUnits(BigInt(developer.pool.level), 0)) : 0}
    />
  )
}
