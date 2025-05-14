import {
  sequoiaUserAbi,
  sequoiaUserAddress,
  sequoiaValidationAbi,
  sequoiaValidationAddress,
  userAbi,
  userAddress,
  validationAbi,
  validationAddress
} from '@renderer/services/contracts'
import { useEffect, useState } from 'react'
import { useChainId, useReadContract } from 'wagmi'

interface ReturnUseCanVote {
  isLoading: boolean
  canVote: boolean
  canVoteThisResource: boolean
}
interface Props {
  address: string
  resource: 'inspection' | 'report' | 'contribution' | 'research'
}
export function useCanVote({ address }: Props): ReturnUseCanVote {
  const chainId = useChainId()
  const [canVoteThisResource, setCanVoteThisResource] = useState(false)

  const { data: responseGetUser, isLoading: loadingUser } = useReadContract({
    address: chainId === 250225 ? userAddress : sequoiaUserAddress,
    abi: chainId === 250225 ? userAbi : sequoiaUserAbi,
    functionName: 'getUser',
    args: [address]
  })

  const userType = responseGetUser as number

  const { data: responseCanVote, isLoading: loadingCanVote } = useReadContract({
    address: chainId === 250225 ? validationAddress : sequoiaValidationAddress,
    abi: chainId === 250225 ? validationAbi : sequoiaValidationAbi,
    functionName: 'waitedTimeBetweenVotes',
    args: [address]
  })

  const canVote = responseCanVote as boolean

  useEffect(() => {
    if (userType) {
      checkCanVoteThisResource(userType)
    }
  }, [userType])

  function checkCanVoteThisResource(userType: number): void {
    const findedUserType = usersVotables.find((item) => item === userType)
    if (findedUserType) setCanVoteThisResource(true)
  }

  return {
    isLoading: loadingCanVote || loadingUser,
    canVote: canVote ? canVote : false,
    canVoteThisResource
  }
}

const usersVotables = [3, 4, 5, 6]
