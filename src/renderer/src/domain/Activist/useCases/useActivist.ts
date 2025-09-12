import { useReadContract } from 'wagmi'
import { useMainnet } from '@renderer/hooks/useMainnet'
import {
  activistAbi,
  activistAddress,
  sequoiaActivistAbi,
  sequoiaActivistAddress
} from '@renderer/services/contracts'
import { bigNumberToFloat } from '@renderer/utils/bigNumberToFloat'
import { ActivistContractProps, ActivistProps } from '@renderer/types/activist'

interface ReturnUseActivist {
  isLoading: boolean
  isError: boolean
  refetch: () => void
  activist: ActivistProps
}
interface Props {
  address: string
}
export function useActivist({ address }: Props): ReturnUseActivist {
  const mainnet = useMainnet()
  const {
    data: response,
    isLoading,
    isError,
    refetch
  } = useReadContract({
    address: mainnet ? activistAddress : sequoiaActivistAddress,
    abi: mainnet ? activistAbi : sequoiaActivistAbi,
    functionName: 'getActivist',
    args: [address]
  })

  const data = response as ActivistContractProps

  const activist: ActivistProps = {
    id: data ? bigNumberToFloat(data?.id) : 0,
    createdAt: data ? bigNumberToFloat(data.createdAt) : 0,
    name: data ? data.name : '',
    pool: {
      currentEra: data ? bigNumberToFloat(data.pool.currentEra) : 0,
      level: data ? bigNumberToFloat(data.pool.level) : 0
    },
    proofPhoto: data ? data.proofPhoto : '',
    activistWallet: data ? data.activistWallet : ''
  }

  return {
    activist,
    isLoading,
    isError,
    refetch
  }
}
