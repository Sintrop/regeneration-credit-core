import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAccount, useChainId, useReadContract } from 'wagmi'
import ImageRC from '@renderer/assets/images/rc.png'
import { FaEyeSlash, FaRegEye } from 'react-icons/fa'
import { format } from 'date-fns'
import { rcAbi, rcAddress, sequoiaRcAbi, sequoiaRcAddress } from '@renderer/services/contracts'
import { formatUnits } from 'viem'

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

  function toggleViewBalance(): void {
    setViewBalance((value) => !value)
  }

  const balance = data as string
  return (
    <div className="flex flex-col">
      <div className="flex flex-col w-[400px] rounded-2xl p-5 bg-green-800 relative">
        {isDisconnected && (
          <div className="flex flex-col absolute top-2 right-2">
            <p className="text-white">{t('myTokens.youAreNotConnected')}</p>
          </div>
        )}
        <p className="text-gray-300 text-sm">{t('myTokens.balance')}</p>

        <div className="flex items-center gap-2 my-5">
          <img src={ImageRC} className="w-10 h-10 object-contain" />
          <p className="font-bold text-white text-xl">RC</p>
        </div>

        <div className="flex items-center gap-5">
          <p className="font-bold text-white text-lg">
            {viewBalance ? (
              <>
                {balance
                  ? Intl.NumberFormat('pt-BR', { maximumFractionDigits: 5 }).format(
                      parseFloat(formatUnits(BigInt(balance), 18))
                    )
                  : '0,00000'}
              </>
            ) : (
              '**********'
            )}
          </p>

          <button onClick={toggleViewBalance} className="hover:cursor-pointer">
            {viewBalance ? (
              <FaRegEye color="white" size={25} />
            ) : (
              <FaEyeSlash color="white" size={25} />
            )}
          </button>
        </div>

        <p className="text-gray-300 text-xs mt-5">
          {t('myTokens.lastUpdate')}: {t('myTokens.today')} {format(new Date(), 'kk:mm')}
        </p>
      </div>
    </div>
  )
}
