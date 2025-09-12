import { useReadContract } from 'wagmi'
import { useMainnet } from '@renderer/hooks/useMainnet'
import {
  inspectorAbi,
  inspectorAddress,
  sequoiaInspectorAbi,
  sequoiaInspectorAddress
} from '@renderer/services/contracts'
import { bigNumberToFloat } from '@renderer/utils/bigNumberToFloat'
import { InspectorContractProps, InspectorProps } from '@renderer/types/inspector'

interface ReturnUseInspector {
  isLoading: boolean
  isError: boolean
  refetch: () => void
  inspector: InspectorProps
}
interface Props {
  address: string
}
export function useInspector({ address }: Props): ReturnUseInspector {
  const mainnet = useMainnet()
  const {
    data: response,
    isLoading,
    isError,
    refetch
  } = useReadContract({
    address: mainnet ? inspectorAddress : sequoiaInspectorAddress,
    abi: mainnet ? inspectorAbi : sequoiaInspectorAbi,
    functionName: 'getInspector',
    args: [address]
  })

  const data = response as InspectorContractProps

  const inspector: InspectorProps = {
    id: data ? bigNumberToFloat(data?.id) : 0,
    createdAt: data ? bigNumberToFloat(data.createdAt) : 0,
    name: data ? data.name : '',
    pool: {
      currentEra: data ? bigNumberToFloat(data.pool.currentEra) : 0,
      level: data ? bigNumberToFloat(data.pool.level) : 0
    },
    proofPhoto: data ? data.proofPhoto : '',
    inspectorWallet: data ? data.inspectorWallet : '',
    giveUps: data ? bigNumberToFloat(data.giveUps) : 0,
    lastAcceptedAt: data ? bigNumberToFloat(data.lastAcceptedAt) : 0,
    lastInspection: data ? bigNumberToFloat(data.lastInspection) : 0,
    totalInspections: data ? bigNumberToFloat(data.totalInspections) : 0
  }

  return {
    inspector,
    isLoading,
    isError,
    refetch
  }
}
