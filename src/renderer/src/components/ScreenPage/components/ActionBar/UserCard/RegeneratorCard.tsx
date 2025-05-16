import {
  regeneratorAddress,
  regeneratorAbi,
  sequoiaRegeneratorAbi,
  sequoiaRegeneratorAddress
} from '@renderer/services/contracts'
import { useAccount, useChainId, useReadContract } from 'wagmi'
import { BasicData } from './BasicData'
import { RegeneratorProps } from '@renderer/types/regenerator'

export function RegeneratorCard(): JSX.Element {
  const { address } = useAccount()
  const chainId = useChainId()

  const { data } = useReadContract({
    address: chainId === 250225 ? regeneratorAddress : sequoiaRegeneratorAddress,
    abi: chainId === 250225 ? regeneratorAbi : sequoiaRegeneratorAbi,
    functionName: 'getRegenerator',
    args: [address]
  })

  const regenerator = data as RegeneratorProps

  return (
    <BasicData
      address={address ? address : ''}
      name={regenerator ? regenerator?.name : ''}
      photoHash={regenerator ? regenerator?.proofPhoto : ''}
      userTypeName="regenerator"
    />
  )
}
