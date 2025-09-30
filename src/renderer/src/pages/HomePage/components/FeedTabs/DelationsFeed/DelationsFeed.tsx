import {
  sequoiaUserAbi,
  sequoiaUserAddress,
  userAbi,
  userAddress
} from '@renderer/services/contracts'
import { useTranslation } from 'react-i18next'
import { formatUnits } from 'viem'
import { useReadContract } from 'wagmi'
import { DelationItem } from '@renderer/components/DelationItem/DelationItem'
import { Loading } from '@renderer/components/Loading/Loading'
//import { useNavigate } from 'react-router-dom'
import { useMainnet } from '@renderer/hooks/useMainnet'

export function DelationsFeed(): JSX.Element {
  const { t } = useTranslation()
  const mainnet = useMainnet()
  //const navigate = useNavigate()

  const { data, isLoading } = useReadContract({
    address: mainnet ? userAddress : sequoiaUserAddress,
    abi: mainnet ? userAbi : sequoiaUserAbi,
    functionName: 'delationsCount'
  })

  let delationsIds: number[] = []

  if (data) {
    const count = parseInt(formatUnits(BigInt(data as string), 0))

    const ids = Array.from({ length: count }, (_, i) => i + 1)
    delationsIds = ids.reverse()
  }

  function handleGoToDelations(): void {
    //navigate('/development')
  }

  return (
    <div className="bg-card-2 rounded-2xl w-full">
      <div className="flex items-center justify-center h-10 border-b border-green-900 bg-card-1 rounded-t-2xl">
        <p className="text-sm text-green-1 mb-1">{t('feed.delations')}</p>
      </div>

      {isLoading ? (
        <div className="w-[500px] my-5 flex justify-center">
          <Loading />
        </div>
      ) : (
        <>
          {delationsIds.length === 0 ? (
            <div className="items-center my-10 w-[500px]">
              <p className="text-white text-center">{t('feed.noDelations')}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-5 w-full">
              {delationsIds.slice(0, 3).map((item) => (
                <DelationItem id={item} key={item} />
              ))}
            </div>
          )}

          {delationsIds.length > 3 && (
            <div className="flex items-center justify-center h-8 mt-3 border-t border-green-900 bg-card-1 rounded-b-2xl">
              <button
                className="text-green-500 underline hover:cursor-pointer text-start w-fit"
                onClick={handleGoToDelations}
              >
                {t('feed.seeMore')}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
