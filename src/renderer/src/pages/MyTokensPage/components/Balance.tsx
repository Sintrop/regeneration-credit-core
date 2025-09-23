import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAccount, useBalance, useChainId, useReadContract } from 'wagmi'
import { FaEyeSlash, FaRegEye } from 'react-icons/fa'
import { format } from 'date-fns'
import { formatUnits } from 'viem'

import { rcAbi, rcAddress, sequoiaRcAbi, sequoiaRcAddress } from '@renderer/services/contracts'

import ImageRC from '@renderer/assets/images/rc.png'
import ImageSIN from '@renderer/assets/images/icon-chain.png'

export function Balance(): JSX.Element {
  const { t } = useTranslation()
  const { isDisconnected, address } = useAccount()
  const chainId = useChainId()
  const [viewBalance, setViewBalance] = useState(false)
  const { data } = useReadContract({
    address: chainId === 250225 ? rcAddress : sequoiaRcAddress,
    abi: chainId === 250225 ? rcAbi : sequoiaRcAbi,
    functionName: 'balanceOf',
    args: [address]
  })

  const { data: resSinBalance } = useBalance({ address })

  function toggleViewBalance(): void {
    setViewBalance((value) => !value)
  }

  const rcBalance = data ? parseFloat(formatUnits(BigInt(data as string), 18)) : 0
  return (
    <div className="flex flex-col">
      <div className="flex flex-col w-[400px] rounded-2xl p-5 bg-green-800 relative gap-5">
        {isDisconnected && (
          <div className="flex flex-col absolute top-2 right-2">
            <p className="text-white">{t('myTokens.youAreNotConnected')}</p>
          </div>
        )}

        <button
          onClick={toggleViewBalance}
          className="hover:cursor-pointer absolute right-2 top-10"
        >
          {viewBalance ? (
            <FaRegEye color="white" size={25} />
          ) : (
            <FaEyeSlash color="white" size={25} />
          )}
        </button>
        <p className="text-gray-300 text-sm">{t('myTokens.balance')}</p>

        <div className="flex items-center gap-3">
          <img src={ImageRC} className="w-8 h-8 object-contain" />
          <p className="font-bold text-white text-lg">
            {viewBalance
              ? Intl.NumberFormat('pt-BR', { maximumFractionDigits: 5 }).format(rcBalance)
              : '**********'}
          </p>
          <p className="font-bold text-white text-xl">RC</p>
        </div>

        <div className="flex items-center gap-3">
          <img src={ImageSIN} className="w-8 h-8 object-contain" />
          <p className="font-bold text-white text-lg">
            {viewBalance ? resSinBalance?.formatted : '**********'}
          </p>
          <p className="font-bold text-white text-xl">SIN</p>
        </div>

        <p className="text-gray-300 text-xs mt-5">
          {t('myTokens.lastUpdate')}: {t('myTokens.today')} {format(new Date(), 'kk:mm')}
        </p>
      </div>
    </div>
  )
}
