import { parseEther } from 'viem'
import { useWriteContract } from 'wagmi'

import { useMainnet } from '@renderer/hooks/useMainnet'
import {
  sequoiaSupporterAbi,
  sequoiaSupporterAddress,
  supporterAbi,
  supporterAddress
} from '@renderer/services/contracts'

interface OffsetProps {
  ammount: number
  calculatorItemId: number
  message?: string
}

interface ReturnUseOffsetProps {
  offset: (data: OffsetProps) => void
  isPending: boolean
  isError: boolean
  error?: string
  hash?: `0x${string}`
}

export function useOffset(): ReturnUseOffsetProps {
  const mainnet = useMainnet()
  const { data, isError, isPending, error, writeContract } = useWriteContract()

  async function handleOffset(data: OffsetProps): Promise<void> {
    const commissionPercentage = parseInt(import.meta.env.VITE_COMMISSION_PERCENTAGE)
    const value = parseEther(data.ammount.toString())
    const minAmmountToBurn = data.ammount * (1 - commissionPercentage / 100)
    const minAmmountToBurnParsed = parseEther(minAmmountToBurn.toString())

    writeContract({
      address: mainnet ? supporterAddress : sequoiaSupporterAddress,
      abi: mainnet ? supporterAbi : sequoiaSupporterAbi,
      functionName: 'offset',
      args: [
        value,
        minAmmountToBurnParsed,
        data.calculatorItemId,
        data?.message ? data.message : ''
      ]
    })
  }

  return {
    isError,
    isPending,
    error: error?.message,
    hash: data,
    offset: handleOffset
  }
}
