import { useReadContract } from 'wagmi'
import { supporterAbi, supporterAddress } from '@renderer/services/contracts'
import { bigNumberToFloat } from '@renderer/utils/bigNumberToFloat'
import { SupporterContractProps, SupporterProps } from '@renderer/types/supporter'

interface ReturnUseSupporter {
  isLoading: boolean
  isError: boolean
  refetch: () => void
  supporter: SupporterProps
}
interface Props {
  address: string
}
export function useSupporter({ address }: Props): ReturnUseSupporter {
  const {
    data: response,
    isLoading,
    isError,
    refetch
  } = useReadContract({
    address: supporterAddress,
    abi: supporterAbi,
    functionName: 'getSupporter',
    args: [address]
  })

  const data = response as SupporterContractProps

  const supporter: SupporterProps = {
    id: data ? bigNumberToFloat(data?.id) : 0,
    createdAt: data ? bigNumberToFloat(data.createdAt) : 0,
    name: data ? data.name : '',
    profilePhoto: data ? data.profilePhoto : '',
    supporterWallet: data ? data.supporterWallet : '',
    description: data ? data.description : '',
    offsetsCount: data ? bigNumberToFloat(data.offsetsCount) : 0,
    reductionItemsCount: data ? bigNumberToFloat(data.reductionItemsCount) : 0
  }

  return {
    supporter,
    isLoading,
    isError,
    refetch
  }
}
