import { useSwitchChain as useSwitchChainHook } from 'wagmi'
import { useMainnet } from './useMainnet'

interface ReturnUseSwitchChain {
  switchChain: () => Promise<void>
  isSuccess: boolean
}
export function useSwitchChain(): ReturnUseSwitchChain {
  const mainnet = useMainnet()

  const { switchChain: handleSwitch, isSuccess } = useSwitchChainHook()

  async function switchChain(): Promise<void> {
    handleSwitch({ chainId: mainnet ? 250225 : 1600 })
  }

  return {
    switchChain,
    isSuccess
  }
}
