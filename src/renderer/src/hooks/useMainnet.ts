import { useChainId } from 'wagmi'

export function useMainnet(): boolean {
  const chainId = useChainId()
  return chainId === 250225
}
