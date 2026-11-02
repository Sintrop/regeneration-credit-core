import { useWriteContract } from '@renderer/hooks/useSintropTransaction'

import { supporterAbi, supporterAddress } from '@renderer/services/contracts'

const INVITER_PERCENTAGE = 5

interface OffsetProps {
  amountWei: bigint
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
  const { data, isError, isPending, error, writeContract } = useWriteContract()

  async function handleOffset(data: OffsetProps): Promise<void> {
    const value = data.amountWei
    // SupporterRules.INVITER_PERCENTAGE: at most 5% goes to the inviter, the rest must be burned.
    const minAmmountToBurnParsed = (value * BigInt(100 - INVITER_PERCENTAGE)) / 100n

    writeContract({
      address: supporterAddress,
      abi: supporterAbi,
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
