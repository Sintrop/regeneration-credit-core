import { ScreenPage } from '@renderer/components/ScreenPage/ScreenPage'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAccount, useChainId, useReadContract } from 'wagmi'
import ImageRC from '@renderer/assets/images/rc.png'
import { FaEyeSlash, FaRegEye } from 'react-icons/fa'
import { format } from 'date-fns'
import { sequoiaRcAbi, sequoiaRcAddress } from '@renderer/services/contracts'
import { formatUnits } from 'viem'

export function MyTokensPage(): JSX.Element {
  const { t } = useTranslation()
  const { isConnected, isDisconnected, address } = useAccount()
  const chainId = useChainId()
  const [viewBalance, setViewBalance] = useState(false)
  const { data } = useReadContract({
    address: chainId === 1600 ? sequoiaRcAddress : sequoiaRcAddress,
    abi: chainId === 1600 ? sequoiaRcAbi : sequoiaRcAbi,
    functionName: 'balanceOf',
    args: [address]
  })

  function toggleViewBalance(): void {
    setViewBalance((value) => !value)
  }

  const balance = data as string

  return (
    <ScreenPage pageTitle={t('myTokens')}>
      {isDisconnected && (
        <div className="flex flex-col">
          <p className="text-white">{t('youAreNotConnected')}</p>
        </div>
      )}

      {isConnected && (
        <div className="flex flex-col">
          <div className="flex flex-col w-[400px] rounded-2xl p-5 bg-green-800">
            <p className="text-gray-300 text-sm">{t('myHeritageIn')}</p>

            <div className="flex items-center gap-2 my-5">
              <img src={ImageRC} className="w-10 h-10 object-contain" />
              <p className="font-bold text-white text-xl">RC</p>
            </div>

            <div className="flex items-center gap-5">
              <p className="font-bold text-white text-lg">
                {viewBalance ? (
                  <>
                    {balance &&
                      Intl.NumberFormat('pt-BR', { maximumFractionDigits: 5 }).format(
                        parseFloat(formatUnits(BigInt(balance), 18))
                      )}
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
              {t('lastUpdate')}: {t('today')} {format(new Date(), 'kk:mm')}
            </p>
          </div>

          <div className="flex flex-col mt-10">
            <p className="text-gray-300">{t('latestTransactions')}</p>
            <p className="text-white mt-5">list of transactions here</p>
          </div>
        </div>
      )}
    </ScreenPage>
  )
}
