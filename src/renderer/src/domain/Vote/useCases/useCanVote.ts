import {
  validationAbi,
  validationAddress,
  voteAbi,
  voteAddress
} from '@renderer/services/contracts'
import { formatUnits } from 'viem'
import { useAccount, useBlockNumber, useReadContract } from 'wagmi'

interface ReturnCanVoteProps {
  canVoteNow: boolean
  isVoter: boolean
  canVoteBlocks: number
}
export function useCanVote(): ReturnCanVoteProps {
  const { address } = useAccount()
  const { data: responseCanVote } = useReadContract({
    address: voteAddress,
    abi: voteAbi,
    functionName: 'canVote',
    args: [address]
  })

  const isVoter = responseCanVote ? (responseCanVote as boolean) : false

  const { data: responseTime } = useReadContract({
    address: validationAddress,
    abi: validationAbi,
    functionName: 'timeBetweenVotes'
  })
  const timeBetweenVotes = responseTime
    ? parseInt(formatUnits(BigInt(responseTime as string), 0))
    : 0

  const { data: responseLastVote } = useReadContract({
    address: validationAddress,
    abi: validationAbi,
    functionName: 'validatorLastVoteAt'
  })
  const lastVote = responseLastVote
    ? parseInt(formatUnits(BigInt(responseLastVote as string), 0))
    : 0

  const { data: responseBlock } = useBlockNumber()
  const blockNumber = responseBlock ? parseInt(formatUnits(responseBlock, 0)) : 0

  const canVoteBlocks = lastVote + timeBetweenVotes - blockNumber

  return {
    canVoteBlocks,
    canVoteNow: canVoteBlocks < 0,
    isVoter
  }
}
