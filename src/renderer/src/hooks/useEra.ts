import {
  regeneratorPoolAbi,
  regeneratorPoolAddress,
  sequoiaRegeneratorPoolAbi,
  sequoiaRegeneratorPoolAddress
} from '@renderer/services/contracts'
import { formatUnits } from 'viem'
import { useChainId, useReadContract } from 'wagmi'

interface ReturnUseEraProps {
  currentEra: number
  currentEpoch: number
  nextEraIn: number
}

export function useEra(): ReturnUseEraProps {
  const chainId = useChainId()

  const { data: responseCurrentEra } = useReadContract({
    address: chainId === 250225 ? regeneratorPoolAddress : sequoiaRegeneratorPoolAddress,
    abi: chainId === 250225 ? regeneratorPoolAbi : sequoiaRegeneratorPoolAbi,
    functionName: 'currentContractEra'
  })

  const currentEra = responseCurrentEra
    ? parseInt(formatUnits(BigInt(responseCurrentEra as string), 0))
    : 0

  const { data: responseNextEra } = useReadContract({
    address: chainId === 250225 ? regeneratorPoolAddress : sequoiaRegeneratorPoolAddress,
    abi: chainId === 250225 ? regeneratorPoolAbi : sequoiaRegeneratorPoolAbi,
    functionName: 'nextEraIn',
    args: [currentEra]
  })

  const nextEraIn = responseNextEra
    ? parseInt(formatUnits(BigInt(responseNextEra as string), 0))
    : 0

  const { data: responseCurrentEpoch } = useReadContract({
    address: chainId === 250225 ? regeneratorPoolAddress : sequoiaRegeneratorPoolAddress,
    abi: chainId === 250225 ? regeneratorPoolAbi : sequoiaRegeneratorPoolAbi,
    functionName: 'currentEpoch'
  })

  const currentEpoch = responseCurrentEpoch
    ? parseInt(formatUnits(BigInt(responseCurrentEpoch as string), 0))
    : 0

  return {
    currentEra,
    currentEpoch,
    nextEraIn
  }
}
