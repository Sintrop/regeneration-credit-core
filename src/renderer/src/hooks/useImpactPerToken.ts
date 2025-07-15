import { formatUnits } from 'viem'
import { useChainId, useReadContracts } from 'wagmi'
import {
  rcImpactAbi,
  rcImpactAddress,
  sequoiaRcImpactAbi,
  sequoiaRcImpactAddress
} from '@renderer/services/contracts'

interface ReturnUseImpactPerTokenProps {
  isLoading: boolean
  carbonPerToken: number
  treesPerToken: number
  soilPerToken: number
  biodiversityPerToken: number
}
export function useImpactPerToken(): ReturnUseImpactPerTokenProps {
  const chainId = useChainId()

  const rcImpactContract = {
    address: chainId === 250225 ? rcImpactAddress : sequoiaRcImpactAddress,
    abi: chainId === 250225 ? rcImpactAbi : sequoiaRcImpactAbi
  } as const

  const { data, isLoading } = useReadContracts({
    contracts: [
      {
        ...rcImpactContract,
        functionName: 'treesPerToken'
      },
      {
        ...rcImpactContract,
        functionName: 'carbonPerToken'
      },
      {
        ...rcImpactContract,
        functionName: 'soilPerToken'
      },
      {
        ...rcImpactContract,
        functionName: 'biodiversityPerToken'
      }
    ]
  })

  let treesPerToken = 0
  let carbonPerToken = 0
  let soilPerToken = 0
  let biodiversityPerToken = 0

  if (data) {
    const _treesPerToken = data[0].status === 'success' ? (data[0]?.result as string) : '0'
    treesPerToken = parseFloat(formatUnits(BigInt(_treesPerToken), 14))

    const _carbonPerToken = data[1].status === 'success' ? (data[1]?.result as string) : '0'
    carbonPerToken = parseFloat(formatUnits(BigInt(_carbonPerToken), 14))

    const _soilPerToken = data[2].status === 'success' ? (data[2]?.result as string) : '0'
    soilPerToken = parseFloat(formatUnits(BigInt(_soilPerToken), 14))

    const _biodiversityPerToken = data[3].status === 'success' ? (data[3]?.result as string) : '0'
    biodiversityPerToken = parseFloat(formatUnits(BigInt(_biodiversityPerToken), 14))
  }

  return {
    carbonPerToken,
    treesPerToken,
    soilPerToken,
    biodiversityPerToken,
    isLoading
  }
}
