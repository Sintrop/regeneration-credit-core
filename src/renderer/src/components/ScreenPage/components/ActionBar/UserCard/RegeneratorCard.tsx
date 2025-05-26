import {
  regeneratorAddress,
  regeneratorAbi,
  sequoiaRegeneratorAbi,
  sequoiaRegeneratorAddress
} from '@renderer/services/contracts'
import { useAccount, useChainId, useReadContract } from 'wagmi'
import { BasicData } from './BasicData'
import { RegeneratorProps } from '@renderer/types/regenerator'
import { formatUnits } from 'viem'
import { useUserContext } from '@renderer/hooks/useUserContext'

export function RegeneratorCard(): JSX.Element {
  const { setEraPool } = useUserContext()
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
    setEraPool(parseInt(formatUnits(BigInt(regenerator.pool.currentEra), 0)))
  }

  return (
    <BasicData
      address={address ? address : ''}
      name={regenerator ? regenerator?.name : ''}
      photoHash={regenerator ? regenerator?.proofPhoto : ''}
      userTypeName="regenerator"
      indicator={
        regenerator ? parseInt(formatUnits(BigInt(regenerator.regenerationScore.score), 0)) : 0
      }
    />
  )
}
