import {
  regeneratorAddress,
  regeneratorAbi,
  sequoiaRegeneratorAbi,
  sequoiaRegeneratorAddress
} from '@renderer/services/contracts'
import { useAccount, useChainId, useReadContract } from 'wagmi'
import { BasicData } from './BasicData'
import { RegeneratorProps } from '@renderer/types/regenerator'
import { ContentCardProps } from './UserCard'
import { formatUnits } from 'viem'

export function RegeneratorCard({ changeIndicator }: ContentCardProps): JSX.Element {
  const { address } = useAccount()
  const chainId = useChainId()

  const { data } = useReadContract({
    address: chainId === 250225 ? regeneratorAddress : sequoiaRegeneratorAddress,
    abi: chainId === 250225 ? regeneratorAbi : sequoiaRegeneratorAbi,
    functionName: 'getRegenerator',
    args: [address]
  })

  const regenerator = data as RegeneratorProps

  if (regenerator) {
    changeIndicator(parseInt(formatUnits(BigInt(regenerator?.regenerationScore.score), 0)))
  }

  return (
    <BasicData
      address={address ? address : ''}
      name={regenerator ? regenerator?.name : ''}
      photoHash={regenerator ? regenerator?.proofPhoto : ''}
    />
  )
}
