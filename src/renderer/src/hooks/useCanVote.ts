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
import { useBlockNumber, useChainId, useReadContract } from 'wagmi'
import { useEra } from '@renderer/hooks/useEra'
import { formatUnits } from 'viem'

interface ReturnUseCanVote {
  isLoading: boolean
  canVote: boolean
  canVoteThisResource: boolean
  differentEra: boolean
  canVoteIn: number
}
interface Props {
  address: string
  resource: 'inspection' | 'report' | 'contribution' | 'research' | 'user'
  publishedEra: number
}
export function useCanVote({ address, publishedEra }: Props): ReturnUseCanVote {
  const { currentEra } = useEra()
  const chainId = useChainId()
  const [canVoteThisResource, setCanVoteThisResource] = useState<boolean>(false)
  const [differentEra, setDifferentEra] = useState<boolean>(false)
  const [canVoteIn, setCanVoteIn] = useState<number>(0)

  const { data: responseBlock } = useBlockNumber()
  const blockNumber = responseBlock ? parseInt(formatUnits(BigInt(responseBlock), 0)) : 0

  const { data: responseLastVote } = useReadContract({
    address: chainId === 250225 ? validationAddress : sequoiaValidationAddress,
    abi: chainId === 250225 ? validationAbi : sequoiaValidationAbi,
    functionName: 'validatorLastVoteAt',
    args: [address]
  })

  const lastVote = responseLastVote
    ? parseInt(formatUnits(BigInt(responseLastVote as string), 0))
    : 0

  useEffect(() => {
    const invitationDelay = parseInt(import.meta.env.VITE_INVITATION_DELAY_BLOCKS)
    const nextInviteBlock = lastVote + invitationDelay

    setCanVoteIn(nextInviteBlock - blockNumber)
  }, [blockNumber, lastVote])

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
  }, [userType, currentEra])

  function checkCanVoteThisResource(userType: number): void {
    const findedUserType = usersVotables.find((item) => item === userType)
    if (findedUserType) setCanVoteThisResource(true)

    if (publishedEra === currentEra) {
      setDifferentEra(false)
    } else {
      setDifferentEra(true)
    }
  }

  return {
    isLoading: loadingCanVote || loadingUser,
    canVote: canVote ? canVote : false,
    canVoteThisResource,
    differentEra,
    canVoteIn
  }
}

const usersVotables = [3, 4, 5, 6]
