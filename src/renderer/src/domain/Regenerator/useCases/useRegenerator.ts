import { useReadContract } from 'wagmi'
import { useMainnet } from '@renderer/hooks/useMainnet'
import {
  regeneratorAbi,
  regeneratorAddress,
  sequoiaRegeneratorAbi,
  sequoiaRegeneratorAddress
} from '@renderer/services/contracts'
import { RegeneratorContractProps, RegeneratorProps } from '@renderer/types/regenerator'
import { bigNumberToFloat } from '@renderer/utils/bigNumberToFloat'

interface ReturnUserRegenerator {
  isLoading: boolean
  isError: boolean
  refetch: () => void
  regenerator: RegeneratorProps
}
interface Props {
  address: string
}
export function useRegenerator({ address }: Props): ReturnUserRegenerator {
  const mainnet = useMainnet()
  const {
    data: response,
    isLoading,
    isError,
    refetch
  } = useReadContract({
    address: mainnet ? regeneratorAddress : sequoiaRegeneratorAddress,
    abi: mainnet ? regeneratorAbi : sequoiaRegeneratorAbi,
    functionName: 'getRegenerator',
    args: [address]
  })

  const data = response as RegeneratorContractProps

  const regenerator: RegeneratorProps = {
    id: data ? bigNumberToFloat(data?.id) : 0,
    coordinatesCount: data ? bigNumberToFloat(data.coordinatesCount) : 0,
    createdAt: data ? bigNumberToFloat(data.createdAt) : 0,
    lastRequestAt: data ? bigNumberToFloat(data.lastRequestAt) : 0,
    name: data ? data.name : '',
    pendingInspection: data ? data.pendingInspection : false,
    pool: {
      currentEra: data ? bigNumberToFloat(data.pool.currentEra) : 0,
      onContractPool: data ? data.pool.onContractPool : false
    },
    proofPhoto: data ? data.proofPhoto : '',
    regenerationScore: {
      score: data ? bigNumberToFloat(data?.regenerationScore.score) : 0
    },
    regeneratorWallet: data ? data.regeneratorWallet : '',
    totalArea: data ? bigNumberToFloat(data.totalArea) : 0,
    totalInspections: data ? bigNumberToFloat(data.totalInspections) : 0
  }

  return {
    regenerator,
    isLoading,
    isError,
    refetch
  }
}
