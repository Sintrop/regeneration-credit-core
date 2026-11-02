import { regeneratorPoolAbi, regeneratorPoolAddress } from '@renderer/services/contracts'
import { formatUnits } from 'viem'
import { useReadContract } from 'wagmi'

interface ReturnUseEraProps {
  currentEra: number
  currentEpoch: number
  nextEraIn: number
}

export function useEra(): ReturnUseEraProps {
  const { data: responseCurrentEra } = useReadContract({
    address: regeneratorPoolAddress,
    abi: regeneratorPoolAbi,
    functionName: 'currentContractEra'
  })

  const currentEra = responseCurrentEra
    ? parseInt(formatUnits(BigInt(responseCurrentEra as string), 0))
    : 0

  const { data: responseNextEra } = useReadContract({
    address: regeneratorPoolAddress,
    abi: regeneratorPoolAbi,
    functionName: 'nextEraIn',
    args: [currentEra]
  })

  const nextEraIn = responseNextEra
    ? parseInt(formatUnits(BigInt(responseNextEra as string), 0))
    : 0

  const { data: responseCurrentEpoch } = useReadContract({
    address: regeneratorPoolAddress,
    abi: regeneratorPoolAbi,
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
