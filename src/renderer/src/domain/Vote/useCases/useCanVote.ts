import { useMainnet } from '@renderer/hooks/useMainnet'

interface ReturnCanVoteProps {
  canVote: boolean
}
export function useCanVote(): ReturnCanVoteProps {
  const mainnet = useMainnet()
  return {
    canVote: false
  }
}
