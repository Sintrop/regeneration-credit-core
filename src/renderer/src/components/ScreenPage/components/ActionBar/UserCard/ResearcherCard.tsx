import {
  researcherAddress,
  researcherAbi,
  sequoiaResearcherAddress,
  sequoiaResearcherAbi
} from '@renderer/services/contracts'
import { useAccount, useChainId, useReadContract } from 'wagmi'
import { BasicData } from './BasicData'
import { ResearcherProps } from '@renderer/types/researcher'
import { ContentCardProps } from './UserCard'
import { formatUnits } from 'viem'
import { useUserContext } from '@renderer/hooks/useUserContext'

export function ResearcherCard({ setLastPublishedWork }: ContentCardProps): JSX.Element {
  const { setEraPool } = useUserContext()
  const { address } = useAccount()
  const chainId = useChainId()

  const { data } = useReadContract({
    address: chainId === 250225 ? researcherAddress : sequoiaResearcherAddress,
    abi: chainId === 250225 ? researcherAbi : sequoiaResearcherAbi,
    functionName: 'getResearcher',
    args: [address]
  })

  const researcher = data as ResearcherProps

  if (researcher) {
    setLastPublishedWork(parseInt(formatUnits(BigInt(researcher?.lastPublishedAt), 0)))
    setEraPool(parseInt(formatUnits(BigInt(researcher.pool.currentEra), 0)))
  }

  return (
    <BasicData
      address={address ? address : ''}
      name={researcher ? researcher?.name : ''}
      photoHash={researcher ? researcher?.proofPhoto : ''}
      userTypeName="researcher"
      indicator={researcher ? parseInt(formatUnits(BigInt(researcher.pool.level), 0)) : 0}
    />
  )
}
