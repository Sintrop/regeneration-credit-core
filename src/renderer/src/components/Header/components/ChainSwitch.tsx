import { JSX, useState } from 'react'
import { useAccount, useChainId, useSwitchChain } from 'wagmi'
import { FaChevronDown } from 'react-icons/fa'

import ImageCoin from '@renderer/assets/images/icon-chain.png'

export function ChainSwitch(): JSX.Element {
  const { switchChain } = useSwitchChain()
  const chainId = useChainId()
  const { status } = useAccount()
  const [showSelect, setShowSelect] = useState(false)

  function toggleShowSelect(): void {
    setShowSelect((value) => !value)
  }

  function handleSwitchChain(id: number): void {
    toggleShowSelect()
    switchChain({ chainId: id })
  }

  return (
    <div className="flex flex-col relative">
      <button
        className="w-[220px] px-4 h-10 rounded-2xl bg-card-1 text-white font-semibold hover:cursor-pointer flex items-center justify-between gap-3 disabled:cursor-default"
        onClick={toggleShowSelect}
        disabled={status === 'connected'}
      >
        <div className="flex items-center gap-2">
          {chainId === 250225 ? (
            <>
              <img src={ImageCoin} className="w-8 h-8 object-contain" />
              <p className="text-white font-semibold text-sm">Sintrop Mainnet</p>
            </>
          ) : (
            <>
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <p className="text-white">ST</p>
              </div>
              <p className="text-white font-semibold text-sm">Sequoia Testnet</p>
            </>
          )}
        </div>

        {status === 'disconnected' && <FaChevronDown color="white" />}
      </button>

      {showSelect && (
        <div className="absolute top-12 left-0 bg-card-1 w-[220px] p-4 rounded-2xl">
          <button
            className="flex items-center gap-2 p-2 border-b border-card-2 w-full hover:cursor-pointer hover:bg-card-3 duration-200"
            onClick={() => handleSwitchChain(250225)}
          >
            <img src={ImageCoin} className="w-8 h-8 object-contain" />
            <p className="text-white font-semibold text-sm">Sintrop Mainnet</p>
          </button>

          <button
            className="flex items-center gap-2 p-2 border-b border-card-2 w-full hover:cursor-pointer hover:bg-card-3 duration-200"
            onClick={() => handleSwitchChain(1600)}
          >
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <p className="text-white">ST</p>
            </div>
            <p className="text-white font-semibold text-sm">Sequoia Testnet</p>
          </button>
        </div>
      )}
    </div>
  )
}
