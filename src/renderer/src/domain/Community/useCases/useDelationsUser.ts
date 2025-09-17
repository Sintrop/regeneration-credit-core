import { useReadContract } from 'wagmi'

import { useMainnet } from '@renderer/hooks/useMainnet'
import {
  sequoiaUserAbi,
  sequoiaUserAddress,
  userAbi,
  userAddress
} from '@renderer/services/contracts'
import { DelationContractProps, DelationProps } from '@renderer/types/community'
import { bigNumberToFloat } from '@renderer/utils/bigNumberToFloat'

interface Props {
  address: string
}

interface ReturnUseDelationsUserProps {
  isLoading: boolean
  delations: DelationProps[]
  refetch: () => void
  isError: boolean
}

export function useDelationsUser({ address }: Props): ReturnUseDelationsUserProps {
  const mainnet = useMainnet()
  const { data, isLoading, isError, refetch } = useReadContract({
    address: mainnet ? userAddress : sequoiaUserAddress,
    abi: mainnet ? userAbi : sequoiaUserAbi,
    functionName: 'getUserDelations',
    args: [address]
  })

  const delationsContract = data as DelationContractProps[]
  const delations: DelationProps[] = []

  if (delationsContract) {
    for (let i = 0; i < delationsContract.length; i++) {
      const delation = delationsContract[i]

      delations.push({
        id: bigNumberToFloat(delation?.id),
        createdAtBlock: bigNumberToFloat(delation?.createdAtBlock),
        informer: delation.informer,
        reported: delation.reported,
        testimony: delation.testimony,
        title: delation.title
      })
    }
  }
  return {
    isLoading,
    delations,
    isError,
    refetch
  }
}
