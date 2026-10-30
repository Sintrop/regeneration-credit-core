import { useSwitchChain as useSwitchChainHook } from 'wagmi'

interface ReturnUseSwitchChain {
  switchChain: () => Promise<void>
  isSuccess: boolean
}
export function useSwitchChain(): ReturnUseSwitchChain {
  const { switchChain: handleSwitch, isSuccess } = useSwitchChainHook()

  async function switchChain(): Promise<void> {
    handleSwitch({ chainId: 250225 })
  }

  return {
    switchChain,
    isSuccess
  }
}
