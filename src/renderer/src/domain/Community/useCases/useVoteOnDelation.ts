import { useMainnet } from '@renderer/hooks/useMainnet'
import {
  sequoiaUserAbi,
  sequoiaUserAddress,
  userAbi,
  userAddress
} from '@renderer/services/contracts'
import { useWriteContract } from 'wagmi'

interface VoteOnDelationProps {
  delationId: number
  supportsDelation: boolean
}

interface ReturnUseVoteOnDelationProps {
  voteOnDelation: (data: VoteOnDelationProps) => void
  isPending: boolean
  isError: boolean
  error?: string
  hash?: `0x${string}`
}

export function useVoteOnDelation(): ReturnUseVoteOnDelationProps {
  const mainnet = useMainnet()
  const { data, isError, isPending, error, writeContract } = useWriteContract()

  function handleVote({ delationId, supportsDelation }: VoteOnDelationProps): void {
    writeContract({
      address: mainnet ? userAddress : sequoiaUserAddress,
      abi: mainnet ? userAbi : sequoiaUserAbi,
      functionName: 'voteOnDelation',
      args: [delationId, supportsDelation]
    })
  }

  return {
    isError,
    isPending,
    error: error?.message,
    hash: data,
    voteOnDelation: handleVote
  }
}
